'use strict';


var canvas = document.getElementById("canvas");
let rect = canvas.getBoundingClientRect();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    angle: 0,
};

let particles = [];

let loose = null;
let win = null;

function addParticle(x, y, color, minRadius, maxRadius) {
    let randomAngle = getRandomFloat(0, Math.PI * 2);

    let randomSpeed = getRandomFloat(1, 4);
    let speedVector = rotateVector(randomSpeed, 0, randomAngle);
    let randomRadius = getRandomFloat(minRadius, maxRadius);
    let randomSizeDecrease = getRandomFloat(0.09, 0.3);

    let p = {
        x: x,
        y: y,
        r: randomRadius,
        speedX: speedVector.x,
        speedY: speedVector.y,
        sizeDecrease: randomSizeDecrease,
        color: color,
    };
    particles.push(p);
}

function burstParticles(x, y, color, count, minRadius = 2, maxRadius = 8) {
    for (let pIndex = 0; pIndex < count; pIndex++) {
        addParticle(x, y, color, minRadius, maxRadius);
    }
}

function drawParticles() {
    for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
        let p = particles[particleIndex];
        drawRect(p.x, p.y, p.r * 2, p.r * 2, 0, p.color);
        p.x += p.speedX;
        p.y += p.speedY;
        p.r -= p.sizeDecrease;

        if (p.r <= 0) {
            removeParticle(particleIndex);
        }
    }
}

function removeParticle(particleIndex) {
    let lastParticle = particles[particles.length - 1];
    particles[particleIndex] = lastParticle;
    particles.pop();
}


let resourcesWaitingForLoadCount = 0;
let resourcesLoadedCount = 0;

function resourceLoaded(src) {
    resourcesLoadedCount++;

    console.log('loaded', src);
    if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
        beginGame();
    }
}

function loadImage(src) {
    let img = new Image();
    img.src = src;
    resourcesWaitingForLoadCount++;
    img.onload = () => resourceLoaded(src);

    return img;
}

function loadSound(src) {
    let sound = new Audio();
    sound.src = src;
    resourcesWaitingForLoadCount++;
    sound.shouldBeLoaded = true;
    sound.oncanplay = () => resourceLoaded(src);
    return sound;
}




let sndSong = loadSound('./sounds/Vadim/Moya_pesnya_6.wav');
let sndEngine = loadSound('./sounds/engine.mp3');
let sndShot = loadSound('./sounds/shot.mp3');
let sndExplosion = loadSound('./sounds/boom4.mp3');
let sndLaser = loadSound('./sounds/Vystrel_lazera.wav');
let sndGun = loadSound('./sounds/gun_shot.mp3');
let sndMoon = loadSound('./sounds/moon.mp3');
let sndRocket = loadSound('./sounds/rocket_voice.wav');

let imgBouncingPowerUp = loadImage('./sprites/powerUp2.png');
let imgBeanPowerUp = loadImage('./sprites/powerUp1.png');
let imgPowerUp = loadImage('./sprites/powerUp.png');
let imgEnemy = loadImage('./sprites/enemy.png');
let imgEnemyBullet = loadImage('./sprites/enemy_bullet.png');
let imgPlayerBullet = loadImage('./sprites/player_bullet.png');
let imgStars = loadImage('./sprites/stars.png');
let imgHeal = loadImage('./sprites/heal.png');
let imgGiantShoot = loadImage('./sprites/bean.png');
let imgEnemyTank = loadImage('./sprites/Vadim/tank.png');
let imgVolna = loadImage('./sprites/Vadim/volna.png');
let imgBounce = loadImage('./sprites/bounce.png');
let imgShooter = loadImage('./sprites/Vadim/player4.png');
let imgBoss = loadImage('./sprites/Vadim/deathstar.png');

let imgEnemyVadim1 = loadImage('./sprites/Vadim/player3.png');
let imgEnemyVadim = loadImage('./sprites/Vadim/player.png');
let imgPlayerVadim = loadImage('./sprites/Vadim/player2.png');
let imgRocketVadim = loadImage('./sprites/Vadim/rocket.png');



