// ============================================================
// MOBILE MENU
// ============================================================
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ============================================================
// SCROLL REVEAL (fade + slide-up on entry)
// ============================================================
const revealEls = document.querySelectorAll('.reveal, .reveal-title');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
}

function revealIfVisible() {
  revealEls.forEach(el => {
    if (!el.classList.contains('visible') && isInViewport(el)) {
      el.classList.add('visible');
    }
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    } else {
      // Leaving the viewport: reset so the animation replays next time
      // the element scrolls back into view (e.g. after going to the
      // bottom of the page and scrolling back up).
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Fallback: catches elements already in view on load (some browsers
// don't reliably fire the first IntersectionObserver callback before paint).
// Delayed slightly so the browser has time to paint the initial (hidden)
// state first — otherwise the animation has nothing to animate from.
requestAnimationFrame(() => {
  requestAnimationFrame(revealIfVisible);
});
window.addEventListener('load', revealIfVisible);
window.addEventListener('scroll', revealIfVisible, { passive: true });

// ============================================================
// SPLIT-FLAP NUMBER DISPLAY (airport-board style section numbers)
// ============================================================
function playFlap(group) {
  if (group.dataset.spinning === 'true') return; // avoid overlapping replays
  group.dataset.spinning = 'true';

  const target = group.dataset.flap || '00';
  const flaps = group.querySelectorAll('.flap');
  let remaining = flaps.length;

  flaps.forEach((flap, i) => {
    const targetDigit = parseInt(target[i], 10);
    let ticks = 8 + i * 5; // each subsequent digit spins a little longer
    const iv = setInterval(() => {
      if (ticks <= 0) {
        flap.textContent = targetDigit;
        clearInterval(iv);
        remaining--;
        if (remaining === 0) group.dataset.spinning = 'false';
        return;
      }
      flap.textContent = Math.floor(Math.random() * 10);
      ticks--;
    }, 45);
  });
}

const flapGroups = document.querySelectorAll('.flap-group');

const flapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      playFlap(entry.target);
    }
    // No else/reset needed: leaving the viewport simply lets the flaps
    // sit on their last value until playFlap() reruns on next entry.
  });
}, { threshold: 0.4 });

flapGroups.forEach(group => flapObserver.observe(group));

// Fallback for groups already in view on load (hero, etc.)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    flapGroups.forEach(group => {
      const rect = group.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        playFlap(group);
      }
    });
  });
});

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCount(el) {
  if (el.dataset.animating === 'true') return;
  el.dataset.animating = 'true';

  const target = parseFloat(el.dataset.count);
  const isDecimal = !Number.isInteger(target);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.dataset.animating = 'false';
    }
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ============================================================
// SKILL BARS ANIMATION
// ============================================================
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const fill = entry.target;
    if (entry.isIntersecting) {
      fill.style.width = fill.dataset.width + '%';
    } else {
      fill.style.width = '0%'; // reset so it animates again on re-entry
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-fill').forEach(el => barObserver.observe(el));

// ============================================================
// PROJECT FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.hidden = !show;
    });
  });
});

// ============================================================
// STRATEGY CARDS — click-to-expand (touch devices; desktop also gets :hover via CSS)
// ============================================================
document.querySelectorAll('.strategy-card').forEach(card => {
  card.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    document.querySelectorAll('.strategy-card.is-open').forEach(open => {
      if (open !== card) open.classList.remove('is-open');
    });
    card.classList.toggle('is-open', !wasOpen);
  });
});

// ============================================================
// DNDE FRAMEWORK LAYERS — same click-to-expand pattern
// ============================================================
document.querySelectorAll('.dnde-layer').forEach(layer => {
  layer.addEventListener('click', () => {
    const wasOpen = layer.classList.contains('is-open');
    document.querySelectorAll('.dnde-layer.is-open').forEach(open => {
      if (open !== layer) open.classList.remove('is-open');
    });
    layer.classList.toggle('is-open', !wasOpen);
  });
});

// ============================================================
// NARRATIVE ROLE CARDS — same click-to-expand pattern
// ============================================================
document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    document.querySelectorAll('.role-card.is-open').forEach(open => {
      if (open !== card) open.classList.remove('is-open');
    });
    card.classList.toggle('is-open', !wasOpen);
  });
});

// ============================================================
// ANIMATED BACKGROUND GRADIENT ON SCROLL
// ============================================================
function updateBgPosition() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  // moves the 400%-tall gradient vertically as the user scrolls
  document.body.style.backgroundPosition = `50% ${progress * 100}%`;
}
window.addEventListener('scroll', updateBgPosition, { passive: true });
updateBgPosition();

// ============================================================
// NAV BACKGROUND ON SCROLL
// ============================================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 20px rgba(11, 31, 77, 0.06)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
