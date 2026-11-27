"""板橋区Open Photo（openphoto.app）のページの形を調べる（GitHub Actions で動かす）。

  python explore.py <出力フォルダ>

- robots.txt を読み、取ってよいページだけを読む。1ページごとに2秒あける。
- 入口のページと、そこからのリンクを少しだけ読み、題名・リンク・画像のURL・ライセンスの表記を抜き出して op_explore.json に入れる。
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import urllib.robotparser

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
START = "https://openphoto.app/c/ita13119"
WAIT = 2.0
MAX_PAGES = 12


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    res = {"robots": "", "pages": []}
    rp = urllib.robotparser.RobotFileParser()
    try:
        req = urllib.request.Request("https://openphoto.app/robots.txt", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as r:
            txt = r.read().decode("utf-8", "replace")
        res["robots"] = txt[:3000]
        rp.parse(txt.splitlines())
    except Exception as e:  # noqa: BLE001
        res["robots"] = "読めない " + repr(e)[:100]
        rp.allow_all = True
    queue, seen = [START], set()
    while queue and len(res["pages"]) < MAX_PAGES:
        u = queue.pop(0)
        if u in seen:
            continue
        seen.add(u)
        if not rp.can_fetch(UA, u):
            res["pages"].append({"url": u, "ng": "robots"})
            continue
        try:
            req = urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "ja"})
            with urllib.request.urlopen(req, timeout=30) as r:
                html = r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            res["pages"].append({"url": u, "ng": repr(e)[:120]})
            time.sleep(WAIT)
            continue
        links = sorted(set(urllib.parse.urljoin(u, m) for m in re.findall(r'href="([^"#]+)"', html)))
        imgs = sorted(set(re.findall(r'(?:src|content)="(https?://[^"]+\.(?:jpe?g|png|webp)[^"]*)"', html, re.I)))[:40]
        title = (re.search(r"<title>(.*?)</title>", html, re.S) or [None, ""])[1]
        lic = sorted(set(re.findall(r"(CC[ -]?BY[^<\"]{0,30}|クリエイティブ・コモンズ[^<\"]{0,40}|ライセンス[^<\"]{0,40})", html)))[:20]
        res["pages"].append({"url": u, "title": title.strip()[:200], "len": len(html), "links": links[:300], "imgs": imgs, "lic": lic,
                             "head": re.sub(r"\s+", " ", html[:4000])})
        for l in links:
            if l.startswith("https://openphoto.app/") and ("/p/" in l or "/c/ita13119" in l or "page=" in l) and l not in seen:
                queue.append(l)
        time.sleep(WAIT)
    with open(os.path.join(out, "op_explore.json"), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    print("読んだページ", len(res["pages"]))


if __name__ == "__main__":
    main()
