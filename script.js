// Set your public Telegram username here (without @) before publishing.
const TELEGRAM_USERNAME = '';
const language = document.querySelector('#language');
const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
const motion = document.querySelector('#motion');
let paused = false;
function updateMotion() {
  document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = current === 'ru' ? (paused ? 'Анимация на паузе' : 'Пауза анимации') : (paused ? 'Animation paused' : 'Pause animation');
}
let current = 'ru';
try { if (localStorage.getItem('watanabe-language') === 'en') current = 'en'; } catch (_) {}
function setLanguage(lang) {
  current = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-ru][data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
  language.textContent = lang === 'ru' ? 'RU / en' : 'ru / EN';
  language.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  nav.setAttribute('aria-label', lang === 'ru' ? 'Навигация' : 'Navigation');
  document.querySelector('meta[name="description"]').content = lang === 'ru' ? 'WATANABE STUDIO — независимая студия сайтов, Telegram-ботов, дизайна и автоматизации.' : 'WATANABE STUDIO — independent creative studio for websites, Telegram bots, design and automation.';
  updateMotion();
  try { localStorage.setItem('watanabe-language', lang); } catch (_) {}
}
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click', () => { const opened = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(opened)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
language.addEventListener('click', () => setLanguage(current === 'ru' ? 'en' : 'ru'));
if (/^[a-zA-Z0-9_]{5,32}$/.test(TELEGRAM_USERNAME)) { const link = document.querySelector('#telegram'); link.href = 'https://t.me/' + TELEGRAM_USERNAME; link.hidden = false; document.querySelector('#contact-note').hidden = true; }
motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
window.matchMedia('(max-width: 850px)').addEventListener('change', closeMenu);
document.documentElement.classList.add('js');
[language, menu, motion].forEach(el => { el.hidden = false; });
setLanguage(current);
