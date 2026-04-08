let scene, camera, renderer, nebula;
let audioContext, oscillator, gainNode;
let stars = [], galaxies = [];
let targetStarCount = 0, targetGalaxyCount = 0;
let currentStarCount = 0, currentGalaxyCount = 0;
let nasaData = null;
let planets = [];
let solarSystem = null;
let planetMode = false;
let currentPlanet = null;
let bigBangParticles = null;
let bigBangActive = false;
let explosionTime = 0;
let collidingGalaxies = [];
let collisionActive = false;
let sliderDragging = false;

const planetData = [
    { name: "Kepler-452b", radius: 25, color: 0x44ff88, gravity: 1.6, skyColor: 0x66ddaa, starBrightness: 1.1, distance: 350, appearTime: -6 },
    { name: "HD 189733b", radius: 22, color: 0x0044ff, gravity: 1.15, skyColor: 0x001144, starBrightness: 0.8, distance: 450, appearTime: -8 },
    { name: "TRAPPIST-1e", radius: 17, color: 0xff6644, gravity: 0.93, skyColor: 0x442211, starBrightness: 0.05, distance: 550, appearTime: -10 }
];

const timeline = [
    { scroll: 0,    time: -13.8,     title: "The Big Bang",           desc: "Universe begins at infinite density and temperature", starCount: 0,    galaxyCount: 0  },
    { scroll: 0.05, time: -13.7,     title: "Inflation",              desc: "Universe expands faster than light",                 starCount: 0,    galaxyCount: 0  },
    { scroll: 0.1,  time: -13.5,     title: "First Light",            desc: "Photons decouple, cosmic microwave background forms",starCount: 300,  galaxyCount: 0  },
    { scroll: 0.15, time: -13.2,     title: "Dark Ages",              desc: "No stars yet, only hydrogen and helium",             starCount: 0,    galaxyCount: 0  },
    { scroll: 0.2,  time: -13,       title: "First Stars",            desc: "Population III stars ignite",                       starCount: 500,  galaxyCount: 0  },
    { scroll: 0.25, time: -12,       title: "First Galaxies",         desc: "Gravity pulls matter into dwarf galaxies",           starCount: 1000, galaxyCount: 2  },
    { scroll: 0.3,  time: -11,       title: "Quasar Era",             desc: "Supermassive black holes power bright objects",      starCount: 1500, galaxyCount: 4  },
    { scroll: 0.35, time: -10,       title: "Galaxy Collisions",      desc: "Galaxies merge to form larger structures",           starCount: 2000, galaxyCount: 6  },
    { scroll: 0.4,  time: -8,        title: "Peak Star Formation",    desc: "Universe creates stars at maximum rate",             starCount: 3000, galaxyCount: 8  },
    { scroll: 0.45, time: -6,        title: "Milky Way Forms",        desc: "Our galaxy takes shape",                            starCount: 3500, galaxyCount: 10 },
    { scroll: 0.5,  time: -4.6,      title: "Solar System Birth",     desc: "Sun and planets form",                              starCount: 4000, galaxyCount: 12 },
    { scroll: 0.55, time: -2,        title: "Early Solar System",     desc: "Planets stabilize in their orbits",                 starCount: 4500, galaxyCount: 13 },
    { scroll: 0.6,  time: 0,         title: "Present Day",            desc: "You are here",                                      starCount: 5000, galaxyCount: 15 },
    { scroll: 0.65, time: 1,         title: "Andromeda Collision",    desc: "Milky Way merges with Andromeda",                   starCount: 5500, galaxyCount: 14 },
    { scroll: 0.7,  time: 5,         title: "Red Giant Sun",          desc: "Sun expands",                                       starCount: 5000, galaxyCount: 13 },
    { scroll: 0.75, time: 8,         title: "White Dwarf Sun",        desc: "Sun sheds outer layers",                            starCount: 4000, galaxyCount: 11 },
    { scroll: 0.8,  time: 20,        title: "Star Formation Slows",   desc: "Gas clouds deplete",                                starCount: 3000, galaxyCount: 9  },
    { scroll: 0.85, time: 100,       title: "Stelliferous Era Ends",  desc: "Last stars form",                                   starCount: 1500, galaxyCount: 5  },
    { scroll: 0.9,  time: 1000,      title: "Degenerate Era",         desc: "Only dead stars remain",                            starCount: 500,  galaxyCount: 2  },
    { scroll: 0.95, time: 100000,    title: "Black Hole Era",         desc: "Black holes dominate",                              starCount: 100,  galaxyCount: 1  },
    { scroll: 1,    time: 10000000,  title: "Heat Death",             desc: "Maximum entropy",                                   starCount: 0,    galaxyCount: 0  }
];
