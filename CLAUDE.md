# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Yan Cheng's personal portfolio website, hosted via GitHub Pages at `yancheng-go.github.io`. It is a static site (no build system or static site generator) — just HTML, CSS, and JS served directly.

## Architecture

- **`index.html`** — The entire main site is a single-page application. All sections (About, Projects, Open Source, Blog, Contact) are defined inline. This is the primary file you'll edit for content changes.
- **`blogs/`** — Standalone blog post HTML pages (linked from the journal section of index.html).
- **`forms/contact.php`** — Server-side contact form handler (PHP).
- **`assets/css/`** — Three custom stylesheets loaded in order: `styles.css`, `style3.css`, `style2.css`.
- **`assets/js/main.js`** — Main JS (based on Folio Bootstrap template): smooth scrolling, navbar behavior, back-to-top, typed.js integration, portfolio filtering.
- **`assets/js/scripts.js`** — Additional JS (from Creative/Start Bootstrap template).
- **`assets/vendor/`** — Vendored third-party libraries: Bootstrap 4, jQuery, jQuery Easing, Magnific Popup, Boxicons, Typed.js, Isotope, Waypoints, AOS (animate on scroll).
- **`assets/img/`** — Images organized into `carousel/`, `projects/fullsize/`, `projects/thumbnail/`, `blogs/`.

## Development

No build step. Open `index.html` in a browser or use any local HTTP server:

```bash
python3 -m http.server 8000
```

## Key Details

- CSS uses a mix of Bootstrap 4 utility classes and custom styles. The custom CSS files override Bootstrap defaults.
- The navbar uses jQuery-based smooth scrolling and collapses on scroll (shrink effect).
- Project portfolio uses Isotope.js for filtering/layout and Magnific Popup for lightbox.
- Typed.js animates the navbar brand text with rotating descriptions.
- AOS (Animate On Scroll) is used for scroll-triggered animations throughout the page.
- Blog posts are separate HTML files in `blogs/` that share no common template — each is self-contained.
- Files with "程彦's MacBook Pro" in the name are duplicates from a macOS hostname conflict and can be ignored.
