let scene, camera, renderer, stars = [], galaxies = [], nebula;
let audioContext, oscillator, gainNode;
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

const solarSystemData = [
    { name: "Sun", radius: 25, color: 0xfdb813, distance: 0, speed: 0, info: "G-type star" },
    { name: "Mercury", radius: 3, color: 0x8c7853, distance: 45, speed: 0.04, info: "Smallest planet", texture: 'rocky' },
    { name: "Venus", radius: 7, color: 0xe8cda2, distance: 60, speed: 0.015, info: "Hottest planet", texture: 'cloudy' },
    { name: "Earth", radius: 8, color: 0x2233ff, distance: 75, speed: 0.01, info: "Home", texture: 'earth' },
    { name: "Mars", radius: 5, color: 0xcd5c5c, distance: 90, speed: 0.008, info: "Red planet", texture: 'rocky' },
    { name: "Jupiter", radius: 16, color: 0xc88b3a, distance: 120, speed: 0.002, info: "Gas giant", texture: 'bands' },
    { name: "Saturn", radius: 14, color: 0xfad5a5, distance: 150, speed: 0.0009, info: "Ringed planet", texture: 'bands' },
    { name: "Uranus", radius: 11, color: 0x4fd0e7, distance: 175, speed: 0.0004, info: "Ice giant", texture: 'ice' },
    { name: "Neptune", radius: 11, color: 0x4166f5, distance: 195, speed: 0.0001, info: "Windiest planet", texture: 'ice' }
];

const planetData = [
    { name: "Kepler-452b", radius: 25, color: 0x44ff88, gravity: 1.6, skyColor: 0x66ddaa, starBrightness: 1.1, distance: 350, appearTime: -6 },
    { name: "HD 189733b", radius: 22, color: 0x0044ff, gravity: 1.15, skyColor: 0x001144, starBrightness: 0.8, distance: 450, appearTime: -8 },
    { name: "TRAPPIST-1e", radius: 17, color: 0xff6644, gravity: 0.93, skyColor: 0x442211, starBrightness: 0.05, distance: 550, appearTime: -10 }
];

const timeline = [
    { scroll: 0, time: -13.8, title: "The Big Bang", desc: "Universe begins at infinite density and temperature", starCount: 0, galaxyCount: 0 },
    { scroll: 0.05, time: -13.7, title: "Inflation", desc: "Universe expands faster than light", starCount: 0, galaxyCount: 0 },
    { scroll: 0.1, time: -13.5, title: "First Light", desc: "Photons decouple, cosmic microwave background forms", starCount: 300, galaxyCount: 0 },
    { scroll: 0.15, time: -13.2, title: "Dark Ages", desc: "No stars yet, only hydrogen and helium", starCount: 0, galaxyCount: 0 },
    { scroll: 0.2, time: -13, title: "First Stars", desc: "Population III stars ignite", starCount: 500, galaxyCount: 0 },
    { scroll: 0.25, time: -12, title: "First Galaxies", desc: "Gravity pulls matter into dwarf galaxies", starCount: 1000, galaxyCount: 2 },
    { scroll: 0.3, time: -11, title: "Quasar Era", desc: "Supermassive black holes power bright objects", starCount: 1500, galaxyCount: 4 },
    { scroll: 0.35, time: -10, title: "Galaxy Collisions", desc: "Galaxies merge to form larger structures", starCount: 2000, galaxyCount: 6 },
    { scroll: 0.4, time: -8, title: "Peak Star Formation", desc: "Universe creates stars at maximum rate", starCount: 3000, galaxyCount: 8 },
    { scroll: 0.45, time: -6, title: "Milky Way Forms", desc: "Our galaxy takes shape", starCount: 3500, galaxyCount: 10 },
    { scroll: 0.5, time: -4.6, title: "Solar System Birth", desc: "Sun and planets form", starCount: 4000, galaxyCount: 12 },
    { scroll: 0.55, time: -2, title: "Early Solar System", desc: "Planets stabilize in their orbits", starCount: 4500, galaxyCount: 13 },
    { scroll: 0.6, time: 0, title: "Present Day", desc: "You are here", starCount: 5000, galaxyCount: 15 },
    { scroll: 0.65, time: 1, title: "Andromeda Collision", desc: "Milky Way merges with Andromeda", starCount: 5500, galaxyCount: 14 },
    { scroll: 0.7, time: 5, title: "Red Giant Sun", desc: "Sun expands", starCount: 5000, galaxyCount: 13 },
    { scroll: 0.75, time: 8, title: "White Dwarf Sun", desc: "Sun sheds outer layers", starCount: 4000, galaxyCount: 11 },
    { scroll: 0.8, time: 20, title: "Star Formation Slows", desc: "Gas clouds deplete", starCount: 3000, galaxyCount: 9 },
    { scroll: 0.85, time: 100, title: "Stelliferous Era Ends", desc: "Last stars form", starCount: 1500, galaxyCount: 5 },
    { scroll: 0.9, time: 1000, title: "Degenerate Era", desc: "Only dead stars remain", starCount: 500, galaxyCount: 2 },
    { scroll: 0.95, time: 100000, title: "Black Hole Era", desc: "Black holes dominate", starCount: 100, galaxyCount: 1 },
    { scroll: 1, time: 10000000, title: "Heat Death", desc: "Maximum entropy", starCount: 0, galaxyCount: 0 }
];

