"""東京23区の観光スポットの地図用データ（kanko.json）を作る。

  python build.py <fetch.py で集めた元データのフォルダ> <data.json> <出力する kanko.json>

選び方
  1. Wikidata：23区にあり、位置と日本語版ウィキペディアの記事がある項目のうち、
     観光地・博物館・美術館・動物園・水族館・植物園・庭園・展望施設・遊園地・寺社・史跡などの種類のものと、
     文化財・史跡・名勝などに指定されているもの
  2. 各区が東京都オープンデータカタログで公開している観光施設の一覧に載っている場所
  3. 1 と 2 で同じ場所はまとめる。地図にすでにある場所（data.json）と同じ場所は足さずに、観光の種類だけを付ける
"""
import csv
import datetime
import hashlib
import io
import json
import math
import os
import re
import sys
import unicodedata
import urllib.parse

RAW, DATA, OUT = sys.argv[1:4]
WARDS = ["千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区",
         "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区"]
WARD_CODE = {w: 13101 + i for i, w in enumerate(WARDS)}
BBOX = (35.50, 35.84, 139.55, 139.93)  # 23区がおさまる範囲（緯度・経度）
SITELINKS_MIN = 3  # 「よく知られていれば入れる種類」で、よく知られているとみるウィキペディアの言語数

# 観光の種類：タグの名前, 種類ボタンの名前, 種類ボタンの説明, 分類の番号, 目的のタグ
KINDS = {
    "寺社": ("寺社", "寺・神社など", "21", "歴史・文化財をめぐる"),
    "史跡・文化財": ("史跡・文化財", "史跡・文化財・記念碑", "22", "歴史・文化財をめぐる"),
    "博物館・美術館": ("博物館・美術館", "博物館・美術館・資料館", "23", "見学する・学ぶ"),
    "動物園・水族館・植物園": ("動物・植物", "動物園・水族館・植物園", "24", "動物や植物を見る"),
    "庭園・公園": ("庭園・公園", "庭園・公園", "25", "自然を楽しむ"),
    "展望・タワー": ("展望・タワー", "展望台・タワー", "26", "景色を見る"),
    "遊園地・テーマパーク": ("遊園地", "遊園地・テーマパーク", "27", "遊ぶ"),
    "名所": ("名所", "そのほかの名所", "28", ""),
}
CATS = {
    "21": {"name": "寺・神社など", "short": "寺社", "icon": "landmark", "color": "#8a6a00"},
    "22": {"name": "史跡・文化財", "short": "史跡・文化財", "icon": "landmark", "color": "#8a6a00"},
    "23": {"name": "博物館・美術館・資料館", "short": "博物館など", "icon": "museum", "color": "#7b1fa2"},
    "24": {"name": "動物園・水族館・植物園", "short": "動物・植物", "icon": "paw", "color": "#00838f"},
    "25": {"name": "庭園・公園", "short": "庭園・公園", "icon": "tree", "color": "#2f7d3b"},
    "26": {"name": "展望台・タワー", "short": "展望・タワー", "icon": "landmark", "color": "#8a6a00"},
    "27": {"name": "遊園地・テーマパーク", "short": "遊園地", "icon": "landmark", "color": "#8a6a00"},
    "28": {"name": "名所", "short": "名所", "icon": "landmark", "color": "#8a6a00"},
}
LIC_URL = {"CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/deed.ja", "CC0": "https://creativecommons.org/publicdomain/zero/1.0/deed.ja"}


def load(name, default=None):
    p = os.path.join(RAW, name)
    if not os.path.exists(p):
        return default
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def point(s):
    m = re.match(r"Point\(([-\d.eE]+) ([-\d.eE]+)\)", s or "")
    return (float(m.group(2)), float(m.group(1))) if m else None


def inside(lat, lng):
    return BBOX[0] <= lat <= BBOX[1] and BBOX[2] <= lng <= BBOX[3]


def meters(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(h))


def clean(s):
    s = unicodedata.normalize("NFKC", str(s or ""))
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"[\r\n\t]+", " ", s)
    return re.sub(r"\s{2,}", " ", s).strip()


def nk(s, keep=False):
    """名前を比べるための形（かっこの中・記号・空白をのぞく。keep=True のときは、かっこの中も残す）"""
    s = unicodedata.normalize("NFKC", s or "")
    s = re.sub(r"[(（\[【「『]([^)）\]】」』]*)[)）\]】」』]", r"\1" if keep else "", s)
    s = re.sub(r"^(公益財団法人|一般財団法人|東京都立|都立|国立|[^\s]{1,4}区立|区立|東京都|国指定史跡|国指定|都指定|区指定)", "", s.strip())
    s = re.sub(r"[\s・･\-‐－―〜~、。,.'’\"”“!！?？]", "", s)
    s = s.replace("ヶ", "ケ").replace("ヵ", "カ").replace("ケ", "が").replace("之", "").replace("の", "").replace("ノ", "")
    return s.lower()


def variants(s):
    """名前の形：(かっこの外, かっこの中のそれぞれ, かっこの中も残した形)"""
    main = nk(s)
    inner = [nk(x) for x in re.findall(r"[(（\[【「『]([^)）\]】」』]*)[)）\]】」』]", unicodedata.normalize("NFKC", s or ""))]
    return main, [x for x in inner + [nk(s, True)] if x and x != main]


