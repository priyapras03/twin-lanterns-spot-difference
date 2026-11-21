// Boot and heartbeat: size the canvas to the window, run the clock
// while a hunt is live, and redraw every frame. Screenshot mode
// (?shot=cover|title|play|win) freezes one staged moment instead.
import { VIEW } from "./config.js";
import { attachInput } from "./input.js";
import { drawGame } from "./render.js";
import { stageShot } from "./shots.js";
import { SCREEN_PLAY, createGame, tick } from "./state.js";
import { playTick } from "./audio.js";

const canvas = document.getElementById("game");
const status = document.getElementById("status");
const ctx = canvas.getContext("2d");
const game = createGame();
const params = new URLSearchParams(window.location.search);
const shotName = params.get("shot");

let startStamp = performance.now();
let lastStamp = startStamp;
let lastWholeSecond = -1;

function nowSeconds() {
  return (performance.now() - startStamp) / 1000;
}

function fitCanvas() {
  const scale = Math.min(window.innerWidth / VIEW.width, window.innerHeight / VIEW.height);
  canvas.width = VIEW.width;
  canvas.height = VIEW.height;
  canvas.style.width = Math.floor(VIEW.width * scale) + "px";
  canvas.style.height = Math.floor(VIEW.height * scale) + "px";
}

window.addEventListener("resize", fitCanvas);
fitCanvas();

if (shotName) {
  const stillTime = stageShot(shotName, game);
  drawGame(ctx, game, stillTime);
  status.textContent = "Twin Lanterns screenshot: " + shotName;
} else {
  attachInput(canvas, game, nowSeconds);
  function frame(stamp) {
    const delta = Math.min(0.05, (stamp - lastStamp) / 1000);
    lastStamp = stamp;
    const before = Math.ceil(game.secondsLeft);
    tick(game, delta);
    const after = Math.ceil(game.secondsLeft);
    if (game.screen === SCREEN_PLAY && after !== before && after <= 10 && after > 0 && after !== lastWholeSecond) {
      lastWholeSecond = after;
      playTick();
    }
    drawGame(ctx, game, nowSeconds());
    status.textContent = game.message || "";
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
}
