"""板橋区の飲食店：集めた元データ（food-src）から、地図にまだない店を選んで food_new.json を作る。

  python build.py <元データのフォルダ> <今の飲食店データ food_data.json> <Wikidata の項目 items.json> <種類 classes.json> <出力 food_new.json>

- 元データ：OpenStreetMap（ODbL）、板橋区「食品営業許可施設一覧」、厚生労働省「食品衛生申請等システム」のオープンデータ
- 飲食店営業の許可でも、給食・病院・学校・会社の食堂・店の中の売場・イベント・キッチンカーなどはのぞく
- 地図にすでにある店（名前が同じか片方を含み、近い所にあるもの）は足さない
"""
import collections
import datetime
import functools
import hashlib
import json
import math
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rules  # noqa: E402

try:
    import pykakasi  # 名前をローマ字にして、英字の名前の店と比べる（pip install pykakasi）
    KKS = pykakasi.kakasi()
except ImportError:
    KKS = None

RAW, FOOD, WD_ITEMS, WD_CLASSES, OUT = sys.argv[1:6]
TODAY = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).date().isoformat()


def load(p, default=None):
    if not os.path.exists(p):
        return default
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def meters(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(h))


def clean_name(s):
    s = rules.norm(s)
    s = re.sub(r"[\ue000-\uf8ff]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def nk(s):
    """名前を比べる形：かっこ・空白・記号・会社の種類・「〇〇店」をのぞく"""
    s = unicodedata.normalize("NFKC", s or "").lower()
    s = re.sub(r"(株式会社|有限会社|合同会社|\(株\)|\(有\))", "", s)
    s = re.sub(r"[(\[【「『][^)\]】」』]*[)\]】」』]", " ", s)
    s = re.sub(r"[\s・･\-‐－―〜~、。,.'’\"”“!！?？&＆/／]", "", s)
    return s.replace("ヶ", "ケ").replace("ケ", "が")


BRANDS = set()  # チェーンの名前（nk の形）。main() で今の地図とOpenStreetMapから足す
BRAND_K = set()  # 同じチェーンの名前を、かなの書き方の差をなくした形で


def base_name(s):
    """支店名（「〇〇店」）をのぞいた名前"""
    t = unicodedata.normalize("NFKC", s or "").strip()
    parts = re.split(r"\s+", t)
    if len(parts) >= 2 and parts[-1].endswith("店"):
        return nk(" ".join(parts[:-1]))
    x = nk(t)
    for b in sorted(BRANDS, key=len, reverse=True):
        if x.startswith(b) and x != b and x.endswith("店"):
            return b
    return x


# ---- 名前を比べる ----
VARIANT = str.maketrans({"髙": "高", "﨑": "崎", "舘": "館", "洲": "州", "己": "巳", "已": "巳", "邊": "辺", "邉": "辺", "澤": "沢",
                         "濱": "浜", "濵": "浜", "齋": "斎", "齊": "斉", "國": "国", "龍": "竜", "瀧": "滝", "藏": "蔵", "惠": "恵",
                         "眞": "真", "櫻": "桜", "團": "団", "ヶ": "ケ", "ヵ": "カ"})
SMALL = str.maketrans("ぁぃぅぇぉっゃゅょゎゕゖ", "あいうえおつやゆよわかけ")
# 店の種類をあらわす言葉。名前を比べるときはのぞく
GENERIC = re.compile("|".join(sorted(map(re.escape, (
    "創作居酒屋 大衆酒場 居酒屋 酒場 立ち飲み 立飲み 立呑み 炭火串焼き 七輪炭火焼肉 炭火焼肉 炭火焼き 炭火 串焼き 串揚げ 串カツ 焼き鳥専科 焼き鳥 焼鳥"
    " やきとり 焼肉 焼き肉 月島もんじゃ もんじゃ焼き もんじゃ お好み焼き 鉄板焼き ステーキ ハンバーグ とんかつ 本格スパイスカレー スパイスカレー"
    " カレー屋 カレー 本場のインド料理 インド料理 インドレストラン ネパール料理 タイ料理 韓国料理 中華料理 中国料理 中華食堂 中華そば 中華 餃子酒場"
    " 餃子 横浜ラーメン 横浜らーめん 東京ラーメン ラーメン らーめん らあめん つけ麺 つけめん めんや 麺屋 麺処 めん処 寿司 すし 鮨 そば処 そば 蕎麦"
    " うどん処 うどん 定食 食堂 弁当 キッチン ダイニング レストラン イタリアン ビストロ カフェ 喫茶 珈琲 コーヒー ベーカリー スナック すなっく パブ 東京"
    " ramen shop dining restaurant kitchen cafe thai indian nepali curry sushi chuka tokyo izakaya sakaba halal foods food").split()),
    key=len, reverse=True)))
PLACE_TAIL = [None]  # 「〇〇大山店」の「大山店」を見つける。main() で町名と駅名から作る


def light(s):
    """比べる前の形：全角・半角、英字の大小、アクセント記号、字の形、会社の種類、丁目の漢数字をそろえる"""
    s = unicodedata.normalize("NFKC", s or "").lower().translate(VARIANT)
    s = re.sub(r"(株式会社|有限会社|合同会社|\(株\)|\(有\))", " ", s)
    s = re.sub(r"([〇一二三四五六七八九十]+)丁目", lambda m: "%d丁目" % kanji_num(m.group(1)), s)
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c) or c in "゙゚")
    return unicodedata.normalize("NFC", s)


