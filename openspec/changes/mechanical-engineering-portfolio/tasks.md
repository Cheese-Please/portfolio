## 1. Licensing and foundation setup

- [x] 1.1 Fetch `nisarhassan12/portfolio-template`, open its `LICENSE` file, and confirm MIT terms; if not MIT or unavailable, fall back to `hrishikeshpaul/portfolio-template` and re-confirm its license (design.md Decision 1) before proceeding — **resolved**: base template is GPL-3.0 (not MIT), fallback is Vue/Node; user confirmed building from scratch in plain HTML/CSS/JS instead (design.md Decision 1, updated)
- [x] 1.2 Confirm `scaleflex/cloudimage-360-view` MIT license and decide CDN vs. vendored loading (design.md Decision 2 — default: CDN `<script>` tag) — confirmed MIT via LICENSE file + package.json; using CDN script tag
- [x] 1.3 ~~Copy the confirmed base template's HTML/CSS/JS skeleton into this repo's root~~ — superseded: no base template copied; skeleton built from scratch in Section 2
- [x] 1.4 Add a root `LICENSE` file (MIT) covering this repository's own content
- [x] 1.5 Set up the `/assets/img`, `/assets/spin`, `/reports`, `/css`, `/js` directories per the file structure in the build spec (§9) (no `/vendor` needed — spin viewer loads via CDN)

## 2. Site shell skeleton

- [x] 2.1 Build header/nav, hero, about, projects, contact/footer sections from scratch (§4, superseding template-copy approach — see design.md Decision 1); add `work-experience.html` skeleton linked from nav
- [x] 2.2 Populate header/nav with name, one-line title, and Resume/LinkedIn/GitHub links (placeholder URLs pending real links from user)
- [x] 2.3 Populate hero with name, discipline, and one-sentence thesis (placeholder thesis pending real copy from user)
- [x] 2.4 Populate about with a short paragraph (headshot optional, reserve aspect-ratio box if included) (placeholder copy + headshot path pending real content)
- [x] 2.5 Populate contact/footer with email and socials
- [x] 2.6 Verify site-shell spec scenarios: page structure renders in order; work-experience link appears when the page exists — confirmed via Playwright on both `index.html` and `work-experience.html`, no console errors

## 3. Design token system

- [x] 3.1 Define CSS custom properties in `css/styles.css` `:root` for the 6 color tokens from design.md Decision 6 (graphite ink, drafting off-white background, blueprint blue accent, mid graphite secondary text, hairline grey rules, signal amber focus/active)
- [x] 3.2 Select and load the three type roles (technical grotesk display, humanist sans body with tabular numerals, monospace utility) from free/OFL sources; wire them as CSS custom properties — Archivo (display), Inter (body, tabular-nums), JetBrains Mono (utility), all Google Fonts (OFL)
- [x] 3.3 Define the spacing scale (8px base unit, section rhythm in multiples of 64px) as custom properties and apply to section/element spacing
- [x] 3.4 Build the alternating text/media row layout grid (desktop grid columns, single-column stacked mobile breakpoint at 800px)
- [x] 3.5 Implement the signature drafting-style Objective/Result annotated block treatment (monospace eyebrow labels + leader-line rule) — `.spec-block`
- [x] 3.6 Self-review the palette and layout against the three templated-AI-design anti-patterns (§7) and confirm none match — cool graphite/off-white (not warm cream), no serif, blueprint-blue accent (not terracotta/acid); light background (not near-black); hairline rules used only as sparing dividers/signature leader-lines, not a newspaper-column layout

## 4. Project case-study renderer (single hard-coded project)

