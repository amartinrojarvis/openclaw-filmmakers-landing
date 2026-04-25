// Física compartida: gravedad y colisión con plataformas
function applyGravity(entity) { entity.vy += GRAVITY; }

function checkPlatformCollision(entity) {
    entity.onGround = false;
    for (const plat of platforms) {
        // TODAS las plataformas son sólidas ahora (incluidos bloques y tuberías)
        if (entity.x + entity.width > plat.x &&
            entity.x < plat.x + plat.w &&
            entity.y + entity.height >= plat.y &&
            entity.y + entity.height <= plat.y + plat.h + entity.vy + 5 &&
            entity.vy >= 0) {
            entity.y = plat.y - entity.height;
            entity.vy = 0;
            entity.onGround = true;
            return plat;
        }
    }
    return null;
}
