// Generador procedural de niveles - cada partida es diferente
// 3 temas: Pre-producción, Rodaje, Post-producción

const LEVEL_THEMES = [
    { name: "Pre-producción", bg: '#16213e', accent: '#e94560' },
    { name: "Rodaje", bg: '#1a1a2e', accent: '#4ecca3' },
    { name: "Post-producción", bg: '#0f0f23', accent: '#ffd700' }
];

const ENEMY_POOLS = [
    // Nivel 1: TODOS los enemigos (menos boss)
    ['clientePesado', 'cambioInesperado', 'hacienda', 'guionista', 'actorDivo', 
     'presupuestoAgotado', 'deadline', 'influencer', 'marketing'],
    // Nivel 2: TODOS los enemigos
    ['clientePesado', 'cambioInesperado', 'hacienda', 'guionista', 'actorDivo', 
     'presupuestoAgotado', 'deadline', 'influencer', 'marketing'],
    // Nivel 3: TODOS los enemigos + boss
    ['clientePesado', 'cambioInesperado', 'hacienda', 'guionista', 'actorDivo', 
     'presupuestoAgotado', 'deadline', 'influencer', 'marketing']
];

const COLLECTIBLE_TYPES = [
    'camera', 'lens', 'sd', 'battery', 'drone', 'gimbal', 'mic', 
    'light', 'tripod', 'clapper', 'coffee', 'script', 'award', 
    'oscar', 'ssd', 'preset', 'timeline', 'render', 'export', 
    'color', 'vfx', 'premiere'
];

// Recompensas por nivel (puntuación)
const LEVEL_PAYMENTS = [500, 800, 1200];

function generateLevel(levelNum) {
    const theme = LEVEL_THEMES[levelNum - 1];
    const enemyPool = ENEMY_POOLS[levelNum - 1];
    // Niveles más cortos: 2000, 2500, 3000
    const worldWidth = 2000 + levelNum * 500;
    const groundY = 450;
    
    const level = {
        name: theme.name,
        platforms: [],
        collectibles: [],
        enemies: [],
        boss: null,
        powerup: null,
        theme: theme,
        payment: LEVEL_PAYMENTS[levelNum - 1],
        checkpointX: worldWidth - 200 // Checkpoint al final
    };
    
    // ===== SUELO PRINCIPAL (segmentado) =====
    const segmentWidth = 200 + Math.random() * 300;
    let currentX = 0;
    while (currentX < worldWidth) {
        const w = Math.min(segmentWidth + Math.random() * 200, worldWidth - currentX);
        level.platforms.push({
            x: currentX,
            y: groundY,
            w: w,
            h: 40
        });
        // Hueco entre plataformas (más grande en niveles altos)
        const gap = 80 + Math.random() * (60 + levelNum * 20);
        currentX += w + gap;
    }
    
    // ===== PLATAFORMAS ELEVADAS =====
    const platformCount = 6 + levelNum * 2;
    for (let i = 0; i < platformCount; i++) {
        const x = 300 + Math.random() * (worldWidth - 600);
        const y = 150 + Math.random() * 250;
        const w = 80 + Math.random() * 120;
        
        // Verificar que no se superponga con otras plataformas
        let overlaps = false;
        for (const p of level.platforms) {
            if (Math.abs(p.x - x) < (p.w + w) / 2 + 20 && Math.abs(p.y - y) < 60) {
                overlaps = true;
                break;
            }
        }
        
        if (!overlaps) {
            level.platforms.push({ x, y, w, h: 30 });
        }
    }
    
    // ===== BLOQUES (elementos de filmmaking) - AHORA SON PLATAFORMAS SÓLIDAS =====
    const blockCount = 3 + levelNum * 2;
    for (let i = 0; i < blockCount; i++) {
        const x = 400 + Math.random() * (worldWidth - 800);
        const y = 180 + Math.random() * 200;
        // Grupos de 2-4 bloques
        const groupSize = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < groupSize; j++) {
            level.platforms.push({
                x: x + j * 40,
                y: y,
                w: 40,
                h: 40,
                type: 'block',
                sprite: ['maleta', 'lente', 'bateria', 'tarjeta'][Math.floor(Math.random() * 4)],
                solid: true  // ← AHORA ES SÓLIDO
            });
        }
    }
    
    // ===== TUBERÍAS (equipos de filmmaking) - AHORA SON PLATAFORMAS SÓLIDAS =====
    const pipeCount = 2 + levelNum;
    for (let i = 0; i < pipeCount; i++) {
        const x = 500 + Math.random() * (worldWidth - 1000);
        level.platforms.push({
            x: x,
            y: groundY - 60,
            w: 60,
            h: 60,
            type: 'pipe',
            sprite: ['truss', 'c-stand', 'monitor', 'softbox'][Math.floor(Math.random() * 4)],
            solid: true  // ← AHORA ES SÓLIDO
        });
    }
    
    // ===== COLECCIONABLES =====
    const collectibleCount = 6 + levelNum * 2;
    for (let i = 0; i < collectibleCount; i++) {
        const plat = level.platforms[Math.floor(Math.random() * level.platforms.length)];
        const type = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
        const value = type === 'oscar' || type === 'premiere' ? 1000 :
                      type === 'award' || type === 'clapper' ? 500 :
                      type === 'drone' || type === 'ssd' ? 300 :
                      type === 'gimbal' || type === 'render' ? 250 :
                      type === 'lens' || type === 'battery' ? 200 :
                      type === 'light' || type === 'script' ? 200 :
                      type === 'coffee' ? 50 : 100;
        
        level.collectibles.push({
            x: plat.x + Math.random() * (plat.w - 30),
            y: plat.y - 40 - Math.random() * 60,
            type: type,
            value: value
        });
    }
    
    // ===== POWER-UP ESCONDIDO (1 por nivel) =====
    const powerupTypesList = ['tripleShot', 'flashBomb', 'render4K'];
    const hiddenPlat = level.platforms[Math.floor(Math.random() * level.platforms.length)];
    level.powerup = {
        x: hiddenPlat.x + hiddenPlat.w / 2,
        y: hiddenPlat.y - 50,
        type: powerupTypesList[Math.floor(Math.random() * powerupTypesList.length)],
        collected: false,
        hidden: true // Aparece al acercarse
    };
    
    // ===== ENEMIGOS =====
    const enemyCount = 4 + levelNum * 2;
    const SAFE_ZONE = 400; // Zona segura al inicio (sin enemigos)
    
    console.log(`Generando nivel ${levelNum}, pool:`, enemyPool);
    
    for (let i = 0; i < enemyCount; i++) {
        const type = enemyPool[Math.floor(Math.random() * enemyPool.length)];
        
        // Elegir plataforma que no esté en zona segura ni sea bloque/tubería
        let plat;
        let attempts = 0;
        do {
            plat = level.platforms[Math.floor(Math.random() * level.platforms.length)];
            attempts++;
        } while ((plat.x < SAFE_ZONE || plat.type === 'block' || plat.type === 'pipe') && attempts < 50);
        
        if (attempts >= 50) {
            console.log(`No se encontró plataforma válida para enemigo ${type}`);
            continue;
        }
        
        const enemy = createEnemy(type, plat.x + Math.random() * plat.w, plat.y);
        if (enemy) {
            console.log(`Enemigo creado: ${type} en x=${enemy.x}`);
            level.enemies.push(enemy);
        }
    }
    
    console.log(`Total enemigos en nivel ${levelNum}:`, level.enemies.length);
    
    // ===== BOSS (solo nivel 3) =====
    if (levelNum === 3) {
        level.boss = {
            x: worldWidth - 300,
            y: 200,
            w: 80,
            h: 80,
            vx: 0,
            vy: 0,
            startX: worldWidth - 300,
            startY: 200,
            currentHealth: 20,
            health: 20,
            type: 'perfeccionismo',
            // Físicas de flotación circular
            angle: 0,
            radius: 100,
            floatSpeed: 0.02,
            // Disparos
            shootTimer: 0,
            shootInterval: 120, // Cada 2 segundos aprox
            projectileTypes: ['Corrección de color', 'Cambio de música', 'Nueva transición']
        };
    }
    
    // ===== CHECKPOINT / META =====
    // Añadir plataforma de checkpoint al final
    level.platforms.push({
        x: worldWidth - 150,
        y: groundY - 20,
        w: 150,
        h: 20,
        type: 'checkpoint'
    });
    
    return level;
}

