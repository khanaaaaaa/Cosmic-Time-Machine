function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    oscillator.start();
}

function updateAudio(scrollPercent) {
    const vol = Math.max(0, 1 - scrollPercent);
    gainNode.gain.linearRampToValueAtTime(vol * 0.05, audioContext.currentTime + 0.1);
    document.getElementById('volume-level').textContent = Math.round(vol * 100) + '%';
}
