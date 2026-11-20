#!/usr/bin/env python3
"""Build the death-count-full episode files (155 shots) from the approved script.

Reads ~/workspace/what-if-sample/death-count-full/full-script.md (shot list
S1-S155) and writes, into this episode folder:
  episode.json, timeline.json, shots.tsx, index.tsx
Durations are estimated at ~160 wpm from the narration phrase word counts
(no voice exists yet, so there are deliberately NO fake word timings;
timeline.json is provisional until words.json lands from the voice step).

Run:  python3 gen.py        (from this folder)
Then: npx tsc --noEmit      (from the studio root)
"""
import json, re
from pathlib import Path

HOME = Path.home()
SCRIPT = HOME / "workspace/what-if-sample/death-count-full/full-script.md"
EP = HOME / "workspace/what-if-studio/src/episodes/death-count-full"

# ---------------------------------------------------------------- parsing
lines = SCRIPT.read_text(encoding="utf-8").splitlines()

shots = []  # dicts: id, set, size, chars, timer, phrase
for ln in lines:
    if not ln.startswith("| S"):
        continue
    cells = [c.strip() for c in ln.strip().strip("|").split("|")]
    if len(cells) != 6 or not re.fullmatch(r"S\d+", cells[0]):
        continue
    shots.append(dict(id=cells[0], set=cells[1], size=cells[2],
                      chars=cells[3], timer=cells[4], phrase=cells[5]))
assert len(shots) == 155, f"expected 155 shots, got {len(shots)}"
assert [s["id"] for s in shots] == [f"S{i}" for i in range(1, 156)]

# narration beats (for episode.json script[])
beats = []
cur = None
for ln in lines:
    m = re.match(r"### BEAT (\d+) — (.*)", ln)
    if m:
        cur = {"beat": f"{m.group(1)} {m.group(2)}", "lines": []}
        beats.append(cur)
        continue
    if ln.startswith("<!-- NARRATION-END -->"):
        cur = None
        continue
    if cur is not None and ln.strip() and not ln.startswith("#"):
        cur["lines"].append(ln.strip())
assert len(beats) == 8, f"expected 8 beats, got {len(beats)}"
for b in beats:
    b["text"] = " ".join(b["lines"])
    del b["lines"]

# ---------------------------------------------------------------- set map
# descriptive set (script) -> (engine set, night flag)
SETMAP = {
    "Café counter": ("kitchen", False), "Café counter top": ("kitchen", False),
    "Café": ("kitchen", False), "Diner booth": ("study", True),
    "Diner": ("kitchen", False), "Subway car": ("subway", False),
    "Rooftop": ("rooftop", False), "Bedroom": ("bedroom", False),
    "School hallway": ("stairwell", False), "Street": ("rooftop", False),
    "Gym door": ("stairwell", False), "Library": ("study", False),
    "Cafeteria": ("classroom", False), "Starry void": ("void", False),
    "Classroom": ("classroom", False), "Bathroom": ("bedroom", False),
    "Home": ("bedroom", False),
}

def zoom_for(size):
    s = size.lower()
    if "extreme" in s:
        return 1.65
    if "macro" in s:
        return 1.5
    if "close-up" in s:
        return 1.3
    if "two-shot" in s:
        return 1.0
    if "wide" in s:
        return 0.85
    return 0.95

# ---------------------------------------------------------------- timers
def parse_timer(cell):
    nums = re.findall(r"\d+", cell)
    low = cell.lower()
    return {
        "nums": nums,
        "dim": any(k in low for k in ("dim", "faint", "smudge")),
        "bright": any(k in low for k in ("bright", "burn")),
        "pulse": any(k in low for k in ("pulse", "blink")),
        "ticking": "tick" in low,
        "many": "many pills" in low or "timers above every head" in low,
        "big": "big numbers" in low,
        "small": "small numbers" in low,
        "through": "through ceiling" in low or "through the" in low,
        "none": ("—" in cell and not nums) or cell.strip() in ("—", "— (blank)"),
    }

# ---------------------------------------------------------------- characters
# look keys used by shots.tsx LOOKMAP
def char(look, x, y=700, scale=1.0, facing=1, expr="neutral", timer=None,
         dim=False, pulse=False, bright=False, walk=False, tick_from=None):
    d = {"look": look, "x": x, "y": y, "scale": scale, "facing": facing,
         "expr": expr}
    if timer is not None:
        d["timer"] = timer
    if dim:
        d["dim"] = True
    if pulse:
        d["pulse"] = True
    if bright:
        d["bright"] = True
    if walk:
        d["walk"] = True
    if tick_from is not None:
        d["tickFrom"] = tick_from
    return d

def positions(n):
    if n == 1:
        return [960]
    if n == 2:
        return [700, 1250]
    if n == 3:
        return [560, 960, 1360]
    return [480, 800, 1120, 1440]

# (look, default scale, default y) per script name
CAST = {
    "pip": ("pip", 1.0, 700), "sam": ("sam", 1.0, 700),
    "sis": ("sis", 0.7, 700), "baby": ("sis", 0.45, 640),
    "mom": ("mom", 0.95, 700), "suit": ("suit", 1.0, 700),
    "mo": ("mo", 0.95, 700), "maya": ("maya", 0.9, 700),
    "ortiz": ("mo", 0.95, 700),
}

EXPR = {  # shot id -> hero expr, or {look: expr}
    "S5": "worried", "S8": "shock", "S22": "worried", "S23": "worried",
    "S27": "worried", "S55": "worried", "S61": "worried", "S88": "worried",
    "S91": "worried", "S96": "worried", "S97": "worried", "S98": "worried",
    "S99": "worried", "S100": "tired", "S101": "worried", "S109": "worried",
    "S110": "worried", "S84": {"sam": "happy"}, "S139": {"sis": "happy"},
    "S140": {"sis": "happy"}, "S142": {"sis": "happy"}, "S148": "happy",
    "S149": "happy",
}
WALK = {"S29", "S92", "S130", "S152", "S153", "S154"}

