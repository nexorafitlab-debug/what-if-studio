#!/usr/bin/env python3
"""Build music + SFX stems for past-lives-1min-v2 (60s sample, REBUILT).

Fixes the v1 user feedback directly:
  1. BGM was inaudible -> music stem mean target -44 dB (was -48), same
     Kevin MacLeod "Reminiscing" track (CC-BY 4.0). Verified audible in
     voice gaps after the mix.
  2. Some SFX missing -> a sound on EVERY action: footsteps on every walk,
     a tap for the shoulder tap, a chime on EVERY pill pop, detector
     bleeps, diagram blips, tick-down ticks, whooshes on the big cuts,
     PLUS continuous ambient room tone (school murmur 0-30s, bedroom hum
     30-48s, street wind 48-58.6s). No silent actions.
  3. Voice is REUSED unchanged: copied from public/past-lives-1min/
     (Helio narration + Kokoro af_heart Sam, 98 words, whisper-verified).

SFX event times are the NEW v2 shot timings (20 shots, max 120f).
Stems are .mp3 on purpose: the timeline stays voice-only and the GitHub
stitch mixes music/sfx in after loudnorm (music vol 1.0, sfx vol 1.0).

Run from the studio folder:
    python3 build-past-lives-1min-v2-audio.py
"""
import json
import pathlib
import shutil
import subprocess
import wave

import numpy as np

SR = 44100
STUDIO = pathlib.Path.cwd()
VOICE_SRC = STUDIO / "public" / "past-lives-1min" / "voice.wav"
assert VOICE_SRC.exists(), "v1 voice missing — it must be reused, not regenerated"
PACK = pathlib.Path.home() / "workspace" / "sfx-library" / "reference-pack"
RP = PACK / "sfx"
BG = PACK / "bgm"
PUB = STUDIO / "public" / "past-lives-1min-v2"
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30
DUR = 60.0
N = int(DUR * SR)
print(f"voice: reused from {VOICE_SRC} (60.1s, 98 words, whisper-verified)")


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
# v2 shot map (frames -> seconds): S1 0-90 gate, S2 90-180 classroom,
# S3 180-270 stairwell, S4 270-360 corridor walk, S5 360-450 tap,
# S6 450-540 startle, S7 540-630 thanks, S8 630-720 pill 12,
# S9 720-810 cafeteria pills, S10 810-900 art room 7, S11 900-990 desk,
# S12 990-1080 detector on, S13 1080-1170 mirror, S14 1170-1260 FREEZE,
# S15 1260-1350 12 LIVES, S16 1350-1440 window pills, S17 1440-1560 street,
# S18 1560-1680 tick-down, S19 1680-1758 worried, S20 1758-1800 title.
EVENTS = [
    # --- continuous ambient room tone (never silent) ---
    # NOTE: the old "amb" clip is a 0.5s burst + 1.5s silence (pulses when
    # looped) and the machine hum decays to silence — neither works as a
    # bed. The steady storm rain-noise loops cleanly and reads as soft
    # room tone at low gain; wind is right for the street.
    (0.0,    "storm",  0.02, 30.0),   # school room tone, Beat 1
    (30.0,   "storm",  0.015, 18.0),  # bedroom, quieter room tone
    (48.0,   "wind",   0.06, 10.6),   # evening street wind
    # --- footsteps on every walk (one continuous wash per walk shot) ---
    (0.0,    "step",   0.18, 3.0),    # S1 gate walk
    (6.0,    "step2",  0.16, 3.0),    # S3 stairwell (hard shoes on tiles)
    (9.0,    "step",   0.18, 3.0),    # S4 corridor walk to Sam
    (24.0,   "step",   0.15, 3.0),    # S9 cafeteria walkers
    (27.0,   "step",   0.15, 3.0),    # S10 art room walk
    (48.0,   "step",   0.15, 4.0),    # S17 street walkers
    # --- the shoulder tap ---
    (f2s(420), "tap",  0.30, None),   # S5 tap lands (f420)
    # --- head-turn swish (the startle) ---
    (f2s(458), "swish", 0.12, None),  # S6 Sam snaps her head up
    # --- EVERY pill pop gets a chime ---
    (f2s(650), "chime", 0.32, None),  # S8 the gold 12 pops
    (f2s(650), "whoosh", 0.15, None), # S8 pop shimmer
    (f2s(735), "chime", 0.28, None),  # S9 pill 3
    (f2s(750), "chime", 0.28, None),  # S9 pill 7
    (f2s(765), "chime", 0.28, None),  # S9 pill 2
    (f2s(780), "chime", 0.28, None),  # S9 pill 9
    (f2s(840), "chime", 0.28, None),  # S10 pill 7
    (f2s(1358), "chime", 0.28, None), # S16 window pill 3
    (f2s(1380), "chime", 0.28, None), # S16 window pill 7
    (f2s(1405), "chime", 0.28, None), # S16 window pill 9
    (f2s(1430), "chime", 0.28, None), # S16 window pill 2
    (f2s(1455), "chime", 0.28, None), # S17 street pill 3
    (f2s(1475), "chime", 0.28, None), # S17 street pill 7
    (f2s(1495), "chime", 0.28, None), # S17 street pill 2
    (f2s(1515), "chime", 0.32, None), # S17 street gold 12
    # --- detector bleeps ---
    (f2s(1070), "bleep", 0.28, None), # S12 detector activates
    (f2s(1100), "bleep", 0.24, None), # S13 mirror adjust
    # --- FREEZE diagram blips (each element drawing on) ---
    (f2s(1184), "pling", 0.26, None), # S14 detector draws on
    (f2s(1194), "pling", 0.26, None), # S14 beam draws on
    (f2s(1204), "ping",  0.26, None), # S14 pill 12 draws on
    # --- 12 LIVES illustration ---
    (f2s(1268), "chime", 0.30, None), # S15 big 12 pops
    (f2s(1316), "pling", 0.22, None), # S15 dots finish lighting
    # --- tick-down ---
    (f2s(1625), "tick", 0.32, None),  # S18 12 -> 11
    (f2s(1625), "whoosh", 0.12, None),
    (f2s(1670), "tick", 0.28, None),  # S18 second tick (echo of the cost)
    # --- big cuts + title ---
    (f2s(900), "whoosh", 0.25, None), # cut to the bedroom (Beat 2)
    (f2s(1758), "chime", 0.28, None), # title card lands
    (f2s(1758), "whoosh2", 0.20, None),
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
    write_wav("/tmp/pl2min_sfx.wav", sfx)
    encode_mp3("/tmp/pl2min_sfx.wav", PUB / "sfx.mp3")
    print(f"  wrote {PUB / 'sfx.mp3'}")

    print("building music stem (Reminiscing, -44 dB mean) ...")
    src = BG / "bgm-calm-ambient-reminiscing.mp3"
    mus = decode(src)
    print(f"  source {len(mus) / SR:.1f}s, mean {mean_db(mus):.1f} dB")
    # the track opens with ~1s of silence — start at 1.0s so music is
    # present from the first frame (the user complained BGM was missing).
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
    write_wav("/tmp/pl2min_music.wav", out)
    encode_mp3("/tmp/pl2min_music.wav", PUB / "music.mp3")
    print(f"  wrote {PUB / 'music.mp3'}")

    shutil.copy(VOICE_SRC, PUB / "voice.wav")
    print(f"  copied voice to {PUB / 'voice.wav'}")


if __name__ == "__main__":
    main()
