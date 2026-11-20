import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, LOOKS, FONT,
  Study, Rooftop, TitleCard, Foreground, camT, ShotProps,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand,
} from '../../engine';

/** Pip in look B, the dark hoodie. */
const PIP = LOOKS.pipHood;

/**
 * The death count: a dark navy pill with a red outline and a white bold number,
 * with a small red DAYS label above it. Placed above a character's head.
 * `pulse` makes it breathe (for a blinking or counting timer).
 */
const Count: React.FC<{ x: number; y: number; n: string; t: number; pulse?: boolean; s?: number }> = ({
  x, y, n, t, pulse = false, s = 1,
}) => {
  const w = 44 + n.length * 24;
  const o = pulse ? 0.65 + 0.35 * Math.sin(t / 4) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill="#14101E" stroke="#FF3344" strokeWidth={3} />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
      <text x={0} y={-32} fontFamily={FONT.title} fontWeight={700} fontSize={12} fill="#FF3344" textAnchor="middle" letterSpacing={3}>
        DAYS
      </text>
    </g>
  );
};

/** Where a count pill sits above a character's head, from their pose. */
const above = (p: { x: number; y: number; scale: number }) => ({ x: p.x, y: p.y - 440 * p.scale });

/**
 * A subway car interior: dark walls, a row of windows with city lights rushing
 * past (the train is moving), vertical poles, bench seats. The light streaks
 * move with the shot clock so the car never sits still.
 */
const Subway: React.FC<{ t: number }> = ({ t }) => {
  return (
    <g>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#1A1626" />
      {/* ceiling strip light */}
      <rect x={-400} y={180} width={2720} height={14} fill="#3A3446" />
      <rect x={-400} y={194} width={2720} height={6} fill="#FFE9B8" opacity={0.7} />
      {/* windows with rushing city lights */}
      {[0, 1, 2, 3].map((i) => {
        const wx = 140 + i * 460;
        return (
          <g key={i}>
            <rect x={wx} y={260} width={360} height={280} rx={10} fill="#0E0C1E" stroke="#3A3446" strokeWidth={5} />
            <rect x={wx + ((t * 7 + i * 130) % 360)} y={280} width={46} height={240} fill="#FFC27A" opacity={0.55} />
            <rect x={wx + ((t * 7 + i * 210 + 90) % 360)} y={280} width={26} height={240} fill="#9FC0FF" opacity={0.45} />
            <rect x={wx + ((t * 7 + i * 90 + 200) % 360)} y={280} width={18} height={240} fill="#FF6B6B" opacity={0.35} />
          </g>
        );
      })}
      {/* vertical poles */}
      {[620, 1080, 1540].map((px) => (
        <rect key={px} x={px} y={200} width={12} height={600} rx={6} fill="#4A4460" />
      ))}
      {/* bench seats along the wall */}
      <rect x={-400} y={780} width={2720} height={110} fill="#2A2440" />
      <rect x={-400} y={890} width={2720} height={26} fill="#1E1830" />
      {/* floor */}
      <rect x={-400} y={916} width={2720} height={400} fill="#14101E" />
    </g>
  );
};

// ---------- S1: cafe counter (Kitchen set); the barista's timer (12403) glows red ----------
const S1_PIP = stand(KITCHEN, 0.38, 0.4);
const S1_BAR = stand(KITCHEN, 0.62, 0.4);
const S1_JAR = islandTop(0.5, 0.45);
export const S1: React.FC<ShotProps> = ({ t }) => {
  const pipBase = { x: S1_PIP.x, y: S1_PIP.y, scale: S1_PIP.scale };
  const barBase = { x: S1_BAR.x, y: S1_BAR.y, scale: S1_BAR.scale };
  const pose = poseAt(t, [
    { f: 0, p: { ...pipBase, armR: { a: 20, b: -10 } } },
    { f: 24, p: { armR: { a: 45, b: -10 } }, ease: easeOut },
    { f: 48, p: { armR: { a: 50, b: -6 } } },
  ]);
  const barista = poseAt(t, [
    { f: 0, p: { ...barBase, facing: -1, headTilt: 0 } },
    { f: 24, p: { headTilt: 4 } },
    { f: 48, p: { headTilt: 0 } },
  ]);
  const barHead = above(barista);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.9], [48, 0.96]]))}>
      <Kitchen t={t} id="k1" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={LOOKS.mo} pose={{ ...barista, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={barHead.x} y={barHead.y} n="12403" t={t} pulse />
      <KitchenIsland />
      {/* tip jar on the island */}
      <g transform={`translate(${S1_JAR.x} ${S1_JAR.y})`}>
        <rect x={-34} y={-40} width={68} height={56} rx={8} fill="#2A2C40" opacity={0.9} />
        <rect x={-28} y={-34} width={56} height={12} rx={6} fill="#FFC845" opacity={0.85} />
        <circle cx={-10} cy={-46} r={9} fill="#FFC845" />
        <circle cx={12} cy={-50} r={9} fill="#FFC845" />
      </g>
    </g>
  );
};

