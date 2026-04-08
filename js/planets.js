function createPlanets() {
    planetData.forEach((data, i) => {
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(data.radius, 64, 64),
            new THREE.MeshBasicMaterial({ color: data.color })
        );
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
    planets.forEach(p => {
        p.visible = currentTime >= p.userData.appearTime && currentTime <= 20;
    });
}

function setupPlanetClick() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.getElementById('close-planet-info')?.addEventListener('click', e => {
        e.stopPropagation();
        planetMode ? exitPlanetMode() : (document.getElementById('planet-info').style.display = 'none');
    });

    renderer.domElement.addEventListener('click', e => {
        if (planetMode) { exitPlanetMode(); return; }

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (solarSystem?.visible) {
            const hits = raycaster.intersectObjects(solarSystem.children.filter(c => c.isMesh));
            if (hits.length > 0) { showPlanetInfo(hits[0].object); return; }
        }

        const hits = raycaster.intersectObjects(planets.filter(p => p.visible));
        if (hits.length > 0) enterPlanetMode(hits[0].object);
    });

    window.addEventListener('keydown', e => { if (e.key === 'Escape' && planetMode) exitPlanetMode(); });
}

function showPlanetInfo(planet) {
    const d = planet.userData;
    document.getElementById('planet-info').style.display = 'block';
    document.getElementById('planet-name').textContent = d.name || 'Unknown';
    document.getElementById('planet-gravity').textContent = d.info || '';
    document.getElementById('planet-brightness').textContent = '';
    setTimeout(() => { document.getElementById('planet-info').style.display = 'none'; }, 3000);
}

function enterPlanetMode(planet) {
    planetMode = true;
    currentPlanet = planet;
    const d = planet.userData;
    camera.position.set(planet.position.x, planet.position.y + d.radius + 5, planet.position.z);
    camera.lookAt(planet.position);
    scene.background = new THREE.Color(d.skyColor);
    document.getElementById('planet-info').style.display = 'block';
    document.getElementById('planet-name').textContent = d.name;
    document.getElementById('planet-gravity').textContent = `${d.gravity}g`;
    document.getElementById('planet-brightness').textContent = `${(d.starBrightness * 100).toFixed(0)}%`;
}

function exitPlanetMode() {
    planetMode = false;
    currentPlanet = null;
    scene.background = null;
    const sp = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    camera.position.set(0, 100 + sp * 50, 320 - sp * 120);
    camera.lookAt(0, 0, 0);
    document.getElementById('planet-info').style.display = 'none';
}
