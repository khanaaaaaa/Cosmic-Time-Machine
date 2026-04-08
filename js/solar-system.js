function createPlanetTexture(type, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
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
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 60; i++) {
            ctx.fillRect(Math.random() * 1024, Math.random() * 300, Math.random() * 80, Math.random() * 40);
        }
        ctx.globalAlpha = 1;
    } else if (type === 'rocky') {
        const c = new THREE.Color(color);
        const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        grad.addColorStop(0, `rgb(${c.r*255*1.3|0},${c.g*255*1.3|0},${c.b*255*1.3|0})`);
        grad.addColorStop(1, `rgb(${c.r*255*0.5|0},${c.g*255*0.5|0},${c.b*255*0.5|0})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 500; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 20 + 3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (type === 'bands') {
        const c = new THREE.Color(color);
        for (let y = 0; y < 1024; y++) {
            const b = 0.65 + Math.sin(y * 0.025) * 0.25 + Math.sin(y * 0.07) * 0.1;
            const turb = Math.sin(y * 0.12 + Math.sin(y * 0.03) * 5) * 0.08;
            ctx.fillStyle = `rgb(${c.r*255*(b+turb)|0},${c.g*255*(b+turb)|0},${c.b*255*(b+turb)|0})`;
            ctx.fillRect(0, y, 1024, 1);
        }
        for (let i = 0; i < 120; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
            ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 4 + 1);
        }
    } else if (type === 'ice') {
        const c = new THREE.Color(color);
        const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        grad.addColorStop(0, `rgb(${c.r*255*1.4|0},${c.g*255*1.4|0},${c.b*255*1.4|0})`);
        grad.addColorStop(1, `rgb(${c.r*255*0.6|0},${c.g*255*0.6|0},${c.b*255*0.6|0})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 250; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 25 + 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        for (let i = 0; i < 200; i++) {
            ctx.lineWidth = Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
            ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
            ctx.stroke();
        }
    } else if (type === 'cloudy') {
        const c = new THREE.Color(color);
        ctx.fillStyle = `rgb(${c.r*255|0},${c.g*255|0},${c.b*255|0})`;
        ctx.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 400; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * 1024, Math.random() * 1024, Math.random() * 90 + 30, Math.random() * 45 + 15, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    return new THREE.CanvasTexture(canvas);
}

function createSolarSystem() {
    solarSystem = new THREE.Group();

    // Sun with layered glow
    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(30, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0xfff4aa })
    );
    [
        { r: 34, c: 0xffaa00, o: 0.25 },
        { r: 40, c: 0xff6600, o: 0.12 },
        { r: 50, c: 0xff3300, o: 0.05 }
    ].forEach(g => {
        sun.add(new THREE.Mesh(
            new THREE.SphereGeometry(g.r, 32, 32),
            new THREE.MeshBasicMaterial({ color: g.c, transparent: true, opacity: g.o, side: THREE.BackSide })
        ));
    });
    sun.userData = { name: "Sun", info: "G-type main sequence star", distance: 0 };
    solarSystem.add(sun);

    const configs = [
        { name: "Mercury", r: 4,  c: 0x8c7853, d: 80,  info: "Smallest planet",  type: 'rocky'  },
        { name: "Venus",   r: 9,  c: 0xe8cda2, d: 120, info: "Hottest planet",   type: 'cloudy' },
        { name: "Earth",   r: 10, c: 0x2233ff, d: 160, info: "Home",             type: 'earth'  },
        { name: "Mars",    r: 6,  c: 0xcd5c5c, d: 205, info: "Red planet",       type: 'rocky'  },
        { name: "Jupiter", r: 22, c: 0xc88b3a, d: 285, info: "Gas giant",        type: 'bands'  },
        { name: "Saturn",  r: 19, c: 0xfad5a5, d: 365, info: "Ringed planet",    type: 'bands'  },
        { name: "Uranus",  r: 15, c: 0x4fd0e7, d: 435, info: "Ice giant",        type: 'ice'    },
        { name: "Neptune", r: 15, c: 0x4166f5, d: 495, info: "Windiest planet",  type: 'ice'    }
    ];

    configs.forEach((cfg, i) => {
        // Orbital ring
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(cfg.d - 0.5, cfg.d + 0.5, 128),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
        );
        ring.rotation.x = Math.PI / 2;
        solarSystem.add(ring);

        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.r, 64, 64),
            new THREE.MeshBasicMaterial({ map: createPlanetTexture(cfg.type, cfg.c) })
        );
        planet.userData = { name: cfg.name, info: cfg.info, distance: cfg.d, orbitSpeed: 0.4 / (i + 1) };
        planet.position.set(cfg.d, 0, 0);

        // Saturn rings
        if (cfg.name === 'Saturn') {
            const satRing = new THREE.Mesh(
                new THREE.RingGeometry(cfg.r + 6, cfg.r + 20, 64),
                new THREE.MeshBasicMaterial({ color: 0xc9b18a, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
            );
            satRing.rotation.x = Math.PI / 2.5;
            planet.add(satRing);
        }

        solarSystem.add(planet);
    });

    solarSystem.visible = false;
    scene.add(solarSystem);
}