def expr_for(sid, look):
    e = EXPR.get(sid)
    if isinstance(e, dict):
        return e.get(look, "neutral")
    return e if (e and look == "pip") else "neutral"

def parse_chars(cell, sid):
    """Return (kind, [cast keys in order]) for a Characters cell."""
    c = cell.strip()
    low = c.lower()
    if low.startswith("tip jar"):
        return "jar", []
    if low.startswith("pill only") or low.startswith("faint pill") or \
            low.startswith("pill burning bright") or \
            "sister's timer" in low or "sister's pill" in low:
        return "pill", []
    if low.startswith("two pills"):
        return "pill", []
    if "mirror" in low:
        return "mirror", ["pip"] if "you" in low else []
    if "dot grid" in low or low.endswith("dots"):
        return "dots", []
    if low.startswith("old photos"):
        return "photos", []
    if low == "strangers":
        return "scene", ["mo", "suit"]
    if low.startswith("old photos"):
        return "photos", []
    if low.startswith("memory flashes"):
        return "memory", []
    if "comment-box" in low:
        return "endcard", []
    if low.startswith("dead plant"):
        return "prop-plant", []
    if "maya's notebook" in low:
        return "prop-notebook", []
    if "mother's pill" in low or "stranger's pill" in low or "suit man's pill" in low:
        return "pill", []
    if low.startswith("crowd"):
        return "crowd", []
    if "city numbers" in low or "city timers" in low:
        return "city", []
    if "sam's empty desk" in low:
        return "scene", []
    # generic: split on commas, map each token
    keys = []
    for tok in c.split(","):
        t = tok.strip().lower()
        if not t or t in ("notebook", "phone", "boxes", "passengers"):
            continue
        if "sister" in t:
            keys.append("sis")
        elif "sam" in t:
            keys.append("sam")
        elif "maya" in t:
            keys.append("maya")
        elif "ortiz" in t:
            keys.append("ortiz")
        elif "barista" in t:
            keys.append("mo")
        elif "mother" in t:
            keys.append("mom")
        elif "baby" in t:
            keys.append("baby")
        elif "suit" in t:
            keys.append("suit")
        elif "stranger" in t:
            keys.append("mo")
        elif "big-number kids" in t:
            keys.extend(["mo", "suit"])
        elif "you" in t:
            keys.append("pip")
    # de-dup, keep order; pip first
    seen, out = set(), []
    for k in keys:
        if k not in seen:
            seen.add(k)
            out.append(k)
    if "pip" in out:
        out.remove("pip")
        out.insert(0, "pip")
    return "scene", out

# ---------------------------------------------------------------- spec build
def pill(x, y, n, s=1.0, dim=False, pulse=False, bright=False, tick_from=None):
    d = {"x": x, "y": y, "n": n, "s": s}
    if dim:
        d["dim"] = True
    if pulse:
        d["pulse"] = True
    if bright:
        d["bright"] = True
    if tick_from is not None:
        d["tickFrom"] = tick_from
    return d

SCATTER_MANY = [("8420", 420, 300), ("312", 760, 260), ("15900", 1150, 280),
                ("67", 1520, 320), ("12403", 960, 240)]
SCATTER_CITY = [("12403", 380, 500), ("42", 760, 480), ("19801", 1150, 520),
                ("14", 1520, 500), ("8912", 600, 380), ("15204", 1350, 380)]

