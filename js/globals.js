let scene, camera, renderer, nebula;
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
    { name: "HD 189733b",  radius: 22, color: 0x0044ff, gravity: 1.15, skyColor: 0x001144, starBrightness: 0.8, distance: 450, appearTime: -8 },
    { name: "TRAPPIST-1e", radius: 17, color: 0xff6644, gravity: 0.93, skyColor: 0x442211, starBrightness: 0.05, distance: 550, appearTime: -10 }
];

const timeline = [
    { scroll: 0,     time: -13.8,      title: "The Big Bang",           desc: "Universe begins from a singularity of infinite density and temperature",  starCount: 0,    galaxyCount: 0  },
    { scroll: 0.033, time: -13.799,    title: "Quark Epoch",            desc: "Quarks, leptons and gluons fill the primordial plasma",                   starCount: 0,    galaxyCount: 0  },
    { scroll: 0.066, time: -13.798,    title: "Hadron Epoch",           desc: "Quarks bind together forming the first protons and neutrons",             starCount: 0,    galaxyCount: 0  },
    { scroll: 0.1,   time: -13.797,    title: "Nucleosynthesis",        desc: "Hydrogen and helium nuclei form in the first 3 minutes",                  starCount: 0,    galaxyCount: 0  },
    { scroll: 0.133, time: -13.7,      title: "Inflation",              desc: "Universe expands faster than light in a fraction of a second",            starCount: 0,    galaxyCount: 0  },
    { scroll: 0.166, time: -13.5,      title: "First Light",            desc: "Photons decouple — the cosmic microwave background forms",               starCount: 200,  galaxyCount: 0  },
    { scroll: 0.2,   time: -13.2,      title: "Dark Ages",              desc: "No stars yet — only hydrogen, helium and total darkness",                starCount: 0,    galaxyCount: 0  },
    { scroll: 0.233, time: -13,        title: "First Stars",            desc: "Population III stars ignite — massive, hot, and short-lived",            starCount: 500,  galaxyCount: 0  },
    { scroll: 0.266, time: -12.5,      title: "Reionization",           desc: "First stars ionize surrounding hydrogen gas, lighting up the universe",   starCount: 800,  galaxyCount: 0  },
    { scroll: 0.3,   time: -12,        title: "First Galaxies",         desc: "Gravity pulls matter into the first dwarf galaxies",                      starCount: 1000, galaxyCount: 2  },
    { scroll: 0.333, time: -11,        title: "Quasar Era",             desc: "Supermassive black holes power the brightest objects in the universe",    starCount: 1500, galaxyCount: 4  },
    { scroll: 0.366, time: -10,        title: "Galaxy Collisions",      desc: "Galaxies merge and grow through violent collisions",                      starCount: 2000, galaxyCount: 6  },
    { scroll: 0.4,   time: -9,         title: "Cosmic Web Forms",       desc: "Dark matter filaments connect galaxy clusters across vast voids",         starCount: 2500, galaxyCount: 7  },
    { scroll: 0.433, time: -8,         title: "Peak Star Formation",    desc: "Universe creates stars at the highest rate in its entire history",        starCount: 3000, galaxyCount: 8  },
    { scroll: 0.466, time: -6,         title: "Milky Way Forms",        desc: "Our galaxy assembles from merging dwarf galaxies over billions of years", starCount: 3500, galaxyCount: 10 },
    { scroll: 0.5,   time: -4.6,       title: "Solar System Birth",     desc: "A cloud of gas and dust collapses to form our Sun and planets",           starCount: 4000, galaxyCount: 12 },
    { scroll: 0.533, time: -3.8,       title: "Late Heavy Bombardment", desc: "Asteroids pummel the inner planets — Earth's oceans may form here",     starCount: 4200, galaxyCount: 12 },
    { scroll: 0.566, time: -2,         title: "Early Solar System",     desc: "Planets settle into stable orbits, the solar system matures",            starCount: 4500, galaxyCount: 13 },
    { scroll: 0.6,   time: 0,          title: "Present Day",            desc: "You are here — 13.8 billion years after the Big Bang",                   starCount: 5000, galaxyCount: 15 },
    { scroll: 0.633, time: 1,          title: "Andromeda Collision",    desc: "Milky Way and Andromeda begin their 4-billion-year merger",               starCount: 5500, galaxyCount: 14 },
    { scroll: 0.666, time: 2,          title: "Milkomeda",              desc: "The merged galaxy settles into a giant elliptical — no spiral arms left", starCount: 5000, galaxyCount: 12 },
    { scroll: 0.7,   time: 5,          title: "Red Giant Sun",          desc: "Sun swells to 200x its current size — Earth is scorched and consumed",   starCount: 4500, galaxyCount: 11 },
    { scroll: 0.733, time: 8,          title: "White Dwarf Sun",        desc: "Sun sheds its outer layers and collapses into a white dwarf",             starCount: 4000, galaxyCount: 10 },
    { scroll: 0.766, time: 20,         title: "Star Formation Slows",   desc: "Gas clouds are depleted — fewer and fewer new stars are born",           starCount: 3000, galaxyCount: 8  },
    { scroll: 0.8,   time: 100,        title: "Stelliferous Era Ends",  desc: "The last stars flicker out across the universe",                          starCount: 1500, galaxyCount: 5  },
    { scroll: 0.833, time: 1000,       title: "Degenerate Era",         desc: "Only white dwarfs, neutron stars and black holes remain",                 starCount: 500,  galaxyCount: 3  },
    { scroll: 0.866, time: 10000,      title: "Black Dwarf Era",        desc: "White dwarfs cool into cold, dark, invisible black dwarfs",               starCount: 200,  galaxyCount: 2  },
    { scroll: 0.9,   time: 100000,     title: "Black Hole Era",         desc: "Black holes are the last major structures in the universe",               starCount: 50,   galaxyCount: 1  },
    { scroll: 0.933, time: 1000000,    title: "Hawking Radiation",      desc: "Black holes slowly evaporate through quantum effects",                    starCount: 10,   galaxyCount: 0  },
    { scroll: 0.966, time: 100000000,  title: "Last Black Hole",        desc: "The final black hole evaporates into a faint flash of radiation",         starCount: 0,    galaxyCount: 0  },
    { scroll: 1,     time: 1e13,       title: "Heat Death",             desc: "Maximum entropy — no energy gradients remain, forever",                  starCount: 0,    galaxyCount: 0  }
];