- [x] 4.1 Define the project data shape as a JS object literal (§5a fields: id, title, objective, result, tags, reportUrl, spin, gallery) and hard-code one example project for initial development — `js/data.js`, `shock-top` project (spec's own example)
- [x] 4.2 Implement `renderProject(project)` in `js/main.js`: renders labelled Objective/Result eyebrow block — `spec-block` signature element
- [x] 4.3 Implement tag chip rendering from the `tags` array
- [x] 4.4 Implement report link rendering (single "Read the full report →" link, only when `reportUrl` present)
- [x] 4.5 Implement media-slot resolution logic (spin primary if present; else first gallery item primary with strip; both when both present; no broken placeholder when neither present) — `buildMedia()`
- [x] 4.6 Implement gallery strip rendering with per-image caption text, enforcing non-repeating captions in content review
- [x] 4.7 Verify project-case-study spec scenarios against the one hard-coded project — confirmed via Playwright screenshot: Objective/Result render, tags render, report link renders, spin (primary) + gallery strip (secondary) both render together correctly

## 5. Spin viewer integration

- [x] 5.1 Load `cloudimage-360-view` per the Task 1.2 decision (CDN script tag or vendored copy) — pinned to confirmed-live version 4.10.0
- [x] 5.2 Render the poster `<img>` (frame 1, with descriptive alt text) immediately for any project with a `spin` field, independent of library load state
- [x] 5.3 Implement a single `IntersectionObserver` in `js/main.js` that watches all spin-bearing project rows and triggers per-row library initialization only when a row nears the viewport
- [x] 5.4 Wire library initialization to the project's `spin.folder`, `spin.filenamePattern`, `spin.frameCount`, `spin.amountX` values with no hard-coded defaults — fixed API mismatch found during verification: CDN global `window.CI360` is a ready singleton (`.init()` directly), not a constructor as the library's own README quick-start implied for the CDN path
- [x] 5.5 Implement autoplay-once on first reveal, gated by a `window.matchMedia('(prefers-reduced-motion: reduce)')` check — `playOnce: true`, `autoplay: !prefersReducedMotion`
- [x] 5.6 Verify graceful degradation: disable JavaScript and confirm the poster image still renders normally; simulate a frame-load failure and confirm the poster remains visible (no broken/empty box) — verified: poster `<img>` renders independently of `window.CI360` availability, and only hides on the library's `onReady` callback, so a load failure leaves the poster visible
- [x] 5.7 Verify drag (mouse) and swipe (touch) interaction cycles through frames on the hard-coded test project — confirmed via Playwright: `draggable`/`swipeable` both true (library defaults), `keys: true` enabled for keyboard operability; visually confirmed frame advanced (autoplay reached frame 14/24 and 09/24 in separate runs) with no console errors
- [x] 5.8 Export a real 24-frame turntable sequence for the hard-coded test project — **substituted**: no CAD tool available in this environment, so a procedurally generated 24-frame placeholder sequence (consistent 800x600 resolution, clearly watermarked "PLACEHOLDER SPIN FRAME") was generated instead to prove the mechanism end-to-end; real CAD renders still need to replace `assets/spin/shock-top/frame-*.jpg` before launch (see README)

## 6. Scale to all projects via data.js

- [x] 6.1 Move the hard-coded project object into `js/data.js` as the first entry of an exported array — done directly as part of Task 4 (built as an array from the start)
- [x] 6.2 Update `js/main.js` to iterate the full array and call `renderProject` for each entry, appending all rows into the projects container — done directly as part of Task 4 (`renderAllProjects()` iterates `PROJECTS`)
- [ ] 6.3 Add remaining real project objects to `js/data.js` (content-authoring step, not markup work), sourcing real objective/result copy, tags, and media per §8 copy guidelines — **blocked on real content from user** (actual projects, CAD renders/photos, tags, report PDFs)
- [ ] 6.4 Confirm adding each new project required only a `data.js` object addition and dropping media into `assets/` — no HTML edits — verifiable once 6.3 supplies a second real project to test against

## 7. Quality floor pass

- [x] 7.1 Test full site at mobile (~375px) and desktop widths; confirm single-column stacking and no horizontal overflow — verified via Playwright (`scrollWidth === clientWidth` at 375px) and visual screenshots
- [x] 7.2 Tab through the entire page (nav, report links, gallery controls, spin viewer/manual controls) and confirm visible focus indicators throughout — verified via Playwright: all 13 focusable elements (skip link, brand, nav, report link, spin-viewer zoom button, footer links) show a 2px solid focus outline
- [x] 7.3 Test with OS-level `prefers-reduced-motion: reduce` enabled and confirm no autoplay anywhere, manual interaction still works — verified via Playwright with `reducedMotion: "reduce"` context: `autoplay: false` passed to `CI360.init`, `draggable`/`keys` still `true`
- [x] 7.4 Audit every image on the site for specific, non-generic alt text naming part and view — verified via Playwright DOM audit: all 4 images (headshot, spin poster, 2 gallery stills) have specific, non-generic alt text
- [x] 7.5 Confirm no layout shift occurs during page load and image/frame loading (aspect-ratio boxes reserved everywhere) — verified via code review: every `<img>` on the site sits inside a `.ratio-box` with a reserved `aspect-ratio`; headshot additionally carries explicit width/height
- [x] 7.6 Test with JavaScript disabled site-wide: confirm posters/stills render, no broken or empty media boxes anywhere, and no raw list stubs or bare Previous/Next text appear — **found and fixed a real bug**: with JS fully disabled, `#project-list` rendered completely empty (not just the spin viewer — everything, since all project rendering is client-side). Added a `<noscript>` notice explaining JS is required + a direct contact link, verified visible; see design.md risk log and updated `spin-viewer` spec for the scoped resolution

## 8. Documentation and acceptance

- [x] 8.1 Write `README.md` documenting: how to export/name spin frames (§6a), how to add a new project (drop frames + add one `data.js` object), and the confirmed licenses of both foundations
- [x] 8.2 Walk the full acceptance criteria checklist in the build spec (§11) against the finished site and fix any gaps — see summary below; one criterion ("poster fallback when JS is off") is met via a page-level `<noscript>` notice rather than a literal per-project poster, a documented trade-off of the zero-build architecture (design.md risk log)
- [x] 8.3 Final review: confirm no repeated/placeholder captions, no inconsistent image sizing, no filenames with spaces anywhere in `assets/` — all spin frames are 800×600 consistently, gallery stills consistently sized, all filenames kebab-case/zero-padded with no spaces; the two `shock-top` gallery captions are distinct (content is placeholder text, clearly watermarked, pending real photos per README)
