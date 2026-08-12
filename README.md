# Template Directory V1

> **Config-driven city directory** — change one file, regenerate, deploy.  
> Inspired by the Dubai Coffee Guide quality standard. Built for the [TechSites.ai](https://techsites.ai) Directory Network.

---

## What this is

A complete, production-ready static directory template for any city + niche combination (coffee shops, restaurants, gyms, lawyers, hotels, etc.). The entire site is regenerated from two source-of-truth files:

| File | What you edit |
|------|---------------|
| `config.js` | City, colors, fonts, nav, hero text, stats, pricing, footer |
| `data/listings.js` | All business listings (name, address, coords, photos, hours) |

**Never edit HTML templates or `dist/` files directly.** Run `node build.js` after every change.

---

## Generated pages

| Page | Path |
|------|------|
| Homepage | `dist/index.html` |
| All listings (JS-filtered) | `dist/listings.html` |
| Individual listing | `dist/listing/{slug}.html` |
| Category | `dist/category/{slug}.html` |
| Contact / Add Business | `dist/contact.html` |
| Get a Site (pricing) | `dist/get-site.html` |
| Premium Listing (upsell) | `dist/premium-listing.html` |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/reynaldodallin/template-directory-v1.git my-city-guide
cd my-city-guide

# 2. Edit your city & brand
nano config.js

# 3. Add your listings
nano data/listings.js

# 4. Build
node build.js

# 5. Preview locally
npx serve dist
```

---

## Project structure

```
template-directory-v1/
├── config.js                  # ← EDIT THIS: all configurable values
├── data/
│   └── listings.js            # ← EDIT THIS: all business listings
├── build.js                   # Build script (never edit HTML manually)
├── templates/
│   ├── index.html             # Homepage template ({{TOKEN}} placeholders)
│   ├── listings.html          # All listings page
│   ├── listing-detail.html    # Individual listing page
│   ├── category.html          # Category page
│   ├── contact.html           # Contact / add business form
│   ├── get-site.html          # Pricing / conversion page
│   └── premium-listing.html   # Premium listing upsell page
├── assets/
│   ├── css/
│   │   └── style.css          # All styles — colors via CSS custom properties only
│   └── js/
│       └── app.js             # Interactive JS — theme, search, filters, map
├── dist/                      # ← Generated output (never commit this, gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions → Cloudflare Pages CI/CD
├── COMO-CUSTOMIZAR.md         # PT-BR customization guide
└── README.md                  # This file
```

---

## Features

- ✅ **Config-driven** — change city/colors/pricing in 1 file, rebuild
- ✅ **Dark/light mode** — cookie-based persistence, no localStorage
- ✅ **Client-side search & filters** — by category, neighborhood, rating; URL-hash state
- ✅ **Pagination** — configurable `perPage` in config.js
- ✅ **Leaflet maps** — pin on every listing detail page, OpenStreetMap tiles
- ✅ **Schema.org JSON-LD** — `CafeOrCoffeeShop`, `WebSite`, `CollectionPage` for SEO
- ✅ **Pexels photos** — hotlink-free, no API key needed for display
- ✅ **Fade-in animations** — IntersectionObserver, no layout shift
- ✅ **Mobile-first responsive** — hamburger nav, filter sidebar drawer
- ✅ **Ad slots** — pre-placed `div.ad-slot` elements for monetization
- ✅ **Lucide icons** — loaded via CDN, no build step needed
- ✅ **Accessibility** — ARIA labels, landmark roles, `sr-only`, keyboard nav
- ✅ **Zero dependencies** — pure Node.js build, no npm install required
- ✅ **Cloudflare Pages CI/CD** — auto-deploy on push to `main`

---

## Deployment (Cloudflare Pages)

### 1. Create CF Pages project

```bash
npx wrangler pages project create my-city-guide
```

### 2. Add GitHub Secrets

In your repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Your CF API token (Pages:Edit permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Your CF Account ID |
| `CF_PAGES_PROJECT_NAME` | Project name created above |

### 3. Push to main

Every push to `main` triggers the workflow → `node build.js` → deploys `dist/` to CF Pages.

---

## Launching a new city

1. Fork or clone this repo
2. Edit `config.js` (city, colors, domain, pricing)
3. Edit `data/listings.js` (replace demo listings with real BrightData data)
4. `node build.js` → verify `dist/`
5. Create CF Pages project → push → live in ~2 min

**Target portfolio:** `cwb.ama.cafe` (Curitiba), `sp.ama.cafe` (São Paulo), `rio.ama.cafe` (Rio), etc.

---

## Adding a new city from BrightData

The `data/listings.js` format matches the BrightData Google Maps scraper output (22-column CSV).  
See `directory-factory` repo for the N8N workflow that transforms raw CSV → `listings.js`.

Required fields per listing: `slug`, `name`, `category`, `rating`, `reviews`, `address`, `lat`, `lng`, `tags`, `area`, `hours`, `description`, `pexelsId` (or `photoUrl`)

---

## License

MIT — free to use for any directory site in the TechSites.ai network.

---

*Template Directory V1 · Built by [TechSites.ai](https://techsites.ai) · August 2026*
