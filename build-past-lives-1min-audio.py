#!/usr/bin/env python3
"""Build music + SFX stems for past-lives-1min (60s sample).

Music: Kevin MacLeod "Reminiscing" (CC-BY 4.0, calm ambient — thematically
right for past lives), trimmed to the real voice duration, gain set so the
stem mean lands at -48 dB (clearly audible, still under the voice).

SFX: event times are derived from the real word timings in
voice/words-1min.json (cue-word lookup) plus fixed times for visual beats.
The whole SFX stem is scaled so its MAX PEAK lands around -8 dBFS (peaks
near voice level).

Stems are .mp3 on purpose: the timeline stays voice-only and the GitHub
stitch mixes music/sfx in after loudnorm (music vol 1.0, sfx vol 1.0).

Self-contained: decode is plain ffmpeg + numpy. No skill imports.

Run from the studio folder (AFTER the voice script has written
voice/words-1min.json):
    python3 build-past-lives-1min-audio.py
"""
import json
import pathlib
import subprocess
import wave

import numpy as np

SR = 44100
STUDIO = pathlib.Path.cwd()
VOICE_DIR = pathlib.Path.home() / "workspace" / "what-if-sample" / "past-lives-full" / "voice"
assert VOICE_DIR.exists(), "voice dir missing"
PACK = pathlib.Path.home() / "workspace" / "sfx-library" / "reference-pack"
RP = PACK / "sfx"
BG = PACK / "bgm"
PUB = STUDIO / "public" / "past-lives-1min"
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30

# ---------------------------------------------------------------- words
words = json.loads((VOICE_DIR / "words-1min.json").read_text())
# Episode total is 1800 frames @ 30fps = 60.0s; stems must cover the whole
# episode (the voice wav is 60.1s, the last word ends at 57.90s, so the
# tail after the last word is ~2.1s of music fade + title card).
DUR = 60.0
N = int(DUR * SR)
print(f"voice: {len(words)} words, last word ends {words[-1]['e']:.2f}s, "
      f"DUR {DUR:.2f}s ({round(DUR * FPS)} frames)")


def find_word(w, occurrence=1):
    w = w.strip(".,!?").lower()
    hits = [x for x in words if x["w"].strip(".,!?").lower() == w]
    if len(hits) < occurrence:
        return None
    return hits[occurrence - 1]["s"]


def cue(w, fallback, offset=0.0, occurrence=1):
    t = find_word(w, occurrence)
    if t is None:
        print(f'  ! cue word "{w}" (occ {occurrence}) not found — using fallback {fallback:.2f}s')
        return fallback
    return t + offset


# ---------------------------------------------------------------- helpers
def decode(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR),
         "-f", "s16le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def write_wav(path, x):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def encode_mp3(wav_path, mp3_path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav_path),
                    "-ar", "48000", "-b:a", "192k", str(mp3_path)], check=True)


def mean_db(x):
    nz = x[np.abs(x) > 1e-6]
    return 20 * np.log10(np.sqrt(np.mean(nz ** 2))) if len(nz) else -99.0


