"""鉄道・駅・バス停の元データ（fetch.py の出力）から、地図で使う小分けのファイルを作る。

  python build.py <元データのフォルダ> <出力フォルダ（tr）>

作るもの
  i.json        目次（路線の名前と色、バス会社の名前、ファイルの区切り方、ファイルがある区画）
  r/<行>_<列>.json  鉄道の線と駅（約6.7km四方ごと）
  b/<行>_<列>.json  バス停（約2.2km四方ごと）

座標は 1e-5 度単位の整数で、i.json の o（範囲の南西の角）からの差で書く。
線は、区画ごとに「区間の中点がある区画」に入れる（隣の区画と重ならず、つなぎ目もずれない）。
"""
import heapq
import json
import math
import os
import shutil
import sys
from collections import defaultdict

# 地図で扱う範囲（南・西・北・東）。23区と、板橋区のまわりの埼玉県の市を含む
AREA = (35.52, 139.52, 35.88, 139.93)
O = (round(AREA[0] * 1e5), round(AREA[1] * 1e5))
RT = (6000, 7500)      # 鉄道の区画の大きさ（1e-5 度。南北 0.06 度・東西 0.075 度）
BT = (2000, 2500)      # バス停の区画の大きさ（南北 0.02 度・東西 0.025 度）
SIMPLIFY = 2e-5        # 線を間引くときの許容のずれ（度。約2m）
SEG_MAX = 0.004        # 1区間の長さの上限（度。長い直線は途中に点を足して、区画の境目で欠けないようにする）
BUS_JOIN_M = 100       # 同じ名前のバス停をまとめる距離（m）
BUS_RT_MAX = 12        # バス停の吹き出しに書く系統の数の上限
SRC = '「<a href="https://nlftp.mlit.go.jp/ksj/" target="_blank" rel="noopener">国土数値情報</a>」（国土交通省）を加工'

# ---- 路線の名前と色 ----
JR_COLOR = {
    "山手線": "#80c241", "京浜東北線": "#00a7db", "埼京線": "#00ac9a", "宇都宮線・高崎線": "#f68b1e", "東海道線": "#f68b1e",
    "横須賀線": "#0067c0", "総武線快速": "#0067c0", "中央線": "#f15a22", "総武線": "#e6b800", "常磐線": "#00b261",
    "京葉線": "#c9242f", "武蔵野線": "#eb5b13", "南武線": "#e6c300", "横浜線": "#7ac143", "鶴見線": "#e6c300",
    "湘南新宿ライン": "#e21f26", "新幹線": "#1f6fb2",
}
# 法律上の路線名ごとの、ふだん呼ばれる路線名（駅の表に無い駅で使う）
JR_DEFAULT = {"山手線": "山手線", "東北線": "京浜東北線", "東海道線": "京浜東北線", "赤羽線": "埼京線", "中央線": "中央線",
              "総武線": "総武線", "常磐線": "常磐線", "京葉線": "京葉線", "武蔵野線": "武蔵野線", "南武線": "南武線",
              "横浜線": "横浜線", "鶴見線": "鶴見線"}
