// s020 — black screen: the title card. "What happens when you stop preventing..."
import { E, V, registerShot, layer } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { voidSet } from '../sets/void.js';
registerShot('s020', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  UI.titleCard(g, t, { lines: ['WHAT IF YOU COULD SEE', '10 SECONDS AHEAD?'], dur: info.dur, y: E.H * V(0.42, 0.4) });
} });
