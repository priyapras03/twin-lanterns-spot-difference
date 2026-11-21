// Twin Lanterns entrypoint (Node 22, standard library only). The game
// itself is the static site in game/ beside this file; this program
// hands it in by copying game/ and screenshots/ to the output folder
// and writing the dossier the judge reads, using the vendored
// make.fun library exactly as the kit ships it.
//
// Try it locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Play it locally: serve game/ with any static server and open
// index.html in a desktop browser. No network is used either way.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(here, "game"), join(outputDir, "game"), { recursive: true });
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
const shotsHere = join(here, "screenshots");
if (existsSync(shotsHere)) {
  cpSync(shotsHere, join(outputDir, "screenshots"), { recursive: true });
}

// Caps come from the scorer's gate: at most four screenshots of at
// most 256 KiB each, at most 993 game entries totalling 48 MiB, and
// no game path longer than 1000 bytes. The dossier text budget is
// the only cap that shapes the bytes written here.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log("Twin Lanterns handed in: game/, screenshots/ and dossier.json written to " + outputDir);
