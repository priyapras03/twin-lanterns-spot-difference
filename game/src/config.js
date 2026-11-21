// Twin Lanterns layout and level tuning. One place for every size the
// renderer, the hit test and the screenshot staging must agree on.
export const VIEW = { width: 1280, height: 720 };
export const HUD_HEIGHT = 118;
export const PANEL = { width: 580, height: 492, top: 138, leftX: 36, rightX: 664 };
export const FOOTER_TOP = 644;
export const WRONG_TIME_PENALTY = 5;
export const HINTS_PER_LEVEL = 3;
export const FIND_POINTS = 100;
export const HINT_COST = 40;
export const TIME_BONUS_PER_SECOND = 4;

export const LEVELS = [
  { id: "lane", name: "Level 1 · Lantern Lane", seconds: 150, blurb: "A night-market lane. Warm up your eyes." },
  { id: "harbor", name: "Level 2 · Harbor Dusk", seconds: 135, blurb: "Boats, gulls and a lighthouse at dusk." },
  { id: "garden", name: "Level 3 · Garden Festival", seconds: 120, blurb: "Bunting, blooms and busy picnic blankets." },
];

export function panelOrigin(side) {
  return { x: side === 0 ? PANEL.leftX : PANEL.rightX, y: PANEL.top };
}

export function toPanelPoint(viewX, viewY) {
  for (const side of [0, 1]) {
    const origin = panelOrigin(side);
    const x = viewX - origin.x;
    const y = viewY - origin.y;
    if (x >= 0 && x <= PANEL.width && y >= 0 && y <= PANEL.height) {
      return { side, x, y };
    }
  }
  return null;
}
