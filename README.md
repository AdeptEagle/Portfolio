# Cabardo Portfolio

Open `index.html` (or upload the whole folder to your host, keeping the structure).

## Structure
- `index.html`         page markup
- `css/styles.css`     styles
- `js/main.js`         behavior (sidebar, theme, filters, PDF popup, screenshot walkthrough popup)
- `assets/images/`     profile photos
- `assets/docs/`       resume (Cabardo_CV.pdf)
- `labs/activity-N-name/`  one folder per lab (PDF + thumb.png, or screenshots + thumb.png)

## Adding a PDF lab activity
1. Create `labs/activity-6-your-topic/` with `activity-6.pdf` and `thumb.png`
   (thumb = first page of the PDF as an image).
2. In `index.html`, copy a PDF card (e.g. Activity 4) inside the Cybersecurity Labs
   grid and change the title, text, `data-pdf`, `data-title` and `<img src>`.

## Adding a screenshot walkthrough activity (like Activity 5)
1. Put the screenshots and a `thumb.png` in `labs/activity-N-name/`.
2. Copy the Activity 5 card, change `data-gallery` to a new id (e.g. `gallery-foo`).
3. Copy the `<template id="gallery-cowrie">` block, rename its id to match, and edit
   the steps (title, image path, caption).
No JavaScript changes are needed for either type.