def same_name(a, b):
    """3：かっこの外が同じ、2：かっこの中などで同じ、1：片方がもう片方を含む（3文字以上）、0：違う"""
    am, ao = variants(a)
    bm, bo = variants(b)
    if not am and not ao or not bm and not bo:
        return 0
    if am and am == bm:
        return 3
    al, bl = [am] + ao, [bm] + bo
    if any(x and x == y for x in al for y in bl):
        return 2
    if any(x and y and min(len(x), len(y)) >= 3 and (x in y or y in x) for x in al for y in bl):
        return 1
    return 0


RELIGIOUS = re.compile(r"(神社|稲荷|八幡|天神|寺|院|堂|不動|地蔵|観音)$")


def close_enough(a, b, d):
    """名前 a・b と距離 d（m）から、同じ場所とみるか"""
    s = same_name(a, b)
    if s >= 2:
        return s if d <= 400 else 0
    if s == 1:
        short = min(len(nk(a)), len(nk(b)))
        lim = 600 if RELIGIOUS.search(nk(a)) and RELIGIOUS.search(nk(b)) and short >= 4 else 200
        return 1 if d <= lim else 0
    x, y = nk(a), nk(b)
    if x and y and min(len(x), len(y)) == 2 and (x in y or y in x) and d <= 60:
        return 1
    return 0


def round_m(x):
    return int(round(x / 10.0) * 10)


class Grid:
    def __init__(self, pts, cell=0.01):
        self.cell = cell
        self.g = {}
        for i, p in enumerate(pts):
            self.g.setdefault((int(p[0] / cell), int(p[1] / cell)), []).append(i)

    def near(self, p, r=1):
        cx, cy = int(p[0] / self.cell), int(p[1] / self.cell)
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                yield from self.g.get((cx + dx, cy + dy), [])


TODAY = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).date().isoformat()

# ---- Wikidata の種類から観光の種類を決める ----
# 大きな種類（classes.json の roots）と、項目の種類（P31）の名前で決める。
# 「必ず入れる種類」は日本語版ウィキペディアに記事があれば入れる。
# 「よく知られていれば入れる種類」は、文化財などの指定・観光地の種類・ほかの言語のウィキペディアの記事の数・区の一覧のどれかがあるときだけ入れる。
ZOO = {"Q43501", "Q2281788", "Q167346"}
MUSEUM = {"Q33506", "Q207694", "Q2087181", "Q148319"}
GALLERY = {"Q1007870"}  # ギャラリー（画廊もふくむので、よく知られていれば入れる）
AMUSE = {"Q194195", "Q2416723"}
SHRINE = {"Q5393308", "Q845945", "Q16970", "Q32815", "Q44539"}
TOURIST = {"Q570116", "Q2319498"}
GARDEN_CORE = {"Q10926872"}  # 国民公園
WEAK_SITE = {"Q16560", "Q4989906", "Q5003624", "Q179700", "Q35112127", "Q53060", "Q12280"}  # 宮殿・碑・像・歴史的建造物・門・橋
WEAK_MEISHO = {"Q24354", "Q132510", "Q37654", "Q54050"}  # 劇場・市場・丘
RE_VIEW = re.compile(r"展望|observation", re.I)
RE_SITE = re.compile(r"史跡|遺跡|古墳|貝塚|城跡|^城$|日本の城|平城|山城|castle|historic site|archaeological site|kofun|shell midden|hirajiro", re.I)
RE_OBJECT = re.compile(r"絵画|太刀|打刀|短刀|刀剣|古典籍|古文書|考古資料|絵巻|手鑑|工芸品|著作物|典籍|書跡|彫刻|仏像|陶磁器|茶碗|埴輪|鏡$|硯|香炉|水瓶|水注|屏風|出土品|蒔絵|文書$"
                       r"|painting|sword|tachi|katana|manuscript|document|scroll|work of art|artwork|creative work|kotenseki|komonjo|archaeological record|emakimono|tekagami|handicraft"
                       r"|ceramic|bowl|haniwa|mirror|incense|ewer|vessel|sculpture|calligraph|folding screen|lacquer", re.I)
