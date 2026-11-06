(function () {
  'use strict';
  var root = document.getElementById('itabashi-map');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');
  var BASE = root.getAttribute('data-base') || '';
  if (BASE && BASE.charAt(BASE.length - 1) !== '/') BASE += '/';

  var AREA_ID = 'itabashi-ward';
  var AREA_NAME = '板橋区';
  var DECLINATION = -7.6;
  var DEG = Math.PI / 180;
  var EARTH_R = 6378137;
  var FONT = '-apple-system,BlinkMacSystemFont,"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic UI",Meiryo,sans-serif';
  var PAL = ['#ff8a3d', '#3ee0a1', '#ff6fb5', '#ffd23f', '#3fd4ff', '#b18cff', '#ff6b6b', '#a3e635'];
  var REC_COLOR = '#ffb020';
  var TOP = 50, BOTTOM = 80;
  var TILE_SCALE = 0.42;

  /* ---------- storage ---------- */
  var KP = 'mapnav:' + AREA_ID + ':';
  function sget(k, d) { try { var v = localStorage.getItem(KP + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function sset(k, v) {
    try {
      localStorage.setItem(KP + k, JSON.stringify(v, function (key, val) { return key.charAt(0) === '_' ? undefined : val; }));
      return true;
    } catch (e) { return false; }
  }
  function sdel(k) { try { localStorage.removeItem(KP + k); } catch (e) {} }

  /* ---------- state ---------- */
  var S = {
    cw: 1, ch: 1, dpr: 1,
    view: { s: 1, tx: 0, ty: 0, fit: 1, touched: false },
    corr: sget('corr', { dx: 0, dy: 0 }),
    fix: null, outside: false, outDist: 0, district: '', lastFixAt: 0,
    gpsOn: false, watchId: null, gpsErr: '', pendingCenter: false,
    heading: null, hx: 0, hy: 1, oriOn: false, oriAsked: false, lastOriAt: 0,
    follow: false,
    rec: null, recTimer: null, newSeg: false,
    routes: sget('routes', []),
    shown: sget('shown', {}),
    corrMode: false, sheet: false, fs: false, wake: null,
    pinsOn: sget('pins', true) !== false, selPin: -1
  };
  if (!S.corr || typeof S.corr.dx !== 'number') S.corr = { dx: 0, dy: 0 };
  if (!Array.isArray(S.routes)) S.routes = [];

  /* ---------- data (filled after data.json loads) ---------- */
  var D = null, ready = false;
  var G = null, OUT = [], OB = [0, 0, 1, 1], DIST = [], TILES = [], PINS = [], PMIN = 10, PMAX = 1000, OV = null;

  /* ---------- geo: Web Mercator, world units = zoom-17 pixels ---------- */
  function rawW(lat, lon) {
    var X = EARTH_R * lon * DEG;
    var Y = EARTH_R * Math.log(Math.tan(Math.PI / 4 + lat * DEG / 2));
    return [(X - G.X0) / G.R0, (G.Y0 - Y) / G.R0];
  }
  function toW(lat, lon) { var p = rawW(lat, lon); p[0] += S.corr.dx; p[1] += S.corr.dy; return p; }
  function unitsPerMeter(lat) { return 1 / (G.R0 * Math.cos((lat == null ? G.lat0 : lat) * DEG)); }
  function hdgVec(h) { return [Math.sin(h * DEG), -Math.cos(h * DEG)]; }
  function hav(a1, o1, a2, o2) {
    var p1 = a1 * DEG, p2 = a2 * DEG, dp = p2 - p1, dl = (o2 - o1) * DEG;
    var h = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return 12742017.6 * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  /* ---------- polygons ---------- */
  function bbox(poly) {
    var b = [1e18, 1e18, -1e18, -1e18];
    for (var i = 0; i < poly.length; i++) {
      var p = poly[i];
      if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1];
      if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1];
    }
    return b;
  }
  function inPoly(poly, x, y) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function distToPoly(poly, x, y) {
    var best = 1e30;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var ax = poly[j][0], ay = poly[j][1], bx = poly[i][0], by = poly[i][1];
      var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, t = L ? ((x - ax) * dx + (y - ay) * dy) / L : 0;
      t = Math.max(0, Math.min(1, t));
      var ex = ax + t * dx - x, ey = ay + t * dy - y, d2 = ex * ex + ey * ey;
      if (d2 < best) best = d2;
    }
    return Math.sqrt(best);
  }
  function insideWard(x, y) { return x >= OB[0] && y >= OB[1] && x <= OB[2] && y <= OB[3] && inPoly(OUT, x, y); }
  function districtAt(x, y) {
    var best = '', bd = 40, i, d, b;
    for (i = 0; i < DIST.length; i++) {
      d = DIST[i]; b = d.b;
      if (x < b[0] || y < b[1] || x > b[2] || y > b[3]) continue;
      if (inPoly(d.p, x, y)) return d.name;
    }
    for (i = 0; i < DIST.length; i++) {
      d = DIST[i]; b = d.b;
      if (x < b[0] - bd || y < b[1] - bd || x > b[2] + bd || y > b[3] + bd) continue;
      var dd = distToPoly(d.p, x, y);
      if (dd < bd) { bd = dd; best = d.name; }
    }
    return best;
  }

  /* ---------- format ---------- */
  var WD = '日月火水木金土';
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDist(m) { return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(2) + ' km'; }
  function fmtAway(m) { return m < 1000 ? '約' + (Math.round(m / 10) * 10 || 10) + ' m' : '約' + (m / 1000).toFixed(1) + ' km'; }
  function fmtClock(ms) {
    var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
    return (h ? h + ':' + p2(m) : m) + ':' + p2(s % 60);
  }
  function fmtDurJa(ms) {
    var m = Math.max(0, Math.round(ms / 60000));
    if (m < 60) return m + '分';
    return Math.floor(m / 60) + '時間' + (m % 60 ? (m % 60) + '分' : '');
  }
  function hhmm(ms) { var d = new Date(ms); return d.getHours() + ':' + p2(d.getMinutes()); }
  function fmtDay(ms, withYear) {
    var d = new Date(ms);
    return (withYear ? d.getFullYear() + '年' : '') + (d.getMonth() + 1) + '月' + d.getDate() + '日（' + WD[d.getDay()] + '）';
  }
  function fileStamp(ms) {
    var d = new Date(ms);
    return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + '_' + p2(d.getHours()) + p2(d.getMinutes());
  }
  function r6(x) { return Math.round(x * 1e6) / 1e6; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- DOM ---------- */
  var ICON = {
    loc: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.6" fill="currentColor"/><circle cx="12" cy="12" r="7.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    rec: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="#ff5a4f"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="#ff5a4f"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2.6c-3.5 0-6.3 2.7-6.3 6.2 0 4.5 6.3 12.4 6.3 12.4s6.3-7.9 6.3-12.4c0-3.5-2.8-6.2-6.3-6.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="8.9" r="2.3" fill="currentColor"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8.5 6.5h11.5M8.5 12h11.5M8.5 17.5h11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4.3" cy="6.5" r="1.5" fill="currentColor"/><circle cx="4.3" cy="12" r="1.5" fill="currentColor"/><circle cx="4.3" cy="17.5" r="1.5" fill="currentColor"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    unfull: '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  var CSS = [
    '#itabashi-map{--bg:#000;--panel:rgba(16,22,36,.9);--panel2:rgba(24,31,49,.97);--line:rgba(255,255,255,.14);--tx:#f3f6fb;--sub:#a9b4c8;--acc:#4da3ff;--rec:#ff5a4f;',
    'position:relative;display:block;width:100%;height:72vh;height:72svh;min-height:380px;max-height:900px;margin:0;padding:0;background:var(--bg);border-radius:14px;overflow:hidden;color:var(--tx);',
    'font:14px/1.45 ' + FONT + ';text-align:left;letter-spacing:0;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;touch-action:none;box-sizing:border-box}',
    '#itabashi-map *{box-sizing:border-box}',
    '#itabashi-map [hidden]{display:none!important}',
    '#itabashi-map.izm-fs{position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%!important;min-height:0;max-height:none;border-radius:0;z-index:2147483000}',
    '#itabashi-map canvas{position:absolute;left:0;top:0;width:100%!important;height:100%!important;max-width:none!important;display:block;margin:0;padding:0;border:0;background:transparent;box-shadow:none;touch-action:none}',
    '#itabashi-map button{-webkit-appearance:none;appearance:none;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;line-height:1.2;text-transform:none;letter-spacing:0;min-width:0;min-height:0;width:auto;height:auto;box-shadow:none;border-radius:0;cursor:pointer;touch-action:manipulation}',
    '#itabashi-map svg{display:block;width:22px;height:22px;fill:none;overflow:visible}',
    '#itabashi-map .izm-top{position:absolute;left:10px;right:66px;top:10px;z-index:3;display:flex;flex-wrap:wrap;gap:6px;pointer-events:none}',
    '#itabashi-map .izm-pill{display:flex;align-items:center;gap:8px;max-width:100%;padding:6px 12px;border-radius:999px;background:var(--panel);border:1px solid var(--line);font-size:13px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '#itabashi-map .izm-pill.izm-warn{color:#ffd27a;border-color:rgba(255,210,122,.45)}',
    '#itabashi-map .izm-pill b{font-weight:700}',
    '#itabashi-map .izm-hud{font-weight:700;font-variant-numeric:tabular-nums}',
    '#itabashi-map .izm-rdot{width:10px;height:10px;border-radius:50%;background:var(--rec);box-shadow:0 0 0 3px rgba(255,90,79,.25);animation:izmblink 1.2s infinite}',
    '@keyframes izmblink{50%{opacity:.3}}',
    '#itabashi-map .izm-side{position:absolute;right:10px;top:10px;z-index:3;display:flex;flex-direction:column;gap:6px}',
    '#itabashi-map .izm-side button{width:46px;height:44px;border-radius:11px;background:var(--panel);border:1px solid var(--line);display:flex;align-items:center;justify-content:center}',
    '#itabashi-map .izm-side button.izm-lay{height:56px;flex-direction:column;gap:3px;font-size:10.5px;font-weight:700}',
    '#itabashi-map .izm-side button.izm-on{background:rgba(77,163,255,.24);border-color:rgba(77,163,255,.75);color:#dcedff}',
    '#itabashi-map .izm-legend{position:absolute;left:10px;bottom:78px;z-index:3;width:170px;padding:6px 10px 7px;border-radius:10px;background:var(--panel);border:1px solid var(--line);font-size:11px;pointer-events:none}',
    '#itabashi-map .izm-lg-bar{height:8px;margin:4px 0 3px;border-radius:4px;background:linear-gradient(90deg,hsl(240,95%,52%),hsl(180,95%,52%),hsl(120,95%,52%),hsl(60,95%,52%),hsl(0,95%,52%))}',
    '#itabashi-map .izm-lg-n{position:relative;height:14px;color:var(--sub);font-variant-numeric:tabular-nums}',
    '#itabashi-map .izm-lg-n span{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}',
    '#itabashi-map .izm-lg-n span:first-child{transform:none}',
    '#itabashi-map .izm-lg-n span:last-child{transform:translateX(-100%)}',
    '#itabashi-map .izm-bar{position:absolute;left:8px;right:8px;bottom:8px;z-index:4;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}',
    '#itabashi-map .izm-bar button{position:relative;height:60px;border-radius:12px;background:var(--panel);border:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden}',
    '#itabashi-map .izm-bar button.izm-on{background:rgba(77,163,255,.24);border-color:rgba(77,163,255,.75);color:#dcedff}',
    '#itabashi-map .izm-bar button.izm-recon{background:rgba(255,90,79,.2);border-color:rgba(255,90,79,.8);color:#ffdcd9}',
    '#itabashi-map .izm-badge{position:absolute;top:7px;right:calc(50% - 19px);width:8px;height:8px;border-radius:50%;background:#3ee0a1}',
    '#itabashi-map .izm-banner{position:absolute;left:10px;right:10px;top:10px;z-index:5;padding:11px 12px;border-radius:12px;background:var(--panel2);border:1px solid rgba(77,163,255,.65);display:flex;flex-direction:column;gap:8px;box-shadow:0 6px 24px rgba(0,0,0,.35)}',
    '#itabashi-map .izm-sub{color:var(--sub);font-size:12.5px}',
    '#itabashi-map .izm-row{display:flex;gap:8px;flex-wrap:wrap}',
    '#itabashi-map .izm-btn{height:36px;padding:0 14px;border-radius:9px;background:rgba(255,255,255,.1);border:1px solid var(--line);font-size:13px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}',
    '#itabashi-map .izm-btn.izm-pri{background:var(--acc);border-color:var(--acc);color:#06121f}',
    '#itabashi-map .izm-btn.izm-danger{background:rgba(255,90,79,.16);border-color:rgba(255,90,79,.6);color:#ffd6d2}',
    '#itabashi-map .izm-btn.izm-sel{background:rgba(77,163,255,.26);border-color:rgba(77,163,255,.75);color:#dcedff}',
    '#itabashi-map .izm-btn.izm-ask{background:var(--rec);border-color:var(--rec);color:#fff}',
    '#itabashi-map.izm-sheet-open .izm-toast{bottom:auto;top:58px}',
    '#itabashi-map .izm-toast{position:absolute;left:50%;bottom:80px;z-index:8;transform:translateX(-50%);width:max-content;max-width:calc(100% - 24px);padding:9px 14px;border-radius:10px;background:rgba(10,14,24,.96);border:1px solid var(--line);font-size:13px;text-align:center;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.35)}',
    '#itabashi-map .izm-sheet{position:absolute;left:0;right:0;bottom:0;z-index:7;max-height:72%;display:flex;flex-direction:column;background:var(--panel2);border-top:1px solid var(--line);border-radius:16px 16px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.4)}',
    '#itabashi-map .izm-sheet-head{display:flex;align-items:center;gap:6px;padding:12px 8px 6px 16px;font-size:15px;font-weight:700}',
    '#itabashi-map .izm-sheet-head .izm-sh-t{margin-right:auto;white-space:nowrap}',
    '#itabashi-map .izm-sheet-head .izm-x{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:10px}',
    '#itabashi-map .izm-btn.izm-sm{height:32px;padding:0 10px;font-size:12px}',
    '#itabashi-map .izm-file{position:relative;overflow:hidden;cursor:pointer}',
    '#itabashi-map .izm-file input{position:absolute;left:0;top:0;width:100%;height:100%;margin:0;padding:0;opacity:0;cursor:pointer;font-size:16px}',
    '#itabashi-map .izm-sheet-body{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;padding:0 10px 14px}',
    '#itabashi-map .izm-item{margin-top:8px;padding:10px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.03)}',
    '#itabashi-map .izm-item-head{display:flex;align-items:center;gap:10px;width:100%;text-align:left}',
    '#itabashi-map .izm-sw{flex:none;width:14px;height:14px;border-radius:4px}',
    '#itabashi-map .izm-ttl{font-weight:700;font-size:14px}',
    '#itabashi-map .izm-go{margin-left:auto;color:var(--sub);font-size:12px;white-space:nowrap}',
    '#itabashi-map .izm-acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}',
    '#itabashi-map .izm-acts .izm-btn{height:32px;padding:0 11px;font-size:12.5px}',
    '#itabashi-map .izm-empty{padding:22px 6px;text-align:center;color:var(--sub)}',
    '#itabashi-map .izm-dialog{position:absolute;left:0;top:0;right:0;bottom:0;z-index:9;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6)}',
    '#itabashi-map .izm-card{width:100%;max-width:360px;padding:16px;border-radius:14px;background:var(--panel2);border:1px solid var(--line)}',
    '#itabashi-map .izm-card p{margin:0 0 14px;font-size:14px}',
    '#itabashi-map .izm-card .izm-row{justify-content:flex-end}',
    '#itabashi-map .izm-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;color:var(--sub);font-size:13px}',
    '#itabashi-map .izm-err{position:absolute;left:12px;right:12px;top:12px;z-index:10;padding:12px;border-radius:10px;background:#3a1518;color:#ffd6d2;font-size:13px}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  root.innerHTML =
    '<canvas class="izm-cv"></canvas>' +
    '<div class="izm-loading">地図を読み込み中…</div>' +
    '<div class="izm-top"><div class="izm-pill izm-status"></div><div class="izm-pill izm-hud" hidden><span class="izm-rdot"></span><span class="izm-hudtxt"></span></div></div>' +
    '<div class="izm-legend" hidden><div>総戸数</div><div class="izm-lg-bar"></div><div class="izm-lg-n"></div></div>' +
    '<div class="izm-side">' +
    '<button type="button" class="izm-lay" data-act="pins" aria-label="ピンの表示切替">' + ICON.pin + '<span>ピン</span></button>' +
    '<button type="button" data-act="zin" aria-label="拡大">' + ICON.plus + '</button><button type="button" data-act="zout" aria-label="縮小">' + ICON.minus + '</button></div>' +
    '<div class="izm-banner" hidden></div>' +
    '<div class="izm-bar">' +
      '<button type="button" data-act="locate">' + ICON.loc + '<span>現在地へ</span></button>' +
      '<button type="button" data-act="rec">' + ICON.rec + '<span>記録開始</span></button>' +
      '<button type="button" data-act="fix">' + ICON.pin + '<span>補正</span><i class="izm-badge" hidden></i></button>' +
      '<button type="button" data-act="list">' + ICON.list + '<span>記録一覧</span></button>' +
      '<button type="button" data-act="full">' + ICON.full + '<span>全画面</span></button>' +
    '</div>' +
    '<div class="izm-sheet" hidden><div class="izm-sheet-head"><span class="izm-sh-t">記録一覧</span>' +
    '<button type="button" class="izm-btn izm-sm" data-act="saveall">まとめて保存</button>' +
    '<label class="izm-btn izm-sm izm-file">GPXから復元<input type="file" class="izm-gpxin" multiple></label>' +
    '<button type="button" class="izm-x" data-act="closelist" aria-label="閉じる">' + ICON.close + '</button></div><div class="izm-sheet-body"></div></div>' +
    '<div class="izm-toast" hidden></div>' +
    '<div class="izm-dialog" hidden></div>';
  root.style.visibility = '';

  function q(sel) { return root.querySelector(sel); }
  var cv = q('.izm-cv'), ctx = cv.getContext('2d');
  var elStatus = q('.izm-status'), elHud = q('.izm-hud'), elHudTxt = q('.izm-hudtxt');
  var elBanner = q('.izm-banner'), elSheet = q('.izm-sheet'), elList = q('.izm-sheet-body');
  var elToast = q('.izm-toast'), elDialog = q('.izm-dialog'), elTop = q('.izm-top');
  var elLegend = q('.izm-legend'), elLoading = q('.izm-loading');
  var btn = {
    locate: q('[data-act=locate]'), rec: q('[data-act=rec]'), fix: q('[data-act=fix]'),
    list: q('[data-act=list]'), full: q('[data-act=full]'), pins: q('[data-act=pins]')
  };

  /* ---------- images ---------- */
  function makeImg(src, onload) {
    var im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = function () { im._ok = true; if (onload) onload(); };
    im.onerror = function () { im._err = true; };
    im.src = src;
    return im;
  }
  function ensureTile(t) {
    if (!t.im) t.im = makeImg(BASE + t.file, draw);
  }
  function loadTilePromise(t) {
    ensureTile(t);
    return new Promise(function (res) {
      if (t.im._ok || t.im._err) return res();
      var done = false;
      var tm = setTimeout(function () { if (!done) { done = true; res(); } }, 10000);
      t.im.addEventListener('load', function () { if (!done) { done = true; clearTimeout(tm); res(); } });
      t.im.addEventListener('error', function () { if (!done) { done = true; clearTimeout(tm); res(); } });
    });
  }

  /* ---------- pins ---------- */
  function pinHue(n) {
    var t = (Math.log(Math.max(n, PMIN)) - Math.log(PMIN)) / (Math.log(PMAX) - Math.log(PMIN));
    return Math.round(240 * (1 - Math.max(0, Math.min(1, t))));
  }
  function buildLegend() {
    var marks = [PMIN, 100, PMAX], h = '';
    marks.forEach(function (m, i) {
      var t = (Math.log(m) - Math.log(PMIN)) / (Math.log(PMAX) - Math.log(PMIN));
      h += '<span style="left:' + (t * 100).toFixed(1) + '%">' + m + '戸' + (i === marks.length - 1 ? '' : '') + '</span>';
    });
    q('.izm-lg-n').innerHTML = h;
  }

  /* ---------- outside / district ---------- */
  function refreshPlace() {
    if (!S.fix || !ready) return;
    var p = toW(S.fix.lat, S.fix.lon);
    S.outside = !insideWard(p[0], p[1]);
    S.outDist = S.outside ? distToPoly(OUT, p[0], p[1]) / unitsPerMeter(S.fix.lat) : 0;
    S.district = S.outside ? '' : districtAt(p[0], p[1]);
  }

  /* ---------- view ---------- */
  function scaleLimits() { var v = S.view; return [v.fit * 0.6, Math.max(v.fit * 3, 4)]; }
  function routeBox(r) {
    var segs = routeW(r), n = 0;
    segs.forEach(function (sg) { n += sg.length; });
    if (!r._b || r._bn !== n) {
      var b = [1e18, 1e18, -1e18, -1e18];
      segs.forEach(function (sg) {
        sg.forEach(function (p) {
          if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1]; if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1];
        });
      });
      r._b = b; r._bn = n;
    }
    var c = S.corr;
    return [r._b[0] + c.dx, r._b[1] + c.dy, r._b[2] + c.dx, r._b[3] + c.dy];
  }
  function region() {
    var r = OB.slice();
    function add(x0, y0, x1, y1) {
      if (x0 < r[0]) r[0] = x0; if (y0 < r[1]) r[1] = y0;
      if (x1 > r[2]) r[2] = x1; if (y1 > r[3]) r[3] = y1;
    }
    if (S.fix) { var p = toW(S.fix.lat, S.fix.lon); add(p[0], p[1], p[0], p[1]); }
    var list = S.routes.filter(function (x) { return S.shown[x.id]; });
    if (S.rec) list.push(S.rec);
    list.forEach(function (x) { var b = routeBox(x); if (b[0] <= b[2]) add(b[0], b[1], b[2], b[3]); });
    return r;
  }
  function clampView() {
    var v = S.view, lim = scaleLimits(), r = region(), m = 80;
    if (v.s < lim[0]) v.s = lim[0];
    if (v.s > lim[1]) v.s = lim[1];
    v.tx = Math.min(Math.max(v.tx, m - r[2] * v.s), S.cw - m - r[0] * v.s);
    v.ty = Math.min(Math.max(v.ty, m - r[3] * v.s), S.ch - m - r[1] * v.s);
  }
  function fitView() {
    var v = S.view, BW = OB[2] - OB[0], BH = OB[3] - OB[1];
    v.s = v.fit;
    v.tx = (S.cw - BW * v.s) / 2 - OB[0] * v.s;
    v.ty = TOP + (S.ch - TOP - BOTTOM - BH * v.s) / 2 - OB[1] * v.s;
  }
  function resize(refit) {
    if (ready && !S.fs) {
      var BW = OB[2] - OB[0], BH = OB[3] - OB[1];
      var want = Math.round(Math.min(Math.max(root.clientWidth * BH / BW + TOP + BOTTOM, 380), (window.innerHeight || 800) * 0.82));
      if (Math.abs(root.offsetHeight - want) > 1) root.style.height = want + 'px';
    }
    var r = root.getBoundingClientRect();
    var cw = Math.max(1, Math.round(r.width)), ch = Math.max(1, Math.round(r.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!refit && cw === S.cw && ch === S.ch && dpr === S.dpr) return;
    var v = S.view, ocw = S.cw, och = S.ch;
    S.cw = cw; S.ch = ch; S.dpr = dpr;
    cv.width = Math.round(cw * dpr);
    cv.height = Math.round(ch * dpr);
    if (!ready) return;
    v.fit = Math.max(0.005, Math.min((cw - 24) / (OB[2] - OB[0]), (ch - TOP - BOTTOM) / (OB[3] - OB[1])));
    if (refit || !v.touched) fitView();
    else {
      var ix = (ocw / 2 - v.tx) / v.s, iy = (och / 2 - v.ty) / v.s;
      v.tx = cw / 2 - ix * v.s; v.ty = ch / 2 - iy * v.s;
      clampView();
    }
    if (S.follow) followNow();
    draw();
  }
  function zoomAt(k, fx, fy) {
    var v = S.view, lim = scaleLimits(), s0 = v.s;
    var s1 = Math.min(Math.max(s0 * k, lim[0]), lim[1]);
    var dot = S.follow ? dotScreen() : null;
    if (dot) { fx = dot[0]; fy = dot[1]; }
    v.tx = fx - (fx - v.tx) * (s1 / s0);
    v.ty = fy - (fy - v.ty) * (s1 / s0);
    v.s = s1; v.touched = true;
    clampView(); draw();
  }
  function centerY() { return TOP + (S.ch - TOP - BOTTOM) / 2; }
  function centerOnW(p, minScale) {
    var v = S.view;
    if (minScale && v.s < minScale) v.s = Math.min(minScale, scaleLimits()[1]);
    v.tx = S.cw / 2 - p[0] * v.s;
    v.ty = centerY() - p[1] * v.s;
    v.touched = true;
    clampView(); draw();
  }
  function dotScreen() {
    if (!S.fix || !ready) return null;
    var p = toW(S.fix.lat, S.fix.lon), v = S.view;
    return [v.tx + p[0] * v.s, v.ty + p[1] * v.s];
  }
  function followNow(zoomIn) { if (S.fix) centerOnW(toW(S.fix.lat, S.fix.lon), zoomIn ? 1.2 : 0); }

  /* ---------- drawing ---------- */
  var raf = 0;
  function draw() { if (!raf) raf = (window.requestAnimationFrame || setTimeout)(render); }

  function routeW(r) {
    if (!r._w) r._w = r.segs.map(function (sg) { return sg.map(function (p) { return rawW(p[0], p[1]); }); });
    return r._w;
  }
  function drawRoute(c, r, color, map, k, isRec) {
    var segs = routeW(r), dx = S.corr.dx, dy = S.corr.dy, i, j, sg, pt;
    c.lineJoin = 'round'; c.lineCap = 'round';
    for (var pass = 0; pass < 2; pass++) {
      c.strokeStyle = pass ? color : 'rgba(0,0,0,.6)';
      c.lineWidth = (pass ? 4 : 7.5) * k;
      for (i = 0; i < segs.length; i++) {
        sg = segs[i];
        if (sg.length < 2) continue;
        c.beginPath();
        for (j = 0; j < sg.length; j++) {
          pt = map(sg[j][0] + dx, sg[j][1] + dy);
          if (j) c.lineTo(pt[0], pt[1]); else c.moveTo(pt[0], pt[1]);
        }
        c.stroke();
      }
    }
    var first = null, last = null;
    for (i = 0; i < segs.length; i++) if (segs[i].length) { first = segs[i][0]; break; }
    for (i = segs.length - 1; i >= 0; i--) if (segs[i].length) { last = segs[i][segs[i].length - 1]; break; }
    if (first) marker(c, map(first[0] + dx, first[1] + dy), color, k, true);
    if (last && !isRec && last !== first) marker(c, map(last[0] + dx, last[1] + dy), color, k, false);
  }
  function marker(c, p, color, k, isStart) {
    c.beginPath(); c.arc(p[0], p[1], 6.5 * k, 0, Math.PI * 2);
    c.fillStyle = isStart ? '#fff' : color; c.fill();
    c.lineWidth = 3 * k; c.strokeStyle = isStart ? color : '#fff'; c.stroke();
  }
  function currentHeading() {
    var now = Date.now();
    if (S.heading != null && now - S.lastOriAt < 3000) return S.heading;
    if (S.fix && S.fix.heading != null && S.fix.speed != null && S.fix.speed > 0.7) return S.fix.heading;
    return null;
  }
  function drawLocation(c) {
    var d = dotScreen();
    if (!d) return;
    var sx = d[0], sy = d[1], v = S.view;
    var stale = Date.now() - S.lastFixAt > 30000;
    var col = stale ? '#8a94a6' : '#3d9bff';
    var rr = S.fix.acc * unitsPerMeter(S.fix.lat) * v.s;
    if (rr > 10) {
      c.beginPath(); c.arc(sx, sy, rr, 0, Math.PI * 2);
      c.fillStyle = stale ? 'rgba(138,148,166,.14)' : 'rgba(77,163,255,.16)'; c.fill();
      c.lineWidth = 1.2; c.strokeStyle = stale ? 'rgba(138,148,166,.55)' : 'rgba(77,163,255,.6)'; c.stroke();
    }
    var h = stale ? null : currentHeading();
    if (h != null) {
      var hv = hdgVec(h), ang = Math.atan2(hv[1], hv[0]), sp = 27 * DEG, L = 70;
      var g = c.createRadialGradient(sx, sy, 6, sx, sy, L);
      g.addColorStop(0, 'rgba(95,178,255,.85)'); g.addColorStop(1, 'rgba(95,178,255,0)');
      c.beginPath(); c.moveTo(sx, sy); c.arc(sx, sy, L, ang - sp, ang + sp); c.closePath();
      c.fillStyle = g; c.fill();
    }
    c.save();
    c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 6;
    c.beginPath(); c.arc(sx, sy, 9.5, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill();
    c.restore();
    c.beginPath(); c.arc(sx, sy, 6.8, 0, Math.PI * 2); c.fillStyle = col; c.fill();
    if (h != null) {
      var hv2 = hdgVec(h), ax = hv2[0], ay = hv2[1], tx = sx + ax * 19, ty = sy + ay * 19;
      c.beginPath();
      c.moveTo(tx, ty);
      c.lineTo(sx + ax * 11 - ay * 6, sy + ay * 11 + ax * 6);
      c.lineTo(sx + ax * 11 + ay * 6, sy + ay * 11 - ax * 6);
      c.closePath();
      c.fillStyle = '#fff'; c.fill();
    }
  }
  function pinMode() { return S.view.s >= 0.5 ? 'pin' : 'dot'; }
  function pinScreen(p) { var v = S.view; return [v.tx + p.x * v.s, v.ty + p.y * v.s]; }
  function drawPin(c, x, y, hue, big) {
    var k = big ? 1.3 : 1, r = 7.5 * k, h = 21 * k;
    c.save();
    c.translate(x, y);
    c.beginPath(); c.ellipse(0, 0, 4.5 * k, 1.8 * k, 0, 0, Math.PI * 2); c.fillStyle = 'rgba(0,0,0,.45)'; c.fill();
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(-2.5 * k, -5 * k, -r, -8 * k, -r, -h + r);
    c.arc(0, -h + r, r, Math.PI, 0);
    c.bezierCurveTo(r, -8 * k, 2.5 * k, -5 * k, 0, 0);
    c.closePath();
    c.fillStyle = 'hsl(' + hue + ',95%,52%)'; c.fill();
    c.lineWidth = 1.6; c.strokeStyle = big ? '#fff' : 'rgba(255,255,255,.92)'; c.stroke();
    c.beginPath(); c.arc(0, -h + r, 2.6 * k, 0, Math.PI * 2); c.fillStyle = 'rgba(0,0,0,.38)'; c.fill();
    c.restore();
  }
  function drawDot(c, x, y, hue, big) {
    var r = big ? 6 : Math.max(2.2, Math.min(4.2, 2.2 + S.view.s * 4));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = 'hsl(' + hue + ',95%,52%)'; c.fill();
    c.lineWidth = big ? 2 : 0.8; c.strokeStyle = big ? '#fff' : 'rgba(0,0,0,.55)'; c.stroke();
  }
  function drawPins(c) {
    var mode = pinMode(), fn = mode === 'pin' ? drawPin : drawDot;
    for (var i = 0; i < PINS.length; i++) {
      if (i === S.selPin) continue;
      var s = pinScreen(PINS[i]);
      if (s[0] < -30 || s[1] < -10 || s[0] > S.cw + 30 || s[1] > S.ch + 40) continue;
      fn(c, s[0], s[1], PINS[i].hue, false);
    }
    if (S.selPin >= 0) { var t = pinScreen(PINS[S.selPin]); fn(c, t[0], t[1], PINS[S.selPin].hue, true); }
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function drawPinLabel(c, p) {
    var s = pinScreen(p), txt = '総戸数 ' + p.n + '戸';
    if (s[0] < 0 || s[0] > S.cw || s[1] < 0 || s[1] > S.ch + 20) return;
    c.font = '700 13px ' + FONT;
    var lift = pinMode() === 'pin' ? 21 * 1.3 : 8;
    var w = c.measureText(txt).width + 20, h = 28, x = s[0] - w / 2, y = s[1] - lift - h - 6;
    x = Math.max(6, Math.min(S.cw - w - 6, x));
    if (y < 6) y = s[1] + 10;
    roundRect(c, x, y, w, h, 8);
    c.fillStyle = 'rgba(10,14,24,.95)'; c.fill();
    c.lineWidth = 1.5; c.strokeStyle = 'hsl(' + p.hue + ',95%,60%)'; c.stroke();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(txt, x + w / 2, y + h / 2 + 0.5);
    c.textAlign = 'start'; c.textBaseline = 'alphabetic';
  }
  function pickPin(pt) {
    var hit = -1, best = 1e9, pinM = pinMode() === 'pin';
    for (var i = 0; i < PINS.length; i++) {
      var s = pinScreen(PINS[i]), d = Math.hypot(pt.x - s[0], pt.y - (pinM ? s[1] - 13 : s[1]));
      if (d < (pinM ? 18 : 12) && d <= best) { best = d; hit = i; }
    }
    return hit;
  }
  function drawImageM(c, im, m, k, ox, oy, dpr) {
    c.setTransform(dpr * k * m[0], dpr * k * m[3], dpr * k * m[1], dpr * k * m[4], dpr * (k * m[2] + ox), dpr * (k * m[5] + oy));
    c.drawImage(im, 0, 0);
  }
  function drawMap(c, k, ox, oy, dpr, x0, y0, x1, y1, forceTiles) {
    c.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in c) c.imageSmoothingQuality = 'high';
    var useTiles = forceTiles || k * dpr >= TILE_SCALE;
    var allTiles = true;
    if (useTiles) {
      for (var i = 0; i < TILES.length; i++) {
        var t = TILES[i], b = t.b;
        if (b[2] < x0 || b[0] > x1 || b[3] < y0 || b[1] > y1) continue;
        ensureTile(t);
        if (!t.im._ok) allTiles = false;
      }
    }
    if ((!useTiles || !allTiles) && OV && OV.im && OV.im._ok) drawImageM(c, OV.im, OV.m, k, ox, oy, dpr);
    if (useTiles) {
      for (var j = 0; j < TILES.length; j++) {
        var u = TILES[j], ub = u.b;
        if (ub[2] < x0 || ub[0] > x1 || ub[3] < y0 || ub[1] > y1) continue;
        if (u.im && u.im._ok) drawImageM(c, u.im, u.m, k, ox, oy, dpr);
      }
    }
  }
  function render() {
    raf = 0;
    if (!ready) return;
    var v = S.view, d = S.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cv.width, cv.height);
    var x0 = -v.tx / v.s, y0 = -v.ty / v.s, x1 = (S.cw - v.tx) / v.s, y1 = (S.ch - v.ty) / v.s;
    drawMap(ctx, v.s, v.tx, v.ty, d, x0, y0, x1, y1, false);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    var map = function (x, y) { return [v.tx + x * v.s, v.ty + y * v.s]; };
    for (var i = S.routes.length - 1; i >= 0; i--) {
      var r = S.routes[i];
      if (S.shown[r.id]) drawRoute(ctx, r, PAL[(r.c || 0) % PAL.length], map, 1, false);
    }
    if (S.rec) drawRoute(ctx, S.rec, REC_COLOR, map, 1, true);
    if (S.pinsOn) drawPins(ctx);
    drawLocation(ctx);
    if (S.pinsOn && S.selPin >= 0) drawPinLabel(ctx, PINS[S.selPin]);
  }

  /* ---------- status ---------- */
  function setStatus(html, warn) {
    elStatus.innerHTML = html;
    elStatus.classList.toggle('izm-warn', !!warn);
  }
  function updateStatus() {
    if (S.corrMode) { elTop.hidden = true; return; }
    elTop.hidden = false;
    if (!ready) return setStatus('地図を読み込み中…', false);
    if (S.gpsErr && !S.fix) return setStatus(esc(S.gpsErr), true);
    if (!S.gpsOn) return setStatus('「現在地へ」を押すと位置情報を使います', false);
    if (!S.fix) return setStatus('現在地を取得中…', false);
    if (Date.now() - S.lastFixAt > 30000) return setStatus('位置情報の更新が止まっています', true);
    if (S.outside) return setStatus(AREA_NAME + 'の外にいます（境界まで' + fmtAway(S.outDist) + '）', true);
    setStatus((S.district ? '<b>' + esc(S.district) + '</b>　' : '') + '誤差 ±' + Math.max(1, Math.round(S.fix.acc)) + ' m', false);
  }
  function updateHud() {
    if (!S.rec) return;
    elHudTxt.textContent = '記録中　' + fmtDist(S.rec.dist) + '　' + fmtClock(Date.now() - S.rec.start);
  }
  function updateButtons() {
    btn.locate.classList.toggle('izm-on', S.follow);
    btn.fix.classList.toggle('izm-on', S.corrMode);
    btn.list.classList.toggle('izm-on', S.sheet);
    btn.pins.classList.toggle('izm-on', S.pinsOn);
    elLegend.hidden = !S.pinsOn || !PINS.length;
    q('.izm-badge').hidden = !G || Math.sqrt(S.corr.dx * S.corr.dx + S.corr.dy * S.corr.dy) / unitsPerMeter() < 0.5;
    if (S.rec) { btn.rec.classList.add('izm-recon'); btn.rec.innerHTML = ICON.stop + '<span>停止</span>'; }
    else { btn.rec.classList.remove('izm-recon'); btn.rec.innerHTML = ICON.rec + '<span>記録開始</span>'; }
    btn.full.innerHTML = S.fs ? ICON.unfull + '<span>戻る</span>' : ICON.full + '<span>全画面</span>';
    elHud.hidden = !S.rec;
    updateHud();
  }
  var toastT = 0;
  function toast(msg, ms) {
    elToast.textContent = msg;
    elToast.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { elToast.hidden = true; }, ms || 3200);
  }
  function showError(msg) {
    var e = document.createElement('div');
    e.className = 'izm-err'; e.textContent = msg;
    root.appendChild(e);
  }
  setInterval(function () { updateStatus(); if (S.fix) draw(); }, 5000);

  /* ---------- GPS ---------- */
  function startGPS() {
    if (S.gpsOn) return true;
    if (!navigator.geolocation) { toast('このブラウザは位置情報に対応していません'); return false; }
    if (window.isSecureContext === false) { toast('位置情報は https のページでだけ使えます'); return false; }
    S.gpsOn = true; S.gpsErr = '';
    watchGPS();
    updateStatus();
    return true;
  }
  function watchGPS() {
    if (S.watchId != null) navigator.geolocation.clearWatch(S.watchId);
    S.watchId = navigator.geolocation.watchPosition(onPos, onPosErr, { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 });
  }
  function stopGPS() {
    if (S.watchId != null) navigator.geolocation.clearWatch(S.watchId);
    S.watchId = null; S.gpsOn = false;
  }
  function onPos(pos) {
    var c = pos.coords, now = Date.now();
    var gap = S.lastFixAt ? now - S.lastFixAt : 0;
    S.lastFixAt = now;
    S.gpsErr = '';
    S.fix = {
      lat: c.latitude, lon: c.longitude, acc: c.accuracy || 0,
      heading: (typeof c.heading === 'number' && isFinite(c.heading)) ? c.heading : null,
      speed: (typeof c.speed === 'number' && isFinite(c.speed)) ? c.speed : null,
      t: now
    };
    if (!ready) return;
    refreshPlace();
    if (S.rec) addPoint(S.fix, gap);
    if (S.pendingCenter) {
      S.pendingCenter = false;
      S.follow = true;
      followNow(true);
      if (S.outside) toast(AREA_NAME + 'の外にいます（境界まで' + fmtAway(S.outDist) + '）', 4000);
      updateButtons();
    }
    if (S.follow) followNow();
    updateStatus();
    draw();
  }
  function onPosErr(err) {
    if (err.code === 1) {
      S.gpsErr = '位置情報が許可されていません';
      stopGPS();
      toast('位置情報の利用が許可されていません。ブラウザの設定で、このサイトの位置情報を「許可」にしてください', 6000);
    } else if (err.code === 2) S.gpsErr = '現在地を取得できません';
    else S.gpsErr = '現在地の取得に時間がかかっています';
    updateStatus();
  }

  /* ---------- compass ---------- */
  function screenAngle() {
    var o = window.screen && screen.orientation;
    if (o && typeof o.angle === 'number') return o.angle;
    return typeof window.orientation === 'number' ? window.orientation : 0;
  }
  function tiltHeading(a, b, g, scr) {
    a *= DEG; b *= DEG; g *= DEG;
    var t = scr * DEG, fx = Math.sin(t), fy = Math.cos(t), fz = -1;
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cg = Math.cos(g), sg = Math.sin(g);
    var p = cg * fx + sg * fz, r = -sg * fx + cg * fz;
    var q2 = cb * fy - sb * r;
    return Math.atan2(ca * p - sa * q2, sa * p + ca * q2) / DEG;
  }
  function onOri(e) {
    var h;
    if (typeof e.webkitCompassHeading === 'number' && e.webkitCompassHeading >= 0) {
      h = e.webkitCompassHeading + screenAngle();
    } else if ((e.absolute === true || e.type === 'deviceorientationabsolute') && e.alpha != null) {
      h = tiltHeading(e.alpha, e.beta || 0, e.gamma || 0, screenAngle());
    } else return;
    h += DECLINATION;
    var rad = h * DEG, sx = Math.sin(rad), sy = Math.cos(rad);
    if (S.heading == null || Date.now() - S.lastOriAt > 1500) { S.hx = sx; S.hy = sy; }
    else { S.hx += (sx - S.hx) * 0.25; S.hy += (sy - S.hy) * 0.25; }
    S.heading = (Math.atan2(S.hx, S.hy) / DEG + 360) % 360;
    S.lastOriAt = Date.now();
    if (S.fix) draw();
  }
  function listenOri() {
    if (S.oriOn) return;
    S.oriOn = true;
    if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', onOri, true);
    window.addEventListener('deviceorientation', onOri, true);
  }
  function enableOrientation() {
    var DOE = window.DeviceOrientationEvent;
    if (S.oriOn || !DOE) return;
    if (typeof DOE.requestPermission === 'function') {
      if (S.oriAsked) return;
      S.oriAsked = true;
      DOE.requestPermission().then(function (res) {
        if (res === 'granted') listenOri();
        else toast('方位の利用が許可されていないため、向きは表示されません', 4500);
      }).catch(function () { S.oriAsked = false; });
    } else listenOri();
  }

  /* ---------- wake lock ---------- */
  function requestWake() {
    if (!S.rec || S.wake || !navigator.wakeLock || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(function (w) {
      S.wake = w;
      w.addEventListener('release', function () { if (S.wake === w) S.wake = null; });
      if (!S.rec) releaseWake();
    }).catch(function () {});
  }
  function releaseWake() {
    var w = S.wake; S.wake = null;
    if (w) w.release().catch(function () {});
  }

  /* ---------- recording ---------- */
  var saveT = 0;
  function saveCurrent() { if (S.rec) sset('current', S.rec); }
  function saveCurrentSoon() {
    if (saveT) return;
    saveT = setTimeout(function () { saveT = 0; saveCurrent(); }, 3000);
  }
  function addPoint(f, gap) {
    var r = S.rec;
    if (!r || f.acc > 60) return;
    var t = Math.max(0, Math.round((f.t - r.start) / 1000));
    var segs = r.segs, sg = segs[segs.length - 1];
    if (!sg || ((S.newSeg || gap > 60000) && sg.length)) {
      sg = []; segs.push(sg);
      if (r._w) r._w.push([]);
    }
    S.newSeg = false;
    var last = sg[sg.length - 1];
    if (last) {
      var dd = hav(last[0], last[1], f.lat, f.lon);
      if (dd < Math.max(3, f.acc * 0.5)) return;
      r.dist += dd;
    }
    sg.push([r6(f.lat), r6(f.lon), t, Math.round(f.acc)]);
    if (r._w) r._w[r._w.length - 1].push(rawW(f.lat, f.lon));
    saveCurrentSoon();
    updateHud();
  }
  function countPts(r) { var n = 0; r.segs.forEach(function (s) { n += s.length; }); return n; }
  function lastPointTime(r) {
    for (var i = r.segs.length - 1; i >= 0; i--) if (r.segs[i].length) return r.start + r.segs[i][r.segs[i].length - 1][2] * 1000;
    return r.start;
  }
  function startRec() {
    if (!startGPS()) return;
    enableOrientation();
    var now = Date.now();
    S.rec = { v: 1, id: 'r' + now, start: now, end: null, dist: 0, segs: [[]] };
    S.newSeg = false;
    if (S.fix && now - S.lastFixAt < 15000) addPoint({ lat: S.fix.lat, lon: S.fix.lon, acc: S.fix.acc, t: now }, 0);
    saveCurrent();
    if (!S.recTimer) S.recTimer = setInterval(updateHud, 1000);
    requestWake();
    updateButtons();
    toast('記録を開始しました');
    draw();
  }
  function stopRec(endAt) {
    var r = S.rec;
    if (!r) return;
    clearTimeout(saveT); saveT = 0;
    S.rec = null;
    sdel('current');
    clearInterval(S.recTimer); S.recTimer = null;
    releaseWake();
    r.end = endAt || Date.now();
    r.segs = r.segs.filter(function (s) { return s.length; });
    delete r._w; delete r._b;
    updateButtons();
    if (countPts(r) < 2) { toast('移動が記録されなかったため、保存しませんでした'); draw(); return; }
    var ci = sget('cidx', 0);
    r.c = ci % PAL.length;
    sset('cidx', ci + 1);
    S.routes.unshift(r);
    S.shown[r.id] = true;
    if (sset('routes', S.routes)) toast('記録を保存しました（' + fmtDist(r.dist) + '）');
    else toast('保存領域がいっぱいのため、ブラウザに保存できませんでした。記録一覧から画像かGPXで書き出してください', 7000);
    sset('shown', S.shown);
    renderList();
    draw();
  }

  /* ---------- resume ---------- */
  function checkResume() {
    var cur = sget('current', null);
    if (!cur || !Array.isArray(cur.segs) || typeof cur.start !== 'number') return;
    elDialog.innerHTML =
      '<div class="izm-card"><p><b>前回の記録が終わっていません</b><br>' +
      '<span class="izm-sub">開始：' + fmtDay(cur.start) + ' ' + hhmm(cur.start) + '　距離：' + fmtDist(cur.dist || 0) + '</span></p>' +
      '<div class="izm-row"><button type="button" class="izm-btn" data-act="resave">保存して終わる</button>' +
      '<button type="button" class="izm-btn izm-pri" data-act="resume">続きを記録</button></div></div>';
    elDialog.hidden = false;
    elDialog._cur = cur;
  }
  function resumeRec(save) {
    var cur = elDialog._cur;
    elDialog.hidden = true; elDialog._cur = null;
    if (!cur) return;
    cur.dist = cur.dist || 0;
    S.rec = cur;
    if (save) { stopRec(lastPointTime(cur)); return; }
    S.newSeg = true;
    startGPS();
    enableOrientation();
    if (!S.recTimer) S.recTimer = setInterval(updateHud, 1000);
    requestWake();
    updateButtons();
    toast('記録を再開しました');
    draw();
  }

  /* ---------- correction ---------- */
  function corrMeters() { return Math.sqrt(S.corr.dx * S.corr.dx + S.corr.dy * S.corr.dy) / unitsPerMeter(); }
  function openCorr() {
    if (!S.fix) {
      onLocate();
      toast('現在地を取得してから、もう一度「補正」を押してください', 4500);
      return;
    }
    S.corrMode = true; S.follow = false;
    var m = corrMeters();
    elBanner.innerHTML =
      '<div><b>位置の補正</b>　今いる場所を地図上でタップしてください</div>' +
      (m >= 0.5 ? '<div class="izm-sub">現在の補正：約' + Math.round(m) + ' m</div>' : '') +
      '<div class="izm-row"><button type="button" class="izm-btn" data-act="corrcancel">やめる</button>' +
      (m >= 0.5 ? '<button type="button" class="izm-btn izm-danger" data-act="corrreset">補正を解除</button>' : '') + '</div>';
    elBanner.hidden = false;
    updateStatus(); updateButtons();
  }
  function closeCorr() {
    S.corrMode = false; elBanner.hidden = true;
    updateStatus(); updateButtons();
  }
  function applyCorr(p) {
    var v = S.view, ix = (p.x - v.tx) / v.s, iy = (p.y - v.ty) / v.s;
    if (!insideWard(ix, iy)) { toast(AREA_NAME + 'の範囲内をタップしてください'); return; }
    var raw = rawW(S.fix.lat, S.fix.lon);
    S.corr = { dx: ix - raw[0], dy: iy - raw[1] };
    sset('corr', S.corr);
    closeCorr();
    refreshPlace();
    updateStatus(); updateButtons();
    toast('補正しました（約' + Math.round(corrMeters()) + ' m）');
    draw();
  }
  function resetCorr() {
    S.corr = { dx: 0, dy: 0 };
    sset('corr', S.corr);
    closeCorr();
    refreshPlace();
    updateStatus(); updateButtons();
    toast('補正を解除しました');
    draw();
  }

  /* ---------- route list ---------- */
  function renderList() {
    if (!S.routes.length) { elList.innerHTML = '<div class="izm-empty">保存した記録はありません<br>書き出したGPXファイルがあれば、「GPXから復元」で記録を戻せます</div>'; return; }
    var yr = new Date().getFullYear(), h = '';
    S.routes.forEach(function (r) {
      var on = !!S.shown[r.id], col = PAL[(r.c || 0) % PAL.length];
      var title = fmtDay(r.start, new Date(r.start).getFullYear() !== yr) + ' ' + hhmm(r.start) + '〜' + hhmm(r.end || r.start);
      h += '<div class="izm-item" data-id="' + esc(r.id) + '">' +
        '<button type="button" class="izm-item-head" data-act="view"><span class="izm-sw" style="background:' + col + '"></span>' +
        '<span><span class="izm-ttl">' + esc(title) + '</span><br><span class="izm-sub">' + fmtDist(r.dist || 0) + '・' + fmtDurJa((r.end || r.start) - r.start) + '</span></span>' +
        '<span class="izm-go">地図で見る ›</span></button>' +
        '<div class="izm-acts">' +
        '<button type="button" class="izm-btn' + (on ? ' izm-sel' : '') + '" data-act="toggle">' + (on ? '表示中' : '表示') + '</button>' +
        '<button type="button" class="izm-btn" data-act="png">画像で保存</button>' +
        '<button type="button" class="izm-btn" data-act="gpx">GPXで保存</button>' +
        '<button type="button" class="izm-btn izm-danger" data-act="del">削除</button>' +
        '</div></div>';
    });
    elList.innerHTML = h;
  }
  function findRoute(id) { for (var i = 0; i < S.routes.length; i++) if (S.routes[i].id === id) return S.routes[i]; return null; }
  function openSheet() { S.sheet = true; renderList(); elSheet.hidden = false; root.classList.add('izm-sheet-open'); updateButtons(); }
  function closeSheet() { S.sheet = false; elSheet.hidden = true; root.classList.remove('izm-sheet-open'); updateButtons(); }
  function viewRoute(r) {
    if (!ready) return;
    var b = routeBox(r);
    if (b[0] > b[2]) return;
    S.shown[r.id] = true; sset('shown', S.shown);
    closeSheet();
    S.follow = false;
    var v = S.view, lim = scaleLimits(), w = Math.max(b[2] - b[0], 80), hgt = Math.max(b[3] - b[1], 80);
    v.s = Math.min(Math.max(Math.min((S.cw - 60) / w, (S.ch - TOP - BOTTOM - 40) / hgt), lim[0]), 1.6);
    v.tx = S.cw / 2 - (b[0] + b[2]) / 2 * v.s;
    v.ty = centerY() - (b[1] + b[3]) / 2 * v.s;
    v.touched = true;
    updateButtons(); draw();
  }
  var delAsk = null;
  function askDelete(r) {
    if (delAsk && delAsk.id === r.id) {
      clearTimeout(delAsk.t); delAsk = null;
      S.routes = S.routes.filter(function (x) { return x.id !== r.id; });
      delete S.shown[r.id];
      sset('routes', S.routes); sset('shown', S.shown);
      renderList(); draw();
      toast('記録を削除しました');
      return;
    }
    if (delAsk) clearTimeout(delAsk.t);
    renderList();
    var nb = elList.querySelector('.izm-item[data-id="' + r.id + '"] [data-act=del]');
    if (nb) { nb.textContent = '削除する？'; nb.classList.add('izm-ask'); }
    delAsk = { id: r.id, t: setTimeout(function () { delAsk = null; renderList(); }, 3500) };
  }

  /* ---------- export ---------- */
  function exportCanvas(r, withMap) {
    var rb = routeBox(r), pad = 120;
    var x0 = rb[0] - pad, y0 = rb[1] - pad, x1 = rb[2] + pad, y1 = rb[3] + pad;
    var k = Math.min(1.5, 2200 / Math.max(x1 - x0, y1 - y0)), head = 124;
    var W = Math.max(900, Math.round((x1 - x0) * k)), H = Math.round((y1 - y0) * k);
    var ox = (W - (x1 - x0) * k) / 2;
    var c = document.createElement('canvas'); c.width = W; c.height = H + head;
    var x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    if (withMap) drawMap(x, k, ox - x0 * k, head - y0 * k, 1, x0, y0, x1, y1, true);
    x.setTransform(1, 0, 0, 1, 0, 0);
    drawRoute(x, r, PAL[(r.c || 0) % PAL.length], function (ix, iy) { return [ox + (ix - x0) * k, head + (iy - y0) * k]; }, 1.6, false);
    x.fillStyle = 'rgba(0,0,0,.72)'; x.fillRect(0, 0, W, head);
    x.textBaseline = 'alphabetic';
    x.fillStyle = '#f3f6fb'; x.font = '700 40px ' + FONT;
    x.fillText(AREA_NAME + '　' + fmtDay(r.start, true), 36, 58);
    x.fillStyle = '#a9b4c8'; x.font = '500 30px ' + FONT;
    x.fillText(hhmm(r.start) + '〜' + hhmm(r.end || r.start) + '　' + fmtDist(r.dist || 0) + '　' + fmtDurJa((r.end || r.start) - r.start), 36, 102);
    return c;
  }
  function dataUrlToBlob(u) {
    var i = u.indexOf(','), bin = atob(u.slice(i + 1)), n = bin.length, a = new Uint8Array(n);
    for (var k = 0; k < n; k++) a[k] = bin.charCodeAt(k);
    return new Blob([a], { type: u.slice(5, u.indexOf(';')) });
  }
  function iso(ms) { return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z'); }
  var GPX_NS = 'https://amefuto8855-max.github.io/itabashi-map/gpx/1';
  function routeName(r) { return AREA_NAME + ' ' + fmtDay(r.start, true) + ' ' + hhmm(r.start); }
  function trkXml(r, out) {
    out.push('<trk><name>' + esc(routeName(r)) + '</name>');
    out.push('<extensions><izm:start>' + iso(r.start) + '</izm:start><izm:end>' + iso(r.end || r.start) + '</izm:end></extensions>');
    r.segs.forEach(function (sg) {
      if (!sg.length) return;
      out.push('<trkseg>');
      sg.forEach(function (p) {
        out.push('<trkpt lat="' + p[0].toFixed(6) + '" lon="' + p[1].toFixed(6) + '"><time>' + iso(r.start + p[2] * 1000) + '</time></trkpt>');
      });
      out.push('</trkseg>');
    });
    out.push('</trk>');
  }
  function buildGpx(list, title) {
    var out = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<gpx version="1.1" creator="itabashi map" xmlns="http://www.topografix.com/GPX/1/1" xmlns:izm="' + GPX_NS + '">',
      '<metadata><name>' + esc(title) + '</name><time>' + iso(Date.now()) + '</time></metadata>'
    ];
    list.forEach(function (r) { trkXml(r, out); });
    out.push('</gpx>');
    return out.join('\n');
  }

  /* ---------- restore from GPX ---------- */
  function gpxTime(el) {
    if (!el) return null;
    var t = Date.parse(String(el.textContent || '').trim());
    return isFinite(t) ? t : null;
  }
  function firstTag(el, name) { var l = el.getElementsByTagName(name); return l.length ? l[0] : null; }
  function extTime(el, name) {
    var l = el.getElementsByTagNameNS ? el.getElementsByTagNameNS(GPX_NS, name) : [];
    if (!l.length) l = el.getElementsByTagName('izm:' + name);
    return l.length ? gpxTime(l[0]) : null;
  }
  function parseGpx(text) {
    var doc = new DOMParser().parseFromString(text, 'application/xml');
    if (!doc || doc.getElementsByTagName('parsererror').length) return null;
    var groups = [], i, j;
    var trks = doc.getElementsByTagName('trk');
    for (i = 0; i < trks.length; i++) {
      var segEls = trks[i].getElementsByTagName('trkseg'), segs = [];
      for (j = 0; j < segEls.length; j++) segs.push(segEls[j].getElementsByTagName('trkpt'));
      if (!segEls.length) segs.push(trks[i].getElementsByTagName('trkpt'));
      groups.push({ el: trks[i], segs: segs });
    }
    var rtes = doc.getElementsByTagName('rte');
    for (i = 0; i < rtes.length; i++) groups.push({ el: rtes[i], segs: [rtes[i].getElementsByTagName('rtept')] });
    var out = [];
    groups.forEach(function (g) {
      var pts = [], tFirst = null, tLast = null, n = 0;
      g.segs.forEach(function (list) {
        var sg = [];
        for (var k = 0; k < list.length; k++) {
          var el = list[k], la = parseFloat(el.getAttribute('lat')), lo = parseFloat(el.getAttribute('lon'));
          if (!isFinite(la) || !isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) continue;
          var tm = gpxTime(firstTag(el, 'time'));
          if (tm != null) { if (tFirst == null) tFirst = tm; tLast = tm; }
          sg.push([la, lo, tm]);
        }
        if (sg.length) { pts.push(sg); n += sg.length; }
      });
      if (n < 2) return;
      var start = extTime(g.el, 'start'), end = extTime(g.el, 'end');
      if (start == null) start = tFirst != null ? tFirst : Date.now();
      if (end == null) end = tLast != null ? tLast : start;
      var dist = 0;
      var segs = pts.map(function (sg) {
        var prev = null;
        return sg.map(function (p) {
          if (prev) dist += hav(prev[0], prev[1], p[0], p[1]);
          prev = p;
          return [r6(p[0]), r6(p[1]), p[2] != null ? Math.max(0, Math.round((p[2] - start) / 1000)) : 0, 0];
        });
      });
      out.push({ v: 1, id: 'r' + start, start: start, end: Math.max(end, start), dist: dist, segs: segs });
    });
    return out;
  }
  function edgePoints(r) {
    var f = null, l = null, n = 0;
    r.segs.forEach(function (sg) { if (sg.length) { if (!f) f = sg[0]; l = sg[sg.length - 1]; n += sg.length; } });
    return { f: f, l: l, n: n };
  }
  function sameRoute(a, b) {
    var x = edgePoints(a), y = edgePoints(b);
    if (!x.f || !y.f || x.n !== y.n) return false;
    function eq(p, q) { return Math.abs(p[0] - q[0]) < 2e-6 && Math.abs(p[1] - q[1]) < 2e-6; }
    return eq(x.f, y.f) && eq(x.l, y.l);
  }
  function importFiles(files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;
    var added = 0, dup = 0, bad = 0, pending = list.length;
    toast('読み込んでいます…', 8000);
    list.forEach(function (f) {
      var fr = new FileReader();
      fr.onload = function () { handle(String(fr.result || '')); done(); };
      fr.onerror = function () { bad++; done(); };
      try { fr.readAsText(f); } catch (e) { bad++; done(); }
    });
    function handle(text) {
      var recs = null;
      try { recs = parseGpx(text); } catch (e) { recs = null; }
      if (!recs || !recs.length) { bad++; return; }
      recs.forEach(function (r) {
        for (var i = 0; i < S.routes.length; i++) if (sameRoute(S.routes[i], r)) { dup++; return; }
        while (findRoute(r.id)) r.id += 'x';
        var ci = sget('cidx', 0);
        r.c = ci % PAL.length;
        sset('cidx', ci + 1);
        S.routes.push(r);
        S.shown[r.id] = true;
        added++;
      });
    }
    function done() {
      if (--pending > 0) return;
      S.routes.sort(function (a, b) { return b.start - a.start; });
      var saved = added ? sset('routes', S.routes) : true;
      sset('shown', S.shown);
      renderList(); draw();
      var msg;
      if (added) msg = added + '件の記録を復元しました' + (dup ? '（復元済みの' + dup + '件は飛ばしました）' : '');
      else if (dup) msg = 'どの記録も復元済みです';
      else msg = 'GPXファイルを読み込めませんでした';
      if (bad && (added || dup)) msg += '。読めないファイルが' + bad + '件ありました';
      if (!saved) msg = '保存領域がいっぱいのため、ブラウザに保存できませんでした';
      toast(msg, 5000);
    }
  }
  function download(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); if (a.parentNode) a.parentNode.removeChild(a); }, 5000);
  }
  function saveFile(blob, name) {
    var file = null;
    try { file = new File([blob], name, { type: blob.type }); } catch (e) {}
    var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (file && coarse && navigator.canShare && navigator.share) {
      var ok = false;
      try { ok = navigator.canShare({ files: [file] }); } catch (e) {}
      if (ok) {
        navigator.share({ files: [file] }).catch(function (e) { if (!e || e.name !== 'AbortError') download(blob, name); });
        return;
      }
    }
    download(blob, name);
  }
  function exportPng(r) {
    if (!ready) return;
    var rb = routeBox(r), pad = 120;
    var x0 = rb[0] - pad, y0 = rb[1] - pad, x1 = rb[2] + pad, y1 = rb[3] + pad;
    var need = TILES.filter(function (t) { var b = t.b; return !(b[2] < x0 || b[0] > x1 || b[3] < y0 || b[1] > y1); });
    toast('画像を作っています…', 8000);
    Promise.all(need.map(loadTilePromise)).then(function () {
      var name = '板橋区_' + fileStamp(r.start) + '.png', url;
      try { url = exportCanvas(r, true).toDataURL('image/png'); }
      catch (e) {
        try { url = exportCanvas(r, false).toDataURL('image/png'); toast('地図を入れられなかったため、ルートだけの画像にしました', 4500); }
        catch (e2) { toast('画像を作れませんでした'); return; }
      }
      elToast.hidden = true;
      saveFile(dataUrlToBlob(url), name);
    });
  }
  function exportGpx(r) {
    saveFile(new Blob([buildGpx([r], routeName(r))], { type: 'application/gpx+xml' }), '板橋区_' + fileStamp(r.start) + '.gpx');
  }
  function exportAllGpx() {
    if (!S.routes.length) { toast('保存した記録はありません'); return; }
    var list = S.routes.slice().sort(function (a, b) { return a.start - b.start; });
    saveFile(new Blob([buildGpx(list, AREA_NAME + ' 全記録')], { type: 'application/gpx+xml' }), '板橋区_全記録_' + fileStamp(Date.now()) + '.gpx');
  }

  /* ---------- fullscreen ---------- */
  var home = null;
  function enterFs() {
    if (S.fs) return;
    S.fs = true;
    home = { parent: root.parentNode, next: root.nextSibling };
    document.body.appendChild(root);
    root.style.height = '';
    root.classList.add('izm-fs');
    home.overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    var rf = root.requestFullscreen || root.webkitRequestFullscreen;
    if (rf) { try { var pr = rf.call(root); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
    updateButtons();
    resize(false);
    setTimeout(function () { resize(false); }, 350);
  }
  function exitFs() {
    if (!S.fs) return;
    S.fs = false;
    var fe = document.fullscreenElement || document.webkitFullscreenElement;
    if (fe) {
      var ef = document.exitFullscreen || document.webkitExitFullscreen;
      try { var pr = ef.call(document); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {}
    }
    root.classList.remove('izm-fs');
    if (home && home.parent) home.parent.insertBefore(root, home.next && home.next.parentNode === home.parent ? home.next : null);
    document.documentElement.style.overflow = home ? home.overflow || '' : '';
    updateButtons();
    resize(false);
    setTimeout(function () { resize(false); }, 350);
  }
  function onFsChange() { if (S.fs && !(document.fullscreenElement || document.webkitFullscreenElement)) exitFs(); }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  /* ---------- buttons ---------- */
  function onLocate() {
    enableOrientation();
    if (!S.gpsOn) {
      if (!startGPS()) return;
      S.pendingCenter = true;
      toast('現在地を取得しています…');
      return;
    }
    if (!S.fix || !ready) { S.pendingCenter = true; toast('現在地を取得しています…'); return; }
    S.follow = true;
    followNow(true);
    if (S.outside) toast(AREA_NAME + 'の外にいます（境界まで' + fmtAway(S.outDist) + '）');
    updateButtons();
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || !root.contains(b)) return;
    var act = b.getAttribute('data-act');
    var item = b.closest('.izm-item'), r = item ? findRoute(item.getAttribute('data-id')) : null;
    switch (act) {
      case 'locate': onLocate(); break;
      case 'rec': if (S.rec) stopRec(); else startRec(); break;
      case 'fix': if (S.corrMode) closeCorr(); else openCorr(); break;
      case 'list': if (S.sheet) closeSheet(); else openSheet(); break;
      case 'closelist': closeSheet(); break;
      case 'full': if (S.fs) exitFs(); else enterFs(); break;
      case 'pins':
        S.pinsOn = !S.pinsOn; S.selPin = -1;
        sset('pins', S.pinsOn); updateButtons(); draw();
        toast(S.pinsOn ? 'ピンを表示しました' : 'ピンを隠しました', 1400);
        break;
      case 'zin': zoomAt(1.6, S.cw / 2, centerY()); break;
      case 'zout': zoomAt(1 / 1.6, S.cw / 2, centerY()); break;
      case 'corrcancel': closeCorr(); break;
      case 'corrreset': resetCorr(); break;
      case 'resume': resumeRec(false); break;
      case 'resave': resumeRec(true); break;
      case 'view': if (r) viewRoute(r); break;
      case 'toggle':
        if (r) {
          if (S.shown[r.id]) delete S.shown[r.id]; else S.shown[r.id] = true;
          sset('shown', S.shown); renderList(); draw();
        }
        break;
      case 'png': if (r) exportPng(r); break;
      case 'gpx': if (r) exportGpx(r); break;
      case 'saveall': exportAllGpx(); break;
      case 'del': if (r) askDelete(r); break;
    }
  });

  var elGpxIn = q('.izm-gpxin');
  elGpxIn.addEventListener('change', function () {
    var files = elGpxIn.files;
    importFiles(files);
    setTimeout(function () { elGpxIn.value = ''; }, 0);
  });

  /* ---------- gestures ---------- */
  var ptrs = {}, nPtr = 0, gest = null, lastTap = null;
  function local(e) { var b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
  function ptrList() { var a = []; for (var k in ptrs) a.push(ptrs[k]); return a; }
  function beginGesture() {
    var a = ptrList(), v = S.view;
    if (a.length >= 2) {
      var p = a[0], q2 = a[1];
      gest = { type: 'pinch', d0: Math.max(10, Math.hypot(p.x - q2.x, p.y - q2.y)), mx: (p.x + q2.x) / 2, my: (p.y + q2.y) / 2, s0: v.s, tx0: v.tx, ty0: v.ty, moved: true };
    } else if (a.length === 1) {
      gest = { type: 'pan', sx: a[0].x, sy: a[0].y, tx0: v.tx, ty0: v.ty, moved: gest ? gest.moved : false, t0: Date.now() };
    } else gest = null;
  }
  cv.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    if (!ptrs[e.pointerId]) nPtr++;
    ptrs[e.pointerId] = local(e);
    if (nPtr === 1) gest = null;
    beginGesture();
  });
  cv.addEventListener('pointermove', function (e) {
    if (!ptrs[e.pointerId] || !gest || !ready) return;
    ptrs[e.pointerId] = local(e);
    var v = S.view, a = ptrList();
    if (gest.type === 'pan' && a.length === 1) {
      var dx = a[0].x - gest.sx, dy = a[0].y - gest.sy;
      if (!gest.moved && Math.abs(dx) + Math.abs(dy) > 7) { gest.moved = true; if (S.follow) { S.follow = false; updateButtons(); } }
      if (gest.moved) { v.tx = gest.tx0 + dx; v.ty = gest.ty0 + dy; v.touched = true; clampView(); draw(); }
    } else if (gest.type === 'pinch' && a.length >= 2) {
      var d = Math.max(10, Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y));
      var mx = (a[0].x + a[1].x) / 2, my = (a[0].y + a[1].y) / 2;
      var lim = scaleLimits(), s1 = Math.min(Math.max(gest.s0 * d / gest.d0, lim[0]), lim[1]), k = s1 / gest.s0;
      var dot = S.follow ? dotScreen() : null;
      if (dot) {
        var ix = (dot[0] - v.tx) / v.s, iy = (dot[1] - v.ty) / v.s;
        v.s = s1; v.tx = dot[0] - ix * s1; v.ty = dot[1] - iy * s1;
      } else {
        v.s = s1;
        v.tx = mx - (gest.mx - gest.tx0) * k;
        v.ty = my - (gest.my - gest.ty0) * k;
      }
      v.touched = true;
      clampView(); draw();
    }
  });
  function endPointer(e) {
    if (!ptrs[e.pointerId]) return;
    var p = local(e), g = gest;
    delete ptrs[e.pointerId]; nPtr = Math.max(0, nPtr - 1);
    if (nPtr === 0) {
      if (g && g.type === 'pan' && !g.moved && e.type === 'pointerup' && Date.now() - g.t0 < 500) onTap(p);
      gest = null;
    } else beginGesture();
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', endPointer);
  function onTap(p) {
    if (!ready) return;
    if (S.corrMode) { lastTap = null; applyCorr(p); return; }
    if (S.pinsOn) {
      var hit = pickPin(p);
      if (hit >= 0) { S.selPin = hit === S.selPin ? -1 : hit; lastTap = null; draw(); return; }
      if (S.selPin >= 0) { S.selPin = -1; draw(); }
    }
    var now = Date.now();
    if (lastTap && now - lastTap.t < 330 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 32) {
      lastTap = null;
      zoomAt(2, p.x, p.y);
    } else lastTap = { t: now, x: p.x, y: p.y };
  }
  cv.addEventListener('wheel', function (e) {
    if (!ready) return;
    var mod = e.ctrlKey || e.metaKey;
    if (!S.fs && !mod) {
      if (!S.wheelHinted) { S.wheelHinted = true; toast('⌘またはCtrlを押しながらスクロールすると拡大・縮小します（全画面ではそのままスクロール）', 4500); }
      return;
    }
    e.preventDefault();
    var p = local(e), dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    var k = Math.abs(dy) >= 40 ? (dy < 0 ? 1.25 : 0.8) : Math.exp(-dy * 0.01);
    zoomAt(k, p.x, p.y);
  }, { passive: false });
  root.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  root.addEventListener('contextmenu', function (e) { if (e.target === cv) e.preventDefault(); });

  /* ---------- lifecycle ---------- */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') saveCurrent();
    else {
      if (S.gpsOn) watchGPS();
      if (S.rec) requestWake();
      updateStatus(); draw();
    }
  });
  window.addEventListener('pagehide', saveCurrent);
  if (window.ResizeObserver) new ResizeObserver(function () { resize(false); }).observe(root);
  window.addEventListener('resize', function () { resize(false); });
  window.addEventListener('orientationchange', function () { setTimeout(function () { resize(false); }, 300); });

  /* ---------- start ---------- */
  function init(data) {
    D = data;
    G = data.geo;
    OUT = data.outline;
    OB = bbox(OUT);
    DIST = data.districts.map(function (d) { return { name: d.name, p: d.poly, b: bbox(d.poly) }; });
    TILES = data.tiles.map(function (t) {
      var w = t.w, h = t.h, m = t.m;
      var xs = [m[2], m[0] * w + m[2]], ys = [m[5], m[4] * h + m[5]];
      return { file: t.file, m: m, b: [Math.min(xs[0], xs[1]), Math.min(ys[0], ys[1]), Math.max(xs[0], xs[1]), Math.max(ys[0], ys[1])], im: null };
    });
    PMIN = data.pinRange[0]; PMAX = data.pinRange[1];
    PINS = data.pins.map(function (p) { return { x: p[0], y: p[1], n: p[2], hue: pinHue(p[2]) }; });
    buildLegend();
    OV = { m: data.overview.m, im: null };
    OV.im = makeImg(BASE + data.overview.file, function () {
      elLoading.hidden = true;
      draw();
    });
    OV.im.addEventListener('error', function () { elLoading.textContent = '地図画像を読み込めませんでした。'; });
    ready = true;
    refreshPlace();
    resize(true);
    updateStatus();
    updateButtons();
    if (S.fix && S.pendingCenter) onPos({ coords: { latitude: S.fix.lat, longitude: S.fix.lon, accuracy: S.fix.acc } });
  }
  updateStatus();
  updateButtons();
  renderList();
  checkResume();
  resize(true);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', BASE + 'data.json?v=' + Math.floor(Date.now() / 3600000), true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try { init(JSON.parse(xhr.responseText)); }
      catch (e) { elLoading.hidden = true; showError('地図データを読み込めませんでした。'); }
    } else { elLoading.hidden = true; showError('地図データを読み込めませんでした（' + xhr.status + '）。'); }
  };
  xhr.onerror = function () { elLoading.hidden = true; showError('地図データを読み込めませんでした。通信状態を確認してください。'); };
  xhr.send();
  if (navigator.permissions && navigator.permissions.query) {
    try {
      navigator.permissions.query({ name: 'geolocation' }).then(function (p) {
        if (p.state === 'granted' && !S.gpsOn) startGPS();
      }).catch(function () {});
    } catch (e) {}
  }
})();
