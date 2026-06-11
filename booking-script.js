/* ═══════════════════════════════════════════════════════════
   ATLANTIS THE ROYAL — Booking Page JavaScript (booking.html)
   Pure UI — no backend calls
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const state = {
  selectedRoom:  null,
  selectedPrice: 0,
  selectedImg:   'suite.png',
  checkin:       null,
  checkout:      null,
  nights:        0,
  guests:        2,
  currentStep:   1,
};

/* ══════════════════════════════════════
   ROOM DATA
══════════════════════════════════════ */
const ROOMS = {
  'deluxe-ocean': {
    title: 'Deluxe Ocean Room',
    eyebrow: 'DELUXE ROOM',
    desc: 'Wake up to panoramic Arabian Gulf views from your king-size bed. Marble bathrooms, premium linens, and your own private balcony await — an elegant retreat for the discerning guest.',
    price: '$850',
    img: 'suite.png',
    specs: [
      { val: '52m²', key: 'SIZE' },
      { val: '2',    key: 'GUESTS' },
      { val: '25F',  key: 'FLOOR' },
      { val: 'King', key: 'BED' },
    ],
    amenities: ['Ocean View','Private Balcony','Marble Bathroom','King Bed','24hr Room Service','Mini Bar','Walk-in Wardrobe','Smart TV','Nespresso Machine','Rain Shower'],
  },
  'ocean-suite': {
    title: 'Grand Ocean Suite',
    eyebrow: 'GRAND SUITE',
    desc: 'A sweeping two-room sanctuary with a wraparound terrace, separate living area, and bespoke amenities curated for the discerning traveller. Dubai\'s skyline as your backdrop.',
    price: '$1,800',
    img: 'pool.png',
    specs: [
      { val: '120m²', key: 'SIZE' },
      { val: '3',     key: 'GUESTS' },
      { val: '35F',   key: 'FLOOR' },
      { val: 'King',  key: 'BED' },
    ],
    amenities: ['Wraparound Terrace','Ocean Panorama','Living Room','Soaking Tub','Espresso Bar','Butler (on request)','Dining Table for 4','Smart Home Controls','Pillow Menu','Luxury Toiletries'],
  },
  'royal-suite': {
    title: 'Royal Ocean Suite',
    eyebrow: 'SIGNATURE SUITE',
    desc: 'A two-floor private sanctuary complete with your own plunge pool, dedicated butler, and sunset cocktail service every evening. Unrivalled luxury in every detail.',
    price: '$2,400',
    img: 'suite.png',
    specs: [
      { val: '180m²', key: 'SIZE' },
      { val: '4',     key: 'GUESTS' },
      { val: '42F',   key: 'FLOOR' },
      { val: '2',     key: 'BEDROOMS' },
    ],
    amenities: ['Private Plunge Pool','Dedicated Butler','Jacuzzi','2 Bedrooms','Sunset Cocktail Service','Private Dining','Cinema Room','Walk-in Closet','Bose Sound System','Champagne on Arrival'],
  },
  'sky-villa': {
    title: 'Sky Villa',
    eyebrow: 'SKY VILLA',
    desc: 'Your private sky residence above the world. Four bedrooms, a sky-high infinity pool, personal chef, and 380 square metres of pure indulgence suspended above the Gulf.',
    price: '$5,800',
    img: 'beach.png',
    specs: [
      { val: '380m²',  key: 'SIZE' },
      { val: '8',      key: 'GUESTS' },
      { val: 'Top 5F', key: 'FLOORS' },
      { val: '4',      key: 'BEDROOMS' },
    ],
    amenities: ['Infinity Pool','Personal Chef','4 Bedrooms','Home Theatre','Sky Garden','Helipad Access','Gym','Wine Cellar','Yacht Transfer','Private Spa'],
  },
  'premier-gulf': {
    title: 'Premier Gulf View Room',
    eyebrow: 'PREMIER ROOM',
    desc: 'Elevated elegance with oversized panoramic windows framing the entire Arabian Gulf. Features a separate dressing room and double vanity for the modern luxury traveller.',
    price: '$1,100',
    img: 'restaurant.png',
    specs: [
      { val: '68m²', key: 'SIZE' },
      { val: '2',    key: 'GUESTS' },
      { val: '30F',  key: 'FLOOR' },
      { val: 'King', key: 'BED' },
    ],
    amenities: ['Gulf Panorama','Dressing Room','Double Vanity','Deep Soak Tub','L\'Occitane Toiletries','24hr Butler','Smart TV','High-speed WiFi','Mini Bar','Pillow Menu'],
  },
  'wellness-suite': {
    title: 'Wellness Sanctuary Suite',
    eyebrow: 'WELLNESS SUITE',
    desc: 'The hotel\'s first dedicated wellness suite — featuring an in-suite steam room, cold plunge, infrared sauna, and a private wellness concierge available around the clock.',
    price: '$3,500',
    img: 'spa.png',
    specs: [
      { val: '240m²', key: 'SIZE' },
      { val: '2',     key: 'GUESTS' },
      { val: '38F',   key: 'FLOOR' },
      { val: 'King',  key: 'BED' },
    ],
    amenities: ['Infrared Sauna','Steam Room','Cold Plunge','Wellness Concierge','Meditation Garden','Aromatherapy','Yoga Mat & Blocks','Detox Menu','Sleep Therapy','Sound Bath Session'],
  },
  'imperial-penthouse': {
    title: 'Imperial Penthouse',
    eyebrow: 'IMPERIAL PENTHOUSE',
    desc: 'The entire top floor — your private kingdom above the clouds. 360° views of Dubai, an Olympic-length lap pool, a private cinema, and an entourage of 12 dedicated staff.',
    price: '$12,000',
    img: 'hero-aerial.png',
    specs: [
      { val: '800m²',    key: 'SIZE' },
      { val: '16',       key: 'GUESTS' },
      { val: 'Full 60F', key: 'FLOOR' },
      { val: '6',        key: 'BEDROOMS' },
    ],
    amenities: ['Entire Top Floor','Lap Pool','12 Staff Members','360° Views','Private Cinema','Helipad','Grand Piano','Wine Cellar','Yacht Transfer','Press Conference Room','Personal Stylist','Rolls-Royce Transfer'],
  },
  'royal-garden': {
    title: 'Royal Garden Suite',
    eyebrow: 'GARDEN SUITE',
    desc: 'A lush tropical garden sanctuary attached to your suite — a private dining pavilion draped in hanging gardens, your own plunge pool and butler service, all at ground level.',
    price: '$4,200',
    img: 'pool.png',
    specs: [
      { val: '290m²',  key: 'SIZE' },
      { val: '6',      key: 'GUESTS' },
      { val: 'Garden', key: 'LEVEL' },
      { val: '3',      key: 'BEDROOMS' },
    ],
    amenities: ['Private Garden','Dining Pavilion','Plunge Pool','Butler Service','3 Bedrooms','Outdoor Kitchen','Fire Pit','BBQ Area','Sunrise Yoga','Tropical Shower'],
  },
};