RE_OBJECT_NAME = re.compile(r"図$|帖$|文書$|出土品$|献物帳|屏風|茶碗|水瓶|水注|香炉|硯箱|画像鏡|墨床|灌頂幡|金銅|銅鐸|埴輪")
RE_NOT_PLACE = re.compile(r"町丁|chōchō|企業|business|組織|organization|出版社|publisher|株式会社|kaisha|事業者|enterprise|名数|triad|死亡地|place of death", re.I)
RE_PRIVATE = re.compile(r"大使公邸|ambassador's residence|ストリップ|strip club|strip theat", re.I)  # 一般の人が入れない所・成人向けの店
RE_IMPERIAL = re.compile(r"皇室の施設|Imperial Facilities", re.I)  # 皇室の施設は、皇居のようによく知られた所だけ
RE_PRIVATE_NAME = re.compile(r"^宮中|皇族邸|御用邸|吹上|倶楽部")  # 一般の人が入れない所
RE_SPORT = re.compile(r"スタジアム|アリーナ|競技|体育館|球場|スポーツ|プール|水泳|競艇|競馬場|相撲部屋|武道館|stadium|arena|sport|gym|swimming|pool|heya|budōkan|kyōteijō|racecourse", re.I)
RE_CLOSED_TYPE = re.compile(r"現存しない|廃止された|かつての|破壊・解体|旧ホテル|旧学校|former|defunct|destroyed|demolished|abandoned", re.I)
STATION = re.compile(r"station|tram stop|railway stop|駅|停留場", re.I)
NOT_STATION = re.compile(r"former|abandoned|goods|proposed|police|fire|power|geodetic|water|bus|building|eki-naka|かつての|廃駅|貨物|提案|警察|消防|発電|測地|給水|駅舎|駅ナカ|海の駅|宿場", re.I)
CLOSED_WORDS = re.compile(r"閉鎖|閉館|閉園|廃止|廃業|解体|取り壊|撤去|消滅|焼失|demolish|destroy|closed|defunct|abandon|disused|dismantl")
SHURUI = [  # 施設の種類のタグ（大きな種類）
    ("Q2281788", "水族館"), ("Q43501", "動物園"), ("Q167346", "植物園"), ("Q148319", "プラネタリウム"),
    ("Q207694", "美術館"), ("Q1007870", "美術館"), ("Q33506", "博物館"),
    ("Q194195", "遊園地"), ("Q2416723", "テーマパーク"),
    ("Q5393308", "寺"), ("Q845945", "神社"), ("Q16970", "教会"), ("Q32815", "モスク"),
    ("Q1107656", "庭園"), ("Q22698", "公園"), ("Q839954", "遺跡"), ("Q23413", "城跡"),
    ("Q179700", "碑・像・石造物"), ("Q4989906", "碑・像・石造物"), ("Q5003624", "碑・像・石造物"),
    ("Q12280", "橋"), ("Q53060", "門"), ("Q35112127", "歴史的な建物"),
]


def wd_kind(o, classes):
    """(観光の種類, よく知られていなくても入れるか, 施設の種類) を返す。入れないものは (None, False, "")"""
    types = o["types"]
    labs = [classes.get(t, {}).get("ja", "") + "|" + classes.get(t, {}).get("en", "") for t in types]
    roots = set()
    for t in types:
        roots.update(classes.get(t, {}).get("roots", []))
    shurui = next((v for q, v in SHURUI if q in roots), "")
    her, tour = bool(o["heritage"]), bool(roots & TOURIST)
    if not labs or all(RE_OBJECT.search(l) or RE_NOT_PLACE.search(l) for l in labs) or RE_OBJECT_NAME.search(o.get("label", "")):
        return None, False, ""  # 種類がわからない項目、美術品・文書などの物、町・会社の項目
    if any(RE_PRIVATE.search(l) for l in labs) or (any(RE_IMPERIAL.search(l) for l in labs) and o.get("sitelinks", 0) < 20) or RE_PRIVATE_NAME.search(o.get("label", "")):
        return None, False, ""
    if set(types) & GARDEN_CORE:
        return "庭園・公園", True, "庭園"
    if roots & ZOO:
        return "動物園・水族館・植物園", True, shurui
    if roots & MUSEUM:
        return "博物館・美術館", True, shurui
    if roots & GALLERY:
        return "博物館・美術館", False, "美術館"
    if any(RE_VIEW.search(l) for l in labs):
        return "展望・タワー", True, "展望施設"
    if roots & AMUSE or "Q202570" in types:
        return "遊園地・テーマパーク", True, shurui or "遊園地"
    if any(RE_SPORT.search(l) for l in labs) and not tour:
        return None, False, ""
    if roots & SHRINE:
        return "寺社", False, shurui
    if any(RE_SITE.search(l) for l in labs):
        return "史跡・文化財", True, "遺跡" if "Q839954" in roots else "城跡" if "Q23413" in roots else "史跡・旧跡"
    garden = [t for t in types if "Q1107656" in classes.get(t, {}).get("roots", []) and "Q22698" not in classes.get(t, {}).get("roots", [])]
    if garden or set(types) & GARDEN_CORE:
        return "庭園・公園", True, "庭園"
    if "Q22698" in roots or "Q39614" in roots:
        return "庭園・公園", False, "公園" if "Q22698" in roots else "墓地"
    if roots & WEAK_SITE:
        return "史跡・文化財", False, shurui
    if roots & WEAK_MEISHO:
        return "名所", False, ""
    if tour:
        return "名所", True, ""
    if her:
        return "史跡・文化財", False, "歴史的な建物"
    return None, False, ""


def closed(o, classes):
    if o.get("end") or o.get("closed"):
        return True
    if any(RE_CLOSED_TYPE.search(classes.get(t, {}).get("ja", "") + "|" + classes.get(t, {}).get("en", "")) for t in o["types"]):
        return True
    for u in o.get("use", []):
        c = classes.get(u, {})
        if CLOSED_WORDS.search((c.get("ja", "") + " " + c.get("en", "")).lower()):
            return True
    return False


# ---- 各区の観光施設の一覧 ----
SKIP_DS = re.compile(r"案内所|統計|トイレ|駐車場|駐輪|wi-?fi|ボランティア|イベント|宿泊|ホテル|入込|客数|ガイド|パンフ|英語|多言語|外国語|翻訳|資料集|世論調査|外観|展示室|ルート|マップ|百景", re.I)
# 観光スポットではない行（案内所・観光協会などの事務所・宿・トイレ・駐車場）と、商店会の情報
SKIP_ROW = re.compile(r"トイレ|駐車場|駐輪場|案内所|インフォメーション|観光情報センター|観光協会|観光連盟|事務局|ホテル|旅館|商店会|振興組合"
                      r"|運動場|競技場|体育館|プール|直売所|ショップ|シネパル|映画館|リサイクル|スタジオ$"  # 観光とは別の用の施設
                      r"|<\d+月>|祭り|まつり|例大祭|天王祭|縁日|供養|入学式|渡御|花火大会|めぐり$|神楽")  # 行事（場所ではない）
