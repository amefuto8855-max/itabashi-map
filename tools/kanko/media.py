"""東京23区の観光スポットに、写真（ウィキメディア・コモンズ）と説明（ウィキペディアの冒頭3文）を付ける

使い方: python media.py <元データのフォルダ> <kanko.json> <出力する kanko_more.json>

- 読むのは、ウィキペディアとウィキメディア・コモンズの記事のページ（/wiki/…）だけ。robots.txt で許されていないページは読まない。
- 1ページ読むごとに1秒あける。前回集めたもの（kanko-src ブランチの media.json）を使い、まだないものだけを読む。
- 時間がかかりすぎるときは途中でやめ、残りは次の回に読む。
- 写真は、記事の情報欄（なければ冒頭の図）の最初の写真（JPEG）。ロゴ・地図・図面らしい名前のものと、小さいものは使わない。
"""
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser

from bs4 import BeautifulSoup

RAW, KJSON, OUT = sys.argv[1:4]
UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
PREV = "https://raw.githubusercontent.com/amefuto8855-max/itabashi-map/kanko-src/media.json"
WP_HOST, CM_HOST, UP_HOST = "https://ja.wikipedia.org", "https://commons.wikimedia.org", "https://upload.wikimedia.org"
JST = datetime.timezone(datetime.timedelta(hours=9))
TODAY = datetime.datetime.now(JST).date()
WAIT = 1.0  # 1ページごとにあける秒数
BUDGET = 40 * 60  # 読む時間の上限（秒）
RETRY_NG_DAYS = 30  # 読めなかったものを読み直すまでの日数
T0 = time.time()
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s, flush=True)
    LOG.append(s)


def get(url, tries=3, timeout=60, method="GET"):
    last = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ja"}, method=method)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read(), r.status
        except urllib.error.HTTPError as e:
            if e.code in (403, 404, 410):
                return None, e.code
            last = e
            ra = e.headers.get("Retry-After", "") if e.code in (429, 503) else ""
            time.sleep(max(int(ra) if ra.isdigit() else 0, 5 * (k + 1)))
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(5 * (k + 1))
    raise RuntimeError("取得できませんでした: %s %r" % (url, last))


def robots(host):
    try:
        raw, st = get(host + "/robots.txt", tries=2, timeout=30)
    except Exception as e:  # noqa: BLE001
        log("robots.txt を読めませんでした", host, repr(e)[:120])
        return None
    rp = urllib.robotparser.RobotFileParser()
    rp.parse((raw or b"").decode("utf-8", "replace").splitlines())
    return rp


# ---- ウィキペディアの記事 ----
PV = 2  # 読み取り方の版。変えたら、前回の結果を読み直す
COMMONS_SRC = re.compile(r"//(?:upload|thumb)\.wikimedia\.org/wikipedia/commons/(thumb/)?([0-9a-f])/([0-9a-f]{2})/([^/?#\s]+)(?:/(\d+)px-([^/?#\s]+))?")
NOT_PHOTO = re.compile(r"logo|ロゴ|(?<![a-z])(?:map|plan|sign|seal|icon|chart)(?![a-z])|地図|位置|location|locator|emblem|紋章|flag|旗|symbol|マーク|"
                       r"配置|平面|断面|路線|案内図|diagram|アイコン", re.I)
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")


def pick_img(box):
    for img in box.find_all("img"):
        srcs = [img.get("src", "")] + [s.strip().split(" ")[0] for s in img.get("srcset", "").split(",") if s.strip()]
        ms = [m for m in (COMMONS_SRC.search(s) for s in srcs) if m]
        if not ms:
            continue
        seg = ms[0].group(4)
        name = urllib.parse.unquote(seg)
        if not re.search(r"\.jpe?g$", name, re.I) or NOT_PHOTO.search(name):
            continue
        try:
            w, h = int(img.get("data-file-width", 0)), int(img.get("data-file-height", 0))
        except ValueError:
            continue
        if w < 500 or h < 300:
            continue
        thumbs = [(int(m.group(5)), m.group(6)) for m in ms if m.group(1) and m.group(5)]
        r = {"d": ms[0].group(3), "s": seg, "w": w, "h": h}
        if thumbs:
            fw, tn = max(thumbs)
            r["fw"] = fw  # 記事で使われている大きさ（読み込めることがわかっている大きさ）
            if tn != seg:
                r["tn"] = tn  # 長い名前のとき、縮小画像の名前は「thumbnail.jpg」になる
        return r
    return None


