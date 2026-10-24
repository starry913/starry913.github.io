# Qiyang Li — Academic Homepage

Based on the official Minimal Light compiled HTML theme (CC0). This is a buildless, bilingual static website for GitHub Pages.

- `index.html`: English homepage.
- `zh.html`: Chinese homepage.
- `assets/css/minimal-light.css`: original theme CSS with external font requests removed.
- `assets/css/custom.css`: responsive customizations.
- `assets/img/`: original figures from the supplied research slides and avatar from the existing homepage.

## Preview

Run `python -m http.server 8765` in this folder, then visit http://localhost:8765/ . You may also open index.html directly.

## GitHub Pages

Upload these files to the intended repository. For `starry913.github.io`, the public URL is https://starry913.github.io/ . Enable Pages with Deploy from a branch, the intended branch, and /(root). The .nojekyll file bypasses Jekyll; no Ruby installation is needed.

The academic homepage replaces the previous lifestyle website. The previous version remains recoverable in Git history; an additional source archive is kept locally outside this repository.

## Updating

Edit both index.html and zh.html when changing facts. Keep review statuses explicit. Do not add acceptance claims, paper links, supervisors, or organizations without verified information.

The site retains the upstream LICENSE-Minimal-Light notice. Project figures and personal materials retain their original rights.
