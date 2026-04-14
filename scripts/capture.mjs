#!/usr/bin/env node
/**
 * capture.mjs — deterministic artefact capture
 *
 * Drives an artefact through its phases using the window.__artefact contract
 * and records either a static hero PNG or an animated MP4/GIF.
 *
 * USAGE
 *   node scripts/capture.mjs <slug> --mode=og          # static hero PNG
 *   node scripts/capture.mjs <slug> --mode=social      # animated MP4 + GIF
 *
 * REQUIREMENTS
 *   npm i -D playwright
 *   npx playwright install chromium
 *   ffmpeg on PATH (for --mode=social)
 *
 * CONTRACT
 *   The artefact at public/artefacts/<slug>.html must expose:
 *     window.__artefact = {
 *       slug, phaseCount, currentPhase(), goToPhase(i), phaseReady()
 *     }
 *   Plus any phase-specific action hooks referenced in the shot list below.
 */

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const [, , slug, ...flags] = process.argv;
if (!slug) {
  console.error("Usage: node scripts/capture.mjs <slug> --mode=og|social");
  process.exit(1);
}
const mode = (flags.find(f => f.startsWith("--mode=")) || "--mode=og").split("=")[1];

const ARTEFACT_URL = `file://${ROOT}/public/artefacts/${slug}.html`;
const IMG_DIR = `${ROOT}/public/images`;
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

/**
 * Shot lists — per slug. Each entry is a step the capture driver executes.
 * `phase` jumps to that phase. `action` invokes a named hook on window.__artefact.
 * `hold` waits additional ms after phaseReady() (to let the reader "read" in video mode).
 */
const SHOTS = {
  "friction-tax": {
    og: { phase: 3 },                                   // final payoff state
    social: [
      { phase: 0, hold: 1200 },
      { phase: 1, hold: 1600 },
      { phase: 2, hold: 800, action: "runExtract", postHold: 800 },
      { phase: 3, hold: 1800 },
    ],
  },
};

const shots = SHOTS[slug];
if (!shots) {
  console.error(`No shot list for slug "${slug}". Add one to SHOTS in scripts/capture.mjs.`);
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1080, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(ARTEFACT_URL);
await page.waitForFunction(() => !!window.__artefact);

if (mode === "og") {
  const shot = shots.og;
  await page.evaluate((i) => window.__artefact.goToPhase(i), shot.phase);
  if (shot.action) {
    await page.evaluate((name) => window.__artefact[name](), shot.action);
  }
  await page.waitForTimeout(800);
  const out = `${IMG_DIR}/${slug}-hero.png`;
  await page.locator(".stage").screenshot({ path: out });
  console.log(`wrote ${out}`);
} else if (mode === "social") {
  const framesDir = `${ROOT}/.capture/${slug}`;
  mkdirSync(framesDir, { recursive: true });
  const fps = 30;
  let frame = 0;
  const shoot = async (ms) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const t = Date.now();
      await page.locator(".stage").screenshot({ path: `${framesDir}/${String(frame).padStart(5, "0")}.png` });
      frame += 1;
      const spent = Date.now() - t;
      await page.waitForTimeout(Math.max(0, (1000 / fps) - spent));
    }
  };
  for (const s of shots.social) {
    await page.evaluate((i) => window.__artefact.goToPhase(i), s.phase);
    await shoot(s.hold ?? 1000);
    if (s.action) {
      await page.evaluate((name) => window.__artefact[name](), s.action);
      await shoot(s.postHold ?? 800);
    }
  }
  const mp4 = `${IMG_DIR}/${slug}-social.mp4`;
  const gif = `${IMG_DIR}/${slug}-social.gif`;
  await run("ffmpeg", ["-y", "-framerate", String(fps), "-i", `${framesDir}/%05d.png`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  await run("ffmpeg", ["-y", "-i", mp4, "-vf", `fps=20,scale=1080:-1:flags=lanczos`, gif]);
  console.log(`wrote ${mp4}`);
  console.log(`wrote ${gif}`);
} else {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}

await browser.close();

function run(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", code => code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`)));
  });
}
