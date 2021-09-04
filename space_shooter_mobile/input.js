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
    const rect = canvas.getBoundingClientRect();
    mouseX = (event.touches[0].clientX - rect.left) / canvas.clientWidth * canvas.width;
    mouseY = (event.touches[0].clientY - rect.top) / canvas.clientHeight * canvas.height;
};

function clearKey(key) {
    key.wentDown = false;
    key.wentUp = false;
}
function clearAllKeys() {
    clearKey(touchEvent);
}