"""東京23区の観光スポットの元データを集める（GitHub Actions で動かす）。

  python fetch.py <出力フォルダ>

集めるもの
  wards.json      23区の Wikidata の項目
  items.json      23区にあり、位置と日本語版ウィキペディアの記事がある Wikidata の項目（区ごと）
  classes.json    項目の種類（P31）の名前と、どの大きな種類に入るか
  details.json    観光スポットの候補の名前・説明・読み・公式サイトなど
  stations.json   駅と停留所（最寄り駅を出すため）
  ckan/           東京都オープンデータカタログにある、各区の観光施設の一覧
  log.txt         取得の記録
"""
import json
import os
import sys
import time
import traceback
import urllib.parse
import urllib.request

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
WDQS = "https://query.wikidata.org/sparql"
CKAN = "https://catalog.data.metro.tokyo.lg.jp/api/3/action/"
WARDS = ["千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区",
         "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区"]
# 観光スポットの候補にする大きな種類（ここに入る種類の項目だけ、詳しい情報を取る。最後に選ぶのは build.py）
ROOTS = {
    "Q570116": "観光地", "Q33506": "博物館", "Q207694": "美術館", "Q1007870": "美術館・画廊", "Q2087181": "歴史的な家の博物館",
    "Q43501": "動物園", "Q2281788": "水族館", "Q167346": "植物園", "Q148319": "プラネタリウム",
    "Q1107656": "庭園", "Q22698": "公園", "Q54050": "丘",
    "Q5393308": "寺", "Q845945": "神社", "Q44539": "寺院", "Q16970": "教会堂", "Q32815": "モスク", "Q24398318": "宗教建築",
    "Q839954": "遺跡", "Q1081138": "史跡", "Q4989906": "記念碑", "Q5003624": "記念物", "Q179700": "像", "Q23413": "城",
    "Q358": "遺産", "Q210272": "文化遺産", "Q35112127": "歴史的建造物", "Q53060": "門", "Q16560": "宮殿", "Q2319498": "ランドマーク",
    "Q12518": "塔", "Q1440300": "展望塔", "Q11303": "超高層ビル",
    "Q194195": "遊園地", "Q2416723": "テーマパーク", "Q24354": "劇場", "Q12280": "橋", "Q39614": "墓地", "Q483110": "スタジアム",
    "Q132510": "市場", "Q37654": "市場（経済）", "Q1076486": "スポーツ施設",
}
OUT = None
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    LOG.append(s)
    print(s, flush=True)


def save(name, obj):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=0)


def get(url, data=None, headers=None, tries=6, timeout=120):
    h = {"User-Agent": UA}
    h.update(headers or {})
    err = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=h)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            err = e
            wait = 5 * (k + 1)
            if e.code == 429:
                ra = e.headers.get("Retry-After")
                wait = int(ra) if ra and ra.isdigit() else 30 * (k + 1)
            elif e.code in (400, 403, 404):
                break
            log("  再試行", e.code, url[:120], "待ち", wait)
            time.sleep(wait)
        except Exception as e:  # noqa: BLE001
            err = e
            log("  再試行", repr(e)[:160], url[:120])
            time.sleep(5 * (k + 1))
    raise RuntimeError("取得できませんでした: %s %r" % (url[:160], err))


def sparql(q, tries=3):
    body = urllib.parse.urlencode({"query": q}).encode()
    raw = get(WDQS, data=body, headers={"Accept": "application/sparql-results+json", "Content-Type": "application/x-www-form-urlencoded"}, tries=tries)
    time.sleep(1.2)
    try:
        rows = json.loads(raw)["results"]["bindings"]
    except ValueError:
        raise RuntimeError("SPARQL の結果を読めませんでした: " + raw[:300].decode("utf-8", "replace"))
    return [{k: v["value"] for k, v in r.items()} for r in rows]


def qid(u):
    return u.rsplit("/", 1)[-1]


def chunks(a, n):
    for i in range(0, len(a), n):
        yield a[i:i + n]


def values(ids):
    return " ".join("wd:" + i for i in ids)


