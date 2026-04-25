// Punto de entrada: arranca partida, conecta el botón de la pantalla inicial y corre el bucle
function startGame() {
    console.log('startGame() llamado!');
    initAudio();
    gameRunning = true;
    score = 0; level = 1; battery = 100;
    particles = []; floatingTexts = []; projectiles = [];
    enemyProjectiles = [];
    activePowerup = null; powerupTimer = 0; flashBombs = 0;
    controlInverted = false; distractionActive = false;
    loadLevel(1);
    document.getElementById('message').style.display = 'none';
    
    // Mostrar controles táctiles SOLO en móvil (pantalla < 768px)
    const controls = document.getElementById('controls');
    if (controls) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        controls.style.display = isMobile ? 'flex' : 'none';
    }
    
    updateHUD();
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Esperar a que el DOM esté listo antes de inicializar
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    showMessage(
        '¡ACTION! 🎬',
        'Dispara con tu cámara y derrota al Perfeccionismo',
        '¡A GRABAR!',
        startGame
    );
});
