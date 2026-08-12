// ═══════════════════════════════════════════════════════════════
// DIRECTORY CONFIG — Edite SOMENTE este arquivo para customizar
// para qualquer cidade ou nicho. NÃO edite os templates HTML.
// ═══════════════════════════════════════════════════════════════

const DIRECTORY_CONFIG = {

  // ── Identidade ──────────────────────────────────────────────
  city:        'Dubai',           // Nome da cidade/local
  cityTagline: 'Coffee Guide',    // Tagline após o nome da cidade
  domain:      'fond.coffee',     // Domínio raiz
  subdomain:   'dubai',           // Subdomínio → dubai.fond.coffee
  lang:        'en',              // 'en' | 'pt-BR' | 'es'
  logoIcon:    '☕',              // Emoji ou entidade HTML
  defaultTheme: 'dark',           // 'dark' | 'light'

  // ── Nicho e Schema ──────────────────────────────────────────
  niche:      'coffee shops',
  schemaType: 'CafeOrCoffeeShop',  // Schema.org type

  // ── Paleta de Cores ─────────────────────────────────────────
  // Mude aqui para recolorir TODO o site. Build.js regenera variables.css.
  colors: {
    // Light mode
    primary:       '#6F4E37',
    primaryHover:  '#5C3F2D',
    primaryActive: '#4A3224',
    secondary:     '#D4A574',
    accent:        '#C8860A',
    accentHover:   '#A87008',
    bg:            '#FDFAF6',
    bgAlt:         '#F5EDE0',
    text:          '#2C1A0E',
    textMuted:     '#7A6552',
    border:        '#E8D5BE',
    cardBg:        '#FFFFFF',
    headerBg:      '#3B2314',
    footerBg:      '#2C1A0E',
    footerText:    '#D4A574',
    btnPrimaryBg:  '#6F4E37',
    btnPrimaryText:'#FFFFFF',
    selection:     'rgba(111, 78, 55, 0.2)',
    // Dark mode overrides
    darkBg:        '#1A0F08',
    darkBgAlt:     '#2C1A0E',
    darkText:      '#F5EDE0',
    darkTextMuted: '#B8A08A',
    darkBorder:    '#4A3224',
    darkCardBg:    '#261508',
    darkHeaderBg:  '#0F0904',
    darkFooterBg:  '#0F0904',
    darkPrimary:   '#D4A574',
    darkPrimaryHover: '#E0BA8E',
    darkSecondary: '#6F4E37',
    darkAccent:    '#E0BA8E',
    darkBtnPrimaryBg:   '#D4A574',
    darkBtnPrimaryText: '#1A0F08',
  },

  // ── Tipografia ──────────────────────────────────────────────
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
  },

  // ── Navegação ───────────────────────────────────────────────
  navLinks: [
    { label: 'Home',         href: 'index.html' },
    { label: 'Coffee Shops', href: 'listings.html' },
    { label: 'Specialty',    href: 'category/specialty.html' },
    { label: 'Roasteries',   href: 'category/roastery.html' },
    { label: 'Blog',         href: 'blog.html' },
    { label: 'Contact',      href: 'contact.html' },
  ],
  ctaPrimary:     { label: 'Get a Site',        href: 'get-site.html' },
  ctaSecondary:   { label: 'Premium Listing',   href: 'premium-listing.html' },
  mobileCtaLabel: 'Add Your Cafe',
  mobileCtaHref:  'contact.html',

  // ── Hero ────────────────────────────────────────────────────
  heroBadge:             "★ Dubai's Premier Coffee Directory",
  heroTitle:             "Discover Dubai's Finest",
  heroTitleAccent:       'Coffee Shops',
  heroSubtitle:          'From artisan roasteries to hidden specialty gems — find your perfect cup in the city of gold.',
  heroSearchPlaceholder: 'Search cafes, areas, or tags...',
  heroSearchBtn:         'Search',
  heroPexelsId:          '2074130',  // Pexels photo ID para background do hero

  // ── Stats Bar ───────────────────────────────────────────────
  stats: [
    { number: '25+',  label: 'Coffee Shops'  },
    { number: '8',    label: 'Neighborhoods' },
    { number: '4.8',  label: 'Avg Rating'    },
    { number: '60K+', label: 'Reviews'       },
  ],

  // ── Categorias ──────────────────────────────────────────────
  // slug: usado em URLs e filtros
  // schemaKey: valor em listings.category para mapear esta categoria
  categories: [
    { slug: 'specialty',       label: 'Specialty Coffee',  icon: 'coffee',     schemaKey: 'Specialty Coffee'  },
    { slug: 'roastery',        label: 'Roastery',          icon: 'flame',      schemaKey: 'Roastery'          },
    { slug: 'cafe-restaurant', label: 'Cafe & Restaurant', icon: 'utensils',   schemaKey: 'Cafe & Restaurant' },
    { slug: 'chain',           label: 'Chain Cafe',        icon: 'building-2', schemaKey: 'Chain Cafe'        },
  ],

  // ── Textos das Seções ────────────────────────────────────────
  sections: {
    topRatedLabel:       'Curated Selection',
    topRatedTitle:       'Top Rated Coffee Shops',
    topRatedSubtitle:    'The highest-rated cafes in the city, chosen by thousands of coffee lovers.',
    recentLabel:         'New Arrivals',
    recentTitle:         'Recently Added',
    recentSubtitle:      'The latest additions to our growing directory.',
    blogLabel:           'From the Blog',
    blogTitle:           'Coffee Stories',
    blogSubtitle:        "Insights, guides, and stories from the local coffee scene.",
    categoriesLabel:     'Browse by Type',
    categoriesTitle:     'Categories',
    categoriesSubtitle:  "Explore the coffee scene by category.",
    ctaOwnerTitle:       'Own a Coffee Shop?',
    ctaOwnerDesc:        'Get your cafe listed and reach thousands of coffee lovers. Boost your visibility with premium placement, reviews, and analytics.',
    viewAllTitle:        'Ready to Explore?',
    viewAllSubtitle:     'Browse all coffee shops with filters, ratings, and reviews.',
    viewAllBtn:          'View All Coffee Shops',
    listingsPageTitle:   'All Coffee Shops',
    listingsPageDesc:    'Browse our complete directory of curated coffee shops.',
    sortByLabel:         'Sort by:',
    sortRating:          'Best Rated',
    sortReviews:         'Most Reviews',
    sortName:            'A – Z',
    noResultsText:       'No coffee shops found matching your filters.',
    searchPlaceholderListings: 'Search coffee shops...',
    filterCategoryTitle: 'Category',
    filterAreaTitle:     'Neighborhood',
    filterRatingTitle:   'Min. Rating',
    filterApplyBtn:      'Apply Filters',
  },

  // ── Preços (página get-site) ─────────────────────────────────
  pricing: {
    currency: 'USD',
    currencySymbol: '$',
    pageTitle: 'Get Your Business Website',
    pageSubtitle: 'Launch your professional website in 48 hours.',
    plans: [
      {
        name: 'Starter', setup: 99, monthly: 19,
        features: ['Listed directory page', 'Google Maps embed', 'Basic SEO', 'Mobile responsive', '3 months included'],
      },
      {
        name: 'Pro', setup: 249, monthly: 39, popular: true,
        features: ['Everything in Starter', 'WYSIWYG editor', 'Priority listing', 'Analytics dashboard', 'Custom photo gallery'],
      },
      {
        name: 'Growth', setup: 499, monthly: 79,
        features: ['Everything in Pro', 'Custom domain', 'Priority support', 'Monthly SEO report', 'WhatsApp booking widget'],
      },
    ],
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    tagline:     "Your ultimate guide to the local coffee scene. Discover specialty cafes, roasteries, and hidden gems.",
    poweredBy:   { label: 'Powered by TechSites.ai', href: 'https://techsites.ai' },
    social:      { instagram: '#', twitter: '#', facebook: '#' },
    copyrightYear: '2026',
  },

  // ── Configurações de listagem ────────────────────────────────
  perPage:              12,
  sponsoredCardAt:      3,   // Inserir card patrocinado nesta posição
  topRatedCount:        6,   // Qtd de cafés no bloco "Top Rated"
  recentlyAddedCount:   4,   // Qtd de cafés no bloco "Recently Added"

};

module.exports = DIRECTORY_CONFIG;
