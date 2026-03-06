let scene, camera, renderer, stars = [], galaxies = [], nebula;
let audioContext, oscillator, gainNode;
let targetStarCount = 0, targetGalaxyCount = 0;
let currentStarCount = 0, currentGalaxyCount = 0;
let nasaData = null;

const timeline = [
    { scroll: 0, time: -13.8, title: "The Big Bang", desc: "Universe begins at infinite density and temperature", starCount: 0, galaxyCount: 0 },
    { scroll: 0.05, time: -13.7, title: "Inflation", desc: "Universe expands faster than light", starCount: 0, galaxyCount: 0 },
    { scroll: 0.1, time: -13.5, title: "First Light", desc: "Photons decouple, cosmic microwave background forms", starCount: 400, galaxyCount: 0 },
    { scroll: 0.15, time: -13.2, title: "Dark Ages", desc: "No stars yet, only hydrogen and helium", starCount: 0, galaxyCount: 0 },
    { scroll: 0.2, time: -13, title: "First Stars", desc: "Population III stars ignite, 100x larger than our sun", starCount: 800, galaxyCount: 0 },
    { scroll: 0.25, time: -12, title: "First Galaxies", desc: "Gravity pulls matter into dwarf galaxies", starCount: 1500, galaxyCount: 3 },
    { scroll: 0.3, time: -11, title: "Quasar Era", desc: "Supermassive black holes power the brightest objects", starCount: 2500, galaxyCount: 6 },
    { scroll: 0.35, time: -10, title: "Galaxy Collisions", desc: "Galaxies merge to form larger structures", starCount: 3000, galaxyCount: 8 },
    { scroll: 0.4, time: -8, title: "Peak Star Formation", desc: "Universe creates stars at maximum rate", starCount: 5000, galaxyCount: 12 },
    { scroll: 0.45, time: -6, title: "Milky Way Forms", desc: "Our galaxy takes shape from merging dwarfs", starCount: 5500, galaxyCount: 14 },
    { scroll: 0.5, time: -4.6, title: "Solar System Birth", desc: "Sun and planets form from collapsing nebula", starCount: 6000, galaxyCount: 15 },
    { scroll: 0.55, time: -3.8, title: "Life on Earth", desc: "First single-celled organisms appear", starCount: 6500, galaxyCount: 16 },
    { scroll: 0.6, time: 0, title: "Present Day", desc: "You are here, 13.8 billion years later", starCount: 7000, galaxyCount: 18 },
    { scroll: 0.65, time: 1, title: "Andromeda Collision", desc: "Milky Way merges with Andromeda galaxy", starCount: 7500, galaxyCount: 17 },
    { scroll: 0.7, time: 5, title: "Red Giant Sun", desc: "Sun expands, consuming Mercury and Venus", starCount: 6800, galaxyCount: 16 },
    { scroll: 0.75, time: 8, title: "White Dwarf Sun", desc: "Sun sheds outer layers, Earth freezes", starCount: 6000, galaxyCount: 14 },
    { scroll: 0.8, time: 20, title: "Star Formation Slows", desc: "Gas clouds deplete, fewer new stars", starCount: 4500, galaxyCount: 12 },
    { scroll: 0.85, time: 100, title: "Stelliferous Era Ends", desc: "Last stars form, universe dims", starCount: 2500, galaxyCount: 8 },
    { scroll: 0.9, time: 1000, title: "Degenerate Era", desc: "Only dead stars remain: white dwarfs, neutron stars", starCount: 800, galaxyCount: 3 },
    { scroll: 0.95, time: 100000, title: "Black Hole Era", desc: "Black holes dominate, slowly evaporating", starCount: 100, galaxyCount: 1 },
    { scroll: 1, time: 10000000, title: "Heat Death", desc: "Maximum entropy, no energy left for work", starCount: 0, galaxyCount: 0 }
];

async function fetchNASAData() {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=5');
        nasaData = await response.json();
        console.log('NASA data loaded:', nasaData);
    } catch (error) {
        console.log('NASA API unavailable, using default data');
    }
}

function setupEventMarkers() {
    const markers = document.querySelectorAll('.event-marker');
    if (markers.length === 0) return;
    
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const targetScroll = parseFloat(marker.dataset.scroll);
            const targetY = targetScroll * (document.body.scrollHeight - window.innerHeight);
            
            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
            
            markers.forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
            
            camera.position.z = 300;
            setTimeout(() => {
                camera.position.z = 500 - targetScroll * 300;
            }, 500);
        });
    });
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
        markers.forEach(marker => {
            const markerScroll = parseFloat(marker.dataset.scroll);
            if (Math.abs(scrollPercent - markerScroll) < 0.05) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    });
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    addBackground();
    initAudio();
    fetchNASAData();
    setupEventMarkers();
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
    for (let i = 0; i < 2000; i++) {
        pos.push((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 1500);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.3 });
    nebula = new THREE.Points(geo, mat);
    scene.add(nebula);
}

function updateStars() {
    const diff = targetStarCount - currentStarCount;
    if (Math.abs(diff) < 1) return;

    currentStarCount += diff * 0.1;
    const needed = Math.round(currentStarCount);

    while (stars.length < needed) {
        const size = Math.random() * 1.5 + 0.5;
        const geo = new THREE.SphereGeometry(size, 5, 5);
        const hue = Math.random() < 0.3 ? 0.1 : 0.6;
        const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue, 0.8, 0.7) });
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
        const pos = [];

        for (let j = 0; j < 1000; j++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.pow(Math.random(), 0.5) * 100;
            pos.push(Math.cos(angle) * radius, (Math.random() - 0.5) * 10, Math.sin(angle) * radius);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0x4488ff, size: 1.5, transparent: true, opacity: 0.6 });
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
    const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);

    let era = timeline[0];
    for (let i = 0; i < timeline.length; i++) {
        if (scrollPercent >= timeline[i].scroll) era = timeline[i];
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

    const vol = Math.max(0, 1 - scrollPercent);
    gainNode.gain.linearRampToValueAtTime(vol * 0.05, audioContext.currentTime + 0.1);
    document.getElementById('volume-level').textContent = Math.round(vol * 100) + '%';

    camera.position.z = 500 - scrollPercent * 300;
    camera.rotation.y = scrollPercent * Math.PI;
}

function animate() {
    requestAnimationFrame(animate);

    updateStars();
    updateGalaxies();

    const t = Date.now() * 0.0001;

    nebula.rotation.y += 0.0001;

    stars.forEach((s, i) => {
        s.rotation.x += 0.002;
        s.rotation.y += 0.002;
    });

    galaxies.forEach((g, i) => {
        g.rotation.z += 0.003;
        g.position.x += Math.sin(t + i) * 0.1;
    });

    renderer.render(scene, camera);
}

init();
