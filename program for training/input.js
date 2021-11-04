let mouse = {
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
    wentDown: false,
    isDown: false,
    wentUp: false,
}

window.onmousemove = function onmousemove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / canvas.clientWidth * canvas.width;
    mouse.y = (event.clientY - rect.top) / canvas.clientHeight * canvas.height;
}

window.onmousedown = function onmousedown(event) {
    mouse.wentDown = true;
    mouse.isDown = true;
}

window.onmouseup = function onmouseup(event) {
    mouse.wentUp = true;
    mouse.isDown = false;
}

function clearMouse() {
    mouse.wentDown = false;
    mouse.wentUp = false;
}