// ---------- S2: macro insert, coins drop into the tip jar; the timer pulses ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const drop = kf(t, [[0, -120], [18, 0]]);
  const o = 0.7 + 0.3 * Math.sin(t / 3);
  return (
    <g transform={camT(1000, 660, kf(t, [[0, 1.4], [33, 1.5]]))}>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#14101E" />
      <g transform="translate(960, 700)">
        <rect x={-90} y={-110} width={180} height={150} rx={16} fill="#2A2C40" />
        <rect x={-78} y={-98} width={156} height={30} rx={12} fill="#FFC845" opacity={0.9} />
        <circle cx={-30} cy={drop} r={22} fill="#FFC845" />
        <circle cx={30} cy={drop - 40} r={22} fill="#FFC845" />
        <circle cx={0} cy={drop - 80} r={22} fill="#FFC845" opacity={0.8} />
      </g>
      <g opacity={o}>
        <Count x={960} y={300} n="12403" t={t} s={1.2} />
      </g>
    </g>
  );
};

// ---------- S3: subway car; a mother (42) holds a baby (19801); Pip offers his seat ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  // the train sways: everyone rides the same gentle rock
  const sway = Math.sin(t / 18) * 6;
  const pose = poseAt(t, [
    { f: 0, p: { x: 560, y: 700 } },
    { f: 60, p: { x: 600, y: 690, armR: { a: 50, b: -10 } }, ease: easeOut },
    { f: 120, p: { armR: { a: 55, b: -6 } } },
  ]);
  const mom = poseAt(t, [
    { f: 0, p: { x: 1280, y: 700, facing: -1 } },
    { f: 60, p: { y: 692 } },
    { f: 120, p: { y: 700 } },
  ]);
  const baby = poseAt(t, [
    { f: 0, p: { x: 1200, y: 640, facing: -1, scale: 0.45 } },
    { f: 30, p: { y: 628, scale: 0.45 } },
    { f: 60, p: { y: 640, scale: 0.45 } },
    { f: 90, p: { y: 628, scale: 0.45 } },
    { f: 120, p: { y: 640, scale: 0.45 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.82], [176, 0.92]]))}>
      <Subway t={t} />
      <g transform={`translate(0 ${sway})`}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
        <Hero look={LOOKS.mom} pose={{ ...mom, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
        <Hero look={LOOKS.sis} pose={{ ...baby, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
        <Count x={1280} y={250} n="42" t={t} />
        <Count x={1200} y={330} n="19801" t={t} s={0.8} />
      </g>
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- S4: Pip's POV in the subway, red timers fade in above every head ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, armR: { a: 60, b: -10 } } },
    { f: 20, p: { armR: { a: 70, b: -6 } } },
    { f: 42, p: { armR: { a: 60, b: -10 } } },
  ]);
  // the timers fade in one by one as Pip looks around
  const fade = (d: number) => Math.min(1, Math.max(0, (t - d) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [42, 1.0]]))}>
      <Subway t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <g opacity={fade(2)}>
        <Count x={420} y={300} n="8420" t={t} />
      </g>
      <g opacity={fade(8)}>
        <Count x={760} y={260} n="312" t={t} />
      </g>
      <g opacity={fade(14)}>
        <Count x={1150} y={280} n="15900" t={t} />
      </g>
      <g opacity={fade(20)}>
        <Count x={1520} y={320} n="67" t={t} />
      </g>
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- S5: diner booth at dusk; Pip across from sister, her timer (14) blinking ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 700, y: 700 } },
    { f: 30, p: { x: 730, y: 690, headTilt: 3 } },
    { f: 65, p: { x: 700, y: 700, headTilt: 0 } },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: { x: 1250, y: 700, facing: -1, scale: 0.7, headTilt: 0 } },
    { f: 30, p: { headTilt: -5 } },
    { f: 65, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.86], [65, 0.92]]))}>
      <Study t={t} id="s5" veil={0.42} night />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={LOOKS.sis} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={1250} y={330} n="14" t={t} pulse s={1.1} />
      {/* the booth: two bench seats and the table between them */}
      <g>
        <rect x={560} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
        <rect x={1140} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
        <rect x={800} y={860} width={320} height={26} rx={8} fill="#5A4A3A" />
        <rect x={800} y={886} width={320} height={140} fill="#2A2226" />
      </g>
      {/* two untouched coffees on the table */}
      <g transform="translate(880, 850)">
        <rect x={-22} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
        <rect x={90} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
      </g>
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- S6: extreme close-up, the sister's timer: 14, trembling down to 13 ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const shake = Math.sin(t * 2.2) * 3;
  const fade13 = t > 60 ? Math.min(1, (t - 60) / 20) : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.5], [103, 1.7]]))}>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#14101E" />
      <g transform={`translate(${shake} 0)`}>
        <Count x={960} y={540} n="14" t={t} pulse s={2.2} />
      </g>
      <g opacity={fade13}>
        <Count x={960} y={700} n="13" t={t} s={1.4} />
      </g>
    </g>
  );
};