# 法律上は1つの路線を、走る電車ごとに色分けする（駅の並びで、どの区間かを決める。先に書いたものが優先）
JR_CORRIDOR = {
    "東北線": [
        ("山手線", ["東京", "神田", "秋葉原", "御徒町", "上野", "鶯谷", "日暮里", "西日暮里", "田端"]),
        ("京浜東北線", ["東京", "神田", "秋葉原", "御徒町", "上野", "鶯谷", "日暮里", "西日暮里", "田端", "上中里", "王子", "東十条",
                    "赤羽", "川口", "西川口", "蕨", "南浦和", "浦和", "北浦和"]),
        ("宇都宮線・高崎線", ["東京", "上野", "尾久", "赤羽", "浦和"]),
        ("埼京線", ["赤羽", "北赤羽", "浮間舟渡", "戸田公園", "戸田", "北戸田", "武蔵浦和", "中浦和", "南与野", "与野本町", "北与野"]),
    ],
    "東海道線": [
        ("山手線", ["東京", "有楽町", "新橋", "浜松町", "田町", "高輪ゲートウェイ", "品川"]),
        ("京浜東北線", ["東京", "有楽町", "新橋", "浜松町", "田町", "高輪ゲートウェイ", "品川", "大井町", "大森", "蒲田", "川崎"]),
        ("東海道線", ["東京", "新橋", "品川", "川崎"]),
        ("横須賀線", ["品川", "西大井", "武蔵小杉", "新川崎"]),
    ],
    "山手線": [
        ("山手線", ["品川", "大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", "新大久保", "高田馬場", "目白", "池袋",
                 "大塚", "巣鴨", "駒込", "田端"]),
        ("埼京線", ["大崎", "恵比寿", "渋谷", "新宿", "池袋"]),
    ],
    "中央線": [
        ("中央線", ["東京", "神田", "御茶ノ水", "四ツ谷", "新宿", "中野", "高円寺", "阿佐ヶ谷", "荻窪", "西荻窪", "吉祥寺", "三鷹"]),
        ("総武線", ["御茶ノ水", "水道橋", "飯田橋", "市ヶ谷", "四ツ谷", "信濃町", "千駄ヶ谷", "代々木", "新宿", "大久保", "東中野", "中野"]),
    ],
    "総武線": [
        ("総武線快速", ["東京", "新日本橋", "馬喰町", "錦糸町", "新小岩", "市川"]),
        ("総武線", ["御茶ノ水", "秋葉原", "浅草橋", "両国", "錦糸町", "亀戸", "平井", "新小岩", "小岩", "市川", "本八幡"]),
    ],
}
# 駅に止まる電車（JR）。ここに無い駅は JR_DEFAULT から決める
JR_ST = {
    "東京": ["山手線", "京浜東北線", "中央線", "東海道線", "横須賀線", "総武線快速", "京葉線", "宇都宮線・高崎線", "常磐線"],
    "神田": ["山手線", "京浜東北線", "中央線"], "秋葉原": ["山手線", "京浜東北線", "総武線"], "御徒町": ["山手線", "京浜東北線"],
    "上野": ["山手線", "京浜東北線", "宇都宮線・高崎線", "常磐線"], "鶯谷": ["山手線", "京浜東北線"],
    "日暮里": ["山手線", "京浜東北線", "常磐線"], "西日暮里": ["山手線", "京浜東北線"], "田端": ["山手線", "京浜東北線"],
    "有楽町": ["山手線", "京浜東北線"], "新橋": ["山手線", "京浜東北線", "東海道線", "横須賀線"], "浜松町": ["山手線", "京浜東北線"],
    "田町": ["山手線", "京浜東北線"], "高輪ゲートウェイ": ["山手線", "京浜東北線"],
    "品川": ["山手線", "京浜東北線", "東海道線", "横須賀線", "常磐線"],
    "川崎": ["京浜東北線", "東海道線", "南武線"], "西大井": ["横須賀線", "湘南新宿ライン"], "新川崎": ["横須賀線", "湘南新宿ライン"],
    "武蔵小杉": ["南武線", "横須賀線", "湘南新宿ライン"],
    "大崎": ["山手線", "埼京線", "湘南新宿ライン"], "恵比寿": ["山手線", "埼京線", "湘南新宿ライン"],
    "渋谷": ["山手線", "埼京線", "湘南新宿ライン"], "新宿": ["山手線", "中央線", "総武線", "埼京線", "湘南新宿ライン"],
    "池袋": ["山手線", "埼京線", "湘南新宿ライン"], "代々木": ["山手線", "総武線"],
    "赤羽": ["京浜東北線", "埼京線", "宇都宮線・高崎線", "湘南新宿ライン"], "尾久": ["宇都宮線・高崎線"],
    "浦和": ["京浜東北線", "宇都宮線・高崎線", "湘南新宿ライン"], "南浦和": ["京浜東北線", "武蔵野線"], "武蔵浦和": ["埼京線", "武蔵野線"],
    "御茶ノ水": ["中央線", "総武線"], "四ツ谷": ["中央線", "総武線"],
    "水道橋": ["総武線"], "飯田橋": ["総武線"], "市ヶ谷": ["総武線"], "信濃町": ["総武線"], "千駄ヶ谷": ["総武線"],
    "大久保": ["総武線"], "東中野": ["総武線"],
    "中野": ["中央線", "総武線"], "高円寺": ["中央線", "総武線"], "阿佐ヶ谷": ["中央線", "総武線"], "荻窪": ["中央線", "総武線"],
    "西荻窪": ["中央線", "総武線"], "吉祥寺": ["中央線", "総武線"], "三鷹": ["中央線", "総武線"],
    "錦糸町": ["総武線", "総武線快速"], "新小岩": ["総武線", "総武線快速"], "市川": ["総武線", "総武線快速"],
    "新日本橋": ["総武線快速"], "馬喰町": ["総武線快速"],
}
for _n in ["北赤羽", "浮間舟渡", "戸田公園", "戸田", "北戸田", "中浦和", "南与野", "与野本町", "北与野", "十条", "板橋"]:
    JR_ST[_n] = ["埼京線"]

