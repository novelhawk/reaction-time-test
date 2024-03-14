import { Chart } from 'chart.js';

new Chart('');

const box = document.getElementById('box');
const description = document.querySelector('span.description');
const history = document.getElementById('history');

const statuses = ['start', 'active', 'ready', 'done', 'error'];
const state = {
  status: 'start',
  measurements: [],
};

const descriptions = {
  active: 'Wait for green',
  ready: 'Click!',
  error: 'You clicked too early!',
};

const nextStatus = {
  start: 'active',
  active: 'error',
  ready: 'done',
  done: 'active',
  error: 'active',
};

const stateChangeCallbacks = {
  active: () => {
    performance.mark('initial');

    clearTimeout(state.timer);
    state.timer = setTimeout(makeReady, Math.random() * 3000 + 1500);
  },
  ready: () => {
    performance.mark('ready');
    clearTimeout(state.timer);
  },
  done: () => {
    performance.mark('done');

    const wait = performance.measure('wait', 'initial', 'ready');
    const measure = performance.measure('delay', 'ready', 'done');
    state.delta = measure.duration;
    state.measurements.push({
      type: 'click',
      which: 'left',
      wait: wait.duration,
      delay: state.delta,
      timestamp: Date.now(),
    });
    save();
    console.log('took', state.delta, 'ms');

    const ms = Math.floor(state.delta * 100) / 100;
    description.innerHTML = `${ms.toFixed(2)} ms`;
  },
  error: () => {
    clearTimeout(state.timer);
  },
};

function makeReady() {
  state.status = 'ready';
  stateChangeCallbacks[state.status]?.();
  box.dataset.status = state.status;
}

function onClick() {
  state.status = nextStatus[state.status];
  description.textContent = descriptions[state.status] ?? '';
  stateChangeCallbacks[state.status]?.();
  box.dataset.status = state.status;
}

function load() {
  const data = window.localStorage.getItem('measurements');
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function save() {
  window.localStorage.setItem(
    'measurements',
    JSON.stringify(state.measurements),
  );
}

function dropLatestScore() {
  state.measurements.pop();
  save();
}

function createHistoryChart() {
  new Chart();
}

state.measurements = load();
box.addEventListener('mousedown', onClick);
