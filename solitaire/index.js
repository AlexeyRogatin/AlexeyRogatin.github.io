'use strict'

let canvas = document.getElementById("canvas");

const SCREEN_RATIO = 16 / 9;

function handleResize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.style.height = rect.width / SCREEN_RATIO + 'px';
}

handleResize();
window.addEventListener('resize', handleResize);

let ctx = canvas.getContext('2d');

const GAME_STATE_MENU = 0;
const GAME_STATE_GAME = 1;
const GAME_STATE_WIN = 2;

let gameState = GAME_STATE_GAME;

let camera = {
    x: 0,
    y: 0,
}

let decks = [
    [],
    [],
    [[], [], [], [], []],
    [[], [], [], []]
];
const DECKED_CLOSED = 0;
const DECKED_OPENED = 1;
const COLOMNED = 2;
const ACED = 3;

const LEAR_CLUB = 0;
const LEAR_SPADE = 1;
const LEAR_HEART = 2;
const LEAR_RUBY = 3;

const VALUE_JACK = 11;
const VALUE_DAMSEL = 12;
const VALUE_KING = 13;
const VALUE_ACE = 5;

function randomFloat(min, max) {
    let random = Math.random() * (max - min) + min;
    return random;
}

function randomInt(min, max) {
    let roundRandom = Math.round(randomFloat(min, max));
    return roundRandom;
}

function defineLear(index) {
    return (Math.trunc(index / 9));
}

function defineValue(index) {
    return (index % 9 + 6);
}

function addCard(lear, value) {
    decks[DECKED_CLOSED].push({
        x: -canvas.width,
        y: -canvas.height,
        visualX: 0,
        visualY: 0,
        isMooved: false,
        lear: lear,
        value: value,
        closed: true,
    });
}

function moveCardsBetweenDecks(count, deck1, deck2) {
    if (deck1 !== deck2) {
        for (let cardIndex = deck1.length - count; cardIndex < deck1.length; cardIndex++) {
            deck2.push(deck1[cardIndex]);
        }
        for (let index = 0; index < count; index++) {
            deck1.pop();
        }
    }
}

function formStartDeck() {
    for (let lear = 0; lear < 4; lear++) {
        for (let value = 5; value < 14; value++) {
            addCard(lear, value);
        }
    }

    for (let randomizator = 0; randomizator < 100; randomizator++) {
        let firstIndex = randomInt(0, decks[DECKED_CLOSED].length - 1);
        let secondIndex = randomInt(0, decks[DECKED_CLOSED].length - 1);
        let saveCardIndex = decks[DECKED_CLOSED][firstIndex];
        decks[DECKED_CLOSED][firstIndex] = decks[DECKED_CLOSED][secondIndex];
        decks[DECKED_CLOSED][secondIndex] = saveCardIndex;
    }

    for (let index = 0; index < 5; index++) {
        moveCardsBetweenDecks(5 - index, decks[DECKED_CLOSED], decks[COLOMNED][index]);
    }
}

const CARD_WIDTH = 113;
const CARD_HEIGHT = 154;

function checkButton(mouseX, mouseY, x, y, width, height) {
    let result = false;
    if (mouseX >= x - width * 0.5 && mouseX <= x + width * 0.5 &&
        mouseY >= y - height * 0.5 && mouseY <= y + height * 0.5) {
        result = true;
    }
    return result;
}

