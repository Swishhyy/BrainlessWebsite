// Shared page behaviour: config links, mobile nav, copy-to-clipboard, footer year.
(function () {
  const cfg = window.SITE_CONFIG || {};
  const links = { discord: cfg.discordUrl, appeals: cfg.appealsUrl };

  document.querySelectorAll('[data-link]').forEach((el) => {
    const url = links[el.dataset.link];
    if (url) el.href = url;
    if (/^https?:/.test(el.href) && !el.href.startsWith(location.origin)) {
      el.target = '_blank';
      el.rel = 'noopener';
    }
  });
  document.querySelectorAll('[data-config]').forEach((el) => {
    const value = cfg[el.dataset.config];
    if (value) el.textContent = value;
  });

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = cfg[btn.dataset.copy] || '';
      try {
        await navigator.clipboard.writeText(text);
        toast('Copied ' + text);
      } catch {
        toast(text);
      }
    });
  });

  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