# 法律上の路線ごとに、その駅に止まりうる電車（同じ名前の駅が離れて2つあるときに、それぞれへ正しく振り分けるため）
JR_ALLOW = {
    "東北線": {"京浜東北線", "山手線", "宇都宮線・高崎線", "常磐線", "埼京線", "湘南新宿ライン", "中央線"},
    "東海道線": {"京浜東北線", "山手線", "東海道線", "横須賀線", "常磐線", "湘南新宿ライン"},
    "山手線": {"山手線", "埼京線", "湘南新宿ライン"},
    "赤羽線": {"埼京線"}, "中央線": {"中央線", "総武線"}, "総武線": {"総武線", "総武線快速", "横須賀線"},
    "京葉線": {"京葉線", "武蔵野線"}, "常磐線": {"常磐線"}, "武蔵野線": {"武蔵野線"}, "南武線": {"南武線"},
}
ST_JOIN_M = 400        # 同じ名前の駅をまとめる距離（m）

# JR 以外：（会社, 路線）→（表示名, 色, 地下を走るか）
LINES = {
    ("東京地下鉄", "3号線銀座線"): ("東京メトロ銀座線", "#ff9500", 1),
    ("東京地下鉄", "4号線丸ノ内線"): ("東京メトロ丸ノ内線", "#f62e36", 1),
    ("東京地下鉄", "4号線丸ノ内線分岐線"): ("東京メトロ丸ノ内線", "#f62e36", 1),
    ("東京地下鉄", "2号線日比谷線"): ("東京メトロ日比谷線", "#8c9196", 1),
    ("東京地下鉄", "5号線東西線"): ("東京メトロ東西線", "#009bbf", 1),
    ("東京地下鉄", "9号線千代田線"): ("東京メトロ千代田線", "#00bb85", 1),
    ("東京地下鉄", "8号線有楽町線"): ("東京メトロ有楽町線", "#b8964b", 1),
    ("東京地下鉄", "11号線半蔵門線"): ("東京メトロ半蔵門線", "#8f76d6", 1),
    ("東京地下鉄", "7号線南北線"): ("東京メトロ南北線", "#00ada9", 1),
    ("東京地下鉄", "13号線副都心線"): ("東京メトロ副都心線", "#9c5e31", 1),
    ("東京都", "1号線浅草線"): ("都営浅草線", "#e85298", 1),
    ("東京都", "6号線三田線"): ("都営三田線", "#0079c2", 1),
    ("東京都", "10号線新宿線"): ("都営新宿線", "#6cbb5a", 1),
    ("東京都", "12号線大江戸線"): ("都営大江戸線", "#b6007a", 1),
    ("東京都", "荒川線"): ("都電荒川線", "#e05a8e", 0),
    ("東京都", "日暮里・舎人ライナー"): ("日暮里・舎人ライナー", "#d6336c", 0),
    ("東武鉄道", "東上本線"): ("東武東上線", "#004098", 0),
    ("東武鉄道", "伊勢崎線"): ("東武スカイツリーライン", "#1e6ab4", 0),
    ("東武鉄道", "亀戸線"): ("東武亀戸線", "#1e6ab4", 0),
    ("東武鉄道", "大師線"): ("東武大師線", "#1e6ab4", 0),
    ("東武鉄道", "野田線"): ("東武アーバンパークライン", "#0099d9", 0),
    ("西武鉄道", "池袋線"): ("西武池袋線", "#f08c00", 0),
    ("西武鉄道", "新宿線"): ("西武新宿線", "#f08c00", 0),
    ("西武鉄道", "西武有楽町線"): ("西武有楽町線", "#f08c00", 0),
    ("西武鉄道", "豊島線"): ("西武豊島線", "#f08c00", 0),
    ("西武鉄道", "多摩川線"): ("西武多摩川線", "#f08c00", 0),
    ("西武鉄道", "多摩湖線"): ("西武多摩湖線", "#f08c00", 0),
    ("西武鉄道", "国分寺線"): ("西武国分寺線", "#f08c00", 0),
    ("西武鉄道", "拝島線"): ("西武拝島線", "#f08c00", 0),
    ("京王電鉄", "京王線"): ("京王線", "#c8006b", 0),
    ("京王電鉄", "井の頭線"): ("京王井の頭線", "#7a5aa8", 0),
    ("京王電鉄", "相模原線"): ("京王相模原線", "#c8006b", 0),
    ("京王電鉄", "競馬場線"): ("京王競馬場線", "#c8006b", 0),
    ("小田急電鉄", "小田原線"): ("小田急線", "#2288cc", 0),
    ("小田急電鉄", "多摩線"): ("小田急多摩線", "#2288cc", 0),
    ("東急電鉄", "東横線"): ("東急東横線", "#da0442", 0),
    ("東急電鉄", "目黒線"): ("東急目黒線", "#009cd2", 0),
    ("東急電鉄", "田園都市線"): ("東急田園都市線", "#20a288", 0),
    ("東急電鉄", "大井町線"): ("東急大井町線", "#f18c43", 0),
    ("東急電鉄", "池上線"): ("東急池上線", "#ee86a7", 0),
    ("東急電鉄", "東急多摩川線"): ("東急多摩川線", "#ae0378", 0),
    ("東急電鉄", "世田谷線"): ("東急世田谷線", "#e8b400", 0),
    ("東急電鉄", "東急新横浜線"): ("東急新横浜線", "#1f4e9c", 1),
    ("東急電鉄", "こどもの国線"): ("東急こどもの国線", "#1f4e9c", 0),
    ("京浜急行電鉄", "本線"): ("京急本線", "#d8172a", 0),
    ("京浜急行電鉄", "空港線"): ("京急空港線", "#d8172a", 0),
    ("京浜急行電鉄", "大師線"): ("京急大師線", "#d8172a", 0),
    ("京成電鉄", "本線"): ("京成本線", "#1a5ba6", 0),
    ("京成電鉄", "押上線"): ("京成押上線", "#1a5ba6", 0),
    ("京成電鉄", "金町線"): ("京成金町線", "#1a5ba6", 0),
    ("京成電鉄", "成田空港線"): ("京成成田空港線", "#f08300", 0),
    ("京成電鉄", "松戸線"): ("京成松戸線", "#d6007f", 0),
    ("北総鉄道", "北総線"): ("北総線", "#00a0dc", 0),
    ("埼玉高速鉄道", "埼玉高速鉄道線"): ("埼玉高速鉄道線", "#1d97c4", 1),
    ("首都圏新都市鉄道", "常磐新線"): ("つくばエクスプレス", "#e5171f", 1),
    ("東京臨海高速鉄道", "臨海副都心線"): ("りんかい線", "#00418e", 1),
    ("ゆりかもめ", "東京臨海新交通臨海線"): ("ゆりかもめ", "#1f9bd7", 0),
    ("東京モノレール", "東京モノレール羽田空港線"): ("東京モノレール", "#0074be", 0),
    ("舞浜リゾートライン", "ディズニーリゾートライン"): ("ディズニーリゾートライン", "#2aa6de", 0),
    ("横浜市", "3号線"): ("横浜市営地下鉄ブルーライン", "#0068b7", 1),
    ("横浜市", "4号線"): ("横浜市営地下鉄グリーンライン", "#00a040", 1),
    ("流鉄", "流山線"): ("流鉄流山線", "#e67e00", 0),
    ("相模鉄道", "相鉄新横浜線"): ("相鉄新横浜線", "#1f4e9c", 1),
    ("東葉高速鉄道", "東葉高速線"): ("東葉高速線", "#2bb24c", 0),
}
TRAM = {("東京都", "荒川線"), ("東急電鉄", "世田谷線")}
OTHER_COLOR = "#7a8691"

