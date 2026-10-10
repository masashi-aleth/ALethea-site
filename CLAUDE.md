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
2. `#/dashboard` — dashboard UI. For visitors it is a DEMO (no login, data in the visitor's own `localStorage`, demo banner). When the signed-in user is a real Supabase admin (`ALETHEA_DB.isAdmin()`), product create/edit/publish/feature/delete are ALSO written to the `products` table (`schema_products.sql`); the server (RLS) decides, never the client. Other tabs stay local. Never claim the demo mode is secure or shared.

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

## Added layers (Phases 1-4, additive; do not merge into the originals)
| File | Role |
|---|---|
| `aurora-foundation.css` | Tokens (spacing/radius/z-index), tap targets, mobile perf, toast above dock, hero halo fix, nav breakpoint (menu button up to 1600px). |
| `welcome.css` / `welcome.js` | Full-screen "WELCOME TO ALETHEA" intro. Builds its own DOM, once per session (`sessionStorage alethea.entered`), skipped for admin/login/OAuth return. CSS 3D core only here. |
| `multiverse.css` / `multiverse.js` | Portal hub injected into `#homeSections` (replaces Explore tiles, re-injected after re-render) + scroll progress, back-to-top, cart badge bump. |
| `ALETHEA_PROGRESS.md` | Phase log. Read it first. |

## Phases 5-8 additions
- Wishlist (`alethea.wish.v1`, this browser), discount %, saved filter chip in the store (`alethea.js`).
- Dashboard tab "Universe & promo" (`worlds` + `promo` in demo data; `sections.welcome` toggles the welcome screen).
- Optional Supabase products: `loadRemote()` in `alethea.js` reads `products` (public sees published only); `remoteSave/remoteDelete` write only for admins. If the table is missing the site silently keeps local demo data.
- `polish.css` loads last (wishlist, promo bar, small-phone header fixes).
- `schema_products.sql` is run manually in Supabase after `schema.sql`.

## Phase 9 addition
| File | Role |
|---|---|
| `extras.css` / `extras.js` | Additive layer: quick search (Ctrl/Cmd+K or "/", header button; matches AR + EN names and tags), info bar + "recently viewed" on `#/store` (`alethea.recent.v1`), home FAQ (`<details>`, own ar/en text, only true statements about the demo). `index.html` also gained Open Graph / Twitter / canonical / WebSite JSON-LD (needs `og.png` in the repo root). |

## Stage 10 addition (account persistence)
`schema_account.sql` creates `user_settings` (own-row RLS only). `account-sync.js` (loads after `extras.js`): when `alethea:auth` fires and a Supabase session exists, the account's saved theme is applied (only known keys, hex colors and clamped numbers are accepted), or this device's theme is uploaded if the account has none; later changes are upserted (checked every 2.5 s while the tab is visible). Language is NOT synced yet. If the table is missing it silently does nothing.

## Stage 11 addition (support + notifications)
`schema_support.sql`: `support_tickets`, `ticket_messages`, `notifications`. RLS: owner or `is_admin()` reads/replies; only admins update status/priority; clients cannot insert notifications. Triggers set `author_id`/`is_staff` server-side, move ticket status on replies, and create notifications. `support.js` adds view `#support` (section in `index.html`), nav link, header bell (polls every 60 s). Ticket detail route: `#/support/<uuid>`. Not built yet: assignment to agents, attachments, email.

## Stage 12 addition (audit log + operations)
`schema_audit.sql`: `audit_log` (admin-read RLS, append-only trigger, written only by definer triggers on tickets/messages/profiles.role). `ops.js`: view `#ops` (admin only in UI, RLS on the server), overview counts, status bars, DB latency check, filterable/paginated log, spreadsheet-safe CSV export. `extras.js` also adds a hero search hint button. Welcome screen and hero were left as they were (they already match the spec).
