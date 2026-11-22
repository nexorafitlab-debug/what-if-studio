import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { bigLine } from '/engine/ui2d.js';

registerShot('s019', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1, x: 0 };
  layer(g, cam, 1, (g) => {
    g.save();
    g.globalAlpha = 1.0;
    g.fillStyle = '#000';
    g.fillRect(0, 0, E.W, E.H);
    g.restore();

    bigLine(g, t, { str: 'and start choosing?', dur, y: E.H / 2 });
  });
}});