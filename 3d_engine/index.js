'use strict'

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SCREEN_RATIO = 16 / 9;
const SCREEN_WIDTH = 1920;
const RECSIZE = 400;

function handleResize() { //функция события изменения размера экрана
    var rect = canvas.getBoundingClientRect();
    var rectWidth = rect.width;
    var rectHeight = rect.height;
    if (rectWidth >= rectHeight) {
        canvas.height = SCREEN_WIDTH / SCREEN_RATIO;
        canvas.width = canvas.height / rectHeight * rectWidth;
        canvas.style.height = rectHeight.toString();
        canvas.style.width = rectWidth.toString();
    }
    else {
        canvas.width = SCREEN_WIDTH;
        canvas.height = canvas.width / rectWidth * rectHeight;
        canvas.style.width = rectWidth.toString();
        canvas.style.height = rectHeight.toString();
    }
}
handleResize();
window.addEventListener('resize', handleResize);

let camera = {
    x: 0,
    y: 0,
    z: 0,
    axisX: {
        x: 1,
        y: 0,
        z: 0
    },
    axisY: {
        x: 0,
        y: 1,
        z: 0
    }
}

let rectangle1 = {
    x: 0,
    y: 0,
    z: RECSIZE,
    axisX: {
        x: RECSIZE * 2,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: RECSIZE * 2,
        z: 0,
    },
    color: 'red'
}

let rectangle2 = {
    x: 0,
    y: 0,
    z: -RECSIZE,
    axisX: {
        x: RECSIZE * 2,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: RECSIZE * 2,
        z: 0,
    },
    color: 'orange'
}

let rectangle3 = {
    x: RECSIZE,
    y: 0,
    z: 0,
    axisX: {
        x: 0,
        y: RECSIZE * 2,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: RECSIZE * 2,
    },
    color: 'yellow'
}

let rectangle4 = {
    x: -RECSIZE,
    y: 0,
    z: 0,
    axisX: {
        x: 0,
        y: RECSIZE * 2,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: RECSIZE * 2,
    },
    color: 'green'
}

let rectangle5 = {
    x: 0,
    y: RECSIZE,
    z: 0,
    axisX: {
        x: RECSIZE * 2,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: RECSIZE * 2,
    },
    color: 'blue'
}

let rectangle6 = {
    x: 0,
    y: -RECSIZE,
    z: 0,
    axisX: {
        x: RECSIZE * 2,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: RECSIZE * 2,
    },
    color: 'purple'
}

let drawQueue = [];

function sum(V1, V2) {
    return {
        x: V1.x + V2.x,
        y: V1.y + V2.y,
        z: V1.z + V2.z
    }
}

function dotProd(V1, V2) {
    return (V1.x * V2.x + V1.y * V2.y + V1.z * V2.z);
}

function mult(a, V) {
    return {
        x: a * V.x,
        y: a * V.y,
        z: a * V.z
    }
}

function invert(V) {
    return mult(-1, V);
}

function length(V) {
    return Math.sqrt(dotProd(V, V));
}

function unit(V) {
    return mult(1 / length(V), V);
}

function vectorProd(V1, V2) {
    return {
        x: V1.y * V2.z - V1.z * V2.y,
        y: V1.z * V2.x - V1.x * V2.z,
        z: V1.x * V2.y - V1.y * V2.x,
    }
}

function convert3dTo2d(V, camera) {
    let result = {
        x: 0,
        y: 0,
        n: 0
    }
    let vector = sum(V, invert(camera));
    result.x = dotProd(vector, camera.axisX) / length(camera.axisX);
    result.y = dotProd(vector, camera.axisY) / length(camera.axisY);

    return result;
}

function draw3dRectangle(rectangle, camera) {
    let V1 = convert3dTo2d(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)), camera);
    let V2 = convert3dTo2d(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)), camera);
    let V3 = convert3dTo2d(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)), camera);
    let V4 = convert3dTo2d(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)), camera);
    drawRectangle(V1, V2, V3, V4, rectangle.color);
}

function add3dRectangle(drawQueue, rectangle) {
    drawQueue.push(rectangle);
}

function drawRectangle(V1, V2, V3, V4, color) {
    let size = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    V1 = sum(V1, size);
    V2 = sum(V2, size);
    V3 = sum(V3, size);
    V4 = sum(V4, size);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(V1.x, V1.y);
    ctx.lineTo(V2.x, V2.y);
    ctx.lineTo(V3.x, V3.y);
    ctx.lineTo(V4.x, V4.y);
    ctx.closePath();
    ctx.fill();
}

const CAMERA_SPEED = 3;
const CAMERA_ANGLE_SPEED = Math.PI / 60;

function loop() {
    drawRectangle(
        { x: -canvas.width * 0.5, y: -canvas.height * 0.5 },
        { x: canvas.width * 0.5, y: -canvas.height * 0.5 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: -canvas.width * 0.5, y: canvas.height * 0.5 }, 'grey'
    );

    add3dRectangle(drawQueue, rectangle1);
    add3dRectangle(drawQueue, rectangle2);
    add3dRectangle(drawQueue, rectangle3);
    add3dRectangle(drawQueue, rectangle4);
    add3dRectangle(drawQueue, rectangle5);
    add3dRectangle(drawQueue, rectangle6);

    if (spaceKey.isDown) { //передвижение вперёд
        let vector = vectorProd(camera.axisX, camera.axisY);
        camera.x += vector.x * CAMERA_SPEED;
        camera.y += vector.y * CAMERA_SPEED;
        camera.z += vector.z * CAMERA_SPEED;
    }

    let normal = mult(CAMERA_ANGLE_SPEED, unit(camera.axisY));
    camera.axisX = sum(camera.axisX, mult((rightKey.isDown - leftKey.isDown), vectorProd(normal, camera.axisX)));

    normal = mult(CAMERA_ANGLE_SPEED, unit(camera.axisX));
    camera.axisY = sum(camera.axisY, mult((downKey.isDown - upKey.isDown), vectorProd(normal, camera.axisY)));

    let mistakes = 0;
    while (mistakes !== 0) {
        for (let queueIndex = 1; queueIndex < drawQueue.length; queueIndex++) {
            let length2 = length(sum(drawQueue[drawIndex], invert(camera)));
            let length1 = length(sum(drawQueue[drawIndex - 1], invert(camera)));
            if (length1 < length2) {
                let foo = drawQueue[queueIndex - 1];
                drawQueue[queueIndex] = drawQueue[queueIndex - 1];
                drawQueue[queueIndex - 1] = foo;
            }
        }
    }

    for (let queueIndex = 0; queueIndex < drawQueue.length; queueIndex++) {
        draw3dRectangle(drawQueue[queueIndex], camera);
    }

    clearKeys();

    drawQueue = [];

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);