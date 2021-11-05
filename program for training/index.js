'use strict';

const canvas = document.getElementById("canvas");


function handleResize() {
    const rect = canvas.getBoundingClientRect();
    let SCREEN_RATIO = 1 / 1;

    let rectWidth = rect.width;
    let rectHeight = rect.height;
    // if (isMobile && (window.orientation === "portrait-primary" || window.orientation === "portrait-secondary")) {
    // rectWidth = rect.height;
    // rectHeight = rect.width;
    // }

    if (rectWidth >= rectHeight) {
        canvas.height = 1080;
        canvas.width = 1080 / rectHeight * rectWidth;
        canvas.style.height = rectHeight;
        canvas.style.width = rectWidth;
    } else {
        canvas.width = 1080;
        canvas.height = 1080 / rectWidth * rectHeight;
        canvas.style.width = rectWidth;
        canvas.style.height = rectHeight;
    }
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

let TEXT_HEIGHT = 50;
if (isMobile) {
    TEXT_HEIGHT = 80;
}
let font = TEXT_HEIGHT + 'px Brush Script MT';

function computeOffset(title, index, dataLength, distance) {
    let angleDelta = Math.PI * 2 / dataLength;
    let midAngle = (index + 0.5) * angleDelta;
    let angle1 = index * angleDelta;
    let angle2 = angle1 + angleDelta;

    let offset = Math.ceil(distance);
    let pos = rotateVector(offset, 0, midAngle);
    let offsetDelta = rotateVector(1, 0, midAngle);

    let sqrDistance = distance * distance;
    ctx.font = font;
    let hlfWidth = ctx.measureText(title).width * 0.5;
    let hlfHeight = TEXT_HEIGHT * 0.5;

    let points = [
        { x: pos.x - hlfWidth, y: pos.y - hlfHeight },
        { x: pos.x - hlfWidth, y: pos.y + hlfHeight },
        { x: pos.x + hlfWidth, y: pos.y - hlfHeight },
        { x: pos.x + hlfWidth, y: pos.y + hlfHeight },
    ];

    let isValid;
    do {
        isValid = true;
        for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
            let pointRadius = points[pointIndex].x * points[pointIndex].x + points[pointIndex].y * points[pointIndex].y;
            let pointAngle = angleBetweenPoints(0, 0, points[pointIndex].x, points[pointIndex].y);
            if (pointRadius < sqrDistance || pointAngle < angle1 || pointAngle > angle2) {
                isValid = false;
                break;
            }
        }
        points[0].x += offsetDelta.x;
        points[0].y += offsetDelta.y;
        points[1].x += offsetDelta.x;
        points[1].y += offsetDelta.y;
        points[2].x += offsetDelta.x;
        points[2].y += offsetDelta.y;
        points[3].x += offsetDelta.x;
        points[3].y += offsetDelta.y;
    }
    while (!isValid);
    return { x: points[0].x + hlfWidth, y: points[0].y + hlfHeight };
}

const LINE_WIDTH = 5;

let colors = [
    'red',
    'yellow',
    'green',
    'blue',
    'orange',
    'magenta',
    'cyan',
    'chartreuse',
    'blueViolet',
    'crimson',
    'grey',
    'black',
]

let data = [
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Тренировки",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Еда",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Вода",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Прогулки",
        text: "Ты что совсем!!!!!!! Больше спать надо!",
    },
]

// if (window.localStorage.length > data.length) {
//     window.localStorage.clear();
// }
for (let index = 0; index < window.localStorage.length; index++) {
    let entry = window.localStorage.getItem(String(index));
    if (entry) {
        if (data[index]) {
            data[index].targetPercent = entry;
        } else {
            window.localStorage.removeItem(String(index));
        }
    }
}

const FULL_RADIUS = 400;
const TRANSITION_VALUE = 0.1;

let writingIndex = -1;
let lookingIndex = -1;

