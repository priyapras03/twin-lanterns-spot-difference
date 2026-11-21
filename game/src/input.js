// Mouse and keyboard both hunt: a click marks the spot under the
// pointer on either picture, and the arrow keys steer a ring that
// Enter marks. This module only translates events into game calls.
import { VIEW, toPanelPoint } from "./config.js";
import { SCREEN_GAME_DONE, SCREEN_LEVEL_DONE, SCREEN_PLAY, SCREEN_TIME_UP, SCREEN_TITLE, moveCrosshair, startGame, startLevel, tapPanel, useHint } from "./state.js";
import { isMuted, playFind, playHint, playWin, playWrong, setMuted } from "./audio.js";

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = VIEW.width / rect.width;
  const scaleY = VIEW.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function afterTap(result) {
  if (result === "found") playFind();
  else if (result === "wrong") playWrong();
  else if (result === "level-clear") playWin();
}

export function attachInput(canvas, game, nowSeconds) {
  canvas.addEventListener("pointerdown", (event) => {
    const point = canvasPoint(canvas, event);
    if (game.screen === SCREEN_TITLE || game.screen === SCREEN_GAME_DONE) {
      startGame(game);
      return;
    }
    if (game.screen === SCREEN_LEVEL_DONE) {
      startLevel(game, game.levelIndex + 1);
      return;
    }
    if (game.screen === SCREEN_TIME_UP) {
      startLevel(game, game.levelIndex);
      return;
    }
    const hit = toPanelPoint(point.x, point.y);
    if (!hit) return;
    game.crosshair = { x: hit.x, y: hit.y };
    afterTap(tapPanel(game, hit.x, hit.y, nowSeconds()));
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if (game.screen === SCREEN_TITLE && (key === "enter" || key === " ")) {
      startGame(game);
      return;
    }
    if (game.screen === SCREEN_GAME_DONE && (key === "enter" || key === " ")) {
      startGame(game);
      return;
    }
    if (game.screen === SCREEN_LEVEL_DONE && (key === "n" || key === "enter")) {
      startLevel(game, game.levelIndex + 1);
      return;
    }
    if (game.screen === SCREEN_TIME_UP && (key === "r" || key === "enter")) {
      startLevel(game, game.levelIndex);
      return;
    }
    if (game.screen !== SCREEN_PLAY) return;
    const step = event.shiftKey ? 24 : 10;
    if (key === "arrowleft" || key === "a") moveCrosshair(game, -step, 0);
    else if (key === "arrowright" || key === "d") moveCrosshair(game, step, 0);
    else if (key === "arrowup" || key === "w") moveCrosshair(game, 0, -step);
    else if (key === "arrowdown" || key === "s") moveCrosshair(game, 0, step);
    else if (key === "enter" || key === " ") afterTap(tapPanel(game, game.crosshair.x, game.crosshair.y, nowSeconds()));
    else if (key === "h") {
      if (useHint(game, nowSeconds())) playHint();
    } else if (key === "p") game.paused = !game.paused;
    else if (key === "r") startLevel(game, game.levelIndex);
    else if (key === "m") setMuted(!isMuted());
  });
}
