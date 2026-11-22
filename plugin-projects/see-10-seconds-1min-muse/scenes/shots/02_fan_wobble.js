// s002 — "Three seconds later — it wobbles." Fan close-up, wobble grows.
import { E, V, registerShot, layer, prog, shake } from '/engine/core.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
registerShot('s002', { draw(g, t, info) {
  const wob = prog(t, 1.6, 2.1);
  const sh = wob > 0 ? shake(t, 6 * wob, 5, 3) : [0, 0];
  const cam = { z: 1.9, x: -115 + sh[0], y: -420 + sh[1] };
  layer(g, cam, 1, (g) => {
    bedroomDawn(g, t, info, { fanSpeed: 2.2 + wob * 1.4, wobble: 4 + wob * 14 });
  });
} });
