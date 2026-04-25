// Sprites de enemigos y boss + utilidades de etiquetas

// ========== ENEMIGOS ORIGINALES ==========

function drawSpriteEnemyClientePesado(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const legSwing = Math.sin(animFrame * 0.3) * 4;
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(-size/3, size/3, size/3, size/2 + legSwing);
    ctx.fillRect(2, size/3, size/3, size/2 - legSwing);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-size/3 - 2, size/3 + size/2 + legSwing, size/2.5, 5);
    ctx.fillRect(2, size/3 + size/2 - legSwing, size/2.5, 5);
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(-2, -size/3, 4, size/2);
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(-size/4, -size/2 - size/10, size/6, size/10);
    ctx.fillRect(size/12, -size/2 - size/10, size/6, size/10);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-size/6, -size/3); ctx.lineTo(size/6, -size/3); ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(size/3, -size/6, size/2.5, size/2.5);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(size/3 + 2, size/6, size/2.5 - 4, 2);
    ctx.restore();
}

function drawSpriteEnemyCambioInesperado(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const legSwing = Math.sin(animFrame * 0.5) * 6;
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(-size/3, size/2.5, size/4, size/3 + legSwing);
    ctx.fillRect(2, size/2.5, size/4, size/3 - legSwing);
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath(); ctx.arc(0, 0, size/2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4a148c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, size/3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size/2.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('?', -size/2, -size/2 + Math.sin(animFrame * 0.15) * 6);
    ctx.fillText('?', size/3, -size/3 + Math.cos(animFrame * 0.15) * 6);
    ctx.fillText('?', 0, -size * 0.8 + Math.sin(animFrame * 0.2) * 4);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath(); ctx.arc(i * size/5, -size/4, size/8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.arc(i * size/5 + Math.cos(animFrame * 0.2) * 2, -size/4 + Math.sin(animFrame * 0.2) * 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
    }
    ctx.restore();
}

function drawSpriteEnemyHacienda(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const legSwing = Math.sin(animFrame * 0.25) * 3;
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(-size/3, size/3, size/3, size/2 + legSwing);
    ctx.fillRect(2, size/3, size/3, size/2 - legSwing);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-size/3 - 2, size/3 + size/2 + legSwing, size/2.5, 4);
    ctx.fillRect(2, size/3 + size/2 - legSwing, size/2.5, 4);
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('📋', 0, size/8);
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(-size/3, -size/2 - size/10, size/3, size/10);
    ctx.fillRect(0, -size/2 - size/10, size/3, size/10);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-size/3 + 2, -size/2 - size/10 + 1, size/3 - 4, size/10 - 2);
    ctx.fillRect(2, -size/2 - size/10 + 1, size/3 - 4, size/10 - 2);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 2; i++) {
        const px = Math.cos(animFrame * 0.05 + i * 3) * size * 0.8;
        const py = Math.sin(animFrame * 0.05 + i * 3) * size/2 - size/2;
        ctx.fillRect(px - size/8, py - size/8, size/3, size/4);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(px - size/8, py - size/8, size/3, size/4);
        ctx.fillStyle = '#333'; ctx.font = '6px Arial';
        ctx.fillText('IVA', px - size/12, py);
        ctx.fillStyle = '#fff';
    }
    ctx.restore();
}

// ========== NUEVOS ENEMIGOS FILMMAKER ==========

// 📝 El Guionista - Lanza páginas de guion
function drawSpriteEnemyGuionista(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const legSwing = Math.sin(animFrame * 0.3) * 3;
    // Cuerpo
    ctx.fillStyle = '#795548';
    ctx.fillRect(-size/3, size/3, size/2.5, size/2 + legSwing);
    ctx.fillRect(2, size/3, size/2.5, size/2 - legSwing);
    // Torso
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    // Corbata
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(-3, -size/4, 6, size/2);
    // Cabeza
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    // Gafas
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-size/5, -size/2, size/6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(size/5, -size/2, size/6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-size/5 + size/6, -size/2); ctx.lineTo(size/5 - size/6, -size/2); ctx.stroke();
    // Páginas flotando
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
        const px = Math.cos(animFrame * 0.1 + i * 2) * size * 0.7;
        const py = Math.sin(animFrame * 0.15 + i * 2) * size/3 - size/3;
        ctx.fillRect(px - size/6, py - size/8, size/3, size/4);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5;
        ctx.strokeRect(px - size/6, py - size/8, size/3, size/4);
        // Líneas de texto
        ctx.fillStyle = '#333';
        for (let j = 0; j < 3; j++) {
            ctx.fillRect(px - size/8, py - size/12 + j * 3, size/4, 1);
        }
        ctx.fillStyle = '#fff';
    }
    ctx.restore();
}

