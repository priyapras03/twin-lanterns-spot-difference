// Original picture-book scenes drawn with plain canvas shapes. Each
// painter receives the panel size and a flag for the right-hand twin;
// the flag flips exactly the details listed in differences.js and
// nothing else, which is what makes the hunt fair.
import { makeRandom } from "./random.js";

function sky(ctx, w, h, top, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function lantern(ctx, x, y, scale, body, glow) {
  circle(ctx, x, y, 26 * scale, glow);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 20 * scale, 26 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  rect(ctx, x - 10 * scale, y - 30 * scale, 20 * scale, 6 * scale, "#5b3a1e");
  rect(ctx, x - 2 * scale, y + 26 * scale, 4 * scale, 12 * scale, "#ffd166");
}

function paintLane(ctx, w, h, twin) {
  sky(ctx, w, h, "#1d2a52", "#7a4a7e");
  const stars = makeRandom(41);
  for (let i = 0; i < 36; i += 1) {
    circle(ctx, stars() * w, stars() * 150, 1.6, "rgba(255,255,255,0.8)");
  }
  rect(ctx, 0, 380, w, 112, "#3d2c4f");
  rect(ctx, 0, 372, w, 10, "#ffd166");
  // Shop fronts.
  rect(ctx, 24, 150, 150, 230, "#8e5ea2");
  rect(ctx, 380, 140, 176, 240, "#4f7fa8");
  rect(ctx, 210, 210, 140, 170, "#b5654d");
  // Awnings; one stripe pattern flips on the twin.
  for (let i = 0; i < 5; i += 1) {
    const flipped = twin && i === 2;
    rect(ctx, 380 + i * 35, 172, 35, 30, flipped ? "#ffd166" : i % 2 ? "#ef476f" : "#fff3e2");
  }
  rect(ctx, 24, 150, 150, 26, "#ffd166");
  // Sign with stars; one star is gone on the twin.
  rect(ctx, 410, 52, 120, 44, "#241f3d");
  star(ctx, 432, 74, 11, "#ffd166");
  star(ctx, 466, 74, 11, "#ffd166");
  if (!twin) star(ctx, 500, 74, 11, "#ffd166");
  // Bunting across the top; one flag points the other way.
  ctx.strokeStyle = "#ffe8c2";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(w / 2, 78, w, 30);
  ctx.stroke();
  const flagColors = ["#ef476f", "#ffd166", "#06d6a0", "#4cc9f0", "#f78c6b", "#c77dff"];
  for (let i = 0; i < 9; i += 1) {
    const fx = 40 + i * 62;
    const fy = 44 + Math.sin((i / 8) * Math.PI) * 16;
    const flip = twin && i === 4;
    ctx.fillStyle = flagColors[i % flagColors.length];
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 26, fy);
    ctx.lineTo(fx + (flip ? 4 : 22), fy + 24);
    ctx.closePath();
    ctx.fill();
  }
  // Hero lantern; its colour is the first difference.
  lantern(ctx, 118, 96, 1.15, twin ? "#4cc9f0" : "#ef476f", "rgba(255,209,102,0.35)");
  lantern(ctx, 250, 120, 0.8, "#ffd166", "rgba(255,209,102,0.25)");
  lantern(ctx, 330, 104, 0.65, "#06d6a0", "rgba(6,214,160,0.25)");
  // Windows; one goes dark on the twin.
  rect(ctx, 56, 210, 34, 44, "#ffe8a3");
  rect(ctx, 116, 210, 34, 44, "#ffe8a3");
  rect(ctx, 502, 240, 36, 44, twin ? "#2b2d42" : "#ffe8a3");
  rect(ctx, 430, 300, 36, 44, "#ffe8a3");
  // Fruit crate; one apple is missing on the twin.
  rect(ctx, 96, 336, 110, 56, "#9c6644");
  rect(ctx, 96, 336, 110, 12, "#7f5539");
  circle(ctx, 122, 332, 13, "#ef476f");
  circle(ctx, 152, 328, 13, "#ffd166");
  if (!twin) circle(ctx, 180, 332, 13, "#06d6a0");
  // Cat on the lane; its tail curls the other way on the twin.
  circle(ctx, 318, 392, 26, "#f4a261");
  circle(ctx, 300, 372, 16, "#f4a261");
  ctx.fillStyle = "#f4a261";
  ctx.beginPath();
  ctx.moveTo(288, 362);
  ctx.lineTo(282, 344);
  ctx.lineTo(298, 354);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(312, 362);
  ctx.lineTo(318, 344);
  ctx.lineTo(302, 354);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 294, 370, 3, "#241f3d");
  circle(ctx, 308, 370, 3, "#241f3d");
  ctx.strokeStyle = "#e76f51";
  ctx.lineWidth = 7;
  ctx.beginPath();
  if (twin) ctx.arc(352, 384, 16, Math.PI * 0.2, Math.PI * 1.3);
  else ctx.arc(352, 384, 16, Math.PI * 1.7, Math.PI * 0.8, true);
  ctx.stroke();
  // Cobbles.
  const cobbles = makeRandom(7);
  for (let i = 0; i < 26; i += 1) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.ellipse(cobbles() * w, 400 + cobbles() * 76, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintHarbor(ctx, w, h, twin) {
  sky(ctx, w, h, "#f7a072", "#5b7fb8");
  circle(ctx, 470, 92, 34, "#ffe8a3");
  rect(ctx, 0, 300, w, 192, "#2a6f97");
  // Sun path on the water shifts on the twin.
  ctx.fillStyle = "rgba(255,232,163,0.55)";
  const pathX = twin ? 300 : 252;
  for (let i = 0; i < 7; i += 1) {
    rect(ctx, pathX - i * 3, 312 + i * 22, 44 + i * 6, 7, "rgba(255,232,163,0.55)");
  }
  const ripples = makeRandom(19);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 22; i += 1) {
    const rx = ripples() * w;
    const ry = 316 + ripples() * 150;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 22, ry);
    ctx.stroke();
  }
  // Lighthouse; a red band is gone on the twin.
  rect(ctx, 62, 120, 60, 190, "#fff3e2");
  rect(ctx, 62, 160, 60, 26, "#ef476f");
  if (!twin) rect(ctx, 62, 224, 60, 26, "#ef476f");
  rect(ctx, 56, 96, 72, 28, "#241f3d");
  circle(ctx, 92, 110, 10, "#ffd166");
  rect(ctx, 48, 306, 88, 16, "#5b3a1e");
  // Sailboat; sail number and flag change on the twin.
  ctx.fillStyle = "#fff3e2";
  ctx.beginPath();
  ctx.moveTo(300, 96);
  ctx.lineTo(300, 224);
  ctx.lineTo(368, 224);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ef476f";
  ctx.beginPath();
  ctx.moveTo(292, 120);
  ctx.lineTo(292, 224);
  ctx.lineTo(238, 224);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#241f3d";
  ctx.font = "bold 30px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(twin ? "9" : "4", 322, 196);
  rect(ctx, 298, 88, 4, 140, "#5b3a1e");
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  if (twin) {
    ctx.moveTo(302, 88);
    ctx.lineTo(332, 96);
    ctx.lineTo(302, 104);
  } else {
    ctx.moveTo(302, 88);
    ctx.lineTo(330, 88);
    ctx.lineTo(330, 104);
    ctx.lineTo(302, 104);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7f5539";
  ctx.beginPath();
  ctx.moveTo(230, 228);
  ctx.lineTo(380, 228);
  ctx.lineTo(356, 262);
  ctx.lineTo(252, 262);
  ctx.closePath();
  ctx.fill();
  // Gulls; one is missing on the twin.
  ctx.strokeStyle = "#241f3d";
  ctx.lineWidth = 3;
  const gulls = twin ? [[420, 70], [462, 96], [500, 64]] : [[420, 70], [448, 84], [462, 96], [500, 64]];
  for (const [gx, gy] of gulls) {
    ctx.beginPath();
    ctx.arc(gx - 9, gy, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(gx + 9, gy, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Dock, buoy, rope and crab.
  rect(ctx, 0, 356, w, 18, "#9c6644");
  for (let i = 0; i < 8; i += 1) rect(ctx, 20 + i * 72, 356, 8, 44, "#7f5539");
  circle(ctx, 190, 404, 18, twin ? "#06d6a0" : "#ef476f");
  rect(ctx, 174, 398, 32, 8, "#fff3e2");
  if (twin) {
    ctx.strokeStyle = "#e9c46a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(512, 368, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(512, 368, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  circle(ctx, 120, 452, 16, "#e76f51");
  circle(ctx, 112, 446, 3, "#241f3d");
  circle(ctx, 128, 446, 3, "#241f3d");
  ctx.strokeStyle = "#e76f51";
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (twin) {
    ctx.moveTo(104, 452);
    ctx.lineTo(88, 434);
  } else {
    ctx.moveTo(136, 452);
    ctx.lineTo(152, 434);
  }
  ctx.stroke();
}

function paintGarden(ctx, w, h, twin) {
  sky(ctx, w, h, "#a8dadc", "#fef9e7");
  circle(ctx, 516, 62, 28, "#ffd166");
  rect(ctx, 0, 340, w, 152, "#7fb069");
  ctx.fillStyle = "#d9c7a7";
  ctx.beginPath();
  ctx.moveTo(240, 492);
  ctx.lineTo(320, 492);
  ctx.lineTo(300, 340);
  ctx.lineTo(262, 340);
  ctx.closePath();
  ctx.fill();
  // Big tree; blossom colour changes on the twin.
  rect(ctx, 122, 190, 18, 150, "#7f5539");
  const blossom = twin ? "#c77dff" : "#ff8fab";
  circle(ctx, 130, 120, 62, blossom);
  circle(ctx, 86, 150, 40, blossom);
  circle(ctx, 176, 148, 42, blossom);
  circle(ctx, 130, 86, 36, "#ffb3c6");
  // Fountain; spray height changes on the twin.
  rect(ctx, 52, 322, 84, 20, "#8ecae6");
  rect(ctx, 86, 282, 16, 44, "#8ecae6");
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 4;
  const sprayTop = twin ? 252 : 272;
  for (const dx of [-22, 0, 22]) {
    ctx.beginPath();
    ctx.moveTo(94, 282);
    ctx.quadraticCurveTo(94 + dx, sprayTop, 94 + dx * 1.7, 318);
    ctx.stroke();
  }
  // Bird house; door position changes on the twin.
  rect(ctx, 306, 168, 52, 58, "#f4a261");
  ctx.fillStyle = "#e76f51";
  ctx.beginPath();
  ctx.moveTo(298, 170);
  ctx.lineTo(332, 142);
  ctx.lineTo(366, 170);
  ctx.closePath();
  ctx.fill();
  circle(ctx, twin ? 344 : 320, 196, 9, "#241f3d");
  rect(ctx, 328, 226, 8, 60, "#7f5539");
  // Kite; a tail bow is missing on the twin.
  ctx.fillStyle = "#ef476f";
  ctx.beginPath();
  ctx.moveTo(420, 52);
  ctx.lineTo(452, 88);
  ctx.lineTo(420, 128);
  ctx.lineTo(388, 88);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#241f3d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(420, 128);
  ctx.quadraticCurveTo(438, 160, 424, 196);
  ctx.stroke();
  const bows = twin ? [146, 176] : [142, 160, 180];
  for (const by of bows) {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.moveTo(428, by);
    ctx.lineTo(442, by + 7);
    ctx.lineTo(428, by + 14);
    ctx.lineTo(414, by + 7);
    ctx.closePath();
    ctx.fill();
  }
  // Banner; a letter changes on the twin.
  rect(ctx, 452, 142, 104, 40, "#fff3e2");
  ctx.fillStyle = "#241f3d";
  ctx.font = "bold 24px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(twin ? "FEST" : "FETA", 504, 170);
  // Butterfly; wing colour changes on the twin.
  const wing = twin ? "#4cc9f0" : "#ffd166";
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.ellipse(186, 238, 14, 9, -0.5, 0, Math.PI * 2);
  ctx.ellipse(208, 238, 14, 9, 0.5, 0, Math.PI * 2);
  ctx.fill();
  rect(ctx, 194, 230, 5, 20, "#241f3d");
  // Picnic blanket; check pattern changes on the twin.
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const on = twin ? (row + col) % 3 === 0 : (row + col) % 2 === 0;
      rect(ctx, 196 + col * 28, 362 + row * 20, 28, 20, on ? "#ef476f" : "#fff3e2");
    }
  }
  circle(ctx, 232, 384, 10, "#ffd166");
  circle(ctx, 272, 392, 10, "#06d6a0");
  // Flowers by the path; one is missing on the twin.
  const flowerSpots = [[462, 306], [486, 316], [510, 302], [474, 332], [500, 336]];
  flowerSpots.forEach(([fx, fy], index) => {
    if (twin && index === 1) return;
    circle(ctx, fx, fy, 8, index % 2 ? "#ff8fab" : "#ffd166");
    circle(ctx, fx, fy, 3, "#fff3e2");
  });
  // Ground lanterns; one goes out on the twin.
  lantern(ctx, 340, 438, 0.55, "#ffd166", "rgba(255,209,102,0.3)");
  lantern(ctx, 372, 438, 0.55, twin ? "#8d99ae" : "#ef476f", twin ? "rgba(141,153,174,0.15)" : "rgba(239,71,111,0.25)");
  lantern(ctx, 404, 438, 0.55, "#06d6a0", "rgba(6,214,160,0.25)");
  const petals = makeRandom(23);
  for (let i = 0; i < 18; i += 1) {
    circle(ctx, petals() * w, 350 + petals() * 120, 3, "rgba(255,255,255,0.7)");
  }
}

export function paintScene(ctx, levelId, width, height, twin) {
  if (levelId === "harbor") paintHarbor(ctx, width, height, twin);
  else if (levelId === "garden") paintGarden(ctx, width, height, twin);
  else paintLane(ctx, width, height, twin);
}
