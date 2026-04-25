// Teclado y botones táctiles. Llena el objeto `keys` que consume update.js
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') e.preventDefault();
});
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function setupBtn(id, key) {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; initAudio(); });
    btn.addEventListener('touchend',   (e) => { e.preventDefault(); keys[key] = false; });
    btn.addEventListener('mousedown',  () => { keys[key] = true; initAudio(); });
    btn.addEventListener('mouseup',    () => keys[key] = false);
}

setupBtn('btnLeft',  'arrowleft');
setupBtn('btnRight', 'arrowright');
setupBtn('btnJump',  ' ');
setupBtn('btnShoot', 'z');
