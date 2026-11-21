#!/usr/bin/env python3
"""Apply the v4 fixes to past-lives-1min-v4/shots.tsx (copied from v3).

1. Dotted EyeBeam (house component via adapter) replaces the solid GoldArrow.
2. S3 + S18 eye origin fixed: use walk.y (hip-y), never the walk-cycle floor-y.
3. S22 payoff: the detector's hologram ticks down 12 -> 11 when it lands.
4. Places: S9 corridor -> Hallway, S16/S17 corridor -> Library, S21 bedroom -> Study.
5. Header comment corrected (the v3 "no dotted beam" claim was wrong).
"""
import pathlib
import re
import sys

P = pathlib.Path("/home/hatch/workspace/what-if-studio/src/episodes/past-lives-1min-v4/shots.tsx")
s = P.read_text()
orig = s

def must_replace(old, new, label):
    global s
    assert s.count(old) == 1, f"{label}: expected 1 occurrence, found {s.count(old)}"
    s = s.replace(old, new)
    print(f"  ok: {label}")

# --- 1. import the house EyeBeam + the new sets ---------------------------
must_replace(
    "  Detector, NightSky, Stars, Moon, stand, walkPose,\n} from '../../engine';",
    "  Detector, NightSky, Stars, Moon, stand, walkPose,\n  EyeBeam as HouseEyeBeam, Library, Hallway, Study,\n} from '../../engine';",
    "import HouseEyeBeam + Library/Hallway/Study",
)

# --- 1b. header comment (MUST run before the GoldArrow rename, which
#      also touches the header text) -------------------------------------
must_replace(
    """   - THE BEAM (CORRECTED from the file study, study-rt-v2/): the
     benchmark file shows NO dotted beam line anywhere. The device is
     Alex's GLOWING GOLD EYES (f21: gold irises when reading) + a SOLID
     GOLD ARROW when a number appears (f29 FREEZE diagram: solid arrow
     from the eye icon to the pill). So: gold eye-glint on Alex + the
     GoldArrow component, never a dotted line. In close-ups the arrow
     comes from the frame corner where Alex stands off-screen.""",
    """   - THE BEAM (CORRECTED — the v3 "no dotted beam" claim was WRONG):
     the benchmark file DOES show a dotted gold line from the hero's
     glowing eyes to the panel (f03 library, f23 hallway); the code
     confirms EyeBeam, dasharray "12 8". So: gold eye-glint on Alex +
     the house EyeBeam (dotted amber, 4px, 0.75 opacity), never a solid
     arrow. In close-ups the beam comes from the frame corner where Alex
     stands off-screen. Origin is the EYE (hip-y via walk.y).""",
    "header beam claim corrected",
)
must_replace(
    """   - 10 PLACES (v2's set, reused): gate, classroom, stairwell, corridor,
     cafeteria, art room, bedroom, bathroom, evening street + starry void.""",
    """   - 13 PLACES (v4: corridor x6 -> x3, bedroom x4 -> x3): gate,
     classroom, stairwell, corridor, library, hallway, study, cafeteria,
     art room, bedroom, bathroom, evening street + starry void.""",
    "header place list",
)

# --- 2. replace the GoldArrow definition with the EyeBeam adapter ---------
# Find the component: from the comment start to the first "\n};" after the const.
start = s.index("/** The gold arrow:")
end_marker = s.index("\n};", s.index("const GoldArrow"))
end = end_marker + len("\n};")
old_block = s[start:end]
assert "const GoldArrow" in old_block and "strokeWidth={6}" in old_block
new_block = """/** The eye beam (CORRECTED — the v3 "no dotted beam" claim was WRONG).
    The benchmark file DOES show a dotted gold line from the hero's
    glowing eyes to the panel (f03 library, f23 hallway) and the code
    confirms EyeBeam, dasharray "12 8". This adapter keeps the v3 call
    signature (x0/y0 = eye, x1/y1 = panel bottom, t = shot clock,
    from = pop frame) and renders the house EyeBeam: a thin DOTTED amber
    line, stroke #FFAA00, 4px, 0.75 opacity, dasharray "12 8", fading in
    over 5 frames and out after ~22 frames (~0.7 s visible). NOT a solid
    arrow. The origin must be the EYE (hip-y via walk.y), never the
    walk-cycle floor-y (the v3 S3/S18 waist-origin bug). */
const EyeBeam: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; from: number }> = ({ x0, y0, x1, y1, t, from }) => (
  <HouseEyeBeam x1={x0} y1={y0} x2={x1} y2={y1} t={t - from} />
);"""
s = s[:start] + new_block + s[end:]
print("  ok: GoldArrow definition -> EyeBeam adapter")

