#!/usr/bin/env python3
"""Build the Allergies 2-min CLAUDE (fresh) voiceover.

Fresh narration ONLY (~/workspace/what-if-sample/allergies-2min-claude-narration.txt,
329 words, verified clean). NOTHING from the old Allergies video is reused:
fresh words, fresh scenes, fresh voice.

Helio (avocado_v2:MAI_03) via /opt/hatch/bin/tts speak, SHORT chunks only
(hallucinates on long calls). Every chunk whisper-verified with
faster-whisper tiny; mismatch arbitrated with base, then one retry.
Join: trim silence, 0.30s gaps, ffmpeg concat via numpy (same approach as
build-past-lives-1min-v3-voice.py). words.json: faster-whisper base,
word_timestamps, on the assembled voice.

Outputs:
  public/allergies-2min-claude/chunks/cN.{mp3,wav,txt}
  public/allergies-2min-claude/voice.wav
  src/episodes/allergies-2min-claude/words.json

Run from the studio folder with the video venv:
  TMPDIR=/home/hatch/tmp-remotion ~/workspace/venv-video/bin/python build-allergies-2min-claude-voice.py
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

STUDIO = Path.cwd()
EP_DIR = STUDIO / "src" / "episodes" / "allergies-2min-claude"
PUB = STUDIO / "public" / "allergies-2min-claude"
CH = PUB / "chunks"
PUB.mkdir(parents=True, exist_ok=True)
CH.mkdir(parents=True, exist_ok=True)
EP_DIR.mkdir(parents=True, exist_ok=True)

SR = 44100
GAP = 0.30
PAD = 0.05
TAIL = 1.0

CHUNKS = json.loads(
    (Path.home() / "workspace" / "what-if-sample" / "allergies-2min-claude"
     / "voice-chunks.json").read_text()
)
CHUNKS = [(f"c{i+1}", t) for i, t in enumerate(CHUNKS)]
EXPECTED_WORDS = sum(len(t.split()) for _, t in CHUNKS)
print(f"expected total: {EXPECTED_WORDS} words in {len(CHUNKS)} chunks")


def write_wav(path, x, sr):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def decode_44k(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1",
         "-ar", str(SR), "-f", "s16le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def trim_silence(x, thresh=0.01):
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(PAD * SR))
    b = min(len(x), idx[-1] + int(PAD * SR))
    return x[a:b]


def norm_words(text):
    out = []
    for w in text.replace("—", " ").replace("’", "'").replace("-", " ").split():
        w = w.strip(".,!?\"“”:;").lower().replace("’", "'").replace(",", "")
        for suf in ("'d", "'ve", "'ll", "'re", "'m", "'s", "'t"):
            if w.endswith(suf):
                w = w[:-len(suf)]
                break
        if w:
            out.append(w)
    return out


def decode_16k(path):
    """Decode to 16kHz float32 mono numpy array (avoids faster-whisper's
    av.open(metadata_errors=...) crash with PyAV 19)."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1",
         "-ar", "16000", "-f", "f32le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def apply_aliases(words):
    """Collapse whisper's tokenizations of single spoken items.
    These are homophones or transcription artifacts whisper cannot
    distinguish by sound — NOT real TTS differences:
    - 'cats'/'cat\\'s' -> 'cat' (whisper drops the plural s in 'CATS whisker')
    - 'moat' -> 'mote' (homophones; 'dust mote' can only be heard as 'moat')
    - 'judgement' -> 'judgment' (whisper's British spelling)
    - 'dustmote' -> 'dust mote' (whisper joins the two words)
    """
    s = " ".join(words)
    s = s.replace("dustmote", "dust mote")
    words = s.split()
    ALIAS = {"cats": "cat", "moat": "mote", "judgement": "judgment",
             "tissues": "tissue"}
    return [ALIAS.get(w, w) for w in words]


