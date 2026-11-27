
(function () {
  "use strict";
  var P = "itbM";
  var root = document.getElementById(P);
  if (!root || root.getAttribute("data-ready")) { return; }
  root.setAttribute("data-ready", "1");
  var BASE = root.getAttribute("data-base") || (document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[^\/]*$/, "") : "");
  var ICONS = {"tree": "<circle cx=\"12\" cy=\"9\" r=\"5.5\"/><path d=\"M12 14.5V21M8.5 21h7\"/>", "dumbbell": "<path d=\"M7 7v10M4 9.5v5M17 7v10M20 9.5v5M7 12h10\"/>", "book": "<path d=\"M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5zM12 6.5v13\"/>", "balloon": "<path d=\"M12 3.5c2.9 0 5 2.2 5 5 0 3.3-2.7 6-5 6s-5-2.7-5-6c0-2.8 2.1-5 5-5z\"/><path d=\"M12 14.5l-.9 1.6h1.8zM12 16.1c0 1.6 1.4 2.4 0 4.4\"/>", "museum": "<path d=\"M3.5 9 12 4.5 20.5 9M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3.5 20h17\"/>", "paw": "<circle cx=\"8.3\" cy=\"7.6\" r=\"1.7\"/><circle cx=\"15.7\" cy=\"7.6\" r=\"1.7\"/><circle cx=\"5\" cy=\"12\" r=\"1.5\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\"/><path d=\"M12 11.5c-2.8 0-4.8 3-4.8 5.1 0 1.5 1.3 2.2 2.6 1.7 1.5-.6 2.9-.6 4.4 0 1.3.5 2.6-.2 2.6-1.7 0-2.1-2-5.1-4.8-5.1z\"/>", "landmark": "<path d=\"M4 9.5c3-.5 5-2 8-5 3 3 5 4.5 8 5M6.5 9.5V19M17.5 9.5V19M4 19.5h16M9.5 14h5\"/>", "people": "<circle cx=\"9\" cy=\"8\" r=\"2.8\"/><circle cx=\"16.5\" cy=\"9\" r=\"2.2\"/><path d=\"M3.8 19c.6-3.4 2.6-5.3 5.2-5.3s4.6 1.9 5.2 5.3M14.6 14.1c2.4-.4 4.6 1.1 5.2 4.6\"/>", "bubble": "<path d=\"M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z\"/><path d=\"M8 9.5h8M8 12.5h5\"/>", "pin": "<path d=\"M12 20.5s-6-5.3-6-10.5a6 6 0 0 1 12 0c0 5.2-6 10.5-6 10.5z\"/><circle cx=\"12\" cy=\"10\" r=\"2.2\"/>", "route": "<circle cx=\"6\" cy=\"18\" r=\"2\"/><circle cx=\"18\" cy=\"6\" r=\"2\"/><path d=\"M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16\"/>", "share": "<circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/>", "phone": "<path d=\"M6.5 4.5h2.7l1.4 3.6-1.8 1.2a10.5 10.5 0 0 0 5.9 5.9l1.2-1.8 3.6 1.4v2.7a1.5 1.5 0 0 1-1.6 1.5C10.4 18.4 5.6 13.6 5 6.1a1.5 1.5 0 0 1 1.5-1.6z\"/>", "copy": "<rect x=\"8.5\" y=\"8.5\" width=\"11\" height=\"11\" rx=\"1.6\"/><path d=\"M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5\"/>", "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/>", "locate": "<circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/>", "close": "<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/>", "star": "<path d=\"M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z\"/>", "expand": "<path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/>", "shrink": "<path d=\"M9 4.5V9H4.5M15 4.5V9h4.5M9 19.5V15H4.5M15 19.5V15h4.5\"/>", "print": "<path d=\"M7 9V4.5h10V9M7 17H5.5A1.5 1.5 0 0 1 4 15.5v-5A1.5 1.5 0 0 1 5.5 9h13a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17\"/><path d=\"M7 14h10v6H7z\"/>", "sliders": "<path d=\"M4 7h9M17 7h3M4 17h3M11 17h9\"/><circle cx=\"15\" cy=\"7\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/>", "map": "<path d=\"M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z\"/><path d=\"M9 4.5v13M15 6.5v13\"/>", "walk": "<circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/>", "rings": "<circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"5.5\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", "link": "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>", "chevron": "<path d=\"M9 6l6 6-6 6\"/>", "check": "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>", "list": "<path d=\"M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.5M4.5 12h.5M4.5 17.5h.5\"/>", "dice": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/>", "layers": "<path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/>", "train": "<circle class=\"c-gk-bg\" cx=\"12\" cy=\"12\" r=\"11.5\" fill=\"#fff\" stroke=\"none\"/><path d=\"M12 14.2Q8.59 11.09 4.37 9.38Q2.47 8.7 3.7 6.98A11 11 0 0 1 10.37 3.32L12 7.6L13.63 3.32A11 11 0 0 1 20.3 6.98Q21.53 8.7 19.63 9.38Q15.41 11.09 12 14.2z\" fill=\"#2f9e44\" stroke=\"none\"/><path d=\"M12 13.8c.1 2.3-.2 4.4-.8 6.4\" fill=\"none\" stroke=\"#2f9e44\" stroke-width=\"1.8\"/>", "bus": "<rect x=\"5\" y=\"3.5\" width=\"14\" height=\"14.5\" rx=\"2.5\"/><path d=\"M5 11.5h14M8 6.6h8M7.6 18v2.5M16.4 18v2.5\"/><path d=\"M8.4 14.8h.01M15.6 14.8h.01\" stroke-width=\"2.6\"/>", "up": "<path d=\"M12 18V6M6.5 11.5L12 6l5.5 5.5\"/>", "down": "<path d=\"M12 6v12M6.5 12.5L12 18l5.5-5.5\"/>", "flag": "<path d=\"M5.5 21V4.5M5.5 5c4-2 7 2 13 0v8c-6 2-9-2-13 0\"/>", "umbrella": "<path d=\"M3.5 12.5a8.5 8.5 0 0 1 17 0z\"/><path d=\"M12 12.5v6a2 2 0 0 1-4 0M12 3.5V4\"/>", "stroller": "<path d=\"M12.5 4.5v7h7.5a7.5 7.5 0 0 0-7.5-7.5z\"/><path d=\"M3.5 7.5H6l1.6 4h12.4a5 5 0 0 1-5 5h-4.5a5 5 0 0 1-3.3-1.3\"/><circle cx=\"9\" cy=\"19.2\" r=\"1.6\"/><circle cx=\"16.5\" cy=\"19.2\" r=\"1.6\"/>", "yen": "<path d=\"M7 4.5l5 7 5-7M12 11.5V20M8 12.5h8M8 16h8\"/>", "laptop": "<rect x=\"5\" y=\"5.5\" width=\"14\" height=\"9.5\" rx=\"1.3\"/><path d=\"M3 18.5h18\"/>", "wifi": "<path d=\"M3.8 9.6a11.6 11.6 0 0 1 16.4 0M6.9 12.9a7.2 7.2 0 0 1 10.2 0M10 16.1a2.9 2.9 0 0 1 4 0\"/><path d=\"M12 19.2v.01\" stroke-width=\"2.8\"/>", "parking": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M10 16.5v-9h3.2a2.7 2.7 0 0 1 0 5.4H10\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 7.5V12l3 2\"/>", "drink": "<path d=\"M6.5 8.5h11l-1.3 10.6a1.6 1.6 0 0 1-1.6 1.4H9.4a1.6 1.6 0 0 1-1.6-1.4z\"/><path d=\"M7 12.5h10M13 8.5l1.6-5h3\"/>", "smoke": "<rect x=\"3\" y=\"14\" width=\"15\" height=\"4\" rx=\"1\"/><path d=\"M14.5 14v4M20.5 14v4M17.5 11c0-1.6 2-1.6 2-3.2S17.5 6.2 17.5 4.6\"/>", "moon": "<path d=\"M19.5 14.6A7.6 7.6 0 1 1 9.4 4.5a6.1 6.1 0 0 0 10.1 10.1z\"/>", "flower": "<path d=\"M7.5 5l2.2 2.5L12 4.5l2.3 3 2.2-2.5v4.6a4.5 4.5 0 0 1-9 0z\"/><path d=\"M12 14.1V21M12 18.2c-1.6-1.8-3.6-2.1-5.1-1.7M12 17.2c1.6-1.8 3.6-2.1 5.1-1.7\"/>", "shop": "<path d=\"M4 9.5l1.6-5h12.8L20 9.5\"/><path d=\"M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0\"/><path d=\"M5.5 12v7.5h13V12M10 19.5v-4.5h4v4.5\"/>", "home": "<path d=\"M4 11.5L12 5l8 6.5M6.5 9.5v10h11v-10\"/>", "ext": "<path d=\"M13.5 4.5h6v6M19.5 4.5l-8 8M17 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 18V9a1.5 1.5 0 0 1 1.5-1.5H11\"/>", "tag": "<path d=\"M4.5 12.3V5.5a1 1 0 0 1 1-1h6.8l7.2 7.2a1 1 0 0 1 0 1.4l-5.9 5.9a1 1 0 0 1-1.4 0z\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.3\"/>", "info": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 11v5.5M12 7.8v.01\"/>", "play": "<path d=\"M8.5 5.8v12.4l9.8-6.2z\"/>", "mug": "<path d=\"M5.5 8h9.5v11a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19z\"/><path d=\"M15 10h2a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2M5.5 8a2.6 2.6 0 0 1 3.3-2.5 3 3 0 0 1 5.4.4A2.2 2.2 0 0 1 15 8M8.8 11.5v5.5M11.7 11.5v5.5\"/>", "fish": "<path d=\"M4.5 12c2.5-3.4 5.5-5 8.6-5 3.2 0 5.8 1.7 7.4 5-1.6 3.3-4.2 5-7.4 5-3.1 0-6.1-1.6-8.6-5z\"/><path d=\"M4.5 12 2.5 9M4.5 12l-2 3\"/><path d=\"M16.6 11h.01\" stroke-width=\"2.6\"/>", "udon": "<path d=\"M3.5 12h17a8.5 8.5 0 0 1-17 0z\"/><path d=\"M8.5 20.5h7M13.5 3.5 9.5 12M18.5 4.5 13.5 12\"/>", "ramen": "<path d=\"M3.5 12h17a8.5 8.5 0 0 1-17 0z\"/><path d=\"M8.5 20.5h7M8.5 9.5c-1-1.2 1-2.1 0-3.5M12 9.5c-1-1.2 1-2.1 0-3.5M15.5 9.5c-1-1.2 1-2.1 0-3.5\"/>", "dumpling": "<path d=\"M3.5 15c1.5-4.6 4.8-7.2 8.5-7.2s7 2.6 8.5 7.2c-2.6 1.6-5.4 2.4-8.5 2.4S6.1 16.6 3.5 15z\"/><path d=\"M7.6 10.8l.9 2M10.6 9l.4 2.2M13.4 9l-.4 2.2M16.4 10.8l-.9 2\"/>", "grill": "<circle cx=\"12\" cy=\"11\" r=\"7\"/><path d=\"M5.6 8.5h12.8M5 11h14M5.6 13.5h12.8M8.5 17.2 7 20.5M15.5 17.2l1.5 3.3\"/>", "cutlery": "<path d=\"M7 3.5v5.5a2 2 0 0 0 2 2v9.5M11 3.5V9a2 2 0 0 1-2 2M9 3.5v5\"/><path d=\"M17.5 20.5v-17c-2.2 1.6-3.2 4.2-3.2 7.2v3.3h3.2\"/>", "curry": "<path d=\"M3 14.5h18a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 14.5z\"/><path d=\"M5.5 14.5c.6-3.2 2.4-5 5-5 2 0 3.3 1 4 2.6.9-.6 2.1-.8 3.3-.4M10.5 7.5c-.8-1.1.8-1.9 0-3.2\"/>", "teppan": "<path d=\"M3 17.5h14\"/><ellipse cx=\"9.5\" cy=\"14\" rx=\"6\" ry=\"2.5\"/><path d=\"M14.5 11.5l2.6-2.6 1.6 1.6-2.6 2.6zM17.9 9.7 21 6.6\"/>", "plate": "<circle cx=\"13.5\" cy=\"12\" r=\"7\"/><circle cx=\"13.5\" cy=\"12\" r=\"3.5\"/><path d=\"M3.5 3.5v5a1.5 1.5 0 0 0 1.5 1.5v10.5M3.5 3.5v5\"/>", "coffee": "<path d=\"M4.5 10h11.5v4.5a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-5-5z\"/><path d=\"M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 7.5c-.8-1 .8-1.8 0-3M12.5 7.5c-.8-1 .8-1.8 0-3\"/>", "bento": "<rect x=\"3.5\" y=\"6\" width=\"17\" height=\"12\" rx=\"2\"/><path d=\"M12 6v12M12 12h8.5\"/><circle cx=\"7.7\" cy=\"12\" r=\"1.7\"/>", "swap": "<path d=\"M8 4.5v15M4.5 8 8 4.5 11.5 8M16 19.5v-15M12.5 16l3.5 3.5 3.5-3.5\"/>", "menu": "<path d=\"M4 6.5h16M4 12h16M4 17.5h16\"/>", "camera": "<path d=\"M4.5 8h3.2l1.7-2.5h5.2L16.3 8h3.2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z\"/><circle cx=\"12\" cy=\"13.2\" r=\"3.4\"/>"};
  var COURSES = [{"key": "akatsuka", "label": "赤塚で半日", "ids": ["6-01", "5-01", "5-02", "1-1-12", "7-3-02", "7-3-01"], "text": "赤塚植物園・板橋区立美術館・郷土資料館・都立赤塚公園の4施設が徒歩圏に集まっていて、無料〜低額で半日過ごせます。近くには東京大仏（乗蓮寺）や松月院もあります。"}];
  var CFG = {"mapName": "板橋区と周辺のスポット・飲食店地図", "wide": true, "groupZoom": true, "meZoomOut": 3, "kyokaUrl": "https://www.city.itabashi.tokyo.jp/kenko/eisei/shokuhin/1051220.html", "attr": "<a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">© OpenStreetMap contributors</a>", "syn": [["寿司", "寿司", "すし", "鮨"], ["すし", "すし", "寿司", "鮨"], ["鮨", "鮨", "すし", "寿司"], ["蕎麦", "蕎麦", "そば"], ["そば", "そば", "蕎麦"], ["饂飩", "饂飩", "うどん"], ["拉麺", "拉麺", "ラーメン"], ["焼き肉", "焼き肉", "焼肉"], ["焼肉", "焼肉", "焼き肉"], ["焼き鳥", "焼き鳥", "焼鳥", "やきとり"], ["焼鳥", "焼鳥", "焼き鳥", "やきとり"], ["やきとり", "やきとり", "焼き鳥", "焼鳥"], ["喫茶", "喫茶", "カフェ"], ["カフェ", "カフェ", "喫茶", "珈琲", "コーヒー"], ["コーヒー", "コーヒー", "珈琲", "カフェ", "喫茶"], ["珈琲", "珈琲", "コーヒー", "カフェ", "喫茶"], ["餃子", "餃子", "ぎょうざ", "ギョーザ", "ギョウザ"], ["飲み屋", "飲み屋", "居酒屋", "バー", "スナック"], ["惣菜", "惣菜", "総菜", "そうざい", "デリ"], ["総菜", "総菜", "惣菜", "そうざい"], ["出前", "出前", "配達", "宅配", "デリバリー"], ["宅配", "宅配", "配達", "出前", "デリバリー"], ["デリバリー", "デリバリー", "配達", "宅配", "出前"], ["パスタ", "パスタ", "イタリアン"], ["ピザ", "ピザ", "ピッツァ", "イタリアン"], ["定食", "定食", "食堂"], ["もんじゃ", "もんじゃ", "鉄板焼", "お好み焼"], ["たこ焼", "たこ焼", "タコ焼"]], "condKeys": ["ドリンクバー", "Wi-Fiあり", "喫煙できる", "駐車場あり"], "purposes": [{"key": "food", "label": "食べる", "short": "食べる", "name": "飲食店", "icon": "cutlery", "color": "#d9480f", "cats": ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113"], "kinds": [["c:101", "居酒屋・バー", 514, "居酒屋・バー"], ["c:110", "食堂・軽食", 199, "食堂・レストラン・軽食"], ["c:105", "中華", 176, "中華"], ["c:111", "カフェ", 170, "カフェ・喫茶"], ["c:104", "ラーメン", 164, "ラーメン"], ["c:112", "弁当・惣菜", 122, "弁当・惣菜・配達"], ["c:102", "和食・すし", 102, "和食・すし"], ["c:107", "洋食", 90, "洋食・イタリアン"], ["c:106", "焼肉", 89, "焼肉・肉料理"], ["c:108", "カレー・エスニック", 85, "カレー・エスニック"], ["c:103", "うどん・そば", 65, "うどん・そば"], ["c:109", "お好み焼き", 27, "お好み焼き・鉄板焼き"], ["c:113", "その他", 78, "その他"]], "conds": ["drink", "wifi", "smoke", "park"], "co": 1, "unit": "店"}, {"key": "play", "label": "遊ぶ", "short": "遊ぶ", "name": "公園・遊び場", "icon": "tree", "color": "#2f7d3b", "cats": ["1"], "kinds": [["s:1-1", "公園・緑地", 73, "公園・緑地・庭園"], ["s:1-2", "遊び場", 19, "遊び場（ボール遊び広場・児童遊園・校庭開放）"]]}, {"key": "sport", "label": "運動", "short": "運動", "name": "運動施設", "icon": "dumbbell", "color": "#c2410c", "cats": ["2"], "kinds": [["s:2-2", "野球場・テニス場など", 47, "公営の屋外施設（野球場・庭球場・競技場など）"], ["s:2-3", "ジム", 38, "民間ジム（一般・24時間）"], ["s:2-1", "体育館・プール", 28, "公営の屋内施設（体育館・温水プール）"], ["s:2-6", "パーソナルジム", 25, "パーソナルジム"], ["s:2-4", "chocoZAP", 15, "民間ジム（chocoZAP）"], ["s:2-8", "ピラティス・ヨガ", 12, "ピラティス・ヨガ"], ["s:2-7", "カーブス", 8, "女性専用サーキット（カーブス）"], ["s:2-9", "格闘技", 8, "格闘技ジム"], ["s:2-5", "スポーツクラブ", 7, "総合スポーツクラブ"], ["s:2-10", "大学の施設", 1, "大学施設（一般非公開・参考）"]]}, {"key": "book", "label": "本・自習", "short": "読む", "name": "図書館", "icon": "book", "color": "#3f51b5", "cats": ["3"], "kinds": []}, {"key": "kids", "label": "子ども", "short": "子ども", "name": "子ども・高齢者向けの施設", "icon": "balloon", "color": "#c2185b", "cats": ["4"], "kinds": [["s:4-1", "子ども向け", 95, "子ども向け（児童館・遊び場施設）"], ["s:4-2", "高齢者向け", 2, "高齢者向け"]]}, {"key": "see", "label": "見る・学ぶ", "short": "見る", "name": "博物館・動植物園・名所", "icon": "museum", "color": "#7b1fa2", "cats": ["5", "6", "7"], "kinds": [["s:7-3", "寺社", 46, "寺社"], ["s:7-4", "史跡・文化財", 36, "史跡・文化財"], ["c:5", "博物館・美術館", 28, "博物館・美術館・科学館・資料館"], ["c:6", "動物園・植物園", 6, "動物園・植物園・水族館"], ["s:7-1", "展望", 3, "展望施設"], ["s:7-2", "娯楽施設", 3, "テーマパーク・娯楽施設"]]}, {"key": "room", "label": "借りる", "short": "借りる", "name": "集会・貸室施設", "icon": "people", "color": "#6d4c41", "cats": ["8"], "kinds": [["s:8-1", "集会所・ホール", 107, "地域センター・ホール・区民センター"], ["s:8-2", "生涯学習", 3, "生涯学習センター"], ["s:8-3", "区民農園", 1, "区民農園"]]}, {"key": "shop", "label": "買い物", "short": "買い物", "name": "商店街・商店通り", "icon": "shop", "color": "#455a64", "cats": ["11"], "kinds": [["s:11-2", "練馬区", 38, "練馬区"], ["s:11-1", "板橋区", 14, "板橋区"], ["s:11-5", "埼玉県6市", 13, "埼玉県6市"]]}, {"key": "wifi", "label": "無料Wi-Fi", "short": "Wi-Fi", "name": "無料Wi-Fiが使える場所", "icon": "wifi", "color": "#0277bd", "cats": [], "kinds": [], "tags": ["設備:TOKYO FREE Wi-Fi", "設備:区の無料Wi-Fi"]}], "tutPurp": "food", "tutCond": "drink", "condMax": 5, "tutKind": "c:104"};
  var SKELETON = "<section class=\"c-guide needs-js\" aria-labelledby=\"itbM-guide-h\"><div class=\"c-guide-head\"><h3 class=\"c-guide-h\" id=\"itbM-guide-h\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 11v5.5M12 7.8v.01\"/></svg>まちあるき地図の使い方</h3><button type=\"button\" class=\"c-guide-tg\" data-act=\"guide\" aria-expanded=\"true\" aria-controls=\"itbM-guide-b\"><span>閉じる</span><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6l6 6-6 6\"/></svg></button></div><div class=\"c-guide-body\" id=\"itbM-guide-b\"><p class=\"c-guide-lead\">スポット794か所と飲食店1,881店を、1つの地図と一覧から探せます。</p><ol class=\"c-guide-steps\"><li><span class=\"c-guide-n\">1</span><b>探す</b><span class=\"c-guide-d\">目的を選び、種類や条件で絞る</span></li><li><span class=\"c-guide-n\">2</span><b>見る</b><span class=\"c-guide-d\">ピンか一覧で詳しい情報</span></li><li><span class=\"c-guide-n\">3</span><b>残す・送る</b><span class=\"c-guide-d\">コースにまとめて共有</span></li></ol><div class=\"c-guide-row\"><button type=\"button\" class=\"c-guide-try\" data-act=\"tutorial\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8.5 5.8v12.4l9.8-6.2z\"/></svg><span class=\"c-guide-try-t\">30秒で試す</span></button><button type=\"button\" class=\"c-guide-more\" data-act=\"guidebtns\" aria-expanded=\"false\" aria-controls=\"itbM-guide-l\">地図のボタンの説明<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6l6 6-6 6\"/></svg></button></div><ul class=\"c-guide-list\" id=\"itbM-guide-l\" hidden><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 3.5v5.5a2 2 0 0 0 2 2v9.5M11 3.5V9a2 2 0 0 1-2 2M9 3.5v5\"/><path d=\"M17.5 20.5v-17c-2.2 1.6-3.2 4.2-3.2 7.2v3.3h3.2\"/></svg></span><b>目的</b><span>最初に出る「何をしに行きますか」か、検索欄の下の段で選ぶ。選んだ目的の場所だけが地図に出る。別の目的を押すと入れ替わり、同じ目的をもう一度押すと最初の画面に戻る</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.5M4.5 12h.5M4.5 17.5h.5\"/></svg></span><b>種類</b><span>目的を選ぶと一覧の上に出る段。ラーメン・カフェ、公園・遊び場などで、さらに絞る。押した種類をもう一度押すと、目的の全部に戻る</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 7h9M17 7h3M4 17h3M11 17h9\"/><circle cx=\"15\" cy=\"7\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/></svg></span><b>条件</b><span>種類の下の段。雨の日・子連れ・ドリンクバーなどの条件とエリアで絞る。条件は1つずつ選ぶ。数字は当てはまる件数</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg></span><b>検索</b><span>いちばん上の検索欄に、名前・駅・やりたいことを入れて探す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"5.5\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/></svg></span><b>ピンの大きさ</b><span>Googleマップの口コミ件数の3段階。100件以上は大きく縁取りのあるピン、20件未満は小さく薄いピン。件数がわからない場所と飲食店は、ふつうの大きさ</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></span><b>メニュー</b><span>検索欄の左の三本線。自分のコース・行った場所・一覧・文字の大きさ・共有・使い方と、ブログの記事に戻るボタン</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/></svg></span><b>現在地</b><span>いまいる場所と向きを地図に出す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle class=\"c-gk-bg\" cx=\"12\" cy=\"12\" r=\"11.5\" fill=\"#fff\" stroke=\"none\"/><path d=\"M12 14.2Q8.59 11.09 4.37 9.38Q2.47 8.7 3.7 6.98A11 11 0 0 1 10.37 3.32L12 7.6L13.63 3.32A11 11 0 0 1 20.3 6.98Q21.53 8.7 19.63 9.38Q15.41 11.09 12 14.2z\" fill=\"#2f9e44\" stroke=\"none\"/><path d=\"M12 13.8c.1 2.3-.2 4.4-.8 6.4\" fill=\"none\" stroke=\"#2f9e44\" stroke-width=\"1.8\"/></svg></span><b>都営で行く</b><span>都営地下鉄・都バス・東京さくらトラム・日暮里・舎人ライナーだけで行く経路と時刻を、時刻表から調べる。場所の詳しい情報にある「都営で行く」からも使える</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/></svg></span><b>徒歩圏</b><span>選んだ場所や現在地から、徒歩5・10・20分の範囲を出す</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/></svg></span><b>行き先おみくじ</b><span>地図に出ている場所から1か所を選ぶ。最初の画面では、全部の場所から選ぶ</span></li><li><span class=\"c-guide-ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/></svg></span><b>地図の表示</b><span>背景の地図（航空写真・淡色地図・標準地図）を切り替え、鉄道の路線・駅・バス停を重ねる</span></li></ul><p class=\"c-guide-note\">営業時間や料金は、公式ページで確かめてください。</p></div></section><div class=\"c-bar needs-js\"><button type=\"button\" class=\"c-stat\" data-act=\"course\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5.5 21V4.5M5.5 5c4-2 7 2 13 0v8c-6 2-9-2-13 0\"/></svg><span>自分のコース</span><b class=\"c-stat-course\">0</b><span>か所</span></button><button type=\"button\" class=\"c-stat\" data-act=\"gotoindex\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg><span>行った場所</span><b class=\"c-stat-went\">0</b><span>/2675か所</span></button><div class=\"c-textsize\" role=\"group\" aria-label=\"文字の大きさ\"><span class=\"c-textsize-lb\">文字</span><button type=\"button\" data-act=\"text\" data-size=\"1\" aria-pressed=\"true\">標準</button><button type=\"button\" data-act=\"text\" data-size=\"2\" aria-pressed=\"false\">大きく</button></div><button type=\"button\" class=\"c-sharebtn\" data-act=\"sharemap\" aria-haspopup=\"dialog\" aria-expanded=\"false\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/></svg><span>共有</span></button></div><div class=\"c-sharemenu\" role=\"dialog\" aria-label=\"共有する\" hidden><div class=\"c-sharemenu-head\"><p class=\"c-sharemenu-h\">共有する<span class=\"c-sharemenu-t\"></span></p><button type=\"button\" class=\"c-sharemenu-x\" data-act=\"shareclose\" aria-label=\"閉じる\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg></button></div><div class=\"c-snsgrid\"><a class=\"c-sns c-sns-line\" data-sns=\"line\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>LINE</a><a class=\"c-sns c-sns-x\" data-sns=\"x\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>X</a><a class=\"c-sns c-sns-fb\" data-sns=\"facebook\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Facebook</a><a class=\"c-sns c-sns-th\" data-sns=\"threads\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Threads</a><a class=\"c-sns c-sns-bs\" data-sns=\"bluesky\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>Bluesky</a><a class=\"c-sns c-sns-hb\" data-sns=\"hatena\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"c-sns-dot\"></span>はてな<wbr>ブックマーク</a></div><div class=\"c-sharemore\"><button type=\"button\" data-act=\"sharecopy\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"8.5\" y=\"8.5\" width=\"11\" height=\"11\" rx=\"1.6\"/><path d=\"M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5\"/></svg>リンクをコピー</button><button type=\"button\" data-act=\"sharenative\" hidden><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"17.5\" cy=\"5.5\" r=\"2.2\"/><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.2\"/><path d=\"M8.5 10.9l7-4.2M8.5 13.1l7 4.2\"/></svg>ほかのアプリ</button></div></div><div class=\"c-stage needs-js\"><div class=\"c-map\" role=\"region\" aria-label=\"スポットと飲食店の地図\"></div><div class=\"c-cross\" aria-hidden=\"true\" hidden></div><div class=\"c-top\"><div class=\"c-purposes\" role=\"group\" aria-label=\"目的で選ぶ\"></div><div class=\"c-searchbox\" hidden><label class=\"c-search\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg><input type=\"search\" class=\"c-q\" placeholder=\"名前・駅・やりたいことで探す\" aria-label=\"スポットを探す\" autocomplete=\"off\" enterkeyhint=\"search\"></label></div><button type=\"button\" class=\"c-round c-searchbtn\" data-act=\"search\" aria-expanded=\"false\" aria-label=\"名前・駅・やりたいことで探す\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"full\" aria-pressed=\"false\" aria-label=\"地図を大きく表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></button></div><div class=\"c-conds\" role=\"group\" aria-label=\"種類と条件で絞る\"></div><div class=\"c-legend\" role=\"group\" aria-label=\"絞り込みの条件\" hidden></div><div class=\"c-side\"><button type=\"button\" class=\"c-round c-full2\" data-act=\"full\" aria-pressed=\"false\" aria-label=\"地図を大きく表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"locate\" aria-label=\"現在地を表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"3.5\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22\"/></svg></button><button type=\"button\" class=\"c-round c-rtbtn\" data-act=\"rt\" aria-pressed=\"false\" aria-label=\"都営交通で行く経路と時刻を調べる\" title=\"都営交通で行く\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle class=\"c-gk-bg\" cx=\"12\" cy=\"12\" r=\"11.5\" fill=\"#fff\" stroke=\"none\"/><path d=\"M12 14.2Q8.59 11.09 4.37 9.38Q2.47 8.7 3.7 6.98A11 11 0 0 1 10.37 3.32L12 7.6L13.63 3.32A11 11 0 0 1 20.3 6.98Q21.53 8.7 19.63 9.38Q15.41 11.09 12 14.2z\" fill=\"#2f9e44\" stroke=\"none\"/><path d=\"M12 13.8c.1 2.3-.2 4.4-.8 6.4\" fill=\"none\" stroke=\"#2f9e44\" stroke-width=\"1.8\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"rings\" aria-pressed=\"false\" aria-label=\"徒歩圏を表示\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"13.5\" cy=\"4.5\" r=\"1.7\"/><path d=\"M10 20.5l1.8-5.5 2.7 2.6v2.9M9 12.2l1.6-3.6 3 .8 1.7 2.8 2.7 1M11.8 15l-1-4.6\"/></svg></button><button type=\"button\" class=\"c-round\" data-act=\"omikuji\" aria-label=\"今日の行き先おみくじ\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01\" stroke-width=\"2.6\"/></svg></button><button type=\"button\" class=\"c-round c-trbtn\" data-act=\"trmenu\" aria-expanded=\"false\" aria-label=\"地図の表示を切り替える（背景の地図・鉄道とバス停）\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 4l8.5 4.5L12 13 3.5 8.5z\"/><path d=\"M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5\"/></svg></button><button type=\"button\" class=\"c-round c-zoom\" data-act=\"zin\" aria-label=\"拡大\">＋</button><button type=\"button\" class=\"c-round c-zoom\" data-act=\"zout\" aria-label=\"縮小\">−</button></div><div class=\"c-trmenu\" role=\"group\" aria-label=\"地図の表示\" hidden><p class=\"c-trmenu-h\">背景の地図</p><div class=\"c-basemenu\" role=\"group\" aria-label=\"背景の地図\"><button type=\"button\" data-act=\"base\" data-base=\"photo\" aria-pressed=\"true\"><span class=\"c-sw c-sw-photo\"></span>航空写真</button><button type=\"button\" data-act=\"base\" data-base=\"pale\" aria-pressed=\"false\"><span class=\"c-sw c-sw-pale\"></span>淡色地図</button><button type=\"button\" data-act=\"base\" data-base=\"std\" aria-pressed=\"false\"><span class=\"c-sw c-sw-std\"></span>標準地図</button></div><p class=\"c-trmenu-h\">地図に重ねて表示</p><button type=\"button\" data-act=\"tr\" data-k=\"l\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-l\"></span><span class=\"c-trtx\">鉄道の路線</span></button><button type=\"button\" data-act=\"tr\" data-k=\"s\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-s\"></span><span class=\"c-trtx\">駅<small>拡大すると表示</small></span></button><button type=\"button\" data-act=\"tr\" data-k=\"b\" aria-pressed=\"false\"><span class=\"c-trsw c-trsw-b\"></span><span class=\"c-trtx\">バス停<small>さらに拡大すると表示</small></span></button><p class=\"c-trmenu-src\">出典：「国土数値情報（<a href=\"https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2025.html\" target=\"_blank\" rel=\"noopener\">鉄道データ</a>・<a href=\"https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P11-2022.html\" target=\"_blank\" rel=\"noopener\">バス停留所データ</a>）」（国土交通省）を加工して作成。鉄道は2025年度、バス停は2022年度のデータです。</p></div><div class=\"c-ringinfo\" aria-live=\"polite\" hidden></div><div class=\"c-rail\" aria-label=\"地図に出ている場所\"></div><button type=\"button\" class=\"c-round c-scrolldown\" data-act=\"gotoindex\" aria-label=\"地図の下の一覧へ進む\" title=\"下へ進む\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 6v12M6.5 12.5L12 18l5.5-5.5\"/></svg></button><div class=\"c-sheet\" role=\"region\" aria-label=\"選んだ場所の情報\" hidden></div><div class=\"c-taghint\" role=\"status\" hidden><span>目的を押すと、押した目的の場所だけが地図に出ます</span><button type=\"button\" data-act=\"taghintx\" aria-label=\"閉じる\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg></button></div><div class=\"c-tut\" hidden><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-dim\"></div><div class=\"c-tut-block\" hidden></div><div class=\"c-tut-ring\"></div><div class=\"c-tut-pop\" role=\"dialog\" aria-labelledby=\"itbM-tut-t\"><p class=\"c-tut-step\"></p><p class=\"c-tut-text\" id=\"itbM-tut-t\" aria-live=\"polite\"></p><div class=\"c-tut-acts\"><button type=\"button\" class=\"c-tut-skip\" data-act=\"tutskip\">スキップ</button><button type=\"button\" class=\"c-tut-done\" data-act=\"tutdone\" hidden>終わる</button></div></div></div></div><div class=\"c-index needs-js\"><div class=\"c-index-head\"><h3 class=\"c-index-h\">一覧から探す</h3><p class=\"c-index-count\"></p></div><p class=\"c-index-note\">地図と同じ条件で絞り込まれます。町名やエリアを開くと、分類の順に並んでいます。行を押すと、詳しい情報が開きます。</p><p class=\"c-index-empty\" hidden>条件に合う場所が見つかりませんでした。言葉を短くするか、条件を外してください。</p><div class=\"c-groups\"></div></div>";

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

  var appMark = null, appHooks = { enter: null };
  function appEnter() {
    if (!appMark && root.parentNode) { appMark = document.createComment(P); root.parentNode.insertBefore(appMark, root); }
    if (root.parentNode !== document.body) { document.body.appendChild(root); }
    root.classList.remove("is-inline");
    root.classList.add("is-app");
    root.style.width = ""; root.style.marginLeft = ""; root.style.maxWidth = "";
    document.documentElement.classList.add(P + "-lock");
    if (appHooks.enter) { appHooks.enter(); }
  }
  function appExit() {
    root.classList.remove("is-app");
    root.classList.add("is-inline");
    document.documentElement.classList.remove(P + "-lock");
    if (appMark && appMark.parentNode) { appMark.parentNode.insertBefore(root, appMark.nextSibling); }
    root.style.width = ""; root.style.marginLeft = ""; root.style.maxWidth = "";
    try { root.scrollIntoView({ block: "center" }); } catch (e) {}
  }
  // 記事のページ（.html）や共有リンクで開いたときは、最初から画面いっぱいにする
  if (/\.html$/.test(location.pathname) || new RegExp("^#(c=|" + P + "-)").test(location.hash)) { appEnter(); }
  var WIDE_GUT = 16, WIDE_MAX = 1920, WIDE_MIN_GAIN = 24;
  function widen() {
    var s = root.style;
    s.width = ""; s.marginLeft = ""; s.maxWidth = "";
    if (root.classList.contains("is-app") || root.classList.contains("is-inline")) { return; }
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
    root.classList.remove("is-js", "is-app", "is-inline");
    root.classList.add("is-nojs");
    document.documentElement.classList.remove(P + "-lock");
    if (appMark && appMark.parentNode) { appMark.parentNode.insertBefore(root, appMark.nextSibling); }
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
  // 区（市）ごとのファイル（idx.json と d/区のコード.json）から、最初に映る区と、共有リンクの場所の区の分だけを読む。
  // idx.json が読めないときは、前の形（data.json と kanko.json）で全部を読む
  function getJSON(u) { return fetch(BASE + u).then(function (r) { if (!r.ok) { throw new Error(u); } return r.json(); }); }
  var QIDX_P = null;
  function qIndex() {
    // 検索と共有リンクに使う目次（場所ごとの id・区・名前）。使うときに1回だけ読む
    if (!QIDX_P) { QIDX_P = getJSON("q.json").then(function (j) { return j && j.q ? j : { q: [] }; }, function () { return { q: [] }; }); }
    return QIDX_P;
  }
  function hashState() {
    if (location.hash.indexOf("#c=") !== 0) { return {}; }
    try { var o = JSON.parse(decodeURIComponent(location.hash.slice(3))); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; }
  }
  function boxHit(bb, s, w, n, e) { return !!bb && bb[0] <= n && bb[2] >= s && bb[1] <= e && bb[3] >= w; }
  function firstCodes(X) {
    // 最初の表示（板橋区の中心・ズーム13）に映る範囲を、画面の大きさから出す
    var lat = 35.766, lng = 139.684, dpp = 360 / (256 * Math.pow(2, 13));
    var w = (window.innerWidth || 1024) * dpp * 0.55, h = (window.innerHeight || 768) * dpp * 0.55 * Math.cos(lat * Math.PI / 180);
    return X.files.filter(function (f) { return boxHit(f[3], lat - h, lng - w, lat + h, lng + w); }).map(function (f) { return f[0]; });
  }
  function codesOfIds(X, ids) {
    return qIndex().then(function (Q) {
      var want = {}, codes = {};
      ids.forEach(function (id) { want[id] = 1; });
      Q.q.forEach(function (e) {
        if (!want[e[0]]) { return; }
        X.files.forEach(function (f) { if (f[1] === X.meta.areas[e[1]]) { codes[f[0]] = 1; } });
      });
      return Object.keys(codes);
    });
  }
  function bootData() {
    return getJSON("idx.json").then(function (X) {
      if (!X || X.v !== 2 || !X.files) { throw new Error("idx"); }
      var st = hashState(), codes = firstCodes(X), ids = [];
      if (typeof st.s === "string") { ids.push(st.s); }
      if (Array.isArray(st.k)) { ids = ids.concat(st.k.filter(function (x) { return typeof x === "string"; })); }
      if (typeof st.a === "string") { X.files.forEach(function (f) { if (f[1] === st.a) { codes.push(f[0]); } }); }
      return (ids.length ? codesOfIds(X, ids) : Promise.resolve([])).then(function (more) {
        var want = codes.concat(more).filter(function (c, i, a) { return a.indexOf(c) === i; });
        return Promise.all(want.map(function (c) { return getJSON("d/" + c + ".json").then(function (j) { return [c, j.items || []]; }); })).then(function (parts) {
          var D = { meta: X.meta, items: [] };
          X.loaded = {};
          parts.forEach(function (p) { X.loaded[p[0]] = 1; p[1].forEach(function (o) { D.items.push(o); }); });
          return { D: D, K: null, X: X };
        });
      });
    }).catch(function () {
      return Promise.all([getJSON("data.json"), getJSON("kanko.json").catch(function () { return null; })]).then(function (a) { return { D: a[0], K: a[1], X: null }; });
    });
  }
  Promise.all([
    bootData(),
    window.L && window.L.map ? null : loadScript(LF + "leaflet.js", "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=").catch(function () { return null; }),
    cssReady(),
  ]).then(function (a) {
    root.classList.remove("is-nojs");
    root.classList.add("is-js");
    root.innerHTML = SKELETON;
    try { start(a[0].D, a[0].K, a[0].X); } catch (e) { if (window.console) { window.console.error(e); } giveUp(); }
  }, giveUp);

  // 東京23区の観光スポット（kanko.json）を、地図のデータに足す
  var KK = { src: [], made: "" };
  var KK_PURP = { key: "kanko", label: "観光", short: "観光", name: "東京23区の観光スポット", icon: "camera", color: "#8a6a00", cats: [], tags: [], kinds: [], wide: true, pre: "東京23区・" };
  function kkMerge(D, K) {
    try {
      if (!K || K.v !== 1 || !K.items || !K.items.length) { return false; }
      var M = D.meta, aI = {}, tI = {}, lI = {}, byI = {};
      M.areas.forEach(function (v, i) { aI[v] = i; });
      M.tags.forEach(function (v, i) { tI[v] = i; });
      M.labels.forEach(function (v, i) { lI[v] = i; });
      D.items.forEach(function (o) { byI[o.i] = o; });
      var areas = M.areas.slice(), tags = M.tags.slice(), labels = M.labels.slice();
      function idx(map, arr, v) { if (map[v] === undefined) { map[v] = arr.length; arr.push(v); } return map[v]; }
      var aMap = K.areas.map(function (v) { return idx(aI, areas, v); });
      var tMap = K.tags.map(function (v) { return idx(tI, tags, v); });
      var lMap = K.labels.map(function (v) { return idx(lI, labels, v); });
      var add = K.items.filter(function (o) { return !byI[o.i]; }).map(function (o) {
        var x = {};
        Object.keys(o).forEach(function (k) { x[k] = o[k]; });
        x.a = aMap[o.a];
        x.tg = o.tg.map(function (k) { return tMap[k]; });
        x.sp = (o.sp || []).map(function (s) { return [lMap[s[0]], s[1]]; });
        x.kk = 1;
        return x;
      });
      var same = K.same.filter(function (s) { return byI[s[0]]; });
      // ここから先は失敗しない書き換えだけ
      areas.slice(M.areas.length).forEach(function (v) { M.areas.push(v); });
      tags.slice(M.tags.length).forEach(function (v) { M.tags.push(v); });
      labels.slice(M.labels.length).forEach(function (v) { M.labels.push(v); });
      K.facets.forEach(function (f) { if (!M.facets.some(function (g) { return g[0] === f[0]; })) { M.facets.push(f); } });
      Object.keys(K.cats).forEach(function (c) { if (!M.cats[c]) { M.cats[c] = K.cats[c]; } });
      same.forEach(function (s) {
        var o = byI[s[0]];
        s[1].forEach(function (k) { var t = tMap[k]; if (o.tg.indexOf(t) === -1) { o.tg.push(t); } });
      });
      add.forEach(function (o) { D.items.push(o); });
      KK_PURP.tags = K.kinds.map(function (k) { return "観光:" + k[0]; });
      KK_PURP.kinds = K.kinds.map(function (k) { return ["t:観光:" + k[0], k[1], k[2], k[3]]; });
      CFG.purposes.push(KK_PURP);
      KK.src = K.src || [];
      KK.made = K.made || "";
      return true;
    } catch (e) {
      if (window.console) { window.console.error(e); }
      return false;
    }
  }
  function kkSetup(kk) {
    // 区ごとのファイルのときの、観光の目的の設定（kanko.json を足すときの kkMerge の後半と同じ）
    if (!kk || !kk.kinds || !kk.kinds.length) { return; }
    KK_PURP.tags = kk.kinds.map(function (k) { return "観光:" + k[0]; });
    KK_PURP.kinds = kk.kinds.map(function (k) { return ["t:観光:" + k[0], k[1], k[2], k[3]]; });
    CFG.purposes.push(KK_PURP);
    KK.src = kk.src || [];
    KK.made = kk.made || "";
  }
  function start(D, K, X) {
    if (K) { kkMerge(D, K); }
    if (X) { kkSetup(X.kk); }
    var M = D.meta, TAGS = M.tags, LABELS = M.labels, CATS = M.cats, AREAS = M.areas, KANA = M.kana;
    var NICHE = {};
    M.facets.forEach(function (f) { NICHE[f[0]] = f[1] === 1; });
    var CAT_IDS = Object.keys(CATS).sort(function (a, b) { return Number(a) - Number(b); });
    var CAT_RANK = {};
    CAT_IDS.forEach(function (c, i) { CAT_RANK[c] = i; });
    function kana(t) { return KANA[t] || t; }

    var NO_INDEX = { "情報源": 1, "状態": 1, "Wi-Fiの場所": 1 };
    function mkItem(o, i) {
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
      it.kk = !!o.kk;
      it.pk = o.pk || 0;
      it.os = o.os || "";
      it.kn = !!o.kn;
      it.md = o.md || "";
      if (it.kk) { it.wp = o.wp || ""; it.wd = o.wd || ""; it.ks = o.ks || []; it.ul = o.ul || ""; }
      return it;
    }
    var items = D.items.map(mkItem);
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });
    root.addEventListener("error", function (e) {
      var t = e.target, f = t && t.tagName === "IMG" && t.closest ? t.closest(".c-photo") : null;
      if (!f) { return; }
      var fb = t.getAttribute("data-fb");
      if (fb && t.getAttribute("src") !== fb) { t.removeAttribute("srcset"); t.setAttribute("src", fb); return; }
      f.parentNode.removeChild(f);
    }, true);
    var pins = items.filter(function (it) { return it.pin; });
    (function () {
      // 使い方の説明と「行った場所」の数を、足した観光スポットの分も入れた数にする
      var nk = X ? X.n.kanko : items.filter(function (it) { return it.tags.some(function (t) { return t.indexOf("観光:") === 0; }); }).length, lead = $(".c-guide-lead"), w = $(".c-stat-went");
      if (nk && lead) { lead.textContent = lead.textContent.replace("を、1つの地図", "、東京23区の観光スポット" + nk.toLocaleString("ja-JP") + "か所を、1つの地図"); }
      if (lead) { lead.textContent = lead.textContent.replace(/飲食店[\d,]+店/, "飲食店" + (X ? X.n.food : items.filter(function (it) { return it.food; }).length).toLocaleString("ja-JP") + "店"); }
      if (w && w.nextElementSibling) { w.nextElementSibling.textContent = "/" + (X ? X.n.all : items.length) + "か所"; }
    })();

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
    function addText(it) {
      it.text = norm([it.name, it.official, it.aka, it.addr, it.area, it.town, it.lead, spec(it, ["できること", "補足"]), spec(it, ["文化財"]), tagWords(it),
        CATS[it.cat].name, M.subs[it.sub] || ""].join(" ").replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1"));
    }
    items.forEach(addText);

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
    function addBadges(it) {
      var b = [];
      if (it.has("料金:無料")) { b.push(["yen", "無料"]); }
      if (it.has("子連れ:子連れ向け")) { b.push(["stroller", "子連れ"]); }
      if (it.has("時間・天候:屋内")) { b.push(["home", "屋内"]); }
      if (anyOf(it, STUDY)) { b.push(["laptop", "自習・PC"]); }
      if (it.has("設備:TOKYO FREE Wi-Fi") || it.has("設備:区の無料Wi-Fi")) { b.push(["wifi", "無料Wi-Fi"]); } else if (it.has("学習・PC:Wi-Fi")) { b.push(["wifi", "Wi-Fi"]); }
      if (anyOf(it, PARK)) { b.push(["parking", "駐車場"]); }
      if (it.has("時間・天候:24時間")) { b.push(["moon", "24時間"]); } else if (it.has("時間・天候:夜21時以降も開いている")) { b.push(["moon", "夜21時以降も"]); }
      it.badges = b;
    }
    items.forEach(addBadges);
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
    var WIFI = ["学習・PC:Wi-Fi", "条件:Wi-Fiあり", "設備:TOKYO FREE Wi-Fi", "設備:区の無料Wi-Fi"], PARK2 = PARK.concat(["条件:駐車場あり"]);
    var PRESETS = [
      { key: "rain", label: "雨の日", icon: "umbrella", test: function (it) { return it.has("時間・天候:屋内"); }, say: "屋内の場所" },
      { key: "kids", label: "子連れ", icon: "stroller", test: function (it) { return it.has("子連れ:子連れ向け"); }, say: "子連れ向けの場所" },
      { key: "free", label: "無料", icon: "yen", test: function (it) { return it.has("料金:無料"); }, say: "無料で使える場所" },
      { key: "study", label: "自習・PC", icon: "laptop", test: function (it) { return anyOf(it, STUDY); }, say: "学習席やPC席のある場所" },
      { key: "wifi", label: "Wi-Fi", icon: "wifi", test: function (it) { return anyOf(it, WIFI); }, say: "Wi-Fiが使える場所", title: "Wi-Fiが使える場所（飲食店は、わかる店だけ）" },
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
    favs = favs.filter(function (id, i) { return (X || byId[id]) && favs.indexOf(id) === i; });
    var st0 = readHash() || {};
    var S = {
      q: "", ws: [], area: "", town: "", tag: "", presets: [], hint: null, hidden: [], purp: "", kind: "", cond: "", rings: false, panel: null, back: null,
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
    var pinState = {}, ringLayer = null, courseLayer = null, pinLayer = null;
    var NEAR_ZOOM = 14;
    var units = [], unitOf = {}, gmapU = {};
    function addUnits(list) {
      list.forEach(function (it) {
        var u;
        if (it.g >= 0 && M.gp && M.gp[it.g]) {
          u = gmapU[it.g];
          if (!u) {
            u = gmapU[it.g] = { key: "g" + it.g, lat: M.gp[it.g][0], lng: M.gp[it.g][1], members: [], vis: [], sig: "" };
            units.push(u);
          }
        } else {
          u = { key: it.id, lat: it.lat, lng: it.lng, members: [], vis: [], sig: "" };
          units.push(u);
        }
        u.members.push(it);
        unitOf[it.id] = u;
      });
      if (pinLayer) { pinLayer.redraw(); }
    }
    addUnits(pins);
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
    function applyUnit() { if (pinLayer) { pinLayer.redraw(); } }
    function big(st) { return st.sel || st.hot; }
    function refreshUnits() {
      units.forEach(function (u) { u.vis = u.members.filter(function (it) { return visSet[it.id]; }); });
      if (pinLayer) { pinLayer.redraw(); }
    }

    // ---- ピンは1枚の canvas に描く。ピンの形は、色・絵柄・状態ごとに1回だけ作って使い回す ----
    var SPR = {}, SVGI = {}, drawn = [];
    var PIN_FONT = '"Zen Maru Gothic","Hiragino Maru Gothic ProN","Hiragino Sans","Yu Gothic","Noto Sans JP",sans-serif';
    var SDPR = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
    function svgImg(name) {
      var img = SVGI[name];
      if (img) { return img; }
      img = SVGI[name] = new Image();
      img.onload = function () { SPR = {}; if (pinLayer) { pinLayer.redraw(); } };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#fff" ' +
        'stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" color="#fff">' + (ICONS[name] || "") + "</svg>");
      return img;
    }
    function pinLook(u, st) {
      var v = shown(u), multi = v.length > 1, it0 = v[0], s = multi ? null : statusOf(it0), rk = multi ? 2 : rkOf(it0);
      var approx = v.every(function (it) { return it.approx; }), closed = !!(s && s[1] === "is-closed");
      return {
        c: multi ? groupColor(v) : CATS[it0.cat].color, ic: multi ? "" : CATS[it0.cat].icon, n: multi ? v.length : 0,
        sc: st.sel ? 1.45 : st.hot ? 1.25 : st.dim ? 0.8 : rk === 1 ? 1.2 : rk === 3 ? 0.72 : 1,
        a: st.dim ? 0.35 : closed ? 0.62 : rk === 3 && !st.sel && !st.hot ? 0.72 : approx ? 0.88 : 1,
        ring: st.sel ? "sel" : multi ? "group" : rk === 1 ? "rk" : "white",
        dash: approx && !st.sel, gray: closed, went: st.went, part: !!(s && s[1] === "is-part"),
      };
    }
    function pinSprite(o) {
      var key = [o.c, o.ic, o.n, o.sc, o.ring, o.a, o.dash, o.gray, o.went, o.part].join("|"), s = SPR[key];
      if (s) { return s; }
      var r = (o.n ? 17 : 16) * o.sc, size = Math.ceil(r * 2 + 34), cv = document.createElement("canvas");
      cv.width = cv.height = Math.ceil(size * SDPR);
      var x = cv.getContext("2d"), c = size / 2, k = o.sc;
      x.scale(SDPR, SDPR);
      x.globalAlpha = o.a;
      // 輪（外から順に）と影
      var rings = o.ring === "sel" ? [[6, ink], [3, "#fff"]] : o.ring === "rk" || o.ring === "group" ? [[5, o.c], [2.5, "#fff"]] : o.dash ? [[1.5, o.c]] : [[2.5, "#fff"]];
      rings.forEach(function (g, i) {
        x.save();
        if (i === 0) { x.shadowColor = "rgba(0,0,0,.32)"; x.shadowBlur = 8 * k; x.shadowOffsetY = 3 * k; }
        x.beginPath();
        x.arc(c, c, r + g[0] * k, 0, 7);
        x.fillStyle = g[1];
        x.fill();
        x.restore();
      });
      x.beginPath();
      x.arc(c, c, r, 0, 7);
      x.fillStyle = o.gray ? "#9aa3a0" : o.c;
      x.fill();
      if (o.dash) {
        x.setLineDash([3 * k, 2.5 * k]);
        x.lineWidth = 2 * k;
        x.strokeStyle = "rgba(255,255,255,.95)";
        x.beginPath();
        x.arc(c, c, r - k, 0, 7);
        x.stroke();
        x.setLineDash([]);
      }
      if (o.n) {
        x.fillStyle = "#fff";
        x.font = "900 " + Math.round(14 * k) + "px " + PIN_FONT;
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillText(String(o.n), c, c + 0.5);
      } else {
        var im = svgImg(o.ic);
        if (im.complete && im.naturalWidth) { var iw = r * 1.2; x.drawImage(im, c - iw / 2, c - iw / 2, iw, iw); }
      }
      if (o.part) {
        x.globalAlpha = 1;
        x.beginPath(); x.arc(c + 13.5, c - 13.5, 7.5, 0, 7); x.fillStyle = "#fff"; x.fill();
        x.beginPath(); x.arc(c + 13.5, c - 13.5, 5.5, 0, 7); x.fillStyle = "#e8590c"; x.fill();
      }
      if (o.went) {
        x.globalAlpha = 1;
        x.beginPath(); x.arc(c + 13.5, c + 13.5, 10.5, 0, 7); x.fillStyle = "#fff"; x.fill();
        x.beginPath(); x.arc(c + 13.5, c + 13.5, 8.5, 0, 7); x.fillStyle = "#1d6b45"; x.fill();
        x.beginPath(); x.moveTo(c + 9.6, c + 13.6); x.lineTo(c + 12.4, c + 16.3); x.lineTo(c + 17.4, c + 10.6);
        x.lineWidth = 2; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = "#fff"; x.stroke();
      }
      s = SPR[key] = { cv: cv, size: size, r: r };
      return s;
    }
    function drawDot(ctx, p, o) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, o.radius, 0, 7);
      ctx.globalAlpha = o.fillOpacity;
      ctx.fillStyle = o.fillColor;
      ctx.fill();
      ctx.globalAlpha = o.opacity;
      ctx.lineWidth = o.weight;
      ctx.strokeStyle = o.color;
      ctx.stroke();
    }
    function putSprite(ctx, sp, p) { ctx.globalAlpha = 1; ctx.drawImage(sp.cv, p.x - sp.size / 2, p.y - sp.size / 2, sp.size, sp.size); }
    function drawPins(ctx, b) {
      drawn = [];
      if (!map) { return; }
      var nw = map.layerPointToLatLng(b.min.subtract([40, 40])), se = map.layerPointToLatLng(b.max.add([40, 40]));
      var n = nw.lat, w = nw.lng, s = se.lat, e = se.lng, near = isNear();
      if (atMax()) { drawKids(ctx, n, w, s, e); return; }
      var lv = [[], [], [], [], []];
      units.forEach(function (u) {
        if (!u.vis.length || u.lat > n || u.lat < s || u.lng < w || u.lng > e) { return; }
        var st = unitState(u), v = shown(u), multi = v.length > 1;
        // 描く順：口コミの少ないピン → ふつう → 口コミの多いピン → 強調 → 選んだピン（あとに描くほど上）
        lv[st.sel ? 4 : st.hot ? 3 : !multi && rkOf(v[0]) === 1 ? 2 : !multi && rkOf(v[0]) === 3 ? 0 : 1].push([u, st]);
      });
      lv.forEach(function (list) {
        list.forEach(function (x) {
          var u = x[0], st = x[1], p = map.latLngToLayerPoint([u.lat, u.lng]);
          if (near) {
            var sp = pinSprite(pinLook(u, st));
            putSprite(ctx, sp, p);
            drawn.push([u, p.x, p.y, sp.r + 10, null]);  // 外側の輪と、指で押すときのゆとり
          } else {
            var o = unitStyle(u, st);
            drawDot(ctx, p, o);
            drawn.push([u, p.x, p.y, o.radius + 6, null]);
          }
        });
      });
      ctx.globalAlpha = 1;
    }
    function drawKids(ctx, n, w, s, e) {
      // いちばん拡大したときは、重なったピンを少しずつずらし、もとの位置まで線を引く
      var lay = spreadLayout(), sel = selId(), list = [];
      pins.forEach(function (it) {
        var q = lay.pos[it.id];
        if (!q || !visSet[it.id] || q.lat > n || q.lat < s || q.lng < w || q.lng > e) { return; }
        list.push([it, q, map.latLngToLayerPoint([it.lat, it.lng]), map.latLngToLayerPoint([q.lat, q.lng])]);
      });
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      list.forEach(function (x) {
        if (!x[1].moved) { return; }
        ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.moveTo(x[2].x, x[2].y); ctx.lineTo(x[3].x, x[3].y); ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(x[2].x, x[2].y, 3, 0, 7); ctx.fill();
      });
      list.sort(function (x, y) { return (x[0].id === sel) - (y[0].id === sel); });
      list.forEach(function (x) {
        var k = { members: [x[0]], vis: [x[0]] }, sp = pinSprite(pinLook(k, unitState(k)));
        putSprite(ctx, sp, x[3]);
        drawn.push([null, x[3].x, x[3].y, sp.r + 10, x[0]]);
      });
      ctx.globalAlpha = 1;
    }
    function pinHit(e) {
      if (!map || !drawn.length) { return null; }
      var pt = map.mouseEventToLayerPoint(e);
      for (var k = drawn.length - 1; k >= 0; k--) {
        var d = drawn[k], dx = d[1] - pt.x, dy = d[2] - pt.y;
        if (dx * dx + dy * dy <= d[3] * d[3]) { return d; }
      }
      return null;
    }
    function hookPins() {
      var pane = map.getPane("mapPane"), tip = null, hov = null, raf = 0, last = null, touchy = false;
      // 指で押したあとにも mousemove が来るので、指のときは名前の表示を出さない
      mapEl.addEventListener("pointerdown", function (e) { touchy = e.pointerType === "touch"; }, true);
      function tipOff() { if (tip) { map.closeTooltip(tip); tip = null; } hov = null; }
      mapEl.addEventListener("click", function (e) {
        if (!(e.target === mapEl || pane.contains(e.target)) || (map.dragging && map.dragging.moved())) { return; }
        var d = pinHit(e);
        if (!d) { return; }
        e.stopPropagation();
        e.preventDefault();
        tipOff();
        if (d[4]) { select(d[4].id, { fromMap: true }); } else { pickAt(d[0]); }
      }, true);
      mapEl.addEventListener("mousemove", function (e) {
        last = e;
        if (raf) { return; }
        raf = L.Util.requestAnimFrame(function () {
          raf = 0;
          var d = last && (last.target === mapEl || pane.contains(last.target)) && !map._animatingZoom && !(map.dragging && map.dragging.moving()) ? pinHit(last) : null;
          var key = d ? (d[4] ? "s" + d[4].id : d[0].key) : null;
          mapEl.style.cursor = d ? "pointer" : "";
          if (key === hov) { return; }
          tipOff();
          hov = key;
          if (d && !touchy) {
            tip = L.tooltip({ direction: "top", offset: [0, -Math.round(d[3] - 3)], opacity: 0.95 })
              .setLatLng(map.layerPointToLatLng(L.point(d[1], d[2]))).setContent(esc(d[4] ? d[4].name : unitTitle(d[0])));
            map.openTooltip(tip);
          }
        });
      });
      mapEl.addEventListener("mouseleave", function () { tipOff(); mapEl.style.cursor = ""; });
      map.on("movestart zoomstart", tipOff);
    }
    var PinCanvas = map ? L.Canvas.extend({
      _initContainer: function () {
        var c = this._container = document.createElement("canvas");
        c.style.pointerEvents = "none";
        this._ctx = c.getContext("2d");
      },
      _destroyContainer: function () {
        L.Util.cancelAnimFrame(this._redrawRequest);
        delete this._ctx;
        L.DomUtil.remove(this._container);
        delete this._container;
      },
      _updatePaths: function () {
        if (this._postponeUpdatePaths) { return; }
        this._redrawBounds = null;
        this._redraw();
      },
      _draw: function () {
        if (!this._map || !this._bounds) { return; }
        this._ctx.save();
        drawPins(this._ctx, this._bounds);
        this._ctx.restore();
      },
      redraw: function () {
        if (this._map && !this._redrawRequest) {
          this._redrawBounds = null;
          this._redrawRequest = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
      },
    }) : null;
    if (map) {
      ringLayer = L.layerGroup().addTo(map);
      courseLayer = L.layerGroup().addTo(map);
      var pinPane = map.createPane("itbxPins");
      pinPane.style.zIndex = 590;
      pinPane.style.pointerEvents = "none";
      Object.keys(CATS).forEach(function (c) { svgImg(CATS[c].icon); });
      pinLayer = new PinCanvas({ pane: "itbxPins", padding: 0.3 }).addTo(map);
      hookPins();
      map.on("moveend", function () { syncPins(); });
      map.on("moveend", debounce(function () {
        if (S.rings && ringMode() === "center") { drawRings(); } else { buildRail(); }
      }, 180));
    }
    function isNear() { return map.getZoom() >= NEAR_ZOOM; }
    function syncDots() { if (pinLayer) { pinLayer.redraw(); } }
    function syncPins() {
      if (!map) { return; }
      stage.classList.toggle("is-far", !isNear());
      if (pinLayer) { pinLayer.redraw(); }
    }
    var SPREAD = !!(CFG.groupZoom && map), SPREAD_D = 36, kidOf = {}, layout = null;
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
      var pts = list.map(function (it) { return [it.lat, it.lng]; }), pd = mapPad();
      if (pts.length === 1) { viewPoint(pts[0][0], pts[0][1], 15); return; }
      map.fitBounds(pts, { paddingTopLeft: [pd.l, pd.t], paddingBottomRight: [pd.r, pd.b], maxZoom: 15 });
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
    function countAreas() {
      // 区（市）ごと・町名ごとの件数。区ごとのファイルのときは、目次（idx.json）にある全体の数
      townCount = {};
      areaCount = {};
      if (X) {
        X.files.forEach(function (f) { areaCount[f[1]] = f[2]; f[4].forEach(function (t) { townCount[f[1] + "/" + t[0]] = t[1]; }); });
        return;
      }
      items.forEach(function (it) {
        var k = it.area + "/" + it.town;
        areaCount[it.area] = (areaCount[it.area] || 0) + 1;
        townCount[k] = (townCount[k] || 0) + 1;
      });
    }
    countAreas();
    function fileOfArea(a) {
      if (!X) { return null; }
      for (var k = 0; k < X.files.length; k++) { if (X.files[k][1] === a) { return X.files[k]; } }
      return null;
    }
    function areaList() { return X ? X.files.map(function (f) { return f[1]; }) : AREAS.filter(function (a) { return areaCount[a]; }); }
    function townsOf(a) {
      var f = fileOfArea(a);
      if (f) { return f[4].map(function (t) { return t[0]; }); }
      return Object.keys(townCount).filter(function (k) { return k.indexOf(a + "/") === 0; }).map(function (k) { return k.slice(a.length + 1); })
        .sort(function (x, y) { return (x === a + "内") - (y === a + "内") || kana(x).localeCompare(kana(y), "ja"); });
    }
    function townLabel(a, t) { return t === a + "内" ? "町名の記載がない場所" : t; }
    var areaOpts = '<option value="">エリア：すべて</option>' + areaList().map(function (a) {
      return '<option value="' + esc(a) + '">' + esc(a) + "（" + areaCount[a] + "）</option>";
    }).join("");
    var PURPS = CFG.purposes, PURP = {};
    PURPS.forEach(function (p) { PURP[p.key] = p; });
    function inPurp(it, p) { return p.tags ? p.tags.some(function (t) { return it.has(t); }) : p.cats.indexOf(it.cat) !== -1; }
    function purpOf(it) {
      var i;
      for (i = 0; i < PURPS.length; i++) { if (!PURPS[i].tags && inPurp(it, PURPS[i])) { return PURPS[i].key; } }
      for (i = 0; i < PURPS.length; i++) { if (inPurp(it, PURPS[i])) { return PURPS[i].key; } }
      return "";
    }
    PURPS.forEach(function (p) { p.n = X && X.pn && typeof X.pn[p.key] === "number" ? X.pn[p.key] : items.filter(function (it) { return inPurp(it, p); }).length; });
    var CO_PURP = (PURPS.filter(function (p) { return p.co; })[0] || {}).key || "";
    function nWord(p) { return p.n.toLocaleString("ja-JP") + (p.unit || "か所"); }
    chips.innerHTML = PURPS.map(function (p) {
      return '<button type="button" class="c-purp" data-act="purp" data-key="' + p.key + '" aria-pressed="false" aria-label="' + esc(p.label + "（" + p.name + "・" + nWord(p) + "）") +
        '" title="' + esc(p.name) + '" style="--c:' + p.color + '"><span class="c-purp-ic">' + icon(p.icon) + '</span><span class="c-purp-l">' + esc(p.label) + '</span><span class="c-purp-s">' + esc(p.short) + "</span></button>";
    }).join("");
    legend.innerHTML = '<button type="button" class="c-chip is-mine" data-act="course" aria-pressed="false">' + icon("flag") + '自分のコース<span class="c-chip-n c-course-n">0</span></button>';
    // 最初の画面：目的を選ぶまで、地図にピンを出さない
    var homeEl = document.createElement("div");
    homeEl.className = "c-home";
    homeEl.setAttribute("role", "group");
    homeEl.setAttribute("aria-label", "目的を選ぶ");
    homeEl.innerHTML = '<p class="c-home-h">何をしに行きますか？</p><div class="c-home-grid">' + PURPS.map(function (p) {
      return '<button type="button" class="c-homebtn' + (p.wide ? " is-wide" : "") + '" data-act="purp" data-key="' + p.key + '" style="--c:' + p.color + '"><span class="c-home-ic">' + icon(p.icon) + "</span><b>" + esc(p.label) + '</b><span class="c-home-n">' + esc(p.pre || "") + nWord(p) + "</span></button>";
    }).join("") + '</div><p class="c-home-f">名前や駅名で探すときは、右上の虫めがねを押してください。</p>';
    stage.appendChild(homeEl);
    function curPurp() { return S.purp ? PURP[S.purp] || null : null; }
    function atHome() { return !S.purp && !S.ws.length && !S.tag && !S.hint && !S.cond; }
    function setPurp(key) {
      S.purp = key; S.kind = ""; S.presets = []; S.cond = ""; S.tag = ""; S.hint = null;
      if (!key) { S.area = ""; S.town = ""; }
    }
    function kindMatch(it, k) { var t = k.charAt(0); return t === "c" ? it.cat === k.slice(2) : t === "s" ? it.sub === k.slice(2) : it.has(k.slice(2)); }
    function kindOk(it) { return kindMatch(it, S.kind); }
    function kindValid(k) { var p = curPurp(); return !!p && p.kinds.some(function (x) { return x[0] === k; }); }
    function kindName(k) { var p = curPurp() || PURP[CFG.tutPurp], x = p.kinds.filter(function (y) { return y[0] === k; })[0]; return x ? x[1] : ""; }
    function countVis() { var k = 0; for (var id in visSet) { if (visSet[id]) { k++; } } return k; }
    function unitWord() { var p = curPurp(); return p && p.unit ? p.unit : "か所"; }

    var condsEl = $(".c-conds"), condSels = [];
    stage.classList.add("has-conds");
    var kindsEl = document.createElement("div");
    kindsEl.className = "c-kinds";
    kindsEl.setAttribute("role", "group");
    kindsEl.setAttribute("aria-label", "種類で絞る");
    kindsEl.hidden = true;
    condsEl.parentNode.insertBefore(kindsEl, condsEl);
    var coN = {};
    items.forEach(function (it) { it.tags.forEach(function (t) { if (facet(t) === "運営会社") { coN[label(t)] = (coN[label(t)] || 0) + 1; } }); });
    var coOpts = Object.keys(coN).sort(function (a, b) { return coN[b] - coN[a] || a.localeCompare(b, "ja"); }).map(function (v) {
      return '<option value="co:' + esc(v) + '">' + esc(v) + "（" + coN[v] + "）</option>";
    }).join("");
    condsEl.innerHTML =
      '<button type="button" class="c-chip c-count" data-act="clear" hidden><b class="c-count-n"></b><span class="c-count-u">か所</span>' + icon("close") + '<span class="c-vh">条件を外して、最初の画面に戻る</span></button>' +
      '<button type="button" class="c-chip is-tagf" data-act="untag" hidden>' + icon("tag") + '<span class="c-tagf-t"></span>' + icon("close") + "</button>" +
      PRESETS.map(function (p) {
        return '<button type="button" class="c-chip c-cond" data-act="preset" data-key="' + p.key + '" aria-pressed="false"' + (p.title ? ' title="' + esc(p.title) + '"' : "") + ">" +
          icon(p.icon) + "<span>" + esc(p.label) + '</span><span class="c-chip-n"></span></button>';
      }).join("") +
      '<label class="c-chip c-selchip c-condsel c-cochip" hidden>' + icon("shop") + '<select class="c-csel" data-k="co" aria-label="運営会社で絞る"><option value="">運営会社</option>' + coOpts + "</select></label>" +
      '<label class="c-chip c-selchip c-areachip">' + icon("pin") + '<select class="c-areasel" aria-label="区・市で絞り込む">' + areaOpts + "</select></label>" +
      '<label class="c-chip c-selchip c-townchip" hidden><select class="c-townsel" aria-label="町名で絞り込む"></select></label>';
    var areaSel = $(".c-areasel", condsEl), coChip = $(".c-cochip", condsEl), townSel = $(".c-townsel", condsEl), townChip = $(".c-townchip", condsEl), townFor = null;
    function fillTowns() {
      // 2段目：選んだ区（市）の町名
      if (townFor === S.area) { return; }
      townFor = S.area;
      townSel.innerHTML = S.area ? '<option value="">' + esc(S.area) + "の町名：すべて</option>" + townsOf(S.area).map(function (t) {
        return '<option value="' + esc(t) + '">' + esc(townLabel(S.area, t)) + "（" + (townCount[S.area + "/" + t] || 0) + "）</option>";
      }).join("") : "";
    }
    function fillCo() {
      // 運営会社の選択肢を、読み込んだ場所から作り直す
      var s = $('.c-csel[data-k="co"]', condsEl);
      if (!s) { return; }
      var n = {}, v = s.value;
      items.forEach(function (it) { it.tags.forEach(function (t) { if (facet(t) === "運営会社") { n[label(t)] = (n[label(t)] || 0) + 1; } }); });
      s.innerHTML = '<option value="">運営会社</option>' + Object.keys(n).sort(function (a, b) { return n[b] - n[a] || a.localeCompare(b, "ja"); }).map(function (x) {
        return '<option value="co:' + esc(x) + '">' + esc(x) + "（" + n[x] + "）</option>";
      }).join("");
      s.value = v;
    }
    condSels = $$(".c-csel", condsEl);
    condSels.forEach(function (s) {
      s.addEventListener("change", function () {
        S.cond = s.value || "";
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        condToast();
      });
    });
    function condToast() { if (S.cond) { toast(condSay(S.cond, countVis())); } }
    var rowSig = null;
    function paintTop(n, f) {
      var p = curPurp(), home = atHome(), plain = !S.ws.length && !S.tag && !S.hint;
      stage.classList.toggle("is-home", home);
      $$(".c-purp", chips).forEach(function (b) { b.setAttribute("aria-pressed", S.purp === b.getAttribute("data-key") ? "true" : "false"); });
      var kinds = p && plain ? p.kinds : [];
      kindsEl.hidden = kinds.length < 2;
      stage.classList.toggle("has-kinds", !kindsEl.hidden);
      var sig = p ? p.key : "";
      if (sig !== rowSig) {
        // 目的が変わったときだけ、種類のボタンと条件の並びを作り直す（条件は当てはまる場所の多い順）
        rowSig = sig;
        kindsEl.innerHTML = p && p.kinds.length >= 2 ? '<button type="button" class="c-chip c-kind" data-act="kind" data-key="" aria-pressed="true">すべて<span class="c-chip-n"></span></button>' +
          p.kinds.map(function (k) {
            return '<button type="button" class="c-chip c-kind" data-act="kind" data-key="' + esc(k[0]) + '" aria-pressed="false" title="' + esc(k[3] || k[1]) + '">' + esc(k[1]) + '<span class="c-chip-n"></span></button>';
          }).join("") : "";
        kindsEl.scrollLeft = 0;
        var base = p ? items.filter(function (it) { return inPurp(it, p); }) : [];
        var allow = p && p.conds ? p.conds : null, ord = {};
        PRESETS.map(function (q) { var k = 0; for (var i = 0; i < base.length; i++) { if (q.test(base[i])) { k++; } } return { key: q.key, n: k }; })
          .filter(function (e) { return e.n > 0 && e.n < base.length && (!allow || allow.indexOf(e.key) !== -1); })
          .sort(function (a, b) { return b.n - a.n; }).slice(0, CFG.condMax || 5)
          .forEach(function (e, i) { ord[e.key] = i + 1; });
        $$(".c-cond", condsEl).forEach(function (b) { var o = ord[b.getAttribute("data-key")]; b.style.order = o || 90; b.setAttribute("data-show", o ? "1" : "0"); });
        coChip.hidden = !(p && p.co);
        condsEl.scrollLeft = 0;
      }
      if (!kindsEl.hidden) {
        var kc = {}, all = 0;
        items.forEach(function (it) {
          if (!pass(it, false, false, true)) { return; }
          all++;
          for (var i = 0; i < kinds.length; i++) { if (kindMatch(it, kinds[i][0])) { kc[kinds[i][0]] = (kc[kinds[i][0]] || 0) + 1; } }
        });
        $$(".c-kind", kindsEl).forEach(function (b) {
          var key = b.getAttribute("data-key"), on = S.kind === key, k = key ? kc[key] || 0 : all;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          $(".c-chip-n", b).textContent = k;
          b.classList.toggle("is-zero", k === 0 && !on);
        });
      }
      condsEl.hidden = home || !!S.ws.length;
      var cnt = $(".c-count", condsEl);
      cnt.hidden = !f;
      $(".c-count-n", cnt).textContent = n;
      $(".c-count-u", cnt).textContent = unitWord();
      var tf = $(".is-tagf", condsEl);
      tf.hidden = !S.tag;
      if (S.tag) { $(".c-tagf-t", tf).textContent = tagText(S.tag); }
      // 条件の件数は、選んでいる条件を外したときの件数（条件は1つずつ選ぶので）
      var pool = p && plain ? items.filter(function (it) { return pass(it, false, false, false, true); }) : [];
      $$(".c-cond", condsEl).forEach(function (b) {
        var key = b.getAttribute("data-key"), act = S.presets.indexOf(key) !== -1, k = 0, t = PRESET[key].test;
        for (var i = 0; i < pool.length; i++) { if (t(pool[i])) { k++; } }
        b.hidden = !(act || (p && plain && b.getAttribute("data-show") === "1"));
        b.setAttribute("aria-pressed", act ? "true" : "false");
        $(".c-chip-n", b).textContent = k;
        b.classList.toggle("is-zero", k === 0 && !act);
      });
      var co = S.cond.indexOf("co:") === 0;
      condSels.forEach(function (s) { s.value = co ? S.cond : ""; s.parentNode.classList.toggle("is-on", co); });
      areaSel.value = S.area || "";
      areaSel.parentNode.classList.toggle("is-on", !!S.area);
      fillTowns();
      townSel.value = S.town || "";
      townChip.hidden = !S.area;
      townChip.classList.toggle("is-on", !!S.town);
      appTop(home, n, f);
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
    function gkey(it) { return it.area + "/" + it.town; }
    var groups = [], grpOf = {}, rowEl = {}, grpEl = {}, wardEl = {}, listOn0 = null;
    function wardLoaded(a) { var f = fileOfArea(a); return !f || !!LOADED[f[0]]; }
    function grpHTML(g) {
      return '<details class="c-grp" data-area="' + esc(g.area) + '">' +
        '<summary class="c-grp-h"><span class="c-grp-name">' + esc(g.label) + '</span><span class="c-grp-n"><b>' + g.n + "</b>件</span>" +
        '<span class="c-grp-prog">行った <b>0</b>/' + g.n + '</span><span class="c-grp-bar" aria-hidden="true"><i></i></span>' + icon("chevron", "c-grp-chev") + "</summary>" +
        '<section class="c-sub"><ul class="c-rows"></ul></section></details>';
    }
    function hookGrp(el) {
      grpEl[el.getAttribute("data-area")] = el;
      el.addEventListener("toggle", function () { if (el.open) { buildRows(grpOf[el.getAttribute("data-area")]); } });
    }
    function mkGrp(a, t) {
      var g = { area: a + "/" + t, ward: a, town: t, label: townLabel(a, t), n: townCount[a + "/" + t] || 0, ids: [], built: false };
      groups.push(g);
      grpOf[g.area] = g;
      return g;
    }
    (function buildGroups() {
      var h = "";
      areaList().forEach(function (a) {
        var inner = townsOf(a).map(function (t) { return grpHTML(mkGrp(a, t)); }).join("");
        h += '<details class="c-ward" data-ward="' + esc(a) + '"><summary class="c-ward-h"><span class="c-ward-name">' + esc(a) + '</span><span class="c-ward-n"></span>' +
          icon("chevron", "c-grp-chev") + '</summary><div class="c-ward-body">' + inner + "</div></details>";
      });
      groupsEl.innerHTML = h;
      $$(".c-grp", groupsEl).forEach(hookGrp);
      $$(".c-ward", groupsEl).forEach(function (el) {
        var a = el.getAttribute("data-ward");
        wardEl[a] = el;
        el.addEventListener("toggle", function () { if (el.open && !wardLoaded(a)) { ensureArea(a, function () { apply(false); }); } });
      });
    })();
    function listAdd(list) {
      var touched = {};
      list.forEach(function (it) {
        var g = grpOf[gkey(it)];
        if (!g) {
          g = mkGrp(it.area, it.town);
          var w = wardEl[it.area];
          if (!w) { return; }
          $(".c-ward-body", w).insertAdjacentHTML("beforeend", grpHTML(g));
          hookGrp($(".c-ward-body", w).lastElementChild);
        }
        g.ids.push(it.id);
        touched[g.area] = g;
      });
      Object.keys(touched).forEach(function (k) {
        var g = touched[k];
        if (!X) { g.n = g.ids.length; }
        if (g.built) { g.built = false; buildRows(g); }
      });
    }
    function buildRows(g) {
      if (!g || g.built) { return; }
      var el = grpEl[g.area], ul = el && $(".c-rows", el);
      if (!ul) { return; }
      if (!wardLoaded(g.ward)) {
        ul.innerHTML = '<li class="c-rows-wait">読み込んでいます…</li>';
        ensureArea(g.ward, function () { buildRows(g); });
        return;
      }
      g.built = true;
      var list = g.ids.map(function (id) { return byId[id]; }).filter(Boolean).sort(sortKey);
      ul.innerHTML = list.map(rowHTML).join("");
      $$(".c-row", ul).forEach(function (r) {
        var id = r.getAttribute("data-id");
        rowEl[id] = r;
        r.hidden = listOn0 ? !listOn0[id] : false;
      });
      paintFavs();
      paintWent();
      paintDist();
    }
    listAdd(items);

    // ---- 区ごとのファイルを、地図に映っている区の分だけ読み込む ----
    var LOADED = X ? X.loaded || {} : {}, LOADING = {};
    function loadCodes(codes, cb) {
      var want = codes.filter(function (c, i) { return !LOADED[c] && codes.indexOf(c) === i; });
      if (!want.length) { if (cb) { cb(); } return; }
      Promise.all(want.map(function (c) {
        if (!LOADING[c]) { LOADING[c] = getJSON("d/" + c + ".json").then(function (j) { return j.items || []; }, function () { delete LOADING[c]; return null; }); }
        return LOADING[c].then(function (list) { return [c, list]; });
      })).then(function (parts) {
        var add = [];
        parts.forEach(function (p) { if (p[1] && !LOADED[p[0]]) { LOADED[p[0]] = 1; add = add.concat(p[1]); } });
        if (add.length) { addChunk(add); }
        if (cb) { cb(); }
      });
    }
    function ensureArea(a, cb) {
      var f = a ? fileOfArea(a) : null;
      if (f) { loadCodes([f[0]], cb); } else if (cb) { cb(); }
    }
    function ensureIds(ids, cb) {
      var miss = ids.filter(function (id) { return !byId[id]; });
      if (!X || !miss.length) { cb(); return; }
      codesOfIds(X, miss).then(function (codes) { loadCodes(codes, cb); });
    }
    function ensureView() {
      if (!X || !map) { return; }
      var b = map.getBounds().pad(0.15), s = b.getSouth(), w = b.getWest(), n = b.getNorth(), e = b.getEast();
      loadCodes(X.files.filter(function (f) { return boxHit(f[3], s, w, n, e); }).map(function (f) { return f[0]; }));
    }
    var VOCAB = null, QTX = null;
    function ensureQuery() {
      // 検索：目次から、言葉に当てはまる場所のある区を読み込む（種類やタグの言葉のときは、全部の区）
      if (!X || !S.ws.length) { return; }
      var ws = S.ws.slice(), sig = ws.join(" ");
      qIndex().then(function (Q) {
        if (S.ws.join(" ") !== sig) { return; }
        if (!VOCAB) {
          VOCAB = norm(Object.keys(CATS).map(function (c) { return CATS[c].name; })
            .concat(Object.keys(M.subs).map(function (k) { return M.subs[k]; }), TAGS.map(function (t) { return label(t); })).join(" "));
          QTX = Q.q.map(function (e) { return norm(e[2] + " " + e[3] + " " + AREAS[e[1]]); });
        }
        var alts = ws.map(function (w) { return SYN[w] || [w]; }), codes = {};
        if (alts.some(function (al) { return al.some(function (a) { return VOCAB.indexOf(a) !== -1; }); })) {
          X.files.forEach(function (f) { codes[f[0]] = 1; });
        } else {
          Q.q.forEach(function (e, k) {
            if (!alts.every(function (al) { return al.some(function (a) { return QTX[k].indexOf(a) !== -1; }); })) { return; }
            var f = fileOfArea(AREAS[e[1]]);
            if (f) { codes[f[0]] = 1; }
          });
        }
        loadCodes(Object.keys(codes), function () { if (S.ws.join(" ") === sig) { apply(true); } });
      });
    }
    function addChunk(raw) {
      var add = [];
      raw.forEach(function (o) {
        if (byId[o.i]) { return; }
        var it = mkItem(o, items.length);
        items.push(it);
        byId[it.id] = it;
        add.push(it);
      });
      if (!add.length) { return; }
      add.forEach(addText);
      add.forEach(addBadges);
      var np = add.filter(function (it) { return it.pin; });
      np.forEach(function (it) { pins.push(it); });
      addUnits(np);
      PRESETS.forEach(function (p) { p.n = items.filter(p.test).length; });
      if (!X) { countAreas(); }
      listAdd(add);
      fillCo();
      apply(false);
      drawCourse();
    }

    function linkWord(it) { return it.ul || (it.has("情報源:公式ページ未確認") ? "案内ページ" : "公式ページ"); }
    function wpUrl(t) { return "https://ja.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_")); }
    // 観光スポットの写真と説明（kanko_more.json）。観光スポットを初めて開いたときに読み込む
    var KKM = null, KKM_P = null;
    function kkMore() {
      if (!KKM_P) {
        KKM_P = fetch(BASE + "kanko_more.json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
          .then(function (j) { KKM = j && j.v === 1 && j.items ? j.items : {}; return KKM; });
      }
      return KKM_P;
    }
    function kkTarget(it) { return it.kk || it.pk || it.tags.some(function (t) { return t.indexOf("観光:") === 0; }); }
    function kkThumb(p, w, host) {
      var base = "https://" + (host || "upload") + ".wikimedia.org/wikipedia/commons/", dir = p[0].charAt(0) + "/" + p[0] + "/";
      return w && w < p[2] ? base + "thumb/" + dir + p[1] + "/" + w + "px-" + (p[8] || p[1]) : base + dir + p[1];
    }
    function kkPhotoHTML(it, x) {
      var p = x.p, ws = [500, 960].filter(function (w) { return w < p[2]; });
      var set = ws.map(function (w) { return kkThumb(p, w) + " " + w + "w"; });
      if (ws.length < 2) { set.push(kkThumb(p, 0) + " " + p[2] + "w"); }
      var page = "https://commons.wikimedia.org/wiki/File:" + p[1];
      return '<figure class="c-photo"><a href="' + esc(page) + '" target="_blank" rel="noopener" aria-label="' + esc(it.name) + 'の写真をWikimedia Commonsで見る（新しいタブ）">' +
        '<img src="' + esc(kkThumb(p, ws[0] || 0)) + '" srcset="' + esc(set.join(", ")) + '" sizes="(min-width: 700px) 420px, 100vw" width="' + p[2] + '" height="' + p[3] + '"' +
        ' alt="' + esc(it.name) + 'の写真" loading="lazy" decoding="async"' + (p[7] ? ' data-fb="' + esc(kkThumb(p, p[7], "thumb")) + '"' : "") + "></a>" +
        "<figcaption>写真：" + esc(p[4]) + "（" + (p[6] ? '<a href="' + esc(p[6]) + '" target="_blank" rel="noopener">' + esc(p[5]) + "</a>" : esc(p[5])) + "）／" +
        '<a href="' + esc(page) + '" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>';
    }
    function kkAboutHTML(it, x) {
      var t = x.w || it.wp;
      return '<div class="c-about"><p>' + esc(x.d) + '</p><p class="c-about-src"><a href="' + esc(wpUrl(t)) + '" target="_blank" rel="noopener">ウィキペディアで続きを読む</a>' +
        "<span>出典：ウィキペディア「" + esc(t) + '」の冒頭（<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja" target="_blank" rel="noopener">CC BY-SA 4.0</a>）</span></p></div>';
    }
    function kkPart(it, kind) {
      if (!kkTarget(it)) { return ""; }
      if (KKM === null) {
        kkMore().then(kkFill);
        return '<div class="c-kkm" data-kkm="' + kind + '" data-id="' + esc(it.id) + '"></div>';
      }
      var x = KKM[it.id];
      if (!x) { return ""; }
      return kind === "photo" ? (x.p ? kkPhotoHTML(it, x) : "") : (x.d ? kkAboutHTML(it, x) : "");
    }
    function kkHasAbout(it) { return !!(KKM && kkTarget(it) && KKM[it.id] && KKM[it.id].d); }
    function kkFill() {
      $$(".c-kkm", root).forEach(function (el) {
        var it = byId[el.getAttribute("data-id")], kind = el.getAttribute("data-kkm"), h = it ? kkPart(it, kind) : "";
        if (h && kind === "about") {
          var lead = el.parentNode.querySelector(".c-lead");
          if (lead) { lead.parentNode.removeChild(lead); }
        }
        if (h) { el.insertAdjacentHTML("afterend", h); }
        el.parentNode.removeChild(el);
      });
    }
    function kkSrcHTML(it) {
      var a = [];
      it.ks.forEach(function (k) {
        if (k === "wd" && it.wd) {
          a.push('<a href="https://www.wikidata.org/wiki/' + esc(it.wd) + '" target="_blank" rel="noopener">Wikidata</a>（CC0）');
        } else if (k === "wp" && it.wp) {
          a.push('<a href="' + esc(wpUrl(it.wp)) + '" target="_blank" rel="noopener">ウィキペディア「' + esc(it.wp) + "」</a>");
        } else if (typeof k === "number" && KK.src[k]) {
          var s = KK.src[k];
          a.push('<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a>" +
            (s.lic ? "（" + (s.licUrl ? '<a href="' + esc(s.licUrl) + '" target="_blank" rel="noopener">' + esc(s.lic) + "</a>" : esc(s.lic)) + "、加工して掲載）" : ""));
        }
      });
      var h = "東京23区の観光スポットとして、" + jdate(KK.made || M.date) + "に集めた情報です。" + (a.length ? "出典：" + a.join("、") + "。" : "");
      if (it.approx && it.pin) { h += "地図の位置は、住所から出した位置です。"; }
      return '<div class="c-src">' + icon("info") + "<p>" + h + "</p></div>";
    }
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
      if (it.kk) { return kkSrcHTML(it); }
      if (it.nosrc) {
        if (it.ofc) {
          return '<div class="c-src">' + icon("info") + "<p>" + (it.ofc === 3 ? "店名と住所" : it.ofc === 2 ? "設備" : "営業時間と設備") + "は、" + jdate(it.checked) + "にチェーンの公式の店舗ページで確かめた情報です。" +
            (it.approx && it.pin ? "地図の位置は、住所の近くの番地や駅から出したおおよその位置です。" : "") +
            (it.url ? '出典：<a href="' + esc(it.url) + '" target="_blank" rel="noopener">公式ページ</a>。' : "") + "</p></div>";
        }
        if (it.os) {
          return '<div class="c-src">' + icon("info") + "<p>OpenStreetMapに登録されている店です（" + jdate(it.checked) + "時点）。ジャンルは店名と登録内容から分けました。" +
            (it.approx && it.pin ? "地図の位置は、住所から出したおおよその位置です。" : "") +
            '出典：<a href="https://www.openstreetmap.org/' + esc(it.os) + '" target="_blank" rel="noopener">OpenStreetMap</a>' +
            '（© OpenStreetMap contributors、<a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener">ODbL</a>）。</p></div>';
        }
        if (it.md) {
          return '<div class="c-src">' + icon("info") + "<p>厚生労働省の食品衛生申請等システムで、" + jdate(it.md) +
            "に営業許可を受けた店です。ジャンルは店名から分けました。" + (it.approx && it.pin ? "地図の位置は、住所から出したおおよその位置です。" : "") +
            '出典：<a href="https://ifas.mhlw.go.jp/faspub/_link.do" target="_blank" rel="noopener">食品衛生申請等システム</a>（厚生労働省）のオープンデータ。</p></div>';
        }
        if (it.kd && CFG.kyokaUrl) {
          return '<div class="c-src">' + icon("info") + "<p>板橋区の食品営業許可施設一覧で、" + jdate(it.kd) +
            "に営業許可を受けた店です。ジャンルは店名" + (it.kn ? "" : "や店の紹介ページ") + "から分けました。" + (it.approx && it.pin ? "地図の位置は、住所から出したおおよその位置です。" : "") +
            '出典：<a href="' + esc(CFG.kyokaUrl) + '" target="_blank" rel="noopener">板橋区公式ホームページ</a>。</p></div>';
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
      if (it.kk && it.wp) { a.push('<a class="c-act" href="' + esc(wpUrl(it.wp)) + '" target="_blank" rel="noopener">' + icon("book") + "ウィキペディア</a>"); }
      if (it.gm) { a.push('<a class="c-act" href="' + esc(it.gm) + '" target="_blank" rel="noopener">' + icon("pin") + "gMap施設情報</a>"); }
      if (tel) { a.push('<a class="c-act" href="tel:' + esc(tel[1]) + '">' + icon("phone") + "電話</a>"); }
      a.push('<a class="c-act" href="' + esc(routeHref(it)) + '" target="_blank" rel="noopener">' + icon("route") + "経路</a>");
      if (it.pin) { a.push('<button type="button" class="c-act" data-act="rtto" data-id="' + it.id + '">' + icon("train") + "都営で行く</button>"); }
      a.push('<button type="button" class="c-act c-fav" data-act="fav" data-id="' + it.id + '" aria-pressed="false">' + icon("star") + "<span>コースに入れる</span></button>");
      a.push('<button type="button" class="c-act c-went" data-act="went" data-id="' + it.id + '" aria-pressed="false">' + icon("check") + "<span>行った</span></button>");
      a.push('<button type="button" class="c-act" data-act="share" data-id="' + it.id + '" aria-label="' + esc(it.name) + 'のリンクを共有">' + icon("share") + "</button>");
      return '<div class="c-item-acts">' + a.join("") + "</div>";
    }
    function detailHTML(it, ctx) {
      var h = kkPart(it, "photo"), flags = "";
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
      h += kkPart(it, "about");
      if (it.rk) {
        h += '<p class="c-rk is-rk' + it.rk[0] + '"><b>口コミ：' + ["", "多い", "ふつう", "少ない"][it.rk[0]] + '</b><span>Googleマップの口コミ ' + it.rv + "件</span></p>";
      }
      if (it.official) { h += '<p class="c-official">公式の名前：' + esc(it.official) + "</p>"; }
      if (!it.pin && !it.sameAs) { h += '<p class="c-item-nomap">地図に載せる位置の情報がありません。「経路」は名前と住所で探します。</p>'; }
      if (it.lead && !kkHasAbout(it)) { h += '<p class="c-lead">' + rich(it.lead) + "</p>"; }
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
    function pass(it, skipCats, skipCond, skipKind, skipPreset) {
      var k, h = hint();
      if (S.ws.length) {
        // 検索は、目的や条件にかかわらず全部の場所から探す
        for (k = 0; k < S.ws.length; k++) { if (!match(it, S.ws[k])) { return false; } }
        return true;
      }
      if (h) { return h.ids.indexOf(it.id) !== -1; }
      if (S.area && it.area !== S.area) { return false; }
      if (S.town && it.town !== S.town) { return false; }
      if (S.tag && !it.has(S.tag)) { return false; }
      if (!skipPreset) { for (k = 0; k < S.presets.length; k++) { if (!PRESET[S.presets[k]].test(it)) { return false; } } }
      if (!skipCats && S.purp && !inPurp(it, PURP[S.purp])) { return false; }
      if (!skipCats && !skipKind && S.kind && !kindOk(it)) { return false; }
      if (!skipCond && S.cond && !condFn(S.cond)(it)) { return false; }
      return true;
    }
    function filtering() { return !!(S.purp || S.ws.length || S.area || S.town || S.tag || S.presets.length || S.kind || S.hint || S.cond); }
    function visible() { return items.filter(function (it) { return visSet[it.id]; }); }
    function apply(fit) {
      if (atHome() && (S.area || S.town || S.presets.length || S.kind)) { S.area = ""; S.town = ""; S.presets = []; S.kind = ""; }
      var home = atHome(), listOn = {};
      visSet = {};
      if (S.cond === "now") { nowInfo(); }
      var n = 0, np = 0, nl = 0;
      items.forEach(function (it) {
        var on = pass(it, false);
        if (on) { listOn[it.id] = true; nl++; }
        if (on && !home) { visSet[it.id] = true; n++; if (it.pin) { np++; } }
        var r = rowEl[it.id];
        if (r) { r.hidden = !on; }
      });
      refreshUnits();
      syncDots();
      syncPins();
      var f = filtering();
      listOn0 = listOn;
      var wardK = {};
      groups.forEach(function (g) {
        var el = grpEl[g.area], k = 0, ld = wardLoaded(g.ward);
        if (!el) { return; }
        g.ids.forEach(function (id) { if (listOn[id]) { k++; } });
        if (!ld) { k = f ? 0 : g.n; }
        wardK[g.ward] = (wardK[g.ward] || 0) + k;
        el.hidden = k === 0;
        $(".c-grp-n b", el).textContent = k;
        if (f && k && nl <= 80) { el.open = true; if (wardEl[g.ward]) { wardEl[g.ward].open = true; } }
        if (g.built) { $$(".c-sub", el).forEach(function (s) { s.hidden = !$$(".c-row", s).some(function (x) { return !x.hidden; }); }); }
      });
      Object.keys(wardEl).forEach(function (a) {
        // 読み込んでいない区は、閉じたまま出しておく（開くと読み込む）
        var w = wardEl[a], ld = wardLoaded(a), k = wardK[a] || 0;
        w.hidden = ld && k === 0;
        w.classList.toggle("is-wait", !ld);
        $(".c-ward-n", w).innerHTML = ld || !f ? "<b>" + k + "</b>件" : "開くと読み込みます";
      });
      $(".c-index-count").innerHTML = home ? "全" + (X ? X.n.all : items.length) + "件（地図には、目的を選ぶとピンが出ます）" : "条件に合う場所 <b>" + n + "</b>件（地図に載っているのは" + np + "件）";
      $(".c-index-empty").hidden = nl > 0;
      paintSearch();
      paintTop(n, f);
      if (selId() && !visSet[selId()]) { closePanel(); }
      if (fit) {
        var vp = visible().filter(function (it) { return it.pin; });
        if (vp.length) { fitTo(vp); } else if (n) { toast("条件に合う" + n + "件は、地図に位置がない場所です。一覧で見られます。"); }
      }
      if (S.rings) { drawRings(); } else { paintDist(); buildRail(); }
      saveHash();
    }
    function showFor(it) {
      // 地図に出ていない場所を選んだときは、その場所の目的に切り替える
      S.q = ""; S.ws = []; qIn.value = "";
      setPurp(purpOf(it));
      S.area = ""; S.town = "";
      apply(false);
    }
    function clearFilters(keepQ) {
      if (!keepQ) { S.q = ""; S.ws = []; qIn.value = ""; }
      S.area = ""; S.town = ""; S.tag = ""; S.presets = []; S.hint = null; S.hidden = []; S.purp = ""; S.kind = ""; S.cond = "";
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
      if (atHome()) { rail.innerHTML = ""; cards = {}; return; }
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
      var rb = $('[data-act="rt"]', stage);
      if (rb) { rb.setAttribute("aria-pressed", S.panel && S.panel.type === "route" ? "true" : "false"); }
      stage.classList.toggle("has-rt", !!S.panel && S.panel.type === "route");
      $('.c-chip[data-act="course"]', legend).setAttribute("aria-pressed", own ? "true" : "false");
    }
    function showPanel(p, html) {
      var prev = selId();
      if (p.type !== "route") { rtLeave(); }
      if (p.type !== "item") { S.back = null; }
      S.panel = p;
      sheet.innerHTML = html;
      sheet.hidden = false;
      stage.classList.add("has-sheet");
      if (narrow()) { setSnap(PS.snap === "full" ? "full" : "half"); } else { pcOpen(true); }
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
      rtLeave();
      S.panel = null;
      S.back = null;
      sheet.hidden = true;
      sheet.innerHTML = "";
      stage.classList.remove("has-sheet");
      if (narrow()) { setSnap(PS.base || (atHome() ? "half" : "peek")); }
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
      var W = stage.clientWidth, H = stage.clientHeight, pd = mapPad();
      var xv = (pd.l + W - pd.r) / 2, yv = (pd.t + H - pd.b) / 2;
      var p = map.project([lat, lng], z).add([Math.round(W / 2 - xv), Math.round(H / 2 - yv)]);
      map.setView(map.unproject(p, z), z);
    }
    function select(id, opt) {
      var it = byId[id];
      if (!it) {
        if (X && !(opt && opt.retry)) {
          var o2 = { retry: true };
          for (var k0 in (opt || {})) { o2[k0] = opt[k0]; }
          ensureIds([id], function () { if (byId[id]) { select(id, o2); } });
        }
        return;
      }
      opt = opt || {};
      if (!it.pin) { openRow(it, true); return; }
      var ids = courseIds();
      var back = ids && ids.indexOf(id) !== -1 ? (S.panel.type === "item" ? S.back : S.panel) : null;
      var pk = S.panel && S.panel.type === "pick" ? S.panel : S.panel && S.panel.type === "item" && S.back && S.back.type === "pick" ? S.back : null;
      if (!back && pk && pk.ids.indexOf(id) !== -1) { back = pk; }
      if (!visSet[id]) { showFor(it); }
      S.back = back;
      openItem(it, opt.label);
      pinClass(id, "is-sel", true);
      if (pinLayer) { pinLayer.redraw(); }
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
      var g0 = grpOf[gkey(it)];
      if (g0) {
        if (wardEl[g0.ward]) { wardEl[g0.ward].open = true; }
        buildRows(g0);
      }
      var r = rowEl[it.id];
      if (!r) { return; }
      if (scroll && root.classList.contains("is-app")) {
        if (S.panel) { closePanel(); }
        if (narrow()) { setSnap("full"); } else { pcOpen(true); }
      }
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
    function openCourse(shared, refit, again) {
      var own = !shared;
      var ids = own ? favs : shared;
      if (X && !again && ids.some(function (id) { return !byId[id]; })) { ensureIds(ids, function () { openCourse(shared, refit, true); }); return; }
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
      $(".c-stat-went").textContent = Object.keys(went).filter(function (id) { return X || byId[id]; }).length;
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
    var TR = null, trBusy = false, trWait = [], TR_KEYS = ["l", "s", "b"], ST_ZOOM = 14, BUS_ZOOM = 15, LBL_ZOOM = 15;
    var trOn = store.get(KEY.tr, {});
    if (!trOn || typeof trOn !== "object" || Array.isArray(trOn)) { trOn = {}; }
    var trLineU = null, trLineO = null, trSt = [], trBus = [], trStG = null, trBusG = null, trLblG = null, trAttr = false;
    var trLR = null, trLR2 = null, trPtR = null, trGot = { r: {}, b: {} }, trTB = {}, trFailAt = 0, trSoon = 0;
    function trAny() { return TR_KEYS.some(function (k) { return !!trOn[k]; }); }
    function trLL(y, x) { return L.latLng((TR.o[0] + y) / 1e5, (TR.o[1] + x) / 1e5); }
    function trLoad(done) {
      if (TR) { done(); return; }
      if (!map) { return; }
      trWait.push(done);
      if (trBusy) { return; }
      trBusy = true;
      fetch(BASE + "tr/i.json").then(function (r) { if (!r.ok) { throw new Error("tr"); } return r.json(); }).then(function (j) {
        TR = j;
        trBusy = false;
        trBuild();
        var w = trWait;
        trWait = [];
        w.forEach(function (f) { f(); });
      }, function () { trBusy = false; trWait = []; toast("鉄道とバス停のデータを読み込めませんでした"); });
    }
    function trBuild() {
      ["itbxTrL", "itbxTrL2", "itbxTrP", "itbxTrT"].forEach(function (name, k) {
        var pane = map.createPane(name);
        pane.style.zIndex = [350, 351, 450, 460][k];
        if (k !== 2) { pane.style.pointerEvents = "none"; }
      });
      trLR = L.canvas({ pane: "itbxTrL", padding: 0.5 });
      trLR2 = L.canvas({ pane: "itbxTrL2", padding: 0.5 });
      trPtR = L.canvas({ pane: "itbxTrP", padding: 0.3, tolerance: 5 });
      trLineU = L.layerGroup();
      trLineO = L.layerGroup();
      trStG = L.layerGroup().addTo(map);
      trBusG = L.layerGroup().addTo(map);
      trLblG = L.layerGroup().addTo(map);
      map.on("moveend", trSync);
      map.on("resize", trAttrH);
    }
    // 区画（"行_列"）の範囲
    function trBox(kind, k) {
      var id = kind + k;
      if (!trTB[id]) {
        var p = k.split("_"), r = Number(p[0]), c = Number(p[1]), o = TR.o, sz = kind === "r" ? TR.rt : TR.bt;
        trTB[id] = L.latLngBounds([(o[0] + r * sz[0]) / 1e5, (o[1] + c * sz[1]) / 1e5], [(o[0] + (r + 1) * sz[0]) / 1e5, (o[1] + (c + 1) * sz[1]) / 1e5]);
      }
      return trTB[id];
    }
    // 映っている範囲に掛かる区画のうち、まだ読んでいないものを読む
    function trNeed(kind, b) {
      (kind === "r" ? TR.r : TR.b).forEach(function (k) {
        if (!trGot[kind][k] && trBox(kind, k).intersects(b)) { trGet(kind, k); }
      });
    }
    function trGet(kind, k) {
      trGot[kind][k] = 1;
      fetch(BASE + "tr/" + kind + "/" + k + ".json").then(function (r) { if (!r.ok) { throw new Error("tr"); } return r.json(); }).then(function (j) {
        if (kind === "r") { trAddR(j); } else { trAddB(j); }
        if (!trSoon) { trSoon = setTimeout(function () { trSoon = 0; trSync(); }, 60); }
      }, function () {
        delete trGot[kind][k];
        if (Date.now() - trFailAt > 15000) { trFailAt = Date.now(); toast("鉄道とバス停のデータの一部を読み込めませんでした"); }
      });
    }
    function trAddR(j) {
      (j.g || []).forEach(function (a) {
        var ln = TR.L[a[0]], y = a[1], x = a[2], ll = [trLL(y, x)];
        for (var i = 3; i < a.length; i += 2) { y += a[i]; x += a[i + 1]; ll.push(trLL(y, x)); }
        trLineU.addLayer(L.polyline(ll, { renderer: trLR, color: "#ffffff", weight: 6.5, opacity: 0.8, interactive: false, lineCap: "round", lineJoin: "round" }));
        trLineO.addLayer(L.polyline(ll, { renderer: trLR2, color: ln[1], weight: 3.5, opacity: 1, interactive: false, dashArray: ln[2] ? "8 6" : null, lineCap: ln[2] ? "butt" : "round", lineJoin: "round" }));
      });
      (j.s || []).forEach(function (s) {
        var o = { ll: trLL(s[1], s[2]), m: null, lb: null };
        o.mk = function (key) {
          if (key === "lb") {
            return L.marker(o.ll, { pane: "itbxTrT", interactive: false, keyboard: false,
              icon: L.divIcon({ className: "c-tr-lbl", html: "<span>" + esc(s[0]) + "</span>", iconSize: [0, 0] }) });
          }
          var names = [];
          s[3].forEach(function (k) { var n = TR.L[k] ? TR.L[k][0] : ""; if (n && names.indexOf(n) === -1) { names.push(n); } });
          var m = L.circleMarker(o.ll, { renderer: trPtR, radius: 6, color: "#1f2a24", weight: 2.5, fillColor: "#ffffff", fillOpacity: 1, bubblingMouseEvents: false });
          m.bindTooltip("<b>" + esc(s[0]) + (s[4] ? "停留場" : "駅") + "</b><br>" + esc(names.join("、")), { direction: "top", offset: [0, -7], className: "c-tr-tip" });
          return m;
        };
        trSt.push(o);
      });
    }
    function trAddB(j) {
      (j.b || []).forEach(function (s) {
        var o = { ll: trLL(s[1], s[2]), m: null };
        o.mk = function () {
          var ops = (s[3] || []).map(function (k) { return TR.bo[k]; }), rts = s[4] || [];
          var m = L.circleMarker(o.ll, { renderer: trPtR, radius: 4.5, color: "#ffffff", weight: 1.5, fillColor: "#c2410c", fillOpacity: 1, bubblingMouseEvents: false });
          m.bindTooltip("<b>" + esc(s[0]) + "</b>（バス停）" + (ops.length ? "<br>" + esc(ops.join("、")) : "") +
            (rts.length ? '<br><span class="c-tr-rts">' + esc(rts.join("、")) + (s[5] ? "ほか" + s[5] + "系統" : "") + "</span>" : ""), { direction: "top", offset: [0, -5], className: "c-tr-tip" });
          return m;
        };
        trBus.push(o);
      });
    }
    function trPut(list, key, on, b, group) {
      list.forEach(function (o) {
        var want = on && b.contains(o.ll), m = o[key];
        if (want) {
          if (!m) { m = o[key] = o.mk(key); }
          if (!group.hasLayer(m)) { group.addLayer(m); }
        } else if (m && group.hasLayer(m)) {
          group.removeLayer(m);
        }
      });
    }
    function trSync() {
      if (!TR || !map) { return; }
      var z = map.getZoom(), view = map.getBounds(), b = view.pad(0.3);
      var ln = !!trOn.l, st = !!trOn.s && z >= ST_ZOOM, bus = !!trOn.b && z >= BUS_ZOOM;
      if (ln || st) { trNeed("r", b); }
      if (bus) { trNeed("b", b); }
      [trLineU, trLineO].forEach(function (g) {
        if (ln && !map.hasLayer(g)) { g.addTo(map); }
        if (!ln && map.hasLayer(g)) { map.removeLayer(g); }
      });
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

    // ---- 都営交通だけで行く経路案内 ----
    // 時刻表：東京都交通局・公共交通オープンデータセンターのGTFS（CC BY 4.0）を toei.json に縮めたもの
    var TO = null, toWait = null, toDays = {}, toDayKeys = [], rtLayer = null, rtBar = null;
    var RT = { from: null, to: null, mode: "dep", date: "", time: "", res: null, sel: 0, pick: "", edit: "", q: "", sug: [], busy: "", msg: "", compact: false };
    var EP = [3, 2, 1, 0];               // 乗り場まで・乗り場からの分（地下鉄・ライナー・路面電車・バス）
    var CHG = [2, 2, 2, 1];              // 同じ駅・停留所での乗り換えの分
    var ACC_M = 1000, RAIL_M = 2000, FOOT_M = 500, RT_K = 6, RT_INF = 1e9, LONG_WALK = 15;
    function toWalk(m) { return Math.max(1, Math.round(m * 1.3 / 80)); }
    function rtHM(t) { return Math.floor(t / 60) % 24 + ":" + pad(t % 60); }
    function rtDur(d) { return d >= 60 ? Math.floor(d / 60) + "時間" + (d % 60 ? d % 60 + "分" : "") : d + "分"; }
    function rtMin(s) { var p = String(s || "").split(":"); return p.length >= 2 ? Number(p[0]) * 60 + Number(p[1]) : 0; }
    function rtDate(ds, add) {
      var d = new Date(Date.UTC(Number(ds.slice(0, 4)), Number(ds.slice(5, 7)) - 1, Number(ds.slice(8, 10)) + (add || 0)));
      return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
    }
    function rtNowSet() {
      var d = new Date();
      RT.date = today();
      RT.time = pad(d.getHours()) + ":" + pad(d.getMinutes());
    }
    var KR = { "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o", "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko", "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
      "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to", "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no", "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
      "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo", "や": "ya", "ゆ": "yu", "よ": "yo", "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro", "わ": "wa", "を": "o", "ん": "n",
      "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go", "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo", "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
      "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo", "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po", "ゔ": "vu", "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o" };
    function kr(s) {
      var out = "", dbl = false;
      for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i), y = s.charAt(i + 1), r = KR[c];
        if (c === "っ") { dbl = true; continue; }
        if (!r) { if (c !== "ー") { out += c; } dbl = false; continue; }
        if ((y === "ゃ" || y === "ゅ" || y === "ょ") && r.slice(-1) === "i") {
          var v = { "ゃ": "a", "ゅ": "u", "ょ": "o" }[y];
          r = /^(shi|chi|ji)$/.test(r) ? r.slice(0, -1) + v : r.slice(0, -1) + "y" + v;
          i++;
        }
        if (dbl) { out += r.slice(0, 2) === "ch" ? "t" : r.charAt(0); dbl = false; }
        out += r;
      }
      return out;
    }
    function rk(s) { return String(s || "").toLowerCase().replace(/[^a-z]/g, "").replace(/m(?=[bmp])/g, "n").replace(/ou/g, "o").replace(/oo/g, "o").replace(/uu/g, "u"); }
    function toLoad() {
      if (TO) { return Promise.resolve(TO); }
      if (!toWait) {
        toWait = fetch(BASE + "toei.json").then(function (r) { if (!r.ok) { throw new Error("toei"); } return r.json(); })
          .then(function (j) { TO = toPrep(j); return TO; }, function (e) { toWait = null; throw e; });
      }
      return toWait;
    }
    function toPrep(j) {
      var n = j.stops.length / 4, lat = new Float64Array(n), lng = new Float64Array(n), nm = new Int32Array(n), kd = new Uint8Array(n), i, k;
      for (i = 0; i < n; i++) {
        nm[i] = j.stops[4 * i];
        lat[i] = (j.o[0] + j.stops[4 * i + 1]) / 1e5;
        lng[i] = (j.o[1] + j.stops[4 * i + 2]) / 1e5;
        kd[i] = j.stops[4 * i + 3];
      }
      var GY = 0.005, GX = 0.006, grid = {};
      for (i = 0; i < n; i++) {
        var gk = Math.floor(lat[i] / GY) + ":" + Math.floor(lng[i] / GX);
        (grid[gk] || (grid[gk] = [])).push(i);
      }
      // 乗り換えで歩ける駅・停留所の組（直線500m以内）
      var kx = Math.cos(35.7 * Math.PI / 180) * 111320, ky = 110574, off = new Int32Array(n + 1), to = [], w = [];
      for (i = 0; i < n; i++) {
        off[i] = to.length;
        var gy = Math.floor(lat[i] / GY), gx = Math.floor(lng[i] / GX);
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            var c = grid[(gy + dy) + ":" + (gx + dx)];
            if (!c) { continue; }
            for (k = 0; k < c.length; k++) {
              var q = c[k];
              if (q === i) { continue; }
              var ex = (lng[q] - lng[i]) * kx, ey = (lat[q] - lat[i]) * ky, d = Math.sqrt(ex * ex + ey * ey);
              if (d <= FOOT_M) { to.push(q); w.push(toWalk(d) + Math.ceil((EP[kd[i]] + EP[kd[q]]) / 2) + 1); }
            }
          }
        }
      }
      off[n] = to.length;
      // 名前で選ぶための駅・停留所の一覧
      var lineAt = [], ents = [], byKey = {};
      for (i = 0; i < n; i++) { lineAt.push([]); }
      j.pats.forEach(function (p) { p[1].forEach(function (s) { if (lineAt[s].indexOf(p[0]) === -1) { lineAt[s].push(p[0]); } }); });
      for (i = 0; i < n; i++) {
        var name = j.names[nm[i]], rail = kd[i] < 3, key = (rail ? "r:" : "b:") + name, e = byKey[key];
        if (e && meters({ lat: e.lat0, lng: e.lng0 }, { lat: lat[i], lng: lng[i] }) > 1500) {
          key += ":" + Math.round(lat[i] * 50) + ":" + Math.round(lng[i] * 50);
          e = byKey[key];
        }
        if (!e) {
          e = byKey[key] = { name: name, rail: rail, ss: [], lines: [], lat0: lat[i], lng0: lng[i], kana: j.kana[nm[i]] || "", tram: false };
          ents.push(e);
        }
        e.ss.push(i);
        if (kd[i] === 2) { e.tram = true; }
        lineAt[i].forEach(function (li) { if (e.lines.indexOf(li) === -1) { e.lines.push(li); } });
      }
      ents.forEach(function (e) {
        var y = 0, x = 0;
        e.ss.forEach(function (s) { y += lat[s]; x += lng[s]; });
        e.lat = y / e.ss.length;
        e.lng = x / e.ss.length;
        e.title = e.name + (e.rail && !e.tram && !/駅$/.test(e.name) ? "駅" : "");
        var labs = e.lines.map(function (li) { return j.lines[li][0]; });
        e.sub = e.rail ? labs.join("・") : "都バス " + labs.slice(0, 4).join("・") + (labs.length > 4 ? "ほか" : "");
        e.key = norm(e.name);
        e.kkey = norm(e.kana);
        e.rkey = rk(e.kkey ? kr(e.kkey) : (j.en && j.en[nm[e.ss[0]]]) || "");
      });
      return { j: j, n: n, lat: lat, lng: lng, nm: nm, kd: kd, grid: grid, GY: GY, GX: GX, fpOff: off, fpTo: new Int32Array(to), fpW: new Int32Array(w), ents: ents };
    }
    // その日に走る便だけで、追い越しのない系統の組を作る
    function toDay(si) {
      if (toDays[si]) { return toDays[si]; }
      var j = TO.j, act = {}, rs = [], i, k;
      j.sets[si].forEach(function (s) { act[s] = 1; });
      j.pats.forEach(function (P, pi) {
        var seq = P[1], vecs = P[2], hs = P[3], fl = P[4], nop = P[5] || [], n = seq.length, w = hs.length > 1 ? 4 : 3, t = 0, trips = [];
        for (k = 0; k < fl.length; k += w) {
          t += fl[k];
          if (!act[fl[k + 2]]) { continue; }
          var v = vecs[fl[k + 1]], a = new Int32Array(n), d = new Int32Array(n), c = t;
          a[0] = d[0] = t;
          for (i = 1; i < n; i++) { var e = v[i - 1], hop = e % 100; a[i] = c + hop; d[i] = a[i] + (e - hop) / 100; c = d[i]; }
          trips.push({ a: a, d: d, h: w === 4 ? hs[fl[k + 3]] : hs[0] });
        }
        if (!trips.length) { return; }
        var groups = [];
        trips.forEach(function (tr) {
          for (var g = 0; g < groups.length; g++) {
            var last = groups[g][groups[g].length - 1], ok = true;
            for (i = 0; i < n; i++) { if (tr.a[i] < last.a[i] || tr.d[i] < last.d[i]) { ok = false; break; } }
            if (ok) { groups[g].push(tr); return; }
          }
          groups.push([tr]);
        });
        groups.forEach(function (g) { rs.push({ p: pi, li: P[0], seq: seq, nop: nop, trips: g }); });
      });
      var nR = rs.length, nS = TO.n, rSeq = new Int32Array(nR + 1), rTrip = new Int32Array(nR + 1), rTime = new Int32Array(nR + 1), rLine = new Int32Array(nR);
      var tS = 0, tT = 0, tX = 0;
      rs.forEach(function (r, x) {
        rSeq[x] = tS; rTrip[x] = tT; rTime[x] = tX; rLine[x] = r.li;
        tS += r.seq.length; tT += r.trips.length; tX += r.seq.length * r.trips.length;
      });
      rSeq[nR] = tS; rTrip[nR] = tT; rTime[nR] = tX;
      var seq = new Int32Array(tS), nop = new Uint8Array(tS), arr = new Int32Array(tX), dep = new Int32Array(tX), head = new Int32Array(tT), cnt = new Int32Array(nS + 1);
      rs.forEach(function (r, x) {
        var n = r.seq.length, b = rSeq[x];
        for (i = 0; i < n; i++) { seq[b + i] = r.seq[i]; cnt[r.seq[i] + 1]++; }
        r.nop.forEach(function (q) { nop[b + q] = 1; });
        r.trips.forEach(function (tr, y) { var o = rTime[x] + y * n; arr.set(tr.a, o); dep.set(tr.d, o); head[rTrip[x] + y] = tr.h; });
      });
      for (i = 0; i < nS; i++) { cnt[i + 1] += cnt[i]; }
      var srR = new Int32Array(tS), srPos = new Int32Array(tS), fill = cnt.slice(0, nS);
      rs.forEach(function (r, x) { for (i = 0; i < r.seq.length; i++) { var z = fill[r.seq[i]]++; srR[z] = x; srPos[z] = i; } });
      var D = { nR: nR, rSeq: rSeq, rTrip: rTrip, rTime: rTime, rLine: rLine, seq: seq, nop: nop, arr: arr, dep: dep, head: head, srOff: cnt, srR: srR, srPos: srPos };
      toDays[si] = D;
      toDayKeys.push(si);
      if (toDayKeys.length > 3) { delete toDays[toDayKeys.shift()]; }
      return D;
    }
    function rtChg(s) { return CHG[TO.kd[s]]; }
    function rtFoot(a, b) {
      if (a === b) { return rtChg(a); }
      for (var f = TO.fpOff[a]; f < TO.fpOff[a + 1]; f++) { if (TO.fpTo[f] === b) { return TO.fpW[f]; } }
      return RT_INF;
    }
    // RAPTOR：乗った回数ごとに、いちばん早く着く経路
    function toRaptor(D, A, t0, B) {
      var nS = TO.n, INF = RT_INF, k, i, x;
      var tauV = [null], tauR = [new Int32Array(nS).fill(INF)], pv = [null], pr = [new Int32Array(nS).fill(-1)];
      var best = new Int32Array(nS).fill(INF), bestR = new Int32Array(nS).fill(INF), isM = new Uint8Array(nS), marked = [];
      var eg = new Int32Array(nS).fill(-1), tgt = INF, found = [];
      A.forEach(function (a) {
        var t = t0 + a.w;
        if (t < tauR[0][a.s]) { tauR[0][a.s] = t; bestR[a.s] = t; if (!isM[a.s]) { isM[a.s] = 1; marked.push(a.s); } }
      });
      B.forEach(function (b) { if (eg[b.s] < 0 || b.w < eg[b.s]) { eg[b.s] = b.w; } });
      var Q = new Int32Array(D.nR).fill(-1);
      for (k = 1; k <= RT_K && marked.length; k++) {
        var tv = new Int32Array(nS).fill(INF), tr = new Int32Array(nS).fill(INF), pvk = new Int32Array(nS * 4), prk = new Int32Array(nS).fill(-1), prev = tauR[k - 1];
        tauV.push(tv); tauR.push(tr); pv.push(pvk); pr.push(prk);
        var routes = [];
        for (i = 0; i < marked.length; i++) {
          var p = marked[i];
          isM[p] = 0;
          for (x = D.srOff[p]; x < D.srOff[p + 1]; x++) {
            var r0 = D.srR[x], ps = D.srPos[x];
            if (Q[r0] < 0) { Q[r0] = ps; routes.push(r0); } else if (ps < Q[r0]) { Q[r0] = ps; }
          }
        }
        marked = [];
        var vm = [];
        for (i = 0; i < routes.length; i++) {
          var r = routes[i], s0 = D.rSeq[r], n = D.rSeq[r + 1] - s0, m = D.rTrip[r + 1] - D.rTrip[r], tb = D.rTime[r], t = -1, bp = -1;
          for (var q = Q[r]; q < n; q++) {
            var st = D.seq[s0 + q];
            if (t >= 0) {
              var a = D.arr[tb + t * n + q];
              if (a < best[st] && a < tgt) {
                if (tv[st] === INF) { vm.push(st); }
                tv[st] = a; best[st] = a;
                pvk[st * 4] = r; pvk[st * 4 + 1] = t; pvk[st * 4 + 2] = bp; pvk[st * 4 + 3] = q;
              }
            }
            var rr = prev[st];
            if (rr < INF && q < n - 1 && !D.nop[s0 + q] && (t < 0 || rr <= D.dep[tb + t * n + q])) {
              var lo = 0, hi = t < 0 ? m : t;
              while (lo < hi) { var mid = (lo + hi) >> 1; if (D.dep[tb + mid * n + q] >= rr) { hi = mid; } else { lo = mid + 1; } }
              if (lo < (t < 0 ? m : t)) { t = lo; bp = q; }
            }
          }
          Q[r] = -1;
        }
        for (i = 0; i < vm.length; i++) {
          var p2 = vm[i], v = tv[p2], c = v + rtChg(p2);
          if (eg[p2] >= 0 && v + eg[p2] < tgt) { tgt = v + eg[p2]; found[k] = p2; }
          if (c < tr[p2] && c < bestR[p2]) { tr[p2] = c; bestR[p2] = c; prk[p2] = p2; if (!isM[p2]) { isM[p2] = 1; marked.push(p2); } }
          for (var f = TO.fpOff[p2]; f < TO.fpOff[p2 + 1]; f++) {
            var q2 = TO.fpTo[f], c2 = v + TO.fpW[f];
            if (c2 < tr[q2] && c2 < bestR[q2]) { tr[q2] = c2; bestR[q2] = c2; prk[q2] = p2; if (!isM[q2]) { isM[q2] = 1; marked.push(q2); } }
          }
        }
      }
      return { pv: pv, pr: pr, found: found };
    }
    function rtTimes(D, rd) {
      var n = D.rSeq[rd.r + 1] - D.rSeq[rd.r], o = D.rTime[rd.r] + rd.t * n;
      rd.dep = D.dep[o + rd.bp];
      rd.arr = D.arr[o + rd.ap];
    }
    function rtBuild(D, res, k, A, B) {
      var p = res.found[k], rides = [], kk;
      for (kk = k; kk >= 1; kk--) {
        var b4 = p * 4, rd = { r: res.pv[kk][b4], t: res.pv[kk][b4 + 1], bp: res.pv[kk][b4 + 2], ap: res.pv[kk][b4 + 3] };
        rd.bs = D.seq[D.rSeq[rd.r] + rd.bp];
        rd.as = D.seq[D.rSeq[rd.r] + rd.ap];
        rides.unshift(rd);
        if (kk > 1) { p = res.pr[kk - 1][rd.bs]; if (p < 0) { return null; } }
      }
      var acc = null, egr = null, i;
      A.forEach(function (a) { if (a.s === rides[0].bs && (!acc || a.w < acc.w)) { acc = a; } });
      B.forEach(function (b) { if (b.s === rides[rides.length - 1].as && (!egr || b.w < egr.w)) { egr = b; } });
      if (!acc || !egr) { return null; }
      rides.forEach(function (rd) { rtTimes(D, rd); });
      // 着く時刻は変えずに、できるだけ遅く出る便へ寄せる
      for (i = rides.length - 2; i >= 0; i--) {
        var a0 = rides[i], b0 = rides[i + 1], limit = b0.dep - rtFoot(a0.as, b0.bs);
        var n = D.rSeq[a0.r + 1] - D.rSeq[a0.r], m = D.rTrip[a0.r + 1] - D.rTrip[a0.r], tb = D.rTime[a0.r], lo = a0.t, hi = m - 1;
        while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (D.arr[tb + mid * n + a0.ap] <= limit) { lo = mid; } else { hi = mid - 1; } }
        a0.t = lo;
        rtTimes(D, a0);
      }
      var walk = acc.w + egr.w, maxW = Math.max(acc.w, egr.w);
      for (i = 0; i + 1 < rides.length; i++) {
        if (rides[i].as !== rides[i + 1].bs) { var fw = rtFoot(rides[i].as, rides[i + 1].bs); walk += fw; maxW = Math.max(maxW, fw); }
      }
      return {
        rides: rides, acc: acc, eg: egr, dep: rides[0].dep - acc.w, arr: rides[rides.length - 1].arr + egr.w, walk: walk, maxW: maxW,
        key: rides.map(function (rd) { return rd.r + "." + rd.t + "." + rd.bp + "." + rd.ap; }).join("|"),
      };
    }
    function rtQuery(D, A, B, t0) {
      var res = toRaptor(D, A, t0, B), out = [];
      for (var k = 1; k <= RT_K; k++) {
        if (res.found[k] == null) { continue; }
        var jn = rtBuild(D, res, k, A, B);
        if (jn) { out.push(jn); }
      }
      return out;
    }
    function rtTidy(list) {
      var seen = {}, out = [];
      list.forEach(function (x) { if (!seen[x.key]) { seen[x.key] = 1; out.push(x); } });
      out = out.filter(function (y) {
        return !out.some(function (x) {
          if (x === y) { return false; }
          var ge = x.dep >= y.dep && x.arr <= y.arr && x.rides.length <= y.rides.length && x.walk <= y.walk;
          var gt = x.dep > y.dep || x.arr < y.arr || x.rides.length < y.rides.length || x.walk < y.walk;
          return ge && (gt || x.key < y.key);
        });
      });
      out.sort(function (a, b) { return a.arr - b.arr || a.rides.length - b.rides.length || b.dep - a.dep; });
      return out.slice(0, 4);
    }
    function rtSearchDep(D, A, B, t0) {
      var all = [], t = t0;
      for (var g = 0; g < 3; g++) {
        var js = rtQuery(D, A, B, t);
        if (!js.length) { break; }
        all = all.concat(js);
        if (rtTidy(all).length >= 3) { break; }
        t = Math.min.apply(null, js.map(function (x) { return x.dep; })) + 1;
      }
      return rtTidy(all);
    }
    function rtSearchArr(D, A, B, T) {
      function ok(d) { return rtQuery(D, A, B, d).filter(function (x) { return x.arr <= T; }); }
      var lo = T - 240, hi = T;
      if (!ok(lo).length) { lo = T - 600; if (!ok(lo).length) { return []; } }
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (ok(mid).length) { lo = mid; } else { hi = mid; } }
      return rtTidy(ok(lo));
    }
    function rtNear(pt) {
      var out = [], gy = Math.floor(pt.lat / TO.GY), gx = Math.floor(pt.lng / TO.GX), s, i;
      for (var dy = -4; dy <= 4; dy++) {
        for (var dx = -4; dx <= 4; dx++) {
          var c = TO.grid[(gy + dy) + ":" + (gx + dx)];
          if (!c) { continue; }
          for (i = 0; i < c.length; i++) {
            s = c[i];
            var m = meters(pt, { lat: TO.lat[s], lng: TO.lng[s] });
            if (m <= ACC_M || (TO.kd[s] < 3 && m <= RAIL_M)) { out.push({ s: s, m: m }); }
          }
        }
      }
      if (!out.length) {
        var all = [];
        for (s = 0; s < TO.n; s++) { all.push({ s: s, m: meters(pt, { lat: TO.lat[s], lng: TO.lng[s] }) }); }
        all.sort(function (a, b) { return a.m - b.m; });
        out = all.slice(0, 6).filter(function (a) { return a.m <= 8000; });
      }
      out.forEach(function (a) { a.w = (a.m < 50 ? 0 : toWalk(a.m)) + EP[TO.kd[a.s]]; });
      return out;
    }
    // 運行日：toei.json の期間の外は、同じ曜日の種類（平日・土曜・日曜休日）の日で代える
    function rtType(ds) {
      var d = new Date(Date.UTC(Number(ds.slice(0, 4)), Number(ds.slice(5, 7)) - 1, Number(ds.slice(8, 10)))), wd = d.getUTCDay(), mo = d.getUTCMonth() + 1, dd = d.getUTCDate();
      if (wd === 0 || TO.j.hol.indexOf(ds.replace(/-/g, "")) !== -1 || (mo === 12 && dd >= 30) || (mo === 1 && dd <= 3)) { return 2; }
      return wd === 6 ? 1 : 0;
    }
    function rtSet(ds) {
      var r = rtSet0(ds), e = TO.j.ends && TO.j.ends.t;
      if (e && ds.replace(/-/g, "") > e) {
        r.note = (r.note ? r.note : "") + "地下鉄・都電・日暮里・舎人ライナーの時刻表は" + Number(e.slice(0, 4)) + "年" + Number(e.slice(4, 6)) + "月" + Number(e.slice(6, 8)) + "日までのため、その先はいまのダイヤで案内しています。ダイヤが変わると実際と異なります。";
      }
      return r;
    }
    function rtSet0(ds) {
      var j = TO.j, d0 = j.d0.slice(0, 4) + "-" + j.d0.slice(4, 6) + "-" + j.d0.slice(6, 8);
      var k = Math.round((Date.UTC(Number(ds.slice(0, 4)), Number(ds.slice(5, 7)) - 1, Number(ds.slice(8, 10))) - Date.UTC(Number(d0.slice(0, 4)), Number(d0.slice(5, 7)) - 1, Number(d0.slice(8, 10)))) / 864e5);
      if (k >= 0 && k < j.cal.length) { return { si: j.cal[k], note: "" }; }
      var ty = rtType(ds), x;
      if (k < 0) {
        for (x = 0; x < j.cal.length - 1; x++) { if (rtType(rtDate(d0, x)) === ty) { break; } }
        return { si: j.cal[x], note: "過去の日付のため、いまの時刻表の同じ曜日のダイヤで案内しています。" };
      }
      for (x = j.cal.length - 1; x > 0; x--) { if (rtType(rtDate(d0, x)) === ty) { break; } }
      return { si: j.cal[x], note: "時刻表データの期間より先の日付のため、同じ曜日のダイヤで案内しています。ダイヤが変わると実際と異なります。" };
    }
    function rtRun(mode, ds, t) {
      var A = rtNear(RT.from), B = rtNear(RT.to), list = [], sd = ds, ss, D;
      if (!A.length || !B.length) {
        RT.res = { list: [], none: !A.length ? "from" : "to", ds: ds, mode: mode, t: t };
        return;
      }
      if (t < 180) {
        ss = rtSet(rtDate(ds, -1));
        D = toDay(ss.si);
        list = mode === "dep" ? rtSearchDep(D, A, B, t + 1440) : rtSearchArr(D, A, B, t + 1440);
        if (list.length) { sd = rtDate(ds, -1); }
      }
      if (!list.length) {
        sd = ds;
        ss = rtSet(ds);
        D = toDay(ss.si);
        list = mode === "dep" ? rtSearchDep(D, A, B, t) : rtSearchArr(D, A, B, t);
      }
      RT.res = { D: D, list: list, note: ss.note, ds: sd, mode: mode, t: t, walkM: meters(RT.from, RT.to) };
      RT.sel = 0;
    }
    function rtGo(mode, ds, t) {
      if (!RT.from || !RT.to) {
        RT.edit = !RT.from ? "from" : "to";
        rtPaintForm(true);
        return;
      }
      if (!RT.date) { rtNowSet(); }
      mode = mode || RT.mode;
      ds = ds || RT.date;
      t = t == null ? rtMin(RT.time) : t;
      RT.busy = TO ? "経路を調べています" : "時刻表を読み込んでいます";
      RT.msg = "";
      RT.edit = "";
      rtPaintForm();
      rtPaintRes();
      toLoad().then(function () {
        setTimeout(function () {
          try { rtRun(mode, ds, t); } catch (e) { if (window.console) { window.console.error(e); } RT.res = null; RT.msg = "経路を調べられませんでした。"; }
          RT.busy = "";
          RT.compact = !!(RT.res && RT.res.list && RT.res.list.length);
          rtPaintForm();
          rtPaintRes();
          rtDraw(true);
        }, 20);
      }, function () {
        RT.busy = "";
        RT.msg = "時刻表のデータを読み込めませんでした。通信の状態を確かめて、もう一度押してください。";
        rtPaintRes();
      });
    }
    function rtShift(dir) {
      var R = RT.res;
      if (!R || !R.list.length) { return; }
      var ds = R.ds, t;
      if (dir > 0) {
        t = Math.max.apply(null, R.list.map(function (x) { return x.dep; })) + 1;
        RT.mode = "dep";
      } else {
        t = Math.min.apply(null, R.list.map(function (x) { return x.arr; })) - 1;
        RT.mode = "arr";
      }
      while (t >= 1440) { t -= 1440; ds = rtDate(ds, 1); }
      while (t < 0) { t += 1440; ds = rtDate(ds, -1); }
      RT.date = ds;
      RT.time = pad(Math.floor(t / 60)) + ":" + pad(t % 60);
      rtGo(RT.mode, ds, t);
    }

    // ---- 画面 ----
    function rtStopName(s) {
      var nmS = TO.j.names[TO.nm[s]], k = TO.kd[s];
      return k <= 1 && !/駅$/.test(nmS) ? nmS + "駅" : nmS;
    }
    function rtInk(hex) {
      var h = String(hex || "").replace("#", "");
      if (h.length !== 6) { return "#fff"; }
      var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? "#1f2a24" : "#fff";
    }
    function rtChip(li) {
      var ln = TO.j.lines[li];
      return '<span class="c-rt-chip" style="--c:' + esc(ln[1]) + ";--t:" + rtInk(ln[1]) + '">' + icon(ln[2] === 3 ? "bus" : "train") + esc(ln[2] === 3 ? ln[0] : ln[0].replace(/（.*）$/, "")) + "</span>";
    }
    function rtPtHTML(k) {
      var p = RT[k], lb = k === "from" ? "出発" : "到着", on = RT.edit === k;
      var val = p ? '<span class="c-rt-name">' + esc(p.name) + "</span>" + (p.sub ? '<span class="c-rt-sub">' + esc(p.sub) + "</span>" : "") :
        '<span class="c-rt-ph">' + (k === "from" ? "出発する場所を選ぶ" : "行き先を選ぶ") + "</span>";
      var h = '<div class="c-rt-pt is-' + k + (on ? " is-edit" : "") + '"><span class="c-rt-lb">' + lb + "</span>" +
        '<button type="button" class="c-rt-val" data-act="rtedit" data-k="' + k + '" aria-expanded="' + (on ? "true" : "false") + '">' + val + "</button></div>";
      if (on) {
        h += '<div class="c-rt-pick"><input type="search" class="c-rt-q" placeholder="駅・停留所・場所の名前" aria-label="' + lb + 'する場所を名前で探す" autocomplete="off" enterkeyhint="search" value="' + esc(RT.q) + '">' +
          '<p class="c-rt-hint">住所では探せません。駅名・停留所名で探してください。</p>' +
          '<div class="c-rt-quick"><button type="button" class="c-act" data-act="rtme" data-k="' + k + '">' + icon("locate") + "現在地</button>" +
          '<button type="button" class="c-act" data-act="rtmap" data-k="' + k + '">' + icon("map") + "地図をタップして選ぶ</button></div>" +
          '<ul class="c-rt-sug"></ul></div>';
      }
      return h;
    }
    function rtWhenText() {
      var p = RT.date.split("-"), wd = "日月火水木金土".charAt(new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]))).getUTCDay());
      return Number(p[1]) + "月" + Number(p[2]) + "日（" + wd + "）" + RT.time.replace(/^0/, "") + (RT.mode === "arr" ? "までに到着" : "に出発");
    }
    function rtFormHTML() {
      if (RT.compact && RT.from && RT.to && !RT.edit) {
        return '<div class="c-rt-form is-compact"><button type="button" class="c-rt-sum" data-act="rtexpand" aria-label="出発・到着・日時を変える">' +
          '<span class="c-rt-sumrow"><span class="c-rt-lb">出発</span><b>' + esc(RT.from.name) + "</b></span>" +
          '<span class="c-rt-sumrow is-to"><span class="c-rt-lb">到着</span><b>' + esc(RT.to.name) + "</b></span>" +
          '<span class="c-rt-sumwhen">' + icon("clock") + esc(rtWhenText()) + '<span class="c-rt-sumgo">変える</span></span></button></div>';
      }
      return '<div class="c-rt-form">' + rtPtHTML("from") +
        '<div class="c-rt-mid"><button type="button" class="c-rt-swap" data-act="rtswap" aria-label="出発と到着を入れ替える">' + icon("swap") + "</button></div>" + rtPtHTML("to") +
        '<div class="c-rt-when"><div class="c-rt-mode" role="group" aria-label="時刻の決め方">' +
        '<button type="button" data-act="rtmode" data-m="dep" aria-pressed="' + (RT.mode === "dep" ? "true" : "false") + '">出発</button>' +
        '<button type="button" data-act="rtmode" data-m="arr" aria-pressed="' + (RT.mode === "arr" ? "true" : "false") + '">到着</button></div>' +
        '<input type="date" class="c-rt-date" value="' + esc(RT.date) + '" aria-label="日付">' +
        '<input type="time" class="c-rt-time" value="' + esc(RT.time) + '" aria-label="時刻">' +
        '<button type="button" class="c-rt-now" data-act="rtnow">いま</button></div>' +
        '<button type="button" class="c-btn is-main c-rt-go" data-act="rtgo">' + icon("search") + "経路を調べる</button></div>";
    }
    function rtLegsHTML(J) {
      var D = RT.res.D, h = '<ol class="c-rt-legs">';
      function node(t, name, cls, c, u) {
        return '<li class="c-rt-node' + (cls ? " " + cls : "") + '"' + (c ? ' style="--c:' + esc(c) + '"' : "") + '><span class="c-rt-t">' + (t == null ? "" : rtHM(t)) + '</span><span class="c-rt-dot"></span><span class="c-rt-pl">' + esc(name) + (u ? '<span class="c-rt-u">' + u + "</span>" : "") + "</span></li>";
      }
      function walk(w, m, what) {
        if (!w) { return ""; }
        if (m < 50) { return '<li class="c-rt-walk"><span class="c-rt-t"></span><span class="c-rt-bar"></span><span class="c-rt-tx">' + icon("walk") + (what ? "乗り換え" : "乗り場・出口との行き来") + " 約" + w + "分</span></li>"; }
        var long = w > LONG_WALK;
        return '<li class="c-rt-walk' + (long ? " is-long" : "") + '"><span class="c-rt-t"></span><span class="c-rt-bar"></span><span class="c-rt-tx">' + icon("walk") +
          (what || "徒歩") + " 約" + w + "分" + (m ? "（" + fmtDist(m * 1.3) + "）" : "") + (long ? '<em class="c-rt-warn">歩く時間が長い区間です</em>' : "") + "</span></li>";
      }
      h += node(J.dep, RT.from.name, "is-end");
      h += walk(J.acc.w, J.acc.m);
      J.rides.forEach(function (rd, i) {
        var ln = TO.j.lines[D.rLine[rd.r]], hd = TO.j.heads[D.head[D.rTrip[rd.r] + rd.t]], nst = rd.ap - rd.bp;
        h += node(rd.dep, rtStopName(rd.bs), "", ln[1], "発");
        h += '<li class="c-rt-ride" style="--c:' + esc(ln[1]) + '"><span class="c-rt-t"></span><span class="c-rt-bar"></span><span class="c-rt-tx">' + rtChip(D.rLine[rd.r]) +
          (hd ? '<span class="c-rt-hd">' + esc(hd) + "行き</span>" : "") + '<small>' + nst + (ln[2] === 3 ? "停留所" : "駅") + "先・" + rtDur(rd.arr - rd.dep) + "</small></span></li>";
        h += node(rd.arr, rtStopName(rd.as), "", ln[1], "着");
        var nx = J.rides[i + 1];
        if (nx) {
          if (nx.bs === rd.as) {
            h += '<li class="c-rt-walk is-chg"><span class="c-rt-t"></span><span class="c-rt-bar"></span><span class="c-rt-tx">同じ' + (TO.kd[rd.as] === 3 ? "停留所" : "駅") + "で乗り換え・待ち " + (nx.dep - rd.arr) + "分</span></li>";
          } else {
            var fw = rtFoot(rd.as, nx.bs);
            h += walk(fw, meters({ lat: TO.lat[rd.as], lng: TO.lng[rd.as] }, { lat: TO.lat[nx.bs], lng: TO.lng[nx.bs] }), "乗り換えで徒歩");
          }
        }
      });
      h += walk(J.eg.w, J.eg.m);
      h += node(J.arr, RT.to.name, "is-end");
      return h + "</ol>";
    }
    function rtResHTML() {
      if (RT.busy) { return '<p class="c-rt-msg is-busy">' + esc(RT.busy) + "</p>"; }
      if (RT.msg) { return '<p class="c-rt-msg is-warn">' + esc(RT.msg) + "</p>"; }
      var R = RT.res, h = "";
      if (!R) { return ""; }
      if (R.none) { return '<p class="c-rt-msg is-warn">' + (R.none === "from" ? "出発地" : "到着地") + "の近く（8km以内）に、都営交通の駅・停留所がありません。</p>"; }
      if (R.note) { h += '<p class="c-note c-rt-note">' + esc(R.note) + "</p>"; }
      var wm = R.walkM, ww = toWalk(wm), fast = R.list.length ? Math.min.apply(null, R.list.map(function (x) { return x.arr - x.dep; })) : RT_INF;
      if (ww <= 30) { h += '<p class="c-rt-walkall">' + icon("walk") + "歩くと約" + ww + "分（" + fmtDist(wm * 1.3) + "）" + (ww <= fast ? "。都営交通を使うより早く着きます" : "") + "</p>"; }
      if (!R.list.length) {
        return h + '<p class="c-rt-msg is-warn">' + (R.mode === "dep" ? "この時刻からは" : "この時刻までに着く") + "都営交通だけの経路が見つかりませんでした。終電・終バスの後や、始発より前の時刻かもしれません。時刻を変えて調べてください。</p>";
      }
      function lo(f) { return Math.min.apply(null, R.list.map(f)); }
      function hi(f) { return Math.max.apply(null, R.list.map(f)); }
      function fA(x) { return x.arr; }
      function fR(x) { return x.rides.length; }
      function fW(x) { return x.walk; }
      var minArr = lo(fA) < hi(fA) ? lo(fA) : -1, minRide = lo(fR) < hi(fR) ? lo(fR) : -1, minWalk = lo(fW) < hi(fW) ? lo(fW) : -1;
      R.list.forEach(function (J, i) {
        var on = i === RT.sel, tags = [];
        if (R.list.length > 1) {
          if (J.arr === minArr) { tags.push("早い"); }
          if (J.rides.length === minRide) { tags.push("乗り換え少"); }
          if (J.walk === minWalk) { tags.push("歩き少"); }
        }
        h += '<div class="c-rt-opt' + (on ? " is-on" : "") + '"><button type="button" class="c-rt-head" data-act="rtopt" data-i="' + i + '" aria-expanded="' + (on ? "true" : "false") + '">' +
          '<span class="c-rt-tm"><b>' + rtHM(J.dep) + '</b><span class="c-rt-u">発</span><b>' + rtHM(J.arr) + '</b><span class="c-rt-u">着</span>' +
          (tags.length ? '<span class="c-rt-tags">' + tags.map(function (t) { return "<i>" + t + "</i>"; }).join("") + "</span>" : "") + "</span>" +
          '<span class="c-rt-meta">' + rtDur(J.arr - J.dep) + "・" + (J.rides.length > 1 ? "乗り換え" + (J.rides.length - 1) + "回" : "乗り換えなし") + "・徒歩" + J.walk + "分" +
          (J.maxW > LONG_WALK ? '<em class="c-rt-warn">歩く時間が長い</em>' : "") + "</span>" +
          '<span class="c-rt-chips">' + J.rides.map(function (rd) { return rtChip(R.D.rLine[rd.r]); }).join('<span class="c-rt-sep"></span>') + "</span></button>";
        if (on) { h += rtLegsHTML(J); }
        h += "</div>";
      });
      h += '<div class="c-rt-more"><button type="button" class="c-btn" data-act="rtprev">' + icon("up") + "前の時刻</button>" +
        '<button type="button" class="c-btn" data-act="rtnext">' + icon("down") + "後の時刻</button></div>";
      return h;
    }
    function rtSrcHTML() {
      var made = TO ? TO.j.made : "";
      return '<p class="c-rt-src">時刻表：東京都交通局・<a href="https://www.odpt.org/" target="_blank" rel="noopener">公共交通オープンデータセンター</a>のGTFS' +
        '（<a href="https://creativecommons.org/licenses/by/4.0/deed.ja" target="_blank" rel="noopener">CC BY 4.0</a>）を加工して作成' +
        (made ? "（" + Number(made.slice(0, 4)) + "年" + Number(made.slice(4, 6)) + "月" + Number(made.slice(6, 8)) + "日時点）" : "") +
        "。正確・完全とは限りません。この地図の表示内容について、東京都交通局へ問い合わせないでください。運賃と遅れは出ません。徒歩の時間は直線距離から出した目安です。</p>";
    }
    function rtLeave() {
      if (!RT) { return; }
      if (RT.pick) { rtPickStop(); }
      if (rtLayer) { rtLayer.clearLayers(); }
    }
    function rtIn() { return S.panel && S.panel.type === "route" && !sheet.hidden; }
    function rtOpen(dest) {
      if (RT.pick) { rtPickStop(); }
      if (dest) { RT.to = dest; RT.res = null; RT.compact = false; }
      if (!RT.from && pos) { RT.from = { lat: pos.lat, lng: pos.lng, name: "現在地", me: 1 }; }
      if (!RT.date) { rtNowSet(); }
      RT.edit = !RT.from ? "from" : !RT.to ? "to" : "";
      RT.q = "";
      var h = headHTML("#0079c2", "train", "地下鉄・都バス・都電・ライナー", "都営交通で行く") +
        '<div class="c-rt">' + rtFormHTML() + '<div class="c-rt-res" aria-live="polite">' + rtResHTML() + "</div>" + '<div class="c-rt-srcbox">' + rtSrcHTML() + "</div></div>";
      showPanel({ type: "route" }, h);
      rtSug();
      if (RT.edit) { rtFocus(); }
      toLoad().then(function () {
        var sb = $(".c-rt-srcbox", sheet);
        if (sb && rtIn()) { sb.innerHTML = rtSrcHTML(); }
        rtSug();
      }, function () {});
      if (RT.from && RT.to && !RT.res) { rtGo(); } else { rtDraw(!!RT.res); }
    }
    function rtFocus() {
      var q = $(".c-rt-q", sheet);
      if (q && !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) { try { q.focus({ preventScroll: true }); } catch (e) {} }
    }
    function rtPaintForm(focus) {
      var f = $(".c-rt-form", sheet);
      if (!f || !rtIn()) { return; }
      var d = document.createElement("div");
      d.innerHTML = rtFormHTML();
      f.parentNode.replaceChild(d.firstChild, f);
      rtSug();
      if (focus && RT.edit) { rtFocus(); }
    }
    function rtPaintRes() {
      var r = $(".c-rt-res", sheet);
      if (r && rtIn()) { r.innerHTML = rtResHTML(); }
    }
    function rtFind(q) {
      var w = norm(q), out = [], rq = /[ぁ-ゖ]/.test(w) ? rk(kr(w)) : /^[a-z][a-z' \-]*$/.test(w) ? rk(w) : "";
      if (!w || !TO) { return out; }
      if (rq.length < 2) { rq = ""; }
      TO.ents.forEach(function (e) {
        var i1 = e.key.indexOf(w), i2 = e.kkey ? e.kkey.indexOf(w) : -1;
        if (i2 < 0 && rq && e.rkey) { i2 = e.rkey.indexOf(rq); }
        if (i1 < 0 && i2 < 0) { return; }
        out.push({ e: e, sc: (i1 === 0 || i2 === 0 ? 0 : 3) + (e.rail ? 0 : 1) + e.key.length / 100 });
      });
      pins.forEach(function (it) {
        var key = norm(it.name), i1 = key.indexOf(w);
        if (i1 < 0) { return; }
        out.push({ it: it, sc: (i1 === 0 ? 1.5 : 4.5) + key.length / 100 });
      });
      out.sort(function (a, b) { return a.sc - b.sc; });
      return out.slice(0, 12);
    }
    function rtSug() {
      var ul = $(".c-rt-sug", sheet);
      if (!ul) { return; }
      if (!RT.q) { RT.sug = []; ul.innerHTML = ""; return; }
      if (!TO) { ul.innerHTML = '<li class="c-rt-sugmsg">駅と停留所の一覧を読み込んでいます</li>'; return; }
      RT.sug = rtFind(RT.q);
      ul.innerHTML = RT.sug.length ? RT.sug.map(function (x, i) {
        var t = x.e ? x.e.title : x.it.name, s = x.e ? x.e.sub : CATS[x.it.cat].short + "（地図の場所）";
        return '<li><button type="button" data-act="rtset" data-i="' + i + '">' + icon(x.e ? (x.e.rail ? "train" : "bus") : "pin") +
          '<span class="c-rt-sugt"><b>' + esc(t) + "</b><small>" + esc(s) + "</small></span></button></li>";
      }).join("") : '<li class="c-rt-sugmsg">見つかりませんでした。駅名・停留所名は一部だけでも探せます。</li>';
    }
    function rtSetPt(k, p) {
      RT[k] = p;
      RT.compact = false;
      RT.edit = "";
      RT.q = "";
      RT.res = null;
      if (!rtIn()) { return; }
      if (RT.from && RT.to) { rtGo(); return; }
      RT.edit = !RT.from ? "from" : "to";
      rtPaintForm(true);
      rtDraw(false);
    }
    function rtChoose(x) {
      var k = RT.edit;
      if (!k || !x) { return; }
      if (x.e) { rtSetPt(k, { lat: x.e.lat, lng: x.e.lng, name: x.e.title, sub: x.e.sub }); }
      else { rtSetPt(k, { lat: x.it.lat, lng: x.it.lng, name: x.it.name, sub: CATS[x.it.cat].short, id: x.it.id }); }
    }
    function rtMe(k) {
      if (!navigator.geolocation) { toast("このブラウザでは現在地を取得できません"); return; }
      toast("現在地を取得しています");
      navigator.geolocation.getCurrentPosition(function (p) {
        pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        locateMe(true);
        rtSetPt(k, { lat: pos.lat, lng: pos.lng, name: "現在地", me: 1 });
      }, function () { toast("現在地を取得できませんでした。ブラウザで位置情報の利用を許可してください。"); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    }
    function rtPickStart(k) {
      RT.pick = k;
      RT.edit = "";
      sheet.hidden = true;
      stage.classList.remove("has-sheet");
      stage.classList.add("is-rtpick");
      if (!rtBar) {
        rtBar = document.createElement("div");
        rtBar.className = "c-rtbar";
        rtBar.setAttribute("role", "status");
        stage.appendChild(rtBar);
      }
      rtBar.innerHTML = "<span>地図をタップして、" + (k === "from" ? "出発する場所" : "行き先") + "を選んでください</span>" +
        '<button type="button" data-act="rtpickx">やめる</button>';
      rtBar.hidden = false;
    }
    function rtPickStop() {
      RT.pick = "";
      stage.classList.remove("is-rtpick");
      if (rtBar) { rtBar.hidden = true; }
    }
    function rtPickEnd(ll) {
      var k = RT.pick;
      PS.pickAt = Date.now();
      rtPickStop();
      if (ll && k) { RT[k] = { lat: ll.lat, lng: ll.lng, name: "地図で選んだ地点" }; RT.res = null; }
      rtOpen();
    }
    function rtDraw(fit) {
      if (!map) { return; }
      if (!rtLayer) { rtLayer = L.layerGroup().addTo(map); }
      rtLayer.clearLayers();
      var pts = [], R = RT.res, J = R && R.list && R.list[RT.sel];
      function walkLine(a, b) {
        L.polyline([a, b], { color: "#fff", weight: 7, opacity: 0.9, lineCap: "round", interactive: false }).addTo(rtLayer);
        L.polyline([a, b], { color: ink, weight: 3.5, opacity: 0.95, dashArray: "1 8", lineCap: "round", interactive: false }).addTo(rtLayer);
      }
      if (J && RT.from && RT.to) {
        var D = R.D, prev = [RT.from.lat, RT.from.lng];
        J.rides.forEach(function (rd) {
          var ln = TO.j.lines[D.rLine[rd.r]], ll = [], q;
          for (q = rd.bp; q <= rd.ap; q++) { var s = D.seq[D.rSeq[rd.r] + q]; ll.push([TO.lat[s], TO.lng[s]]); }
          walkLine(prev, ll[0]);
          L.polyline(ll, { color: "#fff", weight: 10, opacity: 0.9, lineCap: "round", lineJoin: "round", interactive: false }).addTo(rtLayer);
          L.polyline(ll, { color: ln[1], weight: 6, opacity: 1, lineCap: "round", lineJoin: "round", interactive: false }).addTo(rtLayer);
          ll.forEach(function (p, i) {
            var end = i === 0 || i === ll.length - 1;
            L.circleMarker(p, { radius: end ? 6 : 3, color: end ? ink : ln[1], weight: end ? 2.5 : 1.5, fillColor: "#fff", fillOpacity: 1, interactive: false }).addTo(rtLayer);
            pts.push({ lat: p[0], lng: p[1] });
          });
          prev = ll[ll.length - 1];
        });
        walkLine(prev, [RT.to.lat, RT.to.lng]);
      }
      [["from", "出発"], ["to", "到着"]].forEach(function (x) {
        var p = RT[x[0]];
        if (!p) { return; }
        pts.push(p);
        L.marker([p.lat, p.lng], { icon: L.divIcon({ className: "c-rtpt is-" + x[0], html: "<span>" + x[1] + "</span>", iconSize: [0, 0] }), interactive: false, keyboard: false, zIndexOffset: 3500 }).addTo(rtLayer);
      });
      if (fit && pts.length) { rtFit(pts); }
    }
    function rtFit(pts) {
      var pd = mapPad(), ll = pts.map(function (p) { return [p.lat, p.lng]; });
      if (ll.length === 1) { viewPoint(ll[0][0], ll[0][1], 15); return; }
      map.fitBounds(ll, { paddingTopLeft: [pd.l, pd.t], paddingBottomRight: [pd.r, pd.b], maxZoom: 16 });
    }
    function rtClick(act, b) {
      var k = b.getAttribute("data-k");
      if (act === "rt") {
        menu(legend, false);
        if (rtIn()) { closePanel(); return; }
        toStage();
        rtOpen();
      } else if (act === "rtto") {
        var it = byId[b.getAttribute("data-id")];
        if (!it || !it.pin) { return; }
        toStage();
        rtOpen({ lat: it.lat, lng: it.lng, name: it.name, sub: CATS[it.cat].short, id: it.id });
      } else if (act === "rtexpand") {
        RT.compact = false;
        rtPaintForm();
      } else if (act === "rtedit") {
        RT.edit = RT.edit === k ? "" : k;
        RT.q = "";
        rtPaintForm(true);
      } else if (act === "rtme") { rtMe(k); }
      else if (act === "rtmap") { rtPickStart(k); }
      else if (act === "rtpickx") { rtPickEnd(null); }
      else if (act === "rtset") { rtChoose(RT.sug[Number(b.getAttribute("data-i"))]); }
      else if (act === "rtswap") {
        var f = RT.from;
        RT.from = RT.to; RT.to = f; RT.res = null;
        if (RT.from && RT.to) { rtGo(); } else { rtPaintForm(); rtPaintRes(); rtDraw(false); }
      } else if (act === "rtmode") {
        RT.mode = b.getAttribute("data-m") === "arr" ? "arr" : "dep";
        if (RT.res) { rtGo(); } else { rtPaintForm(); }
      } else if (act === "rtnow") {
        rtNowSet();
        RT.mode = "dep";
        if (RT.from && RT.to) { rtGo(); } else { rtPaintForm(); }
      } else if (act === "rtgo") { rtGo(); }
      else if (act === "rtopt") {
        var i = Number(b.getAttribute("data-i"));
        RT.sel = i;
        rtPaintRes();
        rtDraw(true);
        var o = $$(".c-rt-opt", sheet)[i];
        if (o && o.scrollIntoView) { o.scrollIntoView({ block: "nearest" }); }
      } else if (act === "rtprev" || act === "rtnext") { rtShift(act === "rtnext" ? 1 : -1); }
    }
    root.addEventListener("input", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains("c-rt-q")) { RT.q = t.value; rtSug(); }
    });
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || !t.classList) { return; }
      if (t.classList.contains("c-rt-date")) { RT.date = t.value || today(); if (RT.res) { rtGo(); } }
      else if (t.classList.contains("c-rt-time")) { RT.time = t.value || "00:00"; if (RT.res) { rtGo(); } }
    });
    root.addEventListener("keydown", function (e) {
      var t = e.target;
      if (e.key === "Enter" && t && t.classList && t.classList.contains("c-rt-q")) {
        e.preventDefault();
        if (RT.sug.length) { rtChoose(RT.sug[0]); }
      }
    });
    if (map) { map.on("click", function (e) { if (RT.pick) { rtPickEnd(e.latlng); } }); }

    var drawing = false;
    function omikuji() {
      if (drawing) { return; }
      var list = pins.filter(function (it) { return visSet[it.id] && it.id !== selId() && !statusOf(it); });
      if (S.rings && origin) { list = list.filter(function (it) { return meters(origin, it) <= 1600; }); }
      var every = !list.length && !S.rings && atHome();
      if (every) { list = pins.filter(function (it) { return !statusOf(it); }); }
      if (!list.length) { toast(S.rings ? "徒歩20分圏の中に、選べる場所がありません" : "地図に出ている場所がありません"); return; }
      var pick = list[Math.floor(Math.random() * list.length)];
      var lab = S.rings ? "おみくじで選んだ行き先（徒歩20分圏から）" : every ? "おみくじで選んだ行き先（全部の場所から）" : "おみくじで選んだ行き先（地図に出ている場所から）";
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (calm || every || list.length < 2) { select(pick.id, { label: lab }); return; }
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
      if (S.purp) { st.u = S.purp; }
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

    function searchOpen(on) {
      if (on) { qIn.focus(); } else if (document.activeElement === qIn) { qIn.blur(); }
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
      if (!tagHint || T || root.classList.contains("is-app") || store.get(KEY.taghint, 0) || S.panel) { return; }
      store.set(KEY.taghint, 1);
      tagHint.hidden = false;
      tagHintTimer = setTimeout(hideTagHint, 9000);
    }
    var CATS_TUT = true;
    var TUT = [null,
      { no: 1, get: function () { return atHome() ? $('.c-homebtn[data-key="' + CFG.tutPurp + '"]', homeEl) : $('.c-purp[data-key="' + CFG.tutPurp + '"]', chips); },
        text: function () { var p = PURP[CFG.tutPurp]; return "「" + p.label + "」を押してみてください。" + p.name + "だけが地図に出ます。"; } },
      { no: 1, get: function () { var c = $('.c-kind[data-key="' + CFG.tutKind + '"]', kindsEl); return c && !kindsEl.hidden ? c : null; },
        text: function () { var k = kindName(CFG.tutKind); return "一覧の上の「" + k + "」を押してみてください。" + k + "の店だけに絞れます。もう一度押すと、飲食店すべてに戻ります。"; } },
      { no: 2, get: function () { return $(".c-map"); },
        text: function () { return "地図のピンを押してみてください。住所や営業時間などの詳しい情報が開きます。"; } },
      { no: 3, get: function () { return sheet.hidden ? null : $(".c-item-acts", sheet); }, block: true,
        text: function () { return "行きたい場所は「コースに入れる」でまとめられます。「共有」を押すと、LINEなどで送れます。"; } },
    ];
    function tutStart() {
      if (T) { return; }
      drawerOpen(false);
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
        var cc = st.get(), row = cc && cc.closest(".c-areas, .c-conds, .c-kinds");
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
    qIn.addEventListener("input", debounce(function () { S.q = qIn.value; S.ws = words(S.q); apply(true); ensureQuery(); }, 180));
    qIn.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); qIn.blur(); } });
    areaSel.addEventListener("change", function () {
      S.area = areaSel.value || "";
      S.town = "";
      S.hint = null;
      if (S.panel && S.panel.type !== "item") { closePanel(); }
      ensureArea(S.area, function () { apply(true); });
    });
    townSel.addEventListener("change", function () {
      S.town = townSel.value || "";
      S.hint = null;
      if (S.panel && S.panel.type !== "item") { closePanel(); }
      apply(true);
    });
    function toStage() {
      if (stage.classList.contains("is-full") || root.classList.contains("is-app")) { return; }
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
      if (act.slice(0, 2) === "rt") { rtClick(act, b); return; }
      if (appClick(act, b)) { return; }
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
        S.presets = pi === -1 ? [key] : [];
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
        if (ck) { S.tag = ""; S.cond = ck; S.purp = CO_PURP; } else { S.tag = t; S.purp = ""; }
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
        S.area = ""; S.town = ""; S.purp = ""; S.kind = ""; S.presets = []; S.cond = ""; S.tag = "";
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
        var pk2 = b.getAttribute("data-key"), pp = PURP[pk2], was = S.purp === pk2, fromHome = b.classList.contains("c-homebtn");
        if (!pp) { return; }
        setPurp(was ? "" : pk2);
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        toast(was ? "目的を選ぶと、地図にピンが出ます" : pp.name + "の" + countVis() + unitWord() + "を表示しています");
        if (fromHome) { var tb = $('.c-purp[data-key="' + pk2 + '"]', chips); if (tb) { try { tb.focus({ preventScroll: true }); } catch (e3) {} } }
        if (T && T.step === 1 && pk2 === CFG.tutPurp && !was) { setTimeout(function () { if (T && T.step === 1) { tutGo(2); } }, 700); }
      }
      else if (act === "kind") {
        var kk2 = b.getAttribute("data-key");
        S.kind = kk2 && S.kind !== kk2 ? kk2 : "";
        S.hint = null;
        if (S.panel && S.panel.type !== "item") { closePanel(); }
        apply(false);
        if (S.kind) { toast(kindName(S.kind) + "の" + countVis() + unitWord() + "を表示しています"); }
        if (T && T.step === 2 && S.kind === CFG.tutKind) { setTimeout(function () { if (T && T.step === 2) { tutGo(3); } }, 700); }
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
      if (RT.pick) { rtPickEnd(null); return; }
      if (!drawer.hidden) { drawerOpen(false); menuBtn.focus(); return; }
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
      if (!S.area && typeof st.t === "string" && townCount["板橋区/" + st.t]) { S.area = "板橋区"; }
      S.town = typeof st.t === "string" && S.area && townCount[S.area + "/" + st.t] ? st.t : "";
      S.tag = typeof st.g === "string" && TAGS.indexOf(st.g) !== -1 ? st.g : "";
      S.presets = Array.isArray(st.p) ? st.p.filter(function (k, i) { return PRESET[k] && st.p.indexOf(k) === i; }) : [];
      S.hint = COURSES.some(function (c) { return c.key === st.h; }) ? st.h : null;
      S.hidden = [];
      var u0 = Array.isArray(st.u) ? st.u[0] : st.u;
      S.purp = typeof u0 === "string" && PURP[u0] ? u0 : "";
      if (S.presets.length > 1) { S.presets = S.presets.slice(0, 1); }
      S.kind = typeof st.y === "string" && kindValid(st.y) ? st.y : "";
      S.cond = condOk(st.c) && curPurp() && curPurp().co ? st.c : "";
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
    // ---- 全画面の画面：上に検索欄と目的、スマホは下から引き出すパネル、PCは左のパネル ----
    var side = $(".c-side"), PS = { snap: "half", base: "half", home: true, px: 0 };
    var panel = document.createElement("div");
    panel.className = "c-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "一覧と詳しい情報");
    panel.innerHTML = '<div class="c-panel-grip" role="button" tabindex="0" aria-label="パネルの大きさを変える"></div><div class="c-panel-body"><div class="c-panel-base"></div></div>';
    var pgrip = $(".c-panel-grip", panel), pbody = $(".c-panel-body", panel), pbase = $(".c-panel-base", panel);
    var lhead = document.createElement("div");
    lhead.className = "c-lhead";
    lhead.innerHTML = '<div class="c-lhead-top"><span class="c-lhead-ic"></span><p class="c-lhead-t"><b class="c-lhead-name"></b><span class="c-lhead-n"></span></p>' +
      '<button type="button" class="c-lhead-x" data-act="clear" aria-label="条件を外して、最初の画面に戻る">' + icon("close") + "</button></div>";
    lhead.appendChild(kindsEl);
    lhead.appendChild(condsEl);
    pbase.appendChild(homeEl);
    pbase.appendChild(lhead);
    pbase.appendChild($(".c-index"));
    pbody.appendChild(sheet);
    stage.appendChild(panel);
    $(".c-home-f", homeEl).textContent = "名前や駅名で探すときは、上の検索欄に入力してください。";
    // 検索欄：メニュー・入力・消すボタン
    stage.insertBefore(chips, topBar.nextSibling);
    var menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "c-menubtn";
    menuBtn.setAttribute("data-act", "menu");
    menuBtn.setAttribute("aria-label", "メニューを開く");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = icon("menu");
    topBar.insertBefore(menuBtn, topBar.firstChild);
    var qx = document.createElement("button");
    qx.type = "button";
    qx.className = "c-qx";
    qx.setAttribute("data-act", "qclear");
    qx.setAttribute("aria-label", "検索の言葉を消す");
    qx.innerHTML = icon("close");
    qx.hidden = true;
    topBar.insertBefore(qx, searchBox.nextSibling);
    searchBox.hidden = false;
    qIn.addEventListener("input", function () { qx.hidden = !qIn.value; });
    // 現在地・経路・拡大縮小は右下へ
    var fab = document.createElement("div");
    fab.className = "c-fab";
    ["rt", "locate", "zin", "zout"].forEach(function (a) { var b = $('[data-act="' + a + '"]', side); if (b) { fab.appendChild(b); } });
    stage.appendChild(fab);
    // PCで左のパネルを閉じる・開くつまみ
    var pcTg = document.createElement("button");
    pcTg.type = "button";
    pcTg.className = "c-panel-tg";
    pcTg.setAttribute("data-act", "pctoggle");
    pcTg.setAttribute("aria-expanded", "true");
    pcTg.setAttribute("aria-label", "左のパネルを閉じる");
    pcTg.innerHTML = icon("chevron");
    stage.appendChild(pcTg);
    // メニュー：コース・行った場所・一覧・文字・共有・使い方・記事に戻る
    var drawer = document.createElement("div");
    drawer.className = "c-drawer";
    drawer.hidden = true;
    drawer.innerHTML = '<div class="c-drawer-scrim" data-act="menu"></div><nav class="c-drawer-box" aria-label="メニュー">' +
      '<div class="c-drawer-head"><p class="c-drawer-t">' + esc(CFG.mapName) + '</p><button type="button" class="c-drawer-x" data-act="menu" aria-label="メニューを閉じる">' + icon("close") + "</button></div>" +
      '<div class="c-drawer-main"></div><div class="c-drawer-foot"><button type="button" class="c-drawer-exit" data-act="exitapp">' + icon("shrink") + "地図を閉じて、ブログの記事を見る</button></div></nav>";
    var dmain = $(".c-drawer-main", drawer), dbar = $(".c-bar");
    dmain.appendChild(dbar);
    var dlist = document.createElement("button");
    dlist.type = "button";
    dlist.className = "c-drawer-list";
    dlist.setAttribute("data-act", "listall");
    dlist.innerHTML = icon("list") + "<span>一覧から探す（町名・エリアごと）</span>";
    dbar.insertBefore(dlist, $(".c-textsize", dbar));
    if (guide) { dmain.appendChild(guide); }
    stage.appendChild(drawer);
    // 記事に戻ったときに出す、地図を開くボタン
    var launch = document.createElement("div");
    launch.className = "c-launch";
    launch.innerHTML = '<p class="c-launch-h">' + esc(CFG.mapName) + '</p><p class="c-launch-d">' + esc(($(".c-guide-lead") || {}).textContent || "") + "</p>" +
      '<button type="button" class="c-btn is-main c-launch-go" data-act="enterapp">' + icon("expand") + "地図を画面いっぱいに開く</button>";
    root.insertBefore(launch, root.firstChild);
    if (!root.classList.contains("is-app")) { root.classList.add("is-inline"); }

    function narrow() { return !isWide(); }
    function snapPx(s) {
      var H = stage.clientHeight, sr = stage.getBoundingClientRect(), top = topBar.getBoundingClientRect().bottom - sr.top + 8;
      if (s === "full") { return Math.max(160, Math.round(H - top)); }
      if (s === "half") {
        var hh = Math.round(H * 0.5), pn = $(".c-panel"), gr = $(".c-home-grid", homeEl);
        if (PS.home && sheet.hidden && pn && gr && gr.offsetHeight) { hh = Math.max(hh, Math.min(Math.round(H * 0.68), Math.round(gr.getBoundingClientRect().bottom - pn.getBoundingClientRect().top + 14))); }
        return Math.max(260, Math.min(Math.round(H - top), hh));
      }
      var el = !sheet.hidden ? $(".c-sh-head", sheet) : PS.home ? $(".c-home-h", homeEl) : lhead;
      return Math.max(84, Math.min(24 + (el ? el.offsetHeight : 60) + 4, Math.round(H * 0.45)));
    }
    function setSnap(s) {
      ["peek", "half", "full"].forEach(function (k) { stage.classList.toggle("ps-" + k, narrow() && k === s); });
      if (!narrow()) { stage.style.removeProperty("--ph"); PS.px = 0; return; }
      PS.snap = s;
      if (sheet.hidden) { PS.base = s; }
      PS.px = snapPx(s);
      stage.style.setProperty("--ph", PS.px + "px");
    }
    function pcOpen(on) {
      stage.classList.toggle("is-pcclosed", !on);
      pcTg.setAttribute("aria-expanded", on ? "true" : "false");
      pcTg.setAttribute("aria-label", on ? "左のパネルを閉じる" : "左のパネルを開く");
    }
    // 地図の見えている範囲（検索欄・目的の段・パネル・右のボタンをよけた範囲）
    function mapPad() {
      var sr = stage.getBoundingClientRect(), t = 0, l = 0, b = 0;
      [topBar, chips].forEach(function (el) {
        if (!el || el.offsetParent === null) { return; }
        var r = el.getBoundingClientRect();
        if (!r.height || (!narrow() && el === topBar && !stage.classList.contains("is-pcclosed"))) { return; }
        t = Math.max(t, r.bottom - sr.top);
      });
      if (narrow()) { b = PS.px || panel.offsetHeight; }
      else if (!stage.classList.contains("is-pcclosed")) { l = panel.offsetWidth; }
      return { t: t + 14, l: l + 18, r: 66, b: b + 14 };
    }
    function appTop(home, n, f) {
      var p = curPurp(), name = "", ic = "";
      if (S.ws.length) { name = "「" + S.q.trim() + "」の検索結果"; ic = icon("search"); }
      else if (S.hint && hint()) { name = hint().label; ic = icon("walk"); }
      else if (S.tag) { name = tagText(S.tag); ic = icon("tag"); }
      else if (p) { name = p.name; ic = icon(p.icon); }
      else { name = "条件に合う場所"; ic = icon("list"); }
      $(".c-lhead-ic", lhead).innerHTML = ic;
      $(".c-lhead-ic", lhead).style.setProperty("--c", p && !S.ws.length && !S.tag && !S.hint ? p.color : "var(--ink)");
      $(".c-lhead-name", lhead).textContent = name;
      var np = 0;
      for (var id in visSet) { if (visSet[id] && byId[id] && byId[id].pin) { np++; } }
      $(".c-lhead-n", lhead).innerHTML = "<b>" + n.toLocaleString("ja-JP") + "</b>" + esc(unitWord()) + (np < n ? "（地図に出ているのは" + np + "）" : "");
      if (home !== PS.home) {
        PS.home = home;
        if (sheet.hidden) { setSnap(home ? "half" : "peek"); }
      }
    }
    function appList() {
      if (S.panel) { closePanel(); }
      if (narrow()) { setSnap("full"); } else { pcOpen(true); }
      var ix = $(".c-index", pbase);
      setTimeout(function () { pbase.scrollTop = Math.max(0, ix.offsetTop - (PS.home ? 0 : lhead.offsetHeight) - 8); }, 30);
    }
    function drawerOpen(on) {
      drawer.hidden = !on;
      menuBtn.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) { try { $(".c-drawer-x", drawer).focus({ preventScroll: true }); } catch (e) {} }
    }
    // スマホのパネル：つまみ・見出しを上下にドラッグして、小・中・大の3段階に合わせる
    var drag = null, eatClick = false;
    panel.addEventListener("pointerdown", function (e) {
      if (!narrow() || (e.button && e.button > 0)) { return; }
      var h = e.target.closest(".c-panel-grip, .c-lhead-top, .c-home-h, .c-sh-head");
      if (!h || (h !== pgrip && e.target.closest("button, a, select, input"))) { return; }
      drag = { id: e.pointerId, y: e.clientY, h0: panel.getBoundingClientRect().height, moved: false, grip: h === pgrip, hist: [{ y: e.clientY, t: Date.now() }] };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) { return; }
      var dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dy) < 8) { return; }
        drag.moved = true;
        panel.classList.add("is-drag");
        try { panel.setPointerCapture(drag.id); } catch (x) {}
      }
      drag.hist.push({ y: e.clientY, t: Date.now() });
      if (drag.hist.length > 6) { drag.hist.shift(); }
      var hmax = snapPx("full"), hmin = Math.min(snapPx("peek"), 84);
      PS.px = Math.max(hmin, Math.min(hmax, drag.h0 - dy));
      stage.style.setProperty("--ph", PS.px + "px");
      if (e.cancelable) { e.preventDefault(); }
    }, { passive: false });
    function dragEnd(e) {
      if (!drag || e.pointerId !== drag.id) { return; }
      var d = drag;
      drag = null;
      panel.classList.remove("is-drag");
      if (!d.moved) {
        if (d.grip) { setSnap(PS.snap === "full" ? "half" : PS.snap === "half" ? "full" : "half"); }
        return;
      }
      eatClick = true;
      setTimeout(function () { eatClick = false; }, 60);
      // 速さは、離す直前の動きから出す（上向きが正）
      var now = Date.now(), h = PS.px, s0 = d.hist[0];
      for (var i = d.hist.length - 1; i >= 0; i--) { if (now - d.hist[i].t <= 120) { s0 = d.hist[i]; } }
      var v = now - s0.t > 0 ? (s0.y - (d.hist[d.hist.length - 1] || s0).y) / (now - s0.t) : 0;
      var cand = ["peek", "half", "full"].map(function (s) { return { s: s, px: snapPx(s) }; });
      var pick = cand.reduce(function (a, c) { return Math.abs(c.px - h) < Math.abs(a.px - h) ? c : a; });
      if (Math.abs(v) > 0.6) {
        var up = v > 0, list = cand.filter(function (c) { return up ? c.px > h + 4 : c.px < h - 4; });
        if (list.length) { pick = up ? list[0] : list[list.length - 1]; }
      }
      setSnap(pick.s);
    }
    window.addEventListener("pointerup", dragEnd);
    window.addEventListener("pointercancel", dragEnd);
    root.addEventListener("click", function (e) { if (eatClick) { eatClick = false; e.stopPropagation(); e.preventDefault(); } }, true);
    pgrip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSnap(PS.snap === "full" ? "half" : PS.snap === "half" ? "full" : "half"); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSnap(PS.snap === "peek" ? "half" : "full"); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSnap(PS.snap === "full" ? "half" : "peek"); }
    });
    qIn.addEventListener("keydown", function (e) { if (e.key === "Enter" && narrow() && !atHome() && sheet.hidden) { setTimeout(function () { setSnap("half"); }, 50); } });
    window.addEventListener("resize", debounce(function () { setSnap(PS.snap); }, 120));
    // スマホで地図の何もないところを押したら、パネルを小さくして地図を広く見せる
    if (map) {
      map.on("click", function (e) {
        if (!narrow() || RT.pick || Date.now() - (PS.pickAt || 0) < 400 || (e.sourceTarget && e.sourceTarget !== map)) { return; }
        if (PS.snap !== "peek" && !(PS.home && sheet.hidden)) { setSnap("peek"); }
      });
    }
    appHooks.enter = function () {
      setTimeout(function () { if (map) { map.invalidateSize(); } setSnap(PS.snap); }, 40);
      setTimeout(hintShow, 1500);
    };
    // ---- 機能の場所を知らせる吹き出し：ページを開くたび（更新するたび）に1つずつ、全部を2周したら出さない ----
    KEY.hint = "itbx-m-hint-v1";
    var HINTS = [
      { t: function () { return !sheet.hidden ? null : PS.home ? (narrow() ? $(".c-home-h", homeEl) : $(".c-home-grid", homeEl)) : condsEl.hidden ? null : condsEl; },
        x: function () { return PS.home ? "目的を選ぶと、雨の日・子連れ・無料などでも絞り込めます" : "雨の日・子連れ・無料などの条件で、さらに絞り込めます"; } },
      { t: function () { return $('[data-act="rt"]', fab); }, x: function () { return "都営交通だけの経路を調べられます。出発地・目的地は駅名・停留所名で探します"; } },
      { t: function () { return $('[data-act="rings"]', side); }, x: function () { return "徒歩5・10・20分の範囲と、範囲の中の件数を出せます"; } },
      { t: function () { return menuBtn; }, x: function () { return "場所を「コースに入れる」と、メニューの「自分のコース」で道順・印刷・共有ができます"; } },
      { t: function () { return menuBtn; }, x: function () { return "場所の「行った」で日付を残せます。町ごとの回った数はメニューの「行った場所」から"; } },
      { t: function () { return menuBtn; }, x: function () { return "文字は、メニューの「文字」で大きくできます"; } },
      { t: function () { return menuBtn; }, x: function () { return "記事やコメント欄へは、メニューの「地図を閉じて、ブログの記事を見る」で戻れます"; } },
    ];
    var hintEl = null, hintTimer = 0, hintDone = false;
    function hintHide() {
      clearTimeout(hintTimer);
      if (hintEl) { hintEl.hidden = true; }
    }
    function hintShow() {
      if (hintDone || T || !root.classList.contains("is-app") || !drawer.hidden || RT.pick) { return; }
      var n = Number(store.get(KEY.hint, 0)) || 0;
      if (n >= HINTS.length * 2) { hintDone = true; return; }
      for (var k = 0; k < HINTS.length; k++) {
        var h = HINTS[(n + k) % HINTS.length], el = h.t();
        if (!el || el.offsetParent === null) { continue; }
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) { continue; }
        hintDone = true;
        store.set(KEY.hint, n + k + 1);
        hintPlace(el, h.x());
        return;
      }
    }
    function hintPlace(el, text) {
      if (!hintEl) {
        hintEl = document.createElement("div");
        hintEl.setAttribute("role", "status");
        hintEl.innerHTML = '<p class="c-hintpop-t"></p><button type="button" class="c-hintpop-x" data-act="hintx" aria-label="閉じる">' + icon("close") + '</button><span class="c-hintpop-ar" aria-hidden="true"></span>';
        stage.appendChild(hintEl);
      }
      $(".c-hintpop-t", hintEl).textContent = text;
      hintEl.className = "c-hintpop";
      hintEl.hidden = false;
      var sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), W = sr.width, H = sr.height;
      var cx = r.left + r.width / 2 - sr.left, cy = r.top + r.height / 2 - sr.top, bw = hintEl.offsetWidth, bh = hintEl.offsetHeight, g = 12, x, y, sd;
      if (cx > W * 0.6 && r.left - sr.left - bw - g >= 8) { sd = "left"; x = r.left - sr.left - bw - g; y = cy - bh / 2; }
      else if (!narrow() && r.right - sr.left < W * 0.45 && W - (r.right - sr.left) - g - bw >= 8) { sd = "right"; x = r.right - sr.left + g; y = cy - bh / 2; }
      else if (cy < H * 0.45) { sd = "below"; x = cx - bw / 2; y = r.bottom - sr.top + g; }
      else { sd = "above"; x = cx - bw / 2; y = r.top - sr.top - bh - g; }
      x = Math.max(8, Math.min(W - bw - 8, x));
      y = Math.max(8, Math.min(H - bh - 8, y));
      hintEl.style.left = Math.round(x) + "px";
      hintEl.style.top = Math.round(y) + "px";
      hintEl.classList.add("is-" + sd);
      var ar = $(".c-hintpop-ar", hintEl);
      var side2 = sd === "left" || sd === "right";
      ar.style.left = side2 ? "" : Math.round(Math.max(16, Math.min(bw - 16, cx - x))) + "px";
      ar.style.top = side2 ? Math.round(Math.max(12, Math.min(bh - 12, cy - y))) + "px" : "";
      clearTimeout(hintTimer);
      hintTimer = setTimeout(hintHide, 7000);
    }
    root.addEventListener("pointerdown", function (e) { if (hintEl && !hintEl.hidden && !hintEl.contains(e.target)) { hintHide(); } }, true);
    window.addEventListener("resize", hintHide);
    function appClick(act, b) {
      if (act === "hintx") { hintHide(); return true; }
      if (b.closest(".c-drawer") && (act === "course" || act === "tutorial" || act === "gotoindex")) { drawerOpen(false); }
      if (act === "menu") { drawerOpen(drawer.hidden); return true; }
      if (act === "listall" || act === "gotoindex") { drawerOpen(false); appList(); return true; }
      if (act === "exitapp") { drawerOpen(false); appExit(); return true; }
      if (act === "enterapp") { appEnter(); return true; }
      if (act === "pctoggle") { pcOpen(stage.classList.contains("is-pcclosed")); return true; }
      if (act === "qclear") { qIn.value = ""; qx.hidden = true; S.q = ""; S.ws = []; apply(false); qIn.focus(); return true; }
      if (act === "row") {
        var it = byId[b.getAttribute("data-id")];
        if (it && it.pin) { select(it.id); return true; }
      }
      return false;
    }

    takeState(st0);
    guideOpen(!store.get(KEY.guide, 0));
    paintTry();
    if (tagHint && CFG.tagHint && !store.get(KEY.taghint, 0) && !store.get(KEY.tut, 0) && "IntersectionObserver" in window) {
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
    setSnap(atHome() ? "half" : "peek");
    setTimeout(hintShow, 1800);

    // ---- おすすめの100か所のカード ----
    KEY.pick = "itbx-m-pick-v1";
    var PK = { list: null, k: -1, el: null, timer: 0, t0: 0, left: 0, hold: 0, off: false, gone: false, watch: 0 }, PK_MS = 8000;
    function pkToday() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
    function pickBoot() {
      if (!map || store.get(KEY.pick, "") === pkToday()) { return; }
      var started = false;
      var go = function () { if (!started) { started = true; setTimeout(pkTry, 5000); } };
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (es) {
          if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); go(); }
        }, { threshold: 0.5 });
        io.observe(stage);
      } else { go(); }
    }
    // ほかの案内や詳しい情報が出ているか
    function pkBusy() {
      return !!T || !drawer.hidden || !!RT.pick || (tagHint && !tagHint.hidden) ||
        (hintEl && !hintEl.hidden && hintEl.offsetParent !== null) || (!!S.panel && !sheet.hidden);
    }
    function pkTry() {
      if (PK.gone) { return; }
      if (store.get(KEY.pick, "") === pkToday()) { return; }
      if (pkBusy()) { setTimeout(pkTry, 2000); return; }
      if (PK.list) { pkShow(); return; }
      fetch(BASE + "pick.json").then(function (r) { if (!r.ok) { throw new Error("pick"); } return r.json(); }).then(function (j) {
        var L0 = (j && j.items || []).filter(function (r) { return r && r[0] && r[1]; });
        if (!L0.length) { return; }
        for (var i = L0.length - 1; i > 0; i--) { var r = Math.floor(Math.random() * (i + 1)), t = L0[i]; L0[i] = L0[r]; L0[r] = t; }
        PK.list = L0;
        pkShow();
      }, function () {});
    }
    function pkImg(p) { return kkThumb(p, 500 < p[2] ? 500 : 0); }
    function pkShow() {
      if (PK.gone || PK.el) { return; }
      var el = PK.el = document.createElement("aside");
      el.className = "c-osu";
      el.setAttribute("aria-label", "おすすめの場所");
      el.innerHTML = '<div class="c-osu-bar" aria-hidden="true"><i></i></div>' +
        '<button type="button" class="c-osu-x" data-pk="x" aria-label="おすすめを閉じる（今日はもう出しません）"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button>' +
        '<div class="c-osu-main"><div class="c-osu-ph"></div><div class="c-osu-tx"><p class="c-osu-k">特に行くべき100か所</p>' +
        '<p class="c-osu-n"></p><p class="c-osu-w"></p><p class="c-osu-y"></p></div></div>' +
        '<div class="c-osu-acts"><button type="button" class="c-osu-go" data-pk="go">地図で見る</button>' +
        '<button type="button" class="c-osu-nx" data-pk="next">次へ</button></div><p class="c-osu-cr"></p>';
      el.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-pk]") : null;
        if (!b) { return; }
        var a = b.getAttribute("data-pk");
        if (a === "x") { store.set(KEY.pick, pkToday()); pkEnd(); }
        else if (a === "next") { pkNext(); }
        else if (a === "go") {
          var id = PK.list[PK.k][0];
          pkEnd();
          select(id, { label: "特に行くべき100か所から" });
        }
      });
      el.addEventListener("error", function (e) {
        var t = e.target;
        if (!t || t.tagName !== "IMG") { return; }
        var fb = t.getAttribute("data-fb");
        if (fb && t.getAttribute("src") !== fb) { t.setAttribute("src", fb); return; }
        var ph = t.parentNode;
        ph.innerHTML = "";
        ph.hidden = true;
        $(".c-osu-cr", el).hidden = true;
      }, true);
      ["mouseenter", "focusin", "touchstart"].forEach(function (ev) { el.addEventListener(ev, function () { pkHold(1); }, { passive: true }); });
      ["mouseleave", "focusout"].forEach(function (ev) {
        el.addEventListener(ev, function () { if (ev === "focusout" && el.contains(document.activeElement)) { return; } pkHold(-1); });
      });
      document.addEventListener("visibilitychange", pkVis);
      document.addEventListener("touchstart", pkTouchOut, { passive: true });
      stage.appendChild(el);
      PK.k = -1;
      pkNext(true);
      PK.watch = setInterval(pkWatch, 600);
      pkWatch();
    }
    function pkRender() {
      var r = PK.list[PK.k], el = PK.el, ph = $(".c-osu-ph", el), cr = $(".c-osu-cr", el), p = r[5];
      $(".c-osu-n", el).textContent = r[1];
      $(".c-osu-w", el).textContent = r[2];
      $(".c-osu-y", el).textContent = r[3];
      if (p) {
        ph.innerHTML = '<img src="' + esc(pkImg(p)) + '" alt="" width="' + p[2] + '" height="' + p[3] + '" decoding="async"' +
          (p[7] ? ' data-fb="' + esc(kkThumb(p, p[7], "thumb")) + '"' : "") + ">";
        cr.innerHTML = "写真：" + esc(p[4]) + "（" + (p[6] ? '<a href="' + esc(p[6]) + '" target="_blank" rel="noopener">' + esc(p[5]) + "</a>" : esc(p[5])) + "）／" +
          '<a href="' + esc("https://commons.wikimedia.org/wiki/File:" + p[1]) + '" target="_blank" rel="noopener">Wikimedia Commons</a>';
        ph.hidden = false;
        cr.hidden = false;
      } else {
        ph.innerHTML = "";
        ph.hidden = true;
        cr.innerHTML = "";
        cr.hidden = true;
      }
      var nx = PK.list[(PK.k + 1) % PK.list.length];
      if (nx && nx[5]) { (new Image()).src = pkImg(nx[5]); }
    }
    function pkCalm() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    function pkNext(first) {
      if (!PK.el) { return; }
      PK.k = (PK.k + 1) % PK.list.length;
      var el = PK.el;
      if (first || pkCalm()) { pkRender(); }
      else {
        el.classList.add("is-swap");
        setTimeout(function () { if (PK.el) { pkRender(); PK.el.classList.remove("is-swap"); } }, 200);
      }
      var bar = $(".c-osu-bar i", el);
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
      clearTimeout(PK.timer);
      PK.left = PK_MS;
      PK.t0 = Date.now();
      if (!PK.hold && !PK.off && !document.hidden) { PK.timer = setTimeout(pkNext, PK.left); }
      else { el.classList.add("is-paused"); }
    }
    function pkPause() {
      if (!PK.el || PK.el.classList.contains("is-paused")) { return; }
      clearTimeout(PK.timer);
      PK.left = Math.max(300, PK.left - (Date.now() - PK.t0));
      PK.el.classList.add("is-paused");
    }
    function pkResume() {
      if (!PK.el || PK.hold || PK.off || document.hidden || !PK.el.classList.contains("is-paused")) { return; }
      PK.el.classList.remove("is-paused");
      PK.t0 = Date.now();
      clearTimeout(PK.timer);
      PK.timer = setTimeout(pkNext, PK.left);
    }
    function pkHold(d) {
      PK.hold = Math.max(0, d > 0 ? 1 : 0);
      if (PK.hold) { pkPause(); } else { pkResume(); }
    }
    function pkVis() { if (document.hidden) { pkPause(); } else { pkResume(); } }
    // スマホでカードに触れて止めたときは、カードの外に触れたら動かし直す
    function pkTouchOut(e) { if (PK.el && PK.hold && !PK.el.contains(e.target)) { pkHold(-1); } }
    // 詳しい情報などが開いたら隠し、閉じたらまた出す。スマホでは下のパネルの上に置く
    function pkWatch() {
      var el = PK.el;
      if (!el) { return; }
      var off = pkBusy();
      if (off !== PK.off) {
        PK.off = off;
        el.classList.toggle("is-off", off);
        if (off) { pkPause(); } else { pkResume(); }
      }
      // スマホでは、下のパネル（最初の画面・一覧・選んだ場所）の上に置く。パネルが高すぎるときは重ねる
      var b = 0;
      if (narrow()) {
        var sr = stage.getBoundingClientRect(), top = sr.bottom;
        [sheet, $(".c-panel")].forEach(function (pe) {
          if (!pe || pe.hidden || pe.offsetParent === null) { return; }
          var r = pe.getBoundingClientRect();
          if (r.height > 0 && r.top < top && r.bottom >= sr.bottom - 4) { top = r.top; }
        });
        b = Math.round(sr.bottom - top + 10);
        if (b + el.offsetHeight > sr.height - 90) { b = 0; }
      }
      el.style.bottom = b > 12 ? b + "px" : "";
    }
    function pkEnd() {
      PK.gone = true;
      clearTimeout(PK.timer);
      clearInterval(PK.watch);
      document.removeEventListener("visibilitychange", pkVis);
      document.removeEventListener("touchstart", pkTouchOut);
      if (PK.el && PK.el.parentNode) { PK.el.parentNode.removeChild(PK.el); }
      PK.el = null;
    }
    ready = true;
    ensureQuery();
    pickBoot();
    if (X && map) { map.on("moveend", debounce(ensureView, 150)); setTimeout(ensureView, 300); }
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
