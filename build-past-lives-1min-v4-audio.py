#!/usr/bin/env python3
"""Build music + SFX stems for past-lives-1min-v4 (60.6s, 27 shots).

Kept from v2 (which the user liked): music stem mean -44 dB (Kevin
MacLeod "Reminiscing", CC-BY 4.0), a sound on EVERY action, continuous
ambient room tone. Rebuilt for the v3 shot timings (27 shots, cuts on
word starts) and the new moments: the gold beam on every pill pop, the
Harwick 7, Jordan 3, the mirror "IS THIS REAL?", the Stevenson citation
card, the 2,500 counter ticking up, three stairwell tick-downs, and the
cliffhanger end card with the red 0.

Voice is already in public/past-lives-1min-v4/voice.wav (fresh 169-word
voiceover, built by build-past-lives-1min-v4-voice.py) — this script only
builds music.mp3 + sfx.mp3.

Stems are .mp3 on purpose: the timeline stays voice-only and the GitHub
stitch mixes music/sfx in after loudnorm (music vol 1.0, sfx vol 1.0).

Run from the studio folder:
    python3 build-past-lives-1min-v4-audio.py
"""
import json
import pathlib
import subprocess
import wave

import numpy as np

SR = 44100
STUDIO = pathlib.Path.cwd()
PACK = pathlib.Path.home() / "workspace" / "sfx-library" / "reference-pack"
RP = PACK / "sfx"
BG = PACK / "bgm"
PUB = STUDIO / "public" / "past-lives-1min-v4"
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30
DUR = 1818 / FPS  # 60.6s
N = int(DUR * SR)
print(f"duration: {DUR:.2f}s ({1818} frames)")


def f2s(f):
    return f / FPS


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
    "pling":   (RP / "pop-click-pling-kevangc-1485374730.mp3", "CC-BY 3.0 Kevangc"),
    "ping":    (RP / "ui-notification-glass-ping-go445-1207030150.mp3", "CC-BY 3.0 Go445"),
    "whoosh":  (RP / "whoosh-1.mp3", "CC-BY 3.0"),
    "whoosh2": (RP / "whoosh-2.mp3", "CC-BY 3.0"),
    "swish":   (RP / "whoosh-earshot-bamboo-swish.wav", "MIT Earshot"),
    "step":    (RP / "footstep-walking-soundbible-com-895042969.mp3", "CC-BY 3.0 SoundBible"),
    "step2":   (RP / "footstep-hard-shoes-1-daniel-simon.mp3", "CC-BY 3.0 Daniel Simon"),
    "tap":     (RP / "thud-wooden.mp3", "CC-BY 3.0 Mark DiAngelo / Popup Pixels"),
    "bleep":   (RP / "emotional-bleep-soundbible-com-1927126940.mp3", "CC-BY 3.0 SoundBible"),
    "tick":    (RP / "click-earshot-soft.wav", "MIT Earshot"),
    "storm":   (RP / "ambient-night-time-storm-natboy-1603862702.mp3", "CC-BY 3.0 Natboy"),
    "wind":    (RP / "ambient-wind-mark-diangelo-1940285615.mp3", "CC-BY 3.0 Mark DiAngelo"),
}

