#!/usr/bin/env python3
"""Build the v2 sample voice + words.json by slicing the full money-count voice.

The full voice (Kokoro am_michael, 557.43s, 1346 words) already contains every
sentence the sample needs. We slice 4 contiguous spans out of it and reassemble
them with 0.35s gaps between beats — no voice regeneration.

Spans (word indices in src/episodes/money-count/words.json):
  beat 1 (lunch line, S1-S3):  words 0-18    "You are standing in the lunch
    line when it happens. Above the cashier's head, a number appears.
    Forty dollars."  (19 words)
  beat 2 (void title, S15):    words 115-124 "What if you could see how much
    money everyone has?"  (10 words)
  beat 3 (bathroom, S24-S25):  words 185-204 "Rule three, you can't see your
    own number. You stand in front of the bathroom mirror and look up.
    Nothing."  (20 words)
  beat 4 (kitchen, S28-S29):   words 218-248 "You test rule two that night
    at home. Your mom pays the electric bill on her phone. One tap. Her
    number drops one hundred and twelve dollars in a single blink."
    (31 words)

Total: 80 words, ~28.8s of speech + gaps -> ~30s with the 1.2s tail.

Outputs:
  public/money-count-30s-v2/voice.wav
  src/episodes/money-count-30s-v2/words.json   (times remapped to the new voice)

Run from the studio folder.
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

STUDIO = Path.cwd()
FULL_VOICE = STUDIO / "public" / "money-count" / "voice.wav"
FULL_WORDS = STUDIO / "src" / "episodes" / "money-count" / "words.json"
EP_DIR = STUDIO / "src" / "episodes" / "money-count-30s-v2"
PUB = STUDIO / "public" / "money-count-30s-v2"
PUB.mkdir(parents=True, exist_ok=True)

SR = 44100
GAP = 0.35   # silence between beats, same as the v1 sample
PAD = 0.05   # audio pad around each sliced span

SPANS = [
    (0, 18),      # beat 1
    (115, 124),   # beat 2
    (185, 204),   # beat 3
    (218, 248),   # beat 4
]


def decode_wav(path):
    """Decode any wav to mono float32 numpy at SR via ffmpeg."""
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


def main():
    words = json.loads(FULL_WORDS.read_text())
    print(f"full voice: {len(words)} words")
    audio = decode_wav(FULL_VOICE)
    print(f"decoded {len(audio) / SR:.2f}s at {SR} Hz")

    out = np.zeros(0, dtype=np.float32)
    new_words = []
    pos = 0.0  # current write position in the new voice, seconds
    for k, (a, b) in enumerate(SPANS):
        first, last = words[a], words[b]
        start = max(0.0, first["s"] - PAD)
        end = last["e"] + PAD
        seg = audio[int(start * SR):int(end * SR)]
        if k > 0:
            out = np.concatenate([out, np.zeros(int(GAP * SR), dtype=np.float32)])
            pos += GAP
        span_start = pos  # new-timebase start of this span's audio
        out = np.concatenate([out, seg])
        for i in range(a, b + 1):
            w = words[i]
            new_words.append({
                "w": w["w"],
                "s": round(span_start + (w["s"] - start), 3),
                "e": round(span_start + (w["e"] - start), 3),
            })
        pos += len(seg) / SR
        print(f"  span {k + 1}: words {a}-{b} ({b - a + 1} words), "
              f"{start:.2f}-{end:.2f}s -> new {span_start:.2f}-{pos:.2f}s")

    write_wav(PUB / "voice.wav", out)
    (EP_DIR / "words.json").write_text(json.dumps(new_words, indent=1) + "\n")
    total = len(new_words)
    last_end = new_words[-1]["e"]
    print(f"wrote {PUB / 'voice.wav'}: {len(out) / SR:.2f}s")
    print(f"wrote {EP_DIR / 'words.json'}: {total} words, last word ends "
          f"{last_end:.2f}s -> timeline total ~{round((last_end + 1.2) * 30)} frames")


if __name__ == "__main__":
    main()