def build_spec(s):
    sid, n = s["id"], int(s["id"][1:])
    eng_set, night = SETMAP[s["set"]]
    kind, keys = parse_chars(s["chars"], sid)
    tm = parse_timer(s["timer"])
    zoom = zoom_for(s["size"])
    spec = {"kind": kind, "set": eng_set, "night": night, "zoom": zoom,
            "cx": 960, "cy": 540, "chars": [], "pills": [], "seed": n,
            "booth": False, "paper": False, "plant": False,
            "notebook": False, "veil": 0.3 if eng_set == "bedroom" else 0.42}
    if eng_set == "study" and night:
        spec["booth"] = True
    if "close-up" in s["size"].lower():
        spec["cy"] = 500
    if "extreme" in s["size"].lower():
        spec["cy"] = 480

    # --- special kinds -------------------------------------------------
    if kind == "jar":
        spec["set"] = "dark"
        spec["zoom"] = 1.5
        spec["pills"] = [pill(960, 300, "12403", 1.2, pulse=True)]
        return spec
    if kind == "pill":
        spec["set"] = "dark"
        nums = tm["nums"]
        if sid == "S6":  # 14 trembling down to 13
            spec["zoom"] = 1.6
            spec["pills"] = [pill(960, 500, "14", 2.2, pulse=True),
                             pill(960, 720, "13", 1.4)]
        elif sid == "S46":  # yesterday 42, today 41
            spec["zoom"] = 1.5
            spec["pills"] = [pill(960, 460, "42", 1.8),
                             pill(960, 700, "41", 1.6, pulse=True)]
        elif len(nums) >= 2:
            spec["zoom"] = 1.4
            spec["pills"] = [pill(700, 480, nums[0], 1.6),
                             pill(1220, 640, nums[1], 1.2)]
        elif nums:
            spec["zoom"] = 1.6
            spec["pills"] = [pill(960, 540, nums[0], 2.0, dim=tm["dim"],
                                  pulse=tm["pulse"], bright=tm["bright"])]
        elif tm["ticking"]:
            spec["zoom"] = 1.6
            spec["pills"] = [pill(960, 540, "8471", 2.0, tick_from=8471)]
        else:
            spec["pills"] = [pill(960, 540, "8471", 2.0)]
        return spec
    if kind == "dots":
        spec["set"] = "void"
        spec["zoom"] = 0.9
        if "you" in s["chars"].lower():
            spec["chars"] = [char("pip", 960, expr="neutral")]
        return spec
    if kind == "mirror":
        spec["set"] = "bedroom"
        spec["zoom"] = 1.65 if "extreme" in s["size"].lower() else 1.1
        xs = positions(1)
        spec["chars"] = [char("pip", xs[0], expr=expr_for(sid, "pip"))]
        return spec
    if kind == "photos":
        spec["set"] = "bedroom"
        spec["zoom"] = 1.0
        return spec
    if kind == "memory":
        spec["set"] = "bedroom"
        spec["zoom"] = 0.9
        spec["chars"] = [char("pip", 960, expr="neutral")]
        nums = tm["nums"]  # 12403 / 41 / 19801 / 15204 / 17842 / 9412
        spots = [(700, 180), (1220, 180), (480, 320), (1440, 320),
                 (480, 560), (1440, 560)]
        for i, num in enumerate(nums):
            x, y = spots[i % len(spots)]
            spec["pills"].append(pill(x, y, num, 1.0))
        return spec
    if kind == "endcard":
        spec["set"] = "rooftop"
        spec["zoom"] = 0.9
        spec["title"] = ["WHAT WOULD YOURS SAY?", "TELL US IN THE COMMENTS"]
        spec["accent"] = "COMMENTS"
        spec["chars"] = [char("pip", 700), char("sis", 1250, scale=0.7,
                                                facing=-1, expr="happy")]
        return spec
    if kind == "prop-plant":
        spec["set"] = "stairwell"
        spec["zoom"] = 1.3
        spec["plant"] = True
        if tm["nums"]:
            spec["pills"] = [pill(960, 260, tm["nums"][0], 1.0)]
        return spec
    if kind == "prop-notebook":
        spec["set"] = "study"
        spec["zoom"] = 1.3
        if tm["nums"]:
            spec["pills"] = [pill(960, 260, tm["nums"][0], 1.0)]
        return spec
    if kind == "crowd":
        spec["set"] = "classroom"
        spec["zoom"] = 0.85
        if tm["big"]:
            vals = ["20113", "18902", "17440", "22081", "19320", "17655"]
        else:
            vals = ["8420", "312", "15900", "67", "12403", "4521"]
        for i, v in enumerate(vals):
            spec["pills"].append(pill(300 + i * 264, 540, v, 0.85))
        return spec
    if kind == "city":
        spec["set"] = "rooftop"
        spec["zoom"] = 0.85
        for v, x, y in SCATTER_CITY:
            spec["pills"].append(pill(x, y, v, 0.85))
        return spec

    # --- scene kind ----------------------------------------------------
    xs = positions(len(keys)) if keys else []
    chars = []
    # timer assignment: numbers go to non-pip characters first, in order.
    # With no numbers, bright/dim/ticking/big name their own numbers.
    KNOWN = {"pip": "14", "sis": "14", "sam": "15204", "maya": "17842",
             "mom": "41", "baby": "19801", "suit": "8912", "mo": "12403",
             "ortiz": "9412"}
    nums = list(tm["nums"])
    nonpip = [k for k in keys if k != "pip"]
    assign = {}
    if tm["ticking"] and nonpip:
        assign[nonpip[0]] = "8471"
    elif not nums and tm["bright"]:
        for k in keys:
            assign[k] = KNOWN.get(k, "8420")
    elif not nums and tm["dim"]:
        for k in keys:
            assign[k] = KNOWN.get(k, "8420")
    elif not nums and tm["big"]:
        nums = ["20113", "18902", "17440"]
    if not assign:
        for k in nonpip:
            if nums:
                assign[k] = nums.pop(0)
        if nums and "pip" in keys and len(nums) == 1:
            assign["pip"] = nums.pop(0)
    # two numbers over a lone Pip belong to other people, floating in frame
    standalone = []
    if keys == ["pip"] and len(nums) >= 2:
        standalone = nums
    if sid in ("S3", "S44"):  # subway: pip left, mother + baby right
        xs = [560, 1280, 1200]
        chars = [char("pip", 560, expr=expr_for(sid, "pip")),
                 char("mom", 1280, facing=-1, scale=0.95,
                      timer=assign.get("mom")),
                 char("sis", 1200, y=640, scale=0.45, facing=-1,
                      timer=assign.get("baby"), expr="happy")]
        spec["chars"] = chars
        spec["cx"] = 990
        return spec
    for i, k in enumerate(keys):
        look, sc, y = CAST[k]
        if k == "baby":
            sc = 0.6 if len(keys) == 1 else 0.45
        facing = -1 if (i > 0 and k != "pip") else 1
        if sid in ("S152", "S153", "S154") and k in ("pip", "sis"):
            facing = 1
        c = char(look, xs[i], y=y, scale=sc, facing=facing,
                 expr=expr_for(sid, k), walk=(sid in WALK))
        if k in assign:
            c["timer"] = assign[k]
            c["dim"] = tm["dim"]
            c["pulse"] = tm["pulse"]
            c["bright"] = tm["bright"]
            if tm["ticking"]:
                c["tickFrom"] = int(assign[k]) if assign[k].isdigit() else 8471
        chars.append(c)
    spec["chars"] = chars
    for j, num in enumerate(standalone):
        spec["pills"].append(pill(620 + j * 680, 300, num, 1.0))
    if chars:
        spec["cx"] = round(sum(c["x"] for c in chars) / len(chars))
    # standalone pills for keyword timers
    if tm["many"] or "timers above every head" in s["timer"].lower():
        for v, x, y in SCATTER_MANY:
            spec["pills"].append(pill(x, y, v, 0.9))
    elif tm["big"]:
        for j, (v, x) in enumerate([("20113", 420), ("18902", 1500)]):
            spec["pills"].append(pill(x, 300, v, 0.9))
    elif tm["small"]:
        for v, x in [("23", 500), ("9", 1420)]:
            spec["pills"].append(pill(x, 300, v, 0.9))
    elif tm["through"]:
        for v, x in [("5120", 500), ("88", 960), ("12004", 1420)]:
            spec["pills"].append(pill(x, 300, v, 0.9, dim=True))
    elif tm["ticking"] and not any("timer" in c for c in chars):
        spec["pills"].append(pill(960, 300, "8471", 1.0, tick_from=8471))
    if sid == "S9":
        spec["paper"] = True
    if sid in ("S38",):
        spec["plant"] = True
    if sid == "S100":
        spec["veil"] = 0.55
    return spec

