# BUILD REPORT — What If You Could See The Words People Swallow? (1-min sample)

## STANDING RULE — READ FIRST
**ALWAYS render on GitHub 10x (repo `nexorafitlab-debug/what-if-plugin-engine`,
workflow "Render plugin episode"). NEVER render locally unless GitHub is proven
broken AND the user has been told first. Local render is not a silent fallback.**
(Stills for helper checks are the only local renders: `node render.mjs --project
... --stills` produces PNGs in `build/stills/`, never video.)

## Status — DELIVERED, VERIFIED (2026-11-23)
- 28 hand-written shots, 6 fresh sets, story/shots.json + bible, audio mixed and
  verified (see below). GitHub 10x render **run 45173213807 — SUCCESS**, video
  downloaded and fully verified. No defects found in the final render.
- Script: `~/workspace/what-if-sample/words-swallow-script-final.txt` (1,050 words full;
  the 1-min sample uses the first 167 words — see `input/script.txt`).
- Visual guide: `~/workspace/what-if-sample/words-swallow-visual-guide-final.txt`.

## Deliverable — VERIFIED
- `out/What_If_You_Could_See_The_Words_People_Swallow.mp4`, md5
  `438574f40317b2195229d8fd55603e62`, 9,315,199 bytes, 1280×720, 24 fps,
  63.46 s, **−14.26 LUFS / TP −1.40 / LRA 3.20**, 28 shots, 37 SFX cues
  (35.0/min), 6 sets.
- Watch copy (CRF 23): `out/final-watch.mp4`, md5
  `3b5a0fdf4337a88ceb903fa27c501b74`, 4,400,366 bytes, same fps/res/duration.

## Picture (built 2026-11-23)
- 28 hand-written shots (build_story.py validates: contiguous 0–63.46 s, longest
  3.80 s, 26.5 cuts/min). Living face in every shot (breathe/talk/blink/exprAt),
  walkLocked travel in street/hallway shots, face swaps on cuts, one slow push-in
  only (s028 title card).
