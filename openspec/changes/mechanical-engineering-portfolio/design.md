## Context

This is a greenfield static site: no backend, no build pipeline required, target host is GitHub Pages. The build spec (source document for this change) is unusually prescriptive — it names specific base repos, a specific spin-viewer library, an exact data shape, and an explicit list of design anti-patterns to avoid. This design doc records the technical decisions needed to turn that spec into a coherent implementation plan, and flags the places where the spec leaves room for judgment (frame counts, exact token values, page count).

Constraints carried over from the spec:
- Plain HTML/CSS/JS preferred over a framework — no React/Vue/Astro, no bundler required.
- MIT-licensed foundations only.
- No WebGL/three.js/model-viewer; the "3D" is a pre-rendered frame sequence.
- No CMS, backend, database, login, or required analytics.

## Goals / Non-Goals

**Goals:**
- Pick and validate the base template and spin-viewer library, with license verification as a real gate, not an assumption.
- Define the concrete mechanism by which `js/data.js` entries become rendered DOM (the "data entry, not markup surgery" requirement).
- Define exactly how the spin viewer initializes, degrades, and respects `prefers-reduced-motion`, since this is the highest-risk/most novel piece.
- Fix a design token system now (color/type/layout/signature) so implementation doesn't default to generic template styling.
- Keep the whole system dependency-light enough that "adding a project" stays a two-step, no-code action (drop frames + add one object).

**Non-Goals:**
- No decision here about actual project content (real photos, real CAD exports, real report PDFs) — that's content authoring, not build work, and happens after the shell exists.
- No CI/CD pipeline design — GitHub Pages serves the repo directly; no deploy step to design.
- No decision on analytics/monitoring — explicitly deferred by the spec.
- No responsive-image/CDN pipeline beyond manual export-time compression — frame optimization is a manual CAD-export step (§6a of the spec), not a build-time transform.

## Decisions

### 1. Base template: built from scratch in plain HTML/CSS/JS (superseded during implementation)
Originally chosen per spec §3a: `nisarhassan12/portfolio-template`. **License verification during implementation found this repo is actually GPL-3.0**, not MIT as the build spec assumed — copying it would obligate the whole site to be GPL-licensed, conflicting with the "MIT-licensed foundations only" goal. The documented fallback, `hrishikeshpaul/portfolio-template`, is confirmed MIT but is Vue + Node tooling, which contradicts the "plain HTML/CSS/JS, no framework" preference underlying Decisions 3 and 7.

Resolved (user confirmed): skip copying any external base template's code. Build `index.html`/`css/styles.css`/`js/main.js` directly from the section skeleton (spec §4) and the design token system (Decision 6), using the `site-shell` spec's structural and accessibility requirements as the direct source of truth instead of adapting a third party's markup. This avoids GPL contamination, keeps zero framework/build-step, and needs no attribution/license entry for a base template (only the spin-viewer library and this repo's own MIT `LICENSE` apply).

