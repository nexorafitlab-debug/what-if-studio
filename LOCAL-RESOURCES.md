# Local resources — this machine (Muse VM)

Read this before SKILL.md step 2 (voice) and step 7 (sound). There is NO
ElevenLabs key on this machine. Never sign up, never pay, never ask the user
for a key. Everything below is free and already installed. Report every run's
cost as $0 / 0 credits.

## Voice (replaces ElevenLabs TTS)

- Narrator: Muse TTS, voice Helio (male):
  `/opt/hatch/bin/tts speak --voice avocado_v2:MAI_03 --text-stdin --output <out.mp3> --format mp3`
  Feed the script text on stdin. One call per beat/section. If a long take
  comes back garbled or repeated, split the text into shorter calls and join
  with ffmpeg — re-voicing identical text returns the identical file, so
  splitting is the fix.
- Word timings: faster-whisper, tiny model, Python API, in
  `~/workspace/venv-video/` (av pinned 12.3.0). Write `words.json` in the
  same shape `voice.py` writes.
- Pause tightening: reuse the `gaps` logic from `episode.json` on the local
  wav (cut pauses longer than their limit, from the middle). Write the same
  outputs `voice.py` writes: `public/<slug>/voice.wav` and
  `src/episodes/<slug>/words.json`.
- Do NOT run `scripts/voice.py` — it calls api.elevenlabs.io and fails
  without a key.

## Sound effects + music (replaces ElevenLabs SFX)

- Do NOT run `scripts/sfx.py` to generate clips. Pick matching clips from
  the free libraries and copy them into `library/sfx/` so they join the
  shared library:
  - `~/workspace/sfx-library/` — 1,196 sounds, index at `SFX-LIBRARY.md`.
  - `~/workspace/sfx-library/reference-pack/` — 100 SFX + 20 music beds,
    `INDEX.md` lists them.
- Music bed: Kevin MacLeod, CC-BY 4.0 (in reference-pack). Credit in the
  video description.
- Levels follow the skill (`references/sound.md`, mixcheck rules). Master to
  -14 LUFS, peaks under -1 dBTP.

## Rendering

- Browser: Remotion needs headless Chrome. Use this exact binary:
  `/home/hatch/.cache/hyperframes/chrome/chrome-headless-shell/linux-158.0.8127.36/chrome-headless-shell-linux64/chrome-headless-shell`
  Pass it with `--browser-executable` or set it in `remotion.config.ts`.
  These are 2D SVG scenes — plain headless Chrome is enough, no WebGL
  flags needed.
- Fonts: Google Fonts is blocked by the VM proxy. Titles use the local
  Montserrat in `public/fonts/` (already set as `titleFont` in
  `src/studio.config.ts`). Do not add Google Fonts imports.
- TMPDIR: `/home/hatch/workspace/hyperframes-cache` (`/tmp` is nearly
  full). Run renders with `TMPDIR=/home/hatch/workspace/hyperframes-cache`.
- The studio renders at 1920x1080, 30fps. Our channel delivers 1280x720 —
  downscale the final mp4 with ffmpeg if needed.

## Costs

$0. No credits, no subscriptions, no paid tools. Say so when handing over.
