let mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    wentDown: false,
    wentUp: false,
    isDown: false,
}

window.onmousemove = function onmousemove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / canvas.clientWidth * canvas.width;
    mouse.y = (event.clientY - rect.top) / canvas.clientHeight * canvas.height;
}

window.onmousedown = function onmousedown(event) {
    mouse.wentDown = true;
    mouse.isDown = true;
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
}

window.onmouseup = function onmouseup(event) {
    if (document.fullscreenElement != document.documentElement) {

        document.documentElement.requestFullscreen();
    }

    mouse.wentUp = true;
    mouse.isDown = false;
}

function clearMouse() {
    mouse.wentDown = false;
    mouse.wentUp = false;
    if (!mouse.isDown && !mouse.wentUp) {
        mouse.startX = Infinity;
        mouse.startY = Infinity;
    }
}