# ---- バス会社の名前 ----
BUS_NAME = {
    "東京都": "都営バス", "国際興業": "国際興業バス", "東武バスセントラル": "東武バス", "東武バスウエスト": "東武バス",
    "京王電鉄バス": "京王バス", "東京空港交通": "東京空港交通（リムジンバス）", "朝日自動車": "朝日バス",
    "神奈川中央交通東": "神奈川中央交通", "神奈川中央交通西": "神奈川中央交通",
}


def m_dist(a, b):
    """経度・緯度の2点の距離（m、近いところ用）"""
    return math.hypot((a[0] - b[0]) * 111320 * math.cos(math.radians(35.7)), (a[1] - b[1]) * 110950)


def length(c):
    return sum(m_dist(c[i], c[i + 1]) for i in range(len(c) - 1))


def key(p):
    return (round(p[0], 6), round(p[1], 6))


def rdp(pts, eps):
    if len(pts) < 3:
        return pts[:]
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        L2 = dx * dx + dy * dy
        best, bi = -1.0, -1
        for k in range(i + 1, j):
            px, py = pts[k]
            if L2 == 0:
                d = math.hypot(px - ax, py - ay)
            else:
                t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
                d = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
            if d > best:
                best, bi = d, k
        if best > eps and bi > 0:
            keep[bi] = True
            stack.append((i, bi))
            stack.append((bi, j))
    return [p for p, k in zip(pts, keep) if k]


