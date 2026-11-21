#!/usr/bin/env python3
"""Build the past-lives 1-min v3 voiceover FRESH (do NOT reuse v1/v2 voice).

The v2 failure was the voiceover: 98 words in 60s (1.6 words/sec), ~25s of
silence, characters moving through the gaps. v3 fixes it at the source:
158 words from the approved script in order (Beat 1 -> Beat 2 -> Beat 3 ->
Beat 4 opening), gaps of 0.30s between lines, dense like the read-thoughts
40s v2 benchmark (103 words / 40s, 2.6 words/sec).

Lines (exact script words, never rewritten):
  H1  Helio  cold-open question (16w)
  H2  Helio  "Hey. Nice sweater." (3w)
  S1  Sam    Kokoro af_heart "Oh, hey. Thanks." (3w)
  H3  Helio  detector intro (14w)
  H4  Helio  number appears (26w)
  H5  Helio  lives lived / reincarnation (14w)
  H6  Helio  ticks down (12w)
  H7  Helio  Mr. Harwick, seven lives (13w)
  H8  Helio  twelve times (6w)
  H9  Helio  three lives, Jordan (7w)
  J1  Jordan Kokoro am_adam "I guess I'm due for a good one then." (9w)
  H10 Helio  "Is this real? ..." (9w)
  H11 Helio  device is my own invention (13w)
  H12 Helio  Dr. Ian Stevenson, 2,500 cases (24w — Beat 4 science)
  H13 Helio  "Part one." (2w, cliffhanger card)
Total: 169 words. (The bridge line "But researchers have studied children
who claim to remember past lives." is cut: with it the voice ran 64.5s and
the video 65.7s; without it the voice is ~59.5s and the video ~60.7s. The
Stevenson citation — the substance of Beat 4 — is kept.)

Helio: /opt/hatch/bin/tts speak, SHORT chunks only (hallucinates on long
calls — a 188-word call returned 466 words). Every chunk whisper-verified
with faster-whisper tiny; a hallucinating chunk is regenerated split smaller.
Kokoro: local model, speed 0.85, voices as local .pt paths.
Join: trim silence, 0.30s gaps (same as read-thoughts-40s-v2 sil.wav),
ffmpeg concat demuxer + re-encode (never concat: + -c copy).
words.json: faster-whisper base, word_timestamps, on the assembled voice.

Outputs:
  public/past-lives-1min-v3/chunks/{h1..h13,s1,j1}.{mp3,wav} + cN-words.json
  public/past-lives-1min-v3/voice.wav
  src/episodes/past-lives-1min-v3/words.json

Run from the studio folder with the video venv:
  TMPDIR=/home/hatch/tmp-remotion ~/workspace/venv-video/bin/python build-past-lives-1min-v3-voice.py
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

STUDIO = Path.cwd()
EP_DIR = STUDIO / "src" / "episodes" / "past-lives-1min-v3"
PUB = STUDIO / "public" / "past-lives-1min-v3"
CH = PUB / "chunks"
PUB.mkdir(parents=True, exist_ok=True)
CH.mkdir(parents=True, exist_ok=True)
EP_DIR.mkdir(parents=True, exist_ok=True)

MODEL_DIR = Path.home() / "workspace" / "kokoro-model"
CONFIG = MODEL_DIR / "config.json"
WEIGHTS = MODEL_DIR / "kokoro-v1_0.pth"
SAM_VOICE = MODEL_DIR / "voices" / "af_heart.pt"
JORDAN_VOICE = MODEL_DIR / "voices" / "am_adam.pt"

SR = 44100
KOKORO_SR = 24000
SPEED = 0.85
GAP = 0.20  # silence between lines (read-thoughts-40s-v2 used 0.30s;
              # 0.20s keeps the 169-word voice + 1.2s tail at ~60s total)
PAD = 0.05

# (id, speaker, text) — speaker: helio | sam | jordan
CHUNKS = [
    ("h1", "helio", "What if you could see something about other people that they'd never know you could see?"),
    ("h2", "helio", "Hey. Nice sweater."),
    ("s1", "sam", "Oh, hey. Thanks."),
    ("h3", "helio", "I invented the lifesight detector. It's my own design. No one else has one."),
    ("h4", "helio", "When I wear it, a small number appears above each person's head. A dark pill with a coloured outline, almost touching the top of their head."),
    ("h5", "helio", "It shows how many lives they've already lived. Reincarnation. Call it what you will."),
    ("h6", "helio", "The number ticks down when a life is spent. Used up. Passed."),
    ("h7", "helio", "Look at Mr. Harwick—the history teacher. Seven lives. He's seen a lot."),
    ("h8", "helio", "You've lived twelve times. That's incredible."),
    ("h9", "helio", "Three lives, Jordan. You've got plenty left."),
    ("j1", "jordan", "I guess I'm due for a good one then."),
    ("h10", "helio", "Is this real? Is there actual evidence for reincarnation?"),
    ("h11", "helio", "The device I built is my own invention—it doesn't measure anything scientific."),
    ("h12", "helio", "Dr. Ian Stevenson, a psychiatrist at the University of Virginia, documented over 2,500 cases of children worldwide who described detailed memories of previous personalities."),
    ("h13", "helio", "Part one."),
]

EXPECTED_WORDS = sum(len(t.split()) for _, _, t in CHUNKS)
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
    for w in text.replace("—", " ").replace("’", "'").split():
        w = w.strip(".,!?\"“”").lower().replace("’", "'").replace(",", "")
        if w == "mister":
            w = "mr"
        if w == "doctor":
            w = "dr"
        # Whisper normalizes British spelling to American ("coloured" is
        # heard as "colored") — normalize both sides to the American form.
        if w == "coloured":
            w = "colored"
        # Whisper (esp. tiny) often drops the contraction tail: "they'd"
        # is heard as "they", "you've" as "you". Strip the tail on BOTH
        # sides so the check compares the stem words, not the elision.
        for suf in ("'d", "'ve", "'ll", "'re", "'m", "'s", "'t"):
            if w.endswith(suf):
                w = w[: -len(suf)]
                break
        if w:
            out.append(w)
    return out


def apply_aliases(words):
    """Collapse whisper's tokenizations of single spoken items:
    'life site'/'life sight' -> 'lifesight' (made-up compound word),
    'two thousand five hundred' -> '2500' (the spoken form of 2,500),
    digit tokens -> number words ('12' is heard for spoken 'twelve')."""
    NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "7": "seven",
           "9": "nine", "12": "twelve"}
    words = [NUM.get(w, w) for w in words]
    s = " ".join(words)
    s = s.replace("life site", "lifesight").replace("life sight", "lifesight")
    s = s.replace("two thousand five hundred", "2500")
    s = s.replace("two 500", "2500")
    return s.split()


def verify_chunk(wav_path, expected_text, model_w):
    """Whisper-transcribe one chunk; return (ok, heard_words)."""
    segments, _ = model_w.transcribe(str(wav_path), language="en",
                                     word_timestamps=True)
    heard = []
    for s in segments:
        for w in s.words:
            heard.append(w.word.strip())
    exp = norm_words(expected_text)
    got = norm_words(" ".join(heard))
    exp = apply_aliases(exp)
    got = apply_aliases(got)
    ok = got == exp
    return ok, heard, exp, got


def helio_chunk(cid, text, attempt=0):
    """One Helio TTS call for a short chunk. Returns decoded 44.1k audio."""
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

    print("loading Kokoro (local model files) ...")
    from kokoro import KModel, KPipeline
    model = KModel(config=str(CONFIG), model=str(WEIGHTS))
    pipe = KPipeline(lang_code="a", model=model)

    def kokoro_chunk(cid, text, voice_path):
        audio = None
        for _, _, a in pipe(text, voice=str(voice_path), speed=SPEED):
            a = a.detach().cpu().numpy() if hasattr(a, "detach") else np.asarray(a)
            audio = a if audio is None else np.concatenate([audio, a])
        assert audio is not None, f"Kokoro returned nothing for {cid}"
        tmp = CH / f"{cid}-raw.wav"
        write_wav(tmp, audio, KOKORO_SR)
        x = decode_44k(tmp)
        return trim_silence(x)

    out = np.zeros(0, dtype=np.float32)
    for k, (cid, speaker, text) in enumerate(CHUNKS):
        (CH / f"{cid}.txt").write_text(text + "\n")
        print(f"  [{k + 1}/{len(CHUNKS)}] {cid} ({speaker}): {text!r}")
        if speaker == "helio":
            x = helio_chunk(cid, text)
        elif speaker == "sam":
            x = kokoro_chunk(cid, text, SAM_VOICE)
        else:
            x = kokoro_chunk(cid, text, JORDAN_VOICE)
        write_wav(CH / f"{cid}.wav", x, SR)
        ok, heard, exp, got = verify_chunk(CH / f"{cid}.wav", text, tiny)
        print(f"    {len(x) / SR:.2f}s, heard: {' '.join(heard)}")
        if not ok:
            print(f"    !! MISMATCH for {cid}: expected {exp} got {got}")
            # Tiny mis-hears near-homophones ("sweater" -> "weather") even
            # when the audio is right — the v1 voice's same line transcribed
            # as "sweater" under the base model. Arbitrate with base before
            # declaring a hallucination.
            from faster_whisper import WhisperModel as _WM
            base = WhisperModel("base", device="cpu", compute_type="int8")
            ok, heard, exp, got = verify_chunk(CH / f"{cid}.wav", text, base)
            print(f"    base-model check: {' '.join(heard)}")
            if ok:
                print(f"    OK via base ({len(exp)} words; tiny mis-heard)")
            else:
                # One retry with the same text (transient TTS wobble).
                if speaker == "helio":
                    x = helio_chunk(cid, text)
                elif speaker == "sam":
                    x = kokoro_chunk(cid, text, SAM_VOICE)
                else:
                    x = kokoro_chunk(cid, text, JORDAN_VOICE)
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
    print(f"wrote {PUB / 'voice.wav'}: {len(out) / SR:.2f}s")

    print("transcribing full voice with faster-whisper base for words.json ...")
    base = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _ = base.transcribe(str(PUB / "voice.wav"), language="en",
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
    # longest gap between consecutive words
    gaps = [(words[i + 1]["s"] - words[i]["e"], words[i]["w"], words[i + 1]["w"])
            for i in range(len(words) - 1)]
    gaps.sort(reverse=True)
    print("longest inter-word gaps:")
    for g, a, b in gaps[:5]:
        print(f"  {g:.2f}s after {a!r} -> {b!r}")
    print(f"timeline total ~{round((words[-1]['e'] + 1.2) * 30)} frames "
          f"({(words[-1]['e'] + 1.2):.1f}s incl. 1.2s tail)")


if __name__ == "__main__":
    main()
