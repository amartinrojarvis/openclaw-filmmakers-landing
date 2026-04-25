// Sistema de power-ups épicos
// Tipos: tripleShot, flashBomb, render4K

const POWERUP_DURATION = 300; // 5 segundos a 60fps
const POWERUP_FLASH_RADIUS = 120;

const powerupTypes = {
    tripleShot: {
        name: 'CÁMARA CINE',
        desc: '¡Disparo triple!',
        emoji: '🎥',
        color: '#e94560'
    },
    flashBomb: {
        name: 'BATERÍA NUCLEAR',
        desc: '¡Bomba de flash!',
        emoji: '💣',
        color: '#ffd700'
    },
    render4K: {
        name: 'RENDER 4K',
        desc: '¡Velocidad x2 + invencible!',
        emoji: '⚡',
        color: '#00e5ff'
    }
};

let activePowerup = null;
let powerupTimer = 0;
let flashBombs = 0; // Contador de bombas disponibles

function activatePowerup(type) {
    activePowerup = type;
    powerupTimer = POWERUP_DURATION;
    
    const info = powerupTypes[type];
    createFloatingText(player.x, player.y - 40, `${info.emoji} ${info.name}!`, info.color);
    playSound('powerup');
    
    // Efectos inmediatos según tipo
    if (type === 'render4K') {
        player.invincible = POWERUP_DURATION;
    } else if (type === 'flashBomb') {
        flashBombs = 3;
    }
}

function updatePowerups() {
    if (activePowerup) {
        powerupTimer--;
        if (powerupTimer <= 0) {
            const info = powerupTypes[activePowerup];
            createFloatingText(player.x, player.y - 40, `${info.emoji} terminado`, '#aaa');
            activePowerup = null;
            flashBombs = 0;
        }
    }
}

function shootProjectile() {
    if (player.shootCooldown > 0) return;
    
    if (activePowerup === 'tripleShot') {
        // Disparo triple: central + arriba + abajo
        player.shootCooldown = 15;
        const baseX = player.x + (player.facing === 1 ? 32 : 0);
        const baseY = player.y + 20;
        
        projectiles.push({ x: baseX, y: baseY, vx: player.facing * 12, vy: 0, life: 60, isPower: true });
        projectiles.push({ x: baseX, y: baseY - 10, vx: player.facing * 11, vy: -3, life: 60, isPower: true });
        projectiles.push({ x: baseX, y: baseY + 10, vx: player.facing * 11, vy: 3, life: 60, isPower: true });
        
        playSound('shootPower');
    } else {
        // Disparo normal
        player.shootCooldown = 20;
        projectiles.push({
            x: player.x + (player.facing === 1 ? 32 : 0),
            y: player.y + 20,
            vx: player.facing * 10,
            vy: 0,
            life: 60,
            isPower: false
        });
        playSound('shoot');
    }
}

function detonateFlashBomb() {
    if (flashBombs <= 0) return;
    flashBombs--;
    
    // Explosión en área
    const cx = player.x + 16;
    const cy = player.y + 20;
    
    // Partículas de explosión
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i;
        const dist = Math.random() * POWERUP_FLASH_RADIUS;
        createParticles(
            cx + Math.cos(angle) * dist,
            cy + Math.sin(angle) * dist,
            '#ffd700',
            3
        );
    }
    
    // Daño a enemigos en radio
    for (const e of enemies) {
        const ex = e.x + e.w / 2;
        const ey = e.y + e.h / 2;
        const dist = Math.hypot(ex - cx, ey - cy);
        if (dist < POWERUP_FLASH_RADIUS) {
            e.currentHealth -= 3;
            createParticles(ex, ey, '#ff5722', 5);
        }
    }
    
    // Daño al boss
    if (boss) {
        const bx = boss.x;
        const by = boss.y;
        const dist = Math.hypot(bx - cx, by - cy);
        if (dist < POWERUP_FLASH_RADIUS + 40) {
            boss.currentHealth -= 2;
            createParticles(bx, by, '#ff0000', 8);
        }
    }
    
    createFloatingText(cx, cy - 30, `💣 FLASH! (${flashBombs} rest)`, '#ffd700');
    playSound('explosion');
}

function getPowerupMultiplier() {
    if (activePowerup === 'render4K') return 2;
    return 1;
}

function isInvincible() {
    return activePowerup === 'render4K' && powerupTimer > 0;
}

function drawPowerupHUD() {
    if (!activePowerup) return;
    
    const info = powerupTypes[activePowerup];
    const barWidth = 100;
    const barHeight = 8;
    const x = canvas.width - barWidth - 20;
    const y = 70;
    
    // Fondo
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x - 5, y - 18, barWidth + 10, 30);
    
    // Texto
    ctx.fillStyle = info.color;
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${info.emoji} ${info.name}`, x, y - 5);
    
    // Barra de tiempo
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = info.color;
    ctx.fillRect(x, y, barWidth * (powerupTimer / POWERUP_DURATION), barHeight);
    
    // Bombas restantes
    if (activePowerup === 'flashBomb' && flashBombs > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`💣x${flashBombs}`, canvas.width - 20, y + 25);
    }
}
