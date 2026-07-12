## ADDED Requirements

### Requirement: Page structure and navigation
The site SHALL present a single primary page (`index.html`) containing, in order: header/navigation, hero, about, projects, and contact/footer sections. The header SHALL provide the person's name, a one-line discipline/title, and links to Resume, LinkedIn, and GitHub. An optional `work-experience.html` page MAY exist and, if present, SHALL be linked from the header navigation.

#### Scenario: Visitor loads the homepage
- **WHEN** a visitor navigates to `index.html`
- **THEN** the page renders header/nav, hero, about, projects, and contact/footer sections in that order, with no missing or empty section

#### Scenario: Work-experience page is linked when present
- **WHEN** `work-experience.html` exists in the site
- **THEN** the header navigation on every page includes a link to it

### Requirement: Design token system
The site SHALL define its visual design as a stated token system in `css/styles.css` using CSS custom properties, covering: 4–6 named color values (including exactly one accent color), at least two type roles (a display face and a body face with tabular/lining numerals), and a spacing scale used consistently for section and element rhythm. The token system SHALL be grounded in mechanical-engineering/drafting visual language (e.g. drafting-inspired neutrals, a blueprint-style accent) and SHALL NOT reproduce any of the following defaults: (a) warm cream background with high-contrast serif type and a terracotta accent, (b) near-black background with a single acid-green or vermilion accent, (c) hairline-rule newspaper-column layout.

#### Scenario: Tokens are centrally defined
- **WHEN** the design tokens need to change (e.g. accent color adjustment)
- **THEN** the change is made in a single `:root` block of custom properties in `styles.css`, with no color or spacing values hard-coded elsewhere in the stylesheet

#### Scenario: Palette avoids templated-AI defaults
- **WHEN** the color token values are reviewed against the three named anti-pattern palettes
- **THEN** none of the three anti-patterns match the chosen palette

### Requirement: One signature design element
The site SHALL include exactly one recurring signature visual element that reflects the engineering-drawing subject matter (e.g. a drafting-style annotated block for Objective/Result, or a title-block frame around the spin viewer). This signature element SHALL be applied consistently everywhere its trigger condition occurs, and other decorative flourishes referencing the same visual vocabulary SHALL be avoided elsewhere on the site.

#### Scenario: Signature element appears on every project row
- **WHEN** any project case study renders on the page
- **THEN** the same signature visual treatment (e.g. the drafting-style Objective/Result block) is present, styled identically across all projects

### Requirement: Responsive layout
The site SHALL render correctly on viewport widths from mobile (approx. 360px) through desktop, with the alternating text/media project rows collapsing to a single stacked column below a defined breakpoint, and no horizontal scrolling or overlapping content at any supported width.

#### Scenario: Mobile viewport
- **WHEN** the site is viewed at a 375px-wide viewport
- **THEN** all sections stack in a single column, text remains readable without zooming, and no element overflows the viewport width

### Requirement: Keyboard accessibility
All interactive elements on the site (navigation links, report links, gallery controls, and the spin viewer's manual controls or a keyboard-operable equivalent) SHALL be reachable via Tab order and SHALL display a visible focus indicator when focused via keyboard.

#### Scenario: Keyboard-only navigation
- **WHEN** a visitor navigates the page using only the Tab and Enter keys
- **THEN** every interactive element (links, gallery controls, and the spin viewer or its poster/gallery equivalent) receives a visible focus outline and is operable

### Requirement: Reduced motion support
The site SHALL respect the `prefers-reduced-motion` media feature. When set to `reduce`, any automatic animation (including spin-viewer autoplay-once) SHALL be suppressed; manual/user-initiated interaction SHALL remain available.

#### Scenario: Visitor has reduced motion enabled
- **WHEN** a visitor's OS/browser has `prefers-reduced-motion: reduce` set and they load a project row with a spin viewer
- **THEN** the spin viewer does not autoplay and shows a static poster frame, but still responds to manual drag/swipe input

### Requirement: Image accessibility and layout stability
Every image on the site (stills, spin-viewer posters, headshot) SHALL have descriptive `alt` text naming the part and view depicted. Every image container SHALL reserve its aspect ratio so that no layout shift occurs as the image loads.

#### Scenario: Screen reader encounters a project image
- **WHEN** a screen reader reads a project's exploded-view image
- **THEN** the announced alt text names the specific part and view (not a generic or empty string)

#### Scenario: Slow network image load
- **WHEN** a project image is still loading on a slow connection
- **THEN** the surrounding layout does not shift once the image finishes loading, because its container already reserves the correct aspect ratio

### Requirement: Foundation licensing
The site SHALL be built only on foundations confirmed to be MIT-licensed (or compatible), and SHALL include a `LICENSE` file at the repository root covering the author's own content.

#### Scenario: Base template license verified before use
- **WHEN** the base HTML/CSS/JS template is selected for use
- **THEN** its `LICENSE` file is checked and confirmed MIT (or a documented MIT-licensed alternative is used instead) before any of its content is copied into the site

#### Scenario: Repository includes a license file
- **WHEN** the repository is inspected at its root
- **THEN** a `LICENSE` file is present declaring MIT terms