// 🎭 Actor Divo - Se mueve rápido y errático
function drawSpriteEnemyActorDivo(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const sparkle = Math.sin(animFrame * 0.8) * 3;
    // Brillo de estrella
    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    ctx.beginPath(); ctx.arc(0, -size/2, size/2 + sparkle, 0, Math.PI * 2); ctx.fill();
    // Piernas
    ctx.fillStyle = '#1a1a1a';
    const legOffset = Math.sin(animFrame * 0.6) * 8;
    ctx.fillRect(-size/3, size/3, size/4, size/2 + legOffset);
    ctx.fillRect(2, size/3, size/4, size/2 - legOffset);
    // Cuerpo
    ctx.fillStyle = '#e91e63';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    // Cuello de piel
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, -size/3, size/4, 0, Math.PI, true); ctx.fill();
    // Cabeza
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    // Gafas de sol
    ctx.fillStyle = '#000';
    ctx.fillRect(-size/3, -size/2 - size/10, size/1.5, size/8);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-size/4, -size/2 - size/10 + 1, size/4, size/12);
    // Sonrisa
    ctx.strokeStyle = '#e91e63'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size/3, size/5, 0, Math.PI); ctx.stroke();
    // Estrellas orbitando
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < 4; i++) {
        const angle = animFrame * 0.2 + i * Math.PI / 2;
        const sx = Math.cos(angle) * size * 0.8;
        const sy = Math.sin(angle) * size * 0.5 - size/2;
        ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
}

// 💸 Presupuesto Agotado - Te roba puntos
function drawSpriteEnemyPresupuestoAgotado(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const shake = Math.sin(animFrame * 0.4) * 2;
    // Cuerpo vacío (transparente)
    ctx.fillStyle = 'rgba(255,87,34,0.3)';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 2;
    ctx.strokeRect(-size/2, -size/3, size, size/1.5);
    // Cruz roja
    ctx.strokeStyle = '#f44336'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-size/3, -size/4); ctx.lineTo(size/3, size/4);
    ctx.moveTo(size/3, -size/4); ctx.lineTo(-size/3, size/4);
    ctx.stroke();
    // Cabeza triste
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2 + shake, size/3, 0, Math.PI * 2); ctx.fill();
    // Ojos llorosos
    ctx.fillStyle = '#2196f3';
    ctx.beginPath(); ctx.arc(-size/6, -size/2 + shake + 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size/6, -size/2 + shake + 2, 2, 0, Math.PI * 2); ctx.fill();
    // Boca triste
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -size/3 + shake, size/6, Math.PI, 0); ctx.stroke();
    // Símbolo de documento tachado
    ctx.fillStyle = '#f44336';
    ctx.font = `bold ${size/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.5;
    ctx.fillText('📄', 0, size/6);
    ctx.globalAlpha = 1;
    // Partículas de documentos desapareciendo
    ctx.fillStyle = '#4caf50';
    for (let i = 0; i < 3; i++) {
        const px = Math.cos(animFrame * 0.1 + i * 2) * size * 0.6;
        const py = Math.sin(animFrame * 0.15 + i * 2) * size/2 - size/4;
        ctx.globalAlpha = 0.3 + Math.sin(animFrame * 0.2 + i) * 0.2;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

// 🕐 Deadline - Bomba de tiempo que explota
function drawSpriteEnemyDeadline(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    // No flip - simétrico
    const pulse = Math.sin(animFrame * 0.2) * 0.1 + 1;
    ctx.scale(pulse, pulse);
    // Cuerpo circular
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.arc(0, 0, size/2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, size/2, 0, Math.PI * 2); ctx.stroke();
    // Reloj
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, -size/4, size/3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size/4, size/3, 0, Math.PI * 2); ctx.stroke();
    // Manecillas girando rápido
    const angle = animFrame * 0.3;
    ctx.strokeStyle = '#f44336'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size/4);
    ctx.lineTo(Math.cos(angle) * size/5, -size/4 + Math.sin(angle) * size/5);
    ctx.stroke();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size/4);
    ctx.lineTo(Math.cos(angle * 0.5) * size/6, -size/4 + Math.sin(angle * 0.5) * size/6);
    ctx.stroke();
    // Números de cuenta atrás
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size/3}px Arial`;
    ctx.textAlign = 'center';
    const countdown = Math.max(1, 3 - Math.floor(animFrame / 60) % 4);
    ctx.fillText(countdown, 0, size/3);
    // Brillo rojo pulsante
    ctx.fillStyle = `rgba(255,0,0,${0.2 + Math.sin(animFrame * 0.2) * 0.2})`;
    ctx.beginPath(); ctx.arc(0, 0, size/2 + 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// 📱 Influencer - Invierte controles
function drawSpriteEnemyInfluencer(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    const phoneGlow = Math.sin(animFrame * 0.3) * 0.3 + 0.7;
    // Piernas
    ctx.fillStyle = '#1a1a1a';
    const legSwing = Math.sin(animFrame * 0.4) * 4;
    ctx.fillRect(-size/3, size/3, size/4, size/2 + legSwing);
    ctx.fillRect(2, size/3, size/4, size/2 - legSwing);
    // Cuerpo
    ctx.fillStyle = '#9c27b0';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    // Cabeza
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    // Filtro de Instagram (brillo rosa)
    ctx.fillStyle = `rgba(233,30,99,${0.2 + Math.sin(animFrame * 0.2) * 0.1})`;
    ctx.beginPath(); ctx.arc(0, -size/2, size/3 + 3, 0, Math.PI * 2); ctx.fill();
    // Ojos con corazones
    ctx.fillStyle = '#e91e63';
    for (let i = -1; i <= 1; i += 2) {
        const hx = i * size/5;
        const hy = -size/2 - 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy + 3);
        ctx.bezierCurveTo(hx - 3, hy, hx - 3, hy - 3, hx, hy - 3);
        ctx.bezierCurveTo(hx + 3, hy - 3, hx + 3, hy, hx, hy + 3);
        ctx.fill();
    }
    // Móvil en la mano
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(size/4, -size/4, size/3, size/2);
    ctx.fillStyle = `rgba(255,255,255,${phoneGlow})`;
    ctx.fillRect(size/4 + 2, -size/4 + 2, size/3 - 4, size/2 - 4);
    // Selfie stick
    ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size/4, -size/4);
    ctx.lineTo(size/2, -size);
    ctx.stroke();
    // Flechas invertidas flotando
    ctx.fillStyle = '#e91e63';
    ctx.font = `${size/2}px Arial`;
    ctx.textAlign = 'center';
    const arrowY = -size * 1.2 + Math.sin(animFrame * 0.2) * 5;
    ctx.fillText('⇄', 0, arrowY);
    ctx.restore();
}

