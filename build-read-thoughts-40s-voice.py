#!/usr/bin/env python3
"""Build the read-thoughts 40s sample voice + words.json with Kokoro am_michael.

Narration: 103 words in 10 chunks (chunk 9 split in two for the cliffhanger
cut). Target ~40s total at Michael's 0.85 speed (~173 wpm pure speech):
  speech ~35.7s + 9 x 0.35s gaps + 1.2s tail = ~40s.

Voice: Kokoro am_michael, speed 0.85 (at 1.2 the 10s words came out at
~227 wpm, rushed; 0.85 lands at ~173 wpm, matching MikoIf 170 wpm).
Raw Kokoro chunks carry ~0.4s lead + ~0.55s trailing silence — trim both,
join chunks with 0.35s gaps (same as the approved samples).

words.json comes from faster-whisper (base, word_timestamps) on the
assembled voice — the same source the timeline builder reads.

Outputs:
  public/read-thoughts-40s/voice.wav
  src/episodes/read-thoughts-40s/words.json

Run from the studio folder with the video venv:
  ~/workspace/venv-video/bin/python build-read-thoughts-40s-voice.py
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

STUDIO = Path.cwd()
EP_DIR = STUDIO / "src" / "episodes" / "read-thoughts-40s"
PUB = STUDIO / "public" / "read-thoughts-40s"
PUB.mkdir(parents=True, exist_ok=True)

MODEL_DIR = Path.home() / "workspace" / "kokoro-model"
CONFIG = MODEL_DIR / "config.json"
WEIGHTS = MODEL_DIR / "kokoro-v1_0.pth"
VOICE = MODEL_DIR / "voices" / "am_michael.pt"

SR = 44100
KOKORO_SR = 24000
SPEED = 0.85
GAP = 0.35  # silence between chunks, same as the approved samples
PAD = 0.05  # audio pad kept around each trimmed chunk

CHUNKS = [
    "You look at a stranger. Their thought: hungry.",
    "You look at your boss. Their thought: fire me.",
    "You look at your best friend. Their thought: coffee. Always coffee.",
    "You look at the bus driver. Their thought: five more minutes.",
    "Everywhere you look, the truth is just there. No more guessing.",
    "You look at your teacher. Their thought: don't ask me.",
    "What if you could read anyone's thoughts?",
    "But here's the catch. The thoughts only show what people are consciously hiding from you, every single day.",
    "And the person hiding the most is standing right in front of you right now, smiling.",
    "Part one.",
]


def write_wav(path, x, sr):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def resample_44k(wav_path):
    """Decode any wav to mono float32 numpy at 44100 Hz via ffmpeg."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(wav_path), "-ac", "1",
         "-ar", str(SR), "-f", "s16le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def trim_silence(x, thresh=0.01):
    """Trim leading/trailing near-silence, keeping PAD on each side."""
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(PAD * SR))
    b = min(len(x), idx[-1] + int(PAD * SR))
    return x[a:b]


def main():
    from kokoro import KModel, KPipeline

    print("loading Kokoro (local model files) ...")
    model = KModel(config=str(CONFIG), model=str(WEIGHTS))
    pipe = KPipeline(lang_code="a", model=model)

    out = np.zeros(0, dtype=np.float32)
    for k, text in enumerate(CHUNKS):
        print(f"  chunk {k + 1}: {text!r}")
        audio = None
        for _, _, a in pipe(text, voice=str(VOICE), speed=SPEED):
            a = a.detach().cpu().numpy() if hasattr(a, "detach") else np.asarray(a)
            audio = a if audio is None else np.concatenate([audio, a])
        assert audio is not None, f"Kokoro returned nothing for chunk {k + 1}"
        write_wav("/tmp/rt40_chunk.wav", audio, KOKORO_SR)
        x = resample_44k("/tmp/rt40_chunk.wav")
        x = trim_silence(x)
        print(f"    raw {len(audio) / KOKORO_SR:.2f}s -> trimmed {len(x) / SR:.2f}s")
        if k > 0:
            out = np.concatenate([out, np.zeros(int(GAP * SR), dtype=np.float32)])
        out = np.concatenate([out, x])

    write_wav(PUB / "voice.wav", out, SR)
    print(f"wrote {PUB / 'voice.wav'}: {len(out) / SR:.2f}s")

    print("transcribing with faster-whisper for words.json ...")
    from faster_whisper import WhisperModel
    model_w = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model_w.transcribe(
        str(PUB / "voice.wav"), language="en", word_timestamps=True)
    words = []
    for s in segments:
        for w in s.words:
            words.append({"w": w.word.strip(),
                          "s": round(w.start, 3), "e": round(w.end, 3)})
    (EP_DIR / "words.json").write_text(json.dumps(words, indent=1) + "\n")
    print(f"wrote {EP_DIR / 'words.json'}: {len(words)} words, "
          f"last word ends {words[-1]['e']:.2f}s")
    print("WORDS:", " ".join(w["w"] for w in words))
    print(f"timeline total ~{round((words[-1]['e'] + 1.2) * 30)} frames "
          f"({(words[-1]['e'] + 1.2):.1f}s incl. 1.2s tail)")


if __name__ == "__main__":
    main()
