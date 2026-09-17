// Taiwanese Hokkien in Han characters; brand and collection names stay unchanged.
(()=>{
 const translations={
 '墨鏡系列':'墨鏡款式','關於 KÌNN':'認捌 KÌNN','聯絡我們':'佮阮聯絡',
 '光影之間，':'光佮影之間，','自有風格。':'有家己的款。','每一種輪廓，':'逐一種款式，','都是你。':'攏是你。',
 '六種表情。無限日常。':'六種表情。逐工攏有新意。','選一副，換個角度看世界。':'揀一副，換一个角度看世界。',
 '風格，':'風格，','從你的視角開始。':'對你的角度開始。','陽光落在臉上的那一刻，':'日頭照佇面頂的彼一刻，','世界有了不同的輪廓。':'世界就有無仝的模樣。',
 'KÌNN 相信，一副墨鏡不只是穿搭的最後一筆，':'KÌNN 相信，一副墨鏡毋但是穿衫搭配的最後一筆，','也是表達自己的第一個細節。':'嘛是表達家己的頭一个細節。','從俐落線條到柔和色澤，讓不同的你，':'對俐落的線條到幼秀的色水，予無仝的你，','在日常裡自在顯現。':'佇逐工的生活內，自在展現。',
 '下一個視角，':'後一个角度，','與你相見。':'佮你相見。','款式詢問 / 品牌合作':'款式洽詢 / 品牌合作','聯絡信箱即將公布':'聯絡信箱過無偌久就會公布','回到頂端 ↑':'轉去上頂 ↑','探索系列':'來看款式','換個心情 ↗':'換一个心情 ↗',
 '單指旋轉 360° · 雙指縮放':'一支指頭轉 360° · 兩支指頭放大縮小','3D 外觀示意，細節以實拍為準':'3D 外觀示意，細節照實際翕的相片為準','實拍照片':'實際翕的相片','返回 3D':'轉去 3D','產品實拍照片':'墨鏡實際翕的相片','此裝置無法顯示 3D · 目前顯示實拍照片':'這个裝置無法度顯示 3D · 這馬顯示實際翕的相片','3D 暫時無法顯示 · 請重新整理，或查看實拍照片':'3D 暫時無法度顯示 · 請閣整理一擺，抑是看實際翕的相片',
 '俐落方框 / 茶色鏡片':'俐落方框 / 茶色鏡片','柔金細框 / 淺茶鏡片':'柔金細框 / 淺茶色鏡片','飛行輪廓 / 漸層茶片':'飛行款式 / 漸層茶色鏡片','經典黑框 / 深灰鏡片':'經典烏框 / 深灰色鏡片','幾何細框 / 紫色漸層':'幾何細框 / 紫色漸層','大框輪廓 / 煙粉漸層':'大框款式 / 煙粉色漸層',
 '開啟導覽選單':'拍開導覽選單','關閉導覽選單':'關起導覽選單','重設模型角度':'重設模型角度','放大模型':'共模型放大','隨機切換墨鏡':'隨機換一副墨鏡','六款墨鏡大圖展示':'六款墨鏡大張相片','KÌNN 首頁':'KÌNN 頭頁','墨鏡 3D 模型，可拖曳旋轉、雙指縮放或使用方向鍵調整':'墨鏡 3D 模型，會使拖曳旋轉、兩支指頭放大縮小，嘛會使用方向鍵調整'
 };
 const english={
 '墨鏡系列':'Collection','關於 KÌNN':'About KÌNN','聯絡我們':'Contact',
 '光影之間，':'Between light and shade,','自有風格。':'find your own style.','每一種輪廓，':'Every frame,','都是你。':'a side of you.',
 '六種表情。無限日常。':'Six expressions. Endless everyday possibilities.','選一副，換個角度看世界。':'Choose a pair. See the world your way.',
 '風格，':'Style,','從你的視角開始。':'starts with your perspective.','陽光落在臉上的那一刻，':'When sunlight touches your face,','世界有了不同的輪廓。':'the world takes on a new shape.',
 'KÌNN 相信，一副墨鏡不只是穿搭的最後一筆，':'At KÌNN, sunglasses are more than a finishing touch.','也是表達自己的第一個細節。':'They are the first detail that speaks for you.','從俐落線條到柔和色澤，讓不同的你，':'From clean lines to soft hues, let every side of you','在日常裡自在顯現。':'shine through, every day.',
 '下一個視角，':'A fresh perspective.','與你相見。':'Let’s connect.','款式詢問 / 品牌合作':'Product inquiries / Brand collaborations','聯絡信箱即將公布':'Email coming soon','回到頂端 ↑':'Back to top ↑','探索系列':'Explore the collection','換個心情 ↗':'Switch the mood ↗',
 '單指旋轉 360° · 雙指縮放':'Drag to rotate 360° · Pinch to zoom','3D 外觀示意，細節以實拍為準':'3D illustration. Refer to product photos for details.','實拍照片':'Product photo','返回 3D':'Back to 3D','產品實拍照片':'Actual product photo','此裝置無法顯示 3D · 目前顯示實拍照片':'3D unavailable on this device · Showing product photo','3D 暫時無法顯示 · 請重新整理，或查看實拍照片':'3D temporarily unavailable · Refresh or view product photo',
 '俐落方框 / 茶色鏡片':'Clean square frame / Brown lenses','柔金細框 / 淺茶鏡片':'Soft gold frame / Light brown lenses','飛行輪廓 / 漸層茶片':'Aviator silhouette / Brown gradient lenses','經典黑框 / 深灰鏡片':'Classic black frame / Dark grey lenses','幾何細框 / 紫色漸層':'Geometric metal frame / Purple gradient lenses','大框輪廓 / 煙粉漸層':'Oversized frame / Smoky pink gradient lenses',
 '開啟導覽選單':'Open navigation','關閉導覽選單':'Close navigation','重設模型角度':'Reset model angle','放大模型':'Zoom in on model','隨機切換墨鏡':'Show a random pair','六款墨鏡大圖展示':'Six sunglasses styles in detail','KÌNN 首頁':'KÌNN home','墨鏡 3D 模型，可拖曳旋轉、雙指縮放或使用方向鍵調整':'3D sunglasses model. Drag to rotate, pinch to zoom, or use arrow keys.','在 Instagram 查看 kinn.eyewear':'Visit kinn.eyewear on Instagram'
 };
 const japanese={
 '墨鏡系列':'コレクション','關於 KÌNN':'KÌNNについて','聯絡我們':'お問い合わせ',
 '光影之間，':'光と影のあいだに、','自有風格。':'自分らしいスタイルを。','每一種輪廓，':'どのフレームにも、','都是你。':'あなたらしさ。',
 '六種表情。無限日常。':'6つの表情。広がる日常。','選一副，換個角度看世界。':'お気に入りの一本で、世界を新しい視点から。',
 '風格，':'スタイルは、','從你的視角開始。':'あなたの視点から。','陽光落在臉上的那一刻，':'陽の光が頬に触れるとき、','世界有了不同的輪廓。':'世界は、新しい表情を見せる。',
 'KÌNN 相信，一副墨鏡不只是穿搭的最後一筆，':'サングラスは、装いを仕上げるだけのものではなく、','也是表達自己的第一個細節。':'自分らしさを伝える、小さなきっかけ。','從俐落線條到柔和色澤，讓不同的你，':'シャープなラインから、やわらかな色合いまで。','在日常裡自在顯現。':'KÌNNとともに、日常にさまざまな自分らしさを。',
 '下一個視角，':'新しい視点で、','與你相見。':'あなたとつながる。','款式詢問 / 品牌合作':'商品のお問い合わせ / コラボレーション','聯絡信箱即將公布':'メールアドレスは近日公開','回到頂端 ↑':'トップへ戻る ↑','探索系列':'コレクションを見る','換個心情 ↗':'気分を変えて ↗',
 '單指旋轉 360° · 雙指縮放':'ドラッグで360°回転 · ピンチで拡大・縮小','3D 外觀示意，細節以實拍為準':'3Dはイメージです。詳細は商品写真をご確認ください。','實拍照片':'商品写真','返回 3D':'3Dに戻る','產品實拍照片':'実際の商品写真','此裝置無法顯示 3D · 目前顯示實拍照片':'この端末では3Dを表示できません · 商品写真を表示中','3D 暫時無法顯示 · 請重新整理，或查看實拍照片':'3Dを表示できません · 再読み込みするか、商品写真をご覧ください',
 '俐落方框 / 茶色鏡片':'シャープなスクエアフレーム / ブラウンレンズ','柔金細框 / 淺茶鏡片':'ソフトゴールドの細身フレーム / ライトブラウンレンズ','飛行輪廓 / 漸層茶片':'アビエーターフレーム / ブラウングラデーションレンズ','經典黑框 / 深灰鏡片':'クラシックなブラックフレーム / ダークグレーレンズ','幾何細框 / 紫色漸層':'幾何学的な細身フレーム / パープルグラデーションレンズ','大框輪廓 / 煙粉漸層':'大ぶりフレーム / スモーキーピンクのグラデーションレンズ',
 '開啟導覽選單':'メニューを開く','關閉導覽選單':'メニューを閉じる','重設模型角度':'モデルの角度をリセット','放大模型':'モデルを拡大','隨機切換墨鏡':'サングラスをランダムに切り替える','六款墨鏡大圖展示':'6種類のサングラスの商品写真','KÌNN 首頁':'KÌNN ホーム','墨鏡 3D 模型，可拖曳旋轉、雙指縮放或使用方向鍵調整':'サングラスの3Dモデル。ドラッグで回転、ピンチで拡大・縮小、矢印キーで角度を調整できます。','在 Instagram 查看 kinn.eyewear':'Instagramでkinn.eyewearを見る'
 };
 const dictionaries={'nan-Hant-TW':translations,en:english,ja:japanese};
 const reverse=Object.fromEntries(Object.values(dictionaries).flatMap(dict=>Object.entries(dict).map(([a,b])=>[b,a])));
 let lang='zh-Hant';try{const saved=localStorage.getItem('kinn-language');if(dictionaries[saved])lang=saved}catch{}
 const label=document.createElement('label');label.className='language-picker';label.innerHTML='<span>語言</span><select aria-label="選擇語言"><option value="zh-Hant">繁體中文</option><option value="nan-Hant-TW">台語（漢字）</option></select>';
 document.querySelector('header').insertBefore(label,document.querySelector('.menu'));const select=label.querySelector('select');for(const [code,name] of [['en','English'],['ja','日本語']]){const option=document.createElement('option');option.value=code;option.textContent=name;select.appendChild(option)}select.value=lang;
 function translate(value){const core=value.trim(),base=reverse[core]||core,target=dictionaries[lang]?.[base]||base;return value.replace(core,target)}
 function update(){observer.disconnect();document.documentElement.lang=lang;label.querySelector('span').textContent=lang==='en'?'Language':lang==='ja'?'言語':'語言';select.setAttribute('aria-label',lang==='en'?'Select language':lang==='ja'?'言語を選択':'選擇語言');const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement.closest('script,style,.language-picker'))continue;const next=translate(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next}
 document.querySelectorAll('[aria-label],img[alt]').forEach(el=>{if(el.closest('.language-picker'))return;for(const attr of ['aria-label','alt'])if(el.hasAttribute(attr)){const old=el.getAttribute(attr),next=translate(old);if(old!==next)el.setAttribute(attr,next)}});observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt']})}
 const observer=new MutationObserver(update);select.addEventListener('change',()=>{lang=select.value;try{localStorage.setItem('kinn-language',lang)}catch{}update()});update();
})();
