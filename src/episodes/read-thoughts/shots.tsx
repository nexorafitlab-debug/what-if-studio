import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  Cafe, Study, Rooftop, TitleCard, camT, ShotProps, Mug,
} from '../../engine';

/* ReadThoughts — 'What If You Could Read Anyone's Thoughts?' (4 shots, 10s sample).
   The signature visual is the THOUGHT PANEL: a soft glowing amber panel that
   pops in above a person's head the moment eye contact is made, with the one
   word they are consciously hiding. It is a real SVG graphic — a translucent
   dark pill, amber outline and glow, white bold word, tiny downward pointer —
   sitting ~1/6 head diameter above the head top (the Ifinite counter rule).
   NEVER above the hero's own head. "fire me" gets a red outline: it is a
   threat, and red is the genre's urgency colour.
   Camera STATIC inside shots. grain: false in index.tsx. */

const BLACK = '#0D0D12';
const AMBER = '#FFAA00';
const RED = '#FF3344';
const WHITE = '#F6EFE3';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

/* Black round heads, white dot eyes, thin stick limbs, flat coloured tops. */
const HERO: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const STRANGER: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const BOSS: Look = mkLook('#2B2F3A', '#20232C', '#A8323E', 'suit', '#14151A');

const LOOKMAP: Record<string, Look> = { hero: HERO, stranger: STRANGER, boss: BOSS };

/**
 * The thought panel. Pops in with an overshoot at `from` (the frame eye
 * contact is made), then breathes gently. `flicker` makes it stutter like
 * an unstable hologram (the S3 close-up). A real graphic — never text.
 */
const ThoughtPanel: React.FC<{
  x: number; y: number; word: string; t: number; from?: number;
  outline?: string; s?: number; flicker?: boolean; dim?: boolean;
}> = ({ x, y, word, t, from = 0, outline = AMBER, s = 1, flicker = false, dim = false }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  const breathe = 0.92 + 0.08 * Math.sin(t / 9);
  const fl = flicker ? 0.55 + 0.45 * Math.abs(Math.sin(t / 2.5)) : 1;
  const o = breathe * fl * (dim ? 0.6 : 1);
  const w = 40 + word.length * 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop)})`} opacity={o}>
      <rect x={-w / 2 - 14} y={-38} width={w + 28} height={76} rx={38} fill={outline} opacity={0.16} />
      <rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill="#0E0C1E" opacity={0.88} stroke={outline} strokeWidth={3} style={{ filter: `drop-shadow(0 0 14px ${outline})` }} />
      <polygon points="-10,22 10,22 0,36" fill="#0E0C1E" stroke={outline} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {word}
      </text>
    </g>
  );
};

/** A character standing still with a little life: a slow head tilt and arm drift. */
const Char: React.FC<{
  look: string; x: number; y: number; scale: number; facing?: 1 | -1;
  expr?: Expr; exprs?: [number, Expr][];
}> = ({ look, x, y, scale, facing = 1, expr = 'neutral', exprs }) => {
  const pose = poseAt(0, [
    { f: 0, p: { x, y, scale, facing, headTilt: 0, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
  ]);
  const faces: [number, Expr][] = exprs ?? [[0, expr]];
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(0, faces) }} shadow={0} rimId="rimR" />;
};

/** A character whose head tilts and arms drift over the shot clock (used where the shot holds). */
const CharLive: React.FC<{
  look: string; x: number; y: number; scale: number; facing?: 1 | -1;
  expr?: Expr; exprs?: [number, Expr][]; t: number;
}> = ({ look, x, y, scale, facing = 1, expr = 'neutral', exprs, t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale, facing, headTilt: 0, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
    { f: 30, p: { headTilt: 3, armR: { a: 26, b: -8 } }, ease: easeOut },
    { f: 60, p: { headTilt: 0, armR: { a: 18, b: -10 } } },
  ]);
  const faces: [number, Expr][] = exprs ?? [[0, expr]];
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(t, faces) }} shadow={0} rimId="rimR" />;
};

/* S1: cafe, medium — Pip at the counter, a stranger across from him.
   The amber 'hungry' panel pops in at t=46, when 'their thought' is spoken. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Cafe t={t} id="rt1" veil={0.4} />
    <CharLive look="hero" x={600} y={740} scale={1.0} facing={1} expr="neutral" t={t} />
    <CharLive look="stranger" x={1280} y={740} scale={1.0} facing={-1} expr="neutral" t={t} />
    <Mug x={940} y={700} rot={0} f={t} />
    <ThoughtPanel x={1280} y={740 - 295} word="hungry" t={t} from={46} outline={AMBER} s={1.0} />
  </g>
);

/* S2: study (the office), medium wide — Pip at the desk, the boss across.
   The red 'fire me' panel pops in at t=45, when 'their thought' is spoken.
   The boss's smirk arrives with it. */
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <Study t={t} id="rt2" veil={0.44} />
    <CharLive look="hero" x={580} y={740} scale={1.0} facing={1} expr="neutral" t={t} />
    <CharLive look="boss" x={1320} y={740} scale={1.05} facing={-1} expr="neutral" exprs={[[0, 'neutral'], [45, 'smug']]} t={t} />
    <ThoughtPanel x={1320} y={740 - 295 * 1.05} word="fire me" t={t} from={45} outline={RED} s={1.1} />
  </g>
);

/* S3: study, extreme close-up — the boss's face fills the frame and the
   'fire me' panel flickers like a bad hologram; his gaze shifts away. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <Study t={t} id="rt3" veil={0.44} />
    </g>
    <CharLive look="boss" x={960} y={1020} scale={1.9} facing={1} expr="neutral" exprs={[[0, 'neutral'], [18, 'worried']]} t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="fire me" t={t} from={0} outline={RED} s={1.4} flicker />
  </g>
);

/* S4: rooftop, title wide — Pip on the roof at dusk, the premise over the
   city, and a distant figure with a tiny amber panel of their own. */
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />
    <Char look="hero" x={680} y={790} scale={1.0} facing={1} expr="happy" />
    <Char look="stranger" x={1420} y={790} scale={0.85} facing={-1} expr="neutral" />
    <ThoughtPanel x={1420} y={790 - 295 * 0.85} word="late" t={t} from={8} outline={AMBER} s={0.7} dim />
    <TitleCard t={t} lines={['WHAT IF YOU COULD READ', "ANYONE'S THOUGHTS?"]} accent="THOUGHTS" y={430} size={72} />
  </g>
);
