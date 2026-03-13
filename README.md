# Cosmic Time Machine

Travel through 13.8 billion years of cosmic history in your browser. Watch the universe unfold from the Big Bang to its eventual heat death.

## Live Demo

https://khanaaaaaa.github.io/Cosmic-Time-Machine/

## What You'll See

Just scroll. The timeline moves through 20 major cosmic events:

- **Big Bang** - Explosive particle animation kicks things off
- **Cosmic Inflation** - Space expands faster than light
- **First Light** - The cosmic microwave background appears
- **First Stars** - Population III stars ignite across the void
- **Galaxy Formation** - Gravity pulls matter into dwarf galaxies
- **Galaxy Collisions** - Watch two galaxies merge in real-time
- **Milky Way Forms** - Our home galaxy takes shape
- **Solar System Birth** - The sun and planets form from a dust cloud
- **Present Day** - Our solar system as it is right now, with orbiting planets
- **The Future** - Sun's death, Andromeda collision, and the eventual heat death

## Solar System (60% scroll)

When you hit Present Day, you'll see:
- All 8 planets with procedurally generated textures
- Earth with oceans and continents
- Gas giants with turbulent atmospheric bands
- Rocky planets covered in craters
- Saturn's rings
- Asteroid belt between Mars and Jupiter
- A comet orbiting through the system
- Everything orbits at different speeds (closer = faster)
- Click any planet to see its info

## Other Cool Stuff

**Shooting Stars** - Random meteors streak across the sky

**Nebula Clouds** - Colorful gas clouds scattered throughout space

**Black Hole** - Shows up at the Black Hole Era (95% scroll) with an accretion disk

**Supernova** - Exploding star at the Red Giant Sun phase

**Exoplanets** - Click on Kepler-452b, HD 189733b, or TRAPPIST-1e to stand on their surface and see what the sky looks like from there

**Event Markers** - Click the glowing dots on the right to jump to major events

**Audio** - Ambient sound that fades as entropy increases

**NASA Data** - Real-time astronomy facts from NASA's API

## Tech Stack

- Three.js for 3D rendering
- Vanilla JavaScript
- Canvas API for planet textures
- NASA APOD API
- Web Audio API
- CSS3

## Setup

```bash
git clone https://github.com/khanaaaaaa/Cosmic-Time-Machine.git
cd Cosmic-Time-Machine
```

Open `index.html` in your browser. That's it.

## Controls

- **Scroll** = time travel
- **Click markers** = jump to events
- **Click planets** = surface view
- **Escape** = exit planet mode

## Performance

Runs at 60fps on most modern hardware. Particle counts are optimized (5000 for Big Bang, 1000 for stars/galaxies). Pixel ratio capped at 2x.

## Browser Requirements

Needs WebGL:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Scientific Accuracy

Timeline follows current cosmological models:
- Big Bang: 13.8 billion years ago
- First stars: 13 billion years ago
- Milky Way: 6 billion years ago
- Solar system: 4.6 billion years ago
- Heat death: 10^7 trillion years from now

## License

MIT

## Credits

Built as an educational visualization. Astronomical data from NASA, ESA, and cosmology research papers.

## Contributing

Issues and PRs welcome.
