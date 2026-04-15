#!/usr/bin/env node
/**
 * capture.mjs — artefact + beat capture
 *
 * Two distinct capture paths:
 *
 *   --mode=beat    Records public/artefacts/<slug>.beat.html using Playwright's
 *                  native video capture. Produces <slug>-beat.mp4 + <slug>-hero.png.
 *                  This is the default for new posts. Beat files expose:
 *                    window.__beat = { duration, stillFrameAt(), onReady(), start() }
 *                  Capture appends ?capture=1 to disable auto-start so the recorder
 *                  controls timing. The page plays in real wall-clock time —
 *                  CSS transitions interpolate normally because the rendering
 *                  pipeline sees real time. Earlier iterations used virtual-time
 *                  stepping; that broke CSS transitions, so we don't anymore.
 *
 *   --mode=og      Static hero PNG from public/artefacts/<slug>.html (legacy,
 *                  phase-driven). Uses window.__artefact contract + SHOTS table.
 *
 *   --mode=social  MP4 + GIF from public/artefacts/<slug>.html (legacy,
 *                  phase-driven). Uses window.__artefact contract + SHOTS table.
 *
 * Prefer --mode=beat for new posts. The legacy modes remain for posts that
 * predate the beat workflow.
 *
 * REQUIREMENTS
 *   npm i -D playwright
 *   npx playwright install chromium
 *   ffmpeg on PATH
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
const BEAT_URL     = `file://${ROOT}/public/artefacts/${slug}.beat.html`;
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

const browser = await chromium.launch();

if (mode === "beat") {
  // Probe pass — read duration + stillAt from the beat without recording.
  const probeContext = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
  });
  const probePage = await probeContext.newPage();
  await probePage.goto(BEAT_URL + "?capture=1");
  await probePage.waitForFunction(() => !!window.__beat);
  const { duration, stillAt } = await probePage.evaluate(async () => {
    await window.__beat.onReady();
    return {
      duration: window.__beat.duration,
      stillAt:  window.__beat.stillFrameAt ? window.__beat.stillFrameAt() : window.__beat.duration - 200,
    };
  });
  await probeContext.close();

  // Recording pass — Playwright's native video records the page at real
  // wall-clock time. CSS transitions and timer-driven schedules play exactly
  // as they would in a browser; no virtual-time stepping, no clock surgery.
  const videoDir = `${ROOT}/.capture/${slug}-beat-video`;
  mkdirSync(videoDir, { recursive: true });
  const recContext = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
    recordVideo: { dir: videoDir, size: { width: 1200, height: 675 } },
  });
  const recPage = await recContext.newPage();
  await recPage.goto(BEAT_URL + "?capture=1");
  await recPage.waitForFunction(() => !!window.__beat);
  await recPage.evaluate(async () => { await window.__beat.onReady(); });
  await recPage.evaluate(() => window.__beat.start());
  // Wait the beat's full duration, plus a small safety buffer.
  await recPage.waitForTimeout(duration + 150);
  await recContext.close();

  // Find the recorded webm (Playwright names it with a hash).
  const { readdirSync } = await import("node:fs");
  const webm = readdirSync(videoDir).find(f => f.endsWith(".webm"));
  if (!webm) throw new Error("Playwright did not produce a video file.");
  const webmPath = `${videoDir}/${webm}`;

  // Convert webm → mp4. Trim to exactly `duration` ms so the loop is tight.
  const mp4 = `${ROOT}/public/images/${slug}-beat.mp4`;
  // Trim from END of webm. The recording captures page-load (where fonts and
  // assets resolve) plus the beat. Trimming from the start would keep the load
  // period and clip the beat's tail; trimming from the end keeps exactly the
  // beat — the last `duration` ms of the recording.
  await run("ffmpeg", ["-y", "-sseof", `-${duration / 1000}`, "-i", webmPath,
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-crf", "18", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  console.log(`wrote ${mp4}`);

  // Hero PNG — fresh page, run the beat in real time, screenshot at stillAt.
  const heroContext = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
  });
  const heroPage = await heroContext.newPage();
  await heroPage.goto(BEAT_URL + "?capture=1");
  await heroPage.waitForFunction(() => !!window.__beat);
  await heroPage.evaluate(async () => { await window.__beat.onReady(); });
  await heroPage.evaluate(() => window.__beat.start());
  await heroPage.waitForTimeout(stillAt);
  const hero = `${ROOT}/public/images/${slug}-hero.png`;
  await heroPage.screenshot({
    path: hero,
    clip: { x: 0, y: 0, width: 1200, height: 675 },
  });
  console.log(`wrote ${hero}`);
  await heroContext.close();

  await browser.close();
  process.exit(0);
}

// ===== Legacy phase-driven modes (og, social) =====
const shots = SHOTS[slug];
if (!shots) {
  console.error(`No shot list for slug "${slug}". Add one to SHOTS in scripts/capture.mjs.`);
  process.exit(1);
}

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
