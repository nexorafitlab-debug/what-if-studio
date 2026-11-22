import { E, V, registerShot, layer, ease } from '/engine/core.js';

registerShot('s018', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1, x: 0 };
  layer(g, cam, 1, (g) => {
    // Black screen with hook text: "What happens when you stop preventing..."
    g.save();
    g.globalAlpha = 1.0;
    g.fillStyle = '#000';
    g.fillRect(0, 0, E.W, E.H);
    g.restore();

    g.save();
    g.font = `600 ${V(48, 44)}px "Inter"`;
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('What happens when you', E.W / 2, E.H / 2 - V(30, 24));
    g.fillText('stop preventing...', E.W / 2, E.H / 2 + V(30, 24));
    g.restore();
  });
}});