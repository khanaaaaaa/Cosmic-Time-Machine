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

    const isCollision = era.time === -10;
    collisionActive = isCollision;
    collidingGalaxies.forEach(g => { g.visible = isCollision; });

    ['timeline-info', 'audio-indicator', 'scroll-hint'].forEach(id => {
        document.getElementById(id)?.classList.toggle('hidden', isCollision);
    });

    if (solarSystem) {
        const showSolar = era.time >= -4.6 && era.time <= 8;
        solarSystem.visible = showSolar;

        if (showSolar) {
            const sun = solarSystem.children[0];
            if (sun) {
                if (era.time === 5) {
                    sun.material.color.setHex(0xff3300);
                    sun.scale.setScalar(3.5);
                } else if (era.time === 8) {
                    sun.material.color.setHex(0xbbbbff);
                    sun.scale.setScalar(0.3);
                } else {
                    sun.material.color.setHex(0xfff4aa);
                    sun.scale.setScalar(1);
                }
            }
        }
    }

    updatePlanetVisibility(era.time);
    updateAudio(sp);

    const bgColors = {
        bigbang:    0x1a0000,
        quark:      0x0d0005,
        hadron:     0x050010,
        nucleosynth:0x000510,
        inflation:  0x000820,
        firstlight: 0x050520,
        darkages:   0x000000,
        firststars: 0x000511,
        reionize:   0x000a18,
        galaxies:   0x000510,
        quasar:     0x050010,
        collision:  0x000000,
        web:        0x000308,
        peakstar:   0x000510,
        milkyway:   0x000308,
        solarbirth: 0x000205,
        bombardment:0x050200,
        earlysolar: 0x000205,
        present:    0x000005,
        andromeda:  0x050005,
        milkomeda:  0x030008,
        redgiant:   0x100200,
        whitedwarf: 0x000010,
        slowstar:   0x000005,
        stellifend: 0x000003,
        degenerate: 0x000002,
        blackdwarf: 0x000001,
        blackhole:  0x000000,
        hawking:    0x000000,
        lastbh:     0x000000,
        heatdeath:  0x000000
    };

    const bgKeys = Object.keys(bgColors);
    const bgKey  = bgKeys[Math.min(eraIndex, bgKeys.length - 1)];
    renderer.setClearColor(new THREE.Color(bgColors[bgKey]), 1);

    if (scene.fog) {
        scene.fog.density = era.time <= -13.5 ? 0.001
            : era.time <= -13   ? 0.0004
            : era.time >= 1000  ? 0.0005
            : era.time >= 100   ? 0.0003
            : 0.00015;
    }

    camera.position.set(0, 100 + sp * 50, 320 - sp * 120);
    camera.lookAt(0, 0, 0);
}
