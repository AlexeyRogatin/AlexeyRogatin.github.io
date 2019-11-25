import { clearAllKeys, upKey, leftKey, rightKey, downKey, mouse, Key } from "./controls";
import { drawRect, drawCircle, ctx, canvas, drawSprite, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera, imgEarth1, imgEarth2, imgEarth3, imgEarth4, imgEarth5, imgGeyser, imgMountain, imgIron } from "./input";

enum GameObjectType {
    NONE,
    PLAYER,
    EARTH,
    MOUNTAIN,
    GEYSER,
    VOLCANO,
    ABYSS,
    IRON,
}

let tile = {
    width: 200,
    height: 200,
    firstX: 0,
    firstY: 0,
    chunkSizeX: 8,
    chunkSizeY: 8,
    chunkCountX: 5,
    chunkCountY: 5,
}



let chunkPrototypes = [
    [
        '  @!  ##',
        ' @!@   #',
        '@!@!   #',
        '@!!@   #',
        '!@!   # ',
        '@!@  #  ',
        '!@! #   ',
        '@!@ #   ',
    ],
    [
        'F  @  ##',
        '       #',
        '   #   #',
        '        ',
        ' @     #',
        '   #    ',
        '       #',
        ' #    ##',
    ],
    [
        '    ####',
        '   #   #',
        '        ',
        '        ',
        '        ',
        '       #',
        '   ##   ',
        ' #######',
    ],
    [
        '    @   ',
        '@    #  ',
        '        ',
        '    #   ',
        '@     # ',
        '     000',
        ' #   0*0',
        '@    000',
    ]
]

let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    angle: 0,
}

let timers: number[] = [];

let gameObjects: GameObject[] = [];

class GameObject {
    type: GameObjectType = GameObjectType.NONE;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    color: string;

    exists: Boolean;

    speed: number;
    speedX: number;
    speedY: number;
    speedLimit: number;
    speedBackReduction: number;

    friction: number;

    accel: number;
    accelConst: number;

    rotationSpeed: number;

    solid: boolean;

    specialTimer: number;

    clickable: boolean;

    goForward: boolean;
    goRight: boolean;
    goLeft: boolean;
    goBackward: boolean;

    oreCount: number;
    toughness: number;
    firstToughtness: number;

    sprite: HTMLImageElement;

    leftWeel: number;
    rightWeel: number;
}

function addGameObject(type: GameObjectType, x: number, y: number) {
    let gameObject: GameObject = {
        type: type,

        x: x,
        y: y,

        width: 100,
        height: 100,
        angle: 0,
        color: 'grey',

        exists: true,

        speed: 0,
        speedX: 0,
        speedY: 0,
        speedLimit: 3,
        speedBackReduction: 0.5,
        friction: 0.95,
        accel: 0,
        accelConst: 0.04,
        rotationSpeed: 0.08,
        solid: false,

        specialTimer: 0,

        clickable: false,

        goForward: false,
        goBackward: false,
        goLeft: false,
        goRight: false,

        oreCount: 0,
        toughness: 0,
        firstToughtness: 0,

        sprite: imgNone,

        leftWeel: 1,
        rightWeel: 1,
    }

    if (gameObject.type === GameObjectType.PLAYER) {
        gameObject.sprite = imgPlayer;
    }

    if (gameObject.type === GameObjectType.NONE) {
        gameObject.exists = false;
    }

    if (gameObject.type === GameObjectType.EARTH) {
        gameObject.width = tile.width;
        gameObject.height = tile.height;
        gameObject.color = 'yellow';
        let chance = randomInt(1, 10);
        if (chance === 1 || chance === 2 || chance === 3 || chance === 4 || chance === 5 || chance === 6) {
            gameObject.sprite = imgEarth1;
        }
        if (chance === 7) {
            gameObject.sprite = imgEarth2;
        }
        if (chance === 8) {
            gameObject.sprite = imgEarth3;
        }
        if (chance === 9) {
            gameObject.sprite = imgEarth4;
        }
        if (chance === 10) {
            gameObject.sprite = imgEarth5;
        }
    }

    if (gameObject.type === GameObjectType.MOUNTAIN) {
        gameObject.width = tile.width;
        gameObject.height = tile.height;
        gameObject.color = 'orange';
        gameObject.solid = true;
        gameObject.sprite = imgMountain;
    }

    if (gameObject.type === GameObjectType.GEYSER) {
        gameObject.width = tile.width;
        gameObject.height = tile.height;
        gameObject.color = 'blue';

        gameObject.specialTimer = addTimer(randomInt(500, 2000));

        gameObject.sprite = imgGeyser;
    }

    if (gameObject.type === GameObjectType.VOLCANO) {
        gameObject.width = tile.width * 3;
        gameObject.height = tile.height * 3;
        gameObject.color = 'red';
        gameObject.solid = true;
    }

    if (gameObject.type === GameObjectType.ABYSS) {
        gameObject.width = tile.width;
        gameObject.height = tile.height;
        gameObject.color = 'black';

    }

    if (gameObject.type === GameObjectType.IRON) {
        gameObject.width = tile.width;
        gameObject.height = tile.height;
        gameObject.color = 'grey';
        gameObject.clickable = true;
        gameObject.toughness = 180;
        gameObject.firstToughtness = gameObject.toughness;
        gameObject.oreCount = 5;
        gameObject.sprite = imgIron;
    }

    let freeIndex = gameObjects.length;
    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        const gameObject = gameObjects[gameObjectIndex];

        if (!gameObject.exists) {
            freeIndex = gameObjectIndex;
            break;
        }
    }
    gameObjects[freeIndex] = gameObject;

    return gameObject;
}

