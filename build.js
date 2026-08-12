#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// DIRECTORY V1 — Build Script
// Uso: node build.js
// Lê config.js + data/listings.js → gera dist/ completo
// ═══════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const CFG      = require('./config.js');
const LISTINGS = require('./data/listings.js');

const DIST = path.join(__dirname, 'dist');

// ── Helpers ─────────────────────────────────────────────────────

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readTemplate(name) {
  return fs.readFileSync(path.join(__dirname, 'templates', name + '.html'), 'utf8');
}

function write(filePath, content) {
  const full = path.join(DIST, filePath);
  mkdirp(path.dirname(full));
  fs.writeFileSync(full, content, 'utf8');
  console.log('  ✓', filePath);
}

function pexelsUrl(id, w, h) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w || 1200}&h=${h || 800}&fit=crop`;
}

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let h = '<span class="stars">';
  for (let i = 0; i < 5; i++) {
    if (i < full)           h += '<span class="star full">&#9733;</span>';
    else if (i===full&&half)h += '<span class="star half">&#9733;</span>';
    else                    h += '<span class="star">&#9733;</span>';
  }
  return h + '</span>';
}

function reviewsLabel(n) {
  return n.toLocaleString('en-US') + ' reviews';
}

// Build category slug map: "Specialty Coffee" → "specialty"
function catSlug(listing) {
  const cat = CFG.categories.find(c => c.schemaKey === listing.category);
  return cat ? cat.slug : listing.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function catLabel(schemaKey) {
  const cat = CFG.categories.find(c => c.schemaKey === schemaKey);
  return cat ? cat.label : schemaKey;
}

// ── Block Generators ────────────────────────────────────────────

function blockNavLinks(basePath) {
  basePath = basePath || '';
  const links = CFG.navLinks.map(l => {
    const href = basePath ? basePath + l.href : l.href;
    return `<a href="${href}" class="nav__link">${l.label}</a>`;
  }).join('\n        ');
  const ctaHref = p => basePath + p;
  return `${links}
        <a href="${ctaHref(CFG.mobileCtaHref)}" class="btn btn-primary nav__mobile-cta" style="display:none;">${CFG.mobileCtaLabel}</a>`;
}

function blockNavActions(basePath) {
  basePath = basePath || '';
  return `<a href="${basePath}${CFG.ctaSecondary.href}" class="btn btn-gold nav__cta" style="font-size:0.8125rem;">${CFG.ctaSecondary.label}</a>
        <a href="${basePath}${CFG.ctaPrimary.href}" class="btn btn-primary nav__cta" style="font-size:0.8125rem;">${CFG.ctaPrimary.label}</a>`;
}

function blockStats() {
  return CFG.stats.map(s =>
    `<div><span class="stat__number">${s.number}</span><span class="stat__label">${s.label}</span></div>`
  ).join('\n        ');
}

function blockCategories(basePath) {
  basePath = basePath || '';
  return CFG.categories.map(c => {
    const count = LISTINGS.filter(l => l.category === c.schemaKey).length;
    return `<a href="${basePath}category/${c.slug}.html" class="category-card">
          <div class="category-icon"><i data-lucide="${c.icon}"></i></div>
          <div class="category-name">${c.label}</div>
          <div class="category-count">${count} listing${count !== 1 ? 's' : ''}</div>
        </a>`;
  }).join('\n        ');
}

function listingCardHTML(l, basePath) {
  basePath = basePath || '';
  const photoUrl = l.photoUrl || pexelsUrl(l.pexelsId, 400, 300);
  const slug     = catSlug(l);
  return `<article class="listing-card fade-in visible"
  data-slug="${slug}"
  data-area="${(l.area || '').replace(/"/g, '&quot;')}"
  data-rating="${l.rating}"
  data-reviews="${l.reviews}"
  data-name="${l.name.toLowerCase().replace(/"/g, '&quot;')}"
  data-tags="${l.tags.join(',').toLowerCase()}">
  <a href="${basePath}listing/${l.slug}.html" class="card-link">
    <div class="card-image">
      <img src="${photoUrl}" alt="${l.name}" loading="lazy" width="400" height="300" onerror="this.src='${pexelsUrl('302899',400,300)}'">
      <span class="card-category-badge">${l.category}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${l.name}</h3>
      <div class="card-rating">
        ${starsHTML(l.rating)}
        <span class="rating-number">${l.rating}</span>
        <span class="review-count">(${reviewsLabel(l.reviews)})</span>
      </div>
      <p class="card-address"><i data-lucide="map-pin"></i> ${l.address}</p>
      <div class="card-tags">${l.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>
  </a>
</article>`;
}

// Pre-renders all cards with data-* attributes into the static listings grid.
// JS will show/hide these elements — no innerHTML replacement needed.
function blockListingsGrid() {
  const sorted = [...LISTINGS].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  return sorted.map(l => listingCardHTML(l, '')).join('\n');
}

function blockTopRated(basePath) {
  const sorted = [...LISTINGS].sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);
  return sorted.slice(0, CFG.topRatedCount).map(l => listingCardHTML(l, basePath)).join('\n');
}

function blockRecentlyAdded(basePath) {
  // Use featured ones first, then rest
  const featured = LISTINGS.filter(l => l.featured).slice(0, CFG.recentlyAddedCount);
  const rest     = LISTINGS.filter(l => !l.featured).slice(0, CFG.recentlyAddedCount - featured.length);
  return [...featured, ...rest].slice(0, CFG.recentlyAddedCount).map(l => listingCardHTML(l, basePath)).join('\n');
}

function blockFooterCategoryLinks(basePath) {
  basePath = basePath || '';
  return CFG.categories.map(c =>
    `<li><a href="${basePath}category/${c.slug}.html">${c.label}</a></li>`
  ).join('\n            ');
}

function blockFooterAreaLinks(basePath) {
  basePath = basePath || '';
  const areas = [...new Set(LISTINGS.map(l => l.area))].filter(Boolean).slice(0, 4);
  return areas.map(a =>
    `<li><a href="${basePath}listings.html#area=${encodeURIComponent(a)}">${a}</a></li>`
  ).join('\n            ');
}

function blockPricingCards() {
  return CFG.pricing.plans.map(p => `
    <div class="pricing-card ${p.popular ? 'pricing-card--featured' : ''}">
      <div class="pricing-card__name">${p.name}</div>
      <div class="pricing-card__price">${CFG.pricing.currencySymbol}${p.setup}</div>
      <div class="pricing-card__period">setup + ${CFG.pricing.currencySymbol}${p.monthly}/month</div>
      <ul class="pricing-card__features">
        ${p.features.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
      <a href="contact.html" class="btn btn-primary btn-block">Get Started</a>
    </div>`
  ).join('\n');
}

function hoursHTML(hours) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  return days.map(d => {
    const val = hours[d] || '—';
    const closed = val === '—' || val.toLowerCase() === 'closed';
    return `<tr${d===today ? ' class="today"' : ''}>
        <td>${d}</td>
        <td${closed ? ' style="color:#c44;"' : ''}>${val}</td>
      </tr>`;
  }).join('\n      ');
}

function relatedListingsHTML(current) {
  const same = LISTINGS.filter(l => l.category === current.category && l.slug !== current.slug);
  const picks = same.sort(() => 0.5 - Math.random()).slice(0, 3);
  return picks.map(l => listingCardHTML(l, '../')).join('\n');
}

// ── Token Replacer ──────────────────────────────────────────────

function applyTokens(html, tokens) {
  return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (key in tokens) return tokens[key];
    console.warn(`  ⚠ Unknown token: {{${key}}}`);
    return '';
  });
}

function baseTokens(basePath) {
  basePath = basePath || '';
  const fullDomain = CFG.subdomain
    ? `${CFG.subdomain}.${CFG.domain}`
    : CFG.domain;
  return {
    // identity
    CONFIG_CITY:          CFG.city,
    CONFIG_CITY_TAGLINE:  CFG.cityTagline,
    CONFIG_DOMAIN:        CFG.domain,
    CONFIG_FULL_DOMAIN:   fullDomain,
    CONFIG_LANG:          CFG.lang,
    CONFIG_LOGO_ICON:     CFG.logoIcon,
    CONFIG_DEFAULT_THEME: CFG.defaultTheme,
    CONFIG_NICHE:         CFG.niche,
    CONFIG_SCHEMA_TYPE:   CFG.schemaType,
    // hero
    CONFIG_HERO_BADGE:        CFG.heroBadge,
    CONFIG_HERO_TITLE:        CFG.heroTitle,
    CONFIG_HERO_TITLE_ACCENT: CFG.heroTitleAccent,
    CONFIG_HERO_SUBTITLE:     CFG.heroSubtitle,
    CONFIG_HERO_SEARCH_PH:    CFG.heroSearchPlaceholder,
    CONFIG_HERO_SEARCH_BTN:   CFG.heroSearchBtn,
    CONFIG_HERO_PHOTO_URL:    pexelsUrl(CFG.heroPexelsId, 1920, 1080),
    // nav
    BLOCK_NAV_LINKS:   blockNavLinks(basePath),
    BLOCK_NAV_ACTIONS: blockNavActions(basePath),
    // sections
    CONFIG_SECTION_TOP_RATED_LABEL:    CFG.sections.topRatedLabel,
    CONFIG_SECTION_TOP_RATED_TITLE:    CFG.sections.topRatedTitle,
    CONFIG_SECTION_TOP_RATED_SUBTITLE: CFG.sections.topRatedSubtitle,
    CONFIG_SECTION_RECENT_LABEL:       CFG.sections.recentLabel,
    CONFIG_SECTION_RECENT_TITLE:       CFG.sections.recentTitle,
    CONFIG_SECTION_RECENT_SUBTITLE:    CFG.sections.recentSubtitle,
    CONFIG_SECTION_BLOG_LABEL:         CFG.sections.blogLabel,
    CONFIG_SECTION_BLOG_TITLE:         CFG.sections.blogTitle,
    CONFIG_SECTION_BLOG_SUBTITLE:      CFG.sections.blogSubtitle,
    CONFIG_SECTION_CATS_LABEL:         CFG.sections.categoriesLabel,
    CONFIG_SECTION_CATS_TITLE:         CFG.sections.categoriesTitle,
    CONFIG_SECTION_CATS_SUBTITLE:      CFG.sections.categoriesSubtitle,
    CONFIG_SECTION_CTA_TITLE:          CFG.sections.ctaOwnerTitle,
    CONFIG_SECTION_CTA_DESC:           CFG.sections.ctaOwnerDesc,
    CONFIG_SECTION_VIEW_ALL_TITLE:     CFG.sections.viewAllTitle,
    CONFIG_SECTION_VIEW_ALL_SUBTITLE:  CFG.sections.viewAllSubtitle,
    CONFIG_SECTION_VIEW_ALL_BTN:       CFG.sections.viewAllBtn,
    CONFIG_SECTION_LISTINGS_TITLE:     CFG.sections.listingsPageTitle,
    CONFIG_SECTION_LISTINGS_DESC:      CFG.sections.listingsPageDesc,
    // search/filter labels
    CONFIG_SORT_BY:            CFG.sections.sortByLabel,
    CONFIG_SORT_RATING:        CFG.sections.sortRating,
    CONFIG_SORT_REVIEWS:       CFG.sections.sortReviews,
    CONFIG_SORT_NAME:          CFG.sections.sortName,
    CONFIG_SEARCH_PH_LISTINGS: CFG.sections.searchPlaceholderListings,
    CONFIG_FILTER_CAT_TITLE:   CFG.sections.filterCategoryTitle,
    CONFIG_FILTER_AREA_TITLE:  CFG.sections.filterAreaTitle,
    CONFIG_FILTER_RATING_TITLE:CFG.sections.filterRatingTitle,
    CONFIG_FILTER_APPLY:       CFG.sections.filterApplyBtn,
    CONFIG_NO_RESULTS:         CFG.sections.noResultsText,
    // footer
    CONFIG_FOOTER_TAGLINE:    CFG.footer.tagline,
    CONFIG_FOOTER_POWERED_LABEL: CFG.footer.poweredBy.label,
    CONFIG_FOOTER_POWERED_URL:   CFG.footer.poweredBy.href,
    CONFIG_FOOTER_YEAR:       CFG.footer.copyrightYear,
    CONFIG_FOOTER_IG:         CFG.footer.social.instagram,
    CONFIG_FOOTER_TW:         CFG.footer.social.twitter,
    CONFIG_FOOTER_FB:         CFG.footer.social.facebook,
    // pricing
    CONFIG_PRICING_TITLE:     CFG.pricing.pageTitle,
    CONFIG_PRICING_SUBTITLE:  CFG.pricing.pageSubtitle,
    // cta links
    CONFIG_CTA_PRIMARY_LABEL:  CFG.ctaPrimary.label,
    CONFIG_CTA_PRIMARY_HREF:   basePath + CFG.ctaPrimary.href,
    CONFIG_CTA_SEC_LABEL:      CFG.ctaSecondary.label,
    CONFIG_CTA_SEC_HREF:       basePath + CFG.ctaSecondary.href,
    // blocks
    BLOCK_STATS:                blockStats(),
    BLOCK_CATEGORIES:           blockCategories(basePath),
    BLOCK_TOP_RATED:            blockTopRated(basePath),
    BLOCK_RECENTLY_ADDED:       blockRecentlyAdded(basePath),
    BLOCK_FOOTER_CAT_LINKS:     blockFooterCategoryLinks(basePath),
    BLOCK_FOOTER_AREA_LINKS:    blockFooterAreaLinks(basePath),
    BLOCK_PRICING:              blockPricingCards(),
  };
}

// Filter checkboxes for sidebar
function blockFilterCategories() {
  return CFG.categories.map(c => `
          <label>
            <input type="checkbox" data-filter-category value="${c.slug}"> ${c.label}
          </label>`).join('');
}

function blockFilterAreas() {
  const areas = [...new Set(LISTINGS.map(l => l.area))].filter(Boolean);
  return areas.map(a => `
          <label>
            <input type="checkbox" data-filter-area value="${encodeURIComponent(a)}"> ${a}
          </label>`).join('');
}

// ── CSS variables.css generator ─────────────────────────────────

function generateVariablesCss() {
  const c = CFG.colors;
  const f = CFG.fonts;
  return `/* ═══════════════════════════════════════════════════
   CSS Custom Properties — auto-generated by build.js
   Edit config.js → run node build.js to regenerate
   ═══════════════════════════════════════════════════ */

:root {
  --color-primary:        ${c.primary};
  --color-primary-hover:  ${c.primaryHover};
  --color-primary-active: ${c.primaryActive};
  --color-secondary:      ${c.secondary};
  --color-accent:         ${c.accent};
  --color-accent-hover:   ${c.accentHover};
  --color-bg:             ${c.bg};
  --color-bg-alt:         ${c.bgAlt};
  --color-text:           ${c.text};
  --color-text-muted:     ${c.textMuted};
  --color-border:         ${c.border};
  --color-card-bg:        ${c.cardBg};
  --color-header-bg:      ${c.headerBg};
  --color-footer-bg:      ${c.footerBg};
  --color-footer-text:    ${c.footerText};
  --color-btn-primary-bg:   ${c.btnPrimaryBg};
  --color-btn-primary-text: ${c.btnPrimaryText};
  --color-selection:      ${c.selection};
  --font-heading: ${f.heading};
  --font-body:    ${f.body};
  --section-py:     clamp(3rem, 6vw, 6rem);
  --container-max:  1280px;
  --container-px:   clamp(1rem, 4vw, 2rem);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 3px rgba(44, 26, 14, 0.06);
  --shadow-md: 0 4px 16px rgba(44, 26, 14, 0.08);
  --shadow-lg: 0 8px 32px rgba(44, 26, 14, 0.12);
  --ease:     cubic-bezier(0.4, 0, 0.2, 1);
  --duration: 0.2s;
}

[data-theme="dark"] {
  --color-bg:             ${c.darkBg};
  --color-bg-alt:         ${c.darkBgAlt};
  --color-text:           ${c.darkText};
  --color-text-muted:     ${c.darkTextMuted};
  --color-border:         ${c.darkBorder};
  --color-card-bg:        ${c.darkCardBg};
  --color-header-bg:      ${c.darkHeaderBg};
  --color-footer-bg:      ${c.darkFooterBg};
  --color-primary:        ${c.darkPrimary};
  --color-primary-hover:  ${c.darkPrimaryHover};
  --color-secondary:      ${c.darkSecondary};
  --color-accent:         ${c.darkAccent};
  --color-btn-primary-bg:   ${c.darkBtnPrimaryBg};
  --color-btn-primary-text: ${c.darkBtnPrimaryText};
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
}
`;
}

// ── Browser data.js generator ───────────────────────────────────

function generateDataJs() {
  // Build category map: "Specialty Coffee" → "specialty"
  const catMap = {};
  const catNames = {};
  CFG.categories.forEach(c => {
    catMap[c.schemaKey] = c.slug;
    catNames[c.slug]    = c.label;
  });

  // Enrich listings with photoUrl
  const enriched = LISTINGS.map(l => ({
    ...l,
    photoUrl: l.photoUrl || `https://images.pexels.com/photos/${l.pexelsId}/pexels-photo-${l.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`,
  }));

  return `/* Auto-generated by build.js — DO NOT EDIT DIRECTLY */
/* Edit data/listings.js and run: node build.js          */

const CAFES_DATA = ${JSON.stringify(enriched, null, 2)};

const CATEGORY_MAP = ${JSON.stringify(catMap, null, 2)};

const CATEGORY_NAMES = ${JSON.stringify(catNames, null, 2)};

const DIR_CONFIG = {
  city:        ${JSON.stringify(CFG.city)},
  cityTagline: ${JSON.stringify(CFG.cityTagline)},
  domain:      ${JSON.stringify(CFG.domain)},
  subdomain:   ${JSON.stringify(CFG.subdomain)},
  perPage:     ${CFG.perPage},
  sponsoredAt: ${CFG.sponsoredCardAt},
  defaultTheme: ${JSON.stringify(CFG.defaultTheme)},
};
`;
}

