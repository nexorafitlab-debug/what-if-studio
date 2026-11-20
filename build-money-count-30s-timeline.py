#!/usr/bin/env python3
"""Build src/episodes/money-count-30s/timeline.json from words.json + episode.json.

Mirrors the death-count-30s-new timeline.json format exactly:
  {slug, title, fps: 30, total, segments: [{shot, a, b, t0, t1, line}],
   shots: [{id, size, key, len, first, line, note}], fx: [], audio: {...}}

Segment boundaries come from the edit anchors' word times in words.json:
a shot runs from its anchor word's start to the next shot's anchor word's
start; the last shot runs to the end of the voice + tail (1.2s).

Anchor matching is normalised (lowercase, punctuation stripped, so "$40"
matches a "40" token and "$8,412,009" matches "8,412,009") and searched
sequentially, so repeated anchor words (e.g. "morning") resolve to the
next occurrence after the previous anchor, never an earlier one.

The timeline is voice-only (musicVol/sfxVol 0): music and SFX are mixed
in by the GitHub stitch step, never here -- see the double-mix trap.

Usage:
  python3 build-money-count-timeline.py [words.json] [episode.json] [timeline.json]
Defaults are the money-count paths under src/episodes/money-count-30s/.
Do NOT run until words.json exists (the voice agent is still working).
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent / "src" / "episodes" / "money-count-30s"
FPS = 30


def norm(w):
    """Lowercase, strip everything but letters/digits: '$40.' -> '40'."""
    return re.sub(r"[^a-z0-9]", "", w.lower())


def main():
    words_path = Path(sys.argv[1]) if len(sys.argv) > 1 else BASE / "words.json"
    ep_path = Path(sys.argv[2]) if len(sys.argv) > 2 else BASE / "episode.json"
    out_path = Path(sys.argv[3]) if len(sys.argv) > 3 else BASE / "timeline.json"

    words = json.loads(words_path.read_text())
    ep = json.loads(ep_path.read_text())
    assert words, "words.json is empty"
    assert ep["edit"][0] == {"at": "f:0", "shot": "S1"}, "first edit anchor must be f:0 / S1"

    normed = [norm(w["w"]) for w in words]
    tail = ep.get("tail", 1.2)

    # Resolve each edit anchor to a word index, sequentially.
    anchor_idx = []
    pos = 0
    for entry in ep["edit"]:
        at = entry["at"]
        if at == "f:0":
            anchor_idx.append(0)
            pos = 1
            continue
        target = norm(at)
        found = None
        for j in range(pos, len(normed)):
            if normed[j] == target:
                found = j
                break
        if found is None:
            raise SystemExit(
                f"anchor {at!r} (shot {entry['shot']}) not found in words.json "
                f"after word {pos} ({words[pos-1]['w']!r})"
            )
        anchor_idx.append(found)
        pos = found + 1

    total = round((words[-1]["e"] + tail) * FPS)

    segments = []
    for i, shot in enumerate(ep["shots"]):
        start_i = anchor_idx[i]
        start_f = 0 if i == 0 else round(words[start_i]["s"] * FPS)
        if i + 1 < len(ep["shots"]):
            end_i = anchor_idx[i + 1]
            end_f = round(words[end_i]["s"] * FPS)
            line = " ".join(w["w"] for w in words[start_i:end_i])
        else:
            end_f = total
            line = " ".join(w["w"] for w in words[start_i:])
        assert end_f > start_f, f"{shot['id']}: empty segment (anchor word {start_i})"
        segments.append({
            "shot": shot["id"],
            "a": start_f,
            "b": end_f,
            "t0": 0,
            "t1": end_f - start_f,
            "line": line,
        })

    timeline = {
        "slug": ep["slug"],
        "title": " ".join(ep["title"]),
        "fps": FPS,
        "total": total,
        "segments": segments,
        "shots": [
            {
                "id": s["id"],
                "size": s["size"],
                "key": s["key"],
                "len": seg["b"] - seg["a"],
                "first": seg["a"],
                "line": seg["line"],
                "note": s["note"],
            }
            for s, seg in zip(ep["shots"], segments)
        ],
        "fx": ep.get("fx", []),
        "audio": {
            "musicVol": 0,
            "sfxVol": 0,
            "voice": "money-count-30s/voice.wav",
            "sfx": "money-count-30s/sfx.mp3",
            "music": "money-count-30s/music.mp3",
        },
    }
    out_path.write_text(json.dumps(timeline, indent=2, sort_keys=False) + "\n")
    dur = total / FPS
    print(f"wrote {out_path}: {len(segments)} segments, total {total} frames "
          f"({dur:.1f}s incl. {tail}s tail)")


if __name__ == "__main__":
    main()
