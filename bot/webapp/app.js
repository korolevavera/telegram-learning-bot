(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#05070d'); }

  const ICONS = {
    bolt: '<svg class="bolt" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    drill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3h5v5c0 3.3-1.2 4.5-2.5 4.5S9.5 11.3 9.5 8V3z"/><path d="M12 12.5V19"/><path d="M12 19l-3.5 3h7l-3.5-3z"/><path d="M10.2 6h3.6"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    guides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  };

  const view = document.getElementById('view');
  let loading = false;
  let currentUser = null;
  let currentRegion = 'EU';
  let currentPeriod = 180;
  let currentTheme = 'dark';
  let lang = 'ru';
  let sectionsCache = null;
  let currentPage = null;
  let guidesTab = 'maps';
  const backStack = [];
  const detailCache = { team: {}, player: {}, faceit: {} };
  const SET_KEY = 'cs2coach.settings';
  const FAV_KEY = 'cs2coach.favs';
  const ONB_KEY = 'cs2coach.onboarded';
  const REGIONS = ['EU', 'NA', 'SA', 'AS', 'AU'];
  const THEMES = ['dark', 'light', 'gurren'];
  const PERIODS = [[90, 'p90'], [180, 'p180'], [365, 'p365']];

  const I18N = {
    ru: {
      tab_stats: 'Статистика', tab_settings: 'Настройки', back: 'Назад',
      src_note: 'Источники: bo3.gg · FACEIT', refresh: 'Обновить',
      search_ph: 'Поиск по командам и игрокам…',
      hint: 'Нажми на команду или игрока, чтобы открыть карточку', hint_close: 'Закрыть подсказку',
      updated: 'Обновлено', period: 'период', region: 'регион',
      not_found: 'Ничего не найдено по запросу', no_data: 'Нет данных',
      fav_title: 'Избранное', type_team: 'Команда', type_player: 'Игрок', type_faceit: 'FACEIT',
      fav_remove: 'Убрать из избранного', fav_add: 'В избранное',
      p90: '3 месяца', p180: '6 месяцев', p365: '12 месяцев',
      p90s: '3 мес.', p180s: '6 мес.', p365s: '12 мес.',
      sec_teams: 'Команды', sec_pro: 'Про-сцена',
      sub_teams: 'Топ-{0} · винрейт за {1}', sub_faceit: 'Топ-{0} · регион {1}', sub_pro: 'Топ-{0} · рейтинг за {1}',
      err_stats: 'Не удалось загрузить статистику', err_team: 'Не удалось загрузить команду', err_player: 'Не удалось загрузить игрока',
      retry: 'Повторить',
      stats_6m: 'Статистика за 6 месяцев', history_6m: 'История · матчи за 6 мес.',
      roster: 'Состав', achievements: 'Достижения', founded: 'Основана: ',
      l_matches: 'Матчи', l_wins: 'Победы', l_losses: 'Поражения', l_winrate: 'Винрейт',
      l_games: 'Игр', l_round_wr: 'WR раундов', l_t: 'T-side', l_ct: 'CT-side',
      l_pistol: 'Пистолетки', l_eco: 'Эко', l_force: 'Форс-бай', l_buy: 'Фулл-бай', l_kd: 'K/D',
      stat_for: 'Статистика ', maps_for: 'Карты · ', per_last: 'за последние шесть месяцев',
      career: 'Карьера · команды',
      story: 'Жизненный путь и история успеха', personal: 'Личные данные',
      b_nick: 'Псевдоним', b_real: 'Настоящее имя', b_aliases: 'Псевдонимы', b_bday: 'Дата рождения',
      b_country: 'Страна', b_region: 'Регион', b_role: 'Роль', b_team: 'Команда',
      b_since: 'В команде с', b_prize: 'Призовые', b_rating: 'Рейтинг',
      tags: 'Теги', socials: 'Соцсети', photo_unavail: 'Фото недоступно', years: ' лет',
      l_maps_n: 'Карт: ', l_k: 'K: ', l_adr: 'ADR: ',
      match_wr: 'Винрейт матчей', game_wr: 'Винрейт игр', l_hs: 'HS%', assists: 'Ассистов',
      f_bio: 'Биография', f_nick: 'Никнейм', f_level: 'Уровень FACEIT', f_elo: 'Рейтинг ELO',
      f_since: 'Аккаунт с', f_stats: 'Статистика на FACEIT', f_kills: 'Убийств',
      f_streak: 'Серия', f_longest: 'Макс. серия', f_last: 'Последние матчи', f_maps: 'Карты',
      f_matches_n: 'Матчей: ', f_socials: 'Соц сети',
      set_theme: 'Тема оформления', set_lang: 'Язык',
      gurren_q1: '«Верь в меня, что верит в тебя!» — Камина',
      gurren_q2: '«Мой бур пробьёт и небеса!» — Симон',
      gurren_q3: '«Выходи за пределы невозможного!» — Камина',
      gurren_note: 'Команда Дай-Гуррен · «Кто, по-твоему, мы такие?!» — Камина · «Мой бур пробьёт небеса!» — Симон',
      theme_dark: 'Тёмная', theme_light: 'Светлая', theme_gurren: 'Gurren Lagann',
      lang_ru: 'Русский', lang_en: 'English',
      profile_tg: 'Профиль Telegram', app_label: 'Приложение', version: 'Версия',
      src_data: 'Источники данных', set_region: 'Регион FACEIT', set_period: 'Период статистики',
      fav_empty: 'Пока пусто — добавь звёздочкой из карточки игрока или команды',
      fav_rm: 'Убрать', refresh_stats: 'Обновить статистику', user: 'Пользователь',
      app_open: 'Открой приложение через бота', load_fail: 'Не удалось загрузить данные',
      tab_guides: 'Гайды',
      g_tab_maps: 'Карты', g_tab_mikra: 'Микра',
      g_sections: 'разделов', g_back_guides: 'В гайды', g_soon: 'Скоро здесь появится контент',
      g_cat_smokes: 'Смоки', g_cat_molotovs: 'Молотовы', g_cat_flashes: 'Флешки',
      g_cat_grenades: 'Гранаты', g_cat_setups: 'Сетапы', g_cat_tactics: 'Тактики'
    },
    en: {
      tab_stats: 'Stats', tab_settings: 'Settings', back: 'Back',
      src_note: 'Sources: bo3.gg · FACEIT', refresh: 'Refresh',
      search_ph: 'Search teams and players…',
      hint: 'Tap a team or player to open their card', hint_close: 'Close hint',
      updated: 'Updated', period: 'period', region: 'region',
      not_found: 'Nothing found for', no_data: 'No data',
      fav_title: 'Favorites', type_team: 'Team', type_player: 'Player', type_faceit: 'FACEIT',
      fav_remove: 'Remove from favorites', fav_add: 'Add to favorites',
      p90: '3 months', p180: '6 months', p365: '12 months',
      p90s: '3 mo.', p180s: '6 mo.', p365s: '12 mo.',
      sec_teams: 'Teams', sec_pro: 'Pro scene',
      sub_teams: 'Top {0} · winrate {1}', sub_faceit: 'Top {0} · region {1}', sub_pro: 'Top {0} · rating {1}',
      err_stats: 'Failed to load stats', err_team: 'Failed to load team', err_player: 'Failed to load player',
      retry: 'Retry',
      stats_6m: '6-month stats', history_6m: 'History · matches 6 mo.',
      roster: 'Roster', achievements: 'Achievements', founded: 'Founded: ',
      l_matches: 'Matches', l_wins: 'Wins', l_losses: 'Losses', l_winrate: 'Winrate',
      l_games: 'Games', l_round_wr: 'Round WR', l_t: 'T-side', l_ct: 'CT-side',
      l_pistol: 'Pistols', l_eco: 'Eco', l_force: 'Force', l_buy: 'Full buy', l_kd: 'K/D',
      stat_for: 'Stats for ', maps_for: 'Maps · ', per_last: 'the last 6 months',
      career: 'Career · teams',
      story: 'Life story and path to success', personal: 'Personal info',
      b_nick: 'Nickname', b_real: 'Real name', b_aliases: 'Aliases', b_bday: 'Date of birth',
      b_country: 'Country', b_region: 'Region', b_role: 'Role', b_team: 'Team',
      b_since: 'In team since', b_prize: 'Total winnings', b_rating: 'Rating',
      tags: 'Tags', socials: 'Socials', photo_unavail: 'No photos available', years: ' y.o.',
      l_maps_n: 'Maps: ', l_k: 'K: ', l_adr: 'ADR: ',
      match_wr: 'Match WR', game_wr: 'Game WR', l_hs: 'HS%', assists: 'Assists',
      f_bio: 'Bio', f_nick: 'Nickname', f_level: 'FACEIT level', f_elo: 'ELO rating',
      f_since: 'Account since', f_stats: 'FACEIT stats', f_kills: 'Kills',
      f_streak: 'Streak', f_longest: 'Longest streak', f_last: 'Recent matches', f_maps: 'Maps',
      f_matches_n: 'Matches: ', f_socials: 'Social links',
      set_theme: 'Theme', set_lang: 'Language',
      gurren_q1: '"Believe in the me that believes in you!" — Kamina',
      gurren_q2: '"My drill is the drill that will pierce the heavens!" — Simon',
      gurren_q3: '"Go beyond the impossible and kick reason to the curb!" — Kamina',
      gurren_note: 'Team Dai-Gurren · "Who the hell do you think we are?!" — Kamina · "My drill will pierce the heavens!" — Simon',
      theme_dark: 'Dark', theme_light: 'Light', theme_gurren: 'Gurren Lagann',
      lang_ru: 'Russian', lang_en: 'English',
      profile_tg: 'Telegram profile', app_label: 'App', version: 'Version',
      src_data: 'Data sources', set_region: 'FACEIT region', set_period: 'Stats period',
      fav_empty: 'Empty — add with the star on a player or team card',
      fav_rm: 'Remove', refresh_stats: 'Refresh stats', user: 'User',
      app_open: 'Open the app from the bot', load_fail: 'Failed to load data',
      tab_guides: 'Guides',
      g_tab_maps: 'Maps', g_tab_mikra: 'Micro',
      g_sections: 'sections', g_back_guides: 'Back to guides', g_soon: 'Content coming soon',
      g_cat_smokes: 'Smokes', g_cat_molotovs: 'Molotovs', g_cat_flashes: 'Flashes',
      g_cat_grenades: 'Grenades', g_cat_setups: 'Setups', g_cat_tactics: 'Tactics'
    }
  };

  function t(key) {
    const table = I18N[lang] || I18N.ru;
    return table[key] != null ? table[key] : (I18N.ru[key] != null ? I18N.ru[key] : key);
  }

  function fmt(s) {
    for (let i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(arguments[i]);
    return s;
  }

  function applyTheme() {
    const root = document.documentElement || document.body;
    if (root) root.setAttribute('data-theme', currentTheme);
  }

  function secLocalized(sec) {
    const n = (sec.items || []).length;
    const m = periodShort();
    if (sec.id === 'faceit') return { title: t('sec_faceit'), subtitle: fmt(t('sub_faceit'), n, currentRegion) };
    if (sec.id === 'teams') return { title: t('sec_teams'), subtitle: fmt(t('sub_teams'), n, m) };
    if (sec.id === 'pro') return { title: t('sec_pro'), subtitle: fmt(t('sub_pro'), n, m) };
    return { title: sec.title, subtitle: sec.subtitle };
  }

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

  function formatMoney(v) {
    if (v == null || isNaN(v)) return '—';
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (v >= 1000) return '$' + (v / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return '$' + v;
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

  function animateAll() {
    view.querySelectorAll('.player-row, .p-card').forEach((n, i) => {
      setTimeout(() => n.classList.add('anim'), 40 + i * 30);
    });
    view.querySelectorAll('.val, .p-val').forEach(v => {
      countUp(v, +v.dataset.target, +v.dataset.decimals);
    });
    view.querySelectorAll('.bar-fill').forEach(f => {
      f.style.width = (f.dataset.width || 0) + '%';
    });
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

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SET_KEY) || '{}');
      if (REGIONS.indexOf(s.region) !== -1) currentRegion = s.region;
      if ([90, 180, 365].indexOf(s.period) !== -1) currentPeriod = s.period;
      if (THEMES.indexOf(s.theme) !== -1) currentTheme = s.theme;
      if (s.lang === 'en' || s.lang === 'ru') lang = s.lang;
    } catch (e) {}
  }

  function saveSettings() {
    try { localStorage.setItem(SET_KEY, JSON.stringify({ region: currentRegion, period: currentPeriod, theme: currentTheme, lang: lang })); } catch (e) {}
  }

  function loadFavs() {
    try { const l = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }

  function saveFavs(list) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function isFav(type, key) {
    return loadFavs().some(f => f.type === type && f.key === key);
  }

  function toggleFav(item) {
    const list = loadFavs();
    const i = list.findIndex(f => f.type === item.type && f.key === item.key);
    if (i >= 0) list.splice(i, 1); else list.push(item);
    saveFavs(list);
  }

  function periodShort() {
    const key = { 90: 'p90s', 180: 'p180s', 365: 'p365s' }[currentPeriod] || 'p180s';
    return t(key);
  }

  function statsUrl(force) {
    let u = '/api/stats?region=' + encodeURIComponent(currentRegion) + '&period=' + currentPeriod;
    if (force) u += '&refresh=1';
    return u;
  }

  function pushPage() {
    backStack.push({ render: currentPage, scroll: window.scrollY || 0 });
  }

  function goBack() {
    if (backStack.length) {
      const page = backStack.pop();
      page.render();
      window.scrollTo(0, page.scroll || 0);
    } else {
      switchTab('stats');
    }
  }

  function backBtn() {
    const b = el('button', 'back-btn');
    b.appendChild(iconEl('back'));
    b.appendChild(document.createTextNode(t('back')));
    b.addEventListener('click', goBack);
    return b;
  }

  function favBtn(item) {
    const active = isFav(item.type, item.key);
    const b = el('button', 'star-btn' + (active ? ' active' : ''));
    b.setAttribute('aria-label', t('fav_add'));
    b.textContent = active ? '★' : '☆';
    b.addEventListener('click', () => {
      toggleFav(item);
      b.textContent = isFav(item.type, item.key) ? '★' : '☆';
      b.classList.toggle('active');
    });
    return b;
  }

  function bindRows(container, handler) {
    container.querySelectorAll('[data-slug]').forEach(node => {
      node.classList.add('clickable');
      node.addEventListener('click', () => handler(node.dataset.slug));
    });
  }

  function bindIdRows(container, handler) {
    container.querySelectorAll('[data-id]').forEach(node => {
      node.classList.add('clickable');
      node.addEventListener('click', () => handler(node.dataset.id));
    });
  }

  function playerRow(p, unit, maxVal) {
    const row = el('div', 'player-row');
    if (p.slug) row.dataset.slug = p.slug;
    if (p.id) row.dataset.id = p.id;
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
    if (p.level) meta.appendChild(el('span', 'rank-badge', 'Lv ' + p.level));
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
    if (it.slug) card.dataset.slug = it.slug;
    if (it.id) card.dataset.id = it.id;
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

  function bindClicks(container, id) {
    if (id === 'teams') bindRows(container, slug => openTeam(slug));
    else if (id === 'pro') bindRows(container, slug => openPlayer(slug));
    else if (id === 'faceit') bindIdRows(container, id2 => openFaceitPlayer(id2));
  }

  function renderSection(sec, flat) {
    const section = el('div', 'stat-section');
    const head = el('button', 'sec-head');
    const lc = secLocalized(sec);
    head.appendChild(el('div', 'section-title', lc.title + (lc.subtitle ? ' · ' + lc.subtitle : '')));
    const chev = el('span', 'chev');
    chev.innerHTML = ICONS.chevron;
    head.appendChild(chev);
    section.appendChild(head);

    const body = el('div', 'sec-body');
    const items = sec.items || [];
    if (items.length) {
      const maxVal = Math.max(...items.map(i => (i.value != null ? i.value : 0)));
      if (items.length >= 3 && !flat) {
        body.appendChild(renderPodium(items, sec.unit));
        items.slice(3).forEach(it => body.appendChild(playerRow(it, sec.unit, maxVal)));
      } else {
        items.forEach(it => body.appendChild(playerRow(it, sec.unit, maxVal)));
      }
    } else {
      body.appendChild(el('p', 'section-text', t('no_data')));
    }
    bindClicks(body, sec.id);
    section.appendChild(body);

    head.addEventListener('click', () => {
      body.classList.toggle('hidden');
      chev.classList.toggle('closed');
    });
    return section;
  }

  function favSection(favs) {
    const sec = el('div', 'stat-section');
    sec.appendChild(el('div', 'section-title', t('fav_title')));
    const body = el('div');
    favs.forEach(f => {
      const row = el('div', 'player-row');
      row.dataset.slug = f.key;
      if (f.type === 'faceit') row.dataset.id = f.key;
      row.appendChild(avatarEl({ image: f.image, name: f.name }));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', f.name));
      const meta = el('div', 'player-meta');
      meta.appendChild(el('span', null, f.type === 'team' ? t('type_team') : f.type === 'faceit' ? t('type_faceit') : t('type_player')));
      info.appendChild(meta);
      row.appendChild(info);
      const star = el('button', 'star-btn active');
      star.setAttribute('aria-label', t('fav_remove'));
      star.textContent = '★';
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFav(f);
        renderStats(false);
      });
      row.appendChild(star);
      row.classList.add('clickable');
      row.addEventListener('click', () => {
        if (f.type === 'team') openTeam(f.key);
        else if (f.type === 'player') openPlayer(f.key);
        else openFaceitPlayer(f.key);
      });
      body.appendChild(row);
    });
    sec.appendChild(body);
    return sec;
  }

  function renderList(listWrap, data, query, animate) {
    listWrap.innerHTML = '';
    const sections = (data && data.sections) || [];
    if (sections.length) {
      listWrap.appendChild(el('p', 'updated-note', t('updated') + ': ' + new Date(data.generated_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' · ' + t('period') + ' ' + periodShort() + ' · ' + t('region') + ' ' + (data.region || currentRegion)));
    }
    const q = (query || '').trim().toLowerCase();
    const favs = loadFavs();
    if (favs.length && !q) listWrap.appendChild(favSection(favs));
    let any = false;
    sections.forEach(sec => {
      const items = q ? (sec.items || []).filter(it => (it.name || '').toLowerCase().indexOf(q) !== -1) : sec.items;
      if (!items || !items.length) return;
      any = true;
      listWrap.appendChild(renderSection({ ...sec, items }, !!q));
    });
    if (!any) {
      listWrap.appendChild(el('p', 'section-text', q ? t('not_found') + ' «' + query + '»' : t('no_data')));
    }
    if (animate !== false) animateAll();
  }

  async function renderStats(force) {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('stats', t('tab_stats')));
    const meta = el('div', 'stats-meta');
    meta.appendChild(el('span', 'muted-note', t('src_note')));
    const refreshBtn = el('button', 'refresh-btn');
    refreshBtn.innerHTML = ICONS.refresh;
    refreshBtn.setAttribute('aria-label', t('refresh'));
    refreshBtn.addEventListener('click', () => renderStats(true));
    meta.appendChild(refreshBtn);
    view.appendChild(meta);

    const searchBox = el('div', 'search-box');
    const search = el('input', 'search-input');
    search.setAttribute('type', 'search');
    search.setAttribute('placeholder', t('search_ph'));
    searchBox.appendChild(search);
    view.appendChild(searchBox);

    if (currentTheme === 'gurren') {
      const qbox = el('div', 'gurren-quote');
      [t('gurren_q1'), t('gurren_q2'), t('gurren_q3')].forEach(q => {
        const line = el('div', 'gurren-quote-line');
        const dri = el('span', 'gq-drill');
        dri.innerHTML = ICONS.drill;
        line.appendChild(dri);
        line.appendChild(document.createTextNode(q));
        qbox.appendChild(line);
      });
      view.appendChild(qbox);
    }

    let onboarded = true;
    try { onboarded = localStorage.getItem(ONB_KEY) === '1'; } catch (e) {}
    if (!onboarded) {
      const hint = el('div', 'hint-bar');
      hint.appendChild(el('span', null, t('hint')));
      const hintX = el('button', 'hint-x');
      hintX.setAttribute('aria-label', t('hint_close'));
      hintX.textContent = '✕';
      hintX.addEventListener('click', () => {
        hint.remove();
        try { localStorage.setItem(ONB_KEY, '1'); } catch (e) {}
      });
      hint.appendChild(hintX);
      view.appendChild(hint);
    }

    const listWrap = el('div', 'stats-list');
    view.appendChild(listWrap);

    search.addEventListener('input', () => {
      if (!sectionsCache) return;
      renderList(listWrap, sectionsCache, search.value, false);
    });

    if (sectionsCache && !force) {
      renderList(listWrap, sectionsCache, '', true);
      currentPage = () => renderStats(false);
      loading = false;
      return;
    }

    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    listWrap.appendChild(loadbar);
    refreshBtn.classList.add('spin');

    try {
      const res = await api.get(statsUrl(force));
      if (!res.ok) throw new Error('bad response');
      sectionsCache = res.stats || {};
      loadbar.remove();
      renderList(listWrap, sectionsCache, '', true);
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('err_stats')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => renderStats(true));
      errBox.appendChild(retry);
      listWrap.appendChild(errBox);
    } finally {
      refreshBtn.classList.remove('spin');
      currentPage = () => renderStats(false);
      loading = false;
    }
  }

  function statCard(label, value, decimals, cls) {
    const card = el('div', 's-card' + (cls ? ' ' + cls : ''));
    const v = el('div', 's-val');
    v.dataset.target = value;
    v.dataset.decimals = decimals;
    v.textContent = '0';
    card.appendChild(v);
    card.appendChild(el('div', 's-lab', label));
    return card;
  }

  function matchRow(m) {
    const row = el('div', 'm-row');
    const res = el('div', 'm-res ' + m.result);
    res.textContent = m.result === 'win' ? 'W' : (m.result === 'loss' ? 'L' : 'N');
    row.appendChild(res);
    row.appendChild(avatarEl({ image: m.opponent_image, name: m.opponent }));
    const info = el('div', 'm-info');
    info.appendChild(el('div', 'm-opp', m.opponent));
    const sub = el('div', 'm-sub');
    if (m.date) sub.appendChild(el('span', null, m.date));
    if (m.event) sub.appendChild(el('span', null, m.event));
    if (m.tier) sub.appendChild(el('span', 'tier-badge', m.tier.toUpperCase()));
    info.appendChild(sub);
    row.appendChild(info);
    row.appendChild(el('div', 'm-score', (m.our_score != null ? m.our_score : '?') + ' : ' + (m.opp_score != null ? m.opp_score : '?')));
    if (m.maps && m.maps.length) {
      const maps = el('div', 'm-maps');
      m.maps.forEach(g => {
        maps.appendChild(el('span', 'map-chip ' + g.result, (g.map || '').replace(/^de_/, '') + ' ' + g.our + '-' + g.opp));
      });
      row.appendChild(maps);
    }
    return row;
  }

  function rosterRow(p) {
    const row = el('div', 'r-row');
    if (p.slug) row.dataset.slug = p.slug;
    row.appendChild(avatarEl({ image: p.image, name: p.nickname }));
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', p.nickname));
    const meta = el('div', 'player-meta');
    if (p.country_code) meta.appendChild(el('span', 'c-badge', p.country_code.toUpperCase()));
    if (p.is_coach) meta.appendChild(el('span', 'coach-badge', 'COACH'));
    if (p.role) meta.appendChild(el('span', null, p.role));
    info.appendChild(meta);
    row.appendChild(info);
    return row;
  }

  function achRow(a) {
    const row = el('div', 'a-row');
    row.appendChild(iconEl('trophy'));
    const info = el('div', 'a-info');
    info.appendChild(el('div', 'a-title', (a.title || '') + (a.tournament ? ' · ' + a.tournament : '')));
    const meta = el('div', 'player-meta');
    if (a.date) meta.appendChild(el('span', null, a.date));
    if (a.tier) meta.appendChild(el('span', 'tier-badge', a.tier.toUpperCase()));
    if (a.prize) meta.appendChild(el('span', null, formatMoney(a.prize)));
    info.appendChild(meta);
    row.appendChild(info);
    return row;
  }

  function renderTeamDetail(t, td) {
    const hero = el('div', 't-hero');
    const logo = avatarEl({ image: t.image, name: t.name });
    logo.classList.add('hero-logo');
    hero.appendChild(logo);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', t.name + (t.acronym ? ' ' + t.acronym : '')));
    const badges = el('div', 't-badges');
    if (t.rank != null) badges.appendChild(el('span', 'rank-badge', '#' + t.rank));
    if (t.rank_diff) badges.appendChild(el('span', 'delta-badge', (t.rank_diff > 0 ? '▲' : '▼') + ' ' + Math.abs(t.rank_diff)));
    if (t.country_code) badges.appendChild(el('span', 'c-badge', t.country_code.toUpperCase()));
    hinfo.appendChild(badges);
    const meta = el('div', 't-meta');
    if (t.country_name) meta.appendChild(el('span', null, t.country_name));
    if (t.est_date) meta.appendChild(el('span', null, t('founded') + t.est_date));
    if (t.six_month_earned) meta.appendChild(el('span', 'earn', formatMoney(t.six_month_earned)));
    hinfo.appendChild(meta);
    hero.appendChild(hinfo);
    if (t.slug) hero.appendChild(favBtn({ type: 'team', key: t.slug, name: t.name, image: t.image }));
    td.appendChild(hero);

    const s = t.stats || {};
    td.appendChild(sectionTitle('stats', t('stats_6m')));
    const grid = el('div', 's-grid');
    grid.appendChild(statCard(t('l_matches'), s.matches, 0));
    grid.appendChild(statCard(t('l_wins'), s.matches_won, 0));
    grid.appendChild(statCard(t('l_losses'), s.matches_lost, 0));
    grid.appendChild(statCard(t('l_winrate'), s.match_winrate, 1, 'accent'));
    grid.appendChild(statCard(t('l_games'), s.games, 0));
    grid.appendChild(statCard(t('l_round_wr'), s.round_wr, 1));
    grid.appendChild(statCard(t('l_t'), s.t_wr, 1));
    grid.appendChild(statCard(t('l_ct'), s.ct_wr, 1));
    grid.appendChild(statCard(t('l_pistol'), s.pistol_wr, 1));
    grid.appendChild(statCard(t('l_eco'), s.eco_wr, 1));
    grid.appendChild(statCard(t('l_force'), s.force_wr, 1));
    grid.appendChild(statCard(t('l_buy'), s.buy_wr, 1));
    grid.appendChild(statCard(t('l_kd'), s.kd, 2, 'accent'));
    td.appendChild(grid);

    td.appendChild(sectionTitle('stats', t('history_6m')));
    const hist = el('div', 't-matches');
    const ms = t.matches || [];
    if (!ms.length) hist.appendChild(el('p', 'muted-note', t('no_data')));
    ms.forEach(m => hist.appendChild(matchRow(m)));
    td.appendChild(hist);

    td.appendChild(sectionTitle('users', t('roster')));
    const rost = el('div', 't-roster');
    const rl = t.roster || [];
    if (!rl.length) rost.appendChild(el('p', 'muted-note', t('no_data')));
    rl.forEach(p => rost.appendChild(rosterRow(p)));
    bindRows(rost, slug => openPlayer(slug));
    td.appendChild(rost);

    td.appendChild(sectionTitle('trophy', t('achievements')));
    const ach = el('div', 't-ach');
    const al = t.achievements || [];
    if (!al.length) ach.appendChild(el('p', 'muted-note', t('no_data')));
    al.forEach(a => ach.appendChild(achRow(a)));
    td.appendChild(ach);

    view.querySelectorAll('.s-card').forEach((c, i) => {
      const v = c.querySelector('.s-val');
      setTimeout(() => countUp(v, +v.dataset.target, +v.dataset.decimals), 60 + i * 40);
    });
  }

  async function renderTeam(slug, useCache) {
    if (loading) return;
    loading = true;
    clear();
    const td = el('div', 't-detail');
    td.appendChild(backBtn());
    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    td.appendChild(loadbar);
    view.appendChild(td);
    try {
      let t = useCache ? detailCache.team[slug] : null;
      if (!t) {
        const res = await api.get('/api/team?slug=' + encodeURIComponent(slug));
        if (!res.ok) throw new Error('bad response');
        t = res.team;
        detailCache.team[slug] = t;
      }
      loadbar.remove();
      renderTeamDetail(t, td);
      currentPage = () => renderTeam(slug, true);
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('err_team')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => renderTeam(slug, true));
      errBox.appendChild(retry);
      td.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function openTeam(slug) {
    if (!slug || loading) return;
    pushPage();
    renderTeam(slug, false);
  }

  function bioRow(label, value) {
    const row = el('div', 'b-row');
    row.appendChild(el('div', 'b-lab', label));
    row.appendChild(el('div', 'b-val', value != null && value !== '' ? value : '—'));
    return row;
  }

  function teamRow(item) {
    const row = el('div', 'r-row');
    row.appendChild(avatarEl({ image: item.image, name: item.team }));
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', item.team));
    const meta = el('div', 'player-meta');
    if (item.date) meta.appendChild(el('span', null, item.date));
    info.appendChild(meta);
    row.appendChild(info);
    if (item.slug) row.dataset.slug = item.slug;
    return row;
  }

  function mapRow(m) {
    const row = el('div', 'm-row');
    const info = el('div', 'm-info');
    info.appendChild(el('div', 'm-opp', (m.map || '').replace(/^de_/, '').toUpperCase()));
    const sub = el('div', 'm-sub');
    if (m.maps_count) sub.appendChild(el('span', null, t('l_maps_n') + m.maps_count));
    if (m.avg_kills != null) sub.appendChild(el('span', null, t('l_k') + formatNum(m.avg_kills, 2)));
    if (m.avg_damage != null) sub.appendChild(el('span', null, t('l_adr') + formatNum(m.avg_damage, 1)));
    info.appendChild(sub);
    row.appendChild(info);
    row.appendChild(el('div', 'm-score', m.avg_rating != null ? formatNum(m.avg_rating, 2) : '—'));
    return row;
  }

  function photoCard(src, caption) {
    const card = el('figure', 'p-photo');
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    card.appendChild(img);
    if (caption) card.appendChild(el('figcaption', null, caption));
    return card;
  }

  function renderPlayerDetail(p, td) {
    const hero = el('div', 't-hero');
    const logo = avatarEl({ image: p.image, name: p.nickname });
    logo.classList.add('hero-logo');
    hero.appendChild(logo);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', p.nickname));
    const badges = el('div', 't-badges');
    if (p.country_code) badges.appendChild(el('span', 'c-badge', p.country_code.toUpperCase()));
    if (p.team) badges.appendChild(el('span', 'team-badge', p.team));
    if (p.role) badges.appendChild(el('span', 'role-badge', p.role));
    hinfo.appendChild(badges);
    const meta = el('div', 't-meta');
    if (p.country_name) meta.appendChild(el('span', null, p.country_name));
    if (p.age != null) meta.appendChild(el('span', null, p.age + t('years')));
    if (p.total_prize) meta.appendChild(el('span', 'earn', formatMoney(p.total_prize)));
    hinfo.appendChild(meta);
    hero.appendChild(hinfo);
    if (p.slug) hero.appendChild(favBtn({ type: 'player', key: p.slug, name: p.nickname, image: p.image }));
    td.appendChild(hero);

    const subTabs = el('div', 'sub-tabs');
    const statsTab = el('button', 'sub-tab active');
    statsTab.appendChild(document.createTextNode(t('tab_stats')));
    const bioTab = el('button', 'sub-tab');
    bioTab.appendChild(document.createTextNode(t('f_bio')));
    subTabs.appendChild(statsTab);
    subTabs.appendChild(bioTab);
    td.appendChild(subTabs);

    const statsBox = el('div', 'sub-box');
    const bioBox = el('div', 'sub-box hidden');

    const periodTxt = lang === 'ru' ? (p.period_label || t('per_last')) : t('per_last');
    const s = p.stats || {};
    statsBox.appendChild(sectionTitle('stats', t('stat_for') + periodTxt));
    const grid = el('div', 's-grid');
    grid.appendChild(statCard(t('b_rating'), p.rating, 2, 'accent'));
    grid.appendChild(statCard(t('l_matches'), s.matches, 0));
    grid.appendChild(statCard(t('l_wins'), s.matches_won, 0));
    grid.appendChild(statCard(t('l_losses'), s.matches_lost, 0));
    grid.appendChild(statCard(t('match_wr'), s.match_winrate, 1));
    grid.appendChild(statCard(t('l_games'), s.games, 0));
    grid.appendChild(statCard(t('game_wr'), s.winrate, 1));
    grid.appendChild(statCard(t('l_kd'), s.kd, 2, 'accent'));
    grid.appendChild(statCard('ADR', s.adr, 1));
    grid.appendChild(statCard(t('l_hs'), s.hs, 1));
    grid.appendChild(statCard(t('l_round_wr'), s.round_wr, 1));
    grid.appendChild(statCard(t('assists'), s.assists, 0));
    statsBox.appendChild(grid);

    statsBox.appendChild(sectionTitle('stats', t('maps_for') + periodTxt));
    const maps = el('div', 't-matches');
    const ml = p.maps || [];
    if (!ml.length) maps.appendChild(el('p', 'muted-note', t('no_data')));
    ml.forEach(m => maps.appendChild(mapRow(m)));
    statsBox.appendChild(maps);

    statsBox.appendChild(sectionTitle('users', t('career')));
    const teams = el('div', 't-roster');
    const tl = p.teams || [];
    if (!tl.length) teams.appendChild(el('p', 'muted-note', t('no_data')));
    tl.forEach(t => teams.appendChild(teamRow(t)));
    bindRows(teams, slug => openTeam(slug));
    statsBox.appendChild(teams);

    statsBox.appendChild(sectionTitle('trophy', t('achievements')));
    const ach = el('div', 't-ach');
    const al = p.achievements || [];
    if (!al.length) ach.appendChild(el('p', 'muted-note', t('no_data')));
    al.forEach(a => ach.appendChild(achRow(a)));
    statsBox.appendChild(ach);

    const photos = el('div', 'p-photos');
    if (p.image) photos.appendChild(photoCard(p.image, p.nickname));
    if (p.team_image) photos.appendChild(photoCard(p.team_image, p.team || t('type_team')));
    if (!photos.children.length) photos.appendChild(el('p', 'muted-note', t('photo_unavail')));

    if (p.bio_text) {
      const story = el('div', 'bio-story');
      const storyTitle = el('div', 'bio-story-title');
      storyTitle.appendChild(iconEl('users'));
      storyTitle.appendChild(document.createTextNode(t('story')));
      story.appendChild(storyTitle);
      story.appendChild(el('p', 'bio-story-text', p.bio_text));
      bioBox.appendChild(story);
    }
    bioBox.appendChild(photos);

    bioBox.appendChild(sectionTitle('users', t('personal')));
    const bio = el('div', 'b-list');
    const realName = [p.first_name, p.last_name].filter(Boolean).join(' ') || null;
    bio.appendChild(bioRow(t('b_nick'), p.nickname));
    bio.appendChild(bioRow(t('b_real'), realName));
    if (p.aliases && p.aliases.length) bio.appendChild(bioRow(t('b_aliases'), p.aliases.join(', ')));
    if (p.birthday) {
      const ageTxt = p.age != null ? ' (' + p.age + t('years') + ')' : '';
      bio.appendChild(bioRow(t('b_bday'), String(p.birthday).slice(0, 10) + ageTxt));
    }
    if (p.country_name) bio.appendChild(bioRow(t('b_country'), p.country_name));
    if (p.region) bio.appendChild(bioRow(t('b_region'), p.region));
    if (p.role) bio.appendChild(bioRow(t('b_role'), p.role));
    if (p.team) {
      const teamRow2 = bioRow(t('b_team'), p.team);
      if (p.team_slug) {
        teamRow2.classList.add('clickable');
        teamRow2.dataset.slug = p.team_slug;
        teamRow2.addEventListener('click', () => openTeam(p.team_slug));
      }
      bio.appendChild(teamRow2);
    }
    if (p.joined_team_at) bio.appendChild(bioRow(t('b_since'), String(p.joined_team_at).slice(0, 10)));
    bio.appendChild(bioRow(t('b_prize'), formatMoney(p.total_prize)));
    bio.appendChild(bioRow(t('b_rating'), p.rating != null ? formatNum(p.rating, 2) : '—'));
    bioBox.appendChild(bio);

    const tags = p.tags || [];
    if (tags.length) {
      bioBox.appendChild(sectionTitle('users', t('tags')));
      const tagWrap = el('div', 't-badges');
      tags.forEach(t => tagWrap.appendChild(el('span', 'tag-badge', t)));
      bioBox.appendChild(tagWrap);
    }

    const socials = [];
    if (p.twitter) socials.push([p.twitter, 'Twitter']);
    if (p.twitch) socials.push([p.twitch, 'Twitch']);
    if (p.facebook) socials.push([p.facebook, 'Facebook']);
    if (socials.length) {
      bioBox.appendChild(sectionTitle('users', t('socials')));
      const links = el('div', 'f-links');
      socials.forEach(soc => links.appendChild(linkBtn(soc[0], soc[1])));
      bioBox.appendChild(links);
    }

    td.appendChild(statsBox);
    td.appendChild(bioBox);

    statsTab.addEventListener('click', () => {
      statsTab.classList.add('active');
      bioTab.classList.remove('active');
      statsBox.classList.remove('hidden');
      bioBox.classList.add('hidden');
    });
    bioTab.addEventListener('click', () => {
      bioTab.classList.add('active');
      statsTab.classList.remove('active');
      bioBox.classList.remove('hidden');
      statsBox.classList.add('hidden');
    });

    view.querySelectorAll('.s-card').forEach((c, i) => {
      const v = c.querySelector('.s-val');
      setTimeout(() => countUp(v, +v.dataset.target, +v.dataset.decimals), 60 + i * 40);
    });
  }

  async function renderPlayer(slug, useCache) {
    if (loading) return;
    loading = true;
    clear();
    const pd = el('div', 't-detail');
    pd.appendChild(backBtn());
    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    pd.appendChild(loadbar);
    view.appendChild(pd);
    try {
      let p = useCache ? detailCache.player[slug] : null;
      if (!p) {
        const res = await api.get('/api/player?slug=' + encodeURIComponent(slug) + '&period=' + currentPeriod);
        if (!res.ok) throw new Error('bad response');
        p = res.player;
        detailCache.player[slug] = p;
      }
      loadbar.remove();
      renderPlayerDetail(p, pd);
      currentPage = () => renderPlayer(slug, true);
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('err_player')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => renderPlayer(slug, true));
      errBox.appendChild(retry);
      pd.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function openPlayer(slug) {
    if (!slug || loading) return;
    pushPage();
    renderPlayer(slug, false);
  }

  function linkBtn(href, label) {
    const a = document.createElement('a');
    a.className = 'link-btn';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label;
    return a;
  }

  function faceitMapRow(m) {
    const row = el('div', 'm-row');
    const info = el('div', 'm-info');
    info.appendChild(el('div', 'm-opp', m.map));
    const sub = el('div', 'm-sub');
    if (m.matches) sub.appendChild(el('span', null, t('f_matches_n') + formatNum(m.matches, 0)));
    if (m.kd != null) sub.appendChild(el('span', null, 'K/D: ' + formatNum(m.kd, 2)));
    info.appendChild(sub);
    row.appendChild(info);
    row.appendChild(el('div', 'm-score', m.winrate != null ? formatNum(m.winrate, 1) + '%' : '—'));
    return row;
  }

  function renderFaceitPlayer(p, td) {
    const hero = el('div', 't-hero');
    const logo = avatarEl({ image: p.image, name: p.nickname });
    logo.classList.add('hero-logo');
    hero.appendChild(logo);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', p.nickname));
    const badges = el('div', 't-badges');
    if (p.country_code) badges.appendChild(el('span', 'c-badge', p.country_code.toUpperCase()));
    if (p.skill_level != null) badges.appendChild(el('span', 'rank-badge', 'Lv ' + p.skill_level));
    if (p.verified) badges.appendChild(el('span', 'delta-badge', 'VERIFIED'));
    hinfo.appendChild(badges);
    const meta = el('div', 't-meta');
    if (p.region) meta.appendChild(el('span', null, p.region));
    if (p.elo != null) meta.appendChild(el('span', 'earn', 'ELO ' + formatNum(p.elo, 0)));
    hinfo.appendChild(meta);
    hero.appendChild(hinfo);
    if (p.id) hero.appendChild(favBtn({ type: 'faceit', key: p.id, name: p.nickname, image: p.image }));
    td.appendChild(hero);

    td.appendChild(sectionTitle('users', t('f_bio')));
    const bio = el('div', 'b-list');
    bio.appendChild(bioRow(t('f_nick'), p.nickname));
    if (p.country_code) bio.appendChild(bioRow(t('b_country'), p.country_code.toUpperCase()));
    if (p.region) bio.appendChild(bioRow(t('b_region'), p.region));
    if (p.skill_level != null) bio.appendChild(bioRow(t('f_level'), 'Lv ' + p.skill_level));
    if (p.elo != null) bio.appendChild(bioRow(t('f_elo'), formatNum(p.elo, 0)));
    if (p.steam_nickname) bio.appendChild(bioRow('Steam', p.steam_nickname));
    if (p.activated_at) bio.appendChild(bioRow(t('f_since'), p.activated_at));
    td.appendChild(bio);

    const s = p.stats || {};
    td.appendChild(sectionTitle('stats', t('f_stats')));
    const grid = el('div', 's-grid');
    grid.appendChild(statCard('ELO', p.elo, 0, 'accent'));
    grid.appendChild(statCard(t('l_matches'), s.matches, 0));
    grid.appendChild(statCard(t('l_wins'), s.wins, 0));
    grid.appendChild(statCard(t('l_losses'), s.losses, 0));
    grid.appendChild(statCard(t('l_winrate'), s.winrate, 1, 'accent'));
    grid.appendChild(statCard(t('l_kd'), s.kd, 2));
    grid.appendChild(statCard(t('l_hs'), s.hs, 1));
    grid.appendChild(statCard('ADR', s.adr, 1));
    grid.appendChild(statCard(t('f_kills'), s.kills, 0));
    grid.appendChild(statCard(t('f_streak'), s.win_streak, 0));
    grid.appendChild(statCard(t('f_longest'), s.longest_streak, 0));
    td.appendChild(grid);

    const results = s.results || [];
    if (results.length) {
      td.appendChild(sectionTitle('stats', t('f_last')));
      const chips = el('div', 'm-maps');
      results.forEach(r => {
        chips.appendChild(el('span', 'map-chip ' + (r === 'W' ? 'win' : 'loss'), r));
      });
      td.appendChild(chips);
    }

    const ml = p.maps || [];
    if (ml.length) {
      td.appendChild(sectionTitle('stats', t('f_maps')));
      const maps = el('div', 't-matches');
      ml.forEach(m => maps.appendChild(faceitMapRow(m)));
      td.appendChild(maps);
    }

    const links = el('div', 'f-links');
    if (p.faceit_url) links.appendChild(linkBtn(p.faceit_url, 'FACEIT'));
    if (p.steam_id) links.appendChild(linkBtn('https://steamcommunity.com/profiles/' + p.steam_id, 'Steam'));
    if (links.children.length) {
      td.appendChild(sectionTitle('users', t('f_socials')));
      td.appendChild(links);
    }

    view.querySelectorAll('.s-card').forEach((c, i) => {
      const v = c.querySelector('.s-val');
      setTimeout(() => countUp(v, +v.dataset.target, +v.dataset.decimals), 60 + i * 40);
    });
  }

  async function renderFaceit(id, useCache) {
    if (loading) return;
    loading = true;
    clear();
    const pd = el('div', 't-detail');
    pd.appendChild(backBtn());
    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    pd.appendChild(loadbar);
    view.appendChild(pd);
    try {
      let p = useCache ? detailCache.faceit[id] : null;
      if (!p) {
        const res = await api.get('/api/faceit-player?id=' + encodeURIComponent(id));
        if (!res.ok) throw new Error('bad response');
        p = res.player;
        detailCache.faceit[id] = p;
      }
      loadbar.remove();
      renderFaceitPlayer(p, pd);
      currentPage = () => renderFaceit(id, true);
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('err_player')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => renderFaceit(id, true));
      errBox.appendChild(retry);
      pd.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function openFaceitPlayer(id) {
    if (!id || loading) return;
    pushPage();
    renderFaceit(id, false);
  }

  function sel(options, current, onChange) {
    const s = document.createElement('select');
    s.className = 'set-select';
    options.forEach((opt) => {
      const pair = Array.isArray(opt) ? opt : [opt, opt];
      const o = document.createElement('option');
      o.value = String(pair[0]);
      o.textContent = pair[1];
      if (String(current) === String(pair[0])) o.selected = true;
      s.appendChild(o);
    });
    s.addEventListener('change', () => onChange(s.value));
    return s;
  }

  function activateTab(name) {
    document.querySelectorAll('#tabBar .tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === name);
    });
  }

  function switchTab(name) {
    activateTab(name);
    if (name === 'stats') {
      renderStats(false);
    } else if (name === 'settings') {
      renderSettings();
    } else if (name === 'guides') {
      renderGuides();
    }
  }

  function renderSettings() {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('settings', t('tab_settings')));

    const prof = el('div', 't-hero');
    const ava = el('div', 'avatar hero-logo');
    ava.appendChild(el('span', null, (currentUser ? currentUser.first_name : '?').charAt(0).toUpperCase()));
    prof.appendChild(ava);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', currentUser ? currentUser.first_name : t('user')));
    const meta = el('div', 't-meta');
    meta.appendChild(el('span', null, t('profile_tg')));
    meta.appendChild(el('span', 'rank-badge', 'ID ' + (currentUser ? currentUser.id : '—')));
    hinfo.appendChild(meta);
    prof.appendChild(hinfo);
    view.appendChild(prof);

    const info = el('div', 'b-list');
    info.appendChild(bioRow(t('app_label'), 'CS2 COACH'));
    info.appendChild(bioRow(t('version'), '1.1'));
    info.appendChild(bioRow(t('src_data'), 'bo3.gg · FACEIT'));
    view.appendChild(info);

    view.appendChild(sectionTitle('settings', t('set_theme')));
    const themeRow = el('div', 'set-row');
    themeRow.appendChild(sel(THEMES.map(v => [v, t('theme_' + v)]), currentTheme, v => {
      currentTheme = v;
      saveSettings();
      applyTheme();
      renderSettings();
    }));
    view.appendChild(themeRow);
    if (currentTheme === 'gurren') {
      view.appendChild(el('div', 'gurren-note', t('gurren_note')));
    }

    view.appendChild(sectionTitle('settings', t('set_lang')));
    const langRow = el('div', 'set-row');
    langRow.appendChild(sel([['ru', t('lang_ru')], ['en', t('lang_en')]], lang, v => {
      lang = v;
      saveSettings();
      document.querySelectorAll('#tabBar .tab').forEach(b => {
        if (b.lastChild) {
          b.lastChild.textContent = b.dataset.tab === 'stats' ? t('tab_stats') : b.dataset.tab === 'guides' ? t('tab_guides') : t('tab_settings');
        }
      });
      renderSettings();
    }));
    view.appendChild(langRow);

    view.appendChild(sectionTitle('settings', t('set_region')));
    const regionRow = el('div', 'set-row');
    regionRow.appendChild(sel(REGIONS, currentRegion, v => {
      currentRegion = v;
      saveSettings();
      sectionsCache = null;
    }));
    view.appendChild(regionRow);

    view.appendChild(sectionTitle('stats', t('set_period')));
    const periodRow = el('div', 'set-row');
    periodRow.appendChild(sel(PERIODS.map(p => [p[0], t(p[1])]), currentPeriod, v => {
      currentPeriod = +v;
      saveSettings();
      sectionsCache = null;
      detailCache.player = {};
    }));
    view.appendChild(periodRow);

    view.appendChild(sectionTitle('users', t('fav_title')));
    const favList = el('div', 't-roster');
    const favs = loadFavs();
    if (!favs.length) favList.appendChild(el('p', 'muted-note', t('fav_empty')));
    favs.forEach(f => {
      const row = el('div', 'r-row');
      row.appendChild(avatarEl({ image: f.image, name: f.name }));
      const finfo = el('div', 'player-info');
      finfo.appendChild(el('div', 'player-nick', f.name));
      const fmeta = el('div', 'player-meta');
      fmeta.appendChild(el('span', null, f.type === 'team' ? t('type_team') : f.type === 'faceit' ? t('type_faceit') : t('type_player')));
      finfo.appendChild(fmeta);
      row.appendChild(finfo);
      const rm = el('button', 'link-btn');
      rm.textContent = t('fav_rm');
      rm.addEventListener('click', () => {
        toggleFav(f);
        renderSettings();
      });
      row.appendChild(rm);
      favList.appendChild(row);
    });
    view.appendChild(favList);

    const refresh = el('button', 'link-btn');
    refresh.appendChild(iconEl('refresh'));
    refresh.appendChild(document.createTextNode(t('refresh_stats')));
    refresh.addEventListener('click', () => {
      sectionsCache = null;
      detailCache.team = {};
      detailCache.player = {};
      detailCache.faceit = {};
      activateTab('stats');
      renderStats(true);
    });
    view.appendChild(refresh);

    currentPage = () => renderSettings();
    loading = false;
  }

  const GUIDES_MAPS = [
    { id: 'dust2', name: 'Dust II', img: '/static/maps/dust2.png' },
    { id: 'mirage', name: 'Mirage', img: '/static/maps/mirage.png' },
    { id: 'inferno', name: 'Inferno', img: '/static/maps/inferno.png' },
    { id: 'nuke', name: 'Nuke', img: '/static/maps/nuke.png' },
    { id: 'ancient', name: 'Ancient', img: '/static/maps/ancient.png' },
    { id: 'overpass', name: 'Overpass', img: '/static/maps/overpass.png' },
    { id: 'anubis', name: 'Anubis', img: '/static/maps/anubis.png' },
    { id: 'vertigo', name: 'Vertigo', img: '/static/maps/vertigo.png' },
    { id: 'train', name: 'Train', img: '/static/maps/train.png' },
    { id: 'cache', name: 'Cache', img: '/static/maps/cache.png' }
  ];

  const GUIDES_MIKRA = [
    { id: 'mirage-smokes', name: 'Дымы на Mirage' },
    { id: 'dust2-flashes', name: 'Флешки на Dust II' },
    { id: 'inferno-molotovs', name: 'Молотовы на Inferno' },
    { id: 'nuke-smokes', name: 'Дымы на Nuke' },
    { id: 'ancient-molotovs', name: 'Молотовы на Ancient' },
    { id: 'overpass-smokes', name: 'Дымы на Overpass' }
  ];

  const GUIDE_CATS = [
    { id: 'smokes', key: 'g_cat_smokes' },
    { id: 'molotovs', key: 'g_cat_molotovs' },
    { id: 'flashes', key: 'g_cat_flashes' },
    { id: 'grenades', key: 'g_cat_grenades' },
    { id: 'setups', key: 'g_cat_setups' },
    { id: 'tactics', key: 'g_cat_tactics' }
  ];

  function gBackBtn(onClick) {
    const back = el('button', 'back-btn');
    back.appendChild(iconEl('back'));
    back.appendChild(document.createTextNode(t('g_back_guides')));
    back.addEventListener('click', () => (onClick || renderGuides)());
    return back;
  }

  function gTabBtn(tab, label) {
    const b = document.createElement('button');
    b.className = 'sub-tab' + (guidesTab === tab ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', () => { guidesTab = tab; renderGuides(); });
    return b;
  }

  function gRow(icon, title, meta, onClick) {
    const row = el('div', 'g-row');
    row.appendChild(el('div', 'g-ico', icon));
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', title));
    if (meta) info.appendChild(el('div', 'player-meta', meta));
    row.appendChild(info);
    row.appendChild(el('span', 'g-chev', '›'));
    row.addEventListener('click', onClick);
    return row;
  }

  function gMapCard(map) {
    const card = el('div', 'g-map');
    const pic = el('div', 'map-pic');
    const img = document.createElement('img');
    img.setAttribute('src', map.img);
    img.setAttribute('alt', map.name);
    img.loading = 'lazy';
    pic.appendChild(img);
    pic.appendChild(el('span', 'map-name', map.name));
    card.appendChild(pic);
    card.appendChild(el('span', 'g-chev', '›'));
    card.addEventListener('click', () => renderGuideDetail(map));
    return card;
  }

  function renderGuides() {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('guides', t('tab_guides')));
    const sub = el('div', 'sub-tabs');
    sub.appendChild(gTabBtn('maps', t('g_tab_maps')));
    sub.appendChild(gTabBtn('mikra', t('g_tab_mikra')));
    view.appendChild(sub);
    const box = el('div', 'sub-box');
    view.appendChild(box);
    if (guidesTab === 'maps') renderMapsList(box);
    else renderMikraList(box);
    loading = false;
  }

  function renderMapsList(box) {
    GUIDES_MAPS.forEach(map => box.appendChild(gMapCard(map)));
  }

  function renderMikraList(box) {
    GUIDES_MIKRA.forEach((item, i) => {
      box.appendChild(gRow(String(i + 1), item.name, null, () => renderGuideDetail(item)));
    });
  }

  function renderGuideDetail(item) {
    clear();
    view.appendChild(gBackBtn());
    view.appendChild(sectionTitle('guides', item.name));
    const grid = el('div', 'cat-grid');
    GUIDE_CATS.forEach(cat => {
      const btn = el('div', 'cat-btn');
      btn.appendChild(el('span', 'cat-name', t(cat.key)));
      btn.appendChild(el('span', 'g-chev', '›'));
      btn.addEventListener('click', () => renderGuideCat(item, cat));
      grid.appendChild(btn);
    });
    view.appendChild(grid);
  }

  function renderGuideCat(item, cat) {
    clear();
    view.appendChild(gBackBtn(() => renderGuideDetail(item)));
    view.appendChild(sectionTitle('guides', t(cat.key)));
    view.appendChild(el('p', 'section-text', t('g_soon')));
  }


  async function init() {
    loadSettings();
    const orb1 = document.createElement('div');
    orb1.className = 'orb orb1';
    const orb2 = document.createElement('div');
    orb2.className = 'orb orb2';
    document.body.appendChild(orb1);
    document.body.appendChild(orb2);

    document.getElementById('appHeader').innerHTML =
      '<h1><span class="logo">' + ICONS.bolt + '</span><span class="brand">CS2 <span class="hl">COACH</span></span></h1>' +
      '<span id="userName"></span>';

    let tabBar = document.getElementById('tabBar');
    if (!tabBar) {
      tabBar = document.createElement('nav');
      tabBar.id = 'tabBar';
      tabBar.className = 'tabbar';
      document.body.appendChild(tabBar);
    }
    [
      { name: 'stats', label: t('tab_stats'), icon: 'stats' },
      { name: 'guides', label: t('tab_guides'), icon: 'guides' },
      { name: 'settings', label: t('tab_settings'), icon: 'settings' }
    ].forEach(td => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (td.name === 'stats' ? ' active' : '');
      btn.dataset.tab = td.name;
      const ico = iconEl(td.icon);
      ico.className = 'tab-ico';
      btn.appendChild(ico);
      btn.appendChild(document.createTextNode(td.label));
      btn.addEventListener('click', () => switchTab(td.name));
      tabBar.appendChild(btn);
    });

    try {
      const initRes = await api.get('/api/init');
      if (!initRes.ok) { view.appendChild(el('p', 'section-text', t('app_open'))); return; }
      currentUser = initRes.user;
      document.getElementById('userName').textContent = initRes.user.first_name;
      applyTheme();
      await renderStats(false);
    } catch (err) {
      view.appendChild(el('p', 'section-text', t('load_fail')));
    }
  }

  init();
})();
