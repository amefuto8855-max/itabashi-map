"""ウィキメディア・コモンズのカテゴリのページ（/wiki/Category:…）をたどって、板橋区の場所の写真のファイル名を集める（GitHub Actions で動かす）。

  python cm_cats.py <出力フォルダ>

- robots.txt を読み、取ってよいページだけを読む。1ページごとに1.5秒あける。
- 「Category:Itabashi, Tokyo」から下へ3段までたどる。鉄道・寺社・学校など、区や都の施設に関係のないカテゴリはたどらない。
- 出力の cm_cats.json には、カテゴリごとに、下のカテゴリの名前とファイル名だけを入れる。
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
HOST = "https://commons.wikimedia.org"
SEEDS = ["Category:Itabashi, Tokyo"]
MAX_DEPTH = 3
MAX_PAGES = 450
WAIT = 1.5
BUDGET = 25 * 60
SKIP = re.compile(r"line\b|lines\b|station|railway|train|bus\b|buses|road|route|expressway|highway|people|map|flag|video|audio|election|"
                  r"compan|shop|restaurant|temple|shrine|jinja|-ji\b|church|school|universit|college|hospital|cemeter|grave|tomb|logo|"
                  r"symbol|emblem|coat of arms|manhole|vending|signs?\b|car\b|cars\b|vehicle|aerial|satellite|panorama|night|"
                  r"photographs by|taken with|uploaded|quality|license|cc-|pd-|deletion|maintenance|hidden|tracking|wikidata|"
                  r"nerima|toshima|kita, tokyo|saitama|wako|toda|kawaguchi|asaka|niiza|adachi|bunkyo", re.I)


def robots():
    rp = urllib.robotparser.RobotFileParser()
    try:
        req = urllib.request.Request(HOST + "/robots.txt", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as r:
            rp.parse(r.read().decode("utf-8", "replace").splitlines())
    except Exception:  # noqa: BLE001
        return None
    return rp


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def section(html, div_id):
    """カテゴリのページのうち、div_id の部分だけ（下にある親カテゴリの一覧などは含めない）"""
    i = html.find('id="' + div_id + '"')
    if i < 0:
        return ""
    ends = [html.find(k, i + 10) for k in ('id="mw-subcategories"', 'id="mw-pages"', 'id="mw-category-media"', 'class="printfooter"', 'id="catlinks"')]
    ends = [j for j in ends if j > i]
    return html[i:min(ends)] if ends else ""


def names(block, prefix):
    out = []
    for m in re.finditer(r'href="/wiki/' + prefix + r':([^"#?]+)"', block):
        n = urllib.parse.unquote(m.group(1)).replace("_", " ")
        if n not in out:
            out.append(n)
    return out


def main():
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    rp = robots()
    res = {"note": "ウィキメディア・コモンズのカテゴリのページから集めた、下のカテゴリとファイルの名前", "cats": {}}
    if rp is None:
        print("robots.txt を読めなかったので、今回は読まない")
    else:
        t0 = time.time()
        queue = [(s, 0) for s in SEEDS]
        seen = set()
        while queue and len(res["cats"]) < MAX_PAGES and time.time() - t0 < BUDGET:
            cat, d = queue.pop(0)
            if cat in seen:
                continue
            seen.add(cat)
            url = HOST + "/wiki/" + urllib.parse.quote(cat.replace(" ", "_"), safe=":(),'")
            if not rp.can_fetch(UA, url):
                res["cats"][cat] = {"d": d, "ng": "robots"}
                continue
            try:
                html = get(url)
            except Exception as e:  # noqa: BLE001
                res["cats"][cat] = {"d": d, "ng": repr(e)[:80]}
                time.sleep(WAIT)
                continue
            subs = names(section(html, "mw-subcategories"), "Category")
            files = names(section(html, "mw-category-media"), "File")
            res["cats"][cat] = {"d": d, "sub": subs, "files": files}
            if d < MAX_DEPTH:
                for s in subs:
                    if s not in seen and not SKIP.search(s):
                        queue.append(("Category:" + s, d + 1))
            time.sleep(WAIT)
        print("読んだカテゴリ", len(res["cats"]), "／残り", len(queue))
    with open(os.path.join(out_dir, "cm_cats.json"), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=0)


if __name__ == "__main__":
    main()
