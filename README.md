# Cosmic Time Machine

## What is it?

Cosmic Time Machine is an interactive 3D visualization of the entire history of the universe. I built it using simple HTMl, CSS and JS.

Live demo: https://khanaaaaaa.github.io/Cosmic-Time-Machine/

## Why I made it

I've always been fascinated by the scale of our universe and it's origin. I made this website to make people understand how vast our universe and it's history truly are.

## How I built it

- **HTML** — structure of the page
- **CSS** — all the animations
- **JavaScript** — everything else
- **Three.js** (JS library) — the 3D rendering
- **Canvas API** — painting planet textures at runtime
- **NASA APOD API** — pulls real astronomy facts and shows them alongside the timeline

## Installation

```bash
git clone https://github.com/khanaaaaaa/Cosmic-Time-Machine.git
cd Cosmic-Time-Machine
```

Open `index.html` in your browser.

## What I struggled with and what I learned

The solar system was by far the hardest part. I spent way too long trying to get 8 planets to simply appear on screen at the right scroll position. The issues ranged from camera positioning (the planets existed but were behind the camera), to material errors with Three.js (MeshStandardMaterial needs a light source, MeshBasicMaterial doesn't, learned that the hard way).


## Controls

- **Scroll** or **drag the slider** to travel through time
- **Click the dots** on the right to jump to major events

## AI Usage

- Debugging & planets rotating from ChatGPT