/* ══════════════════════════════════════
   INIT — Read URL Params
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 3);
  const fmt = d => d.toISOString().slice(0,10);
  const fmtDisplay = d => d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });

  const params = new URLSearchParams(window.location.search);
  const ciParam = params.get('checkin')  || fmt(tomorrow);
  const coParam = params.get('checkout') || fmt(dayAfter);
  const gParam  = parseInt(params.get('guests') || '2');

  state.checkin  = ciParam;
  state.checkout = coParam;
  state.guests   = gParam;

  const filterCheckin  = document.getElementById('filterCheckin');
  const filterCheckout = document.getElementById('filterCheckout');
  const guestCountEl   = document.getElementById('guestCount');

  if (filterCheckin)  { filterCheckin.value  = ciParam; filterCheckin.min = fmt(today); }
  if (filterCheckout) { filterCheckout.value = coParam; filterCheckout.min = ciParam; }
  if (guestCountEl)   guestCountEl.textContent = gParam;

  updateNights();
  updateSummaryDates();

  // Pre-fill room type filter if passed
  const rtParam = params.get('roomtype');
  const roomTypeSelect = document.getElementById('filterRoomType');
  if (rtParam && roomTypeSelect) roomTypeSelect.value = rtParam;

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in-up').forEach(el => revealObserver.observe(el));

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 0);
    });
  }

  initFilters();
  initMobileMenu();
  initCardInputs();
});

/* ══════════════════════════════════════
   FILTERS
══════════════════════════════════════ */
function initFilters() {
  // Guest counter
  const guestMinus = document.getElementById('guestMinus');
  const guestPlus  = document.getElementById('guestPlus');
  const guestCountEl = document.getElementById('guestCount');

  guestMinus?.addEventListener('click', () => {
    if (state.guests > 1) {
      state.guests--;
      guestCountEl.textContent = state.guests;
    }
  });
  guestPlus?.addEventListener('click', () => {
    if (state.guests < 16) {
      state.guests++;
      guestCountEl.textContent = state.guests;
    }
  });

  // Price range
  const priceRange = document.getElementById('priceRange');
  const priceLabel = document.getElementById('priceRangeLabel');
  priceRange?.addEventListener('input', () => {
    priceLabel.textContent = '$' + parseInt(priceRange.value).toLocaleString();
    // Update range track fill
    const pct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  });
  // Initialize range fill
  if (priceRange) {
    const initPct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--gold) ${initPct}%, rgba(255,255,255,0.1) ${initPct}%)`;
  }

  // Amenity chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  // Reset filters
  document.getElementById('filtersReset')?.addEventListener('click', resetFilters);

  // Apply / Search
  document.getElementById('filterApplyBtn')?.addEventListener('click', applyFilters);

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  // Date sync
  const filterCheckin  = document.getElementById('filterCheckin');
  const filterCheckout = document.getElementById('filterCheckout');
  filterCheckin?.addEventListener('change', () => {
    state.checkin = filterCheckin.value;
    const nextDay = new Date(filterCheckin.value); nextDay.setDate(nextDay.getDate() + 1);
    filterCheckout.min = nextDay.toISOString().slice(0,10);
    if (filterCheckout.value <= filterCheckin.value)
      filterCheckout.value = nextDay.toISOString().slice(0,10);
    state.checkout = filterCheckout.value;
    updateNights();
    updateSummaryDates();
  });
  filterCheckout?.addEventListener('change', () => {
    state.checkout = filterCheckout.value;
    updateNights();
    updateSummaryDates();
  });

  // View toggle
  document.getElementById('gridViewBtn')?.addEventListener('click', () => {
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
  });
  document.getElementById('listViewBtn')?.addEventListener('click', () => {
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
  });
}

function resetFilters() {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 3);
  const fmt = d => d.toISOString().slice(0,10);

  document.getElementById('filterCheckin').value  = fmt(tomorrow);
  document.getElementById('filterCheckout').value = fmt(dayAfter);
  document.getElementById('guestCount').textContent = '2';
  document.getElementById('filterRoomType').value = '';
  document.getElementById('priceRange').value = 15000;
  document.getElementById('priceRangeLabel').textContent = '$15,000';
  const pct = 100;
  document.getElementById('priceRange').style.background = `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));

  state.guests = 2; state.checkin = fmt(tomorrow); state.checkout = fmt(dayAfter);
  updateNights(); updateSummaryDates();
  applyFilters();
}