def clean_text(el):
    for bad in el.select("sup.reference, sup.noprint, .Inline-Template, .noprint, style, script, .mw-ref, #coordinates, .geo-default, .geo-nondefault, .mw-editsection"):
        bad.decompose()
    for s in el.find_all("sup"):
        tx = s.get_text("")
        s.replace_with(tx.translate(SUP) if tx.isdigit() else tx)
    t = el.get_text("")
    t = re.sub(r"\[(?:\d+|注釈? ?\d+|要出典|要検証|要説明|要曖昧さ回避|いつ\?|誰\?|どこ\?|疑問点)[^\]]*\]", "", t)
    t = re.sub(r"[ \t]*\n[ \t]*", "", t)
    return tidy(t)


def tidy(t):
    """空のかっこ（読み仮名などを取りのぞいたあと）と、続いた空白をのぞく"""
    t = re.sub(r"（[\s、,]*）|\([\s,]*\)", "", t)
    return re.sub(r"\s{2,}", " ", t).strip()


CREDIT_CUT = re.compile(r"\s+(?:Alternative names|Description|Location of birth|Location of death|Date of birth|Date of death|"
                        r"Work location|Work period|Authority file|Birth name|Native name|Sister projects)\b.*$", re.S)


def clean_credit(a):
    """撮影者・作者の欄から、名前のあとに続く作者の紹介（Creator のひな形）をのぞく"""
    a = CREDIT_CUT.sub("", re.sub(r"\s+", " ", a or "")).strip()
    a = re.sub(r"\s*\(\s*fl\.[^)]*\)", "", a).strip(" :;,")
    return a if len(a) <= 80 else a[:79] + "…"


def parse_article(raw):
    soup = BeautifulSoup(raw, "html.parser")
    root = soup.select_one("#mw-content-text .mw-parser-output") or soup.select_one(".mw-parser-output")
    if root is None:
        return {"ng": "本文が見つからない"}
    # 今のウィキペディアは、見出しごとに <section> で包まれている（冒頭は data-mw-section-id="0"）
    sec0 = root.find("section", attrs={"data-mw-section-id": "0"}, recursive=False)
    paras, box_img, fig_img = [], None, None
    for el in (sec0 if sec0 is not None else root).find_all(recursive=False):
        cls = el.get("class") or []
        if el.name in ("h2", "h3", "section") or "mw-heading" in cls:
            break  # 最初の見出しまでが冒頭
        if el.name == "p":
            t = clean_text(el)
            if t:
                paras.append(t)
            continue
        box = el if any("infobox" in c for c in cls) else el.find(class_=re.compile("infobox"))
        if box is not None:
            if box_img is None:
                box_img = pick_img(box)
        elif fig_img is None and (el.name == "figure" or "thumb" in cls or el.find("figure") is not None):
            fig_img = pick_img(el)
    text = ""
    for p in paras:
        if len(text) > 1500:
            break
        text += p
    r = {"p": text}
    img = box_img or fig_img
    if img:
        r["img"] = img
    return r


# ---- ウィキメディア・コモンズの写真のページ（撮影者と使用条件） ----
def lic_rank(short):
    s = short.lower()
    if re.match(r"cc0|public domain|pd\b|pd-", s):
        return 0
    if re.match(r"cc[ -]by[ -]sa", s):
        return 2
    if re.match(r"cc[ -]by\b", s) or s.startswith("attribution"):
        return 1
    return 9  # GFDL だけのものなどは使わない


