(function () {
  "use strict";

  const SPIN_INDEX_ZERO_BASE = 2; // frame-01.jpg ... frame-NN.jpg
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function posterSrc(spin) {
    const firstIndex = String(1).padStart(SPIN_INDEX_ZERO_BASE, "0");
    return spin.folder + spin.filenamePattern.replace("{index}", firstIndex);
  }

  function buildSpecBlock(label, text) {
    return (
      '<div class="spec-block">' +
      '<p class="spec-block__label">' +
      escapeHtml(label) +
      "</p>" +
      '<p class="spec-block__text">' +
      escapeHtml(text) +
      "</p>" +
      "</div>"
    );
  }

  function buildTags(tags) {
    if (!tags || !tags.length) return "";
    return (
      '<ul class="project-row__tags">' +
      tags
        .map(
          (tag) => '<li class="tag-chip">' + escapeHtml(tag) + "</li>"
        )
        .join("") +
      "</ul>"
    );
  }

  function buildReportLink(reportUrl) {
    if (!reportUrl) return "";
    return (
      '<a class="report-link" href="' +
      escapeHtml(reportUrl) +
      '">Read the full report →</a>'
    );
  }

  function buildSpinMedia(project) {
    const poster = posterSrc(project.spin);
    return (
      '<div class="spin-viewer-wrap ratio-box" data-spin-project="' +
      escapeHtml(project.id) +
      '">' +
      '<img class="spin-poster" src="' +
      escapeHtml(poster) +
      '" alt="' +
      escapeHtml(project.title) +
      ', front three-quarter view" loading="lazy" />' +
      "</div>" +
      '<p class="spin-hint">Drag to rotate</p>'
    );
  }

  function buildGalleryPrimary(item, project) {
    return (
      '<div class="gallery-primary">' +
      '<div class="ratio-box">' +
      '<img src="' +
      escapeHtml(item.src) +
      '" alt="' +
      escapeHtml(project.title) +
      " — " +
      escapeHtml(item.caption) +
      '" loading="lazy" />' +
      "</div>" +
      "<figcaption>" +
      escapeHtml(item.caption) +
      "</figcaption>" +
      "</div>"
    );
  }

  function buildGalleryStrip(items, project) {
    if (!items || !items.length) return "";
    return (
      '<div class="gallery-strip">' +
      items
        .map(
          (item) =>
            "<figure>" +
            '<div class="ratio-box ratio-box--square">' +
            '<img src="' +
            escapeHtml(item.src) +
            '" alt="' +
            escapeHtml(project.title) +
            " — " +
            escapeHtml(item.caption) +
            '" loading="lazy" />' +
            "</div>" +
            "<figcaption>" +
            escapeHtml(item.caption) +
            "</figcaption>" +
            "</figure>"
        )
        .join("") +
      "</div>"
    );
  }

  function buildMedia(project) {
    if (project.spin) {
      const secondary = project.gallery
        ? buildGalleryStrip(project.gallery, project)
        : "";
      return buildSpinMedia(project) + secondary;
    }
    if (project.gallery && project.gallery.length) {
      const [primary, ...rest] = project.gallery;
      return (
        buildGalleryPrimary(primary, project) + buildGalleryStrip(rest, project)
      );
    }
    return "";
  }

  function renderProject(project, index) {
    const row = document.createElement("article");
    row.className =
      "project-row" + (index % 2 === 1 ? " project-row--reverse" : "");
    row.id = project.id;

    row.innerHTML =
      '<div class="project-row__text">' +
      '<h3 class="project-row__title">' +
      escapeHtml(project.title) +
      "</h3>" +
      buildSpecBlock("Objective", project.objective) +
      buildSpecBlock("Result", project.result) +
      buildTags(project.tags) +
      buildReportLink(project.reportUrl) +
      "</div>" +
      '<div class="project-row__media">' +
      buildMedia(project) +
      "</div>";

    return row;
  }

  function renderAllProjects() {
    const container = document.getElementById("project-list");
    if (!container) return;
    PROJECTS.forEach((project, index) => {
      container.appendChild(renderProject(project, index));
    });
  }

  // ---------------------------------------------------------------
  // Spin viewer: lazy init on viewport proximity, poster-first,
  // graceful degradation if the library or frames fail to load.
  // ---------------------------------------------------------------
  function initSpinViewer(wrap) {
    if (typeof window.CI360 === "undefined") return; // library failed to load — poster stays

    const projectId = wrap.getAttribute("data-spin-project");
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project || !project.spin) return;

    const poster = wrap.querySelector(".spin-poster");
    const mount = document.createElement("div");
    mount.className = "cloudimage-360 spin-mount";
    wrap.appendChild(mount);

    window.CI360.init(mount, {
      folder: project.spin.folder,
      filenameX: project.spin.filenamePattern,
      amountX: project.spin.frameCount,
      indexZeroBase: SPIN_INDEX_ZERO_BASE,
      draggable: true,
      swipeable: true,
      keys: true,
      autoplay: !prefersReducedMotion,
      playOnce: true,
      speed: 60,
      onReady: function () {
        if (poster) poster.style.display = "none";
      },
    });
  }

  function setUpSpinLazyLoad() {
    const wraps = document.querySelectorAll("[data-spin-project]");
    if (!wraps.length) return;

    if (!("IntersectionObserver" in window)) {
      // No observer support: init immediately rather than never.
      wraps.forEach(initSpinViewer);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initSpinViewer(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px" }
    );

    wraps.forEach((wrap) => observer.observe(wrap));
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAllProjects();
    setUpSpinLazyLoad();
  });
})();
