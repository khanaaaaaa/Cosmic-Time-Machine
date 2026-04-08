function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000005, 0.00015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 100, 320);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x111122, 0.5));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function addBackground() {
    // Deep star field - two layers for parallax depth
    [3000, 6000].forEach((spread, li) => {
        const geo = new THREE.BufferGeometry();
        const pos = [], col = [];
        const count = li === 0 ? 2000 : 1000;
        for (let i = 0; i < count; i++) {
            pos.push(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.5
            );
            const c = new THREE.Color();
            c.setHSL(Math.random() * 0.2 + 0.55, 0.3 + Math.random() * 0.4, 0.6 + Math.random() * 0.4);
            col.push(c.r, c.g, c.b);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({
            size: li === 0 ? 0.8 : 0.4,
            vertexColors: true,
            transparent: true,
            opacity: li === 0 ? 0.9 : 0.5,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        const pts = new THREE.Points(geo, mat);
        pts.userData.parallax = li === 0 ? 0.02 : 0.005;
        scene.add(pts);
        if (li === 0) nebula = pts;
    });
}
