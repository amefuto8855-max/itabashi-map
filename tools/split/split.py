"""地図のデータ（data.json と kanko.json）を、区（市）ごとのファイルに分ける

使い方: python split.py <data.json> <kanko.json> <出力フォルダ> [元データのフォルダ（町名の控えを置く）]

出力（出力フォルダの中）:
  idx.json          … 全体の情報。分類・タグなどの一覧、区ごとのファイル・件数・範囲・町名、観光の目的の情報、件数
  q.json            … 検索と共有リンクに使う目次（場所ごとの id・区・名前など）
  d/<区のコード>.json … 区ごとの場所

町名は、住所から取る。住所から取れない場所は、国土地理院の逆ジオコーダで調べる（元データのフォルダを渡したときだけ。
調べた結果は towns.json に控え、次の回はまだ調べていない場所だけを調べる）。
"""
import json
import os
import re
import sys
import time
import unicodedata
import urllib.request

DATA, KANKO, OUT = sys.argv[1:4]
RAW = sys.argv[4] if len(sys.argv) > 4 else ""
UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
PREV = "https://raw.githubusercontent.com/amefuto8855-max/itabashi-map/kanko-src/towns.json"
REV = "https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=%.6f&lon=%.6f"

# 区（市）のコード（全国地方公共団体コードの上5けた）。並びは、板橋区のあとに23区の順、そのあと周辺の市
CODES = {
    "板橋区": "13119",
    "千代田区": "13101", "中央区": "13102", "港区": "13103", "新宿区": "13104", "文京区": "13105", "台東区": "13106", "墨田区": "13107",
    "江東区": "13108", "品川区": "13109", "目黒区": "13110", "大田区": "13111", "世田谷区": "13112", "渋谷区": "13113", "中野区": "13114",
    "杉並区": "13115", "豊島区": "13116", "北区": "13117", "荒川区": "13118", "練馬区": "13120", "足立区": "13121", "葛飾区": "13122",
    "江戸川区": "13123",
    "川口市": "11203", "戸田市": "11224", "蕨市": "11223", "和光市": "11229", "朝霞市": "11227", "新座市": "11230",
}
ORDER = list(CODES)


def load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def nfkc(s):
    return unicodedata.normalize("NFKC", s or "")


KANSUJI = "〇一二三四五六七八九十"


def town_name(s):
    """「九段北三丁目」「高島平1丁目」「大字下戸田」などから、町名だけを取り出す"""
    s = nfkc(s).strip()
    s = re.sub(r"^大字", "", s)
    s = re.sub(r"[" + KANSUJI + r"\d]+丁目$", "", s)
    s = re.sub(r"[\d\-]+$", "", s)
    return s.strip()


def town_from_addr(ad, area):
    a = re.sub(r"^東京都|^埼玉県", "", nfkc(ad)).strip()
    if not a.startswith(area):
        return ""
    a = a[len(area):]
    m = re.match(r"([^\d\-‐－ 　\[\]（）()、,]+?)(?:[" + KANSUJI + r"]+丁目|\d|$)", a)
    t = town_name(m.group(1)) if m else ""
    return t if 1 <= len(t) <= 12 else ""


