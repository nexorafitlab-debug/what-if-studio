import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, LOOKS, FONT, Look, Expr,
  Study, Rooftop, TitleCard, camT, ShotProps,
  Kitchen, KitchenIsland, Bedroom, Classroom, Stairwell,
  NightSky, Stars, Kid, KIDS,
} from '../../engine';

/** Pip in look B, the dark hoodie (continuity with the 30s sample). */
const PIP = LOOKS.pipHood;

/** Sam: Pip's rig in an orange hoodie. Maya: the sister rig, purple top, bob. */
const SAM: Look = { ...LOOKS.pipHood, jacket: '#E8722A', jacketShade: '#C25E20', limb: '#E8722A', accent: '#FFC845' };
const MAYA: Look = { ...LOOKS.sis, jacket: '#6A5A8A', jacketShade: '#52446E', accent: '#E9C46A', extra: 'bob' };
const LOOKMAP: Record<string, Look> = {
  pip: PIP, sam: SAM, sis: LOOKS.sis, mom: LOOKS.mom, suit: LOOKS.suit, mo: LOOKS.mo, maya: MAYA,
};

type CharSpec = {
  look: string; x: number; y: number; scale: number; facing: 1 | -1; expr: Expr;
  timer?: string; dim?: boolean; pulse?: boolean; bright?: boolean; walk?: boolean; tickFrom?: number;
};
type PillSpec = {
  x: number; y: number; n: string; s?: number;
  dim?: boolean; pulse?: boolean; bright?: boolean; tickFrom?: number;
};
type Spec = {
  kind: string; set: string; night: boolean; zoom: number; cx: number; cy: number;
  chars: CharSpec[]; pills: PillSpec[]; seed: number;
  booth: boolean; paper: boolean; plant: boolean; notebook: boolean; veil: number;
  title?: [string, string]; accent?: string;
};

/**
 * The death count: a dark navy pill with a red outline and a white bold number,
 * with a small red DAYS label above it. Placed above a character's head.
 * `pulse` makes it breathe (for a blinking or counting timer), `dim` is a
 * stranger's faint number, `bright` is a loved one's burning number.
 */
const Count: React.FC<{ x: number; y: number; n: string; t: number; pulse?: boolean; s?: number; dim?: boolean; bright?: boolean }> = ({
  x, y, n, t, pulse = false, s = 1, dim = false, bright = false,
}) => {
  const w = 44 + n.length * 24;
  const o = (pulse ? 0.65 + 0.35 * Math.sin(t / 4) : 1) * (dim ? 0.45 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {bright ? <rect x={-w / 2 - 14} y={-38} width={w + 28} height={76} rx={38} fill="#FF3344" opacity={0.25} /> : null}
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

/**
 * A subway car interior: dark walls, a row of windows with city lights rushing
 * past (the train is moving), vertical poles, bench seats. The light streaks
 * move with the shot clock so the car never sits still.
 */
const Subway: React.FC<{ t: number }> = ({ t }) => {
  return (
    <g>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#1A1626" />
      <rect x={-400} y={180} width={2720} height={14} fill="#3A3446" />
      <rect x={-400} y={194} width={2720} height={6} fill="#FFE9B8" opacity={0.7} />
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
      {[620, 1080, 1540].map((px) => (
        <rect key={px} x={px} y={200} width={12} height={600} rx={6} fill="#4A4460" />
      ))}
      <rect x={-400} y={780} width={2720} height={110} fill="#2A2440" />
      <rect x={-400} y={890} width={2720} height={26} fill="#1E1830" />
      <rect x={-400} y={916} width={2720} height={400} fill="#14101E" />
    </g>
  );
};

/** The science beat's dot grid: 240 dots standing in for 100,000 babies. */
const DotGrid: React.FC<{ seed: number }> = ({ seed }) => {
  const dots = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 20; c++) {
      const gold = (r * 20 + c + seed) % 47 === 0;
      dots.push(
        <circle key={`${r}-${c}`} cx={360 + c * 62} cy={260 + r * 52} r={gold ? 9 : 6} fill={gold ? '#FFC845' : '#8A7FA8'} opacity={gold ? 0.95 : 0.55} />,
      );
    }
  }
  return <g>{dots}</g>;
};

/** The dead plant by the gym door: a pot and three drooping stems. */
const DeadPlant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 0 L 40 0 L 30 60 L -30 60 Z" fill="#8A5A3A" />
    <path d="M 0 0 Q -30 -60 -70 -50" stroke="#6A5A3A" strokeWidth={6} fill="none" />
    <path d="M 0 0 Q 10 -70 50 -60" stroke="#6A5A3A" strokeWidth={6} fill="none" />
    <path d="M 0 0 Q 0 -80 -10 -90" stroke="#7A6A3A" strokeWidth={6} fill="none" />
  </g>
);

/** Maya's notebook, open: two cream pages with writing lines. */
const Notebook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-130} width={380} height={260} rx={10} fill="#E9E2D2" />
    <rect x={-178} y={-118} width={172} height={236} rx={6} fill="#F6F1E6" />
    <rect x={6} y={-118} width={172} height={236} rx={6} fill="#F6F1E6" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x={-160} y={-90 + i * 32} width={140} height={7} rx={3} fill="#8A8474" opacity={0.7} />
        <rect x={24} y={-90 + i * 32} width={140} height={7} rx={3} fill="#8A8474" opacity={0.7} />
      </g>
    ))}
  </g>
);

/** Old photos: three prints, every head blank above it (the mirror rule). */
const Photos: React.FC = () => (
  <g>
    {[560, 960, 1360].map((x, i) => (
      <g key={i} transform={`translate(${x} 480) rotate(${(i - 1) * 4})`}>
        <rect x={-140} y={-180} width={280} height={360} rx={8} fill="#F4F1EA" />
        <rect x={-120} y={-160} width={240} height={240} fill="#2A2440" />
        <circle cx={0} cy={-40} r={52} fill="#F6EFE3" />
        <path d="M -120 80 Q 0 -20 120 80 L 120 80 L -120 80 Z" fill="#3E8C86" />
      </g>
    ))}
  </g>
);

