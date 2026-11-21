// House Remotion components, built from MEASURED reference numbers.
// Source: EXACT-SOLUTION.md §3 (benchmark read-thoughts-40s-v2) + §4 Steps 6-7.
//   pill #0E0C1E, 0.88 opacity, coloured outline (red alarming / amber neutral),
//   white bold lowercase 30px text, tiny downward pointer, gap ~1/5 head diameter;
//   panel pop: backOut over 6 frames + ring (radius 30 + 9/frame for 14 frames)
//   + 3 sparkles, then gentle breathe;
//   EyeBeam: dotted amber, dasharray "12 8", 4px, 0.75 opacity, eye -> panel
//   bottom, ~0.7s visible;
//   Ring: trajectory rings for fast movement, centre-expanding ONLY for the
//   single scale/emotional payoff.
// All components are pure functions of their frame clock t (no Date.now,
// no Math.random). Coordinates are the 1920x1080 frame.

import React from 'react';
import { clamp, backOut } from '../anim';
import { Sparkle, FocusRings } from '../ui';
import { FONT } from '../fonts';

// ============================================================
// 1. NumberPill — the number above a character's head.
//    (x, y) = head-centre TOP point. Pill bottom sits a gap of ~1/5 head
//    diameter above it (gap = 0.4 * headR, since diameter = 2 * headR),
//    nearly touching the head. Text is lowercase, as passed in.
// ============================================================
export const NumberPill: React.FC<{
  x: number;
  y: number;
  text: string;
  tone?: 'alarming' | 'neutral';
  headR?: number;
  t?: number; // if given, pop in with backOut over 6 frames from t = 0
}> = ({ x, y, text, tone = 'neutral', headR = 50, t }) => {
  if (t !== undefined && t < 0) return null;
  const gap = 0.4 * headR;
  const fontSize = 30;
  const pillW = text.length * fontSize * 0.6 + 40;
  const pillH = 60;
  const pillX = x - pillW / 2;
  const pillY = y - gap - pillH;
  const strokeColor = tone === 'alarming' ? '#FF5A4A' : '#FFB347';
  const s = t === undefined ? 1 : backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${pillY + pillH / 2}) scale(${s}) translate(${-x} ${-(pillY + pillH / 2)})`}>
      <rect x={pillX} y={pillY} width={pillW} height={pillH} rx={30} fill="#0E0C1E" opacity={0.88} stroke={strokeColor} strokeWidth={2} />
      {/* tiny downward pointer at the pill's bottom centre */}
      <polygon points={`${x},${pillY + pillH + 8} ${x - 8},${pillY + pillH} ${x + 8},${pillY + pillH}`} fill={strokeColor} />
      <text x={x} y={pillY + pillH / 2 + 11} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={fontSize} fill="#FFFFFF">
        {text}
      </text>
    </g>
  );
};

// ============================================================
// 2. PanelPop — a panel that pops with overshoot + expanding ring +
//    3 sparkles, then a gentle breathe. The ring and sparkles live
//    OUTSIDE the scaled group so their geometry stays exact.
// ============================================================
export const PanelPop: React.FC<{
  x: number;
  y: number;
  t: number;
  children: React.ReactNode;
  tone?: 'alarming' | 'neutral';
}> = ({ x, y, t, children, tone = 'neutral' }) => {
  if (t < 0) return null;
  const pop = backOut(clamp(t / 6));
  const scale = t > 20 ? 1 + 0.02 * Math.sin(t / 10) : pop;
  const ringR = 30 + 9 * t;
  const ringAlpha = t < 14 ? 1 - t / 14 : 0;
  const ringColor = tone === 'alarming' ? '#FF5A4A' : '#FFB347';
  return (
    <g>
      {t < 14 ? <circle cx={x} cy={y} r={ringR} fill="none" stroke={ringColor} strokeWidth={3} opacity={ringAlpha} /> : null}
      {[0, 1, 2].map((i) => {
        const a = (i * 120 * Math.PI) / 180;
        return <Sparkle key={i} x={x + Math.cos(a) * 40} y={y + Math.sin(a) * 40} t={t} />;
      })}
      <g transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>{children}</g>
    </g>
  );
};

// ============================================================
// 3. Ring — gold rings. 'trajectory': 3-4 ellipses TRAVELLING along the
//    given path over ~14 frames, each staggered 3 frames, fading as they
//    go (for fast number movement). 'payoff': ONE centre-expanding ring,
//    radius 30 + 9/frame for 14 frames (ONLY for the single scale /
//    emotional payoff of a video).
// ============================================================
export const Ring: React.FC<{
  x: number;
  y: number;
  t: number;
  mode: 'trajectory' | 'payoff';
  path?: { x: number; y: number }[];
  color?: string;
}> = ({ x, y, t, mode, path, color = '#FFC94D' }) => {
  if (t < 0) return null;
  if (mode === 'payoff') {
    if (t >= 14) return null;
    return <circle cx={x} cy={y} r={30 + 9 * t} fill="none" stroke={color} strokeWidth={4} opacity={1 - t / 14} />;
  }
  if (!path || path.length < 2) return null;
  // Piecewise-linear point on the path at fraction q (0..1).
  const pointAt = (q: number) => {
    const n = path.length - 1;
    const f = clamp(q) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const r = f - i;
    return { x: path[i].x + (path[i + 1].x - path[i].x) * r, y: path[i].y + (path[i + 1].y - path[i].y) * r };
  };
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const q = (t - i * 3) / 14;
        if (q < 0 || q >= 1) return null;
        const p = pointAt(q);
        return <ellipse key={i} cx={p.x} cy={p.y} rx={20 + i * 8} ry={10 + i * 4} fill="none" stroke={color} strokeWidth={3} opacity={1 - q} />;
      })}
    </g>
  );
};

// ============================================================
// 4. EyeBeam — the CORRECTED dotted eye beam. A thin DOTTED amber line
//    from the hero's glowing eye (x1, y1) to the panel bottom (x2, y2):
//    stroke #FFAA00, 4px, 0.75 opacity, dasharray "12 8". Fades in over
//    5 frames when the panel pops, fades out after ~22 frames (~0.7 s
//    visible at 30 fps). NOT a solid arrow. The origin is the EYE —
//    never the walk-cycle floor position (the v3 S3 bug).
// ============================================================
export const EyeBeam: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t: number;
}> = ({ x1, y1, x2, y2, t }) => {
  if (t < 0 || t > 32) return null;
  const fadeIn = clamp(t / 5);
  const fadeOut = t > 22 ? 1 - (t - 22) / 10 : 1;
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFAA00" strokeWidth={4} strokeDasharray="12 8" opacity={0.75 * fadeIn * fadeOut} />
  );
};

// ============================================================
// 5. FreezeDiagram — the FREEZE science insert, staged in order.
//    Frame offsets from t = 0:
//      0-16   eye outline draws on (dashoffset draw-on over 16 frames)
//      16-26  EyeBeam from the hero's eye to the diagram (10 frames)
//      26+    NumberPill reading "hidden" (pops over 6 frames)
//      32+    labels "EYE CONTACT" / "THOUGHT APPEARS" (stay on)
//      38+    gold "FREEZE" banner + pulsing gold FocusRings on the hero
// ============================================================
export const FreezeDiagram: React.FC<{
  x: number;
  y: number;
  t: number;
  heroX: number;
  heroY: number;
}> = ({ x, y, t, heroX, heroY }) => {
  if (t < 0) return null;
  const eyeR = 60;
  const eyeC = 2 * Math.PI * eyeR; // circumference, for the draw-on
  const drawProgress = clamp(t / 16);
  return (
    <g>
      {/* eye outline draws on over 16 frames */}
      <circle
        cx={heroX}
        cy={heroY}
        r={eyeR}
        fill="none"
        stroke="#FFAA00"
        strokeWidth={4}
        strokeDasharray={`${eyeC} ${eyeC}`}
        strokeDashoffset={eyeC * (1 - drawProgress)}
      />
      {/* beam, frames 16-26 */}
      {t >= 16 ? <EyeBeam x1={heroX} y1={heroY} x2={x} y2={y} t={t - 16} /> : null}
      {/* "hidden" pill, from frame 26 */}
      {t >= 26 ? <NumberPill x={x} y={y - 100} text="hidden" tone="neutral" headR={50} t={t - 26} /> : null}
      {/* labels, from frame 32 — they stay on */}
      {t >= 32 ? (
        <g fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#FFFFFF">
          <text x={x} y={y + 120} textAnchor="middle">
            EYE CONTACT
          </text>
          <text x={x} y={y + 150} textAnchor="middle">
            THOUGHT APPEARS
          </text>
        </g>
      ) : null}
      {/* gold FREEZE banner + pulsing rings on the frozen hero, from frame 38 */}
      {t >= 38 ? <TextBanner x={x} y={y + 210} t={t - 38} text="FREEZE" color="#FFC94D" /> : null}
      {t >= 38 ? <FocusRings x={heroX} y={heroY} t={t - 38} r0={60} color="#FFC94D" /> : null}
    </g>
  );
};

// ============================================================
// 6. TextBanner — glowing gold ALL CAPS text arriving letter by
//    letter: each letter pops in with backOut over 4 frames, staggered
//    2 frames apart, laid out horizontally and centred on (x, y).
// ============================================================
export const TextBanner: React.FC<{
  x: number;
  y: number;
  t: number;
  text: string;
  color?: string;
  size?: number;
}> = ({ x, y, t, text, color = '#FFC94D', size = 72 }) => {
  if (t < 0) return null;
  const letters = text.toUpperCase().split('');
  const charW = size * 0.62;
  const totalW = letters.length * charW;
  const startX = x - totalW / 2;
  return (
    <g style={{ filter: 'drop-shadow(0 0 18px rgba(255,201,77,0.55))' }}>
      {letters.map((letter, i) => {
        const letterT = t - i * 2;
        if (letterT < 0) return null;
        const s = backOut(clamp(letterT / 4));
        return (
          <text
            key={i}
            x={startX + charW * (i + 0.5)}
            y={y}
            textAnchor="middle"
            fontFamily={FONT.title}
            fontWeight={800}
            fontSize={size * s}
            fill={color}
            stroke="#1A1230"
            strokeWidth={6}
            paintOrder="stroke"
          >
            {letter}
          </text>
        );
      })}
    </g>
  );
};
