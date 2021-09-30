let resourcesWaitingForLoadCount = 0;
let resourcesLoadedCount = 0;
let canBeginGame = false;

let sndMusic = loadSound('./sounds/Vadim/Moya_pesnya_6.wav');
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
let imgEnemyTank = loadImage('./sprites/Vadim/tank1.png');
let imgGiantShoot = loadImage('./sprites/bean.png');
let imgVolna = loadImage('./sprites/Vadim/volna.png');
let imgCleaning = loadImage('./sprites/Vadim/clean.png');
let imgBounce = loadImage('./sprites/bounce.png');
let imgNothing = loadImage('./sprites/nothing.png');
let imgShooter = loadImage('./sprites/Vadim/player4.png');
let imgBoss = loadImage('./sprites/Vadim/deathstar.png');
let imgBoss1 = loadImage('./sprites/Vadim/deathstar1.png');
let imgBoss2 = loadImage('./sprites/Vadim/deathstar2.png');
let imgBoss3 = loadImage('./sprites/Vadim/deathstar3.png');
let imgBoss4 = loadImage('./sprites/Vadim/deathstar4.png');
let imgScreen = loadImage('./sprites/screen.png');

let imgEnemyVadim1 = loadImage('./sprites/Vadim/player3.png');
let imgEnemyVadim = loadImage('./sprites/Vadim/player.png');
let imgPlayerVadim1 = loadImage('./sprites/Vadim/tank.png');
let imgPlayerVadim2 = loadImage('./sprites/Vadim/player1.png');
let imgPlayerVadim3 = loadImage('./sprites/Vadim/player2.png');
let imgRocketVadim = loadImage('./sprites/Vadim/rocket.png');

let imgPowerButton = loadImage('./sprites/powerButton.png');
let imgShootButton = loadImage('./sprites/shootButton.png');
let imgJoystickBig = loadImage('./sprites/joystick1.png');
let imgJoystickSmall = loadImage('./sprites/joystick.png');

const SPRITE_SCALE = 6

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


function drawRect(x, y, width, height, angle, color) {
  ctx.save();	//Сохраняется, чтобы потом можно было вернуть экран
  ctx.translate(x, y);	//Сохраняет предыдущие координаты, чтобы переместить экран обратно
  ctx.fillStyle = color;	//Выбирается окраска

  ctx.rotate(-angle);	//Экран поворачивается на угол
  ctx.fillRect(-width / 2, -height / 2, width, height);	//Рисуется четырёхугольник
  ctx.restore();	//Экран возвращается
}

function drawSprite(x, y, sprite, angle, width, height) {
  ctx.save();
  ctx.translate(x, y);

  ctx.rotate(-angle);
  ctx.imageSmoothingEnabled = false;
  let compWidth = width || sprite.width * SPRITE_SCALE;
  let compHeight = height || sprite.height * SPRITE_SCALE;
  ctx.drawImage(sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
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

function drawCircle(x, y, radius, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(Math.round(x), y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function playSound(sound, volume = 1, loop = false) {
  let newSound = new Audio(sound.src);
  newSound.volume = volume;
  newSound.loop = loop;
  newSound.oncanplay = () => {
    newSound.play();
  };
  return newSound;
}

function resourceLoaded(src) {
  resourcesLoadedCount++;

  // console.log('loaded', src);
  if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
    canBeginGame = true;
  }
}