function controlPlayer(gameObject: GameObject) {
    if (upKey.isDown) {
        gameObject.goForward = true;
    }

    if (downKey.isDown) {
        gameObject.goBackward = true;
    }

    if (rightKey.isDown) {
        gameObject.goRight = true;
    }

    if (leftKey.isDown) {
        gameObject.goLeft = true;
    }
}

function resetControls() {
    globalPlayer.goForward = false;
    globalPlayer.goBackward = false;
    globalPlayer.goLeft = false;
    globalPlayer.goRight = false;
}

function moveGameObject(gameObject: GameObject) {
    gameObject.accel = 0;
    if (gameObject.goForward) {
        gameObject.accel = gameObject.accelConst;
    } else if (gameObject.goBackward) {
        gameObject.accel = -gameObject.accelConst;
    } else {
        gameObject.speed *= gameObject.friction;
    }

    if (gameObject.goLeft) {
        gameObject.angle -= gameObject.rotationSpeed;
    }
    if (gameObject.goRight) {
        gameObject.angle += gameObject.rotationSpeed;
    }
    gameObject.speed += gameObject.accel;
    if (gameObject.speed > gameObject.speedLimit) {
        gameObject.speed = gameObject.speedLimit;
    }
    if (gameObject.speed < -0.75 * gameObject.speedLimit) {
        gameObject.speed = -0.75 * gameObject.speedLimit;
    }
    gameObject.speedX = gameObject.speed * Math.cos(gameObject.angle);
    gameObject.speedY = gameObject.speed * Math.sin(gameObject.angle);

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        const other = gameObjects[gameObjectIndex];

        const wallLeft = other.x - other.width / 2;
        const wallRight = other.x + other.width / 2;
        const wallTop = other.y - other.height / 2;
        const wallBottom = other.y + other.height / 2;

        const playerLeft = gameObject.x - gameObject.width / 2;
        const playerRight = gameObject.x + gameObject.width / 2;
        const playerTop = gameObject.y - gameObject.height / 2;
        const playerBottom = gameObject.y + gameObject.height / 2;

        if (other.solid) {

            if (gameObject.speedX !== 0) {
                let side: number;
                let wallSide: number;
                if (gameObject.speedX > 0) {
                    side = playerRight;
                    wallSide = wallLeft;
                } else {
                    side = playerLeft;
                    wallSide = wallRight;
                }

                if (
                    !(playerRight + gameObject.speedX <= wallLeft ||
                        playerLeft + gameObject.speedX >= wallRight ||
                        playerTop >= wallBottom ||
                        playerBottom <= wallTop)
                ) {
                    if (other.solid) {
                        gameObject.speedX = 0;
                        gameObject.x -= side - wallSide;
                    }
                }
            }

            if (gameObject.speedY !== 0) {
                let side: number;
                let wallSide: number;
                if (gameObject.speedY > 0) {
                    side = playerBottom;
                    wallSide = wallTop;
                } else {
                    side = playerTop;
                    wallSide = wallBottom;
                }

                if (
                    !(playerRight <= wallLeft ||
                        playerLeft >= wallRight ||
                        playerTop + gameObject.speedY >= wallBottom ||
                        playerBottom + gameObject.speedY <= wallTop)
                ) {
                    gameObject.speedY = 0;
                    gameObject.y -= side - wallSide;
                }
            }
        }
    }


    gameObject.x += gameObject.speedX;
    gameObject.y += gameObject.speedY;
}

