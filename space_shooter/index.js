﻿'use strict';
const ROTATION_SPEED = 0.05;

const MENU_OPTION_PLAY = 1;
const MENU_OPTION_DIFFICULTY = 2;
const MENU_OPTION_NAME = 3;
const MENU_OPTION_RECORDS = 4;

const PLAYER_TYPE_FAST = 0;
const PLAYER_TYPE_DEFAULT = 1;
const PLAYER_TYPE_DOUBLE = 2;

const DIFFICULTY_NORMAL = 0;
const DIFFCULTY_HARD = 1;

// screens
const SCREEN_MENU = 0;
const SCREEN_GAME = 1;
const SCREEN_RECORDS = 2;
const SCREEN_CHARACTERS = 3;

const GAME_OBJECT_NONE = 0;
const GAME_OBJECT_PLAYER = 1;
const GAME_OBJECT_ENEMY = 2;
const GAME_OBJECT_BULLET = 3;
const GAME_OBJECT_ENEMY_BULLET = 4;
const GAME_OBJECT_ENEMY_ROCKETEER = 6;
const GAME_OBJECT_HEAL = 7;
const GAME_OBJECT_ENEMY_TANK = 9;
const GAME_OBJECT_TRIPLESHOOTER = 11;
const GAME_OBJECT_BOSS = 12;

const GAME_OBJECT_ROCKETPOWERUP = 13;
const GAME_OBJECT_BEANPOWERUP = 14;
const GAME_OBJECT_BOUNCINGPOWERUP = 15;

const AI_STATE_IDLE = 0;
const AI_STATE_ROTATE_LEFT = 1;
const AI_STATE_ROTATE_RIGHT = 2;
const AI_STATE_MOVE_FORWARD = 3;
const AI_STATE_SHOOT = 4;
const AI_STATE_HUNT = 5;
const TIME_UNTIL_BOSS = 3000;

const SCREEN_RATIO = 16 / 9;
const canvas = document.getElementById("canvas");

function handleResize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = 1600;
    canvas.height = 900;
    canvas.style.height = (rect.width / SCREEN_RATIO) + 'px';
}

handleResize();
window.addEventListener('resize', handleResize);

const ctx = canvas.getContext("2d");

let state = null;
let globalRecords = [];

const DEFAULT_PLAYER_NAME = 'player';

function resetState() {
    state = {
        camera: {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            angle: 0,
        },
        particles: [],
        gameObjects: [],
        timers: [],
        globalPlayer: null,
        globalBoss: null,
        globalScore: 0,
        skillMode: false,
        killBullet: false,
        cleanHeight: 30,
        cleanWidth: 30,
        enemySpawnInterval: 2 * 60,
        globalTime: 0,

        inputInProgress: false,
        currentScreen: SCREEN_MENU,
        bossDefeatCount: 0,
    };

    state.skillTimer = addTimer();
    state.enemySpawnTimer = addTimer();
    state.screenShakeTimer = addTimer();
    state.bossTimer = addTimer(TIME_UNTIL_BOSS);

    state.tutorialTimer = addTimer(300);
}

let playerType = PLAYER_TYPE_DEFAULT;
let playersName = DEFAULT_PLAYER_NAME;
let difficulty = DIFFICULTY_NORMAL;
let menuKey = MENU_OPTION_PLAY;

let lap = 0;

resetState();

const HUNT_RADIUS = state.camera.width + 200;
const SKILL_TIMER_MAX = 600;



function addParticle(x, y, color, minRadius, maxRadius) {
    let randomAngle = getRandomFloat(0, Math.PI + Math.PI);

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
    state.particles.push(p);
}

function burstParticles(x, y, color, count, minRadius = 2, maxRadius = 8) {
    for (let pIndex = 0; pIndex < count; pIndex++) {
        addParticle(x, y, color, minRadius, maxRadius);
    }
}

function drawParticles() {
    for (let particleIndex = 0; particleIndex < state.particles.length; particleIndex++) {
        let p = state.particles[particleIndex];
        drawRect(p.x, p.y, p.r + p.r, p.r + p.r, 0, p.color);
        p.x += p.speedX;
        p.y += p.speedY;
        p.r -= p.sizeDecrease;

        if (p.r <= 0) {
            removeParticle(particleIndex);
        }
    }
}

function removeParticle(particleIndex) {
    let lastParticle = state.particles[state.particles.length - 1];
    state.particles[particleIndex] = lastParticle;
    state.particles.pop();
}


function addTimer(initialValue = 0) {
    let timerIndex = state.timers.length;
    state.timers.push(initialValue);
    return timerIndex;
}

function updateTimers() {
    for (let timerIndex = 0; timerIndex < state.timers.length; timerIndex++) {
        const value = getTimer(timerIndex);
        if (value > 0) {
            setTimer(timerIndex, value - 1);
        }
    }
}

function getTimer(timerId) {
    const result = state.timers[timerId];
    return result;
}

function setTimer(timerId, value) {
    state.timers[timerId] = value;
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
        accelConst: 0.18,
        frictionConst: 0.98,
        color: 'black',
        collisionRadius: 10,
        exists: true,
        shootTimer: addTimer(),
        hitpoints: 0,
        maxHitpoints: 0,
        unhitableTimer: addTimer(),
        shootTwice: false,

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
        huntAccelMultiplier: 2,

        //player
        powerUpTimer: addTimer(),
        powerUpType: GAME_OBJECT_NONE,

        sprite: null,

        //powerup
        powerUpTime: 0,
    };

    let freeIndex = state.gameObjects.length;
    for (let gameObjectIndex = 0; gameObjectIndex < state.gameObjects.length; gameObjectIndex++) {
        const gameObject = state.gameObjects[gameObjectIndex];
        if (!gameObject.exists) {
            freeIndex = gameObjectIndex;
            break;
        }
    }
    state.gameObjects[freeIndex] = gameObject;

    return gameObject;
}

