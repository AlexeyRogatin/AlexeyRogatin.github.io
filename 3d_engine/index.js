'use strict'

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SCREEN_RATIO = 16 / 9;
const SCREEN_WIDTH = 1920;
const RECSIZE = SCREEN_WIDTH;
const VIEW_DIST = SCREEN_WIDTH;

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

function roundv(V) {
    return {
        x: Math.round(V.x),
        y: Math.round(V.y),
        z: Math.round(V.z)
    }
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
        z: 0
    }
    let vector = sum(V, invert(camera));
    result.x = dotProd(vector, camera.axisX);
    result.y = dotProd(vector, camera.axisY);
    let normal = vectorProd(camera.axisX, camera.axisY);
    result.z = dotProd(vector, normal) / length(normal);

    return result;
}

function drawPolygon(color, points) {
    let size = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        let point = points[pointIndex];
        point = sum(point, size);
        ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function draw3dPolygon(camera, color, points) {
    let points2d = [];
    // let kek = true;
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        let point = convert3dTo2d(points[pointIndex], camera);
        let nextPoint = convert3dTo2d(points[(pointIndex + 1) % points.length], camera);
        if (point.z >= 0) {
            points2d.push(point);
            points2d[points2d.length - 1] = mult(VIEW_DIST / (points2d[points2d.length - 1].z), points2d[points2d.length - 1]);
        } else {
            // kek = false;
        }
        if (point.z * nextPoint.z < 0) {
            let S = sum(points[(pointIndex + 1) % points.length], invert(points[pointIndex]));
            let n = vectorProd(camera.axisX, camera.axisY);
            let intersectPoint = sum(points[pointIndex],
                mult(-(dotProd(points[pointIndex], n) - dotProd(camera, n)) / dotProd(S, n), S)
            );
            intersectPoint = convert3dTo2d(intersectPoint, camera);
            points2d.push(intersectPoint);
        }
    }
    drawPolygon(color, points2d);
    // if (kek) {
    //     let axis1 = mult(1 / RECSIZE, sum(points2d[0], invert(points2d[1])));
    //     let axis2 = mult(1 / RECSIZE, sum(points2d[2], invert(points2d[1])));
    //     ctx.save();
    //     ctx.transform(axis1.x, axis1.y, axis2.x, axis2.y, points2d[1].x + canvas.width / 2, points2d[1].y + canvas.height / 2);
    //     let image = new Image;
    //     image.src = './4.jpg';
    //     ctx.drawImage(image, 0, 0, RECSIZE, RECSIZE);
    //     ctx.restore();
    // }
}

function draw3dRectangle(rectangle, camera) {
    let points = [];
    points.push(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)));
    points.push(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)));
    points.push(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)));
    points.push(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)));
    draw3dPolygon(camera, rectangle.color, points);
}

function add3dRectangle(drawQueue, rectangle) {
    drawQueue.push(rectangle);
}

const CAMERA_SPEED = 75;
const CAMERA_ANGLE_SPEED = Math.PI / 1800;

const LINES_COUNT = 0.5;
const LINES_OFFSET = SCREEN_WIDTH * 2;

