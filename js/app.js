/* ========== Mobile menu ========== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ========== TYPING TEST ========== */
const PASSAGES = [
  "TaskUs provides world-class customer support to partners across the globe. Great communication skills help teams deliver fast, friendly, and accurate solutions every single day.",
  "Logical reasoning tests measure your ability to identify patterns, solve problems, and think critically under pressure. Practice makes this much easier over time.",
  "Before your assessment, find a quiet space, take a deep breath, and remember to read every question carefully. Accuracy matters more than rushing through the answers."
];

const typingText = document.getElementById('typingText');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startTyping');
const resetBtn = document.getElementById('resetTyping');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('acc');
const timerEl = document.getElementById('timer');

let passage = '';
let startTime = null;
let timerInterval = null;
let started = false;

function pickPassage() {
  passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
  renderTypingText('');
}

function renderTypingText(typed) {
  let html = '';
  for (let i = 0; i < passage.length; i++) {
    const ch = passage[i];
    let cls = '';
    if (i < typed.length) {
      cls = typed[i] === ch ? 'correct' : 'incorrect';
    } else if (i === typed.length) {
      cls = 'current';
    }
    const display = ch === ' ' ? '&nbsp;' : ch;
    html += `<span class="${cls}">${display}</span>`;
  }
  typingText.innerHTML = html;
}

function startTyping() {
  pickPassage();
  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();
  started = true;
  startTime = null;
  wpmEl.textContent = '0';
  accEl.textContent = '100%';
  timerEl.textContent = '0s';
  clearInterval(timerInterval);
}

function resetTyping() {
  started = false;
  clearInterval(timerInterval);
  typingInput.value = '';
  typingInput.disabled = true;
  wpmEl.textContent = '0';
  accEl.textContent = '0%';
  timerEl.textContent = '0s';
  pickPassage();
}

typingInput.addEventListener('input', (e) => {
  if (!started) return;
  const typed = e.target.value;
  if (!startTime && typed.length > 0) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
  }
  renderTypingText(typed);
  updateStats(typed);
  if (typed === passage) finishTyping(typed);
});

function updateTimer() {
  if (!startTime) return;
  const sec = (Date.now() - startTime) / 1000;
  timerEl.textContent = sec.toFixed(1) + 's';
}

function updateStats(typed) {
  if (!startTime) return;
  const minutes = (Date.now() - startTime) / 60000;
  if (minutes <= 0) return;
  const words = typed.trim().length / 5;
  const wpm = Math.round(words / minutes);
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === passage[i]) correct++;
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  wpmEl.textContent = wpm;
  accEl.textContent = acc + '%';
}

function finishTyping(typed) {
  clearInterval(timerInterval);
  typingInput.disabled = true;
  updateStats(typed);
}

startBtn.addEventListener('click', startTyping);
resetBtn.addEventListener('click', resetTyping);
pickPassage();

/* ========== LOGIC QUIZ ========== */
const LOGIC_QUESTIONS = [
  {
    sequence: ['●', '●●', '●●●', '●●●●'],
    arrow: '➜',
    options: ['●●●', '●●●●●', '●●●●●●', '○○○○○'],
    answer: 1,
    hint: 'The number of dots increases by 1 each step.'
  },
  {
    sequence: ['▲', '▶', '▼', '◀'],
    arrow: '➜',
    options: ['▲', '▶', '▼', '◆'],
    answer: 0,
    hint: 'The triangle rotates 90° clockwise each time.'
  },
  {
    sequence: ['2', '4', '8', '16'],
    arrow: '➜',
    options: ['24', '32', '30', '20'],
    answer: 1,
    hint: 'Each number is multiplied by 2.'
  },
  {
    sequence: ['□■', '■□', '□■', '■□'],
    arrow: '➜',
    options: ['■□', '□□', '□■', '■■'],
    answer: 2,
    hint: 'The pattern alternates between the two arrangements.'
  },
  {
    sequence: ['🌑', '🌒', '🌓', '🌔'],
    arrow: '➜',
    options: ['🌑', '🌕', '🌖', '🌗'],
    answer: 1,
    hint: 'The moon is waxing (filling in) toward a full moon.'
  }
];

const logicQuizEl = document.getElementById('logicQuiz');
const logicFeedbackEl = document.getElementById('logicFeedback');
const nextLogicBtn = document.getElementById('nextLogic');
let currentQ = 0;

