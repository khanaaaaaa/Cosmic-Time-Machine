function createGalaxy(color) {
    const geo = new THREE.BufferGeometry();
    const pos = [], col = [];
    const arms = 3;

    for (let j = 0; j < 2000; j++) {
        const arm = Math.floor(Math.random() * arms);
        const t = Math.pow(Math.random(), 0.5);
        const radius = t * 120;
        const spin = radius * 0.012;
        const angle = (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.6;
        const height = (Math.random() - 0.5) * (1 - t) * 20;

        pos.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

        const c = new THREE.Color(color);
        const brightness = 0.4 + (1 - t) * 0.6;
        col.push(c.r * brightness, c.g * brightness, c.b * brightness);
    }

    // Core glow
    for (let j = 0; j < 300; j++) {
        const r = Math.random() * 15;
        const a = Math.random() * Math.PI * 2;
        pos.push(Math.cos(a) * r, (Math.random() - 0.5) * 5, Math.sin(a) * r);
        col.push(1, 0.9, 0.7);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

    return new THREE.Points(geo, new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    }));
}

function createCollidingGalaxies() {
    const gal1 = createGalaxy(0x4466ff);
    gal1.position.set(-300, 0, -200);
    gal1.userData = { vx: 1.5, vy: 0, vz: 0, initialX: -300 };

    const gal2 = createGalaxy(0xff4488);
    gal2.position.set(300, 0, -200);
    gal2.userData = { vx: -1.5, vy: 0, vz: 0, initialX: 300 };

    gal1.visible = gal2.visible = false;
    scene.add(gal1);
    scene.add(gal2);
    collidingGalaxies = [gal1, gal2];
}

function updateCollision() {
    if (!collisionActive || collidingGalaxies.length === 0) return;

    collidingGalaxies.forEach(gal => {
        gal.position.x += gal.userData.vx;
        gal.position.y += gal.userData.vy;
        gal.rotation.z += 0.004;
        gal.rotation.y += 0.002;
    });

    const dist = collidingGalaxies[0].position.distanceTo(collidingGalaxies[1].position);
    if (dist < 80) {
        collidingGalaxies.forEach(gal => {
            gal.userData.vx *= 0.97;
            gal.userData.vy += (Math.random() - 0.5) * 0.3;
        });
        // Flash the cores on close approach
        collidingGalaxies.forEach(gal => {
            gal.material && (gal.material.opacity = 0.6 + Math.random() * 0.4);
        });
    }

    if (Math.abs(collidingGalaxies[0].position.x) > 450) {
        collidingGalaxies[0].position.x = collidingGalaxies[0].userData.initialX;
        collidingGalaxies[1].position.x = collidingGalaxies[1].userData.initialX;
        collidingGalaxies[0].userData.vx = 1.5;
        collidingGalaxies[1].userData.vx = -1.5;
        collidingGalaxies[0].userData.vy = collidingGalaxies[1].userData.vy = 0;
    }
}

function updateGalaxies() {
    const diff = targetGalaxyCount - currentGalaxyCount;
    if (Math.abs(diff) < 0.1) return;
    currentGalaxyCount += diff * 0.08;
    const needed = Math.round(currentGalaxyCount);

    while (galaxies.length < needed) {
        const hue = Math.random();
        const gal = createGalaxy(new THREE.Color().setHSL(hue, 0.8, 0.5));
        gal.position.set(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 1000
        );
        gal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        scene.add(gal);
        galaxies.push(gal);
    }

    while (galaxies.length > needed) {
        scene.remove(galaxies.pop());
    }
}
