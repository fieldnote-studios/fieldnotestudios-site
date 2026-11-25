/* field note* studios — analytics consent + Google Analytics 4
   GA only loads after the visitor taps "Allow". Their choice is kept on this device.
   Set GA_ID to the Measurement ID from GA4 (Admin → Data streams → Web). */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  var KEY = 'fn-analytics';
  var PREVIEW = /[?&#]consent-preview/.test(location.href);
  var ready = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  var base = document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/assets\/consent\.js.*$/, '') : '/';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* ---------- Google Analytics ---------- */
  var loaded = false;
  function ev(name, params) { if (loaded && window.gtag) window.gtag('event', name, params || {}); }
  function loadGA() {
    if (loaded || !ready) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  /* ---------- click + form events (only sent once GA is on) ---------- */
  function label(el) { return (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').replace(/[→↗↵]/g, '').trim().slice(0, 80); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a,label,button');
    if (!t) return;
    var f = t.getAttribute('for') || '';
    var href = t.getAttribute('href') || '';
    if (f === 'st-f') ev('contact_open', { location: t.closest('.mobct') ? 'mobile footer' : (t.classList.contains('mob-cta') ? 'mobile top' : 'hero') });
    else if (/^pf-o$/.test(f) || t.classList.contains('pflink')) ev('portfolio_request_open');
    else if (/^mailto:/.test(href)) ev('email_click', { link_text: label(t) });
    else if (/#contact$|^\/contact$/.test(href)) ev('start_project_click', { page: location.pathname });
    else if (/^https?:/.test(href) && href.indexOf(location.host) < 0) ev('case_study_link', { link_url: href, link_text: label(t) });
  }, true);
  document.addEventListener('change', function (e) {
    var i = e.target;
    if (i.matches && i.matches('.sv input') && i.checked) {
      var nm = i.closest('.sv').querySelector('.nm');
      ev('service_open', { service: nm ? label(nm) : '' });
    }
  }, true);
  // form sends go to Formspree: count the ones that succeed
  if (window.fetch) {
    var f0 = window.fetch;
    window.fetch = function (url, opts) {
      var p = f0.apply(this, arguments);
      try {
        if (String(url).indexOf('formspree.io') > -1) {
          var subj = '';
          try { var b = opts && opts.body; subj = b && b.get ? (b.get('_subject') || '') : String(b || ''); } catch (x) {}
          var kind = /portfolio/i.test(subj) ? 'portfolio_request' : 'project_enquiry';
          p.then(function (r) { if (r.ok) ev('generate_lead', { form: kind }); });
        }
      } catch (x) {}
      return p;
    };
  }

  /* ---------- banner ---------- */
  var css = '' +
    '.fnc{position:fixed;z-index:9999;left:24px;bottom:24px;width:min(380px,calc(100vw - 32px));box-sizing:border-box;' +
    'background:rgba(13,20,36,.97);color:#F4F4F1;border:1px solid rgba(244,244,241,.16);border-radius:0;padding:20px 20px 16px;' +
    'box-shadow:0 18px 50px rgba(0,0,0,.45);font:14px/1.55 Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;' +
    '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);opacity:0;transform:translateY(10px);transition:opacity .35s ease,transform .35s ease}' +
    '.fnc.on{opacity:1;transform:none}' +
    '.fnc-h{display:flex;align-items:baseline;gap:8px;margin:0 0 6px;font:400 19px/1.2 Quattrocento,Georgia,serif;letter-spacing:.005em}' +
    '.fnc-h b{font:400 15px/1 "Fanwood Text",Georgia,serif;color:#F4F4F1;transform:translateY(-3px)}' +
    '.fnc p{margin:0 0 14px;color:#C3C5CC}' +
    '.fnc p a{color:#F4F4F1;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(244,244,241,.4)}' +
    '.fnc-r{display:flex;align-items:center;gap:8px}' +
    '.fnc button{font:600 11px/1 Manrope,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border-radius:0;min-height:42px;padding:0 18px}' +
    '.fnc .y{background:#F4F4F1;color:#070D1D;border:1px solid #F4F4F1}' +
    '.fnc .n{background:transparent;color:#F4F4F1;border:1px solid rgba(244,244,241,.35)}' +
    '.fnc button:hover{opacity:.88}.fnc button:focus-visible,.fnc a:focus-visible{outline:2px solid #C9A66B;outline-offset:2px}' +
    '@media (max-width:600px){.fnc{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));width:auto}.fnc-r button{flex:1}}' +
    '@media (prefers-reduced-motion:reduce){.fnc{transition:none}}';

  var box;
  function show() {
    if (box) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div');
    box.className = 'fnc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Analytics cookies');
    box.innerHTML = '<div class="fnc-h">A quick note <b aria-hidden="true">*</b></div>' +
      '<p>May we use Google Analytics cookies to see how people find and use this site? Nothing is tracked unless you say yes. ' +
      '<a href="' + base + 'privacy/">Privacy notice</a></p>' +
      '<div class="fnc-r"><button type="button" class="y">Allow</button><button type="button" class="n">No thanks</button></div>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('on'); }); });
    box.querySelector('.y').onclick = function () { set('yes'); hide(); loadGA(); };
    box.querySelector('.n').onclick = function () { set('no'); hide(); };
  }
  function hide() { if (!box) return; var b = box; box = null; b.classList.remove('on'); setTimeout(function () { b.remove(); }, 400); }

  // "Cookie settings" links anywhere on the site reopen the choice
  window.fnCookieSettings = function () {
    if (get() === 'yes' && loaded) {
      // switching off: forget the choice and drop GA cookies, then reload clean
      set('no');
      document.cookie.split(';').forEach(function (c) { var n = c.split('=')[0].trim(); if (/^_ga/.test(n)) { document.cookie = n + '=;Max-Age=0;path=/;domain=.' + location.hostname.replace(/^www\./, ''); document.cookie = n + '=;Max-Age=0;path=/'; } });
    }
    try { localStorage.removeItem(KEY); } catch (e) {}
    show();
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (a) { e.preventDefault(); window.fnCookieSettings(); }
  });

  function start() {
    if (!ready && !PREVIEW) document.querySelectorAll('[data-cookie-settings]').forEach(function (a) { a.style.display = 'none'; });
    var c = get();
    if (c === 'yes') loadGA();
    else if ((c === null && ready) || PREVIEW) setTimeout(show, 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
