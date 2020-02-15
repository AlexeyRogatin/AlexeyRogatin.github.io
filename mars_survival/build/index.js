System.register("drawing", [], function (exports_1, context_1) {
    "use strict";
    var canvas, ctx, backBuffer, backCtx, resourcesLoadedCount, resourcesWaitingForLoadCount, canBeginGame, Layer, DrawQueueType, DrawQueueItem, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera, imgEarth1, imgEarth2, imgEarth3, imgGeyser, imgMountain, imgAbyss, imgIron1, imgIron2, imgIron3, imgIron4, imgIron5, imgIronItem, imgArrow, imgCrafts, imgArrow1, imgMelter, imgIronIngot, imgAurit1, imgAurit2, imgAurit3, imgAurit4, imgAurit5, imgAuritItem, imgAuritIngot, imgCrystal1, imgCrystal2, imgCrystal3, imgCrystal4, imgCrystal5, imgCrystalItem, imgSplitter, imgToolkit, imgSunBatteryAdd, imgSunBatteryItem, imgSunBattery, imgSilicon1, imgSilicon2, imgSilicon3, imgSilicon4, imgSilicon5, imgSiliconItem, imgVolcano, imgMagmaBall, imgStorage, imgGoldenCamera, imgExtraSlot, imgExtraSlotItem, imgAlert, imgShockProofBody, imgMeteorite, imgIgneous, imgIgneousItem, imgIgneousIngot, imgMeteoriteStuff, imgBoss, imgArrow2, imgManipulator, imgMechanicalHand, imgEnergy, imgHp, imgDrop, imgBossReadyToAttack, imgBossReadyToAttack1, imgBossAttack, imgBossAttack1, imgLazer, imgLazer1;
    var __moduleName = context_1 && context_1.id;
    function resourceLoaded(src) {
        resourcesLoadedCount++;
        if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
            exports_1("canBeginGame", canBeginGame = true);
        }
    }
    function loadImage(src) {
        var img = new Image();
        img.src = src;
        resourcesWaitingForLoadCount++;
        img.onload = function () { return resourceLoaded(src); };
        return img;
    }
    exports_1("loadImage", loadImage);
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
                    if (item.outlineOnly) {
                        ctx.strokeStyle = item.color[0];
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
                    if (item.outlineOnly) {
                        ctx.strokeStyle = item.color[0];
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
            exports_1("canvas", canvas = document.getElementById("canvas"));
            exports_1("ctx", ctx = canvas.getContext("2d"));
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            exports_1("backBuffer", backBuffer = document.createElement('canvas'));
            exports_1("backCtx", backCtx = backBuffer.getContext('2d'));
            backBuffer.width = canvas.width;
            backBuffer.height = canvas.height;
            resourcesLoadedCount = 0;
            resourcesWaitingForLoadCount = 0;
            exports_1("canBeginGame", canBeginGame = false);
            (function (Layer) {
                Layer[Layer["UI"] = 0] = "UI";
                Layer[Layer["BOSS_EYE"] = 1] = "BOSS_EYE";
                Layer[Layer["FORGROUND"] = 2] = "FORGROUND";
                Layer[Layer["METEORITE"] = 3] = "METEORITE";
                Layer[Layer["PARTICLES"] = 4] = "PARTICLES";
                Layer[Layer["BOSS"] = 5] = "BOSS";
                Layer[Layer["BOSS_LEG"] = 6] = "BOSS_LEG";
                Layer[Layer["MANIPULATOR"] = 7] = "MANIPULATOR";
                Layer[Layer["ON_TILE"] = 8] = "ON_TILE";
                Layer[Layer["PLAYER"] = 9] = "PLAYER";
                Layer[Layer["TILE"] = 10] = "TILE";
                Layer[Layer["NONE"] = 11] = "NONE";
            })(Layer || (Layer = {}));
            exports_1("Layer", Layer);
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
                    this.layer = Layer.TILE;
                    this.type = DrawQueueType.NONE;
                    this.width = 0;
                    this.height = 0;
                    this.angle = 0;
                    this.color = ['white', 'black'];
                    this.stop = [0, 1];
                    this.sprite = null;
                    this.radius = 0;
                    this.text = '';
                    this.textSize = 60;
                    this.outlineOnly = false;
                    this.fromThePoint = false;
                    this.drawFromThePoint = false;
                }
                return DrawQueueItem;
            }());
            exports_1("DrawQueueItem", DrawQueueItem);
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
            exports_1("imgAbyss", imgAbyss = loadImage('../sprites/abyss.png'));
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
            exports_1("imgDrop", imgDrop = loadImage('../sprites/drop.png'));
            exports_1("imgBossReadyToAttack", imgBossReadyToAttack = loadImage('../sprites/bossReadyToAttack.png'));
            exports_1("imgBossReadyToAttack1", imgBossReadyToAttack1 = loadImage('../sprites/bossReadyToAttack1.png'));
            exports_1("imgBossAttack", imgBossAttack = loadImage('../sprites/bossAttack.png'));
            exports_1("imgBossAttack1", imgBossAttack1 = loadImage('../sprites/bossAttack1.png'));
            exports_1("imgLazer", imgLazer = loadImage('../sprites/lazer.png'));
            exports_1("imgLazer1", imgLazer1 = loadImage('../sprites/lazer1.png'));
        }
    };
});
System.register("controls", ["drawing"], function (exports_2, context_2) {
    "use strict";
    var drawing_1, mouseX, mouseY, KeyCode, Key, Mouse, upKey, leftKey, downKey, rightKey, mouse, qKey, shiftKey;
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
        mouse.wentUp = false;
        mouse.wentDown = false;
    }
    exports_2("clearAllKeys", clearAllKeys);
    return {
        setters: [
            function (drawing_1_1) {
                drawing_1 = drawing_1_1;
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
            window.onkeydown = function onkeydown(event) {
                handleKeyDown(event, KeyCode.UP, upKey);
                handleKeyDown(event, KeyCode.DOWN, downKey);
                handleKeyDown(event, KeyCode.LEFT, leftKey);
                handleKeyDown(event, KeyCode.RIGHT, rightKey);
                handleKeyDown(event, KeyCode.Q, qKey);
                handleKeyDown(event, KeyCode.SHIFT, shiftKey);
            };
            window.onkeyup = function onkeyup(event) {
                handleKeyUp(event, KeyCode.UP, upKey);
                handleKeyUp(event, KeyCode.DOWN, downKey);
                handleKeyUp(event, KeyCode.LEFT, leftKey);
                handleKeyUp(event, KeyCode.RIGHT, rightKey);
                handleKeyUp(event, KeyCode.Q, qKey);
                handleKeyUp(event, KeyCode.SHIFT, shiftKey);
            };
            window.onmousemove = function onmousemove(event) {
                mouse.x = event.clientX - drawing_1.canvas.clientLeft;
                mouse.y = event.clientY - drawing_1.canvas.clientTop;
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
System.register("index", ["controls", "drawing"], function (exports_3, context_3) {
    "use strict";
    var controls_1, drawing_2, GameObjectType, TileType, camera, TILE, timers, InventorySlot, Tile, map, chunkPrototypes, Item, RecipePart, Recipe, recipes, slotCount, inventory, drawQueue, alpha, MORNING_LENGTH, DAY_LENGTH, AFTERNOON_LENGTH, NIGHT_LENGTH, ONE_DAY, gameObjects, GameObject, particles, particle, globalPlayer, screenShakes, craftMode, pause, firstRecipeIndex, mainSlot, controlledStorage, dayTimer, gameLength, gameTimer, Event, event, EVENT_LENGTH, timeBetweenEvents, eventEnd, VOLCANO_RADIUS, VOLCANO_HEIGHT, GRAVITATION, CAMERA_HEIGHT, MAGMA_BALL_SPEED, METEORITE_SPEED, LAVA_BALL_SPEED, METEOR_STUFF_COOLDOWN, MAX_RANGE, STORAGE_SLOT_COUNT, hpShakeTimer, globalBoss, recentShake;
    var __moduleName = context_3 && context_3.id;
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
    function drawSprite(x, y, sprite, angle, width, height, fromThePoint, layer) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (fromThePoint === void 0) { fromThePoint = false; }
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        var mainSide = width;
        if (height > width) {
            mainSide = height;
        }
        if (!fromThePoint) {
            if (x > camera.x - camera.width * 0.5 - mainSide / 2 &&
                x < camera.x + camera.width * 0.5 + mainSide / 2 &&
                y > camera.y - camera.height * 0.5 - mainSide / 2 &&
                y < camera.y + camera.height * 0.5 + mainSide / 2) {
                drawQueue.push({ x: x, y: y, sprite: sprite, angle: angle, width: width, height: height, fromThePoint: fromThePoint, layer: layer, type: drawing_2.DrawQueueType.IMAGE });
            }
        }
        else {
            if (x > camera.x - camera.width * 0.5 - mainSide * 4 &&
                x < camera.x + camera.width * 0.5 + mainSide * 4 &&
                y > camera.y - camera.height * 0.5 - mainSide * 4 &&
                y < camera.y + camera.height * 0.5 + mainSide * 4) {
                drawQueue.push({ x: x, y: y, sprite: sprite, angle: angle, width: width, height: height, fromThePoint: fromThePoint, layer: layer, type: drawing_2.DrawQueueType.IMAGE });
            }
        }
    }
    exports_3("drawSprite", drawSprite);
    function drawRect(x, y, width, height, angle, color, outlineOnly, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        if (x > camera.x - camera.width * 0.5 - width / 2 &&
            x < camera.x + camera.width * 0.5 + width / 2 &&
            y > camera.y - camera.height * 0.5 - height / 2 &&
            y < camera.y + camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, width: width, height: height, color: [color], angle: angle, layer: layer, outlineOnly: outlineOnly, type: drawing_2.DrawQueueType.RECT });
        }
    }
    exports_3("drawRect", drawRect);
    function drawCircle(x, y, radius, color, outlineOnly, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        if (x > camera.x - camera.width * 0.5 - radius &&
            x < camera.x + camera.width * 0.5 + radius &&
            y > camera.y - camera.height * 0.5 - radius &&
            y < camera.y + camera.height * 0.5 + radius) {
            drawQueue.push({ x: x, y: y, radius: radius, color: [color], layer: layer, outlineOnly: outlineOnly, type: drawing_2.DrawQueueType.CIRCLE });
        }
    }
    exports_3("drawCircle", drawCircle);
    function drawText(x, y, color, text, textSize, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.UI; }
        if (x > camera.x - camera.width * 0.5 - textSize / 2 &&
            x < camera.x + camera.width * 0.5 + textSize / 2 &&
            y > camera.y - camera.height * 0.5 - textSize / 2 &&
            y < camera.y + camera.height * 0.5 + textSize / 2) {
            drawQueue.push({ x: x, y: y, color: [color], text: text, layer: layer, type: drawing_2.DrawQueueType.TEXT, textSize: textSize });
        }
    }
    exports_3("drawText", drawText);
    function drawLinearGradient(x, y, width, height, color, stop, layer) {
        if (x > camera.x - camera.width * 0.5 - width / 2 &&
            x < camera.x + camera.width * 0.5 + width / 2 &&
            y > camera.y - camera.height * 0.5 - height / 2 &&
            y < camera.y + camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, width: width, height: height, color: color, stop: stop, layer: layer, type: drawing_2.DrawQueueType.LINEAR_GRADIENT });
        }
    }
    exports_3("drawLinearGradient", drawLinearGradient);
    function drawLight(x, y, radius) {
        alpha = 0;
        var MORNING_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH + MORNING_LENGTH;
        var DAY_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH;
        var AFTERNOON_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH;
        var NIGHT_TIME = NIGHT_LENGTH;
        if (timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) {
            alpha = 1 - (MORNING_TIME - timers[dayTimer]) / (MORNING_TIME - DAY_TIME);
        }
        else if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
            if (globalPlayer.sunBateryLvl) {
                timers[globalPlayer.energy] += 0.005;
                if (timers[globalPlayer.energy] > globalPlayer.maxEnergy) {
                    timers[globalPlayer.energy] = globalPlayer.maxEnergy;
                }
            }
            alpha = 0;
        }
        else if (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME) {
            alpha = (AFTERNOON_TIME - timers[dayTimer]) / (AFTERNOON_TIME - NIGHT_TIME);
        }
        else if (timers[dayTimer] <= NIGHT_TIME) {
            alpha = 1;
        }
        if (x > camera.x - camera.width * 0.5 - radius &&
            x < camera.x + camera.width * 0.5 + radius &&
            y > camera.y - camera.height * 0.5 - radius &&
            y < camera.y + camera.height * 0.5 + radius) {
            drawing_2.backCtx.globalCompositeOperation = 'destination-out';
            var X = x - camera.x + camera.width / 2;
            var Y = y - camera.y + camera.height / 2;
            var gradient = drawing_2.backCtx.createRadialGradient(X, Y, 0, X, Y, radius);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, 'transparent');
            drawing_2.backCtx.fillStyle = gradient;
            drawing_2.backCtx.fillRect(X - radius, Y - radius, 2 * radius, 2 * radius);
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
            width: 100 * camera.range,
            height: 100 * camera.range,
            angle: 0,
            color: 'grey',
            exists: true,
            speed: 0,
            speedX: 0,
            speedY: 0,
            speedLimit: 3 * camera.range,
            speedBackReduction: 0.5,
            friction: 0.95 * camera.range,
            accel: 0,
            accelConst: 0.04 * camera.range,
            rotationSpeed: 0.08,
            goForward: false,
            goBackward: false,
            goLeft: false,
            goRight: false,
            sprite: drawing_2.imgNone,
            leftWeel: 1,
            rightWeel: 1,
            hitpoints: 0,
            maxHitpoints: 0,
            energy: 0,
            maxEnergy: 0,
            unhitableTimer: addTimer(0),
            doNotDraw: false,
            sunBateryLvl: 0,
            cameraLvl: 0,
            stuckable: false,
            lifeTime: 0,
            angleZ: 0,
            summoned: false,
            dontMoveWithCamera: false,
            specialTimer: null,
            attack: null
        };
        if (gameObject.type === GameObjectType.PLAYER) {
            gameObject.sprite = drawing_2.imgPlayer;
            gameObject.hitpoints = 100;
            gameObject.maxHitpoints = 100;
            gameObject.energy = addTimer(10800);
            gameObject.maxEnergy = 10800;
            gameObject.stuckable = true;
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            gameObject.sprite = drawing_2.imgMagmaBall;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.angleZ = randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
        }
        if (gameObject.type === GameObjectType.METEORITE) {
            gameObject.sprite = drawing_2.imgMeteorite;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.angleZ = -randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
        }
        if (gameObject.type === GameObjectType.LAVA_BALL) {
            gameObject.sprite = drawing_2.imgMagmaBall;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.angleZ = randomFloat(0, 0.25 * Math.PI);
        }
        if (gameObject.type === GameObjectType.BOSS) {
            gameObject.sprite = drawing_2.imgBoss;
            gameObject.width = 800 * camera.range;
            gameObject.height = 600 * camera.range;
            gameObject.speedLimit = 15 * camera.range;
            gameObject.rotationSpeed = 0.01;
            gameObject.specialTimer = addTimer(100);
        }
        if (gameObject.type === GameObjectType.MANIPULATOR) {
            gameObject.firstX = gameObject.x - globalBoss.x;
            gameObject.firstY = gameObject.y - globalBoss.y;
            gameObject.sprite = drawing_2.imgMechanicalHand;
            gameObject.width = 200 * camera.range;
            gameObject.height = 200 * camera.range;
            gameObject.speedLimit = globalBoss.speedLimit * 2 * camera.range;
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
        gameObject.speed += gameObject.accel;
        if (gameObject.speed > gameObject.speedLimit) {
            gameObject.speed = gameObject.speedLimit;
        }
        if (gameObject.speed < -0.75 * gameObject.speedLimit) {
            gameObject.speed = -0.75 * gameObject.speedLimit;
        }
        gameObject.speedX = gameObject.speed * Math.cos(gameObject.angle);
        gameObject.speedY = gameObject.speed * Math.sin(gameObject.angle);
        for (var tileIndex = 0; tileIndex < map.length; tileIndex++) {
            var other = map[tileIndex];
            var wallLeft = other.x * TILE.width - other.collisionWidth / 2;
            var wallRight = other.x * TILE.width + other.collisionWidth / 2;
            var wallTop = other.y * TILE.height - other.collisionHeight / 2;
            var wallBottom = other.y * TILE.height + other.collisionHeight / 2;
            var playerLeft = gameObject.x - gameObject.width / 2;
            var playerRight = gameObject.x + gameObject.width / 2;
            var playerTop = gameObject.y - gameObject.height / 2;
            var playerBottom = gameObject.y + gameObject.height / 2;
            if (gameObject.stuckable && (other.upperLayer === TileType.MOUNTAIN || other.baseLayer === TileType.VOLCANO ||
                other.upperLayer === TileType.MELTER || other.upperLayer === TileType.SPLITTER ||
                other.upperLayer === TileType.SUN_BATERY || other.upperLayer === TileType.STORAGE)) {
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
            radius: randomRadius * camera.range,
            speedX: speedX * camera.range,
            speedY: speedY * camera.range,
            accelX: accelX * camera.range,
            accelY: accelY * camera.range,
            sizeDecrease: randomSizeDecrease * camera.range
        };
        particles.push(particle);
    }
    function burstParticles(_a) {
        var x = _a.x, y = _a.y, color = _a.color, speed = _a.speed, size = _a.size, count = _a.count, decrease = _a.decrease, accel = _a.accel;
        for (var particleIndex = 0; particleIndex < count; particleIndex++) {
            addParticle(x, y, color, speed, size, decrease, accel);
        }
    }
    function drawParticles() {
        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            var particle_1 = particles[particleIndex];
            if (particle_1.radius <= 0) {
                removeParticle(particleIndex);
            }
            else {
                drawCircle(particle_1.x, particle_1.y, particle_1.radius, particle_1.color, false, drawing_2.Layer.PARTICLES);
                if (particle_1.color === 'red' || particle_1.color === "rgb(254,0,0,1)") {
                    drawLight(particle_1.x, particle_1.y, particle_1.radius * 4);
                }
            }
            if (!pause) {
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
    function screenToWorld(x, y) {
        var result = [
            x + camera.x - camera.width * 0.5,
            y + camera.y - camera.height * 0.5,
        ];
        return result;
    }
    exports_3("screenToWorld", screenToWorld);
    function worldToScreen(x, y) {
        var result = [
            x - camera.x + camera.width * 0.5,
            y - camera.y + camera.height * 0.5,
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
        if (!(gameObject.x > x - (TILE.width / 2 + gameObject.width / 2) &&
            gameObject.x < x + (TILE.width / 2 + gameObject.width / 2) &&
            gameObject.y > y - (TILE.height / 2 + gameObject.width / 2) &&
            gameObject.y < y + (TILE.height / 2 + gameObject.width / 2))) {
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
        var sprite = drawing_2.imgNone;
        switch (tileType) {
            case TileType.GEYSER:
                {
                    sprite = drawing_2.imgGeyser;
                    if (tile.upperLayer === TileType.NONE) {
                        if (tile.x * TILE.width > camera.x - camera.width / 2 - tile.width / 2
                            && tile.x * TILE.width < camera.x + camera.width / 2 + tile.width / 2
                            && tile.y * TILE.height > camera.y - camera.height / 2 - tile.height / 2
                            && tile.y * TILE.height < camera.y + camera.height / 2 + tile.height / 2) {
                            var burstMaxDuration = 300;
                            var geyserMinRecharge = 500;
                            var geyserMaxRecharge = 1500;
                            if (globalPlayer.cameraLvl === 1 && timers[tile.specialTimer] < burstMaxDuration + 50 && timers[tile.specialTimer] > burstMaxDuration) {
                                drawSprite(tile.x * tile.width, tile.y * tile.height, drawing_2.imgAlert, 0, tile.width, tile.height, false, drawing_2.Layer.ON_TILE);
                            }
                            if (timers[tile.specialTimer] <= 0) {
                                timers[tile.specialTimer] = randomInt(geyserMinRecharge, geyserMaxRecharge);
                            }
                            if (timers[tile.specialTimer] === burstMaxDuration) {
                                timers[tile.specialTimer] = randomInt(burstMaxDuration / 10, burstMaxDuration);
                            }
                            if (timers[tile.specialTimer] <= burstMaxDuration && !pause) {
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
                                    size: 40,
                                    decrease: 1,
                                    accel: -0.05,
                                    count: 1
                                });
                            }
                        }
                    }
                }
                break;
            case TileType.EARTH_1:
                {
                    sprite = drawing_2.imgEarth1;
                }
                break;
            case TileType.EARTH_2:
                {
                    sprite = drawing_2.imgEarth2;
                }
                break;
            case TileType.EARTH_3:
                {
                    sprite = drawing_2.imgEarth3;
                }
                break;
            case TileType.LAVA:
                {
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, TILE.width * 1.2);
                    sprite = drawing_2.imgAbyss;
                }
                break;
            case TileType.MELTER:
                {
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, TILE.width * 0.75);
                    sprite = drawing_2.imgMelter;
                    if (timers[tile.specialTimer] > 0) {
                        drawText(tile.x * TILE.width - 10, tile.y * TILE.height, 'blue', "" + Math.round(timers[tile.specialTimer] / 60), 30, drawing_2.Layer.UI);
                    }
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SPLITTER:
                {
                    sprite = drawing_2.imgSplitter;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SUN_BATERY:
                {
                    sprite = drawing_2.imgSunBattery;
                }
                break;
            case TileType.IRON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgIron1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgIron2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgIron3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgIron4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgIron5;
                    }
                }
                break;
            case TileType.AURIT:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgAurit1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgAurit2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgAurit3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgAurit4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgAurit5;
                    }
                }
                break;
            case TileType.CRYSTAL:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgCrystal1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgCrystal2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgCrystal3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgCrystal4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgCrystal5;
                    }
                }
                break;
            case TileType.SILIKON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgSilicon1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgSilicon2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgSilicon3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgSilicon4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgSilicon5;
                    }
                }
                break;
            case TileType.IGNEOUS:
                {
                    sprite = drawing_2.imgIgneous;
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 1.2);
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) < 100 && timers[globalPlayer.unhitableTimer] <= 0) {
                        globalPlayer.hitpoints -= 0.2;
                    }
                }
                break;
            case TileType.MOUNTAIN:
                {
                    sprite = drawing_2.imgMountain;
                }
                break;
            case TileType.VOLCANO:
                {
                    sprite = drawing_2.imgVolcano;
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 0.6);
                    if (distanceBetweenPoints(camera.x, camera.y, tile.x * TILE.width, tile.y * TILE.width) < VOLCANO_RADIUS) {
                        if (timers[tile.specialTimer] === 0 && !pause) {
                            addGameObject(GameObjectType.MAGMA_BALL, tile.x * TILE.width, tile.y * TILE.height);
                            timers[tile.specialTimer] = randomInt(60, 240);
                        }
                    }
                }
                break;
            case TileType.STORAGE:
                {
                    sprite = drawing_2.imgStorage;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                    drawLight(tile.x * tile.width, tile.y * tile.height, tile.width * 1.2);
                }
                break;
        }
        if (globalBoss && tile.upperLayer && distanceBetweenPoints(globalBoss.x, globalBoss.y, tile.x * TILE.width, tile.y * TILE.height) <= globalBoss.height / 2 + tile.width / 2) {
            tile.upperLayer = TileType.NONE;
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
        drawSprite(spriteX, spriteY, sprite, 0, tile.width, tile.height, false, drawing_2.Layer.TILE);
    }
    function updateTileMap() {
        for (var y = 0; y < TILE.chunkCountY * TILE.chunkSizeY; y++) {
            for (var x = 0; x < TILE.chunkCountX * TILE.chunkSizeX; x++) {
                var tile = map[getIndexFromCoords(x, y)];
                updateTile(tile.baseLayer, tile);
                updateTile(tile.upperLayer, tile);
            }
        }
    }
    function updateGameObject(gameObject) {
        if (craftMode) {
            pause = true;
        }
        else {
            pause = false;
        }
        var mouseTile = getTileUnderMouse();
        if (timers[gameObject.unhitableTimer] > 0) {
            gameObject.doNotDraw = !gameObject.doNotDraw;
        }
        if (timers[gameObject.unhitableTimer] === 0) {
            gameObject.doNotDraw = false;
        }
        if (gameObject.type === GameObjectType.PLAYER) {
            if (!gameObject.doNotDraw) {
                drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, drawing_2.Layer.PLAYER);
            }
            controlGameObject(gameObject);
            drawLight(gameObject.x, gameObject.y, gameObject.width * 2.5);
            if (globalBoss &&
                !(globalBoss.x > camera.x - camera.width / 2 &&
                    globalBoss.x < camera.x + camera.width / 2 &&
                    globalBoss.y > camera.y - camera.height / 2 &&
                    globalBoss.y < camera.y + camera.height / 2)) {
                var angle_1 = angleBetweenPoints(camera.x, camera.y, globalBoss.x, globalBoss.y);
                drawSprite(camera.x, camera.y, drawing_2.imgArrow2, angle_1, camera.height, camera.height, false, drawing_2.Layer.UI);
            }
            for (var slotIndex = 0; slotIndex < slotCount; slotIndex++) {
                drawRect(camera.x - slotCount * 40 / 2 + slotIndex * 50, camera.y + camera.height / 2 - 50, 50, 50, 0, 'grey', true, drawing_2.Layer.UI);
            }
            drawSprite(camera.x - camera.width / 2 + 10, camera.y - camera.height / 4, drawing_2.imgArrow, 0, 30, 50, false, drawing_2.Layer.UI);
            var STRIPE_WIDTH = 200;
            var STRIPE_HEIGHT = 50;
            var width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;
            if (width <= STRIPE_WIDTH / 2 && timers[hpShakeTimer] === 0) {
                timers[hpShakeTimer] = width / STRIPE_WIDTH * 800;
            }
            var shakeX = 0;
            var shakeY = 0;
            if (timers[hpShakeTimer] < 50 && timers[hpShakeTimer] !== 0) {
                shakeX = randomInt(-5, 5);
                shakeY = randomInt(-5, 5);
            }
            drawLinearGradient(camera.x - camera.width / 2 + width / 2 + 50 + shakeX, camera.y - camera.height / 2 + 50 + shakeY, width, STRIPE_HEIGHT, ['red', "rgb(" + (1 - width / STRIPE_WIDTH) * 255 + "," + width / STRIPE_WIDTH * 255 + ",0,1)"], [0, 1], drawing_2.Layer.UI);
            drawSprite(camera.x - camera.width / 2 + 50 + STRIPE_WIDTH / 2 + shakeX, camera.y - camera.height / 2 + 50 + shakeY, drawing_2.imgHp, 0, STRIPE_WIDTH, STRIPE_HEIGHT, false, drawing_2.Layer.UI);
            width = timers[gameObject.energy] / gameObject.maxEnergy * STRIPE_WIDTH;
            drawLinearGradient(camera.x - camera.width / 2 + width / 2 + 300, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT, ['white', "rgb(" + (1 - width / STRIPE_WIDTH) * 255 + "," + (1 - width / STRIPE_WIDTH) * 255 + "," + (width / STRIPE_WIDTH * 255 + 255) + ",1)"], [0, 1], drawing_2.Layer.UI);
            drawSprite(camera.x - camera.width / 2 + 300 + STRIPE_WIDTH / 2, camera.y - camera.height / 2 + 50, drawing_2.imgEnergy, 0, STRIPE_WIDTH * 1.05, STRIPE_HEIGHT, false, drawing_2.Layer.UI);
            var hour = ONE_DAY / (24 + 37 / 60);
            var minute = hour / 60;
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 50, 'blue', Math.floor((ONE_DAY - timers[dayTimer]) / hour) + " : " + Math.floor((ONE_DAY - timers[dayTimer]) / minute) % 60, 25, drawing_2.Layer.UI);
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 100, 'blue', "x: " + Math.round((gameObject.x) / TILE.width), 25, drawing_2.Layer.UI);
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 130, 'blue', "y: " + Math.round((gameObject.y) / TILE.height), 25, drawing_2.Layer.UI);
            if (controls_1.qKey.wentDown) {
                inventory[mainSlot] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
            }
            if (isInventoryFullForItem(Item.NONE)) {
                drawText(camera.x + camera.width / 8, camera.y + camera.height / 2 - 40, 'green', 'Нажмите на Q, чтобы выбросить вещь', 25, drawing_2.Layer.UI);
            }
            var vector1 = rotateVector(20 * camera.range, 0, gameObject.angle + Math.PI / 4);
            var vector2 = rotateVector(20 * camera.range, 0, gameObject.angle + Math.PI * 3 / 4);
            var vector3 = rotateVector(20 * camera.range, 0, gameObject.angle - Math.PI / 4);
            var vector4 = rotateVector(20 * camera.range, 0, gameObject.angle - Math.PI * 3 / 4);
            var mapTile1 = getIndexFromCoords(Math.round((gameObject.x + vector1[0]) / TILE.width), Math.round((gameObject.y + vector1[1]) / TILE.height));
            var mapTile2 = getIndexFromCoords(Math.round((gameObject.x + vector2[0]) / TILE.width), Math.round((gameObject.y + vector2[1]) / TILE.height));
            var mapTile3 = getIndexFromCoords(Math.round((gameObject.x + vector3[0]) / TILE.width), Math.round((gameObject.y + vector3[1]) / TILE.height));
            var mapTile4 = getIndexFromCoords(Math.round((gameObject.x + vector4[0]) / TILE.width), Math.round((gameObject.y + vector4[1]) / TILE.height));
            if (map[mapTile1] && map[mapTile2] && map[mapTile3] && map[mapTile4] && map[mapTile1].baseLayer === TileType.LAVA && map[mapTile2].baseLayer === TileType.LAVA && map[mapTile3].baseLayer === TileType.LAVA && map[mapTile4].baseLayer === TileType.LAVA) {
                gameObject.exists = false;
            }
            for (var itemIndex = 0; itemIndex <= inventory.length; itemIndex++) {
                if (inventory[itemIndex]) {
                    var x = camera.x - slotCount * 20;
                    var y = camera.y + camera.height / 2 - 50;
                    var sprite = null;
                    if (inventory[itemIndex].item === Item.NONE) {
                        sprite = drawing_2.imgNone;
                    }
                    if (inventory[itemIndex].item === Item.IRON) {
                        sprite = drawing_2.imgIronItem;
                    }
                    if (inventory[itemIndex].item === Item.MELTER) {
                        sprite = drawing_2.imgMelter;
                    }
                    if (inventory[itemIndex].item === Item.IRON_INGOT) {
                        sprite = drawing_2.imgIronIngot;
                    }
                    if (inventory[itemIndex].item === Item.AURIT) {
                        sprite = drawing_2.imgAuritItem;
                    }
                    if (inventory[itemIndex].item === Item.AURIT_INGOT) {
                        sprite = drawing_2.imgAuritIngot;
                    }
                    if (inventory[itemIndex].item === Item.CRYSTAL) {
                        sprite = drawing_2.imgCrystalItem;
                    }
                    if (inventory[itemIndex].item === Item.SPLITTER) {
                        sprite = drawing_2.imgSplitter;
                    }
                    if (inventory[itemIndex].item === Item.TOOLKIT) {
                        sprite = drawing_2.imgToolkit;
                    }
                    if (inventory[itemIndex].item === Item.SUN_BATERY) {
                        sprite = drawing_2.imgSunBatteryItem;
                    }
                    if (inventory[itemIndex].item === Item.SILIKON) {
                        sprite = drawing_2.imgSiliconItem;
                    }
                    if (inventory[itemIndex].item === Item.STORAGE) {
                        sprite = drawing_2.imgStorage;
                    }
                    if (inventory[itemIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = drawing_2.imgGoldenCamera;
                    }
                    if (inventory[itemIndex].item === Item.EXTRA_SLOT) {
                        sprite = drawing_2.imgExtraSlotItem;
                    }
                    if (inventory[itemIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = drawing_2.imgShockProofBody;
                    }
                    if (inventory[itemIndex].item === Item.IGNEOUS) {
                        sprite = drawing_2.imgIgneousItem;
                    }
                    if (inventory[itemIndex].item === Item.IGNEOUS_INGOT) {
                        sprite = drawing_2.imgIgneousIngot;
                    }
                    if (inventory[itemIndex].item === Item.METEORITE_STUFF) {
                        sprite = drawing_2.imgMeteoriteStuff;
                    }
                    if (itemIndex === mainSlot) {
                        drawRect(x + 50 * itemIndex, y, 50, 50, 0, 'green', true, drawing_2.Layer.UI);
                    }
                    drawSprite(x + 50 * itemIndex, y, sprite, 0, 40, 40, false, drawing_2.Layer.UI);
                    if (inventory[itemIndex].count > 1) {
                        drawText(x - 5 + 50 * itemIndex, y - 34, 'green', "" + inventory[itemIndex].count, 25, drawing_2.Layer.UI);
                    }
                    var STRIPE_HEIGHT_1 = 10;
                    var STRIPE_WIDTH_1 = 30;
                    width = timers[inventory[mainSlot].cooldown] / METEOR_STUFF_COOLDOWN * STRIPE_WIDTH_1;
                    drawRect(x, y + 30, width, STRIPE_HEIGHT_1, 0, 'white', false, drawing_2.Layer.UI);
                }
            }
            for (var slotIndex = 0; slotIndex < slotCount; slotIndex++) {
                var slotX = camera.x - slotCount * 40 / 2 + slotIndex * 50;
                var slotY = camera.y + camera.height / 2 - 50;
                if (controls_1.mouse.wentDown &&
                    controls_1.mouse.worldX > slotX - 20 &&
                    controls_1.mouse.worldX < slotX + 20 &&
                    controls_1.mouse.worldY > slotY - 20 &&
                    controls_1.mouse.worldY < slotY + 20) {
                    mainSlot = slotIndex;
                    if (controlledStorage && !isStoraggeFullForItem(inventory[mainSlot].item, controlledStorage)) {
                        addItemToStorage(inventory[mainSlot].item, inventory[mainSlot].count, controlledStorage);
                        removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                    }
                }
            }
            if (controls_1.upKey.isDown || controls_1.downKey.isDown || controls_1.rightKey.isDown || controls_1.leftKey.isDown) {
                craftMode = false;
            }
            if (craftMode && controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 + 130 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 170 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 + 2 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 30 &&
                recipes[firstRecipeIndex - 1]) {
                firstRecipeIndex--;
            }
            if (craftMode && controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 + 130 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 170 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 + 422 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 450 &&
                recipes[firstRecipeIndex + 3]) {
                firstRecipeIndex++;
            }
            if (controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 - 10 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 25 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 - 25 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 25) {
                craftMode = !craftMode;
            }
            else if (craftMode) {
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 200 + 25, drawing_2.imgCrafts, 0, 300, 400, false, drawing_2.Layer.UI);
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 15, drawing_2.imgArrow1, 0, 40, 26, false, drawing_2.Layer.UI);
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 435, drawing_2.imgArrow1, 1 * Math.PI, 40, 26, false, drawing_2.Layer.UI);
                for (var itemIndex = 0; itemIndex < 3; itemIndex++) {
                    drawSprite(camera.x - camera.width / 2 + 60, camera.y - camera.height / 4 + 90 + 133 * itemIndex, recipes[firstRecipeIndex + itemIndex].sprite, 0, 70, 70, false, drawing_2.Layer.UI);
                    drawText(camera.x - camera.width / 2 + 100, camera.y - camera.height / 4 + 50 + 133 * itemIndex, 'black', recipes[firstRecipeIndex + itemIndex].name, 25, drawing_2.Layer.UI);
                    for (var partIndex = 0; partIndex < recipes[firstRecipeIndex + itemIndex].parts.length; partIndex++) {
                        var row = 0;
                        if (partIndex > 2) {
                            row = 1;
                        }
                        drawSprite(camera.x - camera.width / 2 + 130 + 50 * partIndex - 150 * row, camera.y - camera.height / 4 + 90 + 133 * itemIndex + 50 * row, recipes[firstRecipeIndex + itemIndex].parts[partIndex].sprite, 0, 30, 30, false, drawing_2.Layer.UI);
                        drawText(camera.x - camera.width / 2 + 120 + 50 * partIndex - 150 * row, camera.y - camera.height / 4 + 70 + 133 * itemIndex + 50 * row, 'black', "" + recipes[firstRecipeIndex + itemIndex].parts[partIndex].count, 15, drawing_2.Layer.UI);
                    }
                    if (controls_1.mouse.worldX >= camera.x - camera.width / 2 &&
                        controls_1.mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                        controls_1.mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * itemIndex &&
                        controls_1.mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * itemIndex) {
                        drawText(camera.x + camera.width / 2 - 425, camera.y - 50, 'green', recipes[firstRecipeIndex + itemIndex].description1, 25, drawing_2.Layer.UI);
                        drawText(camera.x + camera.width / 2 - 425, camera.y, 'green', recipes[firstRecipeIndex + itemIndex].description2, 25, drawing_2.Layer.UI);
                        drawText(camera.x + camera.width / 2 - 425, camera.y + 50, 'green', recipes[firstRecipeIndex + itemIndex].description3, 25, drawing_2.Layer.UI);
                        if (controls_1.mouse.wentDown) {
                            craftRecipe(recipes[firstRecipeIndex + itemIndex]);
                        }
                    }
                }
            }
            else {
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.MELTER &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height) <=
                        TILE.width + gameObject.width) {
                    if (mouseTile.inventory[0].item === Item.NONE && inventory[mainSlot] &&
                        (inventory[mainSlot].item === Item.IRON || inventory[mainSlot].item === Item.AURIT ||
                            inventory[mainSlot].item === Item.IGNEOUS)) {
                        mouseTile.inventory[0].item = inventory[mainSlot].item;
                        mouseTile.inventory[0].count = inventory[mainSlot].count;
                        removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                        mouseTile.specialTimer = addTimer(mouseTile.inventory[0].count * 2 * 60);
                    }
                    if (timers[mouseTile.specialTimer] <= 0) {
                        if (mouseTile.inventory[0].item === Item.IRON) {
                            addItem(Item.IRON_INGOT, mouseTile.inventory[0].count);
                        }
                        if (mouseTile.inventory[0].item === Item.AURIT) {
                            addItem(Item.AURIT_INGOT, mouseTile.inventory[0].count);
                        }
                        if (mouseTile.inventory[0].item === Item.IGNEOUS) {
                            addItem(Item.IGNEOUS_INGOT, mouseTile.inventory[0].count);
                        }
                        mouseTile.inventory[0].item = Item.NONE;
                        timers[mouseTile.specialTimer] = null;
                    }
                }
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.SPLITTER &&
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
                else if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.STORAGE &&
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
                                timers[gameObject.energy] *= 0.25;
                                gameObject.maxEnergy *= 0.25;
                                removeItem(Item.SUN_BATERY, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.GOLDEN_CAMERA) {
                            if (gameObject.cameraLvl === 0) {
                                gameObject.cameraLvl = 1;
                                removeItem(Item.GOLDEN_CAMERA, 1);
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
                            if (gameObject.sprite !== drawing_2.imgShockProofBody) {
                                gameObject.hitpoints = 150;
                                gameObject.maxHitpoints = 150;
                                gameObject.sprite = drawing_2.imgShockProofBody;
                                removeItem(Item.SHOCKPROOF_BODY, 1);
                            }
                        }
                        else {
                            if (gameObject.sunBateryLvl === 1 && !isInventoryFullForItem(Item.SUN_BATERY)) {
                                gameObject.sunBateryLvl = 0;
                                timers[gameObject.energy] *= 100 / 25;
                                gameObject.maxEnergy *= 100 / 25;
                                addItem(Item.SUN_BATERY, 1);
                            }
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.wentDown && !mouseTile.upperLayer &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height)
                        <= TILE.width + gameObject.width + 50 &&
                    !(craftMode &&
                        controls_1.mouse.worldX >= camera.x - camera.width / 2 &&
                        controls_1.mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                        controls_1.mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * 3 &&
                        controls_1.mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * 3) &&
                    !(controls_1.mouse.worldX >= camera.x - 145 &&
                        controls_1.mouse.worldX <= camera.x + 145 &&
                        controls_1.mouse.worldY >= camera.y + camera.height / 2 - 70 &&
                        controls_1.mouse.worldY <= camera.y + camera.height / 2 - 30)) {
                    if (!(gameObject.x >= mouseTile.x * TILE.width - TILE.width / 2 - gameObject.width / 2 &&
                        gameObject.x <= mouseTile.x * TILE.width + TILE.width / 2 + gameObject.width / 2 &&
                        gameObject.y >= mouseTile.y * TILE.height - TILE.height / 2 - gameObject.height / 2 &&
                        gameObject.y <= mouseTile.y * TILE.height + TILE.height / 2 + gameObject.height / 2)) {
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.MELTER && mouseTile.baseLayer === TileType.LAVA) {
                            mouseTile.upperLayer = TileType.MELTER;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            mouseTile.specialTimer = addTimer(0);
                            mouseTile.inventory[0] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                            removeItem(Item.MELTER, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.SPLITTER &&
                            !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
                            mouseTile.upperLayer = TileType.SPLITTER;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            removeItem(Item.SPLITTER, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.SUN_BATERY &&
                            !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
                            mouseTile.upperLayer = TileType.SUN_BATERY;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            removeItem(Item.SUN_BATERY, 1);
                        }
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.STORAGE &&
                            !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
                            mouseTile.upperLayer = TileType.STORAGE;
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
                            if (mouseTile.upperLayer === TileType.IRON && !isInventoryFullForItem(Item.IRON)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.AURIT && !isInventoryFullForItem(Item.AURIT)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.CRYSTAL && !isInventoryFullForItem(Item.CRYSTAL)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.SILIKON && !isInventoryFullForItem(Item.SILIKON)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.MELTER && !isInventoryFullForItem(Item.MELTER)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.SPLITTER && !isInventoryFullForItem(Item.SPLITTER)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.SUN_BATERY && !isInventoryFullForItem(Item.SUN_BATERY)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.STORAGE && !isInventoryFullForItem(Item.STORAGE)) {
                                mouseTile.toughness--;
                            }
                            if (mouseTile.upperLayer === TileType.IGNEOUS && !isInventoryFullForItem(Item.IGNEOUS)) {
                                mouseTile.toughness--;
                            }
                        }
                        if ((mouseTile.toughness % Math.round(mouseTile.firstToughness / mouseTile.oreCount) === 0 || mouseTile.toughness === 0)) {
                            var color = null;
                            if (mouseTile.upperLayer === TileType.IRON) {
                                color = 'grey';
                            }
                            if (mouseTile.upperLayer === TileType.AURIT) {
                                color = 'yellow';
                            }
                            if (mouseTile.upperLayer === TileType.CRYSTAL) {
                                color = 'lightcoral';
                            }
                            if (mouseTile.upperLayer === TileType.SILIKON) {
                                color = 'dimgray';
                            }
                            if (mouseTile.upperLayer === TileType.IGNEOUS) {
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
                        if (mouseTile.upperLayer === TileType.MELTER) {
                            addItem(Item.MELTER, 1);
                        }
                        if (mouseTile.upperLayer === TileType.SPLITTER) {
                            addItem(Item.SPLITTER, 1);
                        }
                        if (mouseTile.upperLayer === TileType.SUN_BATERY) {
                            addItem(Item.SUN_BATERY, 1);
                        }
                        if (mouseTile.upperLayer === TileType.STORAGE) {
                            addItem(Item.STORAGE, 1);
                            if (mouseTile === controlledStorage) {
                                controlledStorage = null;
                            }
                        }
                        mouseTile.upperLayer = TileType.NONE;
                    }
                    var stripeWidth = 300;
                    var width_1 = stripeWidth * (mouseTile.toughness / mouseTile.firstToughness);
                    drawRect(camera.x + width_1 / 2 - 150, camera.y + camera.height / 4, width_1, 50, 0, 'green', false, drawing_2.Layer.UI);
                }
            }
            if (controlledStorage) {
                for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                    var x = void 0;
                    var y = void 0;
                    if (slotIndex <= Math.round(STORAGE_SLOT_COUNT / 2 - 1)) {
                        x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50;
                        y = camera.y;
                    }
                    else {
                        x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50 - 50 * STORAGE_SLOT_COUNT / 2;
                        y = camera.y + 100;
                    }
                    drawRect(x, y, 50, 50, 0, 'grey', true, drawing_2.Layer.UI);
                    var sprite = null;
                    if (controlledStorage.inventory[slotIndex].item === Item.NONE) {
                        sprite = drawing_2.imgNone;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON) {
                        sprite = drawing_2.imgIronItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.MELTER) {
                        sprite = drawing_2.imgMelter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON_INGOT) {
                        sprite = drawing_2.imgIronIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT) {
                        sprite = drawing_2.imgAuritItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT_INGOT) {
                        sprite = drawing_2.imgAuritIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.CRYSTAL) {
                        sprite = drawing_2.imgCrystalItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SPLITTER) {
                        sprite = drawing_2.imgSplitter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.TOOLKIT) {
                        sprite = drawing_2.imgToolkit;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SUN_BATERY) {
                        sprite = drawing_2.imgSunBatteryItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SILIKON) {
                        sprite = drawing_2.imgSiliconItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.STORAGE) {
                        sprite = drawing_2.imgStorage;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = drawing_2.imgGoldenCamera;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.EXTRA_SLOT) {
                        sprite = drawing_2.imgExtraSlotItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = drawing_2.imgShockProofBody;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS) {
                        sprite = drawing_2.imgIgneousItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS_INGOT) {
                        sprite = drawing_2.imgIgneousIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.METEORITE_STUFF) {
                        sprite = drawing_2.imgMeteoriteStuff;
                    }
                    drawSprite(x, y, sprite, 0, 40, 40, false, drawing_2.Layer.UI);
                    if (controlledStorage.inventory[slotIndex].count !== 0) {
                        drawText(x, y - 50, 'green', "" + controlledStorage.inventory[slotIndex].count, 25, drawing_2.Layer.UI);
                    }
                    if (controls_1.mouse.wentDown &&
                        controls_1.mouse.worldX > x - 20 &&
                        controls_1.mouse.worldX < x + 20 &&
                        controls_1.mouse.worldY > y - 20 &&
                        controls_1.mouse.worldY < y + 20) {
                        if (controlledStorage.inventory[slotIndex].item !== Item.NONE && !isInventoryFullForItem(controlledStorage.inventory[slotIndex].item)) {
                            addItem(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count);
                            removeItemFromStorage(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count, controlledStorage);
                        }
                    }
                }
            }
            if (!gameObject.doNotDraw && gameObject.sunBateryLvl === 1) {
                drawSprite(gameObject.x, gameObject.y, drawing_2.imgSunBatteryAdd, gameObject.angle, gameObject.width * camera.range, gameObject.height * camera.range, false, drawing_2.Layer.PLAYER);
            }
            var angle = angleBetweenPoints(gameObject.x, gameObject.y, controls_1.mouse.worldX, controls_1.mouse.worldY);
            var cameraSprite = drawing_2.imgNone;
            if (gameObject.cameraLvl === 0) {
                cameraSprite = drawing_2.imgCamera;
            }
            if (gameObject.cameraLvl === 1) {
                cameraSprite = drawing_2.imgGoldenCamera;
            }
            if (!gameObject.doNotDraw) {
                drawSprite(gameObject.x, gameObject.y, cameraSprite, angle, 30 * camera.range, 30 * camera.range, false, drawing_2.Layer.PLAYER);
            }
            var _a = rotateVector(46 * camera.range, 40 * camera.range, -gameObject.angle), wheel1X = _a[0], wheel1Y = _a[1];
            var _b = rotateVector(9 * camera.range, 45 * camera.range, -gameObject.angle), wheel2X = _b[0], wheel2Y = _b[1];
            var _c = rotateVector(-48 * camera.range, 45 * camera.range, -gameObject.angle), wheel3X = _c[0], wheel3Y = _c[1];
            var _d = rotateVector(46 * camera.range, -40 * camera.range, -gameObject.angle), wheel4X = _d[0], wheel4Y = _d[1];
            var _e = rotateVector(9 * camera.range, -45 * camera.range, -gameObject.angle), wheel5X = _e[0], wheel5Y = _e[1];
            var _f = rotateVector(-48 * camera.range, -45 * camera.range, -gameObject.angle), wheel6X = _f[0], wheel6Y = _f[1];
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
            if (!gameObject.doNotDraw) {
                if (gameObject.leftWeel === 1) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 2) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 3) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 4) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 5) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 6) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 1) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel1, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 2) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel2, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 3) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel3, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 4) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel4, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 5) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel5, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 6) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel6, gameObject.angle, 25 * camera.range, 12 * camera.range, false, drawing_2.Layer.PLAYER);
                }
            }
            if (!pause) {
                moveGameObject(gameObject);
            }
            if (gameObject.x + gameObject.speedX <= camera.x - camera.width / 2) {
                gameObject.x = camera.x - camera.width / 2;
            }
            if (gameObject.x + gameObject.speedX >= camera.x + camera.width / 2) {
                gameObject.x = camera.x + camera.width / 2;
            }
            if (gameObject.y + gameObject.speedY <= camera.y - camera.height / 2) {
                gameObject.y = camera.y - camera.height / 2;
            }
            if (gameObject.y + gameObject.speedY >= camera.y + camera.height / 2) {
                gameObject.y = camera.y - camera.height / 2;
            }
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, drawing_2.Layer.METEORITE);
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            if (!pause) {
                gameObject.x += gameObject.speedX;
                gameObject.y += gameObject.speedY;
                gameObject.lifeTime++;
                var speedZ = MAGMA_BALL_SPEED * Math.sin(gameObject.angleZ);
                var speedXY = MAGMA_BALL_SPEED * Math.cos(gameObject.angleZ);
                var speedVector = rotateVector(speedXY, 0, gameObject.angle);
                gameObject.speedX = speedVector[0];
                gameObject.speedY = speedVector[1];
                var height = VOLCANO_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
                var range = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;
                var rangeProjections = rotateVector(range, 0, gameObject.angle);
                if (globalPlayer.cameraLvl === 1) {
                    drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 50, 'red', true, drawing_2.Layer.ON_TILE);
                    drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], drawing_2.imgAlert, 0, 90, 90, false, drawing_2.Layer.ON_TILE);
                }
                gameObject.width = (100 + height) * camera.range;
                gameObject.height = (100 + height) * camera.range;
                if (height <= 0) {
                    gameObject.exists = false;
                    burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 45, count: 15, decrease: 0.75, accel: 0 });
                    var x = Math.round(gameObject.x / TILE.width);
                    var y = Math.round(gameObject.y / TILE.height);
                    var tileIndex = getIndexFromCoords(x, y);
                    var chance = randomFloat(0, 1);
                    if (map[tileIndex]) {
                        if (map[tileIndex].upperLayer !== TileType.NONE) {
                            if (chance < 0.25 && map[tileIndex].upperLayer !== TileType.VOLCANO) {
                                map[tileIndex].upperLayer = TileType.NONE;
                            }
                        }
                        else {
                            if (chance < 0.25 && map[tileIndex].baseLayer !== TileType.NONE && map[tileIndex].baseLayer !== TileType.GEYSER
                                && map[tileIndex].baseLayer !== TileType.VOLCANO) {
                                map[tileIndex].baseLayer = TileType.EARTH_1;
                                map[tileIndex].upperLayer = TileType.IGNEOUS;
                                map[tileIndex].toughness = 500;
                                map[tileIndex].firstToughness = 500;
                                map[tileIndex].oreCount = 1;
                            }
                        }
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.METEORITE) {
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, drawing_2.Layer.METEORITE);
            if (!pause) {
                gameObject.x += gameObject.speedX;
                gameObject.y += gameObject.speedY;
                gameObject.lifeTime++;
                var speedZ = METEORITE_SPEED * Math.sin(gameObject.angleZ);
                var speedXY = METEORITE_SPEED * Math.cos(gameObject.angleZ);
                var speedVector = rotateVector(speedXY, 0, gameObject.angle);
                var height = CAMERA_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
                gameObject.width = (100 + height) * camera.range;
                gameObject.height = (100 + height) * camera.range;
                if (height <= 0) {
                    gameObject.exists = false;
                    burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 80, count: 15, decrease: 1, accel: 0 });
                    var x = Math.round(gameObject.x / TILE.width);
                    var y = Math.round(gameObject.y / TILE.height);
                    var tileIndex = getIndexFromCoords(x, y);
                    if (gameObject.summoned) {
                        if (map[tileIndex].upperLayer) {
                            map[tileIndex].upperLayer = TileType.NONE;
                        }
                        if (map[tileIndex].baseLayer === TileType.MOUNTAIN) {
                            map[tileIndex].baseLayer = TileType.EARTH_1;
                            map[tileIndex].toughness = 0;
                            map[tileIndex].oreCount = 0;
                        }
                    }
                    else {
                        var chance = randomFloat(0, 1);
                        if (chance < 0.25) {
                            if (map[tileIndex] && map[tileIndex].baseLayer !== TileType.LAVA && map[tileIndex].baseLayer !== TileType.MOUNTAIN &&
                                map[tileIndex].baseLayer !== TileType.NONE && map[tileIndex].baseLayer !== TileType.VOLCANO) {
                                map[tileIndex].upperLayer = TileType.IGNEOUS;
                                map[tileIndex].toughness = 500;
                                map[tileIndex].firstToughness = 500;
                                map[tileIndex].oreCount = 1;
                            }
                        }
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.LAVA_BALL) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, drawing_2.Layer.METEORITE);
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            if (!pause) {
                gameObject.x += gameObject.speedX;
                gameObject.y += gameObject.speedY;
                gameObject.lifeTime++;
                var speedZ = LAVA_BALL_SPEED * Math.sin(gameObject.angleZ);
                var speedXY = LAVA_BALL_SPEED * Math.cos(gameObject.angleZ);
                var speedVector = rotateVector(speedXY, 0, gameObject.angle);
                gameObject.speedX = speedVector[0];
                gameObject.speedY = speedVector[1];
                var height = VOLCANO_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
                var range = LAVA_BALL_SPEED * LAVA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;
                var rangeProjections = rotateVector(range, 0, gameObject.angle);
                if (globalPlayer.cameraLvl === 1) {
                    drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 10, 'red', true, drawing_2.Layer.ON_TILE);
                    drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], drawing_2.imgAlert, 0, 18, 18, false, drawing_2.Layer.ON_TILE);
                }
                gameObject.width = (20 + height) * camera.range;
                gameObject.height = (20 + height) * camera.range;
                if (height <= 0) {
                    gameObject.exists = false;
                    var x = Math.round(gameObject.x / TILE.width);
                    var y = Math.round(gameObject.y / TILE.height);
                    var tileIndex = getIndexFromCoords(x, y);
                    if (map[tileIndex] && map[tileIndex].baseLayer !== TileType.VOLCANO && map[tileIndex].baseLayer !== TileType.NONE) {
                        map[tileIndex].upperLayer = TileType.NONE;
                        map[tileIndex].baseLayer = TileType.LAVA;
                        map[tileIndex].toughness = 0;
                        map[tileIndex].oreCount = 0;
                    }
                }
            }
        }
        if (gameObject.type === GameObjectType.BOSS) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, drawing_2.Layer.BOSS);
            if (!pause) {
                if (distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y) <= gameObject.height / 2 && timers[globalPlayer.unhitableTimer] === 0) {
                    globalPlayer.hitpoints -= 50;
                    timers[globalPlayer.unhitableTimer] = 150;
                }
                if (timers[gameObject.specialTimer] === 0) {
                    gameObject.attack = randomInt(0, 2);
                    gameObject.goForward = false;
                    gameObject.goLeft = false;
                    gameObject.goRight = false;
                    if (gameObject.attack === 1) {
                        timers[gameObject.specialTimer] = 300;
                    }
                    else {
                        timers[gameObject.specialTimer] = 600;
                    }
                    gameObject.rotationSpeed = 0.01;
                    gameObject.sprite = drawing_2.imgBoss;
                }
                if (gameObject.attack === 0) {
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
                        gameObject.goLeft = false;
                        gameObject.goRight = false;
                        gameObject.goForward = true;
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
                }
                if (gameObject.attack === 1) {
                    if (timers[gameObject.specialTimer] > 100) {
                        if (timers[gameObject.specialTimer] < 300 && timers[gameObject.specialTimer] % 10 === 0) {
                            for (var lavaIndex = 0; lavaIndex < 10; lavaIndex++) {
                                addGameObject(GameObjectType.LAVA_BALL, gameObject.x, gameObject.y);
                            }
                        }
                        gameObject.rotationSpeed += 0.0015;
                    }
                    if (timers[gameObject.specialTimer] < 100) {
                        gameObject.rotationSpeed -= 0.003;
                    }
                    gameObject.goLeft = true;
                }
                if (gameObject.attack === 2) {
                    if (timers[gameObject.specialTimer] >= 300) {
                        if (timers[gameObject.specialTimer] % 2 === 0) {
                            gameObject.sprite = drawing_2.imgBossReadyToAttack1;
                        }
                        else {
                            gameObject.sprite = drawing_2.imgBossReadyToAttack;
                        }
                    }
                    else {
                        gameObject.rotationSpeed = 0.005;
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
                        var lazerLength = 1500 * camera.range;
                        var vector = rotateVector(gameObject.width / 3 + lazerLength / 2, 1, -gameObject.angle);
                        if (timers[gameObject.specialTimer] % 2 === 0) {
                            gameObject.sprite = drawing_2.imgBossAttack;
                            drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], drawing_2.imgLazer, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, drawing_2.Layer.BOSS);
                        }
                        else {
                            gameObject.sprite = drawing_2.imgBossAttack1;
                            drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], drawing_2.imgLazer1, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, drawing_2.Layer.BOSS);
                        }
                        var distanceFromPlayer = distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x + vector[0], gameObject.y + vector[1]);
                        var rotatedDistanceFromPlayer = rotateVector(distanceFromPlayer, 0, angleBetweenPoints(gameObject.x + vector[0], gameObject.y + vector[1], globalPlayer.x, globalPlayer.y) - globalBoss.angle);
                        drawing_2.ctx.save();
                        drawing_2.ctx.translate(gameObject.x + vector[0], gameObject.y + vector[1]);
                        if (-286 / 796 * gameObject.height / 2 < rotatedDistanceFromPlayer[1] && 286 / 796 * gameObject.height / 2 > rotatedDistanceFromPlayer[1]
                            && -lazerLength / 2 < rotatedDistanceFromPlayer[0] && lazerLength / 2 > rotatedDistanceFromPlayer[0]) {
                            globalPlayer.hitpoints -= 0.5;
                        }
                        drawing_2.ctx.restore();
                    }
                }
                moveGameObject(gameObject);
            }
        }
        if (gameObject.type === GameObjectType.MANIPULATOR) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, drawing_2.Layer.MANIPULATOR);
            gameObject.angle = globalBoss.angle;
            var angle = angleBetweenPoints(globalBoss.x + gameObject.firstX, globalBoss.y + gameObject.firstY, globalBoss.x, globalBoss.y);
            drawSprite(globalBoss.x, globalBoss.y, drawing_2.imgManipulator, globalBoss.angle + angle, 270 * camera.range, 60 * camera.range, true, drawing_2.Layer.BOSS_LEG);
            var legVector = rotateVector(250 * camera.range, 0, -globalBoss.angle - angle + Math.PI);
            angle = angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + legVector[0], globalBoss.y + legVector[1]);
            drawSprite(globalBoss.x + legVector[0], globalBoss.y + legVector[1], drawing_2.imgManipulator, angle, distanceBetweenPoints(globalBoss.x + legVector[0], globalBoss.y + legVector[1], gameObject.x, gameObject.y), 60 * camera.range, true, drawing_2.Layer.BOSS_LEG);
            if (!pause) {
                var legDistance = 140 * camera.range;
                var firstCoordsAngle = Math.PI - angleBetweenPoints(gameObject.firstX, gameObject.firstY, 0, 0);
                var firstCoordsVector = rotateVector(500 * camera.range, 0, -globalBoss.angle + firstCoordsAngle);
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
                    if (globalBoss.goLeft || globalBoss.goRight) {
                        speed = globalBoss.rotationSpeed * globalBoss.width * 2;
                    }
                    else {
                        speed = Math.abs(globalBoss.speed) * 2;
                    }
                    var movementVector = rotateVector(speed, 0, angle_2);
                    if ((gameObject.x < globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] > globalBoss.x + gameObject.neededX) ||
                        (gameObject.x > globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] < globalBoss.x + gameObject.neededX)) {
                        gameObject.x = globalBoss.x + gameObject.neededX;
                        gameObject.y = globalBoss.y + gameObject.neededY;
                        gameObject.neededX = null;
                        gameObject.neededY = null;
                        var distance = distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                        var strength = 1 / distance * camera.width;
                        makeScreenShake(strength, 5);
                        if (distance < gameObject.width / 2 + globalPlayer.width / 2 && timers[globalPlayer.unhitableTimer] === 0) {
                            globalPlayer.hitpoints -= 20;
                            timers[globalPlayer.unhitableTimer] = 150;
                        }
                        for (var tileIndex = 0; tileIndex < map.length; tileIndex++) {
                            var tile = map[tileIndex];
                            if (tile.upperLayer && distanceBetweenPoints(tile.x * TILE.width, tile.y * TILE.height, gameObject.x, gameObject.y) <= gameObject.width / 2 + tile.width / 2) {
                                tile.upperLayer = TileType.NONE;
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
        }
        if ((gameObject.hitpoints <= 0 || timers[gameObject.energy] <= 0) && gameObject.type === GameObjectType.PLAYER) {
            gameObject.exists = false;
        }
        normalizeAngle(gameObject.angle);
    }
    function loop() {
        var _a;
        drawQueue = [];
        drawing_2.ctx.clearRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        drawing_2.ctx.save();
        drawing_2.ctx.rotate(-camera.angle);
        drawing_2.ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);
        _a = screenToWorld(controls_1.mouse.x, controls_1.mouse.y), controls_1.mouse.worldX = _a[0], controls_1.mouse.worldY = _a[1];
        drawing_2.backCtx.save();
        drawing_2.backCtx.clearRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        drawing_2.backCtx.fillStyle = "rgba(0,0,0," + alpha + ")";
        drawing_2.backCtx.fillRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        updateTileMap();
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
        drawParticles();
        if (timers[dayTimer] === 0) {
            timers[dayTimer] = ONE_DAY;
        }
        if (timers[gameTimer] === 1) {
            var y = camera.y;
            var x = camera.x;
            while (x > camera.x - camera.width &&
                x < camera.x + camera.width &&
                y > camera.x - camera.height &&
                y < camera.y + camera.height) {
                x = randomInt(camera.x - camera.width * 3, camera.y + camera.width * 3);
                y = randomInt(camera.y - camera.height * 3, camera.y + camera.height * 3);
            }
            globalBoss = addGameObject(GameObjectType.BOSS, x, y);
            var distanceFromManipulators = 500 * camera.range;
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
        drawSprite(camera.x, camera.y, drawing_2.backBuffer, 0, camera.width, camera.height, false, drawing_2.Layer.FORGROUND);
        var color = drawing_2.backCtx.fillStyle = "rgba(0,0,0," + (1 - timers[globalPlayer.energy] / globalPlayer.maxEnergy) * 0.25 + ")";
        drawRect(camera.x, camera.y, camera.width, camera.height, 0, color, false, drawing_2.Layer.FORGROUND);
        drawQueue.sort(function (a, b) { return b.layer - a.layer; });
        for (var itemIndex = 0; itemIndex < drawQueue.length; itemIndex++) {
            var item = drawQueue[itemIndex];
            drawing_2.renderItem(item);
        }
        drawing_2.backCtx.restore();
        if (timers[recentShake.duration] <= 0) {
            recentShake = { strength: 0, duration: addTimer(0) };
        }
        for (var shakeIndex = 0; shakeIndex < screenShakes.length; shakeIndex++) {
            var shake = screenShakes[shakeIndex];
            if (shake.strength > recentShake.strength && timers[shake.duration] > 0) {
                recentShake = shake;
            }
        }
        camera.x = globalPlayer.x;
        camera.y = globalPlayer.y;
        if (timers[recentShake.duration] > 0 && recentShake.strength > 0 && !pause) {
            camera.x += randomInt(-recentShake.strength, recentShake.strength);
            camera.y += randomInt(-recentShake.strength, recentShake.strength);
        }
        while (camera.x < TILE.firstX - TILE.width / 2 + camera.width / 2) {
            camera.x++;
        }
        while (camera.y < TILE.firstY - TILE.height / 2 + camera.height / 2) {
            camera.y++;
        }
        while (camera.x > TILE.firstX - TILE.width / 2 + TILE.chunkSizeX * TILE.chunkCountX * TILE.width - camera.width / 2) {
            camera.x--;
        }
        while (camera.y > TILE.firstY - TILE.height / 2 + TILE.chunkSizeY * TILE.chunkCountY * TILE.width - camera.height / 2) {
            camera.y--;
        }
        drawing_2.ctx.restore();
        if (!pause) {
            updateTimers();
        }
        controls_1.clearAllKeys();
        requestAnimationFrame(loop);
    }
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (drawing_2_1) {
                drawing_2 = drawing_2_1;
            }
        ],
        execute: function () {
            (function (GameObjectType) {
                GameObjectType[GameObjectType["NONE"] = 0] = "NONE";
                GameObjectType[GameObjectType["PLAYER"] = 1] = "PLAYER";
                GameObjectType[GameObjectType["MAGMA_BALL"] = 2] = "MAGMA_BALL";
                GameObjectType[GameObjectType["LAVA_BALL"] = 3] = "LAVA_BALL";
                GameObjectType[GameObjectType["METEORITE"] = 4] = "METEORITE";
                GameObjectType[GameObjectType["BOSS"] = 5] = "BOSS";
                GameObjectType[GameObjectType["MANIPULATOR"] = 6] = "MANIPULATOR";
            })(GameObjectType || (GameObjectType = {}));
            (function (TileType) {
                TileType[TileType["NONE"] = 0] = "NONE";
                TileType[TileType["EARTH_1"] = 1] = "EARTH_1";
                TileType[TileType["EARTH_2"] = 2] = "EARTH_2";
                TileType[TileType["EARTH_3"] = 3] = "EARTH_3";
                TileType[TileType["MOUNTAIN"] = 4] = "MOUNTAIN";
                TileType[TileType["GEYSER"] = 5] = "GEYSER";
                TileType[TileType["VOLCANO"] = 6] = "VOLCANO";
                TileType[TileType["LAVA"] = 7] = "LAVA";
                TileType[TileType["IRON"] = 8] = "IRON";
                TileType[TileType["AURIT"] = 9] = "AURIT";
                TileType[TileType["CRYSTAL"] = 10] = "CRYSTAL";
                TileType[TileType["MELTER"] = 11] = "MELTER";
                TileType[TileType["SPLITTER"] = 12] = "SPLITTER";
                TileType[TileType["SUN_BATERY"] = 13] = "SUN_BATERY";
                TileType[TileType["SILIKON"] = 14] = "SILIKON";
                TileType[TileType["STORAGE"] = 15] = "STORAGE";
                TileType[TileType["IGNEOUS"] = 16] = "IGNEOUS";
            })(TileType || (TileType = {}));
            camera = {
                x: 0,
                y: 0,
                width: drawing_2.canvas.width,
                height: drawing_2.canvas.height,
                angle: 0,
                range: 0.75
            };
            TILE = {
                width: 200 * camera.range,
                height: 200 * camera.range,
                firstX: 0,
                firstY: 0,
                chunkSizeX: 8,
                chunkSizeY: 8,
                chunkCountX: 20,
                chunkCountY: 20
            };
            timers = [];
            InventorySlot = (function () {
                function InventorySlot() {
                    this.item = Item.NONE;
                    this.count = 0;
                    this.cooldown = addTimer(0);
                }
                return InventorySlot;
            }());
            Tile = (function () {
                function Tile() {
                }
                return Tile;
            }());
            map = [];
            chunkPrototypes = [
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
                    'SC #   #',
                    'A       ',
                    ' @     #',
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
            ];
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
                Item[Item["EXTRA_SLOT"] = 13] = "EXTRA_SLOT";
                Item[Item["SHOCKPROOF_BODY"] = 14] = "SHOCKPROOF_BODY";
                Item[Item["IGNEOUS"] = 15] = "IGNEOUS";
                Item[Item["IGNEOUS_INGOT"] = 16] = "IGNEOUS_INGOT";
                Item[Item["METEORITE_STUFF"] = 17] = "METEORITE_STUFF";
            })(Item || (Item = {}));
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
            recipes = [
                {
                    result: Item.MELTER,
                    parts: [{ item: Item.IRON, count: 20, sprite: drawing_2.imgIronItem },],
                    sprite: drawing_2.imgMelter,
                    name: 'Плавильня',
                    description1: 'Бегать с железом - это одно,',
                    description2: 'а с железными слитками - другое.',
                    description3: 'Можно поставить только на лаву'
                },
                {
                    result: Item.SPLITTER,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: drawing_2.imgIronIngot }, { item: Item.CRYSTAL, count: 10, sprite: drawing_2.imgCrystalItem }],
                    sprite: drawing_2.imgSplitter,
                    name: 'Расщепитель',
                    description1: 'Если сломать кристалл пополам,',
                    description2: 'много энергии не выделится.',
                    description3: 'Нужно что-то посерьёзнее'
                },
                {
                    result: Item.STORAGE,
                    parts: [{ item: Item.IRON_INGOT, count: 20, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgStorage,
                    name: 'Хранилище',
                    description1: 'Это сундук из Майнкрафта,',
                    description2: 'ни больше, ни меньше.',
                    description3: 'Хватит вопросов!'
                },
                {
                    result: Item.TOOLKIT,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgToolkit,
                    name: 'Ремнабор',
                    description1: 'Все травмы можно залатать,',
                    description2: 'если они не душевные.',
                    description3: 'Восполняет жизни (расходник)'
                },
                {
                    result: Item.EXTRA_SLOT,
                    parts: [{ item: Item.IRON_INGOT, count: 40, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgExtraSlotItem,
                    name: 'Допслот',
                    description1: 'Как же замечательно иметь ещё',
                    description2: 'чуть-чуть места под рукой! Сюда',
                    description3: 'можно положить немного счастья.'
                },
                {
                    result: Item.SUN_BATERY,
                    parts: [{ item: Item.SILIKON, count: 15, sprite: drawing_2.imgSiliconItem }, { item: Item.CRYSTAL, count: 30, sprite: drawing_2.imgCrystalItem }],
                    sprite: drawing_2.imgSunBatteryItem,
                    name: 'Сол панель ур.1',
                    description1: 'Без батарей, как без рук!',
                    description2: 'Позволяет получать энергию днём;',
                    description3: 'уменьшает запас энергии в 2 раза...'
                },
                {
                    result: Item.GOLDEN_CAMERA,
                    parts: [{ item: Item.AURIT_INGOT, count: 40, sprite: drawing_2.imgAuritIngot }],
                    sprite: drawing_2.imgGoldenCamera,
                    name: 'Зоркая камера',
                    description1: 'Действительно ауритовая вещь!',
                    description2: 'Позволяет видеть опасности,',
                    description3: 'если хорошо приглядеться.'
                },
                {
                    result: Item.SHOCKPROOF_BODY,
                    parts: [{ item: Item.SILIKON, count: 30, sprite: drawing_2.imgSiliconItem },
                        { item: Item.AURIT_INGOT, count: 30, sprite: drawing_2.imgAuritIngot }],
                    sprite: drawing_2.imgShockProofBody,
                    name: 'Крепкое тело',
                    description1: 'Красивый ауритовый корпус говорит',
                    description2: 'о непрочности, но слой силикона',
                    description3: 'говорит обратное. Больше жизней'
                },
                {
                    result: Item.METEORITE_STUFF,
                    parts: [{ item: Item.IGNEOUS_INGOT, count: 20, sprite: drawing_2.imgIgneousIngot }],
                    sprite: drawing_2.imgMeteoriteStuff,
                    name: 'Метеопосох',
                    description1: 'Эта вещь может вызвать метеорит,',
                    description2: 'который упадёт на выбранную ',
                    description3: 'область. Хороший взрыв'
                },
            ];
            slotCount = 5;
            inventory = [];
            for (var i = 0; i < slotCount; i++) {
                inventory.push(new InventorySlot());
            }
            drawQueue = [];
            alpha = 0;
            MORNING_LENGTH = 6000;
            DAY_LENGTH = 6000;
            AFTERNOON_LENGTH = 6000;
            NIGHT_LENGTH = 6000;
            ONE_DAY = MORNING_LENGTH + DAY_LENGTH + AFTERNOON_LENGTH + NIGHT_LENGTH;
            gameObjects = [];
            GameObject = (function () {
                function GameObject() {
                    this.type = GameObjectType.NONE;
                }
                return GameObject;
            }());
            particles = [];
            particle = (function () {
                function particle() {
                }
                return particle;
            }());
            for (var chunkY = 0; chunkY < TILE.chunkCountY; chunkY++) {
                for (var chunkX = 0; chunkX < TILE.chunkCountX; chunkX++) {
                    var protoIndex = randomInt(0, chunkPrototypes.length - 1);
                    var proto = chunkPrototypes[protoIndex];
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
                                baseLayer: downTileType, upperLayer: upTileType, x: x, y: y, specialTimer: null, toughness: null,
                                firstToughness: null, oreCount: 5, inventory: [], width: TILE.width, height: TILE.height,
                                collisionWidth: TILE.width, collisionHeight: TILE.height
                            };
                            if (char === '0') {
                                downTileType = TileType.NONE;
                            }
                            else if (char === ' ') {
                                var chance = randomInt(1, 8);
                                if (chance >= 1 && chance <= 6) {
                                    downTileType = TileType.EARTH_1;
                                }
                                if (chance === 7) {
                                    downTileType = TileType.EARTH_2;
                                }
                                if (chance === 8) {
                                    downTileType = TileType.EARTH_3;
                                }
                            }
                            else if (char === '#') {
                                downTileType = TileType.EARTH_1;
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
                                map[index].collisionWidth = TILE.width * 2;
                                map[index].collisionHeight = TILE.height * 2;
                                map[index].specialTimer = addTimer(randomInt(50, 500));
                            }
                            else if (char === '!') {
                                downTileType = TileType.LAVA;
                            }
                            else if (char === 'F') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.IRON;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char === 'A') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.AURIT;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char === 'C') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.CRYSTAL;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char = 'S') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.SILIKON;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            map[index].baseLayer = downTileType;
                            map[index].upperLayer = upTileType;
                        }
                    }
                }
            }
            globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);
            screenShakes = [{ strength: 0, duration: addTimer(0) }];
            craftMode = false;
            pause = false;
            firstRecipeIndex = 0;
            mainSlot = 0;
            controlledStorage = null;
            dayTimer = addTimer(ONE_DAY);
            gameLength = 2;
            gameTimer = addTimer(gameLength);
            (function (Event) {
                Event[Event["NONE"] = 0] = "NONE";
                Event[Event["METEORITE_RAIN"] = 1] = "METEORITE_RAIN";
            })(Event || (Event = {}));
            event = Event.NONE;
            EVENT_LENGTH = 1800;
            timeBetweenEvents = gameLength / 4;
            eventEnd = gameLength;
            VOLCANO_RADIUS = TILE.width * TILE.chunkSizeX * 1.5 * camera.range;
            VOLCANO_HEIGHT = 100 * camera.range;
            GRAVITATION = 0.5 * camera.range;
            CAMERA_HEIGHT = 1325;
            MAGMA_BALL_SPEED = 35 * camera.range;
            METEORITE_SPEED = 35 * camera.range;
            LAVA_BALL_SPEED = 15 * camera.range;
            METEOR_STUFF_COOLDOWN = 500;
            MAX_RANGE = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED / GRAVITATION;
            STORAGE_SLOT_COUNT = 10;
            hpShakeTimer = addTimer(0);
            globalBoss = null;
            recentShake = { strength: 0, duration: addTimer(0) };
            requestAnimationFrame(loop);
        }
    };
});
//# sourceMappingURL=index.js.map