async function fetchNASAData() {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=5');
        nasaData = await response.json();
    } catch (error) {
        console.log('NASA API unavailable');
    }
}

function setupEventMarkers() {
    const markers = document.querySelectorAll('.event-marker');
    if (markers.length === 0) return;
    
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const targetScroll = parseFloat(marker.dataset.scroll);
            window.scrollTo({
                top: targetScroll * (document.body.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        });
    });
}

function createCollidingGalaxies() {
    const gal1 = createGalaxy(0x6688ff);
    gal1.position.set(-300, 0, -200);
    gal1.userData = { vx: 2, vy: 0, vz: 0, initialX: -300 };
    
    const gal2 = createGalaxy(0xff6688);
    gal2.position.set(300, 0, -200);
    gal2.userData = { vx: -2, vy: 0, vz: 0, initialX: 300 };
    
    gal1.visible = false;
    gal2.visible = false;
    
    scene.add(gal1);
    scene.add(gal2);
    
    collidingGalaxies = [gal1, gal2];
}

function createGalaxy(color) {
    const geo = new THREE.BufferGeometry();
    const pos = [], col = [];
    
    for (let j = 0; j < 1500; j++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.7) * 100;
        const height = (Math.random() - 0.5) * 10;
        
        pos.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
        
        const c = new THREE.Color(color);
        col.push(c.r, c.g, c.b);
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ 
        size: 2.5, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geo, mat);
}

function updateCollision() {
    if (!collisionActive || collidingGalaxies.length === 0) return;
    
    collidingGalaxies.forEach(gal => {
        gal.position.x += gal.userData.vx;
        gal.position.y += gal.userData.vy;
        gal.position.z += gal.userData.vz;
        gal.rotation.z += 0.005;
    });
    
    const dist = collidingGalaxies[0].position.distanceTo(collidingGalaxies[1].position);
    if (dist < 50) {
        collidingGalaxies.forEach(gal => {
            gal.userData.vx *= 0.95;
            gal.userData.vy += (Math.random() - 0.5) * 0.5;
        });
    }
    
    if (Math.abs(collidingGalaxies[0].position.x) > 400) {
        collidingGalaxies[0].position.x = collidingGalaxies[0].userData.initialX;
        collidingGalaxies[1].position.x = collidingGalaxies[1].userData.initialX;
        collidingGalaxies[0].userData.vx = 2;
        collidingGalaxies[1].userData.vx = -2;
        collidingGalaxies[0].userData.vy = 0;
        collidingGalaxies[1].userData.vy = 0;
    }
}

