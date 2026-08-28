(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#05070d'); }

  const ICONS = {
    bolt: '<svg class="bolt" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    drill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3h5v5c0 3.3-1.2 4.5-2.5 4.5S9.5 11.3 9.5 8V3z"/><path d="M12 12.5V19"/><path d="M12 19l-3.5 3h7l-3.5-3z"/><path d="M10.2 6h3.6"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    guides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"/></svg>',
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="12" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    grenade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v4"/><path d="M12 8a4 4 0 0 1 4 4"/></svg>',
    xmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
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
  let currentMap = null;
  let tacticsFilter = { side: 't', round: 'pistol' };
  let activeSpotId = null;
  let guidesData = null;
  let learnCache = null;
  let profileCache = null;
  let isAdmin = false;
  let grenadesCache = null;
let gamesCache = null;
  const backStack = [];
  const detailCache = { team: {}, player: {}, faceit: {} };
  const SET_KEY = 'cs2coach.settings';
  const FAV_KEY = 'cs2coach.favs';
  const ONB_KEY = 'cs2coach.onboarded';
  const REGIONS = ['EU', 'NA', 'SA', 'AS', 'AU'];
  const THEMES = ['dark', 'light', 'gurren'];
  const PERIODS = [[90, 'p90'], [180, 'p180'], [365, 'p365']];
const TAB_DEFS = {
  home: { labelKey: 'tab_home', icon: 'home' },
  learn: { labelKey: 'tab_learn', icon: 'learn' },
  train: { labelKey: 'tab_train', icon: 'drill' },
  games: { labelKey: 'tab_games', icon: 'quiz' },
  stats: { labelKey: 'tab_stats', icon: 'stats' },
  guides: { labelKey: 'tab_guides', icon: 'grenade' },
  settings: { labelKey: 'tab_settings', icon: 'settings' }
};

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
      sec_teams: 'Команды', sec_faceit: 'FACEIT', sec_pro: 'Про-сцена',
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
      tab_guides: 'Гранаты',
      g_tab_maps: 'Карты',
      g_sections: 'разделов', g_back_guides: 'К гранатам',
      g_cat_lineups: 'Раскидки', g_cat_tactics: 'Тактики',
      g_type_all: 'Все', g_type_smoke: 'Смок', g_type_flash: 'Флешка',
      g_type_molotov: 'Молотов', g_type_grenade: 'Граната',
      g_lineups_empty: 'Пока нет раскидок', g_tactics_empty: 'Пока нет тактик',
      g_tactics_header: 'Тактики для Mirage', g_more: 'Подробнее', g_coming_soon: 'Раздел в разработке', g_tips: 'Советы',
      g_steps: 'Выполнение',
      g_essence: 'Суть тактики', g_goal: 'Цель', g_buy: 'Покупка',
      g_map_hint: 'Нажми на точку на карте — увидишь раскидки с этой позиции',
      g_map_reset_spot: 'Сбросить точку', g_map_spot: 'Раскидки с этой точки', g_tactic_label: 'Тактика',
      g_search_ph: 'Поиск по раскидкам и тактикам…',
      g_search_tactics: 'Поиск по тактикам…',
      g_pick_lineups_sub: 'Видео раскидок по позициям на радаре',
      g_pick_tactics_sub: 'Командные тактики за T и CT',
      g_pick_side: 'Выбери сторону',
      g_side_t: 'Террористы',
      g_side_t_sub: 'Атака: пистолетка, эко, форс, фулл бай',
      g_side_ct: 'Контр-террористы',
      g_side_ct_sub: 'Оборона: пистолетка, эко, форс, фулл бай',
      g_pick_round: 'Выбери тип раунда',
      g_round_pistol: 'Пистолетка',
      g_round_pistol_sub: 'Первый раунд, только пистолеты',
      g_round_eco: 'Эко',
      g_round_eco_sub: 'Копим деньги, минимум покупок',
      g_round_force: 'Форс',
      g_round_force_sub: 'Тратим всё на этот раунд',
      g_round_full: 'Фулл бай',
      g_round_full_sub: 'Полная закупка с гранатами',
      g_spot_no_video: 'Видео для этой позиции скоро появится',
      g_spot_hint: 'Нажми на точку на радаре — под ней появится видео',
      g_spot_next: 'Следующее видео',
      g_spot_open: 'Открыть на YouTube',
      g_mode_tldr: 'Коротко', g_mode_plan: 'Схема', g_mode_replay: 'Реплей',
      g_difficulty: 'Сложность', g_roles: 'Роли',
      g_role_filter: 'Показать роль', g_role_all: 'Все роли',
      g_prev_step: 'Шаг назад', g_next_step: 'Шаг вперёд',
      g_autoplay: 'Автопросмотр', g_autoplay_stop: 'Стоп',
      g_step_of: 'Шаг {0} из {1}', g_phase: 'Фаза',
      g_util_video: 'Смотреть раскидку', g_glossary: 'Подсказка',
      g_replay_play: 'Смотреть', g_replay_pause: 'Пауза',
      g_replay_restart: 'Сначала', g_replay_speed: 'Скорость',
      g_replay_hint: 'Нажми «Смотреть» — игроки разыграют тактику по таймлайну, как в реальном раунде.',
      tab_home: 'Главная', tab_learn: 'Обучение',
      h_welcome: 'Добро пожаловать, {0}!', h_sub: 'Твой путь к мастерству CS2',
      h_continue: 'Продолжить обучение', h_learn: 'Обучение', h_maps: 'Гранаты', h_stats: 'Статистика',
      h_learn_sub: 'Уроки, карточки и тесты для новичков',
      h_maps_sub: 'Раскидки по картам',
      h_stats_sub: 'FACEIT, команды и игроки',
      h_progress: 'Твой прогресс',
      h_lessons: 'Уроки', h_cards: 'Карточки', h_quizzes: 'Тесты',
      h_of: '{0} из {1}',
      h_best: 'Лучший результат: {0}',
      l_lessons: 'Уроки', l_cards: 'Карточки', l_quizzes: 'Тесты',
      l_lessons_sub: 'Пошаговое обучение основам',
      l_cards_sub: 'Запоминаем термины', l_quizzes_sub: 'Проверь себя',
      l_done: '✓ пройдено', l_questions: 'вопросов', l_sections: 'разделов',
      l_open: 'Открыть', l_lesson_open: 'Начать урок',
      l_check: 'Проверить', l_correct: '✅ Верно!', l_wrong: '❌ Правильный ответ: {0}',
      l_finished: '🎉 Урок пройден!', l_lesson_repeat: 'Повторить',
      c_front: 'Термин', c_back: 'Значение', c_show: 'Показать ответ',
      c_known: 'Знаю', c_unknown: 'Не знаю', c_done: '🎉 Все карточки выучены!',
      c_left: 'Осталось: {0}', c_restart: 'Начать заново',
      q_start: 'Начать тест', q_q: 'Вопрос {0} из {1}', q_result: 'Твой результат: {0} из {1}',
      q_best: 'Лучший результат: {0}', q_again: 'Пройти ещё раз', q_next: 'Следующий',
      q_finish: 'Завершить тест', q_feedback_correct: '✅ Верно!',
      q_feedback_wrong: '❌ Правильный ответ: {0}',
      q_finished: '🏆 Тест завершён!', q_perfect: 'Отлично!', q_good: 'Неплохо!', q_keep: 'Тренируйся дальше!',
      tab_train: 'Тренировка',
      tr_sub: 'Практикуй раскидки на каждой карте',
      tr_pick_map: 'Выбери карту для тренировки',
      tr_attempts: '{0} практик', tr_practice: 'Практиковать', tr_practiced: '✓ отработано',
      tr_checklist: 'Чек-лист практики',
      tr_check1: 'Изучи шаги и точку броска',
      tr_check2: 'Открой карту и найди позицию',
      tr_check3: 'Выполни бросок в тренировке',
      tr_ready: 'Отработал!', tr_reset: 'Сбросить', tr_empty: 'Пока нет раскидок на этой карте',
      tr_progress: 'Отработано: {0} из {1}',
      tr_spot_here: 'Точка броска',
      tab_games: 'Мини-игры',
      gm_sub: 'Проверь свои знания CS2',
      gm_play: 'Играть', gm_best: 'Лучший: {0}', gm_played: '{0} игр',
      gm_q: 'Вопрос {0} из {1}', gm_score: 'Счёт: {0}/{1}',
      gm_correct: '✅ Верно!', gm_wrong: '❌ Неверно! Правильно: {0}',
      gm_result: '🎯 Результат: {0} из {1}', gm_play_again: 'Играть ещё раз',
      gm_back: 'К играм', gm_time: '{0} сек', gm_no_games: 'Нет доступных игр',
      gm_finish: '🎉 Игра завершена!',
      g_profile: 'Профиль', g_level: 'Уровень', g_xp: 'Опыт', g_coins: 'Монеты',
      g_streak: 'дней подряд', g_achievements: 'Достижения', g_ach_count: '{0} из {1}',
      lb_title: 'Таблица лидеров', lb_your_rank: 'Твоё место: #{0}',
      shop_title: 'Магазин', shop_buy: 'Купить', shop_equip: 'Надеть',
      shop_owned: '✓ куплено', shop_equipped: '✓ надето', shop_buy_ok: 'Куплено!',
      shop_equip_ok: 'Надето!', shop_no_coins: 'Не хватает монет', shop_already: 'Уже куплено',
      shop_tab: 'Магазин',
      faceit_link: 'Привязка FACEIT', faceit_link_btn: 'Привязать',
      faceit_unlink: 'Отвязать', faceit_placeholder: 'Никнейм FACEIT…',
      gr_title: 'База гранат', gr_sub: 'Ищи гранаты по карте, стороне и типу',
      gr_all: 'Все', gr_map: 'Карта', gr_side: 'Сторона', gr_type: 'Тип',
      gr_search: 'Поиск гранат…', gr_favs: 'Избранное',
      gr_difficulty: 'Сложность', gr_train: 'ТРЕНИРОВАТЬ', gr_trained: '✓ в плане',
      gr_empty: 'Гранат не найдено', gr_fav_empty: 'Пока нет избранных гранат — добавь ★',
      gr_fav_add: 'В избранное', gr_fav_rm: 'Убрать из избранного',
      gr_total: 'Гранат: {0}',
      tp_today: 'Сегодняшний план', tp_reco: 'Рекомендация',
      tp_do: 'Выполнить', tp_done: '✓ Выполнено',
      tp_min: '{0} мин', tp_progress: 'Выполнено {0} из {1}',
      tp_time: 'Время на тренировку', tp_goal: 'Цель',
      tp_goal_aim: 'Лучше аим', tp_goal_utility: 'Лучше утилита',
      tp_goal_game_sense: 'Лучше гейм-сенс', tp_goal_movement: 'Лучше движение',
      tp_goal_faceit10: 'До FACEIT 10',
      tp_saved: '✓ Сохранено', tp_skill_level: 'Навыки',
      gm_react_wait: 'Жди пика…', gm_react_go: 'ПИК! ЖМИ!', gm_react_too_soon: 'Рано! Тебя запикали',
      gm_react_miss: 'Прозевал пик!', gm_react_best: 'Лучшая реакция: {0} мс',
      gm_react_attempt: 'Попытка {0} из {1}', gm_react_hit: '✓ Попал!',
      gm_aim_hit: 'Целей: {0}', gm_aim_miss: 'Мимо!',
      gm_react_start: 'НАЧАТЬ РАУНД',
      gm_daily: 'Задание дня', gm_daily_done: '✓ Выполнено',
      gm_daily_bonus: '+20 XP за задание дня', gm_daily_play: 'Играть',
      ch_title: 'Челленджи недели', ch_sub: 'Новые задания каждый понедельник. Выполняй — забирай награду!',
      ch_week: 'Неделя {0}', ch_progress: '{0} / {1}', ch_claim: 'Забрать', ch_claimed: '✓ Получено',
      ch_done: 'Выполнено', ch_xp_coins: '+{0} XP · +{1} 🪙', ch_empty: 'Челленджи пока не готовы.',
      h_challenge: 'Челленджи недели', h_challenge_sub: 'Награды за активность',
      fr_title: 'Друзья', fr_sub: 'Добавляй друзей по ID, соревнуйся в XP',
      fr_add_ph: 'Telegram ID друга', fr_add: 'Добавить', fr_requests: 'Входящие запросы',
      fr_empty: 'Пока нет друзей. Добавь по ID!', fr_accept: 'Принять', fr_remove: 'Удалить',
      fr_sent: '✓ Запрос отправлен', fr_error: 'Ошибка: {0}', fr_lb: 'Лидерборд друзей',
      h_friends: 'Друзья', h_friends_sub: 'Запросы и лидерборд',
      shop_avatars: 'Аватары', shop_badges: 'Бейджи', shop_soldout: 'Распродано',
      shop_rarity_common: 'Обычный', shop_rarity_rare: 'Редкий',
      shop_rarity_epic: 'Эпический', shop_rarity_legendary: 'Легендарный',
      faceit_sync: 'Синхронизировать',
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
      sec_teams: 'Teams', sec_faceit: 'FACEIT', sec_pro: 'Pro scene',
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
      gurren_q1: '\"Believe in the me that believes in you!\" — Kamina',
      gurren_q2: '\"My drill is the drill that will pierce the heavens!\" — Simon',
      gurren_q3: '\"Go beyond the impossible and kick reason to the curb!\" — Kamina',
      gurren_note: 'Team Dai-Gurren · \"Who the hell do you think we are?!\" — Kamina · \"My drill will pierce the heavens!\" — Simon',
      theme_dark: 'Dark', theme_light: 'Light', theme_gurren: 'Gurren Lagann',
      lang_ru: 'Russian', lang_en: 'English',
      profile_tg: 'Telegram profile', app_label: 'App', version: 'Version',
      src_data: 'Data sources', set_region: 'FACEIT region', set_period: 'Stats period',
      fav_empty: 'Empty — add with the star on a player or team card',
      fav_rm: 'Remove', refresh_stats: 'Refresh stats', user: 'User',
      app_open: 'Open the app from the bot', load_fail: 'Failed to load data',
      tab_guides: 'Grenades',
      g_tab_maps: 'Maps',
      g_sections: 'sections', g_back_guides: 'Back to grenades',
      g_cat_lineups: 'Lineups', g_cat_tactics: 'Tactics',
      g_type_all: 'All', g_type_smoke: 'Smoke', g_type_flash: 'Flash',
      g_type_molotov: 'Molotov', g_type_grenade: 'Grenade',
      g_lineups_empty: 'No lineups yet', g_tactics_empty: 'No tactics yet',
      g_tactics_header: 'Mirage Tactics', g_more: 'Details', g_coming_soon: 'Coming soon', g_tips: 'Tips',
      g_steps: 'Execution',
      g_essence: 'The gist', g_goal: 'Goal', g_buy: 'Buy',
      g_map_hint: 'Tap a spot on the map to see lineups from it',
      g_map_reset_spot: 'Clear spot', g_map_spot: 'Lineups from this spot', g_tactic_label: 'Tactic',
      g_search_ph: 'Search lineups and tactics…',
      g_search_tactics: 'Search tactics…',
      g_pick_lineups_sub: 'Lineup videos by position on the radar',
      g_pick_tactics_sub: 'Team tactics for T and CT',
      g_pick_side: 'Choose a side',
      g_side_t: 'Terrorists',
      g_side_t_sub: 'Attack: pistol, eco, force, full buy',
      g_side_ct: 'Counter-Terrorists',
      g_side_ct_sub: 'Defense: pistol, eco, force, full buy',
      g_pick_round: 'Choose round type',
      g_round_pistol: 'Pistol',
      g_round_pistol_sub: 'First round, pistols only',
      g_round_eco: 'Eco',
      g_round_eco_sub: 'Save money, minimal buys',
      g_round_force: 'Force buy',
      g_round_force_sub: 'Spend everything this round',
      g_round_full: 'Full buy',
      g_round_full_sub: 'Full loadout with utility',
      g_spot_no_video: 'Video for this spot coming soon',
      g_spot_hint: 'Tap a spot on the radar to watch a video',
      g_spot_next: 'Next video',
      g_spot_open: 'Open on YouTube',
      g_mode_tldr: 'TL;DR', g_mode_plan: 'Scheme', g_mode_replay: 'Replay',
      g_difficulty: 'Difficulty', g_roles: 'Roles',
      g_role_filter: 'Show role', g_role_all: 'All roles',
      g_prev_step: 'Previous step', g_next_step: 'Next step',
      g_autoplay: 'Autoplay', g_autoplay_stop: 'Stop',
      g_step_of: 'Step {0} of {1}', g_phase: 'Phase',
      g_util_video: 'Watch the lineup', g_glossary: 'Hint',
      g_replay_play: 'Watch', g_replay_pause: 'Pause',
      g_replay_restart: 'Restart', g_replay_speed: 'Speed',
      g_replay_hint: 'Hit \"Watch\" — players run the tactic on the timeline, like a real round.',
      tab_home: 'Home', tab_learn: 'Learn',
      h_welcome: 'Welcome, {0}!', h_sub: 'Your path to CS2 mastery',
      h_continue: 'Continue learning', h_learn: 'Learn', h_maps: 'Grenades', h_stats: 'Stats',
      h_learn_sub: 'Lessons, flashcards and quizzes for beginners',
      h_maps_sub: 'Lineups by map',
      h_stats_sub: 'FACEIT, teams and players',
      h_progress: 'Your progress',
      h_lessons: 'Lessons', h_cards: 'Flashcards', h_quizzes: 'Quizzes',
      h_of: '{0} of {1}',
      h_best: 'Best score: {0}',
      l_lessons: 'Lessons', l_cards: 'Flashcards', l_quizzes: 'Quizzes',
      l_lessons_sub: 'Step-by-step basics',
      l_cards_sub: 'Learn the terms', l_quizzes_sub: 'Test yourself',
      l_done: '✓ done', l_questions: 'questions', l_sections: 'sections',
      l_open: 'Open', l_lesson_open: 'Start lesson',
      l_check: 'Check', l_correct: '✅ Correct!', l_wrong: '❌ Correct answer: {0}',
      l_finished: '🎉 Lesson completed!', l_lesson_repeat: 'Repeat',
      c_front: 'Term', c_back: 'Meaning', c_show: 'Show answer',
      c_known: 'Know it', c_unknown: "Don't know", c_done: '🎉 All flashcards learned!',
      c_left: 'Left: {0}', c_restart: 'Start over',
      q_start: 'Start quiz', q_q: 'Question {0} of {1}', q_result: 'Your score: {0} of {1}',
      q_best: 'Best score: {0}', q_again: 'Try again', q_next: 'Next',
      q_finish: 'Finish quiz', q_feedback_correct: '✅ Correct!',
      q_feedback_wrong: '❌ Correct answer: {0}',
      q_finished: '🏆 Quiz completed!', q_perfect: 'Excellent!', q_good: 'Not bad!', q_keep: 'Keep practicing!',
      tab_train: 'Train',
      tr_sub: 'Practice lineups on every map',
      tr_pick_map: 'Pick a map to practice',
      tr_attempts: '{0} practices', tr_practice: 'Practice', tr_practiced: '✓ drilled',
      tr_checklist: 'Practice checklist',
      tr_check1: 'Study the steps and throw position',
      tr_check2: 'Open the map and find the spot',
      tr_check3: 'Execute the throw in practice',
      tr_ready: 'Done!', tr_reset: 'Reset', tr_empty: 'No lineups on this map yet',
      tr_progress: 'Drilled: {0} of {1}',
      tr_spot_here: 'Throw spot',
      tab_games: 'Mini-Games',
      gm_sub: 'Test your CS2 knowledge',
      gm_play: 'Play', gm_best: 'Best: {0}', gm_played: '{0} played',
      gm_q: 'Question {0} of {1}', gm_score: 'Score: {0}/{1}',
      gm_correct: '✅ Correct!', gm_wrong: '❌ Wrong! Answer: {0}',
      gm_result: '🎯 Result: {0} of {1}', gm_play_again: 'Play again',
      gm_back: 'To games', gm_time: '{0} sec', gm_no_games: 'No games available',
      gm_finish: '🎉 Game over!',
      g_profile: 'Profile', g_level: 'Level', g_xp: 'XP', g_coins: 'Coins',
      g_streak: 'day streak', g_achievements: 'Achievements', g_ach_count: '{0} of {1}',
      lb_title: 'Leaderboard', lb_your_rank: 'Your rank: #{0}',
      shop_title: 'Shop', shop_buy: 'Buy', shop_equip: 'Equip',
      shop_owned: '✓ owned', shop_equipped: '✓ equipped', shop_buy_ok: 'Purchased!',
      shop_equip_ok: 'Equipped!', shop_no_coins: 'Not enough coins', shop_already: 'Already owned',
      shop_tab: 'Shop',
      faceit_link: 'FACEIT Link', faceit_link_btn: 'Link',
      faceit_unlink: 'Unlink', faceit_placeholder: 'FACEIT nickname…',
      gr_title: 'Grenade Database', gr_sub: 'Search grenades by map, side and type',
      gr_all: 'All', gr_map: 'Map', gr_side: 'Side', gr_type: 'Type',
      gr_search: 'Search grenades…', gr_favs: 'Favorites',
      gr_difficulty: 'Difficulty', gr_train: 'TRAIN THIS', gr_trained: '✓ planned',
      gr_empty: 'No grenades found', gr_fav_empty: 'No favorite grenades yet — add with ⭐',
      gr_fav_add: 'Add to favorites', gr_fav_rm: 'Remove from favorites',
      gr_total: 'Grenades: {0}',
      tp_today: 'Today\'s plan', tp_reco: 'Recommendation',
      tp_do: 'Complete', tp_done: '✓ Done',
      tp_min: '{0} min', tp_progress: 'Done {0} of {1}',
      tp_time: 'Training time', tp_goal: 'Goal',
      tp_goal_aim: 'Better aim', tp_goal_utility: 'Better utility',
      tp_goal_game_sense: 'Better game sense', tp_goal_movement: 'Better movement',
      tp_goal_faceit10: 'Reach FACEIT 10',
      tp_saved: '✓ Saved', tp_skill_level: 'Skills',
      gm_react_wait: 'Wait for the peek…', gm_react_go: 'PEEK! TAP!', gm_react_too_soon: 'Too early! You got peeked',
      gm_react_miss: 'Missed the peek!', gm_react_best: 'Best reaction: {0} ms',
      gm_react_attempt: 'Attempt {0} of {1}', gm_react_hit: '✓ Hit!',
      gm_aim_hit: 'Targets: {0}', gm_aim_miss: 'Miss!',
      gm_react_start: 'START ROUND',
      gm_daily: 'Daily Challenge', gm_daily_done: '✓ Done',
      gm_daily_bonus: '+20 XP for the daily challenge', gm_daily_play: 'Play',
      ch_title: 'Weekly Challenges', ch_sub: 'New challenges every Monday. Complete them and claim your reward!',
      ch_week: 'Week {0}', ch_progress: '{0} / {1}', ch_claim: 'Claim', ch_claimed: '✓ Claimed',
      ch_done: 'Done', ch_xp_coins: '+{0} XP · +{1} 🪙', ch_empty: 'No challenges yet.',
      h_challenge: 'Weekly Challenges', h_challenge_sub: 'Rewards for activity',
      fr_title: 'Friends', fr_sub: 'Add friends by ID, compete in XP',
      fr_add_ph: 'Friend Telegram ID', fr_add: 'Add', fr_requests: 'Incoming requests',
      fr_empty: 'No friends yet. Add by ID!', fr_accept: 'Accept', fr_remove: 'Remove',
      fr_sent: '✓ Request sent', fr_error: 'Error: {0}', fr_lb: 'Friends leaderboard',
      h_friends: 'Friends', h_friends_sub: 'Requests and leaderboard',
      shop_avatars: 'Avatars', shop_badges: 'Badges', shop_soldout: 'Sold out',
      shop_rarity_common: 'Common', shop_rarity_rare: 'Rare',
      shop_rarity_epic: 'Epic', shop_rarity_legendary: 'Legendary',
      faceit_sync: 'Sync',
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
    headers: { 'x-init-data': tg ? tg.initData : '', 'Content-Type': 'application/json' },
    get(path) { return fetch(path, { headers: this.headers }).then(r => r.json()); },
    post(path, body) {
      return fetch(path, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body || {})
      }).then(r => r.json());
    },
    del(path) {
      return fetch(path, { method: 'DELETE', headers: this.headers }).then(r => r.json());
    }
  };

  function syncProfile(data) {
    if (data && data.profile) {
      profileCache = data.profile;
    }
  }

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

  function addSkeleton(box, rows) {
    const wrap = el('div', 'sk-wrap');
    for (let i = 0; i < rows; i++) {
      const row = el('div', 'sk-row');
      row.appendChild(el('div', 'sk sk-ico'));
      const body = el('div', 'sk-body');
      body.appendChild(el('div', 'sk sk-line'));
      body.appendChild(el('div', 'sk sk-line short'));
      row.appendChild(body);
      wrap.appendChild(row);
    }
    box.appendChild(wrap);
    return wrap;
  }

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
    if (p.rating != null) row.appendChild(el('div', 'm-score', formatNum(p.rating, 2)));
    if (p.slug) row.appendChild(el('span', 'g-chev', '›'));
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

  function renderTeamDetail(team, td) {
    const hero = el('div', 't-hero');
    const logo = avatarEl({ image: team.image, name: team.name });
    logo.classList.add('hero-logo');
    hero.appendChild(logo);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', team.name + (team.acronym ? ' ' + team.acronym : '')));
    const badges = el('div', 't-badges');
    if (team.rank != null) badges.appendChild(el('span', 'rank-badge', '#' + team.rank));
    if (team.rank_diff) badges.appendChild(el('span', 'delta-badge', (team.rank_diff > 0 ? '▲' : '▼') + ' ' + Math.abs(team.rank_diff)));
    if (team.country_code) badges.appendChild(el('span', 'c-badge', team.country_code.toUpperCase()));
    hinfo.appendChild(badges);
    const meta = el('div', 't-meta');
    if (team.country_name) meta.appendChild(el('span', null, team.country_name));
    if (team.est_date) meta.appendChild(el('span', null, t('founded') + team.est_date));
    if (team.six_month_earned) meta.appendChild(el('span', 'earn', formatMoney(team.six_month_earned)));
    hinfo.appendChild(meta);
    hero.appendChild(hinfo);
    if (team.slug) hero.appendChild(favBtn({ type: 'team', key: team.slug, name: team.name, image: team.image }));
    td.appendChild(hero);

    const teamStory = storySection(team.bio_text);
    if (teamStory) td.appendChild(teamStory);

    const s = team.stats || {};
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
    const ms = team.matches || [];
    if (!ms.length) hist.appendChild(el('p', 'muted-note', t('no_data')));
    ms.forEach(m => hist.appendChild(matchRow(m)));
    td.appendChild(hist);

    td.appendChild(sectionTitle('users', t('roster')));
    const rost = el('div', 't-roster');
    const rl = team.roster || [];
    if (!rl.length) rost.appendChild(el('p', 'muted-note', t('no_data')));
    rl.forEach(p => rost.appendChild(rosterRow(p)));
    bindRows(rost, slug => openPlayer(slug));
    td.appendChild(rost);

    td.appendChild(sectionTitle('trophy', t('achievements')));
    const ach = el('div', 't-ach');
    const al = team.achievements || [];
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

  function storySection(text) {
    if (!text) return null;
    const story = el('div', 'bio-story');
    const storyTitle = el('div', 'bio-story-title');
    storyTitle.appendChild(iconEl('users'));
    storyTitle.appendChild(document.createTextNode(t('story')));
    story.appendChild(storyTitle);
    story.appendChild(el('p', 'bio-story-text', text));
    return story;
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
      const story = storySection(p.bio_text);
      if (story) bioBox.appendChild(story);
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

    const faceitStory = storySection(p.bio_text);
    if (faceitStory) td.appendChild(faceitStory);

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
    if (name === 'home') {
      renderHome();
    } else if (name === 'learn') {
      renderLearn();
    } else if (name === 'train') {
      renderTrain();
    } else if (name === 'games') {
      renderGames();
    } else if (name === 'stats') {
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
        const td = TAB_DEFS[b.dataset.tab];
        if (td) {
          const lbl = b.querySelector('.tab-label');
          if (lbl) lbl.textContent = t(td.labelKey);
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

    view.appendChild(sectionTitle('stats', t('faceit_link') || 'FACEIT Link'));
    const faceitBox = el('div', 'set-row');
    const faceitInfo = profileCache || {};
    if (faceitInfo.faceit_name) {
      const frow = el('div', 'set-row');
      const finfo2 = el('div', 'player-info');
      finfo2.appendChild(el('div', 'player-nick', faceitInfo.faceit_name));
      const fmeta2 = el('div', 'player-meta');
      if (faceitInfo.faceit_level) fmeta2.appendChild(el('span', 'ok-badge', 'Lv ' + faceitInfo.faceit_level));
      if (faceitInfo.faceit_elo) fmeta2.appendChild(el('span', null, faceitInfo.faceit_elo + ' ELO'));
      finfo2.appendChild(fmeta2);
      frow.appendChild(finfo2);
      faceitBox.appendChild(frow);
      const syncBtn = el('button', 'link-btn');
      syncBtn.appendChild(iconEl('refresh'));
      syncBtn.appendChild(document.createTextNode(t('faceit_sync') || 'Sync'));
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        const r = await api.post('/api/faceit/sync', {}).catch(() => ({}));
        if (r.ok) { profileCache = r.profile || profileCache; renderSettings(); }
        else { syncBtn.disabled = false; }
      });
      faceitBox.appendChild(syncBtn);
      const unlinked = el('button', 'link-btn');
      unlinked.textContent = t('faceit_unlink') || 'Unlink';
      unlinked.addEventListener('click', async () => {
        await api.post('/api/faceit/unlink', {}).catch(() => {});
        profileCache.faceit_id = '';
        profileCache.faceit_name = '';
        profileCache.faceit_level = 0;
        profileCache.faceit_elo = 0;
        renderSettings();
      });
      faceitBox.appendChild(unlinked);
    } else {
      const input = el('input', 'q-input');
      input.setAttribute('placeholder', t('faceit_placeholder') || 'FACEIT nickname…');
      input.setAttribute('type', 'text');
      faceitBox.appendChild(input);
      const linkBtn = el('button', 'link-btn');
      linkBtn.textContent = t('faceit_link_btn') || 'Link';
      linkBtn.addEventListener('click', async () => {
        const name = (input.value || '').trim();
        if (!name) return;
        linkBtn.disabled = true;
        const r = await api.post('/api/faceit/link', { faceit_name: name }).catch(() => ({}));
        if (r.ok) {
          profileCache = r.profile || profileCache;
          renderSettings();
        } else {
          linkBtn.disabled = false;
          input.style.borderColor = 'var(--loss)';
        }
      });
      faceitBox.appendChild(linkBtn);
    }
    view.appendChild(faceitBox);

    if (isAdmin) {
      view.appendChild(sectionTitle('bolt', t('admin_title') || 'Admin'));
      const adminBox = el('div', 'sub-box');
      const loadMetrics = el('button', 'link-btn', t('admin_metrics') || 'Metrics');
      loadMetrics.addEventListener('click', async () => {
        const r = await api.get('/api/admin/dashboard').catch(() => ({ ok: false }));
        if (!r.ok) return;
        const d = r.dashboard || {};
        adminBox.innerHTML = '';
        const rows = [
          ['Users', d.total_users], ['Profiles', d.total_profiles],
          ['Lessons', d.total_lessons_done], ['Quizzes', d.total_quizzes_done],
          ['Practices', d.total_practices_done], ['Games', d.total_games_done],
          ['Training tasks', d.total_training_done], ['Challenges', d.total_challenges_claimed],
          ['XP given', d.total_xp_given], ['Coins spent', d.total_coins_spent],
          ['Transactions', d.total_transactions],
        ];
        const grid = el('div', 'ach-grid');
        rows.forEach(([label, val]) => {
          const c = el('div', 'ach-card unlocked');
          c.appendChild(el('div', 'ach-icon', '📊'));
          c.appendChild(el('div', 'ach-name', label + ': ' + val));
          grid.appendChild(c);
        });
        adminBox.appendChild(grid);
        const top = (d.top_users || []);
        if (top.length) {
          adminBox.appendChild(el('p', 'muted-note', t('admin_top') || 'Top users'));
          top.forEach((u, i) => {
            adminBox.appendChild(el('p', 'muted-note', '#' + (i + 1) + ' · ' + u.user_id + ' · ' + u.xp + ' XP'));
          });
        }
      });
      adminBox.appendChild(loadMetrics);
      const loadOver = el('button', 'link-btn', t('admin_overrides') || 'Grenade overrides');
      loadOver.addEventListener('click', async () => {
        const r = await api.get('/api/admin/grenades').catch(() => ({ ok: false }));
        if (!r.ok) return;
        adminBox.innerHTML = '';
        const ov = r.overrides || {};
        const ids = Object.keys(ov);
        adminBox.appendChild(el('p', 'muted-note', (t('admin_count') || 'Overrides: ') + ids.length));
        ids.forEach(id => {
          const row = el('div', 'g-row');
          row.appendChild(el('div', 'g-ico', '💣'));
          const info = el('div', 'player-info');
          info.appendChild(el('div', 'player-nick', ov[id].title || id));
          info.appendChild(el('div', 'player-meta', (ov[id].map || '') + ' · ' + (ov[id].type || '')));
          row.appendChild(info);
          const del = el('button', 'link-btn', '✕');
          del.addEventListener('click', async () => {
            await api.post('/api/admin/content/delete', { content_type: 'grenade', content_key: id });
            loadOver.click();
          });
          row.appendChild(del);
          adminBox.appendChild(row);
        });
        const form = el('div', 'fr-add-row');
        const input = document.createElement('input');
        input.className = 'gr-search';
        input.placeholder = t('admin_new_id') || 'new-grenade-id';
        form.appendChild(input);
        const create = el('button', 'link-btn', '+');
        create.addEventListener('click', async () => {
          const id = (input.value || '').trim();
          if (!id) return;
          await api.post('/api/admin/content', {
            content_type: 'grenade',
            content_key: id,
            payload: { map: 'mirage', title: id, type: 'smoke', side: 'T', site: 'A', difficulty: 1, steps: ['Step 1'] }
          });
          loadOver.click();
        });
        form.appendChild(create);
        adminBox.appendChild(form);
      });
      adminBox.appendChild(loadOver);
      view.appendChild(adminBox);
    }

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

  const GUIDE_TYPES = {
    smoke: { key: 'g_type_smoke', cls: 'lt-smoke', emoji: '💨' },
    flash: { key: 'g_type_flash', cls: 'lt-flash', emoji: '✨' },
    molotov: { key: 'g_type_molotov', cls: 'lt-molotov', emoji: '🔥' },
    grenade: { key: 'g_type_grenade', cls: 'lt-grenade', emoji: '💣' }
  };

  const G_STOP = new Set(['на', 'в', 'из', 'и', 'к', 'за', 'от', 'по', 'со', 'с', 'у', 'для', 'до', 'во', 'что', 'как', 'не', 'же', 'бы', 'при', 'над', 'под', 'об', 'про', 'без', 'мне', 'нужно', 'надо', 'хочу', 'хотел', 'через', 'можно', 'типа', 'если', 'когда', 'нужен', 'нужна', 'все', 'всё', 'покажи', 'показать', 'посоветуй', 'дай', 'чтобы', 'я', 'играю', 'играть', 'играем', 'какой', 'какие', 'какая', 'где', 'это', 'или', 'тоже', 'очень']);

  const G_TYPE_SYN = {
    smoke: ['смок', 'дым', 'смоук', 'smoke', 'oneway', 'ванвей'],
    flash: ['флешка', 'флеш', 'светаш', 'вспышка', 'flash', 'светошумовая', 'флешбанг'],
    molotov: ['молотов', 'молот', 'зажигательная', 'молотовом', 'molotov', 'зажигательный'],
    grenade: ['граната', 'гранат', 'grenade', 'гранаты']
  };

  const G_TERMS = [
    { keys: ['выход', 'выйти', 'выбежать', 'выходить', 'вылезть'], w: 2 },
    { keys: ['заход', 'зайти', 'заходит', 'заходить'], w: 2 },
    { keys: ['пуш', 'пушить', 'пушим'], w: 2 },
    { keys: ['контроль', 'контролировать'], w: 2 },
    { keys: ['перекрыть', 'перекрывает', 'перекрытия'], w: 2 },
    { keys: ['закрыть', 'закрывает'], w: 2 },
    { keys: ['убрать', 'убирает', 'выжигает', 'выжечь'], w: 2 },
    { keys: ['дефолт', 'default'], w: 2 },
    { keys: ['ретекейт', 'ретейк'], w: 2 },
    { keys: ['сайт', 'site', 'точка'], w: 2 },
    { keys: ['ящик', 'ящика', 'box', 'бокс'], w: 2 },
    { keys: ['пройти', 'проход', 'проходить', 'пройдём', 'проходим'], w: 2 },
    { keys: ['взять', 'занять', 'забирать', 'забираем'], w: 2 },
    { keys: ['идти', 'идём', 'идем', 'пойти', 'заходим'], w: 2 }
  ];

  const G_LOC = {
    mirage: [
      { name: 'window', aliases: ['окно', 'window', 'виндоу'] },
      { name: 'ct', aliases: ['кт', 'ct'] },
      { name: 'jungle', aliases: ['джангл', 'jungle', 'пальма'] },
      { name: 'stairs', aliases: ['лестница', 'лестницу', 'stairs'] },
      { name: 'underpass', aliases: ['андерпас', 'underpass'] },
      { name: 'apartments', aliases: ['апартаменты', 'apartments', 'апсы'] },
      { name: 'ramp', aliases: ['рамп', 'ramp'] },
      { name: 'short', aliases: ['шорт', 'short'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    dust2: [
      { name: 'xbox', aliases: ['xbox', 'бокс', 'ящик'] },
      { name: 'mid', aliases: ['mid', 'мид'] },
      { name: 'long', aliases: ['long', 'лонг', 'длинная', 'длинную'] },
      { name: 'window', aliases: ['окно', 'window', 'виндоу'] },
      { name: 'short', aliases: ['short', 'шорт', 'кошка', 'cat', 'catwalk'] },
      { name: 'goose', aliases: ['goose', 'гоуз', 'гусь', 'гуся', 'гус'] },
      { name: 'ct', aliases: ['ct', 'кт'] },
      { name: 'tunnels', aliases: ['туннели', 'туннел', 'tunnels'] },
      { name: 'doors', aliases: ['двери', 'doors'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    inferno: [
      { name: 'banana', aliases: ['banana', 'банан', 'банану'] },
      { name: 'ct', aliases: ['ct', 'кт'] },
      { name: 'coffins', aliases: ['coffins', 'коффинс', 'гробы'] },
      { name: 'mid', aliases: ['mid', 'мид'] },
      { name: 'library', aliases: ['library', 'лайбрари', 'библиотека'] },
      { name: 'arch', aliases: ['арка', 'arch', 'арки', 'арку'] },
      { name: 'apartments', aliases: ['апартаменты', 'apartments', 'апсы'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    nuke: [
      { name: 'outside', aliases: ['outside', 'аутсайд', 'аут'] },
      { name: 'secret', aliases: ['secret', 'секрет'] },
      { name: 'ramp', aliases: ['ramp', 'рамп'] },
      { name: 'hut', aliases: ['hut', 'хат'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    ancient: [
      { name: 'mid', aliases: ['mid', 'мид'] },
      { name: 'cave', aliases: ['cave', 'кейв', 'пещера'] },
      { name: 'main', aliases: ['main', 'мейн'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    overpass: [
      { name: 'monster', aliases: ['monster', 'монстр'] },
      { name: 'short', aliases: ['short', 'шорт'] },
      { name: 'construction', aliases: ['construction', 'констракшн', 'стройка'] },
      { name: 'connector', aliases: ['connector', 'коннектор'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    anubis: [
      { name: 'mid', aliases: ['mid', 'мид'] },
      { name: 'main', aliases: ['main', 'мейн'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    vertigo: [
      { name: 'ramp', aliases: ['ramp', 'рамп'] },
      { name: 'main', aliases: ['main', 'мейн'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    train: [
      { name: 'ladder', aliases: ['ladder', 'лестница', 'ладер'] },
      { name: 'ivy', aliases: ['ivy', 'айви'] },
      { name: 'main', aliases: ['main', 'мейн'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ],
    cache: [
      { name: 'mid', aliases: ['mid', 'мид'] },
      { name: 'highway', aliases: ['highway', 'хайвей'] },
      { name: 'main', aliases: ['main', 'мейн'] },
      { name: 'a', aliases: ['а', 'ай', 'a'] },
      { name: 'b', aliases: ['б', 'би', 'b'] }
    ]
  };

  const G_SITE = {
    mirage: {
      a: { covers: ['window', 'jungle', 'ct', 'stairs', 'short', 'ramp', 'a'] },
      b: { covers: ['underpass', 'apartments', 'ct', 'stairs', 'jungle', 'b'] }
    },
    dust2: {
      a: { covers: ['long', 'goose', 'ct', 'doors', 'short', 'xbox', 'a'] },
      b: { covers: ['short', 'window', 'tunnels', 'doors', 'mid', 'ct', 'xbox', 'b'] }
    },
    inferno: {
      a: { covers: ['ct', 'apartments', 'arch', 'library', 'mid', 'a'] },
      b: { covers: ['banana', 'coffins', 'ct', 'library', 'arch', 'b'] }
    },
    nuke: {
      a: { covers: ['ramp', 'hut', 'outside', 'secret', 'a'] },
      b: { covers: ['secret', 'ramp', 'outside', 'b'] }
    },
    ancient: {
      a: { covers: ['main', 'mid', 'cave', 'a'] },
      b: { covers: ['cave', 'mid', 'main', 'b'] }
    },
    overpass: {
      a: { covers: ['monster', 'construction', 'connector', 'short', 'a'] },
      b: { covers: ['short', 'construction', 'connector', 'monster', 'b'] }
    },
    anubis: {
      a: { covers: ['main', 'mid', 'a'] },
      b: { covers: ['main', 'mid', 'b'] }
    },
    vertigo: {
      a: { covers: ['ramp', 'main', 'a'] },
      b: { covers: ['ramp', 'main', 'b'] }
    },
    train: {
      a: { covers: ['ladder', 'main', 'ivy', 'a'] },
      b: { covers: ['ivy', 'main', 'ladder', 'b'] }
    },
    cache: {
      a: { covers: ['mid', 'main', 'highway', 'a'] },
      b: { covers: ['mid', 'main', 'highway', 'b'] }
    }
  };

  const G_SITE_W = { 'а': 'a', 'a': 'a', 'ай': 'a', 'ai': 'a', 'б': 'b', 'b': 'b', 'би': 'b', 'бэ': 'b', 'be': 'b' };

  const G_TR_ALPHA = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяіїєґўabcdefghijklmnopqrstuvwxyz0123456789';
  const G_TR = {
    'sh': 'ш', 'ch': 'ч', 'zh': 'ж', 'ts': 'ц', 'ya': 'я', 'yu': 'ю', 'ye': 'е',
    'yo': 'ё', 'kh': 'х', 'ph': 'ф', 'dz': 'дз', 'a': 'а', 'b': 'б', 'v': 'в',
    'g': 'г', 'd': 'д', 'e': 'е', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л',
    'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
    'f': 'ф', 'h': 'х', 'c': 'ц', 'x': 'кс', 'w': 'в', 'q': 'к', 'j': 'дж',
    'і': 'и', 'ї': 'и', 'є': 'е', 'ґ': 'г'
  };
  const _gNearCache = new Map();

  function gTr(s) {
    const out = [];
    const cs = String(s || '').toLowerCase();
    for (let i = 0; i < cs.length; i++) {
      const two = cs.slice(i, i + 2);
      if (G_TR[two]) { out.push(G_TR[two]); i++; continue; }
      out.push(G_TR[cs[i]] || cs[i]);
    }
    return out.join('');
  }

  function gNear(s) {
    const key = s || '';
    if (_gNearCache.has(key)) return _gNearCache.get(key);
    const set = new Set();
    if (key.length) {
      for (let i = 0; i < key.length; i++) set.add(key.slice(0, i) + key.slice(i + 1));
      for (let i = 0; i < key.length; i++) {
        const c = key[i];
        for (let j = 0; j < G_TR_ALPHA.length; j++) {
          const r = G_TR_ALPHA[j];
          if (r !== c) set.add(key.slice(0, i) + r + key.slice(i + 1));
        }
      }
    }
    for (let i = 0; i <= key.length; i++) {
      for (let j = 0; j < G_TR_ALPHA.length; j++) {
        set.add(key.slice(0, i) + G_TR_ALPHA[j] + key.slice(i));
      }
    }
    if (_gNearCache.size > 400) _gNearCache.clear();
    _gNearCache.set(key, set);
    return set;
  }

  function gStem(w) {
    if (!w || w.length <= 3) return w;
    const sufs = ['иями', 'ями', 'ого', 'его', 'ому', 'ему', 'ими', 'ыми', 'ая', 'яя', 'ый', 'ий', 'ой', 'ое', 'ее', 'ую', 'юю', 'ах', 'ях', 'ам', 'ям', 'ом', 'ем', 'ым', 'им', 'ов', 'ев', 'ей', 'а', 'я', 'ы', 'и', 'е', 'у', 'ю', 'о', 'ь'];
    for (const s of sufs) {
      if (w.length - s.length >= 3 && w.endsWith(s)) return w.slice(0, -s.length);
    }
    return w;
  }

  function gTokens(text) {
    return String(text || '').toLowerCase().split(/[^a-zа-я0-9ёіїєґў]+/).filter(Boolean);
  }

  function gBuildIndex(mapId, item) {
    const idx = {};
    const add = (arr, w) => {
      if (!arr) return;
      arr.forEach(tok => {
        const st = gStem(String(tok).toLowerCase());
        if (st && !G_STOP.has(st)) idx[st] = Math.max(idx[st] || 0, w);
      });
    };
    const title = item.title || '';
    const steps = item.steps || [];
    const text = title.toLowerCase() + ' ' + steps.join(' ').toLowerCase();
    const textTok = new Set(gTokens(text));
    const titleTok = new Set(gTokens(title));
    const locs = [];
    add(titleTok, 3);
    add(G_TYPE_SYN[item.type], 3);
    (G_LOC[mapId] || []).forEach(loc => {
      if (textTok.has(loc.name)) {
        locs.push(loc.name);
        const w = titleTok.has(loc.name) ? 4 : 3;
        add(loc.aliases, w);
        add([loc.name], w);
      }
    });
    G_TERMS.forEach(term => {
      if (term.keys.some(k => text.indexOf(k) !== -1)) add(term.keys, term.w);
    });
    add(textTok, 1);
    return { idx, keys: Object.keys(idx), blob: text, locs };
  }

  function gScore(idx, tokens) {
    let score = 0, hits = 0;
    const seen = new Set();
    tokens.forEach(tok => {
      let best = 0;
      [tok, gTr(tok)].forEach(v => {
        const st = gStem(v);
        if (!st || G_STOP.has(st) || seen.has(st)) return;
        seen.add(st);
        if (idx.idx[st]) { best = Math.max(best, idx.idx[st]); return; }
        if (st.length >= 3 && idx.blob.indexOf(st) !== -1) { best = Math.max(best, 1); return; }
        if (st.length >= 3) {
          const near = gNear(st);
          idx.keys.forEach(k => {
            if (near.has(k)) best = Math.max(best, idx.idx[k]);
          });
        }
      });
      if (best) { score += best; hits++; }
    });
    return { score, hits };
  }

  function gDetectGoal(mapId, tokens) {
    const sites = new Set();
    const routes = new Set();
    const locs = G_LOC[mapId] || [];
    tokens.forEach(tok => {
      [tok, gTr(tok)].forEach(v => {
        const st = gStem(v);
        if (!st || G_STOP.has(st)) return;
        const s = G_SITE_W[st];
        if (s) { sites.add(s); }
        const near = st.length >= 3 ? gNear(st) : null;
        locs.forEach(loc => {
          if (loc.aliases.some(al => {
            const a = gStem(String(al).toLowerCase());
            return a === st || (near && near.has(a));
          })) routes.add(loc.name);
        });
      });
    });
    return { sites: [...sites], routes: [...routes] };
  }

  function gGoalScore(mapId, idx, goal) {
    if ((!goal.sites.length && !goal.routes.length) || !idx.locs || !idx.locs.length) return 0;
    const relevant = new Set();
    goal.sites.forEach(s => {
      const c = (G_SITE[mapId] || {})[s];
      if (c) c.covers.forEach(x => relevant.add(x));
    });
    goal.routes.forEach(x => relevant.add(x));
    let bonus = 0;
    idx.locs.forEach(l => {
      if (relevant.has(l)) bonus += 3;
    });
    goal.routes.forEach(x => {
      if (idx.locs.indexOf(x) !== -1) bonus += 2;
    });
    if (goal.sites.includes('a') && idx.locs.indexOf('a') !== -1) bonus += 6;
    if (goal.sites.includes('b') && idx.locs.indexOf('b') !== -1) bonus += 6;
    return bonus;
  }

  async function loadGuides() {
    if (!guidesData) {
      const res = await api.get('/api/guides');
      if (!res.ok) throw new Error('bad guides');
      guidesData = res;
    }
    return guidesData;
  }

  function gBackBtn(onClick) {
    const back = el('button', 'back-btn');
    back.appendChild(iconEl('back'));
    back.appendChild(document.createTextNode(t('g_back_guides')));
    back.addEventListener('click', () => (onClick || renderGuides)());
    return back;
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
    img.setAttribute('src', map.img || ('/static/maps/' + map.image));
    img.setAttribute('alt', map.name);
    img.loading = 'lazy';
    pic.appendChild(img);
    pic.appendChild(el('span', 'map-name', map.name));
    card.appendChild(pic);
    card.addEventListener('click', () => openMap(map));
    return card;
  }

  async function renderGuides() {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('guides', t('tab_guides')));
    const box = el('div', 'sub-box');
    view.appendChild(box);
    const loadbar = el('div', 'loadbar');
    loadbar.appendChild(el('div', 'loadbar-fill'));
    box.appendChild(loadbar);
    try {
      const g = await loadGuides();
      loadbar.remove();
      renderMapsList(box, g.maps);
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('load_fail')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => { guidesData = null; renderGuides(); });
      errBox.appendChild(retry);
      box.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function renderMapsList(box, maps) {
    (maps || []).forEach(map => box.appendChild(gMapCard(map)));
  }

  function mapById(id) {
    if (!guidesData || !guidesData.maps) return null;
    return guidesData.maps.find(m => m.id === id) || null;
  }

  function openMap(item) {
    activeSpotId = null;
    renderMap(item);
  }

  function pickCard(icon, title, subtitle, onClick) {
    const card = el('div', 'pick-card');
    card.appendChild(iconEl(icon));
    const info = el('div', 'pick-info');
    info.appendChild(el('div', 'pick-title', title));
    info.appendChild(el('div', 'pick-sub', subtitle));
    card.appendChild(info);
    card.appendChild(el('span', 'g-chev', '>'));
    card.addEventListener('click', onClick);
    return card;
  }

  function renderMapHub(item) {
    currentMap = item;
    clear();
    view.appendChild(gBackBtn(() => renderGuides()));
    view.appendChild(sectionTitle('guides', (item.emoji || '') + ' ' + item.name));
    const box = el('div', 'sub-box');
    view.appendChild(box);
    box.appendChild(pickCard('bolt', t('g_cat_lineups'), t('g_pick_lineups_sub'), () => renderMap(item)));
    box.appendChild(pickCard('users', t('g_cat_tactics'), t('g_pick_tactics_sub'), () => renderMapTactics(item)));
  }

  function renderMapTactics(item) {
    currentMap = item;
    clear();
    closeTacSheet();
    view.appendChild(gBackBtn(() => renderMapHub(item)));

    const header = el('div', 'tac-header');
    header.appendChild(el('span', 'tac-header-icon', '🏜️'));
    header.appendChild(el('span', 'tac-header-name', t('g_tactics_header')));
    view.appendChild(header);

    const filter = tacticsFilter;

    const sides = el('div', 'tac-sides');
    [['t', 'g_side_t', 'g_side_t_sub', 'tac-side-t'], ['ct', 'g_side_ct', 'g_side_ct_sub', 'tac-side-ct']].forEach(p => {
      const b = el('button', 'tac-side ' + p[3]);
      b.dataset.side = p[0];
      b.appendChild(el('span', 'tac-side-label', t(p[1])));
      b.appendChild(el('span', 'tac-side-sub', t(p[2])));
      b.addEventListener('click', () => { filter.side = p[0]; render(); });
      sides.appendChild(b);
    });
    view.appendChild(sides);

    const rounds = el('div', 'tac-rounds');
    [['pistol', 'g_round_pistol'], ['eco', 'g_round_eco'], ['force', 'g_round_force'], ['full', 'g_round_full']].forEach(p => {
      const c = el('button', 'tac-round', t(p[1]));
      c.dataset.round = p[0];
      c.addEventListener('click', () => { filter.round = p[0]; render(); });
      rounds.appendChild(c);
    });
    view.appendChild(rounds);

    const listBox = el('div', 'tac-list');
    view.appendChild(listBox);

    function currentList() {
      const m = (guidesData.tactics || {})[item.id];
      const bySide = (m && typeof m === 'object' && !Array.isArray(m)) ? (m[filter.side] || {}) : {};
      return Array.isArray(bySide) ? bySide : (bySide[filter.round] || []);
    }

    function render() {
      sides.querySelectorAll('.tac-side').forEach(b => b.classList.toggle('active', b.dataset.side === filter.side));
      rounds.querySelectorAll('.tac-round').forEach(c => c.classList.toggle('active', c.dataset.round === filter.round));
      listBox.innerHTML = '';
      const list = currentList();
      const head = el('div', 'tac-list-head');
      head.appendChild(el('span', 'tac-list-title', t(filter.side === 't' ? 'g_side_t' : 'g_side_ct') + ' · ' + roundLabel(filter.round)));
      head.appendChild(el('span', 'tac-list-n', String(list.length)));
      listBox.appendChild(head);
      if (!list.length) {
        listBox.appendChild(el('p', 'tac-empty', t('g_tactics_empty')));
        return;
      }
      list.forEach(tc => {
        const card = el('div', 'tactic-card');
        card.addEventListener('click', () => openTacSheet(tc));
        card.appendChild(el('span', 'tactic-icon', tc.icon || '🎯'));
        const body = el('div', 'tactic-body');
        body.appendChild(el('div', 'tactic-name', tc.title));
        if (tc.short) body.appendChild(el('div', 'tactic-desc', tc.short));
        card.appendChild(body);
        const more = el('button', 'tactic-more', t('g_more'));
        more.addEventListener('click', (e) => { e.stopPropagation(); openTacSheet(tc); });
        card.appendChild(more);
        listBox.appendChild(card);
      });
    }

    render();
  }

  function openTacSheet(tc) {
    closeTacSheet();
    const overlay = el('div', 'tac-sheet');
    const panel = el('div', 'tac-sheet-panel');
    const head = el('div', 'tac-sheet-head');
    head.appendChild(el('span', 'tac-sheet-icon', tc.icon || '🎯'));
    const titles = el('div', 'tac-sheet-titles');
    titles.appendChild(el('div', 'tac-sheet-title', tc.title));
    if (tc.short) titles.appendChild(el('div', 'tac-sheet-sub', tc.short));
    head.appendChild(titles);
    const close = el('button', 'tac-sheet-close', '✕');
    close.setAttribute('aria-label', t('back'));
    close.addEventListener('click', closeTacSheet);
    head.appendChild(close);
    panel.appendChild(head);

    function tacBox(ico, label, text, cls) {
      const box = el('div', 't-box ' + cls);
      const bhead = el('div', 't-box-head');
      bhead.appendChild(el('span', 't-box-ico', ico));
      bhead.appendChild(el('span', 't-box-label', label));
      box.appendChild(bhead);
      box.appendChild(el('div', 't-box-text', text));
      return box;
    }

    if (tc.goal) panel.appendChild(tacBox('🎯', t('g_goal'), tc.goal, 't-goal'));
    if (tc.buy) panel.appendChild(tacBox('🛒', t('g_buy'), tc.buy, 't-buy'));
    panel.appendChild(el('div', 'tac-sheet-label', t('g_steps')));
    const ol = el('ol', 'g-steps');
    (tc.steps || []).forEach(s => ol.appendChild(el('li', 'g-step', s)));
    panel.appendChild(ol);
    if (tc.tips && tc.tips.length) {
      panel.appendChild(el('div', 'tac-sheet-label', t('g_tips')));
      const ul = el('ul', 'tac-tips');
      tc.tips.forEach(tip => ul.appendChild(el('li', 'tac-tip', tip)));
      panel.appendChild(ul);
    }
    overlay.appendChild(panel);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeTacSheet(); });
    view.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);
  }

  function closeTacSheet() {
    const o = view.querySelector('.tac-sheet');
    if (o) o.remove();
  }

  function roundLabel(round) {
    const map = { pistol: 'g_round_pistol', eco: 'g_round_eco', force: 'g_round_force', full: 'g_round_full' };
    return t(map[round] || 'g_round_pistol');
  }

  function tacticMeta(tc) {
    const parts = [];
    const phases = tacticPhases(tc);
    let nSteps = 0, lastT = 0;
    phases.forEach(ph => {
      nSteps += (ph.steps || []).length;
      (ph.steps || []).forEach(s => { if (s.time != null && s.time > lastT) lastT = s.time; });
    });
    if (tc.difficulty) parts.push(diffBadge(tc));
    if (nSteps) parts.push(nSteps + ' ⤷');
    if (lastT) parts.push('⏱ ' + lastT + 'с');
    return parts.join(' · ');
  }

  function gTacticRow(tc, side, onClick) {
    const row = el('div', 'g-row tactic-row');
    const badgeCls = side === 't' ? 'side-t' : (side === 'ct' ? 'side-ct' : 'side-none');
    row.appendChild(el('span', 'g-ico ' + badgeCls, side === 't' ? 'T' : (side === 'ct' ? 'CT' : '·')));
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', tc.title));
    if (tc.short) info.appendChild(el('div', 'tactic-desc', tc.short));
    const meta = tacticMeta(tc);
    if (meta) info.appendChild(el('div', 'player-meta', meta));
    row.appendChild(info);
    row.appendChild(el('span', 'g-chev', '›'));
    row.addEventListener('click', onClick);
    return row;
  }

  function tacticBox(icon, label, text, cls) {
    const box = el('div', 't-box ' + (cls || ''));
    const head = el('div', 't-box-head');
    head.appendChild(el('span', 't-box-ico', icon));
    head.appendChild(el('span', 't-box-label', label));
    box.appendChild(head);
    box.appendChild(el('div', 't-box-text', text));
    return box;
  }

  function tacticPhases(tc) {
    if (tc.phases && tc.phases.length) return tc.phases;
    return [{ name: t('g_steps'), steps: tc.steps || [] }];
  }

  function gPhases(tc) {
    const wrap = el('div', 'g-phases');
    tacticPhases(tc).forEach((ph, i) => {
      const block = el('div', 'g-phase');
      const head = el('div', 'g-phase-head');
      head.appendChild(el('span', 'g-phase-num', String(i + 1).padStart(2, '0')));
      head.appendChild(el('span', 'g-phase-name', ph.name));
      block.appendChild(head);
      const ol = el('ol', 'g-steps');
      (ph.steps || []).forEach(s => ol.appendChild(el('li', 'g-step', s)));
      block.appendChild(ol);
      wrap.appendChild(block);
    });
    return wrap;
  }


  function renderMap(item) {
    currentMap = item;
    clear();
    view.appendChild(gBackBtn(() => renderGuides()));

    const head = el('div', 'map-head');
    head.appendChild(el('span', 'map-head-name', (item.emoji || '') + ' ' + item.name));
    head.appendChild(el('p', 'map-head-hint', t('g_spot_hint')));
    view.appendChild(head);

    const mapSpots = (guidesData.spots || {})[item.id] || [];
    const mapLineups = (guidesData.lineups || {})[item.id] || [];
    const lineupSpots = mapLineups.filter(l => Array.isArray(l.pos) && l.pos.length >= 2 && (l.video || (Array.isArray(l.videos) && l.videos.length))).map(l => ({
      id: 'lu-' + l.id,
      name: l.title || l.id,
      x: l.pos[0],
      y: l.pos[1],
      videos: Array.isArray(l.videos) ? l.videos : (l.video ? [l.video] : []),
    }));
    const spots = mapSpots.concat(lineupSpots);
    const spotBtns = [];
    const legendBtns = [];
    const spotBox = spots.length ? el('div', 'spot-video') : null;

    const stage = el('div', 'map-stage');
    const img = document.createElement('img');
    img.className = 'map-stage-img';
    img.setAttribute('src', item.radar ? ('/static/maps/' + item.radar) : (item.img || ('/static/maps/' + item.image)));
    img.setAttribute('alt', item.name);
    img.loading = 'lazy';
    stage.appendChild(img);
    view.appendChild(stage);

    function vUrl(v) { return typeof v === 'string' ? v : (v && v.url); }
    function vTitle(v) { return typeof v === 'string' ? null : (v && v.title); }

    function ytId(url) {
      const m = String(url || '').match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    }

    function spotMedia(v) {
      const url = vUrl(v);
      const id = ytId(url);
      if (id) {
        if (localVideoIds.has(id)) return nativeVideo(id);
        return ytOpenCard(id);
      }
      const video = document.createElement('video');
      video.className = 'spot-video-player';
      video.controls = true;
      video.preload = 'metadata';
      video.src = url;
      return video;
    }

    function spotThumb(v) {
      const url = vUrl(v);
      const th = el('div', 'spot-thumb');
      if (vTitle(v)) th.setAttribute('title', vTitle(v));
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      const id = ytId(url);
      if (id) img.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
      th.appendChild(img);
      th.appendChild(el('span', 'spot-thumb-play', '▶'));
      return th;
    }

    function renderSpotVideo(spot) {
      if (!spotBox) return;
      spotBox.innerHTML = '';
      if (!spot) {
        spotBox.appendChild(el('p', 'spot-empty', t('g_spot_hint')));
        return;
      }
      const videos = Array.isArray(spot.videos) ? spot.videos : (spot.video ? [spot.video] : []);

      const head = el('div', 'spot-video-head');
      head.appendChild(el('span', 'spot-pip'));
      head.appendChild(el('span', 'spot-name', spot.name));
      spotBox.appendChild(head);

      if (!videos.length) {
        spotBox.appendChild(el('p', 'section-text', t('g_spot_no_video')));
        return;
      }

      const count = videos.length > 1 ? el('span', 'spot-count', '1 / ' + videos.length) : null;
      if (count) head.appendChild(count);

      const playerBox = el('div', 'spot-player');
      spotBox.appendChild(playerBox);

      let idx = 0;
      let thumbs = null;

      function render() {
        playerBox.innerHTML = '';
        const v = videos[idx];
        const m = spotMedia(v);
        if (m) playerBox.appendChild(m);
        const title = vTitle(v);
        if (title) playerBox.appendChild(el('div', 'spot-caption', title));
        const o = el('a', 'spot-open', t('g_spot_open'));
        const url = vUrl(v);
        o.href = url;
        o.target = '_blank';
        o.rel = 'noopener';
        o.addEventListener('click', (e) => {
          e.preventDefault();
          const tg = window.Telegram && window.Telegram.WebApp;
          if (tg && tg.openLink) tg.openLink(url);
          else window.open(url, '_blank');
        });
        playerBox.appendChild(o);
        if (count) count.textContent = (idx + 1) + ' / ' + videos.length;
        if (thumbs) thumbs.querySelectorAll('.spot-thumb').forEach((th, i) => th.classList.toggle('active', i === idx));
      }

      if (videos.length > 1) {
        const nav = el('div', 'spot-nav');
        const prev = el('button', 'spot-arrow');
        prev.setAttribute('aria-label', t('back'));
        prev.textContent = '‹';
        const next = el('button', 'spot-arrow');
        next.setAttribute('aria-label', t('g_spot_next'));
        next.textContent = '›';
        thumbs = el('div', 'spot-thumbs');
        videos.forEach((u, i) => {
          const th = spotThumb(u);
          th.addEventListener('click', () => { idx = i; render(); });
          thumbs.appendChild(th);
        });
        prev.addEventListener('click', () => { idx = (idx - 1 + videos.length) % videos.length; render(); });
        next.addEventListener('click', () => { idx = (idx + 1) % videos.length; render(); });
        nav.appendChild(prev);
        nav.appendChild(thumbs);
        nav.appendChild(next);
        spotBox.appendChild(nav);
      }

      render();
    }

    function selectSpot(id) {
      activeSpotId = id;
      spotBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.id === activeSpotId));
      legendBtns.forEach(lb => lb.classList.toggle('active', lb.dataset.id === activeSpotId));
      renderSpotVideo(spots.find(sp => sp.id === activeSpotId) || null);
      if (activeSpotId && spotBox) spotBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    spots.forEach((s) => {
      const b = el('button', 'spot-btn' + (activeSpotId === s.id ? ' active' : ''));
      b.dataset.id = s.id;
      b.style.left = s.x + '%';
      b.style.top = s.y + '%';
      b.setAttribute('aria-label', s.name);
      const core = el('span', 'spot-core');
      const lbl = el('span', 'spot-lbl', s.name);
      b.appendChild(core);
      b.appendChild(lbl);
      b.addEventListener('click', () => selectSpot(activeSpotId === s.id ? null : s.id));
      stage.appendChild(b);
      spotBtns.push(b);
    });

    if (spots.length) {
      const legend = el('div', 'spot-legend');
      spots.forEach(s => {
        const lb = el('button', 'spot-legend-btn' + (activeSpotId === s.id ? ' active' : ''));
        lb.dataset.id = s.id;
        lb.appendChild(el('span', 'spot-legend-dot'));
        lb.appendChild(el('span', 'spot-legend-name', s.name));
        lb.addEventListener('click', () => selectSpot(activeSpotId === s.id ? null : s.id));
        legend.appendChild(lb);
        legendBtns.push(lb);
      });
      view.appendChild(legend);
    }

    if (spotBox) view.appendChild(spotBox);
    renderSpotVideo(spots.find(sp => sp.id === activeSpotId) || null);
  }

  function guideTypeLabel(id) {
    if (id === 'all') return t('g_type_all');
    const gt = GUIDE_TYPES[id];
    if (gt) return t(gt.key);
    const tdata = guidesData && guidesData.types ? guidesData.types[id] : null;
    return tdata && tdata.label ? tdata.label : id;
  }

  function guideTypeCls(id) {
    const gt = GUIDE_TYPES[id];
    return gt ? gt.cls : 'lt-smoke';
  }

  function guideTypeEmoji(id) {
    const gt = GUIDE_TYPES[id];
    return gt ? gt.emoji : '💣';
  }

  function gStepCount(steps) {
    const n = (steps || []).length;
    if (lang === 'en') return n + (n === 1 ? ' step' : ' steps');
    const d10 = n % 10, d100 = n % 100;
    let p;
    if (d10 === 1 && d100 !== 11) p = 'шаг';
    else if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) p = 'шага';
    else p = 'шагов';
    return n + ' ' + p;
  }

  function gLineupRow(l, onClick) {
    const row = el('div', 'g-row');
    row.appendChild(el('span', 'l-badge ' + guideTypeCls(l.type), guideTypeEmoji(l.type)));
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', l.title));
    info.appendChild(el('div', 'player-meta', gStepCount(l.steps)));
    row.appendChild(info);
    row.appendChild(el('span', 'g-chev', '›'));
    row.addEventListener('click', onClick);
    return row;
  }

  function gOpenUrl(url) {
    if (tg && tg.openLink) { tg.openLink(url, { try_instant_view: false }); return; }
    window.open(url, '_blank');
  }

  function gYTId(url) {
    return String(url || '').match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/)?.[1] || null;
  }

  const localVideoIds = new Set();
  fetch('/api/videos/list').then(r => r.json()).then(d => {
    if (d && d.ok) (d.ids || []).forEach(i => localVideoIds.add(i));
  }).catch(() => {});

  function nativeVideo(id) {
    const v = document.createElement('video');
    v.className = 'spot-video-player';
    v.controls = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'auto';
    v.poster = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
    v.src = '/static/videos/' + id + '.mp4';
    return v;
  }

  function gMedia(url) {
    if (!url) return null;
    const id = gYTId(url);
    if (id) {
      if (localVideoIds.has(id)) return nativeVideo(id);
      return ytOpenCard(id);
    }
    const video = document.createElement('video');
    video.className = 'spot-video-player';
    video.controls = true;
    video.preload = 'metadata';
    video.src = url;
    return video;
  }

  function ytOpenCard(id) {
    const url = 'https://www.youtube.com/shorts/' + id;
    const wrap = el('div', 'yt-open-wrap');
    const box = el('div', 'yt-open-card yt-open-direct');
    box.style.aspectRatio = '16 / 9';
    box.style.maxHeight = '74vh';
    box.style.cursor = 'pointer';
    const img = document.createElement('img');
    img.loading = 'eager';
    img.decoding = 'async';
    img.alt = 'YouTube';
    img.src = 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg';
    const play = el('div', 'yt-open-play');
    play.appendChild(el('span', null, '▶'));
    box.appendChild(img);
    box.appendChild(play);
    box.appendChild(el('div', 'yt-open-cap', lang === 'ru' ? 'Смотреть в приложении' : 'Play here'));
    box.addEventListener('click', () => {
      haptic('light');
      box.dataset.live = '1';
      box.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      box.appendChild(iframe);
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    const foot = el('a', 'yt-open-fallback', lang === 'ru' ? 'Не грузится? Открыть на YouTube ↗' : 'Not loading? Open on YouTube ↗');
    foot.href = url;
    foot.addEventListener('click', (e) => { e.preventDefault(); gOpenUrl(url); });
    wrap.appendChild(box);
    wrap.appendChild(foot);
    return wrap;
  }

  function gSteps(steps) {
    const wrap = el('div', 'g-steps-wrap');
    wrap.appendChild(el('div', 'g-steps-title', t('g_steps')));
    const ol = el('ol', 'g-steps');
    steps.forEach(s => ol.appendChild(el('li', 'g-step', s)));
    wrap.appendChild(ol);
    return wrap;
  }

  function gMiniRadar(map, l) {
    if (!l.pos || !l.pos.length) return null;
    const stage = el('div', 'map-stage mini');
    const img = document.createElement('img');
    img.className = 'map-stage-img';
    img.setAttribute('src', map.radar ? ('/static/maps/' + map.radar) : ('/static/maps/' + map.image));
    img.setAttribute('alt', map.name);
    img.loading = 'lazy';
    stage.appendChild(img);
    const mk = el('span', 'map-dot active ' + guideTypeCls(l.type));
    mk.style.left = l.pos[0] + '%';
    mk.style.top = l.pos[1] + '%';
    stage.appendChild(mk);
    return stage;
  }

  function renderLineupDetail(item, l) {
    clear();
    view.appendChild(gBackBtn(() => renderMap(currentMap)));
    const title = el('div', 'l-title');
    title.appendChild(el('span', 'l-badge ' + guideTypeCls(l.type), guideTypeLabel(l.type)));
    title.appendChild(el('span', 'l-name', l.title));
    view.appendChild(title);
    const mini = gMiniRadar(item, l);
    if (mini) view.appendChild(mini);
    const luVideos = Array.isArray(l.videos) ? l.videos : (l.video ? [l.video] : []);
    if (luVideos.length) {
      const wrap = el('div', 'spot-video');
      luVideos.forEach(v => {
        const url = typeof v === 'string' ? v : (v && v.url);
        const m = gMedia(url);
        if (m) wrap.appendChild(m);
      });
      view.appendChild(wrap);
    }
    view.appendChild(gSteps(l.steps));
  }

  const ROLE_COLORS = { entry: '#ff6b5e', support: '#5ec8ff', awp: '#ffd166', lurker: '#b18cff', rifler: '#6ee7b7', anchor: '#ff9f6b', rotator: '#7ee8a0' };

  function roleColor(r) { return ROLE_COLORS[r] || '#9aa0b5'; }
  function roleEmoji(r) { const d = (guidesData.roles || {})[r]; return d ? d.emoji : ''; }
  function roleRu(r) { const d = (guidesData.roles || {})[r]; return d ? (d.ru || r) : r; }
  function diffBadge(tc) { const n = tc.difficulty || 0; let s = ''; for (let i = 1; i <= 3; i++) s += (i <= n ? '●' : '○'); return s; }
  function diffName(tc) { const d = (guidesData.difficulty || {})[tc.difficulty]; return d ? (lang === 'en' ? d.en : d.ru) : ''; }
  function posOf(id, item) { const m = (guidesData.positions || {})[item.id] || {}; return m[id] || null; }
  function spotName(item, id) { const sp = (guidesData.spots || {})[item.id] || []; const f = sp.find(s => s.id === id); return f ? f.name : null; }
  function spotExists(item, id) { return ((guidesData.spots || {})[item.id] || []).some(s => s.id === id); }

  function glossHtml(item, text) {
    const m = (guidesData.terms || {})[item.id] || {};
    const keys = Object.keys(m);
    let out = String(text);
    keys.forEach(k => {
      if (out.indexOf('<span class="g-term"') !== -1 && out.indexOf('>' + k + '<') !== -1) return;
      const re = new RegExp('(?<![a-zа-яё])(' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![a-zа-яё])', 'gi');
      out = out.replace(re, '<span class="g-term" data-term="' + k + '">$1</span>');
    });
    return out;
  }

  function bindGloss(root, item) {
    root.querySelectorAll('.g-term').forEach(sp => sp.addEventListener('click', () => showTermPop(item, sp.dataset.term)));
  }

  function removeTermPop() { const p = view.querySelector('.g-term-pop'); if (p) p.remove(); }

  function showTermPop(item, key) {
    const m = (guidesData.terms || {})[item.id] || {};
    const data = m[key];
    if (!data) return;
    removeTermPop();
    const pop = el('div', 'g-term-pop');
    const head = el('div', 'g-term-pop-head');
    head.appendChild(el('span', 'g-term-pop-name', data.name || key));
    const close = el('button', 'g-term-pop-close', '✕');
    close.addEventListener('click', removeTermPop);
    head.appendChild(close);
    pop.appendChild(head);
    if (data.desc) pop.appendChild(el('div', 'g-term-pop-desc', data.desc));
    if (data.pos) {
      const p = posOf(data.pos, item);
      if (p) {
        const stage = el('div', 'map-stage mini');
        const img = document.createElement('img');
        img.className = 'map-stage-img';
        img.setAttribute('src', item.radar ? ('/static/maps/' + item.radar) : ('/static/maps/' + item.image));
        img.setAttribute('alt', item.name);
        img.loading = 'lazy';
        stage.appendChild(img);
        const mk = el('span', 'map-dot active');
        mk.style.left = p[0] + '%';
        mk.style.top = p[1] + '%';
        stage.appendChild(mk);
        pop.appendChild(stage);
      }
    }
    pop.addEventListener('click', (e) => { if (e.target === pop) removeTermPop(); });
    view.appendChild(pop);
  }

  function tacticRadar(item, marks) {
    const svgns = 'http://www.w3.org/2000/svg';
    const stage = el('div', 'map-stage t-radar');
    const img = document.createElement('img');
    img.className = 'map-stage-img';
    img.setAttribute('src', item.radar ? ('/static/maps/' + item.radar) : ('/static/maps/' + item.image));
    img.setAttribute('alt', item.name);
    img.loading = 'lazy';
    stage.appendChild(img);

    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('class', 't-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    function arrowMarker(color) {
      const id = 'ah' + color.replace('#', '');
      if (svg.querySelector('#' + id)) return id;
      const marker = document.createElementNS(svgns, 'marker');
      marker.setAttribute('id', id);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '5');
      marker.setAttribute('markerHeight', '5');
      marker.setAttribute('orient', 'auto-start-reverse');
      const path = document.createElementNS(svgns, 'path');
      path.setAttribute('d', 'M0,0 L10,5 L0,10 z');
      path.setAttribute('fill', color);
      marker.appendChild(path);
      svg.appendChild(marker);
      return id;
    }

    marks.forEach(mk => {
      if (mk.from && mk.to && mk.from !== mk.to) {
        const a = posOf(mk.from, item), b = posOf(mk.to, item);
        if (a && b) {
          const line = document.createElementNS(svgns, 'line');
          line.setAttribute('x1', a[0]); line.setAttribute('y1', a[1]);
          line.setAttribute('x2', b[0]); line.setAttribute('y2', b[1]);
          line.setAttribute('class', 't-arrow-line' + (mk.active ? ' active' : ''));
          const color = mk.role ? roleColor(mk.role) : '#ffd166';
          line.setAttribute('stroke', color);
          line.setAttribute('marker-end', 'url(#' + arrowMarker(color) + ')');
          svg.appendChild(line);
        }
      }
    });
    stage.appendChild(svg);

    marks.forEach(mk => {
      const p = posOf(mk.pos, item);
      if (!p) return;
      const dot = el('button', 't-dot' + (mk.active ? ' active' : ''));
      dot.dataset.pos = mk.pos;
      dot.style.left = p[0] + '%';
      dot.style.top = p[1] + '%';
      if (mk.role) dot.style.background = roleColor(mk.role);
      if (mk.util && mk.util.length) dot.appendChild(el('span', 't-dot-util', guideTypeEmoji(mk.util[0].type)));
      if (mk.active) dot.appendChild(el('span', 't-dot-pulse'));
      if (mk.onClick) dot.addEventListener('click', mk.onClick);
      stage.appendChild(dot);
    });
    return stage;
  }

  function utilChips(item, step, onOpen) {
    const chips = el('span', 'g-util-chips');
    (step.util || []).forEach(u => {
      const c = el('button', 'g-util ' + guideTypeCls(u.type));
      c.textContent = guideTypeEmoji(u.type);
      const hasVideo = u.pos && spotExists(item, u.pos);
      c.title = guideTypeLabel(u.type) + (hasVideo ? ' · ' + t('g_util_video') : (u.pos && posOf(u.pos, item) ? ' · ' + t('g_spot_no_video') : ''));
      c.addEventListener('click', (e) => { e.stopPropagation(); if (onOpen) onOpen(u, hasVideo); });
      chips.appendChild(c);
    });
    return chips;
  }

  function flatSteps(tc) {
    const out = [];
    tacticPhases(tc).forEach((ph, i) => {
      (ph.steps || []).forEach(s => out.push({ phase: i, phaseName: ph.name, step: s }));
    });
    return out;
  }

  function openSpotVideo(item, posId) {
    if (!posId || !spotExists(item, posId)) return;
    activeSpotId = posId;
    renderMap(item);
  }

  let activeRafId = null;
  function raf(fn) {
    if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(fn);
    return setInterval(function () { fn(performance.now()); }, 33);
  }
  function caf(id) {
    if (id == null) return;
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id);
    else clearInterval(id);
  }
  function stopActiveRaf() { if (activeRafId != null) { caf(activeRafId); activeRafId = null; } }

  function renderTacticDetail(item, tc, back, ctx) {
    clear();
    view.appendChild(gBackBtn(back || (() => renderMap(currentMap))));

    const head = el('div', 'tactic-head');
    const title = el('div', 'tactic-title');
    title.textContent = tc.title;
    head.appendChild(title);
    const chips = el('div', 'tactic-chips');
    if (ctx && ctx.side) chips.appendChild(el('span', 't-chip ' + (ctx.side === 't' ? 'side-t' : 'side-ct'), (ctx.side === 't' ? 'T' : 'CT') + ' · ' + t(ctx.side === 't' ? 'g_side_t' : 'g_side_ct')));
    if (ctx && ctx.round) chips.appendChild(el('span', 't-chip', roundLabel(ctx.round)));
    if (tc.difficulty) chips.appendChild(el('span', 't-chip t-diff', diffBadge(tc) + ' ' + diffName(tc)));
    if (item && item.name) chips.appendChild(el('span', 't-chip t-chip-map', (item.emoji || '') + ' ' + item.name));
    head.appendChild(chips);
    view.appendChild(head);

    const modes = [['replay', t('g_mode_replay')], ['plan', t('g_mode_plan')], ['tldr', t('g_mode_tldr')]];
    const tabRow = el('div', 't-mode-tabs');
    view.appendChild(tabRow);
    const body = el('div', 't-mode-body');
    view.appendChild(body);

    function renderMode(mode) {
      stopActiveRaf();
      body.innerHTML = '';
      tabRow.querySelectorAll('.t-mode-tab').forEach(b => b.classList.remove('active'));
      const active = Array.from(tabRow.children).find(b => b.dataset.mode === mode);
      if (active) active.classList.add('active');
      if (mode === 'replay') renderReplay(body, item, tc);
      else if (mode === 'plan') renderPlan(body);
      else renderTldr(body);
    }

    modes.forEach(m => {
      const b = el('button', 't-mode-tab', m[1]);
      b.dataset.mode = m[0];
      b.addEventListener('click', () => renderMode(m[0]));
      tabRow.appendChild(b);
    });

    function renderTldr(root) {
      if (tc.short) root.appendChild(tacticBox('◎', t('g_essence'), tc.short, 't-essence'));
      const meta = el('div', 'tactic-meta-grid');
      if (tc.goal) meta.appendChild(tacticBox('🎯', t('g_goal'), tc.goal, 't-goal'));
      if (tc.buy) meta.appendChild(tacticBox('💰', t('g_buy'), tc.buy, 't-buy'));
      if (meta.children.length) root.appendChild(meta);
      const phases = tacticPhases(tc);
      const marks = [];
      phases.forEach(ph => (ph.steps || []).forEach(s => { if (s.pos) marks.push({ pos: s.pos, role: s.role, util: s.util }); }));
      if (marks.length) root.appendChild(tacticRadar(item, marks));
      const chipsWrap = el('div', 't-phase-chips');
      phases.forEach((ph, i) => {
        const c = el('div', 't-phase-chip');
        c.appendChild(el('span', 't-phase-chip-num', String(i + 1).padStart(2, '0')));
        c.appendChild(el('span', 't-phase-chip-name', ph.name));
        c.appendChild(el('span', 't-phase-chip-steps', String((ph.steps || []).length) + ' ⤷'));
        chipsWrap.appendChild(c);
      });
      if (chipsWrap.children.length) root.appendChild(chipsWrap);
    }

    function renderPlan(root) {
      if (tc.short) root.appendChild(tacticBox('◎', t('g_essence'), tc.short, 't-essence'));
      const meta = el('div', 'tactic-meta-grid');
      if (tc.goal) meta.appendChild(tacticBox('🎯', t('g_goal'), tc.goal, 't-goal'));
      if (tc.buy) meta.appendChild(tacticBox('💰', t('g_buy'), tc.buy, 't-buy'));
      if (meta.children.length) root.appendChild(meta);
      const phases = tacticPhases(tc);
      const marks = [];
      phases.forEach(ph => (ph.steps || []).forEach(s => { if (s.pos) marks.push({ pos: s.pos, role: s.role, from: s.from, to: s.to, util: s.util }); }));
      if (marks.length) root.appendChild(tacticRadar(item, marks));
      const wrap = el('div', 'g-phases');
      phases.forEach((ph, i) => {
        const block = el('div', 'g-phase');
        const head = el('div', 'g-phase-head');
        head.appendChild(el('span', 'g-phase-num', String(i + 1).padStart(2, '0')));
        head.appendChild(el('span', 'g-phase-name', ph.name));
        const times = (ph.steps || []).map(s => s.time).filter(x => x != null);
        if (times.length) head.appendChild(el('span', 'g-phase-time', '⏱ ' + Math.min.apply(null, times) + '–' + Math.max.apply(null, times) + 'с'));
        block.appendChild(head);
        const ol = el('ol', 'g-steps');
        (ph.steps || []).forEach(s => {
          const li = el('li', 'g-step');
          const txt = el('div', 'g-step-text');
          txt.innerHTML = glossHtml(item, s.text);
          bindGloss(txt, item);
          li.appendChild(txt);
          const badges = el('div', 'g-step-badges');
          if (s.role) badges.appendChild(el('span', 'g-role-badge', (roleEmoji(s.role) || '') + ' ' + roleRu(s.role)));
          if (s.time != null) badges.appendChild(el('span', 'g-time-badge', '⏱ ' + s.time + 'с'));
          if (s.util && s.util.length) {
            s.util.forEach(u => {
              const c = el('button', 'g-util ' + guideTypeCls(u.type));
              c.textContent = guideTypeEmoji(u.type) + ' ' + guideTypeLabel(u.type);
              c.addEventListener('click', () => { if (u.pos) openSpotVideo(item, u.pos); });
              badges.appendChild(c);
            });
          }          if (badges.children.length) li.appendChild(badges);
          ol.appendChild(li);
        });
        block.appendChild(ol);
        wrap.appendChild(block);
      });
      root.appendChild(wrap);
    }

    renderMode('replay');
  }

  function renderReplay(body, item, tc) {
    const svgns = 'http://www.w3.org/2000/svg';
    const flat = flatSteps(tc);
    let prevT = 0;
    flat.forEach(f => {
      if (f.step.time == null) f.step.time = prevT + 3;
      prevT = f.step.time;
    });
    const maxT = Math.max(115, prevT + 5);

    const tracks = {};
    const order = [];
    const events = [];
    function trk(name) {
      if (!tracks[name]) { tracks[name] = []; order.push(name); }
      return tracks[name];
    }
    function addKf(name, kf) {
      if (!kf.pos) return;
      const a = tracks[name];
      const last = a[a.length - 1];
      if (last && last.time === kf.time && last.pos[0] === kf.pos[0] && last.pos[1] === kf.pos[1]) return;
      a.push(kf);
    }
    flat.forEach(f => {
      const s = f.step;
      const t = s.time;
      const name = s.role || '__team';
      const list = trk(name);
      if (s.from && s.to) {
        const startT = list.length ? list[list.length - 1].time : Math.max(0, t - 5);
        addKf(name, { time: startT, pos: posOf(s.from, item) });
        addKf(name, { time: t, pos: posOf(s.to, item) });
      } else if (s.pos) {
        addKf(name, { time: t, pos: posOf(s.pos, item) });
      }
      (s.util || []).forEach(u => {
        const tp = posOf(u.pos, item);
        if (tp) events.push({ time: t, type: u.type, target: tp, track: name });
      });
    });
    events.sort((a, b) => a.time - b.time);

    function trackPosAt(name, t) {
      const kfs = tracks[name];
      if (!kfs || !kfs.length) return null;
      if (t < kfs[0].time) return null;
      if (t >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].pos;
      for (let i = 0; i < kfs.length - 1; i++) {
        const a = kfs[i], b = kfs[i + 1];
        if (t <= b.time) {
          const span = Math.max(0.0001, b.time - a.time);
          const k = Math.min(1, Math.max(0, (t - a.time) / span));
          const e = k * k * (3 - 2 * k);
          return [a.pos[0] + (b.pos[0] - a.pos[0]) * e, a.pos[1] + (b.pos[1] - a.pos[1]) * e];
        }
      }
      return kfs[kfs.length - 1].pos;
    }

    body.appendChild(el('p', 'section-text', t('g_replay_hint')));

    const stage = el('div', 'map-stage t-radar t-replay-stage');
    const img = document.createElement('img');
    img.className = 'map-stage-img';
    img.setAttribute('src', item.radar ? ('/static/maps/' + item.radar) : ('/static/maps/' + item.image));
    img.setAttribute('alt', item.name);
    img.loading = 'lazy';
    stage.appendChild(img);
    body.appendChild(stage);

    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('class', 't-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    stage.appendChild(svg);

    order.forEach(name => {
      const kfs = tracks[name];
      if (kfs.length < 2) return;
      const pts = kfs.map(k => k.pos[0] + ',' + k.pos[1]).join(' ');
      const poly = document.createElementNS(svgns, 'polyline');
      poly.setAttribute('class', 't-path');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', name === '__team' ? '#cbd5e1' : roleColor(name));
      svg.appendChild(poly);
    });

    const markers = {};
    order.forEach(name => {
      const mk = el('span', 't-ply' + (name === '__team' ? ' team' : '') + (name !== '__team' ? ' r-' + name : ''));
      mk.style.background = name === '__team' ? '#cbd5e1' : roleColor(name);
      mk.textContent = name === '__team' ? '⚑' : (roleEmoji(name) || '•');
      mk.style.display = 'none';
      stage.appendChild(mk);
      markers[name] = mk;
    });

    function trackColor(name) { return name === '__team' ? '#cbd5e1' : roleColor(name); }

    function spawnBurst(ev) {
      const from = trackPosAt(ev.track, ev.time);
      if (from && from[0] !== ev.target[0] || from && from[1] !== ev.target[1]) {
        const arc = document.createElementNS(svgns, 'path');
        const cx = (from[0] + ev.target[0]) / 2;
        const cy = Math.min(from[1], ev.target[1]) - 14;
        arc.setAttribute('d', 'M' + from[0] + ',' + from[1] + ' Q' + cx + ',' + cy + ' ' + ev.target[0] + ',' + ev.target[1]);
        arc.setAttribute('class', 't-arc');
        arc.setAttribute('stroke', trackColor(ev.track));
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke-dasharray', '120');
        svg.appendChild(arc);
        setTimeout(() => { if (arc.isConnected) arc.remove(); }, 800);
      }
      const burst = el('span', 't-burst');
      burst.style.left = ev.target[0] + '%';
      burst.style.top = ev.target[1] + '%';
      const ring = el('span', 't-burst-ring');
      burst.appendChild(ring);
      burst.appendChild(el('span', 't-burst-ico', guideTypeEmoji(ev.type)));
      stage.appendChild(burst);
      setTimeout(() => { if (burst.isConnected) burst.remove(); }, 1000);
    }

    const tl = el('div', 't-tl');
    const bar = el('div', 't-tl-bar');
    const track = el('div', 't-tl-track');
    const fill = el('div', 't-tl-fill');
    track.appendChild(fill);
    bar.appendChild(track);
    const head = el('div', 't-tl-playhead');
    bar.appendChild(head);
    flat.forEach(f => {
      const dt = el('button', 't-tl-dot');
      dt.dataset.time = String(f.step.time);
      dt.style.left = (f.step.time / maxT * 100) + '%';
      dt.addEventListener('click', (e) => { e.stopPropagation(); seek(Number(dt.dataset.time)); });
      bar.appendChild(dt);
    });
    [0, 20, 40, 60, 80, 100, 115].forEach(v => {
      if (v > maxT) return;
      const tk = el('span', 't-tl-tick', v === 115 ? '115' : String(v));
      tk.style.left = (v / maxT * 100) + '%';
      bar.appendChild(tk);
    });
    bar.addEventListener('click', (e) => {
      const r = bar.getBoundingClientRect();
      seek(((e.clientX - r.left) / r.width) * maxT);
    });
    tl.appendChild(bar);
    body.appendChild(tl);

    const controls = el('div', 't-r-controls');
    const playBtn = el('button', 't-r-btn t-r-play', '▶ ' + t('g_replay_play'));
    const restartBtn = el('button', 't-r-btn', '⟲ ' + t('g_replay_restart'));
    const speedBtn = el('button', 't-r-btn', t('g_replay_speed') + ' ×1');
    const timeLbl = el('span', 't-r-time', '0с');
    controls.appendChild(restartBtn);
    controls.appendChild(playBtn);
    controls.appendChild(speedBtn);
    controls.appendChild(timeLbl);
    body.appendChild(controls);

    const stepsBox = el('div', 't-r-steps');
    body.appendChild(stepsBox);
    const stepEls = [];
    flat.forEach((f, i) => {
      const s = f.step;
      const row = el('div', 't-r-step');
      if (s.time != null) row.appendChild(el('span', 't-r-step-time', String(s.time) + 'с'));
      const inner = el('div', 't-r-step-inner');
      const txt = el('div', 'g-step-text');
      txt.innerHTML = glossHtml(item, s.text);
      bindGloss(txt, item);
      inner.appendChild(txt);
      const badges = el('div', 'g-step-badges');
      if (s.role) badges.appendChild(el('span', 'g-role-badge', (roleEmoji(s.role) || '') + ' ' + roleRu(s.role)));
      if (s.util && s.util.length) {
        s.util.forEach(u => {
          const c = el('button', 'g-util ' + guideTypeCls(u.type));
          c.textContent = guideTypeEmoji(u.type) + ' ' + guideTypeLabel(u.type);
          c.addEventListener('click', () => { if (u.pos) openSpotVideo(item, u.pos); });
          badges.appendChild(c);
        });
      }
      if (badges.children.length) inner.appendChild(badges);
      row.appendChild(inner);
      row.appendChild(el('span', 't-r-step-phase', String(f.phase + 1) + ' · ' + f.phaseName));
      stepsBox.appendChild(row);
      stepEls.push(row);
    });

    let cur = 0, playing = false, speed = 1, evPtr = 0, lastTs = null;
    let lastRendered = 0;

    function resetBursts() {
      evPtr = 0;
      stage.querySelectorAll('.t-burst, .t-arc').forEach(n => n.remove());
    }

    function seek(t) {
      cur = Math.min(maxT, Math.max(0, t));
      if (cur < lastRendered - 0.1) resetBursts();
      renderFrame(cur);
      lastRendered = cur;
    }

    function updatePlayBtn() {
      playBtn.textContent = (playing ? '❚❚ ' : '▶ ') + t(playing ? 'g_replay_pause' : 'g_replay_play');
    }

    playBtn.addEventListener('click', () => {
      if (!playing && cur >= maxT) { cur = 0; resetBursts(); }
      playing = !playing;
      lastTs = null;
      updatePlayBtn();
    });
    restartBtn.addEventListener('click', () => { playing = false; updatePlayBtn(); cur = 0; resetBursts(); renderFrame(0); lastRendered = 0; });
    let speedIdx = 0;
    const speeds = [1, 2, 0.5];
    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      speed = speeds[speedIdx];
      speedBtn.textContent = t('g_replay_speed') + ' ×' + speed;
    });

    function renderFrame(t) {
      order.forEach(name => {
        const p = trackPosAt(name, t);
        const mk = markers[name];
        if (!p) { mk.style.display = 'none'; return; }
        mk.style.display = '';
        mk.style.left = p[0] + '%';
        mk.style.top = p[1] + '%';
      });
      fill.style.width = (t / maxT * 100) + '%';
      head.style.left = (t / maxT * 100) + '%';
      timeLbl.textContent = Math.round(t) + 'с';
      while (evPtr < events.length && events[evPtr].time <= t) { spawnBurst(events[evPtr]); evPtr++; }
      const curIdx = flat.reduce((acc, f, i) => (f.step.time <= t ? i : acc), -1);
      stepEls.forEach((r, i) => {
        const on = i === curIdx;
        r.classList.toggle('active', on);
        if (on && !r._scrolled) {
          r._scrolled = true;
          if (typeof r.scrollIntoView === 'function') r.scrollIntoView({ block: 'nearest' });
        }
        if (!on) r._scrolled = false;
      });
    }

    function loop(ts) {
      if (!body.isConnected) return;
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (playing) {
        cur += dt * speed;
        if (cur >= maxT) { cur = maxT; playing = false; updatePlayBtn(); }
        renderFrame(cur);
        lastRendered = cur;
      }
      activeRafId = raf(loop);
    }

    renderFrame(0);
    stopActiveRaf();
    activeRafId = raf(loop);
  }


  async function loadLearn() {
    if (learnCache) return learnCache;
    const [contentRes, progressRes] = await Promise.all([
      api.get('/api/content'),
      api.get('/api/progress')
    ]);
    if (!contentRes.ok || !progressRes.ok) throw new Error('learn load failed');
    learnCache = {
      lessons: contentRes.lessons || [],
      cards: contentRes.cards || [],
      quizzes: contentRes.quizzes || [],
      progress: progressRes.progress || {}
    };
    return learnCache;
  }

  function progressStat(label, done, total, icon) {
    const card = el('div', 'prog-stat');
    card.appendChild(iconEl(icon));
    const info = el('div', 'prog-info');
    info.appendChild(el('div', 'prog-label', label));
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    info.appendChild(el('div', 'prog-meta', pct + '%'));
    const bar = el('div', 'prog-bar');
    const fill = el('div', 'prog-fill');
    fill.style.width = pct + '%';
    bar.appendChild(fill);
    card.appendChild(info);
    card.appendChild(bar);
    return card;
  }

  async function renderHome() {
    if (loading) return;
    loading = true;
    try {
    clear();
    const name = currentUser ? currentUser.first_name : t('user');
    const hero = el('div', 't-hero home-hero');
    const AVATAR_ICONS = {
      avatar_rifler: '🔫', avatar_awper: '🎯', avatar_grenadier: '💣',
      avatar_phantom: '👽', avatar_eagle: '🦅', avatar_flame: '🔥'
    };
    const myAvatar = (profileCache && profileCache.equipped_avatar && AVATAR_ICONS[profileCache.equipped_avatar]) || null;
    const myBadge = profileCache && profileCache.equipped_badge ? profileCache.equipped_badge : null;
    const BADGE_ICONS = { badge_win10: '🥈', badge_clutch: '👑', badge_god: '😈' };
    const ava = el('div', 'avatar hero-logo');
    ava.appendChild(el('span', null, myAvatar || name.charAt(0).toUpperCase()));
    hero.appendChild(ava);
    const hinfo = el('div', 't-hinfo');
    hinfo.appendChild(el('div', 't-name', t('h_welcome').replace('{0}', name) + (myBadge && BADGE_ICONS[myBadge] ? ' ' + BADGE_ICONS[myBadge] : '')));
    hinfo.appendChild(el('div', 't-meta', t('h_sub')));
    hero.appendChild(hinfo);
    view.appendChild(hero);

    try {
      const profile = profileCache || {};
      if (profile.level || profile.xp) {
        view.appendChild(sectionTitle('bolt', t('g_profile') || 'Profile'));
        const pGrid = el('div', 'prog-grid');
        pGrid.appendChild(progressStat('XP', profile.xp || 0, (profile.level || 1) * 100, 'bolt'));
        pGrid.appendChild(progressStat(t('g_level') || 'Level', profile.level || 1, 99, 'trophy'));
        pGrid.appendChild(progressStat('Coins', profile.coins || 0, 9999, 'bolt'));
        view.appendChild(pGrid);
        if (profile.streak > 0) {
          view.appendChild(el('p', 'muted-note', (profile.streak) + ' ' + (t('g_streak') || 'day streak') + ' 🔥'));
        }
      }
    } catch (e) {}

    try {
      const data = await loadLearn();
      const p = data.progress;
      view.appendChild(sectionTitle('bolt', t('h_progress')));
      const stats = el('div', 'prog-grid');
      stats.appendChild(progressStat(t('h_lessons'), p.lessons_done || 0, p.lessons_total || 0, 'learn'));
      stats.appendChild(progressStat(t('h_cards'), p.cards_known || 0, p.cards_total || 0, 'cards'));
      stats.appendChild(progressStat(t('h_quizzes'), p.quizzes_taken || 0, (data.quizzes || []).length, 'quiz'));
      view.appendChild(stats);
      if (p.best_score != null) {
        view.appendChild(el('p', 'muted-note', t('h_best').replace('{0}', p.best_score)));
      }
    } catch (e) {
      view.appendChild(el('p', 'section-text', t('load_fail')));
    }

    try {
      const lbRes = await api.get('/api/leaderboard');
      if (lbRes.ok && lbRes.leaderboard && lbRes.leaderboard.leaders && lbRes.leaderboard.leaders.length) {
        view.appendChild(sectionTitle('trophy', t('lb_title') || 'Leaderboard'));
        const lbList = el('div', 'g-list');
        lbRes.leaderboard.leaders.slice(0, 10).forEach(entry => {
          const row = el('div', 'g-row');
          const rankText = entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] : '#' + entry.rank;
          row.appendChild(el('div', 'g-ico', rankText));
          const info = el('div', 'player-info');
          info.appendChild(el('div', 'player-nick' + (entry.is_me ? ' highlight' : ''),
            'User #' + entry.user_id));
          const meta = el('div', 'player-meta');
          meta.appendChild(el('span', null, 'Lv.' + entry.level + ' · ' + entry.xp + ' XP'));
          if (entry.streak > 1) meta.appendChild(el('span', null, '🔥' + entry.streak));
          info.appendChild(meta);
          row.appendChild(info);
          lbList.appendChild(row);
        });
        view.appendChild(lbList);
        if (lbRes.leaderboard.user_rank && lbRes.leaderboard.user_rank > 10) {
          view.appendChild(el('p', 'muted-note', t('lb_your_rank') || ('Your rank: #' + lbRes.leaderboard.user_rank)));
        }
      }
    } catch (e) {}

    try {
      const achRes = await api.get('/api/achievements');
      if (achRes.ok && achRes.achievements) {
        const profile = profileCache || {};
        const earned = new Set(profile.achievements || []);
        const allAch = achRes.achievements;
        const achIds = Object.keys(allAch);
        const earnedCount = achIds.filter(id => earned.has(id)).length;
        if (achIds.length > 0) {
          view.appendChild(sectionTitle('trophy', t('g_achievements') || 'Achievements'));
          view.appendChild(el('p', 'muted-note', t('g_ach_count').replace('{0}', earnedCount).replace('{1}', achIds.length)));
          const achGrid = el('div', 'ach-grid');
          achIds.forEach(id => {
            const a = allAch[id];
            const unlocked = earned.has(id);
            const card = el('div', 'ach-card' + (unlocked ? ' unlocked' : ''));
            card.appendChild(el('div', 'ach-icon', unlocked ? a.icon : '🔒'));
            card.appendChild(el('div', 'ach-name', lang === 'ru' ? a.name_ru : a.name));
            achGrid.appendChild(card);
          });
          view.appendChild(achGrid);
        }
      }
    } catch (e) {}

    view.appendChild(sectionTitle('bolt', t('h_continue')));
    const actions = el('div', 'home-actions');
    actions.appendChild(pickCard('learn', t('h_learn'), t('h_learn_sub'), () => switchTab('learn')));
    actions.appendChild(pickCard('guides', t('h_maps'), t('h_maps_sub'), () => switchTab('guides')));
    actions.appendChild(pickCard('stats', t('h_stats'), t('h_stats_sub'), () => switchTab('stats')));
    actions.appendChild(pickCard('trophy', t('h_challenge'), t('h_challenge_sub'), () => renderChallenges()));
    actions.appendChild(pickCard('stats', t('h_friends'), t('h_friends_sub'), () => renderFriends()));
    actions.appendChild(pickCard('bolt', t('shop_title'), (profileCache ? profileCache.coins : 0) + ' 🪙 — ' + (t('shop_tab') || 'Shop'), () => renderShop()));
    view.appendChild(actions);

    currentPage = () => renderHome();
    } finally { loading = false; }
  }

  async function renderLearn() {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('learn', t('tab_learn')));
    const box = el('div', 'sub-box');
    view.appendChild(box);
    const skeleton = addSkeleton(box, 4);
    try {
      const data = await loadLearn();
      skeleton.remove();
      const lessons = data.lessons || [];
      const cards = data.cards || [];
      const quizzes = data.quizzes || [];
      const p = data.progress || {};
      const doneSet = new Set(p.lessons_done_ids || []);
      box.appendChild(pickCard('learn', t('l_lessons') + ' (' + doneSet.size + '/' + lessons.length + ')', t('l_lessons_sub'), () => renderLessons()));
      box.appendChild(pickCard('cards', t('l_cards') + ' (' + (p.cards_known || 0) + '/' + cards.length + ')', t('l_cards_sub'), () => renderCards()));
      box.appendChild(pickCard('quiz', t('l_quizzes') + ' (' + (p.quizzes_taken || 0) + ')', t('l_quizzes_sub'), () => renderQuizzes()));
      currentPage = () => renderLearn();
    } catch (err) {
      loadbar.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('load_fail')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => { learnCache = null; renderLearn(); });
      errBox.appendChild(retry);
      box.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function lessonRow(lesson, done) {
    const row = el('div', 'g-row');
    const ico = el('div', 'g-ico');
    ico.textContent = done ? '✅' : '📘';
    row.appendChild(ico);
    const info = el('div', 'player-info');
    info.appendChild(el('div', 'player-nick', lesson.title));
    const meta = el('div', 'player-meta');
    meta.appendChild(el('span', null, lesson.sections.length + ' ' + t('l_sections') + ' · ' + lesson.questions.length + ' ' + t('l_questions')));
    if (done) meta.appendChild(el('span', 'ok-badge', t('l_done')));
    info.appendChild(meta);
    row.appendChild(info);
    row.appendChild(el('span', 'g-chev', '>'));
    return row;
  }

  function renderLessons() {
    const data = learnCache;
    if (!data) { switchTab('learn'); return; }
    pushPage();
    clear();
    view.appendChild(backBtn());
    view.appendChild(sectionTitle('learn', t('l_lessons')));
    const doneSet = new Set((data.progress.lessons_done_ids) || []);
    const list = el('div', 'g-list');
    (data.lessons || []).forEach(lesson => {
      const done = doneSet.has(lesson.id);
      const row = lessonRow(lesson, done);
      row.addEventListener('click', () => openLesson(lesson.id));
      list.appendChild(row);
    });
    view.appendChild(list);
    currentPage = () => renderLessons();
  }

  function openLesson(lessonId) {
    const lesson = (learnCache.lessons || []).find(l => l.id === lessonId);
    if (!lesson) return;
    renderLessonDetail(lesson);
  }

  function renderLessonDetail(lesson) {
    pushPage();
    clear();
    view.appendChild(backBtn());
    view.appendChild(sectionTitle('learn', lesson.title));

    const sections = el('div', 'g-steps-wrap');
    (lesson.sections || []).forEach((s, i) => {
      const block = el('div', 'lesson-block');
      const head = el('button', 'sec-head');
      head.appendChild(el('div', 'section-title', '§ ' + (i + 1)));
      const chev = el('span', 'chev');
      chev.innerHTML = ICONS.chevron;
      head.appendChild(chev);
      block.appendChild(head);
      const body = el('div', 'sec-body');
      s.split('\n').forEach(line => {
        const clean = line.replace(/^[-—–•]\s*/, '');
        body.appendChild(el('p', 'section-text', clean));
      });
      block.appendChild(body);
      head.addEventListener('click', () => {
        body.classList.toggle('hidden');
        chev.classList.toggle('closed');
      });
      sections.appendChild(block);
    });
    view.appendChild(sections);

    const doneSet = new Set((learnCache.progress.lessons_done_ids) || []);
    const questions = lesson.questions || [];
    let qi = 0;

    const questionBox = el('div', 'lesson-questions');
    function ask() {
      questionBox.innerHTML = '';
      if (qi >= questions.length) {
        questionBox.appendChild(el('p', 'lesson-finish', t('l_finished')));
        finishBtn.classList.remove('hidden');
        return;
      }
      const q = questions[qi];
      questionBox.appendChild(el('p', 'q-text', (qi + 1) + '. ' + q.q));
      const input = el('input', 'q-input');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', t('l_check') + '…');
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      const checkBtn = el('button', 'link-btn');
      checkBtn.appendChild(iconEl('check'));
      checkBtn.appendChild(document.createTextNode(t('l_check')));
      const feedback = el('div', 'q-feedback');
      function check() {
        const val = (input.value || '').trim().toLowerCase();
        const a = (q.a || '').trim().toLowerCase();
        const ok = val === a || val.indexOf(a) !== -1 || a.indexOf(val) !== -1;
        feedback.textContent = ok ? t('l_correct') : t('l_wrong').replace('{0}', q.a);
        feedback.className = 'q-feedback ' + (ok ? 'ok' : 'bad');
        checkBtn.disabled = true;
        if (ok) {
          qi++;
          setTimeout(ask, 700);
        }
      }
      checkBtn.addEventListener('click', check);
      questionBox.appendChild(input);
      questionBox.appendChild(checkBtn);
      questionBox.appendChild(feedback);
    }

    const finishBtn = el('button', 'link-btn lesson-done-btn');
    finishBtn.appendChild(iconEl('check'));
    finishBtn.appendChild(document.createTextNode(t('l_lesson_open')));
    finishBtn.addEventListener('click', async () => {
      await api.post('/api/lesson', { lesson_id: lesson.id }).then(syncProfile).catch(() => {});
      learnCache.progress.lessons_done_ids = learnCache.progress.lessons_done_ids || [];
      if (learnCache.progress.lessons_done_ids.indexOf(lesson.id) === -1) {
        learnCache.progress.lessons_done_ids.push(lesson.id);
      }
      learnCache.progress.lessons_done = (learnCache.progress.lessons_done || 0) + 1;
      renderLearn();
    });

    view.appendChild(questionBox);
    if (doneSet.has(lesson.id)) {
      questionBox.appendChild(el('p', 'lesson-finish', t('l_finished')));
    } else {
      ask();
    }
    view.appendChild(finishBtn);

    currentPage = () => renderLessonDetail(lesson);
  }

  function renderCards() {
    const data = learnCache;
    if (!data) { switchTab('learn'); return; }
    pushPage();
    clear();
    view.appendChild(backBtn());
    view.appendChild(sectionTitle('cards', t('l_cards')));
    const cards = data.cards || [];
    if (!cards.length) { view.appendChild(el('p', 'section-text', t('no_data'))); currentPage = () => renderCards(); return; }

    const knownSet = new Set(data.progress.cards_known_indexes || []);
    let order = cards.map((_, i) => i).filter(i => !knownSet.has(i));
    if (!order.length) order = cards.map((_, i) => i);
    let pos = 0;
    let flipped = false;

    const deckBox = el('div', 'deck-box');
    view.appendChild(deckBox);

    const counter = el('p', 'deck-counter', t('c_left').replace('{0}', order.length - pos));
    view.appendChild(counter);

    function renderCard() {
      deckBox.innerHTML = '';
      flipped = false;
      counter.textContent = t('c_left').replace('{0}', order.length - pos);
      if (pos >= order.length) {
        deckBox.appendChild(el('p', 'lesson-finish', t('c_done')));
        return;
      }
      const card = cards[order[pos]];
      const face = el('div', 'fc-card');
      const front = el('div', 'fc-face fc-front');
      front.appendChild(el('div', 'fc-label', t('c_front')));
      front.appendChild(el('div', 'fc-text', card.front));
      const back = el('div', 'fc-face fc-back');
      back.appendChild(el('div', 'fc-label', t('c_back')));
      back.appendChild(el('div', 'fc-text', card.back));
      face.appendChild(front);
      face.appendChild(back);
      face.addEventListener('click', () => {
        face.classList.toggle('flipped');
        flipped = !flipped;
        const btns = deckBox.querySelector('.fc-actions');
        if (btns) btns.classList.toggle('hidden', !flipped);
      });
      deckBox.appendChild(face);

      const actions = el('div', 'fc-actions hidden');
      const unknownBtn = el('button', 'link-btn fc-unknown');
      unknownBtn.appendChild(iconEl('xmark'));
      unknownBtn.appendChild(document.createTextNode(t('c_unknown')));
      unknownBtn.addEventListener('click', () => next(false));
      const knownBtn = el('button', 'link-btn fc-known');
      knownBtn.appendChild(iconEl('check'));
      knownBtn.appendChild(document.createTextNode(t('c_known')));
      knownBtn.addEventListener('click', () => next(true));
      actions.appendChild(unknownBtn);
      actions.appendChild(knownBtn);
      deckBox.appendChild(actions);
    }

    async function next(known) {
      const idx = order[pos];
      if (known) {
        knownSet.add(idx);
        api.post('/api/card', { index: idx, known: true }).then(syncProfile).catch(() => {});
      }
      pos++;
      renderCard();
    }

    renderCard();
    currentPage = () => renderCards();
  }

  function renderQuizzes() {
    const data = learnCache;
    if (!data) { switchTab('learn'); return; }
    pushPage();
    clear();
    view.appendChild(backBtn());
    view.appendChild(sectionTitle('quiz', t('l_quizzes')));
    const quizzes = data.quizzes || [];
    const best = data.progress.quizzes_best || {};
    const list = el('div', 'g-list');
    quizzes.forEach(quiz => {
      const row = el('div', 'g-row');
      row.appendChild(el('div', 'g-ico', '🧪'));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', quiz.title));
      const meta = el('div', 'player-meta');
      meta.appendChild(el('span', null, quiz.questions.length + ' ' + t('l_questions')));
      if (best[quiz.id] != null) meta.appendChild(el('span', 'ok-badge', t('q_best').replace('{0}', best[quiz.id])));
      info.appendChild(meta);
      row.appendChild(info);
      row.appendChild(el('span', 'g-chev', '>'));
      row.addEventListener('click', () => openQuiz(quiz.id));
      list.appendChild(row);
    });
    view.appendChild(list);
    currentPage = () => renderQuizzes();
  }

  function openQuiz(quizId) {
    const quiz = (learnCache.quizzes || []).find(q => q.id === quizId);
    if (!quiz) return;
    renderQuizDetail(quiz);
  }

  function renderQuizDetail(quiz) {
    pushPage();
    clear();
    view.appendChild(backBtn());
    view.appendChild(sectionTitle('quiz', quiz.title));

    const questions = quiz.questions || [];
    let qi = 0;
    let score = 0;
    const state = el('div', 'quiz-state');
    view.appendChild(state);
    const qBox = el('div', 'quiz-box');
    view.appendChild(qBox);

    function renderQ() {
      qBox.innerHTML = '';
      if (qi >= questions.length) {
        const pct = questions.length ? Math.round(score * 100 / questions.length) : 0;
        state.textContent = t('q_finished');
        const res = el('div', 'quiz-result');
        const emoji = pct >= 80 ? t('q_perfect') : pct >= 50 ? t('q_good') : t('q_keep');
        res.appendChild(el('div', 'quiz-score', t('q_result').replace('{0}', score).replace('{1}', questions.length)));
        res.appendChild(el('div', 'quiz-sub', emoji));
        qBox.appendChild(res);
        api.post('/api/quiz', { quiz_id: quiz.id, score: score, total: questions.length }).then(syncProfile).catch(() => {});
        learnCache.progress.quizzes_best = learnCache.progress.quizzes_best || {};
        if ((learnCache.progress.quizzes_best[quiz.id] || -1) < score) {
          learnCache.progress.quizzes_best[quiz.id] = score;
        }
        const again = el('button', 'link-btn');
        again.appendChild(iconEl('refresh'));
        again.appendChild(document.createTextNode(t('q_again')));
        again.addEventListener('click', () => renderQuizDetail(quiz));
        qBox.appendChild(again);
        return;
      }
      const q = questions[qi];
      state.textContent = t('q_q').replace('{0}', qi + 1).replace('{1}', questions.length);
      const qTitle = el('p', 'q-text', q.q);
      qBox.appendChild(qTitle);
      const feedback = el('div', 'q-feedback');
      qBox.appendChild(feedback);
      q.options.forEach((opt, oi) => {
        const btn = el('button', 'q-option');
        btn.textContent = String.fromCharCode(65 + oi) + '. ' + opt;
        btn.addEventListener('click', () => {
          const ok = oi === q.answer;
          if (ok) score++;
          feedback.textContent = ok ? t('q_feedback_correct') : t('q_feedback_wrong').replace('{0}', q.options[q.answer]);
          feedback.className = 'q-feedback ' + (ok ? 'ok' : 'bad');
          qBox.querySelectorAll('.q-option').forEach(b => {
            b.classList.add(oi === q.answer ? 'correct' : 'wrong');
            b.disabled = true;
          });
          qi++;
          setTimeout(renderQ, 800);
        });
        qBox.appendChild(btn);
      });
    }

    renderQ();
    currentPage = () => renderQuizDetail(quiz);
  }

  async function renderTrain() {
    if (loading) return;
    loading = true;
    clear();
    view.appendChild(sectionTitle('drill', t('tab_train')));
    const box = el('div', 'sub-box');
    view.appendChild(box);
    const skeleton = addSkeleton(box, 4);
    try {
      const g = await loadGuides();
      let practice = {};
      try {
        const p = await api.get('/api/training');
        if (p.ok) practice = p.practice || {};
      } catch (e) {}
      skeleton.remove();
      try {
        const planRes = await api.get('/api/training/plan');
        if (planRes.ok && planRes.plan && planRes.plan.length) {
          renderPlanSection(view, planRes);
        }
      } catch (e) {}
      view.appendChild(el('p', 'muted-note', t('tr_sub')));
      view.appendChild(sectionTitle('drill', t('tr_pick_map')));
      const list = el('div', 'g-list');
      (g.maps || []).forEach(map => {
        const lineups = (g.lineups || {})[map.id] || [];
        const done = Object.keys(practice[map.id] || {}).length;
        const row = el('div', 'g-row');
        row.appendChild(el('div', 'g-ico', map.emoji || '🗺️'));
        const info = el('div', 'player-info');
        info.appendChild(el('div', 'player-nick', map.name));
        const meta = el('div', 'player-meta');
        meta.appendChild(el('span', null, t('tr_progress').replace('{0}', done).replace('{1}', lineups.length)));
        info.appendChild(meta);
        row.appendChild(info);
        row.appendChild(el('span', 'g-chev', '>'));
        row.addEventListener('click', () => renderTrainMap(map, practice));
        list.appendChild(row);
      });
      view.appendChild(list);
      currentPage = () => renderTrain();
    } catch (err) {
      skeleton.remove();
      const errBox = el('div', 'err-box');
      errBox.appendChild(el('p', 'section-text', t('load_fail')));
      const retry = el('button', 'link-btn');
      retry.appendChild(iconEl('refresh'));
      retry.appendChild(document.createTextNode(t('retry')));
      retry.addEventListener('click', () => { guidesData = null; renderTrain(); });
      errBox.appendChild(retry);
      box.appendChild(errBox);
    } finally {
      loading = false;
    }
  }

  function renderPlanSection(root, planRes) {
    const plan = planRes.plan || [];
    const skills = planRes.skills || {};
    const weakest = planRes.weakest || null;
    const prefs = planRes.prefs || {};

    root.appendChild(sectionTitle('drill', t('tp_today')));
    const prog = planRes.completed_count || 0;
    root.appendChild(el('p', 'muted-note', t('tp_progress').replace('{0}', prog).replace('{1}', plan.length)));

    if (weakest) {
      root.appendChild(sectionTitle('bolt', t('tp_reco')));
      root.appendChild(el('div', 'reco-card', (weakest.icon || '🎯') + ' ' + (lang === 'ru' ? weakest.text_ru : weakest.text_en)));
    }

    root.appendChild(sectionTitle('trophy', t('tp_skill_level')));
    const skillGrid = el('div', 'prog-grid');
    Object.keys(skills).forEach(sid => {
      const s = skills[sid];
      const weak = weakest && weakest.skill_id === sid;
      skillGrid.appendChild(progressStat((weak ? '⚡ ' : '') + (lang === 'ru' ? s.name_ru : s.name), s.level || 0, 100, weak ? 'bolt' : 'trophy'));
    });
    root.appendChild(skillGrid);

    const list = el('div', 'g-list');
    plan.forEach(task => {
      const row = el('div', 'g-row' + (task.completed ? ' done' : ''));
      row.appendChild(el('span', 'l-badge', (skills[task.skill_id] || {}).icon || '🎯'));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', lang === 'ru' ? task.title_ru : task.title));
      info.appendChild(el('div', 'player-meta', t('tp_min').replace('{0}', task.duration_min)));
      info.appendChild(rowDone(task.completed));
      row.appendChild(info);
      const btn = el('button', 'link-btn tp-btn' + (task.completed ? ' ok' : ''));
      btn.textContent = task.completed ? t('tp_done') : t('tp_do');
      btn.addEventListener('click', async () => {
        btn.textContent = t('tp_done');
        btn.classList.add('ok');
        const res = await api.post('/api/training/complete', { task_id: task.task_id, skill_id: task.skill_id }).catch(() => ({}));
        syncProfile(res);
        renderTrain();
      });
      row.appendChild(btn);
      list.appendChild(row);
    });
    root.appendChild(list);

    const prefsRow = el('div', 'set-row');
    prefsRow.appendChild(el('span', 'gr-filter-label', t('tp_time')));
    prefsRow.appendChild(sel([[15, '15'], [30, '30'], [45, '45'], [60, '60']], prefs.training_minutes || 30, () => {}));
    prefsRow.appendChild(el('span', 'gr-filter-label', t('tp_goal')));
    const goals = [['aim', t('tp_goal_aim')], ['utility', t('tp_goal_utility')], ['game_sense', t('tp_goal_game_sense')], ['movement', t('tp_goal_movement')], ['faceit10', t('tp_goal_faceit10')]];
    prefsRow.appendChild(sel(goals, prefs.goal || 'aim', () => {}));
    const saveBtn = el('button', 'link-btn tp-save', t('tp_saved'));
    saveBtn.addEventListener('click', async () => {
      const selects = prefsRow.querySelectorAll('select');
      const minutes = parseInt(selects[0].value, 10);
      const goal = selects[1].value;
      await api.post('/api/onboarding', { training_minutes: minutes, goal, role: 'rifler' }).catch(() => ({}));
      renderTrain();
    });
    prefsRow.appendChild(saveBtn);
    root.appendChild(prefsRow);
  }

  function rowDone(completed) {
    const span = el('span', 'ok-badge' + (completed ? '' : ' hidden'), t('tp_done'));
    return span;
  }

  function renderTrainMap(map, practice) {
    pushPage();
    clear();
    view.appendChild(gBackBtn(renderTrain));
    view.appendChild(sectionTitle('drill', (map.emoji || '') + ' ' + map.name));
    const lineups = (guidesData.lineups || {})[map.id] || [];
    if (!lineups.length) { view.appendChild(el('p', 'section-text', t('tr_empty'))); currentPage = () => renderTrainMap(map, practice); return; }
    const pr = practice[map.id] || {};
    const list = el('div', 'g-list');
    lineups.forEach(l => {
      const row = el('div', 'g-row');
      row.appendChild(el('span', 'l-badge ' + guideTypeCls(l.type), guideTypeEmoji(l.type)));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', l.title));
      const meta = el('div', 'player-meta');
      meta.appendChild(el('span', null, gStepCount(l.steps)));
      if (pr[l.id]) {
        meta.appendChild(el('span', 'ok-badge', t('tr_practiced')));
      } else {
        meta.appendChild(el('span', null, t('tr_attempts').replace('{0}', pr[l.id] || 0)));
      }
      info.appendChild(meta);
      row.appendChild(info);
      row.appendChild(el('span', 'g-chev', '>'));
      row.addEventListener('click', () => renderTrainLineup(map, l, pr));
      list.appendChild(row);
    });
    view.appendChild(list);
    currentPage = () => renderTrainMap(map, practice);
  }

  function renderTrainLineup(map, l, pr) {
    pushPage();
    clear();
    view.appendChild(gBackBtn(() => renderTrainMap(map, pr)));
    const title = el('div', 'l-title');
    title.appendChild(el('span', 'l-badge ' + guideTypeCls(l.type), guideTypeLabel(l.type)));
    title.appendChild(el('span', 'l-name', l.title));
    view.appendChild(title);
    const mini = gMiniRadar(map, l);
    if (mini) {
      const mlabel = el('div', 'tr-spot-label', t('tr_spot_here'));
      mini.appendChild(mlabel);
      view.appendChild(mini);
    }
    const trVideos = Array.isArray(l.videos) ? l.videos : (l.video ? [l.video] : []);
    if (trVideos.length) {
      const wrap = el('div', 'spot-video');
      trVideos.forEach(v => {
        const url = typeof v === 'string' ? v : (v && v.url);
        const m = gMedia(url);
        if (m) wrap.appendChild(m);
      });
      view.appendChild(wrap);
    }
    view.appendChild(gSteps(l.steps));

    const attempts = pr[l.id] || 0;
    const checklist = el('div', 'tr-checklist');
    checklist.appendChild(el('div', 'tr-checklist-title', t('tr_checklist')));
    const items = [
      ['📖', t('tr_check1')],
      ['🗺️', t('tr_check2')],
      ['💣', t('tr_check3')]
    ];
    const marks = items.map(it => {
      const line = el('div', 'tr-check');
      line.appendChild(el('span', 'tr-check-icon', it[0]));
      line.appendChild(el('span', 'tr-check-text', it[1]));
      const mk = el('span', 'tr-check-box');
      mk.dataset.checked = '0';
      mk.textContent = ' ';
      line.appendChild(mk);
      line.addEventListener('click', () => {
        const on = mk.dataset.checked !== '1';
        mk.dataset.checked = on ? '1' : '0';
        mk.textContent = on ? '✓' : ' ';
      });
      checklist.appendChild(line);
      return mk;
    });
    view.appendChild(checklist);

    const doneBtn = el('button', 'link-btn tr-done');
    doneBtn.appendChild(iconEl('check'));
    doneBtn.appendChild(document.createTextNode(t('tr_ready')));
    doneBtn.addEventListener('click', async () => {
      await api.post('/api/training', { map_id: map.id, lineup_id: l.id }).then(syncProfile).catch(() => {});
      pr[l.id] = attempts + 1;
      renderTrainMap(map, pr);
    });
    view.appendChild(doneBtn);

    const attemptsNote = el('p', 'muted-note', t('tr_attempts').replace('{0}', attempts));
    view.appendChild(attemptsNote);

    currentPage = () => renderTrainLineup(map, l, pr);
  }


async function loadGrenades() {
  if (!grenadesCache) {
    const res = await api.get('/api/grenades');
    if (!res.ok) throw new Error('grenades load failed');
    grenadesCache = res.grenades || [];
  }
  return grenadesCache;
}

function grenadeTypeLabel(type) { return guideTypeLabel(type); }
function grenadeTypeCls(type) { return guideTypeCls(type); }
function grenadeTypeEmoji(type) { return guideTypeEmoji(type); }

function difficultyStars(d) {
  return '★'.repeat(Math.max(1, Math.min(3, d || 1)));
}

function grenadeRow(g, favs, onClick) {
  const row = el('div', 'g-row');
  row.appendChild(el('span', 'l-badge ' + grenadeTypeCls(g.type), grenadeTypeEmoji(g.type)));
  const info = el('div', 'player-info');
  info.appendChild(el('div', 'player-nick', g.title));
  const meta = el('div', 'player-meta');
  meta.appendChild(el('span', null, g.map_name + ' · ' + (g.side || 'T') + ' · ' + (g.site || '—') + ' · ' + difficultyStars(g.difficulty)));
  info.appendChild(meta);
  row.appendChild(info);
  const star = el('span', 'fav-star' + (favs.has('grenade:' + g.id) ? ' active' : ''), favs.has('grenade:' + g.id) ? '★' : '☆');
  star.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleGrenadeFav(g, favs, star);
  });
  row.appendChild(star);
  row.appendChild(el('span', 'g-chev', '>'));
  row.addEventListener('click', onClick);
  return row;
}

async function loadFavsSet() {
  const favSet = new Set();
  try {
    const res = await api.get('/api/favorites');
    if (res.ok) (res.favorites || []).forEach(f => favSet.add(f.item_type + ':' + f.item_id));
  } catch (e) {}
  return favSet;
}

async function toggleGrenadeFav(g, favs, star) {
  const key = 'grenade:' + g.id;
  const isFav = favs.has(key);
  try {
    if (isFav) {
      await api.del('/api/favorites?item_type=grenade&item_id=' + encodeURIComponent(g.id));
      favs.delete(key);
    } else {
      await api.post('/api/favorites', { item_type: 'grenade', item_id: g.id });
      favs.add(key);
    }
    if (star) {
      star.textContent = favs.has(key) ? '★' : '☆';
      star.classList.toggle('active', favs.has(key));
    }
  } catch (e) {}
}

async function renderGrenades() {
  if (loading) return;
  loading = true;
  clear();
  view.appendChild(gBackBtn(renderGuides));
  view.appendChild(sectionTitle('grenade', t('gr_title')));
  view.appendChild(el('p', 'muted-note', t('gr_sub')));
  const favs = await loadFavsSet();
  try {
    const all = await loadGrenades();
    const maps = guidesData && guidesData.maps ? guidesData.maps : [];
    const state = { map: '', side: '', type: '', q: '', favOnly: false };

    const filters = el('div', 'gr-filters');
    const row1 = el('div', 'gr-filter-row');
    row1.appendChild(el('span', 'gr-filter-label', t('gr_map')));
    row1.appendChild(sel([['', t('gr_all')]].concat(maps.map(m => [m.id, m.name])), state.map, v => { state.map = v; render(); }));
    row1.appendChild(el('span', 'gr-filter-label', t('gr_side')));
    row1.appendChild(sel([['', t('gr_all')], ['T', 'T'], ['CT', 'CT']], state.side, v => { state.side = v; render(); }));
    row1.appendChild(el('span', 'gr-filter-label', t('gr_type')));
    row1.appendChild(sel([['', t('gr_all')], ['smoke', 'Smoke'], ['flash', 'Flash'], ['molotov', 'Molotov'], ['he', 'HE']], state.type, v => { state.type = v; render(); }));
    filters.appendChild(row1);
    const row2 = el('div', 'gr-filter-row');
    const search = document.createElement('input');
    search.className = 'gr-search';
    search.setAttribute('placeholder', t('gr_search'));
    search.addEventListener('input', () => { state.q = search.value.trim().toLowerCase(); render(); });
    row2.appendChild(search);
    const favBtn = el('button', 'link-btn' + (state.favOnly ? ' active' : ''), t('gr_favs') + ' ★');
    favBtn.addEventListener('click', () => { state.favOnly = !state.favOnly; favBtn.classList.toggle('active', state.favOnly); render(); });
    row2.appendChild(favBtn);
    filters.appendChild(row2);
    view.appendChild(filters);

    const listBox = el('div', 'g-list');
    view.appendChild(listBox);
    const note = el('p', 'muted-note');
    view.appendChild(note);

    function filtered() {
      let items = all;
      if (state.map) items = items.filter(g => g.map === state.map);
      if (state.side) items = items.filter(g => (g.side || 'T').toUpperCase() === state.side);
      if (state.type) items = items.filter(g => g.type === state.type);
      if (state.q) {
        items = items.filter(g => {
          const hay = (g.title + ' ' + g.map + ' ' + (g.map_name || '') + ' ' + (g.site || '') + ' ' + (g.type || '')).toLowerCase();
          return hay.indexOf(state.q) !== -1;
        });
      }
      if (state.favOnly) items = items.filter(g => favs.has('grenade:' + g.id));
      return items;
    }

    function render() {
      listBox.innerHTML = '';
      const items = filtered();
      note.textContent = t('gr_total').replace('{0}', items.length);
      if (!items.length) {
        listBox.appendChild(el('p', 'section-text', state.favOnly ? t('gr_fav_empty') : t('gr_empty')));
        return;
      }
      items.forEach(g => {
        listBox.appendChild(grenadeRow(g, favs, () => renderGrenadeDetail(g, favs)));
      });
    }
    render();
    currentPage = () => renderGrenades();
  } catch (err) {
    view.appendChild(el('p', 'section-text', t('load_fail')));
  } finally {
    loading = false;
  }
}

function renderGrenadeDetail(g, favs) {
  pushPage();
  clear();
  view.appendChild(gBackBtn(renderGrenades));
  const title = el('div', 'l-title');
  title.appendChild(el('span', 'l-badge ' + grenadeTypeCls(g.type), grenadeTypeLabel(g.type)));
  title.appendChild(el('span', 'l-name', g.title));
  view.appendChild(title);
  const meta = el('div', 'player-meta');
  meta.appendChild(el('span', 'ok-badge', g.map_name));
  meta.appendChild(el('span', null, (g.side || 'T') + ' · ' + (g.site || '—')));
  meta.appendChild(el('span', null, t('gr_difficulty') + ': ' + difficultyStars(g.difficulty)));
  view.appendChild(meta);
  const grVideos = Array.isArray(g.videos) ? g.videos : (g.video ? [g.video] : []);
  if (grVideos.length) {
    const wrap = el('div', 'spot-video');
    grVideos.forEach(v => {
      const url = typeof v === 'string' ? v : (v && v.url);
      const m = gMedia(url);
      if (m) wrap.appendChild(m);
    });
    view.appendChild(wrap);
  }
  const steps = g.steps && g.steps.length ? g.steps : [];
  if (steps.length) view.appendChild(gSteps(steps));

  const isFav = favs.has('grenade:' + g.id);
  const favBtn = el('button', 'link-btn', (isFav ? '★ ' : '☆ ') + (isFav ? t('gr_fav_rm') : t('gr_fav_add')));
  favBtn.addEventListener('click', async () => {
    await toggleGrenadeFav(g, favs, null);
    renderGrenadeDetail(g, favs);
  });
  view.appendChild(favBtn);

  const trainBtn = el('button', 'link-btn gr-train');
  trainBtn.appendChild(iconEl('drill'));
  trainBtn.appendChild(document.createTextNode(t('gr_train')));
  trainBtn.addEventListener('click', async () => {
    trainBtn.textContent = t('gr_trained') + ' ✓';
    trainBtn.classList.add('ok');
    await api.post('/api/training', { map_id: g.map, lineup_id: g.id }).then(syncProfile).catch(() => {});
  });
  view.appendChild(trainBtn);

  currentPage = () => renderGrenadeDetail(g, favs);
}


async function loadGames() {
  if (gamesCache) return gamesCache;
  const res = await api.get('/api/games');
  if (!res.ok) throw new Error('games load failed');
  gamesCache = res.games || {};
  return gamesCache;
}

async function renderFriends() {
  if (loading) return;
  loading = true;
  clear();
  pushPage();
  view.appendChild(backBtn(() => renderHome()));
  view.appendChild(sectionTitle('stats', t('fr_title')));
  const box = el('div', 'sub-box');
  view.appendChild(box);
  const skeleton = addSkeleton(box, 4);
  try {
    const res = await api.get('/api/friends');
    skeleton.remove();
    if (!res.ok) { box.appendChild(el('p', 'section-text', t('load_fail'))); loading = false; return; }
    box.appendChild(el('p', 'muted-note', t('fr_sub')));

    const addRow = el('div', 'fr-add-row');
    const input = document.createElement('input');
    input.className = 'gr-search';
    input.type = 'number';
    input.placeholder = t('fr_add_ph');
    addRow.appendChild(input);
    const addBtn = el('button', 'link-btn', t('fr_add'));
    addBtn.addEventListener('click', async () => {
      const val = input.value.trim();
      if (!val) return;
      const r = await api.post('/api/friends/request', { user_id: parseInt(val, 10) }).catch(() => ({ ok: false, error: 'network' }));
      if (r.ok) { addBtn.textContent = t('fr_sent'); addBtn.classList.add('ok'); renderFriends(); }
      else { addBtn.textContent = t('fr_error').replace('{0}', r.error || '?'); }
    });
    addRow.appendChild(addBtn);
    box.appendChild(addRow);

    const requests = res.requests || [];
    if (requests.length) {
      box.appendChild(sectionTitle('stats', t('fr_requests') + ' (' + requests.length + ')'));
      requests.forEach(f => {
        const row = el('div', 'g-row');
        row.appendChild(el('div', 'g-ico', '👤'));
        const info = el('div', 'player-info');
        info.appendChild(el('div', 'player-nick', f.name));
        info.appendChild(el('div', 'player-meta', 'Lv' + f.level + ' · ' + f.xp + ' XP'));
        row.appendChild(info);
        const acc = el('button', 'link-btn', t('fr_accept'));
        acc.addEventListener('click', async () => {
          await api.post('/api/friends/accept', { user_id: f.user_id });
          renderFriends();
        });
        row.appendChild(acc);
        box.appendChild(row);
      });
    }

    const friends = res.friends || [];
    box.appendChild(sectionTitle('stats', t('fr_lb') + ' (' + friends.length + ')'));
    if (!friends.length) { box.appendChild(el('p', 'section-text', t('fr_empty'))); }
    friends.forEach((f, i) => {
      const row = el('div', 'g-row');
      row.appendChild(el('span', 'g-chev', '#' + (i + 1)));
      row.appendChild(el('div', 'g-ico', '👤'));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', f.name));
      info.appendChild(el('div', 'player-meta', 'Lv' + f.level + ' · ' + f.xp + ' XP'));
      row.appendChild(info);
      const rm = el('button', 'link-btn', t('fr_remove'));
      rm.addEventListener('click', async () => {
        await api.post('/api/friends/remove', { user_id: f.user_id });
        renderFriends();
      });
      row.appendChild(rm);
      box.appendChild(row);
    });
    currentPage = () => renderFriends();
  } catch (err) {
    skeleton.remove();
    box.appendChild(el('p', 'section-text', t('load_fail')));
  } finally {
    loading = false;
  }
}

async function renderChallenges() {
  if (loading) return;
  loading = true;
  clear();
  pushPage();
  view.appendChild(backBtn(() => renderHome()));
  view.appendChild(sectionTitle('trophy', t('ch_title')));
  const box = el('div', 'sub-box');
  view.appendChild(box);
  const skeleton = addSkeleton(box, 4);
  try {
    const res = await api.get('/api/challenges');
    skeleton.remove();
    if (!res.ok) { box.appendChild(el('p', 'section-text', t('load_fail'))); loading = false; return; }
    const challenges = res.challenges || [];
    box.appendChild(el('p', 'muted-note', t('ch_sub')));
    if (!challenges.length) { box.appendChild(el('p', 'section-text', t('ch_empty'))); loading = false; return; }
    challenges.forEach(ch => {
      const card = el('div', 'ch-card' + (ch.completed ? ' done' : ''));
      card.appendChild(el('span', 'ch-icon', ch.icon));
      const info = el('div', 'player-info');
      info.appendChild(el('div', 'player-nick', lang === 'ru' ? ch.title_ru : ch.title));
      info.appendChild(el('div', 'player-meta', lang === 'ru' ? ch.desc_ru : ch.desc));
      info.appendChild(el('div', 'player-meta', t('ch_xp_coins').replace('{0}', ch.reward_xp).replace('{1}', ch.reward_coins)));
      card.appendChild(info);
      const pct = Math.min(100, Math.round(ch.progress / ch.target * 100));
      const bar = el('div', 'ch-bar');
      const fill = el('div', 'ch-bar-fill');
      fill.style.width = pct + '%';
      bar.appendChild(fill);
      card.appendChild(bar);
      const meta = el('div', 'ch-foot');
      meta.appendChild(el('span', 'muted-note', t('ch_progress').replace('{0}', ch.progress).replace('{1}', ch.target)));
      if (ch.claimed) {
        meta.appendChild(el('span', 'ok-badge', t('ch_claimed')));
      } else if (ch.completed) {
        const claimBtn = el('button', 'link-btn tp-btn');
        claimBtn.appendChild(iconEl('bolt'));
        claimBtn.appendChild(document.createTextNode(t('ch_claim')));
        claimBtn.addEventListener('click', async () => {
          claimBtn.textContent = t('ch_claimed');
          claimBtn.classList.add('ok');
          await api.post('/api/challenges/claim', { challenge_id: ch.id }).then(syncProfile).catch(() => {});
        });
        meta.appendChild(claimBtn);
      }
      card.appendChild(meta);
      box.appendChild(card);
    });
    currentPage = () => renderChallenges();
  } catch (err) {
    skeleton.remove();
    box.appendChild(el('p', 'section-text', t('load_fail')));
  } finally {
    loading = false;
  }
}

async function renderGames() {
  if (loading) return;
  loading = true;
  clear();
  view.appendChild(sectionTitle('quiz', t('tab_games')));
  const box = el('div', 'sub-box');
  view.appendChild(box);
  const skeleton = addSkeleton(box, 4);
  try {
    const [games, progRes, dailyRes] = await Promise.all([
      loadGames(),
      api.get('/api/games/progress').catch(() => ({ ok: false })),
      api.get('/api/games/daily').catch(() => ({ ok: false })),
    ]);
    skeleton.remove();
    view.appendChild(el('p', 'muted-note', t('gm_sub')));
    if (dailyRes.ok && dailyRes.game) {
      const daily = dailyRes.game;
      const dailyCard = el('div', 'daily-card' + (dailyRes.completed ? ' done' : ''));
      dailyCard.appendChild(el('span', 'daily-icon', daily.icon));
      const dinfo = el('div', 'player-info');
      dinfo.appendChild(el('div', 'player-nick', t('gm_daily') + ': ' + (lang === 'ru' ? daily.title_ru : daily.title)));
      dinfo.appendChild(el('div', 'player-meta', dailyRes.completed ? t('gm_daily_done') : t('gm_daily_bonus')));
      dailyCard.appendChild(dinfo);
      const dbtn = el('button', 'link-btn', t('gm_daily_play'));
      dbtn.addEventListener('click', () => startGame(games[daily.id]));
      dailyCard.appendChild(dbtn);
      view.appendChild(dailyCard);
    }
    const progress = progRes.ok ? (progRes.progress || {}) : {};
    const best = progress.best || {};
    const played = progress.played || {};
    const list = el('div', 'g-list');
    const entries = Object.values(games);
    if (!entries.length) { view.appendChild(el('p', 'section-text', t('gm_no_games'))); }
    entries.forEach(g => {
      const row = el('div', 'g-row');
      row.appendChild(el('div', 'g-ico', g.icon));
      const info = el('div', 'player-info');
      const title = lang === 'ru' ? g.title_ru : g.title;
      info.appendChild(el('div', 'player-nick', title));
      const meta = el('div', 'player-meta');
      if (best[g.id] != null) meta.appendChild(el('span', 'ok-badge', t('gm_best').replace('{0}', best[g.id])));
      if (played[g.id]) meta.appendChild(el('span', null, t('gm_played').replace('{0}', played[g.id])));
      info.appendChild(meta);
      row.appendChild(info);
      row.appendChild(el('span', 'g-chev', '>'));
      row.addEventListener('click', () => startGame(g));
      list.appendChild(row);
    });
    view.appendChild(list);
    currentPage = () => renderGames();
    } catch (err) {
      skeleton.remove();
      const errBox = el('div', 'err-box');
    errBox.appendChild(el('p', 'section-text', t('load_fail')));
    const retry = el('button', 'link-btn');
    retry.appendChild(iconEl('refresh'));
    retry.appendChild(document.createTextNode(t('retry')));
    retry.addEventListener('click', () => { gamesCache = null; renderGames(); });
    errBox.appendChild(retry);
    box.appendChild(errBox);
  } finally {
    loading = false;
  }
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame(game) {
  pushPage();
  clear();
  view.appendChild(backBtn(() => renderGames()));
  view.appendChild(sectionTitle(game.icon ? 'quiz' : 'quiz', lang === 'ru' ? game.title_ru : game.title));
  if (game.kind === 'reaction') return startReactionGame(game);
  if (game.kind === 'aim') return startAimGame(game);
  const questions = shuffleArray(game.questions);
  let qi = 0, score = 0;
  const startTime = Date.now();
  const state = el('div', 'quiz-state');
  view.appendChild(state);
  const qBox = el('div', 'quiz-box');
  view.appendChild(qBox);

  function renderQ() {
    qBox.innerHTML = '';
    if (qi >= questions.length) {
      const dur = Date.now() - startTime;
      state.textContent = t('gm_finish');
      const res = el('div', 'quiz-result');
      res.appendChild(el('div', 'quiz-score', t('gm_result').replace('{0}', score).replace('{1}', questions.length)));
      qBox.appendChild(res);
      api.post('/api/games/submit', {
        game_id: game.id,
        score: score,
        total: questions.length,
        duration_ms: dur,
      }).then(syncProfile).catch(() => {});
      if (gamesCache && gamesCache[game.id]) {
        const prog = {};
        try { prog.best = {}; } catch (e) {}
      }
      const again = el('button', 'link-btn');
      again.appendChild(iconEl('refresh'));
      again.appendChild(document.createTextNode(t('gm_play_again')));
      again.addEventListener('click', () => startGame(game));
      qBox.appendChild(again);
      const backBtn2 = el('button', 'link-btn');
      backBtn2.appendChild(iconEl('back'));
      backBtn2.appendChild(document.createTextNode(t('gm_back')));
      backBtn2.addEventListener('click', () => { gamesCache = null; renderGames(); });
      qBox.appendChild(backBtn2);
      return;
    }
    const q = questions[qi];
    state.textContent = t('gm_q').replace('{0}', qi + 1).replace('{1}', questions.length);
    if (q.scenario) {
      qBox.appendChild(el('p', 'q-text', q.scenario));
    } else if (q.q) {
      qBox.appendChild(el('p', 'q-text', q.q));
    }
    const feedback = el('div', 'q-feedback');
    qBox.appendChild(feedback);
    const opts = q.options || [];
    opts.forEach((opt, oi) => {
      const btn = el('button', 'q-option');
      btn.textContent = String.fromCharCode(65 + oi) + '. ' + opt;
      btn.addEventListener('click', () => {
        const ok = opt === q.answer;
        if (ok) score++;
        feedback.textContent = ok ? t('gm_correct') : t('gm_wrong').replace('{0}', q.answer);
        feedback.className = 'q-feedback ' + (ok ? 'ok' : 'bad');
        qBox.querySelectorAll('.q-option').forEach(b => {
          const bText = b.textContent.substring(3);
          b.classList.add(bText === q.answer ? 'correct' : (bText === opt ? 'wrong' : ''));
          b.disabled = true;
        });
        qi++;
        setTimeout(renderQ, 800);
      });
      qBox.appendChild(btn);
    });
  }

  renderQ();
  currentPage = () => startGame(game);
}

function submitGameResult(game, score, total, durationMs, onDone) {
  api.post('/api/games/submit', {
    game_id: game.id,
    score: score,
    total: total,
    duration_ms: durationMs,
  }).then(res => {
    syncProfile(res);
    if (onDone) onDone(res);
  }).catch(() => {});
}

function startReactionGame(game) {
  const attempts = 5;
  const DEADLINE = 1300;
  let curDL = DEADLINE;
  let done = 0;
  let hit = 0;
  let stage = 'idle'; // idle | wait | ready | cooldown | finished
  let timer = null;
  let rafId = 0;
  let readyTime = 0;
  let appearAt = 0;
  let fallAt = 0;
  let spot = null;
  let shake = 0;
  let reactionTimes = [];
  let flashT = 0;
  let tracer = null;
  let curDir = 1, curDy = 0, mirror = false, runMode = false, enemyX = 0;
  let missT = 0, efT = 0, efGun = null;
  let streak = 0, hsCount = 0;
  const feeds = [];
  const pbKey = 'cs2_react_best_ms';
  const pb = +(localStorage.getItem(pbKey) || 0);
  const particles = [];
  const floats = [];
  const markers = [];
  const startTime = Date.now();

  const state = el('div', 'quiz-state');
  state.textContent = fmt(t('gm_react_attempt'), 1, attempts);
  view.appendChild(state);

  const scene = el('div', 'react-scene');
  const cv = document.createElement('canvas');
  cv.className = 'react-canvas';
  const W = 512;
  const H = 384;
  const SCENE_DY = 96;
  cv.width = W;
  cv.height = H;
  const flash = el('div', 'react-flash');
  const hint = el('div', 'react-hint');
  scene.appendChild(cv);
  scene.appendChild(flash);
  scene.appendChild(hint);
  view.appendChild(scene);

  const startOverlay = el('div', 'react-start');
  const startBtn = el('button', 'react-start-btn');
  startBtn.textContent = t('gm_react_start');
  const startTip = el('div', 'react-start-tip');
  startTip.textContent = lang === 'ru'
    ? 'Жди пика террориста — жми как можно быстрее'
    : 'Wait for the peek — tap as fast as you can';
  startOverlay.appendChild(startBtn);
  startOverlay.appendChild(startTip);
  scene.appendChild(startOverlay);
  const beginFromBtn = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (stage !== 'idle') return;
    ensureAudio();
    haptic('rigid');
    startOverlay.remove();
    stage = 'wait';
    setHint(t('gm_react_wait'));
    nextAttempt(200);
  };
  startBtn.addEventListener('pointerdown', beginFromBtn);
  startBtn.addEventListener('click', beginFromBtn);

  const ctx = cv.getContext('2d');

  function canvasXY(ev) {
    const r = cv.getBoundingClientRect();
    return [Math.round((ev.clientX - r.left) * W / r.width), Math.round((ev.clientY - r.top) * H / r.height) - SCENE_DY];
  }

  function burst(x, y) {
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2, sp = .6 + Math.random() * 2.4;
      particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, g: .16, life: 26 + Math.random() * 16,
        col: ['#fff3d0', '#ffd166', '#ff9a58', '#ff5a4d'][Math.floor(Math.random() * 4)], sz: Math.random() < .3 ? 2 : 1,
      });
    }
    for (let i = 0; i < 7; i++) {
      particles.push({
        x: x + (Math.random() * 10 - 5), y: y + (Math.random() * 8 - 4), vx: (Math.random() - .5) * .7,
        vy: -.4 - Math.random() * .6, g: -.01, life: 22 + Math.random() * 14, col: '#c0392b', sz: 2,
      });
    }
  }

  function haptic(style) {
    try { if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred(style); } catch (e) {}
  }

  let AC = null;
  function ensureAudio() {
    try {
      if (!AC) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (Ctor) AC = new Ctor();
      }
      if (AC && AC.state === 'suspended') AC.resume();
    } catch (e) {}
  }

  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!AC) return;
    try {
      const o = AC.createOscillator(), g = AC.createGain(), t0 = AC.currentTime + (delay || 0);
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(vol || .07, t0);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.connect(g); g.connect(AC.destination);
      o.start(t0); o.stop(t0 + dur + .02);
    } catch (e) {}
  }

  function noiseShot(vol) {
    if (!AC) return;
    try {
      const n = (AC.sampleRate * .09) | 0, buf = AC.createBuffer(1, n, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = AC.createBufferSource(); src.buffer = buf;
      const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500;
      const g = AC.createGain(); g.gain.value = vol || .15;
      src.connect(f); f.connect(g); g.connect(AC.destination); src.start();
    } catch (e) {}
  }

  // ── Pixel-art helpers: everything snaps to the integer grid ─────
  function P(c, col, x, y, w, h) {
    c.fillStyle = col;
    c.fillRect(x | 0, y | 0, w || 1, h || 1);
  }

  function pdith(c, colA, colB, x, y, w, h) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        c.fillStyle = ((xx + yy) & 1) ? colA : colB;
        c.fillRect(x + xx, y + yy, 1, 1);
      }
    }
  }

  function pcirc(c, col, cx, cy, r) {
    c.fillStyle = col;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy));
      c.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
    }
  }

  function pring(c, col, cx, cy, r) {
    c.fillStyle = col;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.round(Math.sqrt(r * r - dy * dy));
      c.fillRect(cx - dx, cy + dy, 1, 1);
      c.fillRect(cx + dx, cy + dy, 1, 1);
    }
  }

  function pline(c, col, x0, y0, x1, y1, t) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      P(c, col, x0, y0, t, t);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  function seeded(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  function makeLayer(drawFn) {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    drawFn(off.getContext('2d'));
    return off;
  }

  const groundY = 234;

  // ── Backdrop: de_mirage golden hour — sky, sun, medina, palace wall ─
  const bg = makeLayer((c) => {
    const archTop = (cc, col, ax, ay, aw) => {
      cc.fillStyle = col;
      for (let dy = 0; dy <= aw / 2; dy++) {
        const dx = Math.floor(Math.sqrt(Math.max(0, (aw / 2) * (aw / 2) - dy * dy)));
        cc.fillRect(ax + aw / 2 - dx, ay - dy, dx * 2 + 1, 1);
      }
    };
    const stops = [[0, '#6faede'], [.28, '#9cc6e4'], [.5, '#c9d6d4'], [.68, '#e6d3a6'], [.84, '#f0ca8a'], [1, '#f6bd70']];
    let bandTop = 0;
    for (let i = 0; i < stops.length; i++) {
      const hor = 118 + SCENE_DY;
      const yEnd = i === stops.length - 1 ? hor : Math.round(stops[i + 1][0] * hor);
      P(c, stops[i][1], 0, bandTop, W, yEnd - bandTop);
      if (i > 0 && yEnd - bandTop > 4) pdith(c, stops[i][1], stops[i - 1][1], 0, bandTop, W, 2);
      bandTop = yEnd;
    }
    const st = seeded(21);
    for (let i = 0; i < 14; i++) {
      P(c, 'rgba(255,255,255,.75)', Math.floor(st() * W), Math.floor(st() * 30));
    }
    const cl = seeded(7);
    for (let i = 0; i < 5; i++) {
      const cx2 = Math.floor(cl() * W), cy2 = 14 + Math.floor(cl() * 70), cw2 = 34 + Math.floor(cl() * 60);
      pdith(c, '#f2ead6', '#ddd0b8', cx2, cy2, cw2, 2);
      pdith(c, '#faf6ea', '#f2ead6', cx2 + 6, cy2 - 2, cw2 - 16, 1);
    }
    const sx = 396, sy = 44;
    pring(c, 'rgba(255,240,200,.5)', sx, sy, 21);
    pring(c, 'rgba(255,244,214,.65)', sx, sy, 16);
    pcirc(c, '#ffeeb0', sx, sy, 11);
    pcirc(c, '#fff8d8', sx, sy, 8);
    pcirc(c, '#fffdf0', sx, sy, 4);
    pdith(c, '#fff8d8', '#c9d6d4', sx - 46, sy - 1, 93, 1);
    c.save();
    c.translate(0, SCENE_DY);
    const F = '#bd9260', FL = '#d4ab77';
    const sk = seeded(1337);
    let bx = -6;
    while (bx < W + 20) {
      const bw = Math.floor(26 + sk() * 42), bh = Math.floor(18 + sk() * 40), ty = 118 - bh;
      P(c, F, bx, ty, bw, bh);
      const kind = sk();
      if (kind < .22) {
        pcirc(c, F, bx + (bw >> 1), ty + 1, Math.max(3, bw >> 2));
        P(c, F, bx + (bw >> 1), ty - (bw >> 2) - 3, 1, 3);
        pcirc(c, FL, bx + (bw >> 1), ty, Math.max(2, (bw >> 2) - 1));
      } else if (kind < .4) {
        P(c, F, bx + (bw >> 1) - 2, ty - 16, 5, bh + 16);
        pcirc(c, F, bx + (bw >> 1), ty - 18, 3);
        P(c, FL, bx + (bw >> 1) - 1, ty - 15, 1, 12);
        P(c, '#8a6a44', bx + (bw >> 1) - 1, ty - 17, 1, 1);
      } else if (kind < .52) {
        P(c, F, bx + (bw >> 1), ty - 8, 2, 8);
        P(c, FL, bx + (bw >> 1) + 2, ty - 5, 2, 2);
      }
      bx += bw + 3 + Math.floor(sk() * 8);
    }
    const M = '#c99457', ML = '#ddb077';
    const md = seeded(555);
    let mx2 = -10;
    while (mx2 < W + 24) {
      const bw = Math.floor(36 + md() * 46), bh = Math.floor(22 + md() * 26), ty = 118 - bh;
      P(c, M, mx2, ty, bw, bh);
      P(c, ML, mx2, ty, bw, 1);
      P(c, M, mx2 + 3, ty - 3, 5, 3);
      P(c, M, mx2 + bw - 10, ty - 3, 7, 3);
      for (let wy = ty + 4; wy < 114; wy += 7) {
        for (let wx = mx2 + 4; wx < mx2 + bw - 5; wx += 8) {
          if (md() < .16) { P(c, '#fff2cc', wx, wy, 2, 3); P(c, '#fffdf0', wx, wy, 1, 1); }
          else P(c, '#8a6238', wx, wy, 2, 3);
        }
      }
      mx2 += bw + 5 + Math.floor(md() * 10);
    }
    // minaret (mid tower silhouette)
    {
      const nx0 = 58;
      P(c, M, nx0 + 4, 54, 4, 6);
      P(c, ML, nx0 + 4, 54, 1, 6);
      pcirc(c, M, nx0 + 6, 62, 4);
      pcirc(c, ML, nx0 + 5, 61, 2);
      P(c, '#e0b154', nx0 + 6, 56, 1, 3);
      P(c, M, nx0, 68, 12, 3);
      P(c, ML, nx0, 68, 12, 1);
      P(c, M, nx0 + 3, 71, 6, 14);
      P(c, M, nx0 - 1, 85, 14, 3);
      P(c, ML, nx0 - 1, 85, 14, 1);
      P(c, M, nx0 + 2, 88, 8, 30);
      P(c, ML, nx0 + 2, 88, 1, 30);
      P(c, '#8a6238', nx0 + 5, 76, 2, 4);
      P(c, '#8a6238', nx0 + 5, 96, 2, 4);
      P(c, '#fff2cc', nx0 + 5, 106, 2, 3);
    }
    // palace dome above medina roofs
    {
      const dcx = 296;
      P(c, M, dcx - 15, 96, 30, 22);
      P(c, ML, dcx - 15, 96, 30, 1);
      pcirc(c, M, dcx, 96, 15);
      for (let a2 = 195; a2 <= 330; a2 += 12) {
        const r2 = a2 * Math.PI / 180;
        P(c, ML, dcx + Math.round(Math.cos(r2) * 13), 96 + Math.round(Math.sin(r2) * 13));
      }
      P(c, '#e0b154', dcx, 78, 1, 4);
      P(c, '#e0b154', dcx - 1, 79, 3, 1);
      P(c, '#fff2cc', dcx - 5, 104, 3, 5);
      P(c, '#fff2cc', dcx + 3, 104, 3, 5);
    }
    const WA = '#d2a35f', WAL = '#e6bc7a', WAD = '#b07a45', WSH = '#8a5c34';
    P(c, WAD, 0, 118, W, groundY - 118);
    const wd = seeded(2024);
    for (let ry = 122; ry < groundY; ry += 8) {
      P(c, wd() < .5 ? WA : WAL, 0, ry, W, 5);
      for (let rx = ((ry / 8) | 0) % 2 ? 0 : 8; rx < W; rx += 16) P(c, WSH, rx + ((wd() * 3) | 0), ry + 5, 8, 1);
    }
    for (let k = 0; k < W; k += 16) {
      P(c, WA, k, 110, 9, 8);
      P(c, WAL, k, 110, 9, 2);
      P(c, WAD, k, 116, 9, 2);
    }
    P(c, WAL, 0, 117, W, 1);
    P(c, WSH, 0, 118, W, 1);
    // palace tower with balcony and hanging rug (Mirage A-ramp palace)
    {
      P(c, '#dcb277', 0, 58, 98, 60);
      P(c, '#eeca8c', 0, 58, 98, 2);
      P(c, '#b07a45', 0, 116, 98, 2);
      for (let tx = -2; tx < 100; tx += 10) P(c, '#c99457', tx, 50, 6, 8);
      P(c, '#b07a45', 0, 56, 98, 1);
      [[14], [58]].forEach(([wxp]) => {
        P(c, '#3a9188', wxp - 2, 70, 24, 30);
        P(c, '#4a3020', wxp, 74, 20, 26);
        archTop(c, '#4a3020', wxp, 75, 20);
        P(c, '#2e6e68', wxp - 2, 70, 24, 2);
        P(c, '#e6bc7a', wxp - 3, 99, 26, 3);
        P(c, 'rgba(255,255,255,.14)', wxp + 4, 76, 3, 22);
      });
      P(c, '#e0b154', 46, 64, 1, 5);
      P(c, '#8a5230', 43, 69, 7, 7);
      pcirc(c, 'rgba(255,214,140,.35)', 46, 72, 5);
      pcirc(c, '#ffd98c', 46, 72, 3);
      pcirc(c, '#fff2cc', 46, 72, 1);
      P(c, '#8a5c34', 0, 102, 98, 3);
      P(c, '#b07a45', 0, 100, 98, 2);
      for (let vx = 3; vx < 96; vx += 6) P(c, '#a06a38', vx, 105, 2, 8);
      P(c, '#b07a45', 0, 112, 98, 2);
      // rug draped over balcony rail
      P(c, '#7d241f', 34, 103, 32, 18);
      P(c, '#a8352f', 36, 104, 28, 16);
      P(c, '#e0b154', 36, 107, 28, 2);
      P(c, '#e0b154', 36, 114, 28, 2);
      P(c, '#e0b154', 47, 109, 6, 4);
      for (let sc = 36; sc < 64; sc += 4) if (((sc / 4) | 0) % 2) { P(c, '#a8352f', sc, 120, 4, 2); }
      P(c, 'rgba(0,0,0,.25)', 60, 104, 4, 15);
      pcirc(c, '#c9ced8', 82, 44, 5);
      pcirc(c, '#eef1f6', 81, 43, 3);
      pline(c, '#5d5f68', 82, 44, 86, 48, 1);
      P(c, '#5d5f68', 85, 47, 2, 2);
    }
    [[168], [322]].forEach(([nx]) => {
      const nw = 34, nh = 46, ny = groundY - nh - 6;
      P(c, '#5d3a24', nx, ny + 8, nw, nh - 6);
      archTop(c, '#5d3a24', nx, ny + 9, nw);
      P(c, WSH, nx - 3, ny + 4, 3, nh + 6);
      P(c, WSH, nx + nw, ny + 4, 3, nh + 6);
      P(c, WAL, nx - 3, ny + 4, nw + 6, 2);
      P(c, WSH, nx - 3, groundY - 4, nw + 6, 2);
      P(c, '#ffcf8e', nx + 6, ny + 16, 2, 2);
    });
    // striped awning over left niche (Mirage market tarps)
    {
      P(c, '#5d3820', 159, 171, 45, 2);
      P(c, '#7a4a26', 159, 171, 45, 1);
      for (let si = 0; si < 11; si++) {
        const acol = si % 2 ? '#e6d9be' : '#b8433a';
        P(c, acol, 160 + si * 4, 173, 4, 6);
        P(c, 'rgba(0,0,0,.22)', 160 + si * 4, 177, 4, 1);
        if (si % 2) P(c, acol, 160 + si * 4, 179, 4, 2);
      }
    }
    // teal arched door
    {
      P(c, '#2e6e68', 106, 176, 38, 58);
      archTop(c, '#2e6e68', 107, 177, 36);
      P(c, '#3a9188', 109, 179, 32, 55);
      for (let dp = 112; dp < 141; dp += 7) P(c, '#2e7d74', dp, 181, 1, 51);
      P(c, '#245550', 109, 205, 32, 2);
      pcirc(c, '#e0b154', 136, 206, 2);
      P(c, '#e6bc7a', 103, 232, 44, 2);
      P(c, 'rgba(255,255,255,.12)', 111, 181, 3, 50);
    }
    // shuttered windows
    [[258], [306]].forEach(([wxp]) => {
      P(c, '#4a3020', wxp + 5, 150, 14, 26);
      P(c, '#3a9188', wxp, 149, 5, 28);
      P(c, '#3a9188', wxp + 19, 149, 5, 28);
      for (let sl = 152; sl < 176; sl += 4) { P(c, '#2e7d74', wxp, sl, 5, 1); P(c, '#2e7d74', wxp + 19, sl, 5, 1); }
      P(c, '#e6bc7a', wxp - 1, 146, 26, 3);
      P(c, '#b07a45', wxp - 1, 177, 26, 2);
    });
    // potted plants
    [[152], [354]].forEach(([pxp]) => {
      pcirc(c, '#3e7a3a', pxp, groundY - 16, 6);
      pcirc(c, '#57984a', pxp - 3, groundY - 18, 4);
      pcirc(c, '#2e5e2e', pxp + 3, groundY - 15, 4);
      P(c, '#a85a32', pxp - 5, groundY - 12, 10, 8);
      P(c, '#c06a3c', pxp - 5, groundY - 12, 10, 2);
      P(c, '#7d3f20', pxp - 5, groundY - 5, 10, 2);
    });
    const rx2 = 214, ry2 = 132;
    P(c, '#5d3a20', rx2 - 2, ry2 - 3, 34, 3);
    P(c, '#7d241f', rx2, ry2, 30, 52);
    P(c, '#a8352f', rx2 + 2, ry2 + 2, 26, 48);
    P(c, '#e0b154', rx2 + 2, ry2 + 8, 26, 2);
    P(c, '#e0b154', rx2 + 2, ry2 + 40, 26, 2);
    P(c, '#2e2a33', rx2 + 8, ry2 + 16, 14, 18);
    P(c, '#e0b154', rx2 + 12, ry2 + 20, 6, 10);
    for (let tz = 0; tz < 30; tz += 3) P(c, '#7d241f', rx2 + tz, ry2 + 52, 2, 4);
    const bigAx = 372;
    P(c, '#31200e', bigAx, 162, 52, groundY - 162);
    archTop(c, '#31200e', bigAx, 163, 52);
    P(c, '#5d3820', bigAx + 4, 168, 44, 2);
    pcirc(c, '#ff9a58', bigAx + 26, 186, 3);
    pcirc(c, '#ffcf8e', bigAx + 26, 186, 1);
    P(c, '#5d3820', bigAx - 6, groundY - 4, 64, 4);
    // lantern sconces flanking the arch
    [[362], [430]].forEach(([lx]) => {
      P(c, '#4a3020', lx, 178, 8, 2);
      P(c, '#2e2418', lx + 2, 180, 4, 4);
      P(c, '#ffd98c', lx + 1, 184, 6, 7);
      P(c, '#fff2cc', lx + 3, 186, 2, 3);
      P(c, '#4a3020', lx, 191, 8, 2);
      pcirc(c, 'rgba(255,214,140,.28)', lx + 4, 187, 7);
    });
    pdith(c, '#b06a3a', '#6a4e34', bigAx + 4, groundY + 2, 44, 2);
    const gm = seeded(88);
    for (let i = 0; i < 60; i++) P(c, gm() < .5 ? WSH : WAD, Math.floor(gm() * W), 124 + Math.floor(gm() * (groundY - 128)), 2, 1);
    for (let fx2 = 4; fx2 < W - 20; fx2 += 22) {
      P(c, '#4a3f2c', fx2, 108, 22, 1);
      const fc = ['#a8352f', '#e0b154', '#3ecf5e', '#4a90d9'][(fx2 / 22 | 0) % 4];
      P(c, fc, fx2 + 4, 109, 6, 5);
      P(c, fc, fx2 + 4, 114, 3, 2);
    }
    P(c, '#6a4e30', 0, groundY, W, 16);
    P(c, '#57402a', 0, groundY + 16, W, 20);
    P(c, '#453222', 0, groundY + 36, W, H - groundY - 36);
    pdith(c, '#6a4e30', '#57402a', 0, groundY + 14, W, 2);
    pdith(c, '#57402a', '#453222', 0, groundY + 34, W, 2);
    pdith(c, '#f2ca8a', '#6a4e30', 0, groundY, W, 2);
    const gd = seeded(99);
    for (let gy2 = groundY + 6; gy2 < H - 4; gy2 += 9) {
      P(c, '#7a5c3a', 0, gy2, W, 1);
      for (let gx2 = ((gy2 / 9) | 0) % 2 ? 0 : 10; gx2 < W; gx2 += 22) P(c, '#7a5c3a', gx2, gy2 - 8, 1, 8);
    }
    for (let i = 0; i < 34; i++) P(c, gd() < .5 ? '#84683f' : '#503a24', Math.floor(gd() * W), groundY + 4 + Math.floor(gd() * (H - groundY - 8)), 2, 1);
    // sunlight pool spilling from the arch
    pdith(c, '#9c7844', '#6a4e30', bigAx - 4, groundY + 2, 62, 12);
    pdith(c, '#b58c52', '#84683f', bigAx + 4, groundY + 4, 48, 6);
    c.restore();
  });

  const PEEK_SPOTS = [
    { x: 92, y: 200, dir: 1 },
    { x: 252, y: 192, dir: -1 },
    { x: 398, y: 224, dir: -1 },
  ];

  // ── Foreground: A-site crates, sandbag wall, arch sill, light shafts ─
  function crate(c, x0, y0, cw, chh) {
    P(c, '#4a2f1a', x0, y0, cw, chh);
    for (let p = 0; p < Math.floor(cw / 13); p++) {
      P(c, p % 2 ? '#8a5c34' : '#75492a', x0 + 2 + p * 13, y0 + 3, 12, chh - 6);
      P(c, 'rgba(255,220,160,.18)', x0 + 2 + p * 13, y0 + 3, 12, 1);
      P(c, '#5d3a20', x0 + 2 + p * 13, y0 + chh - 4, 12, 1);
    }
    P(c, '#96683a', x0, y0, cw, 3);
    P(c, '#b07a45', x0, y0, cw, 1);
    P(c, '#96683a', x0, y0 + chh - 3, cw, 3);
    pline(c, '#5d3a20', x0 + 4, y0 + 4, x0 + cw - 4, y0 + chh - 5, 2);
    pline(c, '#5d3a20', x0 + cw - 4, y0 + 4, x0 + 4, y0 + chh - 5, 2);
    [[x0, y0], [x0 + cw - 5, y0], [x0, y0 + chh - 5], [x0 + cw - 5, y0 + chh - 5]].forEach(([qx, qy]) => {
      P(c, '#8f97a6', qx, qy, 5, 5);
      P(c, '#aab2c0', qx, qy, 5, 1);
      P(c, '#3a3f4a', qx + 2, qy + 2, 1, 1);
    });
  }

  function barrel(c, bx, gy) {
    const bw = 20, bh = 30, x0 = bx - 10, y0 = gy - bh;
    for (let i = 0; i < bw; i++) {
      P(c, i < 3 ? '#4a5468' : i > 16 ? '#333a48' : '#3f4757', x0 + i, y0, 1, bh);
    }
    P(c, '#5a6578', x0, y0, bw, 2);
    P(c, '#5a6578', x0, y0 + 13, bw, 2);
    P(c, '#2a303e', x0, gy - 2, bw, 2);
    pcirc(c, '#333a48', bx, y0, bw >> 1);
    P(c, '#8a4a2a', x0 + 4, y0 + 6, 2, 2);
    P(c, '#8a4a2a', x0 + 13, y0 + 20, 2, 1);
  }

  function sandbags(c, x, gy, rows) {
    for (let row = 0; row < rows; row++) {
      const n = 4, off = row % 2 ? -7 : 0;
      for (let b = 0; b <= n; b++) {
        const sbx = x + off + b * 15, sby = gy - 6 * (row + 1);
        if (sbx < x - 8 || sbx > x + 62) continue;
        P(c, row % 2 ? '#6a5c40' : '#7a6a4a', sbx, sby, 14, 6);
        P(c, '#96865f', sbx, sby, 14, 1);
        P(c, '#4a3f2c', sbx, sby + 5, 14, 1);
        P(c, '#55482f', sbx + 4, sby + 2, 1, 3);
        P(c, '#55482f', sbx + 9, sby + 2, 1, 3);
      }
    }
    P(c, '#96865f', x - 1, gy - 6 * rows, 62, 1);
  }

  function shadow(c, x0, w) {
    c.fillStyle = 'rgba(10,6,4,.35)';
    c.fillRect(x0, groundY + 1, w, 3);
    c.fillRect(x0 + 2, groundY + 4, w - 4, 2);
  }

  const fg = makeLayer((c) => {
    c.save();
    c.translate(0, SCENE_DY);
    shadow(c, 50, 116);
    crate(c, 56, 194, 72, 40);
    // teal tarp draped over the crate stack (Mirage A-site boxes)
    P(c, '#1f6478', 50, 188, 84, 10);
    P(c, '#2e86a0', 52, 190, 80, 5);
    for (let fold = 58; fold < 130; fold += 12) {
      P(c, '#17505f', fold, 189, 2, 8);
      P(c, 'rgba(255,255,255,.16)', fold + 3, 190, 1, 4);
    }
    for (let sag = 50; sag < 134; sag += 8) P(c, '#1f6478', sag, 197 + (((sag / 8) | 0) % 2 ? 1 : 0), 6, 2);
    P(c, '#e0b154', 54, 191, 2, 2);
    P(c, '#e0b154', 128, 191, 2, 2);
    P(c, '#e0b154', 78, 206, 28, 9);
    P(c, '#4a2f1a', 80, 208, 24, 5);
    barrel(c, 148, groundY);
    shadow(c, 136, 22);
    crate(c, 34, 216, 22, 16);
    P(c, '#aab2c0', 40, 222, 10, 4);

    shadow(c, 218, 68);
    sandbags(c, 220, groundY, 8);
    shadow(c, 186, 32);
    crate(c, 190, 210, 26, 22);
    pline(c, '#5d3a20', 193, 213, 213, 229, 1);
    // ammo crate
    P(c, '#3d4a30', 300, groundY - 13, 34, 13);
    P(c, '#55663f', 300, groundY - 13, 34, 2);
    P(c, '#2c3620', 300, groundY - 3, 34, 3);
    P(c, '#c9ced8', 305, groundY - 9, 14, 2);
    P(c, '#c9ced8', 305, groundY - 6, 9, 1);
    P(c, 'rgba(255,255,255,.12)', 301, groundY - 11, 2, 10);
    // pallet leaning by the barrel
    pline(c, '#7a5230', 158, 230, 176, 204, 3);
    pline(c, '#8a6238', 159, 231, 177, 205, 1);
    pline(c, '#6a4326', 164, 232, 182, 206, 3);

    P(c, '#caa05e', 368, 228, 60, 2);
    P(c, '#96683a', 370, 230, 56, 4);
    P(c, '#7a5230', 370, 232, 56, 2);
    shadow(c, 372, 52);
    for (let k = 0; k < 5; k++) {
      P(c, '#d9a76a', 370 + k * 12, 162 + (k === 2 ? -3 : 0), 10, 4);
      P(c, '#b07a45', 370 + k * 12, 165 + (k === 2 ? -3 : 0), 10, 2);
    }

    P(c, '#3e2f24', 300, groundY + 14, 18, 3);
    P(c, '#3e2f24', 120, groundY + 30, 14, 2);
    P(c, '#4e3a28', 460, groundY + 22, 16, 3);
    P(c, '#5d3a20', 44, groundY + 38, 30, 2);

    // player viewmodel: AK silhouette from bottom-right
    P(c, '#14171f', 446, 252, 66, 36);
    P(c, '#20242f', 446, 252, 66, 3);
    pline(c, '#14171f', 452, 256, 420, 241, 5);
    pline(c, '#2b3140', 452, 253, 421, 239, 1);
    P(c, '#14171f', 418, 231, 3, 8);
    P(c, '#0e1119', 430, 260, 12, 28);
    P(c, '#7a4a26', 442, 256, 10, 6);
    P(c, '#96683c', 442, 256, 10, 1);
    P(c, '#2e2a33', 434, 247, 15, 10);
    P(c, '#474052', 434, 247, 15, 2);
    P(c, '#2e2a33', 458, 264, 13, 10);
    P(c, '#474052', 458, 264, 13, 2);

    c.globalAlpha = .06;
    c.fillStyle = '#ffd9a0';
    c.beginPath();
    c.moveTo(70, 0); c.lineTo(230, 0); c.lineTo(360, groundY); c.lineTo(160, groundY);
    c.closePath(); c.fill();
    c.globalAlpha = .07;
    c.fillStyle = '#ffe2ae';
    c.beginPath();
    c.moveTo(378, 168); c.lineTo(420, 166); c.lineTo(456, groundY); c.lineTo(396, groundY);
    c.closePath(); c.fill();
    c.globalAlpha = .04;
    c.beginPath();
    c.moveTo(250, 0); c.lineTo(330, 0); c.lineTo(430, groundY); c.lineTo(360, groundY);
    c.closePath(); c.fill();
    c.globalAlpha = 1;
    c.restore();

    [['rgba(5,8,15,.12)', 14], ['rgba(5,8,15,.09)', 9], ['rgba(5,8,15,.07)', 5], ['rgba(5,8,15,.05)', 2]].forEach(([col, bw]) => {
      c.fillStyle = col;
      c.fillRect(0, 0, W, bw);
      c.fillRect(0, H - bw, W, bw);
      c.fillRect(0, bw, bw, H - bw * 2);
      c.fillRect(W - bw, bw, bw, H - bw * 2);
    });

    P(c, '#10141f', 10, 10, 92, 17);
    P(c, '#e0b154', 10, 10, 92, 1);
    P(c, '#e0b154', 10, 26, 92, 1);
    P(c, '#e0b154', 10, 10, 1, 17);
    P(c, '#e0b154', 101, 10, 1, 17);
    c.font = 'bold 9px Consolas,monospace';
    c.fillStyle = '#ffd166';
    c.fillText('DE_MIRAGE', 18, 22);
    P(c, '#2e2a33', 74, 13, 9, 11);
    P(c, '#e0b154', 74, 17, 9, 2);
    P(c, '#ff5a4d', 78, 11, 2, 2);
    c.globalAlpha = .32;
    const cm = 14, cl = 24, ct = 2;
    [[cm, cm, 1, 1], [W - cm, cm, -1, 1], [cm, H - cm, 1, -1], [W - cm, H - cm, -1, -1]].forEach(([qx, qy, dx, dy]) => {
      P(c, '#ebf0ff', dx > 0 ? qx : qx - cl, qy, cl, ct);
      P(c, '#ebf0ff', dx > 0 ? qx : qx - ct, dy > 0 ? qy : qy - cl, ct, cl);
    });
    c.globalAlpha = 1;
  });

  const motes = Array.from({ length: 18 }, () => ({
    fx: Math.random() * W, fy: Math.random() * (groundY - 10),
    spd: .08 + Math.random() * .22, ph: Math.random() * 6.28,
    col: Math.random() < .7 ? '#ffd9a0' : '#cdd6ff',
  }));

  const birds = Array.from({ length: 4 }, (_, i) => ({
    x: Math.random() * W, y: 20 + i * 11 + Math.random() * 8,
    spd: .22 + Math.random() * .3, ph: Math.random() * 6,
  }));

  const MUZZLE = [420, 240];

  const scan = makeLayer((c) => {
    c.fillStyle = 'rgba(0,0,0,.09)';
    for (let y = 1; y < H; y += 3) c.fillRect(0, y, W, 1);
  });

  // ── Enemy: Phoenix terrorist — balaclava, red jacket, AK-47 ──────
  const PAL = {
    bal: '#1b1b22', balL: '#33333f', balD: '#0e0e14',
    skin: '#d29a6a', skinD: '#a06c49', pup: '#181420',
    jak: '#a8352f', jakL: '#c8504a', jakD: '#7d241f',
    rig: '#8a7a55', rigD: '#6a5c40', pch: '#4a4232', pchL: '#5d543f', gold: '#e0b154',
    pants: '#232330', boot: '#14141c', sole: '#000006',
    glove: '#2e2a33', gloveL: '#474052',
    gun: '#22262e', gunL: '#3d4552', metal: '#78828f', metalL: '#9aa3b0',
    wood: '#7a4a26', woodL: '#96683c', woodD: '#5d3820',
  };

  function drawEnemy(c, x, fy, step, alpha) {
    if (alpha != null) c.globalAlpha = alpha;
    const oy = (3 - Math.min(step, 3)) * 10;
    const cx = x, hy = fy - 48 - oy;
    pcirc(c, PAL.balD, cx + 1, hy + 1, 8);
    pcirc(c, PAL.bal, cx, hy, 8);
    for (let a = -150; a <= -30; a += 15) {
      const rad = a * Math.PI / 180;
      P(c, PAL.balL, cx + Math.round(Math.cos(rad) * 6), hy + Math.round(Math.sin(rad) * 6));
    }
    P(c, PAL.skin, cx - 5, hy - 2, 11, 3);
    P(c, PAL.skinD, cx - 5, hy + 1, 11, 1);
    P(c, PAL.pup, cx - 3, hy - 2, 2, 2);
    P(c, PAL.pup, cx + 2, hy - 2, 2, 2);
    P(c, '#fff', cx - 3, hy - 2, 1, 1);
    P(c, '#fff', cx + 2, hy - 2, 1, 1);
    P(c, PAL.skinD, cx - 4, hy + 4, 2, 1);
    P(c, PAL.skinD, cx + 1, hy + 5, 2, 1);
    P(c, PAL.skinD, cx - 1, hy + 3, 1, 2);
    P(c, PAL.jakD, cx - 3, hy + 6, 7, 4);
    P(c, PAL.jakD, cx - 13, hy + 9, 27, 5);
    P(c, PAL.jak, cx - 10, hy + 12, 21, 19);
    P(c, PAL.jakL, cx - 10, hy + 12, 21, 1);
    P(c, PAL.jakL, cx + 9, hy + 13, 2, 17);
    P(c, PAL.jakD, cx - 10, hy + 13, 2, 17);
    P(c, PAL.jakD, cx, hy + 13, 1, 16);
    pline(c, PAL.rig, cx - 8, hy + 12, cx - 2, hy + 22, 3);
    pline(c, PAL.rig, cx + 8, hy + 12, cx + 2, hy + 22, 3);
    P(c, PAL.rig, cx - 8, hy + 20, 18, 4);
    P(c, '#a89a6e', cx - 8, hy + 20, 18, 1);
    [cx - 8, cx - 1, cx + 6].forEach((px) => {
      P(c, PAL.pch, px, hy + 24, 5, 6);
      P(c, PAL.pchL, px, hy + 24, 5, 1);
      P(c, PAL.gold, px + 2, hy + 26, 1, 1);
    });
    P(c, PAL.rigD, cx - 10, hy + 31, 21, 2);
    P(c, PAL.jakD, cx - 13, hy + 12, 4, 10);
    P(c, PAL.glove, cx - 11, hy + 22, 4, 4);
    P(c, PAL.gloveL, cx - 11, hy + 22, 4, 1);
    pline(c, PAL.jak, cx + 8, hy + 15, cx + 12, hy + 21, 3);
    P(c, PAL.jakD, cx + 10, hy + 20, 4, 3);
    P(c, PAL.glove, cx + 8, hy + 23, 4, 4);
    P(c, PAL.gloveL, cx + 8, hy + 23, 4, 1);
    P(c, PAL.woodD, cx - 14, hy + 16, 3, 6);
    pline(c, PAL.wood, cx - 12, hy + 18, cx - 4, hy + 21, 3);
    P(c, PAL.gun, cx - 4, hy + 18, 17, 4);
    P(c, PAL.metal, cx - 4, hy + 17, 17, 1);
    P(c, PAL.metalL, cx - 5, hy + 19, 2, 1);
    P(c, PAL.metal, cx + 1, hy + 15, 1, 2);
    P(c, PAL.woodD, cx + 2, hy + 22, 3, 5);
    P(c, PAL.woodD, cx + 2, hy + 26, 2, 2);
    P(c, PAL.gun, cx + 6, hy + 23, 1, 2);
    P(c, PAL.gun, cx + 7, hy + 22, 5, 3);
    P(c, PAL.gunL, cx + 7, hy + 22, 1, 3);
    P(c, PAL.gun, cx + 9, hy + 25, 5, 3);
    P(c, PAL.gunL, cx + 9, hy + 25, 1, 3);
    P(c, PAL.gun, cx + 11, hy + 28, 4, 3);
    P(c, PAL.gunL, cx + 11, hy + 28, 1, 3);
    P(c, PAL.gun, cx + 12, hy + 31, 4, 3);
    P(c, PAL.wood, cx + 13, hy + 19, 9, 4);
    P(c, PAL.woodL, cx + 13, hy + 19, 9, 1);
    P(c, PAL.metal, cx + 13, hy + 17, 9, 1);
    P(c, PAL.metal, cx + 22, hy + 15, 2, 4);
    P(c, PAL.metal, cx + 22, hy + 19, 11, 2);
    P(c, PAL.metalL, cx + 33, hy + 19, 2, 2);
    P(c, PAL.pants, cx - 8, hy + 33, 7, 8);
    P(c, PAL.pants, cx + 2, hy + 33, 7, 8);
    P(c, PAL.boot, cx - 9, hy + 40, 6, 6);
    P(c, PAL.boot, cx + 2, hy + 40, 6, 6);
    P(c, PAL.sole, cx - 9, hy + 45, 8, 2);
    P(c, PAL.sole, cx + 2, hy + 45, 8, 2);
    P(c, PAL.gold, cx + 8, hy + 15, 2, 2);
    if (alpha != null) c.globalAlpha = 1;
  }

  const eTmp = document.createElement('canvas');
  eTmp.width = 96; eTmp.height = 100;
  const etc = eTmp.getContext('2d');
  function blitEnemy(x, fy, step, dir, alpha) {
    etc.clearRect(0, 0, 96, 100);
    drawEnemy(etc, 48, 94, step);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x), Math.round(fy));
    if (dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(eTmp, -48, -94);
    ctx.restore();
  }

  function drawFrame(now) {
    let ox = 0, oyS = 0;
    if (shake > 0) {
      ox = Math.round((Math.random() - .5) * shake);
      oyS = Math.round((Math.random() - .5) * shake);
      shake *= .86;
      if (shake < .4) shake = 0;
    }
    ctx.save();
    ctx.translate(ox, oyS);
    ctx.drawImage(bg, 0, 0);
    birds.forEach((b) => {
      b.x += b.spd;
      if (b.x > W + 6) b.x = -6;
      const wy = b.y + Math.round(Math.sin(now / 600 + b.ph) * 2);
      const up = Math.sin(now / 130 + b.ph) > 0;
      P(ctx, '#2b2038', b.x | 0, wy);
      P(ctx, '#2b2038', (b.x | 0) + (up ? -2 : 2), wy - (up ? 1 : 0));
    });
    ctx.save();
    ctx.translate(0, SCENE_DY);
    motes.forEach((m) => {
      m.fy -= m.spd;
      if (m.fy < 2) { m.fy = groundY - 4; m.fx = Math.random() * W; }
      if (Math.sin(now / 450 + m.ph) > -.3) P(ctx, m.col, m.fx | 0, m.fy | 0);
    });
    if (spot && stage === 'ready' && !fallAt) {
      const el2 = now - appearAt;
      if (runMode) {
        enemyX = 36 + Math.min(1, el2 / 700) * 430;
        blitEnemy(enemyX, 226 + Math.round(Math.abs(Math.sin(el2 / 110)) * -2), ((el2 / 120) | 0) % 2 ? 2 : 3, 1);
      } else {
        const step = curDy ? 3 : Math.min(3, 1 + Math.floor(el2 / 60));
        const slideX = -curDir * Math.max(0, 26 - el2 / 9);
        const bob = step >= 3 && !curDy ? Math.round(Math.sin(el2 / 150)) : 0;
        enemyX = spot[0] + slideX;
        blitEnemy(enemyX, spot[1] + 6 + curDy + bob, step, mirror ? -1 : 1);
        if (el2 < 260) {
          const ax = enemyX + curDir * 14, ay = spot[1] - 58;
          P(ctx, '#10131d', ax - 2, ay - 3, 7, 14);
          P(ctx, '#ffd166', ax - 1, ay - 2, 4, 8);
          P(ctx, '#ffd166', ax - 1, ay + 7, 4, 3);
        }
      }
    }
    if (fallAt && spot) {
      const f = Math.min(1, (now - fallAt) / 260);
      blitEnemy(enemyX || spot[0], (runMode ? 226 : spot[1] + 6 + curDy) + f * 44, 0, mirror ? -1 : 1, 1 - f * .8);
    }
    ctx.drawImage(fg, 0, 0);
    if (tracer && now - tracer.t0 < 70) {
      ctx.globalAlpha = (1 - (now - tracer.t0) / 70) * .8;
      pline(ctx, '#fff3d0', MUZZLE[0], MUZZLE[1], tracer.x1, tracer.y1, 1);
      ctx.globalAlpha = 1;
    }
    if (flashT && now - flashT < 75) {
      const mf = 1 - (now - flashT) / 75;
      ctx.globalAlpha = mf;
      pcirc(ctx, '#ff9a58', MUZZLE[0], MUZZLE[1], 10);
      pcirc(ctx, '#ffd166', MUZZLE[0], MUZZLE[1], 7);
      pcirc(ctx, '#fff6da', MUZZLE[0], MUZZLE[1], 4);
      P(ctx, '#fff6da', MUZZLE[0] - 14, MUZZLE[1] - 1, 6, 2);
      P(ctx, '#fff6da', MUZZLE[0] - 3, MUZZLE[1] - 12, 2, 6);
      P(ctx, '#ffd166', MUZZLE[0] + 5, MUZZLE[1] + 4, 5, 2);
      P(ctx, '#ffd166', MUZZLE[0] + 3, MUZZLE[1] - 9, 2, 5);
      ctx.globalAlpha = 1;
    }
    if (efGun && now - efT < 240) {
      const k = (now - efT) / 240;
      ctx.globalAlpha = 1 - k;
      pcirc(ctx, '#fff6da', efGun[0], efGun[1], 4);
      pcirc(ctx, '#ffd166', efGun[0], efGun[1], 7);
      pcirc(ctx, '#ff9a58', efGun[0], efGun[1], 10);
      pline(ctx, '#ff8a5a', efGun[0], efGun[1], W * .55, H + 24, 1);
      pline(ctx, '#ffb066', efGun[0], efGun[1] + 2, W * .48, H + 28, 1);
      P(ctx, 'rgba(255,46,36,' + (.3 * (1 - k)).toFixed(3) + ')', 0, -SCENE_DY, W, H);
      ctx.globalAlpha = 1;
    }
    if (stage === 'ready' && spot && !fallAt) {
      const cyc = (now - appearAt) % 360;
      if (cyc < 100) {
        const gx = spot[0] + 35, gy = spot[1] - 22;
        pcirc(ctx, '#fff3d0', gx, gy, 3);
        P(ctx, '#ffd166', gx - 6, gy - 1, 12, 2);
        P(ctx, '#ffd166', gx - 1, gy - 6, 2, 12);
        P(ctx, '#fff6da', gx - 2, gy, 5, 1);
        ctx.globalAlpha = .45;
        pline(ctx, '#ffcf8e', gx, gy, W / 2 + 40, groundY + SCENE_DY + 40, 1);
        pline(ctx, '#ff9a58', gx - 3, gy + 2, W / 2 + 20, groundY + SCENE_DY + 44, 1);
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    if (stage === 'ready' && spot && !fallAt) {
      const rem = Math.max(0, 1 - (now - appearAt) / curDL);
      const bw = W - 120, bx2 = 60;
      P(ctx, 'rgba(9,13,22,.65)', bx2 - 2, 12, bw + 4, 9);
      P(ctx, rem > .4 ? '#ffd166' : '#ff5a4d', bx2, 14, Math.round(bw * rem), 5);
    }
    for (let i = 0; i < attempts; i++) {
      const dx = W - 16 - i * 12;
      pring(ctx, '#ebf0ff', dx, 15, 3);
      if (i < done) { pcirc(ctx, '#10141f', dx, 15, 2); pcirc(ctx, '#ffd166', dx, 15, 2); }
    }
    ctx.font = 'bold 8px Consolas,monospace';
    ctx.textAlign = 'right';
    for (let i = feeds.length - 1; i >= 0; i--) {
      const fe = feeds[i];
      const age = now - fe.t0;
      if (age > 2600) { feeds.splice(i, 1); continue; }
      ctx.globalAlpha = age > 2000 ? Math.max(0, 1 - (age - 2000) / 600) : 1;
      ctx.fillStyle = fe.col;
      ctx.fillText(fe.text, W - 26, 32 + i * 10);
    }
    ctx.globalAlpha = 1;
    if (pb > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(235,240,255,.6)';
      ctx.fillText('PB ' + pb + 'MS', 14, 36);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--;
      if (p.bounce && p.y > groundY + SCENE_DY + 6) { p.y = groundY + SCENE_DY + 6; p.vy *= -.45; p.vx *= .7; }
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life / 14);
      P(ctx, p.col, p.x | 0, p.y | 0, p.sz, p.sz);
    }
    ctx.globalAlpha = 1;
    ctx.font = 'bold 11px Consolas,monospace';
    ctx.textAlign = 'center';
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i];
      const age = now - f.t0;
      if (age > 750) { floats.splice(i, 1); continue; }
      f.y -= .55;
      ctx.font = f.big ? 'bold 13px Consolas,monospace' : 'bold 11px Consolas,monospace';
      ctx.globalAlpha = 1 - age / 750;
      ctx.strokeStyle = '#10131d';
      ctx.lineWidth = 3;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.col;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i];
      const age = now - m.t0;
      if (age > 260) { markers.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - age / 260;
      const L = 7;
      pline(ctx, '#ffffff', m.x - L, m.y - L, m.x - 2, m.y - 2, 1);
      pline(ctx, '#ffffff', m.x + 2, m.y + 2, m.x + L, m.y + L, 1);
      pline(ctx, '#ffffff', m.x - L, m.y + L, m.x - 2, m.y + 2, 1);
      pline(ctx, '#ffffff', m.x + 2, m.y - 2, m.x + L, m.y - L, 1);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(scan, 0, 0);
    rafId = requestAnimationFrame(drawFrame);
  }

  function setHint(text, mode) {
    hint.textContent = text;
    hint.style.display = text ? '' : 'none';
    scene.className = 'react-scene' + (mode ? ' ' + mode : '');
  }

  function finish() {
    clearTimeout(timer);
    cancelAnimationFrame(rafId);
    spot = null;
    fallAt = 0;
    stage = 'finished';
    const dur = Date.now() - startTime;
    const avgMs = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
    const bestMs = reactionTimes.length ? Math.min.apply(null, reactionTimes) : 0;
    setHint('');
    const res = el('div', 'quiz-result');
    res.appendChild(el('div', 'quiz-score', t('gm_result').replace('{0}', hit).replace('{1}', attempts)));
    const avgLine = el('div', 'quiz-score');
    avgLine.textContent = 'Среднее время реакции: ' + avgMs + ' мс';
    res.appendChild(avgLine);
    const bestLine = el('div', 'quiz-score');
    bestLine.textContent = fmt(t('gm_react_best'), bestMs);
    res.appendChild(bestLine);
    let newRec = false;
    if (bestMs > 0 && (!pb || bestMs < pb)) {
      try { localStorage.setItem(pbKey, String(bestMs)); newRec = true; } catch (e) {}
    }
    if (reactionTimes.length) {
      const hsLine = el('div', 'quiz-score');
      hsLine.textContent = 'Хедшотов: ' + hsCount + ' из ' + reactionTimes.length;
      res.appendChild(hsLine);
    }
    if (newRec) {
      const recBadge = el('div', 'rec-badge');
      recBadge.textContent = '★ НОВЫЙ РЕКОРД!';
      res.appendChild(recBadge);
    } else if (pb > 0 && bestMs > 0) {
      const pbLine = el('div', 'quiz-score');
      pbLine.textContent = 'Личный рекорд: ' + Math.min(pb, bestMs) + ' мс';
      res.appendChild(pbLine);
    }
    const detailLine = el('div', 'quiz-score');
    detailLine.textContent = reactionTimes.map((ms, i) => (i + 1) + ': ' + ms + 'мс').join(' | ');
    res.appendChild(detailLine);
    scene.innerHTML = '';
    scene.className = 'react-scene finished';
    scene.appendChild(res);
    const again = el('button', 'link-btn');
    again.appendChild(iconEl('refresh'));
    again.appendChild(document.createTextNode(t('gm_play_again')));
    again.addEventListener('click', () => startGame(game));
    scene.appendChild(again);
    const back = el('button', 'link-btn');
    back.appendChild(iconEl('back'));
    back.appendChild(document.createTextNode(t('gm_back')));
    back.addEventListener('click', () => { gamesCache = null; renderGames(); });
    scene.appendChild(back);
    submitGameResult(game, hit, attempts, dur);
  }

  function nextAttempt(delay) {
    timer = setTimeout(() => {
      if (done >= attempts) { finish(); return; }
      state.textContent = fmt(t('gm_react_attempt'), done + 1, attempts);
      startWait();
    }, delay);
  }

  function missPeek() {
    if (stage !== 'ready') return;
    const nowT = performance.now();
    done++;
    stage = 'cooldown';
    shake = 7;
    streak = 0;
    fallAt = nowT;
    missT = nowT;
    tone(170, .16, 'sawtooth', .055, 85);
    noiseShot(.1);
    tone(1750, .09, 'sawtooth', .03, 500, .05);
    if (spot) {
      floats.push({ x: enemyX || spot[0], y: spot[1] - 44, text: t('gm_react_miss'), col: '#ff6b6b', t0: nowT });
      efGun = [enemyX + curDir * 34, spot[1] + curDy - 24];
      efT = nowT + 90;
      feeds.push({ text: 'PHOENIX ✖ YOU', col: '#ff8a8a', t0: nowT });
      if (feeds.length > 4) feeds.shift();
    }
    setHint(t('gm_react_miss'), 'early');
    nextAttempt(900);
  }

  function startWait() {
    stage = 'wait';
    spot = null;
    fallAt = 0;
    setHint(t('gm_react_wait'));
    timer = setTimeout(() => {
      stage = 'ready';
      readyTime = Date.now();
      appearAt = performance.now();
      const sp = PEEK_SPOTS[(Math.random() * PEEK_SPOTS.length) | 0];
      spot = [sp.x, sp.y];
      curDir = sp.dir;
      mirror = sp.dir < 0;
      runMode = done > 0 && Math.random() < .22;
      curDy = runMode ? 0 : (Math.random() < .38 ? 14 : 0);
      enemyX = runMode ? 36 : spot[0];
      missT = 0; efT = 0; efGun = null;
      curDL = Math.max(800, DEADLINE - done * 90);
      setHint(t('gm_react_go'), 'ready');
      tone(1050, .05, 'square', .045); tone(1320, .05, 'square', .04, null, .07);
      haptic('rigid');
      timer = setTimeout(missPeek, curDL);
    }, 1000 + Math.random() * 2500);
  }

  scene.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    ensureAudio();
    if (stage === 'wait') {
      clearTimeout(timer);
      stage = 'cooldown';
      shake = 3;
      streak = 0;
      tone(120, .13, 'square', .055);
      feeds.push({ text: 'TOO EARLY', col: '#ffb08a', t0: performance.now() });
      if (feeds.length > 4) feeds.shift();
      setHint(t('gm_react_too_soon'), 'early');
      timer = setTimeout(nextAttempt.bind(null, 0), 800);
      return;
    }
    if (stage === 'ready') {
      clearTimeout(timer);
      const nowT = performance.now();
      const ms = Date.now() - readyTime;
      reactionTimes.push(ms);
      hit++;
      done++;
      stage = 'cooldown';
      shake = 6;
      streak++;
      fallAt = nowT;
      flashT = nowT;
      const [hx, hy] = canvasXY(ev);
      tracer = { x1: hx, y1: hy, t0: nowT };
      markers.push({ x: hx, y: hy, t0: nowT });
      burst(hx, hy);
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: MUZZLE[0] - 8 - i * 3, y: MUZZLE[1] + 2, vx: .25 + Math.random() * .3, vy: -.35 - Math.random() * .25,
          g: -.004, life: 34 + Math.random() * 16, col: '#9aa3b0', sz: 2,
        });
      }
      const headFy = runMode ? 226 : spot[1] + 6 + curDy;
      const oyH = curDy ? 0 : (3 - Math.min(3, 1 + Math.floor((nowT - appearAt) / 60))) * 10;
      const headCy = headFy - 48 - oyH;
      const isHead = Math.abs(hx - enemyX) <= 10 && Math.abs(hy - headCy) <= 11;
      if (isHead) hsCount++;
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: MUZZLE[0] - 4, y: MUZZLE[1] + 5, vx: .9 + Math.random() * 1.3, vy: -1.6 - Math.random(),
          g: .14, life: 42 + Math.random() * 12, col: i % 2 ? '#e0b154' : '#c9a227', sz: 1, bounce: 1,
        });
      }
      if (isHead) {
        floats.push({ x: hx, y: hy - 22, text: 'HEADSHOT!', col: '#ffd166', t0: nowT, big: true });
        noiseShot(.15); tone(340, .08, 'sawtooth', .05, 130); tone(1244, .04, 'square', .06); tone(1864, .07, 'square', .05, null, .03);
      } else {
        noiseShot(.15); tone(340, .08, 'sawtooth', .05, 130);
      }
      floats.push({ x: hx, y: hy - 8, text: ms + ' мс', col: isHead ? '#ffe9a8' : '#7dff8a', t0: nowT });
      if (streak >= 2) floats.push({ x: W / 2, y: 64, text: 'STREAK x' + streak, col: '#ff9a58', t0: nowT, big: true });
      feeds.push({ text: 'YOU ✖ PHOENIX' + (isHead ? ' ◎' : ''), col: '#7dff8a', t0: nowT });
      if (feeds.length > 4) feeds.shift();
      setHint(ms + ' мс' + (isHead ? ' • HEADSHOT' : '') + (streak >= 2 ? ' • x' + streak : ''), 'hit');
      haptic('medium');
      nextAttempt(650);
    }
  });

  rafId = requestAnimationFrame(drawFrame);
  setHint('');
  currentPage = () => startGame(game);
}

