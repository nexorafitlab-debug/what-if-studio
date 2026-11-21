import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, FocusRings, Glow,
  Pl2Gate, PL2GATE, Pl2Classroom, PL2CLASSROOM, Pl2Stairwell, PL2STAIRWELL,
  Pl2Corridor, PL2CORRIDOR, Pl2Cafeteria, PL2CAFETERIA, Pl2ArtRoom, PL2ARTROOM,
  Pl2Bedroom, PL2BEDROOM, PL2B_WINDOW, PL2B_DETECTOR,
  Pl2Bathroom, PL2BATHROOM, Pl2Street, PL2STREET,
  Detector, NightSky, Stars, Moon, stand, walkPose,
} from '../../engine';

/* PastLives1MinV2 — 'What If You Could See How Many Lives Everyone Has
   Lived?' (20 shots, 60.0s). REBUILT from scratch to the read-thoughts-40s-v2
   standard after the user rejected v1 (BGM inaudible, some SFX missing,
   long scenes, a hand rotating in a loop, no vector illustrations).
   - TEN places in 60s: 9 brand-new sets (gate, classroom, stairwell,
     corridor, cafeteria, art room, bedroom, bathroom, evening street)
     + the starry void. A new place every 1-2 shots.
   - NO shot longer than 4s (max 120f); most are 90f (3s).
   - MOTION RULE (the v1 hand-rotation fix): every Actor's keys move
     MONOTONICALLY to ONE pose and hold — no A->B->A oscillation, no
     looping limb motion. Walk cycles (walkPose) only while a character
     is actually walking. NO WallClock anywhere (its hand rotated
     continuously in v1). One purposeful action per shot, tied to the
     narration: walk, reach + tap, startle, point, lift, adjust, turn.
   - VFX + ILLUSTRATIONS: pill pop with overshoot + ring + sparkle +
     eye-beam (S8); FREEZE diagram (S14: detector -> beam -> pill);
     "12 LIVES" illustrated graphic with 12 life dots (S15); tick-down
     12 -> 11 big and clear (S18, the ONE slow push-in).
   - NITS FIXED: no sitting pose at all (S1 is a walk); S18/S19 keep
     Alex's head well inside the frame; window pills are BIG (S16 zoom
     1.25, walker scale 1.0, pill scale 1.0).
   - VOICE: v1 voiceover REUSED unchanged (Helio + Kokoro af_heart, 98
     words). Music stem rebuilt louder (~-44 dB mean); SFX rebuilt for
     the new shot timings with a sound on EVERY action + ambient tone.
   Style kept: black round heads, white dot eyes, thin stick limbs, flat
   coloured tops, thin light rim. Number pill rules (never break): small
   dark pill, coloured outline (gold for 12, soft white for the rest),
   nearly touching the head, tiny downward pointer, same number stays with
   the same person, Alex's own number is NEVER shown.
   Camera STATIC inside shots; the ONE slow push-in is S18 (tick-down).
   No blur16 filter anywhere. grain: false. */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const SOFT = '#E8E4DA';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

const ALEX: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D', 'bob');
const GREY: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const GREEN: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A');
const TEAL: Look = mkLook('#2A9D8F', '#1F7A70', '#E9C46A');
const PURPLE: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');
const REDTOP: Look = mkLook('#A83A3A', '#86302E', '#E9C46A');

const LOOKMAP: Record<string, Look> = {
  alex: ALEX, sam: SAM, grey: GREY, green: GREEN, teal: TEAL, purple: PURPLE, red: REDTOP,
};

type Key = { f: number; p: Parameters<typeof poseAt>[1][number]['p']; ease?: (t: number) => number };

/** A character moving through keyframed gestures over the shot clock.
    MOTION RULE: keys must be MONOTONIC — each limb moves to ONE pose and
    holds. Never alternate an angle (no A->B->A), so no limb ever loops. */