function createPlanetTexture(type, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (type === 'earth') {
        ctx.fillStyle = '#0a2f5f';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.fillStyle = '#1a5f3a';
        for (let i = 0; i < 150; i++) {
            ctx.globalAlpha = 0.8 + Math.random() * 0.2;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 100 + 40, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 60; i++) {
            ctx.fillRect(Math.random() * 1024, Math.random() * 300, Math.random() * 80, Math.random() * 40);
        }
        ctx.globalAlpha = 1;
    } else if (type === 'rocky') {
        const c = new THREE.Color(color);
        const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        grad.addColorStop(0, `rgb(${c.r*255*1.2},${c.g*255*1.2},${c.b*255*1.2})`);
        grad.addColorStop(1, `rgb(${c.r*255*0.6},${c.g*255*0.6},${c.b*255*0.6})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 400; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 25 + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (type === 'bands') {
        const c = new THREE.Color(color);
        for (let y = 0; y < 1024; y++) {
            const wave = Math.sin(y * 0.015) * 30 + Math.sin(y * 0.04) * 15;
            const brightness = 0.7 + Math.sin(y * 0.03) * 0.3;
            const turbulence = Math.sin(y * 0.1 + wave * 0.1) * 0.1;
            ctx.fillStyle = `rgb(${c.r*255*(brightness+turbulence)},${c.g*255*(brightness+turbulence)},${c.b*255*(brightness+turbulence)})`;
            ctx.fillRect(0, y, 1024, 1);
        }
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
            ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 5 + 1);
        }
        for (let i = 0; i < 80; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
            ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 3 + 1);
        }
    } else if (type === 'ice') {
        const c = new THREE.Color(color);
        const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        grad.addColorStop(0, `rgb(${c.r*255*1.3},${c.g*255*1.3},${c.b*255*1.3})`);
        grad.addColorStop(1, `rgb(${c.r*255*0.7},${c.g*255*0.7},${c.b*255*0.7})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 30 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 0; i < 150; i++) {
            ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
            ctx.lineWidth = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
            ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
            ctx.stroke();
        }
    } else if (type === 'cloudy') {
        const c = new THREE.Color(color);
        ctx.fillStyle = `rgb(${c.r*255},${c.g*255},${c.b*255})`;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 300; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2 + 0.05})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * 1024, Math.random() * 1024, Math.random() * 80 + 40, Math.random() * 40 + 20, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(200,180,150,${Math.random() * 0.15})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * 1024, Math.random() * 1024, Math.random() * 60 + 30, Math.random() * 30 + 15, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createSolarSystem() {
    solarSystem = new THREE.Group();
    solarSystem.position.set(0, 0, 0);
    
    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(30, 64, 64),
        new THREE.MeshBasicMaterial({ 
            color: 0xfdb813,
            transparent: true,
            opacity: 1
        })
    );
    const sunGlow = new THREE.Mesh(
        new THREE.SphereGeometry(35, 32, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0xff8800,
            transparent: true,
            opacity: 0.3
        })
    );
    sun.add(sunGlow);
    sun.userData = { name: "Sun", info: "G-type star", distance: 0 };
    solarSystem.add(sun);
    
    const planetConfigs = [
        { name: "Mercury", r: 4, c: 0x8c7853, d: 80, info: "Smallest planet", type: 'rocky' },
        { name: "Venus", r: 9, c: 0xe8cda2, d: 120, info: "Hottest planet", type: 'cloudy' },
        { name: "Earth", r: 10, c: 0x2233ff, d: 160, info: "Home", type: 'earth' },
        { name: "Mars", r: 6, c: 0xcd5c5c, d: 200, info: "Red planet", type: 'rocky' },
        { name: "Jupiter", r: 22, c: 0xc88b3a, d: 280, info: "Gas giant", type: 'bands' },
        { name: "Saturn", r: 19, c: 0xfad5a5, d: 360, info: "Ringed planet", type: 'bands' },
        { name: "Uranus", r: 15, c: 0x4fd0e7, d: 430, info: "Ice giant", type: 'ice' },
        { name: "Neptune", r: 15, c: 0x4166f5, d: 490, info: "Windiest planet", type: 'ice' }
    ];
    
    planetConfigs.forEach((cfg, i) => {
        const texture = createPlanetTexture(cfg.type, cfg.c);
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.r, 64, 64),
            new THREE.MeshBasicMaterial({ map: texture })
        );
        planet.userData = { name: cfg.name, info: cfg.info, distance: cfg.d };
        planet.position.set(cfg.d, 0, 0);
        solarSystem.add(planet);
    });
    
    solarSystem.visible = false;
    scene.add(solarSystem);
}

function createPlanets() {
    planetData.forEach((data, i) => {
        const geo = new THREE.SphereGeometry(data.radius, 64, 64);
        const mat = new THREE.MeshStandardMaterial({ 
            color: data.color,
            roughness: 0.6,
            metalness: 0.2
        });
        const planet = new THREE.Mesh(geo, mat);
        
        const angle = (i / planetData.length) * Math.PI * 2;
        planet.position.set(
            Math.cos(angle) * data.distance,
            (Math.random() - 0.5) * 50,
            Math.sin(angle) * data.distance
        );
        
        planet.userData = data;
        planet.visible = false;
        scene.add(planet);
        planets.push(planet);
    });
}

function updatePlanetVisibility(currentTime) {
    planets.forEach(planet => {
        planet.visible = currentTime >= planet.userData.appearTime;
    });
}

