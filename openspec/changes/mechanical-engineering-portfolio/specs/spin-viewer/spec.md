## ADDED Requirements

### Requirement: Poster-frame initial paint
Every project row with a `spin` field SHALL render a static `<img>` using that sequence's first frame as a poster the moment the row renders, independent of whether the spin-viewer library or its frames have loaded yet. This poster SHALL carry descriptive alt text naming the part.

#### Scenario: Row renders before spin library loads
- **WHEN** a project row with a `spin` field first renders on the page
- **THEN** a static poster image (the first frame) is immediately visible, before the spin-viewer library has initialized

### Requirement: Lazy initialization via viewport proximity
The spin viewer for a given project SHALL NOT initialize (i.e. SHALL NOT begin fetching the full frame sequence) until that project's row nears the viewport, as determined by an `IntersectionObserver`. Projects never scrolled into view SHALL NOT trigger their frame sequence to load.

#### Scenario: Project far below the fold
- **WHEN** a visitor loads the homepage and a spin-bearing project is far below the initial viewport
- **THEN** that project's frame sequence is not requested until the visitor scrolls near that project's row

#### Scenario: Project scrolls into view
- **WHEN** a spin-bearing project's row comes near the viewport during scrolling
- **THEN** the spin viewer initializes and begins loading its frame sequence at that point

### Requirement: Drag and swipe interaction
Once initialized, the spin viewer SHALL allow a visitor to rotate the displayed part by dragging with a mouse or swiping with touch input, cycling through the frames defined by the project's `spin.frameCount` and `spin.amountX`.

#### Scenario: Desktop drag
- **WHEN** a visitor clicks and drags left-to-right across an initialized spin viewer
- **THEN** the displayed frame advances through the sequence in response to the drag distance

#### Scenario: Touch swipe
- **WHEN** a visitor swipes across an initialized spin viewer on a touch device
- **THEN** the displayed frame advances through the sequence in response to the swipe

### Requirement: Autoplay-once on first reveal, gated by reduced motion
When a spin viewer initializes and the visitor has not set `prefers-reduced-motion: reduce`, the viewer MAY play through its frame sequence once automatically to signal interactivity, then stop and await manual input. When `prefers-reduced-motion: reduce` is set, no automatic playback SHALL occur; the poster SHALL remain static until the visitor manually drags or swipes.

#### Scenario: First reveal without reduced motion
- **WHEN** a spin viewer initializes for a visitor without `prefers-reduced-motion` set
- **THEN** it plays through the frame sequence once automatically and then stops, awaiting manual interaction

#### Scenario: First reveal with reduced motion
- **WHEN** a spin viewer initializes for a visitor with `prefers-reduced-motion: reduce` set
- **THEN** no automatic playback occurs and the poster frame remains static until manually dragged

### Requirement: Graceful degradation on library or frame failure
If the spin-viewer library fails to load, fails to initialize, or fails to fetch its frame sequence, the project row SHALL continue to display the static poster image as a normal `<img>` rather than an empty or broken media box. This applies whenever page JavaScript is running (project rows are rendered client-side from `js/data.js`; see `project-case-study` capability) but the spin-viewer library itself is unavailable or its frames fail.

#### Scenario: Spin-viewer library fails to load
- **WHEN** the `cloudimage-360-view` CDN script fails to load (e.g. network error, ad blocker) but the rest of the page's JavaScript runs normally
- **THEN** every spin-bearing project row still displays its poster image as a normal static image, with no broken or empty media area

#### Scenario: Frame sequence fails to load
- **WHEN** the spin-viewer library initializes but the frame image requests fail (e.g. network error)
- **THEN** the row continues to display the poster image rather than a broken or empty box

### Requirement: Page-level no-JavaScript fallback
Because project rows (including spin-viewer posters) are rendered client-side from `js/data.js` — a deliberate architectural choice to keep the site a zero-build, plain-HTML/CSS/JS static site (see `design.md`) — a visitor with JavaScript disabled entirely SHALL NOT see a silently empty page. The site SHALL present a `<noscript>` notice explaining that JavaScript is required to render the project case studies, with an alternative contact path.

#### Scenario: JavaScript disabled site-wide
- **WHEN** a visitor loads the site with JavaScript disabled
- **THEN** a visible notice explains that JavaScript is required for the project content and offers a way to contact the site owner directly, rather than presenting a blank or broken page

### Requirement: Consistent frame configuration per project
Each project's `spin` object SHALL fully specify `folder`, `filenamePattern`, `frameCount`, and `amountX`, and the viewer SHALL be initialized using exactly these values with no hard-coded defaults substituted for a specific project's configuration.

#### Scenario: Viewer initialized from project data
- **WHEN** a spin viewer initializes for a project with `frameCount: 36` and `amountX: 36`
- **THEN** the viewer is configured to cycle through 36 frames across a full rotation, matching that project's data exactly
