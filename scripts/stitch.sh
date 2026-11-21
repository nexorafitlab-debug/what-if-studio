#!/usr/bin/env bash
# Stitch Remotion chunks into the final 720p video.
#
# Usage: bash scripts/stitch.sh <slug> <total_frames> <chunks> <chunk_dir> [output]
#   slug         episode slug; audio stems live in public/<slug>/
#   total_frames total frames in the composition (e.g. 976 for DeathCountV2)
#   chunks       how many chunk-N.mp4 files to expect in <chunk_dir>
#   chunk_dir    directory holding chunk-0.mp4 ... chunk-(N-1).mp4
#   output       final file (default: final-720p.mp4)
#
# Pipeline (this order matters — it is the same order the approved
# death-count-v2 single render used, and the loudness only lands on target
# this way):
#   1. Concat the chunks. Chunks carry VIDEO + VOICE (the timeline's <Audio>
#      voice track, rendered by Remotion). They do NOT carry music/sfx.
#   2. Two-pass loudnorm to -14 LUFS, TP -1.5, LRA 11 — the exact settings
#      master.py uses. This works on the Remotion-rendered voice: Remotion's
#      render path smooths the voice stem's sharp intersample peaks, so the
#      true peak sits ~3 dB lower than the raw stem and loudnorm can reach
#      -14. Mixing the raw stems first and then loudnorming caps out at
#      about -15.6 LUFS (measured 2026-11-20) — do not do that.
#   3. Mix the music + sfx stems in AFTER loudnorm, at their measured levels
#      (music volume 1.0, sfx volume 1.0 — in the approved 30s final the sfx
#      sit well ABOVE the music: SFX mean -38.8 dB vs music -57.0 dB, so the
#      sfx stem mixes at full volume; at 0.1 it lands at ~-62.7 dB = inaudible
#      — that was the 2-min video's missing-SFX bug, fixed 2026-11-20). They add
#      negligible energy, so the loudness stays at ~-14 LUFS. The music bus
#      gets the R8 + B3 recipe (EXACT-SOLUTION §4 Step 8): an EQ vocal pocket
#      plus a GENTLE sidechain duck against the voice — never heavy ducking,
#      which buried the music at ~-56 dB (inaudible). SFX are never ducked.
#   4. Downscale to 1280x720 (the delivery size) AND apply the 40px
#      letterbox (A6) so no video can ship without it.
#   5. Verify duration + frame count against total_frames and print the
#      measured loudness. Exits non-zero if duration/frames don't match.
set -euo pipefail

SLUG="$1"
TOTAL="$2"
N="$3"
CHUNK_DIR="$4"
OUT="${5:-final-720p.mp4}"

DUR=$(python3 -c "print(f'{$TOTAL / 30:.3f}')")
echo "slug=$SLUG total_frames=$TOTAL chunks=$N duration=${DUR}s"

# --- 1. concat chunks (video + voice) ---------------------------------------
cd "$CHUNK_DIR"
: > concat.txt
for ((i = 0; i < N; i++)); do
  f="chunk-$i.mp4"
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
  echo "file '$f'" >> concat.txt
done
ffmpeg -y -v error -f concat -safe 0 -i concat.txt -c copy stitched-1080p.mp4
cd - > /dev/null

# --- 2. two-pass loudnorm to -14 LUFS (master.py settings) ------------------
I=-14; TP=-1.5; LRA=11
ffmpeg -hide_banner -nostats -i "$CHUNK_DIR/stitched-1080p.mp4" -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json" -f null - 2> "$CHUNK_DIR/loudnorm-pass1.log"
M=$(python3 - "$CHUNK_DIR/loudnorm-pass1.log" <<'EOF'
import json, sys
s = open(sys.argv[1]).read()
j = json.loads(s[s.rfind('{'):s.rfind('}') + 1])
print(f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}")
EOF
)
FILT="loudnorm=I=$I:TP=$TP:LRA=$LRA:$M:linear=true"
ffmpeg -y -v error -i "$CHUNK_DIR/stitched-1080p.mp4" -c:v copy -af "$FILT" \
  -ar 48000 -c:a aac -b:a 256k norm-1080p.mp4

