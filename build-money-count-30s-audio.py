#!/usr/bin/env python3
"""Build music + SFX stems for money-count-30s (30s sample, Kokoro am_michael voice).

Music: Kevin MacLeod "Sunset at Glengorm" (CC-BY 4.0, same track as the
approved death-count sample), trimmed to the real voice duration, gain set
so the stem mean lands at -48 dB (clearly audible on normal speakers,
still under the voice — the failed 2-min video's -56 dB bed was inaudible).

SFX: event times are derived from the real Michael voice word timings in
src/episodes/money-count-30s/words.json (cue-word lookup); numbers are
whisper tokens ("$40", "$44", "$48"), not spelled-out words.
The whole SFX stem is scaled so its MAX PEAK lands around -8 dBFS
(peaks near voice level — the failed video's -17.8 dB peaks were masked
by narration).

Duration comes from the real voice: words.json last end + episode tail
(1.2 s), NOT 120 s.

Stems are .mp3 on purpose: plan.py only auto-detects .wav stems, so the
timeline stays voice-only and the GitHub stitch mixes music/sfx in after
loudnorm (music vol 1.0, sfx vol 1.0).

Run from the studio folder (AFTER the voice agent has written
src/episodes/money-count-30s/words.json):
    python3 build-money-count-30s-audio.py
"""
import json, pathlib, subprocess, sys

import numpy as np

sys.path.insert(0, str(pathlib.Path.home() / '.claude/skills/what-if-animation/scripts'))
from wi import SR, decode  # noqa: E402  (SR = 44100)

STUDIO = pathlib.Path.cwd()
EP_DIR = STUDIO / 'src' / 'episodes' / 'money-count-30s'
assert EP_DIR.exists(), 'run from the studio folder'
PACK = pathlib.Path.home() / 'workspace/sfx-library/reference-pack'
RP = PACK / 'sfx'
BG = PACK / 'bgm'
PUB = STUDIO / 'public' / 'money-count-30s'
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30

# ---------------------------------------------------------------- words
words = json.loads((EP_DIR / 'words.json').read_text())
ep = json.loads((EP_DIR / 'episode.json').read_text())
TAIL = ep.get('tail', 1.2)
DUR = words[-1]['e'] + TAIL
N = int(DUR * SR)
print(f'voice: {len(words)} words, last word ends {words[-1]["e"]:.2f}s, tail {TAIL}s -> DUR {DUR:.2f}s ({round(DUR * FPS)} frames)')


def find_word(w, occurrence=1):
    """Start time of the Nth occurrence of word w (punctuation-insensitive)."""
    w = w.strip('.,!?').lower()
    hits = [x for x in words if x['w'].strip('.,!?').lower() == w]
    if len(hits) < occurrence:
        return None
    return hits[occurrence - 1]['s']


def cue(w, fallback, offset=0.0, occurrence=1):
    """Cue-word time (+offset), falling back to the placeholder."""
    t = find_word(w, occurrence)
    if t is None:
        print(f'  ! cue word "{w}" (occ {occurrence}) not found in words.json — using fallback {fallback:.2f}s')
        return fallback
    return t + offset


# ---------------------------------------------------------------- sources
# (source file, licence)
SOURCES = {
    'coin':   (RP / 'coin-cash-coin-drop-willem-hunt-569197907.mp3', 'CC-BY 3.0 Willem Hunt'),
    'ding':   (RP / 'ding-chime-bell-store-door-chime-mike-koenig-570742973.mp3', 'CC-BY 3.0 Mike Koenig'),
    'pop':    (RP / 'pop-blop.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
    'page':   (RP / 'paper-crinkle-page-turn-mark-diangelo-1304638748.mp3', 'CC-BY 3.0 Mark DiAngelo'),
    'whoosh': (RP / 'whoosh-1.mp3', 'CC-BY 3.0'),
    'thud':   (RP / 'thud-wooden.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
}

# ---------------------------------------------------------------- events
# (time_s, clip, gain, span_s or None)
# $40 appears (S2) / macro pill lands (S3) / she takes the lunch money (S6) /
# ticks $40->$44->$48 (S7) / Sam elbows hero (S9).
EVENTS = [
    (cue('appears', 4.74),        'ding',   0.25, None),  # the $40 appears above Mrs. Park
    (cue('appears', 4.74, 0.15),  'pop',    0.20, None),  # pill pops in
    (cue('$40', 5.76, 0.0, 1),    'pop',    0.20, None),  # macro pill landing (S3)
    (cue('takes', 18.2),          'page',   0.25, None),  # she takes the lunch money
    (cue('ticks', 20.0),          'coin',   0.30, None),  # the tick starts
    (cue('$40', 20.94, 0.0, 2),   'coin',   0.30, None),  # tick 1: $40
    (cue('$40', 20.94, 0.0, 2),   'ding',   0.20, None),
    (cue('$44', 21.98),           'coin',   0.30, None),  # tick 2: $44
    (cue('$44', 21.98),           'ding',   0.20, None),
    (cue('$48', 23.5),            'coin',   0.30, None),  # tick 3: $48
    (cue('$48', 23.5),            'ding',   0.20, None),
    (cue('elbows', 28.0),         'whoosh', 0.25, None),  # Sam elbows hero
    (cue('ribs', 28.92),          'thud',   0.25, None),  # elbow lands in the ribs
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
        assert 0 <= t < DUR, f'event {name} at {t:.2f}s outside duration {DUR:.2f}s'
        put(sfx, t, clips[name], gain, span)
    raw_peak = np.abs(sfx).max()
    print(f'  placed {len(EVENTS)} events; raw peak {raw_peak:.3f} ({20*np.log10(raw_peak):.1f} dBFS)')
    # Scale the whole stem so its MAX PEAK lands at -8 dBFS (peaks near
    # voice level — the last video's -17.8 dB peaks were masked).
    target_peak_db = -8.0
    g = 10 ** (target_peak_db / 20) / raw_peak
    print(f'  scaling by {g:.3f} to peak {target_peak_db} dBFS')
    sfx *= g
    print(f'  final peak {20*np.log10(np.abs(sfx).max()):.1f} dBFS, mean {mean_db(sfx):.1f} dB')
    write_wav('/tmp/mc30s_sfx.wav', sfx)
    encode_mp3('/tmp/mc30s_sfx.wav', PUB / 'sfx.mp3')
    print(f'  wrote {PUB / "sfx.mp3"}')

    print('building music stem (Sunset at Glengorm) ...')
    src = BG / 'bgm-emotional-piano-sunset-at-glengorm.mp3'
    mus = decode(src)
    print(f'  source {len(mus)/SR:.1f}s, mean {mean_db(mus):.1f} dB')
    out = mus[:N].copy()
    if len(out) < N:  # loop if ever shorter
        out = loop_fill(mus, N)
    # Target mean -48 dB: clearly audible, still well under the voice.
    mm = mean_db(out)
    g = 10 ** ((-48.0 - mm) / 20)
    print(f'  music mean {mm:.1f} dB -> gain {g:.4f}')
    out *= g
    fade = int(2.0 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    print(f'  final mean {mean_db(out):.1f} dB, peak {20*np.log10(np.abs(out).max()):.1f} dBFS')
    write_wav('/tmp/mc30s_music.wav', out)
    encode_mp3('/tmp/mc30s_music.wav', PUB / 'music.mp3')
    print(f'  wrote {PUB / "music.mp3"}')


if __name__ == '__main__':
    main()