specs = {}
for s in shots:
    specs[s["id"]] = build_spec(s)

# --- title shots get their cards ---------------------------------------
specs["S7"]["kind"] = "title"
specs["S7"]["title"] = ["WHAT IF YOU COULD SEE", "EVERYONE'S DEATH COUNT?"]
specs["S7"]["accent"] = "DEATH"
specs["S7"]["pills"] = [pill(420, 500, "8420", 0.9), pill(1500, 480, "312", 0.9)]
specs["S10"]["kind"] = "title"
specs["S10"]["title"] = ["", "PART 1"]
specs["S10"]["accent"] = "PART"
specs["S10"]["pills"] = [pill(v[1], v[2], v[0], 0.8) for v in
                         [("12403", 380, 500), ("42", 760, 480),
                          ("19801", 1150, 520), ("14", 1520, 500)]]

# ---------------------------------------------------------------- durations
# Real timings from the recorded voice (words.json). The ~160 wpm estimate
# made plan.py fail (bare first-word cues like "You" collided) and would
# have put every cut seconds off the voice, so timing now comes from the
# actual word timings. Walk each shot's phrase against words.json in order.
def words_of(phrase):
    return len([w for w in phrase.split() if w.strip("—/")])


def _norm(w):
    return re.sub(r"[^\w']", "", w.lower().replace("’", "'"))


WORDS = json.loads((EP / "words.json").read_text(encoding="utf-8"))
assert len(WORDS) == 1306, f"words.json has {len(WORDS)} words, expected 1306"
_ptr = 0
for s in shots:
    toks = [w for w in s["phrase"].split() if w.strip("—/")]
    s["words"] = len(toks)
    s["_w0"] = _ptr
    for tok in toks:
        assert _ptr < len(WORDS), f"ran out of words.json at shot {s['id']}"
        assert _norm(tok) == _norm(WORDS[_ptr]["w"]), (
            f"shot {s['id']}: phrase word {tok!r} != words.json "
            f"{WORDS[_ptr]['w']!r} at index {_ptr}")
        _ptr += 1
    s["_w1"] = _ptr
assert _ptr == len(WORDS), f"walked {_ptr} of {len(WORDS)} words"

FPS, LEAD = 30, 2
for k, s in enumerate(shots):
    s["first"] = 0 if k == 0 else max(0, round(WORDS[s["_w0"]]["s"] * FPS) - LEAD)
end_frame = round((WORDS[-1]["e"] + 1.0) * FPS)
for k, s in enumerate(shots):
    nxt = shots[k + 1]["first"] if k + 1 < len(shots) else end_frame
    s["len"] = nxt - s["first"]
    assert s["len"] > 0, f"shot {s['id']} has non-positive length"
    if k:
        assert s["first"] > shots[k - 1]["first"], f"shot {s['id']} not after previous"
    s["key"] = min(s["len"] - 1, max(8, round(s["len"] * 0.2)))
    if specs[s["id"]]["kind"] in ("title", "endcard"):
        s["key"] = min(s["len"] - 1, max(8, round(s["len"] * 0.5)))
total = end_frame
print(f"words={sum(s['words'] for s in shots)} frames={total} "
      f"total={total} ({total / 30:.1f}s) [real timings from words.json]")

# ---------------------------------------------------------------- writers
F = {s["id"]: s["first"] for s in shots}
L = {s["id"]: s["len"] for s in shots}

def note_of(s):
    return f"{s['set']} · {s['size']} · {s['chars']} · timer {s['timer']}"

def cue_of(s):
    # Absolute frame from the real voice timing (word cues collide: half the
    # phrases start with "You"). plan.py takes f: cues as-is.
    return f"f:{s['first']}"

# ---- timeline.json (provisional: durations estimated at ~160 wpm) -------
tl = {
    "slug": "death-count-full",
    "title": "WHAT IF YOU COULD SEE EVERYONE'S DEATH COUNT?",
    "fps": 30,
    "total": total,
    "segments": [{"shot": s["id"], "a": s["first"], "b": s["first"] + s["len"],
                  "t0": 0, "t1": s["len"], "line": s["phrase"]} for s in shots],
    "shots": [{"id": s["id"], "size": s["size"], "key": s["key"],
               "len": s["len"], "first": s["first"], "line": s["phrase"],
               "note": note_of(s)} for s in shots],
    "fx": [
        {"kind": "shake", "len": 8, "amp": 10, "f": F["S6"]},
        {"kind": "flash", "color": "#FFFFFF", "o": 0.4, "f": F["S7"]},
        {"kind": "flash", "color": "#FF3344", "o": 0.5, "f": F["S118"]},
        {"kind": "shake", "len": 8, "amp": 8, "f": F["S137"]},
    ],
    # No voice/sfx/music files exist yet for the full video; the voice step
    # fills these in (public/death-count-full/{voice,sfx,music}.mp3).
    "audio": {},
}
(EP / "timeline.json").write_text(json.dumps(tl, indent=1, ensure_ascii=False),
                                  encoding="utf-8")

# ---- episode.json --------------------------------------------------------
REVEALS = ["S1", "S3", "S5", "S9", "S15", "S17", "S33", "S37", "S41",
           "S45", "S68", "S80", "S113", "S118", "S137"]
events = []
for rid in REVEALS:
    events.append([f"f:{F[rid] + 2}", "timer_pulse", 0.2])