/** The mirror: a big frame on the wall, a clear reflection, nothing above the head. */
const MirrorFrame: React.FC = () => (
  <g>
    <rect x={620} y={150} width={680} height={620} rx={24} fill="#1E2438" stroke="#8A7FA8" strokeWidth={8} />
    <rect x={650} y={180} width={620} height={560} rx={16} fill="#232A44" />
    <circle cx={960} cy={540} r={80} fill="#F6EFE3" opacity={0.55} />
    <circle cx={936} cy={532} r={6} fill="#1D2033" opacity={0.55} />
    <circle cx={984} cy={532} r={6} fill="#1D2033" opacity={0.55} />
    <path d="M 944 566 Q 960 574 976 566" stroke="#1D2033" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
    <path d="M 880 640 Q 960 596 1040 640 L 1040 740 L 880 740 Z" fill="#2E2B3D" opacity={0.55} />
  </g>
);

/** The tip jar: a glass jar with gold coins dropping into it (S2 macro insert). */
const TipJar: React.FC<{ t: number }> = ({ t }) => {
  const drop = kf(t, [[0, -120], [18, 0]]);
  return (
    <g transform="translate(960, 700)">
      <rect x={-90} y={-110} width={180} height={150} rx={16} fill="#2A2C40" />
      <rect x={-78} y={-98} width={156} height={30} rx={12} fill="#FFC845" opacity={0.9} />
      <circle cx={-30} cy={drop} r={22} fill="#FFC845" />
      <circle cx={30} cy={drop - 40} r={22} fill="#FFC845" />
      <circle cx={0} cy={drop - 80} r={22} fill="#FFC845" opacity={0.8} />
    </g>
  );
};

/** The diner booth: two benches, the table between them, two untouched coffees. */
const Booth: React.FC = () => (
  <g>
    <rect x={560} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
    <rect x={1140} y={820} width={220} height={200} rx={14} fill="#3A2E3E" />
    <rect x={800} y={860} width={320} height={26} rx={8} fill="#5A4A3A" />
    <rect x={800} y={886} width={320} height={140} fill="#2A2226" />
    <g transform="translate(880, 850)">
      <rect x={-22} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
      <rect x={90} y={-24} width={44} height={34} rx={5} fill="#F4F1EA" />
    </g>
  </g>
);

const Back: React.FC<{ spec: Spec; t: number }> = ({ spec, t }) => {
  const n = spec.seed;
  switch (spec.set) {
    case 'kitchen':
      return <Kitchen t={t} id={`k${n}`} veil={0.3} />;
    case 'study':
      return <Study t={t} id={`s${n}`} veil={spec.veil} night={spec.night} />;
    case 'bedroom':
      return <Bedroom t={t} id={`b${n}`} veil={spec.veil} duvet={false} />;
    case 'classroom':
      return <Classroom t={t} id={`c${n}`} />;
    case 'stairwell':
      return <Stairwell t={t} id={`w${n}`} />;
    case 'rooftop':
      return <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />;
    case 'subway':
      return <Subway t={t} />;
    case 'void':
      return (
        <g>
          <NightSky id={`v${n}`} horizonY={1080} />
          <Stars seed={n} x0={-400} y0={-400} w={2720} h={1480} t={t} n={60} />
        </g>
      );
    default:
      return <rect x={-400} y={-200} width={2720} height={1480} fill="#14101E" />;
  }
};

const Char: React.FC<{ c: CharSpec; t: number; i: number }> = ({ c, t, i }) => {
  const swing = c.walk ? Math.sin(t / 6 + i * 1.7) * 18 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: c.x, y: c.y, scale: c.scale, facing: c.facing, headTilt: 0, armR: { a: 18 + swing, b: -10 }, armL: { a: 10 - swing, b: -8 }, legL: { a: c.walk ? swing : 5, b: 0 }, legR: { a: c.walk ? -swing : -5, b: 0 } } },
    { f: 24, p: { headTilt: (i % 2 ? -1 : 1) * 3, armR: { a: 34 + swing, b: -8 } }, ease: easeOut },
    { f: 48, p: { headTilt: 0, armR: { a: 20 + swing, b: -10 } } },
  ]);
  const n = c.tickFrom !== undefined ? String(Math.max(0, c.tickFrom - Math.floor(t / 30))) : c.timer;
  return (
    <>
      <Hero look={LOOKMAP[c.look]} pose={{ ...pose, ...faceAt(t, [[0, c.expr]]) }} shadow={0} rimId="rimR" />
      {n ? <Count x={pose.x} y={pose.y - 440 * pose.scale} n={n} t={t} pulse={c.pulse} dim={c.dim} bright={c.bright} s={c.scale >= 1 ? 1 : 0.9} /> : null}
    </>
  );
};

