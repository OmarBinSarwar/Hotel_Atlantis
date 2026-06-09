/* ═══════════════════════════════════════════════════════════
   ATLANTIS THE ROYAL — Main JavaScript (index.html)
═══════════════════════════════════════════════════════════ */

/* ── Navbar Scroll ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── Mobile Menu ───────────────────────────────────────── */
const navMenuToggle = document.getElementById('navMenuToggle');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileClose   = document.getElementById('mobileClose');

if (navMenuToggle && mobileMenu) {
  navMenuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click',  () => mobileMenu.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') mobileMenu.classList.remove('open');
  });
}

/* ── Hero Slider ───────────────────────────────────────── */
(function() {
  const imgs = document.querySelectorAll('.hero-img');
  const dots = document.querySelectorAll('.dot');
  if (!imgs.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    imgs[current].classList.remove('hero-img-active');
    dots[current]?.classList.remove('dot-active');
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('hero-img-active');
    dots[current]?.classList.add('dot-active');
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, 5500); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  startTimer();

  dots.forEach(d => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.slide));
      resetTimer();
    });
  });
})();

/* ── Testimonials Slider ───────────────────────────────── */
(function() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const tDots  = document.querySelectorAll('.t-dot');
  if (!slides.length) return;

  let current = 0;
  function goTo(idx) {
    slides[current].classList.remove('active');
    tDots[current]?.classList.remove('t-dot-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    tDots[current]?.classList.add('t-dot-active');
  }

  tDots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.t))));
  setInterval(() => goTo(current + 1), 6000);
})();

/* ── Rooms Carousel ────────────────────────────────────── */
(function() {
  const track = document.getElementById('roomsTrack');
  const prev  = document.getElementById('roomsPrev');
  const next  = document.getElementById('roomsNext');
  if (!track) return;

  let idx = 0;
  const cards = track.querySelectorAll('.room-card');
  const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIdx = () => Math.max(0, cards.length - visibleCount());

  function updateTrack() {
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${idx * cardW}px)`;
  }

  prev?.addEventListener('click', () => { idx = Math.max(0, idx - 1); updateTrack(); });
  next?.addEventListener('click', () => { idx = Math.min(maxIdx(), idx + 1); updateTrack(); });
  window.addEventListener('resize', updateTrack);
})();

/* ── Experience Carousel ───────────────────────────────── */
(function() {
  const track = document.getElementById('expTrack');
  const prev  = document.getElementById('expPrev');
  const next  = document.getElementById('expNext');
  if (!track) return;

  let idx = 0;
  const slides = track.querySelectorAll('.exp-slide');
  const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIdx = () => Math.max(0, slides.length - visibleCount());

  function updateTrack() {
    const slideW = slides[0].offsetWidth + 16;
    track.style.transform = `translateX(-${idx * slideW}px)`;
  }

  prev?.addEventListener('click', () => { idx = Math.max(0, idx - 1); updateTrack(); });
  next?.addEventListener('click', () => { idx = Math.min(maxIdx(), idx + 1); updateTrack(); });
  window.addEventListener('resize', updateTrack);
})();

/* ── Quick Booking Bar ─────────────────────────────────── */
function goToBooking() {
  const loc = document.getElementById('qb-location')?.value;
  const ci  = document.getElementById('qb-checkin')?.value;
  const co  = document.getElementById('qb-checkout')?.value;
  const ad  = document.getElementById('qb-adults')?.value;
  const ch  = document.getElementById('qb-children')?.value;
  const pr  = document.getElementById('qb-promo')?.value;

  let url = 'booking.html?';
  if (loc) url += `location=${loc}&`;
  if (ci)  url += `checkin=${ci}&`;
  if (co)  url += `checkout=${co}&`;
  if (ad)  url += `adults=${ad}&`;
  if (ch)  url += `children=${ch}&`;
  if (pr)  url += `promo=${encodeURIComponent(pr)}&`;
  window.location.href = url;
}

/* ── Counter Animation ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ── Scroll Reveal ─────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Trigger counters when discover section is visible
      if (e.target.classList.contains('discover-stats')) animateCounters();
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in-up, .discover-stats').forEach(el => observer.observe(el));

/* ── Set default dates on quick booking ────────────────── */
(function() {
  const ci = document.getElementById('qb-checkin');
  const co = document.getElementById('qb-checkout');
  if (!ci || !co) return;
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 3);
  const fmt = d => d.toISOString().slice(0,10);
  ci.value = fmt(tomorrow);
  co.value = fmt(dayAfter);
  ci.min = fmt(today);
  co.min = fmt(tomorrow);
  ci.addEventListener('change', () => {
    const newMin = new Date(ci.value); newMin.setDate(newMin.getDate() + 1);
    co.min = fmt(newMin);
    if (co.value <= ci.value) co.value = fmt(newMin);
  });
})();
