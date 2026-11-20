#!/usr/bin/env python3
"""Build SFX + music stems for death-count-full WITHOUT ElevenLabs.

Replicates scripts/sfx.py's mixing logic (peak-normalised clips, onset/peak
alignment, ambience cuts) but sources every clip from the free library:
  - exact cached clips in library/sfx/ where the name+prompt+length hash
    matches (title_boom, roof_wind, drone_hit)
  - ~/workspace/sfx-library/reference-pack/ files otherwise (CC-BY / MIT)
The "music" event in episode.json is NOT placed in the SFX stem: it is the
bed, realised in full as music.mp3 (f:0 -> f:15025). Placing it in both
stems would double the music at the open.
Ambiences with an `until` are looped (50 ms crossfades) to fill their span;
one-shots are trimmed to their spec length.
Run from the studio folder:  python3 build-death-count-full-sfx.py
"""
import hashlib, json, pathlib, subprocess, sys

import numpy as np

sys.path.insert(0, str(pathlib.Path.home() / '.claude/skills/what-if-animation/scripts'))
from wi import SR, decode  # noqa: E402  (SR = 44100, decode = ffmpeg -> mono f32)

STUDIO = pathlib.Path.cwd()
assert (STUDIO / 'src' / 'episodes' / 'death-count-full').exists(), 'run from the studio folder'
LIB = STUDIO / 'library' / 'sfx'
PACK = pathlib.Path.home() / 'workspace/sfx-library/reference-pack'
RP = PACK / 'sfx'
BG = PACK / 'bgm'
PUB = STUDIO / 'public' / 'death-count-full'

EP = json.loads((STUDIO / 'src/episodes/death-count-full/episode.json').read_text())
S = EP['sound']
FPS = 30
TOTAL = 15025
DUR = TOTAL / FPS  # 500.833 s

# clip name -> (source file, licence) ; source is trimmed/looped to spec length
SOURCES = {
    'coin_drop':       (RP / 'coin-cash-coin-drop-willem-hunt-569197907.mp3', 'CC-BY 3.0 Willem Hunt'),
    'timer_pulse':     (RP / 'pop-blop.mp3', 'CC-BY 3.0 Mark DiAngelo / Popup Pixels'),
    'timer_blink':     (RP / 'pop-earshot-airy.wav', 'MIT Earshot'),
    'subway_ambience': (RP / 'ambient-machine-sound-marianne-gagnon-88253407.mp3', 'CC-BY 3.0 Marianne Gagnon'),
    'seat_offer':      (RP / 'paper-crinkle-rustle-soundbible-com-1736422480.mp3', 'CC-BY 3.0 SoundBible'),
    'title_boom':      (LIB / 'title_boom-91f4f23e.mp3', 'cached exact clip (hash match)'),
    'diner_ambience':  (RP / 'ambient-machine-sound-marianne-gagnon-88253407.mp3', 'CC-BY 3.0 Marianne Gagnon'),
    'paper_lower':     (RP / 'paper-crinkle-rustle-soundbible-com-1736422480.mp3', 'CC-BY 3.0 SoundBible'),
    'heartbeat':       (RP / 'emotional-heartbeat-soundbible-com-1259675634.mp3', 'CC-BY 3.0 SoundBible'),
    'roof_wind':       (LIB / 'roof_wind-cedc7edc.mp3', 'cached exact clip (hash match)'),
    'glitch':          (RP / 'riser-sweep-electrical-sweep-sweeper-1760111493.mp3', 'CC-BY 3.0 Sweeper'),
    'drone_hit':       (LIB / 'drone_hit-75f05067.mp3', 'cached exact clip (hash match)'),
    'crowd_murmur':    (RP / 'whistle-crowd-large-stadium-stephan-schutze-2122836113.mp3', 'CC-BY 3.0 Stephan Schutze'),
    'page_turn':       (RP / 'paper-crinkle-page-turn-mark-diangelo-1304638748.mp3', 'CC-BY 3.0 Mark DiAngelo'),
    'phone_buzz':      (RP / 'ui-notification-phone-vibrating-sound-explorer-738835678.mp3', 'CC-BY 3.0 Sound Explorer'),
    'footsteps':       (RP / 'footstep-footsteps-on-cement-tim-fryer-870410055.mp3', 'CC-BY 3.0 Tim Fryer'),
    'city_hum':        (RP / 'ambient-wind-mark-diangelo-1940285615.mp3', 'CC-BY 3.0 Mark DiAngelo'),
    'music':           (BG / 'bgm-cinematic-gaslamp-funworks.mp3', 'CC-BY 4.0 Kevin MacLeod'),
    'music_dark':      (BG / 'bgm-emotional-piano-lithium.mp3', 'CC-BY 4.0 Kevin MacLeod'),
}


AMBIENT = {'subway_ambience', 'diner_ambience', 'crowd_murmur', 'city_hum', 'roof_wind'}


def loop_fill(x, n):
    """Trim x to n samples, or loop it to n with 50 ms crossfades at joins."""
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


def fit_to_length(name, x, secs):
    """Trim a clip to `secs`; pad one-shots with silence, loop ambiences."""
    n = int(round(secs * SR))
    if len(x) >= n:
        return x[:n].copy()
    if name in AMBIENT:
        return loop_fill(x, n)
    out = np.zeros(n)
    out[:len(x)] = x
    return out


