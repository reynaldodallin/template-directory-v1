# Como Customizar Este Template

> **Regra de ouro:** Nunca edite arquivos dentro de `dist/` nem os templates HTML diretamente para mudar cor, texto ou dados.  
> Edite apenas `config.js` e `data/listings.js`, depois rode `node build.js`.

---

## 1. Mudar cidade / nicho

Abra `config.js` e edite as primeiras linhas:

```js
city:        'Curitiba',       // Nome da cidade
cityTagline: 'Guia de Cafés', // Tagline
domain:      'ama.cafe',       // Domínio
subdomain:   'cwb',            // cwb.ama.cafe
niche:       'cafeterias',
```

---

## 2. Mudar paleta de cores

Em `config.js`, seção `colors:`, altere os valores HEX:

```js
colors: {
  primary:      '#6F4E37',  // Cor principal (botões, links, destaques)
  accent:       '#C8860A',  // Cor de acento (estrelas, badges dourados)
  bg:           '#FDFAF6',  // Fundo light mode
  // ... etc
}
```

Após alterar, rode:
```bash
node build.js
```

O arquivo `dist/assets/css/variables.css` é **gerado automaticamente** — nunca o edite à mão.

---

## 3. Mudar o logo / ícone

```js
logoIcon: '☕',  // Qualquer emoji ou entidade HTML
```

Para um logo SVG completo, coloque o arquivo em `assets/img/logo.svg` e edite o template `templates/index.html` na seção `<nav__logo>`.

---

## 4. Adicionar / editar estabelecimentos

Abra `data/listings.js` e adicione ou edite objetos no array:

```js
{
  slug: 'nome-do-cafe',           // URL: listing/nome-do-cafe.html — sem espaços/acentos
  name: 'Nome do Café',           // Nome exibido
  category: 'Specialty Coffee',   // Deve ser um schemaKey de config.js > categories
  rating: 4.8,                    // 0.0 a 5.0
  reviews: 1234,                  // Número de avaliações
  address: 'Rua X, 123 — Bairro', // Endereço completo
  phone: '554199998888',          // Sem + ou espaços (para WhatsApp)
  lat: -25.4290,                  // Latitude (Google Maps → botão direito → copia coords)
  lng: -49.2671,                  // Longitude
  tags: ['Specialty', 'Wifi'],    // Tags livres, até ~5
  area: 'Batel',                  // Bairro/área (aparece no filtro)
  hours: {
    Mon: '8:00 – 18:00',
    Tue: '8:00 – 18:00',
    // ...
    Sun: '—',                     // '—' = fechado
  },
  description: 'Texto descritivo do estabelecimento...',
  pexelsId: '302899',             // ID da foto no Pexels (pegar da URL: pexels.com/photo/302899)
  // OU
  // photoUrl: 'https://sua-url-de-foto.com/foto.jpg',  // Para foto própria
  featured: true,                 // Opcional: aparece em destaque na home
},
```

---

## 5. Adicionar / mudar categorias

Em `config.js`, seção `categories:`:

```js
categories: [
  { slug: 'specialty',  label: 'Specialty Coffee', icon: 'coffee',   schemaKey: 'Specialty Coffee' },
  { slug: 'padaria',    label: 'Padaria',           icon: 'wheat',    schemaKey: 'Padaria'          },
  // ...
]
```

- `slug` → URL da categoria: `category/specialty.html`
- `schemaKey` → deve bater exatamente com o campo `category` dos listings
- `icon` → qualquer nome de ícone do [Lucide Icons](https://lucide.dev/icons/)

---

## 6. Editar textos, hero, footer

Tudo em `config.js`:

```js
heroBadge:    '★ Melhor Guia de Café de Curitiba',
heroTitle:    'Descubra os Melhores',
heroTitleAccent: 'Cafés de Curitiba',
heroSubtitle: 'De torrefadoras artesanais a cafeterias especiais...',

footer: {
  tagline:   'Seu guia definitivo do café local.',
  // ...
},
```

---

## 7. Mudar preços

```js
pricing: {
  currency: 'BRL',
  currencySymbol: 'R$',
  plans: [
    { name: 'Básico', setup: 199, monthly: 49, features: [...] },
    // ...
  ],
},
```

---

## 8. Regenerar o site

Sempre que alterar `config.js` ou `data/listings.js`:

```bash
node build.js
```

O comando gera (ou atualiza) toda a pasta `dist/` com:
- `index.html` — homepage
- `listings.html` — todos os estabelecimentos
- `listing/{slug}.html` — página individual de cada estabelecimento
- `category/{slug}.html` — página de cada categoria
- `contact.html` — formulário de contato
- `get-site.html` — pricing / conversão
- `premium-listing.html` — exemplo de listing premium
- `assets/css/variables.css` — cores geradas do config
- `assets/js/data.js` — dados gerados para o browser

---

## 9. Deploy

### Via GitHub Actions (recomendado)

1. Faça push do repo para GitHub
2. Configure os Secrets do repositório:
   - `CLOUDFLARE_API_TOKEN` → token da API do Cloudflare
   - `CLOUDFLARE_ACCOUNT_ID` → Account ID do Cloudflare
   - `CF_PAGES_PROJECT_NAME` → nome do projeto no CF Pages (ex: `cwb-ama-cafe`)
3. A cada push para `main`, o build roda automaticamente e o site é publicado

### Manual

```bash
node build.js
npx wrangler pages deploy dist --project-name=cwb-ama-cafe
```

---

## 10. Usar fotos próprias

Opção A — Pexels (gratuito, sem API):
```js
pexelsId: '302899'  // Pegar o número da URL: pexels.com/photo/302899
```

Opção B — URL própria:
```js
photoUrl: 'https://meu-cdn.com/foto-do-cafe.jpg'
```

Opção C — Pexels com API (qualidade garantida):
```bash
PEXELS_API_KEY=xxx node scripts/fetch-photos.js
```
*(script a criar quando a chave Pexels estiver disponível)*

---

## 11. Trocar fonte

Em `config.js`:
```js
fonts: {
  heading: "'Cormorant Garamond', Georgia, serif",
  body:    "'Lato', sans-serif",
  googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700&display=swap',
},
```

As fontes são carregadas automaticamente nos templates. O Google Fonts URL é injetado no `<head>` de cada página.

---

## Checklist para lançar uma nova cidade

- [ ] Duplicar o repo (ou fazer fork/clone)
- [ ] Editar `config.js`: `city`, `cityTagline`, `domain`, `subdomain`, `lang`, `colors`, `stats`, `pricing`
- [ ] Editar `data/listings.js`: substituir os 25 demos por dados reais da cidade
- [ ] Rodar `node build.js` e verificar `dist/`
- [ ] Criar projeto no Cloudflare Pages apontando para o repo
- [ ] Adicionar os 3 Secrets no GitHub (CF_API_TOKEN, CF_ACCOUNT_ID, CF_PAGES_PROJECT_NAME)
- [ ] Fazer push → site no ar em ~2 min

---

*Template Directory V1 — powered by [TechSites.ai](https://techsites.ai)*
