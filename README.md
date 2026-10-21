# Cafe Once Upon a Time — concept website

Open this folder in VS Code. Requires Node.js.

```sh
npm install
npm run dev
```

Open http://localhost:3000. There are no package dependencies and no build step.

## Files
- `dist/index.html`: website content
- `dist/styles.css`: colours, typography, responsive layouts and animation
- `dist/script.js`: mobile navigation, reveals, photo viewer and reel loading
- `dist/assets/`: the café images, included locally
- `MEDIA-SOURCES.md`: image provenance and original reel links

You can also open dist/index.html directly for a quick local preview. Google Fonts and Facebook videos require an internet connection.

## Deploy
The finished static website is the `dist` directory. For Vercel, import the project using the Other framework preset, leave the build command empty, and set Output Directory to `dist`. No environment variables are needed.

## Features
- Full-screen logo and loading indicator on every page opening and refresh, including section links. The logo holds for 1.8 seconds after decoding, then sweeps away to reveal the site. Reduced-motion visitors see the logo without the sweeping motion.
- Replay the opening from the footer. Ordinary clicks and scrolling no longer dismiss the logo before it appears.
- Compact journal layout with a complete, uncropped market poster.
- Original vintage logo, warm paper palette and serif/typewriter typography
- Three food/drink photos and an archived market poster
- Photo lightbox with next/previous, keyboard controls and focus return
- Two Facebook reels loaded only when selected, with direct fallback links
- Mobile navigation and persistent call/directions controls
- Reduced-motion support and native smooth scrolling

This is an independent concept, clearly labelled on the page. Before using it as the café’s official website, have the café confirm its contact details, hours, current menu and media approval. The archived market poster is not an upcoming event listing. No booking form is connected.