function renderLogic() {
  const q = LOGIC_QUESTIONS[currentQ];
  logicFeedbackEl.textContent = '';
  logicFeedbackEl.className = 'logic-feedback';
  logicQuizEl.innerHTML = `
    <div class="logic-question">
      <p><strong>Question ${currentQ + 1} of ${LOGIC_QUESTIONS.length}:</strong> What comes next?</p>
      <div class="q-sequence">
        ${q.sequence.map(s => `<span>${s}</span>`).join(` <span class="q-arrow">${q.arrow}</span> `)}
        <span class="q-arrow">➜</span> <span style="color:#9ca3af;">?</span>
      </div>
      <div class="logic-options">
        ${q.options.map((opt, i) => `<button class="logic-opt" data-i="${i}">${opt}</button>`).join('')}
      </div>
    </div>
  `;
  logicQuizEl.querySelectorAll('.logic-opt').forEach(btn => {
    btn.addEventListener('click', () => answerLogic(btn));
  });
}

function answerLogic(btn) {
  const i = parseInt(btn.dataset.i);
  const q = LOGIC_QUESTIONS[currentQ];
  const opts = logicQuizEl.querySelectorAll('.logic-opt');
  opts.forEach(o => o.disabled = true);
  if (i === q.answer) {
    btn.classList.add('correct');
    logicFeedbackEl.textContent = '✅ Correct! ' + q.hint;
    logicFeedbackEl.className = 'logic-feedback right';
  } else {
    btn.classList.add('wrong');
    opts[q.answer].classList.add('correct');
    logicFeedbackEl.textContent = '❌ Not quite. ' + q.hint;
    logicFeedbackEl.className = 'logic-feedback wrong';
  }
}

nextLogicBtn.addEventListener('click', () => {
  currentQ = (currentQ + 1) % LOGIC_QUESTIONS.length;
  renderLogic();
});
renderLogic();

/* ========== READING COMPREHENSION ========== */
const READING = {
  title: 'Effective Communication in the Workplace',
  passage: `Strong communication is the foundation of every successful team. Employees who listen carefully, speak clearly, and write thoughtfully help prevent misunderstandings and keep projects moving forward. In fast-paced environments like call centers and tech support, tone matters as much as the message itself. A calm, friendly voice can turn a frustrated customer into a loyal one. Experts recommend pausing before responding, asking clarifying questions, and confirming that the other person feels heard. These small habits make a noticeable difference in both productivity and morale.`,
  questions: [
    {
      q: 'What is the main idea of the passage?',
      options: [
        'Technical skills matter more than communication.',
        'Strong communication is essential to successful teams.',
        'Customers are always frustrated.',
        'Call centers are the fastest-growing industry.'
      ],
      answer: 1
    },
    {
      q: 'According to the passage, what can turn a frustrated customer into a loyal one?',
      options: [
        'Offering a large discount.',
        'Transferring them to a manager.',
        'A calm, friendly tone.',
        'Talking quickly to save time.'
      ],
      answer: 2
    },
    {
      q: 'Which of the following is NOT recommended by experts in the passage?',
      options: [
        'Pausing before responding.',
        'Asking clarifying questions.',
        'Confirming the other person feels heard.',
        'Responding immediately without listening.'
      ],
      answer: 3
    }
  ]
};

const readingPassageEl = document.getElementById('readingPassage');
const readingQuestionsEl = document.getElementById('readingQuestions');
const checkReadingBtn = document.getElementById('checkReading');
const readingFeedbackEl = document.getElementById('readingFeedback');

readingPassageEl.innerHTML = `
  <h4 style="margin-top:0;">${READING.title}</h4>
  <p style="margin:0;">${READING.passage}</p>
`;

readingQuestionsEl.innerHTML = READING.questions.map((item, qi) => `
  <div class="reading-q" data-q="${qi}">
    <p>${qi + 1}. ${item.q}</p>
    ${item.options.map((opt, oi) => `
      <label>
        <input type="radio" name="q${qi}" value="${oi}">
        ${opt}
      </label>
    `).join('')}
  </div>
`).join('');

checkReadingBtn.addEventListener('click', () => {
  let score = 0;
  READING.questions.forEach((item, qi) => {
    const qEl = readingQuestionsEl.querySelector(`[data-q="${qi}"]`);
    const labels = qEl.querySelectorAll('label');
    labels.forEach(l => l.classList.remove('correct', 'wrong'));
    const selected = qEl.querySelector(`input[name="q${qi}"]:checked`);
    const picked = selected ? parseInt(selected.value) : -1;
    labels[item.answer].classList.add('correct');
    if (picked === item.answer) {
      score++;
    } else if (picked >= 0) {
      labels[picked].classList.add('wrong');
    }
  });
  readingFeedbackEl.textContent = `You scored ${score} out of ${READING.questions.length}. ${score === READING.questions.length ? '🎉 Perfect job!' : 'Review the highlighted answers for the correct choices.'}`;
  readingFeedbackEl.className = 'logic-feedback ' + (score === READING.questions.length ? 'right' : 'wrong');
});
