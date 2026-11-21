import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  TitleCard, camT, ShotProps, Mug, Sparkle, FocusRings,
  Library, LIBRARY, Lobby, LOBBY, Market, MARKET, Taxi, TAXI,
  Gallery, GALLERY, Train, TRAIN, Hallway, HALLWAY, Garden, GARDEN,
  Gym, GYM, Laundromat, LAUNDROMAT, NightSky, Stars, Moon,
  stand, walkPose,
} from '../../engine';

/* ReadThoughts40sV2 — 'What If You Could Read Anyone's Thoughts?' (17 shots, ~39s).
   REBUILT from scratch per the user's five fixes:
   1. TEN brand-new sets drawn fresh (library, lobby, market, taxi, gallery,
      train, hallway, garden, gym, laundromat) + a starry void — NONE of the
      studio's 22 old sets is used. Every shot is a different place.
   2. MOVEMENT in every shot: walk cycles, pointing, reaching, head turns,
      leaning, rubbing eyes, chopping hands, sipping — poseAt keyframes on
      every character, tied to the narration. Camera STATIC inside shots
      (one slow push-in only, S12 title).
   3. STRONGER VFX: panels pop with an overshoot + expanding gold ring +
      sparkle burst + eye-beam from the hero + eye-glint when the power
      fires; Freeze insert (S13) is a real diagram effect; starburst on the
      Mom shock (S16).
   4. VISUAL EXPLANATION: S13 eye -> beam -> panel diagram (Freeze), S14
      said-vs-thought split, plus a beam line on every panel reveal.
   5. NEW VOICE: Muse TTS Helio (avocado_v2:MAI_03), 5 short chunks,
      whisper-verified 103/103 words.
   Style kept: black round heads, white dot eyes, thin stick limbs, flat
   coloured tops, thin light rim. Panels amber (neutral) / red (hidden).
   No subtitles. No blur16 filter anywhere (the tiling suspect) — close-ups
   zoom the set instead. grain: false in index.tsx. */

const BLACK = '#0D0D12';
const AMBER = '#FFAA00';
const RED = '#FF3344';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

const HERO: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const STRANGER: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const BOSS: Look = mkLook('#2B2F3A', '#20232C', '#A8323E', 'suit', '#14151A');
const FRIEND: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D');
const DRIVER: Look = mkLook('#3E5A7A', '#2E4258', '#8A9AC0');
const TEACHER: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');
const MOM: Look = mkLook('#2A9D8F', '#1F7A70', '#E9C46A', 'bob');
const GOER1: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A');
const GOER2: Look = mkLook('#8A3A4A', '#6A2C38', '#E9C46A');

const LOOKMAP: Record<string, Look> = {
  hero: HERO, stranger: STRANGER, boss: BOSS, friend: FRIEND,
  driver: DRIVER, teacher: TEACHER, mom: MOM, goer1: GOER1, goer2: GOER2,
};

type Key = { f: number; p: Parameters<typeof poseAt>[1][number]['p']; ease?: (t: number) => number };

/** A character moving through keyframed gestures over the shot clock. */
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
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(t, faces), glint, glintColor: '#FFAA00' }} shadow={0} rimId="rimR" />;
};

/** The thought panel, upgraded: overshoot pop + expanding ring + sparkle
    burst on arrival, then a gentle breathe. Red outline = hidden/dangerous. */