const GenericShot: React.FC<ShotProps & { spec: Spec }> = ({ t, spec }) => {
  const z = kf(t, [[0, spec.zoom], [48, spec.zoom * 1.04]]);
  const suit = spec.chars.find((c) => c.look === 'suit');
  return (
    <g transform={camT(spec.cx, spec.cy, z)}>
      <Back spec={spec} t={t} />
      {spec.kind === 'dots' ? <DotGrid seed={spec.seed} /> : null}
      {spec.kind === 'photos' ? <Photos /> : null}
      {spec.kind === 'mirror' ? <MirrorFrame /> : null}
      {spec.kind === 'jar' ? <TipJar t={t} /> : null}
      {spec.kind === 'crowd' ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Kid key={i} x={300 + i * 264} y={820} s={0.9} look={KIDS[i % KIDS.length]} t={t} />
          ))}
        </g>
      ) : null}
      {spec.kind === 'prop-notebook' ? <Notebook x={960} y={700} s={1.6} /> : null}
      {spec.kind === 'prop-plant' ? <DeadPlant x={960} y={820} s={1.4} /> : null}
      {spec.chars.map((c, i) => (
        <Char key={i} c={c} t={t} i={i} />
      ))}
      {spec.set === 'kitchen' ? <KitchenIsland /> : null}
      {spec.booth ? <Booth /> : null}
      {spec.plant && spec.kind !== 'prop-plant' ? <DeadPlant x={1500} y={820} s={0.8} /> : null}
      {spec.notebook ? <Notebook x={1500} y={780} s={0.9} /> : null}
      {spec.paper && suit ? (
        <g transform={`translate(${suit.x} ${suit.y - 176 * suit.scale + kf(t, [[0, 0], [30, 140]])})`}>
          <rect x={-70} y={-50} width={140} height={100} rx={4} fill="#E9E2D2" />
          <rect x={-58} y={-38} width={116} height={10} fill="#2A2C40" />
          <rect x={-58} y={-20} width={80} height={6} fill="#8A8474" />
          <rect x={-58} y={-8} width={100} height={6} fill="#8A8474" />
        </g>
      ) : null}
      {spec.pills.map((p, i) => {
        const n = p.tickFrom !== undefined ? String(Math.max(0, p.tickFrom - Math.floor(t / 30))) : p.n;
        return <Count key={i} x={p.x} y={p.y} n={n} t={t} pulse={p.pulse} dim={p.dim} bright={p.bright} s={p.s ?? 1} />;
      })}
      {spec.title ? <TitleCard t={t} lines={spec.title} accent={spec.accent} y={180} size={110} /> : null}
    </g>
  );
};