# --- 3. mix music + sfx stems in (after loudnorm, at measured levels) -------
# R8 + B3 (EXACT-SOLUTION §4 Step 8): EQ-pocket + GENTLE duck — NOT heavy
# sidechain ducking (heavy ducking is what buried the music at ~-56 dB).
#   * Music bus: carve a vocal pocket with EQ (-4 dB at 1500 Hz, Q 1.2;
#     -3 dB at 350 Hz, Q 1.5 to de-mud low-mids), then duck GENTLY against
#     the voice sidechain (threshold 0.05, ratio 2, attack 20 ms,
#     release 700 ms) — a 2-6 dB dip, never toward silence.
#   * SFX are NOT ducked: they must punch at/near voice level (stem peaks
#     ~-8 dBFS); ducking them would bury the pops.
#   * amix normalize=0 ALWAYS — without it amix divides each input by 1/N
#     and the voice loses 50-66% of its volume.
# Chime tails (0.3-0.5 s + fast fade, atrim + afade) are a per-event
# stem-build rule and already hold in the stems (v3 chimes decay 20 dB in
# 0.35 s); the SFX stem arrives pre-mixed here, so no per-chime atrim is
# possible at this stage — do not add one here.
# music at 1.0, sfx at 1.0 (sfx sit ABOVE the music in the approved final — see header). Stems are looked up as .mp3 first, then .wav.
INPUTS=(-i norm-1080p.mp4)
VOL_FILTERS=()
MIX_IN="[0:a]"
COUNT=1
IDX=1
for stem in music sfx; do
  F="public/$SLUG/$stem.mp3"; [ -f "$F" ] || F="public/$SLUG/$stem.wav"
  [ -f "$F" ] || continue
  VOL=1.0
  INPUTS+=(-i "$F")
  if [ "$stem" = "music" ]; then
    # EQ vocal pocket + gentle sidechain duck against the voice ([0:a]).
    VOL_FILTERS+=("[$IDX:a]volume=$VOL,equalizer=f=1500:t=q:w=1.2:g=-4,equalizer=f=350:t=q:w=1.5:g=-3[meq];[meq][0:a]sidechaincompress=threshold=0.05:ratio=2:attack=20:release=700[v$IDX]")
  else
    VOL_FILTERS+=("[$IDX:a]volume=$VOL[v$IDX]")
  fi
  MIX_IN="$MIX_IN[v$IDX]"
  IDX=$((IDX + 1)); COUNT=$((COUNT + 1))
  echo "stem: $stem (vol $VOL)"
done
if [ "$COUNT" -eq 1 ]; then
  echo "no music/sfx stems in public/$SLUG/ — skipping mix"
  cp norm-1080p.mp4 mixed-1080p.mp4
else
  FILTER=""
  for v in "${VOL_FILTERS[@]}"; do FILTER="$FILTER$v;"; done
  FILTER="${FILTER}${MIX_IN}amix=inputs=$COUNT:normalize=0,atrim=0:$DUR[aout]"
  # NOTE: no -shortest here — it can drop the last video frame when the
  # trimmed audio ends a hair before the video. The video is the authority.
  ffmpeg -y -v error "${INPUTS[@]}" \
    -filter_complex "$FILTER" \
    -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k -ar 48000 mixed-1080p.mp4
fi

# --- 4. downscale to 1280x720 + 40px letterbox ------------------------------
# A6 (EXACT-SOLUTION §10): 40 px black bars top + bottom, applied here in the
# stitch step so no video can ship without it: crop the central 640 rows,
# then pad back to 1280x720 with black bars.
ffmpeg -y -v error -i mixed-1080p.mp4 -vf scale=1280:720,crop=1280:640:0:40,pad=1280:720:0:40:black \
  -c:v libx264 -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"

# --- 5. verify ---------------------------------------------------------------
GOT_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
GOT_FRAMES=$(ffprobe -v error -show_entries stream=nb_frames -of csv=p=0 "$OUT" | head -1)
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
assert abs(dur - exp) < 0.5, f'duration mismatch: {dur} vs {exp}'  # 0.5s: audio tail padding adds ~0.17s over 976 frames
assert frames == total, f'frame mismatch: {frames} vs {total}'
print('STITCH OK: duration and frame count match')"
