#!/usr/bin/env python3
"""Build music + SFX stems for death-count-2min WITHOUT ElevenLabs.

Music: Kevin MacLeod "Sunset at Glengorm" (CC-BY 4.0, same track as the
approved 30s sample), trimmed to 120s, gain set so the stem mean lands
~27 dB below the voice mean (voice -29.1 dB -> music ~-56.1 dB).
SFX: free-library clips placed on the timeline's shot starts (same mixing
pattern as build-death-count-full-sfx.py: peak-normalised clips, onset
alignment, looped ambiences), then the whole stem is scaled to match the
approved v2 stem levels (mean ~-38.8 dB, max ~-17.8 dB).
Stems are .mp3 on purpose: plan.py only auto-detects .wav stems, so the
timeline stays voice-only and the GitHub stitch mixes music/sfx in after
loudnorm (music vol 1.0, sfx vol 0.1).
Run from the studio folder:  python3 build-death-count-2min-audio.py
"""
import json, pathlib, subprocess, sys

import numpy as np

sys.path.insert(0, str(pathlib.Path.home() / '.claude/skills/what-if-animation/scripts'))
from wi import SR, decode  # noqa: E402  (SR = 44100)

STUDIO = pathlib.Path.cwd()
assert (STUDIO / 'src' / 'episodes' / 'death-count-2min').exists(), 'run from the studio folder'
PACK = pathlib.Path.home() / 'workspace/sfx-library/reference-pack'
RP = PACK / 'sfx'
BG = PACK / 'bgm'
PUB = STUDIO / 'public' / 'death-count-2min'
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30
DUR = 120.0
N = int(DUR * SR)

# (source file, licence)
SOURCES = {
    'storm':      (RP / 'ambient-night-time-storm-natboy-1603862702.mp3', 'CC-BY 3.0 Natboy'),
    'whoosh':     (RP / 'whoosh-1.mp3', 'CC-BY 3.0'),
    'horn':       (RP / 'whistle-crowd-airhorn-soundbible-com-975027544.mp3', 'CC-BY 3.0 SoundBible'),
    'flyby':      (RP / 'whoosh-flyby-conor-1500306612.mp3', 'CC-BY 3.0 Conor'),
    'tick':       (RP / 'pop-blop.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
    'ding':       (RP / 'ding-airplane.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
    'boom':       (RP / 'impact-earshot-cut-hit-sub.wav', 'MIT Earshot'),
    'pling':      (RP / 'pop-click-pling-kevangc-1485374730.mp3', 'CC-BY 3.0 Kevangc'),
    'thud':       (RP / 'thud-wooden.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
    'glass':      (RP / 'ui-notification-glass-ping-go445-1207030150.mp3', 'CC-BY 3.0 Go445'),
    'fall':       (RP / 'riser-earshot-air-fall.wav', 'MIT Earshot'),
    'beep':       (RP / 'emotional-beep-soundbible-com-923660219.mp3', 'CC-BY 3.0 SoundBible'),
    'page':       (RP / 'paper-crinkle-page-turn-mark-diangelo-1304638748.mp3', 'CC-BY 3.0 Mark DiAngelo'),
    'check':      (RP / 'ui-realsfx-soft-check.mp3', 'MIT Real SFX'),
    'subway':     (RP / 'ambient-machine-sound-marianne-gagnon-88253407.mp3', 'CC-BY 3.0 Marianne Gagnon'),
    'tinkle':     (RP / 'ding-chime-bell-tinkle-lisa-redfern-1916445296.mp3', 'CC-BY 3.0 Lisa Redfern'),
    'door':       (RP / 'ding-chime-bell-store-door-chime-mike-koenig-570742973.mp3', 'CC-BY 3.0 Mike Koenig'),
    'heartbeat':  (RP / 'emotional-heartbeat-soundbible-com-1259675634.mp3', 'CC-BY 3.0 SoundBible'),
    'steps':      (RP / 'footstep-walking-soundbible-com-895042969.mp3', 'CC-BY 3.0 SoundBible'),
    'clock':      (RP / 'ambience-fx-jab-soundbible-com-1806727891.mp3', 'CC-BY 3.0 SoundBible'),
    'achieve':    (RP / 'ui-realsfx-cinematic-achievement.mp3', 'MIT Real SFX'),
}
AMBIENT = {'storm', 'subway', 'heartbeat', 'steps', 'clock'}

# (time_s, clip, gain, span_s or None) — span loops ambiences to fill it
EVENTS = [
    (0.0,   'storm',     0.05, 11.2),   # rainy bus stop, cold open
    (3.0,   'whoosh',    0.25, None),   # Sam grabs his collar
    (5.3,   'horn',      0.30, None),   # truck runs the red light
    (6.0,   'flyby',     0.30, None),   # truck passes
    (7.3,   'tick',      0.12, None),   # timer spins: ticks
    (8.3,   'tick',      0.12, None),
    (9.3,   'tick',      0.12, None),
    (10.3,  'tick',      0.12, None),
    (10.6,  'ding',      0.25, None),   # spin-up lands: 41 years
    (11.3,  'boom',      0.50, None),   # title hit
    (14.2,  'pling',     0.20, None),   # green means decades
    (16.0,  'pling',     0.20, None),   # orange means years
    (16.9,  'thud',      0.25, None),   # red means hurry
    (19.2,  'glass',     0.15, None),   # mirror: nothing above your head
    (21.4,  'fall',      0.30, None),   # Lily's number drops
    (24.1,  'beep',      0.20, None),   # 81 years down to two days
    (26.8,  'page',      0.25, None),   # calendar: Saturday 2:40
    (31.7,  'pling',     0.20, None),   # testing Alex
    (34.9,  'check',     0.20, None),   # 15,204 days
    (39.9,  'pling',     0.20, None),   # Mr Ortiz
    (46.1,  'pling',     0.20, None),   # Maya
    (53.5,  'subway',    0.05, 5.4),    # subway ambience, mother + baby
    (58.9,  'tinkle',    0.20, None),   # baby: 19,801
    (74.4,  'door',      0.25, None),   # hold doors
    (78.1,  'heartbeat', 0.06, 5.6),    # tell Alex his number
    (86.6,  'thud',      0.20, None),   # he stops
    (94.1,  'steps',     0.15, 1.4),    # sorting people: walking past
    (101.3, 'heartbeat', 0.06, 2.3),    # you feel sick
    (103.7, 'glass',     0.15, None),   # mirror at night
    (110.0, 'clock',     0.12, 3.6),    # Saturday 2:40, counting down
    (113.7, 'heartbeat', 0.06, 2.4),    # fourteen days
    (116.2, 'achieve',   0.30, None),   # Part one
]


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
    sm = np.convolve(a, np.ones(win) / win, mode='same')
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


def write_wav(path, x):
    import wave
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def encode_mp3(wav_path, mp3_path):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav_path),
                    '-ar', '48000', '-b:a', '192k', str(mp3_path)], check=True)