def parse_commons(raw):
    soup = BeautifulSoup(raw, "html.parser")
    best = None
    for blk in soup.select(".licensetpl"):
        def f(c):
            e = blk.select_one("." + c)
            return e.get_text(" ", strip=True) if e is not None else ""
        if f("licensetpl_nonfree").lower() == "true":
            return {"ng": "自由に使えない"}
        short = f("licensetpl_short")
        if not short:
            continue
        r = lic_rank(short)
        if best is None or r < best[0]:
            best = (r, short, f("licensetpl_link"), f("licensetpl_attr"))
    if best is None or best[0] >= 9:
        return {"ng": "使用条件が合わない"}
    author = ""
    th = soup.select_one("#fileinfotpl_aut")
    td = th.find_next_sibling("td") if th is not None else None
    if td is not None:
        for bad in td.select("style, script, .noprint"):
            bad.decompose()
        cr = td.select_one("#creator")  # Creator のひな形のときは、名前の部分だけ
        author = (cr if cr is not None else td).get_text(" ", strip=True)
    if not (best[3] or author):
        # 作者の欄がないページは、最初に投稿した人を「投稿者」として出す
        rows = soup.select("table.filehistory tr")
        u = rows[-1].select_one(".mw-userlink") if len(rows) > 1 else None
        if u is not None and u.get_text(strip=True):
            author = "投稿者 " + u.get_text(strip=True)
    if not (best[3] or author):
        return {"ng": "作者がわからない"}
    credit = clean_credit(best[3] or author)
    link = best[2] if best[2].startswith("http") else ""
    return {"l": best[1], "u": link, "a": credit}


# ---- 説明：冒頭から3文 ----
OPEN, CLOSE = "（(「『【［[〔〈《", "）)」』】］]〕〉》"


def first_sentences(text, n=3):
    out, cur, depth = [], "", 0
    for ch in text:
        cur += ch
        if ch in OPEN:
            depth += 1
        elif ch in CLOSE:
            depth = max(0, depth - 1)
        elif ch == "。" and depth == 0:
            out.append(cur)
            cur = ""
            if len(out) >= n:
                break
    if len(out) < n and cur.strip():
        out.append(cur)
    return "".join(out).strip()


