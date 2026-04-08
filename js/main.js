function init() {
    initScene();
    addBackground();
    fetchNASAData();
    setupEventMarkers();
    setupTimelineSlider();
    createSolarSystem();
    createPlanets();
    createBigBangAnimation();
    createCollidingGalaxies();
    setupPlanetClick();
    window.addEventListener('scroll', onScroll);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const t     = Date.now() * 0.0001;
    const delta = 0.016;

    updateStars();
    updateGalaxies();

    scene.children.forEach(obj => {
        if (obj.isPoints && obj.userData.layer !== undefined) {
            obj.rotation.y += 0.00004 * (obj.userData.layer + 1);
            obj.rotation.x += 0.00002 * (obj.userData.layer + 1);
        }
    });

    stars.forEach(s => {
        s.userData.pulsePhase += s.userData.pulseSpeed * delta;
        const pulse = 0.7 + Math.sin(s.userData.pulsePhase) * 0.3;
        const mult = s.userData.opacityMult !== undefined ? s.userData.opacityMult : 1.0;
        s.material.opacity = s.userData.baseOpacity * pulse * mult;
        s.material.size    = s.userData.baseSize * (0.85 + pulse * 0.15);
    });

    galaxies.forEach((g, i) => {
        g.rotation.z += 0.0008 + i * 0.0001;
        g.rotation.y += 0.0003;
    });

    planets.forEach(p => { if (!planetMode && p.visible) p.rotation.y += 0.006; });

    if (solarSystem?.visible) {
        const sun = solarSystem.children[0];
        if (sun?.children) {
            sun.children.forEach((glow, i) => {
                glow.material.opacity = [0.25, 0.12, 0.05][i] * (0.7 + Math.sin(t * 4 + i * 1.2) * 0.3);
                const s = 1 + Math.sin(t * 2 + i) * 0.02;
                glow.scale.set(s, s, s);
            });
        }
        solarSystem.children.forEach((child, i) => {
            if (i === 0 || !child.userData.distance) return;
            const speed = child.userData.orbitSpeed || (0.35 / i);
            const angle = t * speed * 10;
            const d = child.userData.distance;
            child.position.x = Math.cos(angle) * d;
            child.position.z = Math.sin(angle) * d;
            child.rotation.y += 0.006;
        });
    }

    updateBigBang(delta);
    updateCollision();
    renderer.render(scene, camera);
}

init();