def get_json(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    D, K = load(DATA), load(KANKO)
    M = D["meta"]

    # ---- 一覧（分類・タグ・項目名）を、観光スポットの分も入れた形にする ----
    areas, tags, labels = list(M["areas"]), list(M["tags"]), list(M["labels"])
    ai = {v: i for i, v in enumerate(areas)}
    ti = {v: i for i, v in enumerate(tags)}
    li = {v: i for i, v in enumerate(labels)}

    def idx(m, arr, v):
        if v not in m:
            m[v] = len(arr)
            arr.append(v)
        return m[v]

    a_map = [idx(ai, areas, v) for v in K.get("areas", [])]
    t_map = [idx(ti, tags, v) for v in K.get("tags", [])]
    l_map = [idx(li, labels, v) for v in K.get("labels", [])]
    cats = dict(M["cats"])
    for c, v in K.get("cats", {}).items():
        cats.setdefault(c, v)
    facets = list(M["facets"])
    for f in K.get("facets", []):
        if not any(g[0] == f[0] for g in facets):
            facets.append(f)

    items = [dict(o) for o in D["items"]]
    by_id = {o["i"]: o for o in items}
    for s in K.get("same", []):
        o = by_id.get(s[0])
        if o:
            for k in s[1]:
                t = t_map[k]
                if t not in o["tg"]:
                    o["tg"].append(t)
    for o in K.get("items", []):
        if o["i"] in by_id:
            continue
        x = dict(o)
        x["a"] = a_map[o["a"]]
        x["tg"] = [t_map[k] for k in o["tg"]]
        x["sp"] = [[l_map[s[0]], s[1]] for s in o.get("sp", [])]
        x["kk"] = 1
        items.append(x)
        by_id[x["i"]] = x

    here = os.path.dirname(os.path.abspath(__file__))
    # ---- 上書き（extra.json）：公式ページで調べた時間・休み・料金・最寄駅など。項目名で書く ----
    ex_p = os.path.join(here, "extra.json")
    n_ex = 0
    # 上書きした場所は、行を見る順に並べ直す（ない項目名は「補足」の手前）
    order = ["見学", "できること", "時間", "営業時間", "休み", "時間・休み", "料金", "割引", "予約", "注意", "最寄駅", "バス", "駐車場", "駐輪場",
             "支払い", "利用条件", "持ち物", "季節", "行事", "子連れ", "バリアフリー", "飲食", "学習席・PC・Wi-Fi", "無料Wi-Fi", "文化財", "運営", "補足", "所在地"]
    rank = {}
    for n, lab in enumerate(order):
        if lab in li:
            rank[li[lab]] = n
    for iid, e in (load(ex_p).get("items", {}) if os.path.exists(ex_p) else {}).items():
        o = by_id.get(iid)
        if not o:
            print("上書きする場所が見つかりません", iid)
            continue
        new = [[idx(li, labels, lab), txt] for lab, txt in e.get("sp", [])]
        drop = {r[0] for r in new}
        if drop & {li.get("時間"), li.get("休み")}:
            drop.add(li.get("時間・休み"))  # 「時間」「休み」を書いたら、まとめ書きの古い行は外す
        for lab in e.get("drop", []):
            drop.add(li.get(lab))
        rows = [r for r in o.get("sp", []) if r[0] not in drop] + new
        rows.sort(key=lambda r: rank.get(r[0], rank.get(li.get("補足"), 90) - 0.5))
        o["sp"] = rows
        if o.get("un"):
            o["un"] = [k for k in o["un"] if k not in drop]
            if not o["un"]:
                del o["un"]
        for k in ("so", "no"):
            if e.get(k):
                o[k] = e[k] + [x for x in o.get(k, []) if x not in e[k]]
        for k in ("ck", "ld", "u", "ul"):
            if e.get(k):
                o[k] = e[k]
        n_ex += 1
    print("上書きした場所", n_ex)
    # ---- 「補足」に紛れている、元データの内部の注記（座標精度）を外す ----
    hs = li.get("補足")
    for o in items:
        if hs is None or not o.get("sp"):
            continue
        sp2 = []
        for lab, txt in o["sp"]:
            if lab == hs and "座標精度" in txt:
                txt = re.sub(r"・?\s*座標精度[:：][^・■]*", "", txt).strip(" 、。")
                if not txt:
                    continue
            sp2.append([lab, txt])
        o["sp"] = sp2

    # ---- 町名：住所から。取れない場所は逆ジオコーダ（控えを使う） ----
    cache = {}
    if RAW:
        try:
            cache = get_json(PREV, timeout=60)
        except Exception as e:  # noqa: BLE001
            print("前回の町名の控えはありません", repr(e)[:80])
    asked = 0
    t0 = time.time()
    unknown = 0
    for o in items:
        area = areas[o["a"]]
        t = o.get("t", "")
        if area == "板橋区" and t and t != "板橋区内":
            continue  # 板橋区の場所は、もとの町名を使う
        t = town_from_addr(o.get("ad", ""), area)
        if not t and isinstance(o.get("y"), (int, float)):
            key = "%.5f,%.5f" % (o["y"], o["x"])
            if key not in cache and RAW and time.time() - t0 < 20 * 60:
                try:
                    j = get_json(REV % (o["y"], o["x"]))
                    r = j.get("results") or {}
                    cache[key] = [r.get("muniCd", ""), r.get("lv01Nm", "")]
                except Exception as e:  # noqa: BLE001
                    print("町名を調べられませんでした", key, repr(e)[:80])
                asked += 1
                time.sleep(0.3)
            c = cache.get(key)
            if c and c[1] and c[1] != "－":
                t = town_name(c[1])
        if not t:
            t = area + "内"  # 町名がわからない場所（一覧では「町名の記載がない場所」）
            unknown += 1
        o["t"] = t
    if RAW:
        with open(os.path.join(RAW, "towns.json"), "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    print("町名を逆ジオコーダで調べた数", asked, "／町名がわからない場所", unknown)

    # ---- 区ごとに分ける ----
    by_area = {}
    for o in items:
        by_area.setdefault(areas[o["a"]], []).append(o)
    kana = M.get("kana", {})
    area_rows, files = [], {}
    for name in sorted(by_area, key=lambda a: (ORDER.index(a) if a in ORDER else 999, a)):
        lst = by_area[name]
        code = CODES.get(name) or "x%04d" % areas.index(name)
        files[code] = {"v": 2, "area": name, "items": lst}
        pts =[(o["y"], o["x"]) for o in lst if isinstance(o.get("y"), (int, float)) and not o.get("sa")]
        bb = [round(min(p[0] for p in pts), 4), round(min(p[1] for p in pts), 4), round(max(p[0] for p in pts), 4), round(max(p[1] for p in pts), 4)] if pts else None
        towns = {}
        for o in lst:
            towns[o["t"]] = towns.get(o["t"], 0) + 1
        tl = sorted(towns.items(), key=lambda kv: (kv[0] == name + "内", kana.get(kv[0], kv[0])))
        area_rows.append([code, name, len(lst), bb, [[t, n] for t, n in tl]])

    def n_of(test):
        return sum(1 for o in items if test(o))
    kk_tag = {i for i, t in enumerate(tags) if t.startswith("観光:")}
    # 目的ごとの件数（最初の画面のボタンに出す全体の数）。目的の決まりは purposes.json（地図の設定から書き出したもの）
    pn = {"kanko": n_of(lambda o: any(t in kk_tag for t in o["tg"]))}
    pp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "purposes.json")
    if os.path.exists(pp):
        for p in load(pp):
            if p.get("tags"):
                want = {ti[t] for t in p["tags"] if t in ti}
                pn[p["key"]] = n_of(lambda o: any(t in want for t in o["tg"]))
            else:
                cs = set(p.get("cats") or [])
                pn[p["key"]] = n_of(lambda o: o["c"] in cs)
    meta = {k: v for k, v in M.items() if k not in ("areas", "tags", "labels", "cats", "facets")}
    meta.update({"areas": areas, "tags": tags, "labels": labels, "cats": cats, "facets": facets})
    idx_out = {
        "v": 2, "meta": meta, "files": area_rows,
        "kk": {"made": K.get("made", ""), "kinds": K.get("kinds", []), "src": K.get("src", [])},
        "n": {"all": len(items), "food": n_of(lambda o: int(o["c"]) >= 100), "kanko": pn["kanko"]}, "pn": pn,
    }
    q = [[o["i"], o["a"], o["n"], " ".join(x for x in (o.get("on", ""), o.get("k", ""), o["t"]) if x)] for o in items]

    # ---- おすすめの場所（pick.json）：地図を開いたときのカードで、2つの一覧（23区の100か所・板橋区の公共施設）を交互に出す ----
    picks = None
    if os.path.exists(os.path.join(here, "pick.json")):
        km = {}
        for cand in (os.path.join(OUT, "kanko_more.json"), os.path.join(os.path.dirname(os.path.abspath(KANKO)), "kanko_more.json")):
            if os.path.exists(cand):
                km = load(cand).get("items", {})
                break
        picks = []
        for fn, title in (("pick.json", "特に行くべき100か所"), ("pick_itb.json", "板橋区のおすすめ公共施設")):
            pth = os.path.join(here, fn)
            if not os.path.exists(pth):
                continue
            src_l = load(pth)
            rows = []
            for iid, why, tier in src_l["items"]:
                o = by_id.get(iid)
                if not o:
                    print("おすすめの場所が見つかりません", iid)
                    continue
                if not o.get("pk"):
                    o["pk"] = tier  # 両方の一覧にある場所は、先の一覧（23区の100か所）の段を残す
                ph = (km.get(iid) or {}).get("p")
                rows.append([iid, o["n"], areas[o["a"]], why, tier, ph or 0, o["c"]])
            picks.append({"t": src_l.get("t") or title, "items": rows})
            print("おすすめの場所", src_l.get("t") or title, len(rows), "（写真あり", sum(1 for r in rows if r[5]), "）")

    # ---- 書き出す（全部を作り終えてから。途中で失敗したときに、ファイルどうしが食い違わないように） ----
    def dump(path, obj):
        with open(path + ".tmp", "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
    os.makedirs(os.path.join(OUT, "d"), exist_ok=True)
    for code, obj in files.items():
        dump(os.path.join(OUT, "d", code + ".json"), obj)
    dump(os.path.join(OUT, "q.json"), {"v": 2, "q": q})
    dump(os.path.join(OUT, "idx.json"), idx_out)
    if picks is not None:
        dump(os.path.join(OUT, "pick.json"), {"v": 2, "lists": picks, "items": picks[0]["items"] if picks else []})
    for f in os.listdir(os.path.join(OUT, "d")):
        if f.endswith(".json") and f[:-5] not in files:
            os.remove(os.path.join(OUT, "d", f))
    for code in files:
        os.replace(os.path.join(OUT, "d", code + ".json.tmp"), os.path.join(OUT, "d", code + ".json"))
    os.replace(os.path.join(OUT, "q.json.tmp"), os.path.join(OUT, "q.json"))
    os.replace(os.path.join(OUT, "idx.json.tmp"), os.path.join(OUT, "idx.json"))
    if picks is not None:
        os.replace(os.path.join(OUT, "pick.json.tmp"), os.path.join(OUT, "pick.json"))
    for r in area_rows:
        print("  ", r[1], r[0], r[2], "件", "町名", len(r[4]))
    print("idx.json", os.path.getsize(os.path.join(OUT, "idx.json")) // 1024, "KB ／ q.json", os.path.getsize(os.path.join(OUT, "q.json")) // 1024, "KB ／ 場所", len(items))


if __name__ == "__main__":
    main()
