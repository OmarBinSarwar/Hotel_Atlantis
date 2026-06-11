/* ═══════════════════════════════════════════════════════════
   ATLANTIS THE ROYAL — Booking Page JavaScript (booking.html)
   Connected to Next.js Backend API & MongoDB Atlas
   ═══════════════════════════════════════════════════════════ */

'use strict';

// Detect whether running locally or in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://atlantis-royal-backend.onrender.com'); // Replace with your Render URL when deployed

/* ══════════════════════════════════════
   STATE
   ══════════════════════════════════════ */
const state = {
  selectedRoomId: null,
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
   ROOM DATA (Populated dynamically)
   ══════════════════════════════════════ */
const ROOMS = {};

/* ══════════════════════════════════════
   INIT — Read URL Params & Fetch Rooms
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 3);
  const fmt = d => d.toISOString().slice(0,10);

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
  fetchRooms(); // Load rooms from backend
});

/* ══════════════════════════════════════
   FETCH ROOMS FROM DATABASE
   ══════════════════════════════════════ */
async function fetchRooms() {
  try {
    const list = document.getElementById('roomCardsList');
    if (!list) return;
    
    list.innerHTML = '<div style="color:var(--gold);text-align:center;grid-column:1/-1;padding:3rem 0;font-size:1.1rem;letter-spacing:0.1em;">LOADING LUXURY ROOMS...</div>';

    const res = await fetch(`${API_BASE_URL}/api/rooms`);
    const json = await res.json();
    
    if (json.success) {
      list.innerHTML = '';
      
      json.data.forEach(room => {
        // Populate global ROOMS helper
        ROOMS[room.id] = {
          id: room.id,
          title: room.name,
          eyebrow: room.type.toUpperCase(),
          desc: room.description,
          price: `$${room.price}`,
          img: room.image.replace('/images/', ''),
          specs: [
            { val: room.size, key: 'SIZE' },
            { val: room.maxGuests.toString(), key: 'GUESTS' },
            { val: room.bedType, key: 'BED' },
            { val: room.view, key: 'VIEW' }
          ],
          amenities: room.amenities
        };

        // Render card
        const card = document.createElement('div');
        card.className = 'room-result-card fade-in-up';
        card.dataset.type = room.type;
        card.dataset.price = room.price;
        card.dataset.size = parseInt(room.size);
        card.dataset.amenities = room.amenities.join(' ').toLowerCase();
        card.onclick = () => openRoomModal(room.id);

        card.innerHTML = `
          <div class="rrc-img-container">
            <img class="rrc-img" src="images/${room.image.replace('/images/', '')}" alt="${room.name}">
          </div>
          <div class="rrc-content">
            <div class="rrc-header">
              <div>
                <span class="rrc-eyebrow">${room.type.toUpperCase()}</span>
                <h3 class="rrc-title">${room.name}</h3>
              </div>
              <div class="rrc-price-tag">
                <span class="rrc-price">$${room.price.toLocaleString()}</span>
                <span class="rrc-per-night">/ night</span>
              </div>
            </div>
            <p class="rrc-desc">${room.description}</p>
            <div class="rrc-details">
              <div class="rrc-specs">
                <div class="rrc-spec">
                  <span class="rrc-spec-val">${room.size}</span>
                  <span class="rrc-spec-key">SIZE</span>
                </div>
                <div class="rrc-spec">
                  <span class="rrc-spec-val">${room.maxGuests}</span>
                  <span class="rrc-spec-key">GUESTS</span>
                </div>
                <div class="rrc-spec">
                  <span class="rrc-spec-val">${room.bedType}</span>
                  <span class="rrc-spec-key">BED</span>
                </div>
              </div>
              <button class="btn btn-gold rrc-btn">VIEW DETAILS →</button>
            </div>
          </div>
        `;
        list.appendChild(card);
      });

      document.getElementById('resultCount').textContent = json.data.length;
      
      // Trigger animations for loaded cards
      document.querySelectorAll('#roomCardsList .room-result-card').forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
        setTimeout(() => {
          c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          c.style.opacity = '1';
          c.style.transform = '';
        }, i * 60);
      });
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
    showToast('Failed to connect to backend server.');
  }
}

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
    const pct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  });
  if (priceRange) {
    const initPct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--gold) ${initPct}%, rgba(255,255,255,0.1) ${initPct}%)`;
  }

  // Amenity chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  document.getElementById('filtersReset')?.addEventListener('click', resetFilters);
  document.getElementById('filterApplyBtn')?.addEventListener('click', applyFilters);
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
}

/* ══════════════════════════════════════
   MODAL
   ══════════════════════════════════════ */
function openRoomModal(roomId) {
  const room = ROOMS[roomId];
  if (!room) return;

  document.getElementById('modalEyebrow').textContent   = room.eyebrow + ' ROOM';
  document.getElementById('modalTitle').textContent     = room.title;
  document.getElementById('modalDesc').textContent      = room.desc;
  document.getElementById('modalPrice').textContent     = room.price;
  document.getElementById('modalImg').src               = 'images/' + room.img;

  const specsEl = document.getElementById('modalSpecs');
  specsEl.innerHTML = room.specs.map(s =>
    `<div class="rrc-spec"><span class="rrc-spec-val">${s.val}</span><span class="rrc-spec-key">${s.key}</span></div>`
  ).join('');

  const amenEl = document.getElementById('modalAmenities');
  amenEl.innerHTML = room.amenities.map(a =>
    `<span class="rrc-amenity">${a}</span>`
  ).join('');

  const selectBtn = document.getElementById('modalSelectBtn');
  selectBtn.onclick = () => {
    selectRoom(room.id, room.title, room.price, room.img);
    closeModal();
  };

  document.getElementById('roomModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('roomModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('roomModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ══════════════════════════════════════
   ROOM SELECTION & BOOKING FLOW
   ══════════════════════════════════════ */
function selectRoom(roomId, name, price, img) {
  state.selectedRoomId = roomId;
  state.selectedRoom  = name;
  state.selectedPrice = typeof price === 'number' ? price : parseInt(price.replace(/[$,]/g, ''));
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

async function proceedToConfirm() {
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

  if (!state.checkin || !state.checkout || state.nights < 1) {
    showToast('Please select valid check-in and check-out dates.');
    return;
  }

  if (!state.selectedRoomId) {
    showToast('Please select a room first.');
    return;
  }

  const btn = document.getElementById('proceedBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> PROCESSING...';
  btn.disabled = true;

  try {
    const payload = {
      roomId: state.selectedRoomId,
      checkIn: state.checkin,
      checkOut: state.checkout,
      guests: state.guests,
      guestName: `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
      guestEmail: document.getElementById('guestEmail').value.trim(),
      guestPhone: document.getElementById('guestPhone').value.trim(),
      specialReq: document.getElementById('specialRequests')?.value.trim() || ''
    };

    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.success) {
      showConfirmation(json.data);
    } else {
      showToast(json.error || 'Failed to submit booking.');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  } catch (error) {
    console.error('Booking submission failed:', error);
    showToast('Network error, please try again.');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showConfirmation(bookingData) {
  document.getElementById('confirmRef').textContent    = 'BOOKING REFERENCE: #' + bookingData.reference;
  document.getElementById('confirmEmail').textContent  = bookingData.guestEmail;
  document.getElementById('cd-room').textContent       = bookingData.room.name;
  document.getElementById('cd-guest').textContent      = bookingData.guestName;
  document.getElementById('cd-checkin').textContent    = formatDate(bookingData.checkIn);
  document.getElementById('cd-checkout').textContent   = formatDate(bookingData.checkOut);
  document.getElementById('cd-guests').textContent     = bookingData.guests + ' Guest' + (bookingData.guests > 1 ? 's' : '');
  document.getElementById('cd-total').textContent      = formatCurrency(bookingData.totalPrice);

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
  // Standardize ISO format dates if returned from database
  const dateOnly = str.includes('T') ? str.split('T')[0] : str;
  return new Date(dateOnly + 'T00:00:00').toLocaleDateString('en-GB', {
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
