import React from 'react';
import {
  Hero, poseAt, kf, clamp, lerp, easeOut, easeIn, backOut, faceAt, LOOKS, HEAD,
  Study, Bedroom, AlarmClock, LIGHTS, Foreground, path, rnd,
  camT, FocusRings,
} from '../../engine';

/** Pip in look B, the dark hoodie. */
const PIP = LOOKS.pipHood;

// ---------- SH1: Pip in bed, wide, clock visible ----------
export const Sh1: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.5, armR: { a: 14, b: -6 }, look: 0.6 } },
    { f: 10, p: { armR: { a: 58, b: 0 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 50, b: -4 } } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.86], [22, 0.93]]))}>
      <Bedroom t={t} id="sh1" clock="03:40" veil={0.28} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
        <path d="M -60 790 Q 110 776 262 790" stroke="#FFB46A" strokeWidth={4} fill="none" opacity={0.35} />
        {[[1790, 1160, -150, -330], [1880, 1180, -40, -380], [1960, 1150, -210, -250], [1840, 1200, 90, -300]].map(([x, y, dx, dy], i) => (
          <path key={i} d={`M ${x} ${y} Q ${x + dx * 0.2} ${y + dy * 0.6} ${x + dx} ${y + dy} Q ${x + dx * 0.6} ${y + dy * 0.3} ${x} ${y} Z`} fill="#0E1610" />
        ))}
      </Foreground>
      <AlarmClock x={1120} y={700} s={0.3} text="03:40" />
    </g>
  );
};

// ---------- SH2: clock macro insert, glowing digits ----------
export const Sh2: React.FC<ShotProps> = ({ t }) => {
  const wob = t > 4 ? Math.sin((t - 4) * 1.8) * 3 * Math.exp(-(t - 4) / 6) : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 520], [22, 560]]))}>
      <Study t={t} id="sh2" veil={0.1} />
      <Foreground>
        <path d="M -80 1200 L -80 800 Q -60 720 200 720 L 300 800 Z" fill="#0A0A12" />
        {[[1700, 1120, -100, -250], [1800, 1140, -30, -300], [1880, 1110, -180, -200]].map(([x, y, dx, dy], i) => (
          <path key={i} d={`M ${x} ${y} Q ${x + dx * 0.3} ${y + dy * 0.5} ${x + dx} ${y + dy} Q ${x + dx * 0.5} ${y + dy * 0.3} ${x} ${y} Z`} fill="#100C16" />
        ))}
      </Foreground>
      <path d="M 940 580 L 940 520 L 1000 520 L 1000 580 Z" fill="#1A1A2A" />
      <path d="M 960 540 m -30 0 L 30 0 L 30 30 L -30 30 L -30 0 Z" fill="#FFFFFF" opacity={0.12} />
      {[[940, 540, 260, 0], [960, 540, -260, 0]].map(([x, y, dx, dy], i) => (
        <text key={i} x={x} y={y} fontFamily="monospace" fontSize={96} fill="#FFD700" textAnchor="middle" opacity={0.9} transform={`rotate(${i === 0 ? 0 : 180} ${x} ${y})`}>24</text>
      ))}
      {wob ? <text x={960} y={560} fontSize={36} fill="#FFD700" textAnchor="middle" opacity={0.6} transform={`rotate(${wob} 960 540)`}>:)</text> : null}
    </g>
  );
};

// ---------- SH3: Pip sitting up, rubbing eyes ----------
export const Sh3: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 650, yaw: 0.3 } },
    { f: 12, p: { y: 580, armR: { a: 30, b: 0 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 40, b: -6 } } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.88], [22, 0.95]]))}>
      <Bedroom t={t} id="sh3" clock="04:20" veil={0.3} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH4: Close-up of Pip's face, tired expression ----------
export const Sh4: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 540 } },
    { f: 10, p: { y: 480, s: 1.02 } },
    { f: 20, p: { y: 540, s: 0.98 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [20, 1.1]]))}>
      <Bedroom t={t} id="sh4" veil={0.35} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [10, 'wide'], [20, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={12}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH5: Pip at table, spreading out papers ----------
export const Sh5: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 620 } },
    { f: 14, p: { x: 880, y: 600, armR: { a: 45, b: -10 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 50, b: -6 } } },
  ]);
  return (
    <g transform={camT(990, 560, kf(t, [[0, 0.82], [22, 0.89]]))}>
      <Bedroom t={t} id="sh5" clock="05:00" veil={0.25} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'focused']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- SH6: Pip looking at phone, checking time ----------
