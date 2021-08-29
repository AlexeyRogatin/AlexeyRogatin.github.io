let KEY_RIGHT = 68;
let KEY_LEFT = 65;
let KEY_DOWN = 83;
let KEY_UP = 87;
let KEY_SPACE = 32;
let KEY_SHIFT = 16;
let KEY_Q = 81;
let KEY_R = 82;
let KEY_ESC = 27;
let KEY_A = 65;
let KEY_Z = 90;
let KEY_BACKSPACE = 8;

let globalInputString = '';

function makeKey() {
    return {
        isDown: false,
        wentDown: false,
        wentUp: false,
    };
}

let upKey = makeKey();
let leftKey = makeKey();
let downKey = makeKey();
let rightKey = makeKey();
let spaceKey = makeKey();
let shiftKey = makeKey();
let rKey = makeKey();
let qKey = makeKey();

let mouseX = 0;
let mouseY = 0;

function handleKeyDown(event, keyCode, key) {
    if (keyCode === event.keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

function handleKeyUp(event, keyCode, key) {
    if (keyCode === event.keyCode) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
}

window.onkeydown = function onkeydown(event) {
    handleKeyDown(event, KEY_UP, upKey);
    handleKeyDown(event, KEY_DOWN, downKey);
    handleKeyDown(event, KEY_LEFT, leftKey);
    handleKeyDown(event, KEY_RIGHT, rightKey);
    handleKeyDown(event, KEY_SPACE, spaceKey);
    handleKeyDown(event, KEY_SHIFT, shiftKey);
    handleKeyDown(event, KEY_R, rKey);
    handleKeyDown(event, KEY_Q, qKey);

    if (
        (event.keyCode >= KEY_A && event.keyCode <= KEY_Z) ||
        event.keyCode === KEY_SPACE
    ) {
        globalInputString += event.key;
    }

    if (event.keyCode === KEY_BACKSPACE) {
        globalInputString = globalInputString.substr(0, globalInputString.length - 1);
    }
};
window.onkeyup = function onkeyup(event) {
    handleKeyUp(event, KEY_UP, upKey);
    handleKeyUp(event, KEY_DOWN, downKey);
    handleKeyUp(event, KEY_LEFT, leftKey);
    handleKeyUp(event, KEY_RIGHT, rightKey);
    handleKeyUp(event, KEY_SPACE, spaceKey);
    handleKeyUp(event, KEY_SHIFT, shiftKey);
    handleKeyUp(event, KEY_R, rKey);
    handleKeyUp(event, KEY_Q, qKey);
};
window.onmousemove = function onmousemove(event) {
    mouseX = event.clientX - canvas.clientLeft;
    mouseY = event.clientY - canvas.clientTop;
};

function clearKey(key) {
    key.wentDown = false;
    key.wentUp = false;
}
function clearAllKeys() {
    clearKey(leftKey);
    clearKey(downKey);
    clearKey(upKey);
    clearKey(rightKey);
    clearKey(spaceKey);
    clearKey(shiftKey);
    clearKey(rKey);
    clearKey(qKey);
}