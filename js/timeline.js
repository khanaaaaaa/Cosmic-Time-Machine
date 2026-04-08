async function fetchNASAData() {
    try {
        const r = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=5');
        nasaData = await r.json();
    } catch { console.log('NASA API unavailable'); }
}

function setupEventMarkers() {
    document.querySelectorAll('.event-marker').forEach(marker => {
        marker.addEventListener('click', () => {
            window.scrollTo({
                top: parseFloat(marker.dataset.scroll) * (document.body.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        });
    });
}

function setupTimelineSlider() {
    const slider = document.getElementById('timeline-slider');
    if (!slider) return;
    slider.addEventListener('input', () => {
        sliderDragging = true;
        window.scrollTo({ top: (slider.value / 100) * (document.body.scrollHeight - window.innerHeight) });
    });
    slider.addEventListener('change', () => { sliderDragging = false; });
    window.addEventListener('scroll', () => {
        if (sliderDragging) return;
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        slider.value = Math.min(pct * 100, 100);
        const label = document.getElementById('slider-current-label');
        if (label) {
            let era = timeline[0];
            for (let i = 0; i < timeline.length; i++) {
                if (pct >= timeline[i].scroll) era = timeline[i];
            }
            label.textContent = era.title;
        }
    });
}

function applyEraVisuals(era) {
    const t = era.time;

    // ── Background clear color ──────────────────────────────────────────────
    // Big Bang: blinding white. Quark/Hadron: hot plasma red. Nucleosynthesis: cooling orange.
    // Inflation: dark blue expansion. First Light: faint CMB blue glow.
    // Dark Ages: ABSOLUTE BLACK — no light exists. First Stars: tiny blue-white specks appear.
    // Reionization: universe slowly brightens. Galaxies/Quasars: deep blue-purple.
    // Galaxy Collisions: black (handled by collision animation).
    // Present Day: deep space black-blue. Red Giant: orange-red sky. White Dwarf: cold blue.
    // Degenerate/Black Hole/Heat Death: absolute black.
    const bg =
        t === -13.8    ? 0xffffff :  // Big Bang — white flash
        t === -13.799  ? 0x4a0a00 :  // Quark Epoch — hot red plasma
        t === -13.798  ? 0x200500 :  // Hadron Epoch — cooling red
        t === -13.797  ? 0x0a0310 :  // Nucleosynthesis — dark purple cooling
        t === -13.7    ? 0x000a1a :  // Inflation — dark blue expansion
        t === -13.5    ? 0x080820 :  // First Light / CMB — faint blue glow
        t === -13.2    ? 0x000000 :  // Dark Ages — ABSOLUTE BLACK
        t === -13      ? 0x000308 :  // First Stars — near black, tiny lights
        t === -12.5    ? 0x000510 :  // Reionization — slightly brighter
        t === -12      ? 0x000410 :  // First Galaxies
        t === -11      ? 0x080010 :  // Quasar Era — purple AGN glow
        t === -10      ? 0x000000 :  // Galaxy Collisions — black bg, collision handles it
        t === -9       ? 0x000308 :  // Cosmic Web
        t === -8       ? 0x000510 :  // Peak Star Formation — blue tint, most stars ever
        t === -6       ? 0x000308 :  // Milky Way Forms
        t === -4.6     ? 0x000205 :  // Solar System Birth
        t === -3.8     ? 0x080100 :  // Late Heavy Bombardment — warm reddish
        t === -2       ? 0x000205 :  // Early Solar System
        t === 0        ? 0x000005 :  // Present Day
        t === 1        ? 0x050005 :  // Andromeda Collision — slight purple
        t === 2        ? 0x030008 :  // Milkomeda — elliptical, no spiral arms
        t === 5        ? 0x1a0300 :  // Red Giant — deep orange-red
        t === 8        ? 0x00000f :  // White Dwarf — cold blue-black
        t === 20       ? 0x000003 :  // Star Formation Slows — near black
        t === 100      ? 0x000002 :  // Stelliferous Era Ends — almost black
        t >= 1000      ? 0x000000 :  // Degenerate/Black Dwarf/Black Hole/Hawking/Heat Death — BLACK
                         0x000005;

    renderer.setClearColor(new THREE.Color(bg), 1);

    // ── Fog ─────────────────────────────────────────────────────────────────
    if (scene.fog) {
        scene.fog.density =
            t === -13.8   ? 0.003  :  // Big Bang — opaque
            t <= -13.797  ? 0.002  :  // Early plasma epochs — very dense
            t === -13.2   ? 0.005  :  // Dark Ages — maximum fog, nothing visible
            t >= 1000     ? 0.001  :  // Late eras — sparse
            t >= 100      ? 0.0005 :
                            0.00015;
    }

    // ── Background star layers ───────────────────────────────────────────────
    // Dark Ages: no background stars. Big Bang/early epochs: no stars.
    // First Stars onward: show background stars. Late eras: fade them out.
    const showBgStars = t >= -13 && t < 10000;
    const bgOpacity =
        t === -13      ? 0.1  :  // First Stars — barely visible
        t === -12.5    ? 0.3  :  // Reionization — brightening
        t >= -12       ? 1.0  :  // Normal universe
        t >= 1000      ? 0.3  :
        t >= 100       ? 0.6  :
                         1.0;
    bgLayers.forEach(l => {
        l.visible = showBgStars;
        if (showBgStars) l.material.opacity = l.userData.baseOpacity * bgOpacity;
    });

    // ── Dynamic stars (updateStars) ──────────────────────────────────────────
    // Stars fade to black in late eras
    const starOpacityMult =
        t >= 10000  ? 0.0 :
        t >= 1000   ? 0.3 :
        t >= 100    ? 0.6 :
                      1.0;
    stars.forEach(s => {
        s.userData.opacityMult = starOpacityMult;
    });

    // ── Galaxy collision ─────────────────────────────────────────────────────
    const isCollision = t === -10;
    collisionActive = isCollision;
    collidingGalaxies.forEach(g => { g.visible = isCollision; });
    galaxies.forEach(g => { g.visible = !isCollision; });
    ['timeline-info', 'scroll-hint'].forEach(id => {
        document.getElementById(id)?.classList.toggle('hidden', isCollision);
    });

    // ── Solar system ─────────────────────────────────────────────────────────
    // Show from Solar System Birth (-4.6B) through White Dwarf (8B)
    // After White Dwarf the sun is gone — solar system disappears
    if (solarSystem) {
        const showSolar = t >= -4.6 && t <= 8;
        solarSystem.visible = showSolar;
        if (showSolar) {
            const sun = solarSystem.children[0];
            if (sun) {
                if (t === 5) {
                    // Red Giant: Sun expands to 200x, turns red-orange
                    sun.material.color.setHex(0xff2200);
                    sun.scale.setScalar(4.5);
                    // Hide inner planets — they're consumed
                    solarSystem.children.forEach((child, i) => {
                        if (child.userData.distance && child.userData.distance < 210) {
                            child.visible = false;
                        }
                    });
                } else if (t === 8) {
                    // White Dwarf: tiny, blue-white, very hot
                    sun.material.color.setHex(0xccddff);
                    sun.scale.setScalar(0.2);
                    solarSystem.children.forEach(child => { child.visible = true; });
                } else {
                    sun.material.color.setHex(0xfff4aa);
                    sun.scale.setScalar(1);
                    solarSystem.children.forEach(child => { child.visible = true; });
                }
            }
        }
    }

    // ── Exoplanets ───────────────────────────────────────────────────────────
    updatePlanetVisibility(t);
}

function onScroll() {
    if (planetMode) return;
    const sp = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);

    if (sp < 0.02 && !bigBangActive && bigBangParticles) triggerBigBang();

    let eraIndex = 0;
    for (let i = 0; i < timeline.length; i++) {
        if (sp >= timeline[i].scroll) eraIndex = i;
    }
    const era = timeline[eraIndex];

    document.getElementById('era-title').textContent = era.title;
    document.getElementById('era-description').textContent = era.desc;
    document.getElementById('time-label').textContent =
        era.time < 0     ? `${Math.abs(era.time)}B years ago`
      : era.time === 0   ? 'Now'
      : era.time >= 1e9  ? `+${(era.time / 1e9).toFixed(0)}Q years`
      : era.time >= 1000 ? `+${(era.time / 1000).toFixed(0)}T years`
      : `+${era.time}B years`;

    if (nasaData) {
        const idx = Math.floor(sp * (nasaData.length - 1));
        const el = document.getElementById('nasa-fact');
        if (el) el.textContent = nasaData[idx]?.title || '';
    }

    targetStarCount   = era.starCount;
    targetGalaxyCount = era.galaxyCount;

    applyEraVisuals(era);

    camera.position.set(0, 100 + sp * 50, 320 - sp * 120);
    camera.lookAt(0, 0, 0);
}
