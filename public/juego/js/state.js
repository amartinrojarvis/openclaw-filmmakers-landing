// Estado global del juego, canvas y entidades
let canvas, ctx;

function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
}

function resize() {
    if (!canvas) return;
    const container = document.getElementById('gameContainer');
    if (!container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

let gameRunning = false;
let score = 0;
let money = 0; // 💰 Dinero acumulado
let level = 1;
let battery = 100;
let camera = { x: 0, y: 0 };
let frameCount = 0;
let particles = [];
let floatingTexts = [];
let stepTimer = 0;
let projectiles = [];
let victoryState = null;

const player = {
    x: 100, y: 300, width: 32, height: 40,
    vx: 0, vy: 0, onGround: false, facing: 1,
    animFrame: 0, animTimer: 0, invincible: 0,
    state: 'idle', shootCooldown: 0
};

let currentLevel = null;
let platforms = [];
let collectibles = [];
let enemies = [];
let boss = null;

// Power-up del nivel actual
let levelPowerup = null;

// Comportamientos especiales de enemigos
let controlInverted = false;
let controlInvertTimer = 0;
let distractionActive = false;
let distractionTimer = 0;
let enemyProjectiles = []; // Páginas de guion, etc.

function createParticles(x, y, color, count) {
    for (let i = 0; i < (count || 8); i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            color,
            size: Math.random() * 4 + 2
        });
    }
}

function createFloatingText(x, y, text, color) {
    floatingTexts.push({ x, y, text, color, life: 60, vy: -2 });
}

function updateHUD() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('moneyValue').textContent = money;
    document.getElementById('levelValue').textContent = level;
    const progress = (player.x / WORLD_WIDTH) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    const fill = document.getElementById('batteryFill');
    fill.style.width = battery + '%';
    fill.className = 'battery-fill';
    if (battery < 30) fill.classList.add('critical');
    else if (battery < 50) fill.classList.add('low');
}

function showMessage(title, subtitle, btnText, action, extraHTML) {
    gameRunning = false;
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageSubtitle').textContent = subtitle;
    document.getElementById('messageBtn').textContent = btnText;
    document.getElementById('messageExtra').innerHTML = extraHTML || '';
    
    const msg = document.getElementById('message');
    msg.classList.add('active');
    msg.style.display = 'flex';
    
    // NO ocultar controles táctiles - deben estar siempre visibles en móvil
    // Los controles se manejan por CSS con !important
    
    // Configurar botón con listener limpio
    const btn = document.getElementById('messageBtn');
    
    // Clonar para eliminar todos los listeners anteriores
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    // Asignar nuevo listener
    newBtn.onclick = function(e) {
        console.log('Botón clickeado:', btnText);
        e.preventDefault();
        e.stopPropagation();
        
        // OCULTAR MENSAJE ANTES DE EJECUTAR ACCIÓN
        const msg = document.getElementById('message');
        msg.classList.remove('active');
        msg.style.display = 'none';
        
        action();
    };
    
    // También soporte táctil explícito
    newBtn.ontouchstart = function(e) {
        console.log('Botón tocado:', btnText);
        e.preventDefault();
        e.stopPropagation();
        
        // OCULTAR MENSAJE ANTES DE EJECUTAR ACCIÓN
        const msg = document.getElementById('message');
        msg.classList.remove('active');
        msg.style.display = 'none';
        
        action();
    };
}