// ── Page Generators ─────────────────────────────────────────────

function generateIndex() {
  const tpl = readTemplate('index');
  const tokens = {
    ...baseTokens(''),
    PAGE_TITLE: `${CFG.city} ${CFG.cityTagline} — Best ${CFG.niche} in ${CFG.city}`,
    PAGE_DESC:  `Discover the best ${CFG.niche} in ${CFG.city}. Curated directory of specialty cafes, roasteries, and coffee experiences across the city.`,
    PAGE_OG_URL: `https://${CFG.subdomain}.${CFG.domain}/`,
    CANONICAL:  `https://${CFG.subdomain}.${CFG.domain}/`,
  };
  write('index.html', applyTokens(tpl, tokens));
}

function generateListingsPage() {
  const tpl = readTemplate('listings');
  const filterCatHTML  = blockFilterCategories();
  const filterAreaHTML = blockFilterAreas();
  const tokens = {
    ...baseTokens(''),
    PAGE_TITLE: `All ${CFG.city} ${CFG.niche} — ${CFG.city} ${CFG.cityTagline}`,
    PAGE_DESC:  `Browse all ${CFG.niche} in ${CFG.city} with filters by category, neighborhood, and rating.`,
    PAGE_OG_URL:`https://${CFG.subdomain}.${CFG.domain}/listings.html`,
    CANONICAL:  `https://${CFG.subdomain}.${CFG.domain}/listings.html`,
    BLOCK_FILTER_CATEGORIES: filterCatHTML,
    BLOCK_FILTER_AREAS:      filterAreaHTML,
    BLOCK_FILTER_CATEGORIES_OPTIONS: CFG.categories.map(c =>
      `<option value="${c.schemaKey}">${c.label}</option>`
    ).join('\n                '),
    // Pre-rendered static grid — no JS required to show initial cards
    BLOCK_LISTINGS_GRID: blockListingsGrid(),
    CONFIG_LISTINGS_TOTAL: String(LISTINGS.length),
  };
  write('listings.html', applyTokens(tpl, tokens));
}

