// ═══════════════════════════════════════════════════════════════
// ADV PRODUCTS — Cards de afiliados (Modo Direto).
// Cada item: id, name, price, currency, url (link de afiliado),
// pexelsId ou imageUrl, badge (opcional), blurb.
// Estrutura pronta para futura substituição por feed RSS.
// ═══════════════════════════════════════════════════════════════

const ADV_PRODUCTS = [
  {
    id: 'breville-barista-express',
    name: 'Breville Barista Express',
    price: 699, currency: 'USD',
    url: 'https://www.amazon.com/dp/B00CH9QWOU?tag=AFFILIATE_TAG',
    pexelsId: '4349734',
    badge: 'Editor\'s Choice',
    blurb: 'Semi-automatic espresso machine with built-in grinder — café quality at home.',
  },
  {
    id: 'hario-v60-kit',
    name: 'Hario V60 Pour-Over Kit',
    price: 42, currency: 'USD',
    url: 'https://www.amazon.com/dp/B000P4D5HG?tag=AFFILIATE_TAG',
    pexelsId: '4790061',
    badge: 'Best Value',
    blurb: 'The classic pour-over setup used by specialty baristas worldwide.',
  },
  {
    id: 'fellow-stagg-ekg',
    name: 'Fellow Stagg EKG Kettle',
    price: 165, currency: 'USD',
    url: 'https://www.amazon.com/dp/B077JBQZPX?tag=AFFILIATE_TAG',
    pexelsId: '6802983',
    blurb: 'Precision gooseneck kettle with variable temperature control.',
  },
  {
    id: 'comandante-c40',
    name: 'Comandante C40 Grinder',
    price: 299, currency: 'USD',
    url: 'https://www.amazon.com/dp/B07VD3ZVSG?tag=AFFILIATE_TAG',
    pexelsId: '7125434',
    badge: 'Pro Pick',
    blurb: 'Hand grinder with legendary consistency — the specialty standard.',
  },
  {
    id: 'aeropress-original',
    name: 'AeroPress Original',
    price: 39, currency: 'USD',
    url: 'https://www.amazon.com/dp/B0047BIWSK?tag=AFFILIATE_TAG',
    pexelsId: '6802987',
    blurb: 'Travel-friendly brewer loved for its clean, rich cup.',
  },
];

module.exports = ADV_PRODUCTS;
