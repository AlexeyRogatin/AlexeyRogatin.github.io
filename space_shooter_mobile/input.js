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

let touchEvents = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
    const rect = canvas.getBoundingClientRect();
    let canvasToScreenWidth = canvas.width / canvas.clientWidth;
    let canvasToScreenHeight = canvas.height / canvas.clientHeight;

    for (let index = 0; index < event.changedTouches.length; index++) {
        let id = event.changedTouches[index].identifier;

        touchEvents[id] = makeTouch();

        touchEvents[id].id = id;
        handleKeyDown(touchEvents[id]);

        touchEvents[id].x = (event.changedTouches[index].clientX - rect.left) * canvasToScreenWidth;
        touchEvents[id].y = (event.changedTouches[index].clientY - rect.top) * canvasToScreenHeight;
        touchEvents[id].firstX = touchEvents[id].x;
        touchEvents[id].firstY = touchEvents[id].y;
    }
}

window.ontouchmove = function ontouchmove(event) {
    const rect = canvas.getBoundingClientRect();
    let canvasToScreenWidth = canvas.width / canvas.clientWidth;
    let canvasToScreenHeight = canvas.height / canvas.clientHeight;

    for (let index = 0; index < event.changedTouches.length; index++) {
        let id = event.changedTouches[index].identifier;
        touchEvents[id].x = (event.changedTouches[index].clientX - rect.left) * canvasToScreenWidth;
        touchEvents[id].y = (event.changedTouches[index].clientY - rect.top) * canvasToScreenHeight;
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

function clearTouch(touch) {
    touch.wentDown = false;
    touch.wentUp = false;
}

function clearAllKeys() {
    for (let touchIndex = 0; touchIndex < touchEvents.length; touchIndex++) {
        clearTouch(touchEvents[touchIndex]);
    }
}