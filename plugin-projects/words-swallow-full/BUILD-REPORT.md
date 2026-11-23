# BUILD REPORT — What If You Could See The Words People Swallow? (FULL video)

## STANDING RULE — READ FIRST
**ALWAYS render on GitHub 10x (repo `nexorafitlab-debug/what-if-plugin-engine`,
workflow "Render plugin episode"). NEVER render locally unless GitHub is proven
broken AND the user has been told first. Local render is not a silent fallback.**
(Stills for helper checks are the only local renders: `node render.mjs --project
... --stills` produces PNGs in `build/stills/`, never video.)

## Status — RENDERING ON GITHUB 10x (2026-11-23)
- 193 shots, 28 fresh sets, story/shots.json + bible, audio mixed and verified
  (see below). GitHub 10x render dispatched — run number + verification below.
- Script: `~/workspace/what-if-sample/words-swallow-script-final.txt` (1,050 words,
  NOT changed a word). Visual guide: `~/workspace/what-if-sample/words-swallow-visual-guide-final.txt`.

## Config (`config.json`)
- Title: "What If You Could See The Words People Swallow?", fps **60**, bars **40**,
  style **dusk**, music gainDb **-17** (was -21: raised 3 dB to match the approved
  1-min sample's 26 dB music gap), sfx gainDb **-6**, loudness -14 LUFS,
  duration **430.94 s**.

## Workflow retention fix — ALREADY IN PLACE (no commit made)
- Checked `~/workspace/what-if-plugin-engine/.github/workflows/render-plugin-episode.yml`:
  chunk artifacts `retention-days: 1` (line 106), final-video artifacts
  `retention-days: 7` (line 144). Commit `e6892c2` — "Retention: chunk artifacts
  7d -> 1d, final-video 30d -> 7d (stop the ~23 GB storage pile-up)" — already on the
  repo. Verified, no no-op commit made.

## Picture (built 2026-11-23)
- 193 shots, 0.0–430.94 s, **26.9 cuts/min**, longest 3.94 s, shortest 0.88 s,
  no tiling gaps. 28 fresh sets, all used. 275 SFX cues (38.3/min).
  Pause cards cover the 3 chapter pauses exactly: s032 (63.66–67.2),
  s081 (177.98–181.56), s132 (288.96–292.48).
- Living face in every shot (breathe/talkAmount/blink/exprAt), walkLocked travel
  in street/hallway/corridor shots, face swaps on cuts.
- Hero Eli: black round head, gold rim light, forest green hoodie #1E7B4D.
- Device: swallowedWord grey (#b8b8c0) above heads, fades; goldWord turns GOLD
  and rises exactly 3 times (girl's apology s029, Grandma's words s129,
  Dad's "DAD, I FORGIVE YOU." s145). Eli's own words ONLY in the mirror
  (mirrorWords, 13 mirror shots). "43" count + "GOODBYE" sting read clearly.
- Infographics (drawn in-shot): 43-word count-up; ~6,000 thoughts/day
  (100-dot grid, each dot = 60 thoughts); Bronnie Ware top five (numbered 1–5,
  #3 "courage to express my feelings" GOLD); Wegner white bear (FREEZE-bracketed);
  Gilovich/Medvec bars (actions 42% vs inactions 88%, inactions gold, FREEZE-bracketed).
- Stills check: full 193-shot sheet rendered clean (0 shot errors) + full-res
  eye check of every contact sheet. Defects found + fixed:
  1. `POSES.thinking` / `POSES.turn` / `POSES.determined` are not poses
     (thinking/determined are expressions; turn does not exist) — breathe()
     crashed in s040/s045/s107/s142/s143/s154. Emitter alias added
     (thinking→think, turn→stand, determined→stand).
  2. `poly` not imported in roof.js / hospital_corridor.js — added.
  3. science_lab.js apostrophes in single-quoted JS strings — double-quoted.
  4. Grey swallowed words unreadable on bright backgrounds (lit window s028,
     bright sky s067, pale IV bag s105 "R") — swallowedWord now uses a dark
     halo glow `rgba(8,8,18,0.8)` instead of the light-grey glow.
  5. Science-lab text pile-up: shot text + FREEZE + board sketch/"WHITE BEAR"
     all collided on the cream whiteboard (s156/s157/s159/s160/s161) —
     board is now a blank dark chalkboard; s156 restacked (DANIEL 0.32H,
     THOUGHT SUPPRESSION 0.44H, FREEZE 0.20H); s161 restacked
     (GILOVICH 0.32H, THE LONG RUN 0.44H, Eli moved right, facing the text);
     white bear moved right (_bx 0.78W) so its ears clear the centred lines.
  6. s153 "EVERY WORD." overlapped the gate sign "SAY WHAT YOU MEAN" —
     lines moved to 0.34H/0.48H, Eli moved left of the gate.
  7. s181 caption "MOST FADE BEFORE ANYONE HEARS THEM" crossed by fading dots —
     moved up to 0.42H, clear of the dot grid.
  8. Mirror reflection looked brown-headed at thumbnail scale — pixel-sampled:
     reflection head is (54,66,77) dark blue-grey, correct dimmed Eli. NOT a defect.
  Re-rendered stills after fixes: all 7 fixed shots verified clean at full res.

## Audio (built + verified 2026-11-23)
- Voiceover: Helio, 1,050 words, 430.94 s, md5
  `4fa8341806f528320e6754b8ce6a568c` (verified before dispatch).
- Music: 8 sections (mystery → wonder → tension → mystery → tension → wonder →
  mystery → wonder), constant bed, **~26 dB below the voice mean** (same recipe as
  the approved 1-min sample: gainDb -17; pause-window music+amb −50.3 to −52.2 dBFS
  vs voice active-mean −27.1 dBFS).
- SFX: 275 cues (38.3/min). Residue method (mix_raw_sfx − mix_raw_nosfx):
  worst cue 3.6% of voice peak, loudest −34.9 dBFS (hit) — none above −21.4 dBFS.
  hear.py (sones, voice ref 16.1): hit 1.5, ding 1.6, shimmer 2.0, freeze 1.6 —
  all far below Change Size precedents. No phonebuzz cues in this video.
- Master: build/mix_final.wav — **−14.11 LUFS / TP −1.47 / LRA 4.10**, 430.94 s
  (single-pass loudnorm undershot at −14.98; corrected with a measured two-pass
  loudnorm, dynamics preserved).

## Cast (`scenes/cast.js`)
- ELI (hero, 16): forest green hoodie **#1E7B4D**, black round head, **gold rim light**
  (shots pass `rim { color: '#ffd76a', dir: [-1, -1], w: 4 }` on his drawFigure calls).
- MOM (purple top, bun), DAD (grey/brown work shirt), JUNE (yellow top, ponytail,
  draws birds), THEO (blue top, cap), MR HALE (grey, glasses, red pen), COLE (red/dark
  top), GRANDMA ROSE (82, pale hospital gown, white hair — white hair is NOT a rig
  option, shots draw a white bun over her black head), BUS MAN + BUS WIFE, STRANGER
  (bus sting), GIRL + FRIEND (gold-seed beat), KID (Cole's victim), STU1–STU6 and
  PASSER1–2 background. All solid black round heads; gold rim light on Eli only.

## The swallowed-words device (`scenes/_helpers.js`)
- `swallowedWord(g, fig, words, t, o)` — grey ALL-CAPS (#b8b8c0, dark halo glow)
  floating just above a character's head (headPos, same gap as the counter pill).
  Fades in 0.15 s, hangs, fades out over the last ~0.4 s (`o.fadeAt`, default
  `o.dur - 0.4`). Long lines split into 2 (break at the space nearest the middle)
  and shrink to fit 62% of frame width. Block is clamped inside the frame and kept
  below the letterbox bar. Never covers another face or a sign — shots own the
  composition (or pass `o.x/o.y/o.dy`).
- `goldWord(g, fig, words, t, o)` — before `o.at` the words hang grey (from
  `o.greyAt`, default 0); from `o.at` they turn GOLD (#ffd76a, glowing) and RISE
  ~90 px while fading over ~1 s. Used exactly three times: the girl's apology,
  Grandma's words, Dad's forgiveness.
- `mirrorWords(g, x, y, words[], t, o)` — a STACK of grey words above the mirror
  reflection's head; each line fades in/out staggered (`o.stagger`, default 0.3 s),
  melting from the top down. Bathroom-mirror twist only.
- `wordCount(g, n, t, o)` — "43 words today" infographic: dark tile, big gold
  number, small label "WORDS SWALLOWED TODAY"; optional count-up from `o.from`
  over `o.dur` in hard integer jumps.
- Also kept from Change Size: `sizePill`, `jumpValue`, `goldLine`, `freezeLabel`,
  `handPos`, `drawPhone`, `drawEarring`, `drawDrop`.

## GitHub render — PENDING
- Workflow: "Render plugin episode", repo nexorafitlab-debug/what-if-plugin-engine
- Inputs: project=words-swallow-full, chunks=10, encode_ranges=[[0,430.94]], fps=60
- Run number, result and verification to be filled in after the run.
