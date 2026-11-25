# BUILD REPORT — What If Every Lie You Tell Grows A Feather? (1-min sample)

## STANDING RULE — READ FIRST
**Render on GitHub 10x ONLY, on the NEW public-repo setup (user decision
2026-11-25 ~02:16 AST — see "GitHub render" below). The OLD private workflow
(repo `nexorafitlab-debug/what-if-plugin-engine`) is DEAD: its artifact storage
quota is exhausted for November (blocked until Dec 1) and every dispatch fails
at artifact upload. NEVER dispatch on the old workflow again. NEVER render
video locally unless GitHub is proven broken AND the user has been told first.**
(Stills for helper checks are the only local renders: `node render.mjs --project
... --stills` produces PNGs in `build/stills/`, never video.)

## Status — BUILT, MIX VERIFIED, STILLS VERIFIED, RENDER-READY (NO RENDER YET)
- 27 hand-written shots, 6 fresh sets, story/shots.json + bible, audio mixed and
  verified (see below), full 27-shot stills sheet re-checked post-fix (27/27 clean).
  **No video exists yet** — the sample is render-ready and waits for the NEW
  public-repo GitHub setup (infra worker building it). Do NOT dispatch on the old
  private workflow.
- Script: `~/workspace/what-if-sample/feathers-script-final.txt` (1,045 words full;
  the 1-min sample uses the first **152 words** — see `input/script.txt` — ending at
  "So what if every lie you tell grows a feather?").
- Visual guide: `~/workspace/what-if-sample/feathers-visual-guide-final.txt`.

## Deliverable — NOT RENDERED YET (render-ready, awaiting new GitHub setup)
- Planned: `out/What_If_Every_Lie_You_Tell_Grows_A_Feather.mp4`, 1280×720, 24 fps,
  55.18 s, 27 shots, 31 SFX cues (33.7/min), 6 sets.
- Watch copy (CRF 23): `out/final-watch.mp4` — made after the render.
- Voiceover + mix are final and will NOT be rebuilt for the render:
  `input/voiceover.wav` md5 3713535585c9df2efd86db5d2c447369 (55.18 s);
  `build/mix_final.wav` md5 0bb63d708e942a3510e9e1b0910c0923 (−14.12 LUFS / TP −1.38).

## Picture (built 2026-11-25)
- 27 hand-written shots (build_story.py validates: contiguous 0–55.18 s, longest
  3.52 s, 29.4 cuts/min). Living face in every shot (breathe/talk/blink/exprAt),
  walkLocked travel in s001 (Kai walks into the kitchen) and s017 (Kai walks the
  hallway while students stare), face swaps on cuts, one slow push-in only (s027
  title card).
- Hero Kai: black round head, gold rim light, **burgundy hoodie #800020 (LOCKED —
  deep wine red, reads burgundy in stills, not brown; the full-video worker must
  copy this exact hex)**.
- Device: feathers (scenes/_feathers.js) — see below. Rule cards s014 (white),
  s015 (black), s021 (tell the truth), s026 (that is the rule). Name card s012.
  On-screen text: "POP.", "IN ONE SECOND", "ONLY YOURS.", rule cards, title card.
- 6 fresh sets: kitchen_morning, school_classroom, cafeteria (drawn, unused in the
  sample — the lunch count is in the full video), bathroom_mirror (drawn, unused —
  the mirror beats are in the full video), school_hallway, void.
- Stills check: full 27-shot sheet rendered clean (0 shot errors) + 13 targeted
  full-res stills, all checked by eye. Final post-fix sheet re-rendered
  2026-11-25 ~06:20 UTC and checked again by eye: **27/27 shots clean** — no black
  holes, no glitches, no "null" text, faces clear in every collar-feather shot,
  feathers visible in every relevant shot, Kai's burgundy #800020 reads deep
  wine-red in every shot, gold rim light on the head edge. Defects found + fixed:
  1. Collar feathers pointed straight UP and covered Kai's face (s016, s019 —
     the grown-back feather hid his whole head). Fixed: collar anchor moved lower
     + behind the shoulder (hy + hr*1.55, hx − facing*hr*0.5) and every collar
     feather now leans BACK (rot −1.0) away from the face. Re-checked: face clear
     in s016/s019/s020/s021, feather reads as growing from the collar/shoulder.
  2. Wrist feathers too small — len 55 read as a white blob, not a feather
     (s008). Fixed: wrist close-ups enlarged (s008 55→95, s009 75→110, s010 growth
     50–115→70–140, s011 48→60, s013 62→75, s026 58→70). Re-checked: s008/s009
     feathers now read clearly at the raised hand, s009 "POP." with ring burst.
  3. Feather fall verified in s023 still (feather mid-fall beside Kai's shoulder,
     face visible) and s024 (feather drifting like snow).
