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
const SPACE_KEY = 32;
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
let spaceKey = addKey();
let upKey = addKey();
let downKey = addKey();
let leftKey = addKey();
let rightKey = addKey();
let ctrlKey = addKey();
let shiftKey = addKey();

let mouse = {
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0,
    wentDown: false,
    wentUp: false,
    isDown: false,
}

let locked = false;

function handleKeyDown(eventKey, key, keyCode) {
    if (eventKey == keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

window.addEventListener("keydown", function keyDown(event) {
    handleKeyDown(event.keyCode, wKey, W_KEY);
    handleKeyDown(event.keyCode, sKey, S_KEY);
    handleKeyDown(event.keyCode, aKey, A_KEY);
    handleKeyDown(event.keyCode, dKey, D_KEY);
    handleKeyDown(event.keyCode, spaceKey, SPACE_KEY);
    handleKeyDown(event.keyCode, upKey, UP_KEY);
    handleKeyDown(event.keyCode, downKey, DOWN_KEY);
    handleKeyDown(event.keyCode, leftKey, LEFT_KEY);
    handleKeyDown(event.keyCode, rightKey, RIGHT_KEY);
    handleKeyDown(event.keyCode, ctrlKey, CTRL_KEY);
    handleKeyDown(event.keyCode, shiftKey, SHIFT_KEY);
});

function handleKeyUp(eventKey, key, keyCode) {
    if (eventKey == keyCode) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
}

window.addEventListener("keyup", function keyUown(event) {
    handleKeyUp(event.keyCode, wKey, W_KEY);
    handleKeyUp(event.keyCode, sKey, S_KEY);
    handleKeyUp(event.keyCode, aKey, A_KEY);
    handleKeyUp(event.keyCode, dKey, D_KEY);
    handleKeyUp(event.keyCode, spaceKey, SPACE_KEY);
    handleKeyUp(event.keyCode, upKey, UP_KEY);
    handleKeyUp(event.keyCode, downKey, DOWN_KEY);
    handleKeyUp(event.keyCode, leftKey, LEFT_KEY);
    handleKeyUp(event.keyCode, rightKey, RIGHT_KEY);
    handleKeyUp(event.keyCode, ctrlKey, CTRL_KEY);
    handleKeyUp(event.keyCode, shiftKey, SHIFT_KEY);
    handleKeyUp(0, mouse, 0);
});

document.addEventListener("pointerlockchange", function lockChange() {
    locked = !locked;
}, false)

document.addEventListener("mousedown", function mouseDown(event) {
    if (!locked) {
        canvas.requestPointerLock();
        canvas.requestFullscreen();
    }
    handleKeyDown(0, mouse, 0);
})

document.addEventListener("mousemove", function mouseMove(event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX) / rect.width * canvas.width - canvas.width / 2;
    mouse.y = (event.clientY) / rect.height * canvas.height - canvas.height / 2;
    if (locked) {
        mouse.movementX = event.movementX;
        mouse.movementY = event.movementY;
    }
})

document.addEventListener("mouseup", function mouseDown(event) {
    handleKeyUp(0, mouse, 0);
    let rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX) / rect.width * canvas.width - canvas.width / 2;
    mouse.y = (event.clientY) / rect.height * canvas.height - canvas.height / 2;
})

canvas.addEventListener("mouseleave", function mouseLeave(event) {
    mouse.x = 0;
    mouse.y = 0;
}, true)

function clearKey(key) {
    key.wentUp = false;
    key.wentDown = false;
}

function clearKeys() {
    clearKey(sKey);
    clearKey(wKey);
    clearKey(aKey);
    clearKey(dKey);
    clearKey(spaceKey);
    clearKey(upKey);
    clearKey(downKey);
    clearKey(leftKey);
    clearKey(rightKey);
    clearKey(ctrlKey);
    clearKey(shiftKey);
    clearKey(mouse);
    mouse.movementX = 0;
    mouse.movementY = 0;
}