TRADE = re.compile(r"商店会|商店街|振興組合|連合会|商栄会|協同組合|商盛会|睦会")


def read_table(path):
    with open(path, "rb") as f:
        data = f.read()
    rows = []
    if path.endswith(".csv"):
        text = None
        encs = ("utf-16",) if data[:2] in (b"\xff\xfe", b"\xfe\xff") else ("utf-8-sig", "cp932", "utf-16")
        for enc in encs:
            try:
                text = data.decode(enc)
                break
            except UnicodeDecodeError:
                continue
        if text is None:
            return []
        rows = list(csv.reader(io.StringIO(text)))
    elif path.endswith(".xlsx"):
        try:
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(data), read_only=True, data_only=True)
            rows = [["" if c is None else str(c) for c in r] for r in wb.worksheets[0].iter_rows(values_only=True)]
        except Exception as e:  # noqa: BLE001
            print("  xlsx を読めませんでした", path, repr(e)[:120])
            return []
    elif path.endswith(".xls"):
        try:
            import xlrd
            sh = xlrd.open_workbook(file_contents=data).sheet_by_index(0)
            rows = [[str(sh.cell_value(r, c)) for c in range(sh.ncols)] for r in range(sh.nrows)]
        except Exception as e:  # noqa: BLE001
            print("  xls を読めませんでした", path, repr(e)[:120])
            return []
    else:
        return []
    for hi, r in enumerate(rows[:12]):
        if any(clean(c) in ("名称", "施設名", "名前", "施設名称", "観光施設名", "スポット名") or clean(c).endswith("_名称") for c in r):
            break
    else:
        return []
    head = [clean(c) for c in rows[hi]]
    out = []
    for r in rows[hi + 1:]:
        cells = [clean(c) for c in r]
        if not any(cells):
            continue
        out.append({head[i]: cells[i] for i in range(min(len(head), len(cells))) if head[i]})
    return out


def col(row, *names, ex=()):
    for n in names:
        if n in row and row[n]:
            return row[n]
    for k, v in row.items():
        if v and any(n in k for n in names) and not any(x in k for x in ex):
            return v
    return ""


def num(s):
    try:
        return float(str(s).replace(",", "").strip())
    except ValueError:
        return None


def semi(s):
    return re.sub(r"\s*;\s*", "、", s or "").strip("、 ")


def hhmm(s):
    s = clean(s)
    m = re.match(r"^(\d{1,2}):(\d{2})(:\d{2})?$", s)
    return "%d:%s" % (int(m.group(1)), m.group(2)) if m else s


def ward_rec(row, ward):
    name = col(row, "名称", "施設名", "観光施設名", "スポット名", "施設名称", "名前", ex=("カナ", "かな", "英語", "英字", "ローマ", "ふりがな", "読み"))
    if not name or SKIP_ROW.search(name):
        return None
    lat, lng = num(col(row, "緯度")), num(col(row, "経度"))
    if not (lat and lng):
        lat, lng = num(col(row, "Y座標")), num(col(row, "X座標"))
    if lat and lng and lat > 90:
        lat, lng = lng, lat
    pos = (lat, lng) if lat and lng and inside(lat, lng) else None
    addr = next((row[k] for k in ("住所", "所在地_連結表記", "所在地", "場所") if row.get(k)), "")
    kata = col(row, "方書")
    if kata and kata not in addr:
        addr = (addr + " " + kata).strip()
    # 区の一覧に、ほかの区にある場所が載っていることがある（住所の区を使う）
    a0 = re.sub(r"^東京都", "", unicodedata.normalize("NFKC", addr))
    ward = next((w for w in sorted(WARDS, key=len, reverse=True) if a0.startswith(w)), ward)
    days, t0, t1 = col(row, "利用可能曜日"), hhmm(col(row, "開始時間")), hhmm(col(row, "終了時間"))
    tnote = col(row, "利用可能日時特記事項", "営業時間", "開館時間", "休館日", "定休日")
    times = " ".join(x for x in [days, (t0 + "〜" + t1) if t0 and t1 else (t0 or t1)] if x)
    if tnote and tnote not in times:
        times = (times + "。" if times else "") + tnote
    fee = col(row, "料金（基本）", "料金(基本)", "料金", ex=("詳細", "英語"))
    fee2 = col(row, "料金（詳細）", "料金(詳細)")
    if re.fullmatch(r"[\d,]+", fee or ""):
        fee = "" if fee2 else ("無料" if fee in ("0", "") else fee + "円")  # 基本の料金が数だけのときは、詳細の説明を使う
    if fee2 and fee2 != fee:
        fee = (fee + "。" if fee else "") + fee2
    contact = next((row[k] for k in ("連絡先名称", "問い合わせ先", "問合せ先", "連絡先") if row.get(k)), "")
    tel = col(row, "連絡先電話番号", "電話番号", "電話")
    if contact and TRADE.search(contact):
        contact, tel = "", ""  # 商店会などの連絡先は載せない
    return {
        "name": name, "kana": col(row, "名称_カナ", "名称カナ", "カナ", "ふりがな", "よみがな"), "ward": ward, "pos": pos, "addr": addr,
        "times": semi(times), "fee": semi(fee), "desc": semi(col(row, "説明", "概要", "紹介", ex=("英語",))), "access": semi(col(row, "アクセス方法", "アクセス", "交通")),
        "parking": semi(col(row, "駐車場情報", "駐車場")), "bf": semi(col(row, "バリアフリー情報", "バリアフリー")), "contact": contact, "tel": tel,
        "url": col(row, "URL", "ホームページ", "url", ex=("画像",)), "note": col(row, "備考"), "cat": col(row, "種別", "小分類", "分類", "カテゴリ", "ジャンル", "種類"),
        "no": col(row, "NO", "No", "No.", "番号", "ID"),
    }