def densify(pts):
    out = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        d = max(abs(b[0] - a[0]), abs(b[1] - a[1]))
        n = int(d // SEG_MAX)
        for k in range(1, n + 1):
            t = k / (n + 1)
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
        out.append(b)
    return out


def ij(lng, lat, size):
    return (math.floor((lat * 1e5 - O[0]) / size[0]), math.floor((lng * 1e5 - O[1]) / size[1]))


def in_area(lng, lat, pad=0.0):
    return AREA[0] - pad <= lat <= AREA[2] + pad and AREA[1] - pad <= lng <= AREA[3] + pad


def enc(lng, lat):
    return (round(lat * 1e5) - O[0], round(lng * 1e5) - O[1])


# ---- JR の色分け ----
def jr_services(secs, stations):
    """法律上の路線ごとに、区間（secs の添字）→ 電車の名前 を決める。
    secs: [(法律上の路線名, coords)]、stations: {(路線名, 駅名): [端点の key]}"""
    out = {}
    by_line = defaultdict(list)
    for i, (ln, c) in enumerate(secs):
        by_line[ln].append(i)
    for ln, idxs in by_line.items():
        adj = defaultdict(list)
        for i in idxs:
            c = secs[i][1]
            a, b = key(c[0]), key(c[-1])
            w = length(c) + 0.01
            adj[a].append((b, i, w))
            adj[b].append((a, i, w))
        claim = {}
        for svc, seq in JR_CORRIDOR.get(ln, []):
            nodes = []
            for name in seq:
                ns = [n for n in stations.get((ln, name), []) if n in adj]
                nodes.append((name, ns))
            # 駅の区間そのもの
            for name, ns in nodes:
                sset = set(ns)
                for n in ns:
                    for m, i, w in adj[n]:
                        if m in sset and i not in claim:
                            claim[i] = svc
            for (na, A), (nb, B) in zip(nodes, nodes[1:]):
                if not A or not B:
                    continue
                path = dijkstra(adj, A, set(B), claim)
                for i in path:
                    if i not in claim:
                        claim[i] = svc
        dflt = JR_DEFAULT.get(ln, ln)
        for i in idxs:
            out[i] = claim.get(i, dflt)
    return out


def dijkstra(adj, sources, targets, claim):
    dist = {}
    prev = {}
    pq = []
    for s in sources:
        dist[s] = 0.0
        heapq.heappush(pq, (0.0, s))
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, 1e18):
            continue
        if u in targets:
            path = []
            while u in prev:
                u, i = prev[u]
                path.append(i)
            return path
        for v, i, w in adj[u]:
            nd = d + w * (20 if i in claim else 1)
            if nd < dist.get(v, 1e18):
                dist[v] = nd
                prev[v] = (u, i)
                heapq.heappush(pq, (nd, v))
    return []