# ---- 23区 ----
def fetch_wards():
    names = " ".join('"%s"@ja' % w for w in WARDS)
    rows = sparql("""
SELECT ?w ?name ?coord ?end (COUNT(DISTINCT ?sl) AS ?n) WHERE {
  VALUES ?name { %s }
  ?w rdfs:label ?name ; wdt:P131 wd:Q1490 .
  OPTIONAL { ?w wdt:P625 ?coord }
  OPTIONAL { ?w wdt:P576 ?end }
  OPTIONAL { ?sl schema:about ?w }
} GROUP BY ?w ?name ?coord ?end""" % names)
    got = {r["name"] for r in rows}
    if len(got) < len(WARDS):
        log("区の一部が見つからないので、都心からの距離で探します", sorted(set(WARDS) - got))
        rows += sparql("""
SELECT ?w ?name ?coord ?end (COUNT(DISTINCT ?sl) AS ?n) WHERE {
  VALUES ?name { %s }
  ?w rdfs:label ?name ; wdt:P17 wd:Q17 ; wdt:P625 ?coord .
  FILTER(geof:distance(?coord, "Point(139.7671 35.6812)"^^geo:wktLiteral) < 20)
  OPTIONAL { ?w wdt:P576 ?end }
  OPTIONAL { ?sl schema:about ?w }
} GROUP BY ?w ?name ?coord ?end""" % names)
    best = {}
    for r in rows:
        if r.get("end"):
            continue
        n = int(r.get("n", "0"))
        if r["name"] not in best or n > best[r["name"]][1]:
            best[r["name"]] = (r, n)
    wards = []
    for w in WARDS:
        if w not in best:
            log("区が見つかりません:", w)
            continue
        r = best[w][0]
        wards.append({"name": w, "id": qid(r["w"]), "coord": r.get("coord", "")})
    log("区", len(wards), " ".join(x["name"] + "=" + x["id"] for x in wards))
    save("wards.json", wards)
    return wards


# ---- 区にある項目（位置と日本語版ウィキペディアの記事があるもの） ----
ITEM_Q = """
SELECT ?item (SAMPLE(?c) AS ?coord) (SAMPLE(?a) AS ?article) (SAMPLE(?lb) AS ?label)
  (GROUP_CONCAT(DISTINCT ?t; separator=" ") AS ?types)
  (GROUP_CONCAT(DISTINCT ?h; separator=" ") AS ?heritage)
  (GROUP_CONCAT(DISTINCT ?u; separator=" ") AS ?use)
  (SAMPLE(?e) AS ?end) (SAMPLE(?e2) AS ?closed)
WHERE {
  ?item %s wd:%s ; wdt:P625 ?c .
  ?a schema:about ?item ; schema:isPartOf <https://ja.wikipedia.org/> .
  OPTIONAL { ?item rdfs:label ?lb . FILTER(LANG(?lb) = "ja") }
  OPTIONAL { ?item wdt:P31 ?tt . BIND(STRAFTER(STR(?tt), "entity/") AS ?t) }
  OPTIONAL { ?item wdt:P1435 ?hh . BIND(STRAFTER(STR(?hh), "entity/") AS ?h) }
  OPTIONAL { ?item wdt:P5817 ?uu . BIND(STRAFTER(STR(?uu), "entity/") AS ?u) }
  OPTIONAL { ?item wdt:P576 ?e }
  OPTIONAL { ?item wdt:P3999 ?e2 }
}
GROUP BY ?item"""


def fetch_items(wards):
    out = {}
    for w in wards:
        rows = None
        for path in ("wdt:P131+", "wdt:P131/wdt:P131?/wdt:P131?"):
            try:
                rows = sparql(ITEM_Q % (path, w["id"]))
                break
            except Exception as e:  # noqa: BLE001
                log("  取得に失敗（別の書き方で再試行）", w["name"], repr(e)[:200])
        if rows is None:
            log("区の項目を取れませんでした:", w["name"])
            continue
        for r in rows:
            i = qid(r["item"])
            o = out.get(i)
            if o:
                o["wards"].append(w["name"])
                continue
            out[i] = {
                "id": i, "label": r.get("label", ""), "coord": r.get("coord", ""), "article": r.get("article", ""),
                "types": r.get("types", "").split(), "heritage": r.get("heritage", "").split(), "use": r.get("use", "").split(),
                "end": r.get("end", ""), "closed": r.get("closed", ""), "wards": [w["name"]],
            }
        log("  ", w["name"], len(rows), "件")
    items = list(out.values())
    log("項目", len(items))
    save("items.json", items)
    return items