function loop() {
    drawPolygon('grey',
        [{ x: -canvas.width * 0.5, y: -canvas.height * 0.5 },
        { x: canvas.width * 0.5, y: -canvas.height * 0.5 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: -canvas.width * 0.5, y: canvas.height * 0.5 }]
    );

    add3dRectangle(drawQueue, rectangle1);
    add3dRectangle(drawQueue, rectangle2);
    add3dRectangle(drawQueue, rectangle3);
    add3dRectangle(drawQueue, rectangle4);
    add3dRectangle(drawQueue, rectangle5);
    add3dRectangle(drawQueue, rectangle6);

    let vector = mult((wKey.isDown - sKey.isDown), vectorProd(camera.axisX, camera.axisY));
    let vectorX = mult((dKey.isDown - aKey.isDown), camera.axisX);
    let vectorY = mult((ctrlKey.isDown - spaceKey.isDown), camera.axisY);
    camera.x += (vector.x + vectorX.x + vectorY.x) * CAMERA_SPEED;
    camera.y += (vector.y + vectorX.y + vectorY.y) * CAMERA_SPEED;
    camera.z += (vector.z + vectorX.z + vectorY.z) * CAMERA_SPEED;

    let normal = mult(CAMERA_ANGLE_SPEED * mouse.movementX, unit({ x: 0, y: 1, z: 0 }));
    camera.axisX = sum(camera.axisX, vectorProd(normal, camera.axisX));
    camera.axisY = sum(camera.axisY, vectorProd(normal, camera.axisY));

    normal = mult(-CAMERA_ANGLE_SPEED * mouse.movementY, unit(camera.axisX));
    camera.axisY = sum(camera.axisY, vectorProd(normal, camera.axisY));

    camera.axisX = unit(camera.axisX);
    camera.axisY = unit(camera.axisY);

    let mistakes = 1;
    while (mistakes !== 0) {
        mistakes = 0;
        for (let queueIndex = 1; queueIndex < drawQueue.length; queueIndex++) {
            let normal = vectorProd(camera.axisX, camera.axisY);
            let realCamera = sum(mult(-VIEW_DIST, normal), camera);
            let length2 = length(sum(drawQueue[queueIndex], invert(realCamera)));
            let length1 = length(sum(drawQueue[queueIndex - 1], invert(realCamera)));
            if (length1 < length2) {
                let foo = drawQueue[queueIndex - 1];
                drawQueue[queueIndex - 1] = drawQueue[queueIndex];
                drawQueue[queueIndex] = foo;
                mistakes++;
            }
        }
    }

    for (let queueIndex = 0; queueIndex < drawQueue.length; queueIndex++) {
        draw3dRectangle(drawQueue[queueIndex], camera);
    }

    // let cameraLinePos = roundv(mult(1 / LINES_OFFSET, camera));

    // for (let linesIndexX = -LINES_COUNT + cameraLinePos.x; linesIndexX <= LINES_COUNT + cameraLinePos.x; linesIndexX++) {
    //     for (let linesIndexY = -LINES_COUNT + cameraLinePos.y; linesIndexY <= LINES_COUNT + cameraLinePos.y; linesIndexY++) {
    //         draw3dPolygon(camera, 'cyan',
    //             [{ x: linesIndexX * LINES_OFFSET, y: linesIndexY * LINES_OFFSET, z: -Number.MAX_SAFE_INTEGER },
    //             { x: linesIndexX * LINES_OFFSET, y: linesIndexY * LINES_OFFSET, z: Number.MAX_SAFE_INTEGER }]);
    //     }
    // }

    // for (let linesIndexZ = -LINES_COUNT + cameraLinePos.z; linesIndexZ <= LINES_COUNT + cameraLinePos.z; linesIndexZ++) {
    //     for (let linesIndexY = -LINES_COUNT + cameraLinePos.y; linesIndexY <= LINES_COUNT + cameraLinePos.y; linesIndexY++) {
    //         draw3dPolygon(camera, 'cyan',
    //             [{ z: linesIndexZ * LINES_OFFSET, y: linesIndexY * LINES_OFFSET, x: -Number.MAX_SAFE_INTEGER },
    //             { z: linesIndexZ * LINES_OFFSET, y: linesIndexY * LINES_OFFSET, x: Number.MAX_SAFE_INTEGER }]);
    //     }
    // }

    // for (let linesIndexX = -LINES_COUNT + cameraLinePos.x; linesIndexX <= LINES_COUNT + cameraLinePos.x; linesIndexX++) {
    //     for (let linesIndexZ = -LINES_COUNT + cameraLinePos.z; linesIndexZ <= LINES_COUNT + cameraLinePos.z; linesIndexZ++) {
    //         draw3dPolygon(camera, 'cyan',
    //             [{ x: linesIndexX * LINES_OFFSET, z: linesIndexZ * LINES_OFFSET, y: -Number.MAX_SAFE_INTEGER },
    //             { x: linesIndexX * LINES_OFFSET, z: linesIndexZ * LINES_OFFSET, y: Number.MAX_SAFE_INTEGER }]);
    //     }
    // }

    // draw3dPolygon(camera, 'cyan',
    //     [{ x: camera.x, y: camera.y, z: -Number.MAX_SAFE_INTEGER },
    //     { x: camera.x, y: camera.y, z: Number.MAX_SAFE_INTEGER }]);
    // draw3dPolygon(camera, 'cyan',
    //     [{ x: camera.x, y: -Number.MAX_SAFE_INTEGER, z: camera.z },
    //     { x: camera.x, y: Number.MAX_SAFE_INTEGER, z: camera.z }]);
    // draw3dPolygon(camera, 'cyan',
    //     [{ x: -Number.MAX_SAFE_INTEGER, y: camera.y, z: camera.z },
    //     { x: Number.MAX_SAFE_INTEGER, y: camera.y, z: camera.z }]);

    clearKeys();

    drawQueue = [];

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);