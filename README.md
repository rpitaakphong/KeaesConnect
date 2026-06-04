# KeaesX Employee Portal

Static employee portal for Keaes internal tools. Designed for SiteGround deployment at `www.keaesx.com`.

## Structure

```text
index.html
login.html
dashboard.html

assets/
  css/
    base.css
    portal.css
  js/
    portal.js

tools/
  hours-cross-check/
    index.html
    styles.css
    app.js
    README.md
```

## Run Locally

Open `index.html` in a browser.

For a local server:

```bash
cd "/Users/pitaakphong/Documents/New project"
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Prototype Login

The login is a static prototype gate. It accepts any non-empty email and password, stores an employee session in `sessionStorage`, and protects `dashboard.html` visually.

This is not real authentication. Add server-side or hosted identity authentication before using private employee accounts.

## Current Tool

The first available tool is:

```text
tools/hours-cross-check/
```

It processes Teach and Go and class-list files locally in the browser. Files are not uploaded to a server.

## Deploy to SiteGround

Upload the deploy zip contents into `public_html` so `index.html` sits directly inside `public_html`.
