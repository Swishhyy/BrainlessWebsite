// Leaderboard: reads the Core stats API, or sample data until it is configured.
(function () {
  const cfg = window.SITE_CONFIG || {};
  const api = (cfg.statsApiUrl || '').replace(/\/+$/, '');
  const LIMIT = 100;
  const state = { sort: 'xp', query: '', players: [], updated: null, sample: false };

  const els = {
    body: document.getElementById('lb-body'),
    podium: document.getElementById('lb-podium'),
    updated: document.getElementById('lb-updated'),
    banner: document.getElementById('lb-banner'),
    search: document.getElementById('lb-search'),
    buttons: document.querySelectorAll('[data-sort]'),
  };

  const SAMPLE_NAMES = ['Swishhyy', 'Dr. Bright', 'PeanutEnjoyer', 'ClassD#4471', 'NTF_Sergeant', 'Larry Fan', 'Mad Scientist', 'xX_Chaos_Xx', 'Janitor Bob', 'ShyGuyGamer', 'Locksmith', 'Big Boi', 'Candy Man', 'Facility Guard', 'Breakneck'];
  function sample(sort) {
    const rows = SAMPLE_NAMES.map((name, i) => {
      const xp = Math.round(9000 / (i + 1.3)) + (i * 37) % 120;
      return { name, xp, level: Math.floor(Math.sqrt(xp / 100)), playtimeHours: Math.round((200 / (((i * 7) % 15) + 1.5)) * 10) / 10 };
    });
    rows.sort((a, b) => (sort === 'playtime' ? b.playtimeHours - a.playtimeHours : b.xp - a.xp));
    return rows.map((p, i) => ({ ...p, rank: i + 1 }));
  }

  const fmt = new Intl.NumberFormat();
  function hours(h) {
    if (h < 1) return Math.round(h * 60) + 'm';
    return fmt.format(Math.round(h * 10) / 10) + 'h';
  }
  function text(value) {
    const span = document.createElement('span');
    span.textContent = value;
    return span.innerHTML;
  }

  function showBanner(message) {
    els.banner.hidden = !message;
    els.banner.innerHTML = message || '';
  }

  async function load() {
    els.body.innerHTML = '<tr><td colspan="5" class="empty">Loading…</td></tr>';
    if (!api) {
      state.players = sample(state.sort);
      state.sample = true;
      state.updated = null;
      showBanner('<strong>Sample data.</strong> The live leaderboard appears once the stats API is connected (<code class="mono">statsApiUrl</code> in <code class="mono">assets/js/config.js</code>).');
      return render();
    }
    try {
      const res = await fetch(`${api}/api/v1/leaderboard?sort=${state.sort}&limit=${LIMIT}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      state.players = Array.isArray(data.players) ? data.players : [];
      state.updated = data.updated ? new Date(data.updated) : new Date();
      state.sample = false;
      showBanner('');
    } catch (error) {
      state.players = [];
      state.updated = null;
      showBanner('<strong>The leaderboard is offline right now.</strong> The game server may be restarting. Try again in a minute.');
      els.banner.classList.add('danger');
    }
    render();
  }

  function render() {
    const q = state.query.trim().toLowerCase();
    const rows = q ? state.players.filter((p) => String(p.name).toLowerCase().includes(q)) : state.players;

    els.updated.textContent = state.sample ? 'sample data' : state.updated ? 'updated ' + state.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const top = q ? [] : state.players.slice(0, 3);
    els.podium.hidden = top.length === 0;
    els.podium.innerHTML = top
      .map((p, i) => `<div class="card p${i + 1}"><div class="medal">${i + 1}</div><div class="name">${text(p.name)}</div><div class="sub">${state.sort === 'playtime' ? hours(p.playtimeHours) + ' played' : fmt.format(p.xp) + ' XP'} · level ${p.level}</div></div>`)
      .join('');

    if (rows.length === 0) {
      els.body.innerHTML = `<tr><td colspan="5" class="empty">${q ? 'No players match your search.' : 'No stats recorded yet.'}</td></tr>`;
      return;
    }
    els.body.innerHTML = rows
      .map((p) => `<tr class="r${p.rank}"><td class="rank">${p.rank}</td><td>${text(p.name)}</td><td><span class="lvl">LV ${p.level}</span></td><td class="num">${fmt.format(p.xp)}</td><td class="num hide-sm">${hours(p.playtimeHours)}</td></tr>`)
      .join('');
  }

  els.buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (state.sort === btn.dataset.sort) return;
      state.sort = btn.dataset.sort;
      els.buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      load();
    }),
  );
  els.search.addEventListener('input', () => {
    state.query = els.search.value;
    render();
  });

  load();
  if (api) setInterval(load, 60000);
})();
