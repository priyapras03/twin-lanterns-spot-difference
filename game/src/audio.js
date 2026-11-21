// Tiny WebAudio chimes, generated live so the game ships no sound
// files and never touches the network. Every call is safe before the
// first user gesture: the context simply stays suspended.
let context = null;
let muted = false;

function ensureContext() {
  if (context) return context;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  context = new AudioCtor();
  return context;
}

function tone(frequency, start, length, type, gainValue) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + length);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + length);
}

export function setMuted(value) {
  muted = Boolean(value);
}

export function isMuted() {
  return muted;
}

export function playFind() {
  tone(660, 0, 0.12, "sine", 0.16);
  tone(880, 0.07, 0.14, "sine", 0.16);
  tone(1320, 0.14, 0.2, "triangle", 0.12);
}

export function playWrong() {
  tone(180, 0, 0.16, "sawtooth", 0.08);
  tone(140, 0.05, 0.18, "sawtooth", 0.07);
}

export function playHint() {
  tone(520, 0, 0.1, "triangle", 0.12);
  tone(780, 0.09, 0.16, "triangle", 0.12);
}

export function playWin() {
  tone(523, 0, 0.16, "triangle", 0.14);
  tone(659, 0.12, 0.16, "triangle", 0.14);
  tone(784, 0.24, 0.22, "triangle", 0.14);
  tone(1046, 0.38, 0.34, "sine", 0.14);
}

export function playTick() {
  tone(1100, 0, 0.05, "square", 0.05);
}
