function updateStars() {
    const diff = targetStarCount - currentStarCount;
    if (Math.abs(diff) < 1) return;
    currentStarCount += diff * 0.1;
    const needed = Math.round(currentStarCount);

    while (stars.length < needed) {
        const geo = new THREE.BufferGeometry();
        const pos = [], col = [];
        // Each "star" is a small point cluster for a glowing look
        const cx = (Math.random() - 0.5) * 2500;
        const cy = (Math.random() - 0.5) * 2500;
        const cz = (Math.random() - 0.5) * 1200;

        const hue = Math.random() < 0.2 ? 0.06 + Math.random() * 0.05   // orange/red giants
                  : Math.random() < 0.4 ? 0.55 + Math.random() * 0.1    // blue/white
                  : 0.1 + Math.random() * 0.05;                          // yellow

        pos.push(cx, cy, cz);
        const c = new THREE.Color().setHSL(hue, 0.9, 0.85);
        col.push(c.r, c.g, c.b);

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

        const size = Math.random() * 3 + 1;
        const star = new THREE.Points(geo, new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        }));
        star.userData = { pulseSpeed: Math.random() * 2 + 0.5, pulsePhase: Math.random() * Math.PI * 2, baseOpacity: 0.7 + Math.random() * 0.3 };
        scene.add(star);
        stars.push(star);
    }

    while (stars.length > needed) {
        scene.remove(stars.pop());
    }
}
