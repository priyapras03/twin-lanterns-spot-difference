// Small seeded generator so decorative details (stars, petals, ripples)
// land in the same place on both panels and in every screenshot.
export function makeRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function next() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

export function seededRange(seed, count, low, high) {
  const next = makeRandom(seed);
  const values = [];
  for (let index = 0; index < count; index += 1) {
    values.push(low + next() * (high - low));
  }
  return values;
}
