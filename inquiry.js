(() => {
    const copy = {
        'zh-Hant': { cta: '詢價', title: '款式詢價', intro: '留下想了解的款式與數量，我們會透過 Email 回覆你。', name: '姓名 *', style: '墨鏡款式 *', choose: '請選擇款式', quantity: '數量 *', message: '詢問內容', privacy: '送出即同意將以上資料用於回覆本次詢價；詢價不代表成立訂單。', send: '送出詢價', sending: '寄送中…', success: '詢價已送出，我們會透過 Email 回覆你。', error: '目前無法確認寄送結果，填寫內容已保留。請稍後再試，或透過 Instagram 聯絡我們。', unavailable: '線上寄信尚未開放，請先透過下方 Instagram 私訊詢價。', ig: '也可以透過 Instagram 私訊詢價 ↗' },
        'nan-Hant-TW': { cta: '問價錢', title: '款式問價錢', intro: '留欲了解的款式佮數量，阮會用 Email 回覆你。', name: '姓名 *', style: '墨鏡款式 *', choose: '請揀款式', quantity: '數量 *', message: '欲問的內容', privacy: '送出就表示同意用以上資料回覆這擺詢價；詢價猶未算落訂。', send: '送出詢價', sending: '寄送中…', success: '詢價已經送出，阮會用 Email 回覆你。', error: '這馬無法度確認寄送結果，內容有留咧。請等一下閣試，抑是用 Instagram 聯絡阮。', unavailable: '線上寄信猶未開放，請先用下跤的 Instagram 私訊問價錢。', ig: '嘛會使用 Instagram 私訊問價錢 ↗' },
        en: { cta: 'Inquire', title: 'Product inquiry', intro: 'Tell us the style and quantity you have in mind. We’ll reply by email.', name: 'Name *', style: 'Style *', choose: 'Choose a style', quantity: 'Quantity *', message: 'Your message', privacy: 'By submitting, you agree to the use of these details to respond to this inquiry. An inquiry is not an order.', send: 'Send inquiry', sending: 'Sending…', success: 'Inquiry sent. We’ll reply by email.', error: 'We could not confirm delivery. Your details have been kept. Try again later or contact us on Instagram.', unavailable: 'Email inquiries are not available yet. Please message us on Instagram below.', ig: 'You can also inquire on Instagram ↗' },
        ja: { cta: 'お問い合わせ', title: '商品のお見積もり', intro: 'ご希望のモデルと数量をお知らせください。メールでご返信いたします。', name: 'お名前 *', style: 'モデル *', choose: 'モデルを選択', quantity: '数量 *', message: 'お問い合わせ内容', privacy: '送信により、ご入力内容を本件への返信に使用することに同意したものとします。お問い合わせはご注文ではありません。', send: '送信する', sending: '送信中…', success: 'お問い合わせを送信しました。メールでご返信いたします。', error: '送信結果を確認できませんでした。入力内容は保持されています。時間をおいて再試行するか、Instagramからお問い合わせください。', unavailable: 'メールでのお問い合わせは準備中です。下記のInstagramからご連絡ください。', ig: 'Instagramからもお問い合わせいただけます ↗' }
    };
    const form = document.querySelector('#inquiry-form'), button = document.querySelector('#inquiry-submit'), status = document.querySelector('#inquiry-status'); let busy = false, state = '';
    function render() { const t = copy[document.documentElement.lang] || copy['zh-Hant']; document.querySelectorAll('[data-inquiry-label]').forEach(el => el.textContent = t[el.dataset.inquiryLabel]); if (busy) button.textContent = t.sending; status.textContent = t[state] || '' }
    async function sendInquiryEmail(data) {
        const config = window.KINN_EMAILJS || {};
        if (!config.serviceId || !config.templateId || !config.publicKey) { throw new Error('emailjs-unavailable'); }
        const templateParams = { ...data, language: document.documentElement.lang };
        if (window.emailjs && typeof window.emailjs.init === 'function') {
            window.emailjs.init({ publicKey: config.publicKey });
        }
        if (window.emailjs && typeof window.emailjs.send === 'function') {
            const result = await window.emailjs.send(config.serviceId, config.templateId, templateParams, config.publicKey);
            if (!result || result.status >= 400) { throw new Error(result && result.text ? result.text : 'emailjs-sdk-send-failed'); }
            return result;
        }
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ service_id: config.serviceId, template_id: config.templateId, user_id: config.publicKey, template_params: templateParams }) });
            const text = await response.text();
            if (!response.ok) { throw new Error(text || 'send failed'); }
            return { status: response.status, text };
        } finally { clearTimeout(timeout); }
    }
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] }); render();
    document.querySelector('#inquire-current').addEventListener('click', () => { form.elements.product.value = frames[current][0]; });
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form));
        data.from_name = String(data.from_name || '').trim();
        data.reply_to = String(data.reply_to || '').trim();
        if (!data.from_name) { form.elements.from_name.focus(); return; }
        if (!data.reply_to) { form.elements.reply_to.focus(); return; }
        busy = true; button.disabled = true; form.setAttribute('aria-busy', 'true'); state = ''; render();
        try {
            await sendInquiryEmail(data);
            state = 'success'; form.reset();
        } catch (error) {
            console.error(error);
            if (String(error && error.message || error) === 'emailjs-unavailable') { state = 'unavailable'; }
            else { state = 'error'; }
        } finally {
            busy = false; button.disabled = false; form.setAttribute('aria-busy', 'false'); render();
        }
    });
})();