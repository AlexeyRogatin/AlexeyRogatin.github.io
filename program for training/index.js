'use strict';

const canvas = document.getElementById("canvas");

const SCREEN_RATIO = 16 / 9;

function handleResize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.style.height = rect.width / SCREEN_RATIO + 'px';
}

handleResize();
window.addEventListener('resize', handleResize);

let camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scale: 1,
    targetScale: 1,
}

const ctx = canvas.getContext("2d");

function rotateVector(x, y, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let resultX = x * cos - y * sin;
    let resultY = -y * cos - x * sin;
    return {
        x: resultX,
        y: resultY,
    };
}

function vectorLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function dot(x1, y1, x2, y2) {
    return (x1 * x2 + y1 * y2);
}

function angleBetweenPoints(startX, startY, x, y) {
    let dX = x - startX;
    let dY = y - startY;
    let angle = Math.acos(dot(1, 0, dX, dY) / vectorLength(dX, dY));
    if (dY > 0) {
        angle = Math.PI + (Math.PI - angle);
    }
    return angle;
}

function drawArc(x, y, radius, startAngle, finishAngle, color) {
    ctx.globalAlpha = 1;
    x = camera.x + (x - camera.x) / camera.scale;
    y = camera.y + (y - camera.y) / camera.scale;
    radius /= camera.scale;
    ctx.beginPath();
    let finishPoint = rotateVector(radius, 0, finishAngle);
    finishPoint.x += x;
    finishPoint.y += y;
    ctx.moveTo(x, y);
    ctx.lineTo(finishPoint.x, finishPoint.y);
    ctx.arc(x, y, radius, -finishAngle, -startAngle);
    ctx.lineTo(x, y);

    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawRect(x, y, width, height, angle, color) {
    ctx.globalAlpha = 1;
    x = camera.x + (x - camera.x) / camera.scale;
    y = camera.y + (y - camera.y) / camera.scale;
    width /= camera.scale;
    height /= camera.scale;
    ctx.translate(x, y);
    ctx.rotate(-angle);

    ctx.fillStyle = color;
    ctx.fillRect(-width * 0.5, -height * 0.5, width, height);

    ctx.rotate(angle);
    ctx.translate(-x, -y);
}

function drawLine(x1, y1, x2, y2, width) {
    x1 = camera.x + (x1 - camera.x) / camera.scale;
    y1 = camera.y + (y1 - camera.y) / camera.scale;
    x2 = camera.x + (x2 - camera.x) / camera.scale;
    y2 = camera.y + (y2 - camera.y) / camera.scale;
    ctx.lineWidth = width / camera.scale;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawText(x, y, text, textBaseline, textAlign, font, fillStyle, alpha, width = 999999, interval = 0) {
    interval /= camera.scale;
    x = camera.x + (x - camera.x) / camera.scale;
    y = camera.y + (y - camera.y) / camera.scale;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;

    let words = text.split(' ');
    let line = '';
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        let supposedLine = line + words[wordIndex] + ' ';
        if (ctx.measureText(supposedLine).width > width) {
            ctx.fillText(line, x, y);
            y += interval;
            line = words[wordIndex] + ' ';
        } else {
            line = supposedLine;
        }
    }
    ctx.fillText(line, x, y);
}

const OFFSET_VALUE = 5;

let data = [
    {
        percent: '0.22',
        color: 'black',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: '0.78',
        color: 'green',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: '0.5',
        color: 'red',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: '1',
        color: 'blue',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: '0.55',
        color: 'yellow',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: '0.55',
        color: 'orange',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо! AAAAAAAAAAAAAA",
    },
    {
        percent: '0.55',
        color: 'magenta',
        offset: OFFSET_VALUE,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
]

const FULL_RADIUS = 300;
const CAMERA_TRANSITION_VALUE = 0.1;
const TEXT_HEIGHT = 50;

let writingIndex = -1;

function loop() {
    ctx.translate(-camera.x + canvas.width * 0.5, -camera.y + canvas.height * 0.5);
    mouse.worldX = mouse.x + camera.x - canvas.width * 0.5;
    mouse.worldY = mouse.y + camera.y - canvas.height * 0.5;
    mouse.worldX = camera.x + (mouse.worldX - camera.x) * camera.scale;
    mouse.worldY = camera.y + (mouse.worldY - camera.y) * camera.scale;

    drawRect(camera.x, camera.y, canvas.width * camera.scale, canvas.height * camera.scale, 0, 'white');

    let buttonPressed = false;

    if (writingIndex !== -1 && mouse.wentDown) {
        writingIndex = -1;
        buttonPressed = true;
    }

    let startAngle = 0;
    let angleDelta = Math.PI * 2 / data.length;
    let mouseAngle = angleBetweenPoints(0, 0, mouse.worldX, mouse.worldY);

    for (let arcIndex = 0; arcIndex < data.length; arcIndex++) {
        let dataEntry = data[arcIndex];

        let finishAngle = startAngle + angleDelta;
        let midAngle = (startAngle + finishAngle) / 2;

        let offset = rotateVector(dataEntry.offset, 0, midAngle);

        let entryCameraPos = rotateVector(FULL_RADIUS * dataEntry.percent + 50, 0, midAngle);
        let entryPos = { x: entryCameraPos.x + offset.x, y: entryCameraPos.y + offset.y };

        if (camera.targetScale === 1 && mouse.wentDown && !buttonPressed) {
            let textParam = ctx.measureText(dataEntry.title);
            if (mouse.worldX >= entryPos.x - textParam.width * 0.5 && mouse.worldX <= entryPos.x + textParam.width * 0.5 &&
                mouse.worldY >= entryPos.y - TEXT_HEIGHT * 0.5 && mouse.worldY <= entryPos.y + TEXT_HEIGHT * 0.5) {
                writingIndex = arcIndex;
            }
        }

        let transition = 1 - (camera.scale - 0.1) * 10 / 9;
        let title = dataEntry.title;

        if (writingIndex === arcIndex || vectorLength(mouse.worldX, mouse.worldY) <= FULL_RADIUS * 1.2 && startAngle < mouseAngle && finishAngle > mouseAngle && camera.targetScale === 1) {
            dataEntry.offset += 10;
            if (mouse.wentDown && writingIndex === -1 && !buttonPressed) {
                camera.targetX = entryCameraPos.x;
                camera.targetY = entryCameraPos.y;
                camera.targetScale = 0.1;
                mouse.wentDown = false;
            }
            if (writingIndex === arcIndex) {
                title = dataEntry.percent;
            }
        }
        dataEntry.offset = OFFSET_VALUE + (dataEntry.offset - OFFSET_VALUE) * 0.75;


        drawArc(offset.x, offset.y, FULL_RADIUS * dataEntry.percent, startAngle, finishAngle, dataEntry.color);

        let finishPos = rotateVector(FULL_RADIUS * 1.2, 0, finishAngle);
        drawLine(0, 0, finishPos.x, finishPos.y, OFFSET_VALUE);

        drawText(entryPos.x, entryPos.y - transition * 20, title, 'middle', 'center', TEXT_HEIGHT + 'px Brush Script MT', 'black', 1);

        let textTransparency = 1 - (camera.scale - 0.1) / 0.05;
        if (textTransparency < 0) {
            textTransparency = 0;
        }
        drawText(entryPos.x, entryPos.y - 10, Math.round(dataEntry.percent * 100) + '%', 'middle', 'center', TEXT_HEIGHT + 'px Brush Script MT', 'black', textTransparency);
        drawText(entryPos.x, entryPos.y, dataEntry.text, 'middle', 'center', TEXT_HEIGHT + 'px Brush Script MT', 'black', textTransparency, canvas.width * 0.5, 10);

        startAngle = finishAngle;
    }

    if (Math.abs(camera.scale) !== 1 && mouse.wentDown) {
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetScale = 1;
    }

    clearMouse();

    ctx.translate(camera.x - canvas.width * 0.5, camera.y - canvas.height * 0.5);

    camera.x += (camera.targetX - camera.x) * CAMERA_TRANSITION_VALUE;
    camera.y += (camera.targetY - camera.y) * CAMERA_TRANSITION_VALUE;
    camera.scale += (camera.targetScale - camera.scale) * CAMERA_TRANSITION_VALUE;

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);