export const Sh6: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 620 } },
    { f: 10, p: { x: 920, y: 580 } },
    { f: 20, p: { x: 960, y: 620 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.87], [22, 0.94]]))}>
      <Bedroom t={t} id="sh6" clock="06:15" veil={0.3} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'phone'], [10, 'scroll'], [20, 'phone']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
      {/* Phone on nightstand */}
      <g transform="translate(1100, 650) scale(0.4)">
        <rect x={-30} y={-20} width={60} height={40} fill="#1A1A2A" rx={4} />
        <rect x={-20} y={-10} width={40} height={20} fill="#FFFFFF" rx={2} />
      </g>
    </g>
  );
};

// ---------- SH7: Pip on rooftop at dawn, sky lightening ----------
export const Sh7: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 620, yaw: -0.3 } },
    { f: 16, p: { x: 920, y: 560, armR: { a: 30, b: 0 } }, ease: easeOut },
    { f: 24, p: { armR: { a: 40, b: -6 } } },
  ]);
  const sunProgress = (t - 36) / 24; // 36-60 frames
  const sunY = kf(t, [[36, 100], [60, 40]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [24, 0.95]]))}>
      <Study t={t} id="sh7" veil={0.15} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'dawn'], [16, 'contemplate'], [24, 'dawn']]) }} shadow={0} rimId="rimR" />
      <Foreground>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#0F0B14" />
        {/* Sun rising */}
        <circle cx={960} cy={sunY} r={30 + sunProgress * 15} fill="#FFC845" opacity={sunProgress > 0 ? 0.8 : 0} />
        {sunProgress > 0 && <path d="M 960 40 L 960 100" stroke="#FFC845" strokeWidth={4} />}
      </Foreground>
    </g>
  );
};

// ---------- SH8: Extreme close-up of Pip's eye, pupil dilated ----------
export const Sh8: React.FC<ShotProps> = ({ t }) => {
  const blink = Math.sin(t * 0.3) * 0.1;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 540 } },
    { f: 12, p: { y: 520 } },
    { f: 22, p: { y: 540 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [22, 1.15]]))}>
      <Bedroom t={t} id="sh8" veil={0.4} duvet={false} />
      <g transform="translate(960, 540)">
        <circle cx={0} cy={0} r={120} fill="#1A1A2A" />
        <circle cx={0} cy={0} r={80 + blink * 20} fill="#3A3A5A" />
        <circle cx={0} cy={-20 + blink * 10} r={30} fill="#B0B0C0" />
        <circle cx={60} cy={-30 + blink * 5} r={15} fill="#FFFFFF" opacity={0.6} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'dilated']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={12}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- SH9: Pip watching sunrise, arms spread, wide, low angle ----------
export const Sh9: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 580, yaw: 0.2, legR: { a: 30, b: 0 } } },
    { f: 12, p: { x: 940, y: 520, armR: { a: 90, b: 0 }, legR: { a: 60, b: -10 } }, ease: easeOut },
    { f: 20, p: { x: 960, y: 580, legR: { a: 30, b: 0 } } },
  ]);
  const sunY = kf(t, [[48, 30], [60, 20]]);
  return (
    <g transform={camT(920, 520, kf(t, [[0, 0.9], [20, 0.95]]))}>
      <Study t={t} id="sh9" veil={0.1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'sunrise'], [12, 'wonder'], [20, 'sunrise']]) }} shadow={0} rimId="rimR" />
      <Foreground>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#0F0B14" />
        {/* Sun - already up from SH7 context, just a glow */}
        <circle cx={960} cy={sunY} r={20} fill="#FFC845" opacity={0.6} />
      </Foreground>
    </g>
  );
};

// ---------- SH10: Pip back in bed, eyes closed, relaxed, deep breath ----------
export const Sh10: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 } },
    { f: 12, p: { y: 692 } },
    { f: 22, p: { y: 700 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.88], [22, 0.94]]))}>
      <Bedroom t={t} id="sh10" clock="07:30" veil={0.28} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH11: Pip watching the full sunrise, calm ----------