// ---------- S7: title card, the premise over the city at dusk ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 } },
    { f: 48, p: { y: 680, armR: { a: 20, b: 0 } }, ease: easeOut },
    { f: 96, p: { y: 700 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.9], [96, 0.95]]))}>
      <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={420} y={500} n="8420" t={t} s={0.9} />
      <Count x={1500} y={480} n="312" t={t} s={0.9} />
      <TitleCard t={t} lines={['WHAT IF YOU COULD SEE', "EVERYONE'S DEATH COUNT?"]} accent="DEATH" y={180} size={110} />
    </g>
  );
};

// ---------- S8: Pip looks up, realisation; the city timers glow ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 680 } },
    { f: 28, p: { y: 640, armR: { a: 30, b: 0 } }, ease: easeOut },
    { f: 56, p: { y: 680 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [56, 1.0]]))}>
      <Rooftop t={t} sunX={960} sunY={600} cityLit={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [28, 'worried']]) }} shadow={0} rimId="rimR" />
      <Count x={520} y={300} n="4521" t={t} s={0.9} />
      <Count x={1400} y={280} n="98" t={t} s={0.9} />
    </g>
  );
};

// ---------- S9: the man in the charcoal suit lowers his paper; timer 8912 ----------
const S9_SUIT = stand(KITCHEN, 0.6, 0.4);
const S9_PIP = stand(KITCHEN, 0.36, 0.4);
export const S9: React.FC<ShotProps> = ({ t }) => {
  const suitBase = { x: S9_SUIT.x, y: S9_SUIT.y, scale: S9_SUIT.scale };
  const pipBase = { x: S9_PIP.x, y: S9_PIP.y, scale: S9_PIP.scale };
  const suit = poseAt(t, [
    { f: 0, p: { ...suitBase, facing: -1, headTilt: 0 } },
    { f: 60, p: { headTilt: 2 } },
    { f: 100, p: { headTilt: 5 } },
    { f: 134, p: { headTilt: 3 } },
  ]);
  const pose = poseAt(t, [
    { f: 0, p: { ...pipBase } },
    { f: 60, p: { x: pipBase.x + 12, y: pipBase.y - 6 } },
    { f: 134, p: { x: pipBase.x, y: pipBase.y } },
  ]);
  const paperY = kf(t, [[0, 0], [30, 140], [134, 160]]);
  const tremble = Math.sin(t * 1.8) * 2;
  const suitHead = above(suit);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [134, 1.12]]))}>
      <Kitchen t={t} id="k9" veil={0.55} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={LOOKS.suit} pose={{ ...suit, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={suitHead.x} y={suitHead.y} n="8912" t={t} />
      {/* the newspaper: starts up over his face, lowers to his chest so his eyes show */}
      <g transform={`translate(${suit.x + tremble} ${suit.y - 176 * suit.scale + paperY})`}>
        <rect x={-70} y={-50} width={140} height={100} rx={4} fill="#E9E2D2" />
        <rect x={-58} y={-38} width={116} height={10} fill="#2A2C40" />
        <rect x={-58} y={-20} width={80} height={6} fill="#8A8474" />
        <rect x={-58} y={-8} width={100} height={6} fill="#8A8474" />
      </g>
      <KitchenIsland />
    </g>
  );
};

// ---------- S10: the city timers flicker; title card PART 1 ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const flick = 0.6 + 0.4 * Math.sin(t / 3);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.9], [48, 0.95]]))}>
      <Rooftop t={t} sunX={960} sunY={600} cityLit={1} />
      <g opacity={flick}>
        <Count x={380} y={500} n="12403" t={t} s={0.8} />
        <Count x={760} y={480} n="42" t={t} s={0.8} />
        <Count x={1150} y={520} n="19801" t={t} s={0.8} />
        <Count x={1520} y={500} n="14" t={t} s={0.8} />
      </g>
      <TitleCard t={t} lines={['', 'PART 1']} accent="PART" y={200} size={120} />
    </g>
  );
};