function randomFloat(firstNumber: number, lastNumber: number) {
    let randomFloat: number = firstNumber + (lastNumber - firstNumber) * Math.random();
    return (randomFloat)
}

function randomInt(firstNumber: number, lastNumber: number) {
    let randomInt = Math.round(randomFloat(firstNumber, lastNumber));
    return (randomInt);
}

function addTimer(timerLength: number) {
    let timerIndex = timers.length;
    timers.push(timerLength);
    return timerIndex;
}

function updateTimers() {
    for (let timerIndex = 0; timerIndex < timers.length; timerIndex++) {
        if (timers[timerIndex] > 0) {
            timers[timerIndex]--;
        }
    }
}

function rotateVector(x: number, y: number, angle: number) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let resultX = x * cos - y * sin;
    let resultY = -y * cos - x * sin;
    return [
        resultX,
        resultY,
    ];
}

function angleBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    let dX = x1 - x2;
    let dY = y1 - y2;
    let cos = dX / Math.sqrt(dX * dX + dY * dY);
    let angle = Math.acos(cos);
    if (y2 > y1) {
        angle += 2 * Math.PI - angle * 2;
    }
    return angle;
}

let particles: particle[] = []

class particle {
    x: number;
    y: number;
    color: string;
    radius: number;
    speedX: number;
    speedY: number;
    accelX: number;
    accelY: number;
    sizeDecrease: number;
}

function addParticle(x: number, y: number, color: string, speed: number, size: number, decrease: number, accel: number) {
    let randomAngle = randomFloat(0, Math.PI * 2);
    let randomSpeed = randomFloat(Math.abs(speed - 0.5), speed + 0.5);
    let [speedX, speedY] = rotateVector(randomSpeed, 0, randomAngle);
    let randomRadius = randomInt(size - 3, size + 3);
    let [accelX, accelY] = rotateVector(accel, 0, randomAngle);
    let randomSizeDecrease = randomFloat(Math.abs(decrease - 0.15), decrease + 0.15);

    let particle = {
        x: x,
        y: y,
        color: color,
        radius: randomRadius,
        speedX,
        speedY,
        accelX,
        accelY,
        sizeDecrease: randomSizeDecrease,
    };

    particles.push(particle);
}

type ParticleParams = {
    x: number;
    y: number;
    color: string;
    speed: number;
    size: number;
    decrease: number;
    accel: number;
    count: number;
}

function burstParticles({ x, y, color, speed, size, count, decrease, accel }: ParticleParams) {
    for (let particleIndex = 0; particleIndex < count; particleIndex++) {
        addParticle(x, y, color, speed, size, decrease, accel);
    }
}

function drawParticles() {
    for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
        let particle = particles[particleIndex];
        drawCircle(particle.x, particle.y, particle.radius, particle.color);
        particle.radius -= particle.sizeDecrease;
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.speedX += particle.accelX;
        particle.speedY += particle.accelY;


        if (particle.radius <= 0) {
            removeParticle(particleIndex);
        }
    }
}

function removeParticle(particleIndex: number) {
    let lastParticle = particles[particles.length - 1];
    particles[particleIndex] = lastParticle;
    particles.pop();
}

for (let chunkY = 0; chunkY < tile.chunkCountY; chunkY++) {
    for (let chunkX = 0; chunkX < tile.chunkCountX; chunkX++) {
        let protoIndex = randomInt(0, chunkPrototypes.length - 1);
        let proto = chunkPrototypes[protoIndex];
        console.assert(tile.chunkSizeY === proto.length);
        console.assert(tile.chunkSizeX === proto[0].length);

        for (let tileY = 0; tileY < proto.length; tileY++) {
            let line = proto[tileY];
            for (let tileX = 0; tileX < line.length; tileX++) {
                let char = line[tileX];
                let charType = null;
                if (char === '0') {
                    charType = GameObjectType.NONE;
                } else if (char === ' ') {
                    charType = GameObjectType.EARTH;
                } else if (char === '#') {
                    charType = GameObjectType.MOUNTAIN;
                } else if (char === '@') {
                    charType = GameObjectType.GEYSER;
                } else if (char === '*') {
                    charType = GameObjectType.VOLCANO;
                } else if (char === '!') {
                    charType = GameObjectType.ABYSS;
                } else if (char === 'F') {
                    charType = GameObjectType.IRON;
                }
                addGameObject(charType, (chunkX * tile.chunkSizeX + tileX) * tile.width, (chunkY * tile.chunkSizeX + tileY) * tile.height);
            }
        }
    }
}