function generateListingPages() {
  const tpl = readTemplate('listing-detail');
  LISTINGS.forEach(l => {
    const photoUrl = l.photoUrl || pexelsUrl(l.pexelsId, 1200, 600);
    const thumb    = l.photoUrl || pexelsUrl(l.pexelsId, 400, 300);
    const related  = relatedListingsHTML(l);
    const tokens = {
      ...baseTokens('../'),
      PAGE_TITLE:  `${l.name} | ${CFG.city} ${CFG.cityTagline}`,
      PAGE_DESC:   l.description.slice(0, 160),
      PAGE_OG_URL: `https://${CFG.subdomain}.${CFG.domain}/listing/${l.slug}.html`,
      PAGE_OG_IMG: thumb,
      CANONICAL:   `https://${CFG.subdomain}.${CFG.domain}/listing/${l.slug}.html`,
      LISTING_NAME:         l.name,
      LISTING_SLUG:         l.slug,
      LISTING_CATEGORY:     l.category,
      LISTING_CATEGORY_LABEL: catLabel(l.category),
      LISTING_CATEGORY_SLUG:  catSlug(l),
      LISTING_RATING:       String(l.rating),
      LISTING_REVIEWS:      reviewsLabel(l.reviews),
      LISTING_ADDRESS:      l.address,
      LISTING_PHONE:        l.phone || '',
      BLOCK_PHONE_META: l.phone ? `<div class="listing-meta-item">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>
           <a href="tel:${l.phone}">${l.phone}</a>
         </div>` : '',
      BLOCK_PHONE_ACTION: l.phone ? `<a href="https://wa.me/${l.phone.replace(/\D/g,'')}" target="_blank" rel="noopener" class="btn btn-gold btn-block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Chat on WhatsApp
          </a>` : '',
      LISTING_LAT:          String(l.lat),
      LISTING_LNG:          String(l.lng),
      LISTING_DESCRIPTION:  l.description,
      LISTING_TAGS_HTML:    l.tags.map(t => `<span class="tag">${t}</span>`).join(''),
      LISTING_HOURS_HTML:   hoursHTML(l.hours),
      LISTING_PHOTO_URL:    photoUrl,
      LISTING_STARS_HTML:   starsHTML(l.rating),
      LISTING_AREA:         l.area,
      LISTING_GMAPS_URL:    `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`,
      LISTING_WA_URL:       l.phone ? `https://wa.me/${l.phone.replace(/\D/g,'')}` : '#',
      LISTING_SCHEMA_TYPE:  CFG.schemaType,
      BLOCK_RELATED:        related,
    };
    write(`listing/${l.slug}.html`, applyTokens(tpl, tokens));
  });
}