events += [
    [f"f:{F['S2'] + 5}", "coin_drop", 0.5],
    [f"f:{F['S3']}", "subway_ambience", 0.15, "onset", f"f:{F['S4'] + L['S4']}"],
    [f"f:{F['S5']}", "diner_ambience", 0.18, "onset", f"f:{F['S6'] + L['S6']}"],
    [f"f:{F['S6'] + 2}", "heartbeat", 0.25, "onset", f"f:{F['S6'] + 30}"],
    [f"f:{F['S7']}", "title_boom", 0.4, "peak"],
    [f"f:{F['S7']}", "roof_wind", 0.15, "onset", f"f:{F['S10'] + L['S10']}"],
    [f"f:{F['S9'] + 6}", "paper_lower", 0.35],
    [f"f:{F['S42'] + 4}", "page_turn", 0.3],
    [f"f:{F['S44']}", "subway_ambience", 0.12, "onset", f"f:{F['S48'] + L['S48']}"],
    [f"f:{F['S52']}", "crowd_murmur", 0.12, "onset", f"f:{F['S54'] + L['S54']}"],
    [f"f:{F['S29']}", "footsteps", 0.3],
    [f"f:{F['S89']}", "phone_buzz", 0.3],
    [f"f:{F['S108']}", "roof_wind", 0.15, "onset", f"f:{F['S110'] + L['S110']}"],
    [f"f:{F['S118'] + 2}", "heartbeat", 0.25, "onset", f"f:{F['S118'] + 30}"],
    [f"f:{F['S130']}", "footsteps", 0.3],
    [f"f:{F['S131']}", "diner_ambience", 0.18, "onset", f"f:{F['S149'] + L['S149']}"],
    [f"f:{F['S137'] + 2}", "heartbeat", 0.25, "onset", f"f:{F['S137'] + 30}"],
    [f"f:{F['S151']}", "city_hum", 0.12, "onset", f"f:{F['S155'] + L['S155']}"],
    [f"f:{F['S152']}", "footsteps", 0.3],
    ["f:0", "music", 0.25, "onset", f"f:{total}"],
]

ep = {
    "id": "DeathCountFull",
    "slug": "death-count-full",
    "topic": "What if you could see a death count above everyone's head showing their remaining days?",
    "title": ["WHAT IF YOU COULD SEE", "EVERYONE'S DEATH COUNT?"],
    "accent": "DAYS",
    "power": {
        "word": "Days.",
        "rule": "a glowing number above every head, counting down their remaining days",
        "look": "a soft red counter above each head, the digits fading in on focus",
    },
    "script": [{"beat": b["beat"], "text": b["text"]} for b in beats],
    "science": [
        {"claim": "The average American gets about 78 years — about 28,500 days.",
         "working": "US life expectancy was 78.4 years in 2023; 78 years is about 28,500 days. The baby's 19,801 and the sister's 14 sit on that same scale.",
         "source": "CDC/NCHS, Mortality in the United States: 2023"},
        {"claim": "When people feel time is short, they choose the people they love.",
         "working": "Carstensen asked what people do when time runs out: they stop chasing new things and prioritise emotionally meaningful goals and close relationships.",
         "source": "Carstensen, Isaacowitz & Charles (1999), American Psychologist"},
        {"claim": "People who buy back time are happier than people who buy things.",
         "working": "Sixty workers were given $40 each: one weekend buy a thing, the next buy time. The time weekend won, every time.",
         "source": "Whillans, Dunn, Smeets, Bekkers & Norton (2017), PNAS"},
        {"claim": "The timer reads the person you're thinking about, not you.",
         "working": "Narrative rule, not a scientific claim. The twist reframes the power from self-focused to other-focused, making every glance a choice about whose time you're witnessing.",
         "source": "Original story rule"},
    ],
    "cast": ["pipHood", "sis", "suit", "sam", "maya", "mom", "mo"],
    "shots": [{"id": s["id"], "size": s["size"], "set": specs[s["id"]]["set"],
               "key": s["key"], "note": note_of(s)} for s in shots],
    "edit": [{"shot": s["id"], "at": cue_of(s)} for s in shots],
    "tail": 1.0,
    "fx": [
        {"at": f"f:{F['S6']}", "kind": "shake", "len": 8, "amp": 10},
        {"at": f"f:{F['S7']}", "kind": "flash", "color": "#FFFFFF", "o": 0.4},
        {"at": f"f:{F['S118']}", "kind": "flash", "color": "#FF3344", "o": 0.5},
        {"at": f"f:{F['S137']}", "kind": "shake", "len": 8, "amp": 8},
    ],
    "sound": {
        "clips": {
            "coin_drop": ["a coin dropping into a glass tip jar, bright metallic clink", 0.4],
            "timer_pulse": ["a soft digital pulse, a subtle electronic blink sound", 0.3],
            "subway_ambience": ["subway car interior, low rumble, distant brakes, muffled voices", 8.0],
            "seat_offer": ["fabric rustle as someone stands and gestures, a soft shoe scuff", 0.6],
            "timer_blink": ["a tiny digital glitch as numbers change, almost inaudible", 0.2],
            "title_boom": ["a cinematic whoosh rising into a deep boom impact", 1.6],
            "diner_ambience": ["quiet evening diner, faint clink of cups, distant kitchen hum", 6.0],
            "paper_lower": ["newspaper being lowered slowly, crisp paper rustle", 0.7],
            "heartbeat": ["a single slow heartbeat, muffled, intimate", 0.9],
            "roof_wind": ["a gentle evening breeze on a city rooftop, distant traffic", 7.0],
            "glitch": ["a short digital glitch, an electric buzz and crackle flickering like an unstable hologram", 1.0],
            "drone_hit": ["a dark ominous low drone hit, deep cinematic horror sting", 2.6],
            "crowd_murmur": ["cafeteria crowd at lunch, dozens of overlapping voices, trays and chairs, low and warm", 12.0],
            "page_turn": ["a notebook page turning slowly, soft paper whisper", 0.5],
            "phone_buzz": ["a phone buzzing once on a desk, muted vibration", 0.4],
            "footsteps": ["soft footsteps on a school hallway floor, steady and unhurried", 2.0],
            "city_hum": ["distant city hum at dusk, traffic far below, a faint breeze", 10.0],
            "music": ["playful quirky cartoon background music, pizzicato strings, glockenspiel and soft bass, light and curious, 110 bpm, no vocals", 12.0],
            "music_dark": ["ominous slow cello drone with sparse piano, minor key, cinematic tension, 60 bpm, no vocals", 20.0],
        },
        "events": events,
        "repeats": [],
        "music": {"clip": "music", "until": f"f:{total}"},
        # v4 quiet bed: music ~20 dB under the voice (music-half.mp3 level).
        "levels": {"sfx_lu": -0.5, "music_lu": -20.0},
    },
}
(EP / "episode.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False),
                                 encoding="utf-8")