def main():
    with open(KJSON, encoding="utf-8") as f:
        K = json.load(f)
    want = {}  # 場所のid → ウィキペディアの記事名
    for o in K.get("items", []):
        if o.get("wp"):
            want[o["i"]] = o["wp"]
    for s in K.get("same", []):
        if len(s) >= 3 and s[2]:
            want[s[0]] = s[2]
    log("写真と説明を付ける場所", len(want), "（記事", len(set(want.values())), "）")

    cache = {"v": 1, "wp": {}, "cm": {}}
    try:
        raw, st = get(PREV, tries=2, timeout=60)
        c = json.loads(raw) if raw else {}
        if c.get("v") == 1:
            cache = c
        log("前回のものを使う：記事", len(cache["wp"]), "／写真", len(cache["cm"]))
    except Exception as e:  # noqa: BLE001
        log("前回のものはありません", repr(e)[:100])
    cache["note"] = ("ウィキペディア日本語版の記事の冒頭（CC BY-SA 4.0、https://creativecommons.org/licenses/by-sa/4.0/）と、"
                     "ウィキメディア・コモンズの写真の撮影者・使用条件を、記事のページから集めたもの")

    def need(e):
        if not e or e.get("pv") != PV:
            return True
        if "ng" in e:
            try:
                return (TODAY - datetime.date.fromisoformat(e.get("at", ""))).days >= RETRY_NG_DAYS
            except ValueError:
                return True
        return False

    def save_cache():
        with open(os.path.join(RAW, "media.json"), "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, separators=(",", ":"), sort_keys=True)

    def crawl(kind, keys, rp, url_of, parse):
        n = ng = 0
        if rp is None:
            log(kind, "：robots.txt を読めなかったので、今回は読まない")
            return
        for i, key in enumerate(keys):
            if not need(cache[kind].get(key)):
                continue
            if time.time() - T0 > BUDGET:
                log(kind, "：時間の上限になったので、残りは次の回に読む")
                break
            url = url_of(key)
            if not rp.can_fetch(UA, url):
                log(kind, "：robots.txt で許されていないので読まない", url)
                cache[kind][key] = {"at": TODAY.isoformat(), "ng": "robots"}
                continue
            try:
                raw, st = get(url)
            except Exception as e:  # noqa: BLE001
                log(kind, "：読めませんでした", key, repr(e)[:120])
                time.sleep(WAIT)
                continue
            try:
                r = parse(raw) if raw else {"ng": "HTTP %d" % st}
            except Exception as e:  # noqa: BLE001
                log(kind, "：ページの形が読み取れませんでした", key, repr(e)[:120])
                r = {"ng": "形が読み取れない"}
            r["at"], r["pv"] = TODAY.isoformat(), PV
            cache[kind][key] = r
            n += 1
            ng += "ng" in r
            if n % 100 == 0:
                save_cache()
                log(kind, "：", n, "ページ読んだ")
            time.sleep(WAIT)
        log(kind, "：読んだページ", n, "（使えなかったもの", ng, "）")

    titles = sorted(set(want.values()))
    crawl("wp", titles, robots(WP_HOST),
          lambda t: WP_HOST + "/wiki/" + urllib.parse.quote(t.replace(" ", "_"), safe=";@$!*(),/~:"), parse_article)
    tset = set(titles)
    files = sorted({e["img"]["s"] for t, e in cache["wp"].items() if t in tset and e.get("img")})
    crawl("cm", files, robots(CM_HOST), lambda s: CM_HOST + "/wiki/File:" + s, parse_commons)
    save_cache()

    more = {}
    for iid, t in sorted(want.items()):
        e = cache["wp"].get(t) or {}
        x = {"w": t}
        d = first_sentences(tidy(e.get("p", "")))
        if d:
            x["d"] = d
        im = e.get("img")
        c = cache["cm"].get(im["s"]) if im else None
        if im and c and c.get("l") and clean_credit(c.get("a")):
            x["p"] = [im["d"], im["s"], im["w"], im["h"], clean_credit(c["a"]), c["l"], c.get("u", ""), im.get("fw", 0)] + ([im["tn"]] if im.get("tn") else [])
        if len(x) > 1:
            more[iid] = x
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"v": 1, "made": TODAY.isoformat(), "items": more}, f, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    n_p = sum(1 for x in more.values() if "p" in x)
    n_d = sum(1 for x in more.values() if "d" in x)
    log("kanko_more.json：写真", n_p, "／説明", n_d, "／場所", len(want), "／", os.path.getsize(OUT) // 1024, "KB")

    # 確かめ用：いくつかの例と、縮小画像が読み込めるか（robots.txt で許されているときだけ）
    samples = [(iid, x) for iid, x in more.items() if "p" in x][:3]
    for iid, x in [(iid, x) for iid, x in more.items() if "d" in x][:5]:
        log("例", iid, x["w"], "：", x["d"][:120])
    rp_up = robots(UP_HOST)
    for iid, x in samples:
        p = x["p"]
        dir_ = p[0][0] + "/" + p[0] + "/"
        for w in (500, 960):
            if w >= p[2]:
                continue
            url = UP_HOST + "/wikipedia/commons/thumb/" + dir_ + p[1] + "/" + str(w) + "px-" + (p[8] if len(p) > 8 else p[1])
            if rp_up is None or not rp_up.can_fetch(UA, url):
                log("縮小画像の確認は、robots.txt で許されていないのでしない")
                break
            try:
                _, st = get(url, tries=1, timeout=30, method="HEAD")
                log("縮小画像", w, "px：", st, url)
            except Exception as e:  # noqa: BLE001
                log("縮小画像", w, "px：読めない", url, repr(e)[:80])
            time.sleep(WAIT)
        log("写真の例", iid, p[1], p[2], "x", p[3], "／", p[4], "／", p[5])
    with open(os.path.join(RAW, "media_log.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(LOG) + "\n")


if __name__ == "__main__":
    main()
