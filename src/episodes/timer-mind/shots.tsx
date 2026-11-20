import React from 'react';
import {
  LightVeil, DrawOn,
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, stand, islandTop, stand,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, Study, Desk, Stairwell, Rooftop, Schematic, SCH,
  Cookie, CookieStack, Plate, PlateTop, Paper, PaperStack, Cat, Marquee, Sparkle, TitleCard, Dial, Glow, ShotProps,
} from '../../engine';
import { LOOKS } from '../../engine/rig';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const MOM = LOOKS.mom;

// ---------- S1: wide, the kitchen: Pip walks in, sees a stranger's timer ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.5, armL: { a: 12, b: -8 }, look: 0.6 } },
    { f: 6, p: { armR: { a: 58, b: 0 } }, ease: easeOut },
    { f: 14, p: { armR: { a: 50, b: -4 } } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [8, 'neutral']]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 1000]]), 600, kf(t, [[0, 1.85], [len, 1.95]]))}>
      <Kitchen t={t + 40} id="k1" />
      <Hero look={PIP} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <Desk x0={560} x1={1360} y={700} />
    </g>
  );
};

// ---------- S2: macro insert, high angle over counter: the timer pulses ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, kf(t, [[0, 520], [22, 560]]), kf(t, [[0, 1.0], [22, 1.05]]))}>
      <Kitchen t={t + 60} id="k2" />
      <Hero look={PIP} pose={{ x: 1050, y: 530, scale: 0.7, yaw: 0, look: 0.7 }} shadow={0} rimId="rimR" />
      <LightVeil id="s2veil" lights={[[1120, 500, 100]]} o={0.5} />
      <Glow x={1120} y={530} r={100} o={0.35} />
    </g>
  );
};

// ---------- S3: wide, the kitchen: Mo walks in, her timer glows ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.6 } },
    { f: 8, p: { x: 1020, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.8 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [8, 'smile']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [570]]), kf(t, [[0, 0.98], [570, 1.03]]))}>
      <Kitchen t={t + 70} id="k3" />
      <Hero look={PIP} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <Hero look={MO} pose={{ x: 1020, y: 712, scale: 0.8, yaw: 0, look: 0.8 }} shadow={0} rimId="rimR" />
      <KitchenIsland />
    </g>
  );
};

// ---------- S4: medium wide, the kitchen: Pip thinks of Mo, his timer warms ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.5, armL: { a: 12, b: -8 }, look: 0.6 } },
    { f: 6, p: { x: 980, y: 712, yaw: 0.7, armL: { a: 14, b: -6 }, look: 0.8 } },
    { f: 12, p: { x: 960, y: 712, yaw: 0.5, armL: { a: 12, b: -8 }, look: 0.6 } },
  ];
  const face = faceAt(t, [[0, 'neutral'], [8, 'smug']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [570]]), kf(t, [[0, 1.0], [570, 1.03]]))}>
      <Kitchen t={t + 80} id="k4" />
      <Hero look={PIP} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <Hero look={MO} pose={{ x: 1020, y: 712, scale: 0.8, yaw: 0, look: 0.8 }} shadow={0} rimId="rimR" />
    </g>
  );
};

// ---------- S5: wide, the bedroom: Pip's mother walks in, her timer glows ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.6 } },
    { f: 12, p: { x: 980, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.7 } },
  ];
  const face = faceAt(t, [[0, 'neutral'], [8, 'neutral']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [570]]), kf(t, [[0, 1.0], [570, 1.03]]))}>
      <Bedroom t={t + 120} id="b5" />
      <Hero look={PIP} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <Hero look={MOM} pose={{ x: 980, y: 712, scale: 0.9, yaw: 0, look: 0.7 }} shadow={0} rimId="rimR" />
    </g>
  );
};

// ---------- S6: medium, the bedroom: Pip's eyes fill with tears, both timers glow brighter ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.6 } },
    { f: 18, p: { x: 960, y: 712, yaw: 0, armL: { a: 12, b: -8 }, look: 0.8 } },
  ];
  const face = faceAt(t, [[0, 'neutral'], [24, 'worried']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [570]]), kf(t, [[0, 1.0], [570, 1.03]]))}>
      <Bedroom t={t + 140} id="b6" />
      <Hero look={PIP} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <Hero look={MOM} pose={{ x: 980, y: 712, scale: 0.9, yaw: 0, look: 0.7 }} shadow={0} rimId="rimR" />
    </g>
  );
};

// ---------- S7: title, wide, city rooftop at dusk: Pip looks up at timers above strangers ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 905 - 40, scale: 0.62, yaw: 0, armL: { a: 20, b: 6 }, armR: { a: 20, b: 6 } } },
    { f: 18, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } }, ease: easeOut },
  ];
  return (
    <g transform={camT(960, kf(t, [[0, 520], [545]]), kf(t, [[0, 1.0], [545, 1.07]]))}>
      <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.6} rimId="rimR" />
    </g>
  );
};

// ---------- S8: close-up, Pip concerned, his timer glows brighter as he looks at someone else's ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1180, y: 560 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.7, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 0], [10, -6]]), ...faceAt(t, [[0, 'oops'], [16, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(420 -40) scale(1.9)">
          <Stairwell t={t + 266} id="sw8" />
        </g>
      </g>
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- S9: wide, low angle, rooftop: Pip stands alone against dusk sky ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 905 - 40, scale: 0.7, yaw: -0.1, armL: { a: 30, b: 10 }, armR: { a: 30, b: 10 } } },
    { f: 12, p: { x: 960, y: 905 - 40, scale: 0.7, yaw: -0.1 } },
  ];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 230} sunX={1180} sunY={600} red={0.5} low={40} cityLit={2.6} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [26, 'shock']]) }} shadow={0} rimId="rimRed" />
    </g>
  );
};