print("episode.json + timeline.json written")

# ---- shots.tsx -----------------------------------------------------------
# Data-driven: every shot is a thin wrapper over GenericShot with its spec
# from the script's shot list. Shot IDs are S1-S155, EXACTLY the IDs
# timeline.json references (the template death-count scheme, not Sh1-ShN).
# No shot references an undefined pose; all colours are valid hex; all sets
# exist in src/engine/sets (bedroom, classroom, kitchen, rooftop, study,
# stairwell) plus the local Subway / starry-void backgrounds below.
TSX_HEAD = r'''import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, LOOKS, FONT, Look, Expr,
  Study, Rooftop, TitleCard, camT, ShotProps,
  Kitchen, KitchenIsland, Bedroom, Classroom, Stairwell,
  NightSky, Stars, Kid, KIDS,
} from '../../engine';

/** Pip in look B, the dark hoodie (continuity with the 30s sample). */
const PIP = LOOKS.pipHood;

/** Sam: Pip's rig in an orange hoodie. Maya: the sister rig, purple top, bob. */
const SAM: Look = { ...LOOKS.pipHood, jacket: '#E8722A', jacketShade: '#C25E20', limb: '#E8722A', accent: '#FFC845' };
const MAYA: Look = { ...LOOKS.sis, jacket: '#6A5A8A', jacketShade: '#52446E', accent: '#E9C46A', extra: 'bob' };
const LOOKMAP: Record<string, Look> = {
  pip: PIP, sam: SAM, sis: LOOKS.sis, mom: LOOKS.mom, suit: LOOKS.suit, mo: LOOKS.mo, maya: MAYA,
};

type CharSpec = {
  look: string; x: number; y: number; scale: number; facing: 1 | -1; expr: Expr;
  timer?: string; dim?: boolean; pulse?: boolean; bright?: boolean; walk?: boolean; tickFrom?: number;
};
type PillSpec = {
  x: number; y: number; n: string; s?: number;
  dim?: boolean; pulse?: boolean; bright?: boolean; tickFrom?: number;
};
type Spec = {
  kind: string; set: string; night: boolean; zoom: number; cx: number; cy: number;
  chars: CharSpec[]; pills: PillSpec[]; seed: number;
  booth: boolean; paper: boolean; plant: boolean; notebook: boolean; veil: number;
  title?: [string, string]; accent?: string;
};

/**
 * The death count: a dark navy pill with a red outline and a white bold number,
 * with a small red DAYS label above it. Placed above a character's head.
 * `pulse` makes it breathe (for a blinking or counting timer), `dim` is a
 * stranger's faint number, `bright` is a loved one's burning number.
 */
const Count: React.FC<{ x: number; y: number; n: string; t: number; pulse?: boolean; s?: number; dim?: boolean; bright?: boolean }> = ({
  x, y, n, t, pulse = false, s = 1, dim = false, bright = false,
}) => {
  const w = 44 + n.length * 24;
  const o = (pulse ? 0.65 + 0.35 * Math.sin(t / 4) : 1) * (dim ? 0.45 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {bright ? <rect x={-w / 2 - 14} y={-38} width={w + 28} height={76} rx={38} fill="#FF3344" opacity={0.25} /> : null}
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill="#14101E" stroke="#FF3344" strokeWidth={3} />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
      <text x={0} y={-32} fontFamily={FONT.title} fontWeight={700} fontSize={12} fill="#FF3344" textAnchor="middle" letterSpacing={3}>
        DAYS
      </text>
    </g>
  );
};

/**
 * A subway car interior: dark walls, a row of windows with city lights rushing
 * past (the train is moving), vertical poles, bench seats. The light streaks
 * move with the shot clock so the car never sits still.
 */
const Subway: React.FC<{ t: number }> = ({ t }) => {
  return (
    <g>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#1A1626" />
      <rect x={-400} y={180} width={2720} height={14} fill="#3A3446" />
      <rect x={-400} y={194} width={2720} height={6} fill="#FFE9B8" opacity={0.7} />
      {[0, 1, 2, 3].map((i) => {
        const wx = 140 + i * 460;
        return (
          <g key={i}>
            <rect x={wx} y={260} width={360} height={280} rx={10} fill="#0E0C1E" stroke="#3A3446" strokeWidth={5} />
            <rect x={wx + ((t * 7 + i * 130) % 360)} y={280} width={46} height={240} fill="#FFC27A" opacity={0.55} />
            <rect x={wx + ((t * 7 + i * 210 + 90) % 360)} y={280} width={26} height={240} fill="#9FC0FF" opacity={0.45} />
            <rect x={wx + ((t * 7 + i * 90 + 200) % 360)} y={280} width={18} height={240} fill="#FF6B6B" opacity={0.35} />
          </g>
        );
      })}
      {[620, 1080, 1540].map((px) => (
        <rect key={px} x={px} y={200} width={12} height={600} rx={6} fill="#4A4460" />
      ))}
      <rect x={-400} y={780} width={2720} height={110} fill="#2A2440" />
      <rect x={-400} y={890} width={2720} height={26} fill="#1E1830" />
      <rect x={-400} y={916} width={2720} height={400} fill="#14101E" />
    </g>
  );
};

/** The science beat's dot grid: 240 dots standing in for 100,000 babies. */
const DotGrid: React.FC<{ seed: number }> = ({ seed }) => {
  const dots = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 20; c++) {
      const gold = (r * 20 + c + seed) % 47 === 0;
      dots.push(
        <circle key={`${r}-${c}`} cx={360 + c * 62} cy={260 + r * 52} r={gold ? 9 : 6} fill={gold ? '#FFC845' : '#8A7FA8'} opacity={gold ? 0.95 : 0.55} />,
      );
    }
  }
  return <g>{dots}</g>;
};

/** The dead plant by the gym door: a pot and three drooping stems. */
const DeadPlant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 0 L 40 0 L 30 60 L -30 60 Z" fill="#8A5A3A" />
    <path d="M 0 0 Q -30 -60 -70 -50" stroke="#6A5A3A" strokeWidth={6} fill="none" />
    <path d="M 0 0 Q 10 -70 50 -60" stroke="#6A5A3A" strokeWidth={6} fill="none" />
    <path d="M 0 0 Q 0 -80 -10 -90" stroke="#7A6A3A" strokeWidth={6} fill="none" />
  </g>
);

/** Maya's notebook, open: two cream pages with writing lines. */
const Notebook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-130} width={380} height={260} rx={10} fill="#E9E2D2" />
    <rect x={-178} y={-118} width={172} height={236} rx={6} fill="#F6F1E6" />
    <rect x={6} y={-118} width={172} height={236} rx={6} fill="#F6F1E6" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x={-160} y={-90 + i * 32} width={140} height={7} rx={3} fill="#8A8474" opacity={0.7} />
        <rect x={24} y={-90 + i * 32} width={140} height={7} rx={3} fill="#8A8474" opacity={0.7} />
      </g>
    ))}
  </g>
);

/** Old photos: three prints, every head blank above it (the mirror rule). */
const Photos: React.FC = () => (
  <g>
    {[560, 960, 1360].map((x, i) => (
      <g key={i} transform={`translate(${x} 480) rotate(${(i - 1) * 4})`}>
        <rect x={-140} y={-180} width={280} height={360} rx={8} fill="#F4F1EA" />
        <rect x={-120} y={-160} width={240} height={240} fill="#2A2440" />
        <circle cx={0} cy={-40} r={52} fill="#F6EFE3" />
        <path d="M -120 80 Q 0 -20 120 80 L 120 80 L -120 80 Z" fill="#3E8C86" />
      </g>
    ))}
  </g>
);

/** The mirror: a big frame on the wall, a clear reflection, nothing above the head. */
const MirrorFrame: React.FC = () => (
  <g>
    <rect x={620} y={150} width={680} height={620} rx={24} fill="#1E2438" stroke="#8A7FA8" strokeWidth={8} />
    <rect x={650} y={180} width={620} height={560} rx={16} fill="#232A44" />
    <circle cx={960} cy={540} r={80} fill="#F6EFE3" opacity={0.55} />
    <circle cx={936} cy={532} r={6} fill="#1D2033" opacity={0.55} />
    <circle cx={984} cy={532} r={6} fill="#1D2033" opacity={0.55} />
    <path d="M 944 566 Q 960 574 976 566" stroke="#1D2033" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
    <path d="M 880 640 Q 960 596 1040 640 L 1040 740 L 880 740 Z" fill="#2E2B3D" opacity={0.55} />
  </g>
);

/** The tip jar: a glass jar with gold coins dropping into it (S2 macro insert). */
const TipJar: React.FC<{ t: number }> = ({ t }) => {
  const drop = kf(t, [[0, -120], [18, 0]]);
  return (
    <g transform="translate(960, 700)">
      <rect x={-90} y={-110} width={180} height={150} rx={16} fill="#2A2C40" />
      <rect x={-78} y={-98} width={156} height={30} rx={12} fill="#FFC845" opacity={0.9} />
      <circle cx={-30} cy={drop} r={22} fill="#FFC845" />
      <circle cx={30} cy={drop - 40} r={22} fill="#FFC845" />
      <circle cx={0} cy={drop - 80} r={22} fill="#FFC845" opacity={0.8} />
    </g>
  );
};

/** The diner booth: two benches, the table between them, two untouched coffees. */
const Booth: React.FC = () => (
  <g>
    <rect x={560} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
    <rect x={1140} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
    <rect x={800} y={860} width={320} height={26} rx={8} fill="#5A4A3A" />
    <rect x={800} y={886} width={320} height={140} fill="#2A2226" />
    <g transform="translate(880, 850)">
      <rect x={-22} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
      <rect x={90} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
    </g>
  </g>
);

const Back: React.FC<{ spec: Spec; t: number }> = ({ spec, t }) => {
  const n = spec.seed;
  switch (spec.set) {
    case 'kitchen':
      return <Kitchen t={t} id={`k${n}`} veil={0.3} />;
    case 'study':
      return <Study t={t} id={`s${n}`} veil={spec.veil} night={spec.night} />;
    case 'bedroom':
      return <Bedroom t={t} id={`b${n}`} veil={spec.veil} duvet={false} />;
    case 'classroom':
      return <Classroom t={t} id={`c${n}`} />;
    case 'stairwell':
      return <Stairwell t={t} id={`w${n}`} />;
    case 'rooftop':
      return <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />;
    case 'subway':
      return <Subway t={t} />;
    case 'void':
      return (
        <g>
          <NightSky id={`v${n}`} horizonY={1080} />
          <Stars seed={n} x0={-400} y0={-400} w={2720} h={1480} t={t} n={60} />
        </g>
      );
    default:
      return <rect x={-400} y={-200} width={2720} height={1480} fill="#14101E" />;
  }
};

const Char: React.FC<{ c: CharSpec; t: number; i: number }> = ({ c, t, i }) => {
  const swing = c.walk ? Math.sin(t / 6 + i * 1.7) * 18 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: c.x, y: c.y, scale: c.scale, facing: c.facing, headTilt: 0, armR: { a: 18 + swing, b: -10 }, armL: { a: 10 - swing, b: -8 }, legL: { a: c.walk ? swing : 5, b: 0 }, legR: { a: c.walk ? -swing : -5, b: 0 } } },
    { f: 24, p: { headTilt: (i % 2 ? -1 : 1) * 3, armR: { a: 34 + swing, b: -8 } }, ease: easeOut },
    { f: 48, p: { headTilt: 0, armR: { a: 20 + swing, b: -10 } } },
  ]);
  const n = c.tickFrom !== undefined ? String(Math.max(0, c.tickFrom - Math.floor(t / 30))) : c.timer;
  return (
    <>
      <Hero look={LOOKMAP[c.look]} pose={{ ...pose, ...faceAt(t, [[0, c.expr]]) }} shadow={0} rimId="rimR" />
      {n ? <Count x={pose.x} y={pose.y - 440 * pose.scale} n={n} t={t} pulse={c.pulse} dim={c.dim} bright={c.bright} s={c.scale >= 1 ? 1 : 0.9} /> : null}
    </>
  );
};

const GenericShot: React.FC<ShotProps & { spec: Spec }> = ({ t, spec }) => {
  const z = kf(t, [[0, spec.zoom], [48, spec.zoom * 1.04]]);
  const suit = spec.chars.find((c) => c.look === 'suit');
  return (
    <g transform={camT(spec.cx, spec.cy, z)}>
      <Back spec={spec} t={t} />
      {spec.kind === 'dots' ? <DotGrid seed={spec.seed} /> : null}
      {spec.kind === 'photos' ? <Photos /> : null}
      {spec.kind === 'mirror' ? <MirrorFrame /> : null}
      {spec.kind === 'jar' ? <TipJar t={t} /> : null}
      {spec.kind === 'crowd' ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Kid key={i} x={300 + i * 264} y={820} s={0.9} look={KIDS[i % KIDS.length]} t={t} />
          ))}
        </g>
      ) : null}
      {spec.kind === 'prop-notebook' ? <Notebook x={960} y={700} s={1.6} /> : null}
      {spec.kind === 'prop-plant' ? <DeadPlant x={960} y={820} s={1.4} /> : null}
      {spec.chars.map((c, i) => (
        <Char key={i} c={c} t={t} i={i} />
      ))}
      {spec.set === 'kitchen' ? <KitchenIsland /> : null}
      {spec.booth ? <Booth /> : null}
      {spec.plant && spec.kind !== 'prop-plant' ? <DeadPlant x={1500} y={820} s={0.8} /> : null}
      {spec.notebook ? <Notebook x={1500} y={780} s={0.9} /> : null}
      {spec.paper && suit ? (
        <g transform={`translate(${suit.x} ${suit.y - 176 * suit.scale + kf(t, [[0, 0], [30, 140]])})`}>
          <rect x={-70} y={-50} width={140} height={100} rx={4} fill="#E9E2D2" />
          <rect x={-58} y={-38} width={116} height={10} fill="#2A2C40" />
          <rect x={-58} y={-20} width={80} height={6} fill="#8A8474" />
          <rect x={-58} y={-8} width={100} height={6} fill="#8A8474" />
        </g>
      ) : null}
      {spec.pills.map((p, i) => {
        const n = p.tickFrom !== undefined ? String(Math.max(0, p.tickFrom - Math.floor(t / 30))) : p.n;
        return <Count key={i} x={p.x} y={p.y} n={n} t={t} pulse={p.pulse} dim={p.dim} bright={p.bright} s={p.s ?? 1} />;
      })}
      {spec.title ? <TitleCard t={t} lines={spec.title} accent={spec.accent} y={180} size={110} /> : null}
    </g>
  );
};

'''

