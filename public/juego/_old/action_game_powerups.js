const powerUpTypes = {
    cinemaCamera: { 
        name: 'CÁMARA CINE', 
        desc: '¡Disparo triple!',
        emoji: '🎥',
        duration: 300, // 5 segundos
        effect: 'tripleShot'
    },
    nuclearBattery: { 
        name: 'BATERÍA NUCLEAR', 
        desc: '¡Bombas de flash!',
        emoji: '💣',
        duration: 240,
        effect: 'bombs'
    },
    render4K: { 
        name: 'RENDER 4K', 
        desc: '¡Velocidad x2 + invencible!',
        emoji: '⚡',
        duration: 360,
        effect: 'speedBoost'
    }
};

let activePowerUp = null;
let powerUpTimer = 0;

const enemyLabels = {
    clientePesado: { name: 'CLIENTE PESADO', desc: 'Siempre pide cambios' },
    cambioInesperado: { name: 'CAMBIO INESPERADO', desc: '¡Esto no estaba en el brief!' },
    hacienda: { name: 'HACIENDA', desc: 'Te quiere quitar el IVA' },
    guionista: { name: 'EL GUIONISTA', desc: 'Lanza páginas de guion' },
    actorDivo: { name: 'ACTOR DIVO', desc: '¡Quiero mi close-up!' },
    presupuesto: { name: 'PRESUPUESTO AGOTADO', desc: 'Se come tus puntos' },
    deadline: { name: 'DEADLINE', desc: '¡Explota si no la eliminas!' },
    influencer: { name: 'INFLUENCER', desc: 'Te distrae con selfies' },
    productor: { name: 'EL PRODUCTOR', desc: 'Jefe final. 50 de vida.' }
};