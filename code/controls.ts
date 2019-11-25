import { canvas } from './input';

export let mouseX: number = 0;
export let mouseY: number = 0;

export enum KeyCode {
    RIGHT = 68,
    LEFT = 65,
    DOWN = 83,
    UP = 87,
}

export class Key {
    isDown: boolean = false;
    wentDown: boolean = false;
    wentUp: boolean = false;
}

export class Mouse {
    isDown: boolean;
    wentDown: boolean;
    wentUp: boolean;
    x: number;
    y: number;
    worldX: number;
    worldY: number;
}

export const upKey = new Key();
export const leftKey = new Key();
export const downKey = new Key();
export const rightKey = new Key();
export let mouse = new Mouse();

function handleKeyDown(event: KeyboardEvent, keyCode: KeyCode, key: Key) {
    if (keyCode === event.keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

function handleKeyUp(event: KeyboardEvent, keyCode: KeyCode, key: Key) {
    if (keyCode === event.keyCode) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
}

window.onkeydown = function onkeydown(event) {
    handleKeyDown(event, KeyCode.UP, upKey);
    handleKeyDown(event, KeyCode.DOWN, downKey);
    handleKeyDown(event, KeyCode.LEFT, leftKey);
    handleKeyDown(event, KeyCode.RIGHT, rightKey);
};

window.onkeyup = function onkeyup(event) {
    handleKeyUp(event, KeyCode.UP, upKey);
    handleKeyUp(event, KeyCode.DOWN, downKey);
    handleKeyUp(event, KeyCode.LEFT, leftKey);
    handleKeyUp(event, KeyCode.RIGHT, rightKey);
};

window.onmousemove = function onmousemove(event) {
    mouse.x = event.clientX - canvas.clientLeft;
    mouse.y = event.clientY - canvas.clientTop;
}

window.onmousedown = function onmousedown(event) {
    if (!mouse.isDown) {
        mouse.isDown = true;
        mouse.wentDown = true;
    }
}

window.onmouseup = function onmouseup(event) {
    if (mouse.isDown) {
        mouse.isDown = false;
        mouse.wentUp = true;
    }
}

function clearKey(key: Key) {
    key.wentDown = false;
    key.wentUp = false;
}

export function clearAllKeys() {
    clearKey(leftKey);
    clearKey(downKey);
    clearKey(upKey);
    clearKey(rightKey);
    mouse.wentUp = false;
    mouse.wentDown = false;
}