# ---------------------------------------------------------------- events
# v3 shot map (frames): S1 0-57 gate, S2 57-117 classroom, S3 117-163
# corridor walk, S4 163-208 startle, S5 208-267 bedroom desk,
# S6 267-346 detector on, S7 346-451 pill ECU, S8 451-514 FREEZE,
# S9 514-566 point at pill, S10 566-643 12 LIVES, S11 643-709 cafeteria,
# S12 709-787 tick-down, S13 787-833 worried, S14 833-911 Harwick,
# S15 911-986 Harwick CU, S16 986-1040 tap, S17 1040-1074 Sam smile,
# S18 1074-1156 Jordan, S19 1156-1225 Jordan CU, S20 1225-1330 mirror,
# S21 1330-1398 detector CU, S22 1398-1458 detector down,
# S23 1458-1572 citation, S24 1572-1648 counter, S25 1648-1718 stairwell,
# S26 1718-1772 street, S27 1772-1818 end card.
EVENTS = [
    # --- continuous ambient room tone (never silent) ---
    (0.0,    "storm",  0.005, 40.83),  # school — v4: thinned x0.25 so gaps fall toward -50 dB
    (40.83,  "storm",  0.004, 16.44), # bathroom/bedroom/void/stairwell — v4: thinned x0.25
    (57.27,  "wind",   0.015, 3.33),   # evening street + end card — v4: thinned x0.25
    # --- footsteps on every walk ---
    (0.0,    "step",   0.18, 1.9),    # S1 gate walk
    (3.9,    "step",   0.18, 1.53),   # S3 corridor walk to Sam
    (21.43,  "step",   0.15, 2.2),    # S11 cafeteria walkers
    (35.8,   "step",   0.15, 2.73),   # S18 art room walk
    (54.93,  "step2",  0.16, 2.34),   # S25 stairwell (hard shoes on tiles)
    (57.27,  "step",   0.15, 1.8),    # S26 street walkers
    # --- the shoulder tap + the startle ---
    (f2s(1011), "tap",  0.30, None),  # S16 tap lands (f1011)
    (f2s(171), "swish", 0.12, None),  # S4 Sam snaps her head up
    # --- EVERY pill pop gets a chime (+ beam shimmer) ---
    (f2s(15),  "chime", 0.28, None),  # S1 pill 3
    (f2s(30),  "chime", 0.28, None),  # S1 pill 7
    (f2s(77),  "chime", 0.28, None),  # S2 pill 5
    (f2s(129), "chime", 0.32, None),  # S3 the gold 12 pops
    (f2s(129), "whoosh", 0.12, None), # S3 beam shimmer
    (f2s(169), "chime", 0.26, None),  # S4 beam to the 12
    (f2s(228), "chime", 0.28, None),  # S5 hologram 12
    (f2s(361), "chime", 0.32, None),  # S7 the gold 12 pops big
    (f2s(361), "whoosh", 0.15, None), # S7 pop shimmer
    (f2s(524), "chime", 0.28, None),  # S9 pill 12 (pointed at)
    (f2s(653), "chime", 0.28, None),  # S11 pill 3
    (f2s(665), "chime", 0.28, None),  # S11 pill 7
    (f2s(677), "chime", 0.28, None),  # S11 pill 2
    (f2s(689), "chime", 0.28, None),  # S11 pill 9
    (f2s(792), "chime", 0.22, None),  # S13 ghost 11 lingers
    (f2s(853), "chime", 0.28, None),  # S14 Harwick 7
    (f2s(994), "chime", 0.30, None),  # S16 Sam 12 (tap)
    (f2s(1099), "chime", 0.28, None), # S18 Jordan 3
    (f2s(1350), "chime", 0.28, None), # S21 hologram 12
    (f2s(1726), "chime", 0.26, None), # S26 pill 3
    (f2s(1736), "chime", 0.26, None), # S26 pill 7
    (f2s(1746), "chime", 0.26, None), # S26 pill 2
    # --- detector bleeps ---
    (f2s(332), "bleep", 0.28, None),  # S6 detector activates
    (f2s(1245), "bleep", 0.24, None), # S20 mirror adjust
    # --- FREEZE diagram blips (each element drawing on) ---
    (f2s(465), "pling", 0.26, None),  # S8 detector draws on
    (f2s(475), "pling", 0.26, None),  # S8 beam draws on
    (f2s(485), "ping",  0.26, None),  # S8 pill 12 draws on
    # --- 12 LIVES illustration ---
    (f2s(574), "chime", 0.30, None),  # S10 big 12 pops
    (f2s(622), "pling", 0.22, None),  # S10 dots finish lighting
    # --- tick-downs ---
    (f2s(734), "tick",  0.32, None),  # S12 12 -> 11
    (f2s(734), "whoosh", 0.12, None),
    (f2s(1673), "tick", 0.30, None),  # S25 7 -> 6
    (f2s(1688), "tick", 0.30, None),  # S25 3 -> 2
    (f2s(1703), "tick", 0.30, None),  # S25 9 -> 8
    # --- science graphics ---
    (f2s(1498), "chime", 0.30, None), # S23 huge 2,500+ pops
    (f2s(1498), "whoosh", 0.15, None),
    (f2s(1582), "pling", 0.24, None), # S24 counter starts ticking up
    (f2s(1620), "pling", 0.24, None), # S24 counter passes 1,000
    # --- big cuts + end card ---
    (f2s(208), "whoosh", 0.25, None), # cut to the bedroom (Beat 2)
    (f2s(451), "whoosh", 0.25, None), # cut to the void (FREEZE)
    (f2s(1225), "whoosh", 0.20, None),# cut to the bathroom (mirror)
    (f2s(1458), "whoosh", 0.25, None),# cut to the void (citation)
    (f2s(1772), "whoosh2", 0.20, None),# end card lands
    (f2s(1788), "chime", 0.30, None), # end card red 0 pops
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
    write_wav("/tmp/pl3min_sfx.wav", sfx)
    encode_mp3("/tmp/pl3min_sfx.wav", PUB / "sfx.mp3")
    print(f"  wrote {PUB / 'sfx.mp3'}")

    print("building music stem (Reminiscing, -44 dB mean) ...")
    src = BG / "bgm-calm-ambient-reminiscing.mp3"
    mus = decode(src)
    print(f"  source {len(mus) / SR:.1f}s, mean {mean_db(mus):.1f} dB")
    mus = mus[int(SR * 1.0):]
    out = mus[:N].copy()
    if len(out) < N:
        out = loop_fill(mus, N)
    mm = mean_db(out)
    g = 10 ** ((-44.0 - mm) / 20)
    print(f"  music mean {mm:.1f} dB -> gain {g:.4f}")
    out *= g
    fade = int(2.0 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    print(f"  final mean {mean_db(out):.1f} dB, "
          f"peak {20 * np.log10(np.abs(out).max()):.1f} dBFS")
    write_wav("/tmp/pl3min_music.wav", out)
    encode_mp3("/tmp/pl3min_music.wav", PUB / "music.mp3")
    print(f"  wrote {PUB / 'music.mp3'}")

    # voice stem check (built by the voice script, not copied)
    v = PUB / "voice.wav"
    assert v.exists(), "voice.wav missing — run build-past-lives-1min-v4-voice.py first"
    import subprocess as sp
    dur = float(sp.run(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration", "-of", "csv=p=0", str(v)],
                       check=True, capture_output=True).stdout.decode().strip())
    print(f"  voice.wav present: {dur:.2f}s")


if __name__ == "__main__":
    main()
