/* ═══════════════════════════════════════════════════════════════
   Directory V1 — App JS
   Reads from: DIR_CONFIG, CAFES_DATA, CATEGORY_MAP, CATEGORY_NAMES
   (all injected by build.js via dist/assets/js/data.js)
   NO localStorage — theme stored in cookie only
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── State ────────────────────────────────────────────────────────
let currentTheme = DIR_CONFIG.defaultTheme;

// ── Cookie helpers ───────────────────────────────────────────────
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}
function getPreferredTheme() {
  const saved = getCookie('dir-theme');
  return (saved === 'light' || saved === 'dark') ? saved : DIR_CONFIG.defaultTheme;
}

// ── Theme ────────────────────────────────────────────────────────
function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  setCookie('dir-theme', theme, 365);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
function toggleTheme() { setTheme(currentTheme === 'light' ? 'dark' : 'light'); }

// ── Navigation ───────────────────────────────────────────────────
function initNav() {
  const hamburger = document.getElementById('navHamburger');
  const links     = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');
  const close     = document.getElementById('navClose');
  if (hamburger) hamburger.addEventListener('click', () => {
    links.classList.add('open');
    overlay && overlay.classList.add('visible');
  });
  if (close) close.addEventListener('click', () => {
    links.classList.remove('open');
    overlay && overlay.classList.remove('visible');
  });
  if (overlay) overlay.addEventListener('click', () => {
    links.classList.remove('open');
    overlay.classList.remove('visible');
  });
  // Mark active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });
}

// ── Scroll to top ────────────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Fade-in ──────────────────────────────────────────────────────
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// ── Star rating HTML ─────────────────────────────────────────────
function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let h = '<span class="stars">';
  for (let i = 0; i < 5; i++) {
    if (i < full)            h += '<span class="star full">&#9733;</span>';
    else if (i===full&&half) h += '<span class="star half">&#9733;</span>';
    else                     h += '<span class="star">&#9733;</span>';
  }
  return h + '</span>';
}

// ── Card HTML (used by listings & category pages) ────────────────
function cafeCardHTML(cafe, basePath) {
  basePath = basePath || getBasePath();
  return `<article class="listing-card fade-in">
  <a href="${basePath}listing/${cafe.slug}.html" class="card-link">
    <div class="card-image">
      <img src="${cafe.photoUrl}" alt="${escapeHTML(cafe.name)}" loading="lazy" width="400" height="300"
        onerror="this.src='https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'">
      <span class="card-category-badge">${escapeHTML(cafe.category)}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHTML(cafe.name)}</h3>
      <div class="card-rating">
        ${starsHTML(cafe.rating)}
        <span class="rating-number">${cafe.rating}</span>
        <span class="review-count">(${cafe.reviews.toLocaleString()} reviews)</span>
      </div>
      <p class="card-address"><i data-lucide="map-pin"></i> ${escapeHTML(cafe.address)}</p>
      <div class="card-tags">${cafe.tags.slice(0,3).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
    </div>
  </a>
</article>`;
}

function escapeHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Sponsored card ───────────────────────────────────────────────
function sponsoredCardHTML() {
  return `<article class="listing-card" style="border-color:var(--color-accent);">
  <div class="card-image" style="background:linear-gradient(135deg,var(--color-bg-alt),var(--color-border));display:flex;align-items:center;justify-content:center;">
    <span class="card-sponsored-badge">Sponsored</span>
    <div style="text-align:center;padding:2rem;color:var(--color-text-muted);">
      <i data-lucide="coffee" style="width:40px;height:40px;margin:0 auto .5rem;opacity:.4;"></i>
      <p style="font-size:.8125rem;">Your business here</p>
    </div>
  </div>
  <div class="card-body">
    <h3 class="card-title">Promote Your Business</h3>
    <p style="font-size:.8125rem;color:var(--color-text-muted);margin-bottom:.75rem;">Reach thousands of customers with a featured listing.</p>
    <a href="contact.html" class="btn btn-gold btn-block" style="font-size:.8125rem;">Learn More</a>
  </div>
</article>`;
}

// ── Listings page ────────────────────────────────────────────────
function initListingsPage() {
  const grid        = document.getElementById('listingsGrid');
  const countEl     = document.getElementById('listingsCount');
  const paginationEl= document.getElementById('pagination');
  const sortSelect  = document.getElementById('sortSelect');
  const searchInput = document.getElementById('listingSearch');
  if (!grid) return;

  function getFilters() {
    const hash   = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    return {
      categories: params.getAll('category'),
      areas:      params.getAll('area').map(decodeURIComponent),
      minRating:  parseFloat(params.get('rating')) || 0,
      sort:       params.get('sort') || 'rating',
      page:       parseInt(params.get('page')) || 1,
      search:     params.get('q') || '',
    };
  }

  function setFilters(f) {
    const params = new URLSearchParams();
    f.categories.forEach(c => params.append('category', c));
    f.areas.forEach(a      => params.append('area', encodeURIComponent(a)));
    if (f.minRating) params.set('rating', f.minRating);
    if (f.sort !== 'rating') params.set('sort', f.sort);
    if (f.page > 1) params.set('page', f.page);
    if (f.search) params.set('q', f.search);
    window.location.hash = params.toString();
  }

  function filterAndSort() {
    const f  = getFilters();
    let data = [...CAFES_DATA];
    if (f.search) {
      const q = f.search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.address.toLowerCase().includes(q)
      );
    }
    if (f.categories.length) {
      data = data.filter(c => f.categories.includes(CATEGORY_MAP[c.category]));
    }
    if (f.areas.length) {
      data = data.filter(c => f.areas.includes(c.area));
    }
    if (f.minRating) {
      data = data.filter(c => c.rating >= f.minRating);
    }
    if (f.sort === 'reviews') data.sort((a,b) => b.reviews - a.reviews);
    else if (f.sort === 'name') data.sort((a,b) => a.name.localeCompare(b.name));
    else data.sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);
    return { data, page: f.page, filters: f };
  }

  function render() {
    const { data, page, filters } = filterAndSort();
    const PER = DIR_CONFIG.perPage;
    const totalPages = Math.ceil(data.length / PER);
    const start      = (page - 1) * PER;
    const pageData   = data.slice(start, start + PER);

    let html = '';
    pageData.forEach((c, i) => {
      if (i === DIR_CONFIG.sponsoredAt - 1 && page === 1) html += sponsoredCardHTML();
      html += cafeCardHTML(c, '');
    });
    if (!pageData.length) {
      html = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--color-text-muted);">${DIR_CONFIG.city ? `No ${DIR_CONFIG.niche} found matching your filters.` : 'No results.'}</div>`;
    }
    grid.innerHTML = html;
    if (countEl) countEl.textContent = `${data.length} listing${data.length !== 1 ? 's' : ''} found`;

    if (paginationEl) {
      if (totalPages > 1) {
        let ph = `<button class="pagination__btn" onclick="changePage(${page-1})" ${page===1?'disabled':''}>Previous</button>`;
        for (let i=1;i<=totalPages;i++) ph += `<button class="pagination__btn ${i===page?'active':''}" onclick="changePage(${i})">${i}</button>`;
        ph += `<button class="pagination__btn" onclick="changePage(${page+1})" ${page===totalPages?'disabled':''}>Next</button>`;
        paginationEl.innerHTML = ph;
        paginationEl.style.display = 'flex';
      } else {
        paginationEl.style.display = 'none';
      }
    }

    if (sortSelect) sortSelect.value = filters.sort;
    if (searchInput) searchInput.value = filters.search;
    document.querySelectorAll('[data-filter-category]').forEach(cb => cb.checked = filters.categories.includes(cb.value));
    document.querySelectorAll('[data-filter-area]').forEach(cb => cb.checked = filters.areas.includes(decodeURIComponent(cb.value)));
    document.querySelectorAll('[data-filter-rating]').forEach(rb => rb.checked = parseFloat(rb.value) === filters.minRating);

    if (typeof lucide !== 'undefined') lucide.createIcons();
    initFadeIn();
  }

  window.changePage = p => { const f = getFilters(); f.page = p; setFilters(f); };

  if (sortSelect) sortSelect.addEventListener('change', () => {
    const f = getFilters(); f.sort = sortSelect.value; f.page = 1; setFilters(f);
  });
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { const f = getFilters(); f.search = searchInput.value; f.page = 1; setFilters(f); }, 300);
    });
  }
  document.querySelectorAll('[data-filter-category]').forEach(cb => cb.addEventListener('change', () => {
    const f = getFilters();
    f.categories = [...document.querySelectorAll('[data-filter-category]:checked')].map(c => c.value);
    f.page = 1; setFilters(f);
  }));
  document.querySelectorAll('[data-filter-area]').forEach(cb => cb.addEventListener('change', () => {
    const f = getFilters();
    f.areas = [...document.querySelectorAll('[data-filter-area]:checked')].map(c => decodeURIComponent(c.value));
    f.page = 1; setFilters(f);
  }));
  document.querySelectorAll('[data-filter-rating]').forEach(rb => rb.addEventListener('change', () => {
    const f = getFilters();
    const checked = document.querySelector('[data-filter-rating]:checked');
    f.minRating = checked ? parseFloat(checked.value) : 0;
    f.page = 1; setFilters(f);
  }));

  // Mobile filter sidebar
  const filterToggle  = document.getElementById('filterToggle');
  const sidebar       = document.getElementById('filterSidebar');
  const filterClose   = document.getElementById('filterClose');
  const filterOverlay = document.getElementById('filterOverlay');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => { sidebar.classList.add('open'); filterOverlay && filterOverlay.classList.add('visible'); });
  }
  if (filterClose) filterClose.addEventListener('click', () => { sidebar.classList.remove('open'); filterOverlay && filterOverlay.classList.remove('visible'); });
  if (filterOverlay) filterOverlay.addEventListener('click', () => { sidebar.classList.remove('open'); filterOverlay.classList.remove('visible'); });
  const applyBtn = document.getElementById('filterApply');
  if (applyBtn) applyBtn.addEventListener('click', () => { sidebar.classList.remove('open'); filterOverlay && filterOverlay.classList.remove('visible'); });

  window.addEventListener('hashchange', render);
  render();
}

// ── Category page ────────────────────────────────────────────────
function initCategoryPage() {
  const grid    = document.getElementById('categoryGrid');
  const countEl = document.getElementById('categoryCount');
  if (!grid) return;
  const catSlug = grid.dataset.category;
  const data    = CAFES_DATA.filter(c => CATEGORY_MAP[c.category] === catSlug)
                            .sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);
  if (countEl) countEl.textContent = `${data.length} listings`;
  grid.innerHTML = data.map(c => cafeCardHTML(c, '../')).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initFadeIn();
}

// ── Leaflet map ──────────────────────────────────────────────────
function initMap() {
  const mapEl = document.getElementById('listingMap');
  if (!mapEl || typeof L === 'undefined') return;
  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);
  if (isNaN(lat) || isNaN(lng)) return;
  mapEl.innerHTML = '';
  const map = L.map(mapEl).setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 19,
  }).addTo(map);
  L.marker([lat, lng]).addTo(map);
  setTimeout(() => map.invalidateSize(), 200);
}

// ── Home search ──────────────────────────────────────────────────
function initHomeSearch() {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input')?.value.trim();
    window.location.href = q ? `listings.html#q=${encodeURIComponent(q)}` : 'listings.html';
  });
}

// ── Share button ─────────────────────────────────────────────────
function initShare() {
  const btn = document.getElementById('shareBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href });
    } else {
      const ta = Object.assign(document.createElement('textarea'), { value: location.href });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      const orig = btn.innerHTML;
      btn.textContent = 'Link Copied!';
      setTimeout(() => { btn.innerHTML = orig; lucide.createIcons(); }, 2000);
    }
  });
}

// ── Contact form ─────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sent! We\'ll be in touch soon.';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; form.reset(); }, 4000);
  });
}

// ── Base path util ───────────────────────────────────────────────
function getBasePath() {
  const p = window.location.pathname;
  return (p.includes('/listing/') || p.includes('/category/')) ? '../' : '';
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  currentTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  initNav();
  initScrollTop();
  initFadeIn();
  initHomeSearch();
  initListingsPage();
  initCategoryPage();
  initMap();
  initShare();
  initContactForm();

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
