// split-chunks.mjs — split a plugin project's shots into N shot-aligned chunks.
// Usage: node .github/scripts/split-chunks.mjs <project-dir> <n-chunks>
// Reads <project-dir>/story/shots.json. Groups consecutive shots into N chunks,
// balancing total duration, with every boundary on a shot edge (never mid-shot).
// Writes to $GITHUB_OUTPUT: matrix=<json>, duration=<seconds>, title=<title>.
// matrix: [{index, from, to, shots}] — from/to are seconds, ready for render.mjs --from/--to.
import fs from 'node:fs';
import path from 'node:path';

const [projectDir, nStr] = process.argv.slice(2);
const n = Math.max(1, parseInt(nStr || '10', 10));
const shotsPath = path.join(projectDir, 'story', 'shots.json');
const data = JSON.parse(fs.readFileSync(shotsPath, 'utf8'));
const shots = data.shots;
const duration = data.duration ?? shots[shots.length - 1].end;
const title = data.title ?? path.basename(projectDir);

// Balanced greedy: add a shot to the current chunk only if it keeps the chunk
// closer to the per-chunk target; otherwise close the chunk and start a new one.
// (A plain "close when >= target" greedy overshoots and leaves a tiny last chunk.)
const target = duration / n;
const chunks = [];
let cur = [];
let curDur = 0;
for (const s of shots) {
  const d = s.end - s.start;
  if (cur.length > 0 && chunks.length < n - 1 && Math.abs(curDur - target) <= Math.abs(curDur + d - target)) {
    chunks.push(cur);
    cur = [];
    curDur = 0;
  }
  cur.push(s);
  curDur += d;
}
if (cur.length) chunks.push(cur);

const matrix = chunks.map((cs, i) => ({
  index: i,
  from: cs[0].start,
  to: cs[cs.length - 1].end,
  shots: `${cs[0].id}-${cs[cs.length - 1].id}`,
  count: cs.length,
}));

const out = process.env.GITHUB_OUTPUT;
const lines = [
  `matrix=${JSON.stringify(matrix)}`,
  `duration=${duration}`,
  `title=${title}`,
];
if (out) fs.appendFileSync(out, lines.join('\n') + '\n');
console.log(JSON.stringify({ duration, title, chunks: matrix }, null, 2));
