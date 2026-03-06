# Cosmic Time Machine

An immersive 3D web experience that takes you on a journey through 13.8 billion years of cosmic history, from the Big Bang to the heat death of the universe.

## Live Demo

https://khanaaaaaa.github.io/Cosmic-Time-Machine/

## Features

### Interactive Timeline
Scroll through the entire history of the universe across 20 major cosmic events:
- **The Big Bang** - Universe begins with explosive particle animation
- **Cosmic Inflation** - Rapid expansion of spacetime
- **First Light** - Cosmic microwave background forms
- **First Stars** - Population III stars ignite
- **Galaxy Formation** - Dwarf galaxies emerge
- **Galaxy Collisions** - Animated merging galaxies
- **Milky Way Formation** - Our home galaxy takes shape
- **Solar System Birth** - Sun and planets form
- **Present Day** - Realistic solar system with orbital mechanics
- **Future Events** - Sun's death, heat death of universe

### Realistic Solar System
At Present Day (60% scroll), experience our solar system with:
- **Accurate planet textures** - Procedurally generated surfaces
  - Earth: Blue oceans with green continents and polar ice
  - Mars: Red rocky surface with impact craters
  - Jupiter & Saturn: Turbulent atmospheric bands
  - Venus: Dense cloud layers
  - Uranus & Neptune: Icy surfaces with frost patterns
- **Orbital animation** - Planets orbit the sun at realistic relative speeds
- **Glowing sun** - Corona effect with layered glow
- **Interactive** - Click planets to view information

### Dynamic Universe Simulation
- **Procedural star generation** - Stars appear and disappear based on cosmic era
- **Spiral galaxies** - Particle-based galaxies with realistic structure
- **Galaxy collision animation** - Two galaxies merge at -10B years
- **Smooth transitions** - Gradual changes between cosmic eras

### Event Markers
Click glowing markers on the right to jump instantly to:
- Big Bang
- First Stars
- Milky Way Formation
- Solar System Birth
- Present Day
- Heat Death

### Exoplanet Exploration
Click on exoplanets to stand on their surface and experience:
- **Kepler-452b** - Earth-like world with 1.6g gravity
- **HD 189733b** - Blue gas giant with 1.15g gravity
- **TRAPPIST-1e** - Red dwarf system with 0.93g gravity
- Unique sky colors and star brightness for each world

### Audio Experience
Ambient sound that gradually fades as entropy increases, representing the silence of the universe's end.

### NASA Integration
Real-time data from NASA's Astronomy Picture of the Day API displays alongside the timeline.

## Technologies

- **Three.js** - 3D rendering and WebGL
- **JavaScript ES6+** - Modern async/await, arrow functions
- **Canvas API** - Procedural texture generation
- **NASA APOD API** - Live astronomical data
- **Web Audio API** - Dynamic sound design
- **CSS3** - Glassmorphism effects, animations

## Installation

```bash
git clone https://github.com/khanaaaaaa/Cosmic-Time-Machine.git
cd Cosmic-Time-Machine
```

Open `index.html` in a modern web browser. No build process or dependencies required.

## Usage

- **Scroll** to travel through time
- **Click event markers** to jump to specific cosmic events
- **Click planets** to stand on their surface
- **Click anywhere in planet mode** to return to space view
- **Press Escape** to exit planet mode

## Performance

- Optimized particle counts (5000 Big Bang, 1000 stars, 1000 galaxy particles)
- Adaptive pixel ratio (max 2x)
- Efficient geometry reuse
- Smooth 60fps on modern hardware

## Browser Support

Requires WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Scientific Accuracy

Timeline based on current cosmological models:
- Big Bang: 13.8 billion years ago
- First stars: 13 billion years ago
- Milky Way formation: 6 billion years ago
- Solar system: 4.6 billion years ago
- Heat death: 10^7 trillion years in the future

## License

MIT License

## Credits

Created as an educational visualization of cosmic history.

Astronomical data sourced from:
- NASA
- ESA
- Scientific literature on cosmology and exoplanets

## Contributing

Feel free to open issues or submit pull requests for improvements.

## Acknowledgments

- Three.js community for excellent 3D library
- NASA for public API access
- Scientific community for cosmological research