### 2. Spin viewer: `scaleflex/cloudimage-360-view` via CDN `<script>` tag, not vendored
License already confirmed MIT per spec. Load via CDN script tag rather than copying into `/vendor/` — simpler, no vendoring-freshness problem, and the spec explicitly allows either. If CDN reliability becomes a concern later, vendoring is a one-file change (the mechanism, `main.js`, doesn't care where the script comes from).
Alternative considered: `mladenilic/threesixty.js` — kept as the documented fallback per spec §3, invoked only if `cloudimage-360-view`'s init API proves awkward for the lazy-load/poster/reduced-motion requirements during implementation.

### 3. Rendering model: vanilla JS template functions over `data.js`, no virtual DOM
`js/data.js` exports an array of project objects matching the shape in spec §5a. `js/main.js` reads that array on `DOMContentLoaded`, and for each project builds the case-study row via plain `document.createElement`/template-literal `innerHTML` assembly, then appends into a single `#projects` container. This is the mechanism that satisfies "adding a project = drop a frame folder + add one data object" — there is exactly one place (`data.js`) a content author touches for a new project, and one rendering function (`renderProject(project)`) that must handle all valid shapes (spin-only, gallery-only, both).
Alternative considered: static HTML per project (copy-paste a row block). Rejected — this is precisely the "markup surgery" the spec forbids as an anti-pattern (acceptance criterion in §11).

### 4. Media-slot resolution logic lives in `renderProject`, driven by presence, not a type flag
Per spec §5b: if `spin` is present, it's the primary slot; else first `gallery` item is primary and the rest form a strip; if both, spin is primary and gallery is secondary. This is implemented as a plain presence check (`if (project.spin) ... else if (project.gallery) ...`) rather than a required `mediaType` field — one less thing for a content author to get wrong when adding a project object.

### 5. Spin viewer lifecycle: poster image first, `IntersectionObserver`-gated init, one library instance per project
Each spin-bearing project row renders a static `<img>` using frame 1 as the poster **immediately** (this is the no-JS/no-network fallback — see spec §6b, "never a broken empty box"). An `IntersectionObserver` watches the row; when it nears the viewport, `main.js` calls the library's init on that row's container, passing `folder`, `filenamePattern`, `frameCount`, `amountX` straight from the project's `spin` object. One observer, many targets — not one observer per project — to keep the JS simple.
`prefers-reduced-motion: reduce` is checked once at init: if set, autoplay-once is skipped entirely (poster stays static until the user manually drags); manual drag/swipe remains available either way, since the spec is explicit that reduced-motion disables *automatic* motion, not interactivity.

### 6. Design tokens fixed now, not deferred to implementation
To satisfy §7's requirement that the builder make deliberate, stated choices (and explicitly avoid the three templated-AI-design defaults), the token system is decided here rather than left open:
- **Color**: cool graphite `#2B2F33` (primary text/ink), drafting off-white `#EDEFF0` (page background — deliberately cooler/greyer than a "warm cream," to dodge anti-pattern #1), blueprint blue `#2C5F8A` (the one disciplined accent, evoking cyanotype/drafting-print blue rather than terracotta or acid tones), mid graphite `#6B7176` (secondary text/captions), hairline grey `#C7CBCE` (rules/borders), signal amber `#C97A2B` (sparing use — active/focus state only, not decoration).
- **Type**: a condensed/technical grotesk for display (headings, project titles) used sparingly at large sizes; a humanist sans with strong tabular/lining numerals for body copy (engineers show a lot of numbers — tabular figures matter for tolerances/loads); a monospace face for captions, tags, and dimension-style callouts (e.g. Objective/Result eyebrow labels, tag chips). All three roles pulled from system/free (Google Fonts, MIT/OFL) sources — no paid fonts.
- **Layout**: 12-column grid at desktop, alternating text/media rows (text side flips left/right per project to avoid monotony, per the base template's existing pattern), generous vertical rhythm using a consistent spacing scale (e.g. 8px base unit, sections separated by multiples of 64px) — this directly targets the reference site's worst failure (no spacing rhythm).
- **Signature element**: the Objective/Result pair is styled as a drafting-style annotated block — small monospace eyebrow labels ("OBJECTIVE", "RESULT") with a thin leader-line rule, echoing engineering-drawing callout conventions, used only for this one recurring element so it reads as a signature rather than a motif slathered everywhere.

### 7. No CSS framework, no bundler
Plain CSS (custom properties for the token system, no Sass/PostCSS build step) and plain `<script>` tags (no bundler, no npm build). This matches "plain HTML/CSS/JS" in the spec and keeps GitHub Pages deploy to "push the repo" with zero build step.

## Risks / Trade-offs

- **[Risk]** Base template license turns out not to be MIT, or the repo is stale/incompatible with current accessibility/responsive expectations → **Realized during implementation**: `nisarhassan12/portfolio-template` is GPL-3.0. **Resolution**: built from scratch in plain HTML/CSS/JS instead of adapting either candidate template (see Decision 1).
- **[Risk]** `cloudimage-360-view`'s public API doesn't cleanly support "init on scroll-into-view" or doesn't expose a way to detect frame-load failure for graceful degradation → **Mitigation**: poster `<img>` is rendered independently of the library and remains visible until the library confirms it has mounted; worst case, `threesixty.js` fallback is already a named alternative.
- **[Risk]** Frame sequences with inconsistent dimensions/lighting cause visible jitter, which undermines the "reads as 3D" goal → **Mitigation**: this is a content/authoring risk, not a build risk; README's author workflow section (spec §6a) states the consistent-resolution requirement explicitly as a hard rule for anyone adding a project.
- **[Risk]** Design tokens in Decision 6, chosen without visual iteration, may not hold up once real content (photos, renders) is dropped in → **Mitigation**: tokens are implemented as CSS custom properties in one place (`:root` in `styles.css`), so palette/type adjustments after visual review are a low-cost, localized change, not a rewrite.
- **[Trade-off]** CDN-loading the spin viewer (Decision 2) means a runtime dependency on an external host being up → accepted, since the poster-image fallback means the page never breaks even if the CDN request fails; only the spin interaction degrades.
- **[Risk]** Decision 3 (fully client-side rendering from `js/data.js`, no build step) means that with JavaScript disabled entirely, no project content renders at all — not just the spin viewer, but every project row, since posters are generated by the same client-side render pass. **Realized during implementation**: verified via a JS-disabled Playwright pass that `#project-list` renders completely empty with no build-time pre-render in place. **Resolution**: added a page-level `<noscript>` notice (index.html) explaining JavaScript is required and offering a direct contact path, rather than a silent blank page. This satisfies "never a broken empty box" at the page level; it does not achieve full per-project static fallback, which would require introducing a build/pre-render step — explicitly out of scope per Decision 7. The `spin-viewer` spec's graceful-degradation requirement was narrowed to cover library/frame failure (JS running, spin library unavailable); a new requirement covers the page-level no-JS case. A future build-time static-render step remains open if full no-JS project content becomes a hard requirement later.

## Migration Plan

Not applicable — greenfield build, nothing to migrate from or roll back. Deployment is "push to the GitHub Pages branch/source"; no data migration, no phased rollout.

## Open Questions

- Exact frame count per spin sequence (24 vs. 36) — spec gives a range (§6a); left to per-project judgment at authoring time based on part complexity, not fixed here.
- Whether `work-experience.html` ships as a real second page in this change or is deferred — spec marks it optional (§4); default is to build the skeleton link but leave content as a placeholder unless the user provides work-experience content during implementation.
- Exact Google Fonts (or equivalent) picks for the three type roles — narrowed to role/character in Decision 6, final family names to be chosen during implementation once real headings/captions can be previewed.
