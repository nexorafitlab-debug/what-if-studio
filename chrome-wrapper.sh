#!/bin/bash
# Wrapper so headless Chrome runs as root: Chrome refuses to run as root
# without --no-sandbox, and Remotion does not pass it. We add it here.
exec /home/hatch/.cache/hyperframes/chrome/chrome-headless-shell/linux-158.0.8127.36/chrome-headless-shell-linux64/chrome-headless-shell --no-sandbox --disable-gpu --disable-dev-shm-usage "$@"