- Hero Eli: black round head, gold rim light, forest green hoodie #1E7B4D.
- Device: swallowedWord grey (#b8b8c0) above heads, fades; goldWord turns GOLD and
  rises in s027 (grey from 0, gold from 0.85 s). Rule card s019. Name card s013.
- 6 fresh sets: kitchen_morning, school_classroom (+seatedRow), school_hallway,
  void, street_morning (+school gate), bathroom_mirror (drawn; unused in sample).
- Stills check: full 28-shot sheet rendered clean (0 shot errors) + 4 targeted
  full-res stills, all checked by eye. Defects found + fixed:
  1. s026/s027 used POSES.smile / POSES.surprised / POSES.happy — not poses, they
     are expressions; posesAt returned undefined and breathe() crashed (s027@1.73).
     Fixed to POSES.stand / POSES.cheer (faces carry the expressions).
  2. s012 wisp text overlapped the "SPEAK UP" poster — moved left/down, clear.
  Verified after fixes: s005 full line legible, s027 gold "I'M SORRY." glowing,
  s027 post-gold glow + sparkles rising, s001 toast mid-slide, s012 wisp clear.

## Audio (built 2026-11-23)
- Voiceover: Helio, 167 words, 63.46 s, md5 a17022b227b300a9013a1d9c7910a231.
- Music: 5 sections (mystery → wonder → mystery → tension → wonder), constant bed,
  26.0 dB below the voice mean (gain-math verified; implied music gain −32.2 dB
  measured vs −33.3 dB applied — voice-file noise floor in the window).
- SFX: 37 cues (35.0/min). Residue method (mix_raw_sfx − mix_raw_nosfx): every cue
  0.9–4.3% of voice peak, loudest −35.9 dBFS (locker), none above −21.4 dBFS.
  hear.py on in-mix extracts: max 3.3 sones (locker); bright cues shimmer 2.0,
  ding 1.5, freeze 1.4 (voice ref 17.2 sones) — all below Change Size precedents.
- Master: build/mix_final.wav — **−14.26 LUFS / TP −1.50 / LRA 3.20**, 63.46 s.
- Ambience: roomtone −36 (kitchen/hallway), murmur −38 (classroom), wind −38 (street).

## GitHub render — SUCCESS, run 45173213807 (2026-11-23 ~12:27 UTC, ~7.5 min)
- Workflow: "Render plugin episode", repo nexorafitlab-debug/what-if-plugin-engine
- Inputs: project=words-swallow-1min, chunks=10, encode_ranges=[[0,63.46]], fps=24
- Commit ec5f4c1 ("words-swallow-1min: 1-min sample, 28 shots, 167 words, Helio
  voice, mix_final -14.26 LUFS"), 46 files. All 12 jobs success (setup + 10
  render chunks + stitch). Artifact "final-video" → final.mp4 (9,315,199 bytes).
- The `gh run watch` session flooded context (refresh every 3 s) and was killed
  mid-wait; a quiet 1/min polling waiter confirmed completion.

## Verification of the final video (verify_final.py, 2026-11-23)
- Format: 1280×720, 24 fps, 1523 frames, 63.46 s. Loudness on the mp4:
  **−14.26 LUFS / TP −1.40 / LRA 3.20** (TP −1.40 vs mix −1.50 = AAC encode).
- Whisper (faster-whisper small.en): 167 words heard; **161/167 strict (96.4%)**.
  The 6 gaps are all whisper spelling artefacts, not missing words: "grey"→"gray"
  (×4), "are sixteen."→"were 16". All 167 script words present, in order, no
  invented lines.
- A/V sync: median **+0.000 s**, mean −0.087 s, max |d| 0.92 s, **0 words off by
  >1 s** — flat. First word ref 0.08 s / heard 0.0 s; last word ends ref 62.06 s /
  heard 62.1 s.
- Letterbox: 63 frames checked, **no bad bars** (40 px pure black). Frame means:
  no frame below 3 in the content area — **no black holes**.
- 1 fps eye scan (63 frames, 3 contact sheets in build/verify/): all 28 shots
  present in order, no glitches, no missing shots, no "null" text. Eli's look
  right in every shot (black round head, gold rim, green hoodie). Grey words
  appear above heads and fade on cue (kitchen f007–f011, classroom, hallway
  wisp clear of the SPEAK UP poster). **Gold turn verified at full res: at
  57.4 s and 57.6 s "I'M SORRY." is bright gold with glow, mid-rise — exactly
  on the narration "turned gold" (57.24–57.54 s); by 58.2 s it has risen and
  faded, 58.8 s only sparkles remain.** Title card f061–f063 glowing gold on
  the starry void, slow push-in.
- **No defects found in the final render — no re-render needed.**
- verify_final.py fixes applied during this run (kept in the file): loudnorm
  call must not use `-v error` (it hides the JSON); faster-whisper 1.2.1 vs
  PyAV 19 — av.open monkeypatched to drop the removed `metadata_errors` kwarg;
  run with ~/workspace/venv-video/bin/python (has a working faster_whisper).


## Config (`config.json`)
- Title: "What If You Could See The Words People Swallow?", fps **24**, bars **40**,
  style **dusk**, music gainDb **-17**, sfx gainDb **-6**, loudness -14 LUFS.
- Duration **63.46 s** (updated from the 57.58 s placeholder to match the voiceover).

## Cast (`scenes/cast.js`)
- ELI (hero, 16): forest green hoodie **#1E7B4D**, black round head, **gold rim light**
  (shots pass `rim { color: '#ffd76a', dir: [-1, -1], w: 4 }` on his drawFigure calls).
- MOM (purple top, bun), DAD (grey/brown work shirt), JUNE (yellow top, ponytail,
  draws birds), THEO (blue top, cap), MR HALE (grey, glasses, red pen), COLE (red/dark
  top), GRANDMA ROSE (82, pale hospital gown, white hair — white hair is NOT a rig
  option, shots draw a white bun over her black head), BUS MAN + BUS WIFE, STRANGER
  (bus sting), GIRL + FRIEND (gold-seed beat), KID (Cole's victim), STU1–STU6 and
  PASSER1–2 background. All solid black round heads; gold rim light on Eli only.

## The swallowed-words device (`scenes/_helpers.js`, verified by stills)
- `swallowedWord(g, fig, words, t, o)` — grey ALL-CAPS (#b8b8c0, soft glow) floating
  just above a character's head (headPos, same gap as the counter pill). Fades in
  0.15 s, hangs, fades out over the last ~0.4 s (`o.fadeAt`, default `o.dur - 0.4`).
  Long lines split into 2 (break at the space nearest the middle) and shrink to fit
  62% of frame width. Block is clamped inside the frame and kept below the letterbox
  bar (computed as `E.cfg.bars / E.PX`, i.e. 60 logical units at 720p). Never covers
  another face or a sign — shots own the composition (or pass `o.x/o.y/o.dy`).
- `goldWord(g, fig, words, t, o)` — before `o.at` the words hang grey (from
  `o.greyAt`, default 0); from `o.at` they turn GOLD (#ffd76a, glowing) and RISE
  ~90 px while fading over ~1 s. Used exactly three times in the full video: the
  girl's apology, Grandma's words, Dad's forgiveness. BUG FOUND AND FIXED during
  still checks: the first version passed `at` into the grey phase, so the grey
  words were invisible before the turn — fixed by hanging grey from `greyAt`.
- `mirrorWords(g, x, y, words[], t, o)` — a STACK of grey words above the mirror
  reflection's head; each line fades in/out staggered (`o.stagger`, default 0.3 s),
  melting from the top down. Bathroom-mirror twist only.
- `wordCount(g, n, t, o)` — "43 words today" infographic: dark tile, big gold
  number, small label "WORDS SWALLOWED TODAY"; optional count-up from `o.from`
  over `o.dur` in hard integer jumps.
- Also kept from Change Size: `sizePill`, `jumpValue`, `goldLine`, `freezeLabel`,
  `handPos`, `drawPhone`, `drawEarring`, `drawDrop`.

## Helper stills (rendered locally, `node render.mjs --project projects/words-swallow-1min --stills 1.5,2.85,3.5,4.3,7.5,10.5`)
All checked by eye — clean. Temp test shots + test `story/shots.json` were DELETED
after the check; `scenes/shots/` and `story/` are empty again for the shots subagent.
- `build/stills/1.5s_1.50.png` — swallowedWord full: "I'M SORRY I / MISSED YOUR GAME."
  bright grey, two lines, legible, clear of Mom's face.
- `build/stills/2.85s_2.85.png` — same words visibly faded (dim) — the fade-out works.
- `build/stills/3.5s_3.50.png` — goldWord grey phase: "I'M SORRY." grey above the girl.
- `build/stills/4.3s_4.30.png` — goldWord gold phase: "I'M SORRY." gold, glowing, risen.
- `build/stills/7.5s_7.50.png` — mirrorWords: "I'M SORRY. / I'M SCARED. / I LOVE YOU."
  stacked above the dim reflection's head; Eli (gold rim) at left.
- `build/stills/10.5s_10.50.png` — wordCount: gold "32" (counting up 0→43 over 2 s)
  on a dark tile, "WORDS SWALLOWED TODAY" below. (Final number is 43.)
- `build/stills/sheet_01.png` — contact sheet of the six stills.
- Note: the set drawings in these stills are bare dark backdrops — the set files are
  STUBS (see below); the real drawings come from the shots subagent.

## Sets — 6 stubs (`scenes/sets/`, header comment + empty draw function each)
1. `kitchen_morning.js` — cold open: Mom, toast, "I'M SORRY I MISSED YOUR GAME."
2. `school_classroom.js` — Hale + June beats.
3. `school_hallway.js` — Cole beat.
4. `void.js` — starry void for science/text cards.
5. `street_morning.js` — walk to school.
6. `bathroom_mirror.js` — mirror twist.
All fresh drawings (never copied from Change Size). The shots subagent fills the
drawing code. The full video has 28 sets (see its BUILD-REPORT.md).

## Project dir
`~/workspace/aitrends-2d-studio/projects/words-swallow-1min/` — config.json,
gen_project.py, verify_size.py, scenes/cast.js, scenes/_helpers.js, scenes/sets/*.js (6),
scenes/shots/ (EMPTY), story/ (EMPTY), input/ (script.txt — voiceover subagent),
build/ (helper stills), out/ (EMPTY), timeline/ (EMPTY).
- `gen_project.py` still contains the Change Size generation code — the shots subagent
  replaces/regenerates it for this video; do not run it as-is.
- Workflow retention fix: already committed in the repo (see full project's report) —
  chunk artifacts 1 day, final-video artifacts 7 days.