export function screenToWorld(x: number, y: number) {
    const result = [
        x + camera.x - camera.width * 0.5,
        y + camera.y - camera.height * 0.5,
    ];
    return result;
}

export function worldToScreen(x: number, y: number) {
    const result = [
        x - camera.x + camera.width * 0.5,
        y - camera.y + camera.height * 0.5,
    ];
    return result;
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return distance;
}

let globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);

function updateGameObject(gameObject: GameObject) {
    if (gameObject.sprite !== imgNone) {
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height);
    } else {
        drawRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height, -gameObject.angle, gameObject.color);
    }

    if (gameObject.clickable) {
        if (
            mouse.worldX > gameObject.x - gameObject.width / 2 &&
            mouse.worldX < gameObject.x + gameObject.width / 2 &&
            mouse.worldY > gameObject.y - gameObject.height / 2 &&
            mouse.worldY < gameObject.y + gameObject.height / 2
        ) {
            if (mouse.isDown) {
                let angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                if (globalPlayer.angle + globalPlayer.rotationSpeed > angle && globalPlayer.angle < angle) {
                    globalPlayer.angle = angle;
                } else if (globalPlayer.angle - globalPlayer.rotationSpeed < angle && globalPlayer.angle > angle) {
                    globalPlayer.angle = angle;
                } else if (globalPlayer.angle < angle) {
                    globalPlayer.angle += globalPlayer.rotationSpeed;
                } else if (globalPlayer.angle > angle) {
                    globalPlayer.angle -= globalPlayer.rotationSpeed;
                }
                if (globalPlayer.width / 2 + gameObject.width / 2 < distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y)) {
                    globalPlayer.goForward = true;
                } else {
                    gameObject.toughness--;
                    if (gameObject.toughness <= 0) {
                        gameObject.oreCount--;
                        gameObject.toughness = gameObject.firstToughtness;
                    }
                    if (gameObject.oreCount <= 0) {
                        gameObject.exists = false;
                        let chance = randomFloat(0, 1);
                        let type = 0;
                        if (chance >= 0.6) {
                            type = GameObjectType.EARTH;
                        }
                        if (chance <= 0.6 && chance >= 0.35) {
                            type = GameObjectType.GEYSER;
                        }
                        if (chance <= 0.35 && chance >= 0.1) {
                            type = GameObjectType.IRON;
                        }
                        if (chance <= 0.1) {
                            type = GameObjectType.ABYSS;
                        }
                        addGameObject(type, gameObject.x, gameObject.y);
                    }

                    console.log(gameObject.toughness, gameObject.oreCount)
                }
            }
        }

    }

    if (gameObject.type === GameObjectType.PLAYER) {
        camera.x = gameObject.x;
        camera.y = gameObject.y;
        for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            let particle = particles[particleIndex];
            if (gameObject.width / 2 + particle.radius >= distanceBetweenPoints(gameObject.x, gameObject.y, particle.x, particle.y)) {
                gameObject.exists = false;
            }
        }

        let angle = angleBetweenPoints(mouse.worldX, mouse.worldY, gameObject.x, gameObject.y);

        drawSprite(gameObject.x, gameObject.y, imgCamera, angle, 30, 30);

        let [wheel1X, wheel1Y] = rotateVector(46, 40, -gameObject.angle);
        let [wheel2X, wheel2Y] = rotateVector(9, 45, -gameObject.angle);
        let [wheel3X, wheel3Y] = rotateVector(-48, 45, -gameObject.angle);
        let [wheel4X, wheel4Y] = rotateVector(46, -40, -gameObject.angle);
        let [wheel5X, wheel5Y] = rotateVector(9, -45, -gameObject.angle);
        let [wheel6X, wheel6Y] = rotateVector(-48, -45, -gameObject.angle);

        if (upKey.isDown) {
            gameObject.leftWeel++;
            gameObject.rightWeel++;
        }
        if (downKey.isDown) {
            gameObject.leftWeel--;
            gameObject.rightWeel--;
        }
        if (leftKey.isDown) {
            gameObject.rightWeel++;
        }
        if (rightKey.isDown) {
            gameObject.leftWeel++;
        }



        if (gameObject.leftWeel > 6) {
            gameObject.leftWeel = 1;
        }
        if (gameObject.rightWeel > 6) {
            gameObject.rightWeel = 1;
        }
        if (gameObject.leftWeel < 1) {
            gameObject.leftWeel = 6;
        }
        if (gameObject.rightWeel < 1) {
            gameObject.rightWeel = 6;
        }

        if (gameObject.leftWeel === 1) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel1, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel1, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel1, gameObject.angle);
        }
        if (gameObject.leftWeel === 2) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel2, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel2, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel2, gameObject.angle);
        }
        if (gameObject.leftWeel === 3) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel3, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel3, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel3, gameObject.angle);
        }
        if (gameObject.leftWeel === 4) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel4, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel4, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel4, gameObject.angle);
        }
        if (gameObject.leftWeel === 5) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel5, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel5, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel5, gameObject.angle);
        }
        if (gameObject.leftWeel === 6) {
            drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel6, gameObject.angle);
            drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel6, gameObject.angle);
            drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel6, gameObject.angle);
        }

        if (gameObject.rightWeel === 1) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel1, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel1, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel1, gameObject.angle);
        }
        if (gameObject.rightWeel === 2) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel2, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel2, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel2, gameObject.angle);
        }
        if (gameObject.rightWeel === 3) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel3, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel3, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel3, gameObject.angle);
        }
        if (gameObject.rightWeel === 4) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel4, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel4, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel4, gameObject.angle);
        }
        if (gameObject.rightWeel === 5) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel5, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel5, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel5, gameObject.angle);
        }
        if (gameObject.rightWeel === 6) {
            drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel6, gameObject.angle);
            drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel6, gameObject.angle);
            drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel6, gameObject.angle);
        }

        controlPlayer(gameObject);
        moveGameObject(gameObject);
    }

    if (gameObject.type === GameObjectType.GEYSER) {
        if (
            gameObject.x > globalPlayer.x - camera.width / 2
            && gameObject.x < globalPlayer.x + camera.width / 2
            && gameObject.y > globalPlayer.y - camera.height / 2
            && gameObject.y < globalPlayer.y + camera.height / 2
        ) {
            if (timers[gameObject.specialTimer] <= 150) {
                burstParticles({
                    x: gameObject.x,
                    y: gameObject.y,
                    color: 'red',
                    speed: 5,
                    size: 40,
                    decrease: 0.8,
                    accel: -0.05,
                    count: 1,
                });
                if (timers[gameObject.specialTimer] <= 0) {
                    timers[gameObject.specialTimer] = randomInt(500, 2000);
                }
            }
        }
    }

    if (gameObject.type === GameObjectType.ABYSS) {
        const wallLeft = gameObject.x - gameObject.width / 2;
        const wallRight = gameObject.x + gameObject.width / 2;
        const wallTop = gameObject.y - gameObject.height / 2;
        const wallBottom = gameObject.y + gameObject.height / 2;
        if (
            globalPlayer.x - globalPlayer.width / 4 < wallRight &&
            globalPlayer.x - globalPlayer.width / 4 > wallLeft &&
            globalPlayer.y - globalPlayer.height / 4 > wallTop &&
            globalPlayer.y - globalPlayer.height / 4 < wallBottom &&
            globalPlayer.x + globalPlayer.width / 4 < wallRight &&
            globalPlayer.x + globalPlayer.width / 4 > wallLeft &&
            globalPlayer.y - globalPlayer.height / 4 > wallTop &&
            globalPlayer.y - globalPlayer.height / 4 < wallBottom &&
            globalPlayer.x - globalPlayer.width / 4 < wallRight &&
            globalPlayer.x - globalPlayer.width / 4 > wallLeft &&
            globalPlayer.y + globalPlayer.height / 4 > wallTop &&
            globalPlayer.y + globalPlayer.height / 4 < wallBottom &&
            globalPlayer.x + globalPlayer.width / 4 < wallRight &&
            globalPlayer.x + globalPlayer.width / 4 > wallLeft &&
            globalPlayer.y + globalPlayer.height / 4 > wallTop &&
            globalPlayer.y + globalPlayer.height / 4 < wallBottom
        ) {
            globalPlayer.exists = false;
        }
    }

}


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.rotate(-camera.angle);
    ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);

    [mouse.worldX, mouse.worldY] = screenToWorld(mouse.x, mouse.y);

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let gameObject = gameObjects[gameObjectIndex];
        if (gameObject.exists) {
            updateGameObject(gameObject);
        }
    }

    drawParticles();

    ctx.restore();

    resetControls();
    updateTimers();
    clearAllKeys();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);