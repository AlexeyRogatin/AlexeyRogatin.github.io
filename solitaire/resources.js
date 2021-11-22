let resourcesWaitingForLoadCount = 0;
let resourcesLoadedCount = 0;
let canBeginGame = false;

function resourceLoaded(src) {
    resourcesLoadedCount++;

    // console.log('loaded', src);
    if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
        canBeginGame = true;
    }
}

function drawRect(x, y, width, height, angle, color) {
    ctx.translate(x, y);
    ctx.rotate(-angle);

    ctx.fillStyle = color;
    ctx.fillRect(-width * 0.5, -height * 0.5, width, height);

    ctx.rotate(angle);
    ctx.translate(-x, -y);
}

function loadImage(src) {
    let img = new Image();
    img.src = src;
    resourcesWaitingForLoadCount++;
    img.onload = () => resourceLoaded(src);

    return img;
}

function drawText(x, y, text, textBaseline, textAlign, font, color, angle, outLineColor = 'black', outlineWidth = 0) {
    ctx.translate(x, y);
    ctx.rotate(-angle);

    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
    ctx.fillText(text, 0, 0);
    ctx.strokeText(text, 0, 0);

    ctx.rotate(angle);
    ctx.translate(-x, -y);
}

function drawSprite(x, y, sprite, angle, width, height) {
    ctx.translate(x, y);
    ctx.rotate(-angle);

    let compWidth = width || sprite.width;
    let compHeight = height || sprite.height;
    ctx.drawImage(sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);

    ctx.rotate(angle);
    ctx.translate(-x, -y);
}

let imgCard = loadImage("sprites/card.bmp");
let imgTurnedCard = loadImage("sprites/turnedCard.bmp");
let imgLear = [
    loadImage("sprites/club.bmp"),
    loadImage("sprites/spade.bmp"),
    loadImage("sprites/heart.bmp"),
    loadImage("sprites/ruby.bmp"),
]
let imgReloadDeck = loadImage("sprites/reloadDeck.bmp");
let imgCardDeck = loadImage("sprites/cardDeck.bmp");
let imgWin = loadImage("sprites/win.bmp");
let imgLoose = loadImage("sprites/loose.bmp");
let imgButton = loadImage("sprites/button.bmp");
let imgMainMenuButton = loadImage("sprites/mainmenubutton.bmp");