export const Sh11: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 580, yaw: 0.2 } },
    { f: 12, p: { x: 950, y: 560, armR: { a: 20, b: 0 } }, ease: easeOut },
    { f: 22, p: { x: 960, y: 580 } },
  ]);
  const sunY = kf(t, [[0, 120], [22, 80]]);
  return (
    <g transform={camT(920, 520, kf(t, [[0, 0.9], [22, 0.95]]))}>
      <Study t={t} id="sh11" veil={0.1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Foreground>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#0F0B14" />
        <circle cx={960} cy={sunY} r={46} fill="#FFC845" opacity={0.85} />
        <circle cx={960} cy={sunY} r={70} fill="#FFC845" opacity={0.25} />
      </Foreground>
    </g>
  );
};

// ---------- SH12: Pip sleeping, peaceful face, clock reads 08:00 ----------
export const Sh12: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 } },
    { f: 12, p: { y: 694 } },
    { f: 22, p: { y: 700 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.88], [22, 0.94]]))}>
      <Bedroom t={t} id="sh12" clock="08:00" veil={0.25} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH13: Pip sleeping soundly, clock reads 08:30 ----------
export const Sh13: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 702 } },
    { f: 12, p: { y: 696 } },
    { f: 22, p: { y: 702 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.9], [22, 0.95]]))}>
      <Bedroom t={t} id="sh13" clock="08:30" veil={0.25} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- SH14: Pip on the rooftop in the morning, full sun, birds ----------
export const Sh14: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 580, yaw: -0.2 } },
    { f: 12, p: { x: 940, y: 560, armR: { a: 30, b: 0 } }, ease: easeOut },
    { f: 22, p: { x: 960, y: 580 } },
  ]);
  const bx = (x: number) => x + t * 0.6;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [22, 0.9]]))}>
      <Study t={t} id="sh14" veil={0.1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Foreground>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#0F0B14" />
        <circle cx={960} cy={70} r={50} fill="#FFC845" opacity={0.9} />
        <circle cx={960} cy={70} r={76} fill="#FFC845" opacity={0.25} />
        {[[700, 300], [840, 260], [1150, 320]].map(([x, y], i) => (
          <path key={i} d={`M ${bx(x) - 18} ${y} Q ${bx(x) - 9} ${y - 10} ${bx(x)} ${y} Q ${bx(x) + 9} ${y - 10} ${bx(x) + 18} ${y}`} stroke="#1E1C28" strokeWidth={4} fill="none" />
        ))}
      </Foreground>
    </g>
  );
};

// ---------- SH15: Pip sleeping soundly, clock reads 09:00, morning light ----------
export const Sh15: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 } },
    { f: 12, p: { y: 694 } },
    { f: 22, p: { y: 700 } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.88], [22, 0.94]]))}>
      <Bedroom t={t} id="sh15" clock="09:00" veil={0.22} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH16: Pip waking naturally, stretching, clock reads 09:30 ----------
export const Sh16: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 680 } },
    { f: 12, p: { y: 600, armR: { a: 120, b: -10 }, armL: { a: 120, b: -10 } }, ease: easeOut },
    { f: 22, p: { y: 640, armR: { a: 40, b: -6 }, armL: { a: 14, b: -6 } } },
  ]);
  return (
    <g transform={camT(990, 545, kf(t, [[0, 0.88], [22, 0.94]]))}>
      <Bedroom t={t} id="sh16" clock="09:30" veil={0.22} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [12, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
        <path d="M 222 856 Q 368 846 388 932 L 398 1220 L 222 1220 Z" fill="#0F0B14" />
      </Foreground>
    </g>
  );
};

// ---------- SH17: Pip up and about, making coffee, day started ----------
export const Sh17: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 620 } },
    { f: 14, p: { x: 900, y: 600, armR: { a: 45, b: -10 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 50, b: -6 } } },
  ]);
  return (
    <g transform={camT(990, 560, kf(t, [[0, 0.82], [22, 0.89]]))}>
      <Study t={t} id="sh17" veil={0.12} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Foreground blur={8}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
      {/* Coffee cup on the desk, steam rising */}
      <g transform="translate(1120, 700)">
        <rect x={-26} y={-28} width={52} height={40} rx={6} fill="#F4F1EA" />
        <rect x={-26} y={-28} width={52} height={10} rx={5} fill="#3A2418" />
        <path d="M 26 -18 Q 40 -14 36 2 Q 32 12 24 8" stroke="#F4F1EA" strokeWidth={5} fill="none" />
        <path d="M -8 -32 Q -14 -46 -8 -58 M 8 -32 Q 2 -46 8 -58" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.5} />
      </g>
    </g>
  );
};