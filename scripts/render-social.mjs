import { readFile, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
// All type is outlined; output is identical without any machine-installed fonts.
const svg = await readFile("static/readme-hero.svg", "utf8");
await writeFile("static/og.png", new Resvg(svg).render().asPng());
console.log("Generated 1280 × 640 social cover.");
