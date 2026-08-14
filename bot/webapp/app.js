(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#05070d'); }

  const ICONS = {
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>'
  };

  const view = document.getElementById('view');
  let loading = false;

  const api = {
    headers: { 'x-init-data': tg ? tg.initData : '' },
    get(path) { return fetch(path, { headers: this.headers }).then(r => r.json()); }
  };

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function iconEl(name) {
    const span = document.createElement('span');
    span.className = 'ico-sm';
    span.innerHTML = ICONS[name];
    return span;
  }

  function sectionTitle(icon, text) {
    const h = el('h2', 'lesson-title');
    h.appendChild(iconEl(icon));
    h.appendChild(document.createTextNode(text));
    return h;
  }

  function clear() { view.innerHTML = ''; }

  function formatNum(v, decimals) {
    return v.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function countUp(node, target, decimals, dur) {
    if (target == null || isNaN(target)) { node.textContent = '—'; return; }
    const t0 = performance.now();
    const d = dur || 900;
    function frame(now) {
      const t = Math.min((now - t0) / d, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = formatNum(target * eased, decimals);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function avatarEl(item) {
    const box = el('div', 'avatar');
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = '';
      img.addEventListener('error', () => {
        box.appendChild(el('span', null, (item.name || '?').charAt(0).toUpperCase()));
      });
      box.appendChild(img);
    } else {
      box.appendChild(el('span', null, (item.name || '?').charAt(0).toUpperCase()));
    }
    return box;
  }

  function playerRow(p, unit, maxVal) {
    const row = el('div', 'player-row');
    const rank = el('div', 'player-rank');
    rank.textContent = p.rank != null ? p.rank : '—';
    if (p.rank === 1) rank.classList.add('top1');
    else if (p.rank === 2 || p.rank === 3) rank.classList.add('top2');

    row.appendChild(avatarEl(p));

    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', p.name));
    const meta = el('div', 'player-meta');
    if (p.team) meta.appendChild(el('span', null, p.team));
    if (p.country_code) meta.appendChild(el('span', 'c-badge', p.country_code.toUpperCase()));
    info.appendChild(meta);
    row.appendChild(info);

    const stat = el('div', 'player-stat');
    const val = el('div', 'val');
    val.dataset.target = p.value;
    val.dataset.decimals = p.decimals;
    val.textContent = '0';
    stat.appendChild(val);
    stat.appendChild(el('div', 'lab', unit));
    row.appendChild(stat);

    const bar = el('div', 'bar');
    const fill = el('div', 'bar-fill');
    if (p.value != null && maxVal > 0) {
      fill.dataset.width = Math.max(3, Math.round(p.value / maxVal * 100));
    } else {
      fill.dataset.width = 0;
    }
    bar.appendChild(fill);
    row.appendChild(bar);
    return row;
  }

  function podiumCard(it, place, unit) {
    const card = el('div', 'p-card p' + place);
    card.appendChild(el('div', 'p-place', String(place)));
    card.appendChild(avatarEl(it));
    card.appendChild(el('div', 'p-name', it.name));
    const v = el('div', 'p-val');
    v.dataset.target = it.value;
    v.dataset.decimals = it.decimals;
    v.textContent = '0';
    card.appendChild(v);
    card.appendChild(el('div', 'p-unit', unit));
    return card;
  }

  function renderPodium(items, unit) {
    const podium = el('div', 'podium');
    [[items[1], 2], [items[0], 1], [items[2], 3]].forEach(([it, place]) => {
      if (it) podium.appendChild(podiumCard(it, place, unit));
    });
    return podium;
  }

  function renderSection(sec) {
    const wrap = el('div', 'stat-section');
    wrap.appendChild(el('div', 'section-title', sec.title + (sec.subtitle ? ' · ' + sec.subtitle : '')));
    const items = sec.items || [];
    if (items.length) {
      const maxVal = Math.max(...items.map(i => (i.value != null ? i.value : 0)));
      if (items.length >= 3) {
        wrap.appendChild(renderPodium(items, sec.unit));
        items.slice(3).forEach(it => wrap.appendChild(playerRow(it, sec.unit, maxVal)));
      } else {
        items.forEach(it => wrap.appendChild(playerRow(it, sec.unit, maxVal)));
      }
    } else {
      wrap.appendChild(el('p', 'section-text', 'Нет данных'));
    }
    return wrap;
  }

  function animateAll() {
    const nodes = view.querySelectorAll('.player-row, .p-card');
    nodes.forEach((node, i) => {
      node.style.animationDelay = (i * 40) + 'ms';
      node.classList.add('anim');
      const val = node.querySelector('.val, .p-val');
      if (val && val.dataset.target !== undefined) {
        setTimeout(() => countUp(val, +val.dataset.target, +val.dataset.decimals), 100 + i * 40);
      }
      const fill = node.querySelector('.bar-fill');
      if (fill) {
        setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 140 + i * 40);
      }
    });
  }

  async function renderStats(force) {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('stats', 'Статистика'));
    const meta = el('div', 'stats-meta');
    meta.appendChild(el('span', 'muted-note', 'Источники: bo3.gg/HLTV · FACEIT'));
    const refreshBtn = el('button', 'refresh-btn');
    refreshBtn.innerHTML = ICONS.refresh;
    refreshBtn.setAttribute('aria-label', 'Обновить');
    refreshBtn.addEventListener('click', () => renderStats(true));
    meta.appendChild(refreshBtn);
    view.appendChild(meta);

    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    view.appendChild(loadbar);
    refreshBtn.classList.add('spin');

    try {
      const res = await api.get(force ? '/api/stats?refresh=1' : '/api/stats');
      if (!res.ok) throw new Error('bad response');
      const sections = (res.stats && res.stats.sections) || [];
      loadbar.remove();
      if (sections.length) {
        view.appendChild(el('p', 'updated-note', 'Обновлено: ' + new Date(res.stats.generated_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })));
      }
      if (!sections.length) {
        view.appendChild(el('p', 'section-text', 'Нет данных'));
        return;
      }
      sections.forEach(sec => view.appendChild(renderSection(sec)));
      animateAll();
    } catch (err) {
      loadbar.remove();
      view.appendChild(el('p', 'section-text', 'Не удалось загрузить статистику'));
    } finally {
      refreshBtn.classList.remove('spin');
      loading = false;
    }
  }

  async function init() {
    const orb1 = document.createElement('div');
    orb1.className = 'orb orb1';
    const orb2 = document.createElement('div');
    orb2.className = 'orb orb2';
    document.body.appendChild(orb1);
    document.body.appendChild(orb2);

    document.getElementById('appHeader').innerHTML =
      '<h1><span class="logo">' + ICONS.bolt + '</span><span class="brand">CS2 <span class="hl">COACH</span></span></h1>' +
      '<span id="userName"></span>';

    try {
      const initRes = await api.get('/api/init');
      if (!initRes.ok) { view.appendChild(el('p', 'section-text', 'Открой приложение через бота')); return; }
      document.getElementById('userName').textContent = initRes.user.first_name;
      await renderStats(false);
    } catch (err) {
      view.appendChild(el('p', 'section-text', 'Не удалось загрузить данные'));
    }
  }

  init();
})();
