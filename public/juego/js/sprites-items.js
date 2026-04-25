// Sprites y etiquetas de coleccionables (cámara, lente, batería, etc.)
function drawSpriteCamera(x, y, size) {
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(x - size/2, y - size/3, size, size/1.5);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(x, y, size/3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0d47a1';
    ctx.beginPath(); ctx.arc(x, y, size/4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x - size/4, y - size/2, size/2, size/6);
}

function drawSpriteLens(x, y, size) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x - size/3, y - size/2, size/1.5, size);
    ctx.fillStyle = '#0d47a1';
    ctx.beginPath(); ctx.arc(x, y, size/3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(x - size/8, y - size/8, size/8, 0, Math.PI * 2); ctx.fill();
}

function drawSpriteBattery(x, y, size) {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(x - size/3, y - size/2, size/1.5, size);
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(x - size/6, y - size/2 - size/8, size/3, size/8);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.moveTo(x + size/8, y - size/4);
    ctx.lineTo(x - size/8, y);
    ctx.lineTo(x + size/8, y);
    ctx.lineTo(x - size/8, y + size/4);
    ctx.fill();
}

function drawSpriteCoffee(x, y, size) {
    ctx.fillStyle = '#795548';
    ctx.fillRect(x - size/3, y - size/3, size/1.5, size/1.5);
    ctx.strokeStyle = '#795548'; ctx.lineWidth = size/8;
    ctx.beginPath(); ctx.arc(x + size/3, y, size/4, -Math.PI/2, Math.PI/2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * size/4, y - size/2);
        ctx.quadraticCurveTo(x + i * size/4 + size/8, y - size, x + i * size/4, y - size * 1.2);
        ctx.stroke();
    }
}

function drawSpriteClapper(x, y, size) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x - size/2, y, size, size/4);
    ctx.save();
    ctx.translate(x, y); ctx.rotate(-0.3);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-size/2, -size/4, size, size/4);
    ctx.fillStyle = '#e94560';
    for (let i = 0; i < 4; i++) ctx.fillRect(-size/2 + i * size/4, -size/4, size/8, size/4);
    ctx.restore();
}

function drawSpriteDrone(x, y, size) {
    ctx.fillStyle = '#424242';
    ctx.beginPath(); ctx.ellipse(x, y, size/3, size/4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#757575';
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const px = x + Math.cos(angle) * size/2;
        const py = y + Math.sin(angle) * size/3;
        ctx.beginPath(); ctx.arc(px, py, size/6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, size/4, frameCount * 0.5 + angle, frameCount * 0.5 + angle + Math.PI); ctx.stroke();
    }
}

function drawSpriteItem(x, y, type, size) {
    switch (type) {
        case 'camera':  drawSpriteCamera(x, y, size); break;
        case 'lens':    drawSpriteLens(x, y, size); break;
        case 'battery': drawSpriteBattery(x, y, size); break;
        case 'coffee':  drawSpriteCoffee(x, y, size); break;
        case 'clapper': drawSpriteClapper(x, y, size); break;
        case 'drone':   drawSpriteDrone(x, y, size); break;
        case 'tripleShot':  drawSpriteTripleShot(x, y, size); break;
        case 'flashBomb':   drawSpriteFlashBomb(x, y, size); break;
        case 'render4K':    drawSpriteRender4K(x, y, size); break;
        default:
            ctx.font = size + 'px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(getEmoji(type), x, y + size/3);
    }
}

function drawSpriteTripleShot(x, y, size) {
    ctx.fillStyle = '#e94560';
    ctx.beginPath(); ctx.arc(x, y, size/2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, size/4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e94560';
    for (let i = -1; i <= 1; i++) {
        ctx.fillRect(x + i * size/3 - 2, y - size/6, 4, size/3);
    }
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('3x', x, y + size/4);
}

function drawSpriteFlashBomb(x, y, size) {
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(x, y, size/2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff5722';
    ctx.beginPath(); ctx.arc(x, y, size/4, 0, Math.PI * 2); ctx.fill();
    // Rayos
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * size/3, y + Math.sin(angle) * size/3);
        ctx.lineTo(x + Math.cos(angle) * size/1.8, y + Math.sin(angle) * size/1.8);
        ctx.stroke();
    }
}

function drawSpriteRender4K(x, y, size) {
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath(); ctx.arc(x, y, size/2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size/2.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('4K', x, y + size/6);
    // Rayos de velocidad
    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        const angle = Math.PI / 4 + i * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * size/2, y + Math.sin(angle) * size/2);
        ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        ctx.stroke();
    }
}

const itemLabels = {
    camera:   { name: 'CAMARA',   desc: '¡Dispara a los enemigos!' },
    lens:     { name: 'OBJETIVO', desc: '50mm f/1.2, ¡el sueño!' },
    sd:       { name: 'TARJETA SD', desc: '¡Espero que no se llene!' },
    battery:  { name: 'BATERIA',  desc: '¡El pan de cada día!' },
    drone:    { name: 'DRON',     desc: '¡Vista aérea épica!' },
    gimbal:   { name: 'GIMBAL',   desc: '¡Para no marear!' },
    mic:      { name: 'MICRO',    desc: '¿Se me escucha?' },
    light:    { name: 'FOCO',     desc: '¡Luz, cámara...!' },
    tripod:   { name: 'TRIPODE',  desc: '¡No se mueva nadie!' },
    clapper:  { name: 'CLaqueta', desc: '¡ACTION!' },
    coffee:   { name: 'CAFE',     desc: '¡Combustible del filmmaker!' },
    script:   { name: 'GUION',    desc: '¿Quién lo ha escrito?' },
    award:    { name: 'PREMIO',   desc: '¡Me lo merezco!' },
    oscar:    { name: 'OSCAR',    desc: '¡Gracias a la Academia!' },
    ssd:      { name: 'SSD',      desc: '¡4TB de pura velocidad!' },
    preset:   { name: 'LUT',      desc: '¡Color grading mágico!' },
    timeline: { name: 'TIMELINE', desc: '¡El caos organizado!' },
    render:   { name: 'RENDER',   desc: '¡Solo faltan 3 horas!' },
    export:   { name: 'EXPORT',   desc: '¡Por fin!' },
    color:    { name: 'COLOR',    desc: '¡Teal & Orange!' },
    vfx:      { name: 'VFX',      desc: '¡Explosión verde!' },
    premiere: { name: 'PREMIERE', desc: '¡La industria!' }
};

function getEmoji(type) {
    const emojis = {
        camera: '📷', lens: '🔭', sd: '💾', battery: '🔋', drone: '🚁',
        gimbal: '🎥', mic: '🎤', light: '💡', tripod: '📐', clapper: '🎬',
        coffee: '☕', script: '📜', award: '🏆', oscar: '🏆', ssd: '💿',
        preset: '🎨', timeline: '📊', render: '🖥️', export: '📤',
        color: '🌈', vfx: '✨', premiere: '🎞️'
    };
    return emojis[type] || '⭐';
}
