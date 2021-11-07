'use strict';
var canvas = document.getElementById("canvas");
function handleResize() {
    var rect = canvas.getBoundingClientRect();
    var rectWidth = rect.width;
    var rectHeight = rect.height;
    // if (isMobile && (window.orientation === "portrait-primary" || window.orientation === "portrait-secondary")) {
    // rectWidth = rect.height;
    // rectHeight = rect.width;
    // }
    if (rectWidth >= rectHeight) {
        canvas.height = 1080;
        canvas.width = 1080 / rectHeight * rectWidth;
        canvas.style.height = rectHeight.toString();
        canvas.style.width = rectWidth.toString();
    }
    else {
        canvas.width = 1080;
        canvas.height = 1080 / rectWidth * rectHeight;
        canvas.style.width = rectWidth.toString();
        canvas.style.height = rectHeight.toString();
    }
}
handleResize();
window.addEventListener('resize', handleResize);
var camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scale: 1,
    targetScale: 1
};
var ctx = canvas.getContext("2d");
function rotateVector(x, y, angle) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    var resultX = x * cos - y * sin;
    var resultY = -y * cos - x * sin;
    return {
        x: resultX,
        y: resultY
    };
}
function vectorLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
function dot(x1, y1, x2, y2) {
    return (x1 * x2 + y1 * y2);
}
function angleBetweenPoints(startX, startY, x, y) {
    var dX = x - startX;
    var dY = y - startY;
    var angle = Math.acos(dot(1, 0, dX, dY) / vectorLength(dX, dY));
    if (dY > 0) {
        angle = Math.PI + (Math.PI - angle);
    }
    return angle;
}
function drawText(x, y, text, textBaseline, textAlign, font, fillStyle, alpha, width, interval) {
    if (width === void 0) { width = 999999; }
    if (interval === void 0) { interval = 0; }
    interval /= camera.scale;
    x = camera.x + (x - camera.x) / camera.scale;
    y = camera.y + (y - camera.y) / camera.scale;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
    var words = text.split(' ');
    var line = '';
    for (var wordIndex = 0; wordIndex < words.length; wordIndex++) {
        var supposedLine = line + words[wordIndex] + ' ';
        if (ctx.measureText(supposedLine).width > width) {
            ctx.fillText(line, x, y);
            y += interval;
            line = words[wordIndex] + ' ';
        }
        else {
            line = supposedLine;
        }
    }
    ctx.fillText(line, x, y);
}
function drawArc(x, y, radius, startAngle, finishAngle, color) {
    ctx.globalAlpha = 1;
    x = camera.x + (x - camera.x) / camera.scale;
    y = camera.y + (y - camera.y) / camera.scale;
    radius /= camera.scale;
    ctx.beginPath();
    var finishPoint = rotateVector(radius, 0, finishAngle);
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
var TEXT_HEIGHT = 50;
if (isMobile) {
    TEXT_HEIGHT = 80;
}
var font = TEXT_HEIGHT + 'px Arial';
function computeOffset(title, index, dataLength, distance) {
    var angleDelta = Math.PI * 2 / dataLength;
    var midAngle = (index + 0.5) * angleDelta;
    var angle1 = index * angleDelta;
    var angle2 = angle1 + angleDelta;
    var offset = Math.ceil(distance);
    var pos = rotateVector(offset, 0, midAngle);
    var offsetDelta = rotateVector(1, 0, midAngle);
    var sqrDistance = distance * distance;
    ctx.font = font;
    var hlfWidth = ctx.measureText(title).width * 0.5;
    var hlfHeight = TEXT_HEIGHT * 0.5;
    var points = [
        { x: pos.x - hlfWidth, y: pos.y - hlfHeight },
        { x: pos.x - hlfWidth, y: pos.y + hlfHeight },
        { x: pos.x + hlfWidth, y: pos.y - hlfHeight },
        { x: pos.x + hlfWidth, y: pos.y + hlfHeight },
    ];
    var isValid;
    do {
        isValid = true;
        for (var pointIndex = 0; pointIndex < points.length; pointIndex++) {
            var pointRadius = points[pointIndex].x * points[pointIndex].x + points[pointIndex].y * points[pointIndex].y;
            var pointAngle = angleBetweenPoints(0, 0, points[pointIndex].x, points[pointIndex].y);
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
    } while (!isValid);
    return { x: points[0].x + hlfWidth, y: points[0].y + hlfHeight };
}
var LINE_WIDTH = 5;
var colors = [
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
];
var data = [
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Сон",
        text: "Ты что совсем!!!!!!! Больше спать надо!"
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Тренировки",
        text: "Ты что совсем!!!!!!! Больше спать надо!"
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Еда",
        text: "Ты что совсем!!!!!!! Больше спать надо!"
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Вода",
        text: "Ты что совсем!!!!!!! Больше спать надо!"
    },
    {
        percent: 0,
        targetPercent: '0',
        offset: LINE_WIDTH,
        title: "Прогулки",
        text: "Ты что совсем!!!!!!! Больше спать надо!"
    },
];
function setLocalStorage() {
    for (var index = 0; index < data.length; index++) {
        window.localStorage.setItem(String(index), data[index].targetPercent);
    }
}
for (var index = 0; index < window.localStorage.length; index++) {
    var entry = window.localStorage.getItem(String(index));
    if (entry) {
        if (data[index]) {
            data[index].targetPercent = entry;
        }
        else {
            window.localStorage.removeItem(String(index));
        }
    }
}
var FULL_RADIUS = 400;
var TRANSITION_VALUE = 0.1;
var writingIndex = -1;
var lookingIndex = -1;
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
    var buttonPressed = false;
    //отмена режима ввода значений
    if (writingIndex !== -1 && mouse.wentUp) {
        //сохранение значений в localStorage
        setLocalStorage();
        writingIndex = -1;
        buttonPressed = true;
    }
    //подготовка значений единых для цикла
    var startAngle = 0;
    var angleDelta = Math.PI * 2 / data.length;
    var mouseAngle = angleBetweenPoints(0, 0, mouse.worldX, mouse.worldY);
    for (var arcIndex = 0; arcIndex < data.length; arcIndex++) {
        //данные о дуге
        var dataEntry = data[arcIndex];
        var finishAngle = startAngle + angleDelta;
        var midAngle = (startAngle + finishAngle) / 2;
        //смещение
        var offset = rotateVector(dataEntry.offset, 0, midAngle);
        //вычисление позиции заголовка и текста записи
        var entryPos = computeOffset(dataEntry.title, arcIndex, data.length, dataEntry.percent * FULL_RADIUS + 10);
        entryPos.x += offset.x;
        entryPos.y += offset.y;
        //переход в режим записи при нажатие на заголовок
        if (camera.targetScale === 1 && mouse.wentUp && !buttonPressed) {
            ctx.font = font;
            var textParam = ctx.measureText(dataEntry.title);
            if (mouse.worldX >= entryPos.x - textParam.width * 0.5 && mouse.worldX <= entryPos.x + textParam.width * 0.5 &&
                mouse.worldY >= entryPos.y - TEXT_HEIGHT * 0.5 && mouse.worldY <= entryPos.y + TEXT_HEIGHT * 0.5) {
                if (!isMobile) {
                    writingIndex = arcIndex;
                }
                else {
                    var saveValue = data[arcIndex].targetPercent;
                    data[arcIndex].targetPercent = window.prompt('Введите значение', data[arcIndex].targetPercent);
                    if (data[arcIndex].targetPercent === null) {
                        data[arcIndex].targetPercent = saveValue;
                    }
                    data[arcIndex].targetPercent = correctValueStr(data[arcIndex].targetPercent);
                    if (isNaN(Number(data[arcIndex].targetPercent))) {
                        data[arcIndex].targetPercent = saveValue;
                        alert("Ошибка при обработке данных");
                    }
                    else {
                        //сохранение значений в localStorage
                        setLocalStorage();
                    }
                    buttonPressed = true;
                }
            }
        }
        //текст заголовка
        var title = dataEntry.title;
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
        var finishPos = rotateVector(FULL_RADIUS * 1.2, 0, finishAngle);
        drawLine(0, 0, finishPos.x, finishPos.y, LINE_WIDTH);
        //прозрачность для вознакающего текста
        var textTransparency = 1 - (camera.scale - 0.1) / 0.05;
        if (textTransparency < 0) {
            textTransparency = 0;
        }
        //если мы рассматриваем другой сектор, то прозрачность не повышается
        if (arcIndex !== lookingIndex) {
            textTransparency = 0;
        }
        else {
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