function startAimGame(game) {
  const total = 15;
  let hits = 0;
  let misses = 0;
  const startTime = Date.now();

  const state = el('div', 'quiz-state');
  state.textContent = t('gm_aim_hit').replace('{0}', 0);
  view.appendChild(state);
  const arena = el('div', 'aim-arena');
  view.appendChild(arena);
  const feedback = el('div', 'q-feedback');
  view.appendChild(feedback);

  function spawn() {
    if (hits + misses >= total) {
      const dur = Date.now() - startTime;
      arena.innerHTML = '';
      const res = el('div', 'quiz-result');
      res.appendChild(el('div', 'quiz-score', t('gm_result').replace('{0}', hits).replace('{1}', total)));
      arena.appendChild(res);
      const again = el('button', 'link-btn');
      again.appendChild(iconEl('refresh'));
      again.appendChild(document.createTextNode(t('gm_play_again')));
      again.addEventListener('click', () => startGame(game));
      arena.appendChild(again);
      const back = el('button', 'link-btn');
      back.appendChild(iconEl('back'));
      back.appendChild(document.createTextNode(t('gm_back')));
      back.addEventListener('click', () => { gamesCache = null; renderGames(); });
      arena.appendChild(back);
      submitGameResult(game, hits, total, dur);
      return;
    }
    const target = el('button', 'aim-target');
    const size = 44 + Math.random() * 30;
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    target.style.left = (5 + Math.random() * 80) + '%';
    target.style.top = (5 + Math.random() * 75) + '%';
    target.addEventListener('click', (e) => {
      e.stopPropagation();
      hits++;
      target.remove();
      state.textContent = t('gm_aim_hit').replace('{0}', hits);
      feedback.textContent = t('gm_correct');
      feedback.className = 'q-feedback ok';
      spawn();
    });
    arena.appendChild(target);
  }

  arena.addEventListener('click', () => {
    if (hits + misses >= total) return;
    misses++;
    feedback.textContent = t('gm_aim_miss');
    feedback.className = 'q-feedback bad';
    state.textContent = t('gm_aim_hit').replace('{0}', hits);
  });

  spawn();
  currentPage = () => startGame(game);
}


