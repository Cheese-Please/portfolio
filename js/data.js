// Project case studies. Add a new project = drop its media into /assets and
// /reports, then add one object here. No HTML editing required.
const PROJECTS = [
  {
    id: "shock-top",
    title: "Shock Top Assembly",
    objective:
      "Design the top mount for a rear shock assembly, including all fasteners, " +
      "that allows the shock and strut to pivot through the full range of " +
      "suspension travel without binding.",
    result:
      "A complete shock-top assembly with a spherical-bearing joint that pivots " +
      "±12° to absorb steering and suspension motion so no bending load reaches " +
      "the shock body.",
    tags: ["SolidWorks", "GD&T", "Assembly design"],
    reportUrl: "reports/shock-top.pdf",
    spin: {
      folder: "assets/spin/shock-top/",
      filenamePattern: "frame-{index}.jpg",
      frameCount: 24,
      amountX: 24,
    },
    gallery: [
      {
        src: "assets/img/shock-top-exploded.jpg",
        caption: "Exploded view of the shock-top assembly with bill of materials",
      },
      {
        src: "assets/img/shock-top-drawing.jpg",
        caption: "SolidWorks detail drawing of the machined mount, individual components",
      },
    ],
  },
];
