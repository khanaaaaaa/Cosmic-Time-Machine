function updateStars() {
    const diff = targetStarCount - currentStarCount;
    if (Math.abs(diff) < 1) return;
    currentStarCount += diff * 0.08;
    const needed = Math.round(currentStarCount);

    while (stars.length < needed) {
        const geo = new THREE.BufferGeometry();
        const pos = [], col = [];
        const roll = Math.random();
        const hue  = roll < 0.15 ? 0.6  + Math.random() * 0.05
                   : roll < 0.3  ? 0.08 + Math.random() * 0.04
                   : roll < 0.4  ? 0.0
                   :               0.12 + Math.random() * 0.05;
        pos.push(
            (Math.random() - 0.5) * 3000,
            (Math.random() - 0.5) * 3000,
            (Math.random() - 0.5) * 1500
        );
        const c = new THREE.Color().setHSL(hue, 0.8, 0.85);
        col.push(c.r, c.g, c.b);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));
        const size = Math.random() * 3.5 + 0.8;
        const star = new THREE.Points(geo, new THREE.PointsMaterial({
            size, vertexColors: true, transparent: true,
            opacity: 0.9, blending: THREE.AdditiveBlending, sizeAttenuation: true
        }));
        star.userData = {
            pulseSpeed:  Math.random() * 3 + 0.5,
            pulsePhase:  Math.random() * Math.PI * 2,
            baseOpacity: 0.6 + Math.random() * 0.4,
            baseSize:    size
        };
        scene.add(star);
        stars.push(star);
    }

    while (stars.length > needed) scene.remove(stars.pop());
}