def merge_chains(segs):
    """同じ路線の区間（coords のリスト）を、端どうしでつないで長い線にする"""
    adj = defaultdict(list)
    for i, c in enumerate(segs):
        adj[key(c[0])].append(i)
        adj[key(c[-1])].append(i)
    used = [False] * len(segs)
    out = []

    def walk(start_node, i):
        c = segs[i]
        pts = list(c) if key(c[0]) == start_node else list(reversed(c))
        used[i] = True
        node = key(pts[-1])
        while len(adj[node]) == 2:
            nxt = [j for j in adj[node] if not used[j]]
            if not nxt:
                break
            j = nxt[0]
            cj = segs[j]
            seg = list(cj) if key(cj[0]) == node else list(reversed(cj))
            pts.extend(seg[1:])
            used[j] = True
            node = key(pts[-1])
        return pts

    for node, lst in adj.items():
        if len(lst) != 2:
            for i in lst:
                if not used[i]:
                    out.append(walk(node, i))
    for i in range(len(segs)):
        if not used[i]:
            out.append(walk(key(segs[i][0]), i))
    return out


def main():
    raw, out = sys.argv[1], sys.argv[2]
    rail = json.load(open(os.path.join(raw, "rail.json"), encoding="utf-8"))
    sta = json.load(open(os.path.join(raw, "station.json"), encoding="utf-8"))
    bus = json.load(open(os.path.join(raw, "bus.json"), encoding="utf-8"))

    Ltab, Lidx = [], {}

    def lid(name, color, dashed):
        if name not in Lidx:
            Lidx[name] = len(Ltab)
            Ltab.append([name, color, dashed])
        return Lidx[name]

    # ---- 駅 ----
    jr_st_nodes = defaultdict(list)
    groups = defaultdict(list)
    for c1, c2, line, op, name, code, grp, coords in sta["f"]:
        groups[grp or code or name].append((c1, c2, line, op, name, coords))
        if op == "東日本旅客鉄道":
            jr_st_nodes[(line, name)].extend([key(coords[0]), key(coords[-1])])

    # ---- 線 ----
    jr_secs, jr_pos, other = [], [], defaultdict(list)
    skipped = defaultdict(int)
    for c1, c2, line, op, coords in rail["f"]:
        pts = [tuple(p) for p in coords]
        if str(c2) == "1":          # 新幹線は線を描かない
            continue
        if op == "東日本旅客鉄道":
            jr_pos.append(len(jr_secs))
            jr_secs.append((line, pts))
            continue
        if (op, line) in LINES:
            nm, col, d = LINES[(op, line)]
        else:
            skipped[(op, line)] += 1
            nm, col, d = op + " " + line, OTHER_COLOR, 0
        other[lid(nm, col, d)].append(pts)
    svc = jr_services(jr_secs, jr_st_nodes)
    for i, (line, pts) in enumerate(jr_secs):
        s = svc[i]
        other[lid("JR" + s, JR_COLOR.get(s, OTHER_COLOR), 0)].append(pts)
    if skipped:
        print("表に無い路線（灰色で描く）:", dict(skipped))

    rtiles = defaultdict(lambda: {"g": [], "s": []})
    nseg = 0
    for li, segs in other.items():
        for pts in merge_chains(segs):
            pts = densify(rdp(pts, SIMPLIFY))
            # 区間ごとに、中点がある区画へ。続く区間はつないで1本にする
            cur, cur_t = None, None
            for a, b in zip(pts, pts[1:]):
                mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
                t = ij(mx, my, RT) if in_area(mx, my, 0.01) else None
                if cur is None or t != cur_t:
                    if cur and cur_t is not None:
                        rtiles[cur_t]["g"].append((li, cur))
                    cur, cur_t = [a], t
                cur.append(b)
            if cur and cur_t is not None:
                rtiles[cur_t]["g"].append((li, cur))
            nseg += 1

    nst = 0
    rank = {"JR": 0, "東京メトロ": 1, "都営": 2, "都電": 2, "日暮里・舎人ライナー": 2}

    def lrank(n):
        for k, v in rank.items():
            if n.startswith(k):
                return v
        return 3

    # 同じ名前で近い駅（地下の別のホームなど）は1つにまとめる
    glist = []
    for grp, mem in groups.items():
        pts = [c[len(c) // 2] for *_, c in mem]
        glist.append([mem[0][4], (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)), mem, len(pts)])
    glist.sort(key=lambda g: (g[0], -g[3]))
    merged = []
    for g in glist:
        for h in merged:
            if h[0] == g[0] and m_dist(h[1], g[1]) <= ST_JOIN_M:
                n1, n2 = h[3], g[3]
                h[1] = ((h[1][0] * n1 + g[1][0] * n2) / (n1 + n2), (h[1][1] * n1 + g[1][1] * n2) / (n1 + n2))
                h[2] = h[2] + g[2]
                h[3] = n1 + n2
                break
        else:
            merged.append(g)
    for name, (lng, lat), mem, _n in merged:
        if not in_area(lng, lat):
            continue
        names = []
        jr = [m for m in mem if m[3] == "東日本旅客鉄道" and str(m[1]) != "1"]
        if jr:
            legal = [m[2] for m in jr]
            if name in JR_ST:
                ok = set()
                for ln in legal:
                    ok |= JR_ALLOW.get(ln, {JR_DEFAULT.get(ln, ln)})
                names += ["JR" + s for s in JR_ST[name] if s in ok]
            if not names:
                for ln in legal:
                    s = "JR" + JR_DEFAULT.get(ln, ln)
                    if s not in names:
                        names.append(s)
        if any(str(m[1]) == "1" for m in mem):
            names.append("JR新幹線")
        tram = True
        for c1, c2, line, op, nm, coords in mem:
            if op == "東日本旅客鉄道" or str(c2) == "1":
                tram = False
                continue
            if (op, line) not in TRAM:
                tram = False
            dn = LINES.get((op, line), (op + " " + line,))[0]
            if dn not in names:
                names.append(dn)
        order = {n: i for i, n in enumerate(names)}
        names.sort(key=lambda n: (lrank(n), order[n] if lrank(n) == 0 else 0, n))
        idx = []
        for n in names:
            if n.startswith("JR"):
                s = n[2:]
                idx.append(lid(n, JR_COLOR.get(s, OTHER_COLOR), 0))
            elif n in Lidx:
                idx.append(Lidx[n])
            else:
                idx.append(lid(n, OTHER_COLOR, 0))
        y, x = enc(lng, lat)
        row = [name, y, x, idx]
        if tram:
            row.append(1)
        rtiles[ij(lng, lat, RT)]["s"].append(row)
        nst += 1

    # ---- バス停 ----
    bo, boi = [], {}

    def opname(raw_op, codes):
        out_ = []
        for part in str(raw_op or "").split("・"):
            p = part.replace("（株）", "").replace("(株)", "").replace("株式会社", "").replace("（有）", "").strip()
            if not p:
                continue
            if p in BUS_NAME:
                p = BUS_NAME[p]
            elif p.endswith(("区", "市", "町", "村")) and "3" in codes:
                p = p + "のコミュニティバス"
            out_.append(p)
        return out_

    def boid(n):
        if n not in boi:
            boi[n] = len(bo)
            bo.append(n)
        return boi[n]

    byname = defaultdict(list)
    for name, op, routes, codes, note, lng, lat, pref in bus["f"]:
        if not in_area(lng, lat) or not name:
            continue
        rs, cs = [], []
        for r in routes:
            rs += [t.strip() for t in str(r or "").split(",") if t.strip()]
        for c in codes:
            cs += [t.strip() for t in str(c or "").split(",") if t.strip()]
        byname[name].append({"p": (lng, lat), "ops": opname(op, cs), "rts": rs})
    btiles = defaultdict(list)
    nbus = 0
    for name, recs in byname.items():
        # 近いものどうしをまとめる（つながったものを1つに）
        n = len(recs)
        parent = list(range(n))

        def find(a):
            while parent[a] != a:
                parent[a] = parent[parent[a]]
                a = parent[a]
            return a
        for i in range(n):
            for j in range(i + 1, n):
                if m_dist(recs[i]["p"], recs[j]["p"]) <= BUS_JOIN_M:
                    parent[find(i)] = find(j)
        clus = defaultdict(list)
        for i in range(n):
            clus[find(i)].append(recs[i])
        for cl in clus.values():
            pts = list({r["p"] for r in cl})
            lng = sum(p[0] for p in pts) / len(pts)
            lat = sum(p[1] for p in pts) / len(pts)
            ops, rts = [], []
            for r in cl:
                for o in r["ops"]:
                    if o not in ops:
                        ops.append(o)
                for t in r["rts"]:
                    if t not in rts:
                        rts.append(t)
            y, x = enc(lng, lat)
            row = [name, y, x, [boid(o) for o in ops], rts[:BUS_RT_MAX]]
            if len(rts) > BUS_RT_MAX:
                row.append(len(rts) - BUS_RT_MAX)
            btiles[ij(lng, lat, BT)].append(row)
            nbus += 1

    # ---- 書き出し ----
    tmp = out + ".tmp"
    if os.path.exists(tmp):
        shutil.rmtree(tmp)
    os.makedirs(os.path.join(tmp, "r"))
    os.makedirs(os.path.join(tmp, "b"))

    def dump(path, obj):
        with open(os.path.join(tmp, path), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))

    rkeys, bkeys = [], []
    sizes = []
    for (r, c), t in sorted(rtiles.items()):
        g = []
        for li, pts in t["g"]:
            y0, x0 = enc(*pts[0])
            row = [li, y0, x0]
            py, px = y0, x0
            for p in pts[1:]:
                y, x = enc(*p)
                if (y, x) == (py, px):
                    continue
                row += [y - py, x - px]
                py, px = y, x
            if len(row) >= 5:
                g.append(row)
        if not g and not t["s"]:
            continue
        k = "%d_%d" % (r, c)
        dump("r/%s.json" % k, {"g": g, "s": sorted(t["s"], key=lambda s: (-s[1], s[2]))})
        rkeys.append(k)
        sizes.append(os.path.getsize(os.path.join(tmp, "r/%s.json" % k)))
    bsz = []
    for (r, c), rows in sorted(btiles.items()):
        k = "%d_%d" % (r, c)
        dump("b/%s.json" % k, {"b": sorted(rows, key=lambda s: (-s[1], s[2]))})
        bkeys.append(k)
        bsz.append(os.path.getsize(os.path.join(tmp, "b/%s.json" % k)))
    meta = {
        "v": 2, "src": SRC, "ver": rail.get("ver", "") + "・" + bus.get("ver", ""),
        "o": list(O), "rt": list(RT), "bt": list(BT),
        "L": Ltab, "bo": bo, "r": rkeys, "b": bkeys,
    }
    dump("i.json", meta)
    nsec = len(jr_secs) + sum(len(v) for v in other.values()) - len(jr_secs)
    if nst < 500 or nbus < 3000 or nsec < 1000:
        print("件数が少なすぎるため、書き出しをやめます:", nst, nbus, nsec)
        sys.exit(1)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.replace(tmp, out)
    print("路線", len(Ltab), "・線", nseg, "本・駅", nst, "・バス停", nbus)
    print("鉄道の区画", len(rkeys), "合計", sum(sizes) // 1024, "KB・最大", max(sizes) // 1024, "KB")
    print("バス停の区画", len(bkeys), "合計", sum(bsz) // 1024, "KB・最大", max(bsz) // 1024, "KB")


if __name__ == "__main__":
    main()
