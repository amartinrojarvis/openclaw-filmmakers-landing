// Tick lógico del juego: input -> jugador -> proyectiles -> enemigos -> boss -> nivel
function update() {
    if (!gameRunning) return;
    frameCount++;
    
    updatePowerups();

    if (victoryState) {
        victoryState.timer++;
        if (player.onGround) {
            player.vy = JUMP_FORCE;
            player.onGround = false;
            playSound('jump');
            createParticles(player.x + 16, player.y + 40, '#ffd700', 5);
        }
        applyGravity(player);
        player.y += player.vy;
        checkPlatformCollision(player);
        victoryState.cameraY = Math.min(victoryState.cameraY + 2, 200);
        if (victoryState.timer % 5 === 0) {
            const colors = ['#ffd700', '#e94560', '#4ecca3', '#ff5722', '#2196f3'];
            createParticles(
                Math.random() * canvas.width + camera.x,
                camera.y - 50,
                colors[Math.floor(Math.random() * colors.length)],
                3
            );
        }
        if (victoryState.timer > 300) {
            showVictoryScreen();
            return;
        }
        updateHUD();
        return;
    }

    // ===== INPUT (con posible inversión) =====
    let left  = keys['arrowleft']  || keys['a'];
    let right = keys['arrowright'] || keys['d'];
    const jump  = keys[' ']          || keys['arrowup'] || keys['w'];
    const shoot = keys['z']          || keys['x'] || keys['c'];
    const bomb  = keys['b']          || keys['v'];

    // Influencer: invierte controles
    if (controlInverted) {
        const tmp = left; left = right; right = tmp;
        controlInvertTimer--;
        if (controlInvertTimer <= 0) {
            controlInverted = false;
            createFloatingText(player.x, player.y - 30, '¡Controles restaurados!', '#4caf50');
        }
    }

    // Marketing: distrae con KPIs
    if (distractionActive) {
        distractionTimer--;
        if (distractionTimer <= 0) {
            distractionActive = false;
        }
        // El jugador se mueve ligeramente al azar
        if (Math.random() < 0.1) {
            player.vx += (Math.random() - 0.5) * 2;
        }
    }

    // Disparo (con power-up triple)
    if (shoot && player.shootCooldown <= 0) {
        shootProjectile();
    }
    if (player.shootCooldown > 0) player.shootCooldown--;
    
    // Bomba flash
    if (bomb && activePowerup === 'flashBomb') {
        detonateFlashBomb();
    }

    // Salto
    if (jump && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        player.state = 'jump';
        playSound('jump');
        createParticles(player.x + 16, player.y + 40, '#4ecca3', 5);
    }

    // Movimiento (con multiplicador de velocidad)
    const speedMult = getPowerupMultiplier();
    if (left) {
        player.vx = -MOVE_SPEED * speedMult;
        player.facing = -1;
        if (player.onGround) player.state = 'walk';
    } else if (right) {
        player.vx = MOVE_SPEED * speedMult;
        player.facing = 1;
        if (player.onGround) player.state = 'walk';
    } else {
        player.vx *= 0.8;
        if (player.onGround && Math.abs(player.vx) < 0.5) player.state = 'idle';
    }

    if (!player.onGround && player.vy < 0) player.state = 'jump';
    if (!player.onGround && player.vy > 0) player.state = 'fall';

    applyGravity(player);
    player.x += player.vx;
    player.y += player.vy;

    player.animTimer++;
    if (player.animTimer > 6) {
        player.animTimer = 0;
        player.animFrame = (player.animFrame + 1) % 4;
    }

    if (player.onGround && Math.abs(player.vx) > 1) {
        stepTimer++;
        if (stepTimer > 15) { stepTimer = 0; playSound('step'); }
    }

    // Invencibilidad de Render 4K
    if (isInvincible()) {
        player.invincible = Math.max(player.invincible, 1);
    } else if (player.invincible > 0) {
        player.invincible--;
    }

    const playerPlat = checkPlatformCollision(player);
    if (playerPlat && player.state === 'fall') player.state = 'idle';

    if (player.y > canvas.height + 200) {
        battery -= 20;
        player.x = 100; player.y = 300;
        player.vy = 0; player.state = 'idle';
        createFloatingText(canvas.width/2, canvas.height/2, '¡Caíste! -20% 🔋', '#e94560');
    }

    if (player.x < 0) player.x = 0;
    if (player.x > WORLD_WIDTH - player.width) player.x = WORLD_WIDTH - player.width;

    camera.x = player.x - canvas.width * 0.3;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > WORLD_WIDTH - canvas.width) camera.x = WORLD_WIDTH - canvas.width;

    // ===== PROYECTILES DEL JUGADOR =====
    projectiles = projectiles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life--;
        for (const e of enemies) {
            if (p.x > e.x && p.x < e.x + e.w && p.y > e.y && p.y < e.y + e.h) {
                e.currentHealth--;
                p.life = 0;
                playSound('hit');
                createParticles(e.x + e.w/2, e.y + e.h/2, '#e94560', 5);
                if (e.currentHealth <= 0) {
                    createFloatingText(e.x, e.y, '¡Eliminado!', '#e94560');
                    score += 50;
                    // Deadline: explota al morir
                    if (e.type === 'deadline') {
                        detonateEnemyExplosion(e.x + e.w/2, e.y + e.h/2);
                    }
                }
                return false;
            }
        }
        if (boss && p.x > boss.x - boss.w/2 && p.x < boss.x + boss.w/2 &&
            p.y > boss.y - boss.h/2 && p.y < boss.y + boss.h/2) {
            boss.currentHealth--;
            p.life = 0;
            playSound('hit');
            createParticles(p.x, p.y, '#ff0000', 8);
            if (boss.currentHealth <= 0) {
                createFloatingText(boss.x, boss.y - 50, '¡JEFE DERROTADO!', '#ffd700');
                score += 500;
                boss = null;
                victoryState = { timer: 0, cameraY: camera.y };
                playSound('victory');
            }
            return false;
        }
        return p.life > 0;
    });

    enemies = enemies.filter(e => e.currentHealth > 0);

    // ===== COLECCIONABLES =====
    for (const c of collectibles) {
        if (!c.collected &&
            player.x < c.x + 30 && player.x + player.width > c.x &&
            player.y < c.y + 30 && player.y + player.height > c.y) {
            c.collected = true;
            score += c.value;
            if (c.type === 'battery') battery = Math.min(100, battery + 25);
            playSound('collect');
            createParticles(c.x + 15, c.y + 15, '#ffd700', 10);
            createFloatingText(c.x, c.y - 20, '+' + c.value, '#ffd700');
        }
        c.floatY = Math.sin(frameCount * 0.05 + c.x) * 5;
    }

    // ===== POWER-UP DEL NIVEL =====
    if (levelPowerup && !levelPowerup.collected && !levelPowerup.hidden) {
        const px = levelPowerup.x - 15;
        const py = levelPowerup.y - 15;
        if (player.x < px + 30 && player.x + player.width > px &&
            player.y < py + 30 && player.y + player.height > py) {
            levelPowerup.collected = true;
            activatePowerup(levelPowerup.type);
        }
    }

    // ===== PROYECTILES DE ENEMIGOS =====
    enemyProjectiles = enemyProjectiles.filter(ep => {
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.angle = (ep.angle || 0) + 0.1;
        ep.life--;
        
        // Colisión con jugador
        if (player.invincible === 0 &&
            ep.x > player.x && ep.x < player.x + player.width &&
            ep.y > player.y && ep.y < player.y + player.height) {
            battery -= 10;
            player.vy = -8;
            player.invincible = 40;
            player.state = 'hurt';
            playSound('hurt');
            createParticles(player.x + 16, player.y + 20, '#e94560', 5);
            createFloatingText(player.x, player.y - 30, '¡Página! -10% 🔋', '#e94560');
            return false;
        }
        return ep.life > 0;
    });

    // ===== FÍSICAS + IA DE ENEMIGOS =====
    for (const e of enemies) {
        let currentPlat = null;
        for (const plat of platforms) {
            if (plat.type === 'block' || plat.type === 'pipe') continue;
            const footX = e.x + e.w/2;
            const footY = e.y + e.h;
            if (footX >= plat.x && footX <= plat.x + plat.w &&
                footY >= plat.y - 2 && footY <= plat.y + plat.h + 2) {
                currentPlat = plat;
                break;
            }
        }

        if (currentPlat) {
            // Comportamientos especiales
            switch (e.behavior) {
                case 'erratic':
                    // Actor Divo: movimiento errático
                    if (Math.random() < 0.05) {
                        e.vx = (Math.random() - 0.5) * e.speed * 4;
                    }
                    break;
                case 'shooter':
                    // Guionista: lanza páginas
                    e.shootTimer++;
                    if (e.shootTimer > 120) {
                        e.shootTimer = 0;
                        const dir = player.x > e.x ? 1 : -1;
                        enemyProjectiles.push({
                            x: e.x + e.w/2,
                            y: e.y,
                            vx: dir * 4,
                            vy: -2,
                            life: 90,
                            angle: 0
                        });
                    }
                    break;
                case 'stealer':
                    // Presupuesto Agotado: roba puntos al tocar
                    if (Math.random() < 0.01 && score > 0) {
                        score = Math.max(0, score - 5);
                        createFloatingText(e.x, e.y - 20, '-5', '#ff5722');
                    }
                    break;
                case 'inverter':
                    // Influencer: invierte controles al tocar
                    break; // Se maneja en colisión
                case 'distractor':
                    // Marketing: distrae cuando está cerca
                    const distToPlayer = Math.hypot(
                        (e.x + e.w/2) - (player.x + 16),
                        (e.y + e.h/2) - (player.y + 20)
                    );
                    if (distToPlayer < 250 && Math.random() < 0.02) {
                        distractionActive = true;
                        distractionTimer = 120;
                        createFloatingText(player.x, player.y - 40, '📊 ¡KPI!', '#607d8b');
                    }
                    break;
            }

            e.x += e.vx;
            const centerX = e.x + e.w/2;
            const wouldExceedRange = centerX > e.startX + e.range || centerX < e.startX - e.range;
            const aheadX = e.vx > 0 ? e.x + e.w + 5 : e.x - 5;
            const groundAhead = platforms.some(plat => {
                if (plat.type === 'block' || plat.type === 'pipe') return false;
                return aheadX >= plat.x && aheadX <= plat.x + plat.w &&
                       Math.abs(plat.y - currentPlat.y) < 5;
            });

            if (wouldExceedRange || !groundAhead) {
                e.vx *= -1;
                e.direction *= -1;
            }
            e.y = currentPlat.y - e.h;
        } else {
            e.y += 3;
            if (e.y > canvas.height + 100) {
                e.x = e.startX;
                e.y = 100;
                e.vx = e.speed * e.direction;
            }
        }

        e.animTimer = (e.animTimer || 0) + 1;
        if (e.animTimer > 8) {
            e.animTimer = 0;
            e.animFrame = (e.animFrame || 0) + 1;
        }

        // Colisión con jugador
        if (player.invincible === 0 &&
            player.x < e.x + e.w && player.x + player.width > e.x &&
            player.y < e.y + e.h && player.y + player.height > e.y) {
            
            let damage = 15;
            let knockbackX = player.x < e.x ? -8 : 8;
            let knockbackY = -10;
            let message = '¡Ouch! -15% 🔋';
            let msgColor = '#e94560';
            let invTime = 60;
            
            // Daños especiales
            switch (e.behavior) {
                case 'stealer':
                    score = Math.max(0, score - 50);
                    message = '¡-50 puntos! 💸';
                    msgColor = '#ff5722';
                    break;
                case 'inverter':
                    controlInverted = true;
                    controlInvertTimer = 180;
                    message = '¡Controles invertidos! 📱';
                    msgColor = '#9c27b0';
                    break;
                case 'bomber':
                    damage = 25;
                    message = '¡BOOM! -25% 🔋';
                    msgColor = '#f44336';
                    detonateEnemyExplosion(e.x + e.w/2, e.y + e.h/2);
                    e.currentHealth = 0; // Se destruye al explotar
                    break;
            }
            
            battery -= damage;
            player.vy = knockbackY;
            player.vx = knockbackX;
            player.invincible = invTime;
            player.state = 'hurt';
            playSound('hurt');
            createParticles(player.x + 16, player.y + 20, msgColor, 8);
            createFloatingText(player.x, player.y - 30, message, msgColor);
        }
    }

    // ===== FÍSICAS DEL BOSS (PERFECCIONISMO) =====
    if (boss) {
        // Movimiento circular flotante
        boss.angle += boss.floatSpeed || 0.02;
        const radius = boss.radius || 100;
        boss.x = boss.startX + Math.cos(boss.angle) * radius;
        boss.y = boss.startY + Math.sin(boss.angle * 1.3) * (radius * 0.5); // Elipse
        
        // Movimiento aleatorio adicional
        if (Math.random() < 0.02) {
            boss.vx = (Math.random() - 0.5) * 4;
            boss.vy = (Math.random() - 0.5) * 4;
        }
        
        // Aplicar velocidad aleatoria
        boss.x += boss.vx || 0;
        boss.y += boss.vy || 0;
        
        // Frenar gradualmente
        if (boss.vx) boss.vx *= 0.95;
        if (boss.vy) boss.vy *= 0.95;
        
        // Disparar correcciones periódicamente
        boss.shootTimer = (boss.shootTimer || 0) + 1;
        if (boss.shootTimer > (boss.shootInterval || 120)) {
            boss.shootTimer = 0;
            const types = boss.projectileTypes || ['Corrección de color', 'Cambio de música', 'Nueva transición'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Disparar hacia el jugador
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const dist = Math.hypot(dx, dy);
            const speed = 3;
            
            enemyProjectiles.push({
                x: boss.x,
                y: boss.y,
                vx: (dx / dist) * speed,
                vy: (dy / dist) * speed,
                life: 180,
                type: type,
                isBossProjectile: true
            });
            
            createFloatingText(boss.x, boss.y - 30, type, '#e94560');
            playSound('shoot');
        }
        
        // Colisión con jugador
        if (player.invincible === 0 &&
            player.x < boss.x + boss.w/2 && player.x + player.width > boss.x - boss.w/2 &&
            player.y < boss.y + boss.h/2 && player.y + player.height > boss.y - boss.h/2) {
            battery -= 25;
            player.vy = -12;
            player.vx = player.x < boss.x ? -10 : 10;
            player.invincible = 90;
            player.state = 'hurt';
            playSound('hurt');
            createParticles(player.x + 16, player.y + 20, '#ff0000', 12);
            createFloatingText(player.x, player.y - 40, '¡PERFECCIONISMO! -25% 🔋', '#ff0000');
        }
    }

    if (frameCount % 120 === 0) battery -= 0.3;
    if (battery <= 0) {
        showMessage('¡Batería agotada! 🔋', 'Tu cámara se ha quedado sin pila...', 'Reintentar', startGame);
    }

    // Avance de nivel - Checkpoint con pago
    if (currentLevel && player.x > currentLevel.checkpointX && !victoryState) {
        if (level < 3) {
            // Mostrar mensaje de trabajo completado con pago
            const payment = currentLevel.payment || 500;
            score += payment;
            money += payment; // 💰 Añadir al dinero acumulado
            playSound('checkpoint'); // 🎵 Música triumfal
            createParticles(player.x, player.y - 50, '#ffd700', 20);
            createFloatingText(player.x, player.y - 80, `¡Nivel ${level} completado!`, '#ffd700');
            
            // Ocultar mensaje anterior si existe
            const msg = document.getElementById('message');
            msg.classList.remove('active');
            msg.style.display = 'none';
            
            showMessage(
                `¡Trabajo completado! 🎬`,
                `Has entregado el proyecto de ${currentLevel.name}`,
                'Siguiente proyecto →',
                () => {
                    // Ocultar mensaje antes de cargar siguiente nivel
                    const msg = document.getElementById('message');
                    msg.classList.remove('active');
                    msg.style.display = 'none';
                    
                    level++;
                    loadLevel(level);
                    gameRunning = true;
                    gameLoop();
                }
            );
        } else if (level === 3 && !boss) {
            // Victoria final
            victoryState = { timer: 0, cameraY: camera.y };
            playSound('victory');
        }
    }

    particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        return p.life > 0;
    });

    floatingTexts = floatingTexts.filter(t => {
        t.y += t.vy; t.life--;
        return t.life > 0;
    });

    updateHUD();
}

// Explosión de deadline
function detonateEnemyExplosion(x, y) {
    createParticles(x, y, '#ff5722', 20);
    createParticles(x, y, '#ffd700', 15);
    createFloatingText(x, y - 30, '💥 DEADLINE!', '#f44336');
    playSound('explosion');
    
    // Daño en área
    const radius = 80;
    if (Math.hypot((player.x + 16) - x, (player.y + 20) - y) < radius) {
        battery -= 20;
        player.vy = -15;
        player.invincible = 60;
        createFloatingText(player.x, player.y - 40, '¡Explosión! -20% 🔋', '#f44336');
    }
}
