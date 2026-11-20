#!/usr/bin/env bash
# Stitch video-only Remotion chunks into the final 720p video.
#
# Usage: bash scripts/stitch.sh <slug> <total_frames> <chunks> <chunk_dir> [output]
#   slug         episode slug; audio stems live in public/<slug>/
#   total_frames total frames in the composition (e.g. 976 for DeathCountV2)
#   chunks       how many chunk-N.mp4 files to expect in <chunk_dir>
#   chunk_dir    directory holding chunk-0.mp4 ... chunk-(N-1).mp4
#   output       final file (default: final-720p.mp4)
#
# What it does, in order:
#   1. Concats the video-only chunks (same codec/settings -> -c copy).
#   2. Mixes the episode's audio stems (public/<slug>/voice.mp3 + music.mp3
#      + sfx.mp3, .wav fallback) at volume 1.0 each. The stems are already
#      pre-attenuated to their target relative levels (music ~27 dB below the
#      voice, SFX below the voice), so no extra gain is applied here.
#   3. Two-pass loudnorm to -14 LUFS, TP -1.5, LRA 11 — the exact settings
#      master.py uses (loudnorm linear mode).
#   4. Downscales to 1280x720 (the delivery size) in the same second pass.
#   5. Verifies duration + frame count against total_frames and prints the
#      measured loudness. Exits non-zero if duration/frames don't match.
set -euo pipefail

SLUG="$1"
TOTAL="$2"
N="$3"
CHUNK_DIR="$4"
OUT="${5:-final-720p.mp4}"

DUR=$(python3 -c "print(f'{$TOTAL / 30:.3f}')")
echo "slug=$SLUG total_frames=$TOTAL chunks=$N duration=${DUR}s"

# --- 1. concat video-only chunks -------------------------------------------
cd "$CHUNK_DIR"
: > concat.txt
for ((i = 0; i < N; i++)); do
  f="chunk-$i.mp4"
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
  echo "file '$f'" >> concat.txt
done
ffmpeg -y -v error -f concat -safe 0 -i concat.txt -c copy stitched-1080p.mp4
cd - > /dev/null

# --- 2. mix audio stems -----------------------------------------------------
# Build the ffmpeg input list: stitched video first, then each stem that exists.
INPUTS=(-i "$CHUNK_DIR/stitched-1080p.mp4")
AMIX_IN=""
COUNT=0
IDX=1
for stem in voice music sfx; do
  for ext in mp3 wav; do
    if [ -f "public/$SLUG/$stem.$ext" ]; then
      INPUTS+=(-i "public/$SLUG/$stem.$ext")
      AMIX_IN="$AMIX_IN[$IDX:a]"
      IDX=$((IDX + 1))
      COUNT=$((COUNT + 1))
      echo "stem: $stem.$ext"
      break
    fi
  done
done
[ "$COUNT" -gt 0 ] || { echo "no audio stems found in public/$SLUG/"; exit 1; }

ffmpeg -y -v error "${INPUTS[@]}" \
  -filter_complex "${AMIX_IN}amix=inputs=$COUNT:normalize=0,atrim=0:$DUR[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest mixed-1080p.mp4

# --- 3+4. two-pass loudnorm to -14 LUFS + downscale to 1280x720 -------------
I=-14; TP=-1.5; LRA=11
ffmpeg -hide_banner -nostats -i mixed-1080p.mp4 -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json" -f null - 2> "$CHUNK_DIR/loudnorm-pass1.log"
M=$(python3 - "$CHUNK_DIR/loudnorm-pass1.log" <<'EOF'
import json, sys
s = open(sys.argv[1]).read()
j = json.loads(s[s.rfind('{'):s.rfind('}') + 1])
print(f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}")
EOF
)
FILT="loudnorm=I=$I:TP=$TP:LRA=$LRA:$M:linear=true"
ffmpeg -y -v error -i mixed-1080p.mp4 -vf scale=1280:720 -af "$FILT" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"

# --- 5. verify ---------------------------------------------------------------
GOT_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
GOT_FRAMES=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")
echo "expected: ${DUR}s / $TOTAL frames"
echo "got:      ${GOT_DUR}s / $GOT_FRAMES frames"
LUFS=$(ffmpeg -hide_banner -nostats -i "$OUT" -af loudnorm=I=$I:TP=$TP:print_format=json -f null - 2>&1 | python3 -c "
import json, sys
s = sys.stdin.read()
j = json.loads(s[s.rfind('{'):s.rfind('}') + 1])
print(f\"{j['input_i']} LUFS, TP {j['input_tp']} dBTP\")")
echo "loudness: $LUFS (target -14 LUFS, TP <= -1.0)"
python3 -c "
import sys
dur = float('$GOT_DUR'); exp = float('$DUR')
frames = int('$GOT_FRAMES'); total = int('$TOTAL')
assert abs(dur - exp) < 0.15, f'duration mismatch: {dur} vs {exp}'
assert frames == total, f'frame mismatch: {frames} vs {total}'
print('STITCH OK: duration and frame count match')"
