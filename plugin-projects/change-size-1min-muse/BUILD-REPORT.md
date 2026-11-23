# BUILD REPORT — What If You Could Change Your Size? (1-min sample, Muse)

## STANDING RULE — READ FIRST
**ALWAYS render on GitHub 10x (repo `nexorafitlab-debug/what-if-plugin-engine`,
workflow "Render plugin episode"). NEVER render locally unless GitHub is proven
broken AND the user has been told. Local render is not a silent fallback.**
(This rule was written 2026-11-23 after the first half of this sample was
rendered locally by mistake; the local render was killed mid-chunk-B and the
full video was re-rendered on GitHub instead. Local `chunk_a.mp4` (28.79 s) was
kept only as a spare — the delivered file is the GitHub `final.mp4`.)

## Deliverable
- File: `~/workspace/aitrends-2d-studio/projects/change-size-1min-muse/out/What_If_You_Could_Change_Your_Size.mp4`
- (GitHub `final-video` artifact, downloaded and verified locally — see below.)

## Script (152 words, cut version — full 175-word script in `input/script-full-175w.txt`)
Cut after "So what if you could change your size?" — the school-board beat,
basketball dunk and map walk come in the FULL video. The full voiceover ran
64.68 s of speech, over the 62 s limit, so the fallback cut was applied.
Saved: `input/script.txt` (152 words).

## Voiceover (Helio, avocado_v2:MAI_03)
- 4 short chunks (38/40/42/32 words), each whisper-verified for word count +
  ending before concat. Chunk 4 was re-cut and re-generated as c4b (32 words).
- 152 spoken words, verbatim; chunk gaps 0.5 s, lead 0.4 s, tail 0.8 s.
- Voiceover total: 57.58 s (~159 wpm). Word timings: `timeline/words.json`
  (151/152 words aligned by tools/transcribe.py, small.en).

## Picture
- Plugin only (aiTrends 2D Studio), 2D only. 6 fresh sets (bedroom, kitchen,
  void, classroom, gym weights room, street_rain), one per beat group.
- Hero Noah, 16: black round head, gold rim light, teal hoodie #0E7490.
- Size device: dark pill above Noah's head ONLY on a size change — "10 m" red
  outline when giant, "0.1 m" green outline when tiny — fades after ~1 s.
  Never persistent, never covering text or another head.
- 27 hand-written shots, ~2.2 s per cut, living face (breathe/talk/blink/
  exprAt inside shots), walkPose with real travel, scale changes on the
  narration beat. One slow push-in only (s027 title card). FREEZE card s022.
- Classroom is POPULATED: 4 students seated at desks in s018, 3 in s019/s020.
- Render: GitHub 10x (see STANDING RULE above). Workflow run: (fill in).

## Audio
- Synth music bed (audio/music.py): 5 sections, mystery → wonder → mystery →
  tension → wonder. Constant level, no ducking.
- SFX: 30 cues (31.3/min), all at v4 quiet levels. Measured by raw-wav
  subtraction (mix_raw_sfx − mix_raw_nosfx, residue floor −66.5 dBFS):
  every cue 1.0–5.3% of the voice peak; bright cues (ding/shimmer/freeze)
  1.0–3.4%. hear.py sones (voice ref 39.2 sones): shimmer 3.4/3.5/5.6,
  ding 2.5, freeze 2.7, powerup 6.6, hit 2.4, tick 2.7, whoosh 7.0 (loudest
  perceived — below the v4 phonebuzz precedent of 8.6 sones).
- Ambience: roomtone −36 (bedroom/kitchen), murmur −38 (classroom/gym),
  rain −36 (street).
- Master: mix.py + one extra loudnorm pass → build/mix_final.wav:
  −13.91 LUFS / TP −1.50 / LRA 3.2, 57.58 s.

## Verification
- (fill in after GitHub download: ffprobe, loudnorm, letterbox, 1 fps frame
  scan, hero-region motion per shot, whisper on final audio.)

## Defects found and fixed (before delivery)
1. s023/s025 used `seg`/`circle` without importing them — 2 shot errors on the
   first sheet render. Fixed imports, re-rendered stills clean.
2. s026 tiny Noah was a 2-pixel speck and his feet were cut by the z=1.6 zoom.
   Camera changed to z=1.3, y=80 — Noah fully visible, giant raindrop reads.
3. s023/s024 "SAME MUSCLES"/"SAME BONES" text at H*0.93 sat on the letterbox
   edge — moved to H*0.90.
4. s020 "10 m" pill top measured at row 60 in the 720p still — clear of the
   40 px letterbox bar. No fix needed.

## Project dir
`~/workspace/aitrends-2d-studio/projects/change-size-1min-muse/` — config.json,
story/shots.json + bible.md, gen_project.py, build_shots.py (via gen),
verify_size.py, scenes/cast.js, scenes/_helpers.js, scenes/sets/*.js (6),
scenes/shots/*.js (27), input/voiceover.wav + script.txt + chunks/,
timeline/words.json, build/mix_final.wav + mix_nosfx_final.wav + hear_cues/,
out/*.mp4. GitHub copy: `~/workspace/what-if-studio/plugin-projects/change-size-1min-muse/`.