function generateCategoryPages() {
  const tpl = readTemplate('category');
  CFG.categories.forEach(cat => {
    const listings = LISTINGS.filter(l => l.category === cat.schemaKey)
      .sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);
    const count = listings.length;
    const cardsHTML = listings.map(l => listingCardHTML(l, '../')).join('\n');
    const tokens = {
      ...baseTokens('../'),
      PAGE_TITLE:  `${cat.label} in ${CFG.city} — ${CFG.city} ${CFG.cityTagline}`,
      PAGE_DESC:   `Browse all ${cat.label.toLowerCase()} in ${CFG.city}. ${count} listings with ratings, reviews, and maps.`,
      PAGE_OG_URL: `https://${CFG.subdomain}.${CFG.domain}/category/${cat.slug}.html`,
      CANONICAL:   `https://${CFG.subdomain}.${CFG.domain}/category/${cat.slug}.html`,
      CATEGORY_SLUG:  cat.slug,
      CATEGORY_LABEL: cat.label,
      CATEGORY_ICON:  cat.icon,
      CATEGORY_COUNT: String(count),
      BLOCK_CATEGORY_LISTINGS: cardsHTML,
    };
    write(`category/${cat.slug}.html`, applyTokens(tpl, tokens));
  });
}

function generateContactPage() {
  const tpl = readTemplate('contact');
  const tokens = {
    ...baseTokens(''),
    PAGE_TITLE: `Add Your Business — ${CFG.city} ${CFG.cityTagline}`,
    PAGE_DESC:  `Add your ${CFG.niche.replace(/s$/,'')} to the ${CFG.city} ${CFG.cityTagline}. Premium listing options available.`,
    PAGE_OG_URL:`https://${CFG.subdomain}.${CFG.domain}/contact.html`,
    CANONICAL:  `https://${CFG.subdomain}.${CFG.domain}/contact.html`,
  };
  write('contact.html', applyTokens(tpl, tokens));
}

