# BUILD REPORT — What If You Could Change Your Size? (FULL video)

## STANDING RULE — READ FIRST
**ALWAYS render on GitHub 10x (repo `nexorafitlab-debug/what-if-plugin-engine`,
workflow "Render plugin episode"). NEVER render locally unless GitHub is proven
broken AND the user has been told.**

## Deliverable — PENDING (GitHub render to be dispatched after this report)
- Project: `~/workspace/aitrends-2d-studio/projects/change-size-full/`
- GitHub copy: `~/workspace/what-if-studio/plugin-projects/change-size-full/`
- Format: 1280×720, **60 fps**, letterbox 40 px, target **−14 LUFS / TP < −1.0**
- Duration: **402.50 s (6:42.5)**, 179 shots, 26.7 cuts/min, 251 SFX (37.4/min)

## History — read before re-dispatching
- Run **45147581374** (dispatched 2026-11-23T09:30:05Z) was **CANCELLED** before
  completion: the committed project (58b6c30) held the PRE-surgery voiceover
  (md5 `28dd5282…`, = `input/voiceover_pre_pause_move.wav`) and pre-surgery shot
  timings. The post-surgery voiceover (md5 `be35e277…`) was written 09:30:41 UTC,
  after the sync. Rendering that commit would have produced 3.5 s silences
  mid-sentence and 0.12 s pause-card flashes. **Verify the sync by md5 before
  every dispatch: committed `input/voiceover.wav` must be `be35e277…`.**
- Run 45147581374's cancellation is the reason this report exists in this form.

## Script (1,025 words, DO NOT change a word)
- Source: `~/workspace/what-if-sample/change-size-script-final.txt`
- Narration: `input/script.txt` (1,025 words; task brief says 1,026 — the file
  itself is 1,025 and every ledger/verification count uses 1,025).
- Visual guide: `~/workspace/what-if-sample/change-size-visual-guide-final.txt`

## Voiceover (Helio, Muse TTS avocado_v2:MAI_03)
- 24 short chunks (~30–60 words), each whisper-verified for word count + ending
  before concat. 0.4 s lead, 0.5 s gaps, 0.8 s tail. Total speech 380.32 s.
- Chunk flags (verify.log): c21 match 0.86 — whisper digit-normalisation
  artefact ("two meters seventy-two" vs "2 meters 72"), audio is complete.
  c22 match 0.88 + end_ok=False + "repeated phrase" — **proven a whisper
  artefact, NOT a TTS duplication**: isolated re-transcription of c22.wav puts
  the phrase in a 0.06 s phantom segment (11 words cannot be spoken in 0.06 s)
  and the energy envelope shows silence after "survive it?"; the full-voiceover
  transcription contains the phrase exactly once (359.55 s). Audio is correct.
- **Pause surgery (move_pauses.py):** the first build put the three 3.5 s
  music-only silences MID-SENTENCE (after chunks 6/13/19 cut mid-sentence).
  Surgery cut 3.0 s out of each misplaced gap and inserted 3.0 s at the real
  chapter breaks. Envelope-verified silences now at 81.9–85.5,
  208.4–211.8, 318.8–321.7. Total duration unchanged: 402.50 s.
  Backup of pre-surgery audio: `input/voiceover_pre_pause_move.wav`.
- Word timings: `timeline/words.json` — re-transcribed AFTER the surgery
  (1025 words, 994/1025 matched = 97%). **One hand correction:** whisper
  placed "Then" at 208.28–209.14, inside absolute silence (envelope 0.0000
  RMS 208.40–211.80); corrected to 211.80–211.89 (true onset). Without this,
  pause card s093 stayed a 0.12 s flash. After the fix: s040 3.22 s,
  s093 3.28 s, s144 3.22 s; no tiling gaps >0.6 s.

## Picture
- Plugin only (aiTrends 2D Studio), 2D only. 21 sets (6 from the sample +
  15 fresh: court, maproom, sink, streetlight, truckstreet, dining,
  livingroom, office, roof, gymquake, crowd, science, nature, desk,
  observatory). Hand-written shots, living face (breathe/talk/blink/expr
  changes inside shots), walkPose with explicit travel. No template generator.
