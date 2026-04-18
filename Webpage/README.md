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
│  ├─ Webpage_About.html
│  ├─ Webpage_Projects.html
│  ├─ Webpage_Contact.html
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

### Option 1: Open directly
1. Open `html/index.html` in your browser.

### Option 2: Serve from a local web server (recommended)
From the project root:

```powershell
python -m http.server 8000
```

Then visit:
- [http://localhost:8000/html/index.html](http://localhost:8000/html/index.html)

## Main Pages

- Home: `html/index.html`
- About: `html/Webpage_About.html`
- Projects: `html/Webpage_Projects.html`
- Contact: `html/Webpage_Contact.html`
- Calculator: `html/Calculator.html`

## Notes

- Some assets referenced by the HTML (for example logos, resume PDF, and images) are expected to exist in sibling folders such as `images/` and `docs/`.
- Google Fonts and some external links require internet access.

## Author

Daniel Jang  
GitHub: [DJ-jang197](https://github.com/DJ-jang197)

