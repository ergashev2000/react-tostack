// Records media/promo.html frame by frame with Chrome's screencast, then writes frames + timings.
//
//   python3 -m http.server 5181          (from the repo root, after npm run build)
//   npm i --no-save playwright-core
//   node media/record.mjs /tmp/frames
//   cd /tmp/frames && ffmpeg -f concat -safe 0 -i list.txt -vf "fps=60,format=yuv420p" -c:v libx264 -crf 18 demo.mp4
//   ffmpeg -i demo.mp4 -vf "fps=20,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=200:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" demo.gif
//
// CHROME can point at any Chrome or Chromium binary.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:5181/media/promo.html?record', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const cdp = await page.context().newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async (f) => {
  frames.push({ t: f.metadata.timestamp, data: f.data });
  await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: 1280, maxHeight: 720 });
await page.waitForTimeout(300);
await page.evaluate(() => window.__start());
await page.waitForFunction(() => window.__done === true, null, { timeout: 60000, polling: 100 });
await page.waitForTimeout(200);
await cdp.send('Page.stopScreencast');
await browser.close();
const t0 = frames[0].t;
const list = [];
frames.forEach((f, i) => {
  const name = `f${String(i).padStart(5, '0')}.png`;
  fs.writeFileSync(`${out}/${name}`, Buffer.from(f.data, 'base64'));
  const next = frames[i + 1] ? frames[i + 1].t : f.t + 0.5;
  list.push(`file '${name}'\nduration ${(next - f.t).toFixed(4)}`);
});
list.push(`file 'f${String(frames.length - 1).padStart(5, '0')}.png'`);
fs.writeFileSync(`${out}/list.txt`, list.join('\n'));
console.log('frames', frames.length, 'seconds', (frames.at(-1).t - t0).toFixed(2));
