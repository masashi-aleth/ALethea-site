# ALethea progress

## Rules in force
- Static site (no build, no framework). Read CLAUDE.md first.
- One phase at a time. Wait for "CONTINUE TO NEXT PHASE".
- 3D: CSS transforms only. Main 3D core goes on the welcome screen (Phase 2). Existing hero rings and card tilt stay (cheap, CSS only).
- Honest demo labels everywhere. No payments, no secrets in client files.

## Phase 1 — Audit + design foundation: DONE (not browser-tested)
Audit result: the repo already has a design system (aurora.css), bilingual i18n, theme engine, demo store/cart/checkout, demo dashboard, and a real Supabase `#/admin`. Nothing was rebuilt.

Files added (nothing existing was rewritten):
- `aurora-foundation.css` — spacing/radius/z-index tokens, 44px tap targets on touch, lighter blur on phones, removed per-card backdrop blur on mobile, toast moved above the dock, tilt disabled on touch.
- `ALETHEA_PROGRESS.md` — this file.

One manual edit required in `index.html`, right after the aurora.css link:
`<link rel="stylesheet" href="aurora-foundation.css">`

## Phase 2 — Cinematic welcome: DONE (tested in isolation, not inside the full site)
Files added: `welcome.css`, `welcome.js` (builds its own DOM; no markup in index.html).
Edit required in `index.html` `<head>`, after the aurora-foundation link:
`<link rel="stylesheet" href="welcome.css">` and `<script src="welcome.js"></script>`
Behavior: exact title/credit/ENTER; CSS-3D core + rings follow pointer/touch; light particle canvas (paused when hidden); once per session (`sessionStorage alethea.entered`); Esc also enters; skipped for `?code=` and #/admin|login|register|dashboard; reduced-motion or theme motion 0 gives a still version; no-3D gives flat rings; if anything fails the site is revealed.
Checked (headless Chromium, 360px touch + reduced-motion): no console errors, no horizontal overflow, site hidden until ENTER then visible, overlay removed, reload skips intro. NOT checked: real Android device, inside full index.html.

## Phase 3 — Multiverse hub: DONE (tested with stubs, not with the full real site)
Files: `multiverse.css`, `multiverse.js` (own ar/en text; injects a portal hub into #homeSections in place of the Explore tiles; re-injects after language switch; hidden if the dashboard turns Explore off). Worlds: Store, Studio, Lab, Forge, Commons, Origin (all real routes, labelled Demo/Open/Experimental/In development) + one "Undiscovered" locked card. Also a soft fade between pages (.view.on).
`index.html` was fully replaced: adds foundation/welcome/multiverse tags, favicon (removes the favicon 404), fixes the duplicated word in the footer.
Checked (headless Chromium 360px + 1280px, other site scripts stubbed): welcome shows then ENTER works, 7 cards, links navigate, locked card shows a message, language switch rebuilds in English, no horizontal overflow, no console errors. NOT checked: the full real alethea.js/dashboard.js running together, real Android device.

## Phase 4 — Light 2D interactions: DONE (tested with stubs)
Appended to `multiverse.css`/`multiverse.js` (no index.html change): press feedback on buttons/chips, consistent focus ring, scroll progress bar, back-to-top button (bilingual label), cart badge bump when count changes. All off when animation intensity is 0 / reduced motion.
Checked (headless Chromium 360px + 1280px): button hidden at top, shows after scrolling, returns to top, badge bumps, label switches to English, no console errors, JS syntax OK, every file referenced by index.html exists.

## Full-site test with the real repo ZIP (phases 1-4): PASSED
Real alethea.js/app.js/dashboard.js/aurora.css running with the new files (headless Chromium, 360px and 1280px, Supabase CDN offline): welcome -> ENTER, 7 hub cards, old tiles hidden, language switch rebuilds hub, all 15 routes have no horizontal overflow, add-to-cart bumps badge, no site JS errors (only an offline-network error from the Discord widget fetch).
Fixes found by that test (in aurora-foundation.css): hero core rendered a clipped rectangle (replaced with a flat halo); blue ring around the whole page after ENTER (main focus); desktop nav wrapped to 2 lines (menu button now used up to 1600px).
Not tested: real Android device, real Supabase login/admin.

## Phases 5-8: DONE (tested with the real repo; Supabase tested with a mock client only)
- P5 storefront: wishlist hearts on cards/detail, "Saved" filter chip + count + empty state, discount % badge. (search/sort/filter/cart/skeletons already existed.)
- P6 dashboard: new "Universe & promo" tab (promo bar, show/hide + status of each hub world), welcome-screen toggle in Site sections.
- P7 data/security: `schema_products.sql` (public reads published only; admin-only insert/update/delete via is_admin()). Site reads `products` when it exists; dashboard writes to it only for a real admin; failures show an error toast and fall back to local. Cart/checkout remain simulations.
- P8 polish: 40 automated checks pass (wishlist, promo, worlds, welcome toggle, dashboard tabs AR/EN, visitor/admin/rejected-write flows with a mock Supabase, 5 viewports x 2 languages x 15 routes: no overflow, no JS errors). Fixed a 4px header overflow at 360px in English.
- NOT tested: real Supabase (run schema_products.sql and try creating a product as admin), real Android device.

## Known issues / to verify
- `config.js`: DISCORD_GUILD_ID has 15 digits (real IDs are 17-19). Online counter likely silent-fails. Verify. Also check DISCORD_INVITE_URL.
- `#/dashboard` is a demo (localStorage only). `#/admin` is the real protected one.

## Next
Optional: real-device pass, product ratings/reviews (needs a data model), more products/images. Ask for what you want next.

## Phase 9: DONE (tested with the real repo, 390px, Chromium)
Added `extras.css`/`extras.js`, Open Graph + JSON-LD in `index.html`. Checked: search button, search by English name while the UI is Arabic, Enter opens the product, recently viewed shows on the store, FAQ rebuilds in English, no overflow, no JS errors. NOT checked: real phone, `og.png` (not created yet).

## Phase 9b: DONE (tested, Chromium 1280px)
Added to `extras.css`/`extras.js`: mouse-only spotlight glow on `.pcard`, a gradient light line on the footer, and a `pro-lite` class on weak devices (4 or fewer cores, 2 GB or less RAM, or Data Saver) that disables backdrop blur. Research notes: Awwwards/trend pages were read via search results only; individual award sites were not opened.

## Stage 10 (account theme sync): DONE, tested with a MOCK Supabase client only
Checked: remote theme applied, hostile values ignored/clamped, own-id upsert after a change, first-login upload. NOT checked: real Supabase (run `schema_account.sql`, sign in on two devices). Not started: tickets, roles/admin rebuild, audit log, notifications, AI assistant, email verification settings, maintenance mode.

## Stage 11 (support tickets + notifications): DONE, UI tested with a MOCK client only
12 UI checks passed (login gate, create ticket, reply, admin list/status save, bell count, mark-all-read, missing-table message, no overflow, no JS errors). The SQL was NOT run on any database (no Postgres here): run `schema_support.sql` in Supabase and test with two accounts (one admin). Not built: agent assignment, attachments, email.

## Stage 12 (audit log + operations page + hero search hint): DONE, UI tested with a MOCK client only
10 UI checks passed (hint, non-admin denied, overview numbers, health, pagination, filter, CSV, English, no overflow, no JS errors). `schema_audit.sql` NOT run on a real database. Still open: agent assignment, attachments, email, AI assistant, maintenance mode, user suspension, auth-event logging (use Supabase Auth logs).
