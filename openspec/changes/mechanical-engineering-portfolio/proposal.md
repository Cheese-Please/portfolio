## Why

A mechanical engineer needs a portfolio site that presents project work the way engineers actually think — problem stated, outcome measured, evidence shown — but the reference site this is modeled on (nhoong.github.io) buries that good structure under unstyled Bootstrap carousels, raw list stubs, and no visual hierarchy. The concept is worth keeping; the execution needs to be built properly from the start: real typography and spacing, a working image gallery, and a fast-loading pseudo-3D "spin" viewer that reads as 3D without shipping heavy CAD files.

## What Changes

- Stand up a static, responsive portfolio site (plain HTML/CSS/JS, no framework) built on the MIT-licensed `nisarhassan12/portfolio-template` foundation, stripped to the section skeleton: header/nav, hero, about, projects, optional work-experience page, contact/footer.
- Establish a design token system (color, type, layout, one signature element) grounded in mechanical-engineering/drafting visual language, explicitly avoiding the three templated-AI-design defaults called out in the spec.
- Define a single reusable data shape for project case studies (`id`, `title`, `objective`, `result`, `tags`, `reportUrl`, `spin`, `gallery`) and a renderer that templates all projects from an array in `js/data.js`, so adding a project is data entry, not markup surgery.
- Add a pseudo-3D spin viewer using the MIT-licensed `scaleflex/cloudimage-360-view` library: drag/swipe to rotate a part from a folder of pre-rendered frames, with poster-frame fallback, lazy initialization via `IntersectionObserver`, and `prefers-reduced-motion` handling.
- Enforce a quality floor: responsive layout, visible keyboard focus states, real alt text, no layout shift while media loads, and graceful degradation when JS is unavailable.
- Confirm and document MIT licensing for all foundations used (base template, spin viewer) and include a `LICENSE` file.
- Provide a `README.md` documenting the author workflow: how to export/name spin frames and how to add a new project.

## Capabilities

### New Capabilities
- `site-shell`: The overall page structure, navigation, hero/about/contact sections, design token system (color/type/layout/signature), responsive layout, accessibility floor (focus states, alt text, reduced motion), and licensing/attribution for the base template.
- `project-case-study`: The data-driven project rendering system — the project data shape, the Objective/Result labelled block, tags, optional report link, gallery stills, and the templating logic that turns `js/data.js` entries into rendered case-study rows without markup changes.
- `spin-viewer`: The pseudo-3D frame-sequence viewer — wiring `cloudimage-360-view` to a project's spin frames, poster-frame initial paint, lazy/IntersectionObserver-based initialization, drag/swipe interaction, optional single-play autoplay, and `prefers-reduced-motion` / no-JS graceful degradation.

### Modified Capabilities
(none — greenfield project, no existing specs)

## Impact

- **New repo content**: `index.html`, optional `work-experience.html`, `css/styles.css`, `js/data.js`, `js/main.js`, `assets/img/`, `assets/spin/<project-id>/`, `reports/`, `vendor/` (if `cloudimage-360-view` is vendored rather than loaded via CDN), `LICENSE`, `README.md`.
- **Dependencies**: `nisarhassan12/portfolio-template` (base HTML/CSS/JS, MIT — license to be verified before use), `scaleflex/cloudimage-360-view` (MIT, confirmed). No build tooling, backend, database, or CMS introduced.
- **Hosting**: Static hosting (GitHub Pages) as the deployment target; no server-side changes.
- **Out of scope**: Real-time 3D engines (three.js/model-viewer), login/auth, analytics, CMS/backend/database — explicitly excluded per the spec's non-goals.
