import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  Cafe, Study, Rooftop, TitleCard, camT, ShotProps, Mug,
  Park, Bus, Street, Classroom, LivingRoom, Stairwell, Schematic,
  DrawOn, Arrow, SchLabel, stand, PARK, STREET, BUS, CLS, LIVINGROOM, walkPose,
} from '../../engine';

/* ReadThoughts40s — 'What If You Could Read Anyone's Thoughts?' (17 shots, 40s sample).
   The signature visual is the THOUGHT PANEL: a soft glowing amber panel that
   pops in above a person's head the moment eye contact is made, with the one
   word they are consciously hiding. It is a real SVG graphic — a translucent
   dark pill, amber outline and glow, white bold word, tiny downward pointer —
   sitting ~1/6 head diameter above the head top (the Ifinite counter rule).
   NEVER above the hero's own head. "fire me" and "don't tell him" get a red
   outline: they are threats/secrets, and red is the genre's urgency colour.
   Camera STATIC inside shots (except the walk in S8, which is a character
   walking, not a camera move). grain: false in index.tsx.
   Ten environments across 17 shots — the classroom is never the whole video. */

const BLACK = '#0D0D12';
const AMBER = '#FFAA00';
const RED = '#FF3344';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

/* Black round heads, white dot eyes, thin stick limbs, flat coloured tops. */
const HERO: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const STRANGER: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const BOSS: Look = mkLook('#2B2F3A', '#20232C', '#A8323E', 'suit', '#14151A');
const FRIEND: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D');
const DRIVER: Look = mkLook('#3E5A7A', '#2E4258', '#8A9AC0');
const TEACHER: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');
const MOM: Look = mkLook('#2A9D8F', '#1F7A70', '#E9C46A', 'bob');

const LOOKMAP: Record<string, Look> = {
  hero: HERO, stranger: STRANGER, boss: BOSS,
  friend: FRIEND, driver: DRIVER, teacher: TEACHER, mom: MOM,
};

/**
 * The thought panel. Pops in with an overshoot at `from` (the frame eye
 * contact is made), then breathes gently. `flicker` makes it stutter like
 * an unstable hologram (the close-ups). A real graphic — never text.
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

/** Panel anchor for a stand() position: ~1/6 head diameter above the head top. */
const panelY = (p: { y: number; scale: number }) => p.y - 295 * p.scale;

/* S1: cafe, medium — Pip at the counter, a stranger across from him.
   The amber 'hungry' panel pops in at t=46, when 'their thought' is spoken. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Cafe t={t} id="rt40-1" veil={0.4} />
    <CharLive look="hero" x={600} y={740} scale={1.0} facing={1} expr="neutral" t={t} />
    <CharLive look="stranger" x={1280} y={740} scale={1.0} facing={-1} expr="neutral" t={t} />
    <Mug x={940} y={700} rot={0} f={t} />
    <ThoughtPanel x={1280} y={740 - 295} word="hungry" t={t} from={46} outline={AMBER} s={1.0} />
  </g>
);

/* S2: study (the office), medium wide — Pip at the desk, the boss across.
   The red 'fire me' panel pops in at t=40, when 'their thought' is spoken.
   The boss's smirk arrives with it. */
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <Study t={t} id="rt40-2" veil={0.44} />
    <CharLive look="hero" x={580} y={740} scale={1.0} facing={1} expr="neutral" t={t} />
    <CharLive look="boss" x={1320} y={740} scale={1.05} facing={-1} expr="neutral" exprs={[[0, 'neutral'], [40, 'smug']]} t={t} />
    <ThoughtPanel x={1320} y={740 - 295 * 1.05} word="fire me" t={t} from={40} outline={RED} s={1.1} />
  </g>
);

/* S3: study, extreme close-up — the boss's face fills the frame and the
   'fire me' panel flickers like a bad hologram; his gaze shifts away. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <Study t={t} id="rt40-3" veil={0.44} />
    </g>
    <CharLive look="boss" x={960} y={1020} scale={1.9} facing={1} expr="neutral" exprs={[[0, 'neutral'], [18, 'worried']]} t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="fire me" t={t} from={0} outline={RED} s={1.4} flicker />
  </g>
);

/* S4: park, medium — Pip on the path, his best friend across from him.
   The amber 'coffee' panel pops in at t=56, when 'their thought' is spoken. */
