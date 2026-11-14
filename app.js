
(function () {
  "use strict";
  var P = "itbM";
  var root = document.getElementById(P);
  if (!root || root.getAttribute("data-ready")) { return; }
  root.setAttribute("data-ready", "1");
  var BASE = root.getAttribute("data-base") || (document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[^\/]*$/, "") : "");
  var ICONS = {"tree": "<circle cx=\"12\" cy=\"9\" r=\"5.5\"/><path d=\"M12 14.5V21M8.5 21h7\"/>", "dumbbell": "<path d=\"M7 7v10M4 9.5v5M17 7v10M20 9.5v5M7 12h10\"/>", "book": "<path d=\"M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5zM12 6.5v13\"/>", "balloon": "<path d=\"M12 3.5c2.9 0 5 2.2 5 5 0 3.3-2.7 6-5 6s-5-2.7-5-6c0-2.8 2.1-5 5-5z\"/><path d=\"M12 14.5l-.9 1.6h1.8zM12 16.1c0 1.6 1.4 2.4 0 4.4\"/>", "museum": "<path d=\"M3.5 9 12 4.5 20.5 9M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3.5 20h17\"/>", "paw": "<circle cx=\"8.3\" cy=\"7.6\" r=\"1.7\"/><circle cx=\"15.7\" cy=\"7.6\" r=\"1.7\"/><circle cx=\"5\" cy=\"12\" r=\"1.5\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\"/><path d=\"M12 11.5c-2.8 0-4.8 3-4.8 5.1 0 1.5 1.3 2.2 2.6 1.7 1.5-.6 2.9-.6 4.4 0 1.3.5 2.6-.2 2.6-1.7 0-2.1-2-5.1-4.8-5.1z\"/>", "landmark": "<path d=\"M4 9.5c3-.5 5-2 8-5 3 3 5 4.5 8 5M6.5 9.5V19M17.5 9.5V19M4 19.5h16M9.5 14h5\"/>", "people": "<circle cx=\"9\" cy=\"8\" r=\"2.8\"/><circle cx=\"16.5\" cy=\"9\" r=\"2.2\"/><path d=\"M3.8 19c.6-3.4 2.6-5.3 5.2-5.3s4.6 1.9 5.2 5.3M14.6 14.1c2.4-.4 4.6 1.1 5.2 4.6\"/>", "bubble": "<path d=\"M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z\"/><path d=\"M8 9.5h8M8 12.5h5\"/>", "pin": "<path d=\"M12 20.5s-6-5.3-6-10.5a6 6 0 0 1 12 0c0 5.2-6 10.5-6 10.5z\"/><circle cx=\"12\" cy=\"10\" r=\"2.2\"/>", "route": "<circle cx=\"6\" cy=\"18\" r=\"2\"/><circle cx=\"18\" cy=\"6\" r=\"2\"/><path d=\"M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16\"/>", "share": "<circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/>", "phone": "<path d=\"M6.5 4.5h2.7l1.4 3.6-1.8 1.2a10.5 10.5 0 0 0 5.9 5.9l1.2-1.8 3.6 1.4v2.7a1.5 1.5 0 0 1-1.6 1.5C10.4 18.4 5.6 13.6 5 6.1a1.5 1.5 0 0 1 1.5-1.6z\"/>", "copy": "<rect x=\"8.5\" y=\"8.5\" width=\"11\" height=\"11\" rx=\"1.6\"/><path d=\"M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5\"/>", "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/>", "locate": "<circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/>", "close": "<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/>", "star": "<path d=\"M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z\"/>", "expand": "<path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/>", "shrink": "<path d=\"M9 4.5V9H4.5M15 4.5V9h4.5M9 19.5V15H4.5M15 19.5V15h4.5\"/>", "print": "<path d=\"M7 9V4.5h10V9M7 17H5.5A1.5 1.5 0 0 1 4 15.5v-5A1.5 1.5 0 0 1 5.5 9h13a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17\"/><path d=\"M7 14h10v6H7z\"/>", "sliders": "<path d=\"M4 7h9M17 7h3M4 17h3M11 17h9\"/><circle cx=\"15\" cy=\"7\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/>", "map": "<path d=\"M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z\"/><path d=\"M9 4.5v13M15 6.5v13\"/>", "walk": "<circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/>", "rings": "<circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"5.5\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", "link": "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>", "chevron": "<path d=\"M9 6l6 6-6 6\"/>", "check": "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>", "list": "<path d=\"M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.5M4.5 12h.5M4.5 17.5h.5\"/>", "dice": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/>", "layers": "<path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/>", "train": "<rect x=\"6\" y=\"3.5\" width=\"12\" height=\"13.5\" rx=\"3\"/><path d=\"M6 10.5h12M9.5 6.6h5M9 17l-2.2 3.5M15 17l2.2 3.5M7.8 19.2h8.4\"/><path d=\"M9.3 13.7h.01M14.7 13.7h.01\" stroke-width=\"2.6\"/>", "bus": "<rect x=\"5\" y=\"3.5\" width=\"14\" height=\"14.5\" rx=\"2.5\"/><path d=\"M5 11.5h14M8 6.6h8M7.6 18v2.5M16.4 18v2.5\"/><path d=\"M8.4 14.8h.01M15.6 14.8h.01\" stroke-width=\"2.6\"/>", "up": "<path d=\"M12 18V6M6.5 11.5L12 6l5.5 5.5\"/>", "down": "<path d=\"M12 6v12M6.5 12.5L12 18l5.5-5.5\"/>", "flag": "<path d=\"M5.5 21V4.5M5.5 5c4-2 7 2 13 0v8c-6 2-9-2-13 0\"/>", "umbrella": "<path d=\"M3.5 12.5a8.5 8.5 0 0 1 17 0z\"/><path d=\"M12 12.5v6a2 2 0 0 1-4 0M12 3.5V4\"/>", "stroller": "<path d=\"M12.5 4.5v7h7.5a7.5 7.5 0 0 0-7.5-7.5z\"/><path d=\"M3.5 7.5H6l1.6 4h12.4a5 5 0 0 1-5 5h-4.5a5 5 0 0 1-3.3-1.3\"/><circle cx=\"9\" cy=\"19.2\" r=\"1.6\"/><circle cx=\"16.5\" cy=\"19.2\" r=\"1.6\"/>", "yen": "<path d=\"M7 4.5l5 7 5-7M12 11.5V20M8 12.5h8M8 16h8\"/>", "laptop": "<rect x=\"5\" y=\"5.5\" width=\"14\" height=\"9.5\" rx=\"1.3\"/><path d=\"M3 18.5h18\"/>", "wifi": "<path d=\"M3.8 9.6a11.6 11.6 0 0 1 16.4 0M6.9 12.9a7.2 7.2 0 0 1 10.2 0M10 16.1a2.9 2.9 0 0 1 4 0\"/><path d=\"M12 19.2v.01\" stroke-width=\"2.8\"/>", "parking": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M10 16.5v-9h3.2a2.7 2.7 0 0 1 0 5.4H10\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 7.5V12l3 2\"/>", "drink": "<path d=\"M6.5 8.5h11l-1.3 10.6a1.6 1.6 0 0 1-1.6 1.4H9.4a1.6 1.6 0 0 1-1.6-1.4z\"/><path d=\"M7 12.5h10M13 8.5l1.6-5h3\"/>", "smoke": "<rect x=\"3\" y=\"14\" width=\"15\" height=\"4\" rx=\"1\"/><path d=\"M14.5 14v4M20.5 14v4M17.5 11c0-1.6 2-1.6 2-3.2S17.5 6.2 17.5 4.6\"/>", "moon": "<path d=\"M19.5 14.6A7.6 7.6 0 1 1 9.4 4.5a6.1 6.1 0 0 0 10.1 10.1z\"/>", "flower": "<path d=\"M7.5 5l2.2 2.5L12 4.5l2.3 3 2.2-2.5v4.6a4.5 4.5 0 0 1-9 0z\"/><path d=\"M12 14.1V21M12 18.2c-1.6-1.8-3.6-2.1-5.1-1.7M12 17.2c1.6-1.8 3.6-2.1 5.1-1.7\"/>", "shop": "<path d=\"M4 9.5l1.6-5h12.8L20 9.5\"/><path d=\"M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0\"/><path d=\"M5.5 12v7.5h13V12M10 19.5v-4.5h4v4.5\"/>", "home": "<path d=\"M4 11.5L12 5l8 6.5M6.5 9.5v10h11v-10\"/>", "ext": "<path d=\"M13.5 4.5h6v6M19.5 4.5l-8 8M17 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 18V9a1.5 1.5 0 0 1 1.5-1.5H11\"/>", "tag": "<path d=\"M4.5 12.3V5.5a1 1 0 0 1 1-1h6.8l7.2 7.2a1 1 0 0 1 0 1.4l-5.9 5.9a1 1 0 0 1-1.4 0z\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.3\"/>", "info": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 11v5.5M12 7.8v.01\"/>", "play": "<path d=\"M8.5 5.8v12.4l9.8-6.2z\"/>", "mug": "<path d=\"M5.5 8h9.5v11a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19z\"/><path d=\"M15 10h2a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2M5.5 8a2.6 2.6 0 0 1 3.3-2.5 3 3 0 0 1 5.4.4A2.2 2.2 0 0 1 15 8M8.8 11.5v5.5M11.7 11.5v5.5\"/>", "fish": "<path d=\"M4.5 12c2.5-3.4 5.5-5 8.6-5 3.2 0 5.8 1.7 7.4 5-1.6 3.3-4.2 5-7.4 5-3.1 0-6.1-1.6-8.6-5z\"/><path d=\"M4.5 12 2.5 9M4.5 12l-2 3\"/><path d=\"M16.6 11h.01\" stroke-width=\"2.6\"/>", "udon": "<path d=\"M3.5 12h17a8.5 8.5 0 0 1-17 0z\"/><path d=\"M8.5 20.5h7M13.5 3.5 9.5 12M18.5 4.5 13.5 12\"/>", "ramen": "<path d=\"M3.5 12h17a8.5 8.5 0 0 1-17 0z\"/><path d=\"M8.5 20.5h7M8.5 9.5c-1-1.2 1-2.1 0-3.5M12 9.5c-1-1.2 1-2.1 0-3.5M15.5 9.5c-1-1.2 1-2.1 0-3.5\"/>", "dumpling": "<path d=\"M3.5 15c1.5-4.6 4.8-7.2 8.5-7.2s7 2.6 8.5 7.2c-2.6 1.6-5.4 2.4-8.5 2.4S6.1 16.6 3.5 15z\"/><path d=\"M7.6 10.8l.9 2M10.6 9l.4 2.2M13.4 9l-.4 2.2M16.4 10.8l-.9 2\"/>", "grill": "<circle cx=\"12\" cy=\"11\" r=\"7\"/><path d=\"M5.6 8.5h12.8M5 11h14M5.6 13.5h12.8M8.5 17.2 7 20.5M15.5 17.2l1.5 3.3\"/>", "cutlery": "<path d=\"M7 3.5v5.5a2 2 0 0 0 2 2v9.5M11 3.5V9a2 2 0 0 1-2 2M9 3.5v5\"/><path d=\"M17.5 20.5v-17c-2.2 1.6-3.2 4.2-3.2 7.2v3.3h3.2\"/>", "curry": "<path d=\"M3 14.5h18a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 14.5z\"/><path d=\"M5.5 14.5c.6-3.2 2.4-5 5-5 2 0 3.3 1 4 2.6.9-.6 2.1-.8 3.3-.4M10.5 7.5c-.8-1.1.8-1.9 0-3.2\"/>", "teppan": "<path d=\"M3 17.5h14\"/><ellipse cx=\"9.5\" cy=\"14\" rx=\"6\" ry=\"2.5\"/><path d=\"M14.5 11.5l2.6-2.6 1.6 1.6-2.6 2.6zM17.9 9.7 21 6.6\"/>", "plate": "<circle cx=\"13.5\" cy=\"12\" r=\"7\"/><circle cx=\"13.5\" cy=\"12\" r=\"3.5\"/><path d=\"M3.5 3.5v5a1.5 1.5 0 0 0 1.5 1.5v10.5M3.5 3.5v5\"/>", "coffee": "<path d=\"M4.5 10h11.5v4.5a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-5-5z\"/><path d=\"M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 7.5c-.8-1 .8-1.8 0-3M12.5 7.5c-.8-1 .8-1.8 0-3\"/>", "bento": "<rect x=\"3.5\" y=\"6\" width=\"17\" height=\"12\" rx=\"2\"/><path d=\"M12 6v12M12 12h8.5\"/><circle cx=\"7.7\" cy=\"12\" r=\"1.7\"/>"};
  var COURSES = [{"key": "akatsuka", "label": "赤塚で半日", "ids": ["6-01", "5-01", "5-02", "1-1-12", "7-3-02", "7-3-01"], "text": "赤塚植物園・板橋区立美術館・郷土資料館・都立赤塚公園の4施設が徒歩圏に集まっていて、無料〜低額で半日過ごせます。近くには東京大仏（乗蓮寺）や松月院もあります。"}];
  var CFG = {"mapName": "板橋区と周辺のスポット・飲食店地図", "wide": true, "groupZoom": true, "meZoomOut": 3, "kyokaUrl": "https://www.city.itabashi.tokyo.jp/kenko/eisei/shokuhin/1051220.html", "attr": "<a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">© OpenStreetMap contributors</a>", "syn": [["寿司", "寿司", "すし", "鮨"], ["すし", "すし", "寿司", "鮨"], ["鮨", "鮨", "すし", "寿司"], ["蕎麦", "蕎麦", "そば"], ["そば", "そば", "蕎麦"], ["饂飩", "饂飩", "うどん"], ["拉麺", "拉麺", "ラーメン"], ["焼き肉", "焼き肉", "焼肉"], ["焼肉", "焼肉", "焼き肉"], ["焼き鳥", "焼き鳥", "焼鳥", "やきとり"], ["焼鳥", "焼鳥", "焼き鳥", "やきとり"], ["やきとり", "やきとり", "焼き鳥", "焼鳥"], ["喫茶", "喫茶", "カフェ"], ["カフェ", "カフェ", "喫茶", "珈琲", "コーヒー"], ["コーヒー", "コーヒー", "珈琲", "カフェ", "喫茶"], ["珈琲", "珈琲", "コーヒー", "カフェ", "喫茶"], ["餃子", "餃子", "ぎょうざ", "ギョーザ", "ギョウザ"], ["飲み屋", "飲み屋", "居酒屋", "バー", "スナック"], ["惣菜", "惣菜", "総菜", "そうざい", "デリ"], ["総菜", "総菜", "惣菜", "そうざい"], ["出前", "出前", "配達", "宅配", "デリバリー"], ["宅配", "宅配", "配達", "出前", "デリバリー"], ["デリバリー", "デリバリー", "配達", "宅配", "出前"], ["パスタ", "パスタ", "イタリアン"], ["ピザ", "ピザ", "ピッツァ", "イタリアン"], ["定食", "定食", "食堂"], ["もんじゃ", "もんじゃ", "鉄板焼", "お好み焼"], ["たこ焼", "たこ焼", "タコ焼"]], "condKeys": ["ドリンクバー", "Wi-Fiあり", "喫煙できる", "駐車場あり"], "purposes": [{"key": "food", "label": "食べる", "short": "食べる", "name": "飲食店", "icon": "cutlery", "color": "#d9480f", "cats": ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113"], "kindWord": "ジャンル", "kinds": [["c:101", "居酒屋・バー", 514], ["c:102", "和食・すし", 102], ["c:103", "うどん・そば", 65], ["c:104", "ラーメン", 164], ["c:105", "中華", 176], ["c:106", "焼肉・肉料理", 89], ["c:107", "洋食・イタリアン", 90], ["c:108", "カレー・エスニック", 85], ["c:109", "お好み焼き・鉄板焼き", 27], ["c:110", "食堂・レストラン・軽食", 199], ["c:111", "カフェ・喫茶", 170], ["c:112", "弁当・惣菜・配達", 122], ["c:113", "その他", 78]], "conds": ["drink", "wifi", "smoke", "park"], "co": 1, "unit": "店"}, {"key": "play", "label": "遊ぶ", "short": "遊ぶ", "name": "公園・遊び場", "icon": "tree", "color": "#2f7d3b", "cats": ["1"], "kinds": [["s:1-1", "公園・緑地・庭園", 73], ["s:1-2", "遊び場（ボール遊び広場・児童遊園・校庭開放）", 19]]}, {"key": "sport", "label": "運動", "short": "運動", "name": "運動施設", "icon": "dumbbell", "color": "#c2410c", "cats": ["2"], "kinds": [["s:2-1", "公営の屋内施設（体育館・温水プール）", 28], ["s:2-2", "公営の屋外施設（野球場・庭球場・競技場など）", 47], ["s:2-3", "民間ジム（一般・24時間）", 38], ["s:2-4", "民間ジム（chocoZAP）", 15], ["s:2-5", "総合スポーツクラブ", 7], ["s:2-6", "パーソナルジム", 25], ["s:2-7", "女性専用サーキット（カーブス）", 8], ["s:2-8", "ピラティス・ヨガ", 12], ["s:2-9", "格闘技ジム", 8], ["s:2-10", "大学施設（一般非公開・参考）", 1]]}, {"key": "book", "label": "本・自習", "short": "読む", "name": "図書館", "icon": "book", "color": "#3f51b5", "cats": ["3"], "kinds": []}, {"key": "kids", "label": "子ども", "short": "子ども", "name": "子ども・高齢者向けの施設", "icon": "balloon", "color": "#c2185b", "cats": ["4"], "kinds": [["s:4-1", "子ども向け（児童館・遊び場施設）", 95], ["s:4-2", "高齢者向け", 2]]}, {"key": "see", "label": "見る・学ぶ", "short": "見る", "name": "博物館・動植物園・名所", "icon": "museum", "color": "#7b1fa2", "cats": ["5", "6", "7"], "kinds": [["c:5", "博物館・美術館・科学館・資料館", 28], ["c:6", "動物園・植物園・水族館", 6], ["s:7-1", "展望施設", 3], ["s:7-2", "テーマパーク・娯楽施設", 3], ["s:7-3", "寺社", 46], ["s:7-4", "史跡・文化財", 36]]}, {"key": "room", "label": "借りる", "short": "借りる", "name": "集会・貸室施設", "icon": "people", "color": "#6d4c41", "cats": ["8"], "kinds": [["s:8-1", "地域センター・ホール・区民センター", 107], ["s:8-2", "生涯学習センター", 3], ["s:8-3", "区民農園", 1]]}, {"key": "shop", "label": "買い物", "short": "買い物", "name": "商店街・商店通り", "icon": "shop", "color": "#455a64", "cats": ["11"], "kinds": [["s:11-1", "板橋区", 14], ["s:11-2", "練馬区", 38], ["s:11-5", "埼玉県6市", 13]]}], "tutPurp": "food", "tutCond": "drink", "condMax": 7};
  var SKELETON = "<section class=\"c-guide needs-js\" aria-labelledby=\"itbM-guide-h\"><div class=\"c-guide-head\"><h3 class=\"c-guide-h\" id=\"itbM-guide-h\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 11v5.5M12 7.8v.01\"/></svg>まちあるき地図の使い方</h3><button type=\"button\" class=\"c-guide-tg\" data-act=\"guide\" aria-expanded=\"true\" aria-controls=\"itbM-guide-b\"><span>閉じる</span><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6l6 6-6 6\"/></svg></button></div><div class=\"c-guide-body\" id=\"itbM-guide-b\"><p class=\"c-guide-lead\">スポット794か所と飲食店1,881店を、1つの地図と一覧から探せます。</p><ol class=\"c-guide-steps\"><li><span class=\"c-guide-n\">1</span><b>探す</b><span class=\"c-guide-d\">目的を選び、条件や検索で絞る</span></li><li><span class=\"c-guide-n\">2</span><b>見る</b><span class=\"c-guide-d\">ピンかカードで詳しい情報</span></li><li><span class=\"c-guide-n\">3</span><b>残す・送る</b><span class=\"c-guide-d\">コースにまとめて共有</span></li></ol><div class=\"c-guide-row\"><button type=\"button\" class=\"c-guide-try\" data-act=\"tutorial\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8.5 5.8v12.4l9.8-6.2z\"/></svg><span class=\"c-guide-try-t\">30秒で試す</span></button><button type=\"button\" class=\"c-guide-more\" data-act=\"guidebtns\" aria-expanded=\"false\" aria-controls=\"itbM-guide-l\">地図のボタンの説明<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6l6 6-6 6\"/></svg></button></div><ul class=\"c-guide-list\" id=\"itbM-guide-l\" hidden><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 3.5v5.5a2 2 0 0 0 2 2v9.5M11 3.5V9a2 2 0 0 1-2 2M9 3.5v5\"/><path d=\"M17.5 20.5v-17c-2.2 1.6-3.2 4.2-3.2 7.2v3.3h3.2\"/></svg></span><b>目的</b><span>上の段。押した目的の場所だけを出す。ほかの目的を押すと、押した目的も加わる。出している目的をもう一度押すと外れ、1つもなくなると全部に戻る</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 7h9M17 7h3M4 17h3M11 17h9\"/><circle cx=\"15\" cy=\"7\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/></svg></span><b>種類と条件</b><span>下の段。ジャンルや種類、雨の日・子連れ・ドリンクバーなどの条件、エリアで絞る。数字は当てはまる件数</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg></span><b>検索</b><span>名前・駅・やりたいことで探す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"5.5\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/></svg></span><b>ピンの大きさ</b><span>Googleマップの口コミ件数の3段階。100件以上は大きく縁取りのあるピン、20件未満は小さく薄いピン。件数がわからない場所と飲食店は、ふつうの大きさ</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></span><b>全画面</b><span>地図を画面いっぱいに広げる</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/></svg></span><b>現在地</b><span>いまいる場所と向きを地図に出す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/></svg></span><b>徒歩圏</b><span>選んだ場所や現在地から、徒歩5・10・20分の範囲を出す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/></svg></span><b>行き先おみくじ</b><span>地図に出ている場所から1か所を選ぶ</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/></svg></span><b>地図の表示</b><span>背景の地図（航空写真・淡色地図・標準地図）を切り替え、鉄道の路線・駅・バス停を重ねる</span></li></ul><p class=\"c-guide-note\">営業時間や料金は、公式ページで確かめてください。</p></div></section><div class=\"c-bar needs-js\"><button type=\"button\" class=\"c-stat\" data-act=\"course\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5.5 21V4.5M5.5 5c4-2 7 2 13 0v8c-6 2-9-2-13 0\"/></svg><span>自分のコース</span><b class=\"c-stat-course\">0</b><span>か所</span></button><button type=\"button\" class=\"c-stat\" data-act=\"gotoindex\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg><span>行った場所</span><b class=\"c-stat-went\">0</b><span>/2675か所</span></button><div class=\"c-textsize\" role=\"group\" aria-label=\"文字の大きさ\"><span class=\"c-textsize-lb\">文字</span><button type=\"button\" data-act=\"text\" data-size=\"1\" aria-pressed=\"true\">標準</button><button type=\"button\" data-act=\"text\" data-size=\"2\" aria-pressed=\"false\">大きく</button></div><button type=\"button\" class=\"c-sharebtn\" data-act=\"sharemap\" aria-haspopup=\"dialog\" aria-expanded=\"false\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/></svg><span>共有</span></button></div><div class=\"c-sharemenu\" role=\"dialog\" aria-label=\"共有する\" hidden><div class=\"c-sharemenu-head\"><p class=\"c-sharemenu-h\">共有する<span class=\"c-sharemenu-t\"></span></p><button type=\"button\" class=\"c-sharemenu-x\" data-act=\"shareclose\" aria-label=\"閉じる\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg></button></div><div class=\"c-snsgrid\"><a class=\"c-sns c-sns-line\" data-sns=\"line\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>LINE</a><a class=\"c-sns c-sns-x\" data-sns=\"x\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>X</a><a class=\"c-sns c-sns-fb\" data-sns=\"facebook\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Facebook</a><a class=\"c-sns c-sns-th\" data-sns=\"threads\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Threads</a><a class=\"c-sns c-sns-bs\" data-sns=\"bluesky\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Bluesky</a><a class=\"c-sns c-sns-hb\" data-sns=\"hatena\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>はてな<wbr>ブックマーク</a></div><div class=\"c-sharemore\"><button type=\"button\" data-act=\"sharecopy\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"8.5\" y=\"8.5\" width=\"11\" height=\"11\" rx=\"1.6\"/><path d=\"M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5\"/></svg>リンクをコピー</button><button type=\"button\" data-act=\"sharenative\" hidden><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/></svg>ほかのアプリ</button></div></div><div class=\"c-stage needs-js\"><div class=\"c-map\" role=\"region\" aria-label=\"スポットと飲食店の地図\"></div><div class=\"c-cross\" aria-hidden=\"true\" hidden></div><div class=\"c-top\"><div class=\"c-purposes\" role=\"group\" aria-label=\"目的で選ぶ\"></div><div class=\"c-searchbox\" hidden><label class=\"c-search\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg><input type=\"search\" class=\"c-q\" placeholder=\"名前・駅・やりたいことで探す\" aria-label=\"スポットを探す\" autocomplete=\"off\" enterkeyhint=\"search\"></label></div><button type=\"button\" class=\"c-round c-searchbtn\" data-act=\"search\" aria-expanded=\"false\" aria-label=\"名前・駅・やりたいことで探す\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"full\" aria-pressed=\"false\" aria-label=\"地図を大きく表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></button></div><div class=\"c-conds\" role=\"group\" aria-label=\"種類と条件で絞る\"></div><div class=\"c-legend\" role=\"group\" aria-label=\"絞り込みの条件\" hidden></div><div class=\"c-side\"><button type=\"button\" class=\"c-round c-full2\" data-act=\"full\" aria-pressed=\"false\" aria-label=\"地図を大きく表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"locate\" aria-label=\"現在地を表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"rings\" aria-pressed=\"false\" aria-label=\"徒歩圏を表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"omikuji\" aria-label=\"今日の行き先おみくじ\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/></svg></button><button type=\"button\" class=\"c-round c-trbtn\" data-act=\"trmenu\" aria-expanded=\"false\" aria-label=\"地図の表示を切り替える（背景の地図・鉄道とバス停）\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/></svg></button><button type=\"button\" class=\"c-round c-zoom\" data-act=\"zin\" aria-label=\"拡大\">＋</button><button type=\"button\" class=\"c-round c-zoom\" data-act=\"zout\" aria-label=\"縮小\">−</button></div><div class=\"c-trmenu\" role=\"group\" aria-label=\"地図の表示\" hidden><p class=\"c-trmenu-h\">背景の地図</p><div class=\"c-basemenu\" role=\"group\" aria-label=\"背景の地図\"><button type=\"button\" data-act=\"base\" data-base=\"photo\" aria-pressed=\"true\"><span class=\"c-sw c-sw-photo\"></span>航空写真</button><button type=\"button\" data-act=\"base\" data-base=\"pale\" aria-pressed=\"false\"><span class=\"c-sw c-sw-pale\"></span>淡色地図</button><button type=\"button\" data-act=\"base\" data-base=\"std\" aria-pressed=\"false\"><span class=\"c-sw c-sw-std\"></span>標準地図</button></div><p class=\"c-trmenu-h\">地図に重ねて表示</p><button type=\"button\" data-act=\"tr\" data-k=\"l\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-l\"></span><span class=\"c-trtx\">鉄道の路線</span></button><button type=\"button\" data-act=\"tr\" data-k=\"s\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-s\"></span><span class=\"c-trtx\">駅<small>拡大すると表示</small></span></button><button type=\"button\" data-act=\"tr\" data-k=\"b\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-b\"></span><span class=\"c-trtx\">バス停<small>さらに拡大すると表示</small></span></button><p class=\"c-trmenu-src\">出典：「国土数値情報（<a href=\"https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2025.html\" target=\"_blank\" rel=\"noopener\">鉄道データ</a>・<a href=\"https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P11-2022.html\" target=\"_blank\" rel=\"noopener\">バス停留所データ</a>）」（国土交通省）を加工して作成。鉄道は2025年度、バス停は2022年度のデータです。</p></div><div class=\"c-ringinfo\" aria-live=\"polite\" hidden></div><div class=\"c-rail\" aria-label=\"地図に出ている場所\"></div><button type=\"button\" class=\"c-round c-scrolldown\" data-act=\"gotoindex\" aria-label=\"地図の下の一覧へ進む\" title=\"下へ進む\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 6v12M6.5 12.5L12 18l5.5-5.5\"/></svg></button><div class=\"c-sheet\" role=\"region\" aria-label=\"選んだ場所の情報\" hidden></div><div class=\"c-taghint\" role=\"status\" hidden><span>目的を押すと、押した目的の場所だけが地図に出ます</span><button type=\"button\" data-act=\"taghintx\" aria-label=\"閉じる\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg></button></div><div class=\"c-tut\" hidden><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-block\" hidden></div><div class=\"c-tut-ring\"></div><div class=\"c-tut-pop\" role=\"dialog\" aria-labelledby=\"itbM-tut-t\"><p class=\"c-tut-step\"></p><p class=\"c-tut-text\" id=\"itbM-tut-t\" aria-live=\"polite\"></p><div class=\"c-tut-acts\"><button type=\"button\" class=\"c-tut-skip\" data-act=\"tutskip\">スキップ</button><button type=\"button\" class=\"c-tut-done\" data-act=\"tutdone\" hidden>終わる</button></div></div></div></div><div class=\"c-index needs-js\"><div class=\"c-index-head\"><h3 class=\"c-index-h\">一覧から探す</h3><p class=\"c-index-count\"></p></div><p class=\"c-index-note\">地図と同じ条件で絞り込まれます。町名やエリアを開くと、分類の順に並んでいます。行を押すと、詳しい情報が開きます。</p><p class=\"c-index-empty\" hidden>条件に合う場所が見つかりませんでした。言葉を短くするか、条件を外してください。</p><div class=\"c-groups\"></div></div>";

  function $(s, b) { return (b || root).querySelector(s); }
  function $$(s, b) { return Array.prototype.slice.call((b || root).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"' + (cls ? ' class="' + cls + '"' : "") + ">" + (ICONS[name] || "") + "</svg>";
  }
  function norm(s) {
    s = String(s == null ? "" : s);
    if (s.normalize) { s = s.normalize("NFKC"); }
    return s.toLowerCase()
      .replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
      .replace(/[\s\u3000]+/g, "");
  }
  function words(q) { return String(q || "").replace(/[\u3000]/g, " ").split(/\s+/).map(norm).filter(Boolean); }
  function facet(t) { return t.slice(0, t.indexOf(":")); }
  function label(t) { return t.slice(t.indexOf(":") + 1); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function md(s) { var p = String(s || "").split("-"); return p.length === 3 ? Number(p[1]) + "/" + Number(p[2]) : ""; }
  function jdate(s) { var p = String(s || "").split("-"); return p.length === 3 ? p[0] + "年" + Number(p[1]) + "月" + Number(p[2]) + "日" : ""; }
  function debounce(fn, ms) {
    var t = 0;
    return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms); };
  }
  function meters(a, b) {
    var r = Math.PI / 180;
    var x = Math.sin((b.lat - a.lat) * r / 2), y = Math.sin((b.lng - a.lng) * r / 2);
    var h = x * x + Math.cos(a.lat * r) * Math.cos(b.lat * r) * y * y;
    return 12742000 * Math.asin(Math.sqrt(h));
  }
  function walkMin(m) { return Math.max(1, Math.ceil(m / 80)); }
  function fmtDist(m) {
    return m < 1000 ? "約" + Math.max(10, Math.round(m / 10) * 10) + "m" : "約" + (m / 1000).toFixed(1) + "km";
  }
  var store = {
    get: function (k, def) {
      try { var v = window.localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
  };
  var toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "c-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      root.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) { return navigator.clipboard.writeText(text); }
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0"; ta.style.top = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) { res(); } else { rej(new Error("copy")); }
    });
  }
  function pageUrl(anchor) { return location.href.split("#")[0] + (anchor ? "#" + anchor : ""); }
  function flash(el) {
    el.classList.remove("is-flash");
    void el.offsetWidth;
    el.classList.add("is-flash");
    setTimeout(function () { el.classList.remove("is-flash"); }, 1600);
  }

  var WIDE_GUT = 16, WIDE_MAX = 1920, WIDE_MIN_GAIN = 24;
  function widen() {
    var s = root.style;
    s.width = ""; s.marginLeft = ""; s.maxWidth = "";
    var vw = document.documentElement.clientWidth, r = root.getBoundingClientRect();
    var w = Math.min(vw - 2 * WIDE_GUT, WIDE_MAX);
    if (w - r.width < WIDE_MIN_GAIN) { return; }
    var x0 = r.left + (window.pageXOffset || 0);
    s.maxWidth = "none";
    s.width = Math.round(w) + "px";
    s.marginLeft = Math.round((vw - w) / 2 - x0) + "px";
    for (var a = root.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
      if (window.getComputedStyle(a).overflowX !== "visible") { a.style.overflow = "visible"; }
    }
  }
  if (CFG.wide) {
    widen();
    var rewiden = debounce(widen, 100), lastW = {};
    window.addEventListener("resize", rewiden);
    if (window.ResizeObserver) {
      [document.documentElement, root.parentElement].forEach(function (el, k) {
        if (!el) { return; }
        new ResizeObserver(function () { var cw = el.clientWidth; if (cw !== lastW[k]) { lastW[k] = cw; rewiden(); } }).observe(el);
      });
    }
  }

  function giveUp() {
    root.className = "is-nojs";
    root.innerHTML = '<p class="c-fail">地図を読み込めませんでした。通信の状態を確かめて、ページを読み込み直してください。</p>';
  }
  function addLink(id, rel, href, sri) {
    if (document.getElementById(id)) { return; }
    var l = document.createElement("link");
    l.id = id; l.rel = rel; l.href = href;
    if (sri !== undefined) { l.crossOrigin = ""; if (sri) { l.integrity = sri; } }
    document.head.appendChild(l);
  }
  function loadScript(url, sri) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = url; s.crossOrigin = ""; if (sri) { s.integrity = sri; }
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  var LF = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/";
  addLink(P + "-f1", "preconnect", "https://fonts.googleapis.com");
  addLink(P + "-f2", "preconnect", "https://fonts.gstatic.com", "");
  addLink(P + "-f3", "stylesheet", "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&display=swap");
  addLink(P + "-lf", "stylesheet", LF + "leaflet.css", "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=");
  function cssReady() {
    // スタイルが届く前に地図を組み立てると大きさがずれるので、届くまで待つ
    return new Promise(function (res) {
      var links = document.querySelectorAll('link[rel="stylesheet"]'), l = null;
      for (var i = 0; i < links.length; i++) { if (/\/app\.css(\?|$)/.test(links[i].href)) { l = links[i]; } }
      if (!l || l.sheet) { res(); return; }
      l.addEventListener("load", res);
      l.addEventListener("error", res);
      setTimeout(res, 8000);
    });
  }
  Promise.all([
    fetch(BASE + "data.json").then(function (r) { if (!r.ok) { throw new Error("data"); } return r.json(); }),
    window.L && window.L.map ? null : loadScript(LF + "leaflet.js", "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=").catch(function () { return null; }),
    cssReady(),
  ]).then(function (a) {
    root.className = "is-js";
    root.innerHTML = SKELETON;
    try { start(a[0]); } catch (e) { if (window.console) { window.console.error(e); } giveUp(); }
  }, giveUp);

  function start(D) {
    var M = D.meta, TAGS = M.tags, LABELS = M.labels, CATS = M.cats, AREAS = M.areas, KANA = M.kana;
    var NICHE = {};
    M.facets.forEach(function (f) { NICHE[f[0]] = f[1] === 1; });
    var CAT_IDS = Object.keys(CATS).sort(function (a, b) { return Number(a) - Number(b); });
    var CAT_RANK = {};
    CAT_IDS.forEach(function (c, i) { CAT_RANK[c] = i; });
    function kana(t) { return KANA[t] || t; }

    var NO_INDEX = { "情報源": 1, "状態": 1 };
    var items = D.items.map(function (o, i) {
      var tags = o.tg.map(function (k) { return TAGS[k]; });
      var set = {};
      tags.forEach(function (t) { set[t] = 1; });
      var it = {
        id: o.i, i: i, cat: o.c, sub: o.s || "", name: o.n, official: o.on || "", aka: o.k || "", town: o.t, area: AREAS[o.a], addr: o.ad || "",
        lat: typeof o.y === "number" ? o.y : null, lng: typeof o.x === "number" ? o.x : null,
        approx: !!(o.f & 1), thin: !!(o.f & 2), listOnly: !!(o.f & 4), coarse: !!(o.f & 8), filled: !!(o.f & 16), mappos: !!(o.f & 32), nosrc: !!(o.f & 64), lead: o.ld || "",
        specs: (o.sp || []).map(function (s) { return [LABELS[s[0]], s[1]]; }), tags: tags, set: set,
        url: o.u || "", sources: o.so || [], phones: o.ph || [], telNote: o.tn || "", status: o.st || "", sameAs: o.sa || "",
        notices: o.no || [], related: o.re || [], unknown: (o.un || []).map(function (k) { return LABELS[k]; }), checked: o.ck || M.date,
      };
      it.has = function (t) { return set[t] === 1; };
      it.pin = it.lat !== null && !it.sameAs;
      it.oh = o.oh || null;
      it.st = o.sd || null;
      it.rk = o.rk || null;
      it.rv = typeof o.rv === "number" ? o.rv : null;
      it.ofc = o.of || 0;
      it.kd = o.kd || "";
      it.gq = o.gq || "";
      it.gm = o.gq ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.gq) : o.gu || "";
      it.g = typeof o.g === "number" ? o.g : -1;
      it.food = Number(o.c) >= 100;
      return it;
    });
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });
    var pins = items.filter(function (it) { return it.pin; });

    function spec(it, names) {
      for (var k = 0; k < it.specs.length; k++) { if (names.indexOf(it.specs[k][0]) !== -1) { return it.specs[k][1]; } }
      return "";
    }
    function tagWords(it) {
      return it.tags.filter(function (t) { return !NO_INDEX[facet(t)] && !/:なし$/.test(t); }).map(function (t) {
        var f = facet(t), v = label(t);
        return f === "駐車場" || f === "駐輪場" ? f + v : f === "最寄り駅" ? v + "駅" : v;
      }).join(" ");
    }
    items.forEach(function (it) {
      it.text = norm([it.name, it.official, it.aka, it.addr, it.area, it.town, it.lead, spec(it, ["できること", "補足"]), spec(it, ["文化財"]), tagWords(it),
        CATS[it.cat].name, M.subs[it.sub] || ""].join(" ").replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1"));
    });

    var SYN = {};
    [
      ["プール", "プール", "水泳"], ["水泳", "水泳", "プール"], ["泳ぐ", "水泳", "プール"],
      ["ジム", "ジム", "筋トレ", "トレーニング"], ["筋トレ", "筋トレ", "ジム", "トレーニング"], ["トレーニング", "トレーニング", "筋トレ", "ジム"],
      ["自習", "自習", "学習席", "勉強"], ["勉強", "勉強", "学習席", "自習"], ["パソコン", "pc", "パソコン"],
      ["子ども", "子ども", "子連れ", "児童", "こども"], ["こども", "こども", "子ども", "子連れ", "児童"], ["子供", "子ども", "子連れ", "児童", "子供"],
      ["キッズ", "キッズ", "子ども", "子連れ"], ["赤ちゃん", "赤ちゃん", "乳幼児", "授乳", "おむつ"], ["ベビー", "ベビー", "乳幼児", "授乳", "おむつ"],
      ["雨", "雨", "屋内"], ["タダ", "無料"], ["bbq", "bbq", "バーベキュー"], ["バーベキュー", "バーベキュー", "bbq"],
      ["バスケ", "バスケ"], ["wifi", "wi-fi", "wifi"], ["ワイファイ", "wi-fi"], ["花見", "花見", "桜"], ["お花見", "桜", "花見"],
      ["買い物", "買い物", "商店街", "商店会"], ["商店街", "商店街", "商店会", "商店通り"], ["会議室", "会議室", "貸室"],
      ["体育館", "体育館", "体育室"], ["散歩", "散歩", "公園", "緑地", "緑道"], ["遊具", "遊具", "遊び場"],
      ["お寺", "寺"], ["寺院", "寺"], ["史跡", "史跡", "旧跡", "遺跡", "文化財"], ["歴史", "歴史", "史跡", "文化財"],
    ].concat(CFG.syn || []).forEach(function (r) { SYN[norm(r[0])] = r.slice(1).map(norm); });
    function match(it, w) {
      var alts = SYN[w] || [w];
      for (var k = 0; k < alts.length; k++) { if (it.text.indexOf(alts[k]) !== -1) { return true; } }
      return false;
    }

    var STUDY = ["学習・PC:学習席・自習スペース", "学習・PC:PC席", "学習・PC:持ち込みPC席"];
    var PARK = ["駐車場:あり", "駐車場:有料", "駐車場:無料", "駐車場:無料の時間あり"];
    function anyOf(it, list) { for (var k = 0; k < list.length; k++) { if (it.has(list[k])) { return true; } } return false; }
    items.forEach(function (it) {
      var b = [];
      if (it.has("料金:無料")) { b.push(["yen", "無料"]); }
      if (it.has("子連れ:子連れ向け")) { b.push(["stroller", "子連れ"]); }
      if (it.has("時間・天候:屋内")) { b.push(["home", "屋内"]); }
      if (anyOf(it, STUDY)) { b.push(["laptop", "自習・PC"]); }
      if (it.has("設備:TOKYO FREE Wi-Fi")) { b.push(["wifi", "都の無料Wi-Fi"]); } else if (it.has("学習・PC:Wi-Fi")) { b.push(["wifi", "Wi-Fi"]); }
      if (anyOf(it, PARK)) { b.push(["parking", "駐車場"]); }
      if (it.has("時間・天候:24時間")) { b.push(["moon", "24時間"]); } else if (it.has("時間・天候:夜21時以降も開いている")) { b.push(["moon", "夜21時以降も"]); }
      it.badges = b;
    });
    function badgeHTML(it, compact) {
      if (!it.badges.length) { return ""; }
      return '<span class="c-bds' + (compact ? " is-compact" : "") + '">' + it.badges.map(function (x) {
        return '<span class="c-bd"' + (compact ? ' title="' + x[1] + '"' : "") + ">" + icon(x[0]) + '<span class="c-bd-t">' + x[1] + "</span></span>";
      }).join("") + "</span>";
    }
    function statusOf(it) {
      if (it.sameAs) { return ["旧名", "is-old"]; }
      var s = it.status;
      if (!s) { return null; }
      if (s === "閉店" || s === "休館中" || s === "工事中" || s === "休止中") { return [s, "is-closed"]; }
      if (s === "一部休止") { return ["一部休止中", "is-part"]; }
      if (s === "休館のお知らせ") { return ["休館のお知らせあり", "is-part"]; }
      if (s === "要確認") { return ["状態は要確認", "is-unk"]; }
      return [s, "is-unk"];
    }
    function statusHTML(it) {
      var s = statusOf(it);
      return s ? '<span class="c-stt ' + s[1] + '">' + esc(s[0]) + "</span>" : "";
    }

    var SEASON = { "梅": [2, 3], "桜": [3, 4], "ツツジ": [4, 5], "バラ": [5, 6, 10, 11], "アジサイ": [6, 7], "夏の水遊び": [7, 8], "紅葉": [11, 12], "水鳥": [11, 12, 1, 2] };
    var mon = new Date().getMonth() + 1, mon2 = mon % 12 + 1;
    function inSeason(it) {
      return it.tags.some(function (t) {
        if (facet(t) !== "季節") { return false; }
        var ms = SEASON[label(t)] || [];
        return ms.indexOf(mon) !== -1 || ms.indexOf(mon2) !== -1;
      });
    }
    var WIFI = ["学習・PC:Wi-Fi", "条件:Wi-Fiあり", "設備:TOKYO FREE Wi-Fi"], PARK2 = PARK.concat(["条件:駐車場あり"]);
    var PRESETS = [
      { key: "rain", label: "雨の日", icon: "umbrella", test: function (it) { return it.has("時間・天候:屋内"); }, say: "屋内の場所" },
      { key: "kids", label: "子連れ", icon: "stroller", test: function (it) { return it.has("子連れ:子連れ向け"); }, say: "子連れ向けの場所" },
      { key: "free", label: "無料", icon: "yen", test: function (it) { return it.has("料金:無料"); }, say: "無料で使える場所" },
      { key: "study", label: "自習・PC", icon: "laptop", test: function (it) { return anyOf(it, STUDY); }, say: "学習席やPC席のある場所" },
      { key: "wifi", label: "Wi-Fi", icon: "wifi", test: function (it) { return anyOf(it, WIFI); }, say: "Wi-Fiが使える場所", title: "Wi-Fiが使える場所（飲食店は、わかる店だけ）" },
      { key: "tfw", label: "都の無料Wi-Fi", icon: "wifi", test: function (it) { return it.has("設備:TOKYO FREE Wi-Fi"); }, say: "都の無料Wi-Fi（TOKYO FREE Wi-Fi）が使える場所", title: "TOKYO FREE Wi-Fi が使える場所（東京都と板橋区の発表から）" },
      { key: "park", label: "駐車場", icon: "parking", test: function (it) { return anyOf(it, PARK2); }, say: "駐車場のある場所", title: "駐車場のある場所（飲食店は、わかる店だけ）" },
      { key: "night", label: "夜も開いている", icon: "moon", test: function (it) { return it.has("時間・天候:夜21時以降も開いている") || it.has("時間・天候:24時間"); }, say: "夜21時以降も開いている場所", title: "夜21時以降も開いている施設（飲食店は入りません）" },
      { key: "season", label: "見頃が近い", icon: "flower", test: inSeason, say: "今月から来月に見頃を迎える花や紅葉のある場所（時期は例年の目安）" },
      { key: "drink", label: "ドリンクバー", icon: "drink", test: function (it) { return it.has("条件:ドリンクバー"); }, say: "ドリンクバーのある店", title: "ドリンクバーのある店（わかる店だけ）" },
      { key: "smoke", label: "喫煙できる", icon: "smoke", test: function (it) { return it.has("条件:喫煙できる"); }, say: "喫煙できる店", title: "店内で喫煙できる店（わかる店だけ）" },
    ];
    var PRESET = {};
    PRESETS.forEach(function (p) { p.n = items.filter(p.test).length; PRESET[p.key] = p; });

    var CONDS = true;
    function firstMon(y, m) { var d = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); return 1 + (8 - d) % 7; }
    function equinox(y, base) { return Math.floor(base + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4)); }
    function baseHol(y, m, d) {
      if (m === 1) { return d === 1 || d === firstMon(y, 1) + 7; }
      if (m === 2) { return d === 11 || d === 23; }
      if (m === 3) { return d === equinox(y, 20.8431); }
      if (m === 4) { return d === 29; }
      if (m === 5) { return d >= 3 && d <= 5; }
      if (m === 7) { return d === firstMon(y, 7) + 14; }
      if (m === 8) { return d === 11; }
      if (m === 9) { return d === firstMon(y, 9) + 14 || d === equinox(y, 23.2488); }
      if (m === 10) { return d === firstMon(y, 10) + 7; }
      if (m === 11) { return d === 3 || d === 23; }
      return false;
    }
    function ymd(t) { var d = new Date(t); return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCDay()]; }
    function holAt(t) {
      var a = ymd(t), k, b;
      if (baseHol(a[0], a[1], a[2])) { return true; }
      for (k = 1; k < 7; k++) {
        b = ymd(t - k * 864e5);
        if (!baseHol(b[0], b[1], b[2])) { break; }
        if (b[3] === 0) { return true; }
      }
      var p = ymd(t - 864e5), n = ymd(t + 864e5);
      return a[3] !== 0 && baseHol(p[0], p[1], p[2]) && baseHol(n[0], n[1], n[2]);
    }
    var NOW = null;
    function nowInfo() {
      var t = Date.now() + 9 * 3600e3, d = new Date(t), day0 = t - (t % 864e5), pd = new Date(day0 - 864e5);
      NOW = { wd: (d.getUTCDay() + 6) % 7, min: d.getUTCHours() * 60 + d.getUTCMinutes(), hol: holAt(day0), phol: holAt(day0 - 864e5),
        week: Math.ceil(d.getUTCDate() / 7), pweek: Math.ceil(pd.getUTCDate() / 7) };
      return NOW;
    }
    function spansOn(oh, wd, hol, week) {
      var cur = null;
      for (var k = 0; k < oh.length; k++) {
        var r = oh[k];
        if ((hol && (r[0] & 128)) || ((r[0] & (1 << wd)) && (!r[1] || (r[1] & (1 << (week - 1)))))) { cur = r[2]; }
      }
      return cur || [];
    }
    function openNow(it) {
      if (!it.oh) { return false; }
      var j = NOW || nowInfo(), s = spansOn(it.oh, j.wd, j.hol, j.week), k;
      for (k = 0; k < s.length; k += 2) { if (s[k] <= j.min && j.min < s[k + 1]) { return true; } }
      s = spansOn(it.oh, (j.wd + 6) % 7, j.phol, j.pweek);
      for (k = 0; k < s.length; k += 2) { if (s[k] <= j.min + 1440 && j.min + 1440 < s[k + 1]) { return true; } }
      return false;
    }
    var CT = {};
    function condFn(key) {
      if (CT[key]) { return CT[key]; }
      var f;
      if (key === "now") { f = openNow; }
      else if (key.indexOf("st:") === 0) { var st = "最寄り駅:" + key.slice(3); f = function (it) { return it.has(st); }; }
      else if (key.indexOf("co:") === 0) { var co = "運営会社:" + key.slice(3); f = function (it) { return it.has(co); }; }
      else { var tg = "条件:" + key; f = function (it) { return it.has(tg); }; }
      CT[key] = f;
      return f;
    }
    function condOk(key) {
      return typeof key === "string" && key.indexOf("co:") === 0 && TAGS.indexOf("運営会社:" + key.slice(3)) !== -1;
    }
    function condSay(key, k) {
      if (key === "now") { return "いま営業中の" + k + "店を表示しています"; }
      if (key.indexOf("st:") === 0) { return "最寄り駅が" + key.slice(3) + "駅の" + k + "店を表示しています"; }
      if (key.indexOf("co:") === 0) { return key.slice(3) + "が運営する" + k + "店を表示しています"; }
      return "「" + key + "」の" + k + "店を表示しています";
    }
    function condOfTag(t) { return facet(t) === "運営会社" ? "co:" + label(t) : ""; }

    var stage = $(".c-stage"), rail = $(".c-rail"), sheet = $(".c-sheet"), info = $(".c-ringinfo"), cross = $(".c-cross");
    var chips = $(".c-purposes"), legend = $(".c-legend"), baseMenu = $(".c-basemenu"), qIn = $(".c-q"), groupsEl = $(".c-groups");
    var topBar = $(".c-top"), searchBox = $(".c-searchbox"), searchBtn = $(".c-searchbtn"), shareMenu = $(".c-sharemenu");
    var KEY = { fav: "itbx-m-favs-v1", went: "itbx-m-went-v1", base: "itbx-m-base-v1", text: "itbx-m-text-v1", start: "itbx-m-start-v1", tr: "itbx-m-tr-v1",
      guide: "itbx-m-guide-v1", tut: "itbx-m-tut-v1", taghint: "itbx-m-taghint-v1" };
    (function () {
      // 前の2つの地図で残したコースと「行った」の記録を引き継ぐ
      try {
        var ls = window.localStorage;
        if (ls.getItem(KEY.fav) === null) {
          var f = [];
          ["c", "f"].forEach(function (k) { var a = store.get("itbx-" + k + "-favs-v1", []); if (Array.isArray(a)) { f = f.concat(a); } });
          if (f.length) { store.set(KEY.fav, f); }
        }
        if (ls.getItem(KEY.went) === null) {
          var w = {}, n = 0;
          ["c", "f"].forEach(function (k) { var o = store.get("itbx-" + k + "-went-v1", {}); if (o && typeof o === "object" && !Array.isArray(o)) { for (var id in o) { w[id] = o[id]; n++; } } });
          if (n) { store.set(KEY.went, w); }
        }
      } catch (e) {}
    })();
    var BASES = ["photo", "pale", "std"];
    var RINGS = [[400, "徒歩5分"], [800, "徒歩10分"], [1600, "徒歩20分"]];
    var RAIL_MAX = 40;
    var ink = "#22302a";
    function okBase(b) { return BASES.indexOf(b) === -1 ? "photo" : b; }
    function isWide() { return root.getBoundingClientRect().width >= 760; }

    var favs = store.get(KEY.fav, []);
    var went = store.get(KEY.went, {});
    if (!Array.isArray(favs)) { favs = []; }
    if (!went || typeof went !== "object" || Array.isArray(went)) { went = {}; }
    favs = favs.filter(function (id, i) { return byId[id] && favs.indexOf(id) === i; });
    var st0 = readHash() || {};
    var S = {
      q: "", ws: [], area: "", town: "", tag: "", presets: [], hint: null, hidden: [], kind: "", cond: "", rings: false, panel: null, back: null,
      base: okBase(st0.b || store.get(KEY.base, "photo")),
      text: store.get(KEY.text, 1) === 2 ? 2 : 1,
      startHere: store.get(KEY.start, false) === true,
    };
    var pos = null, origin = null, me = null, ready = false, visSet = {};

    root.classList.remove("is-nojs");
    root.classList.add("is-js");

    function rich(text) {
      var out = "", p = 0, re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g, m;
      function plain(s) { return esc(s).replace(/(番地|所在地)?要確認/g, function (x) { return '<mark class="c-tbc">' + x + "</mark>"; }); }
      while ((m = re.exec(text))) {
        out += plain(text.slice(p, m.index));
        out += byId[m[1]] ? '<a href="#' + P + "-" + m[1] + '" data-act="rel" data-id="' + m[1] + '">' + esc(m[2]) + "</a>" : esc(m[2]);
        p = m.index + m[0].length;
      }
      return out + plain(text.slice(p));
    }

    var L = window.L;
    var BASE_URL = {
      pale: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      std: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
      photo: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
    };
    function setBaseLayer(map, kind) {
      if (map._itbxBase) { map.removeLayer(map._itbxBase); }
      map._itbxBase = L.tileLayer(BASE_URL[kind] || BASE_URL.pale, {
        minZoom: 5, maxZoom: 18, maxNativeZoom: 18,
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>',
      }).addTo(map);
      map._itbxBase.bringToBack();
    }
    var map = null;
    var mapEl = $(".c-map");
    if (L && L.map) {
      map = L.map(mapEl, { zoomControl: false, scrollWheelZoom: true, wheelPxPerZoomLevel: 120, wheelDebounceTime: 60, attributionControl: true, zoomSnap: 0.5 });
      map.setView([35.766, 139.684], 13);
      setBaseLayer(map, S.base);
      if (window.ResizeObserver) { new ResizeObserver(debounce(function () { map.invalidateSize(); }, 80)).observe(mapEl); }
      map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
      if (CFG.attr) {
        map.attributionControl.addAttribution(CFG.attr);
        map.on("resize", trAttrH);
        setTimeout(trAttrH, 0);
      }
      var pageScrollAt = 0;
      window.addEventListener("scroll", function () { pageScrollAt = Date.now(); }, { passive: true });
      stage.addEventListener("wheel", function (e) {
        if (!mapEl.contains(e.target) || stage.classList.contains("is-full")) { return; }
        if (Date.now() - pageScrollAt < 400) { e.stopPropagation(); }
      }, { capture: true, passive: true });
    } else {
      mapEl.classList.add("c-map-off");
      mapEl.innerHTML = '<p class="c-map-off-msg">地図を読み込めませんでした。通信の状態を確かめて、ページを読み込み直してください。下の一覧は使えます。</p>';
    }
    var baseNow = S.base;
    var icons = {}, dots = {}, pinState = {}, ringLayer = null, courseLayer = null, dotLayer = null, iconLayer = null;
    var NEAR_ZOOM = 14;
    function pinIcon(it) {
      var c = CATS[it.cat], s = statusOf(it);
      var cls = "c-pin" + (it.approx ? " is-approx" : "") + (s ? " " + s[1] : "") + (it.rk ? " is-rk" + it.rk[0] : "");
      return L.divIcon({
        className: cls,
        html: '<span class="c-pin-in" style="--c:' + c.color + '">' + icon(c.icon) + "</span>",
        iconSize: [32, 32], iconAnchor: [16, 16],
      });
    }

    var units = [], unitOf = {};
    (function () {
      var gmap = {};
      pins.forEach(function (it) {
        var u;
        if (it.g >= 0 && M.gp && M.gp[it.g]) {
          u = gmap[it.g];
          if (!u) {
            u = gmap[it.g] = { key: "g" + it.g, lat: M.gp[it.g][0], lng: M.gp[it.g][1], members: [], vis: [], sig: "" };
            units.push(u);
          }
        } else {
          u = { key: it.id, lat: it.lat, lng: it.lng, members: [], vis: [], sig: "" };
          units.push(u);
        }
        u.members.push(it);
        unitOf[it.id] = u;
      });
    })();
    function shown(u) { return u.vis.length ? u.vis : u.members; }
    function groupColor(v) {
      var c = v[0].cat;
      for (var k = 1; k < v.length; k++) { if (v[k].cat !== c) { return ink; } }
      return CATS[c].color;
    }
    function unitTitle(u) {
      var v = shown(u);
      if (v.length === 1) { return v[0].name; }
      return v.length + "か所のピンが重なっています：" + v.slice(0, 3).map(function (it) { return it.name; }).join("、") + (v.length > 3 ? "ほか" : "");
    }
    function unitIcon(u) {
      var v = shown(u);
      if (v.length === 1) { return pinIcon(v[0]); }
      var approx = v.every(function (it) { return it.approx; });
      return L.divIcon({
        className: "c-pin is-group" + (approx ? " is-approx" : ""),
        html: '<span class="c-pin-in" style="--c:' + groupColor(v) + '"><b>' + v.length + "</b></span>",
        iconSize: [34, 34], iconAnchor: [17, 17],
      });
    }
    function unitState(u) {
      var v = shown(u), st = { sel: false, hot: false, went: true, dim: true };
      v.forEach(function (it) {
        var p = pinState[it.id] || {};
        if (p["is-sel"]) { st.sel = true; }
        if (p["is-hot"]) { st.hot = true; }
        if (!p["is-went"]) { st.went = false; }
        if (!p["is-dim"]) { st.dim = false; }
      });
      return st;
    }
    function rkOf(it) { return it && it.rk ? it.rk[0] : 2; }
    function unitStyle(u, st) {
      var v = shown(u), multi = v.length > 1, big = st.sel || st.hot, s = multi ? null : statusOf(v[0]);
      return {
        radius: st.sel ? 9.5 : st.hot ? 8.5 : multi ? 7.5 : rkOf(v[0]) === 1 ? 7 : rkOf(v[0]) === 3 ? 4 : 5.5,
        color: big ? ink : st.went ? "#1d6b45" : "#ffffff",
        weight: big ? 3 : multi || st.went ? 2.5 : 1.5,
        fillColor: multi ? groupColor(v) : s && s[1] === "is-closed" ? "#9aa3a0" : CATS[v[0].cat].color,
        fillOpacity: st.dim ? 0.3 : !multi && !big && rkOf(v[0]) === 3 ? 0.6 : v.every(function (it) { return it.approx; }) ? 0.8 : 1,
        opacity: st.dim ? 0.45 : 1,
      };
    }
    function applyUnit(u) {
      var st = unitState(u), m = icons[u.key], el = m && m.getElement();
      if (el) {
        el.classList.toggle("is-sel", st.sel);
        el.classList.toggle("is-hot", st.hot);
        el.classList.toggle("is-went", st.went);
        el.classList.toggle("is-dim", st.dim);
        el.setAttribute("title", unitTitle(u));
        el.setAttribute("aria-label", unitTitle(u));
      }
      var d = dots[u.key];
      if (d) {
        var o = unitStyle(u, st);
        d.setStyle(o);
        d.setRadius(o.radius);
        if (big(st) && dotLayer.hasLayer(d)) { d.bringToFront(); }
      }
    }
    function big(st) { return st.sel || st.hot; }
    function iconOf(u) {
      if (!icons[u.key]) {
        var m = L.marker([u.lat, u.lng], { icon: unitIcon(u), title: unitTitle(u), alt: unitTitle(u), riseOnHover: true });
        m.on("click", function () { pickAt(u); });
        m.on("add", function () { applyUnit(u); });
        icons[u.key] = m;
      }
      return icons[u.key];
    }
    function refreshUnits() {
      units.forEach(function (u) {
        var vis = u.members.filter(function (it) { return visSet[it.id]; });
        var sig = vis.length === 1 ? vis[0].id : "n" + vis.length;
        u.vis = vis;
        if (sig === u.sig) { return; }
        u.sig = sig;
        if (icons[u.key]) { icons[u.key].setIcon(unitIcon(u)); }
        if (dots[u.key]) { dots[u.key].setTooltipContent(unitTitle(u)); }
        applyUnit(u);
      });
    }
    if (map) {
      ringLayer = L.layerGroup().addTo(map);
      courseLayer = L.layerGroup().addTo(map);
      dotLayer = L.layerGroup();
      iconLayer = L.layerGroup();
      var dotRenderer = L.canvas({ padding: 0.4, tolerance: 6 });
      units.forEach(function (u) {
        var o = unitStyle(u, unitState(u));
        o.renderer = dotRenderer;
        o.bubblingMouseEvents = false;
        var d = L.circleMarker([u.lat, u.lng], o);
        d.on("click", function () { pickAt(u); });
        d.bindTooltip(unitTitle(u), { direction: "top", offset: [0, -6], opacity: 0.95 });
        dots[u.key] = d;
      });
      map.on("moveend", function () { syncPins(); });
      map.on("moveend", debounce(function () {
        if (S.rings && ringMode() === "center") { drawRings(); } else { buildRail(); }
      }, 180));
    }
    function isNear() { return map.getZoom() >= NEAR_ZOOM; }
    function syncDots() {
      if (!map) { return; }
      units.forEach(function (u) {
        var d = dots[u.key], on = u.vis.length > 0;
        if (on && !dotLayer.hasLayer(d)) { dotLayer.addLayer(d); }
        if (!on && dotLayer.hasLayer(d)) { dotLayer.removeLayer(d); }
      });
    }
    function syncPins() {
      if (!map) { return; }
      var near = isNear();
      stage.classList.toggle("is-far", !near);
      if (!near) {
        if (map.hasLayer(iconLayer)) { map.removeLayer(iconLayer); }
        if (spreadLayer && map.hasLayer(spreadLayer)) { map.removeLayer(spreadLayer); }
        if (!map.hasLayer(dotLayer)) { dotLayer.addTo(map); }
        return;
      }
      if (map.hasLayer(dotLayer)) { map.removeLayer(dotLayer); }
      if (!map.hasLayer(iconLayer)) { iconLayer.addTo(map); }
      if (spreadLayer && !map.hasLayer(spreadLayer)) { spreadLayer.addTo(map); }
      var b = map.getBounds().pad(0.35), su = selId() ? unitOf[selId()] : null;
      var mx = atMax();
      units.forEach(function (u) {
        var want = !mx && ((u.vis.length > 0 && b.contains([u.lat, u.lng])) || su === u);
        var m = icons[u.key];
        if (want) {
          m = iconOf(u);
          if (!iconLayer.hasLayer(m)) { iconLayer.addLayer(m); }
        } else if (m && iconLayer.hasLayer(m)) {
          iconLayer.removeLayer(m);
        }
      });
      if (SPREAD) { syncKids(mx, b); }
    }
    var SPREAD = !!(CFG.groupZoom && map), SPREAD_D = 36, kidOf = {}, spreadLayer = SPREAD ? L.layerGroup() : null, layout = null;
    function atMax() { return SPREAD && map.getZoom() >= map.getMaxZoom() - 0.01; }
    function spreadLayout() {
      var Z = map.getMaxZoom(), v = pins.filter(function (it) { return visSet[it.id]; });
      var sig = Z + ":" + v.map(function (it) { return it.id; }).join(",");
      if (layout && layout.sig === sig) { return layout; }
      var D = SPREAD_D, seen = {};
      var P = v.map(function (it) {
        var q = map.project([it.lat, it.lng], Z), k = Math.round(q.x) + "," + Math.round(q.y), j = seen[k] = (seen[k] || 0) + 1;
        var a = j * 2.39996, r = j > 1 ? 1.5 * Math.sqrt(j) : 0;
        return { it: it, x: q.x + Math.cos(a) * r, y: q.y + Math.sin(a) * r, x0: q.x, y0: q.y };
      });
      function cell(gx, gy) { return gx * 4194304 + gy; }
      function push() {
        var grid = new Map(), moved = 0;
        P.forEach(function (q, i) { var k = cell(Math.floor(q.x / D), Math.floor(q.y / D)), c = grid.get(k); if (c) { c.push(i); } else { grid.set(k, [i]); } });
        P.forEach(function (q, i) {
          var gx = Math.floor(q.x / D), gy = Math.floor(q.y / D);
          for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
              var c = grid.get(cell(gx + dx, gy + dy));
              if (!c) { continue; }
              for (var n = 0; n < c.length; n++) {
                var j = c[n];
                if (j <= i) { continue; }
                var o = P[j], ex = o.x - q.x, ey = o.y - q.y, d2 = ex * ex + ey * ey;
                if (d2 >= D * D) { continue; }
                var d = Math.sqrt(d2) || 0.001, m = (D - d) / 2 + 0.05;
                ex /= d; ey /= d;
                q.x -= ex * m; q.y -= ey * m; o.x += ex * m; o.y += ey * m;
                moved++;
              }
            }
          }
        });
        return moved;
      }
      var all = P, near = new Map();
      P.forEach(function (q, i) { var k = cell(Math.floor(q.x0 / D), Math.floor(q.y0 / D)), c = near.get(k); if (c) { c.push(i); } else { near.set(k, [i]); } });
      var busy = {};
      P.forEach(function (q, i) {
        var gx = Math.floor(q.x0 / D), gy = Math.floor(q.y0 / D), hit = false;
        for (var dx = -1; dx <= 1 && !hit; dx++) {
          for (var dy = -1; dy <= 1 && !hit; dy++) {
            (near.get(cell(gx + dx, gy + dy)) || []).forEach(function (j) {
              if (j !== i) { var ex = P[j].x0 - q.x0, ey = P[j].y0 - q.y0; if (ex * ex + ey * ey < D * D) { hit = true; } }
            });
          }
        }
        if (!hit) { return; }
        for (dx = -4; dx <= 4; dx++) { for (dy = -4; dy <= 4; dy++) { (near.get(cell(gx + dx, gy + dy)) || []).forEach(function (j) { busy[j] = 1; }); } }
      });
      P = all.filter(function (q, i) { return busy[i]; });
      for (var t = 0; t < 60; t++) {
        P.forEach(function (q) { q.x += (q.x0 - q.x) * 0.04; q.y += (q.y0 - q.y) * 0.04; });
        if (!push() && t > 0) { break; }
      }
      for (t = 0; t < 80 && push(); t++) {}
      P = all;
      layout = { sig: sig, pos: {} };
      P.forEach(function (q) {
        var ll = map.unproject(L.point(q.x, q.y), Z);
        layout.pos[q.it.id] = { lat: ll.lat, lng: ll.lng, moved: Math.abs(q.x - q.x0) + Math.abs(q.y - q.y0) > 4 };
      });
      return layout;
    }
    function kidMarker(k) {
      if (!icons[k.key]) {
        var it = k.members[0], m = L.marker([k.lat, k.lng], { icon: pinIcon(it), title: it.name, alt: it.name, riseOnHover: true });
        m.on("click", function () { select(it.id, { fromMap: true }); });
        m.on("add", function () { applyUnit(k); });
        icons[k.key] = m;
      }
      return icons[k.key];
    }
    function syncKids(on, b) {
      spreadLayer.clearLayers();
      if (!on) {
        Object.keys(kidOf).forEach(function (id) { var m = icons[kidOf[id].key]; if (m && iconLayer.hasLayer(m)) { iconLayer.removeLayer(m); } });
        return;
      }
      var lay = spreadLayout(), sel = selId();
      pins.forEach(function (it) {
        var q = lay.pos[it.id], k = kidOf[it.id], m = k && icons[k.key];
        if (!q || !(b.contains([q.lat, q.lng]) || sel === it.id)) {
          if (m && iconLayer.hasLayer(m)) { iconLayer.removeLayer(m); }
          return;
        }
        if (!k) { k = kidOf[it.id] = { key: "s" + it.id, members: [it], vis: [it], sig: it.id }; }
        k.lat = q.lat; k.lng = q.lng;
        m = kidMarker(k);
        m.setLatLng([q.lat, q.lng]);
        if (!iconLayer.hasLayer(m)) { iconLayer.addLayer(m); }
        if (q.moved) {
          spreadLayer.addLayer(L.polyline([[it.lat, it.lng], [q.lat, q.lng]], { color: ink, weight: 1.5, opacity: 0.55, interactive: false }));
          spreadLayer.addLayer(L.circleMarker([it.lat, it.lng], { radius: 3, stroke: false, fillColor: ink, fillOpacity: 0.7, interactive: false }));
        }
      });
    }
    var PICK_MAX = 40;
    function pickAt(u) {
      if (SPREAD && u.vis.length > 1) { viewPoint(u.lat, u.lng, map.getMaxZoom()); return; }
      var R = isNear() ? 22 : 14, p0 = map.latLngToContainerPoint([u.lat, u.lng]), hit = [];
      units.forEach(function (x) {
        if (!x.vis.length) { return; }
        if (x === u) { hit.push(x); return; }
        var p = map.latLngToContainerPoint([x.lat, x.lng]);
        if (Math.abs(p.x - p0.x) <= R && Math.abs(p.y - p0.y) <= R && p.distanceTo(p0) <= R) { hit.push(x); }
      });
      var list = [];
      hit.forEach(function (x) { x.vis.forEach(function (it) { list.push(it); }); });
      if (!list.length) { list = shown(u).slice(); }
      if (list.length === 1) { select(list[0].id, { fromMap: true }); return; }
      list.sort(function (a, b) { return meters(u, a) - meters(u, b) || CAT_RANK[a.cat] - CAT_RANK[b.cat] || a.i - b.i; });
      openPick(list.map(function (it) { return it.id; }), hit.length === 1 ? "same" : "near");
    }
    function openPick(ids, kind) {
      var list = ids.map(function (id) { return byId[id]; }).filter(Boolean), more = list.length - PICK_MAX;
      var h = headHTML(ink, "pin", kind === "same" ? "同じ点に重なっているピン" : "近くで重なっているピン", list.length + "か所");
      h += '<p class="c-pick-note">' + (kind === "same" ? "地図の同じ点に、" : "押した所の近くに、") + list.length +
        "か所のピンが重なっています。見たい場所を選んでください。</p>";
      h += '<ul class="c-pick">' + list.slice(0, PICK_MAX).map(function (it) {
        var c = CATS[it.cat];
        return '<li><button type="button" class="c-pick-btn" data-act="select" data-id="' + it.id + '" style="--c:' + c.color + '">' +
          '<span class="c-item-pict">' + icon(c.icon) + '</span><span class="c-pick-txt"><span class="c-pick-meta">' +
          esc(c.short + "・" + (it.area === "板橋区" && it.town !== "板橋区内" ? it.town : it.area)) + statusHTML(it) + "</span>" +
          '<span class="c-pick-name">' + esc(it.name) + "</span>" + badgeHTML(it, true) + "</span></button></li>";
      }).join("") + "</ul>";
      if (more > 0) { h += '<p class="c-note">ほかに' + more + "か所あります。地図を拡大すると、ピンが分かれて見えます。</p>"; }
      showPanel({ type: "pick", ids: ids, kind: kind }, h);
    }
    function fitTo(list) {
      if (!map || !list.length) { return; }
      var pts = list.map(function (it) { return [it.lat, it.lng]; });
      var open = !sheet.hidden, wide = isWide();
      var opt = {
        paddingTopLeft: [24, 140],
        paddingBottomRight: [open && wide ? 430 : 72, open && !wide ? sheet.offsetHeight + 24 : 150],
        maxZoom: 15,
      };
      if (pts.length === 1) { map.setView(pts[0], 15); } else { map.fitBounds(pts, opt); }
    }
    function pinClass(id, cls, on) {
      var st = pinState[id] || (pinState[id] = {});
      if (!!st[cls] === !!on) { return; }
      st[cls] = !!on;
      if (unitOf[id]) { applyUnit(unitOf[id]); }
      if (kidOf[id]) { applyUnit(kidOf[id]); }
    }
    function selId() { return S.panel && S.panel.type === "item" ? S.panel.id : null; }
    function coursePanel() {
      var p = S.panel;
      if (p && p.type === "item") { p = S.back; }
      return p && (p.type === "course" || p.type === "shared") ? p : null;
    }
    function courseIds() {
      var p = coursePanel();
      return p ? (p.type === "course" ? favs : p.ids) : null;
    }
    function paintPin(id) {
      var ids = courseIds();
      pinClass(id, "is-went", !!went[id]);
      pinClass(id, "is-sel", selId() === id);
      pinClass(id, "is-dim", !!ids && ids.indexOf(id) === -1);
    }
    function mapsQuery(it) {
      if (it.gq) { return it.gq; }
      var a = it.addr.replace(/[（(].*$/, "").trim();
      return it.name + " " + (/\d/.test(a) ? a : it.area);
    }
    function routeHref(it) {
      if (it.pin && !it.approx) { return "https://www.google.com/maps/dir/?api=1&destination=" + it.lat + "," + it.lng; }
      return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(mapsQuery(it));
    }

    var townCount = {}, areaCount = {};
    items.forEach(function (it) {
      areaCount[it.area] = (areaCount[it.area] || 0) + 1;
      if (it.area === "板橋区" && it.town !== "板橋区内") { townCount[it.town] = (townCount[it.town] || 0) + 1; }
    });
    var townList = Object.keys(townCount).sort(function (a, b) { return kana(a).localeCompare(kana(b), "ja"); });
    var areaOpts = '<option value="">エリア：すべて</option>' + AREAS.filter(function (a) { return areaCount[a]; }).map(function (a) {
      var h = '<option value="a:' + esc(a) + '">' + esc(a) + (a === "板橋区" ? "（全域）" : "") + "（" + areaCount[a] + "）</option>";
      if (a === "板橋区") {
        h += '<optgroup label="板橋区の町名">' + townList.map(function (t) {
          return '<option value="t:' + esc(t) + '">' + esc(t) + "（" + townCount[t] + "）</option>";
        }).join("") + "</optgroup>";
      }
      return h;
    }).join("");
    var PURPS = CFG.purposes, PURP = {}, PURP_OF = {};
    PURPS.forEach(function (p) {
      PURP[p.key] = p;
      p.cats.forEach(function (c) { PURP_OF[c] = p.key; });
    });
    PURPS.forEach(function (p) { p.n = items.filter(function (it) { return PURP_OF[it.cat] === p.key; }).length; });
    chips.innerHTML =
      '<button type="button" class="c-chip c-catchip c-catall c-purpall" data-act="purpall" aria-pressed="true" aria-label="すべての場所を表示する">' + icon("check") + "すべて</button>" +
      PURPS.map(function (p) {
        return '<button type="button" class="c-purp" data-act="purp" data-key="' + p.key + '" aria-pressed="false" aria-label="' + esc(p.label + "（" + p.name + "・" + p.n + (p.unit || "か所") + "）") +
          '" title="' + esc(p.name) + '" style="--c:' + p.color + '"><span class="c-purp-ic">' + icon(p.icon) + '</span><span class="c-purp-l">' + esc(p.label) + '</span><span class="c-purp-s">' + esc(p.short) + "</span></button>";
      }).join("");
    legend.innerHTML = '<button type="button" class="c-chip is-mine" data-act="course" aria-pressed="false">' + icon("flag") + '自分のコース<span class="c-chip-n c-course-n">0</span></button>';
    function purpOn(p) { return S.hidden.length > 0 && p.cats.every(function (c) { return S.hidden.indexOf(c) === -1; }); }
    function purpsOn() { return PURPS.filter(purpOn); }
    function onePurp() { var l = purpsOn(); return l.length === 1 ? l[0] : null; }
    function togglePurp(p) {
      var h = S.hidden;
      if (!h.length) { h = CAT_IDS.filter(function (c) { return p.cats.indexOf(c) === -1; }); }
      else if (purpOn(p)) { h = h.concat(p.cats); if (h.length >= CAT_IDS.length) { h = []; } }
      else { h = h.filter(function (c) { return p.cats.indexOf(c) === -1; }); }
      S.hidden = h;
      S.kind = "";
      var one = onePurp();
      if (S.cond && !(one && one.co)) { S.cond = ""; }
    }
    function kindOk(it) { return S.kind.charAt(0) === "c" ? it.cat === S.kind.slice(2) : it.sub === S.kind.slice(2); }
    function kindValid(k) { var p = onePurp(); return !!p && p.kinds.some(function (x) { return x[0] === k; }); }
    function countVis() { var k = 0; for (var id in visSet) { if (visSet[id]) { k++; } } return k; }
    function unitWord() { var p = onePurp(); return p && p.unit ? p.unit : "か所"; }

    var condsEl = $(".c-conds"), condSels = [];
    stage.classList.add("has-conds");
    var coN = {};
    items.forEach(function (it) { it.tags.forEach(function (t) { if (facet(t) === "運営会社") { coN[label(t)] = (coN[label(t)] || 0) + 1; } }); });
    var coOpts = Object.keys(coN).sort(function (a, b) { return coN[b] - coN[a] || a.localeCompare(b, "ja"); }).map(function (v) {
      return '<option value="co:' + esc(v) + '">' + esc(v) + "（" + coN[v] + "）</option>";
    }).join("");
    condsEl.innerHTML =
      '<button type="button" class="c-chip c-count" data-act="clear" hidden><b class="c-count-n"></b><span class="c-count-u">か所</span>' + icon("close") + '<span class="c-vh">条件を外して、すべての場所を表示する</span></button>' +
      '<button type="button" class="c-chip is-tagf" data-act="untag" hidden>' + icon("tag") + '<span class="c-tagf-t"></span>' + icon("close") + "</button>" +
      '<label class="c-chip c-selchip c-kindchip" hidden>' + icon("list") + '<select class="c-kindsel" aria-label="種類で絞る"></select></label>' +
      PRESETS.map(function (p) {
        return '<button type="button" class="c-chip c-cond" data-act="preset" data-key="' + p.key + '" aria-pressed="false"' + (p.title ? ' title="' + esc(p.title) + '"' : "") + ">" +
          icon(p.icon) + "<span>" + esc(p.label) + '</span><span class="c-chip-n"></span></button>';
      }).join("") +
      '<label class="c-chip c-selchip c-condsel c-cochip" hidden>' + icon("shop") + '<select class="c-csel" data-k="co" aria-label="運営会社で絞る"><option value="">運営会社</option>' + coOpts + "</select></label>" +
      '<label class="c-chip c-selchip c-areachip">' + icon("pin") + '<select class="c-areasel" aria-label="エリアで絞り込む">' + areaOpts + "</select></label>";
    var areaSel = $(".c-areasel", condsEl), kindSel = $(".c-kindsel", condsEl), kindChip = $(".c-kindchip", condsEl), coChip = $(".c-cochip", condsEl);
    condSels = $$(".c-csel", condsEl);
    condSels.forEach(function (s) {
      s.addEventListener("change", function () {
        S.cond = s.value || "";
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(!!S.cond);
        condToast();
      });
    });
    kindSel.addEventListener("change", function () {
      S.kind = kindSel.value || "";
      S.hint = null;
      if (S.panel && S.panel.type !== "item") { closePanel(); }
      apply(!!S.kind);
      if (S.kind) { toast(kindSel.options[kindSel.selectedIndex].text.replace(/（\d+）$/, "") + "の" + countVis() + unitWord() + "を表示しています"); }
    });
    function condToast() { if (S.cond) { toast(condSay(S.cond, countVis())); } }
    var row2Sig = null;
    function paintTop(n, f) {
      var on = purpsOn(), one = on.length === 1 ? on[0] : null;
      $$(".c-purp", chips).forEach(function (b) { b.setAttribute("aria-pressed", purpOn(PURP[b.getAttribute("data-key")]) ? "true" : "false"); });
      $(".c-purpall", chips).setAttribute("aria-pressed", S.hidden.length ? "false" : "true");
      var cnt = $(".c-count", condsEl);
      cnt.hidden = !f;
      $(".c-count-n", cnt).textContent = n;
      $(".c-count-u", cnt).textContent = unitWord();
      var tf = $(".is-tagf", condsEl);
      tf.hidden = !S.tag;
      if (S.tag) { $(".c-tagf-t", tf).textContent = tagText(S.tag); }
      var sig = on.map(function (p) { return p.key; }).join(",");
      if (sig !== row2Sig) {
        // 目的が変わったときだけ、種類の選択肢と条件の並びを作り直す（条件は当てはまる場所の多い順）
        row2Sig = sig;
        var kinds = one ? one.kinds : [];
        kindChip.hidden = kinds.length < 2;
        kindSel.innerHTML = '<option value="">' + (one && one.kindWord ? one.kindWord : "種類") + "：すべて</option>" +
          kinds.map(function (k) { return '<option value="' + esc(k[0]) + '">' + esc(k[1]) + "（" + k[2] + "）</option>"; }).join("");
        var base = items.filter(function (it) { return S.hidden.indexOf(it.cat) === -1; });
        var allow = one && one.conds ? one.conds : null, ord = {};
        PRESETS.map(function (p) { var k = 0; for (var i = 0; i < base.length; i++) { if (p.test(base[i])) { k++; } } return { key: p.key, n: k }; })
          .filter(function (e) { return e.n > 0 && (!allow || allow.indexOf(e.key) !== -1); })
          .sort(function (a, b) { return b.n - a.n; }).slice(0, CFG.condMax || 6)
          .forEach(function (e, i) { ord[e.key] = i + 1; });
        $$(".c-cond", condsEl).forEach(function (b) { var o = ord[b.getAttribute("data-key")]; b.style.order = o || 90; b.setAttribute("data-show", o ? "1" : "0"); });
        coChip.hidden = !(one && one.co);
        condsEl.scrollLeft = 0;
      }
      kindSel.value = S.kind;
      kindChip.classList.toggle("is-on", !!S.kind);
      var vis = items.filter(function (it) { return visSet[it.id]; });
      $$(".c-cond", condsEl).forEach(function (b) {
        var key = b.getAttribute("data-key"), act = S.presets.indexOf(key) !== -1, k = 0;
        if (act) { k = vis.length; } else { var t = PRESET[key].test; for (var i = 0; i < vis.length; i++) { if (t(vis[i])) { k++; } } }
        b.hidden = !(act || b.getAttribute("data-show") === "1");
        b.setAttribute("aria-pressed", act ? "true" : "false");
        $(".c-chip-n", b).textContent = k;
        b.classList.toggle("is-zero", k === 0 && !act);
      });
      var co = S.cond.indexOf("co:") === 0;
      condSels.forEach(function (s) { s.value = co ? S.cond : ""; s.parentNode.classList.toggle("is-on", co); });
      areaSel.value = S.town ? "t:" + S.town : S.area ? "a:" + S.area : "";
      areaSel.parentNode.classList.toggle("is-on", !!(S.area || S.town));
    }

    function sortKey(a, b) { return CAT_RANK[a.cat] - CAT_RANK[b.cat] || a.i - b.i; }
    function rowHTML(it) {
      var c = CATS[it.cat], tel = firstTel(it);
      var acts = "";
      if (it.url) { acts += '<a class="c-mini" href="' + esc(it.url) + '" target="_blank" rel="noopener" aria-label="' + esc(it.name) + "の" + linkWord(it) + '（新しいタブ）" title="' + linkWord(it) + '">' + icon("ext") + "</a>"; }
      if (it.gm) { acts += '<a class="c-mini" href="' + esc(it.gm) + '" target="_blank" rel="noopener" aria-label="' + esc(it.name) + 'のgMap施設情報（新しいタブ）" title="gMap施設情報">' + icon("pin") + "</a>"; }
      if (tel) { acts += '<a class="c-mini" href="tel:' + esc(tel[1]) + '" aria-label="' + esc(it.name) + "に電話（" + esc(tel[1]) + '）" title="電話 ' + esc(tel[1]) + '">' + icon("phone") + "</a>"; }
      return '<li class="c-row" id="' + P + "-" + it.id + '" data-id="' + it.id + '" style="--c:' + c.color + '">' +
        '<div class="c-row-top"><button type="button" class="c-row-btn" data-act="row" data-id="' + it.id + '" aria-expanded="false">' +
        '<span class="c-item-pict">' + icon(c.icon) + "</span>" +
        '<span class="c-row-txt"><span class="c-row-meta">' + esc(c.short + "・" + (it.area === "板橋区" && it.town !== "板橋区内" ? it.town : it.area)) + statusHTML(it) + "</span>" +
        '<span class="c-row-name">' + esc(it.name) + "</span>" + badgeHTML(it, false) + "</span>" +
        '<span class="c-row-side"><span class="c-row-went" hidden></span><span class="c-row-dist" hidden></span>' + icon("chevron", "c-row-chev") + "</span></button>" +
        (acts ? '<span class="c-row-acts">' + acts + "</span>" : "") + "</div>" +
        '<div class="c-row-more" hidden></div></li>';
    }
    function gkey(it) { return it.area === "板橋区" ? it.town : it.area; }
    var groups = [];
    (function buildGroups() {
      var h = "", specs = [];
      townList.concat(["板橋区内"]).forEach(function (t) {
        var l = items.filter(function (it) { return it.area === "板橋区" && it.town === t; }).sort(sortKey);
        if (l.length) { specs.push({ key: t, label: t === "板橋区内" ? "板橋区（町名の記載がない場所）" : t, list: l }); }
      });
      AREAS.forEach(function (a) {
        if (a === "板橋区") { return; }
        var l = items.filter(function (it) { return it.area === a; }).sort(sortKey);
        if (l.length) { specs.push({ key: a, label: a, list: l }); }
      });
      specs.forEach(function (sp) {
        var list = sp.list;
        groups.push({ area: sp.key, label: sp.label, n: list.length, ids: list.map(function (it) { return it.id; }) });
        h += '<details class="c-grp" data-area="' + esc(sp.key) + '">' +
          '<summary class="c-grp-h"><span class="c-grp-name">' + esc(sp.label) + '</span><span class="c-grp-n"><b>' + list.length + "</b>件</span>" +
          '<span class="c-grp-prog">行った <b>0</b>/' + list.length + '</span><span class="c-grp-bar" aria-hidden="true"><i></i></span>' + icon("chevron", "c-grp-chev") + "</summary>" +
          '<section class="c-sub"><ul class="c-rows">' + list.map(rowHTML).join("") + "</ul></section></details>";
      });
      groupsEl.innerHTML = h;
    })();
    var rowEl = {};
    $$(".c-row", groupsEl).forEach(function (el) { rowEl[el.getAttribute("data-id")] = el; });
    var grpEl = {};
    $$(".c-grp", groupsEl).forEach(function (el) { grpEl[el.getAttribute("data-area")] = el; });

    function linkWord(it) { return it.has("情報源:公式ページ未確認") ? "案内ページ" : "公式ページ"; }
    function firstTel(it) {
      for (var k = 0; k < it.phones.length; k++) { if (!it.phones[k][3]) { return it.phones[k]; } }
      return null;
    }
    function tagText(t) {
      var f = facet(t), v = label(t);
      if (f === "最寄り駅") { return v + "駅"; }
      if (f === "運営会社") { return "運営：" + v; }
      if (f === "駐車場" || f === "駐輪場") { return f + " " + v; }
      if (f === "料金" && v === "要確認") { return "料金は要確認"; }
      if (f === "駅から") { return v === "バス停が近い" ? v : "駅から" + v; }
      if (f === "持ち物" && v !== "手ぶらでよい") { return "持ち物 " + v; }
      if (f === "予約" && v === "予約・申し込みが必要なものあり") { return "予約が必要なものあり"; }
      return v;
    }
    function tagBtn(t) {
      return '<li><button type="button" class="c-tag" data-act="tag" data-tag="' + esc(t) + '" title="' + esc(facet(t)) + "：" + esc(label(t)) + '">' + esc(tagText(t)) + "</button></li>";
    }
    function tagsHTML(it) {
      var main = [], niche = [];
      it.tags.forEach(function (t) {
        var f = facet(t);
        if (NO_INDEX[f]) { return; }
        if (it.food && f === "最寄り駅") { return; }
        if (f === "条件" && CFG.condKeys.indexOf(label(t)) === -1) { return; }
        (NICHE[f] ? niche : main).push(t);
      });
      if (!main.length && !niche.length) { return ""; }
      var h = '<div class="c-tags"><p class="c-tags-h">' + icon("tag") + "タグ<span>押すと、同じタグの場所だけを表示します</span></p><ul>" + main.map(tagBtn).join("") + "</ul>";
      if (niche.length) { h += '<details class="c-niche"><summary>ほかの情報（' + niche.length + "）" + icon("chevron") + "</summary><ul>" + niche.map(tagBtn).join("") + "</ul></details>"; }
      return h + "</div>";
    }
    function srcLinks(it) {
      var srcs = [it.url].concat(it.sources).filter(Boolean);
      if (!srcs.length) { return ""; }
      return "出典：" + srcs.map(function (u, k) {
        return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + (k === 0 && it.url ? linkWord(it) : "資料" + (k + 1)) + "</a>";
      }).join("、") + "。";
    }
    function srcHTML(it) {
      if (it.nosrc) {
        if (it.ofc) {
          return '<div class="c-src">' + icon("info") + "<p>" + (it.ofc === 3 ? "店名と住所" : it.ofc === 2 ? "設備" : "営業時間と設備") + "は、" + jdate(it.checked) + "にチェーンの公式の店舗ページで確かめた情報です。" +
            (it.approx && it.pin ? "地図の位置は、住所の近くの番地や駅から出したおおよその位置です。" : "") +
            (it.url ? '出典：<a href="' + esc(it.url) + '" target="_blank" rel="noopener">公式ページ</a>。' : "") + "</p></div>";
        }
        if (it.kd && CFG.kyokaUrl) {
          return '<div class="c-src">' + icon("info") + "<p>板橋区の食品営業許可施設一覧で、" + jdate(it.kd) +
            "に営業許可を受けた店です。ジャンルは店名や店の紹介ページから分けました。出典：<a href=\"" + esc(CFG.kyokaUrl) + '" target="_blank" rel="noopener">板橋区公式ホームページ</a>。</p></div>';
        }
        return "";
      }
      var h = "";
      if (it.listOnly || it.has("情報源:一覧の情報")) {
        h = jdate(M.date) + "時点の一覧の情報です。" + srcLinks(it);
      } else if (it.has("情報源:公式ページ未確認")) {
        h = (it.url ? "施設ごとの公式ページが見つからないため、区の案内ページと一覧の情報を載せています（" : "公式ページが見つからず、一覧の情報だけを載せています（") +
          jdate(M.date) + "時点）。" + srcLinks(it);
      } else {
        h = jdate(it.checked) + "に" + (it.has("情報源:掲載サイトの情報") ? "掲載サイト" : "公式ページなど") + "で確かめた情報です。";
        if (it.filled) { h += "一部の項目は、" + jdate(M.date) + "時点の一覧の情報で補いました。"; }
        h += srcLinks(it);
      }
      if (it.unknown.length) { h += "確かめられなかった項目：" + it.unknown.map(esc).join("、") + "。"; }
      if (it.approx && it.pin) { h += it.coarse ? "地図の位置は町の中心で、実際の場所とはずれます。" : it.mappos ? "地図の位置は区の文化財マップから読み取った、おおよその位置です。" : "地図の位置は町丁目の代表点で、おおよその位置です。"; }
      return '<div class="c-src">' + icon("info") + "<p>" + h + "</p></div>";
    }
    function actsHTML(it, ctx) {
      var a = [], tel = firstTel(it);
      if (ctx !== "sheet" && it.pin) { a.push('<button type="button" class="c-act is-main" data-act="focus" data-id="' + it.id + '">' + icon("map") + "地図で見る</button>"); }
      if (it.url) { a.push('<a class="c-act" href="' + esc(it.url) + '" target="_blank" rel="noopener">' + icon("ext") + linkWord(it) + "</a>"); }
      if (it.gm) { a.push('<a class="c-act" href="' + esc(it.gm) + '" target="_blank" rel="noopener">' + icon("pin") + "gMap施設情報</a>"); }
      if (tel) { a.push('<a class="c-act" href="tel:' + esc(tel[1]) + '">' + icon("phone") + "電話</a>"); }
      a.push('<a class="c-act" href="' + esc(routeHref(it)) + '" target="_blank" rel="noopener">' + icon("route") + "経路</a>");
      a.push('<button type="button" class="c-act c-fav" data-act="fav" data-id="' + it.id + '" aria-pressed="false">' + icon("star") + "<span>コースに入れる</span></button>");
      a.push('<button type="button" class="c-act c-went" data-act="went" data-id="' + it.id + '" aria-pressed="false">' + icon("check") + "<span>行った</span></button>");
      a.push('<button type="button" class="c-act" data-act="share" data-id="' + it.id + '" aria-label="' + esc(it.name) + 'のリンクを共有">' + icon("share") + "</button>");
      return '<div class="c-item-acts">' + a.join("") + "</div>";
    }
    function detailHTML(it, ctx) {
      var h = "", flags = "";
      if (ctx === "sheet") {
        flags += statusHTML(it);
      }
      if (it.approx && it.pin) { flags += '<span class="c-stt is-unk">' + (it.coarse ? "位置は町の中心" : "位置はおおよそ") + "</span>"; }
      if (it.has("情報源:公式ページ未確認")) { flags += '<span class="c-stt is-unk">公式ページ未確認</span>'; }
      if (flags) { h += '<p class="c-flags">' + flags + "</p>"; }
      if (ctx === "sheet") { h += badgeHTML(it, false); }
      if (it.addr) { h += '<p class="c-item-addr">' + icon("pin") + "<span>" + rich(it.addr) + "</span></p>"; }
      if (it.st && it.pin) {
        h += '<p class="c-item-addr c-item-st">' + icon("train") + "<span>" + esc(it.st[0]) + "駅まで" + fmtDist(it.st[1]) + "・徒歩" + walkMin(it.st[1]) + "分" +
          '<small>（直線距離から出した目安）</small></span></p>';
      }
      if (it.rk) {
        h += '<p class="c-rk is-rk' + it.rk[0] + '"><b>口コミ：' + ["", "多い", "ふつう", "少ない"][it.rk[0]] + '</b><span>Googleマップの口コミ ' + it.rv + "件</span></p>";
      }
      if (it.official) { h += '<p class="c-official">公式の名前：' + esc(it.official) + "</p>"; }
      if (!it.pin && !it.sameAs) { h += '<p class="c-item-nomap">地図に載せる位置の情報がありません。「経路」は名前と住所で探します。</p>'; }
      if (it.lead) { h += '<p class="c-lead">' + rich(it.lead) + "</p>"; }
      if (it.sameAs && byId[it.sameAs]) {
        h += '<p class="c-notice"><b>お知らせ</b>今の名前は<a href="#' + P + "-" + it.sameAs + '" data-act="rel" data-id="' + it.sameAs + '">' + esc(byId[it.sameAs].name) + "</a>です。詳しくはそちらの項目を見てください。</p>";
      }
      it.notices.forEach(function (n) { h += '<p class="c-notice"><b>お知らせ</b>' + rich(n) + "</p>"; });
      h += actsHTML(it, ctx);
      if (it.specs.length) {
        h += '<dl class="c-dl">' + it.specs.map(function (s) {
          var x = "";
          if (s[0] === "営業時間" && it.oh) { x = openNow(it) ? '<span class="c-open is-on">いま営業中</span>' : '<span class="c-open">いまは営業時間外</span>'; }
          return "<div><dt>" + esc(s[0]) + "</dt><dd>" + rich(s[1]) + x + "</dd></div>";
        }).join("") + "</dl>";
      }
      if (it.phones.length) {
        h += '<div class="c-tels">' + it.phones.map(function (p) {
          var num = p[3] ? "<b>" + esc(p[1]) + "</b>" : '<a href="tel:' + esc(p[1]) + '">' + icon("phone") + esc(p[1]) + "</a>";
          return '<p class="c-tel"><span class="c-tel-lb">' + esc(p[0]) + "</span>" + num + (p[2] ? '<span class="c-tel-note">' + esc(p[2]) + "</span>" : "") + "</p>";
        }).join("") + (it.telNote ? '<p class="c-tel-note">' + esc(it.telNote) + "</p>" : "") + "</div>";
      }
      h += tagsHTML(it);
      var rel = it.related.filter(function (r) { return byId[r[0]]; });
      if (rel.length) {
        h += '<p class="c-rel"><b>あわせて行くなら（直線距離）</b>' + rel.map(function (r) {
          var far = it.approx || byId[r[0]].approx;
          return '<a href="#' + P + "-" + r[0] + '" data-act="rel" data-id="' + r[0] + '">' + esc(byId[r[0]].name) + '</a><span class="c-rel-d">' + fmtDist(r[1]) + (far ? "（位置はおおよそ）" : "") + "</span>";
        }).join('<span class="c-sep">、</span>') + "</p>";
      }
      h += srcHTML(it);
      return h;
    }

    function hint() { return S.hint ? COURSES.filter(function (c) { return c.key === S.hint; })[0] : null; }
    function pass(it, skipCats, skipCond) {
      var h = hint();
      for (var k = 0; k < S.ws.length; k++) { if (!match(it, S.ws[k])) { return false; } }
      if (S.area && it.area !== S.area) { return false; }
      if (S.town && it.town !== S.town) { return false; }
      if (S.tag && !it.has(S.tag)) { return false; }
      for (k = 0; k < S.presets.length; k++) { if (!PRESET[S.presets[k]].test(it)) { return false; } }
      if (h && h.ids.indexOf(it.id) === -1) { return false; }
      if (!skipCats && S.hidden.indexOf(it.cat) !== -1) { return false; }
      if (!skipCats && S.kind && !kindOk(it)) { return false; }
      if (!skipCond && S.cond && !condFn(S.cond)(it)) { return false; }
      return true;
    }
    function filtering() { return !!(S.ws.length || S.area || S.town || S.tag || S.presets.length || S.hidden.length || S.kind || S.hint || S.cond); }
    function visible() { return items.filter(function (it) { return visSet[it.id]; }); }
    function apply(fit) {
      visSet = {};
      if (S.cond === "now") { nowInfo(); }
      var n = 0, np = 0;
      items.forEach(function (it) {
        var on = pass(it, false);
        if (on) { visSet[it.id] = true; n++; if (it.pin) { np++; } }
        var r = rowEl[it.id];
        if (r) { r.hidden = !on; }
      });
      refreshUnits();
      syncDots();
      syncPins();
      var f = filtering();
      groups.forEach(function (g) {
        var el = grpEl[g.area], k = 0;
        g.ids.forEach(function (id) { if (visSet[id]) { k++; } });
        el.hidden = k === 0;
        $(".c-grp-n b", el).textContent = k;
        if (f && k) { el.open = true; }
        $$(".c-sub", el).forEach(function (s) { s.hidden = !$$(".c-row", s).some(function (x) { return !x.hidden; }); });
      });
      $(".c-index-count").innerHTML = f ? "条件に合う場所 <b>" + n + "</b>件（地図に載っているのは" + np + "件）" : "全" + items.length + "件（地図に載っているのは" + pins.length + "件）";
      $(".c-index-empty").hidden = n > 0;
      paintSearch();
      paintTop(n, f);
      if (selId() && !visSet[selId()]) { closePanel(); }
      if (fit) {
        var vp = visible().filter(function (it) { return it.pin; });
        if (vp.length) { fitTo(vp); } else if (n) { toast("条件に合う" + n + "件は、地図に位置がない場所です。下の一覧で見られます。"); }
      }
      if (S.rings) { drawRings(); } else { paintDist(); buildRail(); }
      saveHash();
    }
    function clearFilters(keepQ) {
      if (!keepQ) { S.q = ""; S.ws = []; qIn.value = ""; }
      S.area = ""; S.town = ""; S.tag = ""; S.presets = []; S.hint = null; S.hidden = []; S.kind = ""; S.cond = "";
      apply(false);
    }

    var cards = {};
    var hotId = null, io = null;
    function cardHTML(it) {
      var c = CATS[it.cat];
      return '<button type="button" class="c-card' + (selId() === it.id ? " is-sel" : "") + '" data-act="select" data-id="' + it.id + '" style="--c:' + c.color + '">' +
        '<span class="c-card-pict">' + icon(c.icon) + "</span>" +
        '<span class="c-card-body"><span class="c-card-cat">' + esc(c.short + "・" + (it.area === "板橋区" && it.town !== "板橋区内" ? it.town : it.area)) + statusHTML(it) + "</span>" +
        '<span class="c-card-name">' + esc(it.name) + "</span>" + badgeHTML(it, true) +
        '<span class="c-card-dist" hidden></span></span><span class="c-card-went"' + (went[it.id] ? "" : " hidden") + ">" + icon("check") + "行った</span></button>";
    }
    function buildRail() {
      if (!map) { rail.hidden = true; return; }
      var b = map.getBounds().pad(0.02), c = map.getCenter();
      var from = S.rings && origin ? origin : (pos || { lat: c.lat, lng: c.lng });
      var list = pins.filter(function (it) { return visSet[it.id] && b.contains([it.lat, it.lng]); });
      list.forEach(function (it) { it._d = meters(from, it); });
      list.sort(function (x, y) { return x._d - y._d; });
      var more = list.length - RAIL_MAX;
      list = list.slice(0, RAIL_MAX);
      var nvis = 0;
      for (var k in visSet) { if (visSet[k]) { nvis++; } }
      var msg = "";
      if (!list.length) {
        msg = nvis ? "この範囲には、条件に合う場所がありません。地図を動かすか縮小してください。" : "条件に合う場所がありません。条件を外してください。";
      }
      rail.innerHTML = list.map(cardHTML).join("") +
        (more > 0 ? '<p class="c-rail-more">この範囲にはほかに' + more + "件あります。地図を拡大すると絞れます。</p>" : "") +
        (msg ? '<p class="c-rail-empty">' + msg + "</p>" : "");
      cards = {};
      $$(".c-card", rail).forEach(function (el) { cards[el.getAttribute("data-id")] = el; });
      if (io) { io.disconnect(); }
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            var id = e.target.getAttribute("data-id");
            if (e.isIntersecting && e.intersectionRatio >= 0.9) {
              if (hotId && hotId !== id) { pinClass(hotId, "is-hot", false); if (cards[hotId]) { cards[hotId].classList.remove("is-hot"); } }
              hotId = id;
              pinClass(id, "is-hot", true);
              e.target.classList.add("is-hot");
            }
          });
        }, { root: rail, threshold: [0.9] });
        $$(".c-card", rail).forEach(function (el) { io.observe(el); });
      }
      paintDist();
      if (T) { tutPlace(); }
    }

    function paintDist() {
      var from = S.rings ? origin : pos;
      var mode = S.rings ? ringMode() : "me";
      var word = { spot: "", me: "現在地から", center: "地図の中心から" }[mode];
      function lab(it) {
        if (!from || !it.pin || (mode === "spot" && it.id === selId())) { return ""; }
        var mm = meters(from, it);
        return word + (mm > 2400 ? fmtDist(mm) : "徒歩" + walkMin(mm) + "分") + (it.approx ? "（位置はおおよそ）" : "");
      }
      Object.keys(cards).forEach(function (id) {
        var el = $(".c-card-dist", cards[id]), t = lab(byId[id]);
        el.textContent = t; el.hidden = !t;
      });
      items.forEach(function (it) {
        var r = rowEl[it.id];
        if (!r || r.hidden) { return; }
        var el = $(".c-row-dist", r), t = lab(it);
        if (el.textContent !== t) { el.textContent = t; }
        el.hidden = !t;
      });
    }

    function ringMode() {
      var id = selId();
      if (id && byId[id].pin) { return "spot"; }
      if (pos) { return "me"; }
      return "center";
    }
    function ringCenter() {
      var m = ringMode();
      if (m === "spot") { var it = byId[selId()]; return { lat: it.lat, lng: it.lng }; }
      if (m === "me") { return pos; }
      var c = map.getCenter();
      return { lat: c.lat, lng: c.lng };
    }
    function drawRings() {
      if (!map) { return; }
      ringLayer.clearLayers();
      if (!S.rings) { info.hidden = true; cross.hidden = true; origin = null; paintDist(); buildRail(); return; }
      var c = ringCenter();
      origin = c;
      var kx = 111320 * Math.cos(c.lat * Math.PI / 180);
      RINGS.forEach(function (r, i) {
        L.circle([c.lat, c.lng], { radius: r[0], color: "#e39b00", weight: i === 1 ? 2.5 : 1.5, dashArray: "6 7", fillColor: "#f0aa00", fillOpacity: 0.045, interactive: false }).addTo(ringLayer);
        L.marker([c.lat, c.lng - r[0] / kx], { icon: L.divIcon({ className: "c-ringlb", html: "<span>" + r[1] + "</span>", iconSize: [0, 0] }), interactive: false, keyboard: false }).addTo(ringLayer);
      });
      cross.hidden = ringMode() !== "center";
      var skip = ringMode() === "spot" ? selId() : null;
      var vis = pins.filter(function (it) { return visSet[it.id] && it.id !== skip; });
      var n = RINGS.map(function (r) { return vis.filter(function (it) { return meters(c, it) <= r[0]; }).length; });
      var from = {
        spot: esc(byId[selId()] ? byId[selId()].name : "") + "から",
        me: "現在地から",
        center: "地図の中心から（地図を動かすと変わります）",
      }[ringMode()];
      info.innerHTML = from + "<br>徒歩5分圏 <b>" + n[0] + "</b>件\u300010分圏 <b>" + n[1] + "</b>件\u300020分圏 <b>" + n[2] + "</b>件";
      info.hidden = false;
      buildRail();
    }
    function setRings(on) {
      S.rings = on;
      $('[data-act="rings"]').setAttribute("aria-pressed", on ? "true" : "false");
      var b = $('[data-act="ringhere"]', sheet);
      if (b) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
      drawRings();
      if (on && map && map.getZoom() > 14) { map.setZoom(14); }
    }

    function headHTML(color, ic, small, title) {
      return '<div class="c-sh-head"><span class="c-item-pict" style="--c:' + color + '">' + icon(ic) + "</span>" +
        '<div class="c-sh-title"><p class="c-sh-cat">' + small + '</p><h4 class="c-sh-name">' + esc(title) + "</h4></div>" +
        '<button type="button" class="c-sh-x" data-act="close" aria-label="閉じる">' + icon("close") + "</button></div>";
    }
    function paintPanelState() {
      var own = !!S.panel && S.panel.type === "course";
      $('.c-chip[data-act="course"]', legend).setAttribute("aria-pressed", own ? "true" : "false");
    }
    function showPanel(p, html) {
      var prev = selId();
      if (p.type !== "item") { S.back = null; }
      S.panel = p;
      sheet.innerHTML = html;
      sheet.hidden = false;
      stage.classList.add("has-sheet");
      sheet.scrollTop = 0;
      if (prev && prev !== selId()) {
        pinClass(prev, "is-sel", false);
        if (cards[prev]) { cards[prev].classList.remove("is-sel"); }
      }
      paintPanelState();
      paintFavs();
      paintWent();
      drawCourse();
    }
    function closePanel() {
      var prev = selId();
      S.panel = null;
      S.back = null;
      sheet.hidden = true;
      sheet.innerHTML = "";
      stage.classList.remove("has-sheet");
      if (prev) {
        pinClass(prev, "is-sel", false);
        if (cards[prev]) { cards[prev].classList.remove("is-sel"); }
      }
      paintPanelState();
      drawCourse();
      if (S.rings) { drawRings(); }
    }
    function nearList(it) {
      return pins.filter(function (x) { return x.id !== it.id && visSet[x.id]; }).map(function (x) {
        return { it: x, m: meters(it, x) };
      }).sort(function (a, b) { return a.m - b.m; }).slice(0, 3);
    }
    function openItem(it, lab) {
      var c = CATS[it.cat];
      var h = headHTML(c.color, c.icon, esc(c.short + "・" + (it.area === "板橋区" && it.town !== "板橋区内" ? it.town : it.area)), it.name);
      if (S.back) {
        h += '<button type="button" class="c-back" data-act="back">' + icon(S.back.type === "pick" ? "pin" : "flag") +
          (S.back.type === "course" ? "自分のコースに戻る" : S.back.type === "pick" ? "重なっているピンの一覧に戻る" : "共有されたコースに戻る") + "</button>";
      }
      if (lab) { h += '<p class="c-sh-label">' + icon("dice") + esc(lab) + "</p>"; }
      h += detailHTML(it, "sheet");
      if (it.pin) {
        h += '<button type="button" class="c-sh-ring" data-act="ringhere" aria-pressed="' + (S.rings ? "true" : "false") + '">' + icon("walk") + "徒歩5〜20分の範囲を表示</button>";
        var near = nearList(it);
        if (near.length) {
          h += '<div class="c-near"><p class="c-near-h">地図に出ている近くの場所（直線距離から出した目安）</p><ul>' + near.map(function (n) {
            return '<li><button type="button" data-act="select" data-id="' + n.it.id + '" style="--c:' + CATS[n.it.cat].color + '"><span class="c-near-dot"></span>' +
              '<span class="c-near-txt"><span class="c-near-name">' + esc(n.it.name) + '</span><span class="c-near-d">' + fmtDist(n.m) + "・徒歩" + walkMin(n.m) + "分" +
              (n.it.approx || it.approx ? "（位置はおおよそ）" : "") + "</span></span></button></li>";
          }).join("") + "</ul></div>";
        }
      }
      showPanel({ type: "item", id: it.id }, h);
    }
    function viewAt(it) {
      if (!map || !it.pin) { return; }
      viewPoint(it.lat, it.lng, Math.max(map.getZoom(), 15));
    }
    function viewPoint(lat, lng, z) {
      var W = stage.clientWidth, H = stage.clientHeight, top = 172, xv = W / 2, yv = H / 2;
      if (!sheet.hidden) {
        if (isWide()) { xv = (W - 340 - 82) / 2; yv = (top + H - 150) / 2; } else { yv = (top + H - sheet.offsetHeight) / 2; }
      }
      var p = map.project([lat, lng], z).add([Math.round(W / 2 - xv), Math.round(H / 2 - yv)]);
      map.setView(map.unproject(p, z), z);
    }
    function select(id, opt) {
      var it = byId[id];
      if (!it) { return; }
      opt = opt || {};
      if (!it.pin) { openRow(it, true); return; }
      var ids = courseIds();
      var back = ids && ids.indexOf(id) !== -1 ? (S.panel.type === "item" ? S.back : S.panel) : null;
      var pk = S.panel && S.panel.type === "pick" ? S.panel : S.panel && S.panel.type === "item" && S.back && S.back.type === "pick" ? S.back : null;
      if (!back && pk && pk.ids.indexOf(id) !== -1) { back = pk; }
      if (!visSet[id]) { clearFilters(); }
      S.back = back;
      openItem(it, opt.label);
      pinClass(id, "is-sel", true);
      if (map) { iconOf(unitOf[it.id]).setZIndexOffset(2000); if (kidOf[it.id] && icons[kidOf[it.id].key]) { icons[kidOf[it.id].key].setZIndexOffset(2000); } }
      viewAt(it);
      if (cards[id]) {
        cards[id].classList.add("is-sel");
        if (!opt.fromRail) { rail.scrollTo({ left: cards[id].offsetLeft - 12, behavior: "smooth" }); }
      }
      if (S.rings) { drawRings(); }
      if (T && T.step === 3) { setTimeout(function () { if (T && T.step === 3 && !sheet.hidden) { tutGo(4); } }, 350); }
    }
    function openHint(cs) {
      var list = cs.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      showPanel({ type: "hint", key: cs.key }, headHTML("#e39b00", "walk", "周遊のヒント", cs.label) +
        '<p class="c-course-t">' + esc(cs.text) + '</p><div class="c-near"><p class="c-near-h">入っている場所</p><ul>' + list.map(function (it) {
          return '<li><button type="button" data-act="select" data-id="' + it.id + '" style="--c:' + CATS[it.cat].color + '"><span class="c-near-dot"></span><span class="c-near-name">' + esc(it.name) + "</span></button></li>";
        }).join("") + "</ul></div>" +
        '<button type="button" class="c-btn" data-act="adopt" data-ids="' + cs.ids.join(",") + '">' + icon("flag") + list.length + "か所を自分のコースに入れる</button>");
    }

    function openRow(it, scroll) {
      var r = rowEl[it.id];
      if (!r) { return; }
      if (r.hidden) { clearFilters(); }
      var g = r.closest(".c-grp");
      if (g && !g.open) { g.open = true; }
      var more = $(".c-row-more", r), btn = $(".c-row-btn", r);
      if (more.hidden) {
        more.innerHTML = detailHTML(it, "list");
        more.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        r.classList.add("is-open");
        paintFavs();
        paintWent();
      }
      if (scroll) {
        r.scrollIntoView({ behavior: "smooth", block: "start" });
        flash(r);
      }
    }
    function toggleRow(it) {
      var r = rowEl[it.id], more = $(".c-row-more", r);
      if (more.hidden) { openRow(it, false); return; }
      more.hidden = true;
      more.innerHTML = "";
      $(".c-row-btn", r).setAttribute("aria-expanded", "false");
      r.classList.remove("is-open");
    }

    function stopsOf(ids) { return ids.map(function (id) { return byId[id]; }).filter(function (it) { return it && it.pin; }); }
    function routePoints(stops, own) {
      var pts = [];
      if (own && S.startHere && pos) { pts.push({ lat: pos.lat, lng: pos.lng, me: true }); }
      return pts.concat(stops);
    }
    function legText(m) { return fmtDist(m) + "・徒歩" + walkMin(m) + "分"; }
    function gmapsLinks(stops, own) {
      var Q = (own && S.startHere ? ["me"] : []).concat(stops.map(function (s) { return s.approx ? encodeURIComponent(mapsQuery(s)) : s.lat + "," + s.lng; }));
      var links = [];
      if (!stops.length) { return links; }
      if (Q.length === 1) { Q = ["me"].concat(Q); }
      var shift = Q[0] === "me" ? 0 : 1;
      for (var i = 0; i < Q.length - 1; i += 10) {
        var seg = Q.slice(i, i + 11);
        var o = seg[0], d = seg[seg.length - 1], w = seg.slice(1, -1);
        links.push({
          url: "https://www.google.com/maps/dir/?api=1" + (o === "me" ? "" : "&origin=" + o) + "&destination=" + d +
            (w.length ? "&waypoints=" + w.join("%7C") : "") + "&travelmode=walking",
          label: (o === "me" ? "現在地" : (i + shift) + "か所目") + "から" + (i + seg.length - 1 + shift) + "か所目まで",
        });
      }
      return links;
    }
    function openCourse(shared, refit) {
      var own = !shared;
      var ids = own ? favs : shared;
      var keep = S.panel && S.panel.type === (own ? "course" : "shared") ? sheet.scrollTop : 0;
      var stops = stopsOf(ids);
      var nomap = ids.map(function (id) { return byId[id]; }).filter(function (it) { return it && !it.pin; });
      var h = headHTML(ink, "flag", own ? "保存した場所を順番に回る" : "共有されたコース", own ? "自分のコース" : "コースの見本");
      if (!own) {
        h += '<p class="c-shared">共有されたコースを表示しています。自分のコースに入れると、並べ替えや印刷ができます。</p>' +
          '<button type="button" class="c-btn" data-act="adopt" data-ids="' + ids.join(",") + '">' + icon("flag") + "自分のコースに入れる</button>";
      }
      if (!ids.length) {
        h += '<p class="c-empty">まだ場所が入っていません。各スポットの「コースに入れる」を押すと、押した順に並び、地図に番号と道順の線が出ます。</p>';
        if (own && COURSES.length) {
          h += '<p class="c-filt-h">周遊のヒント</p><div class="c-filt-chips">' + COURSES.map(function (c) {
            return '<button type="button" class="c-chip is-course" data-act="hint" data-key="' + c.key + '" aria-pressed="false">' + icon("walk") + esc(c.label) + "</button>";
          }).join("") + "</div>";
        }
      }
      if (stops.length) {
        if (own) {
          h += '<button type="button" class="c-sh-ring c-start" data-act="start" aria-pressed="' + (S.startHere ? "true" : "false") + '">' + icon("locate") + "現在地から出発する</button>";
        }
        var pts = routePoints(stops, own), total = 0;
        h += '<ol class="c-route">';
        pts.forEach(function (p, i) {
          if (i > 0) {
            var m = meters(pts[i - 1], p);
            total += m;
            h += '<li class="c-leg">' + legText(m) + "</li>";
          }
          if (p.me) {
            h += '<li class="c-stop is-me"><span class="c-stop-n">' + icon("locate") + '</span><span class="c-stop-main"><span class="c-stop-name">現在地</span></span></li>';
            return;
          }
          var n = stops.indexOf(p) + 1;
          h += '<li class="c-stop"><span class="c-stop-n">' + n + '</span><span class="c-stop-main">' +
            '<button type="button" class="c-stop-name" data-act="select" data-id="' + p.id + '">' + esc(p.name) + "</button>" +
            (went[p.id] ? '<span class="c-stop-went">行った ' + md(went[p.id]) + "</span>" : "") + "</span>";
          if (own) {
            h += '<span class="c-stop-tools">' +
              '<button type="button" data-act="up" data-id="' + p.id + '" aria-label="' + esc(p.name) + 'を1つ前へ"' + (n === 1 ? " disabled" : "") + ">" + icon("up") + "</button>" +
              '<button type="button" data-act="down" data-id="' + p.id + '" aria-label="' + esc(p.name) + 'を1つ後ろへ"' + (n === stops.length ? " disabled" : "") + ">" + icon("down") + "</button>" +
              '<button type="button" data-act="unfav" data-id="' + p.id + '" aria-label="' + esc(p.name) + 'をコースから外す">' + icon("close") + "</button></span>";
          }
          h += "</li>";
        });
        h += "</ol>";
        if (pts.length > 1) {
          h += '<p class="c-route-total">合計 <b>' + fmtDist(total) + "</b>・徒歩 <b>" + walkMin(total) + "</b>分" +
            "<span>直線距離から出した目安です。実際の道のりは長くなります。</span></p>";
        }
        if (own && S.startHere && !pos) { h += '<p class="c-note">現在地を取得すると、出発地点に入ります。</p>'; }
        var links = gmapsLinks(stops, own);
        h += '<div class="c-route-go">' + links.map(function (l) {
          return '<a class="c-btn is-main" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + icon("route") +
            "Googleマップで道順を見る" + (links.length > 1 ? "（" + l.label + "）" : "") + "</a>";
        }).join("") + "</div>";
        h += '<p class="c-note">Googleマップは、1回の案内で経由地を9か所まで扱えます。スマホのブラウザで開くと、経由地が3か所までになることがあります。</p>';
      } else if (ids.length) {
        h += '<p class="c-empty">地図に位置がある場所を入れると、道順と距離が出ます。</p>';
      }
      if (own && ids.length) {
        h += '<div class="c-route-acts"><button type="button" class="c-btn" data-act="print">' + icon("print") + "おでかけメモを印刷</button>" +
          '<button type="button" class="c-btn" data-act="sharecourse">' + icon("share") + "コースを共有</button></div>";
      }
      if (nomap.length) {
        h += '<div class="c-near"><p class="c-near-h">地図に位置がないため、道順に入れていない場所</p><ul>' + nomap.map(function (it) {
          return '<li><button type="button" data-act="index" data-id="' + it.id + '" style="--c:' + CATS[it.cat].color + '"><span class="c-near-dot"></span><span class="c-near-name">' + esc(it.name) + "</span></button>" +
            (own ? '<button type="button" class="c-link" data-act="unfav" data-id="' + it.id + '">外す</button>' : "") + "</li>";
        }).join("") + "</ul></div>";
      }
      showPanel(own ? { type: "course" } : { type: "shared", ids: ids }, h);
      if (refit === false) { sheet.scrollTop = keep; } else { fitTo(routePoints(stops, own)); }
    }
    function refreshCourse() {
      if (S.panel && S.panel.type === "course") { openCourse(null, false); } else { drawCourse(); }
    }
    function drawCourse() {
      if (!map) { return; }
      courseLayer.clearLayers();
      pins.forEach(function (it) { paintPin(it.id); });
      var cp = coursePanel();
      if (!cp) { return; }
      var stops = stopsOf(courseIds());
      var line = routePoints(stops, cp.type === "course").map(function (p) { return [p.lat, p.lng]; });
      if (line.length > 1) {
        L.polyline(line, { color: "#fff", weight: 8, opacity: 0.85, lineCap: "round", lineJoin: "round", interactive: false }).addTo(courseLayer);
        L.polyline(line, { color: ink, weight: 4, opacity: 0.9, dashArray: "1 10", lineCap: "round", interactive: false }).addTo(courseLayer);
      }
      stops.forEach(function (it, i) {
        L.marker([it.lat, it.lng], {
          icon: L.divIcon({ className: "c-num", html: "<span>" + (i + 1) + "</span>", iconSize: [24, 24], iconAnchor: [-6, 30] }),
          interactive: false, keyboard: false, zIndexOffset: 2500,
        }).addTo(courseLayer);
      });
    }
    function toggleFav(id) {
      var i = favs.indexOf(id);
      if (i === -1) { favs.push(id); toast("コースに入れました（" + favs.length + "か所目）"); } else { favs.splice(i, 1); toast("コースから外しました"); }
      store.set(KEY.fav, favs);
      paintFavs();
      refreshCourse();
    }
    function moveFav(id, d) {
      var stopIds = stopsOf(favs).map(function (it) { return it.id; });
      var tgt = stopIds[stopIds.indexOf(id) + d];
      var i = favs.indexOf(id), j = favs.indexOf(tgt);
      if (i === -1 || !tgt) { return; }
      favs[i] = tgt;
      favs[j] = id;
      store.set(KEY.fav, favs);
      refreshCourse();
      var b = $('[data-act="' + (d < 0 ? "up" : "down") + '"][data-id="' + id + '"]', sheet);
      if (!b || b.disabled) { b = $('[data-act="select"][data-id="' + id + '"]', sheet); }
      if (b) { b.focus(); }
    }
    function paintFavs() {
      $$('[data-act="fav"]').forEach(function (b) {
        var on = favs.indexOf(b.getAttribute("data-id")) !== -1;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        var t = $("span", b);
        if (t) { t.textContent = on ? "コースに入っています" : "コースに入れる"; }
      });
      $(".c-stat-course").textContent = favs.length;
      $(".c-course-n", legend).textContent = favs.length;
    }

    function grpCount(g) { return { all: g.n, n: g.ids.filter(function (id) { return went[id]; }).length }; }
    function paintWent() {
      $$('[data-act="went"]').forEach(function (b) {
        var d = went[b.getAttribute("data-id")];
        b.setAttribute("aria-pressed", d ? "true" : "false");
        var t = $("span", b);
        if (t) { t.textContent = d ? "行った " + md(d) : "行った"; }
      });
      Object.keys(cards).forEach(function (id) { $(".c-card-went", cards[id]).hidden = !went[id]; });
      pins.forEach(function (it) { pinClass(it.id, "is-went", !!went[it.id]); });
      Object.keys(rowEl).forEach(function (id) {
        var s = $(".c-row-went", rowEl[id]);
        var on = !!went[id];
        if (s.hidden === on) { s.hidden = !on; }
        if (on) { s.textContent = "行った " + md(went[id]); }
      });
      groups.forEach(function (g) {
        var el = grpEl[g.area], c = grpCount(g);
        $(".c-grp-prog b", el).textContent = c.n;
        $(".c-grp-bar i", el).style.width = (c.all ? Math.round(c.n / c.all * 100) : 0) + "%";
        el.classList.toggle("is-done", c.all > 0 && c.n === c.all);
      });
      $(".c-stat-went").textContent = Object.keys(went).filter(function (id) { return byId[id]; }).length;
    }
    function toggleWent(id) {
      var it = byId[id];
      if (went[id]) {
        delete went[id];
        toast("「行った」の記録を外しました");
      } else {
        went[id] = today();
        var msg = "行った日を記録しました（" + md(went[id]) + "）";
        var g = groups.filter(function (x) { return x.area === gkey(it); })[0];
        if (g) {
          var c = grpCount(g);
          if (c.all > 1 && c.n === c.all) { msg = g.label + "の" + c.all + "か所をすべて回りました"; }
        }
        toast(msg);
      }
      store.set(KEY.went, went);
      paintWent();
      refreshCourse();
    }

    function setBase(kind, keep) {
      S.base = okBase(kind);
      if (keep !== false) { store.set(KEY.base, S.base); }
      if (map && S.base !== baseNow) { setBaseLayer(map, S.base); baseNow = S.base; }
      stage.setAttribute("data-base", S.base);
      $$('[data-act="base"]', baseMenu).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-base") === S.base ? "true" : "false"); });
      saveHash();
    }
    function menu(el, on) {
      if (!el || el === baseMenu) { return; }
      el.hidden = !on;
      var btn = el === legend ? $(".c-filterbtn", topBar) : el === trMenu ? $('[data-act="trmenu"]') : $('[data-act="basemenu"]');
      if (btn) { btn.setAttribute("aria-expanded", on ? "true" : "false"); }
    }

    var trMenu = $(".c-trmenu");
    var TR = null, trBusy = false, TR_KEYS = ["l", "s", "b"], ST_ZOOM = 14, BUS_ZOOM = 15, LBL_ZOOM = 15;
    var trOn = store.get(KEY.tr, {});
    if (!trOn || typeof trOn !== "object" || Array.isArray(trOn)) { trOn = {}; }
    var trLine = null, trSt = [], trBus = [], trStG = null, trBusG = null, trLblG = null, trAttr = false;
    function trAny() { return TR_KEYS.some(function (k) { return !!trOn[k]; }); }
    function trLL(y, x) { return L.latLng((TR.o[0] + y) / 1e5, (TR.o[1] + x) / 1e5); }
    function trLoad(done) {
      if (TR) { done(); return; }
      if (!map || trBusy) { return; }
      trBusy = true;
      fetch(BASE + "tr.json").then(function (r) { if (!r.ok) { throw new Error("tr"); } return r.json(); }).then(function (j) {
        TR = j;
        trBusy = false;
        trBuild();
        done();
      }, function () { trBusy = false; toast("鉄道とバス停のデータを読み込めませんでした"); });
    }
    function trBuild() {
      ["itbxTrL", "itbxTrP", "itbxTrT"].forEach(function (name, k) {
        var pane = map.createPane(name);
        pane.style.zIndex = [350, 450, 460][k];
        if (k !== 1) { pane.style.pointerEvents = "none"; }
      });
      var lineR = L.canvas({ pane: "itbxTrL", padding: 0.5 }), ptR = L.canvas({ pane: "itbxTrP", padding: 0.3, tolerance: 5 });
      var under = [], over = [];
      TR.g.forEach(function (a) {
        var ln = TR.L[a[0]], y = a[1], x = a[2], ll = [trLL(y, x)];
        for (var i = 3; i < a.length; i += 2) { y += a[i]; x += a[i + 1]; ll.push(trLL(y, x)); }
        under.push(L.polyline(ll, { renderer: lineR, color: "#ffffff", weight: 6.5, opacity: 0.8, interactive: false, lineCap: "round", lineJoin: "round" }));
        over.push(L.polyline(ll, { renderer: lineR, color: ln[1], weight: 3.5, opacity: 1, interactive: false, dashArray: ln[2] ? "8 6" : null, lineCap: ln[2] ? "butt" : "round", lineJoin: "round" }));
      });
      trLine = L.layerGroup(under.concat(over));
      trStG = L.layerGroup().addTo(map);
      trBusG = L.layerGroup().addTo(map);
      trLblG = L.layerGroup().addTo(map);
      trSt = TR.s.map(function (s) {
        var ll = trLL(s[1], s[2]), names = [];
        s[3].forEach(function (k) { if (names.indexOf(TR.L[k][0]) === -1) { names.push(TR.L[k][0]); } });
        var m = L.circleMarker(ll, { renderer: ptR, radius: 6, color: "#1f2a24", weight: 2.5, fillColor: "#ffffff", fillOpacity: 1, bubblingMouseEvents: false });
        m.bindTooltip("<b>" + esc(s[0]) + (s[4] ? "停留場" : "駅") + "</b><br>" + esc(names.join("、")), { direction: "top", offset: [0, -7], className: "c-tr-tip" });
        var lb = L.marker(ll, { pane: "itbxTrT", interactive: false, keyboard: false,
          icon: L.divIcon({ className: "c-tr-lbl", html: "<span>" + esc(s[0]) + "</span>", iconSize: [0, 0] }) });
        return { ll: ll, m: m, lb: lb };
      });
      trBus = TR.b.map(function (s) { return { ll: trLL(s[1], s[2]), s: s, m: null }; });
      trBus.forEach(function (o) {
        o.make = function () {
          var s = o.s, ops = (s[3] || []).map(function (k) { return TR.bo[k]; }), rts = (s[4] || []).map(function (k) { return TR.br[k]; });
          var m = L.circleMarker(o.ll, { renderer: ptR, radius: 4.5, color: "#ffffff", weight: 1.5, fillColor: "#c2410c", fillOpacity: 1, bubblingMouseEvents: false });
          m.bindTooltip("<b>" + esc(TR.bn[s[0]]) + "</b>（バス停）" + (ops.length ? "<br>" + esc(ops.join("、")) : "") +
            (rts.length ? '<br><span class="c-tr-rts">' + esc(rts.join("、")) + (s[5] ? "ほか" + s[5] + "系統" : "") + "</span>" : ""), { direction: "top", offset: [0, -5], className: "c-tr-tip" });
          return m;
        };
      });
      map.on("moveend", trSync);
      map.on("resize", trAttrH);
    }
    function trPut(list, key, on, b, group) {
      list.forEach(function (o) {
        var want = on && b.contains(o.ll), m = o[key];
        if (want) {
          if (!m) { m = o[key] = o.make(); }
          if (!group.hasLayer(m)) { group.addLayer(m); }
        } else if (m && group.hasLayer(m)) {
          group.removeLayer(m);
        }
      });
    }
    function trSync() {
      if (!TR || !map) { return; }
      var z = map.getZoom(), b = map.getBounds().pad(0.3);
      var st = !!trOn.s && z >= ST_ZOOM, bus = !!trOn.b && z >= BUS_ZOOM;
      if (trOn.l && !map.hasLayer(trLine)) { trLine.addTo(map); }
      if (!trOn.l && map.hasLayer(trLine)) { map.removeLayer(trLine); }
      trPut(trSt, "m", st, b, trStG);
      trPut(trSt, "lb", st && z >= LBL_ZOOM, b, trLblG);
      trPut(trBus, "m", bus, b, trBusG);
      map.getPane("itbxTrP").style.pointerEvents = st || bus ? "" : "none";
      var any = trAny();
      if (any !== trAttr) {
        if (any) { map.attributionControl.addAttribution(TR.src); } else { map.attributionControl.removeAttribution(TR.src); }
        trAttr = any;
        trAttrH();
      }
    }
    function trAttrH() {
      var ac = map.attributionControl && map.attributionControl.getContainer(), h = ac ? ac.offsetHeight : 0;
      stage.style.setProperty("--attrh", (h > 18 ? h : 14) + "px");
    }
    function trPaint() {
      $$('[data-act="tr"]', trMenu || root).forEach(function (b) { b.setAttribute("aria-pressed", trOn[b.getAttribute("data-k")] ? "true" : "false"); });
      var btn = $('[data-act="trmenu"]');
      if (btn) { btn.classList.toggle("is-on", trAny()); }
    }
    function trToggle(k) {
      trOn[k] = !trOn[k];
      store.set(KEY.tr, trOn);
      trPaint();
      if (!trOn[k]) { trSync(); return; }
      trLoad(function () {
        trSync();
        var z = map.getZoom();
        if (k === "s" && z < ST_ZOOM) { toast("駅は、地図を拡大すると表示されます"); }
        if (k === "b" && z < BUS_ZOOM) { toast("バス停は、地図をさらに拡大すると表示されます"); }
      });
    }

    var drawing = false;
    function omikuji() {
      if (drawing) { return; }
      var list = pins.filter(function (it) { return visSet[it.id] && it.id !== selId() && !statusOf(it); });
      if (S.rings && origin) { list = list.filter(function (it) { return meters(origin, it) <= 1600; }); }
      if (!list.length) { toast(S.rings ? "徒歩20分圏の中に、選べる場所がありません" : "地図に出ている場所がありません"); return; }
      var pick = list[Math.floor(Math.random() * list.length)];
      var lab = S.rings ? "おみくじで選んだ行き先（徒歩20分圏から）" : "おみくじで選んだ行き先（地図に出ている場所から）";
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (calm || list.length < 2) { select(pick.id, { label: lab }); return; }
      drawing = true;
      var i = 0, last = null;
      var t = setInterval(function () {
        if (last) { pinClass(last, "is-hot", false); }
        if (i >= 9) {
          clearInterval(t);
          drawing = false;
          select(pick.id, { label: lab });
          return;
        }
        last = list[(Math.floor(Math.random() * list.length) + i) % list.length].id;
        pinClass(last, "is-hot", true);
        i++;
      }, 90);
    }

    function stateObj(full) {
      var st = {};
      if (S.q.trim()) { st.q = S.q.trim(); }
      if (S.area) { st.a = S.area; }
      if (S.town) { st.t = S.town; }
      if (S.tag) { st.g = S.tag; }
      if (S.presets.length) { st.p = S.presets.slice(); }
      if (S.hint) { st.h = S.hint; }
      if (S.hidden.length) { var pu = purpsOn().map(function (p) { return p.key; }); if (pu.length) { st.u = pu; } else { st.x = S.hidden.slice(); } }
      if (S.kind) { st.y = S.kind; }
      if (S.cond) { st.c = S.cond; }
      if (S.base !== "photo") { st.b = S.base; }
      if (full) {
        if (S.rings) { st.r = 1; }
        if (selId()) { st.s = selId(); }
      }
      return st;
    }
    function hashOf(st) { return Object.keys(st).length ? "#c=" + encodeURIComponent(JSON.stringify(st)) : ""; }
    function saveHash() {
      if (!ready) { return; }
      var h = hashOf(stateObj(false));
      if (!h && location.hash.indexOf("#c=") !== 0) { return; }
      try { window.history.replaceState(null, "", location.pathname + location.search + h); } catch (e) {}
    }
    function readHash() {
      if (location.hash.indexOf("#c=") !== 0) { return null; }
      try {
        var o = JSON.parse(decodeURIComponent(location.hash.slice(3)));
        return o && typeof o === "object" ? o : null;
      } catch (e) { return null; }
    }
    function shareUrl(st) { return location.href.split("#")[0] + hashOf(st); }

    function setText(n) {
      S.text = n === 2 ? 2 : 1;
      store.set(KEY.text, S.text);
      root.classList.toggle("is-large", S.text === 2);
      $$('[data-act="text"]').forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-size")) === S.text ? "true" : "false"); });
      fitPlaceholder();
    }

    function printMemo() {
      var stops = stopsOf(favs);
      var nomap = favs.map(function (id) { return byId[id]; }).filter(function (it) { return it && !it.pin; });
      var list = stops.concat(nomap);
      if (!list.length) { return; }
      var box = document.getElementById(P + "-print");
      if (!box) { box = document.createElement("div"); box.id = P + "-print"; document.body.appendChild(box); }
      var d = new Date(), pts = routePoints(stops, true), total = 0;
      for (var i = 1; i < pts.length; i++) { total += meters(pts[i - 1], pts[i]); }
      var html = "<h1>おでかけメモ</h1><p class=\"p-date\">" + d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日に印刷" +
        (pts.length > 1 ? "\u3000合計 " + fmtDist(total) + "・徒歩" + walkMin(total) + "分（直線距離から出した目安）" : "") + "</p>";
      list.forEach(function (it, k) {
        var lines = [];
        if (it.addr) { lines.push("所在地：" + it.addr); }
        var fee = spec(it, ["料金"]), tm = spec(it, ["時間", "時間・休み"]), off = spec(it, ["休み"]), tel = firstTel(it);
        if (fee) { lines.push("料金：" + fee); }
        if (tm) { lines.push("時間：" + tm); }
        if (off) { lines.push("休み：" + off); }
        if (tel) { lines.push(tel[0] + "：" + tel[1]); }
        if (went[it.id]) { lines.push("行った日：" + went[it.id].replace(/-/g, "/")); }
        var next = k < stops.length - 1 ? stops[k + 1] : null;
        if (next) { lines.push("次の場所まで " + legText(meters(it, next))); }
        html += '<div class="p-row"><div class="p-no">' + (it.pin ? k + 1 : "") + '</div><div class="p-box"></div><div><p class="p-name">' + esc(it.name) + "</p>" +
          lines.map(function (l) { return '<p class="p-line">' + esc(l) + "</p>"; }).join("") + "</div></div>";
      });
      box.innerHTML = html;
      var doc = document.documentElement;
      doc.classList.add("itbM-printing");
      var done = function () { doc.classList.remove("itbM-printing"); window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      window.print();
      setTimeout(done, 1500);
    }

    function full(on) {
      stage.classList.toggle("is-full", on);
      $$('[data-act="full"]').forEach(function (b) {
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.setAttribute("aria-label", on ? "地図を元の大きさに戻す" : "地図を大きく表示");
        b.innerHTML = icon(on ? "shrink" : "expand");
      });
      document.documentElement.style.overflow = on ? "hidden" : "";
      if (map) { setTimeout(function () { map.invalidateSize(); }, 60); }
    }
    var heading = null, headAcc = 0, headOn = false, headRaf = 0;
    function screenAngle() {
      var o = window.screen && window.screen.orientation;
      if (o && typeof o.angle === "number") { return o.angle; }
      return typeof window.orientation === "number" ? window.orientation : 0;
    }
    function onOrient(e) {
      var h = null;
      if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) { h = e.webkitCompassHeading; }
      else if (e.absolute && typeof e.alpha === "number") { h = 360 - e.alpha; }
      if (h === null) { return; }
      heading = ((h + screenAngle()) % 360 + 360) % 360;
      if (!headRaf) { headRaf = window.requestAnimationFrame(paintHeading); }
    }
    function paintHeading() {
      headRaf = 0;
      var el = me && me.getElement(), c = el && el.querySelector(".c-me-cone");
      if (!c || heading === null) { return; }
      headAcc += ((heading - headAcc) % 360 + 540) % 360 - 180;
      el.classList.add("has-dir");
      c.style.transform = "rotate(" + headAcc.toFixed(1) + "deg)";
    }
    function listenHeading() {
      if (headOn) { return; }
      headOn = true;
      window.addEventListener("ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", onOrient);
    }
    function startHeading(quiet) {
      var D = window.DeviceOrientationEvent;
      if (headOn || !D) { return; }
      if (typeof D.requestPermission !== "function") { listenHeading(); return; }
      D.requestPermission().then(function (r) {
        if (r === "granted") { listenHeading(); } else if (!quiet) { toast("向きを出すには、「動きと方向」へのアクセスを許可してください"); }
      }, function () {});
    }
    function locateMe(quiet) {
      if (!navigator.geolocation) { toast("このブラウザでは現在地を取得できません"); return; }
      startHeading(quiet);
      navigator.geolocation.getCurrentPosition(function (p) {
        pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        if (map) {
          if (me) { me.setLatLng([pos.lat, pos.lng]); } else {
            me = L.marker([pos.lat, pos.lng], { icon: L.divIcon({ className: "c-me", html: '<span class="c-me-cone"></span><span class="c-me-dot"></span>', iconSize: [16, 16] }),
              title: "現在地", zIndexOffset: 3000, keyboard: false, interactive: false }).addTo(map);
            me.on("add", paintHeading);
          }
          paintHeading();
          if (!quiet) { map.setView([pos.lat, pos.lng], CFG.meZoomOut != null ? map.getMaxZoom() - CFG.meZoomOut : 14); }
        }
        if (S.rings) { drawRings(); } else { buildRail(); }
        if (!quiet) { toast("現在地を表示しました"); }
        refreshCourse();
      }, function () { toast("現在地を取得できませんでした。ブラウザで位置情報の利用を許可してください。"); },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
    }

    function searchOpen(on, refocus) {
      if (on === !searchBox.hidden) { return; }
      searchBox.hidden = !on;
      topBar.classList.toggle("is-search", on);
      searchBtn.setAttribute("aria-expanded", on ? "true" : "false");
      searchBtn.setAttribute("aria-label", on ? "検索を閉じる" : "名前・駅・やりたいことで探す");
      if (on) { fitPlaceholder(); qIn.focus(); } else if (refocus) { searchBtn.focus(); }
    }
    function paintSearch() { searchBtn.classList.toggle("is-on", !!S.q); }

    var SNS = {
      line: function (t, u) { return "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(u); },
      x: function (t, u) { return "https://x.com/intent/post?text=" + encodeURIComponent(t) + "&url=" + encodeURIComponent(u); },
      facebook: function (t, u) { return "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(u); },
      threads: function (t, u) { return "https://www.threads.com/intent/post?text=" + encodeURIComponent(t + " " + u); },
      bluesky: function (t, u) { return "https://bsky.app/intent/compose?text=" + encodeURIComponent(t + " " + u); },
      hatena: function (t, u) { return "https://b.hatena.ne.jp/add?mode=confirm&url=" + encodeURIComponent(u) + "&title=" + encodeURIComponent(t); },
    };
    var MAP_NAME = CFG.mapName, shareNow = null;
    function shareOpen(anchor, label, text, url, byKey) {
      if (shareNow && shareNow.anchor === anchor) { shareClose(); return; }
      shareClose();
      shareNow = { anchor: anchor, text: text, url: url };
      $(".c-sharemenu-t", shareMenu).textContent = label;
      $$(".c-sns", shareMenu).forEach(function (a) { a.href = SNS[a.getAttribute("data-sns")](text, url); });
      $('[data-act="sharenative"]', shareMenu).hidden = !navigator.share;
      var box = anchor.closest(".c-stage") || root;
      if (shareMenu.parentNode !== box) { box.appendChild(shareMenu); }
      shareMenu.hidden = false;
      var br = box.getBoundingClientRect(), ar = anchor.getBoundingClientRect();
      var mw = shareMenu.offsetWidth, mh = shareMenu.offsetHeight, gap = 8;
      var left = Math.min(Math.max(gap, ar.right - br.left - mw), br.width - mw - gap);
      var top = ar.bottom - br.top + gap;
      if (top + mh > br.height - gap && ar.top - br.top - gap - mh >= gap) { top = ar.top - br.top - gap - mh; }
      top = Math.max(gap, Math.min(top, br.height - mh - gap));
      shareMenu.style.left = left + "px";
      shareMenu.style.top = top + "px";
      if (anchor.hasAttribute("aria-expanded")) { anchor.setAttribute("aria-expanded", "true"); }
      if (byKey) { $(".c-sns", shareMenu).focus(); }
    }
    function shareClose(refocus) {
      if (!shareNow) { return; }
      var a = shareNow.anchor;
      shareNow = null;
      shareMenu.hidden = true;
      if (a.hasAttribute("aria-expanded")) { a.setAttribute("aria-expanded", "false"); }
      if (refocus && document.contains(a)) { a.focus(); }
    }
    document.addEventListener("click", function (e) { if (shareNow && !root.contains(e.target)) { shareClose(); } });

    var guide = $(".c-guide"), tut = $(".c-tut"), tagHint = $(".c-taghint"), tagHintTimer = 0, T = null;
    function guideOpen(on) {
      if (!guide) { return; }
      var tg = $('[data-act="guide"]', guide);
      $(".c-guide-body", guide).hidden = !on;
      guide.classList.toggle("is-closed", !on);
      tg.setAttribute("aria-expanded", on ? "true" : "false");
      tg.setAttribute("aria-label", on ? "使い方の案内を閉じる" : "使い方の案内を開く");
      $("span", tg).textContent = on ? "閉じる" : "開く";
    }
    function paintTry() {
      var t = guide && $(".c-guide-try-t", guide);
      if (t) { t.textContent = store.get(KEY.tut, 0) ? "もう一度試す" : "30秒で試す"; }
    }
    function hideTagHint() { if (tagHint) { tagHint.hidden = true; } clearTimeout(tagHintTimer); }
    function showTagHint() {
      if (!tagHint || T || store.get(KEY.taghint, 0) || S.panel || !searchBox.hidden) { return; }
      store.set(KEY.taghint, 1);
      tagHint.hidden = false;
      tagHintTimer = setTimeout(hideTagHint, 9000);
    }
    var CATS_TUT = true;
    var TUT = [null,
      { no: 1, get: function () { return $('.c-purp[data-key="' + CFG.tutPurp + '"]', chips); },
        text: function () {
          var p = PURP[CFG.tutPurp];
          return "上の段の「" + p.label + "」を押してみてください。" + p.name + "だけが地図に出ます。もう一度押すと、すべての場所に戻ります。";
        } },
      { no: 1, get: function () { var c = $('.c-cond[data-key="' + CFG.tutCond + '"]', condsEl); return c && !c.hidden ? c : null; },
        text: function () { return "下の段の「" + PRESET[CFG.tutCond].label + "」を押してみてください。" + PURP[CFG.tutPurp].name + "のうち、" + PRESET[CFG.tutCond].say + "だけが残ります。"; } },
      { no: 2, get: function () { return $(".c-card", rail) || $(".c-map"); },
        text: function () { return ($(".c-card", rail) ? "下のカード" : "地図のピン") + "を押してみてください。住所や営業時間などの詳しい情報が開きます。"; } },
      { no: 3, get: function () { return sheet.hidden ? null : $(".c-item-acts", sheet); }, block: true,
        text: function () { return "行きたい場所は「コースに入れる」でまとめられます。「共有」を押すと、LINEなどで送れます。"; } },
    ];
    function tutStart() {
      if (T) { return; }
      if (!map) { toast("地図を表示できないため、試せません"); return; }
      shareClose();
      searchOpen(false);
      menu(legend, false);
      menu(trMenu, false);
      hideTagHint();
      T = { step: 0, snap: stateObj(false), rings: S.rings, view: [map.getCenter(), map.getZoom()] };
      if (S.panel) { closePanel(); }
      if (S.rings) { setRings(false); }
      clearFilters();
      chips.scrollLeft = 0;
      if (condsEl) { condsEl.scrollLeft = 0; }
      toStage();
      tut.hidden = false;
      tutGo(1);
    }
    function tutGo(n) {
      if (!T) { return; }
      T.step = n;
      var st = TUT[n];
      if (n === 3) { rail.scrollLeft = 0; }
      if (CATS_TUT && (n === 1 || n === 2)) {
        var cc = st.get(), row = cc && cc.closest(".c-areas, .c-conds");
        if (row) {
          var ar = row.getBoundingClientRect(), cr = cc.getBoundingClientRect();
          if (cr.left < ar.left || cr.right > ar.right - 24) { row.scrollLeft += cr.left - ar.left - 8; }
        }
      }
      if (n === 4) {
        sheet.scrollTop = 0;
        var acts = $(".c-item-acts", sheet), hd = $(".c-sh-head", sheet);
        if (acts) {
          var shr = sheet.getBoundingClientRect(), ar = acts.getBoundingClientRect(), hh = hd ? hd.offsetHeight : 0;
          if (ar.bottom > shr.bottom - 8) { sheet.scrollTop += ar.top - shr.top - hh - 8; }
        }
      }
      var el = st.get();
      if (!el) { tutEnd(); return; }
      $(".c-tut-step", tut).textContent = st.no + "/3";
      $(".c-tut-text", tut).textContent = st.text();
      $('[data-act="tutdone"]', tut).hidden = !st.block;
      $(".c-tut-block", tut).hidden = !st.block;
      tutPlace();
      try { (st.block ? $('[data-act="tutdone"]', tut) : el).focus({ preventScroll: true }); } catch (e) {}
    }
    function tutPut(el, x, y, w, h) {
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.width = Math.max(0, w) + "px";
      el.style.height = Math.max(0, h) + "px";
    }
    function tutPlace() {
      if (!T || !T.step) { return; }
      var el = TUT[T.step].get();
      if (!el) { return; }
      var sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), pad = 6, W = sr.width, H = sr.height;
      var x1 = Math.max(0, r.left - sr.left - pad), y1 = Math.max(0, r.top - sr.top - pad);
      var x2 = Math.max(x1, Math.min(W, r.right - sr.left + pad)), y2 = Math.max(y1, Math.min(H, r.bottom - sr.top + pad));
      var d = $$(".c-tut-dim", tut);
      tutPut(d[0], 0, 0, W, y1);
      tutPut(d[1], 0, y2, W, H - y2);
      tutPut(d[2], 0, y1, x1, y2 - y1);
      tutPut(d[3], x2, y1, W - x2, y2 - y1);
      tutPut($(".c-tut-ring", tut), x1, y1, x2 - x1, y2 - y1);
      tutPut($(".c-tut-block", tut), x1, y1, x2 - x1, y2 - y1);
      var pop = $(".c-tut-pop", tut), pw = pop.offsetWidth, ph = pop.offsetHeight, g = 14;
      var top = y2 + g;
      if (top + ph > H - 8) { top = y1 - g - ph; }
      if (top < 8) { top = Math.max(8, Math.min(H - ph - 8, y2 + g)); }
      pop.style.left = Math.max(8, Math.min(x1, W - pw - 8)) + "px";
      pop.style.top = top + "px";
    }
    function tutEnd() {
      if (!T) { return; }
      var t = T;
      T = null;
      tut.hidden = true;
      menu(legend, false);
      closePanel();
      takeState(t.snap);
      apply(false);
      if (t.rings) { setRings(true); }
      map.setView(t.view[0], t.view[1], { animate: false });
      store.set(KEY.tut, 1);
      store.set(KEY.taghint, 1);
      paintTry();
      toast("地図を元の表示に戻しました");
      var tb = guide && !$(".c-guide-body", guide).hidden ? $('[data-act="tutorial"]', guide) : null;
      if (tb) { try { tb.focus({ preventScroll: true }); } catch (e) {} }
    }
    function tutRe() { if (T) { tutPlace(); } }
    window.addEventListener("resize", tutRe);
    [chips, rail, sheet, condsEl].forEach(function (el) { if (el) { el.addEventListener("scroll", tutRe, { passive: true }); } });
    if (window.ResizeObserver) { new ResizeObserver(tutRe).observe(stage); }

    var PH = [qIn.getAttribute("placeholder"), "名前や目的で探す"];
    function fitPlaceholder() {
      var fs = parseFloat(window.getComputedStyle(qIn).fontSize) || 16;
      qIn.setAttribute("placeholder", qIn.clientWidth < PH[0].length * fs ? PH[1] : PH[0]);
    }
    window.addEventListener("resize", debounce(fitPlaceholder, 150));
    qIn.addEventListener("input", debounce(function () { S.q = qIn.value; S.ws = words(S.q); apply(true); }, 180));
    qIn.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); qIn.blur(); } });
    areaSel.addEventListener("change", function () {
      var v = areaSel.value;
      S.area = v.indexOf("a:") === 0 ? v.slice(2) : "";
      S.town = v.indexOf("t:") === 0 ? v.slice(2) : "";
      if (S.town) { S.area = ""; }
      S.hint = null;
      if (S.panel && S.panel.type !== "item") { closePanel(); }
      apply(true);
    });
    function toStage() {
      if (stage.classList.contains("is-full")) { return; }
      var r = stage.getBoundingClientRect();
      if (r.top < -10 || r.bottom > window.innerHeight + 10) { stage.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
    root.addEventListener("click", function (e) {
      var tgt = e.target;
      if (shareNow) {
        if (tgt.closest(".c-sns")) { shareClose(); return; }
        if (!tgt.closest(".c-sharemenu") && tgt.closest("[data-act]") !== shareNow.anchor) { shareClose(); }
      }
      if (!searchBox.hidden && !qIn.value && !tgt.closest(".c-top")) { searchOpen(false); }
      if (tagHint && !tagHint.hidden && !tgt.closest(".c-taghint")) { hideTagHint(); }
      if (!legend.hidden && !tgt.closest(".c-legend") && !tgt.closest('[data-act="filters"]')) { menu(legend, false); }
      if (!baseMenu.hidden && !tgt.closest(".c-basemenu") && !tgt.closest('[data-act="basemenu"]')) { menu(baseMenu, false); }
      if (trMenu && !trMenu.hidden && !tgt.closest(".c-trmenu") && !tgt.closest('[data-act="trmenu"]')) { menu(trMenu, false); }
      var b = tgt.closest("[data-act]");
      if (!b || !root.contains(b)) { return; }
      var act = b.getAttribute("data-act"), id = b.getAttribute("data-id");
      if (act === "select") { select(id, { fromRail: b.classList.contains("c-card") }); }
      else if (act === "row") { toggleRow(byId[id]); }
      else if (act === "close") { closePanel(); }
      else if (act === "back") {
        var bk = S.back;
        if (bk && bk.type === "pick") { openPick(bk.ids, bk.kind); }
        else if (bk) { openCourse(bk.type === "course" ? null : bk.ids, true); }
      }
      else if (act === "clear") { clearFilters(); closePanel(); toast("条件を外しました"); }
      else if (act === "preset") {
        var key = b.getAttribute("data-key"), pi = S.presets.indexOf(key);
        if (pi === -1) { S.presets.push(key); } else { S.presets.splice(pi, 1); }
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(true);
        if (pi === -1) { toast(PRESET[key].say + "を表示しています"); }
        if (T && T.step === 2 && key === CFG.tutCond && pi === -1) { setTimeout(function () { if (T && T.step === 2) { menu(legend, false); tutGo(3); } }, 700); }
      }
      else if (act === "tag") {
        var t = b.getAttribute("data-tag"), ck = condOfTag(t);
        S.q = ""; S.ws = []; qIn.value = "";
        S.area = ""; S.town = ""; S.presets = []; S.hint = null; S.hidden = []; S.kind = ""; S.cond = "";
        if (ck) { S.tag = ""; S.cond = ck; } else { S.tag = t; }
        closePanel();
        apply(true);
        toStage();
        var nn = items.filter(function (it) { return visSet[it.id]; }).length;
        toast(ck ? condSay(ck, nn) : "「" + tagText(t) + "」のタグが付いた" + nn + "か所を表示しています");
      }
      else if (act === "cond") {
        var kk = b.getAttribute("data-key");
        S.cond = S.cond === kk ? "" : kk;
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        condToast();
        if (T && T.step === 2 && CATS_TUT && CONDS && kk === CFG.tutCond && S.cond === kk) { setTimeout(function () { if (T && T.step === 2) { tutGo(3); } }, 700); }
      }
      else if (act === "untag") { S.tag = ""; apply(true); }
      else if (act === "hint") {
        menu(legend, false);
        var hk = b.getAttribute("data-key");
        S.hint = S.hint === hk ? null : hk;
        S.area = ""; S.town = "";
        apply(true);
        if (S.hint) { openHint(hint()); fitTo(visible().filter(function (it) { return it.pin; })); } else { closePanel(); }
      }
      else if (act === "filters") {
        menu(legend, legend.hidden);
        if (T && T.step === 1 && !CATS_TUT && !legend.hidden) { setTimeout(function () { if (T && T.step === 1) { tutGo(2); } }, 200); }
      }
      else if (act === "filtclear") {
        S.presets = []; S.area = ""; S.town = ""; S.hint = null;
        if (S.panel && S.panel.type === "hint") { closePanel(); }
        apply(true);
      }
      else if (act === "purp") {
        var pp = PURP[b.getAttribute("data-key")];
        togglePurp(pp);
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        var onl = purpsOn();
        toast(onl.length ? onl.map(function (x) { return x.name; }).join("、") + "の" + countVis() + unitWord() + "を表示しています" : "すべての場所を表示しています");
        if (T && T.step === 1 && pp.key === CFG.tutPurp && purpOn(pp)) { setTimeout(function () { if (T && T.step === 1) { tutGo(2); } }, 700); }
      }
      else if (act === "purpall") {
        S.hidden = []; S.kind = ""; S.cond = "";
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        toast("すべての場所を表示しています");
      }
      else if (act === "course") {
        menu(legend, false);
        if (S.panel && S.panel.type === "course") { closePanel(); return; }
        if (filtering()) { clearFilters(); }
        toStage();
        openCourse(null, true);
      }
      else if (act === "fav") { toggleFav(id); }
      else if (act === "unfav") { if (favs.indexOf(id) !== -1) { toggleFav(id); } }
      else if (act === "up") { moveFav(id, -1); }
      else if (act === "down") { moveFav(id, 1); }
      else if (act === "start") {
        S.startHere = !S.startHere;
        store.set(KEY.start, S.startHere);
        if (S.startHere && !pos) { locateMe(true); }
        refreshCourse();
      }
      else if (act === "adopt") {
        var add = (b.getAttribute("data-ids") || "").split(",").filter(function (x) { return byId[x] && favs.indexOf(x) === -1; });
        favs = favs.concat(add);
        store.set(KEY.fav, favs);
        paintFavs();
        toast(add.length ? add.length + "か所をコースに入れました" : "すべてコースに入っています");
        if (S.hint) { S.hint = null; apply(false); }
        openCourse(null, true);
      }
      else if (act === "went") { toggleWent(id); }
      else if (act === "gotoindex") { $(".c-index").scrollIntoView({ behavior: "smooth", block: "start" }); }
      else if (act === "index") { openRow(byId[id], true); }
      else if (act === "basemenu") { menu(baseMenu, baseMenu.hidden); }
      else if (act === "base") { setBase(b.getAttribute("data-base")); menu(baseMenu, false); }
      else if (act === "trmenu") { menu(trMenu, trMenu.hidden); }
      else if (act === "tr") { trToggle(b.getAttribute("data-k")); }
      else if (act === "omikuji") { omikuji(); }
      else if (act === "search") { searchOpen(searchBox.hidden, true); }
      else if (act === "guide") {
        var gon = $(".c-guide-body", guide).hidden;
        guideOpen(gon);
        store.set(KEY.guide, gon ? 0 : 1);
      }
      else if (act === "guidebtns") {
        var gl = $(".c-guide-list", guide), gshow = gl.hidden;
        gl.hidden = !gshow;
        b.setAttribute("aria-expanded", gshow ? "true" : "false");
      }
      else if (act === "tutorial") { tutStart(); }
      else if (act === "tutskip" || act === "tutdone") { tutEnd(); }
      else if (act === "taghintx") { hideTagHint(); }
      else if (act === "sharemap") { shareOpen(b, "表示中の地図", MAP_NAME, shareUrl(stateObj(true)), e.detail === 0); }
      else if (act === "sharecourse") {
        var sc = { k: favs.slice(0, 30) };
        if (S.base !== "photo") { sc.b = S.base; }
        shareOpen(b, "自分のコース", "自分のコース｜" + MAP_NAME, shareUrl(sc), e.detail === 0);
      }
      else if (act === "shareclose") { shareClose(true); }
      else if (act === "sharecopy") {
        var su = shareNow ? shareNow.url : "";
        shareClose();
        if (su) { copy(su).then(function () { toast("リンクをコピーしました"); }, function () { toast("リンクをコピーできませんでした"); }); }
      }
      else if (act === "sharenative") {
        var sn = shareNow;
        shareClose();
        if (sn && navigator.share) { navigator.share({ title: sn.text, url: sn.url }).catch(function () {}); }
      }
      else if (act === "text") { setText(Number(b.getAttribute("data-size"))); }
      else if (act === "print") { printMemo(); }
      else if (act === "share") {
        var si = byId[id];
        if (si) { shareOpen(b, si.name, si.name + "｜" + MAP_NAME, pageUrl(P + "-" + id), e.detail === 0); }
      }
      else if (act === "rings" || act === "ringhere") { setRings(!S.rings); }
      else if (act === "locate") { locateMe(false); }
      else if (act === "full") { full(!stage.classList.contains("is-full")); }
      else if (act === "zin") { if (map) { map.zoomIn(); } }
      else if (act === "zout") { if (map) { map.zoomOut(); } }
      else if (act === "focus") { e.preventDefault(); toStage(); select(id); }
      else if (act === "rel") {
        e.preventDefault();
        var x = byId[id];
        if (!x) { return; }
        if (x.pin && b.closest(".c-sheet")) { select(id); }
        else if (x.pin && !b.closest(".c-groups")) { toStage(); select(id); }
        else { openRow(x, true); }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") { return; }
      if (T) { tutEnd(); return; }
      if (shareNow) { shareClose(true); return; }
      if (!searchBox.hidden && document.activeElement === qIn) { searchOpen(false, true); return; }
      if (!legend.hidden) { menu(legend, false); if ($(".c-filterbtn", topBar)) { $(".c-filterbtn", topBar).focus(); } }
      else if (trMenu && !trMenu.hidden) { menu(trMenu, false); $('[data-act="trmenu"]').focus(); }
      else if (!sheet.hidden) { closePanel(); }
      else if (stage.classList.contains("is-full")) { full(false); }
    });

    function takeState(st) {
      S.q = typeof st.q === "string" ? st.q : "";
      S.ws = words(S.q);
      qIn.value = S.q;
      S.area = typeof st.a === "string" && areaCount[st.a] ? st.a : "";
      S.town = typeof st.t === "string" && townCount[st.t] ? st.t : "";
      S.tag = typeof st.g === "string" && TAGS.indexOf(st.g) !== -1 ? st.g : "";
      S.presets = Array.isArray(st.p) ? st.p.filter(function (k, i) { return PRESET[k] && st.p.indexOf(k) === i; }) : [];
      S.hint = COURSES.some(function (c) { return c.key === st.h; }) ? st.h : null;
      S.hidden = Array.isArray(st.x) ? st.x.filter(function (x, i) { return CATS[x] && st.x.indexOf(x) === i; }) : [];
      if (Array.isArray(st.u)) {
        var keep = {};
        st.u.forEach(function (k) { if (PURP[k]) { PURP[k].cats.forEach(function (c) { keep[c] = 1; }); } });
        S.hidden = CAT_IDS.filter(function (c) { return !keep[c]; });
      }
      if (S.hidden.length >= CAT_IDS.length) { S.hidden = []; }
      S.kind = typeof st.y === "string" && kindValid(st.y) ? st.y : "";
      S.cond = condOk(st.c) && onePurp() && onePurp().co ? st.c : "";
    }
    function openFromState(st) {
      if (!map) { return; }
      var vp = visible().filter(function (it) { return it.pin; });
      if (filtering() && vp.length) { fitTo(vp); }
      if (Array.isArray(st.k) && st.k.length) {
        openCourse(st.k.filter(function (x, i) { return byId[x] && st.k.indexOf(x) === i; }), true);
      } else if (S.hint) {
        openHint(hint());
      } else if (typeof st.s === "string" && byId[st.s]) {
        select(st.s);
      }
      if (st.r === 1) { setRings(true); }
    }
    takeState(st0);
    guideOpen(!store.get(KEY.guide, 0));
    paintTry();
    if (tagHint && !store.get(KEY.taghint, 0) && !store.get(KEY.tut, 0) && "IntersectionObserver" in window) {
      var hio = new IntersectionObserver(function (es) {
        if (es.some(function (en) { return en.isIntersecting; })) { hio.disconnect(); setTimeout(showTagHint, 700); }
      }, { threshold: 0.6 });
      hio.observe(stage);
    }
    setText(S.text);
    setBase(S.base, !st0.b);
    paintFavs();
    apply(false);
    paintWent();
    ready = true;
    if (map) {
      stage.classList.toggle("is-far", map.getZoom() < 14);
      setTimeout(function () { map.invalidateSize(); buildRail(); openFromState(st0); }, 60);
      trPaint();
      if (trAny()) { setTimeout(function () { trLoad(trSync); }, 120); }
    }
    window.addEventListener("hashchange", function () {
      var st = readHash();
      if (!st) {
        if (location.hash.indexOf("#" + P + "-") === 0) { fromAnchor(); }
        return;
      }
      ready = false;
      if (!sheet.hidden) { closePanel(); }
      if (S.rings) { setRings(false); }
      takeState(st);
      if (st.b) { setBase(st.b, false); }
      apply(false);
      ready = true;
      stage.scrollIntoView({ block: "start" });
      openFromState(st);
    });
    function fromAnchor() {
      var id = location.hash.slice(P.length + 2);
      var it = byId[id];
      if (!it) { return; }
      setTimeout(function () {
        if (it.pin) { stage.scrollIntoView({ block: "start" }); select(it.id); } else { openRow(it, true); }
      }, 300);
    }
    if (location.hash.indexOf("#" + P + "-") === 0) { fromAnchor(); }
  }
})();
