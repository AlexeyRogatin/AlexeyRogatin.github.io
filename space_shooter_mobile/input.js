let globalInputString = '';

function makeKey() {
    return {
        isDown: false,
        wentDown: false,
        wentUp: false,
    };
}

let touchEvent = makeKey();

let mouseX = 0;
let mouseY = 0;

function handleKeyDown(key) {
    if (!key.isDown) {
        key.wentDown = true;
        key.isDown = true;
    }
}

function handleKeyUp(key) {
    if (key.isDown) {
        key.wentUp = true;
        key.isDown = false;
    }
}

window.ontouchstart = function ontouchstart(event) {
    handleKeyDown(touchEvent);
};
window.ontouchend = function ontouchend(event) {
    handleKeyUp(touchEvent);
};
window.ontouchmove = function ontouchmove(event) {
    mouseX = event.clientX - canvas.clientLeft;
    mouseY = event.clientY - canvas.clientTop;
};

function clearKey(key) {
    key.wentDown = false;
    key.wentUp = false;
}
function clearAllKeys() {
    clearKey(touchEvent);
}