# Daniel Jang Personal Webpage

A multi-page personal portfolio website built with plain HTML, CSS, and JavaScript.  
It includes a redesigned home/about/projects/contact experience and a standalone calculator mini-project.

## Overview

This project showcases:
- Personal branding and intro content
- Project highlights with an interactive DJ-style project deck
- Contact and social links
- A standalone calculator page built as an earlier project

The site is organized as static files, so no build step is required.

## Project Structure

```text
Webpage/
├─ html/
│  ├─ index.html
│  ├─ about.html
│  ├─ projects.html
│  ├─ contact.html
│  ├─ Calculator.html
│  └─ XXWebpage-Beta.html
├─ css/
│  ├─ Webpage_Home.css
│  ├─ Calculator_Styles.css
│  └─ XXWebpage-Beta.css
└─ js/
   ├─ Webpage_Main.js
   ├─ Webpage_About.js
   └─ Calculator.js
```

## Features

- Responsive multi-page portfolio layout
- Light/dark theme behavior with browser preference + `localStorage`
- Interactive projects section with rotatable deck controls
- Typewriter and reveal-style UI effects
- Embedded social/profile links
- Calculator app with basic arithmetic and expression handling

## Running Locally

Nav links use clean URLs (`about`, not `about.html`), the same way GitHub Pages serves them. Use a server that maps `/about` to `about.html`; opening the files directly or using `python -m http.server` will 404 on nav links.

From the top-level `docs/` folder:

```powershell
npx serve .
```

Then visit [http://localhost:3000/](http://localhost:3000/).

## Main Pages

| Page | Live URL | File |
| --- | --- | --- |
| Home | `/` | `index.html` |
| About | `/about` | `about.html` |
| Projects | `/projects` | `projects.html` |
| Contact | `/contact` | `contact.html` |
| Calculator | `/Calculator` | `Calculator.html` |

The old `Webpage_About.html`, `Webpage_Projects.html`, and `Webpage_Contact.html` addresses in `docs/` forward to the new URLs so existing links keep working.

## Notes

- Some assets referenced by the HTML (for example logos, resume PDF, and images) are expected to exist in sibling folders such as `images/` and `docs/`.
- Google Fonts and some external links require internet access.

## GitHub Pages Update Workflow

GitHub Pages for `dj-jang197.github.io` is served from the top-level `docs/` folder (not `Webpage/`).

If you edit files under `Webpage/`, mirror those same edits into matching files under top-level `docs/`, then run:

```powershell
git add docs/
git status
git commit -m "Update GitHub Pages site content"
git push origin main
```

Verify your latest commit includes `docs/*` changes:

```powershell
git log --oneline -1
git show --name-only --oneline HEAD
```

After pushing, wait 30-90 seconds and hard refresh (`Ctrl+F5`) on [https://dj-jang197.github.io/](https://dj-jang197.github.io/).

## Author

Daniel Jang  
GitHub: [DJ-jang197](https://github.com/DJ-jang197)

