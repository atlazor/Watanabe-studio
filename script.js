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
motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
window.matchMedia('(max-width: 850px)').addEventListener('change', closeMenu);
document.documentElement.classList.add('js');
[language, menu, motion].forEach(el => { el.hidden = false; });
setLanguage(current);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const art = document.querySelector('.art');

function trackPointer(element, apply) {
  let frame = 0;
  let x = 0;
  let y = 0;

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    apply(0, 0);
  }

  element.addEventListener('pointermove', event => {
    if (paused || reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      apply((x - bounds.left) / bounds.width - .5, (y - bounds.top) / bounds.height - .5);
    });
  });
  element.addEventListener('pointerleave', reset);
  element.addEventListener('pointercancel', reset);
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  motion.addEventListener('click', reset);
}

trackPointer(art, (x, y) => {
  art.style.setProperty('--dx', x * 24 + 'px');
  art.style.setProperty('--dy', y * 20 + 'px');
});
document.querySelectorAll('.service').forEach(card => {
  trackPointer(card, (x, y) => {
    card.style.setProperty('--rx', -y * 6 + 'deg');
    card.style.setProperty('--ry', x * 6 + 'deg');
  });
});

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!paused && !reducedMotion.matches) entry.target.classList.add('in-view');
      reveal.unobserve(entry.target);
    }
  });
  document.querySelectorAll('.section h2, .projects article, .steps li, .faq details, .about p, .contact h2').forEach(el => reveal.observe(el));

  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('offscreen', !entry.isIntersecting);
  });
  visibility.observe(art);
  visibility.observe(document.querySelector('.ticker'));
}
