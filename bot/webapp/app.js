(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#05070d'); }

  const ICONS = {
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>'
  };

  const view = document.getElementById('view');
  let userName;

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

  function playerRow(player, label, value) {
    const row = el('div', 'player-row');
    const rank = el('div', 'player-rank');
    rank.textContent = player.rank != null ? player.rank : player.position != null ? player.position : '—';
    if (rank.textContent === '1') rank.classList.add('top1');
    else if (rank.textContent === '2' || rank.textContent === '3') rank.classList.add('top2');

    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', player.nickname));
    const meta = el('div', 'player-meta');
    if (player.team) meta.appendChild(el('span', null, player.team));
    if (player.country_code) meta.appendChild(el('span', 'c-badge', player.country_code.toUpperCase()));
    info.appendChild(meta);

    const stat = el('div', 'player-stat');
    stat.appendChild(el('div', 'val', value));
    stat.appendChild(el('div', 'lab', label));

    row.appendChild(rank); row.appendChild(info); row.appendChild(stat);
    return row;
  }

  async function renderStats() {
    clear();
    view.appendChild(sectionTitle('stats', 'Статистика'));
    view.appendChild(el('div', 'spinner', 'ЗАГРУЗКА...'));
    try {
      const res = await api.get('/api/stats');
      if (!res.ok) throw new Error('bad response');
      const s = res.stats;
      clear();
      view.appendChild(sectionTitle('stats', 'Статистика'));
      view.appendChild(el('p', 'muted-note', 'Данные: FACEIT · обновляется раз в 15 мин.'));
      view.appendChild(el('div', 'section-title', 'FACEIT · ELO (' + (s.faceit && s.faceit.region ? s.faceit.region : 'EU') + ')'));
      if (s.faceit && s.faceit.players && s.faceit.players.length) {
        s.faceit.players.forEach(p => {
          const item = Object.assign({}, p, { rank: p.position });
          view.appendChild(playerRow(item, 'ELO', p.faceit_elo != null ? p.faceit_elo.toLocaleString('en-US') : '—'));
        });
      } else {
        view.appendChild(el('p', 'section-text', 'FACEIT не подключён: добавь FACEIT_API_KEY'));
      }
    } catch (err) {
      view.appendChild(el('p', 'section-text', 'Не удалось загрузить статистику'));
    }
  }

  async function init() {
    document.getElementById('appHeader').innerHTML =
      '<h1><span class="logo">' + ICONS.bolt + '</span><span class="brand">CS2 <span class="hl">COACH</span></span></h1>' +
      '<span id="userName"></span>';
    userName = document.getElementById('userName');
    try {
      const initRes = await api.get('/api/init');
      if (!initRes.ok) { view.appendChild(el('p', 'section-text', 'Открой приложение через бота')); return; }
      userName.textContent = initRes.user.first_name;
      await renderStats();
    } catch (err) {
      view.appendChild(el('p', 'section-text', 'Не удалось загрузить данные'));
    }
  }

  init();
})();
