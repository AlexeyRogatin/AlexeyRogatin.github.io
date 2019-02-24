
var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;

var ctx = canvas.getContext("2d");

const GAME_OBJECT_NONE = 0;
const GAME_OBJECT_PLAYER = 1;
const GAME_OBJECT_ENEMY = 2;
const GAME_OBJECT_BULLET = 3;

const AI_STATE_IDLE = 0
const AI_STATE_ROTATE_LEFT = 1
const AI_STATE_ROTATE_RIGHT = 2
const AI_STATE_MOVE_FORWARD = 3
const AI_STATE_SHOOT = 4

let gameObjects = []

let timers = []
function addTimer() {
    let timerIndex = timers.length;
    timers.push(0);
    return (timerIndex)
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
        accelConst: 0.15,
        frictionConst: 0.98,
        color: 'black',
        collisionRadius: 10,
        exists: true,
        shootTimer: addTimer(),
        //bullet
        lifetime: addTimer(),
        killObjectType: GAME_OBJECT_NONE,
        //enemy
        aiState: AI_STATE_IDLE,
        aiTimer: addTimer(),

        sprite: null,
    }

    let freeIndex = gameObjects.length
    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        const gameObject = gameObjects[gameObjectIndex]
        if (!gameObject.exists) {
            freeIndex = gameObjectIndex
            break
        }
    }
    gameObjects[freeIndex] = gameObject

    return gameObject
}

function makePlayer() {
    let player = addGameObject(GAME_OBJECT_PLAYER)
    player.height = 30
    player.width = 50
    player.x = 100
    player.y = 100
    player.color = 'yellow'
    player.collisionRadius = 20;
    return (player)
}

makePlayer()

function makeEnemy() {
    let enemy = addGameObject(GAME_OBJECT_ENEMY)
    enemy.width = 40
    enemy.height = 60
    enemy.x = 60
    enemy.y = 60
    enemy.color = 'green'
    enemy.collisionRadius = 15;
    return (enemy)
}




function getRandomInt(start, end) {
    let randomFloat = Math.random()
    let intervalLength = end - start;
    let intervalFloat = randomFloat * intervalLength
    let result = Math.round(intervalFloat + start)
    return result
}

function drawSprite(x, y, sprite, angle) {
    ctx.save()
    ctx.translate(x, y);

    ctx.rotate(-angle);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore()
}
function drawRect(x, y, width, height, angle, color) {
    ctx.save()
    ctx.translate(x, y);
    ctx.fillStyle = color

    ctx.rotate(-angle);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore()
}

function addBullet(x, y, angle, speedX, speedY, speedConst, killObjectType, lifetime = 120) {
    let bullet = addGameObject(GAME_OBJECT_BULLET)
    bullet.x = x
    bullet.y = y

    let speedVector = rotateVector(speedConst, speedConst, angle)
    bullet.speedX = speedX + speedVector.x
    bullet.speedY = speedY + speedVector.y
    bullet.angle = angle
    bullet.collisionRadius = 5;

    timers[bullet.lifetime] = lifetime;
    bullet.killObjectType = killObjectType;
    bullet.frictionConst = 1;
    return (bullet);
}

function controlShip(gameObject, rotateRight, rotateLeft, moveForward) {
    let accelX = 0;
    let accelY = 0;

    if (rotateRight) {
        gameObject.angle -= gameObject.rotationSpeed
    }
    if (rotateLeft) {
        gameObject.angle += gameObject.rotationSpeed
    }
    if (moveForward) {
        const accelVector = rotateVector(gameObject.accelConst, gameObject.accelConst, gameObject.angle)
        accelX = accelVector.x
        accelY = accelVector.y
    }

    gameObject.speedX += accelX;
    gameObject.speedY += accelY;

}

function removeGameObject(gameObject) {
    gameObject.exists = false;
}

function drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke();
}
function rotateVector(x, y, angle) {
    let resultX = x * Math.cos(angle);
    let resultY = -y * Math.sin(angle);
    return {
        x: resultX,
        y: resultY,
    }
}

function updateGameObject(gameObject) {


    if (gameObject.type === GAME_OBJECT_PLAYER) {

        let canShoot = timers[gameObject.shootTimer] <= 0;

        if (spaceKey.isDown && canShoot) {
            let bullet = addBullet(gameObject.x, gameObject.y, gameObject.angle, gameObject.speedX, gameObject.speedY, 10, GAME_OBJECT_ENEMY);
            timers[gameObject.shootTimer] = 10
        }

        controlShip(gameObject, rightKey.isDown, leftKey.isDown, upKey.isDown)


    }
    if (gameObject.type === GAME_OBJECT_ENEMY) {
        let moveForward = false
        let rotateLeft = false
        let rotateRight = false
        let shoot = false

        if (timers[gameObject.aiTimer] <= 0) {
            gameObject.aiState = getRandomInt(AI_STATE_IDLE, AI_STATE_SHOOT)
            timers[gameObject.aiTimer] = 60
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
            } break;
        }


        let canShoot = timers[gameObject.shootTimer] <= 0;
        if (shoot && canShoot) {
            let bullet = addBullet(gameObject.x, gameObject.y, gameObject.angle, gameObject.speedX, gameObject.speedY, 10, GAME_OBJECT_PLAYER)
            timers[gameObject.shootTimer] = 1;
        }

        controlShip(gameObject, rotateRight, rotateLeft, moveForward)
    }
    if (gameObject.type === GAME_OBJECT_BULLET) {


        for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
            let other = gameObjects[gameObjectIndex]
            if (other.exists) {

                if (other.type === gameObject.killObjectType) {
                    const radiusSum = gameObject.collisionRadius + other.collisionRadius;
                    const a = other.x - gameObject.x;
                    const b = other.y - gameObject.y;
                    const dist = Math.sqrt(a * a + b * b);
                    if (dist < radiusSum) {
                        removeGameObject(other)
                        removeGameObject(gameObject)
                    }
                }
            }
        }
        if (timers[gameObject.lifetime] <= 0) {
            removeGameObject(gameObject)
        }
    }

    gameObject.x = gameObject.x + gameObject.speedX;
    gameObject.y = gameObject.y + gameObject.speedY;

    gameObject.speedX *= gameObject.frictionConst;
    gameObject.speedY *= gameObject.frictionConst;




    ctx.save();

    if (gameObject.sprite) {
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle)
    } else {
        drawRect(gameObject.x, gameObject.y,
            gameObject.width, gameObject.height,
            gameObject.angle, gameObject.color)
    }
    drawCircle(gameObject.x, gameObject.y, gameObject.collisionRadius, 'red')

    ctx.restore();
}

for (let i = 0; i < 4; i++) {
    makeEnemy()
}

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let gameObject = gameObjects[gameObjectIndex]
        if (gameObject.exists) {
            updateGameObject(gameObject)
        }
    }

    updateTimers()
    clearAllKeys()

    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
