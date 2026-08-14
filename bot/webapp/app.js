(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#05070d'); }

  const ICONS = {
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    lessons: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    quizzes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="20" x2="21" y2="20"/><line x1="6" y1="16" x2="6" y2="10"/><line x1="12" y1="16" x2="12" y2="4"/><line x1="18" y1="16" x2="18" y2="7"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>'
  };

  const TABS = [
    { id: 'lessons', icon: 'lessons', label: 'Уроки' },
    { id: 'cards', icon: 'cards', label: 'Карточки' },
    { id: 'quizzes', icon: 'quizzes', label: 'Тесты' },
    { id: 'progress', icon: 'progress', label: 'Прогресс' },
    { id: 'stats', icon: 'stats', label: 'Статистика' }
  ];

  const view = document.getElementById('view');
  let userName;
  const toast = document.getElementById('toast');

  let state = { lessons: [], cards: [], quizzes: [], user: null };
  let lessonPos = null;
  let cardIdx = 0;
  let cardState = {};
  let quizState = null;

  const api = {
    headers: { 'x-init-data': tg ? tg.initData : '' },
    get(path) { return fetch(path, { headers: this.headers }).then(r => r.json()); },
    post(path, body) {
      return fetch(path, {
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(r => r.json());
    }
  };

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function iconEl(name, cls) {
    const span = document.createElement('span');
    span.className = cls || 'ico';
    span.innerHTML = ICONS[name];
    return span;
  }

  function sectionTitle(icon, text) {
    const h = el('h2', 'lesson-title');
    h.appendChild(iconEl(icon, 'ico-sm'));
    h.appendChild(document.createTextNode(text));
    return h;
  }

  function clear() { view.innerHTML = ''; }

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }

  function buildShell() {
    document.getElementById('appHeader').innerHTML =
      '<h1><span class="logo">' + ICONS.bolt + '</span><span class="brand">CS2 <span class="hl">COACH</span></span></h1>' +
      '<span id="userName"></span>';
    userName = document.getElementById('userName');

    const nav = document.getElementById('tabs');
    TABS.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.dataset.tab = tab.id;
      if (i === 0) btn.classList.add('active');
      btn.appendChild(iconEl(tab.icon));
      btn.appendChild(document.createTextNode(tab.label));
      nav.appendChild(btn);
    });

    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tab]');
      if (!btn) return;
      document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'lessons') renderLessons();
      else if (tab === 'cards') renderCards();
      else if (tab === 'quizzes') renderQuizzes();
      else if (tab === 'stats') renderStats();
      else renderProgress();
    });
  }

  function renderLessons() {
    clear();
    view.appendChild(sectionTitle('lessons', 'Уроки'));
    state.lessons.forEach((lesson) => {
      const card = el('div', 'card');
      const h = el('h3', null, lesson.title);
      const p = el('p', null, 'Разделов: ' + lesson.sections.length + ' · Вопросов: ' + lesson.questions.length);
      card.appendChild(h); card.appendChild(p);
      card.addEventListener('click', () => startLesson(lesson));
      view.appendChild(card);
    });
  }

  function startLesson(lesson) {
    lessonPos = { lesson: lesson, section: 0 };
    renderLessonSection();
  }

  function renderLessonSection() {
    clear();
    const lp = lessonPos;
    const lesson = lp.lesson;
    view.appendChild(el('div', 'lesson-title', lesson.title));
    view.appendChild(el('div', 'section-text', lesson.sections[lp.section]));
    const next = el('button', 'btn accent', lp.section + 1 < lesson.sections.length ? 'Дальше →' : 'К вопросам →');
    next.addEventListener('click', () => {
      if (lp.section + 1 < lesson.sections.length) {
        lp.section++;
        renderLessonSection();
      } else {
        lp.section = -1; lp.qIndex = 0;
        renderLessonQuestion();
      }
    });
    view.appendChild(next);
    const back = el('button', 'btn ghost', '← К урокам');
    back.addEventListener('click', () => { lessonPos = null; renderLessons(); });
    view.appendChild(back);
  }

  function renderLessonQuestion() {
    clear();
    const lp = lessonPos;
    const lesson = lp.lesson;
    if (lp.qIndex >= lesson.questions.length) {
      api.post('/api/lesson', { lesson_id: lesson.id }).then(() => {
        const done = el('div', 'section-text', 'Урок пройден!');
        const back = el('button', 'btn accent', 'К урокам');
        back.addEventListener('click', () => { lessonPos = null; renderLessons(); });
        view.appendChild(done); view.appendChild(back);
      });
      return;
    }
    const q = lesson.questions[lp.qIndex];
    view.appendChild(el('div', 'question', 'Вопрос ' + (lp.qIndex + 1) + '/' + lesson.questions.length + '\n' + q.q));
    const input = document.createElement('input');
    input.id = 'answerInput'; input.placeholder = 'Твой ответ...';
    view.appendChild(input);
    const send = el('button', 'btn accent', 'Ответить');
    send.addEventListener('click', () => {
      const reply = (input.value || '').trim().toLowerCase();
      const correct = reply && (reply === q.a.toLowerCase() || q.a.toLowerCase().includes(reply) || reply.includes(q.a.toLowerCase()));
      input.value = '';
      if (correct) showToast('Верно!');
      else showToast('Ответ: ' + q.a);
      lp.qIndex++;
      renderLessonQuestion();
    });
    view.appendChild(send);
  }

  function renderCards() {
    clear();
    if (!state.cards.length) return;
    if (cardIdx >= state.cards.length) {
      const done = el('div', 'section-text', 'Все карточки пройдены!');
      const again = el('button', 'btn accent', 'Пройти заново');
      again.addEventListener('click', () => { cardIdx = 0; cardState = {}; renderCards(); });
      view.appendChild(done); view.appendChild(again);
      return;
    }
    const card = state.cards[cardIdx];
    const box = el('div', 'flip-card');
    box.appendChild(el('div', 'front', card.front));
    if (cardState[cardIdx]) box.appendChild(el('div', 'back', card.back));
    view.appendChild(box);

    view.appendChild(el('div', 'counter', (cardIdx + 1) + ' / ' + state.cards.length));

    if (cardState[cardIdx]) {
      const known = el('button', 'btn green', 'Знаю');
      known.addEventListener('click', () => {
        api.post('/api/card', { index: cardIdx, known: true }).then(() => { cardIdx++; renderCards(); });
      });
      const unknown = el('button', 'btn red', 'Не знаю');
      unknown.addEventListener('click', () => { cardIdx++; renderCards(); });
      view.appendChild(known); view.appendChild(unknown);
    } else {
      const flip = el('button', 'btn accent', 'Показать ответ');
      flip.addEventListener('click', () => { cardState[cardIdx] = true; renderCards(); });
      view.appendChild(flip);
    }
  }

  function renderQuizzes() {
    clear();
    view.appendChild(sectionTitle('quizzes', 'Тесты'));
    state.quizzes.forEach((quiz) => {
      const card = el('div', 'card');
      card.appendChild(el('h3', null, quiz.title));
      card.appendChild(el('p', null, 'Вопросов: ' + quiz.questions.length));
      card.addEventListener('click', () => {
        quizState = { quiz: quiz, index: 0, score: 0 };
        renderQuizQuestion();
      });
      view.appendChild(card);
    });
  }

  function renderQuizQuestion() {
    clear();
    const qs = quizState;
    const quiz = qs.quiz;
    if (qs.index >= quiz.questions.length) {
      const percent = qs.score * 100 / quiz.questions.length;
      const verdict = percent >= 80 ? 'Отлично!' : percent >= 50 ? 'Неплохо!' : 'Тренируйся дальше!';
      api.post('/api/quiz', { quiz_id: quiz.id, score: qs.score, total: quiz.questions.length }).then(() => {
        view.appendChild(el('div', 'section-text',
          verdict + ' ' + quiz.title + '\n\nРезультат: ' + qs.score + ' / ' + quiz.questions.length + ' (' + percent + '%)'));
        const back = el('button', 'btn accent', 'К тестам');
        back.addEventListener('click', () => { quizState = null; renderQuizzes(); });
        view.appendChild(back);
      });
      return;
    }
    const q = quiz.questions[qs.index];
    view.appendChild(el('div', 'question', 'Вопрос ' + (qs.index + 1) + '/' + quiz.questions.length + '\n' + q.q));
    q.options.forEach((opt, i) => {
      const btn = el('button', 'option', opt);
      btn.addEventListener('click', () => {
        const correct = i === q.answer;
        btn.classList.add(correct ? 'correct' : 'wrong');
        if (correct) qs.score++;
        setTimeout(() => { qs.index++; renderQuizQuestion(); }, 700);
      });
      view.appendChild(btn);
    });
  }

  async function renderProgress() {
    clear();
    view.appendChild(sectionTitle('progress', 'Прогресс'));
    const data = await api.get('/api/progress');
    if (!data.ok) { view.appendChild(el('p', null, 'Ошибка загрузки')); return; }
    const p = data.progress;
    const panel = el('div', 'card');
    const lessonsPct = Math.round(p.lessons_done * 100 / Math.max(1, p.lessons_total));
    const cardsPct = Math.round(p.cards_known * 100 / Math.max(1, p.cards_total));

    panel.appendChild(statRow('Уроки', p.lessons_done + ' / ' + p.lessons_total));
    panel.appendChild(bar(lessonsPct));
    panel.appendChild(statRow('Карточки', p.cards_known + ' / ' + p.cards_total));
    panel.appendChild(bar(cardsPct));
    panel.appendChild(statRow('Тестов пройдено', p.quizzes_taken));
    panel.appendChild(statRow('Лучший результат', p.best_score !== null ? p.best_score + ' баллов' : 'пока нет'));
    view.appendChild(panel);
  }

  function statRow(label, value) {
    const row = el('div', 'stat-row');
    row.appendChild(el('span', null, label));
    row.appendChild(el('span', null, value));
    return row;
  }

  function bar(pct) {
    const wrap = el('div', 'bar');
    const fill = el('div', null);
    fill.style.width = Math.max(pct, 4) + '%';
    wrap.appendChild(fill);
    return wrap;
  }

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
    try {
      const initRes = await api.get('/api/init');
      if (!initRes.ok) { view.appendChild(el('p', 'section-text', 'Открой приложение через бота')); return; }
      state.user = initRes.user;
      userName.textContent = initRes.user.first_name;
      const content = await api.get('/api/content');
      state.lessons = content.lessons;
      state.cards = content.cards;
      state.quizzes = content.quizzes;
      await api.get('/api/progress');
      cardState = {};
      renderLessons();
    } catch (err) {
      view.appendChild(el('p', 'section-text', 'Не удалось загрузить данные'));
    }
  }

  buildShell();
  init();
})();
