## ADDED Requirements

### Requirement: Project data shape
Every project SHALL be represented as a single JavaScript object in `js/data.js` with the fields: `id` (kebab-case slug, no spaces), `title`, `objective`, `result`, `tags` (array of strings), optional `reportUrl`, optional `spin` (`folder`, `filenamePattern`, `frameCount`, `amountX`), and optional `gallery` (array of `{ src, caption }`). All project objects SHALL live in a single exported array so that the full project list is defined in one place.

#### Scenario: New project added by data entry only
- **WHEN** a content author wants to add a new project to the site
- **THEN** they add one object matching this shape to the array in `js/data.js` and drop any referenced media into `assets/`, without editing any HTML markup

#### Scenario: Malformed project id is rejected in review
- **WHEN** a project object's `id` contains spaces or uppercase characters
- **THEN** this is treated as invalid data (not a supported input) per the kebab-case, no-spaces requirement

### Requirement: Templated rendering of all projects
The site SHALL render one case-study row per entry in the project data array using a single shared rendering function, such that all projects share identical markup structure and styling, differing only in content.

#### Scenario: Multiple projects render consistently
- **WHEN** the project data array contains three projects with different combinations of `spin` and `gallery`
- **THEN** all three render using the same row structure and styling, with only their content and media slots differing

### Requirement: Labelled Objective and Result
Every rendered project SHALL display both an `objective` and a `result` value, each preceded by a small labelled eyebrow ("OBJECTIVE" / "RESULT") styled as a label, not a heading. Both fields SHALL always be present and always rendered — a project object missing either field is not a valid case study.

#### Scenario: Project row displays Objective and Result
- **WHEN** a project renders on the page
- **THEN** its Objective and Result text each appear under their respective labelled eyebrow, visually distinct from body headings

### Requirement: Media slot resolution
The primary media slot for a project SHALL be resolved by field presence: if `spin` is present, the spin viewer occupies the primary slot; otherwise if `gallery` is present, its first item occupies the primary slot; if both `spin` and `gallery` are present, the spin viewer is primary and the gallery renders as a secondary strip. A project with neither `spin` nor `gallery` SHALL still render its Objective/Result/tags content without an empty or broken media placeholder.

#### Scenario: Spin-only project
- **WHEN** a project object has a `spin` field and no `gallery` field
- **THEN** the spin viewer renders as the sole primary media element

#### Scenario: Gallery-only project
- **WHEN** a project object has a `gallery` field and no `spin` field
- **THEN** the first gallery image renders as the primary media element and remaining gallery items render in a secondary strip

#### Scenario: Both spin and gallery present
- **WHEN** a project object has both `spin` and `gallery` fields
- **THEN** the spin viewer renders as primary media and the gallery renders as a secondary strip below or beside it

### Requirement: Report link rendering
When a project object includes `reportUrl`, the rendered case study SHALL include exactly one clear text link labelled "Read the full report →" pointing to that URL. Projects without `reportUrl` SHALL render no report link and no placeholder in its place.

#### Scenario: Project with a report
- **WHEN** a project object includes a `reportUrl` value
- **THEN** a single link reading "Read the full report →" renders, pointing to that URL

#### Scenario: Project without a report
- **WHEN** a project object has no `reportUrl` field
- **THEN** no report link or empty link placeholder renders for that project

### Requirement: Tag chip rendering
Each string in a project's `tags` array SHALL render as a small, visually quiet chip conveying material/tool/process metadata, styled distinctly from the accent-colored interactive elements on the page.

#### Scenario: Project with multiple tags
- **WHEN** a project object has `tags: ["SolidWorks", "GD&T", "Assembly design"]`
- **THEN** three quiet chip elements render, one per tag, in that order

### Requirement: Non-repeating, specific captions
Every gallery item's `caption` SHALL be specific to that image (naming the part and view or content shown) and SHALL NOT duplicate the caption text of another gallery item within the same project or across projects.

#### Scenario: Gallery with distinct captions
- **WHEN** a project's gallery array is rendered
- **THEN** each image's caption text is unique within that project and describes that specific image's content

#### Scenario: Duplicate placeholder caption is rejected
- **WHEN** two gallery items in the same project would render identical caption text (e.g. a repeated generic placeholder)
- **THEN** this is treated as invalid content per the non-repeating caption requirement
