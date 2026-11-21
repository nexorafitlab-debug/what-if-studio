#!/usr/bin/env python3
"""Build timeline.json for allergies-2min-claude from words.json + scenes.

Shot boundaries come from the VERIFIED scenes file (start/end phrases tile
the fresh narration, 325 regex-words, no gaps). Segment frames follow the
first-2min convention:
- a_i = round(words[first_word_of_shot_i].s * 30)
- b_i = round(words[first_word_of_shot_{i+1}].s * 30) (next shot's first word)
- last shot b = round((last_word.e + TAIL) * 30)
- t0 = 0, t1 = b - a
- line = " ".join(words.json words for the shot span) — whisper's own
  punctuation, so the line matches what the voice actually says.
Segments tile contiguously. Total frames = 3313 (110.4s incl. 1.0s tail).
"""
import json
import re
from pathlib import Path

STUDIO = Path("/home/hatch/workspace/what-if-studio")
EP = STUDIO / "src" / "episodes" / "allergies-2min-claude"
TAIL = 1.0
FPS = 30

narr = (Path.home() / "workspace" / "what-if-sample"
        / "allergies-2min-claude-narration.txt").read_text()
scenes = json.loads((Path.home() / "workspace" / "what-if-sample"
                     / "allergies-2min-claude-scenes.json").read_text())
words = json.loads((EP / "words.json").read_text())
shots = scenes["shots"]
print(f"shots: {len(shots)}, words.json: {len(words)}")

narr_words = re.findall(r"[a-z0-9']+", narr.lower())
assert len(narr_words) == len(words), (
    f"word count mismatch: narration regex {len(narr_words)} vs words.json {len(words)}")


def words_of(s):
    return re.findall(r"[a-z0-9']+", s.lower())


# Map each shot to its word span [s_idx, e_idx] in narration order.
pos = 0
spans = []
for sh in shots:
    sw = words_of(sh["start"])
    ew = words_of(sh["end"])
    found = -1
    for i in range(pos, len(narr_words) - len(sw) + 1):
        if narr_words[i:i + len(sw)] == sw:
            found = i
            break
    assert found != -1, f"{sh['id']}: start not found: {sh['start']!r}"
    found_e = -1
    for i in range(found, len(narr_words) - len(ew) + 1):
        if narr_words[i:i + len(ew)] == ew:
            found_e = i
            break
    assert found_e != -1, f"{sh['id']}: end not found: {sh['end']!r}"
    end_idx = found_e + len(ew) - 1
    spans.append((found, end_idx))
    pos = end_idx + 1

# Coverage check: every word covered exactly once, in order.
covered = [False] * len(narr_words)
for a, b in spans:
    for j in range(a, b + 1):
        assert not covered[j], f"word {j} covered twice"
        covered[j] = True
assert all(covered), "not all words covered"
print("coverage: all words covered exactly once")

segments = []
for i, (sh, (a, b)) in enumerate(zip(shots, spans)):
    fa = round(words[a]["s"] * FPS)
    if i + 1 < len(shots):
        fb = round(words[spans[i + 1][0]]["s"] * FPS)
    else:
        fb = round((words[b]["e"] + TAIL) * FPS)
    line = " ".join(w["w"] for w in words[a:b + 1])
    segments.append({
        "a": fa, "b": fb, "line": line,
        "shot": f"S{i+1}", "t0": 0, "t1": fb - fa,
    })
    print(f"  S{i+1} ({sh['id']}): frames {fa}-{fb} ({fb-fa}f, "
          f"{(fb-fa)/FPS:.2f}s) | {line[:60]}...")

total = segments[-1]["b"]
print(f"total frames: {total} ({total/FPS:.2f}s)")

timeline = {
    "audio": {
        "music": "allergies-2min-claude/music.mp3",
        "musicVol": 0,
        "sfx": "allergies-2min-claude/sfx.mp3",
        "sfxVol": 0,
        "voice": "allergies-2min-claude/voice.wav",
    },
    "fps": FPS,
    "fx": [],
    "segments": segments,
}
(EP / "timeline.json").write_text(json.dumps(timeline, indent=1) + "\n")
print(f"wrote {EP / 'timeline.json'}: {len(segments)} segments, {total} frames")