# ---- 種類 ----
def fetch_classes(items):
    cls = set()
    for o in items:
        cls.update(o["types"])
        cls.update(o["heritage"])
        cls.update(o["use"])
    cls = sorted(cls)
    info = {c: {"ja": "", "en": "", "roots": []} for c in cls}
    for part in chunks(cls, 250):
        for r in sparql("""
SELECT ?c ?ja ?en WHERE {
  VALUES ?c { %s }
  OPTIONAL { ?c rdfs:label ?ja . FILTER(LANG(?ja) = "ja") }
  OPTIONAL { ?c rdfs:label ?en . FILTER(LANG(?en) = "en") }
}""" % values(part)):
            o = info[qid(r["c"])]
            o["ja"] = o["ja"] or r.get("ja", "")
            o["en"] = o["en"] or r.get("en", "")
        for r in sparql("""
SELECT DISTINCT ?c ?r WHERE {
  VALUES ?c { %s }
  VALUES ?r { %s }
  ?c wdt:P279* ?r .
}""" % (values(part), values(sorted(ROOTS)))):
            o = info[qid(r["c"])]
            o["roots"].append(qid(r["r"]))
    log("種類", len(info), "うち候補の種類", sum(1 for o in info.values() if o["roots"]))
    save("classes.json", {"roots": ROOTS, "classes": info})
    return info


# ---- 候補の詳しい情報 ----
DETAIL_Q = """
SELECT ?item (SAMPLE(?ja) AS ?label) (SAMPLE(?d) AS ?desc)
  (GROUP_CONCAT(DISTINCT ?k; separator="|||") AS ?kana)
  (GROUP_CONCAT(DISTINCT STR(?s); separator="|||") AS ?sites)
  (GROUP_CONCAT(DISTINCT ?al; separator="|||") AS ?aliases)
  (GROUP_CONCAT(DISTINCT ?ad; separator="|||") AS ?addrs)
  (GROUP_CONCAT(DISTINCT ?on; separator="|||") AS ?official)
WHERE {
  VALUES ?item { %s }
  OPTIONAL { ?item rdfs:label ?ja . FILTER(LANG(?ja) = "ja") }
  OPTIONAL { ?item schema:description ?d . FILTER(LANG(?d) = "ja") }
  OPTIONAL { ?item wdt:P1814 ?k }
  OPTIONAL { ?item wdt:P856 ?s }
  OPTIONAL { ?item skos:altLabel ?al . FILTER(LANG(?al) = "ja") }
  OPTIONAL { ?item wdt:P6375 ?ad . FILTER(LANG(?ad) = "ja") }
  OPTIONAL { ?item wdt:P1448 ?on . FILTER(LANG(?on) = "ja") }
}
GROUP BY ?item"""


def fetch_details(items, info):
    cand = [o["id"] for o in items if o["heritage"] or any(info.get(t, {}).get("roots") for t in o["types"])]
    log("詳しい情報を取る候補", len(cand))
    det = {}
    for part in chunks(cand, 200):
        try:
            rows = sparql(DETAIL_Q % values(part))
        except Exception as e:  # noqa: BLE001
            log("  詳しい情報の取得に失敗", repr(e)[:200])
            continue
        for r in rows:
            sp = lambda k: [x for x in r.get(k, "").split("|||") if x]  # noqa: E731
            det[qid(r["item"])] = {"label": r.get("label", ""), "desc": r.get("desc", ""), "kana": sp("kana"), "sites": sp("sites"),
                                   "aliases": sp("aliases"), "addrs": sp("addrs"), "official": sp("official")}
    log("詳しい情報", len(det))
    save("details.json", det)


# ---- 駅と停留所 ----
def fetch_stations():
    cls = set()
    for root in ("Q55488", "Q2175765"):
        for r in sparql("SELECT DISTINCT ?c WHERE { ?c wdt:P279* wd:%s . }" % root):
            cls.add(qid(r["c"]))
    log("駅の種類", len(cls))
    rows = []
    for part in chunks(sorted(cls), 150):
        rows += sparql("""
SELECT ?st ?label ?coord ?cls ?end WHERE {
  SERVICE wikibase:box {
    ?st wdt:P625 ?coord .
    bd:serviceParam wikibase:cornerSouthWest "Point(139.50 35.47)"^^geo:wktLiteral .
    bd:serviceParam wikibase:cornerNorthEast "Point(139.97 35.86)"^^geo:wktLiteral .
  }
  VALUES ?cls { %s }
  ?st wdt:P31 ?cls .
  OPTIONAL { ?st rdfs:label ?label . FILTER(LANG(?label) = "ja") }
  OPTIONAL { ?st wdt:P576 ?end }
}""" % values(part))
    st = {}
    for r in rows:
        i = qid(r["st"])
        o = st.setdefault(i, {"id": i, "label": r.get("label", ""), "coord": r.get("coord", ""), "types": [], "end": r.get("end", "")})
        c = qid(r["cls"])
        if c not in o["types"]:
            o["types"].append(c)
    ids = sorted(st)
    for part in chunks(ids, 200):
        for r in sparql("""
SELECT ?st (GROUP_CONCAT(DISTINCT ?ll; separator="|||") AS ?lines) (GROUP_CONCAT(DISTINCT ?ol; separator="|||") AS ?ops) WHERE {
  VALUES ?st { %s }
  OPTIONAL { ?st wdt:P81 ?line . ?line rdfs:label ?ll . FILTER(LANG(?ll) = "ja") }
  OPTIONAL { ?st wdt:P137 ?op . ?op rdfs:label ?ol . FILTER(LANG(?ol) = "ja") }
} GROUP BY ?st""" % values(part)):
            o = st[qid(r["st"])]
            o["lines"] = [x for x in r.get("lines", "").split("|||") if x]
            o["ops"] = [x for x in r.get("ops", "").split("|||") if x]
    log("駅と停留所", len(st))
    save("stations.json", list(st.values()))