function generateGetSitePage() {
  const tpl = readTemplate('get-site');
  const tokens = {
    ...baseTokens(''),
    PAGE_TITLE: `Get Your Website — ${CFG.city} ${CFG.cityTagline}`,
    PAGE_DESC:  `Launch your professional website in 48 hours. Three plans from ${CFG.pricing.currencySymbol}${CFG.pricing.plans[0].setup} setup + ${CFG.pricing.currencySymbol}${CFG.pricing.plans[0].monthly}/mo.`,
    PAGE_OG_URL:`https://${CFG.subdomain}.${CFG.domain}/get-site.html`,
    CANONICAL:  `https://${CFG.subdomain}.${CFG.domain}/get-site.html`,
  };
  write('get-site.html', applyTokens(tpl, tokens));
}

function generatePremiumListing() {
  const tpl = readTemplate('premium-listing');
  // Use first featured listing as example
  const l = LISTINGS.find(x => x.featured) || LISTINGS[0];
  const photoUrl = l.photoUrl || pexelsUrl(l.pexelsId, 1200, 500);
  const tokens = {
    ...baseTokens(''),
    PAGE_TITLE: `Premium Listing — ${CFG.city} ${CFG.cityTagline}`,
    PAGE_DESC:  `Premium listing example. Get your business featured prominently in the ${CFG.city} ${CFG.cityTagline}.`,
    PAGE_OG_URL:`https://${CFG.subdomain}.${CFG.domain}/premium-listing.html`,
    CANONICAL:  `https://${CFG.subdomain}.${CFG.domain}/premium-listing.html`,
    LISTING_NAME:      l.name,
    LISTING_PHOTO_URL: photoUrl,
    LISTING_RATING:    String(l.rating),
    LISTING_REVIEWS:   reviewsLabel(l.reviews),
    LISTING_STARS_HTML:starsHTML(l.rating),
    LISTING_ADDRESS:   l.address,
    LISTING_PHONE:     l.phone || '',
    LISTING_GMAPS_URL: `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`,
    BLOCK_PRICING:     blockPricingCards(),
  };
  write('premium-listing.html', applyTokens(tpl, tokens));
}