var ctx = canvas.getContext("2d");

const GAME_OBJECT_NONE = 0;
const GAME_OBJECT_PLAYER = 1;
const GAME_OBJECT_ENEMY = 2;
const GAME_OBJECT_BULLET = 3;
const GAME_OBJECT_ROCKETPOWERUP = 4;
const GAME_OBJECT_ENEMY_ROCKETEER = 5;
const GAME_OBJECT_HEAL = 6;
const GAME_OBJECT_BEANPOWERUP = 7;
const GAME_OBJECT_ENEMY_TANK = 8;
const GAME_OBJECT_BOUNCINGPOWERUP = 9;
const GAME_OBJECT_TRIPLESHOOTER = 10;
const GAME_OBJECT_BOSS = 11;

const AI_STATE_IDLE = 0;
const AI_STATE_ROTATE_LEFT = 1;
const AI_STATE_ROTATE_RIGHT = 2;
const AI_STATE_MOVE_FORWARD = 3;
const AI_STATE_SHOOT = 4;

let gameObjects = [];

let timers = [];
function addTimer() {
    let timerIndex = timers.length;
    timers.push(0);
    return (timerIndex);
}

function updateTimers() {
    for (let timerIndex = 0; timerIndex < timers.length; timerIndex++) {
        timers[timerIndex] -= 1;
    }
}

function addGameObject(type) {
    let gameObject = {
        type: type,
        width: 10,
        height: 10,
        x: 0,
        y: 0,
        speedX: 0,
        speedY: 0,
        angle: 0,
        rotationSpeed: 0.05,
        accelConst: 0.12,
        frictionConst: 0.98,
        color: 'black',
        collisionRadius: 10,
        exists: true,
        shootTimer: addTimer(),
        hitpoints: 0,
        maxHitpoints: 0,
        unhitableTimer: addTimer(),

        //bullet
        lifetime: addTimer(),
        killObjectTypes: [
            GAME_OBJECT_NONE,
        ],
        shootParticles: false,
        damage: 0,
        pierce: false,
        bounce: false,

        //enemy
        aiState: AI_STATE_IDLE,
        aiTimer: addTimer(),

        //player
        rocketModeTimer: addTimer(),
        beanModeTimer: addTimer(),
        bouncingModeTimer: addTimer(),

        sprite: null,

        bossRotateChance: 0,

    };

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

function addPlayer() {
    let player = addGameObject(GAME_OBJECT_PLAYER);
    player.width = 20;
    player.x = 0;;
    player.y = 0;
    player.color = 'yellow';
    player.sprite = imgPlayerVadim;
    player.collisionRadius = 20;
    player.hitpoints = 3;
    player.maxHitpoints = 3;
    return player;
}

function addPowerUp(type, sprite, x, y, lifetime = 600) {
    let powerUp = addGameObject(type);
    powerUp.sprite = sprite;
    powerUp.color = 'green';
    powerUp.collisionRadius = 25;
    powerUp.hitpoints = 100000000000;
    powerUp.maxHitpoints = 100000000000;
    powerUp.x = x;
    powerUp.y = y;

    timers[powerUp.lifetime] = lifetime;
    return powerUp;
}

function addRocketPowerUp(x, y) {
    addPowerUp(GAME_OBJECT_ROCKETPOWERUP, imgPowerUp, x, y);
}

function addBeanPowerUp(x, y) {
    addPowerUp(GAME_OBJECT_BEANPOWERUP, imgBeanPowerUp, x, y);
}

function addHeal(x, y) {
    addPowerUp(GAME_OBJECT_HEAL, imgHeal, x, y);
}

function addBouncingPowerUp(x, y) {
    addPowerUp(GAME_OBJECT_BOUNCINGPOWERUP, imgBouncingPowerUp, x, y);
}

const globalPlayer = addPlayer();

function addEnemy() {
    let chance = getRandomInt(1, 4);
    let enemy = addGameObject(GAME_OBJECT_ENEMY);
    enemy.width = 20;
    enemy.height = 40;
    switch (chance) {
        case 1:
            {
                enemy.x = camera.x - camera.width / 2;
                enemy.y = camera.y - camera.height / 2;
            } break;
        case 2:
            {
                enemy.x = camera.x + camera.width / 2;
                enemy.y = camera.y - camera.height / 2;
            } break;
        case 3:
            {
                enemy.x = camera.x - camera.width / 2;
                enemy.y = camera.y + camera.height / 2;
            } break;
        case 4:
            {
                enemy.x = camera.x + camera.width / 2;
                enemy.y = camera.y + camera.height / 2;
            } break;
    }

    enemy.color = 'green';
    enemy.collisionRadius = 15;
    enemy.sprite = imgEnemyVadim;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 1;
    return enemy;
}

function addEnemyRocketeer() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY_ROCKETEER);
    enemy.x = camera.x - camera.width / 2;
    enemy.y = camera.y - camera.height / 2;
    enemy.collisionRadius = 15;
    enemy.sprite = imgEnemyVadim1;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 2;
    return enemy;
}

