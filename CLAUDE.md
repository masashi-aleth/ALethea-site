# ALethea — project guide for Claude

Static site hosted on GitHub Pages. **No build step, no framework, no npm.** Files are served as-is.

## Files
| File | Role |
|---|---|
| `index.html` | All views (`<section class="view" id="...">`) and script tags. Hash router: `#/home`, `#/store`, `#/product/ID`, `#/dashboard`... |
| `style.css` | ORIGINAL base styles (kept). Do not delete; `aurora.css` overrides/extends it. |
| `aurora.css` | New design system: tokens, aurora/grid background, glass, 3D hero, store, dashboard, mobile dock. |
| `config.js` | Public config (Supabase URL + publishable key, Discord invite). **Never put secrets here.** |
| `app.js` | ORIGINAL logic (kept): Supabase email/Discord login, `#/admin` members panel, router. Only minimally extended (dynamic route list + `alethea:route` event). |
| `data.js` | Demo seed data (`window.ALETHEA_SEED`). Fictional content only. |
| `alethea.js` | Public site: i18n (ar/en, RTL/LTR), theme engine, store, cart, simulated checkout, 3D/particles/reveal. |
| `dashboard.js` | Demo dashboard (`#/dashboard`): CRUD for products/categories/projects/news, sections, socials, theme, setup, activity, backup/reset. |
| `schema.sql` | Supabase schema (profiles/site_settings). Run manually in Supabase SQL Editor. **Never auto-run, never destructive.** |

## Two separate admin concepts (do not mix up)
1. `#/admin` — REAL, Supabase-backed, protected by RLS (`profiles.role = 'admin'`). Existing; keep working.
2. `#/dashboard` — DEMO dashboard. No login. Data lives in the visitor's own `localStorage`; nothing is shared across visitors/devices. Always show the demo banner. It must never claim to be secure or persistent across devices.

## Demo-mode rules
- No real payments, ever, in this version. Checkout is a labelled simulation; collect no payment details.
- No fake integrations or fabricated analytics. Stats shown are demo numbers or real counts of local demo data, and labelled.
- External URLs (YouTube/Instagram/etc.) default to empty/placeholder; features stay usable when unset.
- Never put API keys/secrets in client files. Setup & Integrations only stores **public URLs** locally.
- All user-editable text is rendered with `textContent`/DOM APIs, never `innerHTML`. URLs are validated (`https:`/`http:`; images also `data:image/`).
- localStorage keys are prefixed `alethea.`; always wrap storage access in try/catch.

## Design rules
- Palette: midnight navy base; blue (`--c1`), emerald/mint (`--c2`), violet (`--c3`) always blended via `--grad`, never used as unrelated flat colors. Theme changes only set CSS variables on `:root`.
- Mobile-first, RTL-first (Arabic default) using logical CSS properties (`margin-inline-*`, `inset-inline-*`). English toggles `dir="ltr"`.
- 3D = CSS transforms only (no WebGL). Particles = one light canvas, pauses when hidden.
- Honor `prefers-reduced-motion` and the user's animation-intensity setting (`data-motion="off"` disables all motion).
- Content must remain usable if JS animations fail: `.reveal` hiding only applies when `html.anim` is set by JS.
- Existing Arabic-only auth/admin views are preserved; the rest is bilingual via `data-i18n` and `{ar,en}` data fields.

## Testing
Serve with `python3 -m http.server` and drive with Playwright (Chromium is available). Check: navigation, cart totals (integer cents), theme persistence, dashboard CRUD, mobile viewport (390px), no console errors.
