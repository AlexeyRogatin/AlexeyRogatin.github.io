'use strict'

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const SCREEN_RATIO = 16 / 9;
const SCREEN_WIDTH = 1920;

const CUBESIZE = SCREEN_WIDTH;

//the distance from the clipping plane to the viewer
const ANGLE_OF_VIEW = Math.PI / 180 * 90;
// const VIEW_DIST = SCREEN_WIDTH / 20;
const VIEW_DIST = (SCREEN_WIDTH / 2) / Math.tan(ANGLE_OF_VIEW / 2);

const CAMERA_SPEED = 75;
const CAMERA_ANGLE_SPEED = Math.PI / 1800;

//the number of lines in 3d space net
const LINES_COUNT = 0.5;
const LINES_OFFSET = CUBESIZE;

//resize handling
function handleResize() {
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

//camera object sets the plane
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
    z: CUBESIZE / 2,
    axisX: {
        x: CUBESIZE,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: CUBESIZE,
        z: 0,
    },
    color: 'red'
}

let rectangle2 = {
    x: 0,
    y: 0,
    z: -CUBESIZE / 2,
    axisX: {
        x: CUBESIZE,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: CUBESIZE,
        z: 0,
    },
    color: 'orange'
}

let rectangle3 = {
    x: CUBESIZE / 2,
    y: 0,
    z: 0,
    axisX: {
        x: 0,
        y: CUBESIZE,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: CUBESIZE,
    },
    color: 'yellow'
}

let rectangle4 = {
    x: -CUBESIZE / 2,
    y: 0,
    z: 0,
    axisX: {
        x: 0,
        y: CUBESIZE,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: CUBESIZE,
    },
    color: 'green'
}

let rectangle5 = {
    x: 0,
    y: CUBESIZE / 2,
    z: 0,
    axisX: {
        x: CUBESIZE,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: CUBESIZE,
    },
    color: 'blue'
}

let rectangle6 = {
    x: 0,
    y: -CUBESIZE / 2,
    z: 0,
    axisX: {
        x: CUBESIZE,
        y: 0,
        z: 0,
    },
    axisY: {
        x: 0,
        y: 0,
        z: CUBESIZE,
    },
    color: 'purple'
}

//the queue for drawing objects
let drawQueue = [];

//functions for working with vectors
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

//Converts point in 3d space to the point on the plane applying perspective to it
//z shows if the point is in front of the clipping plane
function convert3dTo2d(V, camera) {
    let result = {
        x: 0,
        y: 0,
        z: 1
    }
    let vector = sum(V, invert(camera));
    result.x = dotProd(vector, camera.axisX);
    result.y = dotProd(vector, camera.axisY);
    let normal = vectorProd(camera.axisX, camera.axisY);
    let z = dotProd(vector, normal);
    if (z <= 0) {
        result.z = 0;
    } else {
        result = mult(VIEW_DIST / (z + VIEW_DIST), result);
    }

    return result;
}

//draws 2d polygon by points
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

//draws a 3d polygon by points
function draw3dPolygon(camera, color, points) {
    let points2d = [];
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        let point = convert3dTo2d(points[pointIndex], camera);
        let nextPoint = convert3dTo2d(points[(pointIndex + 1) % points.length], camera);
        if (point.z) {
            points2d.push(point);
        }
        if (point.z && !nextPoint.z || !point.z && nextPoint.z) {
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
}

//pushes rectangle to drawing queue
function add3dRectangle(drawQueue, rectangle) {
    let drawing = {
        points: [],
        color: rectangle.color
    }
    drawing.points.push(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)));
    drawing.points.push(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(-0.5, rectangle.axisY)));
    drawing.points.push(sum(sum(rectangle, mult(0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)));
    drawing.points.push(sum(sum(rectangle, mult(-0.5, rectangle.axisX)), mult(0.5, rectangle.axisY)));
    drawQueue.push(drawing);
}

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

    if (dotProd(camera.axisY, { x: 0, y: 1, z: 0 }) < 0) {
        let normal = vectorProd(camera.axisX, { x: 0, y: 1, z: 0 });
        camera.axisY = mult(Math.sign(dotProd(camera.axisY, normal)), normal);
    }


    let mistakes = 1;
    while (mistakes !== 0) {
        mistakes = 0;
        for (let queueIndex = 1; queueIndex < drawQueue.length; queueIndex++) {
            let normal = vectorProd(camera.axisX, camera.axisY);
            let realCamera = sum(mult(-VIEW_DIST, normal), camera);
            let center = { x: 0, y: 0, z: 0 };
            for (let pointIndex = 0; pointIndex < drawQueue[queueIndex].points.length; pointIndex++) {
                center = sum(center, drawQueue[queueIndex].points[pointIndex]);
            }
            center = mult(1 / drawQueue[queueIndex].points.length, center);
            let length2 = length(sum(center, invert(realCamera)));
            center = { x: 0, y: 0, z: 0 };
            for (let pointIndex = 0; pointIndex < drawQueue[queueIndex - 1].points.length; pointIndex++) {
                center = sum(center, drawQueue[queueIndex - 1].points[pointIndex]);
            }
            center = mult(1 / drawQueue[queueIndex - 1].points.length, center);
            let length1 = length(sum(center, invert(realCamera)));
            if (length1 < length2) {
                let foo = drawQueue[queueIndex - 1];
                drawQueue[queueIndex - 1] = drawQueue[queueIndex];
                drawQueue[queueIndex] = foo;
                mistakes++;
            }
        }
    }

    for (let queueIndex = 0; queueIndex < drawQueue.length; queueIndex++) {
        draw3dPolygon(camera, drawQueue[queueIndex].color, drawQueue[queueIndex].points);
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