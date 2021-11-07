var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
function makeTouch() {
    var touch = {
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        wentDown: false,
        isDown: false,
        wentUp: false,
        id: -1
    };
    return touch;
}
var mouse = makeTouch();
function correctValueStr(valueStr) {
    var correctedStr = valueStr.replace(/,/g, ".");
    if (correctedStr[0] === '0' && correctedStr[1] !== '.' && correctedStr.length > 1) {
        correctedStr = correctedStr.slice(1, correctedStr.length);
    }
    if (correctedStr.length === 0) {
        correctedStr += '0';
    }
    return correctedStr;
}
if (!isMobile) {
    window.onmousemove = function onmousemove(event) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left) / canvas.clientWidth * canvas.width;
        mouse.y = (event.clientY - rect.top) / canvas.clientHeight * canvas.height;
    };
    window.onmousedown = function onmousedown(event) {
        mouse.wentDown = true;
        mouse.isDown = true;
    };
    window.onmouseup = function onmouseup(event) {
        mouse.wentUp = true;
        mouse.isDown = false;
    };
    window.onkeydown = function onkeydown(event) {
        if (writingIndex !== -1) {
            var valueStr = data[writingIndex].targetPercent;
            switch (event.key) {
                case 'Backspace':
                    {
                        if (valueStr.length) {
                            valueStr = valueStr.slice(0, -1);
                        }
                    }
                    break;
                default: {
                    if (Number(valueStr) * 100 % 10 === 0 && (event.keyCode >= 48 && event.keyCode <= 57 || ((event.key === '.' || event.key === ',') && valueStr.split('.').length === 1))) {
                        valueStr += event.key;
                    }
                }
            }
            valueStr = correctValueStr(valueStr);
            data[writingIndex].targetPercent = valueStr;
        }
    };
}
else {
    var rect_1 = canvas.getBoundingClientRect();
    window.ontouchmove = function ontouchmove(event) {
        if (mouse.id === event.changedTouches[0].identifier) {
            mouse.x = (event.changedTouches[0].clientX - rect_1.left) / canvas.clientWidth * canvas.width;
            mouse.y = (event.changedTouches[0].clientY - rect_1.top) / canvas.clientHeight * canvas.height;
        }
    };
    window.ontouchstart = function ontouchstart(event) {
        if (!(mouse.isDown || mouse.wentUp)) {
            mouse.id = event.changedTouches[0].identifier;
            mouse.wentDown = true;
            mouse.isDown = true;
            mouse.x = (event.changedTouches[0].clientX - rect_1.left) / canvas.clientWidth * canvas.width;
            mouse.y = (event.changedTouches[0].clientY - rect_1.top) / canvas.clientHeight * canvas.height;
        }
    };
    window.ontouchend = function ontouchend(event) {
        mouse.wentUp = true;
        mouse.isDown = false;
    };
}
function clearMouse() {
    mouse.wentDown = false;
    mouse.wentUp = false;
    if (isMobile && !mouse.isDown && !mouse.wentUp) {
        mouse.x = 99999;
        mouse.y = 99999;
    }
}
