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

## Stage 12b (visual cleanup): DONE, checked with screenshots (390px and 1280px) + all earlier UI tests re-run
Support, Operations and the home FAQ now use the site's own system (`pagehead`, `eyebrow`, `sec-head`, `glass`, `field`, typed inputs). Removed the duplicate store info bar (the store already has a demo banner); "recently viewed" now sits under that banner and only appears when there is history. Header fits on 390px (icon-only brand below 430px). Fixed "ms" direction in Arabic. AI assistant: backend draft (Edge Function + schema_ai.sql) exists in a separate folder and is NOT connected or deployed yet.

## Stage 13 (galaxy hero + guide + settings): DONE, 15 UI checks passed, screenshots reviewed (390px, 1280px)
NOT done yet (requested): redesigned admin dashboard (`#/dashboard`, dashboard.js 51 KB, not reviewed yet), nicer login page, AI assistant UI. The AI backend draft is in a separate folder and not connected.

## Stage 14 (admin layout + login/register): DONE, 20 UI checks passed + earlier suites re-run, screenshots reviewed (390px, 1280px)
Not done: AI assistant UI (backend draft separate, not connected); dashboard internals untouched; auth pages remain Arabic-only as before.

## Stage 15 (Explore the ALethea Universe section): DONE, 21 UI checks passed + all earlier suites re-run, screenshots reviewed (390px, 1280px)
Checked: intro/ENTER and hero galaxy untouched, section placement, 5 real destinations navigate to visible views, no overflow at 390/768/1280, Arabic and exact English title, reduced-motion stops the starfield, no JS errors. Found and fixed during review: CSS variable name collision with the site's own `--py`. Not tested: real phones, weak-device performance numbers.

## Stage 16 (menu + color studio fix + planet tuning): DONE, 14 new UI checks + earlier suites re-run, screenshots reviewed (390px, 1280px)
Fixed: "Open color studio" in Settings (panel was closed by the site's own outside-click handler). Menu now grouped; mobile panel opaque. Planets retuned (positions, sizes, parallax depth, palette inside the ALethea colors). Not tested on real phones.

## Entrance flow check: DONE (33 UI checks at 390/768/1280 px)
Verified the existing flow galaxy -> entrance (solar system + portal) -> ENTER -> site. Fixed one bug: the first-visit guide opened over the galaxy screen. Only `galaxy.js` changed. `welcome.js`, `welcome.css`, `alethea.js` untouched.

## Stage 17 (audit + small refinements): DONE
Automated crawl of all 17 routes at 390 px (and 8 at 1280 px): no JS errors, no failed requests, no horizontal overflow, no images without alt, no unnamed buttons/links, no unlabeled inputs. Footer links `#/youtube|discord|instagram` are intentional deep links (verified: they land on their Community section). Security scan: no secrets in frontend (only the public Supabase key), every `_blank` link has `noopener`, `innerHTML` only used for fixed SVG. Fixed: logo tap target on narrow phones (was 28 px, my earlier regression), "view all" links on touch, `transition: all` on chips/thumbnails. Nothing else needed: press states, input focus ring, empty states, disabled styles, tooltips and reduced motion already existed. Only `extras.css` changed.

## Stage 18 (entrance + hero galaxy visual upgrade): DONE, 33+15+22+14+20+5+10+12 UI checks passed, plus a 5-size entrance check (390/360/768/1280 px and 800x360 landscape)
Entrance (`welcome.js`, `welcome.css`): solar system is bigger (up to 460 px) with 8 planets (Mercury..Neptune), Earth has a moon, Saturn a ring, Jupiter bands; extra twinkling stars, static star field with a few glints, rare shooting star, a fine concentric/radial/hexagon pattern layer and drifting nebula clouds in the portal background. Screen 1 (galaxy): tap ripple + rare shooting star. Hero galaxy (`galaxy.js`, `extras.css`): crisp bright core, warm-white bulge, inner ring, dust lanes, denser center stars, finer arms. Found by screenshots and fixed: the class name `ring` collided with the hero's `.ring` rule (Saturn rendered as an empty ring, also in the earlier version); title text-shadow showed through gradient text (now `drop-shadow`). Not tested on real phones.

## Stage 19 (entrance timing fix + undocumented files documented): DONE, 33+15+14+22+20+10+12+5+... UI checks passed
Measured before/after with throttled Chromium: on a 45 KB/s connection the entrance used to be skipped completely; now it always shows (galaxy at 5.1 s there). Profile (4x CPU, load window): welcome.js 519 ms, multiverse.js 401 ms, alethea.js 275 ms, app.js 124 ms, universe.js 104 ms; JS 254 KB, CSS 86 KB, 29 requests. Open: lazy-load dashboard.js (50 KB), defer multiverse/universe work until after ENTER, English text on login/register/community, robots.txt/manifest. Real phones not tested.