def license_of(ds):
    t = (ds.get("license", "") + " " + ds.get("license_id", "")).lower()
    if "cc0" in t or "zero" in t:
        return "CC0"
    if ("表示" in t or "cc-by" in t or "cc by" in t or "attribution" in t) and "4.0" in t and "継承" not in t and "sa" not in t.replace("cc-by", ""):
        return "CC BY 4.0"
    if "政府標準利用規約" in t or "公共データ利用規約" in t:
        return ds.get("license", "")
    return ""


def load_ward_lists():
    sets = load("ckan/datasets.json", []) or []
    sets.sort(key=lambda ds: (WARDS.index(ds["ward"]) if ds.get("ward") in WARDS else 99, ds.get("title", ""), ds.get("name", "")))
    src, recs = [], []
    for ds in sets:
        title = ds.get("title", "")
        if SKIP_DS.search(title):
            continue
        if not re.search(r"観光施設|観光スポット|観光名所|観光", title):
            continue
        lic = license_of(ds)
        if not lic:
            print("  利用条件がわからないので使わない:", ds["ward"], title, ds.get("license"))
            continue
        rows = []
        for f in ds.get("files", []):
            rows += read_table(os.path.join(RAW, "ckan", f["file"]))
        if not rows:
            print("  表を読めない:", ds["ward"], title)
            continue
        si = len(src)
        src.append({"name": "%s「%s」" % (ds["ward"], re.sub(r"^%s[_＿・\s]*" % ds["ward"], "", title)), "url": ds.get("page", ""), "lic": lic, "licUrl": LIC_URL.get(lic, ds.get("license_url", ""))})
        n, seen = 0, set()
        for row in rows:
            r = ward_rec(row, ds["ward"])
            if not r:
                continue
            key = (nk(r["name"]), round(r["pos"][0], 3) if r["pos"] else None)
            if key in seen:
                continue  # 同じ一覧の、別の版のファイルにある同じ行
            seen.add(key)
            r["src"] = si
            recs.append(r)
            n += 1
        print("  区の一覧:", ds["ward"], title, n, "件", lic)
    return src, recs


def kind_by_name(n, cat=""):
    s = cat + " " + n
    if re.search(r"動物園|水族館|植物園|昆虫|ふれあい動物", s):
        return "動物園・水族館・植物園"
    if re.search(r"美術館|博物館|資料館|記念館|文学館|ミュージアム|科学館|展示館|ギャラリー|郷土館|史料館|プラネタリウム|museum", s, re.I) and not re.search(r"図書館|体育館|会館|公民館|区民館|旅館", n):
        return "博物館・美術館"
    if re.search(r"展望|タワー|スカイツリー", s):
        return "展望・タワー"
    if re.search(r"遊園地|テーマパーク|花やしき", s):
        return "遊園地・テーマパーク"
    if re.search(r"史跡|旧跡|遺跡|文化財|碑|像$|塚$|古墳|跡$|跡地|旧.+(邸|家|宅|住宅|書院)|墓|城$|本陣|一里塚|道標|庚申|石造物|門柱|親柱", s):
        return "史跡・文化財"
    if re.search(r"庭園|公園|緑地|緑道|親水|花壇|園$|森$", s):
        return "庭園・公園"
    if re.search(r"寺社|寺院|神社|寺$|稲荷|八幡|天神|天満宮|権現|明神|観音|不動尊|地蔵|大師|教会|院$|堂$|宮$|社$", s):
        return "寺社"
    return "名所"


def short_text(s, n=320):
    s = clean(s)
    if len(s) <= n:
        return s
    cut = s.rfind("。", 0, n)
    return s[:cut + 1] if cut > n // 3 else s[:n] + "…"


def fee_tag(s):
    if not s:
        return ""
    if "円" in s and "無料" not in s:
        return "料金:有料"
    if "無料" in s and "円" not in s and not re.search(r"有料|一部", s):
        return "料金:無料"
    return ""