# ---- 各区の観光施設の一覧（東京都オープンデータカタログ） ----
def fetch_ckan():
    pk = {}
    for q in ("観光施設一覧", "観光施設", "観光スポット", "観光"):
        start = 0
        while True:
            url = CKAN + "package_search?" + urllib.parse.urlencode({"q": q, "rows": 200, "start": start})
            try:
                j = json.loads(get(url))
            except Exception as e:  # noqa: BLE001
                log("カタログの検索に失敗", q, repr(e)[:200])
                break
            res = j.get("result", {}).get("results", [])
            for p in res:
                pk[p["id"]] = p
            start += len(res)
            time.sleep(0.5)
            if not res or start >= j["result"].get("count", 0) or start >= 2000:
                break
    log("カタログの検索結果", len(pk))
    os.makedirs(os.path.join(OUT, "ckan"), exist_ok=True)
    keep = []
    for p in pk.values():
        org = (p.get("organization") or {}).get("title", "") or ""
        title = p.get("title", "") or ""
        ward = next((w for w in WARDS if w in org), None) or next((w for w in WARDS if w in title), None)
        if not ward or "観光" not in title + " " + (p.get("notes") or "")[:200]:
            continue
        files = []
        for r in p.get("resources", []):
            url = (r.get("url") or "").strip()
            fmt = (r.get("format") or "").lower().strip(".")
            low = url.lower().split("?")[0]
            ext = next((e for e in ("csv", "xlsx", "xls", "json") if fmt == e or low.endswith("." + e)), None)
            if not url or not ext:
                continue
            name = "%s/%s.%s" % (p["name"], r["id"], ext)
            os.makedirs(os.path.join(OUT, "ckan", p["name"]), exist_ok=True)
            try:
                data = get(url, tries=3, timeout=90)
                with open(os.path.join(OUT, "ckan", name), "wb") as f:
                    f.write(data)
                files.append({"file": name, "name": r.get("name", ""), "url": url, "format": ext, "bytes": len(data)})
            except Exception as e:  # noqa: BLE001
                log("  ファイルを取れませんでした", ward, title, url[:120], repr(e)[:120])
            time.sleep(0.5)
        keep.append({"ward": ward, "org": org, "title": title, "name": p["name"], "id": p["id"], "license": p.get("license_title", ""),
                     "license_id": p.get("license_id", ""), "license_url": p.get("license_url", ""), "notes": (p.get("notes") or "")[:400],
                     "modified": p.get("metadata_modified", ""), "page": "https://catalog.data.metro.tokyo.lg.jp/dataset/" + p["name"], "files": files})
        log("  ", ward, title, len(files), "ファイル", p.get("license_title", ""))
    save("ckan/datasets.json", keep)
    save("ckan/search.json", [{"title": p.get("title"), "org": (p.get("organization") or {}).get("title"), "name": p.get("name")} for p in pk.values()])


def main():
    global OUT
    OUT = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    t0 = time.time()
    try:
        wards = fetch_wards()
        items = fetch_items(wards)
        info = fetch_classes(items)
        fetch_details(items, info)
    except Exception:  # noqa: BLE001
        log("Wikidata の取得でエラー\n" + traceback.format_exc())
    for name, fn in (("駅", fetch_stations), ("カタログ", fetch_ckan)):
        try:
            fn()
        except Exception:  # noqa: BLE001
            log(name + "の取得でエラー\n" + traceback.format_exc())
    log("かかった時間", int(time.time() - t0), "秒")
    with open(os.path.join(OUT, "log.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(LOG) + "\n")


if __name__ == "__main__":
    main()