const S4_HERO = stand(PARK, 0.32, 0.4);
const S4_FRIEND = stand(PARK, 0.62, 0.4);
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Park t={t} />
    <CharLive look="hero" x={S4_HERO.x} y={S4_HERO.y} scale={S4_HERO.scale} facing={1} expr="neutral" t={t} />
    <CharLive look="friend" x={S4_FRIEND.x} y={S4_FRIEND.y} scale={S4_FRIEND.scale} facing={-1} expr="neutral" t={t} />
    <ThoughtPanel x={S4_FRIEND.x} y={panelY(S4_FRIEND)} word="coffee" t={t} from={56} outline={AMBER} s={S4_FRIEND.scale} />
  </g>
);

/* S5: park, close-up — the friend's face; the 'coffee' panel flickers; he grins. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <Park t={t} />
    </g>
    <CharLive look="friend" x={960} y={1020} scale={1.9} facing={1} expr="neutral" exprs={[[0, 'neutral'], [12, 'happy']]} t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="coffee" t={t} from={0} outline={AMBER} s={1.4} flicker />
  </g>
);

/* S6: bus, medium — Pip standing in the aisle, the driver up front.
   The amber 'five more minutes' panel pops in at t=57. */
const S6_HERO = stand(BUS, 0.55, 0.5);
const S6_DRIVER = stand(BUS, 0.25, 0.35);
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bus t={t} id="rt40-6" veil={0.5} />
    <CharLive look="hero" x={S6_HERO.x} y={S6_HERO.y} scale={S6_HERO.scale} facing={-1} expr="neutral" t={t} />
    <CharLive look="driver" x={S6_DRIVER.x} y={S6_DRIVER.y} scale={S6_DRIVER.scale} facing={1} expr="tired" t={t} />
    <ThoughtPanel x={S6_DRIVER.x} y={panelY(S6_DRIVER)} word="five more minutes" t={t} from={57} outline={AMBER} s={Math.max(0.55, S6_DRIVER.scale)} />
  </g>
);

/* S7: bus, close-up — the driver's tired face; the panel flickers. */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <Bus t={t} id="rt40-7" veil={0.5} />
    </g>
    <CharLive look="driver" x={960} y={1020} scale={1.9} facing={1} expr="tired" t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="five more minutes" t={t} from={0} outline={AMBER} s={1.1} flicker />
  </g>
);

/* S8: street, wide — Pip walks the evening street; distant figures each
   wear a tiny amber thought panel. Real walking motion (walkPose). */
const S8_D1 = stand(STREET, 0.72, 0.22);
const S8_D2 = stand(STREET, 0.2, 0.18);
export const S8: React.FC<ShotProps> = ({ t }) => {
  const walk = walkPose(880, t * 0.6, 820, 1.0, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Hero look={HERO} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [15, 'smug']]) }} shadow={0} rimId="rimR" />
      <Char look="stranger" x={S8_D1.x} y={S8_D1.y} scale={S8_D1.scale} facing={-1} expr="neutral" />
      <ThoughtPanel x={S8_D1.x} y={panelY(S8_D1)} word="late" t={t} from={8} outline={AMBER} s={Math.max(0.4, S8_D1.scale)} dim />
      <Char look="stranger" x={S8_D2.x} y={S8_D2.y} scale={S8_D2.scale} facing={1} expr="neutral" />
      <ThoughtPanel x={S8_D2.x} y={panelY(S8_D2)} word="hungry" t={t} from={8} outline={AMBER} s={Math.max(0.4, S8_D2.scale)} dim />
    </g>
  );
};

/* S9: street, medium — Pip's face, smug and happy; he looks around. */
const S9_HERO = stand(STREET, 0.5, 0.45);
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.1)}>
    <Street t={t} />
    <CharLive look="hero" x={S9_HERO.x} y={S9_HERO.y} scale={S9_HERO.scale} facing={1} expr="smug" t={t} />
  </g>
);

/* S10: classroom, medium — Pip in class, the teacher at the front.
   The amber "don't ask me" panel pops in at t=46. */
const S10_TEACHER = stand(CLS, 0.3, 0.35);
const S10_HERO = stand(CLS, 0.65, 0.45);
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Classroom t={t} id="rt40-10" />
    <CharLive look="hero" x={S10_HERO.x} y={S10_HERO.y} scale={S10_HERO.scale} facing={-1} expr="neutral" t={t} />
    <CharLive look="teacher" x={S10_TEACHER.x} y={S10_TEACHER.y} scale={S10_TEACHER.scale} facing={1} expr="neutral" t={t} />
    <ThoughtPanel x={S10_TEACHER.x} y={panelY(S10_TEACHER)} word="don't ask me" t={t} from={46} outline={AMBER} s={Math.max(0.7, S10_TEACHER.scale)} />
  </g>
);