const SPECS: Record<string, Spec> = {
 "S1": {
  "kind": "scene",
  "set": "kitchen",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mo",
    "x": 1250,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "12403",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 1,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S2": {
  "kind": "jar",
  "set": "dark",
  "night": false,
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 300,
    "n": "12403",
    "s": 1.2,
    "pulse": true
   }
  ],
  "seed": 2,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S3": {
  "kind": "scene",
  "set": "subway",
  "night": false,
  "zoom": 0.85,
  "cx": 990,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 560,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mom",
    "x": 1280,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "42"
   },
   {
    "look": "sis",
    "x": 1200,
    "y": 640,
    "scale": 0.45,
    "facing": -1,
    "expr": "happy",
    "timer": "19801"
   }
  ],
  "pills": [],
  "seed": 3,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S4": {
  "kind": "scene",
  "set": "subway",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [
   {
    "x": 420,
    "y": 300,
    "n": "8420",
    "s": 0.9
   },
   {
    "x": 760,
    "y": 260,
    "n": "312",
    "s": 0.9
   },
   {
    "x": 1150,
    "y": 280,
    "n": "15900",
    "s": 0.9
   },
   {
    "x": 1520,
    "y": 320,
    "n": "67",
    "s": 0.9
   },
   {
    "x": 960,
    "y": 240,
    "n": "12403",
    "s": 0.9
   }
  ],
  "seed": 4,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S5": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 5,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S6": {
  "kind": "pill",
  "set": "dark",
  "night": true,
  "zoom": 1.6,
  "cx": 960,
  "cy": 480,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 500,
    "n": "14",
    "s": 2.2,
    "pulse": true
   },
   {
    "x": 960,
    "y": 720,
    "n": "13",
    "s": 1.4
   }
  ],
  "seed": 6,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S7": {
  "kind": "title",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [
   {
    "x": 420,
    "y": 500,
    "n": "8420",
    "s": 0.9
   },
   {
    "x": 1500,
    "y": 480,
    "n": "312",
    "s": 0.9
   }
  ],
  "seed": 7,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42,
  "title": [
   "WHAT IF YOU COULD SEE",
   "EVERYONE'S DEATH COUNT?"
  ],
  "accent": "DEATH"
 },
 "S8": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "shock"
   }
  ],
  "pills": [],
  "seed": 8,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S9": {
  "kind": "scene",
  "set": "kitchen",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "suit",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 9,
  "booth": false,
  "paper": true,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S10": {
  "kind": "title",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 380,
    "y": 500,
    "n": "12403",
    "s": 0.8
   },
   {
    "x": 760,
    "y": 480,
    "n": "42",
    "s": 0.8
   },
   {
    "x": 1150,
    "y": 520,
    "n": "19801",
    "s": 0.8
   },
   {
    "x": 1520,
    "y": 500,
    "n": "14",
    "s": 0.8
   }
  ],
  "seed": 10,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42,
  "title": [
   "",
   "PART 1"
  ],
  "accent": "PART"
 },
 "S11": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 11,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S12": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 12,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S13": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 13,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S14": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "12403",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 14,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S15": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "12403",
    "s": 2.0
   }
  ],
  "seed": 15,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S16": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "12403",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 16,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S17": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 17,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S18": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 18,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S19": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 19,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S20": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mo",
    "x": 1250,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "8471",
    "dim": true,
    "pulse": false,
    "bright": false,
    "tickFrom": 8471
   }
  ],
  "pills": [],
  "seed": 20,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S21": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "8471",
    "s": 2.0,
    "tickFrom": 8471
   }
  ],
  "seed": 21,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S22": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 22,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S23": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried",
    "timer": "14",
    "dim": true,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 23,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S24": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "suit",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 24,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S25": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "suit",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 25,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S26": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.0,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "suit",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 26,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S27": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 27,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S28": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "suit",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "8912",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 28,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S29": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 29,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S30": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 30,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S31": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 31,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S32": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 32,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S33": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 33,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S34": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 34,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S35": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 35,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S36": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 36,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S37": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mo",
    "x": 1250,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 37,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S38": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "mo",
    "x": 960,
    "y": 700,
    "scale": 0.95,
    "facing": 1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 38,
  "booth": false,
  "paper": false,
  "plant": true,
  "notebook": false,
  "veil": 0.42
 },
 "S39": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "mo",
    "x": 960,
    "y": 700,
    "scale": 0.95,
    "facing": 1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 39,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S40": {
  "kind": "prop-plant",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 260,
    "n": "9412",
    "s": 1.0
   }
  ],
  "seed": 40,
  "booth": false,
  "paper": false,
  "plant": true,
  "notebook": false,
  "veil": 0.42
 },
 "S41": {
  "kind": "scene",
  "set": "study",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "maya",
    "x": 1250,
    "y": 700,
    "scale": 0.9,
    "facing": -1,
    "expr": "neutral",
    "timer": "17842",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 41,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S42": {
  "kind": "prop-notebook",
  "set": "study",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 260,
    "n": "17842",
    "s": 1.0
   }
  ],
  "seed": 42,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S43": {
  "kind": "scene",
  "set": "study",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "maya",
    "x": 960,
    "y": 700,
    "scale": 0.9,
    "facing": 1,
    "expr": "neutral",
    "timer": "17842",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 43,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S44": {
  "kind": "scene",
  "set": "subway",
  "night": false,
  "zoom": 0.85,
  "cx": 990,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 560,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mom",
    "x": 1280,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "41"
   },
   {
    "look": "sis",
    "x": 1200,
    "y": 640,
    "scale": 0.45,
    "facing": -1,
    "expr": "happy",
    "timer": "19801"
   }
  ],
  "pills": [],
  "seed": 44,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S45": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "41",
    "s": 2.0
   }
  ],
  "seed": 45,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S46": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.5,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 460,
    "n": "42",
    "s": 1.8
   },
   {
    "x": 960,
    "y": 700,
    "n": "41",
    "s": 1.6,
    "pulse": true
   }
  ],
  "seed": 46,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S47": {
  "kind": "scene",
  "set": "subway",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 640,
    "scale": 0.6,
    "facing": 1,
    "expr": "neutral",
    "timer": "19801",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 47,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S48": {
  "kind": "scene",
  "set": "subway",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [
   {
    "x": 620,
    "y": 300,
    "n": "41",
    "s": 1.0
   },
   {
    "x": 1300,
    "y": 300,
    "n": "19801",
    "s": 1.0
   }
  ],
  "seed": 48,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S49": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 49,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S50": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mo",
    "x": 1250,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral",
    "timer": "9412",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 50,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S51": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 51,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S52": {
  "kind": "crowd",
  "set": "classroom",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 300,
    "y": 540,
    "n": "8420",
    "s": 0.85
   },
   {
    "x": 564,
    "y": 540,
    "n": "312",
    "s": 0.85
   },
   {
    "x": 828,
    "y": 540,
    "n": "15900",
    "s": 0.85
   },
   {
    "x": 1092,
    "y": 540,
    "n": "67",
    "s": 0.85
   },
   {
    "x": 1356,
    "y": 540,
    "n": "12403",
    "s": 0.85
   },
   {
    "x": 1620,
    "y": 540,
    "n": "4521",
    "s": 0.85
   }
  ],
  "seed": 52,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S53": {
  "kind": "crowd",
  "set": "classroom",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 300,
    "y": 540,
    "n": "20113",
    "s": 0.85
   },
   {
    "x": 564,
    "y": 540,
    "n": "18902",
    "s": 0.85
   },
   {
    "x": 828,
    "y": 540,
    "n": "17440",
    "s": 0.85
   },
   {
    "x": 1092,
    "y": 540,
    "n": "22081",
    "s": 0.85
   },
   {
    "x": 1356,
    "y": 540,
    "n": "19320",
    "s": 0.85
   },
   {
    "x": 1620,
    "y": 540,
    "n": "17655",
    "s": 0.85
   }
  ],
  "seed": 53,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S54": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [
   {
    "x": 500,
    "y": 300,
    "n": "23",
    "s": 0.9
   },
   {
    "x": 1420,
    "y": 300,
    "n": "9",
    "s": 0.9
   }
  ],
  "seed": 54,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S55": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 55,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S56": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": true
   },
   {
    "look": "maya",
    "x": 1250,
    "y": 700,
    "scale": 0.9,
    "facing": -1,
    "expr": "neutral",
    "timer": "17842",
    "dim": false,
    "pulse": false,
    "bright": true
   }
  ],
  "pills": [],
  "seed": 56,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S57": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "mo",
    "x": 700,
    "y": 700,
    "scale": 0.95,
    "facing": 1,
    "expr": "neutral",
    "timer": "12403",
    "dim": true,
    "pulse": false,
    "bright": false
   },
   {
    "look": "suit",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "8912",
    "dim": true,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 57,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S58": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": true
   }
  ],
  "pills": [],
  "seed": 58,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S59": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 59,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S60": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 60,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S61": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 61,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S62": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 62,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S63": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 63,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S64": {
  "kind": "dots",
  "set": "void",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 64,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S65": {
  "kind": "dots",
  "set": "void",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 65,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S66": {
  "kind": "dots",
  "set": "void",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 66,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S67": {
  "kind": "dots",
  "set": "void",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 67,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S68": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.4,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 700,
    "y": 480,
    "n": "19801",
    "s": 1.6
   },
   {
    "x": 1220,
    "y": 640,
    "n": "14",
    "s": 1.2
   }
  ],
  "seed": 68,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S69": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 69,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S70": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 70,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S71": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 71,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S72": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 72,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S73": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 73,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S74": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 74,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S75": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 75,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S76": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 76,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S77": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 77,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S78": {
  "kind": "scene",
  "set": "void",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 78,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S79": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 79,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S80": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 80,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S81": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 81,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S82": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.0,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 82,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S83": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 83,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S84": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "happy",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 84,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S85": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 85,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S86": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 86,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S87": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 87,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S88": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 88,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S89": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 89,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S90": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "15204",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 90,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S91": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 91,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S92": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 92,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S93": {
  "kind": "scene",
  "set": "study",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 93,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S94": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 94,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S95": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 560,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "mo",
    "x": 960,
    "y": 700,
    "scale": 0.95,
    "facing": -1,
    "expr": "neutral"
   },
   {
    "look": "suit",
    "x": 1360,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 95,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S96": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 96,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S97": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 97,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S98": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 98,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S99": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 99,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S100": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "tired"
   }
  ],
  "pills": [
   {
    "x": 500,
    "y": 300,
    "n": "5120",
    "s": 0.9,
    "dim": true
   },
   {
    "x": 960,
    "y": 300,
    "n": "88",
    "s": 0.9,
    "dim": true
   },
   {
    "x": 1420,
    "y": 300,
    "n": "12004",
    "s": 0.9,
    "dim": true
   }
  ],
  "seed": 100,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.55
 },
 "S101": {
  "kind": "mirror",
  "set": "bedroom",
  "night": false,
  "zoom": 1.1,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 101,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S102": {
  "kind": "mirror",
  "set": "bedroom",
  "night": false,
  "zoom": 1.65,
  "cx": 960,
  "cy": 480,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 102,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S103": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 103,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S104": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 104,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S105": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 105,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S106": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 106,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S107": {
  "kind": "photos",
  "set": "bedroom",
  "night": false,
  "zoom": 1.0,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [],
  "seed": 107,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S108": {
  "kind": "city",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 380,
    "y": 500,
    "n": "12403",
    "s": 0.85
   },
   {
    "x": 760,
    "y": 480,
    "n": "42",
    "s": 0.85
   },
   {
    "x": 1150,
    "y": 520,
    "n": "19801",
    "s": 0.85
   },
   {
    "x": 1520,
    "y": 500,
    "n": "14",
    "s": 0.85
   },
   {
    "x": 600,
    "y": 380,
    "n": "8912",
    "s": 0.85
   },
   {
    "x": 1350,
    "y": 380,
    "n": "15204",
    "s": 0.85
   }
  ],
  "seed": 108,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S109": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 109,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S110": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 1.65,
  "cx": 960,
  "cy": 480,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "worried"
   }
  ],
  "pills": [],
  "seed": 110,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S111": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 111,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S112": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "suit",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral",
    "timer": "8912",
    "dim": true,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 112,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S113": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "8912",
    "s": 2.0,
    "dim": true
   }
  ],
  "seed": 113,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S114": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 480,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "8912",
    "s": 2.0,
    "dim": true
   }
  ],
  "seed": 114,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S115": {
  "kind": "scene",
  "set": "kitchen",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 115,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S116": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 500,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "12403",
    "s": 2.0,
    "dim": true
   }
  ],
  "seed": 116,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S117": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 117,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S118": {
  "kind": "pill",
  "set": "dark",
  "night": false,
  "zoom": 1.6,
  "cx": 960,
  "cy": 480,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "14",
    "s": 2.0
   }
  ],
  "seed": 118,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S119": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 119,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S120": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 120,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S121": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 121,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S122": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 122,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S123": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 123,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S124": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 124,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S125": {
  "kind": "memory",
  "set": "bedroom",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [
   {
    "x": 700,
    "y": 180,
    "n": "12403",
    "s": 1.0
   },
   {
    "x": 1220,
    "y": 180,
    "n": "41",
    "s": 1.0
   },
   {
    "x": 480,
    "y": 320,
    "n": "19801",
    "s": 1.0
   },
   {
    "x": 1440,
    "y": 320,
    "n": "15204",
    "s": 1.0
   },
   {
    "x": 480,
    "y": 560,
    "n": "17842",
    "s": 1.0
   },
   {
    "x": 1440,
    "y": 560,
    "n": "9412",
    "s": 1.0
   }
  ],
  "seed": 125,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S126": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 126,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S127": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 127,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S128": {
  "kind": "scene",
  "set": "bedroom",
  "night": false,
  "zoom": 1.65,
  "cx": 960,
  "cy": 480,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 128,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.3
 },
 "S129": {
  "kind": "scene",
  "set": "stairwell",
  "night": false,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 1250,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 129,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S130": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 130,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S131": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 131,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S132": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 132,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S133": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 133,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S134": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 134,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S135": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 135,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S136": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 136,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S137": {
  "kind": "pill",
  "set": "dark",
  "night": true,
  "zoom": 1.6,
  "cx": 960,
  "cy": 480,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 540,
    "n": "14",
    "s": 2.0
   }
  ],
  "seed": 137,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S138": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 138,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S139": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.0,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "happy",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 139,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S140": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "happy",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 140,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S141": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 141,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S142": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sis",
    "x": 960,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "happy",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 142,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S143": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 143,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S144": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 144,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S145": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 145,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S146": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 146,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S147": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 960,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 147,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S148": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 1.3,
  "cx": 975,
  "cy": 500,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "happy"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 148,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S149": {
  "kind": "scene",
  "set": "study",
  "night": true,
  "zoom": 0.95,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "happy"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "neutral",
    "timer": "14",
    "dim": false,
    "pulse": false,
    "bright": false
   }
  ],
  "pills": [],
  "seed": 149,
  "booth": true,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S150": {
  "kind": "scene",
  "set": "classroom",
  "night": false,
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 560,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sam",
    "x": 960,
    "y": 700,
    "scale": 1.0,
    "facing": -1,
    "expr": "neutral"
   },
   {
    "look": "maya",
    "x": 1360,
    "y": 700,
    "scale": 0.9,
    "facing": -1,
    "expr": "neutral"
   }
  ],
  "pills": [],
  "seed": 150,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S151": {
  "kind": "city",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 380,
    "y": 500,
    "n": "12403",
    "s": 0.85
   },
   {
    "x": 760,
    "y": 480,
    "n": "42",
    "s": 0.85
   },
   {
    "x": 1150,
    "y": 520,
    "n": "19801",
    "s": 0.85
   },
   {
    "x": 1520,
    "y": 500,
    "n": "14",
    "s": 0.85
   },
   {
    "x": 600,
    "y": 380,
    "n": "8912",
    "s": 0.85
   },
   {
    "x": 1350,
    "y": 380,
    "n": "15204",
    "s": 0.85
   }
  ],
  "seed": 151,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S152": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 152,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S153": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 153,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S154": {
  "kind": "scene",
  "set": "rooftop",
  "night": false,
  "zoom": 0.85,
  "cx": 975,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": 1,
    "expr": "neutral",
    "walk": true
   }
  ],
  "pills": [],
  "seed": 154,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42
 },
 "S155": {
  "kind": "endcard",
  "set": "rooftop",
  "night": false,
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "pip",
    "x": 700,
    "y": 700,
    "scale": 1.0,
    "facing": 1,
    "expr": "neutral"
   },
   {
    "look": "sis",
    "x": 1250,
    "y": 700,
    "scale": 0.7,
    "facing": -1,
    "expr": "happy"
   }
  ],
  "pills": [],
  "seed": 155,
  "booth": false,
  "paper": false,
  "plant": false,
  "notebook": false,
  "veil": 0.42,
  "title": [
   "WHAT WOULD YOURS SAY?",
   "TELL US IN THE COMMENTS"
  ],
  "accent": "COMMENTS"
 }
};

