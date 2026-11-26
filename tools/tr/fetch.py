"""鉄道・駅・バス停の元データを、国土数値情報から取る（GitHub Actions で動かす）。

  python fetch.py <出力フォルダ>

取るもの（どれも、地図の範囲 BBOX に掛かる分だけを残す）
  rail.json     鉄道の路線（国土数値情報 鉄道 N02 の RailroadSection）
  station.json  駅（同じく Station）
  bus.json      バス停（国土数値情報 バス停留所 P11、東京都と埼玉県）
  log.txt       取得の記録

取る前に nlftp.mlit.go.jp の robots.txt を読み、取ってよいURLだけを取る。
"""
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
import urllib.robotparser
import zipfile

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
HOST = "https://nlftp.mlit.go.jp"
DATA = HOST + "/ksj/gml/data/"
# 南・西・北・東（23区と、板橋区のまわりの埼玉県の市を含む。地図で使う範囲より少し広く取る）
BBOX = (35.50, 139.48, 35.90, 139.96)
N02_VERS = ["25", "24", "23"]          # 新しい版から順に探す
P11_VER = "22"
P11_PREFS = ["13", "11"]               # 東京都・埼玉県
OUT = None
LOG = []
ROBOTS = None


def log(*a):
    s = " ".join(str(x) for x in a)
    LOG.append(s)
    print(s, flush=True)


def save(name, obj):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))


def robots():
    global ROBOTS
    rp = urllib.robotparser.RobotFileParser()
    url = HOST + "/robots.txt"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            text = r.read().decode("utf-8", "replace")
        log("robots.txt:\n" + text.strip())
        rp.parse(text.splitlines())
    except urllib.error.HTTPError as e:
        log("robots.txt:", e.code)
        if e.code in (401, 403):
            rp.disallow_all = True
        else:
            rp.allow_all = True
    ROBOTS = rp


def allowed(url):
    ok = ROBOTS.can_fetch(UA, url)
    if not ok:
        log("robots.txt で取得が許されていないため取りません:", url)
    return ok


def get(url, tries=4):
    if not allowed(url):
        return None
    err = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=300) as r:
                b = r.read()
            log("取得:", url, len(b), "bytes")
            time.sleep(3)
            return b
        except urllib.error.HTTPError as e:
            if e.code == 404:
                log("ありません:", url)
                return None
            err = e
        except Exception as e:  # noqa: BLE001
            err = e
        time.sleep(10 * (k + 1))
    log("取得できませんでした:", url, err)
    return None


def inside(lon, lat):
    return BBOX[0] <= lat <= BBOX[2] and BBOX[1] <= lon <= BBOX[3]


def r6(v):
    return round(float(v), 6)


def read_layers(zb, want):
    """zip の中から GeoJSON（なければシェープファイル）を読み、名前に want を含む層の地物を返す。"""
    z = zipfile.ZipFile(io.BytesIO(zb))
    names = z.namelist()
    gj = [n for n in names if n.lower().endswith(".geojson") and want in os.path.basename(n)]
    if gj:
        # UTF-8 のものを優先
        gj.sort(key=lambda n: (0 if "utf" in n.lower() else 1, len(n)))
        log("  読む:", gj[0])
        d = json.loads(z.read(gj[0]).decode("utf-8-sig"))
        return [(f.get("properties") or {}, f.get("geometry") or {}) for f in d.get("features", [])]
    shp = [n for n in names if n.lower().endswith(".shp") and want in os.path.basename(n)]
    if not shp:
        log("  見つかりません:", want, names[:40])
        return []
    import shapefile  # pyshp
    shp.sort(key=lambda n: (0 if "utf" in n.lower() else 1, len(n)))
    base = shp[0][:-4]
    cpg = base + ".cpg"
    enc = "utf-8"
    if cpg in names:
        enc = z.read(cpg).decode("ascii", "replace").strip() or enc
    log("  読む:", shp[0], enc)
    out = []
    for e in (enc, "cp932", "utf-8"):
        try:
            sf = shapefile.Reader(shp=io.BytesIO(z.read(base + ".shp")), dbf=io.BytesIO(z.read(base + ".dbf")),
                                  shx=io.BytesIO(z.read(base + ".shx")), encoding=e)
            fields = [f[0] for f in sf.fields[1:]]
            out = []
            for sr in sf.iterShapeRecords():
                props = dict(zip(fields, sr.record))
                out.append((props, sr.shape.__geo_interface__))
            return out
        except UnicodeDecodeError:
            continue
    return out


