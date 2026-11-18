#!/usr/bin/env python3
"""都営交通（都営地下鉄・日暮里・舎人ライナー・東京さくらトラム・都バス）のGTFSから、
ブラウザで経路探索するための小さなデータ（toei.json）を作る。

出典：東京都交通局・公共交通オープンデータセンター（CC BY 4.0）
使い方：python3 build.py <Toei-Train-GTFS.zip> <ToeiBus-GTFS.zip> <出力先 toei.json>
"""
import collections
import csv
import datetime
import io
import json
import sys
import unicodedata
import zipfile
from zoneinfo import ZoneInfo

import jpholiday

DAYS = 400                       # 何日先まで運行日を書き出すか
O = (3540000, 13880000)          # 座標の基準（緯度・経度×1e5）
LINE_COLOR = {"浅草線": "#e85298", "三田線": "#0079c2", "新宿線": "#6cbb5a", "大江戸線": "#b6007a",
              "日暮里・舎人ライナー": "#d6336c", "東京さくらトラム（都電荒川線）": "#e05a8e"}
KIND = {"1": 0, "2": 1, "0": 2, "3": 3}   # route_type → 0地下鉄 1ライナー 2路面電車 3バス


def reader(path):
    z = zipfile.ZipFile(path)

    def rd(name):
        with z.open(name) as f:
            return list(csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig", newline="")))
    return rd


def minutes(s):
    h, m, _ = s.split(":")
    return int(h) * 60 + int(m)


def nfkc(s):
    return unicodedata.normalize("NFKC", s or "").strip()


def ymd(d):
    return d.strftime("%Y%m%d")


def day_type(d):
    """0平日 1土曜 2日曜・休日（年末年始12/30〜1/3を含む）"""
    if d.weekday() == 6 or jpholiday.is_holiday(d) or (d.month == 12 and d.day >= 30) or (d.month == 1 and d.day <= 3):
        return 2
    return 1 if d.weekday() == 5 else 0


def main(train_zip, bus_zip, out):
    today = datetime.datetime.now(ZoneInfo("Asia/Tokyo")).date()
    stops, stop_ix = [], {}          # [name, lat, lng, kind]
    names, name_ix, kana, en = [], {}, {}, {}
    lines, line_ix = [], {}
    heads, head_ix = [], {}
    svcs, svc_ix = [], {}
    pats = collections.OrderedDict()
    feeds = {}
    calendars = {}

    def nid(s):
        if s not in name_ix:
            name_ix[s] = len(names)
            names.append(s)
        return name_ix[s]

    def hid(s):
        if s not in head_ix:
            head_ix[s] = len(heads)
            heads.append(s)
        return head_ix[s]

    for tag, path in (("t", train_zip), ("b", bus_zip)):
        rd = reader(path)
        fi = rd("feed_info.txt")[0]
        feeds[tag] = {"version": fi.get("feed_version", ""), "start": fi.get("feed_start_date", ""), "end": fi.get("feed_end_date", "")}
        # 読み（ひらがな）と英語名（読みのない駅名をローマ字で探すため）
        try:
            for r in rd("translations.txt"):
                if r.get("table_name") != "stops":
                    continue
                if r.get("language") == "ja-Hrkt" and r.get("record_id"):
                    kana[(tag, r["record_id"])] = r["translation"]
                elif r.get("language") == "en" and r.get("field_value"):
                    en.setdefault(r["field_value"].strip(), r["translation"].strip())
        except KeyError:
            pass
        routes = {}
        for r in rd("routes.txt"):
            kind = KIND.get(r["route_type"], 3)
            if kind == 3:
                label = nfkc(r["route_short_name"]) or nfkc(r["route_long_name"])
                color = "#" + r["route_color"] if r.get("route_color") else "#2e7d32"
            else:
                label = r["route_long_name"]
                color = LINE_COLOR.get(label, "#" + (r.get("route_color") or "555555"))
            key = (tag, r["route_id"])
            line_ix[key] = len(lines)
            lines.append([label, color, kind])
            routes[r["route_id"]] = kind
        trips = {t["trip_id"]: t for t in rd("trips.txt")}
        trip_kind = {tid: routes[t["route_id"]] for tid, t in trips.items()}
        st_rows = collections.defaultdict(list)
        for r in rd("stop_times.txt"):
            st_rows[r["trip_id"]].append(r)
        stop_info = {s["stop_id"]: s for s in rd("stops.txt")}

        def sid(stop_id, kind):
            key = (tag, stop_id)
            if key not in stop_ix:
                s = stop_info[stop_id]
                name = s["stop_name"].strip()
                stop_ix[key] = len(stops)
                stops.append([nid(name), round(float(s["stop_lat"]) * 1e5) - O[0], round(float(s["stop_lon"]) * 1e5) - O[1], kind])
                k = kana.get(key)
                if k and name not in kana:
                    kana[name] = k
            return stop_ix[key]

        for tid, rows in st_rows.items():
            t = trips[tid]
            kind = trip_kind[tid]
            rows.sort(key=lambda r: int(r["stop_sequence"]))
            rows = [r for r in rows if r["departure_time"] and not (r["pickup_type"] == "1" and r["drop_off_type"] == "1")]
            if len(rows) < 2:
                continue
            seq = tuple(sid(r["stop_id"], kind) for r in rows)
            # 途中で乗れない停留所（終点以外で pickup_type=1）
            nopick = tuple(i for i, r in enumerate(rows[:-1]) if r["pickup_type"] == "1")
            arr = [minutes(r["arrival_time"]) for r in rows]
            dep = [minutes(r["departure_time"]) for r in rows]
            t0 = dep[0]
            vec = tuple(arr[i] - dep[i - 1] + 100 * (dep[i] - arr[i] if i < len(rows) - 1 else 0) for i in range(1, len(rows)))
            assert all(v >= 0 for v in vec), (tid, vec)
            key = (line_ix[(tag, t["route_id"])], seq, nopick)
            sv = tag + ":" + t["service_id"]
            if sv not in svc_ix:
                svc_ix[sv] = len(svcs)
                svcs.append(sv)
            pats.setdefault(key, []).append((t0, vec, svc_ix[sv], hid(nfkc(t.get("trip_headsign", "")))))

        # 運行日
        base = {}
        for c in rd("calendar.txt"):
            base[c["service_id"]] = c
        exc = collections.defaultdict(dict)
        for c in rd("calendar_dates.txt"):
            exc[c["date"]][c["service_id"]] = c["exception_type"]
        calendars[tag] = (base, exc, max(exc) if exc else "")

    # ---- 日ごとの運行サービス ----
    wd = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    sets, set_ix, cal = [], {}, []
    ends = {tag: max(c["end_date"] for c in base.values()) for tag, (base, exc, exc_max) in calendars.items()}
    for k in range(DAYS):
        d = today + datetime.timedelta(days=k)
        ds, dt = ymd(d), day_type(d)
        act = []
        for tag, (base, exc, exc_max) in calendars.items():
            end = ends[tag]
            if ds <= exc_max or (ds <= end and not (dt == 2 and d.weekday() < 6)):
                # GTFSの運行日どおり（祝日は calendar_dates に書かれている範囲だけ）
                on = {s for s, c in base.items() if c["start_date"] <= ds <= c["end_date"] and c[wd[d.weekday()]] == "1"}
                for s, e in exc.get(ds, {}).items():
                    if e == "1":
                        on.add(s)
                    else:
                        on.discard(s)
            else:
                # 例外の範囲より先の祝日・年末年始と、時刻表の期間より先：平日・土曜・日曜休日の基本ダイヤで代える
                col = "sunday" if dt == 2 else ("saturday" if dt == 1 else "monday")
                on = {s for s, c in base.items() if c[col] == "1" and c["start_date"] <= ds and (ds <= c["end_date"] or ds > end)}
            act += [svc_ix[tag + ":" + s] for s in on if tag + ":" + s in svc_ix]
        key = tuple(sorted(act))
        if key not in set_ix:
            set_ix[key] = len(sets)
            sets.append(list(key))
        cal.append(set_ix[key])

    # ---- 出力 ----
    out_pats = []
    for (li, seq, nopick), trips in pats.items():
        trips.sort()
        vecs, vec_ix = [], {}
        hs = sorted({h for *_, h in trips}, key=lambda h: -sum(1 for *_, x in trips if x == h))
        hs_ix = {h: i for i, h in enumerate(hs)}
        flat, prev = [], 0
        for t0, vec, sv, h in trips:
            if vec not in vec_ix:
                vec_ix[vec] = len(vecs)
                vecs.append(list(vec))
            flat += [t0 - prev, vec_ix[vec], sv]
            if len(hs) > 1:
                flat.append(hs_ix[h])
            prev = t0
        p = [li, list(seq), vecs, hs, flat]
        if nopick:
            p.append(list(nopick))
        out_pats.append(p)
    data = {
        "v": 1,
        "made": ymd(today),
        "feeds": feeds,
        "ends": ends,
        "o": list(O),
        "names": names,
        "kana": [kana.get(n, "") for n in names],
        "en": [en.get(n, "") if not kana.get(n) else "" for n in names],
        "stops": [x for s in stops for x in s],
        "lines": lines,
        "heads": heads,
        "svcs": svcs,
        "pats": out_pats,
        "d0": ymd(today),
        "sets": sets,
        "cal": cal,
        "hol": [ymd(d) for d, _ in jpholiday.between(today, today + datetime.timedelta(days=DAYS + 400))],
    }
    txt = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(out, "w", encoding="utf-8") as f:
        f.write(txt)
    ntr = sum(len(v) for v in pats.values())
    print("停留所・駅", len(stops), "系統パターン", len(pats), "便", ntr, "運行日の組", len(sets), "大きさ", len(txt.encode()) // 1024, "KB")


if __name__ == "__main__":
    main(*sys.argv[1:4])
