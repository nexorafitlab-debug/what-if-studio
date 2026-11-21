---
name: comparison-episodes
description: Technical comparison of read-thoughts-40s-v2 vs past-lives-1min-v3 episode implementations
---
# Technical Comparison: ReadThoughts40sV2 vs PastLives1MinV3

## Shots

**ReadThoughts40sV2** (17 shots, ~39s, 30 fps):
- 10 brand-new sets: library, lobby, market, taxi, gallery, hallway, garden, gym, laundromat + starry void; zero old sets reused
- Shot lengths range from 38-114 frames (1.3-3.8s at 30fps)
- Only S12 has a slow push-in (scale 1.0->1.08 over 68 frames); all other shots static camera
- Shot sizes: medium, medium wide, extreme close-up, close-up, wide, title wide
- One static freeze-insert shot (S13) with diagram drawing; one said-vs-thought split (S14)
- End card on starry void (S17)

**PastLives1MinV3** (27 shots, 60.6s, 30 fps):
- 10 places: gate, classroom, stairwell, corridor, cafeteria, art room, bedroom, bathroom, evening street + starry void
- Shot lengths range from 45-114 frames (1.5-3.8s at 30fps); 27 cuts/min vs 17 shots/39s
- Shot sizes change every 1-2s: wide -> medium -> close-up -> extreme close-up, constantly
- Longest shot S12: 3.8s (114 frames); shortest S3: 1.5s (46 frames)
- S8 and S10 are vector-only illustrations on starry void (no characters)
- S12 is the "ONE slow push-in" (scale 1.45->1.57); all other shots static inside
- Cliffhanger end card S27 with red "0" pill

## Character Motion

**ReadThoughts40sV2**:
- Movement tied to narration: one purposeful action per shot, keyed to the word spoken
- Actors move monotonically to ONE pose and hold (no A->B->A oscillation, no looping limb motion)
- Walk cycles (walkPose) only while a character is actually walking
- Specific gestures: reaching, pointing, head turns, leaning, rubbing eyes, chopping hands, sipping
- S13: Pip frozen mid-gesture in FREEZE insert (one static pose, gold ring pulsing)
- S14: Said-vs-thought split with two characters visible
- S16: Mom's panel flickers; starburst shock effect

**PastLives1MinV3**:
- Motion tied to words ONLY: one purposeful action per shot, keyed to the word spoken
- Every Actor's keys move MONOTONICALLY to ONE pose and hold — no A->B->A oscillation, no looping limb motion
- Walk cycles (walkPose) only while a character is actually walking; NO WallClock, NO Pendant
- Specific actions: walk cycles at gates/doors/corridors/stairs, head turns, pointing, tapping shoulder, reaching/grasping
- S4: Sam startles, head snaps up (10->-6), arm rises once
- S7: Sam nods once (extreme close-up pill)
- S16: Alex taps Sam's shoulder (monotonic arm extension)
- S17: Sam raises one hand in greeting (monotonic: -20->-110, holds)
- S25: Three students walk past with pills tickling down (7->6, 3->2, 9->8) as Alex watches
- Gold eye-glint on Alex activates per-shot (t>=glintFrom), never a dotted beam line

## VFX (Panels/Pills/Rings)

**ReadThoughts40sV2**:
- Thought panels: amber outline (neutral) / red (hidden); overshoot pop + expanding gold ring + sparkle burst on arrival, then gentle breathe
- Eye beam: thin amber beam from hero's eye to panel, visible briefly as power fires; fades over 5 frames
- Freeze diagram (S13): eye->beam->panel diagram draws on starry void; gold ring; "EYE CONTACT / THOUGHT APPEARS" labels
- Said-vs-thought split (S14): left bubble "I'M FINE" (white), right red panel "exhausted"; beam line on every panel reveal
- Mom shock (S16): red panel flickers; gold starburst rings the shock
- End card (S17): gold "PART ONE", white "WHAT IS SHE HIDING?", little red panel
- Panel Y positioning: `p.y - 295 * p.scale`; head position: `p.x + facing * 22 * p.scale, p.y - 185 * p.scale`
- Sparkle burst: 3 sparkles arranged around panel on arrival

