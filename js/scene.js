let bgLayers = [];

function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00015);
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
    const layers = [
        { count: 3000, spread: 4000, size: 1.2, opacity: 1.0 },
        { count: 1500, spread: 6000, size: 0.6, opacity: 0.6 },
        { count: 500,  spread: 2000, size: 2.0, opacity: 0.8 }
    ];
    layers.forEach((layer, li) => {
        const geo = new THREE.BufferGeometry();
        const pos = [], col = [];
        for (let i = 0; i < layer.count; i++) {
            pos.push(
                (Math.random() - 0.5) * layer.spread,
                (Math.random() - 0.5) * layer.spread,
                (Math.random() - 0.5) * layer.spread * 0.4
            );
            const c = new THREE.Color();
            const roll = Math.random();
            if (roll < 0.1)      c.setHSL(0.6,  1.0, 0.9);
            else if (roll < 0.2) c.setHSL(0.08, 0.9, 0.9);
            else if (roll < 0.3) c.setHSL(0.0,  0.8, 0.8);
            else                 c.setHSL(0.15, 0.3, 0.95);
            col.push(c.r, c.g, c.b);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({
            size: layer.size, vertexColors: true, transparent: true,
            opacity: layer.opacity, blending: THREE.AdditiveBlending, sizeAttenuation: true
        }));
        pts.userData.layer = li;
        pts.userData.baseOpacity = layer.opacity;
        pts.visible = false;
        scene.add(pts);
        bgLayers.push(pts);
        if (li === 0) nebula = pts;
    });
}
