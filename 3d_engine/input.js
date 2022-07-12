function addKey() {
    return {
        wentDown: false,
        wentUp: false,
        isDown: false
    }
}

const D_KEY = 68;
const A_KEY = 65;
const S_KEY = 83;
const W_KEY = 87;
const UP_KEY = 38;
const DOWN_KEY = 40;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const CTRL_KEY = 17;
const SHIFT_KEY = 16;

let wKey = addKey();
let aKey = addKey();
let dKey = addKey();
let sKey = addKey();
let upKey = addKey();
let downKey = addKey();
let leftKey = addKey();
let rightKey = addKey();
let ctrlKey = addKey();
let shiftKey = addKey();

function handleKeyDown(event, key, keyCode) {
    if (event.keyCode == keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

window.addEventListener("keydown", function keyDown(event) {
    handleKeyDown(event, wKey, W_KEY);
    handleKeyDown(event, sKey, S_KEY);
    handleKeyDown(event, aKey, A_KEY);
    handleKeyDown(event, dKey, D_KEY);
    handleKeyDown(event, upKey, UP_KEY);
    handleKeyDown(event, downKey, DOWN_KEY);
    handleKeyDown(event, leftKey, LEFT_KEY);
    handleKeyDown(event, rightKey, RIGHT_KEY);
    handleKeyDown(event, ctrlKey, CTRL_KEY);
    handleKeyDown(event, shiftKey, SHIFT_KEY);
});

function handleKeyUp(event, key, keyCode) {
    if (event.keyCode == keyCode) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
}

window.addEventListener("keyup", function keyDown(event) {
    handleKeyUp(event, wKey, W_KEY);
    handleKeyUp(event, sKey, S_KEY);
    handleKeyUp(event, aKey, A_KEY);
    handleKeyUp(event, dKey, D_KEY);
    handleKeyUp(event, upKey, UP_KEY);
    handleKeyUp(event, downKey, DOWN_KEY);
    handleKeyUp(event, leftKey, LEFT_KEY);
    handleKeyUp(event, rightKey, RIGHT_KEY);
    handleKeyUp(event, ctrlKey, CTRL_KEY);
    handleKeyUp(event, shiftKey, SHIFT_KEY);
});

function clearKey(key) {
    key.wentUp = false;
    key.wentDown = false;
}

function clearKeys() {
    clearKey(sKey);
    clearKey(wKey);
    clearKey(aKey);
    clearKey(dKey);
    clearKey(upKey);
    clearKey(downKey);
    clearKey(leftKey);
    clearKey(rightKey);
    clearKey(ctrlKey);
    clearKey(shiftKey);
}