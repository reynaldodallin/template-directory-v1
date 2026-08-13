// ═══════════════════════════════════════════════════════════════
// BLOG POSTS — Artigos em Markdown, renderizados no build.
// Cada post: slug, title, category, excerpt, author, date (ISO),
// pexelsId, markdown, relatedListings (slugs), products (opcional
// — quando presente, gera tabela comparativa + JSON-LD ItemList).
// ═══════════════════════════════════════════════════════════════

const BLOG_POSTS = [
  {
    slug: 'why-dubai-is-the-coffee-capital',
    title: 'Culture: Why Dubai Became the Coffee Capital of the Middle East',
    category: 'Culture',
    excerpt: 'From Bedouin gahwa rituals to record-breaking specialty scenes — how Dubai turned coffee into a cultural movement.',
    author: 'Editorial Team',
    date: '2026-08-01',
    pexelsId: '1305063',
    relatedListings: ['aro-coffee', 'black-goat-coffee'],
    markdown: `Dubai's coffee story starts long before the first flat white was poured in DIFC. **Gahwa** — cardamom-spiced Arabic coffee — has been the centerpiece of Emirati hospitality for centuries, served in small handleless cups as a sign of welcome and respect.

## From Tradition to Third Wave

The city's modern coffee boom took off in the mid-2010s, when a generation of Emirati and expat entrepreneurs returned from Melbourne, London and Seattle with a new obsession: single-origin beans, precise extraction, and latte art worthy of a gallery.

Today the city hosts:

- More than **400 specialty coffee shops**, from Al Quoz warehouses to Palm Jumeirah beachfronts
- The **World of Coffee Dubai** expo, the region's largest industry event
- Home-grown roasteries exporting beans across the GCC

## Where to Start

If you're new to the scene, begin in **Business Bay** — the density of quality cafes there is unmatched. [ARO Coffee](../listing/aro-coffee.html) is the reigning community favorite, while [Black Goat Coffee](../listing/black-goat-coffee.html) in Dubai Mall pours some of the most precise espresso in the city.

> "Dubai doesn't follow coffee trends anymore. It sets them." — regional Q Grader panel, 2025

## The Numbers Behind the Craze

Coffee consumption in the UAE grows roughly **7% per year**, one of the fastest rates in the world. Specialty shops now account for nearly a third of all cafe revenue in Dubai — a share that keeps climbing as consumers trade volume for quality.

The best way to experience it? Grab our [full directory of coffee shops](../listings.html) and start exploring, one cup at a time.`,
  },
  {
    slug: 'top-5-espresso-machines-2026',
    title: 'Top 5 Home Espresso Machines of 2026 — Tested & Compared',
    category: 'Buying Guide',
    excerpt: 'We compared the five best espresso machines for home baristas — grinders, pressure, workflow and value, side by side.',
    author: 'Gear Lab',
    date: '2026-07-22',
    pexelsId: '4349734',
    relatedListings: ['aro-coffee'],
    products: [
      { advId: 'breville-barista-express', score: 9.4, highlight: 'Best all-in-one', pros: 'Built-in grinder, forgiving workflow', cons: 'Bulky footprint' },
      { advId: 'comandante-c40',           score: 9.1, highlight: 'Best grinder pairing', pros: 'Unmatched grind consistency', cons: 'Manual effort' },
      { advId: 'fellow-stagg-ekg',         score: 8.8, highlight: 'Best pour-over upgrade', pros: 'Precise temperature, beautiful design', cons: 'Kettle only' },
      { advId: 'hario-v60-kit',            score: 8.6, highlight: 'Best budget setup', pros: 'Cheap, iconic, repeatable', cons: 'Technique-sensitive' },
      { advId: 'aeropress-original',       score: 8.5, highlight: 'Best for travel', pros: 'Indestructible, fast cleanup', cons: 'Single cup at a time' },
    ],
    markdown: `Every barista at every cafe in this directory started somewhere — usually at home, with a machine that either sparked the obsession or killed it. We spent six weeks testing the five most recommended setups of 2026 so you don't waste money finding out.

## How We Tested

Each machine brewed **20 shots or cups** across three bean profiles (light Ethiopian, medium Colombian, dark blend). We scored extraction consistency, workflow, build quality and value.

## The Verdict

The comparison table below summarizes our scores. The **Breville Barista Express** remains the smartest single purchase for anyone starting espresso at home — nothing else matches its grinder-to-cup convenience at the price.

For pour-over lovers, the **Hario V60 + Fellow Stagg EKG** combo delivers cafe-level clarity for under $210 total.

## Ask the Pros

Not sure which style suits you? The baristas at [ARO Coffee](../listing/aro-coffee.html) run monthly home-brewing workshops — bring your questions (and your own beans).`,
  },
  {
    slug: 'business-bay-coffee-guide',
    title: 'The Complete Business Bay Coffee Guide (2026 Edition)',
    category: 'Local Guide',
    excerpt: 'Nine cafes, one neighborhood: the definitive walking guide to Business Bay\'s caffeine corridor.',
    author: 'Editorial Team',
    date: '2026-07-10',
    pexelsId: '1002740',
    relatedListings: ['aro-coffee'],
    markdown: `Business Bay packs more specialty coffee per square kilometer than anywhere else in the Gulf. This guide takes you through the neighborhood's essential stops, in walking order from the Bay Avenue mall.

## Morning: The Canal Loop

Start at [ARO Coffee](../listing/aro-coffee.html) when doors open at 9 AM — the morning light through their Tower A windows is worth the trip alone. Order the **Ethiopian pour-over** and grab a canal-side seat.

## Midday: Tower District

The office towers hide some of the area's best espresso bars. Look for:

1. Basement-level roasters with lunchtime queues (always a good sign)
2. Cafes offering **filter flights** — three single origins, one tray
3. Anywhere with a Comandante grinder on the counter

## Golden Hour

End at a rooftop terrace. Most Business Bay cafes stay open past midnight — coffee culture here runs on Dubai time.

## Plan Your Route

Filter our [listings by Business Bay](../listings.html) to see every cafe in the neighborhood with ratings, hours and directions.`,
  },
  {
    slug: 'review-aro-coffee-business-bay',
    title: 'Review: ARO Coffee — Is Business Bay\'s Favorite Cafe Worth the Hype?',
    category: 'Review',
    excerpt: 'Nearly 4,000 five-star reviews. We spent a week at ARO Coffee to find out if the city\'s highest-rated cafe lives up to it.',
    author: 'Editorial Team',
    date: '2026-06-28',
    pexelsId: '302899',
    relatedListings: ['aro-coffee', 'black-goat-coffee'],
    markdown: `**Rating: 4.9/5** — reviewed over five visits, June 2026.

Few cafes carry the weight of expectation that [ARO Coffee](../listing/aro-coffee.html) does. With a 4.9 average across almost 4,000 reviews, it is statistically the best-loved coffee shop in this directory. We went five times in one week — different hours, different orders — to see if the numbers hold up.

## The Coffee

**They do.** The espresso program runs on a rotating single-origin selection, dialed in obsessively. Our flat whites were consistent to the gram across all five visits — something even award-winning cafes struggle with.

- **Espresso:** 9.5/10 — balanced, never bitter
- **Filter:** 9/10 — the Ethiopian was a standout
- **Milk drinks:** 9.5/10 — textbook microfoam

## The Space

Floor-to-ceiling windows, generous seating, reliable Wi-Fi. It fills up fast after 10 AM — arrive early or aim for late evening (they pour until 3 AM).

## The Verdict

The hype is earned. If you visit one cafe from this directory, make it this one. And if you prefer a mall setting, [Black Goat Coffee](../listing/black-goat-coffee.html) is the strongest alternative.`,
  },
];

module.exports = BLOG_POSTS;
