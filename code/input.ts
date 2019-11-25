import { Key } from "./controls";
import sprPlayerBody from '../sprites/player_body.png';
import sprNone from '../sprites/none.png';
import sprWheel1 from '../sprites/weel1.png';
import sprWheel2 from '../sprites/weel2.png';
import sprWheel3 from '../sprites/weel3.png';
import sprWheel4 from '../sprites/weel4.png';
import sprWheel5 from '../sprites/weel5.png';
import sprWheel6 from '../sprites/weel6.png';
import sprCamera from '../sprites/camera.png';
import sprEarth1 from '../sprites/earth1.png';
import sprEarth2 from '../sprites/earth2.png';
import sprEarth3 from '../sprites/earth3.png';
import sprEarth4 from '../sprites/earth4.png';
import sprEarth5 from '../sprites/earth5.png';
import sprGeyser from '../sprites/geyser.png';
import sprMountain from '../sprites/mountain.png';
import sprIron from '../sprites/iron.png';

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let resourcesLoadedCount = 0;
let resourcesWaitingForLoadCount = 0;
export let canBeginGame = false;

function resourceLoaded(src: string) {
    resourcesLoadedCount++;

    // console.log('loaded', src);
    if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
        canBeginGame = true;
    }
}

export function loadImage(src: string) {
    let img = new Image();
    img.src = src;
    resourcesWaitingForLoadCount++;
    img.onload = () => resourceLoaded(src);

    return img;
}

export let imgNone = loadImage(sprNone);
export let imgPlayer = loadImage(sprPlayerBody);
export let imgWheel1 = loadImage(sprWheel1);
export let imgWheel2 = loadImage(sprWheel2);
export let imgWheel3 = loadImage(sprWheel3);
export let imgWheel4 = loadImage(sprWheel4);
export let imgWheel5 = loadImage(sprWheel5);
export let imgWheel6 = loadImage(sprWheel6);
export let imgCamera = loadImage(sprCamera);
export let imgEarth1 = loadImage(sprEarth1);
export let imgEarth2 = loadImage(sprEarth2);
export let imgEarth3 = loadImage(sprEarth3);
export let imgEarth4 = loadImage(sprEarth4);
export let imgEarth5 = loadImage(sprEarth5);
export let imgGeyser = loadImage(sprGeyser);
export let imgMountain = loadImage(sprMountain);
export let imgIron = loadImage(sprIron);

export function drawSprite(x: number, y: number, sprite: any, angle: number, width: number, height: number) {
    ctx.save();
    ctx.translate(x, y);

    ctx.rotate(angle);
    let compWidth = width || sprite.width;
    let compHeight = height || sprite.height;
    ctx.drawImage(sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
    ctx.restore();
}

export function drawRect(x: number, y: number, width: number, height: number, angle: number, color: string) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;

    ctx.rotate(-angle);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
}

export function drawCircle(x: number, y: number, radius: number, color: string) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}