function loop() {
    //изменение положения отностительно камеры
    ctx.translate(-camera.x + canvas.width * 0.5, -camera.y + canvas.height * 0.5);

    //очистка экрана
    drawRect(camera.x, camera.y, canvas.width * camera.scale, canvas.height * camera.scale, 0, 'white');

    //вычисление координаты мыши относительно камеры
    mouse.worldX = mouse.x + camera.x - canvas.width * 0.5;
    mouse.worldY = mouse.y + camera.y - canvas.height * 0.5;
    mouse.worldX = camera.x + (mouse.worldX - camera.x) * camera.scale;
    mouse.worldY = camera.y + (mouse.worldY - camera.y) * camera.scale;

    //переменная следящая за тем, чтобы не было нажато больше одной кнопки
    let buttonPressed = false;

    //отмена режима ввода значений
    if (writingIndex !== -1 && mouse.wentUp) {
        //сохранение изменённого значения в localStorage
        window.localStorage.setItem(String(writingIndex), data[writingIndex].targetPercent);
        writingIndex = -1;
        buttonPressed = true;
    }

    //подготовка значений единых для цикла
    let startAngle = 0;
    let angleDelta = Math.PI * 2 / data.length;
    let mouseAngle = angleBetweenPoints(0, 0, mouse.worldX, mouse.worldY);

    for (let arcIndex = 0; arcIndex < data.length; arcIndex++) {
        //данные о дуге
        let dataEntry = data[arcIndex];

        let finishAngle = startAngle + angleDelta;
        let midAngle = (startAngle + finishAngle) / 2;

        //смещение
        let offset = rotateVector(dataEntry.offset, 0, midAngle);

        //вычисление позиции заголовка и текста записи
        let entryPos = computeOffset(dataEntry.title, arcIndex, data.length, dataEntry.percent * FULL_RADIUS + 10);
        entryPos.x += offset.x;
        entryPos.y += offset.y;

        //переход в режим записи при нажатие на заголовок
        if (camera.targetScale === 1 && mouse.wentUp && !buttonPressed) {
            ctx.font = font;
            let textParam = ctx.measureText(dataEntry.title);
            if (mouse.worldX >= entryPos.x - textParam.width * 0.5 && mouse.worldX <= entryPos.x + textParam.width * 0.5 &&
                mouse.worldY >= entryPos.y - TEXT_HEIGHT * 0.5 && mouse.worldY <= entryPos.y + TEXT_HEIGHT * 0.5) {
                if (!isMobile) {
                    writingIndex = arcIndex;
                } else {
                    data[arcIndex].targetPercent = window.prompt('Введите значение', data[arcIndex].targetPercent);
                    buttonPressed = true;
                }
            }
        }

        //текст заголовка
        let title = dataEntry.title;

        //если курсор наведён на дугу или режим ввода
        if (writingIndex === arcIndex || vectorLength(mouse.worldX, mouse.worldY) <= FULL_RADIUS * 1.2 && startAngle < mouseAngle && finishAngle > mouseAngle && camera.targetScale === 1) {
            //увеличивается смещение
            dataEntry.offset += 10;
            //если не вводим, то переходим в режим близкого просмотра
            if (mouse.wentUp && writingIndex === -1 && !buttonPressed) {
                lookingIndex = arcIndex;
                mouse.wentUp = false;
            }
            //если вводим, то меняется текст заголовка
            if (writingIndex === arcIndex) {
                title = dataEntry.targetPercent;
            }
        }
        //придаём инертности смещению заголовка при наведении мышки на дугу
        dataEntry.offset = LINE_WIDTH + (dataEntry.offset - LINE_WIDTH) * 0.75;

        //рисуем дугу
        drawArc(offset.x, offset.y, FULL_RADIUS * dataEntry.percent, startAngle, finishAngle, colors[arcIndex]);

        //рисуем линюю рядом
        let finishPos = rotateVector(FULL_RADIUS * 1.2, 0, finishAngle);
        drawLine(0, 0, finishPos.x, finishPos.y, LINE_WIDTH);

        //прозрачность для вознакающего текста
        let textTransparency = 1 - (camera.scale - 0.1) / 0.05;
        if (textTransparency < 0) {
            textTransparency = 0;
        }
        //если мы рассматриваем другой сектор, то прозрачность не повышается
        if (arcIndex !== lookingIndex) {
            textTransparency = 0;
        } else {
            //концетрируемся на рассматриваемом секторе
            camera.targetX = entryPos.x;
            camera.targetY = entryPos.y;
            camera.targetScale = 0.1;
        }
        //пишем данные
        drawText(entryPos.x, entryPos.y - textTransparency * 20, title, 'middle', 'center', font, 'black', 1);
        drawText(entryPos.x, entryPos.y - textTransparency * 10, Math.round(dataEntry.percent * 100) + '%', 'middle', 'center', font, 'black', textTransparency);
        drawText(entryPos.x, entryPos.y, dataEntry.text, 'middle', 'center', font, 'black', textTransparency, canvas.width * 0.5, 10);

        //плавное изменение значений
        dataEntry.percent += (Number(dataEntry.targetPercent) - dataEntry.percent) * TRANSITION_VALUE;

        //рассматриваем для следующего угла
        startAngle = finishAngle;
    }

    //выходим из режима просмотра
    if (mouse.wentUp && !buttonPressed && lookingIndex !== -1) {
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetScale = 1;
        lookingIndex = -1;
    }

    drawText(canvas.width * 0.5, canvas.height * 0.5, 'Programmed by Alexey Rogatin', 'bottom', 'right', '15px comic', 'black', 1);

    clearMouse();

    //перемещаем начало координат обратно
    ctx.translate(camera.x - canvas.width * 0.5, camera.y - canvas.height * 0.5);

    //плавно перемещаем камеру
    camera.x += (camera.targetX - camera.x) * TRANSITION_VALUE;
    camera.y += (camera.targetY - camera.y) * TRANSITION_VALUE;
    camera.scale += (camera.targetScale - camera.scale) * TRANSITION_VALUE;

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);