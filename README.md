# Cube Timer

A speedcubing timer built with React and Vite. It features a modern dark interface and works on desktop and mobile.

## How to use

**Desktop**
1. Hold **Space** until the digits turn red and then green.
2. Release Space to start the timer.
3. Press Space (or any other key) to stop.

**Phone / tablet**
1. Touch and hold the screen (in two-finger mode, use two fingers).
2. Wait for the display to turn green, then release to start.
3. Touch the screen to stop.

Switch between one-finger and two-finger modes in **Settings**.

## Features

- Release to start, press to stop, just like a physical speedcubing timer
- Two touch modes: one finger or two fingers
- Adjustable start delay (0–1000 ms)
- 3×3 scramble generator with a refresh button
- +2 and DNF penalties; delete individual solves
- Statistics: best, ao5, ao12, ao100, and mean
- Solve history saved in your browser
- Backgrounds: five built-in options, custom images, dimming, and blur
- Hundredths or thousandths display; option to hide the timer while solving
- Mobile vibration feedback

## Run locally

Requires [Node.js](https://nodejs.org) version 18 or newer. Download the LTS version and restart your terminal or VS Code after installation.

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).
To test on your phone, connect it to the same Wi-Fi network and open the **Network** address shown in the terminal (for example, `http://192.168.1.10:5173`).

## Build for deployment

```bash
npm run build
```

The production site will be generated in the `dist` folder. You can deploy it to Netlify, Vercel, GitHub Pages, or another hosting provider.

Preview the production build with `npm run preview`.

## Project structure

```text
cube-timer/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── hooks/
    │   ├── useCubeTimer.js
    │   ├── useSettings.js
    │   └── useLocalStorage.js
    ├── components/
    ├── utils/
    ├── config/backgrounds.js
    └── assets/backgrounds/
```

## Set a custom default background

You can upload an image in Settings; it will be saved in your browser.

To bundle a background into the project:

1. Put a JPG, PNG, WebP, or SVG file in `src/assets/backgrounds/`.
2. Import it in `src/config/backgrounds.js` and add an entry to the `BACKGROUNDS` array.
3. Set its `id` in `DEFAULT_BACKGROUND` to make it the default.

The built-in backgrounds are SVG illustrations, so they are lightweight and stay sharp at any screen size.
