// Pintado del frame: fondo, plataformas, items, enemigos, jugador, partículas, UI in-canvas
function draw() {
    // Fondo según tema del nivel
    const bg = currentLevel && currentLevel.theme ? currentLevel.theme.bg : '#16213e';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas de fondo (paralax muy sutil)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 50; i++) {
        ctx.fillRect((i * 73 + frameCount * 0.1) % canvas.width, (i * 37) % canvas.height, 2, 2);
    }

    ctx.save();
    ctx.translate(-camera.x, victoryState ? -victoryState.cameraY : 0);

    // Plataformas
    for (const plat of platforms) {
        if (plat.type === 'block') {
            // Dibujar sprite de filmmaking según tipo
            drawFilmmakingBlock(plat.x, plat.y, plat.w, plat.h, plat.sprite);
        } else if (plat.type === 'pipe') {
            // Dibujar equipo de filmmaking
            drawFilmmakingPipe(plat.x, plat.y, plat.w, plat.h, plat.sprite);
        } else if (plat.type === 'checkpoint') {
            // Dibujar checkpoint de meta
            drawCheckpoint(plat.x, plat.y, plat.w, plat.h);
        } else {
            ctx.fillStyle = '#0f3460';
            ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
            ctx.fillStyle = '#e94560';
            ctx.fillRect(plat.x, plat.y, plat.w, 4);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            for (let i = 0; i < plat.w; i += 20) {
                ctx.fillRect(plat.x + i, plat.y + 10, 1, plat.h - 15);
            }
        }
    }

    // Power-up escondido (aparece al acercarse)
    if (levelPowerup && !levelPowerup.collected) {
        const distToPlayer = Math.hypot(
            (levelPowerup.x - 15) - (player.x + 16),
            (levelPowerup.y - 15) - (player.y + 20)
        );
        // Revelar cuando el jugador está cerca
        if (distToPlayer < 200) {
            levelPowerup.hidden = false;
        }
        if (!levelPowerup.hidden) {
            const glow = Math.sin(frameCount * 0.1) * 5;
            ctx.fillStyle = `rgba(255,215,0,${0.3 + Math.sin(frameCount * 0.1) * 0.2})`;
            ctx.beginPath();
            ctx.arc(levelPowerup.x, levelPowerup.y, 25 + glow, 0, Math.PI * 2);
            ctx.fill();
            drawSpriteItem(levelPowerup.x, levelPowerup.y, levelPowerup.type, 30);
            // Etiqueta
            const info = powerupTypes[levelPowerup.type];
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`? ${info.emoji} ?`, levelPowerup.x, levelPowerup.y - 20);
        }
    }

    // Coleccionables con etiqueta siempre visible
    for (const c of collectibles) {
        if (!c.collected) {
            const y = c.y + c.floatY;
            drawSpriteItem(c.x + 15, y + 15, c.type, 30);
            const label = itemLabels[c.type];
            if (label) {
                ctx.font = 'bold 10px Arial';
                const textWidth = ctx.measureText(label.name).width;
                const padding = 4;
                const boxWidth = textWidth + padding * 2;
                const boxHeight = 16;
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(c.x + 15 - boxWidth/2, y - 25, boxWidth, boxHeight);
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1;
                ctx.strokeRect(c.x + 15 - boxWidth/2, y - 25, boxWidth, boxHeight);
                ctx.fillStyle = '#ffd700';
                ctx.textAlign = 'center';
                ctx.fillText(label.name, c.x + 15, y - 14);
            }
        }
    }

    // Enemigos con etiqueta y barra de vida
    for (const e of enemies) {
        const facing = e.vx > 0 ? 1 : -1;
        const centerX = e.x + e.w/2;
        const centerY = e.y + e.h/2;
        switch (e.type) {
            case 'clientePesado':
                drawSpriteEnemyClientePesado(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'cambioInesperado':
                drawSpriteEnemyCambioInesperado(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'hacienda':
                drawSpriteEnemyHacienda(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'guionista':
                drawSpriteEnemyGuionista(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'actorDivo':
                drawSpriteEnemyActorDivo(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'presupuestoAgotado':
                drawSpriteEnemyPresupuestoAgotado(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'deadline':
                drawSpriteEnemyDeadline(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'influencer':
                drawSpriteEnemyInfluencer(centerX, centerY, 30, facing, e.animFrame);
                break;
            case 'marketing':
                drawSpriteEnemyMarketing(centerX, centerY, 30, facing, e.animFrame);
                break;
        }
        drawEnemyLabel(centerX, e.y - 10, enemyLabels[e.type]);
        if (e.currentHealth < e.health) {
            ctx.fillStyle = '#333';
            ctx.fillRect(e.x, e.y - 25, e.w, 4);
            ctx.fillStyle = '#e94560';
            ctx.fillRect(e.x, e.y - 25, e.w * (e.currentHealth / e.health), 4);
        }
    }

    // Proyectiles de enemigos (páginas de guion, etc.)
    for (const ep of enemyProjectiles) {
        ctx.save();
        ctx.translate(ep.x, ep.y);
        ctx.rotate(ep.angle || 0);
        
        if (ep.isBossProjectile) {
            // Proyectiles del boss: Corrección de color, etc.
            ctx.fillStyle = '#e94560';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✏️', 0, 3);
            
            // Mostrar tipo de corrección en 2 líneas para textos largos
            if (ep.type) {
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                const words = ep.type.split(' ');
                if (words.length > 1 && ep.type.length > 8) {
                    // Dividir en 2 líneas
                    const mid = Math.ceil(words.length / 2);
                    const line1 = words.slice(0, mid).join(' ');
                    const line2 = words.slice(mid).join(' ');
                    ctx.fillText(line1, 0, -22);
                    ctx.fillText(line2, 0, -12);
                } else {
                    ctx.fillText(ep.type, 0, -18);
                }
            }
        } else {
            // Proyectiles normales (páginas)
            ctx.fillStyle = '#fff';
            ctx.fillRect(-8, -5, 16, 10);
            ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
            ctx.strokeRect(-8, -5, 16, 10);
            // Líneas de texto
            ctx.fillStyle = '#333';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(-6, -3 + i * 3, 12, 1);
            }
        }
        ctx.restore();
    }

    // Boss: Perfeccionismo
    if (boss) {
        drawSpriteEnemyPerfeccionismo(boss.x, boss.y, 60, boss.currentHealth, frameCount);
        drawEnemyLabel(boss.x, boss.y - boss.h/2 - 15, enemyLabels['perfeccionismo']);
    }

    // Proyectiles del jugador
    for (const p of projectiles) {
        ctx.fillStyle = p.isPower ? '#e94560' : '#ffd700';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isPower ? 8 : 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isPower ? 4 : 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.isPower ? 'rgba(233,69,96,0.3)' : 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isPower ? 20 : 15, 0, Math.PI * 2); ctx.fill();
    }

    // Jugador
    drawAnimatedPlayer();

    // Efecto de invencibilidad (Render 4K)
    if (isInvincible()) {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5 + Math.sin(frameCount * 0.3) * 0.3;
        ctx.beginPath();
        ctx.arc(player.x + 16, player.y + 20, 35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // Efecto de controles invertidos
    if (controlInverted) {
        ctx.fillStyle = 'rgba(156,39,176,0.2)';
        ctx.fillRect(player.x - 10, player.y - 10, player.width + 20, player.height + 20);
        ctx.fillStyle = '#9c27b0';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⇄', player.x + 16, player.y - 15);
    }

    // Efecto de distracción (Marketing)
    if (distractionActive) {
        ctx.fillStyle = 'rgba(96,125,139,0.15)';
        ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
        ctx.fillStyle = '#607d8b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        const kpis = ['CTR: 420%', 'Bounce: -69%', 'ROI: ∞', 'CPC: NaN'];
        const kpi = kpis[Math.floor(frameCount / 30) % kpis.length];
        ctx.fillText(`📊 ${kpi}`, camera.x + canvas.width/2, camera.y + 100);
    }

    // Partículas
    for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    // Textos flotantes
    for (const t of floatingTexts) {
        ctx.fillStyle = t.color;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.globalAlpha = t.life / 60;
        ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Cartel del nivel
    if (currentLevel && frameCount < 180 && !victoryState) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const accent = currentLevel.theme ? currentLevel.theme.accent : '#e94560';
        ctx.fillStyle = accent;
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentLevel.name, canvas.width/2, canvas.height/2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('¡Usa tu cámara contra los enemigos!', canvas.width/2, canvas.height/2 + 20);
    }

    // Overlay de victoria
    if (victoryState) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        const bounce = Math.sin(victoryState.timer * 0.1) * 10;
        ctx.fillText('¡VICTORIA!', canvas.width/2, canvas.height/3 + bounce);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('¡El Perfeccionismo ha caído!', canvas.width/2, canvas.height/3 + 50);
    }

    // HUD de power-ups
    drawPowerupHUD();
}

function drawCheckpoint(x, y, w, h) {
    // Base dorada brillante
    const glow = Math.sin(frameCount * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
    ctx.fillRect(x, y, w, h);
    
    // Borde brillante
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    
    // Texto "META"
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏁 META', x + w/2, y + h/2 + 5);
    
    // Icono de meta
    ctx.font = '20px Arial';
    ctx.fillText('🏆', x + w/2, y - 10);
}

function showVictoryScreen() {
    const extraHTML = `
        <div style="margin-top:15px;padding:25px;border:3px solid #ffd700;border-radius:20px;background:linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(233,69,96,0.1) 100%);box-shadow:0 0 30px rgba(255,215,0,0.3);">
            <div style="font-size:40px;margin-bottom:5px;">🔑</div>
            <div style="font-size:14px;color:#ffd700;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;">Llave Maestra Desbloqueada</div>
            
            <div style="font-size:42px;color:#fff;font-weight:bold;letter-spacing:5px;margin:15px 0;padding:15px 25px;background:rgba(0,0,0,0.6);border-radius:12px;border:2px dashed #ffd700;text-shadow:0 0 10px rgba(255,215,0,0.5);">IAF50</div>
            
            <div style="font-size:20px;color:#ffd700;font-weight:bold;margin:10px 0;">50% DE DESCUENTO</div>
            
            <div style="font-size:13px;color:#ccc;margin:15px 0;line-height:1.6;">
                "Dominar este juego es solo el principio.<br>
                El siguiente nivel como filmmaker<br>
                te espera en <span style="color:#e94560;font-weight:bold;">iaparafilmmakers.es</span>"
            </div>
            
            <a href="https://www.iaparafilmmakers.es/#pricing" target="_blank" style="display:inline-block;margin-top:10px;padding:14px 35px;background:linear-gradient(90deg, #e94560, #ff6b6b);color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(233,69,96,0.4);transition:all 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">🚀 Desbloquear mi potencial →</a>
        </div>
        
        <div style="margin-top:20px;font-size:13px;color:#888;font-style:italic;">
            Tu legado como filmmaker acaba de comenzar... 🎬
        </div>
        
        <div style="margin-top:15px;padding:10px;background:rgba(78,204,163,0.1);border-radius:8px;border:1px solid rgba(78,204,163,0.3);">
            <div style="font-size:14px;color:#ffd700;">⭐ Puntuación final: <strong>${score}</strong></div>
        </div>
    `;
    showMessage('🎬 ¡PRODUCCIÓN COMPLETADA! 🎬', 'Has vencido al Perfeccionismo y demostrado que eres un filmmaker de élite', 'Jugar de nuevo', restartGame, extraHTML);
}

function restartGame() {
    console.log('restartGame() llamado!');
    // Reinicio COMPLETO
    score = 0;
    money = 0;
    level = 1;
    battery = 100;
    particles = [];
    floatingTexts = [];
    projectiles = [];
    enemyProjectiles = [];
    activePowerup = null;
    powerupTimer = 0;
    flashBombs = 0;
    controlInverted = false;
    controlInvertTimer = 0;
    distractionActive = false;
    distractionTimer = 0;
    victoryState = null;
    
    // Ocultar mensaje
    const msg = document.getElementById('message');
    msg.classList.remove('active');
    msg.style.display = 'none';
    
    // NO tocar controles táctiles - CSS los maneja con !important
    
    initAudio();
    gameRunning = true;
    loadLevel(1);
    updateHUD();
    gameLoop();
}

// ===== SPRITES DE FILMMAKING =====
function drawFilmmakingBlock(x, y, w, h, sprite) {
    const sprites = {
        maleta: () => {
            ctx.fillStyle = '#4a3728';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#6d4c41';
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(x + 6, y + 6, w - 12, h - 12);
            ctx.fillStyle = '#4a3728';
            ctx.fillRect(x + 8, y + 4, w - 16, 4);
            ctx.fillRect(x + 8, y + h - 8, w - 16, 4);
        },
        lente: () => {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
            ctx.fillStyle = '#1a252f';
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, w/3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, w/5, 0, Math.PI * 2);
            ctx.fill();
        },
        bateria: () => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#2d2d2d';
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(x + 4, y + 6, w - 8, h - 12);
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(x + 6, y + 8, (w - 12) * 0.7, h - 16);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x + w/2 - 3, y - 2, 6, 4);
        },
        tarjeta: () => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#2d2d2d';
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(x + 4, y + 6, w - 8, 4);
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(x + 4, y + 14, w - 8, 4);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x + 4, y + 22, w - 8, 4);
        }
    };
    
    (sprites[sprite] || sprites.maleta)();
}

function drawFilmmakingPipe(x, y, w, h, sprite) {
    const sprites = {
        truss: () => {
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x + w, y + h);
            ctx.moveTo(x + w, y); ctx.lineTo(x, y + h);
            ctx.stroke();
        },
        'c-stand': () => {
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(x + w/2 - 4, y, 8, h);
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(x, y + h - 10, w, 10);
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(x + w/2 - 15, y, 30, 6);
        },
        monitor: () => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#2d2d2d';
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x + 4, y + 6, w - 8, h - 12);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x + w/2 - 2, y + h, 4, 6);
            ctx.fillRect(x + w/2 - 8, y + h + 6, 16, 4);
        },
        softbox: () => {
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#bdc3c7';
            ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, w/4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(x + w/2 - 3, y + h, 6, 8);
        }
    };
    
    (sprites[sprite] || sprites.truss)();
}