function findClosestCard(mouseX, mouseY) {
    let result = {
        card: {
            x: -canvas.width,
            y: -canvas.height,
            visualX: 0,
            visualY: 0,
            isMooved: false,
            lear: -1,
            value: -1,
            closed: true,
        },
        type: -1,
        subtype: -1
    };
    //для закрытой части колоды
    let card = decks[DECKED_CLOSED][decks[DECKED_CLOSED].length - 1];
    if (card && checkButton(mouseX, mouseY, card.x, card.y, CARD_WIDTH, CARD_HEIGHT)) {
        result = { card: decks[DECKED_CLOSED][decks[DECKED_CLOSED].length - 1], type: DECKED_CLOSED };
    } else {
        //для открытой части колоды
        for (let cardIndex = decks[DECKED_OPENED].length - 1; cardIndex >= decks[DECKED_OPENED].length - 3; cardIndex--) {
            card = decks[DECKED_OPENED][cardIndex];
            if (card && checkButton(mouseX, mouseY, card.x, card.y, CARD_WIDTH, CARD_HEIGHT)) {
                result = { card: decks[DECKED_OPENED][cardIndex], type: DECKED_OPENED, subtype: -1 };
                break;
            }
        }
    }

    if (result.type === -1) {
        for (let columnIndex = 0; columnIndex < decks[COLOMNED].length; columnIndex++) {
            let column = decks[COLOMNED][columnIndex];
            for (let cardIndex = column.length - 1; cardIndex >= 0; cardIndex--) {
                card = column[cardIndex];
                if (card && checkButton(mouseX, mouseY, card.x, card.y, CARD_WIDTH, CARD_HEIGHT)) {
                    result = { card: decks[COLOMNED][columnIndex][cardIndex], type: COLOMNED, subtype: columnIndex };
                    break;
                }
            }
        }
    }

    if (result.type === -1) {
        for (let aceIndex = 0; aceIndex < decks[ACED].length; aceIndex++) {
            let aceDeck = decks[ACED][aceIndex];
            for (let cardIndex = aceDeck.length - 1; cardIndex >= 0; cardIndex--) {
                card = aceDeck[cardIndex];
                if (card && card.value !== VALUE_ACE && checkButton(mouseX, mouseY, card.x, card.y, CARD_WIDTH, CARD_HEIGHT)) {
                    result = { card: decks[ACED][aceIndex][cardIndex], type: ACED, subtype: aceIndex };
                    break;
                }
            }
        }
    }

    return result;
}

const transitionDelay = 0.1;

function drawCard(card) {
    card.visualX += transitionDelay * (card.x - card.visualX);
    card.visualY += transitionDelay * (card.y - card.visualY);
    if (!card.closed) {
        drawSprite(card.visualX, card.visualY, imgCard, 0);
        let color = 'black';
        if (Math.trunc(card.lear / 2) === 1) {
            color = 'red';
        }
        let valueChar;
        switch (card.value) {
            case 11: {
                valueChar = 'J';
            } break;
            case 12: {
                valueChar = 'D';
            } break;
            case 13: {
                valueChar = 'K';
            } break;
            case 5: {
                valueChar = 'A';
            } break;
            default: {
                valueChar = card.value;
            }
        }
        drawText(card.visualX - CARD_WIDTH * 0.32, card.visualY - CARD_HEIGHT * 0.34, valueChar, 'middle', 'center', 'bold 30px Arial', color, 0);
        drawSprite(card.visualX + CARD_WIDTH * 0.32, card.visualY - CARD_HEIGHT * 0.36, imgLear[card.lear], 0);
        drawText(card.visualX + CARD_WIDTH * 0.32, card.visualY + CARD_HEIGHT * 0.32, valueChar, 'middle', 'center', 'bold 30px Arial', color, Math.PI);
        drawSprite(card.visualX - CARD_WIDTH * 0.32, card.visualY + CARD_HEIGHT * 0.32, imgLear[card.lear], Math.PI);
    } else {
        drawSprite(card.visualX, card.visualY, imgTurnedCard, 0);
    }
}

function drawCardDecks() {
    let moovedCards = [];

    for (let closedDeckIndex = 0; closedDeckIndex < decks[DECKED_CLOSED].length; closedDeckIndex++) {
        let card = decks[DECKED_CLOSED][closedDeckIndex];
        if (!card.isMooved) {
            drawCard(card);
        } else {
            moovedCards.push(card);
        }
    }
    for (let columnIndex = 0; columnIndex < decks[COLOMNED].length; columnIndex++) {
        let column = decks[COLOMNED][columnIndex];
        for (let inColumnIndex = 0; inColumnIndex < column.length; inColumnIndex++) {
            let card = column[inColumnIndex];
            if (!card.isMooved) {
                drawCard(card);
            } else {
                moovedCards.push(card);
            }
        }
    }
    for (let aceIndex = 0; aceIndex < decks[ACED].length; aceIndex++) {
        let ace = decks[ACED][aceIndex];
        for (let inAceIndex = 0; inAceIndex < ace.length; inAceIndex++) {
            let card = ace[inAceIndex];
            if (!card.isMooved) {
                drawCard(card);
            } else {
                moovedCards.push(card);
            }
        }
    }
    for (let openedDeckIndex = 0; openedDeckIndex < decks[DECKED_OPENED].length; openedDeckIndex++) {
        let card = decks[DECKED_OPENED][openedDeckIndex];
        if (!card.isMooved) {
            drawCard(card);
        } else {
            moovedCards.push(card);
        }
    }

    for (let moovedCardsIndex = 0; moovedCardsIndex < moovedCards.length; moovedCardsIndex++) {
        drawCard(moovedCards[moovedCardsIndex]);
    }
}

