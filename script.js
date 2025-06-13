// script.js

// ----------- Section Toggle -----------
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.id.split('-')[1];
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `section-${target}`) {
                section.classList.add('active');
            }
        });
    });
});

// ----------- Dark Mode Toggle -----------
document.getElementById('btn-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// ----------- To-Do List Logic -----------
const todoInput = document.getElementById('todo-input');
const todoPriority = document.getElementById('todo-priority');
const addTodoBtn = document.getElementById('add-todo-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const todoList = document.getElementById('todo-list');
let taskCount = 0;

addTodoBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    const priority = todoPriority.value;
    if (!taskText) return;

    const li = document.createElement('li');
    li.className = `todo-item ${priority}`;
    li.innerHTML = `
        <input type="checkbox" class="todo-check" />
        <span class="todo-text">${taskText}</span>
        <span class="priority-label">${priority}</span>
    `;
    todoList.appendChild(li);
    todoInput.value = '';
    updateStats();
});

clearCompletedBtn.addEventListener('click', () => {
    const checked = todoList.querySelectorAll('input[type="checkbox"]:checked');
    checked.forEach(chk => chk.parentElement.remove());
    updateStats();
});

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.id.split('-')[1];
        const items = todoList.querySelectorAll('li');
        items.forEach(item => {
            const checked = item.querySelector('input').checked;
            item.style.display =
                filter === 'all' ||
                (filter === 'active' && !checked) ||
                (filter === 'completed' && checked)
                    ? 'flex'
                    : 'none';
        });
    });
});

function updateStats() {
    const completed = todoList.querySelectorAll('input[type="checkbox"]:checked').length;
    document.getElementById('stats-tasks-completed').textContent = completed;
}

// ----------- Timer Logic -----------
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-timer-btn');
const pauseBtn = document.getElementById('pause-timer-btn');
const resetBtn = document.getElementById('reset-timer-btn');
const timerInput = document.getElementById('timer-minutes');
const timerSoundSelect = document.getElementById('timer-sound-select');
let timerInterval;
let remainingTime;
let focusMinutes = 0;

function updateTimerDisplay(mins, secs) {
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    let duration = parseInt(timerInput.value);
    if (!duration || duration <= 0) return;
    remainingTime = duration * 60;

    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        updateTimerDisplay(minutes, seconds);
        remainingTime--;

        if (remainingTime < 0) {
            clearInterval(timerInterval);
            playSound();
            focusMinutes += duration;
            document.getElementById('stats-focus-time').textContent = focusMinutes;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }, 1000);
});

pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    const mins = parseInt(timerInput.value);
    updateTimerDisplay(mins, 0);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

function playSound() {
    const sound = timerSoundSelect.value;
    if (sound === 'none') return;

    const urls = {
        bell: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
        alarm: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
        chime: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'
    };

    const audio = new Audio(urls[sound]);
    audio.play();
}

// ----------- Quotes Logic -----------
const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Great things never come from comfort zones.",
    "Success doesn’t just find you. You have to go out and get it."
];

document.getElementById('new-quote-btn').addEventListener('click', () => {
    const random = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote-text').textContent = quotes[random];
});