function addEnemyTank() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY_TANK);
    enemy.x = camera.x - camera.width / 2;
    enemy.y = camera.y - camera.height / 2;
    enemy.collisionRadius = 40;
    enemy.sprite = imgEnemyTank;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 10;
    return enemy;
}

function addTripleShooter() {
    let enemy = addGameObject(GAME_OBJECT_TRIPLESHOOTER);
    enemy.x = camera.x - camera.width / 2;
    enemy.y = camera.y - camera.height / 2;
    enemy.collisionRadius = 15;
    enemy.sprite = imgShooter;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 2;
    return enemy;
}

let globalBoss = null;

function addBoss() {
    let enemy = addGameObject(GAME_OBJECT_BOSS);
    enemy.x = camera.x - camera.width / 2;
    enemy.y = camera.y - camera.height / 2;
    enemy.collisionRadius = 140;
    enemy.sprite = imgBoss;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 100;

    return enemy;
}

function getRandomFloat(start, end) {
    let randomFloat = Math.random();
    let intervalLength = end - start;
    let intervalFloat = randomFloat * intervalLength;
    let result = intervalFloat + start;
    return result;
}


function getRandomInt(start, end) {

    let result = Math.round(getRandomFloat(start, end));
    return result;
}

function drawSprite(x, y, sprite, angle) {
    ctx.save();
    ctx.translate(x, y);

    ctx.rotate(-angle);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
}
function drawRect(x, y, width, height, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;

    ctx.rotate(-angle);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
}

function drawText(x, y, text, textBaseline, textAlign, font, fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
    ctx.fillText(text, x, y);
    ctx.restore();
}

function addBullet(x, y, angle, speedX, speedY, speedConst, killObjectTypes, lifetime = 120, collisionRadius) {
    let bullet = addGameObject(GAME_OBJECT_BULLET);
    bullet.hitpoints = 1;
    bullet.x = x;
    bullet.y = y;

    angle += getRandomFloat(-0.08, 0.08);

    let speedVector = rotateVector(speedConst, 0, angle);
    bullet.speedX = speedX + speedVector.x;
    bullet.speedY = speedY + speedVector.y;
    bullet.angle = angle;
    bullet.collisionRadius = collisionRadius;

    timers[bullet.lifetime] = lifetime;
    bullet.killObjectTypes = killObjectTypes;
    bullet.frictionConst = 1;
    return (bullet);
}

function controlShip(gameObject, rotateRight, rotateLeft, moveForward) {
    let accelX = 0;
    let accelY = 0;

    if (rotateRight) {
        gameObject.angle -= gameObject.rotationSpeed;
    }
    if (rotateLeft) {
        gameObject.angle += gameObject.rotationSpeed;
    }
    if (moveForward) {
        const accelVector = rotateVector(gameObject.accelConst, 0, gameObject.angle);
        accelX = accelVector.x;
        accelY = accelVector.y;
    }

    gameObject.speedX += accelX;
    gameObject.speedY += accelY;
}