- Helper test (temp project `_feather-test`, deleted after): featherCount tile
  "FOUR" + "WRIST · COLLAR · HAND · NECK" renders clean; black feather with glow
  reads clearly; featherFall with turnWhite turns the black feather white over
  the first 30% of the fall and fades it out — all as specified. featherCount is
  built for the FULL video's lunch beat (the lunch count is not in this sample).

## Audio (built 2026-11-25)
- Voiceover: Helio, 152 words, 55.18 s, md5 3713535585c9df2efd86db5d2c447369.
  4 chunks (44/42/45/21 words), every chunk whisper-verified 100% match, end_ok.
  No chapter pauses (the title question is the last chunk). Pace ~174 wpm.
- Music: 5 sections (mystery → wonder → tension → mystery → wonder), constant bed,
  gain −17 as in Words Swallow. Music-only gaps measure −37 to −43 dBFS (mean
  ~−39.5), ~25 dB below the voice-active RMS (−14.0 dBFS in the master) — same
  relative level as the approved Words Swallow sample (26 dB below voice).
- SFX: 31 cues (33.7/min). Residue method (mix_raw_full − mix_raw_nosfx, master
  gain applied): every cue 0.50–3.85% of voice peak, loudest −36.2 dBFS (stinger),
  none above −21.4 dBFS. Ding/shimmer/freeze 0.50–1.42% of voice peak — inside the
  approved ≤5% rule; other SFX 1.84–3.85% — inside the 5–10% rule.
  hear.py on residue extracts (master gain applied, voice ref 26.7 sones):
  loudest swish 9.1 sones, stinger 7.3, shimmer 5.9, ding 5.0, freeze 1.8.
  (Sones run higher than Words Swallow's in absolute terms because this master
  runs hotter in absolute level — voice ref 26.7 vs 17.2 sones there; by the
  user's approved peak rule every cue is in spec, same gains as the approved v4.)
- Master: build/mix_final.wav, md5 0bb63d708e942a3510e9e1b0910c0923 — **−14.12 LUFS /
  TP −1.38 / LRA 4.00**, 55.18 s. NOTE: mix.py's single-pass loudnorm capped at
  −15.11 LUFS (target_offset 1.10 — the raw mix's crest factor); the master was
  finished as raw mix +14.06 dB linear gain + alimiter (limit 0.80, attack 1 ms),
  which touches only 0.35% of voice-active samples (momentary plosive peaks,
  longest run 1.1 ms) and lands at −14.12 LUFS / TP −1.38. Two-stage compression
  was tried first (−14.71) and rejected — it barely moved the number.
- Ambience: roomtone −36 (kitchen/hallway), murmur −38 (classroom).

## GitHub render — OLD WORKFLOW FAILED TWICE; NEW SETUP PENDING
- Old workflow: "Render plugin episode", repo nexorafitlab-debug/what-if-plugin-engine.
  Inputs: project=feathers-1min, chunks=10, encode_ranges=[[0,55.18]], fps=24.
  Commit `0b0d092` (pushed to origin main) — project copied to
  `~/workspace/what-if-studio/plugin-projects/feathers-1min/`.
- Run **45556869034** (2026-11-25 ~05:55 UTC): FAILED — all 10 chunks rendered
  fine, every `upload-artifact` step failed: "Artifact storage quota has been
  hit. Unable to upload any new artifacts. Usage is recalculated every 6-12 hours."
- Run **45557762586** (2026-11-25 ~06:03 UTC): FAILED, same error — even after
  deleting 25 old artifacts (~253 MB freed). Root cause: storage is counted by
  GB-Hours, not current stored bytes. Nov 22–23 binge (~23 GB chunks held ~20 h)
  accrued ~460 GB-Hours vs 360 allowance — November storage exhausted even though
  only ~62 MB was stored; resets Dec 1. Minutes also over: 2,497/2,000. Spending
  limit already $0 with "stop usage when budget reached" on; no payment method on
  file, so charges are impossible. **Retrying the old workflow will keep failing
  the same way until Dec 1.**
- User decision (2026-11-25 ~02:16 AST, "i dont know do best according to you"):
  go PUBLIC with a safe dual-repo pattern (engine stays private, never published;
  only our own work in a new public repo; workflow pulls engine/image with a
  secret token; chunks via Actions cache, final video via GitHub Release).
  A separate infra worker is building that setup. This sample will be re-rendered
  on the NEW setup once it is ready — this project is committed-ready for it.
- Local render fallback: started 2026-11-25 ~06:08 UTC under the standing rule
  (GitHub proven broken + user told first), then **STOPPED ~06:19 UTC on new
  orders** (render plan changed — no more local video renders). Partial parts
  deleted; no video was produced. The project does not depend on any local render.

## Verification of the final video — PENDING (runs after the new-setup render)
- (verify_final.py — to be filled after the render: format, loudness, whisper
  word match, A/V sync, letterbox, 1fps eye scan.)

## Config (`config.json`)
- Title: "What If Every Lie You Tell Grows A Feather?", fps **24**, bars **40**,
  style **dusk**, music gainDb **-17**, sfx gainDb **-6**, loudness -14 LUFS.
- Duration **55.18 s** (voiceover length).

## Cast (`scenes/cast.js`)
- KAI (hero, 16): burgundy hoodie **#800020**, black round head, **gold rim light**
  (shots pass `rim { color: '#ffd76a', dir: [-1, -1], w: 4 }` on his drawFigure calls).
- MOM (purple top, bun), MR OKAFOR (teacher, grey, glasses), DANNY (best friend,
  green top, cap), MAYA (girl, crush, pink top, ponytail), STU1–STU4 background.
  All solid black round heads; gold rim light on Kai only.

## The feather device (`scenes/_feathers.js`, verified by stills)
- `drawFeather(g, x, y, len, o)` — central shaft, tapered slightly-curved vane,
  fine barb lines, soft edge. White: fill #f5f2e8, shade #d8d2c0. Black: fill
  #16161d, shade #2e2e3a. opts: color, rot, scale, alpha, glow, turnWhite (0–1,
  black→white lerp).
- `featherAnchor(fig, where)` — wrist (front hand via handPos), collar (just below
  the head, behind the shoulder — see defect #1), chest (over the heart),
  shoulder, neck.
- `featherPop(g, fig, where, t, o)` — scale 0→1 with ease-out-back over ~0.3 s +
  a tiny white ring burst. Persists as a static feather after the pop.
- `featherFall(g, x0, y0, t, o)` — drifts down with sinusoidal sway + slow rotation
  + fade near the end, like snow; black→white lerp over the first 30% of the fall
  when turnWhite is set.
- `featherCount(g, n, word, labels, t, o)` — lunch count tile (dark tile, big gold
  number word, labels below) — same tile pattern as words-swallow's wordCount.
  Tested in the helper test project; used in the FULL video, not this sample.
- Also kept from Words Swallow (`scenes/_helpers.js`): `sizePill`, `jumpValue`,
  `goldLine`, `freezeLabel`, `handPos`, `drawPhone`, `drawEarring`, `drawDrop`.

## Project dir
`~/workspace/aitrends-2d-studio/projects/feathers-1min/` — config.json,
gen_feathers.py (generates cast, _feathers, 6 sets, 27 shots, build_story.py),
build_voice.py, build_story.py, verify_final.py, verify_size.py, scenes/cast.js,
scenes/_feathers.js, scenes/_helpers.js, scenes/sets/*.js (6), scenes/shots/*.js
(27), story/shots.json + bible.md, timeline/words.json + sentences.json,
input/script.txt + voiceover.wav + chunks/, build/ (mix_final.wav, sheets, stills,
hear_cues), out/ (final mp4 after render).