def prepare_clips():
    """Decode each source, fit to its spec length, peak-normalise, and cache
    it in library/sfx/ under the skill's {name}-{hash}.mp3 convention."""
    clips = {}
    for name, (prompt, secs) in S['clips'].items():
        src, lic = SOURCES[name]
        assert src.exists(), f'missing source for {name}: {src}'
        h = hashlib.sha1(f'{prompt}|{secs}'.encode()).hexdigest()[:8]
        cached = LIB / f'{name}-{h}.mp3'
        x = decode(src)
        x = fit_to_length(name, x, secs)
        x = x / max(1e-9, np.abs(x).max())  # peak-normalise, like sfx.py
        clips[name] = x
        if not cached.exists():
            tmp = pathlib.Path('/tmp') / f'_clip_{name}.wav'
            import wave
            with wave.open(str(tmp), 'wb') as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(SR)
                w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp),
                            '-b:a', '192k', str(cached)], check=True)
            print(f'  cached {cached.name}  ({lic})')
        else:
            print(f'  reuse  {cached.name}  ({lic})')
    return clips


def onset(x, mode):
    a = np.abs(x)
    win = int(0.01 * SR)
    sm = np.convolve(a, np.ones(win) / win, mode='same')
    return int(np.argmax(sm)) if mode == 'peak' else int(np.argmax(sm > 0.2 * sm.max()))


def loop_fill_event(x, n):
    return loop_fill(x, n)


def put(buf, frame, x, gain, align='onset', cut=None):
    i = int(frame / FPS * SR) - onset(x, align)
    if i < 0:
        x, i = x[-i:], 0
    if cut is not None:
        n = max(0, int(cut / FPS * SR) - i)
        x = loop_fill(x, n)
        f = min(len(x), int(0.08 * SR))
        if f:
            x[-f:] *= np.linspace(1, 0, f)
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[:j - i] * gain


def cue(c):
    assert isinstance(c, str) and c.startswith('f:'), f'unsupported cue {c}'
    return int(c[2:])


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


# Mixcheck-driven gain overrides (episode.json spec untouched).
# The free-library substitutes are denser noise than the ElevenLabs clips
# the gains were written for (peak-normalised wind/machine-hum/crowd/rustle
# sit far hotter than sparse generated hits), so the beds and the two
# densest one-shots come down ~8-10 dB. Title boom keeps its spec gain:
# it is the deliberate title hit.
MIX_OVERRIDES = {
    'subway_ambience': 0.05,  # was 0.15 / 0.12
    'diner_ambience': 0.06,   # was 0.18
    'roof_wind': 0.05,        # was 0.15
    'crowd_murmur': 0.03,     # was 0.12 (2nd pass: -3.0 dB flag at 151.4s)
    'city_hum': 0.04,         # was 0.12
    'coin_drop': 0.20,        # was 0.50 (clink sat +3.5 dB over the voice)
    'paper_lower': 0.03,      # was 0.35 (rustle sat +10.7 dB; 0.06 still -2.1
                              # in the pause after "What are you staring at?")
    'phone_buzz': 0.06,       # was 0.30 (buzz sat +8.3 dB; 0.10 still -1.3)
    'timer_pulse': 0.12,      # was 0.20 (prompt says "subtle"; 0.20 flagged
                              # on quiet words at 102.2s / 112.8s)
    'heartbeat': 0.06,        # was 0.25 (sat +3.3 dB over the voice at 14.4s
                              # and +6.8 dB at the 434.7s mirror beat;
                              # 0.08 still -2.9 there)
}


def main():
    print(f'preparing {len(S["clips"])} clips ...')
    clips = prepare_clips()

    print('mixing SFX stem ...')
    sfx = np.zeros(int(DUR * SR))
    placed, skipped = 0, []
    for ev in S['events']:
        c, name, gain = ev[0], ev[1], ev[2]
        align = ev[3] if len(ev) > 3 else 'onset'
        until = cue(ev[4]) if len(ev) > 4 and ev[4] else None
        if name == 'music':
            skipped.append((c, name, 'realised as music.mp3 bed'))
            continue
        gain = MIX_OVERRIDES.get(name, gain)
        put(sfx, cue(c), clips[name], gain, align, until)
        placed += 1
    print(f'  placed {placed} events in sfx stem; skipped: {skipped}')
    print(f'  sfx stem peak {np.abs(sfx).max():.3f} (no whole-stem normalisation, like the 30s sample)')
    write_wav('/tmp/dcf_sfx.wav', sfx)
    encode_mp3('/tmp/dcf_sfx.wav', PUB / 'sfx.mp3')

    print('building music stem (Gaslamp Funworks, looped, gain 0.00835 = v4 level) ...')
    # v4 used 0.0125 on the first 28.7 s (mean -55.6 dB); the full track
    # looped measures louder, so 0.00835 re-centres the mean on -55.6 dB.
    m = decode(BG / 'bgm-cinematic-gaslamp-funworks.mp3')
    xf = int(1.0 * SR)
    out = m.copy()
    while len(out) < int(DUR * SR):
        take = min(len(m), int(DUR * SR) - len(out) + xf)
        seg = m[:take]
        k = min(xf, len(seg), len(out))
        t = np.linspace(0, 1, k)
        out[-k:] = out[-k:] * (1 - t) + seg[:k] * t
        out = np.concatenate([out, seg[k:]])
    out = out[:int(DUR * SR)]
    fi = int(2.0 * SR)
    out[:fi] *= np.linspace(0, 1, fi) ** 2
    fo = int(3.0 * SR)
    out[-fo:] *= np.linspace(1, 0, fo) ** 2
    out = out * 0.00835
    print(f'  music stem peak {np.abs(out).max():.4f}')
    write_wav('/tmp/dcf_music.wav', out)
    encode_mp3('/tmp/dcf_music.wav', PUB / 'music.mp3')
    print('done.')


if __name__ == '__main__':
    main()