function removeGameObject(gameObject) {
    gameObject.exists = false;
}

function drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}
function rotateVector(x, y, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let resultX = x * cos - y * sin;
    let resultY = y * cos - x * sin;
    return {
        x: resultX,
        y: resultY,
    };
}

function playSound(sound, volume = 1, loop = false) {
    let newSound = new Audio(sound.src);
    newSound.volume = volume;
    newSound.loop = loop;
    newSound.oncanplay = () => {
        newSound.play();
    };
}

function checkCollision(gameObject, otherTypes) {
    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let other = gameObjects[gameObjectIndex];
        if (other.exists) {
            let typeFound = false;
            for (let typeIndex = 0; typeIndex < otherTypes.length; typeIndex++) {
                if (otherTypes[typeIndex] === other.type) {
                    typeFound = true;
                    break;
                }
            }
            if (typeFound) {
                const radiusSum = gameObject.collisionRadius + other.collisionRadius;
                const a = other.x - gameObject.x;
                const b = other.y - gameObject.y;
                const dist = Math.sqrt(a * a + b * b);

                if (dist < radiusSum) {
                    return other;
                }
            }
        }
    }

    return null;
}

function bossProcessAI(gameObject) {
    let moveForward = false;
    let shoot = false;
    let rotateLeft = false;
    let rotateRight = false;

    let stateChanged = false;
    if (timers[gameObject.aiTimer] <= 0) {
        gameObject.aiState = getRandomInt(AI_STATE_MOVE_FORWARD, AI_STATE_SHOOT);
        gameObject.bossRotateChance = getRandomFloat(0, 1);
        stateChanged = true;
    }

    switch (gameObject.aiState) {
        case AI_STATE_MOVE_FORWARD: {
            if (stateChanged) {
                timers[gameObject.aiTimer] = 100;
            }

            moveForward = true;
        } break;

        case AI_STATE_SHOOT: {
            if (stateChanged) {
                timers[gameObject.aiTimer] = 200;
                timers[gameObject.shootTimer] = 60;
            }

            shoot = true;
            if (gameObject.bossRotateChance > 0.5) {
                rotateRight = true;
            } else {
                rotateLeft = true;
            }
        } break;
    }

    return {
        moveForward,
        rotateLeft,
        rotateRight,
        shoot,
    };
}

function processAI(gameObject) {
    let moveForward = false;
    let rotateLeft = false;
    let rotateRight = false;
    let shoot = false;

    if (timers[gameObject.aiTimer] <= 0) {
        gameObject.aiState = getRandomInt(AI_STATE_ROTATE_LEFT, AI_STATE_SHOOT);
        timers[gameObject.aiTimer] = 60;
    }

    switch (gameObject.aiState) {
        case AI_STATE_IDLE: {
        } break;


        case AI_STATE_ROTATE_LEFT: {
            rotateLeft = true;
            moveForward = true;
        } break;


        case AI_STATE_ROTATE_RIGHT: {
            rotateRight = true;
            moveForward = true;
        } break;


        case AI_STATE_MOVE_FORWARD: {
            moveForward = true;
        } break;


        case AI_STATE_SHOOT: {
            shoot = true;
            moveForward = true;
        } break;
    }

    return {
        moveForward,
        rotateLeft,
        rotateRight,
        shoot,
    };
}

const ROCKET_MODE_TIME = 600;
const BEAN_MODE_TIME = 600;
const BOUNCING_MODE_TIME = 600;

let globalScore = 0;

