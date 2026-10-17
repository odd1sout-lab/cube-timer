# Cube Timer

A simple speedcubing timer for desktop and mobile. It has a clean dark interface and keeps the usual timer flow you expect from a physical cube timer.

## How to use

**Desktop**
1. Hold **Space** until the digits turn red, then green.
2. Release Space to start the timer.
3. Press Space (or any key) to stop.

**Phone / tablet**
1. Touch and hold the screen. In two-finger mode, use two fingers.
2. Wait for the display to turn green, then release to start.
3. Touch the screen to stop.

You can switch between one-finger and two-finger modes in **Settings**.

## Features

- Release to start, press to stop
- One-finger and two-finger touch modes
- Adjustable start delay from 0 to 1000 ms
- 3×3 scramble generator with a refresh button
- +2 and DNF penalties, plus individual solve deletion
- Stats for best, ao5, ao12, ao100, and mean
- Solves saved in the browser
- Multiple backgrounds, including custom images, dimming, and blur
- Hundredths or thousandths display, with an option to hide the timer while solving
- Vibration feedback on mobile

## Run locally

Requires [Node.js](https://nodejs.org) version 18 or newer. Install the LTS version, then restart your terminal or VS Code.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal (usually http://localhost:5173).
To test it on your phone, connect to the same Wi-Fi network and open the **Network** address shown in the terminal (for example, `http://192.168.1.10:5173`).

## Build for deployment

```bash
npm run build
```

This creates a production build in the `dist` folder, ready to deploy to Netlify, Vercel, GitHub Pages, or another host.

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

You can upload an image in Settings, and it will be saved in your browser.

To bundle a background into the project:

1. Put a JPG, PNG, WebP, or SVG file in `src/assets/backgrounds/`.
2. Import it in `src/config/backgrounds.js` and add an entry to the `BACKGROUNDS` array.
3. Set its `id` in `DEFAULT_BACKGROUND` to make it the default.

The built-in backgrounds are SVG illustrations, so they stay lightweight and sharp at any screen size.
