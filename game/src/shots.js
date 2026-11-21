// Deterministic stills for the entry screenshots. Each scene puts
// the real game into a named moment — mid-hunt with markers showing
// and several differences still hiding, the title, an early hunt and
// the final clear — so a screenshot is the game itself, never a mock.
import { differencesFor } from "./differences.js";
import { SCREEN_GAME_DONE, SCREEN_PLAY, SCREEN_TITLE, startGame, startLevel } from "./state.js";

function preFind(game, count, atSeconds) {
  const list = differencesFor(game.levelIndex === 0 ? "lane" : game.levelIndex === 1 ? "harbor" : "garden");
  for (let index = 0; index < Math.min(count, list.length); index += 1) {
    game.found.add(list[index].id);
    game.foundAt.set(list[index].id, atSeconds - 1);
    game.score += 100;
  }
}

export function stageShot(name, game) {
  const stillTime = 12;
  if (name === "title") {
    startGame(game);
    game.screen = SCREEN_TITLE;
    game.secondsLeft = 150;
    return stillTime;
  }
  if (name === "play") {
    startGame(game);
    preFind(game, 1, stillTime);
    game.secondsLeft = 118;
    game.message = "One found. Six still hiding in Lantern Lane.";
    game.crosshair = { x: 318, y: 392 };
    return stillTime;
  }
  if (name === "win") {
    startGame(game);
    startLevel(game, 2);
    preFind(game, 9, stillTime);
    game.score += 480;
    game.screen = SCREEN_GAME_DONE;
    game.secondsLeft = 47;
    game.message = "All three scenes cleared.";
    return stillTime;
  }
  // Default and cover: deep into Harbor Dusk, three marked, five left.
  startGame(game);
  startLevel(game, 1);
  preFind(game, 3, stillTime);
  game.screen = SCREEN_PLAY;
  game.secondsLeft = 74;
  game.mistakes = 1;
  game.message = "Three marked. Five still hiding at Harbor Dusk.";
  game.crosshair = { x: 300, y: 170 };
  return stillTime;
}
