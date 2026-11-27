"""おすすめの場所の公式ページから、時間・休み・料金・最寄駅・予約にかかわる行を抜き出す（GitHub Actions で動かす）。

  python fetch_info.py <targets.json> <出力フォルダ>

- 各サイトの robots.txt を読み、取ってよいページだけを読む。同じサイトは1ページごとに1.5秒あける。
- 入口のページと、そこからリンクされた「利用案内」「アクセス」「料金」などのページ（最大5ページ）を読む。
- 出力の info_raw.json には、ページのURLと、手がかりになる行（時刻・円・休・駅・徒歩・予約などを含む行）だけを入れる。
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

from bs4 import BeautifulSoup

UA = "itabashi-map-data/1.0 (+https://github.com/amefuto8855-max/itabashi-map)"
WAIT = 1.5
MAX_PAGES = 6
LINK_WORD = re.compile(r"利用案内|ご利用|ご案内|案内|アクセス|交通|料金|入館|入園|拝観|参拝|参観|見学|開館|開園|営業|時間|施設|visit|access|guide|info|hours|admission|ticket|チケット|about", re.I)
LINE_WORD = re.compile(r"\d{1,2}[:：]\d{2}|\d{1,2}時|休館|休園|休業|定休|休み|休日|無休|料金|円|無料|入館|入園|拝観|参観|開館|閉館|開門|閉門|開園|閉園|営業|駅|徒歩|予約|整理券|受付|公開|"
                       r"open|close|admission|yen|station|walk|reserv", re.I)
SKIP_EXT = re.compile(r"\.(pdf|jpe?g|png|gif|zip|docx?|xlsx?|pptx?|mp4)(\?|$)", re.I)
ROBOTS = {}
LAST = {}


def host_of(u):
    p = urllib.parse.urlsplit(u)
    return p.scheme + "://" + p.netloc


def robots_ok(u):
    h = host_of(u)
    if h not in ROBOTS:
        rp = urllib.robotparser.RobotFileParser()
        try:
            req = urllib.request.Request(h + "/robots.txt", headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as r:
                rp.parse(r.read().decode("utf-8", "replace").splitlines())
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                rp.disallow_all = True
            else:
                rp.allow_all = True
        except Exception:  # noqa: BLE001
            rp.allow_all = True
        ROBOTS[h] = rp
    return ROBOTS[h].can_fetch(UA, u)


def get(u):
    h = host_of(u)
    dt = time.time() - LAST.get(h, 0)
    if dt < WAIT:
        time.sleep(WAIT - dt)
    LAST[h] = time.time()
    req = urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "ja,en;q=0.5"})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read(3_000_000)
        ct = r.headers.get("Content-Type", "")
        final = r.geturl()
    if "html" not in ct and not raw.lstrip()[:200].lower().startswith((b"<!doctype", b"<html")):
        return None, final
    enc = None
    m = re.search(r"charset=([\w-]+)", ct)
    if m:
        enc = m.group(1)
    else:
        m = re.search(rb"<meta[^>]+charset=[\"']?([\w-]+)", raw[:4000], re.I)
        if m:
            enc = m.group(1).decode("ascii", "replace")
    for e in [enc, "utf-8", "cp932", "euc-jp"]:
        if not e:
            continue
        try:
            return raw.decode(e), final
        except (LookupError, UnicodeDecodeError):
            continue
    return raw.decode("utf-8", "replace"), final


def lines_of(html):
    soup = BeautifulSoup(html, "html.parser")
    for bad in soup(["script", "style", "noscript", "svg"]):
        bad.decompose()
    text = soup.get_text("\n")
    out = []
    for ln in text.split("\n"):
        ln = re.sub(r"\s+", " ", ln).strip()
        if 3 <= len(ln) <= 220 and LINE_WORD.search(ln):
            out.append(ln)
    return soup, out


def main():
    targets = json.load(open(sys.argv[1], encoding="utf-8"))["items"]
    out_dir = sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    res = {}
    for t in targets:
        r = {"name": t["name"], "pages": [], "lines": []}
        seen_lines = set()
        queue = list(t.get("urls") or [])
        seen = set()
        n = 0
        while queue and n < MAX_PAGES:
            u = queue.pop(0)
            if u in seen or SKIP_EXT.search(u):
                continue
            seen.add(u)
            if not robots_ok(u):
                r.setdefault("ng", []).append("robots: " + u)
                continue
            try:
                html, final = get(u)
            except Exception as e:  # noqa: BLE001
                r.setdefault("ng", []).append("%s: %s" % (u, repr(e)[:80]))
                continue
            n += 1
            if not html:
                continue
            soup, lines = lines_of(html)
            r["pages"].append(final)
            for ln in lines:
                if ln not in seen_lines:
                    seen_lines.add(ln)
                    r["lines"].append(ln)
            if n == 1 or len(r["pages"]) <= 2:
                base_host = urllib.parse.urlsplit(final).netloc.split(":")[0]
                cands = []
                for a in soup.find_all("a", href=True):
                    href = urllib.parse.urljoin(final, a["href"]).split("#")[0]
                    hh = urllib.parse.urlsplit(href).netloc.split(":")[0]
                    if not href.startswith("http") or not (hh == base_host or hh.endswith("." + base_host) or base_host.endswith("." + hh)):
                        continue
                    txt = (a.get_text(" ", strip=True) or "") + " " + href
                    if LINK_WORD.search(txt) and href not in seen:
                        cands.append(href)
                for c in cands[:12]:
                    if c not in queue:
                        queue.append(c)
        r["lines"] = r["lines"][:120]
        res[t["id"]] = r
        print(t["no"], t["name"], "ページ", len(r["pages"]), "行", len(r["lines"]), ("NG " + str(r.get("ng"))[:120]) if r.get("ng") else "", flush=True)
    with open(os.path.join(out_dir, "info_raw.json"), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=0)


if __name__ == "__main__":
    main()
