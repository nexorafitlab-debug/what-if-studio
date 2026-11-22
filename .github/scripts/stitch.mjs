// stitch.mjs — stitch lossless render chunks into the final video, exactly like the local build.
// Usage: node .github/scripts/stitch.mjs --project <dir> --chunks <dir> --ranges '[[0,29],[29,57.73]]' --fps 24 --mix <wav> --out <mp4>
// Steps:
//  1. Concat the lossless libx264rgb chunks (exact RGB) into one lossless master.
//  2. Re-encode each range in --ranges (the ranges the LOCAL build encoded as separate
//     x264 passes) with the local settings: libx264, preset medium, crf 18, yuv420p, 24fps,
//     -threads 6. Frame-accurate via trim on the lossless master.
//  3. Concat the lossy ranges with -c copy -> video_silent.mp4 (same as local).
//  4. Mux the committed final mix (build/mix_final.wav) -> AAC 320k, no -shortest
//     (output duration = video duration, same as local). Faststart.
//  5. Verify: ffprobe (duration/resolution/fps) + loudnorm (integrated loudness / true peak).
// The audio is NOT generated here — it is made locally and committed with the project,
// so the sound is identical by construction. Only the video frames are rendered on GitHub.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : def;
}
function run(cmd, args, opts = {}) {
  console.log('+', cmd, args.join(' '));
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });
}
function runOut(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8' });
}

const projectDir = arg('--project');
const chunksDir = arg('--chunks');
const ranges = JSON.parse(arg('--ranges', '[[0,29],[29,57.73]]'));
const fps = parseInt(arg('--fps', '24'), 10);
const mixPath = arg('--mix');
const outPath = arg('--out');
const workDir = arg('--work', path.dirname(outPath));
fs.mkdirSync(workDir, { recursive: true });

// 1. Concat lossless chunks in index order.
const chunkFiles = fs.readdirSync(chunksDir)
  .filter((f) => /^chunk_\d+\.mp4$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
if (chunkFiles.length === 0) throw new Error(`no chunk_*.mp4 found in ${chunksDir}`);
console.log(`found ${chunkFiles.length} lossless chunks: ${chunkFiles.join(', ')}`);
const listPath = path.join(workDir, 'lossless_list.txt');
fs.writeFileSync(listPath, chunkFiles.map((f) => `file '${path.join(chunksDir, f).replace(/'/g, "'\\''")}'`).join('\n'));
const losslessPath = path.join(workDir, 'lossless_all.mp4');
run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', losslessPath]);

// 2. Re-encode each range. Frame ranges are contiguous: frame(f) = round(t * fps).
//    Local chunk_a = frames [0,696) (0-29s), chunk_b = [696,1386) (29-57.73s).
const rangeFiles = [];
for (let i = 0; i < ranges.length; i++) {
  const [from, to] = ranges[i];
  const sf = Math.round(from * fps);
  const ef = Math.round(to * fps);
  const rf = path.join(workDir, `range_${i}.mp4`);
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', losslessPath,
    '-vf', `trim=start_frame=${sf}:end_frame=${ef},setpts=PTS-STARTPTS`,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-r', String(fps), '-threads', '6',
    '-an', rf,
  ]);
  rangeFiles.push(rf);
}

// 3. Concat the lossy ranges -> video_silent.mp4 (same as local: -c copy + faststart).
const rangeList = path.join(workDir, 'range_list.txt');
fs.writeFileSync(rangeList, rangeFiles.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
const silentPath = path.join(workDir, 'video_silent.mp4');
run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', rangeList, '-c', 'copy', '-movflags', '+faststart', silentPath]);

// 4. Mux the committed final mix -> AAC 320k. No -shortest: output duration = video
//    duration (57.75s), the mix (57.73s) ends 0.02s early — same as the local final.
run('ffmpeg', [
  '-y', '-v', 'error', '-i', silentPath, '-i', mixPath,
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
  '-movflags', '+faststart', outPath,
]);

// 5. Verify.
const probe = JSON.parse(runOut('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', outPath]));
const vs = probe.streams.find((s) => s.codec_type === 'video');
const as = probe.streams.find((s) => s.codec_type === 'audio');
console.log('VERIFY video:', vs.width + 'x' + vs.height, vs.r_frame_rate + ' fps', 'duration', probe.format.duration + 's');
console.log('VERIFY audio:', as.codec_name, as.sample_rate + 'Hz', 'duration', as.duration + 's');
const ln = runOut('ffmpeg', ['-i', outPath, '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
const m = ln.match(/\{[\s\S]*\}/);
if (m) {
  const j = JSON.parse(m[0]);
  console.log(`VERIFY loudness: integrated ${j.input_i} LUFS, true peak ${j.input_tp} dBTP, LRA ${j.input_lra} LU`);
}
console.log('DONE:', outPath);