// ---------- S1: Café counter — Medium; You, barista · timer 12403
export const S1: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S1} />;
// ---------- S2: Café counter top — Macro insert, high angle; Tip jar · timer 12403 (pulse)
export const S2: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S2} />;
// ---------- S3: Subway car — Wide; You, mother, baby · timer 42 / 19801
export const S3: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S3} />;
// ---------- S4: Subway car — Medium, over the shoulder; You (POV), passengers · timer timers above every head
export const S4: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S4} />;
// ---------- S5: Diner booth — Medium wide; You, sister · timer 14
export const S5: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S5} />;
// ---------- S6: Diner booth — Extreme close-up; Sister's timer · timer 14 → 13
export const S6: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S6} />;
// ---------- S7: Rooftop — Title, wide; You, city at dusk · timer —
export const S7: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S7} />;
// ---------- S8: Rooftop — Medium, low angle; You · timer —
export const S8: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S8} />;
// ---------- S9: Diner — Close-up; Suit man · timer 8912
export const S9: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S9} />;
// ---------- S10: Rooftop — Wide, low angle; City timers · timer —
export const S10: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S10} />;
// ---------- S11: Rooftop — Medium; You · timer —
export const S11: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S11} />;
// ---------- S12: Bedroom — Medium; You · timer —
export const S12: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S12} />;
// ---------- S13: Bedroom — Close-up; You · timer —
export const S13: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S13} />;
// ---------- S14: Bedroom — Medium; You · timer 12403
export const S14: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S14} />;
// ---------- S15: Bedroom — Close-up; Pill only · timer 12403
export const S15: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S15} />;
// ---------- S16: Bedroom — Medium; You · timer 12403
export const S16: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S16} />;
// ---------- S17: School hallway — Medium; You, notebook · timer 9412
export const S17: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S17} />;
// ---------- S18: School hallway — Close-up; You · timer 9412
export const S18: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S18} />;
// ---------- S19: School hallway — Medium; You · timer —
export const S19: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S19} />;
// ---------- S20: Street — Wide; You, stranger · timer ticking (dim)
export const S20: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S20} />;
// ---------- S21: Street — Close-up; Stranger's pill · timer ticking
export const S21: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S21} />;
// ---------- S22: Bedroom — Close-up; You, eyes closed · timer —
export const S22: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S22} />;
// ---------- S23: Bedroom — Medium; You · timer pills faint
export const S23: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S23} />;
// ---------- S24: School hallway — Medium; You, suit man · timer 8912
export const S24: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S24} />;
// ---------- S25: School hallway — Close-up; Suit man · timer 8912
export const S25: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S25} />;
// ---------- S26: School hallway — Two-shot; You, suit man · timer 8912
export const S26: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S26} />;
// ---------- S27: School hallway — Close-up; You · timer 8912
export const S27: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S27} />;
// ---------- S28: School hallway — Close-up; Suit man · timer 8912
export const S28: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S28} />;
// ---------- S29: School hallway — Medium; You walking away · timer —
export const S29: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S29} />;
// ---------- S30: School hallway — Wide; You · timer —
export const S30: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S30} />;
// ---------- S31: School hallway — Medium; You · timer —
export const S31: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S31} />;
// ---------- S32: School hallway — Medium; You, Sam · timer 15204
export const S32: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S32} />;
// ---------- S33: School hallway — Close-up; Sam's pill · timer 15204
export const S33: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S33} />;
// ---------- S34: Cafeteria — Medium; Sam · timer 15204
export const S34: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S34} />;
// ---------- S35: Cafeteria — Close-up; Sam · timer 15204
export const S35: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S35} />;
// ---------- S36: Cafeteria — Close-up; You · timer —
export const S36: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S36} />;
// ---------- S37: Gym door — Medium; You, Mr. Ortiz · timer 9412
export const S37: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S37} />;
// ---------- S38: Gym door — Medium; Mr. Ortiz, dead plant · timer 9412
export const S38: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S38} />;
// ---------- S39: Gym door — Close-up; Mr. Ortiz · timer 9412
export const S39: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S39} />;
// ---------- S40: Gym door — Close-up; Dead plant · timer 9412
export const S40: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S40} />;
// ---------- S41: Library — Medium; You, Maya · timer 17842
export const S41: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S41} />;
// ---------- S42: Library — Close-up; Maya's notebook · timer 17842
export const S42: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S42} />;
// ---------- S43: Library — Close-up; Maya · timer 17842
export const S43: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S43} />;
// ---------- S44: Subway car — Wide; You, mother, baby · timer 41 / 19801
export const S44: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S44} />;
// ---------- S45: Subway car — Close-up; Mother's pill · timer 41
export const S45: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S45} />;
// ---------- S46: Subway car — Close-up; Mother's pill · timer 42 → 41
export const S46: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S46} />;
// ---------- S47: Subway car — Medium; Baby · timer 19801
export const S47: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S47} />;
// ---------- S48: Subway car — Medium; You · timer 41 / 19801
export const S48: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S48} />;
// ---------- S49: Street — Medium; You · timer —
export const S49: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S49} />;
// ---------- S50: Gym door — Medium; You, Mr. Ortiz, boxes · timer 9412
export const S50: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S50} />;
// ---------- S51: Street — Medium; You · timer —
export const S51: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S51} />;
// ---------- S52: Cafeteria — Wide; Crowd · timer many pills
export const S52: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S52} />;
// ---------- S53: Cafeteria — Wide; Crowd pills · timer big numbers
export const S53: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S53} />;
// ---------- S54: Cafeteria — Medium; You looking away · timer small numbers
export const S54: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S54} />;
// ---------- S55: Cafeteria — Close-up; You · timer —
export const S55: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S55} />;
// ---------- S56: Cafeteria — Medium; Sam, Maya · timer bright pills
export const S56: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S56} />;
// ---------- S57: Cafeteria — Medium; Strangers · timer dim pills
export const S57: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S57} />;
// ---------- S58: Cafeteria — Close-up; You · timer bright pills
export const S58: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S58} />;
// ---------- S59: Cafeteria — Medium; You · timer —
export const S59: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S59} />;
// ---------- S60: Cafeteria — Medium; You · timer —
export const S60: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S60} />;
// ---------- S61: Cafeteria — Close-up; You · timer —
export const S61: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S61} />;
// ---------- S62: Starry void — Medium; You · timer —
export const S62: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S62} />;
// ---------- S63: Starry void — Close-up; You · timer —
export const S63: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S63} />;
// ---------- S64: Starry void — Wide; Dot grid (100,000 dots) · timer —
export const S64: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S64} />;
// ---------- S65: Starry void — Wide; Dot grid · timer —
export const S65: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S65} />;
// ---------- S66: Starry void — Medium; You, dots · timer —
export const S66: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S66} />;
// ---------- S67: Starry void — Wide; Dot grid · timer —
export const S67: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S67} />;
// ---------- S68: Starry void — Close-up; Two pills · timer 19801 / 14
export const S68: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S68} />;
// ---------- S69: Starry void — Medium; You · timer —
export const S69: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S69} />;
// ---------- S70: Starry void — Close-up; You · timer —
export const S70: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S70} />;
// ---------- S71: Starry void — Medium; You · timer —
export const S71: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S71} />;
// ---------- S72: Starry void — Medium; You · timer —
export const S72: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S72} />;
// ---------- S73: Starry void — Medium; You · timer —
export const S73: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S73} />;
// ---------- S74: Starry void — Medium; You · timer —
export const S74: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S74} />;
// ---------- S75: Starry void — Close-up; You · timer —
export const S75: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S75} />;
// ---------- S76: Starry void — Medium; You · timer —
export const S76: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S76} />;
// ---------- S77: Starry void — Close-up; You · timer —
export const S77: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S77} />;
// ---------- S78: Starry void — Medium; You · timer —
export const S78: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S78} />;
// ---------- S79: School hallway — Medium; You · timer —
export const S79: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S79} />;
// ---------- S80: School hallway — Medium; You, Sam · timer 15204
export const S80: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S80} />;
// ---------- S81: School hallway — Close-up; You · timer 15204
export const S81: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S81} />;
// ---------- S82: School hallway — Two-shot; You, Sam · timer 15204
export const S82: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S82} />;
// ---------- S83: School hallway — Close-up; Sam · timer 15204
export const S83: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S83} />;
// ---------- S84: School hallway — Close-up; Sam · timer 15204
export const S84: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S84} />;
// ---------- S85: Classroom — Medium; Sam's empty desk · timer —
export const S85: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S85} />;
// ---------- S86: Classroom — Close-up; Sam · timer 15204
export const S86: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S86} />;
// ---------- S87: Classroom — Medium; You · timer —
export const S87: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S87} />;
// ---------- S88: Classroom — Close-up; You · timer —
export const S88: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S88} />;
// ---------- S89: School hallway — Medium; You, phone · timer —
export const S89: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S89} />;
// ---------- S90: School hallway — Medium; You, Sam passing · timer 15204
export const S90: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S90} />;
// ---------- S91: School hallway — Medium; You · timer 14
export const S91: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S91} />;
// ---------- S92: School hallway — Wide; You, long way round · timer —
export const S92: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S92} />;
// ---------- S93: Library — Medium; You alone · timer —
export const S93: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S93} />;
// ---------- S94: Cafeteria — Wide; You · timer —
export const S94: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S94} />;
// ---------- S95: Cafeteria — Medium; You, big-number kids · timer big pills
export const S95: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S95} />;
// ---------- S96: Cafeteria — Medium; You · timer —
export const S96: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S96} />;
// ---------- S97: Cafeteria — Close-up; You · timer —
export const S97: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S97} />;
// ---------- S98: Cafeteria — Close-up; You · timer —
export const S98: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S98} />;
// ---------- S99: Cafeteria — Medium; You alone · timer —
export const S99: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S99} />;
// ---------- S100: Bedroom — Close-up; You in the dark · timer pills through ceiling
export const S100: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S100} />;
// ---------- S101: Bedroom — Medium; You, mirror · timer —
export const S101: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S101} />;
// ---------- S102: Bedroom — Extreme close-up; Mirror (empty above head) · timer — (blank)
export const S102: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S102} />;
// ---------- S103: Bedroom — Medium; You on chair, phone · timer — (blank)
export const S103: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S103} />;
// ---------- S104: Bedroom — Medium; You, Sam · timer — (blank)
export const S104: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S104} />;
// ---------- S105: Bedroom — Close-up; Sam · timer — (blank)
export const S105: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S105} />;
// ---------- S106: Bathroom — Medium; You · timer — (blank)
export const S106: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S106} />;
// ---------- S107: Bedroom — Close-up; Old photos · timer — (blank)
export const S107: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S107} />;
// ---------- S108: Rooftop — Wide; City numbers · timer many pills
export const S108: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S108} />;
// ---------- S109: Rooftop — Close-up; You · timer — (blank)
export const S109: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S109} />;
// ---------- S110: Rooftop — Extreme close-up; You · timer — (blank)
export const S110: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S110} />;
// ---------- S111: School hallway — Medium; You · timer —
export const S111: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S111} />;
// ---------- S112: School hallway — Medium; You, suit man · timer 8912 (dim)
export const S112: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S112} />;
// ---------- S113: School hallway — Close-up; Suit man's pill, dim · timer 8912 (dim)
export const S113: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S113} />;
// ---------- S114: School hallway — Extreme close-up; Pill only · timer 8912 (dim)
export const S114: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S114} />;
// ---------- S115: Café — Medium; You · timer —
export const S115: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S115} />;
// ---------- S116: Café — Close-up; Faint pill · timer 12403 (faint)
export const S116: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S116} />;
// ---------- S117: Home — Close-up; You · timer —
export const S117: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S117} />;
// ---------- S118: Home — Extreme close-up; Pill burning bright · timer 14
export const S118: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S118} />;
// ---------- S119: Home — Close-up; You · timer —
export const S119: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S119} />;
// ---------- S120: Home — Medium; You · timer —
export const S120: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S120} />;
// ---------- S121: Home — Medium; You · timer —
export const S121: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S121} />;
// ---------- S122: Home — Close-up; You · timer —
export const S122: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S122} />;
// ---------- S123: Home — Medium; You · timer —
export const S123: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S123} />;
// ---------- S124: Home — Medium; You · timer —
export const S124: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S124} />;
// ---------- S125: Home — Wide; Memory flashes: barista, mother, baby, Sam, Maya, Mr. Ortiz · timer 12403 / 41 / 19801 / 15204 / 17842 / 9412
export const S125: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S125} />;
// ---------- S126: Home — Close-up; You · timer —
export const S126: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S126} />;
// ---------- S127: Home — Close-up; You · timer —
export const S127: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S127} />;
// ---------- S128: Home — Extreme close-up; You · timer —
export const S128: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S128} />;
// ---------- S129: School hallway — Medium; You, Sam · timer —
export const S129: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S129} />;
// ---------- S130: Street — Wide; You walking · timer —
export const S130: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S130} />;
// ---------- S131: Diner booth — Medium wide; You, sister · timer 14
export const S131: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S131} />;
// ---------- S132: Diner booth — Medium; Sister · timer 14
export const S132: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S132} />;
// ---------- S133: Diner booth — Medium; You sitting · timer 14
export const S133: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S133} />;
// ---------- S134: Diner booth — Close-up; You · timer 14
export const S134: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S134} />;
// ---------- S135: Diner booth — Close-up; Sister · timer 14
export const S135: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S135} />;
// ---------- S136: Diner booth — Close-up; Sister · timer 14
export const S136: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S136} />;
// ---------- S137: Diner booth — Extreme close-up; Sister's pill · timer 14
export const S137: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S137} />;
// ---------- S138: Diner booth — Medium; You · timer 14
export const S138: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S138} />;
// ---------- S139: Diner booth — Two-shot; You, sister · timer 14
export const S139: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S139} />;
// ---------- S140: Diner booth — Close-up; Sister laughing · timer 14
export const S140: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S140} />;
// ---------- S141: Diner booth — Medium; You, sister · timer 14
export const S141: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S141} />;
// ---------- S142: Diner booth — Medium; Sister talking · timer 14
export const S142: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S142} />;
// ---------- S143: Diner booth — Close-up; You · timer 14
export const S143: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S143} />;
// ---------- S144: Diner booth — Medium; You, sister · timer 14
export const S144: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S144} />;
// ---------- S145: Diner booth — Close-up; You · timer 14
export const S145: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S145} />;
// ---------- S146: Diner booth — Medium; You, sister · timer 14
export const S146: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S146} />;
// ---------- S147: Diner booth — Close-up; You · timer —
export const S147: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S147} />;
// ---------- S148: Diner booth — Close-up; You, sister · timer 14
export const S148: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S148} />;
// ---------- S149: Diner booth — Medium; You, sister · timer 14
export const S149: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S149} />;
// ---------- S150: Cafeteria — Medium; You, Sam, Maya · timer —
export const S150: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S150} />;
// ---------- S151: Street — Wide; City numbers · timer many pills
export const S151: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S151} />;
// ---------- S152: Street — Wide; You, sister walking · timer —
export const S152: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S152} />;
// ---------- S153: Street — Wide; You, sister walking · timer —
export const S153: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S153} />;
// ---------- S154: Street — Wide; You, sister walking · timer —
export const S154: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S154} />;
// ---------- S155: Street — Wide; You, sister, comment-box end card · timer —
export const S155: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S155} />;
