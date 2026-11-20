# What If Studio

Remotion 4.0.530 studio for long-form (8–12 min) "What If" YouTube videos, 1920×1080
30fps, built to the Ifinite house standard: black round heads, counter tight to the
head, static camera with hard cuts every ~3s, heavy on-screen text, no subtitles,
music ~27 dB below the voice, final loudness −14 LUFS.

## Render on GitHub Actions (the fast route)

The full video is rendered in parallel: the frame range is split into N chunks, one
Actions job per chunk, then a stitch job concats them, mixes the audio stems,
loudnorms to −14 LUFS and downscales to 1280×720.

1. Push this repo to a **public** GitHub repo (public = unlimited free Actions minutes).
2. GitHub repo → **Actions** tab → **Render episode** → **Run workflow**.
3. Inputs:
   - `composition` — Remotion composition id, e.g. `DeathCountV2`
   - `slug` — episode slug; audio stems live in `public/<slug>/`, e.g. `death-count-v2`
   - `total_frames` — frames in the composition, e.g. `976` (DeathCountV2, 32.6s @ 30fps)
   - `chunks` — parallel render jobs, e.g. `4` (use 8 for a full 8-minute video)
4. When it finishes, download the `final-<Composition>-720p` artifact from the run.

Workflow: `.github/workflows/render.yml`. Stitch script: `scripts/stitch.sh`.

## Render locally (slow — this VM does ~1 s/frame)

```bash
TMPDIR=/home/hatch/tmp-remotion python3 ~/.claude/skills/what-if-animation/scripts/master.py <slug>
```

That renders `out/<slug>/<slug>-raw.mp4`, loudnorms to −14 LUFS, and writes
`out/<slug>/<slug>-final.mp4` (1920×1080). Downscale to 1280×720 with ffmpeg:

```bash
ffmpeg -y -i out/<slug>/<slug>-final.mp4 -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -c:a copy <slug>-1280x720.mp4
```

## Local sharded render (test the same split GitHub Actions uses)

```bash
# chunk 0: frames 0-487, chunk 1: frames 488-975 (DeathCountV2 = 976 frames)
TMPDIR=/home/hatch/tmp-remotion node node_modules/@remotion/cli/remotion-cli.js render src/index.ts DeathCountV2 chunk-0.mp4 --frames=0-487 --muted --log=error
TMPDIR=/home/hatch/tmp-remotion node node_modules/@remotion/cli/remotion-cli.js render src/index.ts DeathCountV2 chunk-1.mp4 --frames=488-975 --muted --log=error
mkdir -p chunks && mv chunk-0.mp4 chunk-1.mp4 chunks/
bash scripts/stitch.sh death-count-v2 976 2 chunks final-DeathCountV2-720p.mp4
```

## Notes

- `remotion.config.ts` uses `REMOTION_BROWSER` when set (GitHub Actions Chrome);
  locally it defaults to the VM's `chrome-wrapper.sh` (headless Chrome + --no-sandbox).
- Audio stems in `public/<slug>/` are pre-attenuated to their target relative levels
  (music ~27 dB below voice); `scripts/stitch.sh` mixes them at volume 1.0.
- `out/` (renders) and `node_modules/` are git-ignored and never committed.