function updateGameObject(gameObject) {
    if (gameObject.type === GAME_OBJECT_PLAYER) {
        camera.x = gameObject.x;
        camera.y = gameObject.y;
        let hitHeal = checkCollision(gameObject, [GAME_OBJECT_HEAL]);
        if (hitHeal !== null) {
            removeGameObject(hitHeal);
            if (gameObject.hitpoints !== 3) {
                gameObject.hitpoints++;
            }
        }

        let hitRocketPowerup = checkCollision(gameObject, [GAME_OBJECT_ROCKETPOWERUP]);
        if (hitRocketPowerup !== null) {
            timers[gameObject.rocketModeTimer] = ROCKET_MODE_TIME;
            removeGameObject(hitRocketPowerup);
        }

        let hitBeanPowerUp = checkCollision(gameObject, [GAME_OBJECT_BEANPOWERUP]);
        if (hitBeanPowerUp !== null) {
            timers[gameObject.beanModeTimer] = BEAN_MODE_TIME;
            removeGameObject(hitBeanPowerUp);
        }

        let hitBouncingPowerUp = checkCollision(gameObject, [GAME_OBJECT_BOUNCINGPOWERUP]);
        if (hitBouncingPowerUp !== null) {
            timers[gameObject.bouncingModeTimer] = BOUNCING_MODE_TIME;
            removeGameObject(hitBouncingPowerUp);
        }

        let canShoot = timers[gameObject.shootTimer] <= 0;

        let killObjectTypes = [
            GAME_OBJECT_ENEMY,
            GAME_OBJECT_ENEMY_ROCKETEER,
            GAME_OBJECT_ENEMY_TANK,
            GAME_OBJECT_TRIPLESHOOTER,
            GAME_OBJECT_BOSS,
        ];

        if (spaceKey.isDown && canShoot) {
            let bullet = null;
            let rocketModeOn = timers[gameObject.rocketModeTimer] > 0;
            let beanModeOn = timers[gameObject.beanModeTimer] > 0;
            let bouncingModeOn = timers[gameObject.bouncingModeTimer] > 0;

            if (rocketModeOn & timers[gameObject.rocketModeTimer] > timers[gameObject.beanModeTimer] & timers[gameObject.rocketModeTimer] > timers[gameObject.bouncingModeTimer]) {
                bullet = addBullet(
                    gameObject.x, gameObject.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 9, killObjectTypes, 120, 70,
                );
                bullet.bounce = false;
                bullet.sprite = imgRocketVadim;
                bullet.shootParticles = true;
                bullet.damage = 2;

                timers[gameObject.shootTimer] = 15;
                playSound(sndRocket, 0.07);
            } else if (beanModeOn & timers[gameObject.beanModeTimer] > timers[gameObject.rocketModeTimer] & timers[gameObject.beanModeTimer] > timers[gameObject.bouncingModeTimer]) {
                bullet = addBullet(
                    gameObject.x, gameObject.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 3,
                    killObjectTypes,
                    800, 82,
                );
                bullet.bounce = false;
                bullet.sprite = imgGiantShoot;
                bullet.shootParticles = false;
                bullet.damage = 0.2;
                bullet.pierce = true;

                timers[gameObject.shootTimer] = 80;
                playSound(sndMoon, 0.2);
            } else if (bouncingModeOn & timers[gameObject.bouncingModeTimer] > timers[gameObject.beanModeTimer] & timers[gameObject.bouncingModeTimer] > timers[gameObject.rocketModeTimer]) {
                bullet = addBullet(
                    gameObject.x, gameObject.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 10, killObjectTypes, 200, 15,
                );
                bullet.bounce = true;
                bullet.sprite = imgBounce;
                bullet.shootParticles = false;
                bullet.damage = 1;
                bullet.pierce = false;

                timers[gameObject.shootTimer] = 12;
                playSound(sndGun, 0.07);
            } else {
                bullet = addBullet(
                    gameObject.x, gameObject.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 10, killObjectTypes, 100, 15,
                );
                bullet.sprite = imgPlayerBullet;
                bullet.damage = 1;

                timers[gameObject.shootTimer] = 10;
                playSound(sndGun, 0.07);
            };
        }

        controlShip(gameObject, rightKey.isDown, leftKey.isDown, upKey.isDown);

        //draw hitpoints
        const hitpointsLeftPercentage = gameObject.hitpoints / gameObject.maxHitpoints;
        const width = 100;
        const height = 30;
        const leftWidth = width * hitpointsLeftPercentage;

        ctx.save();
        ctx.rotate(-camera.angle);

        const PADDING = 10;
        drawRect(PADDING + width / 2 + camera.x - camera.width / 2, PADDING + height / 2 + camera.y - camera.height / 2, width, height, 0, 'red');
        drawRect(PADDING + leftWidth / 2 + camera.x - camera.width / 2, PADDING + height / 2 + camera.y - camera.height / 2, leftWidth, height, 0, 'green');
        ctx.restore();

        //draw score
        drawText(camera.x + camera.width / 2 - PADDING, camera.y - camera.height / 2 + PADDING, 'Score: ' + globalScore, 'top', 'right', '30px Arial', 'white');
    };

    if (gameObject.type === GAME_OBJECT_ENEMY) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 7, [GAME_OBJECT_PLAYER], 100, 20
            );
            bullet.damage = 1;
            bullet.sprite = imgEnemyBullet;
            timers[gameObject.shootTimer] = 15;
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_ENEMY_ROCKETEER) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 6, [GAME_OBJECT_PLAYER], 60, 60,
            );
            bullet.damage = 2;
            bullet.sprite = imgRocketVadim;
            bullet.shootParticles = true;
            timers[gameObject.shootTimer] = 30;
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_ENEMY_TANK) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 0, [GAME_OBJECT_PLAYER], 1, 60,
            );
            bullet.damage = 1;
            bullet.sprite = imgVolna;
            bullet.shootParticles = false;
            timers[gameObject.shootTimer] = 1;
            timers[gameObject.unhitableTimer] = 1;
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_TRIPLESHOOTER) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet.damage = 1;
            bullet.sprite = imgEnemyBullet;
            bullet.shootParticles = false;
            timers[gameObject.shootTimer] = 20;
            timers[gameObject.unhitableTimer] = 1;
            let bullet1 = addBullet(
                gameObject.x, gameObject.y, gameObject.angle - 0.3,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet1.damage = 1;
            bullet1.sprite = imgEnemyBullet;
            bullet1.shootParticles = false;
            let bullet2 = addBullet(
                gameObject.x, gameObject.y, gameObject.angle + 0.3,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet2.damage = 1;
            bullet2.sprite = imgEnemyBullet;
            bullet2.shootParticles = false;
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_BOSS) {
        let { moveForward, rotateLeft, rotateRight, shoot } = bossProcessAI(gameObject);

        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            for (let bulletIndex = 0; bulletIndex < 20; bulletIndex++) {
                let randomAngle = getRandomFloat(0, Math.PI * 2);

                // let randomSpeed = getRandomFloat(2, 8);
                let bullet = addBullet(
                    gameObject.x, gameObject.y, randomAngle,
                    gameObject.speedX, gameObject.speedY, 3, [GAME_OBJECT_PLAYER], 800, 15,
                );
                bullet.damage = 1;
                bullet.sprite = imgEnemyBullet;
                bullet.shootParticles = false;
                timers[gameObject.shootTimer] = 120;
            }
        };

        controlShip(gameObject, rotateLeft, rotateRight, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_BULLET) {
        let amIDead = false;
        let hitObject = checkCollision(gameObject, gameObject.killObjectTypes);
        if (hitObject !== null) {
            let isVulnerable = timers[hitObject.unhitableTimer] <= 0;

            if (isVulnerable) {
                hitObject.hitpoints -= gameObject.damage;
                if (hitObject.type === GAME_OBJECT_PLAYER) {
                    timers[hitObject.unhitableTimer] = 2 * 60;
                }
                if (gameObject.pierce === false) {
                    amIDead = true;
                }
            }
        }

        if (timers[gameObject.lifetime] <= 0) {
            amIDead = true;
        }

        if (amIDead) {
            removeGameObject(gameObject);
            if (gameObject.shootParticles) {
                burstParticles(gameObject.x, gameObject.y, 'orange', 150);
            }
        }

        if (gameObject.shootParticles) {
            burstParticles(gameObject.x, gameObject.y, 'orange', 3, 3, 5);
        }
    }


    if (gameObject.hitpoints <= 0) {
        timers[screenShakeTimer] = 20;
        if (gameObject.type === GAME_OBJECT_ENEMY) {
            if (getRandomFloat(0, 1) > 0.85) {
                addHeal(gameObject.x, gameObject.y);
            }
            globalScore += 100;
        } else if (gameObject.type === GAME_OBJECT_TRIPLESHOOTER) {
            globalScore += 300;
            if (getRandomFloat(0, 1) > 0.65) {
                addBouncingPowerUp(gameObject.x, gameObject.y);
            }
        } else if (gameObject.type === GAME_OBJECT_ENEMY_ROCKETEER) {
            globalScore += 500;

            if (getRandomFloat(0, 1) > 0.65) {
                addRocketPowerUp(gameObject.x, gameObject.y);
            }
        } else if (gameObject.type === GAME_OBJECT_ENEMY_TANK) {
            globalScore += 1000;
            if (getRandomFloat(0, 1) > 0.65) {
                addBeanPowerUp(gameObject.x, gameObject.y);
            }
        } else if (gameObject.type === GAME_OBJECT_BOSS) {
            globalScore += 10000;
        } else if (gameObject.type === GAME_OBJECT_PLAYER) {
            globalScore += 0;
        }






        removeGameObject(gameObject);
        playSound(sndExplosion, 1);
        burstParticles(gameObject.x, gameObject.y, 'grey', 100);
    }

    if (
        gameObject.type === GAME_OBJECT_BEANPOWERUP ||
        gameObject.type === GAME_OBJECT_ROCKETPOWERUP ||
        gameObject.type === GAME_OBJECT_HEAL ||
        gameObject.type === GAME_OBJECT_BOUNCINGPOWERUP
    ) {
        if (timers[gameObject.lifetime] <= 0) {
            removeGameObject(gameObject);
        }
    }

    gameObject.x = gameObject.x + gameObject.speedX;
    gameObject.y = gameObject.y + gameObject.speedY;

    gameObject.speedX *= gameObject.frictionConst;
    gameObject.speedY *= gameObject.frictionConst;

    if (gameObject.x > camera.x + camera.width / 2 + 150) {
        gameObject.angle = gameObject.angle - Math.PI;
        gameObject.moveForward = true;
        gameObject.x -= 6;
    }
    if (gameObject.x < camera.x - camera.width / 2 - 150) {
        gameObject.angle = gameObject.angle - Math.PI;
        gameObject.moveForward = true;
        gameObject.x += 6;
    }
    if (gameObject.y > camera.y + camera.width / 2 + 150) {
        gameObject.angle = gameObject.angle - Math.PI;
        gameObject.moveForward = true;
        gameObject.y -= 6;
    }
    if (gameObject.y < camera.y - camera.width / 2 - 150) {
        gameObject.angle = gameObject.angle - Math.PI;
        gameObject.moveForward = true;
        gameObject.y += 6;
    }

    if (gameObject.bounce) {
        if (
            gameObject.x > camera.x + camera.width / 2 ||
            gameObject.x < camera.x - camera.width / 2
        ) {
            gameObject.speedX *= -1;
        }
        if (
            gameObject.y > camera.y + camera.height / 2 ||
            gameObject.y < camera.y - camera.height / 2
        ) {
            gameObject.speedY *= -1;
        }
    }

    if (gameObject.sprite) {
        if (timers[gameObject.unhitableTimer] > 0) {
            gameObject.doNotDraw = !gameObject.doNotDraw;
        } else {
            gameObject.doNotDraw = false;
        }
        if (!gameObject.doNotDraw) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle);
        }
    } else {
        drawRect(gameObject.x, gameObject.y,
            gameObject.width, gameObject.height,
            gameObject.angle, gameObject.color);
    }
    //drawCircle(gameObject.x, gameObject.y, gameObject.collisionRadius, 'red');
}