def loop_fill(x, n):
    if len(x) >= n:
        return x[:n].copy()
    xf = min(int(0.05 * SR), len(x) // 2)
    out = np.zeros(n)
    out[:len(x)] = x
    pos = len(x)
    while pos < n:
        take = min(len(x), n - pos + xf)
        k = min(xf, take)
        t = np.linspace(0, 1, k)
        out[pos - k:pos] = out[pos - k:pos] * (1 - t) + x[:k] * t
        rest = take - k
        out[pos:pos + rest] = x[k:k + rest]
        pos += rest
    return out


def onset(x):
    a = np.abs(x)
    win = int(0.01 * SR)
    sm = np.convolve(a, np.ones(win) / win, mode="same")
    return int(np.argmax(sm > 0.2 * sm.max()))


def put(buf, t, x, gain, span=None):
    if span is not None:
        x = loop_fill(x, int(round(span * SR)))
        f = min(len(x), int(0.08 * SR))
        if f:
            x[-f:] *= np.linspace(1, 0, f)
    i = int(t * SR) - onset(x)
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[:j - i] * gain


# ---------------------------------------------------------------- sources
SOURCES = {
    "chime":   (RP / "ding-chime-bell-tinkle-lisa-redfern-1916445296.mp3", "CC-BY 3.0 Lisa Redfern"),
    "whoosh":  (RP / "whoosh-1.mp3", "CC-BY 3.0"),
    "whoosh2": (RP / "whoosh-2.mp3", "CC-BY 3.0"),
    "step":    (RP / "footstep-walking-soundbible-com-895042969.mp3", "CC-BY 3.0 SoundBible"),
    "bleep":   (RP / "emotional-bleep-soundbible-com-1927126940.mp3", "CC-BY 3.0 SoundBible"),
    "tick":    (RP / "click-earshot-soft.wav", "MIT Earshot"),
    "amb":     (RP / "ambience-fx-jab-soundbible-com-1806727891.mp3", "CC-BY 3.0 SoundBible"),
}

# ---------------------------------------------------------------- events
# Voice events: H01 0-4.08, walk gap 4-16, H02 16.08-17.83, S01 18.83-21.06,
# pill gap 21-31, H03 31.06-48.89, H04 49.39-53.47, H05 53.97-58.60.
EVENTS = [
    (0.0,    "amb",    0.06, 31.0),   # hallway ambience bed, Beat 1 (low, under everything)
    (7.0,    "step",   0.18, None),   # footsteps as Alex walks to Sam
    (9.0,    "step",   0.18, None),
    (11.0,   "step",   0.18, None),
    (13.0,   "step",   0.18, None),
    (15.0,   "step",   0.18, None),
    (cue("Thanks", 21.0, 1.0), "chime", 0.30, None),  # the "12" pill pops above Sam
    (cue("Thanks", 21.0, 1.15), "whoosh", 0.15, None), # pill pop shimmer
    (31.0,   "whoosh", 0.25, None),   # cut to the bedroom (Beat 2)
    (cue("wear", 36.0, 0.0), "bleep", 0.25, None),     # detector activates
    (cue("ticks", 54.0, 0.0), "tick", 0.30, None),     # number ticks down 12->11
    (cue("ticks", 54.0, 1.5), "tick", 0.30, None),     # second tick
    (58.6,   "chime",  0.25, None),   # title card lands
    (58.6,   "whoosh2", 0.20, None),  # title card whoosh
]


def main():
    print("decoding clips ...")
    clips = {}
    for name, (src, lic) in SOURCES.items():
        assert src.exists(), f"missing source for {name}: {src}"
        x = decode(src)
        x = x / max(1e-9, np.abs(x).max())
        clips[name] = x
        print(f"  {name}: {len(x) / SR:.2f}s  ({lic})")

    print("mixing SFX stem ...")
    sfx = np.zeros(N)
    for t, name, gain, span in EVENTS:
        assert 0 <= t < DUR, f"event {name} at {t:.2f}s outside duration {DUR:.2f}s"
        put(sfx, t, clips[name], gain, span)
    raw_peak = np.abs(sfx).max()
    print(f"  placed {len(EVENTS)} events; raw peak {raw_peak:.3f} "
          f"({20 * np.log10(raw_peak):.1f} dBFS)")
    target_peak_db = -8.0
    g = 10 ** (target_peak_db / 20) / raw_peak
    print(f"  scaling by {g:.3f} to peak {target_peak_db} dBFS")
    sfx *= g
    print(f"  final peak {20 * np.log10(np.abs(sfx).max()):.1f} dBFS, "
          f"mean {mean_db(sfx):.1f} dB")
    write_wav("/tmp/pl1min_sfx.wav", sfx)
    encode_mp3("/tmp/pl1min_sfx.wav", PUB / "sfx.mp3")
    print(f"  wrote {PUB / 'sfx.mp3'}")

    print("building music stem (Reminiscing) ...")
    src = BG / "bgm-calm-ambient-reminiscing.mp3"
    mus = decode(src)
    print(f"  source {len(mus) / SR:.1f}s, mean {mean_db(mus):.1f} dB")
    out = mus[:N].copy()
    if len(out) < N:
        out = loop_fill(mus, N)
    mm = mean_db(out)
    g = 10 ** ((-48.0 - mm) / 20)
    print(f"  music mean {mm:.1f} dB -> gain {g:.4f}")
    out *= g
    fade = int(2.0 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    print(f"  final mean {mean_db(out):.1f} dB, "
          f"peak {20 * np.log10(np.abs(out).max()):.1f} dBFS")
    write_wav("/tmp/pl1min_music.wav", out)
    encode_mp3("/tmp/pl1min_music.wav", PUB / "music.mp3")
    print(f"  wrote {PUB / 'music.mp3'}")

    # copy the verified voiceover into public/ for the stitch
    import shutil
    shutil.copy(VOICE_DIR / "voice-1min.wav", PUB / "voice.wav")
    print(f"  copied voice to {PUB / 'voice.wav'}")


if __name__ == "__main__":
    main()
