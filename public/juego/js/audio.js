// Sonidos generados con Web Audio API (sin assets externos)
const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() { if (!audioCtx) audioCtx = new AudioContextCtor(); }

function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    switch (type) {
        case 'jump':
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.1);
            break;
        case 'collect':
            osc.frequency.setValueAtTime(523, audioCtx.currentTime);
            osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
            break;
        case 'hurt':
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.type = 'sawtooth';
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.2);
            break;
        case 'step':
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.05);
            break;
        case 'shoot':
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.type = 'square';
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.15);
            break;
        case 'hit':
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.type = 'square';
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.1);
            break;
        case 'victory': {
            const notes = [523, 659, 784, 1047, 784, 1047, 1319];
            notes.forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.connect(g);
                g.connect(audioCtx.destination);
                o.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.18);
                g.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.18);
                g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.18 + 0.35);
                o.start(audioCtx.currentTime + i * 0.18);
                o.stop(audioCtx.currentTime + i * 0.18 + 0.35);
            });
            break;
        }
        case 'checkpoint': {
            // Música triumfal al completar nivel
            const notes = [392, 523, 659, 784, 1047, 784, 1047, 1319, 1568];
            notes.forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.connect(g);
                g.connect(audioCtx.destination);
                o.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
                g.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.15);
                g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.4);
                o.start(audioCtx.currentTime + i * 0.15);
                o.stop(audioCtx.currentTime + i * 0.15 + 0.4);
            });
            break;
        }
    }
}