def verify_chunk(wav_path, expected_text, model_w):
    audio = decode_16k(wav_path)
    segments, _ = model_w.transcribe(audio, language="en",
                                     word_timestamps=True)
    heard = []
    for s in segments:
        for w in s.words:
            heard.append(w.word.strip())
    exp = apply_aliases(norm_words(expected_text))
    got = apply_aliases(norm_words(" ".join(heard)))
    return got == exp, heard, exp, got


def helio_chunk(cid, text):
    mp3 = CH / f"{cid}.mp3"
    cmd = ["/opt/hatch/bin/tts", "speak", "--voice", "avocado_v2:MAI_03",
           "--text-stdin", "--output", str(mp3)]
    r = subprocess.run(cmd, input=text.encode(), capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(f"tts failed for {cid}: {r.stderr.decode()[:500]}")
    x = decode_44k(mp3)
    return trim_silence(x)


def main():
    from faster_whisper import WhisperModel
    print("loading faster-whisper tiny (chunk verification) ...")
    tiny = WhisperModel("tiny", device="cpu", compute_type="int8")
    base = None
    out = np.zeros(0, dtype=np.float32)
    for k, (cid, text) in enumerate(CHUNKS):
        (CH / f"{cid}.txt").write_text(text + "\n")
        print(f"  [{k+1}/{len(CHUNKS)}] {cid}: {text[:60]!r}...")
        x = helio_chunk(cid, text)
        write_wav(CH / f"{cid}.wav", x, SR)
        ok, heard, exp, got = verify_chunk(CH / f"{cid}.wav", text, tiny)
        print(f"    {len(x)/SR:.2f}s, heard: {' '.join(heard)}")
        if not ok:
            print(f"    !! MISMATCH for {cid}: expected {exp} got {got}")
            if base is None:
                base = WhisperModel("base", device="cpu", compute_type="int8")
            ok, heard, exp, got = verify_chunk(CH / f"{cid}.wav", text, base)
            print(f"    base-model check: {' '.join(heard)}")
            if ok:
                print(f"    OK via base ({len(exp)} words; tiny mis-heard)")
            else:
                x = helio_chunk(cid, text)
                write_wav(CH / f"{cid}.wav", x, SR)
                ok, heard, exp, got = verify_chunk(CH / f"{cid}.wav", text, base)
                print(f"    retry (base): {' '.join(heard)}")
                if not ok:
                    raise RuntimeError(
                        f"chunk {cid} still mismatched after retry: "
                        f"expected {exp} got {got} — split it smaller and rerun")
        print(f"    OK ({len(exp)} words)")
        if k > 0:
            out = np.concatenate([out, np.zeros(int(GAP * SR), dtype=np.float32)])
        out = np.concatenate([out, x])
    write_wav(PUB / "voice.wav", out, SR)
    print(f"wrote {PUB / 'voice.wav'}: {len(out)/SR:.2f}s")
    print("transcribing full voice with faster-whisper base for words.json ...")
    if base is None:
        base = WhisperModel("base", device="cpu", compute_type="int8")
    full_audio = decode_16k(PUB / "voice.wav")
    segments, _ = base.transcribe(full_audio, language="en",
                                  word_timestamps=True)
    words = []
    for s in segments:
        for w in s.words:
            words.append({"w": w.word.strip(),
                          "s": round(w.start, 3), "e": round(w.end, 3)})
    (EP_DIR / "words.json").write_text(json.dumps(words, indent=1) + "\n")
    print(f"wrote {EP_DIR / 'words.json'}: {len(words)} words, "
          f"last word ends {words[-1]['e']:.2f}s")
    print("WORDS:", " ".join(w["w"] for w in words))
    gaps = [(words[i+1]["s"] - words[i]["e"], words[i]["w"], words[i+1]["w"])
            for i in range(len(words) - 1)]
    gaps.sort(reverse=True)
    print("longest inter-word gaps:")
    for g, a, b in gaps[:5]:
        print(f"  {g:.2f}s after {a!r} -> {b!r}")
    total = words[-1]["e"] + TAIL
    print(f"timeline total ~{round(total * 30)} frames ({total:.1f}s incl. {TAIL}s tail)")


if __name__ == "__main__":
    main()
