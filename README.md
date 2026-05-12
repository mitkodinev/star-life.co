# Star Life — star-life.co

> A small astrology practice by Silva and Kamelia.
> Guidance, written in the stars.

Static landing page hosted on **GitHub Pages**. Custom domain: [star-life.co](https://star-life.co).

---

## Tech

- **HTML / CSS / vanilla JS** — no framework, no build step
- **GSAP 3.12** (loaded from CDN) for entrance animations & scroll-triggered reveals
- **Google Fonts** — Fraunces (display), Lora (body)
- **Zoom Scheduler** — embedded for free intro-call booking
- **WCAG 2.1 AA** — focus styles, semantic landmarks, skip-link, reduced-motion support, AA contrast

## Structure

```
.
├── index.html              # Main landing page
├── 404.html                # Brand-matched 404
├── CNAME                   # star-life.co — GitHub Pages custom domain
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/style.css       # All styles
│   ├── js/main.js          # Animations, mobile menu
│   └── img/                # Logo, favicon, OG image (see assets/img/README.md)
└── .github/
    └── workflows/          # (optional: Pages deploy workflow)
```

## Local development

It's a static site — open `index.html` directly, or run any static server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Visit `http://localhost:8000`.

## Deployment (GitHub Pages)

1. Push to `main` (or whichever branch is configured).
2. In repo Settings → Pages → set source to the branch and `/ (root)`.
3. Confirm `CNAME` contains `star-life.co`.
4. Configure DNS at your registrar:
   - **`A` records** pointing to GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - **`CNAME` record** for `www` pointing to `mitkodinev.github.io`
5. In GitHub Settings → Pages → tick **Enforce HTTPS** after the cert provisions (usually within minutes).

## Editing content

- **Copy**: directly in `index.html`. The brand voice is intentional — see `star-life-brand.html` for tone guidance before substantial edits.
- **Colors / typography**: change CSS variables at the top of `assets/css/style.css`.
- **Zoom Scheduler URL**: search `index.html` for `scheduler.zoom.us` to find the iframe `src`.

## Brand guidelines

Open `star-life-brand.html` in the project root to view the full brand book — colors, typography, voice, and application examples.

## Contact

- **Owners**: Silva & Kamelia
- **Web**: Dimitar (Mitko)
- **Repo**: github.com/mitkodinev/star-life.co
