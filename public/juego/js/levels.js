// Cargador de niveles - ahora usa generación procedural
function loadLevel(n) {
    level = n;
    const generated = generateLevel(n);
    
    currentLevel = generated;
    platforms = generated.platforms;
    collectibles = generated.collectibles;
    enemies = generated.enemies;
    boss = generated.boss;
    levelPowerup = generated.powerup;
    
    // Reset player
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.state = 'idle';
    player.invincible = 0;
    
    // Reset powerups
    activePowerup = null;
    powerupTimer = 0;
    flashBombs = 0;
    controlInverted = false;
    controlInvertTimer = 0;
    distractionActive = false;
    distractionTimer = 0;
    enemyProjectiles = [];
    
    frameCount = 0;
    camera.x = 0;
    
    // Ajustar WORLD_WIDTH según el nivel generado
    const maxX = Math.max(...platforms.map(p => p.x + p.w), 0);
    WORLD_WIDTH = Math.max(maxX + 500, 3000);
}
