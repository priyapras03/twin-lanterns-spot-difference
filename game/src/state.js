// Game flow in one object: which level, what is found, how much time
// is left and what the last tap did. Rendering only reads this state;
// input only asks it to change.
import { FIND_POINTS, HINT_COST, HINTS_PER_LEVEL, LEVELS, TIME_BONUS_PER_SECOND, WRONG_TIME_PENALTY } from "./config.js";
import { differencesFor, hitDifference } from "./differences.js";

export const SCREEN_TITLE = "title";
export const SCREEN_PLAY = "play";
export const SCREEN_LEVEL_DONE = "level-done";
export const SCREEN_GAME_DONE = "game-done";
export const SCREEN_TIME_UP = "time-up";

export function createGame() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    foundAt: new Map(),
    mistakes: 0,
    score: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintSpot: null,
    hintUntil: 0,
    secondsLeft: LEVELS[0].seconds,
    elapsed: 0,
    lastTap: null,
    message: "",
    crosshair: { x: 290, y: 246 },
    paused: false,
    finishedLevels: 0,
  };
}

export function currentLevel(game) {
  return LEVELS[game.levelIndex];
}

export function remainingCount(game) {
  return differencesFor(currentLevel(game).id).length - game.found.size;
}

export function startLevel(game, levelIndex) {
  game.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, levelIndex));
  game.found = new Set();
  game.foundAt = new Map();
  game.hintsLeft = HINTS_PER_LEVEL;
  game.hintSpot = null;
  game.secondsLeft = currentLevel(game).seconds;
  game.elapsed = 0;
  game.lastTap = null;
  game.message = currentLevel(game).blurb;
  game.screen = SCREEN_PLAY;
  game.paused = false;
  game.crosshair = { x: 290, y: 246 };
}

export function startGame(game) {
  game.score = 0;
  game.mistakes = 0;
  game.finishedLevels = 0;
  startLevel(game, 0);
}

export function tapPanel(game, panelX, panelY, nowSeconds) {
  if (game.screen !== SCREEN_PLAY || game.paused) return "ignored";
  const levelId = currentLevel(game).id;
  const spot = hitDifference(levelId, panelX, panelY);
  if (spot && !game.found.has(spot.id)) {
    game.found.add(spot.id);
    game.foundAt.set(spot.id, nowSeconds);
    game.score += FIND_POINTS;
    game.message = spot.label + ".";
    game.lastTap = { x: panelX, y: panelY, ok: true, at: nowSeconds };
    if (game.hintSpot && game.hintSpot.id === spot.id) game.hintSpot = null;
    if (remainingCount(game) === 0) {
      const bonus = Math.ceil(game.secondsLeft) * TIME_BONUS_PER_SECOND;
      game.score += bonus;
      game.finishedLevels += 1;
      game.message = "Level clear! Time bonus +" + bonus + ".";
      game.screen = game.levelIndex >= LEVELS.length - 1 ? SCREEN_GAME_DONE : SCREEN_LEVEL_DONE;
      return "level-clear";
    }
    return "found";
  }
  if (spot && game.found.has(spot.id)) {
    game.message = "Already found — keep hunting.";
    return "already";
  }
  game.mistakes += 1;
  game.secondsLeft = Math.max(0, game.secondsLeft - WRONG_TIME_PENALTY);
  game.message = "Not a difference. −" + WRONG_TIME_PENALTY + " seconds.";
  game.lastTap = { x: panelX, y: panelY, ok: false, at: nowSeconds };
  if (game.secondsLeft <= 0) game.screen = SCREEN_TIME_UP;
  return "wrong";
}

export function useHint(game, nowSeconds) {
  if (game.screen !== SCREEN_PLAY || game.paused) return null;
  if (game.hintsLeft <= 0) {
    game.message = "No hints left on this level.";
    return null;
  }
  const open = differencesFor(currentLevel(game).id).filter((spot) => !game.found.has(spot.id));
  if (open.length === 0) return null;
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hintSpot = open[0];
  game.hintUntil = nowSeconds + 2.2;
  game.message = "Hint: look near the pulsing ring.";
  return game.hintSpot;
}

export function tick(game, deltaSeconds) {
  if (game.screen !== SCREEN_PLAY || game.paused) return;
  game.elapsed += deltaSeconds;
  game.secondsLeft = Math.max(0, game.secondsLeft - deltaSeconds);
  if (game.secondsLeft <= 0) {
    game.screen = SCREEN_TIME_UP;
    game.message = "Time up! The unfound differences stay hidden… this time.";
  }
}

export function moveCrosshair(game, dx, dy) {
  game.crosshair.x = Math.max(0, Math.min(580, game.crosshair.x + dx));
  game.crosshair.y = Math.max(0, Math.min(492, game.crosshair.y + dy));
}