const ThoughtPanel: React.FC<{
  x: number; y: number; word: string; t: number; from?: number;
  outline?: string; s?: number; flicker?: boolean; dim?: boolean; burst?: boolean;
}> = ({ x, y, word, t, from = 0, outline = AMBER, s = 1, flicker = false, dim = false, burst = true }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  const breathe = 0.92 + 0.08 * Math.sin(t / 9);
  const fl = flicker ? 0.55 + 0.45 * Math.abs(Math.sin(t / 2.5)) : 1;
  const o = breathe * fl * (dim ? 0.6 : 1);
  const w = 40 + word.length * 24;
  const bt = t - from;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop)})`} opacity={o}>
      {burst && bt >= 0 && bt < 14 ? (
        <g>
          <circle r={30 + bt * 9} fill="none" stroke={outline} strokeWidth={5} opacity={0.9 * (1 - bt / 14)} />
          <Sparkle x={-w / 2 - 30} y={-30} t={bt} s={0.8} />
          <Sparkle x={w / 2 + 30} y={-34} t={bt + 2} s={0.7} />
          <Sparkle x={0} y={-64} t={bt + 4} s={0.9} />
        </g>
      ) : null}
      <rect x={-w / 2 - 14} y={-38} width={w + 28} height={76} rx={38} fill={outline} opacity={0.16} />
      <rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill="#0E0C1E" opacity={0.88} stroke={outline} strokeWidth={3} style={{ filter: `drop-shadow(0 0 14px ${outline})` }} />
      <polygon points="-10,22 10,22 0,36" fill="#0E0C1E" stroke={outline} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {word}
      </text>
    </g>
  );
};

/** The eye -> beam -> panel line: a thin amber beam from the hero's eye to
    the panel, visible briefly as the power fires. */
const EyeBeam: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; from: number }> = ({ x0, y0, x1, y1, t, from }) => {
  const k = clamp((t - from) / 5);
  if (k <= 0) return null;
  const fade = t > from + 22 ? clamp(1 - (t - from - 22) / 8) : 1;
  return <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={AMBER} strokeWidth={4} opacity={0.75 * k * fade} strokeDasharray="12 8" />;
};

/** A line that draws itself on over `dur` frames (local Freeze-diagram helper). */
const DrawLine: React.FC<{ d: string; t: number; dur?: number; color?: string; width?: number }> = ({ d, t, dur = 12, color = WHITE, width = 5 }) => {
  const k = clamp(t / dur);
  if (k <= 0) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - k)} />;
};

const panelY = (p: { y: number; scale: number }) => p.y - 295 * p.scale;
const headPos = (p: { x: number; y: number; scale: number }, facing: 1 | -1) => ({ x: p.x + facing * 22 * p.scale, y: p.y - 185 * p.scale });

/* S1: library, medium — Pip reaches for a book, turns his head to the
   stranger across the aisle; the amber 'hungry' panel pops at t=57 with a
   burst, beam and eye-glint. */
const S1_HERO = stand(LIBRARY, 0.3, 0.4);
const S1_STR = stand(LIBRARY, 0.66, 0.4);
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Library t={t} id="rt42-1" veil={0.35} />
    <Actor look="hero" x={S1_HERO.x} y={S1_HERO.y} scale={S1_HERO.scale} facing={1} t={t} glintFrom={57}
      keys={[
        { f: 20, p: { armR: { a: -60, b: -20 }, headTilt: -4 }, ease: easeOut },
        { f: 57, p: { headTilt: 6, armR: { a: 10, b: -10 }, tilt: 4 } },
        { f: 90, p: { headTilt: 0, tilt: 0, armL: { a: 30, b: -6 } } },
      ]} />
    <Actor look="stranger" x={S1_STR.x} y={S1_STR.y} scale={S1_STR.scale} facing={-1} t={t}
      keys={[
        { f: 30, p: { headTilt: -3, armR: { a: 40, b: -30 } } },
        { f: 70, p: { headTilt: 4, armR: { a: 18, b: -10 }, tilt: -3 } },
      ]} exprs={[[0, 'neutral'], [57, 'tired']]} />
    <EyeBeam x0={headPos(S1_HERO, 1).x} y0={headPos(S1_HERO, 1).y} x1={S1_STR.x} y1={panelY(S1_STR) + 40} t={t} from={57} />
    <ThoughtPanel x={S1_STR.x} y={panelY(S1_STR)} word="hungry" t={t} from={57} outline={AMBER} s={S1_STR.scale} />
  </g>
);

/* S2: lobby, medium wide — the boss strides in and jabs a finger at Pip;
   the red 'fire me' panel pops at t=45. */
const S2_HERO = stand(LOBBY, 0.28, 0.42);
const S2_BOSS = stand(LOBBY, 0.68, 0.42);
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <Lobby t={t} id="rt42-2" veil={0.4} />
    <Actor look="hero" x={S2_HERO.x} y={S2_HERO.y} scale={S2_HERO.scale} facing={1} t={t} glintFrom={45}
      keys={[
        { f: 22, p: { tilt: -4, headTilt: -3, armL: { a: 40, b: -10 } } },
        { f: 45, p: { tilt: 0, headTilt: 5, armL: { a: 10, b: -8 } } },
      ]} exprs={[[0, 'neutral'], [45, 'worried']]} />
    <Actor look="boss" x={S2_BOSS.x} y={S2_BOSS.y} scale={S2_BOSS.scale} facing={-1} t={t}
      keys={[
        { f: 18, p: { armR: { a: -70, b: -8 }, handR: 'point', headTilt: -4, tilt: 5 } },
        { f: 45, p: { armR: { a: -50, b: -4 }, handR: 'point', tilt: 8 } },
        { f: 58, p: { armR: { a: -70, b: -8 }, handR: 'point', tilt: 5 } },
      ]} exprs={[[0, 'neutral'], [45, 'smug']]} />
    <EyeBeam x0={headPos(S2_HERO, 1).x} y0={headPos(S2_HERO, 1).y} x1={S2_BOSS.x} y1={panelY(S2_BOSS) + 40} t={t} from={45} />
    <ThoughtPanel x={S2_BOSS.x} y={panelY(S2_BOSS)} word="fire me" t={t} from={45} outline={RED} s={Math.max(0.8, S2_BOSS.scale)} />
  </g>
);

/* S3: lobby, extreme close-up — the boss's face fills the frame, the red
   panel flickers, his hand chops the air. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Lobby t={t} id="rt42-3" veil={0.4} />
    <Actor look="boss" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 14, p: { armR: { a: -80, b: -10 }, handR: 'point', headTilt: -5 } },
        { f: 30, p: { armR: { a: -40, b: -6 }, handR: 'point', headTilt: 3 } },
      ]} exprs={[[0, 'smug'], [20, 'worried']]} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="fire me" t={t} from={0} outline={RED} s={1.4} flicker burst={false} />
  </g>
);

/* S4: market, medium — the friend waves Pip over and lifts his coffee cup;
   the amber 'coffee' panel pops at t=60. */
const S4_HERO = stand(MARKET, 0.3, 0.4);
const S4_FR = stand(MARKET, 0.64, 0.4);
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Market t={t} />
    <Actor look="hero" x={S4_HERO.x} y={S4_HERO.y} scale={S4_HERO.scale} facing={1} t={t} glintFrom={60}
      keys={[
        { f: 25, p: { armR: { a: 50, b: -20 }, headTilt: -3 } },
        { f: 60, p: { armR: { a: 10, b: -10 }, headTilt: 5, tilt: 3 } },
        { f: 95, p: { tilt: 0, armL: { a: 34, b: -8 } } },
      ]} />
    <Actor look="friend" x={S4_FR.x} y={S4_FR.y} scale={S4_FR.scale} facing={-1} t={t}
      keys={[
        { f: 20, p: { armR: { a: -90, b: -30 }, headTilt: -5 } },
        { f: 55, p: { armR: { a: -70, b: -20 }, headTilt: 4 } },
        { f: 90, p: { armR: { a: -40, b: -30 }, headTilt: 0 } },
      ]} exprs={[[0, 'happy'], [60, 'happy']]} />
    <Mug x={S4_FR.x - 60} y={S4_FR.y - 120} rot={-8} f={t} />
    <EyeBeam x0={headPos(S4_HERO, 1).x} y0={headPos(S4_HERO, 1).y} x1={S4_FR.x} y1={panelY(S4_FR) + 40} t={t} from={60} />
    <ThoughtPanel x={S4_FR.x} y={panelY(S4_FR)} word="coffee" t={t} from={60} outline={AMBER} s={S4_FR.scale} />
  </g>
);

/* S5: market, close-up — the friend grins and sips; the 'coffee' panel flickers. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Market t={t} />
    <Actor look="friend" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 12, p: { armR: { a: -70, b: -40 }, headTilt: -4 } },
        { f: 28, p: { armR: { a: -30, b: -20 }, headTilt: 4, tilt: 3 } },
      ]} exprs={[[0, 'neutral'], [10, 'happy']]} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="coffee" t={t} from={0} outline={AMBER} s={1.4} flicker burst={false} />
  </g>
);

/* S6: taxi, medium — Pip leans forward from the back seat; the driver
   stretches at the wheel; the amber 'five more minutes' panel pops at t=52. */
const S6_HERO = stand(TAXI, 0.62, 0.5);
const S6_DRV = stand(TAXI, 0.3, 0.32);
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Taxi t={t} />
    <Actor look="hero" x={S6_HERO.x} y={S6_HERO.y} scale={S6_HERO.scale} facing={-1} t={t} glintFrom={52}
      keys={[
        { f: 24, p: { tilt: -8, headTilt: -4, armR: { a: 40, b: -16 } } },
        { f: 52, p: { tilt: -3, headTilt: 5, armR: { a: 18, b: -10 } } },
      ]} />
    <Actor look="driver" x={S6_DRV.x} y={S6_DRV.y} scale={S6_DRV.scale} facing={1} t={t}
      keys={[
        { f: 20, p: { armL: { a: -50, b: -20 }, armR: { a: -50, b: -20 }, headTilt: -6 } },
        { f: 52, p: { armL: { a: -30, b: -10 }, armR: { a: -30, b: -10 }, headTilt: 4 } },
        { f: 70, p: { armL: { a: -50, b: -20 }, armR: { a: -50, b: -20 }, headTilt: -3 } },
      ]} exprs={[[0, 'tired'], [52, 'tired']]} />
    <EyeBeam x0={headPos(S6_HERO, -1).x} y0={headPos(S6_HERO, -1).y} x1={S6_DRV.x} y1={panelY(S6_DRV) + 40} t={t} from={52} />
    <ThoughtPanel x={S6_DRV.x} y={panelY(S6_DRV)} word="five more minutes" t={t} from={52} outline={AMBER} s={Math.max(0.6, S6_DRV.scale)} />
  </g>
);

/* S7: taxi, close-up — the driver's tired face; the panel flickers; he rubs his eyes. */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(640, 540, 1.5)}>
    <Taxi t={t} />
    <Actor look="driver" x={640} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 14, p: { armR: { a: -110, b: -60 }, headTilt: -6 } },
        { f: 30, p: { armR: { a: -60, b: -30 }, headTilt: 4 } },
      ]} exprs={[[0, 'tired'], [16, 'tired']]} />
    <ThoughtPanel x={640} y={1020 - 295 * 1.9} word="five more minutes" t={t} from={0} outline={AMBER} s={1.1} flicker burst={false} />
  </g>
);

/* S8: gallery, wide — Pip WALKS the gallery (walkPose); two SMALL distant
   visitors at the far sides each wear a tiny amber panel. */
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const x = 500 + (t / Math.max(1, len)) * 850;
  const walk = walkPose(x, t * 0.55, 820, 1.0, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Gallery t={t} />
      <Hero look={HERO} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [15, 'smug']]), glint: t >= 8 ? 1 : 0, glintColor: '#FFAA00' }} shadow={0} rimId="rimR" />
      <Actor look="stranger" x={1560} y={820} scale={0.5} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 4, armR: { a: 40, b: -20 } } }]} />
      <ThoughtPanel x={1560} y={820 - 295 * 0.5} word="late" t={t} from={8} outline={AMBER} s={0.5} dim />
      <Actor look="goer1" x={330} y={820} scale={0.5} facing={1} t={t}
        keys={[{ f: 18, p: { headTilt: -4, armL: { a: 30, b: -10 } } }]} />
      <ThoughtPanel x={330} y={820 - 295 * 0.5} word="hungry" t={t} from={8} outline={AMBER} s={0.5} dim />
    </g>
  );
};

/* S9: train, medium — Pip points down the carriage at the passengers'
   panels, smug; a fellow passenger looks up from her book. */
const S9_HERO = stand(TRAIN, 0.5, 0.45);
const S9_P1 = stand(TRAIN, 0.2, 0.3);
const S9_P2 = stand(TRAIN, 0.82, 0.3);
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Train t={t} />
    <Actor look="hero" x={S9_HERO.x} y={S9_HERO.y} scale={S9_HERO.scale} facing={-1} t={t} glintFrom={0}
      keys={[
        { f: 20, p: { armR: { a: -80, b: -6 }, handR: 'point', headTilt: -4, tilt: -4 } },
        { f: 50, p: { armR: { a: -60, b: -10 }, handR: 'point', headTilt: 5 } },
        { f: 75, p: { armR: { a: -20, b: -10 }, tilt: 3 } },
      ]} exprs={[[0, 'smug'], [20, 'smug']]} />
    <Actor look="goer1" x={S9_P1.x} y={S9_P1.y} scale={S9_P1.scale} facing={1} t={t}
      keys={[{ f: 25, p: { headTilt: -5, armR: { a: 30, b: -20 } } }, { f: 55, p: { headTilt: 3, armR: { a: 10, b: -8 } } }]} />
    <ThoughtPanel x={S9_P1.x} y={panelY(S9_P1)} word="tired" t={t} from={8} outline={AMBER} s={Math.max(0.5, S9_P1.scale)} dim />
    <Actor look="goer2" x={S9_P2.x} y={S9_P2.y} scale={S9_P2.scale} facing={-1} t={t}
      keys={[{ f: 30, p: { headTilt: 4, armL: { a: 44, b: -16 } } }]} />
    <ThoughtPanel x={S9_P2.x} y={panelY(S9_P2)} word="home" t={t} from={8} outline={AMBER} s={Math.max(0.5, S9_P2.scale)} dim />
  </g>
);

/* S10: hallway, medium — the teacher clutches her books and holds up a
   'stop' hand; the amber "don't ask me" panel pops at t=44. */
const S10_HERO = stand(HALLWAY, 0.64, 0.42);
const S10_TCH = stand(HALLWAY, 0.3, 0.38);
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Hallway t={t} />
    <Actor look="hero" x={S10_HERO.x} y={S10_HERO.y} scale={S10_HERO.scale} facing={-1} t={t} glintFrom={44}
      keys={[
        { f: 20, p: { tilt: -4, headTilt: -3, armR: { a: 40, b: -12 } } },
        { f: 44, p: { tilt: 0, headTilt: 5, armR: { a: 10, b: -8 } } },
      ]} />
    <Actor look="teacher" x={S10_TCH.x} y={S10_TCH.y} scale={S10_TCH.scale} facing={1} t={t}
      keys={[
        { f: 18, p: { armR: { a: -100, b: -10 }, handR: 'open', headTilt: -4 } },
        { f: 44, p: { armR: { a: -70, b: -6 }, handR: 'open', tilt: -4, headTilt: 4 } },
      ]} exprs={[[0, 'neutral'], [44, 'worried']]} />
    <EyeBeam x0={headPos(S10_HERO, -1).x} y0={headPos(S10_HERO, -1).y} x1={S10_TCH.x} y1={panelY(S10_TCH) + 40} t={t} from={44} />
    <ThoughtPanel x={S10_TCH.x} y={panelY(S10_TCH)} word="don't ask me" t={t} from={44} outline={AMBER} s={Math.max(0.7, S10_TCH.scale)} />
  </g>
);

/* S11: hallway, close-up — the teacher's face; the panel flickers; she looks away. */
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Hallway t={t} />
    <Actor look="teacher" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 16, p: { headTilt: -6, armR: { a: -60, b: -20 } } },
        { f: 32, p: { headTilt: 5, armR: { a: -20, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [18, 'worried']]} />
    <ThoughtPanel x={960} y={1020 - 295 * 1.9} word="don't ask me" t={t} from={0} outline={AMBER} s={1.2} flicker burst={false} />
  </g>
);

/* S12: garden, title wide — Pip on the rooftop garden at dusk, the premise
   over the city. THE ONE slow push-in: scale drifts 1.0 -> 1.08. */
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.0 + 0.08 * clamp(t / Math.max(1, len));
  return (
    <g transform={camT(960, 540, s)}>
      <Garden t={t} />
      <Actor look="hero" x={680} y={790} scale={1.0} facing={1} t={t}
        keys={[
          { f: 20, p: { armR: { a: -90, b: -10 }, handR: 'point', headTilt: -5 } },
          { f: 45, p: { armR: { a: -60, b: -10 }, handR: 'point', headTilt: 4 } },
        ]} exprs={[[0, 'happy'], [20, 'happy']]} />
      <Actor look="stranger" x={1420} y={790} scale={0.85} facing={-1} t={t}
        keys={[{ f: 30, p: { headTilt: 4, armL: { a: 36, b: -12 } } }]} />
      <ThoughtPanel x={1420} y={790 - 295 * 0.85} word="late" t={t} from={8} outline={AMBER} s={0.7} dim />
      <TitleCard t={t} lines={['WHAT IF YOU COULD READ', "ANYONE'S THOUGHTS?"]} accent="THOUGHTS" y={430} size={72} />
    </g>
  );
};

/* S13: FREEZE insert on the starry void — the eye -> beam -> panel diagram
   draws itself on: a big eye, a beam to a glowing panel, the word HIDDEN.
   Pip stands FROZEN mid-gesture (one static pose, gold ring pulsing). */
export const S13: React.FC<ShotProps> = ({ t }) => {
  const dk = clamp(t / 10);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="rt42-void" horizonY={1080} />
      <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      {/* the diagram: eye -> beam -> panel */}
      <g opacity={dk}>
        <DrawLine d="M 480 330 a 120 60 0 1 0 240 0 a 120 60 0 1 0 -240 0" t={t} dur={16} color={WHITE} width={6} />
        <circle cx={600} cy={330} r={34} fill={AMBER} opacity={0.9} />
        <circle cx={600} cy={330} r={14} fill={BLACK} />
        <DrawLine d="M 740 330 L 1080 330" t={Math.max(0, t - 14)} dur={10} color={AMBER} width={6} />
        <polygon points="1080,306 1128,330 1080,354" fill={AMBER} opacity={clamp((t - 24) / 6)} />
        <g transform={`translate(1330 330) scale(${clamp((t - 24) / 8)})`} opacity={clamp((t - 24) / 8)}>
          <rect x={-170} y={-52} width={340} height={104} rx={52} fill="#0E0C1E" stroke={AMBER} strokeWidth={4} style={{ filter: 'drop-shadow(0 0 18px #FFAA00)' }} />
          <text x={0} y={14} fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#FFFFFF" textAnchor="middle">HIDDEN</text>
        </g>
        <g opacity={clamp((t - 34) / 8)}>
          <text x={600} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={WHITE} textAnchor="middle" letterSpacing={3}>EYE CONTACT</text>
          <text x={1330} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={AMBER} textAnchor="middle" letterSpacing={3}>THOUGHT APPEARS</text>
        </g>
      </g>
      {/* gold FREEZE banner */}
      <g opacity={clamp((t - 44) / 6)}>
        <rect x={810} y={120} width={300} height={64} rx={32} fill="#0E0C1E" stroke={GOLD} strokeWidth={3} />
        <text x={960} y={164} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill={GOLD} textAnchor="middle" letterSpacing={6}>FREEZE</text>
      </g>
      {/* Pip, frozen mid-reach, gold ring pulsing around him */}
      <Hero look={HERO} pose={{ ...poseAt(0, [{ f: 0, p: { x: 960, y: 900, scale: 1.0, facing: 1, armR: { a: -70, b: -10 }, handR: 'point', headTilt: -4, tilt: 3 } }]), ...faceAt(0, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <FocusRings x={960} y={760} t={(t % 24)} r0={180} color={GOLD} />
    </g>
  );
};

/* S14: gym, medium — the SAID-vs-THOUGHT split. Left: a gym-goer says
   "I'M FINE" (white speech bubble). Right: another's red panel reads
   "exhausted". Pip leans in between them, studying both. */
const S14_HERO = stand(GYM, 0.5, 0.42);
const S14_G1 = stand(GYM, 0.22, 0.36);
const S14_G2 = stand(GYM, 0.78, 0.36);
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Gym t={t} />
    <Actor look="goer1" x={S14_G1.x} y={S14_G1.y} scale={S14_G1.scale} facing={1} t={t}
      keys={[
        { f: 25, p: { armR: { a: -60, b: -20 }, headTilt: -4 } },
        { f: 60, p: { armR: { a: 10, b: -10 }, headTilt: 4, tilt: 3 } },
      ]} exprs={[[0, 'happy'], [30, 'happy']]} />
    <g transform={`translate(${S14_G1.x} ${panelY(S14_G1)}) scale(${S14_G1.scale * (0.55 + 0.45 * backOut(clamp((t - 8) / 6)))})`} opacity={clamp((t - 8) / 6)}>
      <rect x={-150} y={-60} width={300} height={104} rx={52} fill="#F6EFE3" stroke="#2A2430" strokeWidth={3} />
      <polygon points="-24,40 24,40 0,66" fill="#F6EFE3" stroke="#2A2430" strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={16} fontFamily={FONT.title} fontWeight={700} fontSize={36} fill="#141019" textAnchor="middle">I'M FINE</text>
      <text x={0} y={-84} fontFamily={FONT.title} fontWeight={600} fontSize={24} fill={WHITE} textAnchor="middle" letterSpacing={3}>SAID</text>
    </g>
    <Actor look="hero" x={S14_HERO.x} y={S14_HERO.y} scale={S14_HERO.scale} facing={1} t={t} glintFrom={30}
      keys={[
        { f: 25, p: { tilt: -6, headTilt: -6, armL: { a: 40, b: -12 } } },
        { f: 55, p: { tilt: 6, headTilt: 6, armR: { a: -70, b: -8 }, handR: 'point' } },
        { f: 85, p: { tilt: -4, headTilt: -4, armR: { a: 20, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [55, 'worried']]} />
    <Actor look="goer2" x={S14_G2.x} y={S14_G2.y} scale={S14_G2.scale} facing={-1} t={t}
      keys={[
        { f: 30, p: { headTilt: -5, armL: { a: 50, b: -30 } } },
        { f: 65, p: { headTilt: 4, armL: { a: 10, b: -8 }, tilt: -3 } },
      ]} exprs={[[0, 'tired'], [30, 'tired']]} />
    <ThoughtPanel x={S14_G2.x} y={panelY(S14_G2)} word="exhausted" t={t} from={30} outline={RED} s={Math.max(0.7, S14_G2.scale)} />
    <g opacity={clamp((t - 30) / 6)}>
      <text x={S14_G2.x} y={panelY(S14_G2) - 100 * S14_G2.scale} fontFamily={FONT.title} fontWeight={600} fontSize={24} fill={RED} textAnchor="middle" letterSpacing={3}>THOUGHT</text>
    </g>
  </g>
);

/* S15: laundromat, medium — Pip turns; Mom folds towels, smiling; the red
   "don't tell him" panel pops at t=31 with a burst. */
const S15_HERO = stand(LAUNDROMAT, 0.3, 0.4);
const S15_MOM = stand(LAUNDROMAT, 0.66, 0.4);
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Laundromat t={t} />
    <Actor look="hero" x={S15_HERO.x} y={S15_HERO.y} scale={S15_HERO.scale} facing={1} t={t} glintFrom={31}
      keys={[
        { f: 15, p: { tilt: -5, headTilt: -5, armR: { a: 44, b: -14 } } },
        { f: 31, p: { tilt: 4, headTilt: 6, armR: { a: 10, b: -8 } } },
      ]} exprs={[[0, 'neutral'], [31, 'shock']]} />
    <Actor look="mom" x={S15_MOM.x} y={S15_MOM.y} scale={S15_MOM.scale} facing={-1} t={t}
      keys={[
        { f: 20, p: { armR: { a: -50, b: -30 }, armL: { a: -40, b: -20 }, headTilt: -3 } },
        { f: 40, p: { armR: { a: -30, b: -20 }, armL: { a: -20, b: -14 }, headTilt: 3 } },
      ]} exprs={[[0, 'happy'], [31, 'happy']]} />
    <EyeBeam x0={headPos(S15_HERO, 1).x} y0={headPos(S15_HERO, 1).y} x1={S15_MOM.x} y1={panelY(S15_MOM) + 40} t={t} from={31} />
    <ThoughtPanel x={S15_MOM.x} y={panelY(S15_MOM)} word="don't tell him" t={t} from={31} outline={RED} s={Math.max(0.7, S15_MOM.scale)} />
  </g>
);

/* S16: laundromat, close-up — Mom's smiling face, framed left of centre so
   the towel stack sits clear of her head; the red panel flickers above her;
   a gold starburst rings the shock. */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(680, 560, 1.45)}>
    <Laundromat t={t} />
    <Actor look="mom" x={680} y={1040} scale={1.9} facing={1} t={t}
      keys={[
        { f: 24, p: { headTilt: -4, armR: { a: -40, b: -20 } } },
        { f: 60, p: { headTilt: 4, armR: { a: -20, b: -10 } } },
      ]} exprs={[[0, 'happy'], [24, 'happy']]} />
    <ThoughtPanel x={680} y={1040 - 295 * 1.9} word="don't tell him" t={t} from={0} outline={RED} s={1.2} flicker burst={false} />
    <FocusRings x={680} y={480} t={t % 30} r0={220} color={GOLD} />
  </g>
);

/* S17: end card on the starry void — gold PART ONE, white question, and the
   little red panel that started the mystery. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <NightSky id="rt42-end" horizonY={1080} />
    <Stars seed={127} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.85} />
    <Moon x={1700} y={180} r={54} />
    <g>
      <text x={960} y={470} fontFamily={FONT.title} fontWeight={700} fontSize={110} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 24px rgba(255,200,69,0.6))' }}>
        PART ONE
      </text>
      <text x={960} y={560} fontFamily={FONT.title} fontWeight={600} fontSize={44} fill={WHITE} textAnchor="middle" letterSpacing={4}>
        WHAT IS SHE HIDING?
      </text>
    </g>
    <ThoughtPanel x={960} y={700} word="don't tell him" t={t} from={14} outline={RED} s={0.7} burst={false} />
  </g>
);