function getGameObject(index) {
    const result = state.gameObjects[index];
    return result;
}

function addPlayerFast() {
    let player = addGameObject(GAME_OBJECT_PLAYER);
    player.accelConst = 0.25;
    player.rotationSpeed = 0.09;
    player.hitpoints = 2;
    player.maxHitpoints = 2;
    player.x = 0;
    player.y = 0;
    player.sprite = imgPlayerVadim1;
    player.collisionRadius = 35;
    return player;
}

function addPlayerDefault() {
    let player = addGameObject(GAME_OBJECT_PLAYER);
    player.x = 0;;
    player.y = 0;
    player.sprite = imgPlayerVadim2;
    player.collisionRadius = 25;
    player.hitpoints = 3;
    player.maxHitpoints = 3;
    return player;
}

function addPlayerDouble() {
    let player = addGameObject(GAME_OBJECT_PLAYER);
    player.x = 0;
    player.y = 0;
    player.sprite = imgPlayerVadim3;
    player.collisionRadius = 25;
    player.hitpoints = 2;
    player.maxHitpoints = 2;
    player.shootTwice = true;
    return player;
}


function addPowerUp(type, sprite, x, y, powerUpTime, lifetime = 600) {
    let powerUp = addGameObject(type);
    powerUp.sprite = sprite;
    powerUp.color = 'green';
    powerUp.collisionRadius = 25;
    powerUp.hitpoints = 100000000000;
    powerUp.maxHitpoints = 100000000000;
    powerUp.x = x;
    powerUp.y = y;
    powerUp.powerUpTime = powerUpTime;
    powerUp.frictionConst = 0.994;

    setTimer(powerUp.lifetime, lifetime);
    return powerUp;
}

function addRocketPowerUp(x, y) {
    let powerUp = addPowerUp(GAME_OBJECT_ROCKETPOWERUP, imgPowerUp, x, y, 600);
    return powerUp;
}

function addBeanPowerUp(x, y) {
    let powerUp = addPowerUp(GAME_OBJECT_BEANPOWERUP, imgBeanPowerUp, x, y, 600);
    return powerUp;
}

function addHeal(x, y) {
    let powerUp = addPowerUp(GAME_OBJECT_HEAL, imgHeal, x, y, 600);
    return powerUp;
}

function addBouncingPowerUp(x, y) {
    let powerUp = addPowerUp(GAME_OBJECT_BOUNCINGPOWERUP, imgBouncingPowerUp, x, y, 600);
    return powerUp;
}

function getRandomSpawnPosition() {
    let chance = getRandomInt(1, 4);
    let result = {
        x: 0,
        y: 0,
    };
    switch (chance) {
        case 1: {
            result.x = state.camera.x - state.camera.width / 2;
            result.y = state.camera.y - state.camera.height / 2;
        } break;
        case 2: {
            result.x = state.camera.x + state.camera.width / 2;
            result.y = state.camera.y - state.camera.height / 2;
        } break;
        case 3: {
            result.x = state.camera.x - state.camera.width / 2;
            result.y = state.camera.y + state.camera.height / 2;
        } break;
        case 4: {
            result.x = state.camera.x + state.camera.width / 2;
            result.y = state.camera.y + state.camera.height / 2;
        } break;
    }
    return result;
}

function addEnemyDefault() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY);
    const p = getRandomSpawnPosition();
    enemy.x = p.x;
    enemy.y = p.y;
    enemy.color = 'green';
    enemy.collisionRadius = 20;
    enemy.sprite = imgEnemyVadim;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 0.75;
    return enemy;
}

function addEnemyRocketeer() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY_ROCKETEER);
    const p = getRandomSpawnPosition();
    enemy.x = p.x;
    enemy.y = p.y;
    enemy.collisionRadius = 25;
    enemy.sprite = imgEnemyVadim1;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 1.5;
    return enemy;
}

function addEnemyTank() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY_TANK);
    const p = getRandomSpawnPosition();
    enemy.x = p.x;
    enemy.y = p.y;
    enemy.collisionRadius = 45;
    enemy.sprite = imgEnemyTank;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 10;
    return enemy;
}

function addTripleShooter() {
    let enemy = addGameObject(GAME_OBJECT_TRIPLESHOOTER);
    const p = getRandomSpawnPosition();
    enemy.x = p.x;
    enemy.y = p.y;
    enemy.collisionRadius = 25;
    enemy.sprite = imgShooter;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 1.5;
    return enemy;
}


function addBoss() {
    let enemy = addGameObject(GAME_OBJECT_BOSS);
    const p = getRandomSpawnPosition();
    enemy.x = p.x;
    enemy.y = p.y;
    enemy.collisionRadius = 160;
    enemy.sprite = imgBoss;
    enemy.angle = getRandomFloat(0, 2 * Math.PI);
    enemy.hitpoints = 100 + 50 * state.bossDefeatCount;
    enemy.maxHitpoints = enemy.hitpoints;
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

function addBullet(type, x, y, angle, speedX, speedY, speedConst, killObjectTypes, lifetime = 120, collisionRadius) {
    let bullet = addGameObject(type);
    bullet.hitpoints = 1;
    bullet.x = x;
    bullet.y = y;

    angle += getRandomFloat(-0.08, 0.08);

    let speedVector = rotateVector(speedConst, 0, angle);
    bullet.speedX = speedX + speedVector.x;
    bullet.speedY = speedY + speedVector.y;
    bullet.angle = angle;
    bullet.collisionRadius = collisionRadius;

    setTimer(bullet.lifetime, lifetime);
    bullet.killObjectTypes = killObjectTypes;
    bullet.frictionConst = 1;
    return bullet;
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
        let accelConst = gameObject.accelConst;
        if (gameObject.aiState === AI_STATE_HUNT) {
            accelConst *= gameObject.huntAccelMultiplier;
        }
        const accelVector = rotateVector(accelConst, 0, gameObject.angle);
        accelX = accelVector.x;
        accelY = accelVector.y;
    }

    gameObject.speedX += accelX;
    gameObject.speedY += accelY;
}