function defineCardPos() {
    for (let index = decks[DECKED_CLOSED].length - 1; index >= 0; index--) {
        let card = decks[DECKED_CLOSED][index];
        card.x = -canvas.width * 0.5 + 100;
        card.y = -canvas.height * 0.5 + 100;
    }
    for (let index = decks[DECKED_OPENED].length - 1; index >= 0; index--) {
        let card = decks[DECKED_OPENED][index];
        let cardOffset = index - (decks[DECKED_OPENED].length - 3);
        if (cardOffset < 0) {
            cardOffset = 0;
        }
        card.x = -canvas.width * 0.5 + 300 + cardOffset * 35;
        card.y = -canvas.height * 0.5 + 100;
    }
    for (let columnIndex = 0; columnIndex < decks[COLOMNED].length; columnIndex++) {
        let column = decks[COLOMNED][columnIndex];
        for (let inColumnIndex = 0; inColumnIndex < column.length; inColumnIndex++) {
            let card = column[inColumnIndex];
            card.x = -canvas.width * 0.5 + 600 + 200 * columnIndex;
            card.y = -canvas.height * 0.5 + 300 + 40 * inColumnIndex;
        }
    }
    for (let aceIndex = 0; aceIndex < decks[ACED].length; aceIndex++) {
        let aceDeck = decks[ACED][aceIndex];
        for (let inAceIndex = 0; inAceIndex < aceDeck.length; inAceIndex++) {
            let card = aceDeck[inAceIndex];
            card.x = -canvas.width * 0.5 + 600 + 200 * aceIndex;
            card.y = -canvas.height * 0.5 + 100;
        }
    }
}

formStartDeck();

