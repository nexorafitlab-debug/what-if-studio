// s007 — "Exactly ten. Only your own future. Never off." Rule shot in the school hallway.
// Kian walks down the corridor; the other students each wear a gold number pill
// above their head, while Kian's pill shows a flickering '?' — he only sees his own
// future, exactly ten seconds ahead, never off.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text, rr, mood, backdrop, fillRect, seg, circle, veil, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { dust } from '/engine/fx2d.js';
import { CAST } from '../cast.js';

// Gold number pill above a head: dark pill, gold outline, gold number/text.
function pill(g, x, y, label, alphaV = 1) {
  const s = V(64, 72);
  g.save();
  g.globalAlpha = alphaV;
  const w = V(110, 120), h = V(64, 72);
  rr(g, x - w / 2, y - h / 2, w, h, h / 2);
  g.fillStyle = '#16131c'; g.fill();
  g.strokeStyle = '#f2c21a'; g.lineWidth = 4; g.stroke();
  text(g, label, x, y + 2, { size: s * 0.62, color: '#f2c21a', font: FONTS.ui, weight: 900 });
  g.restore();
}

registerShot('s007', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    // --- School hallway, drawn inline (lockers, doors, lights, EXIT sign) ---
    const m = mood('interiorCool');
    const GY = E.H * 0.82, CX = E.W / 2;
    backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
    fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
    fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
    // floor perspective lines
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 2;
    for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(CX + i * 60, GY); g.lineTo(CX + i * 260, E.H); g.stroke(); }
    for (let y = GY + 26; y < E.H; y += 34) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
    // lockers: left row + right row
    const locker = (x, y, w, h, col) => {
      rr(g, x, y, w, h, 6); g.fillStyle = col; g.fill();
      g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
      for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x + (w * i) / 4, y + 8); g.lineTo(x + (w * i) / 4, y + h - 8); g.stroke(); }
    };
    locker(30, 130, 330, GY - 130, '#3a4a6a');
    locker(E.W - 360, 130, 330, GY - 130, '#3a5a5a');
    // classroom doors
    rr(g, E.W * 0.24, 210, 150, GY - 210, 6); g.fillStyle = '#5a3a2a'; g.fill();
    circle(g, E.W * 0.24 + 122, 560, 9, '#ffd59a');
    rr(g, E.W * 0.68, 210, 150, GY - 210, 6); g.fillStyle = '#5a3a2a'; g.fill();
    circle(g, E.W * 0.68 + 28, 560, 9, '#ffd59a');
    // ceiling lights
    for (const x of [E.W * 0.3, E.W * 0.5, E.W * 0.7]) {
      rr(g, x - 90, 26, 180, 26, 12); g.fillStyle = '#e8ecff'; g.fill();
    }
    // exit sign at the far end
    rr(g, CX - 60, 96, 120, 44, 6); g.fillStyle = '#1a2a1a'; g.fill();
    text(g, 'EXIT', CX, 130, { size: 30, color: '#7ac74a', font: FONTS.ui, weight: 900 });
    dust(g, t, { count: 16, seed: 22 });
    veil(g, '#000', 0.06);

    const rim = { color: m.rim, dir: [-1, -1], w: 4 };
    // --- Background students standing by the lockers, each with a gold number pill ---
    const st1 = { x: E.W * 0.16, y: GY, s: V(1.05, 1.15), facing: 1, outfit: { top: 'hoodie', color: '#3a7ae0', legs: '#1c1c28' }, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim };
    drawFigure(g, st1);
    pill(g, st1.x, GY - V(210, 230), '7');
    const st2 = { x: E.W * 0.84, y: GY, s: V(1.05, 1.15), facing: -1, outfit: { top: 'hoodie', color: '#e07856', legs: '#1c1c28' }, pose: breathe(POSES.stand, t, 1, 4), expr: 'neutral', rim };
    drawFigure(g, st2);
    pill(g, st2.x, GY - V(210, 230), '12');

    // --- Kian walks down the corridor (left to right), his pill flickers '?' ---
    const lx = E.W * 0.32 + (t / dur) * E.W * 0.36;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // '?' pill flickers: on/off fast, so it reads as unstable / unknown
    const flick = 0.55 + 0.45 * Math.sin(t * 14);
    const popIn = clamp(prog(t, 0.25, 0.55));
    pill(g, lx, GY - V(230, 250), '?', popIn * flick);
  });
  // --- Rule text on screen ---
  const a1 = clamp(prog(t, 0.3, 0.7)), a2 = clamp(prog(t, 1.1, 1.5));
  text(g, 'EXACTLY TEN.', E.W / 2, E.H * 0.22, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'NEVER OFF.', E.W / 2, E.H * 0.36, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
} });
