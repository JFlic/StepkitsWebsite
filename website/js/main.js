/* ── Ring + counter animation ───────────────────────────── */
const STEP_TARGET   = 7842;
const STEP_GOAL     = 10000;
const RING_FILL_PCT = STEP_TARGET / STEP_GOAL;           // 0.7842
const CIRCUMFERENCE = 2 * Math.PI * 80;                 // ≈ 502.65

function animateRing() {
  const ring    = document.getElementById('ring-fill');
  const counter = document.getElementById('step-counter');
  const pct     = document.getElementById('ring-pct');
  if (!ring || !counter) return;

  // Trigger CSS transition
  const offset = CIRCUMFERENCE * (1 - RING_FILL_PCT);
  ring.style.strokeDashoffset = offset;

  // Counter count-up
  const duration = 2000;
  const start    = performance.now();
  function tick(now) {
    const elapsed  = Math.min(now - start, duration);
    const ease     = 1 - Math.pow(1 - elapsed / duration, 3);  // easeOutCubic
    const steps    = Math.round(ease * STEP_TARGET);
    const pctVal   = Math.round((steps / STEP_GOAL) * 100);
    counter.textContent = steps.toLocaleString();
    pct.textContent     = pctVal + '%';
    if (elapsed < duration) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Trigger once ring is in view
const ringObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) { animateRing(); ringObserver.disconnect(); } }),
  { threshold: 0.5 }
);
const ringEl = document.querySelector('.hero-ring-wrap');
if (ringEl) ringObserver.observe(ringEl);

/* ── Toast helper ───────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className   = `toast ${type} show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = `toast ${type}`; }, 3500);
}

/* ── Free waitlist form ─────────────────────────────────── */
const waitlistForm = document.getElementById('waitlist-form');
const waitlistStatus = document.getElementById('waitlist-status');

waitlistForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = waitlistForm.querySelector('input[type="email"]').value.trim();
  const btn   = waitlistForm.querySelector('button[type="submit"]');

  btn.disabled    = true;
  btn.textContent = 'Joining...';
  if (waitlistStatus) waitlistStatus.textContent = '';

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('server');

    showToast("You're on the list!", 'success');
    waitlistForm.reset();
    if (waitlistStatus) waitlistStatus.textContent = "✓ Check your inbox for confirmation.";
  } catch {
    showToast('Something went wrong. Try again.', 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Join Free Waitlist';
  }
});

/* ── Stripe checkout ────────────────────────────────────── */
const buyBtn = document.getElementById('buy-btn');

buyBtn?.addEventListener('click', async () => {
  buyBtn.disabled    = true;
  buyBtn.textContent = 'Loading...';

  try {
    const res  = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();

    if (!res.ok || !data.url) throw new Error(data.error || 'no_url');
    window.location.href = data.url;
  } catch (err) {
    console.error('Checkout error:', err);
    showToast('Payment failed to load. Try again.', 'error');
    buyBtn.disabled    = false;
    buyBtn.textContent = 'Get Early Access — $4.99';
  }
});
