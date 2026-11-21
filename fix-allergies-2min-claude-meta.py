#!/usr/bin/env python3
"""Fix the two gaps the episode-code worker flagged for allergies-2min-claude:

1. timeline.json lacks slug/title/total/shots (Timeline type requires them;
   defineEpisode reads timeline.total and timeline.shots.length at runtime).
   Build `shots` from the segments + Claude's scenes (note = visual), matching
   the first-2min timeline's shape exactly.
2. episode.json sound.music omits "until" — set "f:3313".
"""
import json
from pathlib import Path

EP = Path("/home/hatch/workspace/what-if-studio/src/episodes/allergies-2min-claude")
SCENES = Path.home() / "workspace" / "what-if-sample" / "allergies-2min-claude-scenes.json"

tl = json.loads((EP / "timeline.json").read_text())
sc = json.loads(SCENES.read_text())
ep = json.loads((EP / "episode.json").read_text())

# --- 1. timeline.json ---
total = tl["segments"][-1]["b"]
assert total == 3313, f"unexpected total {total}"
assert len(tl["segments"]) == 37
notes = {f"S{int(s['id'].split('-')[1])}": s["visual"] for s in sc["shots"]}
shots = []
for seg in tl["segments"]:
    shots.append({
        "first": seg["a"],
        "id": seg["shot"],
        "key": 30,
        "len": seg["b"] - seg["a"],
        "line": seg["line"],
        "note": notes[seg["shot"]],
        "size": "medium",
    })
tl["shots"] = shots
tl["slug"] = "allergies-2min-claude"
tl["title"] = "WHAT IF YOU COULD READ ANYONE'S ALLERGIES?"
tl["total"] = total
# keep the same key order as the other timelines
tl = {k: tl[k] for k in ["audio", "fps", "fx", "segments", "shots", "slug", "title", "total"]}
(EP / "timeline.json").write_text(json.dumps(tl, indent=1) + "\n")
print(f"timeline.json: total={total}, shots={len(shots)}, slug/title set")

# --- 2. episode.json sound.until ---
ep["sound"]["music"]["until"] = f"f:{total}"
(EP / "episode.json").write_text(json.dumps(ep, indent=1) + "\n")
print(f"episode.json: sound.music.until=f:{total}")

# --- sanity: re-read and confirm ---
tl2 = json.loads((EP / "timeline.json").read_text())
ep2 = json.loads((EP / "episode.json").read_text())
assert tl2["total"] == 3313 and len(tl2["shots"]) == 37
assert tl2["shots"][0]["id"] == "S1" and tl2["shots"][-1]["id"] == "S37"
assert ep2["sound"]["music"]["until"] == "f:3313"
print("OK — both files fixed and verified")
