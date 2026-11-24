"""板橋区の飲食店の元データを集める（GitHub Actions で動かす）。

  python fetch.py <出力フォルダ>

集めるもの
  osm.json        OpenStreetMap（Overpass API）の板橋区の飲食店（ODbL）
  kyoka/rows.json 板橋区「食品営業許可施設一覧」の月ごとの表（屋号・所在地・営業の種類・許可年月日などだけ）
  mhlw/rows.json  厚生労働省「食品衛生申請等システム」のオープンデータ（板橋区分。同じく必要な列だけ）
  ※ 営業者・申請者の名前、許可番号、電話番号などの列は、ここには残さない（公開ブランチに置くため）
  geocode.json    許可一覧などの住所 → 緯度・経度（国土地理院の住所検索）
  log.txt         取得の記録
"""
import csv
import html
import io
import json
import os
import re
import sys
import time
import traceback
import unicodedata
import urllib.parse
import urllib.request

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
KYOKA = "https://www.city.itabashi.tokyo.jp/kenko/eisei/shokuhin/1051220.html"
MHLW = "https://ifas.mhlw.go.jp/faspub/_link.do"
OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
GSI = "https://msearch.gsi.go.jp/address-search/AddressSearch?q="
ITA_CODES = ("131199", "13119")
OUT = None
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    LOG.append(s)
    print(s, flush=True)


def save(name, data, binary=False):
    p = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    if binary:
        with open(p, "wb") as f:
            f.write(data)
    else:
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=0)


def get(url, data=None, headers=None, tries=4, timeout=120):
    h = {"User-Agent": UA}
    h.update(headers or {})
    err = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=h)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read(), r.geturl(), r.headers.get("Content-Type", "")
        except urllib.error.HTTPError as e:
            err = "%s %s" % (e, e.read()[:200])
            if e.code in (400, 403, 404):
                break
            time.sleep(10 * (k + 1))
        except Exception as e:  # noqa: BLE001
            err = repr(e)
            time.sleep(10 * (k + 1))
    raise RuntimeError("取得できませんでした: %s %s" % (url[:200], err))


# ---- OpenStreetMap ----
OSM_Q = """[out:json][timeout:240];
area["name"="板橋区"]["boundary"="administrative"]["admin_level"="7"]->.a;
(
  nwr(area.a)["amenity"~"^(restaurant|fast_food|cafe|bar|pub|food_court|ice_cream|biergarten)$"];
  nwr(area.a)["shop"~"^(deli)$"];
);
out center tags;"""


def fetch_osm():
    for ep in OVERPASS:
        try:
            raw, _, _ = get(ep, data=urllib.parse.urlencode({"data": OSM_Q}).encode(), timeout=300)
            j = json.loads(raw)
            save("osm.json", j)
            log("OpenStreetMap", len(j.get("elements", [])), "件", ep)
            return
        except Exception as e:  # noqa: BLE001
            log("OpenStreetMap の取得に失敗", ep, repr(e)[:200])