function createEnemy(type, x, y) {
    const configs = {
        clientePesado: {
            w: 36, h: 40, speed: 0.8, range: 150, health: 5,
            name: 'Cliente Pesado', color: '#0d47a1'
        },
        cambioInesperado: {
            w: 32, h: 36, speed: 2.5, range: 180, health: 2,
            name: 'Cambio Inesperado', color: '#4a148c'
        },
        hacienda: {
            w: 34, h: 38, speed: 1.5, range: 180, health: 4,
            name: 'Hacienda', color: '#1b5e20'
        },
        guionista: {
            w: 30, h: 38, speed: 1.2, range: 200, health: 3,
            name: 'El Guionista', color: '#795548',
            behavior: 'shooter' // Lanza páginas
        },
        actorDivo: {
            w: 28, h: 40, speed: 3.5, range: 250, health: 2,
            name: 'Actor Divo', color: '#e91e63',
            behavior: 'erratic' // Movimiento errático
        },
        presupuestoAgotado: {
            w: 40, h: 34, speed: 1.0, range: 120, health: 6,
            name: 'Presupuesto Agotado', color: '#ff5722',
            behavior: 'stealer' // Roba puntos
        },
        deadline: {
            w: 32, h: 32, speed: 0.5, range: 80, health: 1,
            name: 'Deadline', color: '#f44336',
            behavior: 'bomber' // Explota al morir
        },
        influencer: {
            w: 30, h: 36, speed: 2.0, range: 200, health: 3,
            name: 'Influencer', color: '#9c27b0',
            behavior: 'inverter' // Invierte controles
        },
        marketing: {
            w: 36, h: 38, speed: 1.0, range: 300, health: 4,
            name: 'El de Marketing', color: '#607d8b',
            behavior: 'distractor' // Distrae con KPIs
        }
    };
    
    const cfg = configs[type];
    if (!cfg) return null;
    
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    return {
        x: x - cfg.w / 2,
        y: y - cfg.h,
        w: cfg.w,
        h: cfg.h,
        vx: cfg.speed * direction,
        vy: 0,
        speed: cfg.speed,
        range: cfg.range,
        startX: x,
        direction: direction,
        type: type,
        health: cfg.health,
        currentHealth: cfg.health,
        name: cfg.name,
        color: cfg.color,
        behavior: cfg.behavior || 'walker',
        animFrame: 0,
        animTimer: 0,
        shootTimer: 0
    };
}

// Semilla para reproducibilidad (opcional)
let randomSeed = null;

function setRandomSeed(seed) {
    randomSeed = seed;
}

function seededRandom() {
    if (randomSeed === null) return Math.random();
    randomSeed = (randomSeed * 16807 + 0) % 2147483647;
    return (randomSeed - 1) / 2147483646;
}