async function renderShop() {
  if (loading) return;
  loading = true;
  clear();
  view.appendChild(sectionTitle('bolt', t('shop_title')));
  const box = el('div', 'sub-box');
  view.appendChild(box);
  const skeleton = addSkeleton(box, 4);
  try {
    const res = await api.get('/api/shop');
    skeleton.remove();
    if (!res.ok) { box.appendChild(el('p', 'section-text', t('load_fail'))); loading = false; return; }
    const catalog = res.catalog || {};
    const inv = res.inventory || {};
    const owned = new Set(inv.items || []);
    const equipped = inv.equipped || {};
    const coins = profileCache ? profileCache.coins : 0;
    box.appendChild(el('p', 'muted-note', (t('g_coins') || 'Coins') + ': ' + coins));

    const titles = Object.values(catalog).filter(i => i.type === 'title');
    const frames = Object.values(catalog).filter(i => i.type === 'frame');
    const avatars = Object.values(catalog).filter(i => i.type === 'avatar');
    const badges = Object.values(catalog).filter(i => i.type === 'badge');

    function shopSection(items, key, equipType) {
      if (!items.length) return;
      box.appendChild(sectionTitle('bolt', key));
      const list = el('div', 'g-list');
      items.forEach(item => {
        const row = el('div', 'g-row');
        row.appendChild(el('div', 'g-ico', item.icon));
        const info = el('div', 'player-info');
        info.appendChild(el('div', 'player-nick', lang === 'ru' ? item.name_ru : item.name));
        const meta = el('div', 'player-meta');
        const rarity = item.rarity || {};
        meta.appendChild(el('span', 'shop-rarity', rarity.name_ru || rarity.name || ''));
        meta.appendChild(el('span', null, item.price + ' 🪙'));
        if (item.stock_left != null) {
          meta.appendChild(el('span', 'shop-stock', (item.stock_left > 0 ? item.stock_left + ' ' : '') + (lang === 'ru' ? 'в наличии' : 'left')));
        }
        info.appendChild(meta);
        row.appendChild(info);
        if (owned.has(item.id)) {
          const isEq = equipped[equipType] === item.id;
          const btn = el('button', 'link-btn shop-equip-btn');
          btn.textContent = isEq ? t('shop_equipped') : t('shop_equip');
          btn.disabled = isEq;
          btn.addEventListener('click', async () => {
            const r = await api.post('/api/shop/equip', { item_id: item.id });
            if (r.ok) { profileCache = r.profile || profileCache; renderShop(); }
          });
          row.appendChild(btn);
        } else {
          const soldOut = item.stock_left != null && item.stock_left <= 0;
          const btn = el('button', 'link-btn shop-buy-btn');
          btn.textContent = soldOut ? (t('shop_soldout') || 'Sold out') : (t('shop_buy') + ' (' + item.price + ')');
          btn.disabled = soldOut || coins < item.price;
          btn.addEventListener('click', async () => {
            const r = await api.post('/api/shop/buy', { item_id: item.id });
            if (r.ok) { profileCache = r.profile || profileCache; renderShop(); }
          });
          row.appendChild(btn);
        }
        list.appendChild(row);
      });
      box.appendChild(list);
    }

    if (avatars.length) shopSection(avatars, t('shop_avatars') || 'Avatars', 'avatar');
    shopSection(titles, t('g_level') || 'Titles', 'title');
    shopSection(frames, t('shop_title') || 'Frames', 'frame');
    shopSection(badges, t('shop_badges') || 'Badges', 'badge');

    currentPage = () => renderShop();
  } catch (err) {
    skeleton.remove();
    box.appendChild(el('p', 'section-text', t('load_fail')));
  } finally {
    loading = false;
  }
}


