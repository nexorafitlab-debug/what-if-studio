# Plugin render on GitHub — SETUP

Renders an aiTrends 2D Studio plugin project on free GitHub runners in **10 parallel
chunks**, then stitches them into a video **identical** to the local render (same frames,
same sound, just faster). This is a separate setup from the old Remotion workflow
("Render episode") — that workflow is untouched.

## Where things live

| Piece | Location |
|---|---|
| Workflow | `.github/workflows/render-plugin-episode.yml` (this repo) |
| Chunk splitter | `.github/scripts/split-chunks.mjs` |
| Stitch script | `.github/scripts/stitch.mjs` |
| Projects | `plugin-projects/<name>/` (config.json, story/shots.json, scenes/, input/, build/mix_final.wav) |
| Render image | `ghcr.io/nexorafitlab-debug/plugin-render:latest` (PRIVATE) |
| Engine + Dockerfile | private repo `nexorafitlab-debug/what-if-plugin-engine` (engine is unlicensed upstream code, kept private; the image build workflow there rebuilds it on push) |

## How to trigger it (for a new project)

1. Add the project under `plugin-projects/<name>/`:
   - `config.json`, `story/shots.json`, `scenes/` (sets + shots), `timeline/words.json`
   - `input/voiceover.wav` + `input/script.txt` (voiceover is an input, not re-made)
   - **`build/mix_final.wav` — the final loudnormed mix, made locally.** This is the
     sound of the video. GitHub only muxes it; it never synthesises audio, so the sound
     is identical by construction. (Make it locally with the plugin's `audio/mix.py`,
     then the loudnorm passes, and copy the final mix here.)
2. Note the ranges the **local** build encoded as separate x264 passes (e.g. the local
   build rendered 0–29s and 29–57.73s as two passes). Those are the `encode_ranges`.
3. GitHub → Actions → **Render plugin episode** → Run workflow → set:
   - `project`: the folder name (e.g. `see-10-seconds-1min-muse`)
   - `chunks`: `10` (default)
   - `encode_ranges`: e.g. `[[0,29],[29,57.73]]` (must match the local build's passes)
4. Wait for the run. Download the final MP4 from the run's artifacts (**final-video**).

## How the 10 chunks are split

`split-chunks.mjs` reads `story/shots.json` and groups consecutive shots into 10 chunks,
balanced by total duration, with every boundary on a **shot edge** (never mid-shot).
For the test project (57.73s, 21 shots) the chunks are:
0–5.6, 5.6–10.75, 10.75–17.3, 17.3–23.3, 23.3–27.79, 27.79–34.12, 34.12–40.34,
40.34–45.9, 45.9–51.0, 51.0–57.73.
Each chunk is one matrix job running `render.mjs --from X --to Y`. Because render.mjs
chains exactly (`--from/--to` in seconds, frame `round(t*24)`), the 10 chunks are
contiguous — no frame is dropped or doubled.

## How the stitch works

1. **Lossless chunks.** Each chunk job renders to **libx264rgb, crf 0** (lossless, exact RGB
   pixels) — not the lossy final encode. Lossless is used so the stitch re-encodes from
   exact pixels, the same as the local build's PNG pipe.
2. **Concat.** The stitch job concats the 10 lossless chunks (`-c copy`) into one master.
3. **Re-encode the local ranges.** It re-encodes exactly the ranges the local build used
   (`encode_ranges`), with the local settings — libx264, preset medium, crf 18, yuv420p,
   24fps, **`-threads 6`** (thread count is the only encode setting that changes decoded
   pixels; the ffmpeg version does not). Frame-accurate via `trim=start_frame:end_frame`.
4. **Concat + mux.** The lossy ranges are concated (`-c copy`, faststart) into
   `video_silent.mp4`, then muxed with the committed `mix_final.wav` to **AAC 320k**,
   no `-shortest` (output duration = video duration, same as local).
5. **Verify.** The stitch job prints ffprobe (resolution/fps/duration) and loudnorm
   (integrated LUFS / true peak / LRA). Target: 1280×720, 24fps, −14 LUFS, TP < −1.0.

## Why the output is identical (determinism)

- The plugin draws frames in headless Chromium as a pure function of the frame index
  (no random numbers, no wall-clock; grain is a seeded LCG). Re-rendering the same
  range twice locally gives byte-identical MP4s (verified: 48/48 decoded frames match).
- The x264 thread count is pinned to 6 (local auto-threads = 6). The ffmpeg/x264 version
  does not affect decoded pixels (verified: ffmpeg 7.0.2 vs 8.1.2 give pixel-identical
  decoded frames at the same thread count).
- Audio is committed, not generated, so it cannot differ.

## Cost

Free. Standard `ubuntu-latest` runners on this public repo, 10 parallel jobs, private
ghcr.io image (free for public-repo use; the image is private because it contains the
unlicensed engine). No larger runners, no paid services.