# ---- 板橋区の食品営業許可施設一覧 ----
def links(page_html, base):
    out = []
    for m in re.finditer(r'<a\s[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page_html, re.S | re.I):
        out.append((urllib.parse.urljoin(base, html.unescape(m.group(1))), re.sub(r"<[^>]+>", "", m.group(2)).strip()))
    return out


# 公開してよい列（名前にこの言葉をふくむ列だけ残す）と、残さない列
KEEP_COL = re.compile(r"申請種別|区分|許可年月日|年月日|期限|満了|有効|屋号|商号|施設の名称|施設名|名称|所在地|住所|営業の種類|業種|主として|取扱|業態|形態|自治体|市区町村")
DROP_COL = re.compile(r"氏名|申請者|営業者|代表|法人|生年月日|電話|FAX|ファクス|ファックス|メール|番号|責任者|担当")


def keep_cols(rows):
    """見出しの行を探し、公開してよい列だけの表にする"""
    for hi, r in enumerate(rows[:15]):
        if sum(1 for c in r if KEEP_COL.search(str(c))) >= 2:
            break
    else:
        return [], []
    head = [re.sub(r"\s+", "", unicodedata.normalize("NFKC", str(c))) for c in rows[hi]]
    idx = [i for i, h in enumerate(head) if h and KEEP_COL.search(h) and not DROP_COL.search(h)]
    out = []
    for r in rows[hi + 1:]:
        cells = [str(r[i]).strip() if i < len(r) else "" for i in idx]
        if any(cells):
            out.append(cells)
    return [head[i] for i in idx], out


def fetch_kyoka():
    raw, url, _ = get(KYOKA)
    page = raw.decode("utf-8", "replace")
    save("kyoka/page.html", raw, binary=True)
    tables = []
    for href, text in links(page, url):
        if re.search(r"\.(xlsx?|csv)$", href.split("?")[0], re.I):
            try:
                data, _, _ = get(href)
                tmp = os.path.join(OUT, "_tmp" + os.path.splitext(href.split("?")[0])[1])
                with open(tmp, "wb") as f:
                    f.write(data)
                head, rows = keep_cols(read_rows(tmp))
                os.remove(tmp)
                tables.append({"title": text, "url": href, "head": head, "rows": rows})
                log("  ", text, len(rows), "行", head)
            except Exception as e:  # noqa: BLE001
                log("  許可一覧のファイルを取れませんでした", href, repr(e)[:200])
            time.sleep(1)
    save("kyoka/rows.json", tables)
    log("板橋区の許可一覧", len(tables), "ファイル")


# ---- 厚生労働省 食品衛生申請等システムのオープンデータ ----
def fetch_mhlw():
    seen, queue, n, got = set(), [(MHLW, 0)], 0, []
    while queue and n < 40:
        url, depth = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            raw, final, ctype = get(url, tries=2, timeout=180)
        except Exception as e:  # noqa: BLE001
            log("  厚労省のページを取れませんでした", url, repr(e)[:200])
            continue
        n += 1
        low = final.lower().split("?")[0]
        if "csv" in ctype.lower() or low.endswith((".csv", ".zip")):
            name = final.rsplit("/", 1)[-1].split("?")[0] or "data.csv"
            if low.endswith(".zip"):
                import zipfile
                zf = zipfile.ZipFile(io.BytesIO(raw))
                raw = b"".join(zf.read(n) for n in zf.namelist() if n.lower().endswith(".csv"))
            rows = []
            for enc in ("utf-8-sig", "cp932"):
                try:
                    rows = list(csv.reader(io.StringIO(raw.decode(enc))))
                    break
                except UnicodeDecodeError:
                    continue
            allhead = rows[0] if rows else []
            head, kept = keep_cols(rows)
            got.append({"file": name, "url": final, "bytes": len(raw), "all_columns": allhead, "head": head, "rows": kept})
            log("  厚労省のファイル", name, len(raw), "バイト", len(kept), "行", head)
            continue
        text = raw.decode("utf-8", "replace") if b"charset=shift_jis" not in raw[:2000].lower() else raw.decode("cp932", "replace")
        save("mhlw/page%02d.html" % n, raw, binary=True)
        log("  厚労省のページ", n, final[:160], len(raw))
        for href, label in links(text, final):
            if "ifas.mhlw.go.jp" not in href or href in seen:
                continue
            fn = href.rsplit("/", 1)[-1].lower()
            if "food_business" in fn or fn.endswith((".csv", ".zip")):
                if any(c in fn for c in ITA_CODES) or "板橋" in label:
                    queue.insert(0, (href, depth + 1))
                continue
            if depth < 3 and re.search(r"opendata|open_data|オープンデータ|download|ダウンロード|東京|13", href + " " + label, re.I):
                queue.append((href, depth + 1))
    save("mhlw/rows.json", got)
    log("厚労省のオープンデータ", len(got), "ファイル／たどったページ", n)


# ---- 住所 → 緯度・経度（国土地理院） ----
KANJI = {c: i for i, c in enumerate("〇一二三四五六七八九")}


def kanji_num(s):
    if "十" in s:
        a, _, b = s.partition("十")
        return (KANJI.get(a, 1) if a else 1) * 10 + (KANJI.get(b, 0) if b else 0)
    return int("".join(str(KANJI[c]) for c in s))


def norm_addr(a):
    """住所を「板橋区〇〇1-2-3」の形にそろえ、建物名や部屋番号をのぞく"""
    a = unicodedata.normalize("NFKC", a or "")
    a = re.sub(r"[－‐−―ｰ]", "-", a)
    a = re.sub(r"\s+", "", a)
    a = re.sub(r"^東京都", "", a)
    a = re.sub(r"([〇一二三四五六七八九十]+)丁目", lambda m: "%d-" % kanji_num(m.group(1)), a)
    a = re.sub(r"(\d+)丁目", r"\1-", a)
    a = re.sub(r"(\d+)番地?", r"\1-", a)
    a = re.sub(r"(\d+)号", r"\1", a)
    m = re.match(r"^(板橋区\D+?\d+(?:-\d+){0,3})", a)
    return m.group(1).rstrip("-") if m else ""


def read_rows(path):
    with open(path, "rb") as f:
        data = f.read()
    if path.lower().endswith(".csv"):
        for enc in ("utf-8-sig", "cp932"):
            try:
                return list(csv.reader(io.StringIO(data.decode(enc))))
            except UnicodeDecodeError:
                continue
        return []
    import openpyxl
    wb = openpyxl.load_workbook(io.BytesIO(data), read_only=True, data_only=True)
    rows = []
    for ws in wb.worksheets:
        rows += [["" if c is None else str(c) for c in r] for r in ws.iter_rows(values_only=True)]
    return rows


def fetch_geocode():
    addrs = set()
    for sub in ("kyoka", "mhlw"):
        p = os.path.join(OUT, sub, "rows.json")
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8") as f:
            tables = json.load(f)
        for t in tables:
            for r in t["rows"]:
                if "飲食店" not in " ".join(r):
                    continue
                for c in r:
                    if "板橋区" in c:
                        a = norm_addr(c)
                        if a:
                            addrs.add(a)
    log("住所", len(addrs), "件を緯度・経度にする")
    out = {}
    for i, a in enumerate(sorted(addrs)):
        try:
            raw, _, _ = get(GSI + urllib.parse.quote("東京都" + a), tries=3, timeout=30)
            res = json.loads(raw)
            hit = next((r for r in res if r.get("properties", {}).get("title", "").startswith("東京都板橋区")), None)
            if hit:
                lng, lat = hit["geometry"]["coordinates"]
                out[a] = [round(lat, 6), round(lng, 6), hit["properties"]["title"]]
        except Exception as e:  # noqa: BLE001
            log("  住所を調べられませんでした", a, repr(e)[:120])
        time.sleep(0.5)
        if i % 200 == 0:
            log("  ", i, "/", len(addrs))
    save("geocode.json", out)
    log("緯度・経度", len(out), "件")


def main():
    global OUT
    OUT = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    t0 = time.time()
    for name, fn in (("OpenStreetMap", fetch_osm), ("許可一覧", fetch_kyoka), ("厚労省", fetch_mhlw), ("住所", fetch_geocode)):
        try:
            fn()
        except Exception:  # noqa: BLE001
            log(name + "の取得でエラー\n" + traceback.format_exc())
    log("かかった時間", int(time.time() - t0), "秒")
    with open(os.path.join(OUT, "log.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(LOG) + "\n")


if __name__ == "__main__":
    main()
