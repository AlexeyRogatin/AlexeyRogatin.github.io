let globalInputString = '';

function makeKey() {
    return {
        isDown: false,
        wentDown: false,
        wentUp: false,
    };
}

function makeTouch() {
    return {
        isDown: false,
        wentDown: false,
        wentUp: false,
        x: 0,
        y: 0,
        firstX: 0,
        firstY: 0,
        id: -1,
    };
}

let touchEvents = [];

function handleKeyDown(key) {
    if (!key.isDown) {
        key.wentDown = true;
        key.isDown = true;
    }
}

function handleKeyUp(key) {
    if (key.isDown) {
        key.wentUp = true;
        key.isDown = false;
    }
}

window.ontouchstart = function ontouchstart(event) {
    for (let index = 0; index < event.changedTouches.length; index++) {
        let id = event.changedTouches[index].identifier;
        if (id > touchEvents.length) {
            touchEvents.push(makeTouch());
        } else {
            touchEvents[id] = makeTouch();
        }
        touchEvents[id].id = id;
        handleKeyDown(touchEvents[id]);

        const rect = canvas.getBoundingClientRect();
        touchEvents[id].x = (event.changedTouches[index].clientX - rect.left) / canvas.clientWidth * canvas.width;
        touchEvents[id].y = (event.changedTouches[index].clientY - rect.top) / canvas.clientHeight * canvas.height;
        touchEvents[id].firstX = touchEvents[id].x;
        touchEvents[id].firstY = touchEvents[id].y;
    }
}

window.ontouchmove = function ontouchmove(event) {
    const rect = canvas.getBoundingClientRect();
    for (let index = 0; index < event.touches.length; index++) {
        let id = event.touches[index].identifier;
        touchEvents[id].x = (event.touches[index].clientX - rect.left) / canvas.clientWidth * canvas.width;
        touchEvents[id].y = (event.touches[index].clientY - rect.top) / canvas.clientHeight * canvas.height;
    }
};

window.ontouchend = function ontouchend(event) {
    if (document.fullscreenElement != document.documentElement) {
        document.documentElement.requestFullscreen().then(() => {
            window.screen.orientation.lock("landscape");
        });
    }

    for (let index = 0; index < event.changedTouches.length; index++) {
        let id = event.changedTouches[index].identifier;
        handleKeyUp(touchEvents[id]);
    }
};

function clearKey(key) {
    key.wentDown = false;
    key.wentUp = false;
}

function clearTouch(touch) {
    touch.wentDown = false;
    touch.wentUp = false;
    if (!touch.isDown) {
        touch.x = 0;
        touch.y = 0;
    }
}

function clearAllKeys() {
    for (let touchIndex = 0; touchIndex < touchEvents.length; touchIndex++) {
        clearTouch(touchEvents[touchIndex]);
    }
}