function loopGame() {
    if (decks[ACED][0].length === 9 && decks[ACED][1].length === 9 && decks[ACED][2].length === 9 && decks[ACED][3].length === 9) {
        gameState = GAME_STATE_WIN;
    }

    drawSprite(-canvas.width * 0.5 + 200, - canvas.height * 0.5 + 100, imgReloadDeck, 0);

    for (let columnIndex = 0; columnIndex < decks[COLOMNED].length; columnIndex++) {
        let columnX = -canvas.width * 0.5 + 600 + 200 * columnIndex;
        let columnY = -canvas.height * 0.5 + 300;
        drawSprite(columnX, columnY, imgCardDeck, 0);
    }

    for (let deckIndex = 0; deckIndex < decks[ACED].length; deckIndex++) {
        let deckX = -canvas.width * 0.5 + 600 + 200 * deckIndex;
        let deckY = -canvas.height * 0.5 + 100;
        drawSprite(deckX, deckY, imgCardDeck, 0);
    }

    if (mouse.wentDown && checkButton(mouse.x, mouse.y, -canvas.width * 0.5 + 200, - canvas.height * 0.5 + 100, 60, 60)) {
        while (decks[DECKED_OPENED].length) {
            let lastOpenedCard = decks[DECKED_OPENED][decks[DECKED_OPENED].length - 1];
            lastOpenedCard.closed = true;
            moveCardsBetweenDecks(1, decks[DECKED_OPENED], decks[DECKED_CLOSED]);
        }
    }

    if (mouse.isDown || mouse.wentUp) {

        let cardInfo = findClosestCard(mouse.startX, mouse.startY);

        if (cardInfo.type !== -1) {
            let card = cardInfo.card;

            if (mouse.wentDown && cardInfo.type === DECKED_CLOSED) {
                card.closed = false;
                moveCardsBetweenDecks(1, decks[DECKED_CLOSED], decks[DECKED_OPENED]);
            } else if (!card.closed) {
                card.x = mouse.x;
                card.y = mouse.y;
                card.isMooved = true;
                let moovedCardsCount = 1;
                if (cardInfo.subtype !== -1) {
                    let column = decks[cardInfo.type][cardInfo.subtype];
                    while (column[column.length - moovedCardsCount] !== card) {
                        moovedCardsCount++;
                    }
                    for (let count = 1; count <= moovedCardsCount; count++) {
                        let additionalCard = column[column.length - moovedCardsCount - 1 + count];
                        additionalCard.isMooved = true;
                        additionalCard.x = mouse.x;
                        additionalCard.y = mouse.y + 40 * count;
                    }
                }
                if (mouse.wentUp) {
                    card.isMooved = false
                    for (let columnIndex = 0; columnIndex < decks[COLOMNED].length; columnIndex++) {
                        let column = decks[COLOMNED][columnIndex];
                        let columnX = -canvas.width * 0.5 + 600 + 200 * columnIndex;
                        let columnY = -canvas.height * 0.5 + 300 + 20 * column.length;

                        if (checkButton(mouse.x, mouse.y, columnX, columnY, CARD_WIDTH, CARD_HEIGHT + 40 * column.length)) {
                            let lastCard = column[column.length - 1];
                            if (!column.length || (!lastCard.closed &&
                                lastCard.value - 1 === card.value && Math.trunc(card.lear / 2) !== Math.trunc(lastCard.lear / 2))) {
                                if (cardInfo.subtype === -1) {
                                    if (cardInfo.type === DECKED_OPENED) {
                                        for (let index = decks[DECKED_OPENED].length - 3; index < decks[DECKED_OPENED].length - 1; index++) {
                                            if (decks[DECKED_OPENED][index] === card) {
                                                decks[DECKED_OPENED][index] = decks[DECKED_OPENED][index + 1];
                                                decks[DECKED_OPENED][index + 1] = card;
                                            }
                                        }
                                    }
                                    moveCardsBetweenDecks(1, decks[cardInfo.type], decks[COLOMNED][columnIndex]);
                                } else {
                                    moveCardsBetweenDecks(moovedCardsCount, decks[cardInfo.type][cardInfo.subtype], column);
                                }
                            }
                        }
                    }
                    for (let aceIndex = 0; aceIndex < decks[ACED].length; aceIndex++) {
                        let aceDeck = decks[ACED][aceIndex];
                        let deckX = -canvas.width * 0.5 + 600 + 200 * aceIndex;
                        let deckY = -canvas.height * 0.5 + 100;
                        if (moovedCardsCount === 1 && checkButton(mouse.x, mouse.y, deckX, deckY, CARD_WIDTH, CARD_HEIGHT)) {
                            let lastCard = aceDeck[aceDeck.length - 1];
                            if ((!aceDeck.length && card.value === VALUE_ACE) ||
                                (aceDeck.length && lastCard.value + 1 === card.value && card.lear === lastCard.lear)) {
                                if (cardInfo.subtype === -1) {
                                    if (cardInfo.type === DECKED_OPENED) {
                                        for (let index = decks[DECKED_OPENED].length - 3; index < decks[DECKED_OPENED].length - 1; index++) {
                                            if (decks[DECKED_OPENED][index] === card) {
                                                decks[DECKED_OPENED][index] = decks[DECKED_OPENED][index + 1];
                                                decks[DECKED_OPENED][index + 1] = card;
                                            }
                                        }
                                    }
                                    moveCardsBetweenDecks(1, decks[cardInfo.type], decks[ACED][aceIndex]);
                                } else {
                                    moveCardsBetweenDecks(moovedCardsCount, decks[cardInfo.type][cardInfo.subtype], aceDeck);
                                }
                            }
                        }
                    }
                }
            } else if (mouse.wentDown) {
                let column = decks[cardInfo.type][cardInfo.subtype];
                if (column[column.length - 1] === card) {
                    card.closed = false;
                }
            }

        }
    }

    drawCardDecks();

    defineCardPos();
}

function loop() {
    ctx.translate(camera.x + canvas.width * 0.5, camera.y + canvas.height * 0.5);

    drawRect(0, 0, canvas.width, canvas.height, 0, 'blue');

    switch (gameState) {
        case GAME_STATE_GAME: {
            loopGame();
        }
    }

    clearMouse();

    ctx.translate(-camera.x - canvas.width * 0.5, -camera.y - canvas.height * 0.5);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);