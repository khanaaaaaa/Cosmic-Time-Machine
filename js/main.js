function init() {
    initScene();
    addBackground();
    initAudio();
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

    const t = Date.now() * 0.0001;

    updateStars();
    updateGalaxies();

    // Nebula slow drift
    if (nebula) {
        nebula.rotation.y += 0.00008;
        nebula.rotation.x += 0.00003;
    }

    // Star twinkling
    stars.forEach(s => {
        if (s.userData.pulsePhase !== undefined) {
            s.userData.pulsePhase += s.userData.pulseSpeed * 0.016;
            s.material.opacity = s.userData.baseOpacity * (0.7 + Math.sin(s.userData.pulsePhase) * 0.3);
        }
    });

    // Galaxy slow spin
    galaxies.forEach(g => { g.rotation.z += 0.0015; g.rotation.y += 0.0005; });

    // Exoplanet rotation
    planets.forEach(p => { if (!planetMode && p.visible) p.rotation.y += 0.008; });

    // Solar system orbital animation
    if (solarSystem?.visible) {
        // Sun pulse
        const sunGlows = solarSystem.children[0]?.children;
        if (sunGlows) {
            sunGlows.forEach((g, i) => {
                g.material.opacity = [0.25, 0.12, 0.05][i] * (0.8 + Math.sin(t * 3 + i) * 0.2);
            });
        }

        // Planet orbits - skip index 0 (sun) and odd indices (orbital rings)
        solarSystem.children.forEach((child, i) => {
            if (i === 0) return; // sun
            if (!child.userData.distance) return; // orbital ring
            const speed = child.userData.orbitSpeed || (0.4 / i);
            const angle = t * speed * 10;
            const d = child.userData.distance;
            child.position.x = Math.cos(angle) * d;
            child.position.z = Math.sin(angle) * d;
            child.rotation.y += 0.008;
        });
    }

    updateBigBang(0.016);
    updateCollision();

    renderer.render(scene, camera);
}

init();