def main():
    wards = load("wards.json", []) or []
    items = load("items.json", []) or []
    cl = load("classes.json", {"classes": {}}) or {"classes": {}}
    classes = cl["classes"]
    det = load("details.json", {}) or {}
    data = json.load(open(DATA, encoding="utf-8"))
    meta = data["meta"]
    towns = set(meta.get("kana", {}).keys())
    print("元データ: 区", len(wards), "項目", len(items), "詳しい情報", len(det))
    if len(wards) < 20 or len(items) < 1000:
        sys.exit("元データが足りないので作りません")

    # ---- Wikidata の項目 ----
    wd = {}
    for o in items:
        p = point(o["coord"])
        if not p or not inside(*p):
            continue
        o["pos"] = p
        o["ward"] = o["wards"][0]
        if len(o["wards"]) > 1:
            # 2つの区にまたがる項目：区役所が近いほうの区にする
            wc = {w["name"]: point(w.get("coord", "")) for w in wards}
            o["ward"] = min(o["wards"], key=lambda w: meters(p, wc[w]) if wc.get(w) else 1e9)
        d = det.get(o["id"], {})
        o["name"] = re.sub(r"\s*[(（][^)）]*(区|市|東京都)[)）]$", "", clean(d.get("label") or o.get("label") or ""))
        o["name"] = re.sub(r"\s*\(([^)]+)\)$", r"（\1）", o["name"])
        title = urllib.parse.unquote(o.get("article", "").split("/wiki/", 1)[-1]).replace("_", " ")
        m = re.match(re.escape(o["name"]) + r" \((.+)\)$", title)
        if m:
            place = re.sub(r"^(東京都)?(%s)" % "|".join(WARDS), "", m.group(1)).strip()
            if place and re.search(r"[町村]|丁目", place) and not place.startswith("の") and len(place) <= 12:
                o["name"] = "%s（%s）" % (o["name"], place)
        if not o["name"] or re.fullmatch(r"Q\d+", o["name"]):
            continue
        o["kind"], o["core"], o["shurui"] = wd_kind(o, classes)
        o["tour"] = any(set(classes.get(t, {}).get("roots", [])) & TOURIST for t in o["types"])
        o["famous"] = bool(o["heritage"]) or o["tour"] or o.get("sitelinks", 0) >= SITELINKS_MIN
        o["closed"] = closed(o, classes) and not o["heritage"]
        wd[o["id"]] = o
    # 同じ場所の項目が2つあるとき（名前が同じで300m以内）は、ウィキペディアの言語数が多いほうだけにする
    groups = {}
    for o in wd.values():
        if o["kind"]:
            groups.setdefault(nk(o["name"]), []).append(o)
    for g in groups.values():
        keep = []
        for o in sorted(g, key=lambda x: -x.get("sitelinks", 0)):
            if any(meters(o["pos"], k["pos"]) <= 300 for k in keep):
                del wd[o["id"]]
            else:
                keep.append(o)
    wd_list = list(wd.values())
    wgrid = Grid([o["pos"] for o in wd_list])
    wd_by_name = {}
    for o in wd_list:
        wd_by_name.setdefault(nk(o["name"]), []).append(o)
    picked = {i for i, o in wd.items() if o["kind"] and not o["closed"] and (o["core"] or o["famous"])}
    print("Wikidata で観光の種類が決まった項目", len(picked))

    # ---- 区の一覧と Wikidata を合わせる ----
    src, recs = load_ward_lists()
    places = {}  # id -> {"wd": 項目, "rows": [区の一覧の行]}
    for i in picked:
        places["kk-" + i] = {"wd": wd[i], "rows": []}
    loose = []
    for r in recs:
        hit, best = None, (0, 1e9)
        if r["pos"]:
            for k in wgrid.near(r["pos"]):
                o = wd_list[k]
                d = meters(r["pos"], o["pos"])
                s = close_enough(r["name"], o["name"], d)
                # 片方がもう片方を含むだけのときは、観光の種類が決まる項目のときだけ同じ場所とみる（駅や町と取り違えないように）
                if s and (s >= 2 or o["kind"]) and (s, -d) > (best[0], -best[1]):
                    hit, best = o, (s, d)
        else:
            c = [o for o in wd_by_name.get(nk(r["name"]), []) if o["ward"] == r["ward"]]
            if len(c) == 1:
                hit = c[0]
        if hit:
            # 区の一覧に載っていれば、Wikidata で閉じたことになっていても入れる（区の一覧のほうが新しい）
            places.setdefault("kk-" + hit["id"], {"wd": hit, "rows": []})["rows"].append(r)
        else:
            loose.append(r)
    # 一覧だけにある場所（同じ名前で近い所はまとめる）
    loose_by_name = {}
    for r in loose:
        if not r["pos"]:
            print("  位置がないので入れない:", r["ward"], r["name"])
            continue
        n = nk(r["name"])
        same = next((pid for pid, q in loose_by_name.get(n, []) if meters(q, r["pos"]) <= 300), None)
        if same:
            places[same]["rows"].append(r)
            continue
        key = "kk-%d-%s" % (WARD_CODE[r["ward"]], hashlib.sha1(n.encode()).hexdigest()[:6])
        while key in places:
            key += "x"
        places[key] = {"wd": None, "rows": [r]}
        loose_by_name.setdefault(n, []).append((key, r["pos"]))

    # ---- 地図にすでにある場所と同じものは足さない ----
    ex = [o for o in data["items"] if o.get("c") in ("1", "5", "6", "7", "11") and isinstance(o.get("y"), (int, float))]
    egrid = Grid([(o["y"], o["x"]) for o in ex])
    ex_areas = meta["areas"]
    ex_once = {}
    for e in ex:
        key = (ex_areas[e["a"]], nk(e["n"]))
        ex_once[key] = None if key in ex_once else e
    same_list, out_places = [], []
    for pid, pl in places.items():
        o, rows = pl["wd"], pl["rows"]
        pos = o["pos"] if o else rows[0]["pos"]
        names = ([o["name"]] if o else []) + [r["name"] for r in rows]
        hit, best = None, (0, 1e9)
        for k in egrid.near(pos):
            e = ex[k]
            d = meters(pos, (e["y"], e["x"]))
            s = max([close_enough(n, e["n"], d) for n in names] + [close_enough(n, e["on"], d) for n in names if e.get("on")])
            if s and (s, -d) > (best[0], -best[1]):
                hit, best = e, (s, d)
        if not hit:
            ward0 = o["ward"] if o else rows[0]["ward"]
            for n in names:
                e = ex_once.get((ward0, nk(n)))
                if e and meters(pos, (e["y"], e["x"])) <= 1500:
                    hit = e
                    break
        kind = (o and o["kind"]) or kind_by_name(rows[0]["name"], rows[0].get("cat", ""))
        pl["kind"], pl["pos"] = kind, pos
        if hit:
            ek = {"5": "博物館・美術館", "6": "動物園・水族館・植物園", "1": "庭園・公園", "11": "名所"}.get(hit["c"]) or \
                {"7-1": "展望・タワー", "7-2": "遊園地・テーマパーク", "7-3": "寺社", "7-4": "史跡・文化財"}.get(hit.get("s", ""), kind)
            same_list.append((hit["i"], ek, (hit["y"], hit["x"])))
        else:
            out_places.append((pid, pl))
    print("地図にすでにある場所と同じ", len(same_list), "／新しく足す", len(out_places))
    # 並び：区の順・観光の種類の順・よく知られている順（ウィキペディアの言語数）・名前の順
    kind_order = list(KINDS)

    def order(e):
        pid, pl = e
        o, rows = pl["wd"], pl["rows"]
        ward = o["ward"] if o else rows[0]["ward"]
        return (WARDS.index(ward), kind_order.index(pl["kind"]), -(o.get("sitelinks", 0) if o else 0), o["name"] if o else rows[0]["name"], pid)
    out_places.sort(key=order)
    same_list.sort()

    # ---- 駅（Wikidata の項目のうち、駅・停留場の種類のもの） ----
    st_cls = {c for c, v in classes.items() if STATION.search(v.get("en", "") + "|" + v.get("ja", "")) and not NOT_STATION.search(v.get("en", "") + "|" + v.get("ja", ""))}
    sts = []
    for s in items:
        if not st_cls & set(s["types"]) or any(NOT_STATION.search(classes.get(t, {}).get("en", "") + "|" + classes.get(t, {}).get("ja", "")) for t in s["types"]):
            continue
        p = point(s.get("coord"))
        lb = clean(s.get("label", ""))
        if not p or not lb or s.get("end") or s.get("closed") or re.search(r"信号場|貨物|操車場|車両基地|臨時|仮駅|旧|廃", lb):
            continue
        nm = re.sub(r"[(（][^)）]*[)）]", "", lb)
        nm = re.sub(r"(駅|停留場|停留所|電停)$", "", nm).strip()
        if nm:
            sts.append((nm, p))
    sgrid = Grid([p for _, p in sts], cell=0.02)

    def nearest_station(pos):
        best = None
        for k in sgrid.near(pos, 2):
            d = meters(pos, sts[k][1])
            if best is None or d < best[1]:
                best = (sts[k][0], d)
        return best

    # ---- 出力 ----
    tags, tag_i = [], {}
    labels = ["文化財", "時間・休み", "料金", "最寄駅", "駐車場", "バリアフリー", "補足"]

    def T(t):
        if t not in tag_i:
            tag_i[t] = len(tags)
            tags.append(t)
        return tag_i[t]

    def L(name):
        return labels.index(name)

    areas = [w for w in WARDS]
    kinds_n = {k: 0 for k in KINDS}
    out_items = []
    all_pts = [(pl["pos"], pid) for pid, pl in out_places] + [(pos, eid) for eid, _, pos in same_list]
    agrid = Grid([p for p, _ in all_pts])
    for pid, pl in out_places:
        o, rows, kind, pos = pl["wd"], pl["rows"], pl["kind"], pl["pos"]
        r0 = rows[0] if rows else {}
        ward = o["ward"] if o else r0["ward"]
        d = det.get(o["id"], {}) if o else {}
        name = o["name"] if o else r0["name"]
        aka = []
        for x in (d.get("kana", []) + d.get("aliases", []) + [r.get("kana", "") for r in rows] + [r["name"] for r in rows]):
            x = clean(x)
            if x and x != name and x not in aka and len("・".join(aka + [x])) <= 140:
                aka.append(x)
        official = next((clean(x) for x in d.get("official", []) if clean(x) and clean(x) != name and nk(name) in nk(x)), "")
        addr = next((r["addr"] for r in rows if r["addr"]), "") or next((clean(x) for x in d.get("addrs", []) if clean(x)), "")
        addr = re.sub(r"^〒?\s*\d{3}-?\d{4}\s*", "", addr)
        town = ward
        if ward == "板橋区":
            m = re.match(r"(東京都)?板橋区(.+?)(\d|[一二三四五六七八九十]+丁目|$)", unicodedata.normalize("NFKC", addr))
            town = m.group(2) if m and m.group(2) in towns else "板橋区内"
        desc = next((short_text(r["desc"]) for r in rows if r.get("desc")), "") or clean(d.get("desc", ""))
        sp = []
        her = [classes.get(h, {}).get("ja", "") for h in (o["heritage"] if o else [])]
        her = [h for h in her if h]
        if her:
            sp.append([L("文化財"), "・".join(dict.fromkeys(her))])
        for key, lb in (("times", "時間・休み"), ("fee", "料金"), ("access", "最寄駅"), ("parking", "駐車場"), ("bf", "バリアフリー"), ("note", "補足")):
            v = next((short_text(r[key], 240) for r in rows if r.get(key)), "")
            if v and v not in ("-", "－", "なし", "無し", "特になし") or (key == "parking" and v):
                sp.append([L(lb), v])
        tg = [T("観光:" + kind), T("エリア:" + ward)]
        if KINDS[kind][3]:
            tg.append(T("目的:" + KINDS[kind][3]))
        shurui = o["shurui"] if o else ""
        if shurui:
            tg.append(T("施設の種類:" + shurui))
        ft = next((fee_tag(r["fee"]) for r in rows if r.get("fee")), "")
        if ft:
            tg.append(T(ft))
        if kind == "博物館・美術館" or shurui == "水族館":
            tg.append(T("時間・天候:屋内"))
        st = nearest_station(pos)
        if st and st[1] <= 1200:
            tg.append(T("最寄り駅:" + st[0]))
        LANG = re.compile(r"//(?!(?:jp|ja)\.)([a-z]{2}|zh-[a-z]+)\.|/(en|zh|ko|id|th|vi|fr|de|es|it|ru|cn|tw|zh-cn|zh-tw|zh-hans|zh-hant|english|chinese|korean)(/|$)", re.I)
        sites = sorted((u for u in d.get("sites", []) if u.startswith("http")),
                       key=lambda u: (0 if not LANG.search(u) else 1 if re.search(r"//en\.|/en(/|$)|english", u, re.I) else 2, "/ja" not in u, len(u)))
        site = sites[0] if sites else ""
        rurl = next((r["url"] for r in rows if r.get("url", "").startswith("http")), "")
        ph = []
        for r in rows:
            m = re.search(r"0\d{1,4}[-‐－ ]\d{1,4}[-‐－ ]\d{3,4}", unicodedata.normalize("NFKC", r.get("tel", "")))
            if not m:
                continue
            num = re.sub(r"[‐－ ]", "-", m.group(0))
            note = clean(unicodedata.normalize("NFKC", r["tel"]).replace(m.group(0), "")).strip("()（）")
            note = "、".join(x for x in (r.get("contact", ""), note) if x and x != num)
            if not any(p[1] == num for p in ph):
                ph.append(["電話", num, note, 0])
        ks = (["wd", "wp"] if o else []) + list(dict.fromkeys(r["src"] for r in rows))
        rel = []
        for k in agrid.near(pos):
            q, qid = all_pts[k]
            if qid == pid:
                continue
            dd = meters(pos, q)
            if dd <= 1000:
                rel.append((dd, qid))
        rel.sort()
        x = {"i": pid, "c": KINDS[kind][2], "n": name, "t": town, "a": areas.index(ward), "y": round(pos[0], 6), "x": round(pos[1], 6), "f": 0,
             "tg": tg, "ck": TODAY, "ks": ks}
        a0 = re.sub(r"^東京都", "", unicodedata.normalize("NFKC", addr))
        x["gq"] = (name + " 東京都" + (a0 if a0.startswith(ward) else ward + " " + a0)).strip()
        if official:
            x["on"] = official
        if aka:
            x["k"] = "・".join(aka)
        if addr:
            x["ad"] = addr
        if desc:
            x["ld"] = desc
        if sp:
            x["sp"] = sp
        if site:
            x["u"], x["ul"] = site, "公式ページ"
        elif rurl:
            x["u"], x["ul"] = rurl, "案内ページ"
        if ph:
            x["ph"] = ph
        if o:
            x["wd"] = o["id"]
            if o.get("article"):
                x["wp"] = urllib.parse.unquote(o["article"].split("/wiki/", 1)[-1]).replace("_", " ")
        if st and 30 <= st[1] <= 3000:
            x["sd"] = [st[0], round_m(st[1])]
        if rel:
            x["re"] = [[q, round_m(dd)] for dd, q in rel[:3]]
        out_items.append(x)
        kinds_n[kind] += 1
    same_out = {}
    for eid, kind, _ in same_list:
        if eid not in same_out:
            same_out[eid] = {T("観光:" + kind)}
            kinds_n[kind] += 1
    kinds = sorted(([k, KINDS[k][0], n, KINDS[k][1]] for k, n in kinds_n.items() if n), key=lambda k: -k[2])
    out = {
        "v": 1, "made": TODAY, "areas": areas, "cats": {c: dict(v, count=sum(1 for x in out_items if x["c"] == c)) for c, v in CATS.items()},
        "labels": labels, "tags": tags, "facets": [["観光", 0]], "kinds": kinds, "src": src,
        "same": [[eid, sorted(v)] for eid, v in sorted(same_out.items())], "items": out_items,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("kanko.json:", len(out_items), "か所（地図にある場所に種類を付けたもの", len(same_out), "）", os.path.getsize(OUT) // 1024, "KB")
    for k in kinds:
        print("  ", k[0], k[2])
    byw = {}
    for x in out_items:
        byw[areas[x["a"]]] = byw.get(areas[x["a"]], 0) + 1
    print("  区ごと:", " ".join("%s %d" % (w, byw.get(w, 0)) for w in WARDS))


if __name__ == "__main__":
    main()