// ── Static Assets Copy ──────────────────────────────────────────

function copyStaticAssets() {
  // Copy style.css
  const styleSrc  = path.join(__dirname, 'assets/css/style.css');
  const styleDir  = path.join(DIST, 'assets/css');
  mkdirp(styleDir);
  fs.copyFileSync(styleSrc, path.join(styleDir, 'style.css'));
  console.log('  ✓ assets/css/style.css');

  // Write generated variables.css
  fs.writeFileSync(path.join(styleDir, 'variables.css'), generateVariablesCss(), 'utf8');
  console.log('  ✓ assets/css/variables.css (generated from config.js)');

  // Copy app.js
  const jsSrc = path.join(__dirname, 'assets/js/app.js');
  const jsDir = path.join(DIST, 'assets/js');
  mkdirp(jsDir);
  fs.copyFileSync(jsSrc, path.join(jsDir, 'app.js'));
  console.log('  ✓ assets/js/app.js');

  // Write generated data.js
  fs.writeFileSync(path.join(jsDir, 'data.js'), generateDataJs(), 'utf8');
  console.log('  ✓ assets/js/data.js (generated from data/listings.js + config.js)');
}

// ── Main ────────────────────────────────────────────────────────

function build() {
  console.log('\n🔨 Building Directory V1...\n');
  const start = Date.now();

  mkdirp(DIST);

  console.log('📄 HTML Pages:');
  generateIndex();
  generateListingsPage();
  generateListingPages();
  generateCategoryPages();
  generateContactPage();
  generateGetSitePage();
  generatePremiumListing();

  console.log('\n🎨 Static Assets:');
  copyStaticAssets();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  const count   = fs.readdirSync(DIST).length;
  console.log(`\n✅ Build complete in ${elapsed}s`);
  console.log(`📁 Output: dist/ (${LISTINGS.length} listings, ${CFG.categories.length} categories)`);
  console.log(`🌐 Ready for: https://${CFG.subdomain}.${CFG.domain}/\n`);
}

build();
