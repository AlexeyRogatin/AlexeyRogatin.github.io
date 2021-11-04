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

window.onkeydown = function onkeydown(event) {
    if (writingIndex !== -1) {
        let valueStr = data[writingIndex].percent;
        switch (event.key) {
            case 'Backspace': {
                if (valueStr.length) {
                    valueStr = valueStr.slice(0, -1);
                }
            } break;
            default: {
                if (valueStr * 100 % 10 === 0 && (event.keyCode >= 48 && event.keyCode <= 57 || (event.key === '.' && valueStr.split('.').length === 1))) {
                    valueStr += event.key;
                }
            }
        }
        if (valueStr[0] === '0' && valueStr[1] !== '.' && valueStr.length > 1) {
            valueStr = valueStr.slice(1, valueStr.length);
        }
        data[writingIndex].percent = valueStr;
    }
}

function clearMouse() {
    mouse.wentDown = false;
    mouse.wentUp = false;
}