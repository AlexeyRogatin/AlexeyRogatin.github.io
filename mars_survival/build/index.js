System.register("resources", [], function (exports_1, context_1) {
    "use strict";
    var SCREEN_RATIO, canvas, ctx, backBuffer, backCtx, camera, resourcesLoadedCount, resourcesWaitingForLoadCount, canBeginGame, Layer, DrawQueueType, DrawQueueItem, sounds, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera, imgEarth1, imgEarth2, imgEarth3, imgGeyser, imgMountain, imgLava1, imgLava2, imgIron1, imgIron2, imgIron3, imgIron4, imgIron5, imgIronItem, imgArrow, imgCrafts, imgArrow1, imgMelter, imgIronIngot, imgAurit1, imgAurit2, imgAurit3, imgAurit4, imgAurit5, imgAuritItem, imgAuritIngot, imgCrystal1, imgCrystal2, imgCrystal3, imgCrystal4, imgCrystal5, imgCrystalItem, imgSplitter, imgToolkit, imgSunBatteryAdd, imgSunBatteryItem, imgSunBattery, imgSilicon1, imgSilicon2, imgSilicon3, imgSilicon4, imgSilicon5, imgSiliconItem, imgVolcano, imgMagmaBall, imgStorage, imgGoldenCamera, imgExtraSlot, imgExtraSlotItem, imgAlert, imgShockProofBody, imgMeteorite, imgIgneous, imgIgneousItem, imgIgneousIngot, imgMeteoriteStuff, imgBoss, imgArrow2, imgManipulator, imgMechanicalHand, imgEnergy, imgHp, imgBossReadyToAttack, imgBossReadyToAttack1, imgBossAttack, imgBossAttack1, imgLazer, imgLazer1, imgEdge1, imgEdge2_1, imgEdge2_2, imgEdge2_3, imgEdge3, imgEdge4, imgSide1, imgMenu, imgTime, imgDesk, imgBossHp, imgKnowledgeOfBallistics, imgShakingDetector, sndMining, sndGeyser, sndVolcanoBoom, sndBoom, sndParadox, sndDysonSphere;
    var __moduleName = context_1 && context_1.id;
    function handleResize() {
        var rect = canvas.getBoundingClientRect();
        var width = rect.width;
        var height = width / SCREEN_RATIO;
        canvas.width = width;
        canvas.height = height;
        backBuffer.width = width;
        backBuffer.height = height;
    }
    exports_1("handleResize", handleResize);
    function resourceLoaded(src) {
        exports_1("resourcesLoadedCount", ++resourcesLoadedCount) - 1;
        if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
            exports_1("canBeginGame", canBeginGame = true);
        }
    }
    function loadImage(src) {
        var img = new Image();
        img.src = src;
        exports_1("resourcesWaitingForLoadCount", ++resourcesWaitingForLoadCount) - 1;
        img.onload = function () { return resourceLoaded(src); };
        return img;
    }
    exports_1("loadImage", loadImage);
    function loadSound(src) {
        var sound = new Audio();
        sound.src = src;
        exports_1("resourcesWaitingForLoadCount", ++resourcesWaitingForLoadCount) - 1;
        sound.oncanplay = function () { return resourceLoaded(src); };
        return sound;
    }
    exports_1("loadSound", loadSound);
    function playSound(sound, volume, loop) {
        if (volume === void 0) { volume = 1; }
        if (loop === void 0) { loop = false; }
        var newSound = new Audio(sound.src);
        newSound.volume = volume;
        newSound.loop = loop;
        newSound.oncanplay = function () {
            newSound.play();
        };
        return newSound;
    }
    exports_1("playSound", playSound);
    function renderItem(item) {
        switch (item.type) {
            case DrawQueueType.IMAGE:
                {
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    ctx.rotate(item.angle);
                    var compWidth = item.width || item.sprite.width;
                    var compHeight = item.height || item.sprite.height;
                    if (!item.fromThePoint) {
                        ctx.drawImage(item.sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
                    }
                    else {
                        ctx.drawImage(item.sprite, -compWidth, -compHeight / 2, compWidth, compHeight);
                    }
                    ctx.restore();
                }
                break;
            case DrawQueueType.RECT:
                {
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    ctx.rotate(-item.angle);
                    if (item.outlineOnly > 0) {
                        ctx.strokeStyle = item.color[0];
                        ctx.lineWidth = item.outlineOnly;
                        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
                    }
                    else {
                        ctx.fillStyle = item.color[0];
                        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
                    }
                    ctx.restore();
                }
                break;
            case DrawQueueType.CIRCLE:
                {
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                    if (item.outlineOnly > 0) {
                        ctx.strokeStyle = item.color[0];
                        ctx.lineWidth = item.outlineOnly;
                        ctx.stroke();
                    }
                    else {
                        ctx.fillStyle = item.color[0];
                        ctx.fill();
                    }
                }
                break;
            case DrawQueueType.TEXT:
                {
                    ctx.save();
                    ctx.fillStyle = item.color[0];
                    ctx.font = item.textSize + "px Arial";
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = item.textAlign;
                    ctx.fillText(item.text, item.x, item.y);
                    ctx.restore();
                }
                break;
            case DrawQueueType.LINEAR_GRADIENT:
                {
                    ctx.save();
                    var x1 = item.x - item.width / 2;
                    var x2 = item.x + item.width / 2;
                    var y1 = item.y - item.height / 2;
                    var y2 = item.y - item.height / 2;
                    var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    for (var colorIndex = 0; colorIndex < item.color.length; colorIndex++) {
                        gradient.addColorStop(item.stop[colorIndex], item.color[colorIndex]);
                    }
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x1, y1, item.width, item.height);
                    ctx.restore();
                }
                break;
            default: console.assert(false);
        }
    }
    exports_1("renderItem", renderItem);
    return {
        setters: [],
        execute: function () {
            exports_1("SCREEN_RATIO", SCREEN_RATIO = 1920 / 980);
            exports_1("canvas", canvas = document.getElementById("canvas"));
            exports_1("ctx", ctx = canvas.getContext("2d"));
            exports_1("backBuffer", backBuffer = document.createElement('canvas'));
            exports_1("backCtx", backCtx = backBuffer.getContext('2d'));
            exports_1("camera", camera = {
                x: 0,
                y: 0,
                width: innerWidth,
                height: innerHeight,
                angle: 0
            });
            camera.width = 1920;
            camera.height = camera.width / SCREEN_RATIO;
            handleResize();
            window.addEventListener('resize', handleResize);
            exports_1("resourcesLoadedCount", resourcesLoadedCount = 0);
            exports_1("resourcesWaitingForLoadCount", resourcesWaitingForLoadCount = 0);
            exports_1("canBeginGame", canBeginGame = false);
            exports_1("Layer", Layer = {
                UI: 1000000000,
                FORGROUND: 100000000,
                BOSS: 130,
                BOSS_LEG: 120,
                MANIPULATOR: 110,
                PARTICLES: 105,
                UPPER_TILE: 100,
                PLAYER: 50,
                ON_TILE: 1,
                TILE: 0,
                NONE: -100000
            });
            (function (DrawQueueType) {
                DrawQueueType[DrawQueueType["NONE"] = 0] = "NONE";
                DrawQueueType[DrawQueueType["IMAGE"] = 1] = "IMAGE";
                DrawQueueType[DrawQueueType["RECT"] = 2] = "RECT";
                DrawQueueType[DrawQueueType["CIRCLE"] = 3] = "CIRCLE";
                DrawQueueType[DrawQueueType["TEXT"] = 4] = "TEXT";
                DrawQueueType[DrawQueueType["LINEAR_GRADIENT"] = 5] = "LINEAR_GRADIENT";
            })(DrawQueueType || (DrawQueueType = {}));
            exports_1("DrawQueueType", DrawQueueType);
            DrawQueueItem = (function () {
                function DrawQueueItem() {
                    this.type = DrawQueueType.NONE;
                    this.z = 0;
                    this.width = 0;
                    this.height = 0;
                    this.angle = 0;
                    this.color = ['white', 'black'];
                    this.stop = [0, 1];
                    this.sprite = null;
                    this.radius = 0;
                    this.text = '';
                    this.textSize = 60;
                    this.outlineOnly = 0;
                    this.fromThePoint = false;
                    this.drawFromThePoint = false;
                }
                return DrawQueueItem;
            }());
            exports_1("DrawQueueItem", DrawQueueItem);
            sounds = [];
            exports_1("imgPlayer", imgPlayer = loadImage('../sprites/player_body.png'));
            exports_1("imgNone", imgNone = loadImage('../sprites/none.png'));
            exports_1("imgWheel1", imgWheel1 = loadImage('../sprites/weel1.png'));
            exports_1("imgWheel2", imgWheel2 = loadImage('../sprites/weel2.png'));
            exports_1("imgWheel3", imgWheel3 = loadImage('../sprites/weel3.png'));
            exports_1("imgWheel4", imgWheel4 = loadImage('../sprites/weel4.png'));
            exports_1("imgWheel5", imgWheel5 = loadImage('../sprites/weel5.png'));
            exports_1("imgWheel6", imgWheel6 = loadImage('../sprites/weel6.png'));
            exports_1("imgCamera", imgCamera = loadImage('../sprites/camera.png'));
            exports_1("imgEarth1", imgEarth1 = loadImage('../sprites/earth1.png'));
            exports_1("imgEarth2", imgEarth2 = loadImage('../sprites/sasha/earth2.png'));
            exports_1("imgEarth3", imgEarth3 = loadImage('../sprites/sasha/earth3.png'));
            exports_1("imgGeyser", imgGeyser = loadImage('../sprites/geyser.png'));
            exports_1("imgMountain", imgMountain = loadImage('../sprites/sasha/newMountain.png'));
            exports_1("imgLava1", imgLava1 = loadImage('../sprites/sasha/lava1.jpg'));
            exports_1("imgLava2", imgLava2 = loadImage('../sprites/sasha/lava2.jpg'));
            exports_1("imgIron1", imgIron1 = loadImage('../sprites/iron1.png'));
            exports_1("imgIron2", imgIron2 = loadImage('../sprites/iron2.png'));
            exports_1("imgIron3", imgIron3 = loadImage('../sprites/iron3.png'));
            exports_1("imgIron4", imgIron4 = loadImage('../sprites/iron4.png'));
            exports_1("imgIron5", imgIron5 = loadImage('../sprites/iron5.png'));
            exports_1("imgIronItem", imgIronItem = loadImage('../sprites/ironItem.png'));
            exports_1("imgArrow", imgArrow = loadImage('../sprites/arrow.png'));
            exports_1("imgCrafts", imgCrafts = loadImage('../sprites/crafts.png'));
            exports_1("imgArrow1", imgArrow1 = loadImage('../sprites/arrow1.png'));
            exports_1("imgMelter", imgMelter = loadImage('../sprites/melter.png'));
            exports_1("imgIronIngot", imgIronIngot = loadImage('../sprites/ironIngotItem.png'));
            exports_1("imgAurit1", imgAurit1 = loadImage('../sprites/gold1.png'));
            exports_1("imgAurit2", imgAurit2 = loadImage('../sprites/gold2.png'));
            exports_1("imgAurit3", imgAurit3 = loadImage('../sprites/gold3.png'));
            exports_1("imgAurit4", imgAurit4 = loadImage('../sprites/gold4.png'));
            exports_1("imgAurit5", imgAurit5 = loadImage('../sprites/gold5.png'));
            exports_1("imgAuritItem", imgAuritItem = loadImage('../sprites/goldItem.png'));
            exports_1("imgAuritIngot", imgAuritIngot = loadImage('../sprites/goldIngotItem.png'));
            exports_1("imgCrystal1", imgCrystal1 = loadImage('../sprites/crystal1.png'));
            exports_1("imgCrystal2", imgCrystal2 = loadImage('../sprites/crystal2.png'));
            exports_1("imgCrystal3", imgCrystal3 = loadImage('../sprites/crystal3.png'));
            exports_1("imgCrystal4", imgCrystal4 = loadImage('../sprites/crystal4.png'));
            exports_1("imgCrystal5", imgCrystal5 = loadImage('../sprites/crystal5.png'));
            exports_1("imgCrystalItem", imgCrystalItem = loadImage('../sprites/crystalItem.png'));
            exports_1("imgSplitter", imgSplitter = loadImage('../sprites/splitter.png'));
            exports_1("imgToolkit", imgToolkit = loadImage('../sprites/toolkit.png'));
            exports_1("imgSunBatteryAdd", imgSunBatteryAdd = loadImage('../sprites/sun_battery.png'));
            exports_1("imgSunBatteryItem", imgSunBatteryItem = loadImage('../sprites/sun_batteryItem.png'));
            exports_1("imgSunBattery", imgSunBattery = loadImage('../sprites/sunBattery.png'));
            exports_1("imgSilicon1", imgSilicon1 = loadImage('../sprites/silicon1.png'));
            exports_1("imgSilicon2", imgSilicon2 = loadImage('../sprites/silicon2.png'));
            exports_1("imgSilicon3", imgSilicon3 = loadImage('../sprites/silicon3.png'));
            exports_1("imgSilicon4", imgSilicon4 = loadImage('../sprites/silicon4.png'));
            exports_1("imgSilicon5", imgSilicon5 = loadImage('../sprites/silicon5.png'));
            exports_1("imgSiliconItem", imgSiliconItem = loadImage('../sprites/siliconItem.png'));
            exports_1("imgVolcano", imgVolcano = loadImage('../sprites/sasha/volcano.png'));
            exports_1("imgMagmaBall", imgMagmaBall = loadImage('../sprites/magmaBall.png'));
            exports_1("imgStorage", imgStorage = loadImage('../sprites/storage.png'));
            exports_1("imgGoldenCamera", imgGoldenCamera = loadImage('../sprites/cameraGold.png'));
            exports_1("imgExtraSlot", imgExtraSlot = loadImage('../sprites/extraSlot.png'));
            exports_1("imgExtraSlotItem", imgExtraSlotItem = loadImage('../sprites/extraSlotItem.png'));
            exports_1("imgAlert", imgAlert = loadImage('../sprites/alert.png'));
            exports_1("imgShockProofBody", imgShockProofBody = loadImage('../sprites/shockproof_body.png'));
            exports_1("imgMeteorite", imgMeteorite = loadImage('../sprites/meteorite.png'));
            exports_1("imgIgneous", imgIgneous = loadImage('../sprites/igneous.png'));
            exports_1("imgIgneousItem", imgIgneousItem = loadImage('../sprites/igneousItem.png'));
            exports_1("imgIgneousIngot", imgIgneousIngot = loadImage('../sprites/igneousIngot.png'));
            exports_1("imgMeteoriteStuff", imgMeteoriteStuff = loadImage('../sprites/meteoriteStuff.png'));
            exports_1("imgBoss", imgBoss = loadImage('../sprites/boss.png'));
            exports_1("imgArrow2", imgArrow2 = loadImage('../sprites/arrow2.png'));
            exports_1("imgManipulator", imgManipulator = loadImage('../sprites/manipulator.png'));
            exports_1("imgMechanicalHand", imgMechanicalHand = loadImage('../sprites/mechanicalHand.png'));
            exports_1("imgEnergy", imgEnergy = loadImage('../sprites/energy.png'));
            exports_1("imgHp", imgHp = loadImage('../sprites/hp.png'));
            exports_1("imgBossReadyToAttack", imgBossReadyToAttack = loadImage('../sprites/bossReadyToAttack.png'));
            exports_1("imgBossReadyToAttack1", imgBossReadyToAttack1 = loadImage('../sprites/bossReadyToAttack1.png'));
            exports_1("imgBossAttack", imgBossAttack = loadImage('../sprites/bossAttack.png'));
            exports_1("imgBossAttack1", imgBossAttack1 = loadImage('../sprites/bossAttack1.png'));
            exports_1("imgLazer", imgLazer = loadImage('../sprites/lazer.png'));
            exports_1("imgLazer1", imgLazer1 = loadImage('../sprites/lazer1.png'));
            exports_1("imgEdge1", imgEdge1 = loadImage('../sprites/edge1.png'));
            exports_1("imgEdge2_1", imgEdge2_1 = loadImage('../sprites/edge2_1.png'));
            exports_1("imgEdge2_2", imgEdge2_2 = loadImage('../sprites/edge2_2.png'));
            exports_1("imgEdge2_3", imgEdge2_3 = loadImage('../sprites/edge2_3.png'));
            exports_1("imgEdge3", imgEdge3 = loadImage('../sprites/edge3.png'));
            exports_1("imgEdge4", imgEdge4 = loadImage('../sprites/edge4.png'));
            exports_1("imgSide1", imgSide1 = loadImage('../sprites/side1.png'));
            exports_1("imgMenu", imgMenu = loadImage('../sprites/menu.jpg'));
            exports_1("imgTime", imgTime = loadImage('../sprites/timeAndCoords.png'));
            exports_1("imgDesk", imgDesk = loadImage('../sprites/desk.png'));
            exports_1("imgBossHp", imgBossHp = loadImage('../sprites/bossHp.png'));
            exports_1("imgKnowledgeOfBallistics", imgKnowledgeOfBallistics = loadImage('../sprites/knowledgeOfBallistics.png'));
            exports_1("imgShakingDetector", imgShakingDetector = loadImage('../sprites/shakingDetector.png'));
            exports_1("sndMining", sndMining = loadSound('../sounds/mining.mp3'));
            exports_1("sndGeyser", sndGeyser = loadSound('../sounds/geyser.mp3'));
            exports_1("sndVolcanoBoom", sndVolcanoBoom = loadSound('../sounds/volcanoBoom.mp3'));
            exports_1("sndBoom", sndBoom = loadSound('../sounds/boom.mp3'));
            exports_1("sndParadox", sndParadox = loadSound('../sounds/Petos Paradox.mp3'));
            exports_1("sndDysonSphere", sndDysonSphere = loadSound('../sounds/Dyson Sphere.mp3'));
        }
    };
});
System.register("controls", ["resources"], function (exports_2, context_2) {
    "use strict";
    var resources_1, mouseX, mouseY, KeyCode, Key, Mouse, upKey, leftKey, downKey, rightKey, mouse, qKey, shiftKey, rKey, escKey, key1, key2, key3, key4, key5, key6;
    var __moduleName = context_2 && context_2.id;
    function handleKeyDown(event, keyCode, key) {
        if (keyCode === event.keyCode) {
            if (!key.isDown) {
                key.wentDown = true;
                key.isDown = true;
            }
        }
    }
    function handleKeyUp(event, keyCode, key) {
        if (keyCode === event.keyCode) {
            if (key.isDown) {
                key.wentUp = true;
                key.isDown = false;
            }
        }
    }
    function clearKey(key) {
        key.wentDown = false;
        key.wentUp = false;
    }
    function clearAllKeys() {
        clearKey(leftKey);
        clearKey(downKey);
        clearKey(upKey);
        clearKey(rightKey);
        clearKey(qKey);
        clearKey(shiftKey);
        clearKey(rKey);
        clearKey(escKey);
        clearKey(key1);
        clearKey(key2);
        clearKey(key3);
        clearKey(key4);
        clearKey(key5);
        clearKey(key6);
        mouse.wentUp = false;
        mouse.wentDown = false;
    }
    exports_2("clearAllKeys", clearAllKeys);
    return {
        setters: [
            function (resources_1_1) {
                resources_1 = resources_1_1;
            }
        ],
        execute: function () {
            exports_2("mouseX", mouseX = 0);
            exports_2("mouseY", mouseY = 0);
            (function (KeyCode) {
                KeyCode[KeyCode["RIGHT"] = 68] = "RIGHT";
                KeyCode[KeyCode["LEFT"] = 65] = "LEFT";
                KeyCode[KeyCode["DOWN"] = 83] = "DOWN";
                KeyCode[KeyCode["UP"] = 87] = "UP";
                KeyCode[KeyCode["Q"] = 81] = "Q";
                KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
                KeyCode[KeyCode["R"] = 82] = "R";
                KeyCode[KeyCode["ESC"] = 27] = "ESC";
                KeyCode[KeyCode["KEY_1"] = 49] = "KEY_1";
                KeyCode[KeyCode["KEY_2"] = 50] = "KEY_2";
                KeyCode[KeyCode["KEY_3"] = 51] = "KEY_3";
                KeyCode[KeyCode["KEY_4"] = 52] = "KEY_4";
                KeyCode[KeyCode["KEY_5"] = 53] = "KEY_5";
                KeyCode[KeyCode["KEY_6"] = 54] = "KEY_6";
            })(KeyCode || (KeyCode = {}));
            exports_2("KeyCode", KeyCode);
            Key = (function () {
                function Key() {
                    this.isDown = false;
                    this.wentDown = false;
                    this.wentUp = false;
                }
                return Key;
            }());
            exports_2("Key", Key);
            Mouse = (function () {
                function Mouse() {
                }
                return Mouse;
            }());
            exports_2("Mouse", Mouse);
            exports_2("upKey", upKey = new Key());
            exports_2("leftKey", leftKey = new Key());
            exports_2("downKey", downKey = new Key());
            exports_2("rightKey", rightKey = new Key());
            exports_2("mouse", mouse = new Mouse());
            exports_2("qKey", qKey = new Key());
            exports_2("shiftKey", shiftKey = new Key());
            exports_2("rKey", rKey = new Key());
            exports_2("escKey", escKey = new Key());
            exports_2("key1", key1 = new Key());
            exports_2("key2", key2 = new Key());
            exports_2("key3", key3 = new Key());
            exports_2("key4", key4 = new Key());
            exports_2("key5", key5 = new Key());
            exports_2("key6", key6 = new Key());
            window.onkeydown = function onkeydown(event) {
                handleKeyDown(event, KeyCode.UP, upKey);
                handleKeyDown(event, KeyCode.DOWN, downKey);
                handleKeyDown(event, KeyCode.LEFT, leftKey);
                handleKeyDown(event, KeyCode.RIGHT, rightKey);
                handleKeyDown(event, KeyCode.Q, qKey);
                handleKeyDown(event, KeyCode.SHIFT, shiftKey);
                handleKeyDown(event, KeyCode.R, rKey);
                handleKeyDown(event, KeyCode.ESC, escKey);
                handleKeyDown(event, KeyCode.KEY_1, key1);
                handleKeyDown(event, KeyCode.KEY_2, key2);
                handleKeyDown(event, KeyCode.KEY_3, key3);
                handleKeyDown(event, KeyCode.KEY_4, key4);
                handleKeyDown(event, KeyCode.KEY_5, key5);
                handleKeyDown(event, KeyCode.KEY_6, key6);
            };
            window.onkeyup = function onkeyup(event) {
                handleKeyUp(event, KeyCode.UP, upKey);
                handleKeyUp(event, KeyCode.DOWN, downKey);
                handleKeyUp(event, KeyCode.LEFT, leftKey);
                handleKeyUp(event, KeyCode.RIGHT, rightKey);
                handleKeyUp(event, KeyCode.Q, qKey);
                handleKeyUp(event, KeyCode.SHIFT, shiftKey);
                handleKeyUp(event, KeyCode.R, rKey);
                handleKeyUp(event, KeyCode.ESC, escKey);
                handleKeyUp(event, KeyCode.KEY_1, key1);
                handleKeyUp(event, KeyCode.KEY_2, key2);
                handleKeyUp(event, KeyCode.KEY_3, key3);
                handleKeyUp(event, KeyCode.KEY_4, key4);
                handleKeyUp(event, KeyCode.KEY_5, key5);
                handleKeyUp(event, KeyCode.KEY_6, key6);
            };
            window.onmousemove = function onmousemove(event) {
                var rect = resources_1.canvas.getBoundingClientRect();
                var scale = resources_1.canvas.width / resources_1.camera.width;
                mouse.x = (event.clientX - rect.left) / scale;
                mouse.y = (event.clientY - rect.top) / scale;
            };
            window.onmousedown = function onmousedown(event) {
                if (!mouse.isDown) {
                    mouse.isDown = true;
                    mouse.wentDown = true;
                }
            };
            window.onmouseup = function onmouseup(event) {
                if (mouse.isDown) {
                    mouse.isDown = false;
                    mouse.wentUp = true;
                }
            };
        }
    };
});
System.register("index", ["controls", "resources"], function (exports_3, context_3) {
    "use strict";
    var controls_1, resources_2, InventorySlot, TileLayer, Tile, RecipePart, Recipe, GameObject, particle, Text, GameObjectType, GameState, TileType, Item, Event, TILE, MORNING_LENGTH, DAY_LENGTH, AFTERNOON_LENGTH, NIGHT_LENGTH, ONE_DAY, EVENT_LENGTH, VOLCANO_RADIUS, GRAVITATION, CAMERA_HEIGHT, MAGMA_BALL_SPEED, METEORITE_SPEED, LAVA_BALL_SPEED, METEOR_STUFF_COOLDOWN, MAX_RANGE, STORAGE_SLOT_COUNT, STRIPE_WIDTH, STRIPE_HEIGHT, CHUNK_PROTOTYPES, RECIPES, GAME_LENGTH, timers, map, slotCount, inventory, drawQueue, alpha, gameObjects, particles, globalPlayer, screenShakes, craftMode, firstRecipeIndex, mainSlot, controlledStorage, dayTimer, gameTimer, event, timeBetweenEvents, eventEnd, hpShakeTimer, globalBoss, recentShake, gameState, menuTexts, MORNING_TIME, DAY_TIME, AFTERNOON_TIME, NIGHT_TIME, playText, controlsText, instructions, musik;
    var __moduleName = context_3 && context_3.id;
    function restate() {
        gameObjects = [];
        particles = [];
        map = [];
        timers = [];
        menuTexts = [];
        slotCount = 5;
        for (var itemIndex = 0; itemIndex < inventory.length; itemIndex++) {
            inventory[itemIndex] = { item: Item.NONE, count: 0, cooldown: 0 };
        }
        craftMode = false;
        firstRecipeIndex = 0;
        mainSlot = 0;
        controlledStorage = null;
        screenShakes = [{ strength: 0, duration: addTimer(0) }];
        dayTimer = addTimer(ONE_DAY);
        gameTimer = addTimer(GAME_LENGTH);
        event = Event.NONE;
        timeBetweenEvents = GAME_LENGTH / 4;
        eventEnd = GAME_LENGTH;
        hpShakeTimer = addTimer(0);
        globalBoss = null;
        recentShake = { strength: 0, duration: addTimer(0) };
        globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);
    }
    function getIndexFromCoords(x, y) {
        var result = y * TILE.chunkSizeX * TILE.chunkCountX + x;
        if (x > TILE.chunkCountX * TILE.chunkSizeX || y > TILE.chunkCountY * TILE.chunkSizeY || x < 0 || y < 0) {
            result = -100;
        }
        return (result);
    }
    function getTileUnderMouse() {
        var _a = pixelsToTiles(controls_1.mouse.worldX, controls_1.mouse.worldY), x = _a[0], y = _a[1];
        var tile = map[getIndexFromCoords(x, y)];
        return (tile);
    }
    function tilesToPixels(x, y) {
        var result = [x * TILE.width, y * TILE.height];
        return result;
    }
    function pixelsToTiles(x, y) {
        var result = [Math.round(x / TILE.width), Math.round(y / TILE.height)];
        return result;
    }
    function addItem(item, count) {
        var resultSlot = getInventorySlotWithItem(item);
        if (!resultSlot) {
            for (var slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
                var slot = inventory[slotIndex];
                if (slot.item === Item.NONE) {
                    resultSlot = slot;
                    break;
                }
            }
        }
        resultSlot.item = item;
        resultSlot.count += count;
    }
    function addItemToStorage(item, count, tile) {
        var resultSlot = getStorageSlotWithItem(item, tile);
        if (!resultSlot) {
            for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                var slot = tile.inventory[slotIndex];
                if (slot.item === Item.NONE) {
                    resultSlot = slot;
                    break;
                }
            }
        }
        resultSlot.item = item;
        resultSlot.count += count;
    }
    function removeItem(item, count) {
        var slot = getInventorySlotWithItem(item);
        console.assert(slot.count >= count, 'В инвентаре слишком мало этого предмета');
        slot.count -= count;
        if (slot.count === 0) {
            slot.item = Item.NONE;
        }
    }
    function removeItemFromStorage(item, count, tile) {
        var slot = getStorageSlotWithItem(item, tile);
        console.assert(slot.count >= count, 'В храгилище слишком мало этого предмета');
        slot.count -= count;
        if (slot.count === 0) {
            slot.item = Item.NONE;
        }
    }
    function getInventorySlotIndexWithItem(item) {
        var result = -1;
        for (var slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
            var slot = inventory[slotIndex];
            if (slot.item === item) {
                result = slotIndex;
                break;
            }
        }
        return result;
    }
    function getInventorySlotWithItem(item) {
        var index = getInventorySlotIndexWithItem(item);
        var result = null;
        if (index >= 0) {
            result = inventory[index];
        }
        return result;
    }
    function getStorageSlotIndexWithItem(item, tile) {
        var result = -1;
        for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
            var slot = tile.inventory[slotIndex];
            if (slot.item === item) {
                result = slotIndex;
                break;
            }
        }
        return result;
    }
    function getStorageSlotWithItem(item, tile) {
        var index = getStorageSlotIndexWithItem(item, tile);
        var result = null;
        if (index >= 0) {
            result = tile.inventory[index];
        }
        return result;
    }
    function isInventoryFullForItem(result) {
        var inventoryFull = true;
        for (var inventoryIndex = 0; inventoryIndex < slotCount; inventoryIndex++) {
            if (inventory[inventoryIndex].item === Item.NONE || inventory[inventoryIndex].item === result) {
                inventoryFull = false;
            }
        }
        return (inventoryFull);
    }
    function isStoraggeFullForItem(result, tile) {
        var inventoryFull = true;
        for (var inventoryIndex = 0; inventoryIndex < STORAGE_SLOT_COUNT; inventoryIndex++) {
            if (tile.inventory[inventoryIndex].item === Item.NONE || tile.inventory[inventoryIndex].item === result) {
                inventoryFull = false;
            }
        }
        return (inventoryFull);
    }
    function craftRecipe(recipe) {
        var canCraft = !isInventoryFullForItem(recipe.result);
        for (var partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
            var part = recipe.parts[partIndex];
            var slot = getInventorySlotWithItem(part.item);
            if (!(slot && slot.count >= part.count)) {
                canCraft = false;
                break;
            }
            if (slot && slot.count === part.count) {
                canCraft = true;
            }
        }
        if (canCraft) {
            for (var partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
                var part = recipe.parts[partIndex];
                removeItem(part.item, part.count);
            }
            addItem(recipe.result, 1);
        }
    }
    function drawSprite(x, y, sprite, angle, width, height, fromThePoint, z) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (fromThePoint === void 0) { fromThePoint = false; }
        if (z === void 0) { z = resources_2.Layer.TILE; }
        var mainSide = width;
        if (height > width) {
            mainSide = height;
        }
        if (!fromThePoint) {
            if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - mainSide / 2 &&
                x < resources_2.camera.x + resources_2.camera.width * 0.5 + mainSide / 2 &&
                y > resources_2.camera.y - resources_2.camera.height * 0.5 - mainSide / 2 &&
                y < resources_2.camera.y + resources_2.camera.height * 0.5 + mainSide / 2) {
                drawQueue.push({ x: x, y: y, sprite: sprite, angle: angle, width: width, height: height, fromThePoint: fromThePoint, z: z, type: resources_2.DrawQueueType.IMAGE });
            }
        }
        else {
            if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - mainSide * 4 &&
                x < resources_2.camera.x + resources_2.camera.width * 0.5 + mainSide * 4 &&
                y > resources_2.camera.y - resources_2.camera.height * 0.5 - mainSide * 4 &&
                y < resources_2.camera.y + resources_2.camera.height * 0.5 + mainSide * 4) {
                drawQueue.push({ x: x, y: y, sprite: sprite, angle: angle, width: width, height: height, fromThePoint: fromThePoint, z: z, type: resources_2.DrawQueueType.IMAGE });
            }
        }
    }
    exports_3("drawSprite", drawSprite);
    function drawRect(x, y, width, height, angle, color, outlineOnly, z) {
        if (z === void 0) { z = resources_2.Layer.TILE; }
        if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - width / 2 &&
            x < resources_2.camera.x + resources_2.camera.width * 0.5 + width / 2 &&
            y > resources_2.camera.y - resources_2.camera.height * 0.5 - height / 2 &&
            y < resources_2.camera.y + resources_2.camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, width: width, height: height, color: [color], angle: angle, z: z, outlineOnly: outlineOnly, type: resources_2.DrawQueueType.RECT });
        }
    }
    exports_3("drawRect", drawRect);
    function drawCircle(x, y, radius, color, outlineOnly, z) {
        if (z === void 0) { z = resources_2.Layer.TILE; }
        if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - radius &&
            x < resources_2.camera.x + resources_2.camera.width * 0.5 + radius &&
            y > resources_2.camera.y - resources_2.camera.height * 0.5 - radius &&
            y < resources_2.camera.y + resources_2.camera.height * 0.5 + radius) {
            drawQueue.push({ x: x, y: y, radius: radius, color: [color], z: z, outlineOnly: outlineOnly, type: resources_2.DrawQueueType.CIRCLE });
        }
    }
    exports_3("drawCircle", drawCircle);
    function drawText(x, y, width, intervalsBettweenLines, color, text, textSize, textAlign, z) {
        if (z === void 0) { z = resources_2.Layer.UI; }
        if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - textSize / 2 &&
            x < resources_2.camera.x + resources_2.camera.width * 0.5 + textSize / 2 &&
            y > resources_2.camera.y - resources_2.camera.height * 0.5 - textSize / 2 &&
            y < resources_2.camera.y + resources_2.camera.height * 0.5 + textSize / 2) {
            if (width > 0 && resources_2.ctx.measureText(text).width > width) {
                var textNumber = -1;
                var words = text.split(' ');
                var wordNumber = 0;
                while (wordNumber < words.length) {
                    textNumber++;
                    var textSample = '';
                    while (resources_2.ctx.measureText(textSample).width + resources_2.ctx.measureText(words[wordNumber]).width < width && words[wordNumber] && words[wordNumber] !== '/') {
                        textSample += words[wordNumber] + ' ';
                        wordNumber++;
                    }
                    if (words[wordNumber] === '/') {
                        wordNumber++;
                    }
                    drawQueue.push({ x: x, y: y + textNumber * intervalsBettweenLines, color: [color], text: textSample, z: z, type: resources_2.DrawQueueType.TEXT, textSize: textSize, textAlign: textAlign });
                }
            }
            else {
                drawQueue.push({ x: x, y: y, color: [color], text: text, z: z, type: resources_2.DrawQueueType.TEXT, textSize: textSize, textAlign: textAlign });
            }
        }
    }
    exports_3("drawText", drawText);
    function drawLinearGradient(x, y, width, height, color, stop, z) {
        if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - width / 2 &&
            x < resources_2.camera.x + resources_2.camera.width * 0.5 + width / 2 &&
            y > resources_2.camera.y - resources_2.camera.height * 0.5 - height / 2 &&
            y < resources_2.camera.y + resources_2.camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, width: width, height: height, color: color, stop: stop, z: z, type: resources_2.DrawQueueType.LINEAR_GRADIENT });
        }
    }
    exports_3("drawLinearGradient", drawLinearGradient);
    function drawLight(x, y, radius) {
        alpha = 0;
        if (timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) {
            alpha = 1 - (MORNING_TIME - timers[dayTimer]) / (MORNING_TIME - DAY_TIME);
        }
        else if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
            alpha = 0;
        }
        else if (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME) {
            alpha = (AFTERNOON_TIME - timers[dayTimer]) / (AFTERNOON_TIME - NIGHT_TIME);
        }
        else if (timers[dayTimer] <= NIGHT_TIME) {
            alpha = 1;
        }
        var DECREASE_TIME = 360;
        var RADIUS_DECREASE = 30;
        if (timers[dayTimer] % DECREASE_TIME < DECREASE_TIME / 2) {
            radius = radius + (timers[dayTimer] % DECREASE_TIME) / DECREASE_TIME * RADIUS_DECREASE;
        }
        else {
            radius = radius + (DECREASE_TIME / 2 - timers[dayTimer] % (DECREASE_TIME / 2)) / DECREASE_TIME * RADIUS_DECREASE;
        }
        if (x > resources_2.camera.x - resources_2.camera.width * 0.5 - radius &&
            x < resources_2.camera.x + resources_2.camera.width * 0.5 + radius &&
            y > resources_2.camera.y - resources_2.camera.height * 0.5 - radius &&
            y < resources_2.camera.y + resources_2.camera.height * 0.5 + radius) {
            resources_2.backCtx.globalCompositeOperation = 'destination-out';
            var X = x - resources_2.camera.x + resources_2.camera.width / 2;
            var Y = y - resources_2.camera.y + resources_2.camera.height / 2;
            var gradient = resources_2.backCtx.createRadialGradient(X, Y, 0, X, Y, radius);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, 'transparent');
            resources_2.backCtx.fillStyle = gradient;
            resources_2.backCtx.fillRect(X - radius, Y - radius, 2 * radius, 2 * radius);
        }
    }
    exports_3("drawLight", drawLight);
    function addGameObject(type, x, y) {
        var gameObject = {
            type: type,
            x: x,
            y: y,
            firstX: x,
            firstY: y,
            neededX: null,
            neededY: null,
            width: 100,
            height: 100,
            angle: 0,
            color: 'grey',
            exists: true,
            speed: 0,
            speedX: 0,
            speedY: 0,
            speedLimit: 4,
            speedBackReduction: 0.4,
            friction: 0.95,
            accel: 0,
            accelConst: 0.04,
            rotationSpeed: 0.05,
            goForward: false,
            goBackward: false,
            goLeft: false,
            goRight: false,
            sprite: resources_2.imgNone,
            leftWeel: 0,
            rightWeel: 0,
            hitpoints: 0,
            maxHitpoints: 0,
            energy: 0,
            maxEnergy: 0,
            unhitableTimer: addTimer(0),
            doNotDraw: false,
            sunBateryLvl: 0,
            luckyCamera: false,
            shakingDetector: false,
            knowledgeOfBallistics: false,
            stuckable: false,
            lifeTime: 0,
            angleZ: 0,
            summoned: false,
            dontMoveWithCamera: false,
            specialTimer: null,
            attack: null
        };
        if (gameObject.type === GameObjectType.PLAYER) {
            gameObject.sprite = resources_2.imgPlayer;
            gameObject.hitpoints = 100;
            gameObject.maxHitpoints = 100;
            gameObject.energy = addTimer(10800);
            gameObject.maxEnergy = 10800;
            gameObject.stuckable = true;
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            gameObject.sprite = resources_2.imgMagmaBall;
            gameObject.angle = randomFloat(0, 2 * Math.PI);
            gameObject.angleZ = randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
        }
        if (gameObject.type === GameObjectType.METEORITE) {
            gameObject.sprite = resources_2.imgMeteorite;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.angleZ = -randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
            gameObject.width = 100 + CAMERA_HEIGHT;
            gameObject.height = 100 + CAMERA_HEIGHT;
        }
        if (gameObject.type === GameObjectType.LAVA_BALL) {
            gameObject.sprite = resources_2.imgMagmaBall;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.angleZ = randomFloat(0, 0.25 * Math.PI);
        }
        if (gameObject.type === GameObjectType.BOSS) {
            gameObject.sprite = resources_2.imgBoss;
            gameObject.width = 800;
            gameObject.height = 600;
            gameObject.speedLimit = 10;
            gameObject.rotationSpeed = 0.2;
            gameObject.accelConst = 0.05;
            gameObject.hitpoints = 5000;
            gameObject.maxHitpoints = 5000;
            gameObject.specialTimer = addTimer(100);
        }
        if (gameObject.type === GameObjectType.MANIPULATOR) {
            gameObject.firstX = gameObject.x - globalBoss.x;
            gameObject.firstY = gameObject.y - globalBoss.y;
            gameObject.sprite = resources_2.imgMechanicalHand;
            gameObject.width = 200;
            gameObject.height = 200;
            gameObject.speedLimit = globalBoss.speedLimit * 2;
        }
        if (gameObject.type === GameObjectType.NONE) {
            gameObject.exists = false;
        }
        var freeIndex = gameObjects.length;
        for (var gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
            var gameObject_1 = gameObjects[gameObjectIndex];
            if (!gameObject_1.exists) {
                freeIndex = gameObjectIndex;
                break;
            }
        }
        gameObjects[freeIndex] = gameObject;
        return gameObject;
    }
    function summonMeteorite(x, y) {
        var meteorite = addGameObject(GameObjectType.METEORITE, x, y);
        meteorite.summoned = true;
        meteorite.angleZ = -Math.PI * 0.5;
    }
    function controlGameObject(gameObject) {
        if (controls_1.upKey.isDown) {
            gameObject.goForward = true;
        }
        if (controls_1.downKey.isDown) {
            gameObject.goBackward = true;
        }
        if (controls_1.rightKey.isDown) {
            gameObject.goRight = true;
        }
        if (controls_1.leftKey.isDown) {
            gameObject.goLeft = true;
        }
    }
    function moveGameObject(gameObject) {
        gameObject.accel = 0;
        if (gameObject.goForward) {
            gameObject.accel = gameObject.accelConst;
        }
        else if (gameObject.goBackward) {
            gameObject.accel = -gameObject.accelConst;
        }
        else {
            gameObject.speed *= gameObject.friction;
        }
        if (gameObject.goLeft) {
            gameObject.angle -= gameObject.rotationSpeed;
        }
        if (gameObject.goRight) {
            gameObject.angle += gameObject.rotationSpeed;
        }
        gameObject.angle = normalizeAngle(gameObject.angle);
        gameObject.speed += gameObject.accel;
        if (gameObject.speed > gameObject.speedLimit) {
            gameObject.speed = gameObject.speedLimit;
        }
        if (gameObject.speed < -0.75 * gameObject.speedLimit) {
            gameObject.speed = -0.75 * gameObject.speedLimit;
        }
        gameObject.speedX = gameObject.speed * Math.cos(gameObject.angle);
        gameObject.speedY = gameObject.speed * Math.sin(gameObject.angle);
        var firstTile = { x: Math.round((gameObject.x - (TILE.width * 2.1 + gameObject.width)) / TILE.width), y: Math.round((gameObject.y - (TILE.width * 3 + gameObject.width)) / TILE.width) };
        var lastTile = { x: Math.round((gameObject.x + (TILE.width * 2.1 + gameObject.width)) / TILE.width), y: Math.round((gameObject.y + (TILE.width * 3 + gameObject.width)) / TILE.width) };
        for (var y = firstTile.y; y < lastTile.y; y++) {
            for (var x = firstTile.x; x < lastTile.x; x++) {
                var other = map[getIndexFromCoords(x, y)];
                if (other) {
                    var wallLeft = other.x * TILE.width - other.collisionWidth / 2;
                    var wallRight = other.x * TILE.width + other.collisionWidth / 2;
                    var wallTop = other.y * TILE.height - other.collisionHeight / 2;
                    var wallBottom = other.y * TILE.height + other.collisionHeight / 2;
                    var playerLeft = gameObject.x - gameObject.width / 2;
                    var playerRight = gameObject.x + gameObject.width / 2;
                    var playerTop = gameObject.y - gameObject.height / 2;
                    var playerBottom = gameObject.y + gameObject.height / 2;
                    if (gameObject.stuckable && (other.upperLayer.type === TileType.MOUNTAIN || other.baseLayer.type === TileType.VOLCANO ||
                        other.upperLayer.type === TileType.MELTER || other.upperLayer.type === TileType.SPLITTER ||
                        other.upperLayer.type === TileType.SUN_BATERY || other.upperLayer.type === TileType.STORAGE)) {
                        if (gameObject.speedX !== 0) {
                            var side = void 0;
                            var wallSide = void 0;
                            if (gameObject.speedX > 0) {
                                side = playerRight;
                                wallSide = wallLeft;
                            }
                            else {
                                side = playerLeft;
                                wallSide = wallRight;
                            }
                            if (!(playerRight + gameObject.speedX <= wallLeft ||
                                playerLeft + gameObject.speedX >= wallRight ||
                                playerTop >= wallBottom ||
                                playerBottom <= wallTop)) {
                                gameObject.speedX = 0;
                                gameObject.x -= side - wallSide;
                            }
                        }
                        if (gameObject.speedY !== 0) {
                            var side = void 0;
                            var wallSide = void 0;
                            if (gameObject.speedY > 0) {
                                side = playerBottom;
                                wallSide = wallTop;
                            }
                            else {
                                side = playerTop;
                                wallSide = wallBottom;
                            }
                            if (!(playerRight <= wallLeft ||
                                playerLeft >= wallRight ||
                                playerTop + gameObject.speedY >= wallBottom ||
                                playerBottom + gameObject.speedY <= wallTop)) {
                                debugger;
                                gameObject.speedY = 0;
                                gameObject.y -= side - wallSide;
                            }
                        }
                    }
                    globalPlayer.goForward = false;
                    globalPlayer.goBackward = false;
                    globalPlayer.goLeft = false;
                    globalPlayer.goRight = false;
                }
            }
        }
        gameObject.x += gameObject.speedX;
        gameObject.y += gameObject.speedY;
    }
    function randomFloat(firstNumber, lastNumber) {
        var randomFloat = firstNumber + (lastNumber - firstNumber) * Math.random();
        return (randomFloat);
    }
    function randomInt(firstNumber, lastNumber) {
        var randomInt = Math.round(randomFloat(firstNumber, lastNumber));
        return (randomInt);
    }
    function addTimer(timerLength) {
        var timerIndex = timers.length;
        timers.push(timerLength);
        return timerIndex;
    }
    function updateTimers() {
        for (var timerIndex = 0; timerIndex < timers.length; timerIndex++) {
            if (timers[timerIndex] > 0) {
                timers[timerIndex]--;
            }
        }
    }
    function rotateVector(x, y, angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var resultX = x * cos - y * sin;
        var resultY = -y * cos - x * sin;
        return [
            resultX,
            resultY,
        ];
    }
    function angleBetweenPoints(x1, y1, x2, y2) {
        var result = normalizeAngle(Math.atan2(y2 - y1, x2 - x1));
        return result;
    }
    function addParticle(x, y, color, speed, size, decrease, accel) {
        var randomAngle = randomFloat(0, Math.PI * 2);
        var randomSpeed = randomFloat(Math.abs(speed - 0.5), speed + 0.5);
        var _a = rotateVector(randomSpeed, 0, randomAngle), speedX = _a[0], speedY = _a[1];
        var randomRadius = randomInt(size - 3, size + 3);
        var _b = rotateVector(accel, 0, randomAngle), accelX = _b[0], accelY = _b[1];
        var randomSizeDecrease = randomFloat(Math.abs(decrease - 0.15), decrease + 0.15);
        var particle = {
            x: x,
            y: y,
            color: color,
            radius: randomRadius,
            speedX: speedX,
            speedY: speedY,
            accelX: accelX,
            accelY: accelY,
            sizeDecrease: randomSizeDecrease
        };
        particles.push(particle);
    }
    function burstParticles(_a) {
        var x = _a.x, y = _a.y, color = _a.color, speed = _a.speed, size = _a.size, count = _a.count, decrease = _a.decrease, accel = _a.accel;
        for (var particleIndex = 0; particleIndex < count; particleIndex++) {
            addParticle(x, y, color, speed, size, decrease, accel);
        }
    }
    function updateParticles() {
        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            var particle_1 = particles[particleIndex];
            if (particle_1.radius <= 0) {
                removeParticle(particleIndex);
            }
            else {
                drawCircle(particle_1.x, particle_1.y, particle_1.radius, particle_1.color, 0, resources_2.Layer.PARTICLES);
                if (particle_1.color === 'red' || particle_1.color === "rgb(254,0,0,1)") {
                    drawLight(particle_1.x, particle_1.y, particle_1.radius * 4);
                }
            }
            particle_1.radius -= particle_1.sizeDecrease;
            particle_1.x += particle_1.speedX;
            particle_1.y += particle_1.speedY;
            particle_1.speedX += particle_1.accelX;
            particle_1.speedY += particle_1.accelY;
            if ((particle_1.color === 'grey' || particle_1.color === 'yellow' ||
                particle_1.color === 'lightcoral' || particle_1.color === 'dimgray' ||
                particle_1.color === 'sienna') &&
                particle_1.radius < 15) {
                var particleAngle = angleBetweenPoints(particle_1.x, particle_1.y, globalPlayer.x, globalPlayer.y);
                var particleSpeed = rotateVector(6, 0, particleAngle);
                particle_1.accelX = 0;
                particle_1.accelY = 0;
                particle_1.x += particleSpeed[0] - particle_1.speedX;
                particle_1.y -= particleSpeed[1] + particle_1.speedY;
                if (distanceBetweenPoints(particle_1.x, particle_1.y, globalPlayer.x, globalPlayer.y) <= 5) {
                    removeParticle(particleIndex);
                }
            }
            if (particle_1.color === 'red') {
                if (globalPlayer.width / 2 + particle_1.radius >= distanceBetweenPoints(globalPlayer.x, globalPlayer.y, particle_1.x, particle_1.y) &&
                    timers[globalPlayer.unhitableTimer] <= 0) {
                    globalPlayer.hitpoints -= 25;
                    timers[globalPlayer.unhitableTimer] = 180;
                }
            }
        }
    }
    function removeParticle(particleIndex) {
        var lastParticle = particles[particles.length - 1];
        if (particles[particleIndex].color === 'grey') {
            addItem(Item.IRON, 1);
        }
        if (particles[particleIndex].color === 'yellow') {
            addItem(Item.AURIT, 1);
        }
        if (particles[particleIndex].color === 'lightcoral') {
            addItem(Item.CRYSTAL, 1);
        }
        if (particles[particleIndex].color === 'dimgray') {
            addItem(Item.SILIKON, 1);
        }
        if (particles[particleIndex].color === 'sienna') {
            addItem(Item.IGNEOUS, 1);
        }
        particles[particleIndex] = lastParticle;
        particles.pop();
    }
    function buildMap() {
        for (var chunkY = 0; chunkY < TILE.chunkCountY; chunkY++) {
            for (var chunkX = 0; chunkX < TILE.chunkCountX; chunkX++) {
                var protoIndex = randomInt(0, CHUNK_PROTOTYPES.length - 1);
                var proto = CHUNK_PROTOTYPES[protoIndex];
                console.assert(TILE.chunkSizeY === proto.length);
                console.assert(TILE.chunkSizeX === proto[0].length);
                for (var tileY = 0; tileY < proto.length; tileY++) {
                    var line = proto[tileY];
                    for (var tileX = 0; tileX < line.length; tileX++) {
                        var char = line[tileX];
                        var downTileType = null;
                        var upTileType = TileType.NONE;
                        var x = (chunkX * TILE.chunkSizeX + tileX);
                        var y = (chunkY * TILE.chunkSizeX + tileY);
                        var index = getIndexFromCoords(x, y);
                        map[index] = {
                            baseLayer: { type: downTileType, variant: 1 }, upperLayer: { type: upTileType, variant: 1 }, x: x, y: y, specialTimer: null, toughness: null,
                            firstToughness: null, oreCount: 5, inventory: [], width: TILE.width, height: TILE.height,
                            collisionWidth: TILE.width, collisionHeight: TILE.height, sound: null
                        };
                        if (char === '0') {
                            downTileType = TileType.NONE;
                        }
                        else if (char === ' ') {
                            var chance = randomInt(1, 8);
                            if (chance >= 1 && chance <= 6) {
                                map[index].baseLayer.variant = 1;
                            }
                            if (chance === 7) {
                                map[index].baseLayer.variant = 2;
                            }
                            if (chance === 8) {
                                map[index].baseLayer.variant = 3;
                            }
                            downTileType = TileType.EARTH;
                        }
                        else if (char === '#') {
                            downTileType = TileType.EARTH;
                            upTileType = TileType.MOUNTAIN;
                        }
                        else if (char === '@') {
                            downTileType = TileType.GEYSER;
                            map[index].specialTimer = addTimer(randomInt(500, 1400));
                        }
                        else if (char === '*') {
                            downTileType = TileType.VOLCANO;
                            map[index].width = TILE.width * 3;
                            map[index].height = TILE.height * 3;
                            map[index].collisionWidth = TILE.width * 2.1;
                            map[index].collisionHeight = TILE.height * 2.1;
                            map[index].specialTimer = addTimer(randomInt(50, 500));
                        }
                        else if (char === '!') {
                            downTileType = TileType.LAVA;
                            map[index].baseLayer.variant = randomInt(1, 2);
                        }
                        else if (char === 'F') {
                            downTileType = TileType.EARTH;
                            upTileType = TileType.IRON;
                            map[index].toughness = 999;
                            map[index].firstToughness = 999;
                        }
                        else if (char === 'A') {
                            downTileType = TileType.EARTH;
                            upTileType = TileType.AURIT;
                            map[index].toughness = 999;
                            map[index].firstToughness = 999;
                        }
                        else if (char === 'C') {
                            downTileType = TileType.EARTH;
                            upTileType = TileType.CRYSTAL;
                            map[index].toughness = 999;
                            map[index].firstToughness = 999;
                        }
                        else if (char = 'S') {
                            downTileType = TileType.EARTH;
                            upTileType = TileType.SILIKON;
                            map[index].toughness = 999;
                            map[index].firstToughness = 999;
                        }
                        map[index].baseLayer.type = downTileType;
                        map[index].upperLayer.type = upTileType;
                    }
                }
            }
        }
    }
    function screenToWorld(x, y) {
        var result = [
            x + resources_2.camera.x - resources_2.camera.width * 0.5,
            y + resources_2.camera.y - resources_2.camera.height * 0.5,
        ];
        return result;
    }
    exports_3("screenToWorld", screenToWorld);
    function worldToScreen(x, y) {
        var result = [
            x - resources_2.camera.x + resources_2.camera.width * 0.5,
            y - resources_2.camera.y + resources_2.camera.height * 0.5,
        ];
        return result;
    }
    exports_3("worldToScreen", worldToScreen);
    function distanceBetweenPoints(x1, y1, x2, y2) {
        var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return distance;
    }
    function moveToTile(mouseTile, gameObject) {
        var _a = tilesToPixels(mouseTile.x, mouseTile.y), x = _a[0], y = _a[1];
        var angle = angleBetweenPoints(gameObject.x, gameObject.y, x, y);
        if (gameObject.angle > angle) {
            while (gameObject.angle + Math.PI * 2 < angle || gameObject.angle - Math.PI * 1 >= angle) {
                angle += Math.PI * 2;
            }
        }
        if (gameObject.angle < angle) {
            while (gameObject.angle + Math.PI * 2 < angle || gameObject.angle - Math.PI * 1 >= angle) {
                angle -= Math.PI * 2;
            }
        }
        if (gameObject.angle + gameObject.rotationSpeed > angle && gameObject.angle < angle) {
            gameObject.angle = angle;
        }
        else if (gameObject.angle - gameObject.rotationSpeed < angle && gameObject.angle > angle) {
            gameObject.angle = angle;
        }
        else if (gameObject.angle > angle) {
            gameObject.goLeft = true;
        }
        else if (gameObject.angle < angle) {
            gameObject.goRight = true;
        }
        if (!(gameObject.x > x - (TILE.width / 2 + gameObject.width / 2) - 5 &&
            gameObject.x < x + (TILE.width / 2 + gameObject.width / 2) + 5 &&
            gameObject.y > y - (TILE.height / 2 + gameObject.width / 2) - 5 &&
            gameObject.y < y + (TILE.height / 2 + gameObject.width / 2 + 5))) {
            gameObject.goForward = true;
        }
    }
    function normalizeAngle(angle) {
        while (angle < -Math.PI) {
            angle += Math.PI * 2;
        }
        while (angle > Math.PI) {
            angle -= Math.PI * 2;
        }
        return angle;
    }
    function makeScreenShake(strength, duration) {
        for (var shakeIndex = 0; shakeIndex < screenShakes.length; shakeIndex++) {
            if (timers[screenShakes[shakeIndex].duration] <= 0 || screenShakes[shakeIndex].strength <= 0) {
                screenShakes[shakeIndex] = { strength: strength, duration: addTimer(duration) };
                break;
            }
            else if (shakeIndex === screenShakes.length - 1) {
                screenShakes.push({ strength: strength, duration: addTimer(duration) });
                break;
            }
        }
    }
    function updateTile(tileType, tile) {
        var upSprite = resources_2.imgNone;
        var downSprite = resources_2.imgNone;
        switch (tileType) {
            case TileType.GEYSER:
                {
                    downSprite = resources_2.imgGeyser;
                    var burstDuration = 250;
                    var geyserMinRecharge = 500;
                    var geyserMaxRecharge = 1500;
                    if (tile.upperLayer.type === TileType.NONE) {
                        if (timers[tile.specialTimer] === burstDuration) {
                            tile.sound = resources_2.playSound(resources_2.sndGeyser);
                        }
                        if (tile.sound) {
                            var maxDistance = resources_2.camera.width * 0.75;
                            var volume = void 0;
                            if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) <= maxDistance) {
                                volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) / maxDistance;
                            }
                            else {
                                volume = 0;
                            }
                            tile.sound.volume = volume * 0.5;
                        }
                        if (tile.x * TILE.width > resources_2.camera.x - resources_2.camera.width / 2 - tile.width / 2
                            && tile.x * TILE.width < resources_2.camera.x + resources_2.camera.width / 2 + tile.width / 2
                            && tile.y * TILE.height > resources_2.camera.y - resources_2.camera.height / 2 - tile.height / 2
                            && tile.y * TILE.height < resources_2.camera.y + resources_2.camera.height / 2 + tile.height / 2) {
                            if (globalPlayer.shakingDetector && timers[tile.specialTimer] < burstDuration + 50 && timers[tile.specialTimer] > burstDuration) {
                                drawSprite(tile.x * tile.width, tile.y * tile.height, resources_2.imgAlert, 0, tile.width, tile.height, false, resources_2.Layer.UPPER_TILE);
                            }
                            if (timers[tile.specialTimer] <= 0) {
                                timers[tile.specialTimer] = randomInt(geyserMinRecharge, geyserMaxRecharge);
                            }
                            if (timers[tile.specialTimer] > burstDuration && particles.length > 150) {
                                timers[tile.specialTimer]++;
                            }
                            if (timers[tile.specialTimer] <= burstDuration && timers[tile.specialTimer] % 2 === 0) {
                                var color = void 0;
                                if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) < 100 * globalPlayer.speedLimit) {
                                    color = 'red';
                                }
                                else {
                                    color = "rgb(254,0,0,1)";
                                }
                                burstParticles({
                                    x: tile.x * TILE.width,
                                    y: tile.y * TILE.height,
                                    color: color,
                                    speed: 5,
                                    size: 45,
                                    decrease: 1,
                                    accel: -0.05,
                                    count: 1
                                });
                            }
                        }
                        else {
                            if (timers[tile.specialTimer] > 300) {
                                timers[tile.specialTimer]++;
                            }
                        }
                    }
                }
                break;
            case TileType.EARTH:
                {
                    if (tile.baseLayer.variant === 1) {
                        downSprite = resources_2.imgEarth1;
                    }
                    else if (tile.baseLayer.variant === 2) {
                        downSprite = resources_2.imgEarth2;
                    }
                    else {
                        downSprite = resources_2.imgEarth3;
                    }
                }
                break;
            case TileType.LAVA:
                {
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, TILE.width * 1.2);
                    if (tile.baseLayer.variant === 1) {
                        downSprite = resources_2.imgLava1;
                    }
                    else {
                        downSprite = resources_2.imgLava2;
                    }
                    var rightTile = {
                        x: tile.x + 1,
                        y: tile.y,
                        isLava: false
                    };
                    var uprightTile = {
                        x: tile.x + 1,
                        y: tile.y - 1,
                        isLava: false
                    };
                    var upTile = {
                        x: tile.x,
                        y: tile.y - 1,
                        isLava: false
                    };
                    var upleftTile = {
                        x: tile.x - 1,
                        y: tile.y - 1,
                        isLava: false
                    };
                    var leftTile = {
                        x: tile.x - 1,
                        y: tile.y,
                        isLava: false
                    };
                    var downleftTile = {
                        x: tile.x - 1,
                        y: tile.y + 1,
                        isLava: false
                    };
                    var downTile = {
                        x: tile.x,
                        y: tile.y + 1,
                        isLava: false
                    };
                    var downrightTile = {
                        x: tile.x + 1,
                        y: tile.y + 1,
                        isLava: false
                    };
                    if (map[getIndexFromCoords(upTile.x, upTile.y)] && map[getIndexFromCoords(upTile.x, upTile.y)].baseLayer.type === TileType.LAVA) {
                        upTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(downTile.x, downTile.y)] && map[getIndexFromCoords(downTile.x, downTile.y)].baseLayer.type === TileType.LAVA) {
                        downTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(leftTile.x, leftTile.y)] && map[getIndexFromCoords(leftTile.x, leftTile.y)].baseLayer.type === TileType.LAVA) {
                        leftTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(rightTile.x, rightTile.y)] && map[getIndexFromCoords(rightTile.x, rightTile.y)].baseLayer.type === TileType.LAVA) {
                        rightTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(downrightTile.x, downrightTile.y)] && map[getIndexFromCoords(downrightTile.x, downrightTile.y)].baseLayer.type === TileType.LAVA) {
                        downrightTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(downleftTile.x, downleftTile.y)] && map[getIndexFromCoords(downleftTile.x, downleftTile.y)].baseLayer.type === TileType.LAVA) {
                        downleftTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(upleftTile.x, upleftTile.y)] && map[getIndexFromCoords(upleftTile.x, upleftTile.y)].baseLayer.type === TileType.LAVA) {
                        upleftTile.isLava = true;
                    }
                    if (map[getIndexFromCoords(uprightTile.x, uprightTile.y)] && map[getIndexFromCoords(uprightTile.x, uprightTile.y)].baseLayer.type === TileType.LAVA) {
                        uprightTile.isLava = true;
                    }
                    if (!upTile.isLava && !downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge4, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && !downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge3, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (upTile.isLava && !downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge3, -Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && !downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge3, Math.PI, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge3, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                        if (downrightTile.isLava) {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_1, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                        else {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_3, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                    }
                    if (!upTile.isLava && downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                        if (downleftTile.isLava) {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_1, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                        else {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_3, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                    }
                    if (upTile.isLava && !downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                        if (upleftTile.isLava) {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_1, Math.PI, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                        else {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_3, Math.PI, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                    }
                    if (upTile.isLava && !downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                        if (uprightTile.isLava) {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_1, Math.PI * 1.5, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                        else {
                            drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_3, Math.PI * 1.5, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                        }
                    }
                    if (upTile.isLava && downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_2, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && !downTile.isLava && leftTile.isLava && rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge2_2, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (upTile.isLava && downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge1, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (!upTile.isLava && downTile.isLava && leftTile.isLava && rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge1, -Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (upTile.isLava && downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge1, Math.PI, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (upTile.isLava && !downTile.isLava && leftTile.isLava && rightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgEdge1, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (rightTile.isLava && downTile.isLava &&
                        !downrightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgSide1, 0, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (leftTile.isLava && downTile.isLava &&
                        !downleftTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgSide1, Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (leftTile.isLava && upTile.isLava &&
                        !upleftTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgSide1, Math.PI, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                    if (rightTile.isLava && upTile.isLava &&
                        !uprightTile.isLava) {
                        drawSprite(tile.x * TILE.width, tile.y * TILE.height, resources_2.imgSide1, -Math.PI / 2, tile.width, tile.width, false, resources_2.Layer.ON_TILE);
                    }
                }
                break;
            case TileType.MELTER:
                {
                    upSprite = resources_2.imgMelter;
                    if (tile.inventory[1].count > 0) {
                        drawText(tile.x * TILE.width + 30, tile.y * TILE.height, 0, 0, 'blue', "" + tile.inventory[1].count, 30, 'center', resources_2.Layer.UI);
                        if (timers[tile.specialTimer] > 0) {
                            drawText(tile.x * TILE.width, tile.y * TILE.height, 0, 0, 'blue', "\u2192", 30, 'center', resources_2.Layer.UI);
                        }
                    }
                    if (timers[tile.specialTimer] > 0) {
                        drawText(tile.x * TILE.width - 30, tile.y * TILE.height, 0, 0, 'blue', "" + Math.ceil(timers[tile.specialTimer] / 60), 30, 'center', resources_2.Layer.UI);
                    }
                    if (tile.specialTimer && timers[tile.specialTimer] % 120 === 0) {
                        tile.inventory[1].count++;
                        if (tile.inventory[0].item === Item.IRON) {
                            tile.inventory[1].item = Item.IRON_INGOT;
                        }
                        if (tile.inventory[0].item === Item.AURIT) {
                            tile.inventory[1].item = Item.AURIT_INGOT;
                        }
                        if (tile.inventory[0].item === Item.IGNEOUS) {
                            tile.inventory[1].item = Item.IGNEOUS_INGOT;
                        }
                        tile.inventory[0].count--;
                        if (timers[tile.specialTimer] === 0) {
                            tile.specialTimer = null;
                        }
                    }
                    if (tile.inventory[0].count <= 0) {
                        tile.inventory[0].item = Item.NONE;
                    }
                    if (tile.inventory[1].count <= 0) {
                        tile.inventory[1].item = Item.NONE;
                    }
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SPLITTER:
                {
                    upSprite = resources_2.imgSplitter;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SUN_BATERY:
                {
                    upSprite = resources_2.imgSunBattery;
                }
                break;
            case TileType.IRON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        downSprite = resources_2.imgIron1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        downSprite = resources_2.imgIron2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        downSprite = resources_2.imgIron3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        downSprite = resources_2.imgIron4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        downSprite = resources_2.imgIron5;
                    }
                }
                break;
            case TileType.AURIT:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        downSprite = resources_2.imgAurit1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        downSprite = resources_2.imgAurit2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        downSprite = resources_2.imgAurit3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        downSprite = resources_2.imgAurit4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        downSprite = resources_2.imgAurit5;
                    }
                }
                break;
            case TileType.CRYSTAL:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        downSprite = resources_2.imgCrystal1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        downSprite = resources_2.imgCrystal2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        downSprite = resources_2.imgCrystal3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        downSprite = resources_2.imgCrystal4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        downSprite = resources_2.imgCrystal5;
                    }
                }
                break;
            case TileType.SILIKON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        downSprite = resources_2.imgSilicon1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        downSprite = resources_2.imgSilicon2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        downSprite = resources_2.imgSilicon3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        downSprite = resources_2.imgSilicon4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        downSprite = resources_2.imgSilicon5;
                    }
                }
                break;
            case TileType.IGNEOUS:
                {
                    downSprite = resources_2.imgIgneous;
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 1.2);
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) < 100 && timers[globalPlayer.unhitableTimer] <= 0) {
                        globalPlayer.hitpoints -= 0.2;
                    }
                }
                break;
            case TileType.MOUNTAIN:
                {
                    upSprite = resources_2.imgMountain;
                }
                break;
            case TileType.VOLCANO:
                {
                    downSprite = resources_2.imgVolcano;
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 0.6);
                    if (timers[tile.specialTimer] === 40) {
                        tile.sound = resources_2.playSound(resources_2.sndVolcanoBoom, 1);
                    }
                    if (distanceBetweenPoints(resources_2.camera.x, resources_2.camera.y, tile.x * TILE.width, tile.y * TILE.width) < VOLCANO_RADIUS) {
                        if (timers[tile.specialTimer] === 0) {
                            addGameObject(GameObjectType.MAGMA_BALL, tile.x * TILE.width, tile.y * TILE.height);
                            timers[tile.specialTimer] = randomInt(60, 240);
                        }
                        if (tile.sound) {
                            var maxDistance = VOLCANO_RADIUS;
                            var volume = void 0;
                            if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) <= maxDistance) {
                                volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) / maxDistance;
                            }
                            else {
                                volume = 0;
                            }
                            tile.sound.volume = volume * 0.75;
                        }
                    }
                    else {
                        timers[tile.specialTimer]++;
                    }
                }
                break;
            case TileType.STORAGE:
                {
                    upSprite = resources_2.imgStorage;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                    drawLight(tile.x * tile.width, tile.y * tile.height, tile.width * 1.2);
                }
                break;
        }
        if (globalBoss && tile.upperLayer.type !== TileType.NONE && distanceBetweenPoints(globalBoss.x, globalBoss.y, tile.x * TILE.width, tile.y * TILE.height) <= globalBoss.height / 2 + tile.width / 2) {
            tile.upperLayer.type = TileType.NONE;
            tile.toughness = 0;
            tile.firstToughness = 0;
            if (tile.sound) {
                tile.sound.volume = 0;
            }
            burstParticles({
                x: tile.x * TILE.width,
                y: tile.y * TILE.height,
                color: 'brown',
                speed: 2,
                size: 20,
                count: 20,
                decrease: 0.4,
                accel: 0
            });
        }
        var _a = tilesToPixels(tile.x, tile.y), spriteX = _a[0], spriteY = _a[1];
        if (downSprite) {
            drawSprite(spriteX, spriteY, downSprite, 0, tile.width, tile.height, false, resources_2.Layer.TILE);
        }
        if (upSprite) {
            drawSprite(spriteX, spriteY, upSprite, 0, tile.width, tile.height, false, resources_2.Layer.UPPER_TILE);
        }
    }
    function updateTileMap() {
        var firstTile = { x: Math.round((resources_2.camera.x - VOLCANO_RADIUS) / TILE.width), y: Math.round((resources_2.camera.y - VOLCANO_RADIUS) / TILE.width) };
        var lastTile = { x: Math.round((resources_2.camera.x + VOLCANO_RADIUS) / TILE.width), y: Math.round((resources_2.camera.y + VOLCANO_RADIUS) / TILE.width) };
        for (var y = firstTile.y; y < lastTile.y; y++) {
            for (var x = firstTile.x; x < lastTile.x; x++) {
                var tile = map[getIndexFromCoords(x, y)];
                if (tile) {
                    updateTile(tile.baseLayer.type, tile);
                    updateTile(tile.upperLayer.type, tile);
                }
            }
        }
    }
    function updateGameObject(gameObject) {
        var mouseTile = getTileUnderMouse();
        if (timers[gameObject.unhitableTimer] > 0) {
            gameObject.doNotDraw = !gameObject.doNotDraw;
        }
        if (timers[gameObject.unhitableTimer] === 0) {
            gameObject.doNotDraw = false;
        }
        if (gameObject.type === GameObjectType.PLAYER) {
            if (!gameObject.doNotDraw) {
                drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, resources_2.Layer.PLAYER);
            }
            controlGameObject(gameObject);
            if (timers[gameObject.energy] > 0) {
                drawLight(gameObject.x, gameObject.y, timers[gameObject.energy] / gameObject.maxEnergy * gameObject.width * 1.5 + gameObject.width);
            }
            if (globalBoss && gameObject.luckyCamera &&
                !(globalBoss.x > resources_2.camera.x - resources_2.camera.width / 2 &&
                    globalBoss.x < resources_2.camera.x + resources_2.camera.width / 2 &&
                    globalBoss.y > resources_2.camera.y - resources_2.camera.height / 2 &&
                    globalBoss.y < resources_2.camera.y + resources_2.camera.height / 2)) {
                var angle_1 = angleBetweenPoints(resources_2.camera.x, resources_2.camera.y, globalBoss.x, globalBoss.y);
                drawSprite(resources_2.camera.x, resources_2.camera.y, resources_2.imgArrow2, angle_1, resources_2.camera.height, resources_2.camera.height, false, resources_2.Layer.UI);
            }
            var buttonAngle = Math.PI;
            if (!craftMode) {
                buttonAngle = 0;
            }
            drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 45 / 2, resources_2.camera.y - resources_2.camera.height / 4, resources_2.imgArrow, buttonAngle, 45, 75, false, resources_2.Layer.UI);
            var width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;
            if (timers[hpShakeTimer] <= 0) {
                timers[hpShakeTimer] = width / STRIPE_WIDTH * 800;
            }
            if (timers[hpShakeTimer] > width / STRIPE_WIDTH * 800) {
                timers[hpShakeTimer] = width / STRIPE_WIDTH * 800;
            }
            var shakeX = 0;
            var shakeY = 0;
            if (timers[hpShakeTimer] < 50 && timers[hpShakeTimer] !== 0 && width / STRIPE_WIDTH <= 0.5) {
                shakeX = randomInt(-5, 5);
                shakeY = randomInt(-5, 5);
            }
            drawLinearGradient(resources_2.camera.x - resources_2.camera.width / 2 + width / 2 + 50 + shakeX, resources_2.camera.y - resources_2.camera.height / 2 + 50 + shakeY, width, STRIPE_HEIGHT, ['red', "rgb(" + (1 - width / STRIPE_WIDTH) * 255 + "," + width / STRIPE_WIDTH * 255 + ",0,1)"], [0, 1], resources_2.Layer.UI);
            drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 50 + STRIPE_WIDTH / 2 + shakeX, resources_2.camera.y - resources_2.camera.height / 2 + 50 + shakeY, resources_2.imgHp, 0, STRIPE_WIDTH, STRIPE_HEIGHT, false, resources_2.Layer.UI);
            width = timers[gameObject.energy] / gameObject.maxEnergy * STRIPE_WIDTH;
            drawLinearGradient(resources_2.camera.x - resources_2.camera.width / 2 + width / 2 + 300, resources_2.camera.y - resources_2.camera.height / 2 + 50, width, STRIPE_HEIGHT, ['white', "rgb(" + (1 - width / STRIPE_WIDTH) * 255 + "," + (1 - width / STRIPE_WIDTH) * 255 + "," + (width / STRIPE_WIDTH * 255 + 255) + ",1)"], [0, 1], resources_2.Layer.UI);
            drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 300 + STRIPE_WIDTH / 2, resources_2.camera.y - resources_2.camera.height / 2 + 50, resources_2.imgEnergy, 0, STRIPE_WIDTH * 1.05, STRIPE_HEIGHT, false, resources_2.Layer.UI);
            drawSprite(resources_2.camera.x + resources_2.camera.width / 2 - 100, resources_2.camera.y - resources_2.camera.height / 2 + 140, resources_2.imgTime, 0, 150, 200, false, resources_2.Layer.UI);
            var hour = ONE_DAY / (24 + 37 / 60);
            var minute = hour / 60;
            drawText(resources_2.camera.x + resources_2.camera.width / 2 - 151, resources_2.camera.y - resources_2.camera.height / 2 + 82, 0, 0, 'white', Math.floor((ONE_DAY - timers[dayTimer]) / hour) + " : " + Math.floor((ONE_DAY - timers[dayTimer]) / minute) % 60, 35, 'left', resources_2.Layer.UI);
            drawText(resources_2.camera.x + resources_2.camera.width / 2 - 68, resources_2.camera.y - resources_2.camera.height / 2 + 155, 0, 0, 'white', "" + Math.round((gameObject.x) / TILE.width), 35, 'center', resources_2.Layer.UI);
            drawText(resources_2.camera.x + resources_2.camera.width / 2 - 68, resources_2.camera.y - resources_2.camera.height / 2 + 203, 0, 0, 'white', "" + Math.round((gameObject.y) / TILE.height), 35, 'center', resources_2.Layer.UI);
            if (controls_1.qKey.wentDown) {
                inventory[mainSlot] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
            }
            var vector1 = rotateVector(20, 0, gameObject.angle + Math.PI / 4);
            var vector2 = rotateVector(20, 0, gameObject.angle + Math.PI * 3 / 4);
            var vector3 = rotateVector(20, 0, gameObject.angle - Math.PI / 4);
            var vector4 = rotateVector(20, 0, gameObject.angle - Math.PI * 3 / 4);
            var mapTile1 = getIndexFromCoords(Math.round((gameObject.x + vector1[0]) / TILE.width), Math.round((gameObject.y + vector1[1]) / TILE.height));
            var mapTile2 = getIndexFromCoords(Math.round((gameObject.x + vector2[0]) / TILE.width), Math.round((gameObject.y + vector2[1]) / TILE.height));
            var mapTile3 = getIndexFromCoords(Math.round((gameObject.x + vector3[0]) / TILE.width), Math.round((gameObject.y + vector3[1]) / TILE.height));
            var mapTile4 = getIndexFromCoords(Math.round((gameObject.x + vector4[0]) / TILE.width), Math.round((gameObject.y + vector4[1]) / TILE.height));
            if (map[mapTile1] && map[mapTile2] && map[mapTile3] && map[mapTile4] && map[mapTile1].baseLayer.type === TileType.LAVA &&
                map[mapTile2].baseLayer.type === TileType.LAVA && map[mapTile3].baseLayer.type === TileType.LAVA &&
                map[mapTile4].baseLayer.type === TileType.LAVA) {
                gameObject.exists = false;
            }
            if (globalPlayer.sunBateryLvl) {
                if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
                    timers[globalPlayer.energy] += 1.034;
                }
                if ((timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) || (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME)) {
                    timers[globalPlayer.energy] += 1.068;
                }
                if (timers[globalPlayer.energy] > globalPlayer.maxEnergy) {
                    timers[globalPlayer.energy] = globalPlayer.maxEnergy;
                }
            }
            var canUseItems = true;
            for (var itemIndex = 0; itemIndex <= inventory.length; itemIndex++) {
                if (inventory[itemIndex]) {
                    var SLOT_WIDTH = 60;
                    var LINE_WIDTH = 5;
                    var STRIPE_HEIGHT_1 = 10;
                    var STRIPE_WIDTH_1 = 30;
                    var x = resources_2.camera.x - slotCount / 2 * SLOT_WIDTH;
                    var y = resources_2.camera.y + resources_2.camera.height / 2 - SLOT_WIDTH - STRIPE_HEIGHT_1;
                    var slotX = x + (SLOT_WIDTH + LINE_WIDTH) * itemIndex;
                    var sprite = null;
                    if (inventory[itemIndex].item === Item.NONE) {
                        sprite = resources_2.imgNone;
                    }
                    if (inventory[itemIndex].item === Item.IRON) {
                        sprite = resources_2.imgIronItem;
                    }
                    if (inventory[itemIndex].item === Item.MELTER) {
                        sprite = resources_2.imgMelter;
                    }
                    if (inventory[itemIndex].item === Item.IRON_INGOT) {
                        sprite = resources_2.imgIronIngot;
                    }
                    if (inventory[itemIndex].item === Item.AURIT) {
                        sprite = resources_2.imgAuritItem;
                    }
                    if (inventory[itemIndex].item === Item.AURIT_INGOT) {
                        sprite = resources_2.imgAuritIngot;
                    }
                    if (inventory[itemIndex].item === Item.CRYSTAL) {
                        sprite = resources_2.imgCrystalItem;
                    }
                    if (inventory[itemIndex].item === Item.SPLITTER) {
                        sprite = resources_2.imgSplitter;
                    }
                    if (inventory[itemIndex].item === Item.TOOLKIT) {
                        sprite = resources_2.imgToolkit;
                    }
                    if (inventory[itemIndex].item === Item.SUN_BATERY) {
                        sprite = resources_2.imgSunBatteryItem;
                    }
                    if (inventory[itemIndex].item === Item.SILIKON) {
                        sprite = resources_2.imgSiliconItem;
                    }
                    if (inventory[itemIndex].item === Item.STORAGE) {
                        sprite = resources_2.imgStorage;
                    }
                    if (inventory[itemIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = resources_2.imgGoldenCamera;
                    }
                    if (inventory[itemIndex].item === Item.EXTRA_SLOT) {
                        sprite = resources_2.imgExtraSlotItem;
                    }
                    if (inventory[itemIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = resources_2.imgShockProofBody;
                    }
                    if (inventory[itemIndex].item === Item.IGNEOUS) {
                        sprite = resources_2.imgIgneousItem;
                    }
                    if (inventory[itemIndex].item === Item.IGNEOUS_INGOT) {
                        sprite = resources_2.imgIgneousIngot;
                    }
                    if (inventory[itemIndex].item === Item.METEORITE_STUFF) {
                        sprite = resources_2.imgMeteoriteStuff;
                    }
                    if (inventory[itemIndex].item === Item.SHAKING_DETECTOR) {
                        sprite = resources_2.imgShakingDetector;
                    }
                    if (inventory[itemIndex].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                        sprite = resources_2.imgKnowledgeOfBallistics;
                    }
                    drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, "rgb(00,33,66,1)", 0, resources_2.Layer.UI);
                    drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'black', 5, resources_2.Layer.UI);
                    drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'grey', 2, resources_2.Layer.UI);
                    if (itemIndex === mainSlot) {
                        drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'green', 5, resources_2.Layer.UI);
                    }
                    drawSprite(slotX, y, sprite, 0, SLOT_WIDTH - 10, SLOT_WIDTH - 10, false, resources_2.Layer.UI);
                    if (inventory[itemIndex].count > 1) {
                        drawText(slotX, y - SLOT_WIDTH / 2 - 12, 0, 0, 'green', "" + inventory[itemIndex].count, 25, 'center', resources_2.Layer.UI);
                    }
                    if (controls_1.mouse.worldX > slotX - SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldX < slotX + SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldY > y - SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldY < y + SLOT_WIDTH / 2) {
                        canUseItems = false;
                        if (controls_1.mouse.wentDown) {
                            mainSlot = itemIndex;
                            if (controlledStorage && !isStoraggeFullForItem(inventory[mainSlot].item, controlledStorage)) {
                                addItemToStorage(inventory[mainSlot].item, inventory[mainSlot].count, controlledStorage);
                                removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                            }
                        }
                    }
                    var keys = [controls_1.key1, controls_1.key2, controls_1.key3, controls_1.key4, controls_1.key5, controls_1.key6];
                    if (keys[itemIndex].wentDown) {
                        mainSlot = itemIndex;
                    }
                    if (inventory[itemIndex].item === Item.METEORITE_STUFF) {
                        width = timers[inventory[itemIndex].cooldown] / METEOR_STUFF_COOLDOWN * STRIPE_WIDTH_1;
                        drawRect(slotX, y + SLOT_WIDTH / 2 + STRIPE_HEIGHT_1 / 2 + 3, width, STRIPE_HEIGHT_1, 0, 'white', 0, resources_2.Layer.UI);
                    }
                }
            }
            if (controlledStorage) {
                for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                    var x = void 0;
                    var y = void 0;
                    var SLOT_WIDTH = 60;
                    var LINE_WIDTH = 5;
                    if (slotIndex <= Math.round(STORAGE_SLOT_COUNT / 2 - 1)) {
                        x = resources_2.camera.x + resources_2.camera.width / 2 - SLOT_WIDTH * STORAGE_SLOT_COUNT / 2 - SLOT_WIDTH / 2 + slotIndex * (LINE_WIDTH + SLOT_WIDTH);
                        y = resources_2.camera.y;
                    }
                    else {
                        x = resources_2.camera.x + resources_2.camera.width / 2 - SLOT_WIDTH * STORAGE_SLOT_COUNT / 2 - SLOT_WIDTH / 2 + slotIndex * (LINE_WIDTH + SLOT_WIDTH) - (SLOT_WIDTH + LINE_WIDTH) * STORAGE_SLOT_COUNT / 2;
                        y = resources_2.camera.y + 100;
                    }
                    var sprite = null;
                    if (controlledStorage.inventory[slotIndex].item === Item.NONE) {
                        sprite = resources_2.imgNone;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON) {
                        sprite = resources_2.imgIronItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.MELTER) {
                        sprite = resources_2.imgMelter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON_INGOT) {
                        sprite = resources_2.imgIronIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT) {
                        sprite = resources_2.imgAuritItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT_INGOT) {
                        sprite = resources_2.imgAuritIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.CRYSTAL) {
                        sprite = resources_2.imgCrystalItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SPLITTER) {
                        sprite = resources_2.imgSplitter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.TOOLKIT) {
                        sprite = resources_2.imgToolkit;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SUN_BATERY) {
                        sprite = resources_2.imgSunBatteryItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SILIKON) {
                        sprite = resources_2.imgSiliconItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.STORAGE) {
                        sprite = resources_2.imgStorage;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = resources_2.imgGoldenCamera;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.EXTRA_SLOT) {
                        sprite = resources_2.imgExtraSlotItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = resources_2.imgShockProofBody;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS) {
                        sprite = resources_2.imgIgneousItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS_INGOT) {
                        sprite = resources_2.imgIgneousIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.METEORITE_STUFF) {
                        sprite = resources_2.imgMeteoriteStuff;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SHAKING_DETECTOR) {
                        sprite = resources_2.imgShakingDetector;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                        sprite = resources_2.imgKnowledgeOfBallistics;
                    }
                    drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, "rgb(00,33,66,1)", 0, resources_2.Layer.UI);
                    drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'black', 5, resources_2.Layer.UI);
                    drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'grey', 2, resources_2.Layer.UI);
                    drawSprite(x, y, sprite, 0, SLOT_WIDTH - 10, SLOT_WIDTH - 10, false, resources_2.Layer.UI);
                    if (controlledStorage.inventory[slotIndex].count !== 0) {
                        drawText(x, y - SLOT_WIDTH, 0, 0, 'green', "" + controlledStorage.inventory[slotIndex].count, 25, 'center', resources_2.Layer.UI);
                    }
                    if (controls_1.mouse.worldX > x - SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldX < x + SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldY > y - SLOT_WIDTH / 2 &&
                        controls_1.mouse.worldY < y + SLOT_WIDTH / 2) {
                        canUseItems = false;
                        if (controls_1.mouse.wentDown && controlledStorage.inventory[slotIndex].item !== Item.NONE && !isInventoryFullForItem(controlledStorage.inventory[slotIndex].item)) {
                            addItem(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count);
                            removeItemFromStorage(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count, controlledStorage);
                        }
                    }
                }
            }
            if (controls_1.mouse.worldX > resources_2.camera.x - resources_2.camera.width / 2 &&
                controls_1.mouse.worldX < resources_2.camera.x - resources_2.camera.width / 2 + 45 &&
                controls_1.mouse.worldY > resources_2.camera.y - resources_2.camera.height / 4 - 37.5 &&
                controls_1.mouse.worldY < resources_2.camera.y - resources_2.camera.height / 4 + 37.5) {
                canUseItems = false;
                if (controls_1.mouse.wentDown) {
                    craftMode = !craftMode;
                }
            }
            if (craftMode) {
                if (controls_1.mouse.worldX > resources_2.camera.x - resources_2.camera.width / 2 + 130 &&
                    controls_1.mouse.worldX < resources_2.camera.x - resources_2.camera.width / 2 + 170 &&
                    controls_1.mouse.worldY > resources_2.camera.y - resources_2.camera.height / 4 + 9 &&
                    controls_1.mouse.worldY < resources_2.camera.y - resources_2.camera.height / 4 + 39 &&
                    RECIPES[firstRecipeIndex - 1]) {
                    canUseItems = false;
                    if (controls_1.mouse.wentDown) {
                        firstRecipeIndex--;
                    }
                }
                if (controls_1.mouse.worldX > resources_2.camera.x - resources_2.camera.width / 2 + 130 &&
                    controls_1.mouse.worldX < resources_2.camera.x - resources_2.camera.width / 2 + 170 &&
                    controls_1.mouse.worldY > resources_2.camera.y - resources_2.camera.height / 4 + 438 &&
                    controls_1.mouse.worldY < resources_2.camera.y - resources_2.camera.height / 4 + 466 &&
                    RECIPES[firstRecipeIndex + 3]) {
                    canUseItems = false;
                    if (controls_1.mouse.wentDown) {
                        firstRecipeIndex++;
                    }
                }
                drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 150, resources_2.camera.y - resources_2.camera.height / 4 + 200 + 39, resources_2.imgCrafts, 0, 450, 533, false, resources_2.Layer.UI);
                for (var itemIndex = 0; itemIndex < 3; itemIndex++) {
                    drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 60, resources_2.camera.y - resources_2.camera.height / 4 + 110 + 133 * itemIndex, RECIPES[firstRecipeIndex + itemIndex].sprite, 0, 70, 70, false, resources_2.Layer.UI);
                    drawText(resources_2.camera.x - resources_2.camera.width / 2 + 150, resources_2.camera.y - resources_2.camera.height / 4 + 63 + 133 * itemIndex, 0, 0, 'white', RECIPES[firstRecipeIndex + itemIndex].name, 25, 'center', resources_2.Layer.UI);
                    for (var partIndex = 0; partIndex < RECIPES[firstRecipeIndex + itemIndex].parts.length; partIndex++) {
                        var row = 0;
                        if (partIndex > 2) {
                            row = 1;
                        }
                        drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 130 + 50 * partIndex - 150 * row, resources_2.camera.y - resources_2.camera.height / 4 + 106 + 133 * itemIndex + 50 * row, RECIPES[firstRecipeIndex + itemIndex].parts[partIndex].sprite, 0, 30, 30, false, resources_2.Layer.UI);
                        drawText(resources_2.camera.x - resources_2.camera.width / 2 + 133 + 50 * partIndex - 150 * row, resources_2.camera.y - resources_2.camera.height / 4 + 86 + 133 * itemIndex + 50 * row, 0, 0, 'white', "" + RECIPES[firstRecipeIndex + itemIndex].parts[partIndex].count, 15, 'center', resources_2.Layer.UI);
                    }
                    if (controls_1.mouse.worldX >= resources_2.camera.x - resources_2.camera.width / 2 &&
                        controls_1.mouse.worldX <= resources_2.camera.x - resources_2.camera.width / 2 + 300 &&
                        controls_1.mouse.worldY >= resources_2.camera.y - resources_2.camera.height / 4 + 39 + 133 * itemIndex &&
                        controls_1.mouse.worldY <= resources_2.camera.y - resources_2.camera.height / 4 + 133 + 39 + 133 * itemIndex) {
                        drawRect((resources_2.camera.x * 2 - resources_2.camera.width + 300) / 2, resources_2.camera.y - resources_2.camera.height / 4 + 105.5 + 133 * itemIndex, 300, 133, 0, 'green', 5, resources_2.Layer.UI);
                        canUseItems = false;
                        drawSprite(resources_2.camera.x + resources_2.camera.width / 2 - 250, resources_2.camera.y, resources_2.imgDesk, 0, 500, 220, false, resources_2.Layer.UI);
                        drawText(resources_2.camera.x + resources_2.camera.width / 2 - 475, resources_2.camera.y - 75, 160, 50, 'white', RECIPES[firstRecipeIndex + itemIndex].description, 28, 'left', resources_2.Layer.UI);
                        if (controls_1.mouse.wentDown) {
                            craftRecipe(RECIPES[firstRecipeIndex + itemIndex]);
                        }
                    }
                    drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 150, resources_2.camera.y - resources_2.camera.height / 4 + 25, resources_2.imgArrow1, 0, 40, 26, false, resources_2.Layer.UI);
                    drawSprite(resources_2.camera.x - resources_2.camera.width / 2 + 150, resources_2.camera.y - resources_2.camera.height / 4 + 453, resources_2.imgArrow1, 1 * Math.PI, 40, 26, false, resources_2.Layer.UI);
                }
            }
            if (canUseItems) {
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer.type === TileType.MELTER &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height) <=
                        TILE.width + gameObject.width) {
                    if ((mouseTile.inventory[0].item === Item.NONE && inventory[mainSlot] ||
                        mouseTile.inventory[0].item === inventory[mainSlot].item) &&
                        (inventory[mainSlot].item === Item.IRON ||
                            inventory[mainSlot].item === Item.AURIT ||
                            inventory[mainSlot].item === Item.IGNEOUS)) {
                        mouseTile.inventory[0].item = inventory[mainSlot].item;
                        mouseTile.inventory[0].count += inventory[mainSlot].count;
                        removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                        mouseTile.specialTimer = addTimer(mouseTile.inventory[0].count * 2 * 60);
                    }
                    if (mouseTile.inventory[1].count > 0) {
                        if (!isInventoryFullForItem(mouseTile.inventory[1].item)) {
                            addItem(mouseTile.inventory[1].item, mouseTile.inventory[1].count);
                            mouseTile.inventory[1].count = 0;
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer.type === TileType.SPLITTER &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
                        <= TILE.width + gameObject.width) {
                    if (inventory[mainSlot] && inventory[mainSlot].item === Item.CRYSTAL) {
                        while (timers[gameObject.energy] <= gameObject.maxEnergy && inventory[mainSlot].count > 0) {
                            timers[gameObject.energy] += 2000;
                            removeItem(inventory[mainSlot].item, 1);
                        }
                        if (timers[gameObject.energy] > gameObject.maxEnergy) {
                            timers[gameObject.energy] = gameObject.maxEnergy;
                        }
                    }
                }
                if ((controlledStorage
                    &&
                        distanceBetweenPoints(gameObject.x, gameObject.y, controlledStorage.x * TILE.width, controlledStorage.y * TILE.width)
                            > TILE.width + gameObject.width) || (mouseTile && mouseTile && controls_1.mouse.wentDown && mouseTile === controlledStorage)) {
                    controlledStorage = null;
                }
                else if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer.type === TileType.STORAGE &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
                        <= TILE.width + gameObject.width && !controlledStorage) {
                    controlledStorage = mouseTile;
                }
                if (controls_1.mouse.wentDown && inventory[mainSlot]) {
                    if (inventory[mainSlot].item === Item.TOOLKIT &&
                        gameObject.hitpoints !== gameObject.maxHitpoints) {
                        gameObject.hitpoints += 100;
                        if (gameObject.hitpoints > gameObject.maxHitpoints) {
                            gameObject.hitpoints = gameObject.maxHitpoints;
                        }
                        removeItem(inventory[mainSlot].item, 1);
                    }
                    else if (inventory[mainSlot].item === Item.METEORITE_STUFF && timers[inventory[mainSlot].cooldown] === 0) {
                        summonMeteorite(controls_1.mouse.worldX, controls_1.mouse.worldY);
                        timers[inventory[mainSlot].cooldown] = METEOR_STUFF_COOLDOWN;
                    }
                    if (controls_1.mouse.worldX >= gameObject.x - gameObject.width / 2 &&
                        controls_1.mouse.worldX <= gameObject.x + gameObject.width / 2 &&
                        controls_1.mouse.worldY >= gameObject.y - gameObject.height / 2 &&
                        controls_1.mouse.worldY <= gameObject.y + gameObject.height / 2) {
                        if (inventory[mainSlot].item === Item.SUN_BATERY) {
                            if (gameObject.sunBateryLvl === 0) {
                                gameObject.sunBateryLvl = 1;
                                timers[gameObject.energy] *= 0.05;
                                gameObject.maxEnergy *= 0.05;
                                removeItem(Item.SUN_BATERY, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.GOLDEN_CAMERA) {
                            if (!gameObject.luckyCamera) {
                                gameObject.luckyCamera = true;
                                removeItem(Item.GOLDEN_CAMERA, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.SHAKING_DETECTOR) {
                            if (!gameObject.shakingDetector) {
                                gameObject.shakingDetector = true;
                                removeItem(Item.SHAKING_DETECTOR, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                            if (!gameObject.knowledgeOfBallistics) {
                                gameObject.knowledgeOfBallistics = true;
                                removeItem(Item.KNOWLEDGE_OF_BALLISTICS, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.EXTRA_SLOT) {
                            if (slotCount === 5) {
                                slotCount++;
                                inventory[slotCount - 1] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                                removeItem(Item.EXTRA_SLOT, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.SHOCKPROOF_BODY) {
                            if (gameObject.sprite !== resources_2.imgShockProofBody) {
                                gameObject.hitpoints = gameObject.hitpoints / gameObject.maxHitpoints * 150;
                                gameObject.maxHitpoints = 150;
                                gameObject.sprite = resources_2.imgShockProofBody;
                                removeItem(Item.SHOCKPROOF_BODY, 1);
                            }
                        }
                        else {
                            if (gameObject.sunBateryLvl === 1 && !isInventoryFullForItem(Item.SUN_BATERY)) {
                                gameObject.sunBateryLvl = 0;
                                timers[gameObject.energy] *= 100 / 5;
                                gameObject.maxEnergy *= 100 / 5;
                                addItem(Item.SUN_BATERY, 1);
                            }
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.wentDown && !mouseTile.upperLayer.type &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height)
                        <= TILE.width + gameObject.width + 50) {
                    if (!(gameObject.x >= mouseTile.x * TILE.width - TILE.width / 2 - gameObject.width / 2 &&
                        gameObject.x <= mouseTile.x * TILE.width + TILE.width / 2 + gameObject.width / 2 &&
                        gameObject.y >= mouseTile.y * TILE.height - TILE.height / 2 - gameObject.height / 2 &&
                        gameObject.y <= mouseTile.y * TILE.height + TILE.height / 2 + gameObject.height / 2)) {
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.MELTER && mouseTile.baseLayer.type === TileType.LAVA) {
                            mouseTile.upperLayer = { type: TileType.MELTER, variant: 1 };
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            mouseTile.specialTimer = null;
                            for (var i = 0; i < 2; i++) {
                                mouseTile.inventory[i] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                            }
                            removeItem(Item.MELTER, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.SPLITTER &&
                            !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                                || mouseTile.baseLayer.type === TileType.NONE
                                || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))) {
                            mouseTile.upperLayer.type = TileType.SPLITTER;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            removeItem(Item.SPLITTER, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.SUN_BATERY &&
                            !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                                || mouseTile.baseLayer.type === TileType.NONE
                                || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))) {
                            mouseTile.upperLayer.type = TileType.SUN_BATERY;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            removeItem(Item.SUN_BATERY, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.STORAGE &&
                            !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                                || mouseTile.baseLayer.type === TileType.NONE
                                || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))) {
                            mouseTile.upperLayer.type = TileType.STORAGE;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            for (var i = 0; i < STORAGE_SLOT_COUNT; i++) {
                                mouseTile.inventory[i] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                            }
                            removeItem(Item.STORAGE, 1);
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.isDown && mouseTile.toughness) {
                    moveToTile(mouseTile, gameObject);
                    if (gameObject.goForward === false && gameObject.goBackward === false &&
                        gameObject.goLeft === false && gameObject.goRight === false) {
                        var isThereAnItem = false;
                        for (var slotIndex = 0; slotIndex < mouseTile.inventory.length; slotIndex++) {
                            if (mouseTile.inventory[slotIndex].item !== Item.NONE) {
                                isThereAnItem = true;
                            }
                        }
                        if (!isThereAnItem) {
                            if (mouseTile.toughness % 80 === 0 || mouseTile.toughness === 0) {
                                resources_2.playSound(resources_2.sndMining, 0.5);
                            }
                            if (mouseTile.upperLayer.type === TileType.IRON && !isInventoryFullForItem(Item.IRON)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.AURIT && !isInventoryFullForItem(Item.AURIT)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.CRYSTAL && !isInventoryFullForItem(Item.CRYSTAL)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.SILIKON && !isInventoryFullForItem(Item.SILIKON)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.MELTER && !isInventoryFullForItem(Item.MELTER)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.SPLITTER && !isInventoryFullForItem(Item.SPLITTER)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.SUN_BATERY && !isInventoryFullForItem(Item.SUN_BATERY)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.STORAGE && !isInventoryFullForItem(Item.STORAGE)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer.type === TileType.IGNEOUS && !isInventoryFullForItem(Item.IGNEOUS)) {
                                mouseTile.toughness--;
                            }
                        }
                        if ((mouseTile.toughness % Math.round(mouseTile.firstToughness / mouseTile.oreCount) === 0 || mouseTile.toughness === 0)) {
                            var color = null;
                            if (mouseTile.upperLayer.type === TileType.IRON) {
                                color = 'grey';
                            }
                            if (mouseTile.upperLayer.type === TileType.AURIT) {
                                color = 'yellow';
                            }
                            if (mouseTile.upperLayer.type === TileType.CRYSTAL) {
                                color = 'lightcoral';
                            }
                            if (mouseTile.upperLayer.type === TileType.SILIKON) {
                                color = 'dimgray';
                            }
                            if (mouseTile.upperLayer.type === TileType.IGNEOUS) {
                                color = 'sienna';
                            }
                            if (color !== null) {
                                burstParticles({
                                    x: controls_1.mouse.worldX,
                                    y: controls_1.mouse.worldY,
                                    color: color,
                                    speed: 1,
                                    size: 20,
                                    decrease: 0,
                                    accel: 0,
                                    count: 5
                                });
                            }
                        }
                    }
                    if (mouseTile.toughness <= 0) {
                        var x = mouseTile.x;
                        var y = mouseTile.y;
                        if (mouseTile.upperLayer.type === TileType.MELTER) {
                            addItem(Item.MELTER, 1);
                        }
                        if (mouseTile.upperLayer.type === TileType.SPLITTER) {
                            addItem(Item.SPLITTER, 1);
                        }
                        if (mouseTile.upperLayer.type === TileType.SUN_BATERY) {
                            addItem(Item.SUN_BATERY, 1);
                        }
                        if (mouseTile.upperLayer.type === TileType.STORAGE) {
                            addItem(Item.STORAGE, 1);
                            if (mouseTile === controlledStorage) {
                                controlledStorage = null;
                            }
                        }
                        mouseTile.upperLayer.type = TileType.NONE;
                    }
                    var stripeWidth = 300;
                    var width_1 = stripeWidth * (mouseTile.toughness / mouseTile.firstToughness);
                    drawRect(resources_2.camera.x + width_1 / 2 - 150, resources_2.camera.y + resources_2.camera.height / 4, width_1, 50, 0, 'green', 0, resources_2.Layer.UI);
                }
            }
            if (!gameObject.doNotDraw && gameObject.sunBateryLvl === 1) {
                drawSprite(gameObject.x, gameObject.y, resources_2.imgSunBatteryAdd, gameObject.angle, gameObject.width, gameObject.height, false, resources_2.Layer.PLAYER);
            }
            var angle = angleBetweenPoints(gameObject.x, gameObject.y, controls_1.mouse.worldX, controls_1.mouse.worldY);
            var cameraSprite = resources_2.imgNone;
            if (!gameObject.luckyCamera) {
                cameraSprite = resources_2.imgCamera;
            }
            if (gameObject.luckyCamera) {
                cameraSprite = resources_2.imgGoldenCamera;
            }
            if (!gameObject.doNotDraw) {
                drawSprite(gameObject.x, gameObject.y, cameraSprite, angle, 30, 30, false, resources_2.Layer.PLAYER);
            }
            var staticWheelPositions = [
                [46, 40],
                [9, 45],
                [-48, 45],
                [46, -40],
                [9, -45],
                [-48, -45],
            ];
            var wheelPositions = staticWheelPositions.map(function (p) { return rotateVector(p[0], p[1], -gameObject.angle); });
            if (gameObject.goForward) {
                gameObject.leftWeel++;
                gameObject.rightWeel++;
            }
            else {
                if (gameObject.goBackward) {
                    gameObject.leftWeel--;
                    gameObject.rightWeel--;
                }
                else {
                    if (gameObject.goLeft) {
                        gameObject.rightWeel++;
                        gameObject.leftWeel--;
                    }
                    if (gameObject.goRight) {
                        gameObject.leftWeel++;
                        gameObject.rightWeel--;
                    }
                }
            }
            if (gameObject.leftWeel > 5) {
                gameObject.leftWeel = 0;
            }
            if (gameObject.rightWeel > 5) {
                gameObject.rightWeel = 0;
            }
            if (gameObject.leftWeel < 0) {
                gameObject.leftWeel = 5;
            }
            if (gameObject.rightWeel < 0) {
                gameObject.rightWeel = 5;
            }
            var wheelFrames = [
                resources_2.imgWheel1,
                resources_2.imgWheel2,
                resources_2.imgWheel3,
                resources_2.imgWheel4,
                resources_2.imgWheel5,
                resources_2.imgWheel6,
            ];
            if (!gameObject.doNotDraw) {
                var wheelSprite = wheelFrames[gameObject.leftWeel];
                for (var posIndex = 0; posIndex < 3; posIndex++) {
                    drawSprite(gameObject.x + wheelPositions[posIndex][0], gameObject.y + wheelPositions[posIndex][1], wheelSprite, gameObject.angle, 25, 12, false, resources_2.Layer.PLAYER);
                }
                wheelSprite = wheelFrames[gameObject.rightWeel];
                for (var posIndex = 3; posIndex < 6; posIndex++) {
                    drawSprite(gameObject.x + wheelPositions[posIndex][0], gameObject.y + wheelPositions[posIndex][1], wheelSprite, gameObject.angle, 25, 12, false, resources_2.Layer.PLAYER);
                }
            }
            if (timers[gameObject.energy] > 0) {
                moveGameObject(gameObject);
            }
            else {
                gameObject.hitpoints -= 0.01;
            }
            if (globalPlayer.x < TILE.firstX - TILE.width / 2) {
                globalPlayer.x = TILE.firstX - TILE.width / 2;
            }
            if (globalPlayer.x > TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX) {
                globalPlayer.x = TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX;
            }
            if (globalPlayer.y < TILE.firstY - TILE.height / 2) {
                globalPlayer.y = TILE.firstY - TILE.height / 2;
            }
            if (globalPlayer.y > TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY) {
                globalPlayer.y = TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY;
            }
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            var speedZ = MAGMA_BALL_SPEED * Math.sin(gameObject.angleZ);
            var speedXY = MAGMA_BALL_SPEED * Math.cos(gameObject.angleZ);
            var speedVector = rotateVector(speedXY, 0, gameObject.angle);
            gameObject.speedX = speedVector[0];
            gameObject.speedY = speedVector[1];
            gameObject.x += gameObject.speedX;
            gameObject.y += gameObject.speedY;
            gameObject.lifeTime++;
            var height = resources_2.Layer.UPPER_TILE + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            var range = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;
            var rangeProjections = rotateVector(range, 0, gameObject.angle);
            if (globalPlayer.knowledgeOfBallistics) {
                drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 50, 'red', 3, resources_2.Layer.UPPER_TILE);
                drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], resources_2.imgAlert, 0, 90, 90, false, resources_2.Layer.UPPER_TILE);
            }
            gameObject.width = (100 + height);
            gameObject.height = (100 + height);
            if (height <= resources_2.Layer.UPPER_TILE) {
                var x = Math.round(gameObject.x / TILE.width);
                var y = Math.round(gameObject.y / TILE.height);
                var tileIndex = getIndexFromCoords(x, y);
                if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                    gameObject.exists = false;
                    var maxDistance = VOLCANO_RADIUS;
                    var volume = void 0;
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) <= maxDistance) {
                        volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) / maxDistance;
                    }
                    else {
                        volume = 0;
                    }
                    var strength = volume * 15;
                    makeScreenShake(strength, 15);
                    resources_2.playSound(resources_2.sndBoom, volume * 0.5);
                    burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 45, count: 15, decrease: 0.75, accel: 0 });
                    var chance = randomFloat(0, 1);
                    if (map[tileIndex]) {
                        if (map[tileIndex].upperLayer.type !== TileType.NONE) {
                            if (chance < 0.25 && map[tileIndex].upperLayer.type !== TileType.VOLCANO) {
                                map[tileIndex].upperLayer.type = TileType.NONE;
                                map[tileIndex].toughness = 0;
                                map[tileIndex].firstToughness = 0;
                                if (map[tileIndex].sound) {
                                    map[tileIndex].sound.volume = 0;
                                }
                            }
                        }
                        else {
                            if (chance < 0.25 && map[tileIndex].baseLayer.type !== TileType.NONE && map[tileIndex].baseLayer.type !== TileType.GEYSER
                                && map[tileIndex].baseLayer.type !== TileType.VOLCANO) {
                                map[tileIndex].baseLayer.type = TileType.LAVA;
                                map[tileIndex].baseLayer.variant = randomInt(1, 2);
                            }
                        }
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.METEORITE) {
            var speedZ = METEORITE_SPEED * Math.sin(gameObject.angleZ);
            gameObject.lifeTime++;
            var height = CAMERA_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);
            gameObject.width = (100 + height);
            gameObject.height = (100 + height);
            if (height < resources_2.Layer.UPPER_TILE) {
                var x = Math.round(gameObject.x / TILE.width);
                var y = Math.round(gameObject.y / TILE.height);
                var tileIndex = getIndexFromCoords(x, y);
                if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                    gameObject.exists = false;
                    var maxDistance = VOLCANO_RADIUS;
                    var volume = void 0;
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) <= maxDistance) {
                        volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) / maxDistance;
                    }
                    else {
                        volume = 0;
                    }
                    var strength = volume * 15;
                    makeScreenShake(strength, 15);
                    resources_2.playSound(resources_2.sndBoom, volume * 0.5);
                    if (gameObject.summoned) {
                        if (globalBoss && distanceBetweenPoints(globalBoss.x, globalBoss.y, gameObject.x, gameObject.y) <= globalBoss.height / 2 + gameObject.width / 2) {
                            globalBoss.hitpoints -= 100;
                        }
                        if (map[tileIndex].upperLayer) {
                            map[tileIndex].upperLayer.type = TileType.NONE;
                            map[tileIndex].toughness = 0;
                            map[tileIndex].oreCount = 0;
                            if (map[tileIndex].sound) {
                                map[tileIndex].sound.volume = 0;
                            }
                        }
                        if (map[tileIndex].baseLayer.type === TileType.MOUNTAIN) {
                            map[tileIndex].baseLayer.type = TileType.EARTH;
                            map[tileIndex].baseLayer.variant = 1;
                        }
                    }
                    else {
                        burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 80, count: 15, decrease: 1, accel: 0 });
                        var chance = randomFloat(0, 1);
                        if (chance < 0.25) {
                            if (map[tileIndex] && map[tileIndex].baseLayer.type !== TileType.LAVA && map[tileIndex].baseLayer.type !== TileType.MOUNTAIN &&
                                map[tileIndex].baseLayer.type !== TileType.NONE && map[tileIndex].baseLayer.type !== TileType.VOLCANO) {
                                map[tileIndex].upperLayer.type = TileType.IGNEOUS;
                                map[tileIndex].toughness = 499;
                                map[tileIndex].firstToughness = 500;
                                map[tileIndex].oreCount = 1;
                            }
                        }
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.LAVA_BALL) {
            var speedZ = LAVA_BALL_SPEED * Math.sin(gameObject.angleZ);
            var speedXY = LAVA_BALL_SPEED * Math.cos(gameObject.angleZ);
            var speedVector = rotateVector(speedXY, 0, gameObject.angle);
            gameObject.speedX = speedVector[0];
            gameObject.speedY = speedVector[1];
            gameObject.x += gameObject.speedX;
            gameObject.y += gameObject.speedY;
            gameObject.lifeTime++;
            var height = resources_2.Layer.BOSS + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            var range = LAVA_BALL_SPEED * LAVA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;
            var rangeProjections = rotateVector(range, 0, gameObject.angle);
            if (globalPlayer.knowledgeOfBallistics) {
                drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 10, 'red', 3, resources_2.Layer.UPPER_TILE);
                drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], resources_2.imgAlert, 0, 18, 18, false, resources_2.Layer.UPPER_TILE);
            }
            gameObject.width = (20 + height);
            gameObject.height = (20 + height);
            if (height < resources_2.Layer.UPPER_TILE) {
                var x = Math.round(gameObject.x / TILE.width);
                var y = Math.round(gameObject.y / TILE.height);
                var tileIndex = getIndexFromCoords(x, y);
                if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                    gameObject.exists = false;
                    var x_1 = Math.round(gameObject.x / TILE.width);
                    var y_1 = Math.round(gameObject.y / TILE.height);
                    var tileIndex_1 = getIndexFromCoords(x_1, y_1);
                    if (map[tileIndex_1] && map[tileIndex_1].baseLayer.type !== TileType.VOLCANO && map[tileIndex_1].baseLayer.type !== TileType.NONE) {
                        map[tileIndex_1].upperLayer.type = TileType.NONE;
                        map[tileIndex_1].baseLayer.type = TileType.LAVA;
                        map[tileIndex_1].toughness = 0;
                        map[tileIndex_1].oreCount = 0;
                        if (map[tileIndex_1].sound) {
                            map[tileIndex_1].sound.volume = 0;
                        }
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.BOSS) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, resources_2.Layer.BOSS);
            if (distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y) <= gameObject.height / 2 + globalPlayer.width / 2 && timers[globalPlayer.unhitableTimer] === 0) {
                globalPlayer.hitpoints -= 25;
                timers[globalPlayer.unhitableTimer] = 150;
                if (gameObject.attack === 0) {
                    timers[gameObject.specialTimer] = 40;
                }
            }
            if (globalBoss && globalPlayer.luckyCamera) {
                var STRIPE_WIDTH_2 = 900;
                var STRIPE_HEIGHT_2 = 50;
                var width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH_2;
                drawLinearGradient(resources_2.camera.x, resources_2.camera.y - resources_2.camera.height / 2 + 50, width, STRIPE_HEIGHT_2, ['red', "rgb(" + (1 - width / STRIPE_WIDTH_2) * 255 + ",0,0,1)"], [0, 1], resources_2.Layer.UI);
                drawSprite(resources_2.camera.x, resources_2.camera.y - resources_2.camera.height / 2 + 50, resources_2.imgBossHp, 0, STRIPE_WIDTH_2, STRIPE_HEIGHT_2, false, resources_2.Layer.UI);
            }
            if (timers[gameObject.specialTimer] === 0) {
                if (distanceBetweenPoints(globalBoss.x, globalBoss.y, globalPlayer.x, globalPlayer.y) > resources_2.camera.width * 1.5) {
                    gameObject.attack = 0;
                }
                else {
                    gameObject.attack = randomInt(0, 3);
                    if (distanceBetweenPoints(globalBoss.x, globalBoss.y, globalPlayer.x, globalPlayer.y) >= 600 && gameObject.attack === 1) {
                        while (gameObject.attack === 1) {
                            gameObject.attack = randomInt(0, 3);
                        }
                    }
                }
                gameObject.goForward = false;
                gameObject.goLeft = false;
                gameObject.goRight = false;
                if (gameObject.attack === 1 || gameObject.attack === 2) {
                    timers[gameObject.specialTimer] = 300;
                }
                else {
                    timers[gameObject.specialTimer] = 600;
                }
                gameObject.rotationSpeed = 0.01;
                gameObject.sprite = resources_2.imgBoss;
            }
            if (gameObject.attack === 0) {
                var angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                var diff = normalizeAngle(gameObject.angle - angle);
                if (distanceBetweenPoints(globalBoss.x, globalBoss.y, globalPlayer.x, globalPlayer.y) < resources_2.camera.width * 1.5 && gameObject.goForward) {
                    gameObject.rotationSpeed = 0;
                }
                if (gameObject.goForward) {
                    var vector = rotateVector(gameObject.width / 2, 0, gameObject.angle + Math.PI);
                    burstParticles({
                        x: gameObject.x + vector[0],
                        y: gameObject.y - vector[1],
                        color: 'red',
                        speed: 3,
                        size: 35,
                        count: 1,
                        decrease: 0.5,
                        accel: 0
                    });
                }
                if (diff > gameObject.rotationSpeed) {
                    gameObject.goLeft = true;
                    gameObject.goRight = false;
                }
                else if (diff < -gameObject.rotationSpeed) {
                    gameObject.goRight = true;
                    gameObject.goLeft = false;
                }
                else {
                    gameObject.goLeft = false;
                    gameObject.goRight = false;
                    gameObject.goForward = true;
                }
            }
            if (gameObject.attack === 1) {
                if (timers[gameObject.specialTimer] > 100) {
                    if (timers[gameObject.specialTimer] < 300) {
                        addGameObject(GameObjectType.LAVA_BALL, gameObject.x, gameObject.y);
                    }
                    gameObject.rotationSpeed += 0.0015;
                }
                if (timers[gameObject.specialTimer] < 100) {
                    gameObject.rotationSpeed -= 0.003;
                }
                gameObject.goLeft = true;
            }
            if (gameObject.attack === 2) {
                if (timers[gameObject.specialTimer] > 100) {
                    if (timers[gameObject.specialTimer] < 300 && timers[gameObject.specialTimer] % 10 === 0) {
                        addGameObject(GameObjectType.MAGMA_BALL, gameObject.x, gameObject.y);
                    }
                    gameObject.rotationSpeed += 0.0015;
                }
                if (timers[gameObject.specialTimer] < 100) {
                    gameObject.rotationSpeed -= 0.003;
                }
                gameObject.goLeft = true;
            }
            if (gameObject.attack === 3) {
                if (timers[gameObject.specialTimer] >= 500) {
                    if (timers[gameObject.specialTimer] % 2 === 0) {
                        gameObject.sprite = resources_2.imgBossReadyToAttack1;
                    }
                    else {
                        gameObject.sprite = resources_2.imgBossReadyToAttack;
                    }
                }
                else {
                    gameObject.rotationSpeed = 0.003;
                    var angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                    var diff = normalizeAngle(gameObject.angle - angle);
                    if (diff > gameObject.rotationSpeed && !gameObject.goForward) {
                        gameObject.goLeft = true;
                        gameObject.goRight = false;
                    }
                    else if (diff < -gameObject.rotationSpeed && !gameObject.goForward) {
                        gameObject.goRight = true;
                        gameObject.goLeft = false;
                    }
                    else {
                        gameObject.goRight = false;
                        gameObject.goLeft = false;
                    }
                    var lazerLength = resources_2.camera.width * 1.5;
                    var vector = rotateVector(gameObject.width / 3 + lazerLength / 2, 1, -gameObject.angle);
                    if (timers[gameObject.specialTimer] % 2 === 0) {
                        gameObject.sprite = resources_2.imgBossAttack;
                        drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], resources_2.imgLazer, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, resources_2.Layer.BOSS);
                    }
                    else {
                        gameObject.sprite = resources_2.imgBossAttack1;
                        drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], resources_2.imgLazer1, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, resources_2.Layer.BOSS);
                    }
                    var distanceFromPlayer = distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x + vector[0], gameObject.y + vector[1]);
                    var rotatedDistanceFromPlayer = rotateVector(distanceFromPlayer, 0, angleBetweenPoints(gameObject.x + vector[0], gameObject.y + vector[1], globalPlayer.x, globalPlayer.y) - globalBoss.angle);
                    resources_2.ctx.save();
                    resources_2.ctx.translate(gameObject.x + vector[0], gameObject.y + vector[1]);
                    if (-286 / 796 * gameObject.height / 2 < rotatedDistanceFromPlayer[1] && 286 / 796 * gameObject.height / 2 > rotatedDistanceFromPlayer[1]
                        && -lazerLength / 2 < rotatedDistanceFromPlayer[0] && lazerLength / 2 > rotatedDistanceFromPlayer[0]) {
                        globalPlayer.hitpoints -= 0.15;
                    }
                    resources_2.ctx.restore();
                }
            }
            moveGameObject(gameObject);
        }
        if (gameObject.type === GameObjectType.MANIPULATOR) {
            if (!globalBoss.exists) {
                gameObject.exists = false;
            }
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, resources_2.Layer.MANIPULATOR);
            gameObject.angle = globalBoss.angle;
            var angle = angleBetweenPoints(globalBoss.x + gameObject.firstX, globalBoss.y + gameObject.firstY, globalBoss.x, globalBoss.y);
            drawSprite(globalBoss.x, globalBoss.y, resources_2.imgManipulator, globalBoss.angle + angle, 270, 60, true, resources_2.Layer.BOSS_LEG);
            var legVector = rotateVector(250, 0, -globalBoss.angle - angle + Math.PI);
            angle = angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + legVector[0], globalBoss.y + legVector[1]);
            drawSprite(globalBoss.x + legVector[0], globalBoss.y + legVector[1], resources_2.imgManipulator, angle, distanceBetweenPoints(globalBoss.x + legVector[0], globalBoss.y + legVector[1], gameObject.x, gameObject.y), 60, true, resources_2.Layer.BOSS_LEG);
            var legDistance = 140;
            var firstCoordsAngle = Math.PI - angleBetweenPoints(gameObject.firstX, gameObject.firstY, 0, 0);
            var firstCoordsVector = rotateVector(500, 0, -globalBoss.angle + firstCoordsAngle);
            if (distanceBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + firstCoordsVector[0], globalBoss.y + firstCoordsVector[1]) > legDistance) {
                var movementAngle = Math.PI - angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + firstCoordsVector[0], globalBoss.y + firstCoordsVector[1]);
                gameObject.neededX = globalBoss.x + firstCoordsVector[0];
                gameObject.neededY = globalBoss.y + firstCoordsVector[1];
                var neededVector = rotateVector(legDistance - 5, 0, movementAngle);
                gameObject.neededX -= neededVector[0];
                gameObject.neededY -= neededVector[1];
                gameObject.neededX -= globalBoss.x;
                gameObject.neededY -= globalBoss.y;
            }
            if (gameObject.neededX && gameObject.neededY) {
                var angle_2 = angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + gameObject.neededX, globalBoss.y + gameObject.neededY);
                var speed = void 0;
                speed = Math.abs(globalBoss.speed) * 2 + globalBoss.rotationSpeed * globalBoss.width * 2;
                var movementVector = rotateVector(speed, 0, angle_2);
                if ((gameObject.x < globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] > globalBoss.x + gameObject.neededX) ||
                    (gameObject.x > globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] < globalBoss.x + gameObject.neededX)) {
                    gameObject.x = globalBoss.x + gameObject.neededX;
                    gameObject.y = globalBoss.y + gameObject.neededY;
                    gameObject.neededX = null;
                    gameObject.neededY = null;
                    var distance = distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                    var strength = 1 / distance * resources_2.camera.width;
                    makeScreenShake(strength, 5);
                    if (distance < gameObject.width / 2 + globalPlayer.width / 2 && timers[globalPlayer.unhitableTimer] === 0) {
                        globalPlayer.hitpoints -= 20;
                        timers[globalPlayer.unhitableTimer] = 150;
                    }
                    for (var tileIndex = 0; tileIndex < map.length; tileIndex++) {
                        var tile = map[tileIndex];
                        if (tile.upperLayer.type !== TileType.NONE && distanceBetweenPoints(tile.x * TILE.width, tile.y * TILE.height, gameObject.x, gameObject.y) <= gameObject.width / 2 + tile.width / 2) {
                            tile.upperLayer.type = TileType.NONE;
                            tile.toughness = 0;
                            tile.firstToughness = 0;
                            if (tile.sound) {
                                tile.sound.volume = 0;
                            }
                            burstParticles({
                                x: tile.x * TILE.width,
                                y: tile.y * TILE.height,
                                color: 'brown',
                                speed: 2,
                                size: 20,
                                count: 20,
                                decrease: 0.4,
                                accel: 0
                            });
                        }
                    }
                }
                else {
                    gameObject.x += movementVector[0];
                    gameObject.y -= movementVector[1];
                }
            }
        }
        if ((gameObject.hitpoints <= 0) && (gameObject.type === GameObjectType.PLAYER || gameObject.type === GameObjectType.BOSS)) {
            gameObject.exists = false;
            if (gameObject.type === GameObjectType.BOSS) {
                burstParticles({
                    x: gameObject.x,
                    y: gameObject.y,
                    color: 'red',
                    speed: 7,
                    size: 40,
                    count: 100,
                    decrease: 0.2,
                    accel: -0.01
                });
            }
        }
        normalizeAngle(gameObject.angle);
    }
    function addMenuText(x, y, width, height, text, color, size, z) {
        var clickableText = {
            text: text,
            x: x,
            y: y,
            width: width,
            height: height,
            color: color,
            size: size,
            z: z,
            mouseOn: false,
            exists: true
        };
        var textIndex = 0;
        while (menuTexts[textIndex] && menuTexts[textIndex].exists === true) {
            textIndex++;
        }
        menuTexts[textIndex] = clickableText;
        return (clickableText);
    }
    function updateClickableTexts() {
        for (var textIndex = 0; textIndex < menuTexts.length; textIndex++) {
            var text = menuTexts[textIndex];
            if (controls_1.mouse.worldX > text.x - text.width / 2 &&
                controls_1.mouse.worldX < text.x + text.width / 2 &&
                controls_1.mouse.worldY > text.y - text.height / 2 &&
                controls_1.mouse.worldY < text.y + text.height / 2) {
                text.mouseOn = true;
            }
            drawText(text.x, text.y, 0, 0, text.color, text.text, text.size, 'center', text.z);
        }
    }
    function resetClicks() {
        for (var textIndex = 0; textIndex < menuTexts.length; textIndex++) {
            menuTexts[textIndex].mouseOn = false;
        }
    }
    function loopMenu() {
        resources_2.camera.x = 0;
        resources_2.camera.y = 0;
        drawSprite(resources_2.camera.x, resources_2.camera.y, resources_2.imgMenu, 0, resources_2.camera.width, resources_2.camera.height, false, resources_2.Layer.TILE);
        drawText(resources_2.camera.x, resources_2.camera.y - resources_2.camera.height / 2 + 200, 0, 0, 'white', 'MEGA MARS 2D-3D SUPER EPIC SOMEWHAT SURVIVAL', 71, 'center', resources_2.Layer.ON_TILE);
        updateClickableTexts();
        if (playText.mouseOn && resources_2.canBeginGame) {
            playText.text = 'ИГРАТЬ';
            if (controls_1.mouse.wentDown) {
                gameState = GameState.GAME;
                restate();
                buildMap();
                musik = resources_2.playSound(resources_2.sndParadox, 0.85, true);
            }
        }
        else {
            playText.text = 'играть';
        }
        if (controlsText.mouseOn && resources_2.canBeginGame) {
            controlsText.text = 'УПРАВЛЕНИЕ';
            if (controls_1.mouse.wentDown) {
                instructions = !instructions;
            }
        }
        else {
            controlsText.text = 'управление';
        }
        if (instructions) {
            drawText(resources_2.camera.x, resources_2.camera.y, 150, 80, 'White', '1)Перемещаться на WASD / 2)Q-выбросить вещь / 3)R-рестарт / 4)Собирать вещи, нажимая на клетки поля мышкой / Всё, всех люблю, ня, пока', 60, 'left', resources_2.Layer.UI);
        }
        if (controlsText.mouseOn && resources_2.canBeginGame) {
            controlsText.text = 'УПРАВЛЕНИЕ';
            if (controls_1.mouse.wentDown) {
            }
        }
        else {
            controlsText.text = 'управление';
        }
        resetClicks();
    }
    function loopGame() {
        updateTileMap();
        if (globalBoss && globalBoss.exists === false) {
            drawText(resources_2.camera.x, resources_2.camera.y, 0, 0, 'white', 'Вы - выигрывающий) Спасибо, что поиграли в демо версию, ждите новых обновлений', 45, 'center', resources_2.Layer.UI);
        }
        else if (globalPlayer.exists === false) {
            drawText(resources_2.camera.x, resources_2.camera.y, 0, 0, 'white', 'Не время сдаваться, вы справитесь. Нажмите R для меню', 45, 'center', resources_2.Layer.UI);
        }
        if (timers[gameTimer] < eventEnd - timeBetweenEvents) {
            event = Event.METEORITE_RAIN;
            eventEnd = timers[gameTimer] - EVENT_LENGTH;
            if (eventEnd <= 0) {
                eventEnd = 0;
            }
        }
        if (timers[gameTimer] === eventEnd) {
            event = Event.NONE;
            timeBetweenEvents = randomInt(timeBetweenEvents - timeBetweenEvents / 6, timeBetweenEvents + timeBetweenEvents / 6);
        }
        if (event === Event.METEORITE_RAIN && timers[gameTimer] % 3 === 0) {
            addGameObject(GameObjectType.METEORITE, randomInt(globalPlayer.x - 5000, globalPlayer.x + 5000), randomInt(globalPlayer.y - 5000, globalPlayer.y + 5000));
        }
        for (var gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
            var gameObject = gameObjects[gameObjectIndex];
            if (gameObject.exists) {
                updateGameObject(gameObject);
            }
        }
        updateParticles();
        if (timers[dayTimer] === 0) {
            timers[dayTimer] = ONE_DAY;
        }
        if (timers[gameTimer] === 1) {
            if (!globalBoss) {
                var y = resources_2.camera.y;
                var x = resources_2.camera.x;
                while (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, x, y) <= resources_2.camera.width * 1.5 ||
                    x < -TILE.width / 2 || x > -TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX ||
                    y < -TILE.height / 2 || y > -TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY) {
                    x = randomInt(globalPlayer.x - resources_2.camera.width * 3, globalPlayer.y + resources_2.camera.width * 3);
                    y = randomInt(globalPlayer.y - resources_2.camera.height * 3, globalPlayer.y + resources_2.camera.height * 3);
                }
                globalBoss = addGameObject(GameObjectType.BOSS, x, y);
                musik.volume = 0;
                musik = resources_2.playSound(resources_2.sndDysonSphere, 0.85, true);
                var distanceFromManipulators = 500;
                var hand1Angle = globalBoss.angle - 0.25 * Math.PI;
                var hand1Vector = rotateVector(distanceFromManipulators, 0, hand1Angle);
                addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand1Vector[0], globalBoss.y + hand1Vector[1]);
                var hand2Angle = globalBoss.angle + 0.25 * Math.PI;
                var hand2Vector = rotateVector(distanceFromManipulators, 0, hand2Angle);
                addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand2Vector[0], globalBoss.y + hand2Vector[1]);
                var hand3Angle = globalBoss.angle - 0.75 * Math.PI;
                var hand3Vector = rotateVector(distanceFromManipulators, 0, hand3Angle);
                addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand3Vector[0], globalBoss.y + hand3Vector[1]);
                var hand4Angle = globalBoss.angle + 0.75 * Math.PI;
                var hand4Vector = rotateVector(distanceFromManipulators, 0, hand4Angle);
                addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand4Vector[0], globalBoss.y + hand4Vector[1]);
            }
        }
        drawSprite(resources_2.camera.x, resources_2.camera.y, resources_2.backBuffer, 0, resources_2.camera.width, resources_2.camera.height, false, resources_2.Layer.FORGROUND);
        if (timers[recentShake.duration] <= 0) {
            recentShake = { strength: 0, duration: addTimer(0) };
        }
        for (var shakeIndex = 0; shakeIndex < screenShakes.length; shakeIndex++) {
            var shake = screenShakes[shakeIndex];
            if (shake.strength > recentShake.strength && timers[shake.duration] > 0) {
                recentShake = shake;
            }
        }
        resources_2.camera.x = globalPlayer.x;
        resources_2.camera.y = globalPlayer.y;
        if (timers[recentShake.duration] > 0 && recentShake.strength > 0) {
            resources_2.camera.x += randomInt(-recentShake.strength, recentShake.strength);
            resources_2.camera.y += randomInt(-recentShake.strength, recentShake.strength);
        }
        while (resources_2.camera.x < TILE.firstX - TILE.width / 2 + resources_2.camera.width / 2) {
            resources_2.camera.x = TILE.firstX - TILE.width / 2 + resources_2.camera.width / 2;
        }
        while (resources_2.camera.y < TILE.firstY - TILE.height / 2 + resources_2.camera.height / 2) {
            resources_2.camera.y = TILE.firstY - TILE.height / 2 + resources_2.camera.height / 2;
        }
        while (resources_2.camera.x > TILE.firstX - TILE.width / 2 + TILE.chunkSizeX * TILE.chunkCountX * TILE.width - resources_2.camera.width / 2) {
            resources_2.camera.x = TILE.firstX - TILE.width / 2 + TILE.chunkSizeX * TILE.chunkCountX * TILE.width - resources_2.camera.width / 2;
        }
        while (resources_2.camera.y > TILE.firstY - TILE.height / 2 + TILE.chunkSizeY * TILE.chunkCountY * TILE.width - resources_2.camera.height / 2) {
            resources_2.camera.y = TILE.firstY - TILE.height / 2 + TILE.chunkSizeY * TILE.chunkCountY * TILE.width - resources_2.camera.height / 2;
        }
        if (controls_1.rKey.wentDown) {
            gameState = GameState.MENU;
            musik.volume = 0;
            musik = null;
            playText = addMenuText(-resources_2.camera.width / 2 + 165, -resources_2.camera.height / 2 + 400, 130, 60, 'играть', 'White', 40, resources_2.Layer.UI);
            controlsText = addMenuText(-resources_2.camera.width / 2 + 215, -resources_2.camera.height / 2 + 470, 130, 60, 'управление', 'White', 40, resources_2.Layer.UI);
        }
    }
    function loop() {
        var _a;
        drawQueue = [];
        resources_2.ctx.save();
        resources_2.backCtx.save();
        _a = screenToWorld(controls_1.mouse.x, controls_1.mouse.y), controls_1.mouse.worldX = _a[0], controls_1.mouse.worldY = _a[1];
        resources_2.ctx.clearRect(0, 0, resources_2.canvas.width, resources_2.canvas.height);
        resources_2.backCtx.clearRect(0, 0, resources_2.canvas.width, resources_2.canvas.height);
        resources_2.backCtx.fillStyle = "rgba(0,0,0," + alpha + ")";
        resources_2.backCtx.fillRect(0, 0, resources_2.canvas.width, resources_2.canvas.height);
        var scale = resources_2.canvas.width / resources_2.camera.width;
        resources_2.backCtx.scale(scale, scale);
        resources_2.ctx.scale(scale, scale);
        resources_2.ctx.rotate(-resources_2.camera.angle);
        resources_2.ctx.translate(-resources_2.camera.x + resources_2.camera.width / 2, -resources_2.camera.y + resources_2.camera.height / 2);
        if (gameState === GameState.MENU) {
            loopMenu();
        }
        else if (gameState === GameState.GAME) {
            loopGame();
        }
        updateTimers();
        drawQueue.sort(function (a, b) { return a.z - b.z; });
        for (var itemIndex = 0; itemIndex < drawQueue.length; itemIndex++) {
            var item = drawQueue[itemIndex];
            resources_2.renderItem(item);
        }
        resources_2.backCtx.restore();
        resources_2.ctx.restore();
        controls_1.clearAllKeys();
        requestAnimationFrame(loop);
    }
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (resources_2_1) {
                resources_2 = resources_2_1;
            }
        ],
        execute: function () {
            InventorySlot = (function () {
                function InventorySlot() {
                    this.item = Item.NONE;
                    this.count = 0;
                    this.cooldown = addTimer(0);
                }
                return InventorySlot;
            }());
            TileLayer = (function () {
                function TileLayer() {
                }
                return TileLayer;
            }());
            Tile = (function () {
                function Tile() {
                }
                return Tile;
            }());
            RecipePart = (function () {
                function RecipePart() {
                }
                return RecipePart;
            }());
            Recipe = (function () {
                function Recipe() {
                }
                return Recipe;
            }());
            GameObject = (function () {
                function GameObject() {
                    this.type = GameObjectType.NONE;
                }
                return GameObject;
            }());
            particle = (function () {
                function particle() {
                }
                return particle;
            }());
            Text = (function () {
                function Text() {
                }
                return Text;
            }());
            (function (GameObjectType) {
                GameObjectType[GameObjectType["NONE"] = 0] = "NONE";
                GameObjectType[GameObjectType["PLAYER"] = 1] = "PLAYER";
                GameObjectType[GameObjectType["MAGMA_BALL"] = 2] = "MAGMA_BALL";
                GameObjectType[GameObjectType["LAVA_BALL"] = 3] = "LAVA_BALL";
                GameObjectType[GameObjectType["METEORITE"] = 4] = "METEORITE";
                GameObjectType[GameObjectType["BOSS"] = 5] = "BOSS";
                GameObjectType[GameObjectType["MANIPULATOR"] = 6] = "MANIPULATOR";
            })(GameObjectType || (GameObjectType = {}));
            (function (GameState) {
                GameState[GameState["MENU"] = 0] = "MENU";
                GameState[GameState["GAME"] = 1] = "GAME";
            })(GameState || (GameState = {}));
            (function (TileType) {
                TileType[TileType["NONE"] = 0] = "NONE";
                TileType[TileType["EARTH"] = 1] = "EARTH";
                TileType[TileType["MOUNTAIN"] = 2] = "MOUNTAIN";
                TileType[TileType["GEYSER"] = 3] = "GEYSER";
                TileType[TileType["VOLCANO"] = 4] = "VOLCANO";
                TileType[TileType["LAVA"] = 5] = "LAVA";
                TileType[TileType["IRON"] = 6] = "IRON";
                TileType[TileType["AURIT"] = 7] = "AURIT";
                TileType[TileType["CRYSTAL"] = 8] = "CRYSTAL";
                TileType[TileType["MELTER"] = 9] = "MELTER";
                TileType[TileType["SPLITTER"] = 10] = "SPLITTER";
                TileType[TileType["SUN_BATERY"] = 11] = "SUN_BATERY";
                TileType[TileType["SILIKON"] = 12] = "SILIKON";
                TileType[TileType["STORAGE"] = 13] = "STORAGE";
                TileType[TileType["IGNEOUS"] = 14] = "IGNEOUS";
            })(TileType || (TileType = {}));
            (function (Item) {
                Item[Item["NONE"] = 0] = "NONE";
                Item[Item["IRON"] = 1] = "IRON";
                Item[Item["MELTER"] = 2] = "MELTER";
                Item[Item["SPLITTER"] = 3] = "SPLITTER";
                Item[Item["IRON_INGOT"] = 4] = "IRON_INGOT";
                Item[Item["AURIT"] = 5] = "AURIT";
                Item[Item["AURIT_INGOT"] = 6] = "AURIT_INGOT";
                Item[Item["CRYSTAL"] = 7] = "CRYSTAL";
                Item[Item["TOOLKIT"] = 8] = "TOOLKIT";
                Item[Item["SUN_BATERY"] = 9] = "SUN_BATERY";
                Item[Item["SILIKON"] = 10] = "SILIKON";
                Item[Item["STORAGE"] = 11] = "STORAGE";
                Item[Item["GOLDEN_CAMERA"] = 12] = "GOLDEN_CAMERA";
                Item[Item["KNOWLEDGE_OF_BALLISTICS"] = 13] = "KNOWLEDGE_OF_BALLISTICS";
                Item[Item["SHAKING_DETECTOR"] = 14] = "SHAKING_DETECTOR";
                Item[Item["EXTRA_SLOT"] = 15] = "EXTRA_SLOT";
                Item[Item["SHOCKPROOF_BODY"] = 16] = "SHOCKPROOF_BODY";
                Item[Item["IGNEOUS"] = 17] = "IGNEOUS";
                Item[Item["IGNEOUS_INGOT"] = 18] = "IGNEOUS_INGOT";
                Item[Item["METEORITE_STUFF"] = 19] = "METEORITE_STUFF";
            })(Item || (Item = {}));
            (function (Event) {
                Event[Event["NONE"] = 0] = "NONE";
                Event[Event["METEORITE_RAIN"] = 1] = "METEORITE_RAIN";
            })(Event || (Event = {}));
            TILE = {
                width: 200,
                height: 200,
                firstX: 0,
                firstY: 0,
                chunkSizeX: 8,
                chunkSizeY: 8,
                chunkCountX: 124,
                chunkCountY: 124
            };
            MORNING_LENGTH = 4000;
            DAY_LENGTH = 4000;
            AFTERNOON_LENGTH = 4000;
            NIGHT_LENGTH = 4000;
            ONE_DAY = MORNING_LENGTH + DAY_LENGTH + AFTERNOON_LENGTH + NIGHT_LENGTH;
            EVENT_LENGTH = 1800;
            VOLCANO_RADIUS = TILE.width * TILE.chunkSizeX * 1.5;
            GRAVITATION = 0.5;
            CAMERA_HEIGHT = 1325;
            MAGMA_BALL_SPEED = 35;
            METEORITE_SPEED = 35;
            LAVA_BALL_SPEED = 15;
            METEOR_STUFF_COOLDOWN = 250;
            MAX_RANGE = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED / GRAVITATION;
            STORAGE_SLOT_COUNT = 10;
            STRIPE_WIDTH = 200;
            STRIPE_HEIGHT = 50;
            CHUNK_PROTOTYPES = [
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
                    'F! @  ##',
                    '       #',
                    'SC # ! #',
                    'A    !  ',
                    ' @   ! #',
                    '   #@@!!',
                    '       #',
                    ' #    ##',
                ],
                [
                    '    ####',
                    '   #   #',
                    '  !!@@##',
                    '        ',
                    '  !@#   ',
                    '       #',
                    '   ##   ',
                    ' #######',
                ],
                [
                    ' @@@  @@',
                    '@@@   @@',
                    '@@@@  @@',
                    '@@C@ @@@',
                    '@@@@ @@@',
                    '@@@   @@',
                    '@@!! !!@',
                    '@@@FFF@@',
                ],
                [
                    '    @   ',
                    '@    #  ',
                    '   !@!!#',
                    '    #   ',
                    '@     # ',
                    '     000',
                    ' #   0*0',
                    '@    000',
                ],
                [
                    ' #      ',
                    ' # !!   ',
                    '  !!!!  ',
                    ' !!!!! #',
                    '  !!! ##',
                    '  !!!! #',
                    '   !!   ',
                    '@     # ',
                ],
            ];
            RECIPES = [
                {
                    result: Item.MELTER,
                    parts: [{ item: Item.IRON, count: 20, sprite: resources_2.imgIronItem },],
                    sprite: resources_2.imgMelter,
                    name: 'Плавильня',
                    description: 'Бегать с железом - это одно, а с железными слитками - другое. Можно поставить только на лаву'
                },
                {
                    result: Item.SPLITTER,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: resources_2.imgIronIngot }, { item: Item.CRYSTAL, count: 10, sprite: resources_2.imgCrystalItem }],
                    sprite: resources_2.imgSplitter,
                    name: 'Расщепитель',
                    description: 'Если сломать кристалл пополам, много энергии не выделится. Нужно что-то посерьёзнее'
                },
                {
                    result: Item.STORAGE,
                    parts: [{ item: Item.IRON_INGOT, count: 20, sprite: resources_2.imgIronIngot }],
                    sprite: resources_2.imgStorage,
                    name: 'Хранилище',
                    description: 'Это сундук из Майнкрафта, ни больше, ни меньше. Хватит вопросов!'
                },
                {
                    result: Item.TOOLKIT,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: resources_2.imgIronIngot }],
                    sprite: resources_2.imgToolkit,
                    name: 'Ремнабор',
                    description: 'Все травмы можно залатать, если они не душевные. Восполняет жизни (расходник)'
                },
                {
                    result: Item.EXTRA_SLOT,
                    parts: [{ item: Item.IRON_INGOT, count: 40, sprite: resources_2.imgIronIngot }],
                    sprite: resources_2.imgExtraSlotItem,
                    name: 'Допслот',
                    description: 'Как же замечательно иметь ещё чуть-чуть места под рукой! Сюда можно положить немного счастья.'
                },
                {
                    result: Item.SUN_BATERY,
                    parts: [{ item: Item.SILIKON, count: 45, sprite: resources_2.imgSiliconItem }, { item: Item.CRYSTAL, count: 45, sprite: resources_2.imgCrystalItem }],
                    sprite: resources_2.imgSunBatteryItem,
                    name: 'Сол панель ур.1',
                    description: 'Без батарей, как без рук! Позволяет получать энергию днём; её поставили на место вашей батареи...'
                },
                {
                    result: Item.GOLDEN_CAMERA,
                    parts: [{ item: Item.AURIT_INGOT, count: 15, sprite: resources_2.imgAuritIngot }],
                    sprite: resources_2.imgGoldenCamera,
                    name: 'Зоркая камера',
                    description: 'Действительно ауритовая вещь! Позволяет видеть врагов издалека. Выводит на экран жизни врагов и их местонахождение'
                },
                {
                    result: Item.KNOWLEDGE_OF_BALLISTICS,
                    parts: [{ item: Item.SILIKON, count: 60, sprite: resources_2.imgSiliconItem }],
                    sprite: resources_2.imgKnowledgeOfBallistics,
                    name: 'Знание баллистики',
                    description: 'С помощью силикона получилось починить книгу. Катапульты так похожи на вулканы...'
                },
                {
                    result: Item.SHAKING_DETECTOR,
                    parts: [{ item: Item.IRON_INGOT, count: 30, sprite: resources_2.imgIronIngot }],
                    sprite: resources_2.imgShakingDetector,
                    name: 'Детектор тряски',
                    description: 'Настроен различать самые мелкие колебания, даже колебания от гейзеров.'
                },
                {
                    result: Item.SHOCKPROOF_BODY,
                    parts: [{ item: Item.SILIKON, count: 30, sprite: resources_2.imgSiliconItem },
                        { item: Item.AURIT_INGOT, count: 30, sprite: resources_2.imgAuritIngot }],
                    sprite: resources_2.imgShockProofBody,
                    name: 'Крепкое тело',
                    description: 'Красивый ауритовый корпус говорит о непрочности, но слой силикона говорит обратное. Больше жизней'
                },
                {
                    result: Item.METEORITE_STUFF,
                    parts: [{ item: Item.IGNEOUS_INGOT, count: 20, sprite: resources_2.imgIgneousIngot }],
                    sprite: resources_2.imgMeteoriteStuff,
                    name: 'Метеопосох',
                    description: 'Эта вещь может вызвать метеорит, который упадёт на выбранную область. Хорошо бабахнуло'
                },
            ];
            GAME_LENGTH = ONE_DAY * 3;
            timers = [];
            map = [];
            slotCount = 5;
            inventory = [];
            drawQueue = [];
            alpha = 0;
            gameObjects = [];
            particles = [];
            globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);
            screenShakes = [{ strength: 0, duration: addTimer(0) }];
            craftMode = false;
            firstRecipeIndex = 0;
            mainSlot = 0;
            controlledStorage = null;
            dayTimer = addTimer(ONE_DAY);
            gameTimer = addTimer(GAME_LENGTH);
            event = Event.NONE;
            timeBetweenEvents = GAME_LENGTH / 4;
            eventEnd = GAME_LENGTH;
            hpShakeTimer = addTimer(0);
            globalBoss = null;
            recentShake = { strength: 0, duration: addTimer(0) };
            gameState = GameState.MENU;
            menuTexts = [];
            resources_2.handleResize();
            for (var i = 0; i < slotCount; i++) {
                inventory.push(new InventorySlot());
            }
            MORNING_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH + MORNING_LENGTH;
            DAY_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH;
            AFTERNOON_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH;
            NIGHT_TIME = NIGHT_LENGTH;
            buildMap();
            playText = addMenuText(-resources_2.camera.width / 2 + 165, -resources_2.camera.height / 2 + 400, 130, 60, 'играть', 'White', 40, resources_2.Layer.UI);
            controlsText = addMenuText(-resources_2.camera.width / 2 + 215, -resources_2.camera.height / 2 + 470, 130, 60, 'управление', 'White', 40, resources_2.Layer.UI);
            instructions = false;
            musik = null;
            requestAnimationFrame(loop);
        }
    };
});
//# sourceMappingURL=index.js.map