**PastLives1MinV3**:
- Number pills: small dark pill, coloured outline (gold for 12, soft white for others), nearly touching head, tiny downward pointer
- Gold pill rule: small dark pill with coloured outline; gold for #12, soft white for #3/#7/#9
- Nearly touching the head, tiny downward pointer; same number stays with same person (Sam 12, Jordan 3, Harwick 7); Alex's own number NEVER shown
- Pills pop with overshoot + expanding ring + sparkle burst, then breathe
- BIG close-up pills (ECU/CU): scale 2.4-2.8 with bigPillY (pill bottom 14px above head top, pointer nearly touching — never overlapping face)
- Gold Arrow: SOLID gold arrow from Alex's glowing eyes (or frame corner in close-ups) to the pill; NEVER a dotted beam line
  - Measured from benchmark: no dotted beam anywhere; device is Alex's GLOWING GOLD EYES + solid gold arrow
  - Fades in over 5 frames when number appears, fades out after ~22 frames
  - Arrow: circle at eye (r=7), line, arrowhead polygon in gold
  - In close-ups arrow comes from frame corner where Alex stands off-screen
- FREEZE diagram (S8): detector->beam->pill diagram; solid #7FD4FF beam (not amber); 12 LIVES dots light up one by one
- 12 LIVES illustration (S10): huge gold "12" with 12 life dots lighting up sequentially below it; "EACH DOT IS ONE LIFE" caption
- Stevenson citation card (S23): name, affiliation, divider line, huge "2,500+" counter ticks UP 0->2500 with easeOut
- Tick-down pillar (S12): big gold pill ticks down 12->11 at t=25 with pulse, ring, beam; FocusRings pulse after tick
- Red "0" pill on end card (S27): wide shape, modest text, matches f39 benchmark
- FocusRings: pulsing gold rings around pills/characters (S7 focus on pill, S17 end card, S24 counter)
- Detector: perched on head like cap, antenna up; Glow effect fades it (S13: detector powers down)

## Sound Timing

**ReadThoughts40sV2**:
- Music: playful quirky cartoon background (pizzicato strings, glockenspiel, soft bass, 110 bpm, no vocals), 12.0s duration until f:1180
- SFX: gentle whoosh for panel appear, soft digital chime for thought chime
- Voice: Muse TTS Helio (avocado_v2:MAI_03), 5 short chunks, whisper-verified 103/103 words
- SFX levels: sfx_lu: -0.5; music_lu: -10.0
- Flash events at specific frames: f:57, f:155, f:173, f:281, f:335, f:429, f:455, f:505, f:543, f:664, f:675, f:730, f:790, f:880, f:1004, f:1020, f:1128

**PastLives1MinV3**:
- Music: ambient track ~-44 dB mean; music clip "music.mp3" until f:1818 (60.6s)
- SFX: detector hum (soft electronic, quiet, warm, 1.0s), pill pop (soft glass-bell chime, brief clear, 0.5s), tick down (sharp digital tick, short, 0.3s), title boom (cinematic whoosh into deep boom, 1.6s)
- SFX events: on every action; room tone underbed
- Voice: Helio + Sam (Kokoro af_heart) + Jordan (am_adam); 169 words dense voiceover; gaps between lines 0.20-0.50s; longest inter-line gap 0.50s; every chunk whisper-verified; full voice 171/171 tokens in order
- Voice structure: 4 beats (cold open rules, rules+cost, fun part, science, cliffhanger); lines timed to shot boundaries
- Flash events at specific frames: f:15, f:30, f:77, f:129, f:169, f:228, f:332, f:361, f:475, f:524, f:574 (o:0.4), f:653, f:665, f:677, f:689, f:734 (o:0.4), f:792, f:853, f:994, f:1099, f:1350, f:1498 (o:0.4), f:1673, f:1688, f:1726, f:1736, f:1746, f:1788 (o:0.4)
- Sound levels: music_lu: -10.0; sfx_lu: -0.5
- Clips: detector_hum, pill_pop, tick_down, title_boom