function setupPlanetClick() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const closeBtn = document.getElementById('close-planet-info');
    if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (planetMode) {
                exitPlanetMode();
            } else {
                document.getElementById('planet-info').style.display = 'none';
            }
        });
    }
    
    renderer.domElement.addEventListener('click', (event) => {
        if (planetMode) {
            exitPlanetMode();
            return;
        }
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        if (solarSystem && solarSystem.visible) {
            const solarPlanets = solarSystem.children.filter(c => c.type === 'Mesh');
            const intersects = raycaster.intersectObjects(solarPlanets);
            if (intersects.length > 0) {
                showPlanetInfo(intersects[0].object);
                return;
            }
        }
        
        const visiblePlanets = planets.filter(p => p.visible);
        const intersects = raycaster.intersectObjects(visiblePlanets);
        if (intersects.length > 0) {
            enterPlanetMode(intersects[0].object);
        }
    });
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && planetMode) {
            exitPlanetMode();
        }
    });
}

function showPlanetInfo(planet) {
    const data = planet.userData;
    document.getElementById('planet-info').style.display = 'block';
    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-gravity').textContent = data.info;
    document.getElementById('planet-brightness').textContent = '';
    
    setTimeout(() => {
        document.getElementById('planet-info').style.display = 'none';
    }, 3000);
}

function enterPlanetMode(planet) {
    planetMode = true;
    currentPlanet = planet;
    const data = planet.userData;
    
    camera.position.set(planet.position.x, planet.position.y + data.radius + 5, planet.position.z);
    camera.lookAt(planet.position);
    
    scene.background = new THREE.Color(data.skyColor);
    
    document.getElementById('planet-info').style.display = 'block';
    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('planet-gravity').textContent = `${data.gravity}g`;
    document.getElementById('planet-brightness').textContent = `${(data.starBrightness * 100).toFixed(0)}%`;
}

function exitPlanetMode() {
    planetMode = false;
    currentPlanet = null;
    scene.background = null;
    
    const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    camera.position.set(0, 100 + scrollPercent * 50, 320 - scrollPercent * 120);
    camera.lookAt(0, 0, 0);
    
    document.getElementById('planet-info').style.display = 'none';
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 100, 320);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    addBackground();
    initAudio();
    fetchNASAData();
    setupEventMarkers();
    createSolarSystem();
    createPlanets();
    createBigBangAnimation();
    createCollidingGalaxies();
    setupPlanetClick();
    animate();

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);

    oscillator.start();
}

function addBackground() {
    const geo = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 1000; i++) {
        pos.push((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 1500);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.3 });
    nebula = new THREE.Points(geo, mat);
    scene.add(nebula);
}

function createBigBangAnimation() {
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(0, 0, 0);

        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3, 1.0, 0.5 + Math.random() * 0.5);
        colors.push(color.r, color.g, color.b);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 50 + Math.random() * 150;

        velocities.push(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    bigBangParticles = new THREE.Points(geometry, material);
    bigBangParticles.visible = false;
    scene.add(bigBangParticles);
}

function triggerBigBang() {
    if (!bigBangParticles) return;

    bigBangActive = true;
    explosionTime = 0;
    bigBangParticles.visible = true;

    const positions = bigBangParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i++) {
        positions[i] = 0;
    }
    bigBangParticles.geometry.attributes.position.needsUpdate = true;

    scene.background = new THREE.Color(0xffffff);
    setTimeout(() => {
        scene.background = null;
    }, 100);
}

function updateBigBang(delta) {
    if (!bigBangActive || !bigBangParticles) return;

    explosionTime += delta;

    const positions = bigBangParticles.geometry.attributes.position.array;
    const velocities = bigBangParticles.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * delta;
        positions[i + 1] += velocities[i + 1] * delta;
        positions[i + 2] += velocities[i + 2] * delta;
    }

    bigBangParticles.geometry.attributes.position.needsUpdate = true;

    const opacity = Math.max(0, 1 - explosionTime / 3);
    bigBangParticles.material.opacity = opacity;

    if (explosionTime > 3) {
        bigBangActive = false;
        bigBangParticles.visible = false;
    }
}

function updateStars() {
    const diff = targetStarCount - currentStarCount;
    if (Math.abs(diff) < 1) return;

    currentStarCount += diff * 0.1;
    const needed = Math.round(currentStarCount);

    while (stars.length < needed) {
        const size = Math.random() * 1.5 + 0.5;
        const geo = new THREE.SphereGeometry(size, 6, 6);
        const hue = Math.random() < 0.3 ? 0.08 : 0.58;
        const mat = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(hue, 0.9, 0.8)
        });
        const star = new THREE.Mesh(geo, mat);
        star.position.set((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 1000);
        
        scene.add(star);
        stars.push(star);
    }

    while (stars.length > needed) {
        const star = stars.pop();
        scene.remove(star);
    }
}

