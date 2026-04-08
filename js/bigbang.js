function createBigBangAnimation() {
    const count = 8000;
    const geo = new THREE.BufferGeometry();
    const pos = [], col = [], vel = [], sizes = [];

    for (let i = 0; i < count; i++) {
        pos.push(0, 0, 0);

        const c = new THREE.Color();
        c.setHSL(Math.random() * 0.15, 1.0, 0.5 + Math.random() * 0.5);
        col.push(c.r, c.g, c.b);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 30 + Math.random() * 200;
        vel.push(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
        );
        sizes.push(Math.random() * 4 + 1);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('velocity', new THREE.Float32BufferAttribute(vel, 3));

    bigBangParticles = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    }));
    bigBangParticles.visible = false;
    scene.add(bigBangParticles);
}

function triggerBigBang() {
    if (!bigBangParticles) return;
    bigBangActive = true;
    explosionTime = 0;
    bigBangParticles.visible = true;

    const pos = bigBangParticles.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i++) pos[i] = 0;
    bigBangParticles.geometry.attributes.position.needsUpdate = true;

    scene.background = new THREE.Color(0xffffff);
    setTimeout(() => { scene.background = null; }, 150);
}

function updateBigBang(delta) {
    if (!bigBangActive || !bigBangParticles) return;
    explosionTime += delta;

    const pos = bigBangParticles.geometry.attributes.position.array;
    const vel = bigBangParticles.geometry.attributes.velocity.array;
    const drag = Math.max(0, 1 - explosionTime * 0.3);

    for (let i = 0; i < pos.length; i += 3) {
        pos[i]     += vel[i]     * delta * drag;
        pos[i + 1] += vel[i + 1] * delta * drag;
        pos[i + 2] += vel[i + 2] * delta * drag;
    }
    bigBangParticles.geometry.attributes.position.needsUpdate = true;
    bigBangParticles.material.opacity = Math.max(0, 1 - explosionTime / 4);
    bigBangParticles.material.size = 3 + explosionTime * 0.5;

    if (explosionTime > 4) {
        bigBangActive = false;
        bigBangParticles.visible = false;
    }
}