/* S11: classroom, close-up — the teacher's face; the panel flickers; she looks away. */
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <Classroom t={t} id="rt40-11" />
    </g>
    <CharLive look="teacher" x={960} y={1020} scale={1.9} facing={1} expr="neutral" exprs={[[0, 'neutral'], [18, 'worried']]} t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="don't ask me" t={t} from={0} outline={AMBER} s={1.2} flicker />
  </g>
);

/* S12: rooftop, title wide — Pip on the roof at dusk, the premise over the
   city, and a distant figure with a tiny amber panel of their own. */
export const S12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />
    <Char look="hero" x={680} y={790} scale={1.0} facing={1} expr="happy" />
    <Char look="stranger" x={1420} y={790} scale={0.85} facing={-1} expr="neutral" />
    <ThoughtPanel x={1420} y={790 - 295 * 0.85} word="late" t={t} from={8} outline={AMBER} s={0.7} dim />
    <TitleCard t={t} lines={['WHAT IF YOU COULD READ', "ANYONE'S THOUGHTS?"]} accent="THOUGHTS" y={430} size={72} />
  </g>
);

/* S13: schematic, medium — Pip alone on the dark blueprint; the catch lands;
   a diagram draws on: a head, an arrow, the word HIDDEN. */
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Schematic t={t} id="rt40-13" />
    <DrawOn d="M 530 330 a 90 90 0 1 0 180 0 a 90 90 0 1 0 -180 0" t={t} dur={14} color={WHITE} width={5} />
    <Arrow x0={730} y0={330} x1={1050} y1={330} t={t} dur={10} color={AMBER} />
    <SchLabel x={1230} y={345} t={t} text="HIDDEN" size={52} color={AMBER} />
    <SchLabel x={620} y={540} t={t} text="EVERYONE HIDES" size={36} color={WHITE} />
    <CharLive look="hero" x={960} y={900} scale={1.0} facing={1} expr="worried" t={t} />
  </g>
);

/* S14: stairwell, medium — Pip climbs the stairs; the rule sinks in. */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Stairwell t={t} id="rt40-14" />
    <CharLive look="hero" x={900} y={730} scale={1.0} facing={1} expr="worried" t={t} />
  </g>
);

/* S15: livingroom, medium — Pip turns at home; Mom stands in the doorway.
   The red "don't tell him" panel pops in at t=31, and Pip's face turns to shock. */
const S15_HERO = stand(LIVINGROOM, 0.35, 0.4);
const S15_MOM = stand(LIVINGROOM, 0.68, 0.4);
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <LivingRoom t={t} id="rt40-15" veil={0.5} />
    <CharLive look="hero" x={S15_HERO.x} y={S15_HERO.y} scale={S15_HERO.scale} facing={1} expr="neutral" exprs={[[0, 'neutral'], [31, 'shock']]} t={t} />
    <CharLive look="mom" x={S15_MOM.x} y={S15_MOM.y} scale={S15_MOM.scale} facing={-1} expr="happy" t={t} />
    <ThoughtPanel x={S15_MOM.x} y={panelY(S15_MOM)} word="don't tell him" t={t} from={31} outline={RED} s={Math.max(0.7, S15_MOM.scale)} />
  </g>
);

/* S16: livingroom, close-up — Mom's smiling face; the red panel flickers. */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <g filter="url(#blur16)">
      <LivingRoom t={t} id="rt40-16" veil={0.5} />
    </g>
    <CharLive look="mom" x={960} y={1020} scale={1.9} facing={1} expr="happy" t={t} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="don't tell him" t={t} from={0} outline={RED} s={1.2} flicker />
  </g>
);

/* S17: schematic, end card — gold PART ONE on the dark blueprint. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Schematic t={t} id="rt40-17" />
    <text x={960} y={470} fontFamily={FONT.title} fontWeight={700} fontSize={110} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 24px rgba(255,200,69,0.6))' }}>
      PART ONE
    </text>
    <text x={960} y={560} fontFamily={FONT.title} fontWeight={600} fontSize={44} fill={WHITE} textAnchor="middle" letterSpacing={4}>
      WHAT IS SHE HIDING?
    </text>
  </g>
);