// 📊 El de Marketing - Te distrae con KPIs absurdos
function drawSpriteEnemyMarketing(x, y, size, facing, animFrame) {
    ctx.save(); ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);
    // Piernas
    ctx.fillStyle = '#607d8b';
    const legSwing = Math.sin(animFrame * 0.25) * 3;
    ctx.fillRect(-size/3, size/3, size/3, size/2 + legSwing);
    ctx.fillRect(2, size/3, size/3, size/2 - legSwing);
    // Cuerpo (camisa)
    ctx.fillStyle = '#455a64';
    ctx.fillRect(-size/2, -size/3, size, size/1.5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-3, -size/3, 6, size/1.5);
    // Corbata
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(-4, -size/4, 8, size/2);
    // Cabeza
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size/2, size/3, 0, Math.PI * 2); ctx.fill();
    // Gafas
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(-size/6, -size/2, size/7, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(size/6, -size/2, size/7, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-size/6 + size/7, -size/2); ctx.lineTo(size/6 - size/7, -size/2); ctx.stroke();
    // Sonrisa falsa
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, -size/3, size/6, 0, Math.PI); ctx.stroke();
    // Gráficos flotando
    const chartY = -size * 1.2 + Math.sin(animFrame * 0.15) * 8;
    ctx.fillStyle = 'rgba(33,150,243,0.3)';
    ctx.fillRect(-size/2, chartY - 20, size, 40);
    ctx.strokeStyle = '#2196f3'; ctx.lineWidth = 2;
    ctx.strokeRect(-size/2, chartY - 20, size, 40);
    // Barras del gráfico
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(-size/3, chartY, size/5, 15);
    ctx.fillStyle = '#f44336';
    ctx.fillRect(-size/10, chartY + 5, size/5, 10);
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(size/5, chartY - 5, size/5, 20);
    // Texto KPI
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size/4}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('KPI', 0, chartY - 25);
    // Porcentajes absurdos
    const kpis = ['420%', '-69%', '∞', 'NaN', '404%'];
    const kpi = kpis[Math.floor(animFrame / 60) % kpis.length];
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size/3}px Arial`;
    ctx.fillText(kpi, 0, chartY + 30);
    ctx.restore();
}

// ========== BOSS: PERFECCIONISMO ==========

function drawSpriteEnemyPerfeccionismo(x, y, size, health, animFrame) {
    const pulse = Math.sin(animFrame * 0.05) * 0.05 + 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
    
    // Cuerpo grande (más imponente que el Productor)
    ctx.fillStyle = '#311b92';
    ctx.fillRect(-size, -size/2, size * 2, size);
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(-size + 5, -size/2 + 5, size * 2 - 10, size - 10);
    
    // Lupa gigante (símbolo del perfeccionismo)
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -size * 0.3, size/2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,215,0,0.1)';
    ctx.beginPath(); ctx.arc(0, -size * 0.3, size/2, 0, Math.PI * 2); ctx.fill();
    // Mango de la lupa
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(size/3, size/5);
    ctx.lineTo(size/2, size/2);
    ctx.stroke();
    
    // Cabeza
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath(); ctx.arc(0, -size * 0.65, size/1.8, 0, Math.PI * 2); ctx.fill();
    
    // Gafas de aumento (ojos enormes)
    ctx.strokeStyle = '#311b92'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-size/4, -size * 0.65, size/5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(size/4, -size * 0.65, size/5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-size/4, -size * 0.65, size/6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size/4, -size * 0.65, size/6, 0, Math.PI * 2); ctx.fill();
    // Pupilas que miran al jugador
    ctx.fillStyle = '#311b92';
    const lookX = Math.sin(animFrame * 0.1) * 3;
    ctx.beginPath(); ctx.arc(-size/4 + lookX, -size * 0.65, size/10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size/4 + lookX, -size * 0.65, size/10, 0, Math.PI * 2); ctx.fill();
    
    // Boca crítica (línea recta)
    ctx.strokeStyle = '#f44336'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-size/5, -size/3); ctx.lineTo(size/5, -size/3); ctx.stroke();
    
    // Notas de "cambio" flotando
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size/5}px Arial`;
    ctx.textAlign = 'center';
    for (let i = 0; i < 4; i++) {
        const angle = animFrame * 0.03 + i * Math.PI / 2;
        const nx = Math.cos(angle) * size * 1.2;
        const ny = Math.sin(angle) * size * 0.5 - size/2;
        ctx.save();
        ctx.translate(nx, ny);
        ctx.rotate(Math.sin(animFrame * 0.05 + i) * 0.3);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(-size/3, -size/6, size/1.5, size/3);
        ctx.strokeStyle = '#f44336'; ctx.lineWidth = 1;
        ctx.strokeRect(-size/3, -size/6, size/1.5, size/3);
        ctx.fillStyle = '#f44336';
        ctx.fillText('CUT!', 0, size/12);
        ctx.restore();
    }
    
    // Barra de vida
    ctx.fillStyle = '#333';
    ctx.fillRect(-size, -size * 1.3, size * 2, size/5);
    ctx.fillStyle = health > 50 ? '#4caf50' : health > 25 ? '#ff9800' : '#f44336';
    ctx.fillRect(-size + 2, -size * 1.3 + 2, (size * 2 - 4) * (health / 100), size/5 - 4);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size/4}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('PERFECCIONISMO', 0, -size * 1.15);
    
    ctx.restore();
}

// ========== ETIQUETAS ==========

const enemyLabels = {
    clientePesado:     'Cliente Pesado',
    cambioInesperado:  'Cambio Inesperado',
    hacienda:          'Hacienda',
    productor:         'Productor',
    guionista:         'El Guionista',
    actorDivo:         'Actor Divo',
    presupuestoAgotado:'Presupuesto Agotado',
    deadline:          'Deadline',
    influencer:        'Influencer',
    marketing:         'El de Marketing',
    perfeccionismo:    'Perfeccionismo'
};

function drawEnemyLabel(x, y, name) {
    ctx.font = 'bold 11px Arial';
    const textWidth = ctx.measureText(name).width;
    const padding = 6;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 18;
    ctx.fillStyle = 'rgba(139, 0, 0, 0.85)';
    ctx.fillRect(x - boxWidth/2, y - boxHeight - 2, boxWidth, boxHeight);
    ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 1;
    ctx.strokeRect(x - boxWidth/2, y - boxHeight - 2, boxWidth, boxHeight);
    ctx.fillStyle = '#ff0000';
    ctx.textAlign = 'center';
    ctx.fillText(name, x, y - 6);
}