function updateGalaxies() {
    const diff = targetGalaxyCount - currentGalaxyCount;
    if (Math.abs(diff) < 0.1) return;

    currentGalaxyCount += diff * 0.08;
    const needed = Math.round(currentGalaxyCount);

    while (galaxies.length < needed) {
        const geo = new THREE.BufferGeometry();
        const pos = [], col = [];

        for (let j = 0; j < 1000; j++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.pow(Math.random(), 0.7) * 120;
            const height = (Math.random() - 0.5) * 15;
            
            pos.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
            
            const distFactor = 1 - (radius / 120);
            const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.9, 0.4 + distFactor * 0.4);
            col.push(color.r, color.g, color.b);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({ 
            size: 2, 
            vertexColors: true, 
            transparent: true, 
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const gal = new THREE.Points(geo, mat);
        gal.position.set((Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 800);
        scene.add(gal);
        galaxies.push(gal);
    }

    while (galaxies.length > needed) {
        const gal = galaxies.pop();
        scene.remove(gal);
    }
}

function onScroll() {
    if (planetMode) return;
    
    const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    console.log('Scroll:', scrollPercent);

    if (scrollPercent < 0.02 && !bigBangActive && bigBangParticles) {
        triggerBigBang();
    }

    let era = timeline[0];
    for (let i = 0; i < timeline.length; i++) {
        if (scrollPercent >= timeline[i].scroll) era = timeline[i];
    }
    
    const isCollisionEra = era.time === -10;
    if (isCollisionEra) {
        collisionActive = true;
        collidingGalaxies.forEach(g => g.visible = true);
        document.getElementById('timeline-info').classList.add('hidden');
        document.getElementById('audio-indicator').classList.add('hidden');
        document.getElementById('scroll-hint').classList.add('hidden');
    } else {
        collisionActive = false;
        collidingGalaxies.forEach(g => g.visible = false);
        document.getElementById('timeline-info').classList.remove('hidden');
        document.getElementById('audio-indicator').classList.remove('hidden');
        document.getElementById('scroll-hint').classList.remove('hidden');
    }

    document.getElementById('era-title').textContent = era.title;
    document.getElementById('era-description').textContent = era.desc;
    document.getElementById('time-label').textContent = era.time < 0 
        ? `${Math.abs(era.time)}B years ago` 
        : era.time === 0 ? 'Now' 
        : era.time >= 1000 ? `+${(era.time / 1000).toFixed(0)}T years` 
        : `+${era.time}B years`;

    if (nasaData && document.getElementById('nasa-fact')) {
        const factIndex = Math.floor(scrollPercent * (nasaData.length - 1));
        document.getElementById('nasa-fact').textContent = nasaData[factIndex]?.title || '';
    }

    targetStarCount = era.starCount;
    targetGalaxyCount = era.galaxyCount;
    
    updatePlanetVisibility(era.time);
    
    if (solarSystem) {
        solarSystem.visible = era.time === 0;
        if (era.time === 0) {
            console.log('SOLAR VISIBLE', solarSystem.position, camera.position);
        }
    }

    const vol = Math.max(0, 1 - scrollPercent);
    gainNode.gain.linearRampToValueAtTime(vol * 0.05, audioContext.currentTime + 0.1);
    document.getElementById('volume-level').textContent = Math.round(vol * 100) + '%';

    camera.position.set(0, 100 + scrollPercent * 50, 320 - scrollPercent * 120);
    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);

    updateStars();
    updateGalaxies();

    const t = Date.now() * 0.0001;

    nebula.rotation.y += 0.0001;

    stars.forEach((s) => {
        s.rotation.y += 0.002;
    });

    galaxies.forEach((g) => {
        g.rotation.z += 0.002;
    });

    planets.forEach((p) => {
        if (!planetMode && p.visible) {
            p.rotation.y += 0.01;
        }
    });

    if (solarSystem && solarSystem.visible) {
        solarSystem.rotation.y += 0.003;
        solarSystem.children.forEach((child, i) => {
            if (i > 0) {
                const angle = t * (0.5 / i);
                const dist = child.userData.distance || (80 + i * 50);
                child.position.x = Math.cos(angle) * dist;
                child.position.z = Math.sin(angle) * dist;
                child.rotation.y += 0.01;
            }
        });
    }

    updateBigBang(0.016);
    updateCollision();

    renderer.render(scene, camera);
}

init();