async function init() {
  loadSettings();
    const orb1 = document.createElement('div');
    orb1.className = 'orb orb1';
    const orb2 = document.createElement('div');
    orb2.className = 'orb orb2';
    document.body.appendChild(orb1);
    document.body.appendChild(orb2);

    if (!localStorage.getItem('cs2_onboarded')) {
      showOnboarding();
      return;
    }

    await bootApp();
  }

  async function bootApp() {
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
    ['home', 'learn', 'train', 'games', 'stats', 'guides'].forEach(name => {
      const td = TAB_DEFS[name];
      const btn = document.createElement('button');
      btn.className = 'tab' + (name === 'home' ? ' active' : '');
      btn.dataset.tab = name;
      const ico = iconEl(td.icon);
      ico.className = 'tab-ico';
      btn.appendChild(ico);
      const label = document.createElement('span');
      label.className = 'tab-label';
      label.textContent = t(td.labelKey);
      btn.appendChild(label);
      btn.addEventListener('click', () => switchTab(name));
      tabBar.appendChild(btn);
    });

    try {
      const initRes = await api.get('/api/init');
      if (!initRes.ok) { view.appendChild(el('p', 'section-text', t('app_open'))); return; }
      currentUser = initRes.user;
      profileCache = initRes.profile || null;
      isAdmin = !!initRes.is_admin;
      document.getElementById('userName').textContent = initRes.user.first_name;
      document.getElementById('userName').addEventListener('click', () => switchTab('settings'));
      applyTheme();
      await renderHome();
    } catch (err) {
      view.appendChild(el('p', 'section-text', t('load_fail')));
    }
  }

  function showOnboarding() {
    const overlay = el('div', 'onboard-overlay');
    const steps = [
      { icon: 'bolt', title_ru: 'CS2 COACH', title_en: 'CS2 COACH', text_ru: 'Твой персональный тренер по Counter-Strike 2', text_en: 'Your personal Counter-Strike 2 trainer' },
      { icon: 'learn', title_ru: 'Учись', title_en: 'Learn', text_ru: 'Карточки, тесты и уроки по основам CS2', text_en: 'Cards, quizzes and lessons on CS2 fundamentals' },
      { icon: 'drill', title_ru: 'Тренируйся', title_en: 'Train', text_ru: 'Практикуй лайнапы и утилити на картах', text_en: 'Practice lineups and utility on maps' },
      { icon: 'stats', title_ru: 'Соревнуйся', title_en: 'Compete', text_ru: 'Мини-игры, достижения и рейтинг игроков', text_en: 'Mini-games, achievements and player leaderboard' },
    ];
    let step = 0;

    function renderStep() {
      overlay.innerHTML = '';
      const s = steps[step];
      const card = el('div', 'onboard-card');
      card.appendChild(iconEl(s.icon));
      const titleText = lang === 'ru' ? s.title_ru : s.title_en;
      const textText = lang === 'ru' ? s.text_ru : s.text_en;
      card.appendChild(el('h2', 'onboard-title', titleText));
      card.appendChild(el('p', 'onboard-text', textText));

      const dots = el('div', 'onboard-dots');
      steps.forEach((_, i) => {
        const dot = el('span', 'onboard-dot' + (i === step ? ' active' : ''));
        dots.appendChild(dot);
      });
      card.appendChild(dots);

      const nextBtn = el('button', 'onboard-btn');
      nextBtn.textContent = step < steps.length - 1 ? (lang === 'ru' ? 'Далее' : 'Next') : (lang === 'ru' ? 'Начать!' : 'Start!');
      nextBtn.addEventListener('click', () => {
        if (step < steps.length - 1) {
          step++;
          renderStep();
        } else {
          localStorage.setItem('cs2_onboarded', '1');
          overlay.remove();
          bootApp();
        }
      });
      card.appendChild(nextBtn);

      const skipBtn = el('button', 'onboard-skip');
      skipBtn.textContent = lang === 'ru' ? 'Пропустить' : 'Skip';
      skipBtn.addEventListener('click', () => {
        localStorage.setItem('cs2_onboarded', '1');
        overlay.remove();
        bootApp();
      });
      card.appendChild(skipBtn);

      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    renderStep();
  }

  init();
})();