function removeGameObject(gameObject) {
    gameObject.exists = false;
}

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

function checkCollision(gameObject, otherTypes) {
    for (let gameObjectIndex = 0; gameObjectIndex < state.gameObjects.length; gameObjectIndex++) {
        let other = state.gameObjects[gameObjectIndex];
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


function angleBetweenPoints(x0, y0, x1, y1) {
    let dX = x1 - x0;
    let dY = y1 - y0;
    let cosA = dX / (Math.sqrt(dX * dX + dY * dY));
    let result = Math.acos(cosA);
    if (y1 > y0) {
        result *= -1;
    }
    return result;
}

function distanceBetweenPoints(x0, y0, x1, y1) {
    let dX = x1 - x0;
    let dY = y1 - y0;
    const result = Math.sqrt(dX * dX + dY * dY);
    return result;
}

function bossProcessAI(gameObject) {
    let moveForward = false;
    let shoot = false;
    let rotateLeft = false;
    let rotateRight = false;

    let stateChanged = false;

    let rotationChance = 0;

    let distance = distanceBetweenPoints(gameObject.x, gameObject.y, state.globalPlayer.x, state.globalPlayer.y);
    if (distance > HUNT_RADIUS) {
        gameObject.aiState = AI_STATE_HUNT;
    } else if (getTimer(gameObject.aiTimer) <= 0) {
        gameObject.aiState = getRandomInt(AI_STATE_MOVE_FORWARD, AI_STATE_SHOOT);
        stateChanged = true;
        rotationChance = getRandomInt(0, 1);
    }

    switch (gameObject.aiState) {
        case AI_STATE_MOVE_FORWARD: {
            if (stateChanged) {
                setTimer(gameObject.aiTimer, 100);
            }

            moveForward = true;
        } break;

        case AI_STATE_SHOOT: {
            if (stateChanged) {
                setTimer(gameObject.aiTimer, 200);
                setTimer(gameObject.shootTimer, 60);
            }

            shoot = true;
            if (rotationChance = 1) {
                rotateRight = true;
            } else {
                rotateLeft = true;
            }
        } break;

        case AI_STATE_HUNT: {
            gameObject.angle = angleBetweenPoints(gameObject.x, gameObject.y, state.globalPlayer.x, state.globalPlayer.y);
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

function processAI(gameObject) {
    let moveForward = false;
    let rotateLeft = false;
    let rotateRight = false;
    let shoot = false;

    let distance = distanceBetweenPoints(gameObject.x, gameObject.y, state.globalPlayer.x, state.globalPlayer.y);
    if (distance > HUNT_RADIUS) {
        gameObject.aiState = AI_STATE_HUNT;
    } else if (getTimer(gameObject.aiTimer) <= 0) {
        gameObject.aiState = getRandomInt(AI_STATE_ROTATE_LEFT, AI_STATE_SHOOT);
        setTimer(gameObject.aiTimer, 60);
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

        case AI_STATE_HUNT: {
            gameObject.angle = angleBetweenPoints(gameObject.x, gameObject.y, state.globalPlayer.x, state.globalPlayer.y);
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

function explosion_knockback(gameObject) {
    for (let objIndex = 0; objIndex < state.gameObjects.length; objIndex++) {
        let otherObject = state.gameObjects[objIndex];
        if (otherObject.exists && !(gameObject.pierce || gameObject.type === GAME_OBJECT_BOSS)) {
            let distance = distanceBetweenPoints(gameObject.x, gameObject.y, otherObject.x, otherObject.y);
            if (distance <= 200) {
                let speed = rotateVector((distance / 200) * 10, 0, angleBetweenPoints(gameObject.x, gameObject.y, otherObject.x, otherObject.y));
                otherObject.speedX += speed.x;
                otherObject.speedY += speed.y;
                if (otherObject.shootParticles) {
                    setTimer(otherObject.lifetime, 1);
                }
            }
        }
    }
}


function updateGameObject(gameObject) {
    if (gameObject.type === GAME_OBJECT_PLAYER) {
        let hitHeal = checkCollision(gameObject, [GAME_OBJECT_HEAL]);
        if (hitHeal !== null) {
            removeGameObject(hitHeal);
            if (gameObject.hitpoints !== gameObject.maxHitpoints) {
                gameObject.hitpoints++;
            }
        }

        const hitPowerUp = checkCollision(gameObject, [
            GAME_OBJECT_BEANPOWERUP,
            GAME_OBJECT_BOUNCINGPOWERUP,
            GAME_OBJECT_ROCKETPOWERUP,
        ]);

        if (eKey.isDown && getTimer(state.skillTimer) >= SKILL_TIMER_MAX) {
            state.skillMode = true;
        }

        if (getTimer(state.skillTimer) <= 0) {
            state.skillMode = false;
        }

        let rateMultiplier = 1;
        state.killBullet = false;

        let killObjectTypes = [
            GAME_OBJECT_ENEMY,
            GAME_OBJECT_ENEMY_ROCKETEER,
            GAME_OBJECT_ENEMY_TANK,
            GAME_OBJECT_TRIPLESHOOTER,
            GAME_OBJECT_BOSS,
        ];

        let moonKillObjectTypes = [
            GAME_OBJECT_ENEMY,
            GAME_OBJECT_ENEMY_ROCKETEER,
            GAME_OBJECT_ENEMY_TANK,
            GAME_OBJECT_TRIPLESHOOTER,
        ];

        if (state.skillMode) {
            if (playerType === PLAYER_TYPE_FAST) {
                rateMultiplier = 0.5;
            }
            if (playerType === PLAYER_TYPE_DEFAULT) {
                let shield = addBullet(
                    GAME_OBJECT_BULLET,
                    gameObject.x, gameObject.y, gameObject.angle,
                    gameObject.speedX, gameObject.speedY, 0, moonKillObjectTypes, 1, 60,
                );
                shield.damage = 1;
                shield.sprite = imgVolna;
                shield.shootParticles = false;
                setTimer(gameObject.shootTimer, 1);
                setTimer(gameObject.unhitableTimer, 1);
            }
            if (playerType === PLAYER_TYPE_DOUBLE) {
                state.killBullet = true;
                setTimer(state.skillTimer, getTimer(state.skillTimer) - 0.5);
                if (state.cleanWidth < 1000) {
                    drawSprite(gameObject.x, gameObject.y, imgCleaning, 0, state.cleanWidth, state.cleanHeight);
                    state.cleanHeight += 50;
                    state.cleanWidth += 50;
                } else {
                    state.cleanWidth = 30;
                    state.cleanHeight = 30;
                }
            }
        }

        let skillModeTimerValue = getTimer(state.skillTimer);
        if (skillModeTimerValue <= SKILL_TIMER_MAX && !state.skillMode) {
            setTimer(state.skillTimer, skillModeTimerValue + 1.7);
        }

        if (hitPowerUp) {
            setTimer(gameObject.powerUpTimer, hitPowerUp.powerUpTime);
            gameObject.powerUpType = hitPowerUp.type;
            removeGameObject(hitPowerUp);
        }

        let canShoot = getTimer(gameObject.shootTimer) <= 0;

        if (spaceKey.isDown && canShoot) {
            if (getTimer(gameObject.powerUpTimer) > 0) {
                let bullet = null;
                let reloadTime = 0;

                switch (gameObject.powerUpType) {
                    case GAME_OBJECT_ROCKETPOWERUP: {
                        bullet = addBullet(
                            GAME_OBJECT_BULLET,
                            gameObject.x, gameObject.y,
                            gameObject.angle, gameObject.speedX,
                            gameObject.speedY, 9, killObjectTypes, 120, 55,
                        );
                        bullet.bounce = false;
                        bullet.sprite = imgRocketVadim;
                        bullet.shootParticles = true;
                        bullet.damage = 1.5;

                        reloadTime = 15;
                        playSound(sndRocket, 0.2);
                    } break;
                    case GAME_OBJECT_BEANPOWERUP: {
                        bullet = addBullet(
                            GAME_OBJECT_BULLET,
                            gameObject.x, gameObject.y,
                            gameObject.angle, gameObject.speedX,
                            gameObject.speedY, 3,
                            killObjectTypes,
                            800, 120,
                        );
                        bullet.bounce = false;
                        bullet.sprite = imgGiantShoot;
                        bullet.shootParticles = false;
                        bullet.damage = 100000;
                        bullet.pierce = true;

                        reloadTime = 80;
                        playSound(sndMoon, 0.5);
                    } break;
                    case GAME_OBJECT_BOUNCINGPOWERUP: {
                        bullet = addBullet(
                            GAME_OBJECT_BULLET,
                            gameObject.x, gameObject.y,
                            gameObject.angle, gameObject.speedX,
                            gameObject.speedY, 10, killObjectTypes, 400, 15,
                        );
                        bullet.bounce = true;
                        bullet.sprite = imgBounce;
                        bullet.shootParticles = false;
                        bullet.damage = 1;
                        bullet.pierce = false;

                        reloadTime = 12;
                        playSound(sndGun, 0.2);
                    } break;
                }

                setTimer(gameObject.shootTimer, reloadTime * rateMultiplier);
            } else if (gameObject.shootTwice) {
                let bulletVector = rotateVector(0, -20, gameObject.angle);
                let bullet = addBullet(
                    GAME_OBJECT_BULLET,
                    gameObject.x + bulletVector.x, gameObject.y + bulletVector.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 10, killObjectTypes, 100, 15,
                );
                bullet.sprite = imgPlayerBullet;
                bullet.damage = 0.75;

                let bulletVector1 = rotateVector(0, 20, gameObject.angle);
                let bullet1 = addBullet(
                    GAME_OBJECT_BULLET,
                    gameObject.x + bulletVector1.x, gameObject.y + bulletVector1.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 10, killObjectTypes, 100, 15,
                );
                bullet1.sprite = imgPlayerBullet;
                bullet1.damage = 0.5;
                setTimer(gameObject.shootTimer, 10 * rateMultiplier);
            } else {
                let bullet = addBullet(
                    GAME_OBJECT_BULLET,
                    gameObject.x, gameObject.y,
                    gameObject.angle, gameObject.speedX,
                    gameObject.speedY, 10, killObjectTypes, 100, 15,
                );
                setTimer(gameObject.shootTimer, 10 * rateMultiplier);
                bullet.sprite = imgPlayerBullet;
                bullet.damage = 1;
            }
            playSound(sndGun, 0.2);
        }

        controlShip(gameObject, rightKey.isDown, leftKey.isDown, upKey.isDown);

        state.camera.x = gameObject.x;
        state.camera.y = gameObject.y;

        const STRIPE_WIDTH = 100;
        const STRIPE_HEIGHT = 30;
        const powerUpTimeLeftPercentage = getTimer(gameObject.powerUpTimer) / 400;
        const leftTimeWidth = STRIPE_WIDTH * powerUpTimeLeftPercentage;

        if (getTimer(gameObject.powerUpTimer) > 0) {
            let color = null;
            switch (gameObject.powerUpType) {
                case GAME_OBJECT_ROCKETPOWERUP: {
                    color = 'yellow';
                } break;
                case GAME_OBJECT_BEANPOWERUP: {
                    color = 'green';
                } break;
                case GAME_OBJECT_BOUNCINGPOWERUP: {
                    color = 'red';
                } break;
            }
            drawRect(
                200 + leftTimeWidth / 2 + state.camera.x - state.camera.width / 2,
                10 + STRIPE_HEIGHT / 2 + state.camera.y - state.camera.height / 2,
                leftTimeWidth, STRIPE_HEIGHT, 0, color
            );
        }

        const skillTimeLeftPercentage = getTimer(state.skillTimer) / SKILL_TIMER_MAX;
        const skillLeftTimeWidth = skillTimeLeftPercentage * STRIPE_WIDTH;

        drawRect(400 + skillLeftTimeWidth / 2 + state.camera.x - state.camera.width / 2, 10 + STRIPE_HEIGHT / 2 + state.camera.y - state.camera.height / 2, skillLeftTimeWidth, STRIPE_HEIGHT, 0, 'white');

        if (getTimer(state.skillTimer) >= SKILL_TIMER_MAX) {
            drawText(400 + skillLeftTimeWidth / 2 + state.camera.x - state.camera.width / 2 + 300, state.camera.y - state.camera.height / 2 + 10, 'Жми "E"!!!', 'top', 'right', '30px Arial', 'yellow');
        }

        //draw hitpoints

        const hitpointsLeftPercentage = gameObject.hitpoints / gameObject.maxHitpoints;
        const leftWidth = STRIPE_WIDTH * hitpointsLeftPercentage;

        ctx.save();
        ctx.rotate(-state.camera.angle);

        drawRect(
            10 + STRIPE_WIDTH / 2 + state.camera.x - state.camera.width / 2,
            10 + STRIPE_HEIGHT / 2 + state.camera.y - state.camera.height / 2,
            STRIPE_WIDTH, STRIPE_HEIGHT, 0, 'red',
        );
        drawRect(
            10 + leftWidth / 2 + state.camera.x - state.camera.width / 2,
            10 + STRIPE_HEIGHT / 2 + state.camera.y - state.camera.height / 2,
            leftWidth, STRIPE_HEIGHT, 0, 'green',
        );
        ctx.restore();

        //draw score
        drawText(
            state.camera.x + state.camera.width / 2 - 10,
            state.camera.y - state.camera.height / 2 + 10,
            'Score: ' + state.globalScore,
            'top', 'right', '30px Arial', 'yellow',
        );

        if (state.timers[state.screenShakeTimer] > 0) {
            state.camera.x += getRandomFloat(-3, 3);
            state.camera.y += getRandomFloat(-3, 3);
        }
    };

    if (gameObject.type === GAME_OBJECT_ENEMY) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = getTimer(gameObject.shootTimer) <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 7, [GAME_OBJECT_PLAYER], 150, 20
            );
            bullet.damage = 1;
            bullet.sprite = imgEnemyBullet;
            setTimer(gameObject.shootTimer, 15);
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_ENEMY_ROCKETEER) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = getTimer(gameObject.shootTimer) <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 6, [GAME_OBJECT_PLAYER], 60, 60,
            );
            bullet.damage = 2;
            bullet.sprite = imgRocketVadim;
            bullet.shootParticles = true;
            setTimer(gameObject.shootTimer, 30);
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_ENEMY_TANK) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = getTimer(gameObject.shootTimer) <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 0, [GAME_OBJECT_PLAYER], 1, 60,
            );
            bullet.damage = 1;
            bullet.sprite = imgVolna;
            bullet.shootParticles = false;
            setTimer(gameObject.shootTimer, 1);
            setTimer(gameObject.unhitableTimer, 1);
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_TRIPLESHOOTER) {
        let { moveForward, rotateLeft, rotateRight, shoot } = processAI(gameObject);

        let canShoot = getTimer(gameObject.shootTimer) <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(
                GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet.damage = 1;
            bullet.sprite = imgEnemyBullet;
            bullet.shootParticles = false;
            let bullet1 = addBullet(
                GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle - 0.3,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet1.damage = 1;
            bullet1.sprite = imgEnemyBullet;
            bullet1.shootParticles = false;
            let bullet2 = addBullet(
                GAME_OBJECT_ENEMY_BULLET,
                gameObject.x, gameObject.y, gameObject.angle + 0.3,
                gameObject.speedX, gameObject.speedY, 8, [GAME_OBJECT_PLAYER], 30, 15,
            );
            bullet2.damage = 1;
            bullet2.sprite = imgEnemyBullet;
            bullet2.shootParticles = false;
            setTimer(gameObject.shootTimer, 20);
        };

        controlShip(gameObject, rotateRight, rotateLeft, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_BOSS) {
        let { moveForward, rotateLeft, rotateRight, shoot } = bossProcessAI(gameObject);

        let canShoot = getTimer(gameObject.shootTimer) <= 0;
        if (gameObject.hitpoints <= gameObject.maxHitpoints * 0.10) {
            gameObject.sprite = imgBoss4;
        } else if (gameObject.hitpoints <= gameObject.maxHitpoints * 0.25) {
            gameObject.sprite = imgBoss3;
        } else if (gameObject.hitpoints <= gameObject.maxHitpoints * 0.50) {
            gameObject.sprite = imgBoss2;
        } else if (gameObject.hitpoints <= gameObject.maxHitpoints * 0.75) {
            gameObject.sprite = imgBoss1;
        }
        if (shoot && canShoot) {
            for (let bulletIndex = 0; bulletIndex < 15; bulletIndex++) {
                let randomAngle = getRandomFloat(0, Math.PI * 2);

                let bullet = addBullet(
                    GAME_OBJECT_ENEMY_BULLET,
                    gameObject.x, gameObject.y, randomAngle,
                    gameObject.speedX, gameObject.speedY, 4, [GAME_OBJECT_PLAYER], 300, 15,
                );
                bullet.damage = 1;
                bullet.sprite = imgEnemyBullet;
                bullet.shootParticles = false;
                setTimer(gameObject.shootTimer, 150);
            }
        };

        controlShip(gameObject, rotateLeft, rotateRight, moveForward);
    }

    if (gameObject.type === GAME_OBJECT_BULLET || gameObject.type === GAME_OBJECT_ENEMY_BULLET) {
        if (getTimer(gameObject.lifetime) > 2) {
            if (!gameObject.bounce && !gameObject.pierce) {
                gameObject.angle = angleBetweenPoints(1, 0, gameObject.speedX, gameObject.speedY);
            } else {
                gameObject.angle += 0.09;
            }
        }

        let amIDead = false;
        let hitObject = checkCollision(gameObject, gameObject.killObjectTypes);
        if (state.killBullet && gameObject.type === GAME_OBJECT_ENEMY_BULLET) {
            amIDead = true;
        }
        if (hitObject !== null) {
            let isVulnerable = getTimer(hitObject.unhitableTimer) <= 0;

            if (isVulnerable) {
                if (hitObject.type === GAME_OBJECT_BOSS) {
                    hitObject.hitpoints -= 10;
                    amIDead = true;
                } else {
                    hitObject.hitpoints -= gameObject.damage;
                }
                if (hitObject.type === GAME_OBJECT_PLAYER) {
                    setTimer(hitObject.unhitableTimer, 2 * 60);
                }
                if (!gameObject.pierce) {
                    amIDead = true;
                }
            }
        }

        if (getTimer(gameObject.lifetime) <= 0) {
            amIDead = true;
        }

        if (amIDead) {
            removeGameObject(gameObject);
            if (gameObject.shootParticles) {
                burstParticles(gameObject.x, gameObject.y, 'orange', 10);
                burstParticles(gameObject.x, gameObject.y, 'yellow', 10);
            }
        }

        if (gameObject.shootParticles) {
            burstParticles(gameObject.x, gameObject.y, 'orange', 1, 3, 5);
            burstParticles(gameObject.x, gameObject.y, 'yellow', 1, 3, 5);
        }
    }

    if (
        gameObject.type === GAME_OBJECT_BEANPOWERUP ||
        gameObject.type === GAME_OBJECT_BOUNCINGPOWERUP ||
        gameObject.type === GAME_OBJECT_ROCKETPOWERUP ||
        gameObject.type === GAME_OBJECT_HEAL
    ) {
        gameObject.speedX *= gameObject.frictionConst;
        gameObject.speedY *= gameObject.frictionConst;
        gameObject.x += gameObject.speedX;
        gameObject.y += gameObject.speedY;
        gameObject.angle += distanceBetweenPoints(0, 0, gameObject.speedX, gameObject.speedY) * 0.02;

        if (getTimer(gameObject.lifetime) <= 100) {
            setTimer(gameObject.unhitableTimer, 100);
        }

        if (getTimer(gameObject.lifetime) <= 0) {
            removeGameObject(gameObject);
        }
    }

    if (gameObject.hitpoints <= 0) {
        setTimer(state.screenShakeTimer, 20);
        let powerUp;

        switch (gameObject.type) {
            case GAME_OBJECT_ENEMY: {
                if (getRandomFloat(0, 1) > 0.85) {
                    powerUp = addHeal(gameObject.x, gameObject.y);
                }
                state.globalScore += 100;
            } break;
            case GAME_OBJECT_TRIPLESHOOTER: {
                state.globalScore += 300;
                if (getRandomFloat(0, 1) > 0.65) {
                    powerUp = addBouncingPowerUp(gameObject.x, gameObject.y);
                }
            } break;
            case GAME_OBJECT_ENEMY_ROCKETEER: {
                state.globalScore += 500;

                if (getRandomFloat(0, 1) > 0.65) {
                    powerUp = addRocketPowerUp(gameObject.x, gameObject.y);
                }
            } break;
            case GAME_OBJECT_ENEMY_TANK: {
                state.globalScore += 1000;
                if (getRandomFloat(0, 1) > 0.65) {
                    powerUp = addBeanPowerUp(gameObject.x, gameObject.y);
                }
            } break;
            case GAME_OBJECT_BOSS: {
                state.bossDefeatCount++;

                state.globalScore += 10000 * state.bossDefeatCount;

                // win the game
                setTimer(state.bossTimer, TIME_UNTIL_BOSS);
                state.globalBoss = null;
            } break;
            case GAME_OBJECT_PLAYER: {
                globalRecords.push({
                    name: playersName,
                    score: state.globalScore,
                });
            } break;
        }

        if (powerUp) {
            powerUp.angle = getRandomFloat(0, Math.PI * 2);
            powerUp.speedX = gameObject.speedX;
            powerUp.speedY = gameObject.speedY;
            powerUp.x += getRandomFloat(-1, 1);
            powerUp.y += getRandomFloat(-1, 1);
        }

        removeGameObject(gameObject);

        playSound(sndExplosion, 1);
        if (gameObject.type === GAME_OBJECT_BOSS) {
            burstParticles(gameObject.x, gameObject.y, 'green', 250, 10, 15);
            burstParticles(gameObject.x, gameObject.y, 'orange', 250, 10, 15);
        } else {
            burstParticles(gameObject.x, gameObject.y, 'orange', 50);
            burstParticles(gameObject.x, gameObject.y, 'yellow', 50);
        }
    }

    gameObject.x = gameObject.x + gameObject.speedX;
    gameObject.y = gameObject.y + gameObject.speedY;

    gameObject.speedX *= gameObject.frictionConst;
    gameObject.speedY *= gameObject.frictionConst;

    if (gameObject.bounce) {
        if (
            gameObject.x > state.camera.x + state.camera.width / 2 ||
            gameObject.x < state.camera.x - state.camera.width / 2
        ) {
            gameObject.speedX *= -1;
        }
        if (
            gameObject.y > state.camera.y + state.camera.height / 2 ||
            gameObject.y < state.camera.y - state.camera.height / 2
        ) {
            gameObject.speedY *= -1;
        }
    }

    if (gameObject.sprite) {
        if (getTimer(gameObject.unhitableTimer) > 0) {
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
    // drawCircle(gameObject.x, gameObject.y, gameObject.collisionRadius, 'red');
}

function clipValue(value, min, max) {
    const result = Math.min(Math.max(min, value), max);
    return result;
}

const MENU_OFFSET_LEFT = 0.32 * state.camera.width;

function drawMenuText(x, y, text, bold = false, align = 'left') {
    let font = '';
    if (bold) {
        font += 'bold ';
    }
    font += '60px Arial';
    drawText(state.camera.x + x, state.camera.y + y, text, 'middle', align, font, 'yellow');
}

function loopMenu() {
    if (!state.inputInProgress) {
        if (upKey.wentDown) {
            menuKey--;
        }
        if (downKey.wentDown) {
            menuKey++;
        }
    }

    menuKey = clipValue(menuKey, MENU_OPTION_PLAY, MENU_OPTION_RECORDS);

    //задник
    drawSprite(state.camera.width / 2, state.camera.height / 2, imgScreen, 0, canvas.width, canvas.height);

    drawRect(state.camera.x + mouseX, state.camera.y + mouseY, 3, 3, 0, 'red');

    if (menuKey === MENU_OPTION_PLAY) {
        if (spaceKey.wentDown && canBeginGame) {
            state.currentScreen = SCREEN_CHARACTERS;
        }
        drawMenuText(150, 300, 'Играть', true);
    } else {
        drawMenuText(150, 300, 'Играть');
    }

    const difficultyTexts = ['Нормально', 'Сложно'];

    if (menuKey === MENU_OPTION_DIFFICULTY) {
        if (spaceKey.wentDown) {
            difficulty++;
            if (difficulty > DIFFCULTY_HARD) {
                difficulty = DIFFICULTY_NORMAL;
            }
        }
        drawMenuText(150, 375, difficultyTexts[difficulty], true);
    } else {
        drawMenuText(150, 375, difficultyTexts[difficulty]);
    }

    let boldness = false;
    if (menuKey === MENU_OPTION_NAME) {
        boldness = true;
        if (spaceKey.wentDown) {
            if (state.inputInProgress) {
                state.inputInProgress = false;
            } else {
                globalInputString = '';
                state.inputInProgress = true;
            }
        }
    }

    if (!state.inputInProgress) {
        let name = 'Имя';
        if (playersName !== DEFAULT_PLAYER_NAME) {
            name = playersName;
        }
        drawMenuText(150, 450, name, boldness);
    } else {
        playersName = globalInputString;
        drawMenuText(150, 450, playersName, boldness);
    }

    if (menuKey === MENU_OPTION_RECORDS) {
        drawMenuText(150, 525, 'Рекорды', true);
        if (spaceKey.wentDown) {
            state.currentScreen = SCREEN_RECORDS;

            let recordsCount = globalRecords.length;
            let mistakes = 1;
            if (recordsCount >= 2) {
                while (mistakes !== 0) {
                    mistakes = 0;
                    for (let recordIndex = 1; recordIndex < recordsCount; recordIndex++) {
                        if (globalRecords[recordIndex].score > globalRecords[recordIndex - 1].score) {
                            let save_record = globalRecords[recordIndex];
                            globalRecords[recordIndex] = globalRecords[recordIndex - 1];
                            globalRecords[recordIndex - 1] = save_record;

                            mistakes++;
                        }
                    }
                }
            }
        }
    } else {
        drawMenuText(150, 525, 'Рекорды');
    }


    drawMenuText(state.camera.width * 0.5, 90, 'Space Future 2D-3D', true, 'center');
    drawMenuText(state.camera.width * 0.5, 150, 'Super Epic Shooter', true, 'center');


    drawSprite(state.camera.width * 0.66, state.camera.height * 0.5, imgPlayerVadim2, (resourcesLoadedCount / resourcesWaitingForLoadCount) * Math.PI * 2);
}

function loopRecords() {
    //задник
    drawSprite(state.camera.width / 2, state.camera.height / 2, imgScreen, 0, canvas.width, canvas.height);

    drawMenuText(state.camera.width * 0.5, 90, 'Рекорды', true, 'center');

    const RECORD_HEIGHT = 60;
    for (let recordIndex = 1; recordIndex <= globalRecords.length; recordIndex++) {
        let record = globalRecords[recordIndex - 1];
        drawMenuText(state.camera.width * 0.5, 100 + recordIndex * RECORD_HEIGHT, `${recordIndex}) ${record.name} - ${record.score}`, false, 'center');
    }

    if (qKey.wentDown || spaceKey.wentDown) {
        state.currentScreen = SCREEN_MENU;
    }
}

function loopCharacters() {
    //задник
    drawSprite(state.camera.width / 2, state.camera.height / 2, imgScreen, 0, canvas.width, canvas.height);

    drawMenuText(state.camera.width * 0.5, 90, 'Выберите корабль', true, 'center');
    //спрайты персонажей
    const playerSprites = [imgPlayerVadim1, imgPlayerVadim2, imgPlayerVadim3];
    for (let i = 0; i < playerSprites.length; i++) {
        drawSprite(
            state.camera.x + state.camera.width * 0.5 + (i - 1) * 150,
            state.camera.y + state.camera.height * 0.5 - 250,
            playerSprites[i], 0
        );
    }

    if (rightKey.wentDown) {
        playerType++;
    }
    if (leftKey.wentDown) {
        playerType--;
    }
    playerType = clipValue(playerType, PLAYER_TYPE_FAST, PLAYER_TYPE_DOUBLE);

    let arrowX = (playerType - 1) * 150;
    drawMenuText(state.camera.width * 0.5 + arrowX, 300, '▲', true, 'center');

    if (spaceKey.wentDown) {
        state.currentScreen = SCREEN_GAME;
        if (lap === 0) {
            playSound(sndSong, 0.75, true);
        }
        if (playerType === PLAYER_TYPE_FAST) {
            state.globalPlayer = addPlayerFast();
        }
        if (playerType === PLAYER_TYPE_DEFAULT) {
            state.globalPlayer = addPlayerDefault();
        }
        if (playerType === PLAYER_TYPE_DOUBLE) {
            state.globalPlayer = addPlayerDouble();
        }
    }

    if (qKey.wentDown) {
        state.currentScreen = SCREEN_MENU;
    }
}

function loopGame() {
    // draw background
    if (imgStars.width > 0) {
        let minX = Math.floor((state.camera.x - state.camera.width * 0.5) / imgStars.width / SPRITE_SCALE);
        let minY = Math.floor((state.camera.y - state.camera.height * 0.5) / imgStars.height / SPRITE_SCALE);
        let maxX = Math.ceil((state.camera.x + state.camera.width * 0.5) / imgStars.width / SPRITE_SCALE);
        let maxY = Math.ceil((state.camera.y + state.camera.height * 0.5) / imgStars.height / SPRITE_SCALE);

        for (let bgTileX = minX; bgTileX <= maxX; bgTileX++) {
            for (let bgTileY = minY; bgTileY <= maxY; bgTileY++) {
                drawSprite(
                    -state.camera.x - imgStars.width * SPRITE_SCALE / 2 + state.camera.width / 2 + bgTileX * imgStars.width * SPRITE_SCALE,
                    -state.camera.y - imgStars.height * SPRITE_SCALE / 2 + state.camera.height / 2 + bgTileY * imgStars.height * SPRITE_SCALE,
                    imgStars,
                    0,
                    imgStars.width * SPRITE_SCALE, imgStars.height * SPRITE_SCALE
                );
            }
        }
    }

    if (state.globalBoss === null) {
        if (getTimer(state.bossTimer) <= 0) {
            state.globalBoss = addBoss();
        }
    }

    if (getTimer(state.enemySpawnTimer) <= 0) {
        let chance = getRandomFloat(0, 1);
        if (chance > 0.85) {
            addEnemyRocketeer();
        } else if (chance > 0.75) {
            addEnemyTank();
        } else if (chance > 0.60) {
            addTripleShooter();
        } else {
            addEnemyDefault();
        }

        setTimer(state.enemySpawnTimer, state.enemySpawnInterval);
        if (difficulty === DIFFICULTY_NORMAL) {
            state.enemySpawnInterval = 1 / Math.sqrt(Math.sqrt(state.globalTime * 50 + 100)) * 700;
        }
        if (difficulty === DIFFCULTY_HARD) {
            state.enemySpawnInterval = 0;
        }
    }

    ctx.save();

    //камера
    ctx.rotate(state.camera.angle);
    ctx.translate(-state.camera.x + state.camera.width / 2, -state.camera.y + state.camera.height / 2);

    for (let gameObjectIndex = 0; gameObjectIndex < state.gameObjects.length; gameObjectIndex++) {
        let gameObject = state.gameObjects[gameObjectIndex];
        if (gameObject.exists) {
            updateGameObject(gameObject);
        }
    }

    drawParticles();

    if (getTimer(state.tutorialTimer) > 0 && state.lap === 0) {
        drawText(state.camera.x, state.camera.y - 160, '        W                         ', 'middle', 'center', '60px Arial', 'yellow');
        drawText(state.camera.x, state.camera.y - 100, 'Двигаться - A    D     Стрелять - Пробел', 'middle', 'center', '60px Arial', 'yellow');
    }

    if (!state.globalPlayer.exists) {
        if (state.bossDefeatCount <= 0) {
            drawText(state.camera.x, state.camera.y - 30, 'Вы были расплющены! Ваш счёт: ' + state.globalScore, 'middle', 'center', '60px Arial', 'yellow');
            drawText(state.camera.x, state.camera.y + 30, 'Нажмите "R" для меню', 'middle', 'center', '60px Arial', 'yellow');
        }
        else {
            drawText(state.camera.x, state.camera.y - 30, 'Вы выиграли) Ваш счёт: ' + state.globalScore, 'middle', 'center', '60px Arial', 'yellow');
            drawText(state.camera.x, state.camera.y + 30, 'Вы победили босса ' + state.bossDefeatCount + ' раз', 'middle', 'center', '60px Arial', 'yellow');
        }
    }


    ctx.restore();
    state.globalTime += 1;
    updateTimers();
}

function loop() {
    if (!state.inputInProgress && rKey.wentDown) {
        lap++;
        resetState();
    }

    // canvas.requestFullscreen();

    switch (state.currentScreen) {
        case SCREEN_MENU: {
            loopMenu();
        } break;

        case SCREEN_GAME: {
            loopGame();
        } break;

        case SCREEN_RECORDS: {
            loopRecords();
        } break;

        case SCREEN_CHARACTERS: {
            loopCharacters();
        } break;
    }

    clearAllKeys();
    requestAnimationFrame(loop);
}

function beginGame() {
    resetState();
    requestAnimationFrame(loop);
    console.log('game started');
}
requestAnimationFrame(loop);
