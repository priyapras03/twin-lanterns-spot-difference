// Everything the player sees: the two pictures, the found markers,
// the remaining counter, the timer bar and the title and end screens.
// The cover screenshot is this same frame mid-hunt, so the counter,
// markers and timer are always drawn large enough to read at a glance.
import { PANEL, VIEW, panelOrigin } from "./config.js";
import { differencesFor } from "./differences.js";
import { paintScene } from "./scenes.js";
import { SCREEN_GAME_DONE, SCREEN_LEVEL_DONE, SCREEN_PLAY, SCREEN_TIME_UP, SCREEN_TITLE, currentLevel, remainingCount } from "./state.js";

function panel(ctx, text, x, y, size, color, align = "left", weight = "bold") {
  ctx.fillStyle = color;
  ctx.font = weight + " " + size + "px Georgia, serif";
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawPanelPicture(ctx, game, side, nowSeconds) {
  const origin = panelOrigin(side);
  ctx.save();
  ctx.translate(origin.x, origin.y);
  ctx.beginPath();
  ctx.roundRect(0, 0, PANEL.width, PANEL.height, 14);
  ctx.clip();
  paintScene(ctx, currentLevel(game).id, PANEL.width, PANEL.height, side === 1);
  // Found markers ring both twins so the eye can compare at once.
  for (const spot of differencesFor(currentLevel(game).id)) {
    if (!game.found.has(spot.id)) continue;
    const born = game.foundAt.get(spot.id) || nowSeconds;
    const age = Math.max(0, nowSeconds - born);
    const pop = age < 0.35 ? 1 + (0.35 - age) * 0.9 : 1;
    ctx.strokeStyle = "#06d6a0";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r * pop, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r * pop + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#06d6a0";
    ctx.beginPath();
    ctx.arc(spot.x + spot.r * 0.72, spot.y - spot.r * 0.72, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(spot.x + spot.r * 0.72 - 5, spot.y - spot.r * 0.72);
    ctx.lineTo(spot.x + spot.r * 0.72 - 1, spot.y - spot.r * 0.72 + 5);
    ctx.lineTo(spot.x + spot.r * 0.72 + 6, spot.y - spot.r * 0.72 - 5);
    ctx.stroke();
  }
  if (game.hintSpot && nowSeconds < game.hintUntil) {
    const pulse = 1 + Math.sin(nowSeconds * 9) * 0.14;
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(game.hintSpot.x, game.hintSpot.y, game.hintSpot.r * 1.5 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (game.lastTap && !game.lastTap.ok && nowSeconds - game.lastTap.at < 0.6) {
    ctx.strokeStyle = "#ef476f";
    ctx.lineWidth = 5;
    const t = game.lastTap;
    ctx.beginPath();
    ctx.moveTo(t.x - 13, t.y - 13);
    ctx.lineTo(t.x + 13, t.y + 13);
    ctx.moveTo(t.x + 13, t.y - 13);
    ctx.lineTo(t.x - 13, t.y + 13);
    ctx.stroke();
  }
  ctx.restore();
  roundRect(ctx, origin.x, origin.y, PANEL.width, PANEL.height, 14, null, "#ffe8c2");
  panel(ctx, side === 0 ? "ORIGINAL" : "TWIN", origin.x + PANEL.width / 2, origin.y - 14, 15, "#ffe8c2", "center");
}

function drawHud(ctx, game) {
  const level = currentLevel(game);
  const total = differencesFor(level.id).length;
  const left = remainingCount(game);
  panel(ctx, "Twin Lanterns", 36, 34, 30, "#ffd166");
  panel(ctx, level.name, 36, 66, 19, "#ffffff", "left", "normal");
  // The counter the whole bounty turns on: found, total and left.
  roundRect(ctx, 460, 10, 360, 80, 14, "#241f3d", "#ffd166");
  panel(ctx, "Found " + game.found.size + " / " + total, 640, 36, 26, "#ffffff", "center");
  panel(ctx, left + " left to find", 640, 68, 24, "#06d6a0", "center");
  panel(ctx, "Score " + game.score, 915, 30, 21, "#ffffff", "center");
  panel(ctx, "Mistakes " + game.mistakes + " · Hints " + game.hintsLeft, 915, 58, 15, "#cdb4db", "center", "normal");
  // Timer bar plus seconds, so time pressure reads in a still frame.
  const whole = level.seconds;
  const fraction = Math.max(0, Math.min(1, game.secondsLeft / whole));
  roundRect(ctx, 1010, 22, 234, 22, 11, "#3d2c4f", "#ffe8c2");
  const barColor = game.secondsLeft <= 15 ? "#ef476f" : game.secondsLeft <= 30 ? "#ffd166" : "#06d6a0";
  if (fraction > 0) roundRect(ctx, 1013, 25, Math.max(8, 228 * fraction), 16, 8, barColor, null);
  panel(ctx, Math.ceil(game.secondsLeft) + "s", 1127, 66, 22, game.secondsLeft <= 15 ? "#ef476f" : "#ffffff", "center");
  if (game.paused) panel(ctx, "PAUSED — press P to resume", VIEW.width / 2, 104, 18, "#ffd166", "center");
}

function drawFooter(ctx, game) {
  panel(ctx, game.message || "Click a difference on either picture.", VIEW.width / 2, 664, 19, "#ffe8c2", "center", "normal");
  panel(ctx, "Mouse: click to mark · Arrows/WASD: move ring · Enter: mark · H: hint · P: pause · R: restart level", VIEW.width / 2, 694, 15, "#cdb4db", "center", "normal");
}

function overlay(ctx, title, lines, prompt) {
  ctx.fillStyle = "rgba(20,16,38,0.82)";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  panel(ctx, title, VIEW.width / 2, 250, 54, "#ffd166", "center");
  lines.forEach((line, index) => {
    panel(ctx, line, VIEW.width / 2, 316 + index * 34, 21, "#ffffff", "center", "normal");
  });
  panel(ctx, prompt, VIEW.width / 2, 316 + lines.length * 34 + 28, 20, "#06d6a0", "center");
}

export function drawGame(ctx, game, nowSeconds) {
  ctx.fillStyle = "#191430";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  drawHud(ctx, game);
  drawPanelPicture(ctx, game, 0, nowSeconds);
  drawPanelPicture(ctx, game, 1, nowSeconds);
  // Keyboard ring, mirrored so keyboard play reads on both twins.
  if (game.screen === SCREEN_PLAY) {
    for (const side of [0, 1]) {
      const origin = panelOrigin(side);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(origin.x + game.crosshair.x, origin.y + game.crosshair.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(origin.x + game.crosshair.x - 20, origin.y + game.crosshair.y);
      ctx.lineTo(origin.x + game.crosshair.x - 8, origin.y + game.crosshair.y);
      ctx.moveTo(origin.x + game.crosshair.x + 8, origin.y + game.crosshair.y);
      ctx.lineTo(origin.x + game.crosshair.x + 20, origin.y + game.crosshair.y);
      ctx.stroke();
    }
  }
  drawFooter(ctx, game);
  if (game.screen === SCREEN_TITLE) {
    overlay(ctx, "Twin Lanterns", [
      "Spot the difference between two near-identical pictures.",
      "Three scenes, 24 differences, one ticking clock.",
      "Click either picture to mark a find. Wrong taps cost 5 seconds.",
    ], "Click or press Enter to start");
  } else if (game.screen === SCREEN_LEVEL_DONE) {
    overlay(ctx, "Level clear!", [
      currentLevel(game).name + " complete.",
      "Score so far: " + game.score + " · Mistakes: " + game.mistakes,
      "The next scene hides its differences a little deeper.",
    ], "Click or press N for the next level");
  } else if (game.screen === SCREEN_GAME_DONE) {
    overlay(ctx, "You found them all!", [
      "All three scenes cleared. Final score: " + game.score,
      "Mistakes along the way: " + game.mistakes,
      "Sharp eyes. The lanterns approve.",
    ], "Click or press Enter to play again");
  } else if (game.screen === SCREEN_TIME_UP) {
    overlay(ctx, "Time up!", [
      remainingCount(game) + " differences stayed hidden on " + currentLevel(game).name + ".",
      "Score: " + game.score,
      "Hints pulse the next hiding place — spend them early.",
    ], "Click or press R to retry this level");
  }
}
