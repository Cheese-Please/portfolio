# Portfolio

Aiden Bohluli's mechanical engineering portfolio. A static site — plain HTML,
CSS, and JavaScript, no build step, no framework. Deploys as-is to GitHub
Pages.

## Running locally

Any static file server works, e.g.:

```
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Adding a new project

A project is one JavaScript object in `js/data.js`. No HTML editing required.

1. Pick a kebab-case `id` (no spaces, no uppercase), e.g. `"linkage-arm"`.
2. Add media to `assets/`:
   - A still gallery: drop images in `assets/img/` and reference them under
     `gallery: [{ src, caption }, ...]`. Captions must be specific to that
     image — never reuse the same caption twice.
   - A spin sequence: see below, drop frames in `assets/spin/<id>/`.
   - A report PDF: drop it in `reports/` and set `reportUrl`.
3. Append an object to the `PROJECTS` array in `js/data.js` following the
   shape already used by `shock-top`: `id`, `title`, `objective`, `result`,
   `tags`, optional `reportUrl`, optional `spin`, optional `gallery`.
4. Refresh the page. `js/main.js` renders every entry in `PROJECTS`
   automatically — rows alternate text/media side automatically by index.

If a project has both `spin` and `gallery`, the spin viewer is the primary
media and the gallery renders as a secondary strip. With only one of the
two, that one becomes primary. Objective and Result are always required.

## Producing spin frames

The "spin viewer" is a folder of pre-rendered turntable images, not a 3D
model — no WebGL, no CAD files shipped to the browser.

1. In your CAD tool (SolidWorks, Fusion, Onshape), put the part on a
   turntable / rotate it about the vertical axis.
2. Export 24–36 evenly spaced renders through a full 360°. 24 is enough for
   most parts; go to 36 for more geometric complexity.
3. Name them with a **2-digit, zero-padded index**, matching the
   `filenamePattern` convention used across this site:
   `frame-01.jpg`, `frame-02.jpg`, … `frame-24.jpg` (or however many you
   exported).
4. Keep resolution and framing **identical** across every frame in a
   sequence — inconsistent dimensions or lighting is the single biggest
   cause of visible jitter when spinning.
5. Compress each frame to a few hundred KB or less. The whole sequence
   should feel instant to drag through on a normal connection.
6. Drop the files in `assets/spin/<project-id>/`.
7. In that project's `data.js` entry, set:
   ```js
   spin: {
     folder: "assets/spin/<project-id>/",
     filenamePattern: "frame-{index}.jpg",
     frameCount: 24,   // however many frames you exported
     amountX: 24,      // same as frameCount for a single 360° pass
   }
   ```

The first frame (`frame-01.jpg`) doubles as the poster image shown before
the viewer loads and if JavaScript or the frame sequence fails — so make
sure it's a good representative angle.

## Current placeholder content

This scaffold ships with one example project (`shock-top`) using
**procedurally generated placeholder images**, clearly watermarked
"PLACEHOLDER" — there was no CAD tool available to produce real renders
during initial setup. Before publishing:

- Replace `assets/spin/shock-top/frame-*.jpg` with a real CAD turntable
  export (see above).
- Replace `assets/img/shock-top-exploded.jpg`, `shock-top-drawing.jpg`, and
  `assets/img/headshot.jpg` with real photos/renders.
- Replace `reports/shock-top.pdf` and `reports/resume.pdf` with real PDFs.
- Update the placeholder Resume/LinkedIn/GitHub URLs in `index.html`,
  `work-experience.html`, and the hero thesis / about copy with real links
  and copy.
- Fill in `work-experience.html` with a real timeline (it currently has one
  placeholder entry).
- Add remaining real projects to `js/data.js`.

## Licensing

This repository's own content is MIT-licensed — see `LICENSE`.

The site is built from scratch in plain HTML/CSS/JS (no base template
dependency; an earlier candidate, `nisarhassan12/portfolio-template`, turned
out to be GPL-3.0 and was dropped rather than risk copyleft obligations).

The spin viewer uses [`cloudimage-360-view`](https://github.com/scaleflex/cloudimage-360-view)
(MIT, confirmed via its `LICENSE` file and `package.json`), loaded from
Scaleflex's CDN.

Type: [Archivo](https://fonts.google.com/specimen/Archivo),
[Inter](https://fonts.google.com/specimen/Inter), and
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), all
served via Google Fonts under the SIL Open Font License.

## File structure

```
index.html              Main page
work-experience.html    Optional timeline page
css/styles.css          Design tokens + all styling
js/data.js              Project data — edit this to add/change projects
js/main.js              Renders projects, wires up the spin viewer
assets/img/             Stills, drawings, headshot
assets/spin/<id>/       Per-project turntable frame sequences
reports/                Linked PDFs
```