let enemySpawnTimer = addTimer();
let enemySpawnInterval = 2 * 60;

let screenShakeTimer = addTimer();
let globalTime = 0;
let gameTimer = addTimer();
let tutorielTimer = addTimer();

timers[gameTimer] = 0;
timers[enemySpawnTimer] = 1;
timers[tutorielTimer] = 300;

function loop() {
    if (imgStars.width > 0) {
        let minX = Math.floor((camera.x - camera.width) / imgStars.width);
        let minY = Math.floor((camera.y - camera.height) / imgStars.height);
        let maxX = Math.floor((camera.x + camera.width) / imgStars.width);
        let maxY = Math.floor((camera.y + camera.height) / imgStars.height);

        for (let bgTileX = minX; bgTileX <= maxX; bgTileX++) {
            for (let bgTileY = minY; bgTileY <= maxY; bgTileY++) {
                ctx.drawImage(
                    imgStars,
                    -camera.x - imgStars.width / 2 + camera.width / 2 + bgTileX * imgStars.width,
                    -camera.y - imgStars.height / 2 + camera.height / 2 + bgTileY * imgStars.height,
                );
            }
        }
    }


    if (globalBoss === null) {
        if (timers[gameTimer] <= 0) {
            globalBoss = addBoss();
        }
    }

    if (timers[enemySpawnTimer] <= 0) {
        let chance = getRandomFloat(0, 1);
        if (chance > 0.85) {
            addEnemyRocketeer();
        } else if (chance > 0.75) {
            addEnemyTank();
        } else if (chance > 0.60) {
            addTripleShooter();
        } else {
            addEnemy();
        }

        timers[enemySpawnTimer] = enemySpawnInterval;
        enemySpawnInterval = 1 / Math.sqrt(Math.sqrt(globalTime + 100)) * 700;
    }

    // if (timers[screenShakeTimer] > 0) {
    //     camera.angle = getRandomFloat(-0.02, 0.02);
    // } else {
    //     camera.angle = 0;
    // }
    ctx.save();

    //camera


    ctx.rotate(camera.angle);
    ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let gameObject = gameObjects[gameObjectIndex];
        if (gameObject.exists) {
            updateGameObject(gameObject);
        }
    }

    drawParticles();

    if (timers[tutorielTimer] > 0) {
        drawText(camera.x, camera.y - 160, '        W                         ', 'middle', 'center', '60px Arial', 'white');
        drawText(camera.x, camera.y - 100, 'Двигаться - A    D     Стрелять - Пробел', 'middle', 'center', '60px Arial', 'white');
    }

    if (!globalPlayer.exists && win === null) {
        drawText(camera.x, camera.y - 30, 'Вы были расплющены Ваш счёт: ' + globalScore, 'middle', 'center', '60px Arial', 'white');
        drawText(camera.x, camera.y + 30, 'Press F5 to restart', 'middle', 'center', '60px Arial', 'white');
        loose = true;
    }

    if (timers[gameTimer] <= 0 && !globalBoss.exists && loose === null) {
        drawText(camera.x, camera.y - 30, 'Вы выиграли) Ваш счёт: ' + globalScore, 'middle', 'center', '60px Arial', 'white');
        drawText(camera.x, camera.y + 30, 'Press F5 to restart', 'middle', 'center', '60px Arial', 'white');
        win = true;
    }

    ctx.restore();

    globalTime += 1;
    updateTimers();
    clearAllKeys();
    requestAnimationFrame(loop);
}

function beginGame() {
    playSound(sndSong, 0.75, true);
    requestAnimationFrame(loop);
    console.log('game started');
}