def kfold(s):
    """かなの書き方の差をなくした形：カタカナはひらがなに、濁点・小さい字・長音・記号はのぞく（light() の後に使う）"""
    s = "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)
    s = "".join(c for c in unicodedata.normalize("NFD", s) if c not in "゙゚")
    s = unicodedata.normalize("NFC", s).translate(SMALL)
    return re.sub(r"[^0-9a-zぁ-ゖ一-鿿々〆]", "", s)


@functools.lru_cache(maxsize=None)
def roma(t):
    """ローマ字の形（長い音は短く）。pykakasi がないときは空"""
    if not KKS or not t.strip():
        return ""
    r = "".join(x["hepburn"] for x in KKS.convert(t))
    r = re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKC", r).lower())
    r = re.sub(r"m(?=[bp])", "n", r)
    for a, b in (("ou", "o"), ("oo", "o"), ("uu", "u"), ("aa", "a"), ("ii", "i"), ("ee", "e")):
        r = r.replace(a, b)
    return r


@functools.lru_cache(maxsize=None)
def split_name(s):
    """(店の種類と支店名をのぞいた名前, 支店の場所, その名前のローマ字) を返す"""
    t = GENERIC.sub("", light(s))
    t = re.sub(r"[()（）\[\]［］【】「」『』〈〉<>]", " ", t).strip()
    br = ""
    m = PLACE_TAIL[0].search(t) if PLACE_TAIL[0] else None  # 「〇〇△△店」（△△は町名・駅名）
    if not (m and kfold(t[:m.start()])):
        m = re.search(r"\s(\S+?)(駅前|駅|[東西南北]口)?(\d+号|本)?店$", t)  # 「〇〇 △△店」
    if m and kfold(t[:m.start()]):
        br = m.group(1) + (m.group(2) if (m.group(2) or "").endswith("口") else "")
        t = t[:m.start()]
    else:
        t = re.sub(r"(\d+号|本)店$", "", t)
    return kfold(t), kfold(br), roma(t)