SPECS_JSON = json.dumps(specs, indent=1)
exports = []
for s in shots:
    sid = s["id"]
    exports.append(f"// ---------- {sid}: {s['set']} — {s['size']}; {s['chars']} · timer {s['timer']}")
    exports.append(f"export const {sid}: React.FC<ShotProps> = (p) => <GenericShot {{...p}} spec={{SPECS.{sid}}} />;")
TSX = (TSX_HEAD + "const SPECS: Record<string, Spec> = " + SPECS_JSON + ";\n\n" +
       "\n".join(exports) + "\n")
(EP / "shots.tsx").write_text(TSX, encoding="utf-8")
print(f"shots.tsx written ({len(TSX)} chars)")

# ---- index.tsx -----------------------------------------------------------
def chunked(names, per=10):
    out = []
    for i in range(0, len(names), per):
        out.append("  " + ", ".join(names[i:i + per]) + ",")
    return "\n".join(out)

names = [f"S{i}" for i in range(1, 156)]
IDX = """import React from 'react';
import { defineEpisode, Timeline, LookDef, Dial } from '../../engine';
import timeline from './timeline.json';
import {
__IMPORTS__
} from './shots';

const deathLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.15 * lv}) brightness(${1 + 0.03 * lv})`,
  Overlay: ({ f, p, n }) => {
    return (
      <g>
        <Dial p={1 - p} readout={`0${String(Math.floor(14 * (1 - p))).slice(-2)}`} x={1800} y={80} fontSize={24} color="#FF3344" />
      </g>
    );
  },
};

export const deathCountFull = defineEpisode('DeathCountFull', {
  timeline: timeline as Timeline,
  shots: {
__MAP__
  },
  looks: { death: deathLook },
});
""".replace("__IMPORTS__", chunked(names)).replace("__MAP__", chunked(names))
(EP / "index.tsx").write_text(IDX, encoding="utf-8")
print("index.tsx written")
print("ALL FILES WRITTEN")
