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

  function playerRow(p) {
    const row = el('div', 'player-row');
    const rank = el('div', 'player-rank');
    rank.textContent = p.rank != null ? p.rank : '—';
    if (rank.textContent === '1') rank.classList.add('top1');
    else if (rank.textContent === '2' || rank.textContent === '3') rank.classList.add('top2');

    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', p.name));
    const meta = el('div', 'player-meta');
    if (p.team) meta.appendChild(el('span', null, p.team));
    if (p.country_code) meta.appendChild(el('span', 'c-badge', p.country_code.toUpperCase()));
    info.appendChild(meta);

    const stat = el('div', 'player-stat');
    stat.appendChild(el('div', 'val', p.value));
    stat.appendChild(el('div', 'lab', p.label));

    row.appendChild(rank); row.appendChild(info); row.appendChild(stat);
    return row;
  }

  function renderSlide(sec) {
    const slide = el('section', 'slide');
    slide.appendChild(el('div', 'section-title', sec.title + (sec.subtitle ? ' · ' + sec.subtitle : '')));
    if (sec.items && sec.items.length) {
      sec.items.forEach(it => slide.appendChild(playerRow(it)));
    } else {
      slide.appendChild(el('p', 'section-text', 'Нет данных'));
    }
    return slide;
  }

  async function renderStats() {
    clear();
    view.appendChild(sectionTitle('stats', 'Статистика'));
    view.appendChild(el('p', 'muted-note', 'Свайп в сторону, чтобы сменить раздел'));
    const spin = el('div', 'spinner', 'ЗАГРУЗКА...');
    view.appendChild(spin);
    try {
      const res = await api.get('/api/stats');
      if (!res.ok) throw new Error('bad response');
      const sections = (res.stats && res.stats.sections) || [];
      spin.remove();
      if (!sections.length) {
        view.appendChild(el('p', 'section-text', 'Нет данных'));
        return;
      }
      const carousel = el('div', 'carousel');
      const dots = el('div', 'dots');
      sections.forEach(sec => carousel.appendChild(renderSlide(sec)));
      sections.forEach((_, i) => {
        const dot = el('button', 'dot');
        dot.addEventListener('click', () => {
          carousel.scrollTo({ left: i * carousel.clientWidth, behavior: 'smooth' });
        });
        dots.appendChild(dot);
      });
      const setActiveDot = idx => {
        [...dots.children].forEach((d, i) => d.classList.toggle('active', i === idx));
      };
      setActiveDot(0);
      carousel.addEventListener('scroll', () => {
        setActiveDot(Math.round(carousel.scrollLeft / carousel.clientWidth));
      });
      view.appendChild(carousel);
      view.appendChild(dots);
    } catch (err) {
      spin.remove();
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