def lines_of(geom):
    t = geom.get("type")
    c = geom.get("coordinates") or []
    if t == "LineString":
        return [c]
    if t == "MultiLineString":
        return c
    return []


def rail():
    for v in N02_VERS:
        url = DATA + "N02/N02-%s/N02-%s_GML.zip" % (v, v)
        zb = get(url)
        if not zb:
            continue
        ver = "N02-" + v
        secs = read_layers(zb, "RailroadSection")
        stas = read_layers(zb, "Station")
        if not secs or not stas:
            log("路線か駅が読めませんでした:", ver)
            continue
        log("  属性の例:", json.dumps(secs[0][0], ensure_ascii=False), json.dumps(stas[0][0], ensure_ascii=False))
        rl = []
        for p, g in secs:
            for ln in lines_of(g):
                if any(inside(x, y) for x, y in ln[:]):
                    rl.append([p.get("N02_001"), p.get("N02_002"), p.get("N02_003"), p.get("N02_004"),
                               [[r6(x), r6(y)] for x, y in ln]])
        st = []
        for p, g in stas:
            for ln in lines_of(g):
                if any(inside(x, y) for x, y in ln):
                    st.append([p.get("N02_001"), p.get("N02_002"), p.get("N02_003"), p.get("N02_004"), p.get("N02_005"),
                               p.get("N02_005c"), p.get("N02_005g"), [[r6(x), r6(y)] for x, y in ln]])
        log(ver, "路線", len(rl), "本・駅", len(st), "件（範囲内）")
        save("rail.json", {"ver": ver, "f": rl})
        save("station.json", {"ver": ver, "f": st})
        return True
    return False


def bus():
    rows = []
    ver = "P11-" + P11_VER
    for pref in P11_PREFS:
        url = DATA + "P11/P11-%s/P11-%s_%s_SHP.zip" % (P11_VER, P11_VER, pref)
        zb = get(url)
        if not zb:
            url = DATA + "P11/P11-%s/P11-%s_%s_GML.zip" % (P11_VER, P11_VER, pref)
            zb = get(url)
        if not zb:
            return False
        feats = read_layers(zb, "P11")
        if feats:
            log("  属性の例:", json.dumps(feats[0][0], ensure_ascii=False))
        n = 0
        for p, g in feats:
            if g.get("type") != "Point":
                continue
            x, y = g["coordinates"][:2]
            if not inside(x, y):
                continue
            routes, codes = [], []
            for i in range(1, 36):
                r = p.get("P11_003_%02d" % i)
                c = p.get("P11_004_%02d" % i)
                if r in (None, "") and c in (None, "", 0):
                    continue
                routes.append(r or "")
                codes.append(c if c not in ("",) else None)
            rows.append([p.get("P11_001"), p.get("P11_002"), routes, codes, p.get("P11_005"), r6(x), r6(y), pref])
            n += 1
        log(ver, pref, "バス停", n, "件（範囲内）")
    save("bus.json", {"ver": ver, "f": rows})
    return True


def main():
    global OUT
    OUT = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    robots()
    ok_r = rail()
    ok_b = bus()
    with open(os.path.join(OUT, "log.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(LOG) + "\n")
    if not (ok_r and ok_b):
        sys.exit(1)


if __name__ == "__main__":
    main()
