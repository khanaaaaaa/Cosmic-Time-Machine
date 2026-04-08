let nasaData = null;

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
        slider.value = Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100);
    });
}

function onScroll() {
    if (planetMode) return;
    const sp = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);

    if (sp < 0.02 && !bigBangActive && bigBangParticles) triggerBigBang();

    let era = timeline[0];
    for (let i = 0; i < timeline.length; i++) {
        if (sp >= timeline[i].scroll) era = timeline[i];
    }

    const isCollision = era.time === -10;
    collisionActive = isCollision;
    collidingGalaxies.forEach(g => { g.visible = isCollision; });
    ['timeline-info', 'audio-indicator', 'scroll-hint'].forEach(id => {
        document.getElementById(id)?.classList.toggle('hidden', isCollision);
    });

    document.getElementById('era-title').textContent = era.title;
    document.getElementById('era-description').textContent = era.desc;
    document.getElementById('time-label').textContent =
        era.time < 0    ? `${Math.abs(era.time)}B years ago`
      : era.time === 0  ? 'Now'
      : era.time >= 1000 ? `+${(era.time / 1000).toFixed(0)}T years`
      : `+${era.time}B years`;

    if (nasaData) {
        const idx = Math.floor(sp * (nasaData.length - 1));
        const el = document.getElementById('nasa-fact');
        if (el) el.textContent = nasaData[idx]?.title || '';
    }

    targetStarCount = era.starCount;
    targetGalaxyCount = era.galaxyCount;
    updatePlanetVisibility(era.time);
    if (solarSystem) solarSystem.visible = era.time === 0;

    updateAudio(sp);

    camera.position.set(0, 100 + sp * 50, 320 - sp * 120);
    camera.lookAt(0, 0, 0);
}
