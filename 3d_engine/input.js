function addKey() {
    return {
        wentDown: false,
        wentUp: false,
        isDown: false
    }
}

const RIGHT_KEY = 68;
const LEFT_KEY = 65;
const DOWN_KEY = 83;
const UP_KEY = 87;
const SPACE_KEY = 32;

let upKey = addKey();
let leftKey = addKey();
let rightKey = addKey();
let downKey = addKey();
let spaceKey = addKey();

function handleKeyDown(event, key, keyCode) {
    if (event.keyCode == keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

window.addEventListener("keydown", function keyDown(event) {
    handleKeyDown(event, upKey, UP_KEY);
    handleKeyDown(event, downKey, DOWN_KEY);
    handleKeyDown(event, leftKey, LEFT_KEY);
    handleKeyDown(event, rightKey, RIGHT_KEY);
    handleKeyDown(event, spaceKey, SPACE_KEY);
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
    handleKeyUp(event, upKey, UP_KEY);
    handleKeyUp(event, downKey, DOWN_KEY);
    handleKeyUp(event, leftKey, LEFT_KEY);
    handleKeyUp(event, rightKey, RIGHT_KEY);
    handleKeyUp(event, spaceKey, SPACE_KEY);
});

function clearKey(key) {
    key.wentUp = false;
    key.wentDown = false;
}

function clearKeys() {
    clearKey(downKey);
    clearKey(upKey);
    clearKey(leftKey);
    clearKey(rightKey);
    clearKey(spaceKey);
}