- Hero Noah, 16: black round head, gold rim light, teal hoodie #0E7490.
- Size device: dark pill above Noah's head ONLY on a size change —
  "10 m" red outline / "0.1 m" green outline, fades after ~1 s. Never "null",
  never covering text or signs.
- **Buried-text defect FOUND + FIXED 2026-11-23 (before re-dispatch):** in 9
  shots the CTA/text overlay was drawn BETWEEN two `layer()` calls, and the
  second layer re-ran the set function, whose full-frame opaque backdrop
  repainted over the text. Affected: s110 ('BIGGER...'/'OR SMALLER?'),
  s165 ('WE KNOW WHAT YOU DID'/'AT THE SCHOOL.'), s166 ('COME TO THE OLD'/
  'OBSERVATORY AT MIDNIGHT.'), s167 ('BRING YOUR FRIEND.'), s172 ('SO WHAT
  WOULD YOU DO'/'IF YOU COULD CHANGE YOUR SIZE?'), s173 ('WOULD YOU GROW...'/
  'OR SHRINK?'), s174 ('TELL US IN THE COMMENTS'), s175 ('AND IF YOU FELT
  THAT KNOCK'/'IN THE DARK...'), s176 ('HIT LIKE, AND SUBSCRIBE'/'FOR MORE
  WHAT IFS.'). Fix: moved every `text()` call to AFTER the second layer
  close (drawn last, on top) in the 9 shot files; all 9 re-rendered as
  full-res stills and the text is now visible. No pills were buried (all 15
  pill shots draw the pill after the last layer). **WARNING: `gen_shots.py`
  still contains the buggy draw order for these 9 shots — do NOT re-run it
  without re-applying this fix.**
- Camera fixes verified at full res: s034 (was headless torso), s121–s124
  (was empty sky; pin + tiny Noah now centred).

## Audio (mix_final.wav — committed, GitHub muxes it as-is)
- Mix: `audio/mix.py`, 251 cues, ambience on 162 shots, 10 music sections.
- **Measured: −14.33 LUFS / TP −1.49 / LRA 4.70** (mix_final.wav).
- SFX levels (measure_peaks.py, LN gain 12.41 dB): every cue 4.0–9.8% of voice
  peak; worst peak −21.7 dBFS (impact/thunder, ≤ −21.4 ceiling ✓). Bright
  cues isolated: shimmer 2.2%, ding 1.9%, freeze 2.9% (all ≤5% ✓). The one
  "OVER" flag (shimmer worst 7.3%) is overlap contamination from thud/freeze/
  powerup tails inside the measurement window, not the shimmer itself —
  same value as the pre-surgery mix, accepted.
- Music gap: voice active-mean −17.4 dB vs music −44.0 dB → **~27 dB** ✓.
- SFX per minute (after balance): [35, 41, 30, 42, 42, 31, 30] — all 30–50.
- **NOTE:** `build_shots.py` hardcodes `music.gainDb: -17` in config.json on
  every run; the mix needs **−21**. After every build_shots run, set
  `config.json` music.gainDb back to −21 before mixing.

## Verification (local, before GitHub dispatch)
- Voice: full re-transcription 1025 words, 97% match; c22 duplication
  disproved (see above); envelope confirms the 3 pauses sit at chapter breaks.
- Shots: 179, tile 0–401.41 s with no gaps >0.6 s; pause cards 3.22/3.28/3.22 s.
- Visuals: full 1 fps sheet scan (8 contact sheets, 179 stills, 0 errors) +
  13 full-res edge-case stills (pills, bottom/top text, s034, s121–s124) +
  9 full-res stills re-rendered after the buried-text fix — all pass.
- Audio: loudness, SFX peaks, music gap all measured (see above).
- A/V sync: shots derive from post-surgery word timings; audio is the
  post-surgery voiceover — both from the same timings. No drift source
  (contiguous chunks + held frames; never ffmpeg -shortest).

## GitHub render (to fill in after dispatch)
- Workflow: "Render plugin episode", repo nexorafitlab-debug/what-if-plugin-engine
- Inputs: project=change-size-full, chunks=10, encode_ranges=[[0,402.5]], fps=60
- Run number: ____
- Final mp4: ____ / md5: ____ / duration: ____ / loudness: ____