const Actor: React.FC<{
  look: string; x: number; y: number; scale: number; facing?: 1 | -1;
  keys: Key[]; exprs?: [number, Expr][]; t: number; glintFrom?: number;
}> = ({ look, x, y, scale, facing = 1, keys, exprs, t, glintFrom }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale, facing, headTilt: 0, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
    ...keys,
  ]);
  const faces: [number, Expr][] = exprs ?? [[0, 'neutral']];
  const glint = glintFrom !== undefined && t >= glintFrom ? 1 : 0;
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(t, faces), glint, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />;
};

/** Pill centre y for a character with hip y and scale: head top is
    hip - 238*scale; the pill hangs 10px below it, nearly touching. */
const pillY = (hipY: number, scale: number, s = 1) => hipY - 238 * scale - 10 - 26 * s;

/** The number pill: small dark pill, coloured outline, tiny downward
    pointer. Pops with overshoot + expanding ring + sparkle burst, then
    breathes. `tickTo`/`tickAt`: the number switches at tickAt with a
    pulse + ring (the tick-down). */
const NumberPill: React.FC<{
  x: number; y: number; num: string; t: number; from?: number;
  outline?: string; s?: number; tickTo?: string; tickAt?: number;
}> = ({ x, y, num, t, from = 0, outline = SOFT, s = 1, tickTo, tickAt }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const show = tickAt !== undefined && tickTo !== undefined && t >= tickAt ? tickTo : num;
  const pop = backOut(k);
  const breathe = 0.94 + 0.06 * Math.sin(t / 9);
  let pulse = 1;
  let tickRing = -1;
  if (tickAt !== undefined && t >= tickAt) {
    const dt = t - tickAt;
    if (dt < 14) pulse = 1 + 0.28 * Math.sin((dt / 14) * Math.PI);
    if (dt < 16) tickRing = dt;
  }
  const w = 34 + show.length * 30;
  const bt = t - from;
  const gold = outline === GOLD;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop) * breathe * pulse})`} opacity={1}>
      {bt >= 0 && bt < 14 ? (
        <g>
          <circle r={30 + bt * 9} fill="none" stroke={outline} strokeWidth={5} opacity={0.9 * (1 - bt / 14)} />
          <Sparkle x={-w / 2 - 26} y={-26} t={bt} s={0.8} />
          <Sparkle x={w / 2 + 26} y={-30} t={bt + 2} s={0.7} />
          <Sparkle x={0} y={-58} t={bt + 4} s={0.9} />
        </g>
      ) : null}
      {tickRing >= 0 ? (
        <circle r={34 + tickRing * 10} fill="none" stroke={GOLD} strokeWidth={6} opacity={0.9 * (1 - tickRing / 16)} />
      ) : null}
      <rect x={-w / 2 - 12} y={-34} width={w + 24} height={68} rx={34} fill={outline} opacity={0.16} />
      <rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill="#0E0C1E" opacity={0.94} stroke={outline} strokeWidth={3}
        style={gold ? { filter: 'drop-shadow(0 0 14px rgba(255,215,0,0.8))' } : { filter: `drop-shadow(0 0 10px ${outline})` }} />
      <polygon points="-9,22 9,22 0,36" fill="#0E0C1E" stroke={outline} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill={gold ? GOLD : '#FFFFFF'} textAnchor="middle"
        style={gold ? { filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9))' } : undefined}>
        {show}
      </text>
    </g>
  );
};

/** A small person seen through the bedroom window, walking past outside,
    with a pill above their head. Figure height ~200*s. */
const WinWalker: React.FC<{
  x: number; baseY: number; s: number; num: string; from: number; t: number;
  outline?: string; color?: string;
}> = ({ x, baseY, s, num, from, t, outline = SOFT, color = '#1E1C28' }) => {
  const headY = baseY - 170 * s;
  const bob = Math.sin(t / 4) * 2 * s;
  return (
    <g>
      <g transform={`translate(${x} ${baseY + bob}) scale(${s})`}>
        <ellipse cx={0} cy={2} rx={30} ry={6} fill="#000" opacity={0.3} />
        <path d="M -22 0 L -20 -118 Q 0 -132 20 -118 L 22 0 Z" fill={color} />
        <circle cx={0} cy={-152} r={20} fill={color} />
        <path d="M -20 -60 L -34 -20 M 20 -60 L 34 -24" stroke={color} strokeWidth={10} strokeLinecap="round" />
      </g>
      <NumberPill x={x} y={headY - 20 * s - 12 - 24} num={num} t={t} from={from} outline={outline} s={s} />
    </g>
  );
};

/** The detector worn on Alex's head: perched on top of the head like a
    cap, antenna up. `glow` fades it (S19: the detector powers down). */
const HeadDetector: React.FC<{ ax: number; hy: number; sc: number; t: number; glow?: number }> = ({ ax, hy, sc, t, glow = 1 }) => (
  <g>
    <Detector x={ax} y={hy - 250 * sc} s={0.8 * sc} t={t} glow={glow} />
    <Glow x={ax} y={hy - 250 * sc} r={90 * sc} o={0.35 * glow} />
  </g>
);

/** A line that draws itself on over `dur` frames (Freeze-diagram helper). */
const DrawLine: React.FC<{ d: string; t: number; dur?: number; color?: string; width?: number }> = ({ d, t, dur = 12, color = WHITE, width = 5 }) => {
  const k = clamp(t / dur);
  if (k <= 0) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - k)} />;
};

/* S1: school gate, wide — Alex WALKS in through the open gate (walk cycle,
   planted feet), two students ahead of him. The cold-open question runs. */
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = 480 + (t / Math.max(1, len)) * 900;
  const walk = walkPose(x, t * 0.55, 760, 0.9, {}, 1);
  const w1 = walkPose(300 + t * 7, t * 0.55, 760, 0.7, {}, 1);
  const w2 = walkPose(1650 - t * 6, t * 0.55, 760, 0.75, {}, -1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Gate t={t} />
      <Hero look={GREY} pose={{ ...w1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={TEAL} pose={{ ...w2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]) }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S2: classroom, medium — Alex stands by his desk and LOOKS UP, turning
   his head toward the camera. ONE action: the head turn (monotonic). */
const S2_ALEX = stand(PL2CLASSROOM, 0.5, 0.4);
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Pl2Classroom t={t} />
    <Actor look="alex" x={S2_ALEX.x} y={S2_ALEX.y} scale={S2_ALEX.scale} facing={1} t={t}
      keys={[
        { f: 25, p: { headTilt: -4, tilt: -2 } },
        { f: 55, p: { headTilt: 5, tilt: 2, armR: { a: 30, b: -10 } } },
      ]} />
  </g>
);

/* S3: stairwell, wide — Alex WALKS across the foot of the stairs (walk
   cycle, planted feet), passing the flight. */
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = 350 + (t / Math.max(1, len)) * 1050;
  const walk = walkPose(x, t * 0.55, 922, 1.3, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Stairwell t={t} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S4: corridor, medium — Alex WALKS toward Sam at her locker (walk cycle).
   Sam waits at the left, head down, still. */
const S4_SAM = stand(PL2CORRIDOR, 0.25, 0.3);
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1500 - (t / Math.max(1, len)) * 700;
  const walk = walkPose(x, t * 0.55, 922, 1.35, {}, -1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Corridor t={t} />
      <Actor look="sam" x={S4_SAM.x} y={S4_SAM.y} scale={S4_SAM.scale} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [50, 'happy']]) }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S5: corridor, medium close-up — Alex REACHES OUT and TAPS Sam's shoulder.
   ONE action: the arm extends monotonically (18 -> -70 -> -78) and holds. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.35)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={600} y={1010} scale={1.6} facing={1} t={t}
      keys={[
        { f: 30, p: { headTilt: 9 } },
      ]} />
    <Actor look="alex" x={1200} y={1010} scale={1.6} facing={-1} t={t}
      keys={[
        { f: 30, p: { armR: { a: -70, b: -8 }, handR: 'open', headTilt: -3, tilt: 3 }, ease: easeOut },
        { f: 60, p: { armR: { a: -78, b: -6 }, handR: 'open', headTilt: 2 } },
      ]} exprs={[[0, 'neutral'], [30, 'happy']]} />
  </g>
);

/* S6: corridor, close-up — Sam STARTLES and looks up. ONE action: the head
   snaps up (10 -> -6) and her arm rises once (20 -> -50). Monotonic. */
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: 10, armR: { a: 20, b: -20 }, armL: { a: 16, b: -16 } } },
        { f: 8, p: { headTilt: -6, armR: { a: -50, b: -20 }, armL: { a: -40, b: -16 }, tilt: -3 }, ease: easeOut },
        { f: 22, p: { headTilt: 2, armR: { a: -20, b: -10 }, tilt: 0 } },
      ]} exprs={[[0, 'neutral'], [8, 'shock']]} />
  </g>
);

/* S7: corridor, close-up — Sam: "Oh, hey. Thanks." Shock melts into a shy
   smile; she RAISES one hand in greeting (monotonic: -20 -> -60, holds). */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: -4, armR: { a: -20, b: -10 } } },
        { f: 20, p: { headTilt: 4, armR: { a: -110, b: -30 }, tilt: 2 } },
        { f: 42, p: { headTilt: -2, armR: { a: -110, b: -30 }, tilt: 0 } },
      ]} exprs={[[0, 'shock'], [12, 'happy']]} />
  </g>
);

/* S8: corridor, EXTREME CLOSE-UP on the "12" pill above Sam's head — the
   visual explanation shot. The gold pill POPS with overshoot + ring +
   sparkle burst at t=20, then glows and breathes. Sam nods once. */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: 4, tilt: 2 } },
        { f: 60, p: { headTilt: -2, tilt: 0 } },
      ]} exprs={[[0, 'happy'], [20, 'happy']]} />
    <NumberPill x={960} y={pillY(1020, 1.9, 1.4)} num="12" t={t} from={20} outline={GOLD} s={1.4} />
  </g>
);

/* S9: cafeteria, wide — other students walk past, pills popping above
   their heads (3, 7, 2, 9), one blank. Alex watches from the left,
   eye-glint on, head turning once to follow them. */
const S9_FLOOR35 = PL2CAFETERIA.P(0.5, 1, 0.35).y;
const S9_FLOOR40 = PL2CAFETERIA.P(0.5, 1, 0.4).y;
const S9_FLOOR50 = PL2CAFETERIA.P(0.5, 1, 0.5).y;
const S9_ALEX = stand(PL2CAFETERIA, 0.18, 0.42);
export const S9: React.FC<ShotProps> = ({ t }) => {
  const a = walkPose(200 + t * 12, t * 0.55, S9_FLOOR35, 0.8, {}, 1);
  const b = walkPose(1700 - t * 11, t * 0.55, S9_FLOOR40, 0.9, {}, -1);
  const c = walkPose(500 + t * 10, t * 0.55, S9_FLOOR50, 1.0, {}, 1);
  const d = walkPose(1400 - t * 9, t * 0.55, S9_FLOOR35, 0.7, {}, -1);
  const e = walkPose(900 + t * 8, t * 0.55, S9_FLOOR40, 0.85, {}, 1);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Pl2Cafeteria t={t} />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 0.9)} num="3" t={t} from={15} outline={SOFT} s={0.9} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 0.9)} num="7" t={t} from={30} outline={SOFT} s={0.9} />
      <Hero look={TEAL} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 1.0, 0.9)} num="2" t={t} from={45} outline={SOFT} s={0.9} />
      <Hero look={PURPLE} pose={{ ...d, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={d.x} y={pillY(d.y, 0.7, 0.9)} num="9" t={t} from={60} outline={SOFT} s={0.9} />
      <Hero look={GREY} pose={{ ...e, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Actor look="alex" x={S9_ALEX.x} y={S9_ALEX.y} scale={S9_ALEX.scale} facing={1} t={t} glintFrom={10}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 50, p: { headTilt: 4, tilt: 2, armR: { a: 40, b: -16 } } },
        ]} exprs={[[0, 'neutral'], [10, 'smug']]} />
    </g>
  );
};

/* S10: art room, medium — Alex WALKS past the easels (walk cycle); a
   student at an easel raises her brush once and her "7" pill pops at
   t=30; Alex's eye-glint fires. */
const S10_STU = stand(PL2ARTROOM, 0.68, 0.38);
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const x = 350 + (t / Math.max(1, len)) * 950;
  const walk = walkPose(x, t * 0.55, 922, 1.3, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2ArtRoom t={t} />
      <Actor look="purple" x={S10_STU.x} y={S10_STU.y} scale={S10_STU.scale} facing={-1} t={t}
        keys={[
          { f: 25, p: { armR: { a: -50, b: -20 }, headTilt: -4 } },
        ]} />
      <NumberPill x={S10_STU.x} y={pillY(S10_STU.y, S10_STU.scale, 0.9)} num="7" t={t} from={30} outline={SOFT} s={0.9} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]), glint: t >= 30 ? 1 : 0, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S11: bedroom, wide — the detector glows on the desk; Alex steps toward
   it and POINTS. ONE action: step + point (arm extends monotonically). */
const S11_ALEX = stand(PL2BEDROOM, 0.35, 0.4);
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <Pl2Bedroom t={t} />
    <Actor look="alex" x={S11_ALEX.x} y={S11_ALEX.y} scale={S11_ALEX.scale} facing={1} t={t}
      keys={[
        { f: 20, p: { x: S11_ALEX.x + 70, legL: { a: 18, b: -8 }, legR: { a: -16, b: -6 } } },
        { f: 50, p: { x: S11_ALEX.x + 110, armR: { a: 70, b: -10 }, handR: 'point', headTilt: -3, tilt: 3 } },
        { f: 85, p: { armR: { a: 30, b: -10 }, handR: 'open', headTilt: 3, tilt: 0 } },
      ]} exprs={[[0, 'neutral'], [50, 'happy']]} />
  </g>
);

/* S12: bedroom, medium — Alex picks up the detector, lifts it, places it
   on his head; the screen activates with a glow at t=80. ONE action: the
   arm rises once to place the detector, then lowers once to rest. */
const S12_ALEX = stand(PL2BEDROOM, 0.42, 0.4);
export const S12: React.FC<ShotProps> = ({ t }) => {
  const ax = S12_ALEX.x;
  const hy = S12_ALEX.y;
  const sc = S12_ALEX.scale;
  // detector travel: desk -> hand -> head
  const k1 = clamp((t - 20) / 35, 0, 1);
  const k2 = clamp((t - 55) / 25, 0, 1);
  const handX = ax + 90 * sc;
  const handY = hy - 150 * sc;
  const headX = ax + 55 * sc;
  const headY = hy - 205 * sc;
  const e1 = easeOut(k1);
  const e2 = easeOut(k2);
  const dx = PL2B_DETECTOR.x + (handX - PL2B_DETECTOR.x) * e1 + (headX - handX) * e2;
  const dy = PL2B_DETECTOR.y + (handY - PL2B_DETECTOR.y) * e1 + (headY - handY) * e2;
  const active = t >= 80;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Pl2Bedroom t={t} detectorOnDesk={t < 20} />
      <Actor look="alex" x={ax} y={hy} scale={sc} facing={1} t={t} glintFrom={active ? 80 : 9999}
        keys={[
          { f: 25, p: { armR: { a: -60, b: -8 }, headTilt: -3, tilt: 3 } },
          { f: 55, p: { armR: { a: -110, b: -30 }, headTilt: -5, tilt: 2 } },
          { f: 80, p: { armR: { a: -130, b: -60 }, headTilt: 3, tilt: 0 } },
          { f: 100, p: { armR: { a: -20, b: -10 }, headTilt: 0 } },
        ]} exprs={[[0, 'neutral'], [80, 'happy']]} />
      <Detector x={dx} y={dy} s={0.62 + (active ? 0.25 : 0)} t={t} glow={active ? 1 : 0.7} />
      {active ? <Glow x={dx} y={dy} r={140} o={0.5} /> : null}
    </g>
  );
};

/* S13: bathroom, medium — Alex at the mirror wearing the detector. ONE
   action: he raises one hand to adjust the detector (monotonic), then
   holds it. The mirror shows the detector's blue glow reflected. */
const S13_ALEX = stand(PL2BATHROOM, 0.32, 0.42);
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Pl2Bathroom t={t} />
    <Actor look="alex" x={S13_ALEX.x} y={S13_ALEX.y} scale={S13_ALEX.scale} facing={1} t={t} glintFrom={20}
      keys={[
        { f: 20, p: { armR: { a: -110, b: -40 }, headTilt: -4, tilt: 2 } },
        { f: 55, p: { armR: { a: -110, b: -40 }, headTilt: 4, tilt: 0 } },
        { f: 80, p: { armR: { a: -20, b: -10 }, headTilt: 0 } },
      ]} exprs={[[0, 'neutral'], [20, 'happy']]} />
    <HeadDetector ax={S13_ALEX.x} hy={S13_ALEX.y} sc={S13_ALEX.scale} t={t} />
  </g>
);

/* S14: FREEZE insert on the starry void — the detector -> beam -> pill
   diagram draws itself on: a big detector, a beam to a glowing "12" pill,
   the word LIVES. Alex stands FROZEN mid-gesture (one static pose, gold
   ring pulsing). The vector illustration that explains the power. */
export const S14: React.FC<ShotProps> = ({ t }) => {
  const dk = clamp(t / 10);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl2-void" horizonY={1080} />
      <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      {/* the diagram: detector -> beam -> pill */}
      <g opacity={dk}>
        <g transform={`translate(480 330) scale(${clamp(t / 12)})`}>
          <Detector x={0} y={0} s={1.6} t={t} glow={1} />
        </g>
        <DrawLine d="M 620 330 L 980 330" t={Math.max(0, t - 14)} dur={10} color="#7FD4FF" width={6} />
        <polygon points="980,306 1028,330 980,354" fill="#7FD4FF" opacity={clamp((t - 24) / 6)} />
        <g transform={`translate(1290 330) scale(${clamp((t - 24) / 8)})`} opacity={clamp((t - 24) / 8)}>
          <rect x={-150} y={-52} width={300} height={104} rx={52} fill="#0E0C1E" stroke={GOLD} strokeWidth={4} style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.8))' }} />
          <text x={0} y={14} fontFamily={FONT.title} fontWeight={700} fontSize={48} fill={GOLD} textAnchor="middle">12</text>
        </g>
        <g opacity={clamp((t - 34) / 8)}>
          <text x={480} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={WHITE} textAnchor="middle" letterSpacing={3}>DETECTOR</text>
          <text x={1290} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={GOLD} textAnchor="middle" letterSpacing={3}>LIVES APPEAR</text>
        </g>
      </g>
      {/* gold FREEZE banner */}
      <g opacity={clamp((t - 44) / 6)}>
        <rect x={810} y={120} width={300} height={64} rx={32} fill="#0E0C1E" stroke={GOLD} strokeWidth={3} />
        <text x={960} y={164} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill={GOLD} textAnchor="middle" letterSpacing={6}>FREEZE</text>
      </g>
      {/* Alex, frozen mid-reach, gold ring pulsing around him */}
      <Hero look={ALEX} pose={{ ...poseAt(0, [{ f: 0, p: { x: 960, y: 900, scale: 1.0, facing: 1, armR: { a: -70, b: -10 }, handR: 'point', headTilt: -4, tilt: 3 } }]), ...faceAt(0, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <FocusRings x={960} y={760} t={(t % 24)} r0={180} color={GOLD} />
    </g>
  );
};

/* S15: "12 LIVES" illustration on the starry void — the lives-counter
   graphic. A huge gold 12 pops in, twelve life dots light up one by one
   below it, "LIVES LIVED" underneath. Pure vector illustration, no
   characters — the idea made visible. */
export const S15: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp(t / 8));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl2-void2" horizonY={1080} />
      <Stars seed={117} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      <g transform={`translate(960 380) scale(${0.6 + 0.4 * pop})`} opacity={clamp(t / 6)}>
        <text x={0} y={0} fontFamily={FONT.title} fontWeight={700} fontSize={260} fill={GOLD} textAnchor="middle"
          style={{ filter: 'drop-shadow(0 0 34px rgba(255,215,0,0.85))' }}>
          12
        </text>
      </g>
      <text x={960} y={520} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={WHITE} textAnchor="middle" letterSpacing={10} opacity={clamp((t - 12) / 8)}>
        LIVES LIVED
      </text>
      {/* twelve life dots, lighting up one by one */}
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const lit = t >= 16 + i * 4;
          const x = 960 - 11 * 42 + i * 84;
          return (
            <g key={i}>
              <circle cx={x} cy={620} r={26} fill={lit ? GOLD : '#3A3446'} stroke={lit ? GOLD : '#5A5468'} strokeWidth={3}
                style={lit ? { filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' } : undefined} />
              {lit && t - (16 + i * 4) < 10 ? <Sparkle x={x} y={620} t={t - (16 + i * 4)} s={0.7} /> : null}
            </g>
          );
        })}
      </g>
      <text x={960} y={720} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill={WHITE} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 56) / 8)}>
        EACH DOT IS ONE LIFE
      </text>
    </g>
  );
};

/* S16: bedroom, medium — Alex at the window, head turning ONCE to follow
   each number outside. The people passing are BIG (scale 1.0) with BIG
   readable pills (scale 1.0) — the v1 small-pill nit, fixed. */
const S16_ALEX = stand(PL2BEDROOM, 0.45, 0.42);
export const S16: React.FC<ShotProps> = ({ t }) => {
  const wx = (off: number) => PL2B_WINDOW.x0 + 20 + ((t * 2.2 + off) % (PL2B_WINDOW.x1 - PL2B_WINDOW.x0 - 40));
  return (
    <g transform={camT(1000, 520, 1.25)}>
      <Pl2Bedroom t={t} detectorOnDesk={false} />
      <WinWalker x={wx(0)} baseY={PL2B_WINDOW.y1 - 8} s={1.0} num="3" from={8} t={t} color="#2A3A5A" />
      <WinWalker x={wx(130)} baseY={PL2B_WINDOW.y1 - 8} s={1.0} num="7" from={30} t={t} color="#3A2A4A" />
      <WinWalker x={wx(250)} baseY={PL2B_WINDOW.y1 - 8} s={1.0} num="9" from={55} t={t} color="#4A2A2A" />
      <WinWalker x={wx(330)} baseY={PL2B_WINDOW.y1 - 8} s={1.0} num="2" from={75} t={t} color="#2A4A3A" />
      <Actor look="alex" x={S16_ALEX.x} y={S16_ALEX.y} scale={S16_ALEX.scale} facing={1} t={t} glintFrom={8}
        keys={[
          { f: 25, p: { headTilt: -5, tilt: -2 } },
          { f: 60, p: { headTilt: 5, tilt: 2, armR: { a: 50, b: -10 }, handR: 'point' } },
        ]} exprs={[[0, 'happy'], [25, 'smug']]} />
      <HeadDetector ax={S16_ALEX.x} hy={S16_ALEX.y} sc={S16_ALEX.scale} t={t} />
    </g>
  );
};

/* S17: evening street, wide — people walk the sidewalk, pills above their
   heads (3, 7, 2, 9, and one gold 12). Alex watches from the left. */
const S17_ALEX = stand(PL2STREET, 0.28, 0.4);
export const S17: React.FC<ShotProps> = ({ t }) => {
  const a = walkPose(150 + t * 9, t * 0.55, 770, 0.8, {}, 1);
  const b = walkPose(700 + t * 7, t * 0.55, 770, 0.9, {}, 1);
  const c = walkPose(1050 + t * 7, t * 0.55, 770, 0.75, {}, 1);
  const d = walkPose(1400 + t * 5, t * 0.55, 770, 0.85, {}, 1);
  return (
    <g transform={camT(960, 540, 1.1)}>
      <Pl2Street t={t} />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 1.0)} num="3" t={t} from={15} outline={SOFT} s={1.0} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 1.0)} num="7" t={t} from={35} outline={SOFT} s={1.0} />
      <Hero look={TEAL} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 0.75, 1.0)} num="2" t={t} from={55} outline={SOFT} s={1.0} />
      <Hero look={REDTOP} pose={{ ...d, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={d.x} y={pillY(d.y, 0.85, 1.0)} num="12" t={t} from={75} outline={GOLD} s={1.0} />
      <Actor look="alex" x={S17_ALEX.x} y={S17_ALEX.y} scale={S17_ALEX.scale} facing={1} t={t} glintFrom={15}
        keys={[
          { f: 30, p: { headTilt: -4, tilt: -2 } },
          { f: 70, p: { headTilt: 4, tilt: 2, armR: { a: 40, b: -16 } } },
        ]} exprs={[[0, 'neutral'], [15, 'smug']]} />
    </g>
  );
};

/* S18: THE ONE slow push-in (1.45 -> 1.57) — close-up on a big gold pill
   above a stranger on the street: it TICKS down 12 -> 11 at t=65 with a
   pulse, a gold ring and a glow. Alex watches from the right — his head
   is WELL inside the frame (screen x ~1380 of 1920), NOT at the edge. */
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.45 * (1.0 + 0.08 * clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(760, 520, s)}>
      <Pl2Street t={t} />
      <Actor look="red" x={660} y={687} scale={0.95} facing={1} t={t}
        keys={[
          { f: 30, p: { headTilt: -4, tilt: -2 } },
          { f: 80, p: { headTilt: 3, tilt: 1 } },
        ]} />
      <NumberPill x={660} y={pillY(687, 0.95, 1.2)} num="12" t={t} from={6} outline={GOLD} s={1.2} tickTo="11" tickAt={65} />
      {t >= 65 && t < 81 ? <FocusRings x={660} y={pillY(687, 0.95, 1.2)} t={t - 65} r0={90} color={GOLD} /> : null}
      <Actor look="alex" x={1050} y={687} scale={0.95} facing={-1} t={t} glintFrom={65}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 65, p: { headTilt: 4, tilt: 2, armR: { a: -50, b: -10 }, handR: 'point' } },
        ]} exprs={[[0, 'neutral'], [65, 'shock'], [95, 'worried']]} />
      <HeadDetector ax={1050} hy={687} sc={0.95} t={t} />
    </g>
  );
};

/* S19: street, close-up — Alex worried as the detector glow fades.
   Centred framing: his head is dead centre, well inside the frame. */
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.45)}>
    <Pl2Street t={t} />
    <Actor look="alex" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: -4, tilt: -2 } },
        { f: 45, p: { headTilt: 3, tilt: 2 } },
      ]} exprs={[[0, 'shock'], [20, 'worried']]} />
    <HeadDetector ax={960} hy={1020} sc={1.9} t={t} glow={t >= 40 ? 0.25 : 1} />
  </g>
);

/* S20: title card on the starry void — gold glowing question, fits with
   margins, plus the comment CTA underneath. */
export const S20: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 8);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl2-end" horizonY={1080} />
      <Stars seed={141} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.85} />
      <Moon x={1700} y={180} r={54} />
      <g opacity={k}>
        <text x={960} y={400} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          WHAT IF YOU COULD SEE
        </text>
        <text x={960} y={490} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          HOW MANY LIVES EVERYONE
        </text>
        <text x={960} y={580} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          HAS LIVED?
        </text>
        <text x={960} y={760} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill={WHITE} textAnchor="middle" letterSpacing={5} opacity={clamp((t - 14) / 8)}>
          TELL ME IN THE COMMENTS
        </text>
      </g>
    </g>
  );
};
