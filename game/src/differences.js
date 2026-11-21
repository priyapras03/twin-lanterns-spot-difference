// The hunt itself: where each difference sits, how generous its tap
// target is, and what the player is told once it is found. Scenes.js
// reads the same ids to draw the left picture one way and the right
// picture the other, so art and answers can never drift apart.
export const DIFFERENCES = {
  lane: [
    { id: "lantern-color", x: 118, y: 96, r: 34, label: "The big lantern changed colour" },
    { id: "sign-star", x: 500, y: 74, r: 30, label: "A star vanished from the sign" },
    { id: "cat-tail", x: 340, y: 388, r: 34, label: "The cat curled its tail the other way" },
    { id: "crate-apple", x: 168, y: 330, r: 30, label: "An apple is missing from the crate" },
    { id: "awning-stripe", x: 467, y: 187, r: 34, label: "One awning stripe changed pattern" },
    { id: "window-light", x: 520, y: 262, r: 28, label: "A window went dark" },
    { id: "bunting-flag", x: 300, y: 62, r: 30, label: "A bunting flag flipped direction" },
  ],
  harbor: [
    { id: "lighthouse-band", x: 92, y: 237, r: 34, label: "The lighthouse lost a red band" },
    { id: "sail-number", x: 322, y: 196, r: 34, label: "The sail number changed" },
    { id: "gull-count", x: 448, y: 84, r: 36, label: "One gull flew away" },
    { id: "buoy-color", x: 190, y: 404, r: 30, label: "The buoy changed colour" },
    { id: "boat-flag", x: 316, y: 96, r: 30, label: "The boat flag changed shape" },
    { id: "rope-coil", x: 512, y: 368, r: 30, label: "A rope coil appeared on the dock" },
    { id: "sun-reflection", x: 285, y: 345, r: 40, label: "The sun path on the water shifted" },
    { id: "crab-claw", x: 120, y: 445, r: 36, label: "The crab raised the other claw" },
  ],
  garden: [
    { id: "tree-blossom", x: 130, y: 120, r: 38, label: "Blossom colour changed on the tree" },
    { id: "kite-tail", x: 428, y: 160, r: 36, label: "The kite tail lost a bow" },
    { id: "blanket-check", x: 252, y: 392, r: 38, label: "The picnic blanket pattern changed" },
    { id: "flower-count", x: 486, y: 316, r: 32, label: "A flower is missing by the path" },
    { id: "bird-house", x: 332, y: 196, r: 30, label: "The bird house door moved" },
    { id: "fountain-spray", x: 94, y: 280, r: 34, label: "The fountain spray grew taller" },
    { id: "banner-letter", x: 504, y: 170, r: 32, label: "A banner letter changed" },
    { id: "butterfly", x: 197, y: 238, r: 28, label: "A butterfly changed wings" },
    { id: "lantern-row", x: 372, y: 438, r: 32, label: "A ground lantern went out" },
  ],
};

export function differencesFor(levelId) {
  return DIFFERENCES[levelId] || [];
}

export function hitDifference(levelId, panelX, panelY) {
  const list = differencesFor(levelId);
  for (const spot of list) {
    const dx = panelX - spot.x;
    const dy = panelY - spot.y;
    if (dx * dx + dy * dy <= spot.r * spot.r) return spot;
  }
  return null;
}
