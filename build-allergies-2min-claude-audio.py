#!/usr/bin/env python3
"""Build music.mp3 + sfx.mp3 stems for allergies-2min-claude.

Fresh audio ONLY — nothing from the old Allergies video:
- Music: Kevin MacLeod "Sovereign" (CC-BY, incompetech), trimmed to the
  video length (110.43s), levelled to ~-44 dB mean.
- SFX: SoundBible pop-blop.mp3 (CC BY 3.0, credit Mark DiAngelo +
  Popup Pixels) placed at every shot with sfx pop-blop (label appearances),
  ding-airplane.mp3 at the 2 ding shots. Placed at shot start frames.
  SFX peaks near voice level.

Outputs: public/allergies-2min-claude/music.mp3, sfx.mp3 (both 110.43s).
"""
import json
import subprocess
from pathlib import Path

STUDIO = Path("/home/hatch/workspace/what-if-studio")
PUB = STUDIO / "public" / "allergies-2min-claude"
SFXLIB = Path.home() / "workspace" / "sfx-library" / "soundbible"
MUSIC_SRC = Path.home() / "workspace" / "what-if-sample" / "allergies-2min-claude" / "music-sovereign.mp3"

DUR = 110.43  # seconds (3313 frames @ 30fps)
MUSIC_TARGET_MEAN_DB = -44.0
# SFX stem was 6 dB hotter than the approved first-2min SFX stem
# (mean -31.2 / max -2.9 vs -37.1 / -6.9); attenuate to match so the pops
# sit near voice level, not above it.
SFX_ATTEN_DB = -6.0


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} failed: {r.stderr[:500]}")
    return r


def mean_db(path):
    r = run(["ffmpeg", "-v", "info", "-i", str(path),
             "-af", "volumedetect", "-f", "null", "-"])
    for line in (r.stderr or "").splitlines():
        if "mean_volume" in line:
            return float(line.split("mean_volume:")[1].split("dB")[0].strip())
    raise RuntimeError(f"no mean_volume for {path}: {r.stderr[-300:]}")


def main():
    tl = json.loads((STUDIO / "src" / "episodes" / "allergies-2min-claude"
                     / "timeline.json").read_text())
    sc = json.loads((Path.home() / "workspace" / "what-if-sample"
                     / "allergies-2min-claude-scenes.json").read_text())
    events = []  # (time_s, kind)
    for seg, sh in zip(tl["segments"], sc["shots"]):
        if sh.get("sfx") == "pop-blop":
            events.append((seg["a"] / 30.0, "pop"))
        elif sh.get("sfx") == "ding":
            events.append((seg["a"] / 30.0, "ding"))
    print(f"SFX events: {len(events)} "
          f"({sum(1 for _, k in events if k == 'pop')} pop, "
          f"{sum(1 for _, k in events if k == 'ding')} ding)")

    # --- music: trim to DUR, measure, adjust to target mean ---
    tmp = PUB / "music-raw.mp3"
    run(["ffmpeg", "-y", "-v", "error", "-i", str(MUSIC_SRC),
         "-t", str(DUR), "-ac", "2", "-ar", "44100", str(tmp)])
    raw_mean = mean_db(tmp)
    adj = MUSIC_TARGET_MEAN_DB - raw_mean
    print(f"music raw mean {raw_mean:.1f} dB, adjusting by {adj:+.1f} dB")
    run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp),
         "-af", f"volume={adj:.2f}dB", "-ac", "2", "-ar", "44100",
         str(PUB / "music.mp3")])
    print(f"music final mean {mean_db(PUB / 'music.mp3'):.1f} dB")
    tmp.unlink()

    # --- sfx: silent bed + delayed pops/dings, mixed ---
    silent = PUB / "sfx-silence.wav"
    run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi",
         "-i", f"anullsrc=r=44100:cl=stereo", "-t", str(DUR), str(silent)])
    inputs = ["-i", str(silent)]
    filters = []
    for i, (t, kind) in enumerate(events):
        src = SFXLIB / ("pop-blop.mp3" if kind == "pop" else "ding-airplane.mp3")
        inputs += ["-i", str(src)]
        # delay in ms; each event is input i+1
        filters.append(f"[{i+1}:a]adelay={int(t*1000)}:all=1[d{i}]")
    mix_inputs = "[0:a]" + "".join(f"[d{i}]" for i in range(len(events)))
    filters.append(f"{mix_inputs}amix=inputs={len(events)+1}:normalize=0[amix]")
    filters.append(f"[amix]volume={SFX_ATTEN_DB:.1f}dB[aout]")
    run(["ffmpeg", "-y", "-v", "error", *inputs,
         "-filter_complex", ";".join(filters),
         "-map", "[aout]",
         "-t", str(DUR), "-ac", "2", "-ar", "44100",
         str(PUB / "sfx.mp3")])
    r = run(["ffmpeg", "-v", "info", "-i", str(PUB / "sfx.mp3"),
             "-af", "volumedetect", "-f", "null", "-"])
    for line in (r.stderr or "").splitlines():
        if "mean_volume" in line or "max_volume" in line:
            print("sfx", line.strip())
    silent.unlink()
    print("wrote", PUB / "music.mp3", "and", PUB / "sfx.mp3")


if __name__ == "__main__":
    main()
