# Samya Dutta — Portfolio

## Structure
- `index.html` — page markup
- `style.css` — all styling (theme variables at the top of the file)
- `script.js` — animations, particle field, tech-stack rendering, scroll behavior
- `assets/photo.jpg` — hero headshot
- `assets/resume.pdf` — downloadable resume

## Running it
No build step needed — it's plain HTML/CSS/JS.

**Easiest:** open `index.html` directly in a browser.

**In VS Code:** install the "Live Server" extension, right-click `index.html`,
and choose "Open with Live Server" (recommended — some browsers restrict
local file access in ways that can affect the particle canvas/fonts if you
just double-click the file).

## Notes
- Fonts (Space Grotesk, Inter, JetBrains Mono) load from Google Fonts — you'll need an internet connection for them to render correctly.
- Theme colors (pure black + ice blue + coral) are defined as CSS custom properties at the top of `style.css` under `:root` — change them there to retheme the whole site.
- Tech Stack items and their "experience depth" bars are defined in the `stack` array near the top of `script.js` — edit months/labels there.
- Project GitHub/live-demo links, achievement text, and experience entries are plain HTML in `index.html` — search for the relevant section by its `id`.
