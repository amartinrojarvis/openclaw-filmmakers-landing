// Sprites del jugador en sus distintos estados
function drawAnimatedPlayer() {
    const x = player.x;
    const y = player.y;
    ctx.save();
    ctx.translate(x + 16, y + 20);
    if (player.facing === -1) ctx.scale(-1, 1);
    if (player.invincible > 0 && Math.floor(frameCount / 4) % 2 === 0) ctx.globalAlpha = 0.5;

    if (victoryState) {
        // Pose de victoria: cámara en alto
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(-8, -8, 16, 20);
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath(); ctx.arc(0, -15, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#333'; ctx.fillRect(2, -19, 4, 4);
        ctx.fillStyle = '#e94560';
        ctx.fillRect(-10, -25, 20, 6); ctx.fillRect(-14, -23, 8, 4);
        ctx.fillStyle = '#fdbcb4';
        ctx.fillRect(6, -20, 4, 18);
        ctx.fillRect(-12, -20, 4, 18);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(8, -28, 12, 10);
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.arc(18, -23, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(18, -23, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,215,0,0.5)';
        ctx.beginPath(); ctx.arc(18, -23, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#34495e';
        ctx.fillRect(-6, 10, 5, 8); ctx.fillRect(1, 10, 5, 8);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-8, 16, 8, 5); ctx.fillRect(1, 16, 8, 5);
        ctx.restore();
        return;
    }

    switch (player.state) {
        case 'idle': drawIdle(); break;
        case 'walk': drawWalk(); break;
        case 'jump': drawJump(); break;
        case 'fall': drawFall(); break;
        case 'hurt': drawHurt(); break;
    }
    ctx.restore();
}

function drawIdle() {
    const breath = Math.sin(frameCount * 0.1) * 1;
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(-8, -5 + breath, 16, 20);
    ctx.fillStyle = '#fdbcb4'; ctx.beginPath(); ctx.arc(0, -12 + breath, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8a090'; ctx.fillRect(6, -14 + breath, 4, 3);
    if (Math.sin(frameCount * 0.05) > 0.9) {
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(2, -14 + breath); ctx.lineTo(5, -14 + breath); ctx.stroke();
    } else {
        ctx.fillStyle = '#333'; ctx.fillRect(2, -16 + breath, 3, 3);
    }
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-2, -14 + breath); ctx.lineTo(6, -14 + breath); ctx.stroke();
    ctx.fillStyle = '#e94560'; ctx.fillRect(-10, -22 + breath, 20, 6); ctx.fillRect(-12, -20 + breath, 6, 4);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(8, -2 + breath, 12, 10);
    ctx.fillStyle = '#333'; ctx.fillRect(10, 0 + breath, 8, 6);
    ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(18, 3 + breath, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a5276'; ctx.beginPath(); ctx.arc(18, 3 + breath, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(4, 0 + breath, 6, 8);
    ctx.fillRect(-10, 0 + breath, 4, 10);
    ctx.fillStyle = '#34495e'; ctx.fillRect(-6, 12 + breath, 5, 12); ctx.fillRect(1, 12 + breath, 5, 12);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-8, 22 + breath, 8, 5); ctx.fillRect(1, 22 + breath, 8, 5);
}

function drawWalk() {
    const legSwing = Math.sin(player.animFrame * Math.PI / 2) * 6;
    const armSwing = Math.sin(player.animFrame * Math.PI / 2) * 4;
    const bob = Math.abs(Math.sin(player.animFrame * Math.PI / 2)) * 2;
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(-8, -5 - bob, 16, 20);
    ctx.fillStyle = '#fdbcb4'; ctx.beginPath(); ctx.arc(0, -12 - bob, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8a090'; ctx.fillRect(6, -14 - bob, 4, 3);
    ctx.fillStyle = '#333'; ctx.fillRect(2, -16 - bob, 3, 3);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-2, -14 - bob); ctx.lineTo(6, -14 - bob); ctx.stroke();
    ctx.fillStyle = '#e94560'; ctx.fillRect(-10, -22 - bob, 20, 6); ctx.fillRect(-12, -20 - bob, 6, 4);
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(4 + armSwing, -2 - bob, 6, 8);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(10 + armSwing, -4 - bob, 12, 10);
    ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(20 + armSwing, 1 - bob, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(-10 - armSwing, 0 - bob, 4, 10);
    ctx.fillStyle = '#34495e'; ctx.fillRect(-6, 12, 5, 12 + legSwing); ctx.fillRect(1, 12, 5, 12 - legSwing);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-8, 22 + legSwing, 8, 5); ctx.fillRect(1, 22 - legSwing, 8, 5);
}

function drawJump() {
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(-8, -8, 16, 20);
    ctx.fillStyle = '#fdbcb4'; ctx.beginPath(); ctx.arc(0, -15, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(2, -19, 4, 4);
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(5, -10, 3, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#e94560'; ctx.fillRect(-10, -25, 20, 6); ctx.fillRect(-14, -23, 8, 4);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(8, -10, 12, 10);
    ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(18, -5, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(6, -12, 4, 12);
    ctx.fillRect(-12, -8, 4, 12);
    ctx.fillStyle = '#34495e'; ctx.fillRect(-6, 10, 5, 8); ctx.fillRect(1, 10, 5, 8);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-8, 16, 8, 5); ctx.fillRect(1, 16, 8, 5);
}

function drawFall() {
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(-8, -3, 16, 20);
    ctx.fillStyle = '#fdbcb4'; ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(2, -14, 3, 3);
    ctx.fillStyle = '#e94560'; ctx.fillRect(-10, -20, 20, 6);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(8, 5, 12, 10);
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(-12, -2, 4, 10); ctx.fillRect(6, 2, 4, 10);
    ctx.fillStyle = '#34495e'; ctx.fillRect(-6, 14, 5, 10); ctx.fillRect(1, 14, 5, 10);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-8, 22, 8, 5); ctx.fillRect(1, 22, 8, 5);
}

function drawHurt() {
    ctx.rotate(0.3);
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(-8, -5, 16, 20);
    ctx.fillStyle = '#fdbcb4'; ctx.beginPath(); ctx.arc(0, -12, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1, -16); ctx.lineTo(4, -13); ctx.moveTo(4, -16); ctx.lineTo(1, -13); ctx.stroke();
    ctx.fillStyle = '#e94560'; ctx.fillRect(-10, -22, 20, 6);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(10, 5, 12, 10);
    ctx.fillStyle = '#fdbcb4'; ctx.fillRect(-10, 0, 4, 10); ctx.fillRect(6, 0, 4, 10);
    ctx.fillStyle = '#34495e'; ctx.fillRect(-6, 12, 5, 12); ctx.fillRect(1, 12, 5, 12);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-8, 22, 8, 5); ctx.fillRect(1, 22, 8, 5);
}