def lcs_len(a, b):
    best, prev = 0, [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
                best = max(best, cur[j])
        prev = cur
    return best


def same_shop(a, b):
    """3・2 = 同じ店とみてよい、1 = 近いときだけ同じ店とみる（チェーンの名前だけが同じなど）、0 = 別の店"""
    x, y = kfold(light(a)), kfold(light(b))
    if not x or not y:
        return 0
    if x == y:
        return 3
    (ca, ba, ra), (cb, bb, rb) = split_name(a), split_name(b)
    if ba and bb and ba not in bb and bb not in ba:
        return 0  # 名前が同じでも、支店の場所がちがう
    s, l = sorted(((ca if len(ca) >= 2 else x), (cb if len(cb) >= 2 else y)), key=len)
    rs, rl = sorted((ra, rb), key=len)
    if s == l or (len(rs) >= 4 and rs == rl):
        return 3  # 店の種類と支店名をのぞくと同じ名前（読みが同じものもふくむ）
    if len(ca) >= 4 and len(cb) >= 4 and lcs_len(ca, cb) >= 0.8 * min(len(ca), len(cb)):
        return 2  # 1字ちがい（サイゼリヤ・サイゼリア など）
    edge = lambda s, l: l.startswith(s) or l.endswith(s)  # noqa: E731  片方の名前の頭か終わりに、もう片方の名前がある
    if (len(s) >= 3 and edge(s, l)) or (len(rs) >= 4 and edge(rs, rl)):
        return 2
    if len(s) >= 2 and edge(s, l):
        return 1
    return 0


KANJI = {c: i for i, c in enumerate("〇一二三四五六七八九")}


def kanji_num(s):
    if "十" in s:
        a, _, b = s.partition("十")
        return (KANJI.get(a, 1) if a else 1) * 10 + (KANJI.get(b, 0) if b else 0)
    return int("".join(str(KANJI[c]) for c in s))


def norm_addr(a):
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


def block(a):
    """住所の街区まで（板橋区〇〇町1-2）"""
    m = re.match(r"^(板橋区\D+?\d+(?:-\d+)?)", a or "")
    return m.group(1) if m else ""


def pretty_addr(a):
    a = unicodedata.normalize("NFKC", a or "").strip()
    a = re.sub(r"^東京都", "", a)
    return re.sub(r"\s+", " ", a)


def date_of(s):
    s = unicodedata.normalize("NFKC", str(s or "")).strip()
    m = re.match(r"(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})", s)
    if m:
        return "%s-%02d-%02d" % (m.group(1), int(m.group(2)), int(m.group(3)))
    m = re.match(r"(令和|R)(\d+|元)[年.](\d+)[月.](\d+)", s)
    if m:
        y = 2018 + (1 if m.group(2) == "元" else int(m.group(2)))
        return "%d-%02d-%02d" % (y, int(m.group(3)), int(m.group(4)))
    return ""


def col(head, *words, ex=()):
    for i, h in enumerate(head):
        if any(w in h for w in words) and not any(x in h for x in ex):
            return i
    return None


# ---- 元データを読む ----
def permit_records(tables, source):
    out = []
    for t in tables:
        head = t["head"]
        i_name = col(head, "屋号", "商号", "施設の名称", "施設名", "名称", ex=("営業者", "申請者"))
        i_addr = col(head, "施設の所在地", "所在地", "住所", ex=("営業者", "申請者"))
        i_kind = col(head, "営業の種類", "業種")
        i_date = col(head, "許可年月日", "年月日", ex=("満了", "期限", "申請"))
        i_type = col(head, "申請種別", "区分")
        i_food = col(head, "主として", "取扱")
        if i_name is None or i_addr is None:
            continue
        for r in t["rows"]:
            g = lambda i: r[i] if i is not None and i < len(r) else ""  # noqa: E731
            kind = g(i_kind)
            if kind and "飲食店" not in kind:
                continue
            if rules.NOT_KIND.search(kind + " " + g(i_type)):
                continue
            name, addr = clean_name(g(i_name)), pretty_addr(g(i_addr))
            if not name or "板橋区" not in addr:
                continue
            out.append({"name": name, "addr": addr, "na": norm_addr(addr), "date": date_of(g(i_date)), "type": g(i_type),
                        "food": g(i_food), "src": source})
    return out


def osm_records(j, rev):
    out = []
    for e in (j or {}).get("elements", []):
        t = e.get("tags", {})
        name = clean_name(t.get("name:ja") or t.get("name") or "")
        if not name:
            continue
        lat = e.get("lat") or (e.get("center") or {}).get("lat")
        lng = e.get("lon") or (e.get("center") or {}).get("lon")
        if not lat or not lng:
            continue
        addr = ""
        if t.get("addr:full"):
            addr = pretty_addr(t["addr:full"])
        elif t.get("addr:quarter") or t.get("addr:neighbourhood"):
            parts = [t.get("addr:city", "板橋区"), t.get("addr:quarter") or t.get("addr:neighbourhood", ""), t.get("addr:block_number", ""), t.get("addr:housenumber", "")]
            addr = pretty_addr("".join(parts[:2]) + "-".join(x for x in parts[2:] if x))
        key = "%s/%s" % (e["type"], e["id"])
        rv = rev.get(key) or ["", ""]
        if rv[0] and rv[0] != "13119":
            continue  # 板橋区の外
        if "板橋区" not in addr and rv[1]:
            addr = "板橋区" + rv[1]
        out.append({"name": name, "addr": addr if "板橋区" in addr else "", "na": norm_addr(addr), "pos": (round(lat, 6), round(lng, 6)), "src": "osm",
                    "osm": key, "tags": t, "town_addr": "板橋区" + rv[1] if rv[1] else ""})
    return out


def main():
    geo = load(os.path.join(RAW, "geocode.json"), {}) or {}
    kyoka = permit_records(load(os.path.join(RAW, "kyoka", "rows.json"), []) or [], "kyoka")
    mhlw = permit_records(load(os.path.join(RAW, "mhlw", "rows.json"), []) or [], "mhlw")
    osm = osm_records(load(os.path.join(RAW, "osm.json"), {}), load(os.path.join(RAW, "revgeo.json"), {}) or {})
    food = load(FOOD)
    F = food["meta"]
    print("元データ：区の許可一覧（飲食店営業）", len(kyoka), "／厚労省", len(mhlw), "／OpenStreetMap", len(osm), "／今の地図の飲食店", len(food["items"]))

    for e in food["items"]:
        if any(F["tags"][k].startswith("運営会社:") for k in e["tg"]):
            t = unicodedata.normalize("NFKC", e["n"])
            parts = re.split(r"\s+", t)
            head = parts[0] if len(parts) >= 2 else re.sub(r"[^\s]{1,10}店$", "", t)
            if len(nk(head)) >= 2:
                BRANDS.add(nk(head))
                BRAND_K.add(kfold(light(head)))
    for r in osm:
        for k in ("brand", "brand:ja"):
            if r["tags"].get(k):
                BRANDS.add(nk(r["tags"][k]))
                BRAND_K.add(kfold(light(r["tags"][k])))
    BRAND_K.discard("")

    # 許可の記録：同じ店（同じ住所・同じ名前）は、いちばん新しい許可にまとめる
    permits = {}
    for r in kyoka + mhlw:
        if rules.NOT_SHOP.search(r["name"]):
            continue
        key = (nk(r["name"]), r["na"])
        if key not in permits or r["date"] > permits[key]["date"]:
            permits[key] = r
    permits = list(permits.values())
    for r in permits:
        g = geo.get(r["na"])
        r["pos"] = (g[0], g[1]) if g else None
        r["approx"] = bool(g) and not re.search(r"[0-9０-９]+番", g[2] or "")  # 番地までわからず、町・丁目の位置のもの
    print("飲食店ではない施設をのぞいた許可の記録", len(permits), "うち位置がわかったもの", sum(1 for r in permits if r["pos"]))

    osm = [r for r in osm if not rules.NOT_SHOP.search(r["name"])]

    # ---- 駅（Wikidata の項目のうち、駅・停留場の種類のもの） ----
    wd = load(WD_ITEMS, []) or []
    cl = (load(WD_CLASSES, {}) or {}).get("classes", {})
    st_re = re.compile(r"station|tram stop|railway stop|駅|停留場", re.I)
    not_st = re.compile(r"former|abandoned|goods|proposed|police|fire|power|geodetic|water|bus|building|かつての|廃駅|貨物|提案|警察|消防|発電|測地|給水|駅舎|駅ナカ|海の駅|宿場", re.I)
    stations = []
    for o in wd:
        labs = [cl.get(t, {}).get("en", "") + "|" + cl.get(t, {}).get("ja", "") for t in o["types"]]
        if not any(st_re.search(x) for x in labs) or any(not_st.search(x) for x in labs) or o.get("end"):
            continue
        m = re.match(r"Point\(([-\d.]+) ([-\d.]+)\)", o.get("coord", ""))
        nm = re.sub(r"(駅|停留場|停留所)$", "", re.sub(r"[(（][^)）]*[)）]", "", o.get("label", ""))).strip()
        if m and nm and not re.search(r"信号場|貨物|操車場|車両基地|臨時|仮駅|旧|廃", nm):
            stations.append((nm, (float(m.group(2)), float(m.group(1)))))

    # 支店名に使われる町名・駅名
    places = {light(t) for t in F.get("kana", {})} | {light(nm) for nm, _ in stations}
    places |= {re.sub(r"町$", "", p) for p in places}
    places = sorted((p for p in places if len(p) >= 2), key=len, reverse=True)
    PLACE_TAIL[0] = re.compile("(" + "|".join(map(re.escape, places)) + r")(駅前|駅|[東西南北]口)?(\d+号|本)?店$")
    split_name.cache_clear()

    # ---- 今の地図の店と比べる ----
    exist = food["items"]
    ex_by_block = collections.defaultdict(list)
    for e in exist:
        ex_by_block[block(norm_addr(e.get("ad", "")))].append(e)

    def in_map(r):
        b = block(r["na"])
        for e in ex_by_block.get(b, []) if b else []:
            if same_shop(r["name"], e["n"]) >= 1:
                return e
            if r.get("date") and e.get("kd") == r["date"] and norm_addr(e.get("ad", "")) == r["na"]:
                return e  # 同じ住所・同じ日の許可（前に同じ一覧から地図に入れた店）
        if r.get("pos"):
            far = 2 if r.get("approx") else 1  # 位置が町・丁目までしかわからないときは、遠くまで見る
            # チェーン店は、支店名がなくても、少しはなれた同じチェーンの店と同じ店とみる
            rk = split_name(r["name"])[0]
            chain = rk if rk in BRAND_K else kfold(light(r.get("tags", {}).get("brand", "")))
            for e in exist:
                d = meters(r["pos"], (e["y"], e["x"]))
                if d <= 160 * far:
                    s = same_shop(r["name"], e["n"])
                    near2 = d <= 80 * far or (chain and chain in kfold(light(e["n"])) and d <= 150 * far)
                    if s == 3 or (s == 2 and near2) or (s == 1 and d <= 60 * far):
                        return e
        return None

    new = []
    hit_k = 0
    for r in permits + osm:
        if in_map(r):
            hit_k += 1
            continue
        new.append(r)
    print("今の地図にある店", hit_k, "／まだない店", len(new))

    # 元データどうしで同じ店をまとめる（許可の記録を先に、OpenStreetMap の情報を足す）
    merged = []
    for r in new:
        m = None
        for q in merged:
            if r["na"] and q["na"] and block(r["na"]) == block(q["na"]) and same_shop(r["name"], q["name"]) >= 1:
                m = q
                break
            if r.get("pos") and q.get("pos") and meters(r["pos"], q["pos"]) <= 100 and same_shop(r["name"], q["name"]) >= 2:
                m = q
                break
        if m:
            m.setdefault("more", []).append(r)
            if not m.get("pos") and r.get("pos"):
                m["pos"], m["approx"] = r["pos"], r.get("approx", False)
        else:
            merged.append(r)
    merged = [r for r in merged if r.get("pos")]
    print("まとめたあとの、地図に足す店", len(merged))

    def near_stations(pos):
        best = {}
        for nm, p in stations:
            d = meters(pos, p)
            if d < 3000 and (nm not in best or d < best[nm]):
                best[nm] = d
        return sorted((d, nm) for nm, d in best.items())

    # ---- チェーン店：今の地図で運営会社が付いている店の名前の頭 ----
    tagname = F["tags"]
    brands = {}
    for e in exist:
        op = next((tagname[k].split(":", 1)[1] for k in e["tg"] if tagname[k].startswith("運営会社:")), None)
        if op:
            head = base_name(re.split(r"[\s　]", e["n"])[0])
            if len(head) >= 2:
                brands[head] = op
    towns = set(F.get("kana", {}).keys())

    def town_of(addr):
        m = re.match(r"^板橋区(\D+?)(\d|[〇一二三四五六七八九十]+丁目|$)", unicodedata.normalize("NFKC", addr or ""))
        t = m.group(1) if m else ""
        return t if t in towns else "板橋区内"

    items, seen = [], set()
    for r in merged:
        recs = [r] + r.get("more", [])
        osm_r = next((x for x in recs if x["src"] == "osm"), None)
        name = r["name"]
        brand_tag = osm_r["tags"].get("brand") if osm_r else None
        branch = clean_name(osm_r["tags"].get("branch", "")) if osm_r and r["src"] == "osm" else ""
        if branch and nk(branch) not in nk(name):
            name = name + " " + branch  # OpenStreetMap の支店名（「魚べい」＋「大山店」）
        extra = " ".join(x.get("food", "") for x in recs)
        sub = rules.sub_of(name, extra)
        if sub == "13-1" and osm_r:
            sub = rules.osm_sub(osm_r["tags"])
        if sub == "13-1" and (re.match(r"^(株式会社|有限会社|合同会社|\(株\)|\(有\))", unicodedata.normalize("NFKC", name))
                              or re.search(r"^[A-Za-z]{1,3}\d{3,}[-\d]*$|\d{4,}$|フーズ|食品|商店$|ストア|^ジオ", unicodedata.normalize("NFKC", name))):
            continue  # 会社・売店・建物の名前らしく、飲食店かどうかわからないもの
        cat = sub.split("-")[0]
        addr = next((x["addr"] for x in recs if x["src"] != "osm" and x["addr"]), "") or (osm_r and osm_r["addr"]) or ""
        pos = r["pos"]
        src = r["src"]
        key = {"kyoka": "k", "mhlw": "h", "osm": "q"}[src] + hashlib.sha1((nk(name) + "|" + (r["na"] or (osm_r or {}).get("osm", ""))).encode()).hexdigest()[:6]
        iid = "%s-%s" % (cat, key)
        if iid in seen:
            continue
        seen.add(iid)
        tg = ["施設の種類:" + F["subs"][sub]]
        ns = near_stations(pos)
        if ns:
            tg.append("最寄り駅:" + ns[0][1])
            if len(ns) > 1 and ns[1][0] <= 800:
                tg.append("最寄り駅:" + ns[1][1])
            if ns[0][0] < 400:
                tg.append("条件:駅近")
        nkn = nk(name)
        op = next((v for b, v in brands.items() if nkn.startswith(b)), None)
        tg.append("条件:チェーン店" if op or brand_tag else "条件:個人店")  # OpenStreetMap でチェーンの名前（brand）が付いている店もチェーン店
        if op:
            tg.append("運営会社:" + op)
        x = {"i": iid, "c": cat, "n": name, "t": town_of(addr), "a": 0, "ad": addr or "板橋区", "s": sub, "y": pos[0], "x": pos[1],
             "f": 64 | (1 if r.get("approx") else 0), "tg": tg, "gq": (name + " " + (addr or "板橋区")).strip(), "ck": TODAY}
        if ns:
            x["sd"] = [ns[0][1], int(round(ns[0][0]))]
        k = next((y for y in recs if y["src"] == "kyoka"), None)
        h = next((y for y in recs if y["src"] == "mhlw"), None)
        if k and k["date"]:
            x["kd"], x["kn"] = k["date"], 1
        elif h and h["date"]:
            x["md"] = h["date"]
        elif osm_r:
            x["os"] = osm_r["osm"]
        else:
            continue  # 出典を示せないもの
        if osm_r:
            t = osm_r["tags"]
            site = t.get("website") or t.get("contact:website") or ""
            if site.startswith("http"):
                x["u"] = site
            tel = t.get("phone") or t.get("contact:phone") or ""
            if tel and x.get("os"):
                x["ph"] = [["電話", tel, "", 0]]
        items.append(x)
    items.sort(key=lambda o: (o["c"].zfill(2), o["t"], o["n"]))
    print("地図に足す店", len(items), dict(collections.Counter(F["cats"][o["c"]]["name"] for o in items)))
    print("出典ごと", dict(collections.Counter(("区の許可一覧" if o.get("kd") else "厚労省" if o.get("md") else "OpenStreetMap") for o in items)))
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"made": TODAY, "items": items}, f, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