function applyFilters() {
  const type     = document.getElementById('filterRoomType')?.value || '';
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 15000);
  const sortVal  = document.getElementById('sortSelect')?.value || 'recommended';
  const activeChips = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.amenity);

  const cards = [...document.querySelectorAll('#roomCardsList .room-result-card')];
  let visible = 0;

  cards.forEach(card => {
    const cardType  = card.dataset.type;
    const cardPrice = parseInt(card.dataset.price);
    const cardAmenities = card.dataset.amenities || '';

    const typeMatch  = !type || cardType === type;
    const priceMatch = cardPrice <= maxPrice;
    const chipMatch  = activeChips.length === 0 || activeChips.every(a => cardAmenities.includes(a));

    const show = typeMatch && priceMatch && chipMatch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Sort visible cards
  const list = document.getElementById('roomCardsList');
  const visibleCards = cards.filter(c => c.style.display !== 'none');
  visibleCards.sort((a, b) => {
    if (sortVal === 'price-asc')  return parseInt(a.dataset.price) - parseInt(b.dataset.price);
    if (sortVal === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
    if (sortVal === 'size')       return parseInt(b.dataset.size)  - parseInt(a.dataset.size);
    return 0;
  });
  visibleCards.forEach(c => list.appendChild(c));

  document.getElementById('resultCount').textContent = visible;

  // Add a nice flash to updated cards
  visibleCards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    setTimeout(() => {
      c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      c.style.opacity = '1';
      c.style.transform = '';
    }, i * 60);
  });
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
function openRoomModal(roomId) {
  const room = ROOMS[roomId];
  if (!room) return;

  document.getElementById('modalEyebrow').textContent   = room.eyebrow;
  document.getElementById('modalTitle').textContent     = room.title;
  document.getElementById('modalDesc').textContent      = room.desc;
  document.getElementById('modalPrice').textContent     = room.price;
  document.getElementById('modalImg').src               = 'images/' + room.img;

  // Specs
  const specsEl = document.getElementById('modalSpecs');
  specsEl.innerHTML = room.specs.map(s =>
    `<div class="rrc-spec"><span class="rrc-spec-val">${s.val}</span><span class="rrc-spec-key">${s.key}</span></div>`
  ).join('');

  // Amenities
  const amenEl = document.getElementById('modalAmenities');
  amenEl.innerHTML = room.amenities.map(a =>
    `<span class="rrc-amenity">${a}</span>`
  ).join('');

  // Select button
  const selectBtn = document.getElementById('modalSelectBtn');
  selectBtn.onclick = () => {
    selectRoom(room.title, room.price, room.img);
    closeModal();
  };

  document.getElementById('roomModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('roomModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.getElementById('roomModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ══════════════════════════════════════
   ROOM SELECTION / BOOKING FLOW
══════════════════════════════════════ */
function selectRoom(name, price, img) {
  state.selectedRoom  = name;
  state.selectedPrice = parseInt(price.replace(/[$,]/g, ''));
  state.selectedImg   = img;

  updateSummary();
  goToStep2();
}

function goToStep2() {
  document.getElementById('bookingStep1').style.display = 'none';
  document.getElementById('bookingStep2').style.display = 'block';
  document.getElementById('bookingStep3').style.display = 'none';

  setStep(2);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBackToStep1() {
  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';
  document.getElementById('bookingStep3').style.display = 'none';
  setStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function proceedToConfirm() {
  // Basic validation
  const required = ['firstName','lastName','guestEmail','guestPhone','cardName','cardNumber','cardExpiry','cardCvv'];
  let valid = true;

  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.style.borderColor = '#e05252';
      el.classList.add('error-shake');
      setTimeout(() => el.classList.remove('error-shake'), 500);
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields.');
    return;
  }

  // Check dates
  if (!state.checkin || !state.checkout || state.nights < 1) {
    showToast('Please select valid check-in and check-out dates.');
    return;
  }

  // Show loading state
  const btn = document.getElementById('proceedBtn');
  btn.innerHTML = '<span class="spinner"></span> PROCESSING...';
  btn.disabled = true;

  // Simulate processing
  setTimeout(() => {
    btn.innerHTML = 'CONFIRM BOOKING →';
    btn.disabled = false;
    showConfirmation();
  }, 1800);
}

function showConfirmation() {
  const firstName = document.getElementById('firstName')?.value || '';
  const lastName  = document.getElementById('lastName')?.value  || '';
  const email     = document.getElementById('guestEmail')?.value || '';
  const ref       = 'AR-' + Math.random().toString(36).substring(2,8).toUpperCase();

  document.getElementById('confirmRef').textContent    = 'BOOKING REFERENCE: #' + ref;
  document.getElementById('confirmEmail').textContent  = email;
  document.getElementById('cd-room').textContent       = state.selectedRoom || '—';
  document.getElementById('cd-guest').textContent      = `${firstName} ${lastName}`;
  document.getElementById('cd-checkin').textContent    = formatDate(state.checkin);
  document.getElementById('cd-checkout').textContent   = formatDate(state.checkout);
  document.getElementById('cd-guests').textContent     = state.guests + ' Guest' + (state.guests > 1 ? 's' : '');
  document.getElementById('cd-total').textContent      = formatCurrency(calcTotal());

  document.getElementById('bookingStep1').style.display = 'none';
  document.getElementById('bookingStep2').style.display = 'none';
  document.getElementById('bookingStep3').style.display = 'block';
  setStep(3);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   SUMMARY HELPERS
══════════════════════════════════════ */
function updateNights() {
  if (!state.checkin || !state.checkout) return;
  const ci = new Date(state.checkin);
  const co = new Date(state.checkout);
  const diff = Math.round((co - ci) / 86400000);
  state.nights = diff > 0 ? diff : 0;
}

function updateSummaryDates() {
  const ciEl = document.getElementById('summaryCheckin');
  const coEl = document.getElementById('summaryCheckout');
  const nEl  = document.getElementById('summaryNights');
  if (ciEl) ciEl.textContent = state.checkin  ? formatDate(state.checkin)  : '— Select —';
  if (coEl) coEl.textContent = state.checkout ? formatDate(state.checkout) : '— Select —';
  if (nEl)  nEl.textContent  = state.nights   ? state.nights + (state.nights === 1 ? ' night' : ' nights') : '—';
  updateSummary();
}

function updateSummary() {
  const imgEl   = document.getElementById('summaryImg');
  const nameEl  = document.getElementById('summaryRoomName');
  const rateEl  = document.getElementById('summaryRate');
  const subEl   = document.getElementById('summarySubtotal');
  const taxEl   = document.getElementById('summaryTax');
  const totalEl = document.getElementById('summaryTotal');
  const guestEl = document.getElementById('summaryGuests');

  if (imgEl   && state.selectedImg)  imgEl.src = 'images/' + state.selectedImg;
  if (nameEl  && state.selectedRoom) nameEl.textContent = state.selectedRoom;
  if (guestEl) guestEl.textContent = state.guests + ' Guest' + (state.guests > 1 ? 's' : '');

  if (state.selectedPrice > 0) {
    const priceStr = formatCurrency(state.selectedPrice) + ' / night';
    if (rateEl) rateEl.textContent = priceStr;

    if (state.nights > 0) {
      const subtotal = state.selectedPrice * state.nights;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;
      if (subEl)   subEl.textContent  = formatCurrency(subtotal);
      if (taxEl)   taxEl.textContent  = formatCurrency(tax);
      if (totalEl) totalEl.textContent = formatCurrency(total);
    } else {
      if (subEl)   subEl.textContent   = '—';
      if (taxEl)   taxEl.textContent   = '—';
      if (totalEl) totalEl.textContent = '—';
    }
  }
}

function calcTotal() {
  const subtotal = state.selectedPrice * state.nights;
  return subtotal + Math.round(subtotal * 0.05);
}

/* ══════════════════════════════════════
   STEPS UI
══════════════════════════════════════ */
function setStep(n) {
  state.currentStep = n;
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`step-${i}-indicator`);
    if (!el) continue;
    el.classList.remove('active','completed');
    if (i < n)  el.classList.add('completed');
    if (i === n) el.classList.add('active');
    // Update circle text
    const circle = el.querySelector('.step-circle');
    if (circle) circle.textContent = i < n ? '✓' : i;
  }
}

/* ══════════════════════════════════════
   CARD INPUT FORMATTING
══════════════════════════════════════ */
function initCardInputs() {
  const cardNum = document.getElementById('cardNumber');
  cardNum?.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,16);
    this.value = v.match(/.{1,4}/g)?.join(' ') || v;
  });

  const expiry = document.getElementById('cardExpiry');
  expiry?.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,4);
    if (v.length >= 3) v = v.slice(0,2) + ' / ' + v.slice(2);
    this.value = v;
  });

  const cvv = document.getElementById('cardCvv');
  cvv?.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g,'').slice(0,4);
  });
}

/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('navMenuToggle');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('mobileClose');
  toggle?.addEventListener('click', () => menu.classList.add('open'));
  close?.addEventListener('click',  () => menu.classList.remove('open'));
}

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function formatDate(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US');
}

function showToast(msg) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);
      background:#1e1e1e;border:1px solid rgba(201,168,76,0.3);color:#fff;
      padding:1rem 2rem;border-radius:3px;font-size:0.82rem;letter-spacing:0.08em;
      z-index:9999;opacity:0;transition:all 0.4s ease;pointer-events:none;
      box-shadow:0 10px 40px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3500);
}

/* Error shake animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes errorShake {
    0%,100%{ transform:translateX(0); }
    25%    { transform:translateX(-6px); }
    75%    { transform:translateX(6px); }
  }
  .error-shake { animation: errorShake 0.35s ease; }
`;
document.head.appendChild(style);

window.openRoomModal = openRoomModal;
window.closeModal = closeModal;
window.selectRoom = selectRoom;
window.goBackToStep1 = goBackToStep1;
window.proceedToConfirm = proceedToConfirm;