# --- 3. rename all GoldArrow usages to EyeBeam ----------------------------
n = s.count("GoldArrow")
assert n == 12, f"expected 12 GoldArrow usages, found {n}"  # 14 total minus header (1) minus definition (1)
s = s.replace("GoldArrow", "EyeBeam")
print(f"  ok: renamed {n} GoldArrow usages -> EyeBeam")

# --- 4. fix the S3 + S18 eye origins (hip-y via walk.y) -------------------
must_replace(
    "const eye = headPos({ x, y: 922, scale: 1.35 }, -1);",
    "const eye = headPos({ x, y: walk.y, scale: 1.35 }, -1);  // v4: hip-y, never the walk-cycle floor-y (v3 waist-origin bug)",
    "S3 eye origin -> walk.y",
)
must_replace(
    "const eye = headPos({ x, y: 922, scale: 1.3 }, 1);",
    "const eye = headPos({ x, y: walk.y, scale: 1.3 }, 1);  // v4: hip-y, never the walk-cycle floor-y (v3 waist-origin bug)",
    "S18 eye origin -> walk.y",
)

# --- 5. S22 payoff: hologram ticks down 12 -> 11 when the detector lands --
must_replace(
    '      <Detector x={dx} y={dy} s={0.62} t={t} glow={t >= 40 ? 0.5 : 1} />\n',
    '      <Detector x={dx} y={dy} s={0.62} t={t} glow={t >= 40 ? 0.5 : 1} />\n'
    '      {/* PAYOFF (v4): when the detector lands on the desk, its hologram ticks down 12 -> 11 with a gold ring — the cost lands in this shot. */}\n'
    '      <NumberPill x={PL2B_DETECTOR.x} y={PL2B_DETECTOR.y - 110} num="12" t={t} from={40} outline={GOLD} s={0.8} tickTo="11" tickAt={48} />\n',
    "S22 payoff pill tick-down",
)

# --- 6. place swaps (by shot block) ---------------------------------------
def swap_in_shot(shot_id, next_id, old, new, label):
    global s
    a = s.index(f"export const {shot_id}")
    b = s.index(f"export const {next_id}", a)
    block = s[a:b]
    assert block.count(old) == 1, f"{label}: expected 1, found {block.count(old)}"
    s = s[:a] + block.replace(old, new) + s[b:]
    print(f"  ok: {label}")

swap_in_shot("S9", "S10", "<Pl2Corridor t={t} />", "<Hallway t={t} />", "S9 corridor -> Hallway")
swap_in_shot("S16", "S17", "<Pl2Corridor t={t} />", '<Library t={t} id="pl4-lib16" />', "S16 corridor -> Library")
swap_in_shot("S17", "S18", "<Pl2Corridor t={t} />", '<Library t={t} id="pl4-lib17" />', "S17 corridor -> Library")
swap_in_shot("S21", "S22", "<Pl2Bedroom t={t} detectorOnDesk={false} />", '<Study t={t} id="pl4-study" />', "S21 bedroom -> Study")

# --- 7. shot comments ------------------------------------------------------
must_replace("/* S9: corridor, medium close-up", "/* S9: hallway, medium close-up", "S9 comment")
must_replace("/* S16: corridor, medium", "/* S16: library, medium", "S16 comment")
must_replace("/* S17: corridor, close-up", "/* S17: library, close-up", "S17 comment")
must_replace("/* S21: bedroom, close-up", "/* S21: study, close-up", "S21 comment")
must_replace(
    "/* S22: bedroom, medium — Alex puts the detector DOWN on the desk (the arm",
    "/* S22: bedroom, medium — Alex puts the detector DOWN on the desk (the arm",
    "S22 comment (unchanged, sanity check)",
)

assert "GoldArrow" not in s, "GoldArrow still present!"
assert "walk.y, scale: 1.35" in s and "walk.y, scale: 1.3" in s
assert s.count("HouseEyeBeam") == 2  # import + adapter
assert s.count("<EyeBeam ") == 12  # 12 call sites (definition is `const EyeBeam:`)
assert "<Hallway t={t} />" in s and 'id="pl4-lib16"' in s and 'id="pl4-lib17"' in s and 'id="pl4-study"' in s
assert 'tickTo="11" tickAt={48}' in s
P.write_text(s)
print(f"\nDONE. {len(orig)} -> {len(s)} chars. GoldArrow gone, EyeBeam x13, places swapped, S22 payoff added.")