def mean_db(x):
    nz = x[np.abs(x) > 1e-6]
    return 20 * np.log10(np.sqrt(np.mean(nz ** 2))) if len(nz) else -99.0


def main():
    print('decoding clips ...')
    clips = {}
    for name, (src, lic) in SOURCES.items():
        assert src.exists(), f'missing source for {name}: {src}'
        x = decode(src)
        x = x / max(1e-9, np.abs(x).max())  # peak-normalise, like sfx.py
        clips[name] = x
        print(f'  {name}: {len(x)/SR:.2f}s  ({lic})')

    print('mixing SFX stem ...')
    sfx = np.zeros(N)
    for t, name, gain, span in EVENTS:
        put(sfx, t, clips[name], gain, span)
    print(f'  placed {len(EVENTS)} events; raw peak {np.abs(sfx).max():.3f}')
    # Scale the whole stem to the approved v2 stem levels (mean ~-38.8 dB).
    # Measure on the mixed stem, then scale.
    m = mean_db(sfx)
    target = -38.8
    g = 10 ** ((target - m) / 20)
    print(f'  stem mean {m:.1f} dB -> scaling by {g:.3f} to {target} dB')
    sfx *= g
    print(f'  final peak {np.abs(sfx).max():.3f} ({20*np.log10(np.abs(sfx).max()):.1f} dBFS), mean {mean_db(sfx):.1f} dB')
    write_wav('/tmp/dc2min_sfx.wav', sfx)
    encode_mp3('/tmp/dc2min_sfx.wav', PUB / 'sfx.mp3')
    print(f'  wrote {PUB / "sfx.mp3"}')

    print('building music stem (Sunset at Glengorm, 120s) ...')
    src = BG / 'bgm-emotional-piano-sunset-at-glengorm.mp3'
    mus = decode(src)
    print(f'  source {len(mus)/SR:.1f}s, mean {mean_db(mus):.1f} dB')
    out = mus[:N].copy()
    if len(out) < N:  # loop if ever shorter
        out = loop_fill(mus, N)
    # Voice mean -29.1 dB; music 27 dB below -> -56.1 dB.
    mm = mean_db(out)
    g = 10 ** ((-56.1 - mm) / 20)
    print(f'  music mean {mm:.1f} dB -> gain {g:.4f}')
    out *= g
    fade = int(2.0 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    print(f'  final mean {mean_db(out):.1f} dB, peak {20*np.log10(np.abs(out).max()):.1f} dBFS')
    write_wav('/tmp/dc2min_music.wav', out)
    encode_mp3('/tmp/dc2min_music.wav', PUB / 'music.mp3')
    print(f'  wrote {PUB / "music.mp3"}')


if __name__ == '__main__':
    main()
