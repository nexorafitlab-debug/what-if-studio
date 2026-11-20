import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, clamp, FONT, Look, Expr,
  Study, Rooftop, TitleCard, camT, ShotProps,
  Kitchen, KitchenIsland, Classroom, Stairwell, Bathroom, Schematic,
  NightSky, Stars, Mug, Phone,
} from '../../engine';

/* MoneyCount30sV2 — 'What If You Could See How Much Money Everyone Has?' (9 shots, v2 sample).
   Data-driven: one SPECS table + one generic renderer (death-count-full pattern).
   The balance pill: small dark pill, coloured outline, white bold $ text, tiny
   downward pointer, ~1/6 head diameter above the head. NEVER above the hero's
   own head (not in mirrors either). Camera STATIC inside shots; the ONE slow
   push-in is S121, the gold $8,412,009 reveal. grain: false in index.tsx. */

const BLACK = '#0D0D12';
const GREEN = '#3ED598';
const ORANGE = '#FF8A3D';
const RED = '#FF3344';
const GOLD = '#FFC845';
const WHITE = '#F6EFE3';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

/* Black round heads, white dot eyes, thin stick limbs, flat coloured tops. */
const HERO: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8722A', '#C25E20', '#FFC845');
const HALE: Look = mkLook('#7A5A8A', '#62466E', '#E9C46A', 'bob');
const MAYA: Look = mkLook('#3E8C86', '#2F6E69', '#F28C6A', 'bunches');
const DEREK: Look = mkLook('#A8323E', '#8A2832', '#FFC845');
const ELLIS: Look = mkLook('#6B7A5A', '#55614A', '#E9C46A');
const PARK: Look = mkLook('#D97A8C', '#B85F70', '#F6EFE3', 'bob');
const GRANT: Look = mkLook('#2B2F3A', '#20232C', '#A8323E', 'suit', '#14151A');
const MOM: Look = mkLook('#8A5A6A', '#704858', '#E9C46A', 'bob');
const KID1: Look = mkLook('#5E6E46', '#4C5A38', '#E9C46A');
const KID2: Look = mkLook('#6A5A8A', '#52446E', '#E9C46A');
const KID3: Look = mkLook('#B08A2E', '#8F7024', '#F6EFE3');

const LOOKMAP: Record<string, Look> = {
  hero: HERO, sam: SAM, hale: HALE, maya: MAYA, derek: DEREK, ellis: ELLIS,
  park: PARK, grant: GRANT, mom: MOM, kid1: KID1, kid2: KID2, kid3: KID3,
};

type TickSpec = { values: string[]; step: number; flash?: string };
type GrowSpec = { base: number; rate: number };
type CharSpec = {
  look: string; x: number; y: number; scale: number; facing?: 1 | -1; expr?: Expr;
  exprs?: [number, Expr][]; pill?: string; outline?: string; pulse?: boolean; glow?: boolean;
  tick?: TickSpec; grow?: GrowSpec; walk?: boolean;
  armR?: { a: number; b: number }; armL?: { a: number; b: number };
};
type PillSpec = {
  x: number; y: number; n: string; outline: string; s?: number;
  pulse?: boolean; glow?: boolean; dim?: boolean; tick?: TickSpec; grow?: GrowSpec;
};
type Spec = {
  kind: string; set: string; size: string; zoom: number; cx: number; cy: number;
  chars: CharSpec[]; pills: PillSpec[]; seed: number;
  banner?: string; redLabel?: string; title?: [string, string]; accent?: string;
  titleSize?: number; titleY?: number;
  macro?: { n?: string; lines?: string[]; outline: string; s?: number; curve?: boolean; glow?: boolean };
  textLines?: string[]; art?: string; prop?: string; propAt?: [number, number]; propS?: number;
  mugs?: [number, number][]; fries?: [number, number][]; bill?: [number, number];
  phone?: [number, number];
  pop?: { x: number; y: number; n: string; color: string; from?: number; s?: number };
  tag?: { x: number; y: number; text: string };
  pushIn?: boolean; island?: boolean; night?: boolean; veil?: number;
};

/* The balance pill. `tick` steps through values (flashing `flash` on each move);
   `grow` counts a number up from `base`. `glow` is the gold Ellis halo. */
const Count: React.FC<{ x: number; y: number; n: string; t: number; outline: string; pulse?: boolean; glow?: boolean; s?: number; tick?: TickSpec; grow?: GrowSpec; dim?: boolean }> = ({
  x, y, n, t, outline, pulse = false, glow = false, s = 1, tick, grow, dim = false,
}) => {
  let label = n;
  let stroke = outline;
  if (tick) {
    const idx = Math.min(tick.values.length - 1, Math.floor(t / tick.step));
    label = tick.values[idx];
    if (idx > 0 && tick.flash && t - idx * tick.step < 8) stroke = tick.flash;
  }
  if (grow) label = '$' + (grow.base + Math.floor(t * grow.rate)).toLocaleString('en-US');
  const w = 36 + label.length * 20;
  const o = (pulse ? 0.75 + 0.25 * Math.sin(t / 4) : 1) * (dim ? 0.45 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {glow ? <rect x={-w / 2 - 16} y={-40} width={w + 32} height={80} rx={40} fill={outline} opacity={0.22} /> : null}
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill="#0E0C1E" stroke={stroke} strokeWidth={3} />
      <polygon points="-10,20 10,20 0,34" fill="#0E0C1E" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {label}
      </text>
    </g>
  );
};

/** Where a pill sits above a character's head: pointer tip ~1/6 head diameter above the head top. */
const above = (p: { x: number; y: number; scale: number }) => ({ x: p.x, y: p.y - 295 * p.scale });

/** Small pop pill, e.g. "+$4" / "-$2" — money moving. */
const PopPill: React.FC<{ x: number; y: number; n: string; t: number; from: number; color: string; s?: number }> = ({
  x, y, n, t, from, color, s = 1,
}) => {
  const k = Math.min(1, Math.max(0, (t - from) / 6));
  if (k <= 0) return null;
  const w = 30 + n.length * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * k)})`} opacity={k}>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={20} fill="#0E0C1E" stroke={color} strokeWidth={3} />
      <text x={0} y={9} fontFamily={FONT.title} fontWeight={700} fontSize={24} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
    </g>
  );
};

/** Yellow ALL-CAPS banner, top-centre — the genre's beat label. Pops on at t=2. */
const Banner: React.FC<{ text: string; y?: number; t: number }> = ({ text, y = 130, t }) => {
  const k = Math.min(1, Math.max(0, (t - 2) / 8));
  if (k <= 0) return null;
  const w = text.length * 26 + 60;
  return (
    <g transform={`translate(960 ${y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
      <rect x={-w / 2} y={-32} width={w} height={64} rx={10} fill="#FFD23F" />
      <text x={0} y={13} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill="#14101E" textAnchor="middle" letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** Small red label for warnings, e.g. NOTHING ABOVE YOUR HEAD. */
const RedLabel: React.FC<{ text: string; y?: number; t: number; from?: number }> = ({ text, y = 130, t, from = 2 }) => {
  const k = Math.min(1, Math.max(0, (t - from) / 8));
  if (k <= 0) return null;
  return (
    <g transform={`translate(960 ${y})`} opacity={k}>
      <text fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={RED} textAnchor="middle" letterSpacing={6}>
        {text}
      </text>
    </g>
  );
};

/** A small price-tag pop — the hero pricing a stranger (S100). */
const PriceTag: React.FC<{ x: number; y: number; text: string; t: number }> = ({ x, y, text, t }) => {
  const k = Math.min(1, Math.max(0, (t - 8) / 6));
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(-12) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <path d="M -50 -24 L 30 -24 L 56 0 L 30 24 L -50 24 Z" fill="#FFD23F" stroke="#14101E" strokeWidth={3} />
      <circle cx={36} cy={0} r={6} fill="#14101E" />
      <text x={-8} y={9} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#14101E" textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

/* ------------------------- small hand-drawn props ------------------------- */
const Fries: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-30 + i * 14} y={-64 - (i % 2) * 10} width={10} height={56} rx={3} fill="#FFD23F" stroke="#D9A41F" strokeWidth={2} />)}
    <path d="M -40 -20 L 40 -20 L 32 40 L -32 40 Z" fill="#D9534F" stroke="#8A2832" strokeWidth={3} />
  </g>
);

const Bill5: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = -8 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-70} y={-35} width={140} height={70} rx={6} fill="#7AB648" stroke="#4C7A2E" strokeWidth={3} />
    <circle cx={0} cy={0} r={20} fill="#E9F2D2" />
    <text x={0} y={8} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#4C7A2E" textAnchor="middle">5</text>
  </g>
);

const Notebook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-100} width={300} height={200} rx={10} fill="#E9E2D2" />
    <rect x={-140} y={-90} width={134} height={180} rx={6} fill="#F6F1E6" />
    <rect x={6} y={-90} width={134} height={180} rx={6} fill="#F6F1E6" />
    <path d="M -100 -40 Q -60 -70 -20 -30 Q 20 -60 60 -20" stroke="#3E8C86" strokeWidth={5} fill="none" strokeLinecap="round" />
    <circle cx={60} cy={40} r={22} fill="none" stroke="#FF8A3D" strokeWidth={4} />
  </g>
);

const ShoeFive: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform="rotate(-12)"><Bill5 x={0} y={-34} rot={0} /></g>
    <path d="M -70 0 L 60 0 Q 90 0 90 26 L 90 40 L -80 40 Q -90 40 -90 20 Z" fill="#A8323E" stroke="#121019" strokeWidth={4} />
    <rect x={-90} y={40} width={180} height={12} rx={6} fill="#F6EFE3" />
  </g>
);

/** Ellis's mop, bucket and worn shoes — forty years of the same motion (S120). */
const Mop: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 60 L 90 60 L 70 150 L -70 150 Z" fill="#5A6E8A" stroke="#2A3446" strokeWidth={4} />
    <ellipse cx={0} cy={60} rx={90} ry={16} fill="#7A94B8" />
    <line x1={60} y1={-160} x2={-40} y2={140} stroke="#8A6A3A" strokeWidth={12} strokeLinecap="round" />
    <path d="M -70 130 L -10 130 L -20 180 L -60 180 Z" fill="#C9C2B2" stroke="#8A8474" strokeWidth={3} />
    <path d="M -190 190 L -110 190 Q -90 190 -90 210 L -90 222 L -200 222 Q -210 222 -210 206 Z" fill="#3A3446" stroke="#121019" strokeWidth={4} />
    <path d="M 110 190 L 190 190 Q 210 190 210 210 L 210 222 L 100 222 Q 90 222 90 206 Z" fill="#3A3446" stroke="#121019" strokeWidth={4} />
  </g>
);

/** Derek's empty wallet, receipts spilling (S134). */
const Wallet: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-70} width={300} height={150} rx={18} fill="#5A3A2E" stroke="#2A1A14" strokeWidth={4} />
    <rect x={-150} y={-70} width={300} height={50} rx={18} fill="#6E4636" />
    <rect x={40} y={-20} width={90} height={60} rx={8} fill="#F6EFE3" />
    <text x={85} y={20} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#5A3A2E" textAnchor="middle">$0</text>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-120 + i * 30} ${-140 - i * 18}) rotate(${-8 + i * 8})`}>
        <rect x={-45} y={-60} width={90} height={120} rx={4} fill="#F6F1E6" stroke="#C9C2B2" strokeWidth={2} />
        <rect x={-32} y={-40} width={64} height={8} fill="#8A8474" />
        <rect x={-32} y={-22} width={44} height={6} fill="#B8B2A2" />
      </g>
    ))}
  </g>
);

/** Derek's scuffed new shoes hurrying past a shop window (S135). */
const ShopShoes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-320} y={-260} width={640} height={300} rx={12} fill="#1E2A44" stroke="#4A4460" strokeWidth={5} />
    <rect x={-300} y={-240} width={280} height={260} fill="#2E3A55" />
    <circle cx={-160} cy={-110} r={50} fill="#FFC27A" opacity={0.5} />
    <rect x={40} y={-240} width={260} height={260} fill="#2E3A55" />
    <rect x={60} y={-180} width={80} height={140} rx={8} fill="#A8323E" opacity={0.8} />
    <path d="M -120 60 L -10 60 Q 20 60 20 90 L 20 110 L -130 110 Q -140 110 -140 90 Z" fill="#A8323E" stroke="#121019" strokeWidth={4} />
    <path d="M 30 60 L 140 60 Q 170 60 170 90 L 170 110 L 20 110 Q 10 110 10 90 Z" fill="#8A2832" stroke="#121019" strokeWidth={4} />
    <rect x={-140} y={110} width={150} height={10} rx={5} fill="#F6EFE3" opacity={0.8} />
    <rect x={10} y={110} width={160} height={10} rx={5} fill="#F6EFE3" opacity={0.8} />
  </g>
);

/** The photograph on Ellis's cart — his mother, young, smiling (S129/S130). */
const Photo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-200} width={320} height={400} rx={10} fill="#F4F1EA" stroke="#8A7FA8" strokeWidth={4} />
    <rect x={-140} y={-180} width={280} height={280} fill="#2A2440" />
    <circle cx={0} cy={-60} r={58} fill="#0D0D12" />
    <circle cx={-20} cy={-64} r={7} fill="#FFFFFF" />
    <circle cx={20} cy={-64} r={7} fill="#FFFFFF" />
    <path d="M -18 -34 Q 0 -26 18 -34" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M -90 100 Q 0 20 90 100 L 90 100 L -90 100 Z" fill="#7A5A8A" />
    <text x={0} y={160} fontFamily={FONT.title} fontWeight={600} fontSize={26} fill="#5A4A3A" textAnchor="middle">MOM, 1968</text>
  </g>
);

/** The snack machine (S47). */
const Machine: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-320} width={260} height={560} rx={16} fill="#3A4A6A" stroke="#1E2A44" strokeWidth={5} />
    <rect x={-105} y={-290} width={210} height={300} rx={8} fill="#101A2A" stroke="#4A4460" strokeWidth={3} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
      <rect key={`${r}${c}`} x={-90 + c * 70} y={-270 + r * 95} width={52} height={70} rx={6} fill={['#D9534F', '#F2C230', '#3E8C86'][c]} opacity={0.85} />
    )))}
    <rect x={-105} y={60} width={210} height={70} rx={8} fill="#0E0C1E" stroke="#4A4460" strokeWidth={3} />
    <rect x={-40} y={160} width={80} height={50} rx={6} fill="#2A2440" stroke="#FFC845" strokeWidth={3} />
  </g>
);

/** The janitor's cart — Mrs. Hale leaves a coffee on it (S38/S113/S124). */
const Cart: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-140} y={-40} width={280} height={130} rx={12} fill="#5A6E46" stroke="#2A3446" strokeWidth={4} />
    <rect x={-140} y={-40} width={280} height={30} rx={12} fill="#6E8A56" />
    <circle cx={-100} cy={110} r={22} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <circle cx={100} cy={110} r={22} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <line x1={140} y1={-20} x2={190} y2={-90} stroke="#8A8474" strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** A wallet opening, cash inside, a bank card beside it (S17/S18). */
const WalletCard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-60} width={220} height={140} rx={16} fill="#5A3A2E" stroke="#2A1A14" strokeWidth={4} />
    <rect x={-160} y={-30} width={60} height={40} rx={6} fill="#7AB648" />
    <rect x={60} y={-90} width={190} height={120} rx={12} fill="#2E6FF0" stroke="#1E4FB0" strokeWidth={4} transform="rotate(8 155 -30)" />
    <rect x={80} y={-70} width={60} height={44} rx={6} fill="#FFC845" transform="rotate(8 110 -48)" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-120 + i * 46} cy={-110 - i * 8} r={20} fill="#FFC845" stroke="#D9A41F" strokeWidth={3} />)}
  </g>
);

/** A coin dropping the instant money moves (S21). */
const Coin: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const dy = kf(t, [[0, -120], [20, 60]]);
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s})`}>
      <circle r={26} fill="#FFC845" stroke="#D9A41F" strokeWidth={4} />
      <text y={9} fontFamily={FONT.title} fontWeight={700} fontSize={28} fill="#8A6A1A" textAnchor="middle">$</text>
    </g>
  );
};

const CoinStack: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-i * 16} rx={46 - i * 2} ry={12} fill="#FFC845" stroke="#D9A41F" strokeWidth={3} />)}
  </g>
);

/** Derek's brand-new shoes (S53). */
const Shoes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -130 0 L -20 0 Q 10 0 10 30 L 10 50 L -140 50 Q -150 50 -150 30 Z" fill="#F6EFE3" stroke="#121019" strokeWidth={4} />
    <path d="M 20 0 L 130 0 Q 160 0 160 30 L 160 50 L 10 50 Q 0 50 0 30 Z" fill="#E9E2D2" stroke="#121019" strokeWidth={4} />
    <rect x={-150} y={50} width={160} height={12} rx={6} fill="#A8323E" />
    <rect x={0} y={50} width={160} height={12} rx={6} fill="#A8323E" />
  </g>
);

/* ------------------------- dark-void infographics ------------------------- */
const HeadDot: React.FC<{ x: number; y: number; r: number; blank?: boolean }> = ({ x, y, r, blank = false }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={BLACK} stroke="#3A3446" strokeWidth={3} />
    {!blank ? (
      <g>
        <circle cx={x - r * 0.32} cy={y - r * 0.1} r={r * 0.11} fill="#FFFFFF" />
        <circle cx={x + r * 0.32} cy={y - r * 0.1} r={r * 0.11} fill="#FFFFFF" />
        <path d={`M ${x - r * 0.25} ${y + r * 0.35} Q ${x} ${y + r * 0.45} ${x + r * 0.25} ${y + r * 0.35}`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

const Hand: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-70} y={-20} width={140} height={60} rx={30} fill="#26232F" stroke="#3A3446" strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-48 + i * 32} cy={-28} r={14} fill="#26232F" stroke="#3A3446" strokeWidth={3} />)}
  </g>
);

const Heart: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} opacity={o} d="M 0 28 C -8 12 -30 -2 -48 12 C -66 26 -48 52 0 84 C 48 52 66 26 48 12 C 30 -2 8 12 0 28 Z" fill={RED} />
);

const VoidArt: React.FC<{ art: string; t: number }> = ({ art, t }) => {
  switch (art) {
    case 'head-outline': // S66: a single head outline, no pill above it
      return <HeadDot x={960} y={470} r={130} />;
    case 'graph-climb': // S69: happiness climbs, then flattens
      return (
        <g>
          <path d="M 480 760 L 760 700 L 1040 560 L 1300 400 L 1560 400" stroke={GOLD} strokeWidth={8} fill="none" strokeLinecap="round" />
          <circle cx={480} cy={760} r={12} fill={WHITE} />
          <circle cx={1560} cy={400} r={12} fill={GOLD} />
          <text x={1560} y={320} fontFamily={FONT.title} fontWeight={700} fontSize={110} fill={GOLD} textAnchor="middle">?</text>
        </g>
      );
    case 'graph-flat': // S71: the $75,000 line goes flat
      return <line x1={480} y1={620} x2={1440} y2={620} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />;
    case 'coins-flat': // S72: coins pile higher beside a flat, unmoving smiley
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={700} cy={760 - i * 34} r={30} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          <circle cx={1250} cy={560} r={110} fill={BLACK} stroke="#3A3446" strokeWidth={4} />
          <circle cx={1210} cy={530} r={10} fill="#FFFFFF" />
          <circle cx={1290} cy={530} r={10} fill="#FFFFFF" />
          <line x1={1210} y1={610} x2={1290} y2={610} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case 'smiley-flat': // S73: the smiley stays exactly the same
      return (
        <g>
          <circle cx={960} cy={720} r={100} fill={BLACK} stroke="#3A3446" strokeWidth={4} />
          <circle cx={925} cy={690} r={10} fill="#FFFFFF" />
          <circle cx={995} cy={690} r={10} fill="#FFFFFF" />
          <line x1={925} y1={760} x2={995} y2={760} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case 'blank-head': // S82: the face beneath the spinning pill is blank
      return <HeadDot x={960} y={760} r={120} blank />;
    case 'hands-two': // S74: two hands holding out coins
      return (
        <g>
          <Hand x={700} y={700} rot={-8} />
          <Hand x={1220} y={700} rot={8} />
          {[0, 1, 2].map((i) => <circle key={i} cx={660 + i * 40} cy={620 - (i % 2) * 26} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          {[0, 1, 2].map((i) => <circle key={i} cx={1180 + i * 40} cy={620 - (i % 2) * 26} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
        </g>
      );
    case 'hands-split': // S75: one hand spends on itself, the other holds coins out
      return (
        <g>
          <HeadDot x={700} y={450} r={70} />
          <HeadDot x={1220} y={450} r={70} />
          {[0, 1].map((i) => <circle key={i} cx={660 + i * 50} cy={300} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          {[0, 1, 2].map((i) => <circle key={i} cx={1160 + i * 50} cy={300 - (i % 2) * 24} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          <Hand x={700} y={700} rot={-8} />
          <Hand x={1220} y={700} rot={8} />
        </g>
      );
    case 'hands-give': // S76: the second hand gives its coins away; that face lights up
      return (
        <g>
          <circle cx={1250} cy={450} r={120} fill={GOLD} opacity={0.18} />
          <HeadDot x={650} y={450} r={70} />
          <HeadDot x={1250} y={450} r={70} />
          <circle cx={kf(t, [[0, 700], [30, 1150]])} cy={320} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <circle cx={1180} cy={300} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <Hand x={650} y={700} rot={-8} />
          <Hand x={1250} y={700} rot={8} />
        </g>
      );
    case 'coins-flow': // S80: coins flow from one hand to another
      return (
        <g>
          <Hand x={600} y={700} rot={-8} />
          <Hand x={1320} y={700} rot={8} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={620 + i * 150} cy={520 - Math.sin((i / 4) * Math.PI) * 90} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          ))}
          <circle cx={kf(t, [[0, 620], [30, 1220]])} cy={430} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <circle cx={1320} cy={450} r={90} fill={GOLD} opacity={0.12} />
        </g>
      );
    case 'heads-row': // S81: pills above a row of heads, none showing a face
      return (
        <g>
          {[420, 660, 960, 1260, 1500].map((x, i) => (
            <HeadDot key={i} x={x} y={650} r={70} blank />
          ))}
          {([['$12,400', GREEN], ['$312', ORANGE], ['$86,000', GREEN], ['$40', RED], ['$0.00', RED]] as [string, string][]).map(([n, o], i) => (
            <Count key={i} x={[420, 660, 960, 1260, 1500][i]} y={500} n={n} t={t} outline={o} s={0.7} />
          ))}
        </g>
      );
    case 'heads-tiny': // S68: thousands of Americans, as tiny head outlines
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <HeadDot key={i} x={360 + i * 110} y={820} r={26} blank />
          ))}
        </g>
      );
    case 'line-75k': // S79: a green pill climbs to a gold line marked $75,000 and stops
      return (
        <g>
          <line x1={480} y1={620} x2={1440} y2={620} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />
          <text x={960} y={580} fontFamily={FONT.title} fontWeight={700} fontSize={40} fill={GOLD} textAnchor="middle">$75,000</text>
        </g>
      );
    case 'pillheart': { // S117: a pill and a heart side by side; the pill fades, the heart stays
      const fade = 1 - clamp((t - 10) / 20, 0, 1);
      return (
        <g>
          <g opacity={fade}>
            <Count x={700} y={480} n="$8,412,009" t={t} outline={GOLD} glow s={1.0} />
          </g>
          <Heart x={1220} y={420} s={1.2} />
        </g>
      );
    }
    default:
      return null;
  }
};

const Prop: React.FC<{ kind: string; at: [number, number]; s: number; t: number }> = ({ kind, at, s, t }) => {
  const [x, y] = at;
  switch (kind) {
    case 'notebook': return <Notebook x={x} y={y} s={s} />;
    case 'fries': return <Fries x={x} y={y} s={s} />;
    case 'bill': return <Bill5 x={x} y={y} />;
    case 'shoefive': return <ShoeFive x={x} y={y} s={s} />;
    case 'mop': return <Mop x={x} y={y} s={s} />;
    case 'wallet': return <Wallet x={x} y={y} s={s} />;
    case 'shopshoes': return <ShopShoes x={x} y={y} s={s} />;
    case 'photo': return <Photo x={x} y={y} s={s} />;
    case 'machine': return <Machine x={x} y={y} s={s} />;
    case 'cart': return <Cart x={x} y={y} s={s} />;
    case 'walletcard': return <WalletCard x={x} y={y} s={s} />;
    case 'coin': return <Coin x={x} y={y} t={t} s={s} />;
    case 'coinstack': return <CoinStack x={x} y={y} s={s} />;
    case 'shoes': return <Shoes x={x} y={y} s={s} />;
    default: return null;
  }
};

const Back: React.FC<{ spec: Spec; t: number }> = ({ spec, t }) => {
  const n = spec.seed;
  switch (spec.set) {
    case 'kitchen':
      return <Kitchen t={t} id={`k${n}`} veil={spec.veil ?? 0.3} />;
    case 'study':
      return <Study t={t} id={`s${n}`} veil={spec.veil ?? 0.44} night={spec.night ?? false} />;
    case 'classroom':
      return <Classroom t={t} id={`c${n}`} />;
    case 'stairwell':
      return <Stairwell t={t} id={`w${n}`} />;
    case 'rooftop':
      return <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />;
    case 'schematic':
      return <Schematic t={t} id={`sch${n}`} />;
    case 'bathroom':
      return <Bathroom />;
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
    { f: 0, p: { x: c.x, y: c.y, scale: c.scale, facing: c.facing ?? 1, headTilt: 0, armR: c.armR ?? { a: 18 + swing, b: -10 }, armL: c.armL ?? { a: 10 - swing, b: -8 }, legL: { a: c.walk ? swing : 5, b: 0 }, legR: { a: c.walk ? -swing : -5, b: 0 } } },
    { f: 24, p: { headTilt: (i % 2 ? -1 : 1) * 3, armR: c.armR ?? { a: 34 + swing, b: -8 } }, ease: easeOut },
    { f: 48, p: { headTilt: 0, armR: c.armR ?? { a: 20 + swing, b: -10 } } },
  ]);
  const head = above(pose);
  const faces: [number, Expr][] = c.exprs ?? [[0, c.expr ?? 'neutral']];
  return (
    <>
      <Hero look={LOOKMAP[c.look]} pose={{ ...pose, ...faceAt(t, faces) }} shadow={0} rimId="rimR" />
      {c.pill ? (
        <Count x={head.x} y={head.y} n={c.pill} t={t} outline={c.outline ?? WHITE} pulse={c.pulse} glow={c.glow} tick={c.tick} grow={c.grow} s={c.scale >= 1 ? 1 : 0.9} />
      ) : null}
    </>
  );
};

const Pill: React.FC<{ p: PillSpec; t: number }> = ({ p, t }) => (
  <Count x={p.x} y={p.y} n={p.n} t={t} outline={p.outline} pulse={p.pulse} glow={p.glow} dim={p.dim} tick={p.tick} grow={p.grow} s={p.s ?? 1} />
);

/* CAMERA IS STATIC inside every shot (Ifinite, measured) — except S121, the
   episode's ONE slow push-in on the gold $8,412,009 payoff reveal. */
const GenericShot: React.FC<ShotProps & { spec: Spec }> = ({ t, spec }) => {
  if (spec.kind === 'title') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        <Count x={960} y={300} n="$40" t={t} outline={WHITE} glow s={1.1} />
        <TitleCard t={t} lines={spec.title ?? ['', '']} accent={spec.accent} y={430} size={spec.titleSize ?? 72} />
      </g>
    );
  }
  if (spec.kind === 'macro') {
    const m = spec.macro ?? { outline: GOLD };
    const bg = spec.set === 'void' ? <Back spec={spec} t={t} /> : <g filter="url(#blur16)"><Back spec={spec} t={t} /></g>;
    return (
      <g transform={camT(960, 540, 1.0)}>
        {bg}
        {m.n ? <Count x={960} y={440} n={m.n} t={t} outline={m.outline} glow={m.glow} s={m.s ?? 2.2} /> : null}
        {m.lines ? m.lines.map((ln, i) => (
          <text key={i} x={960} y={m.n ? 720 + i * 80 : 420 + i * 90} fontFamily={FONT.title} fontWeight={700} fontSize={m.n ? 44 : 72} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 18px rgba(255,200,69,0.6))' }}>
            {ln}
          </text>
        )) : null}
        {m.curve ? <path d="M 560 780 Q 760 720 960 680 T 1360 630" stroke={GOLD} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
      </g>
    );
  }
  if (spec.kind === 'textcard') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        {spec.textLines?.map((ln, i) => (
          <text key={i} x={960} y={430 + i * 100} fontFamily={FONT.title} fontWeight={700} fontSize={i === 0 ? 76 : 64} fill={i === 0 ? WHITE : GOLD} textAnchor="middle" letterSpacing={4}>
            {ln}
          </text>
        ))}
        {spec.art ? <VoidArt art={spec.art} t={t} /> : null}
      </g>
    );
  }
  if (spec.kind === 'savings') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        <path d="M 420 820 L 700 780 L 960 700 L 1220 560 L 1500 340" stroke={GOLD} strokeWidth={8} fill="none" strokeLinecap="round" />
        <circle cx={1500} cy={340} r={14} fill={GOLD} />
        <text x={1500} y={280} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={GOLD} textAnchor="middle">$8,412,009</text>
        <text x={960} y={950} fontFamily={FONT.title} fontWeight={600} fontSize={36} fill={WHITE} textAnchor="middle" letterSpacing={4}>FORTY YEARS OF SAVING</text>
      </g>
    );
  }
  const z = spec.pushIn ? kf(t, [[0, spec.zoom], [60, spec.zoom * 1.12]], easeOut) : spec.zoom;
  const blurBg = spec.set !== 'void' && (spec.size === 'close-up' || spec.size === 'extreme close-up');
  return (
    <g transform={camT(spec.cx, spec.cy, z)}>
      {blurBg ? <g filter="url(#blur16)"><Back spec={spec} t={t} /></g> : <Back spec={spec} t={t} />}
      {spec.art ? <VoidArt art={spec.art} t={t} /> : null}
      {spec.prop ? <Prop kind={spec.prop} at={spec.propAt ?? [960, 750]} s={spec.propS ?? 1} t={t} /> : null}
      {spec.chars.map((c, i) => <Char key={i} c={c} t={t} i={i} />)}
      {spec.set === 'kitchen' && spec.island ? <KitchenIsland /> : null}
      {spec.mugs?.map(([x, y], i) => <Mug key={i} x={x} y={y} rot={0} f={t} />)}
      {spec.fries?.map(([x, y], i) => <Fries key={i} x={x} y={y} />)}
      {spec.bill ? <Bill5 x={spec.bill[0]} y={spec.bill[1]} /> : null}
      {spec.phone ? <Phone x={spec.phone[0]} y={spec.phone[1]} w={170} on={1} f={t} /> : null}
      {spec.pills.map((p, i) => <Pill key={i} p={p} t={t} />)}
      {spec.pop ? <PopPill x={spec.pop.x} y={spec.pop.y} n={spec.pop.n} t={t} from={spec.pop.from ?? 8} color={spec.pop.color} s={spec.pop.s ?? 1} /> : null}
      {spec.tag ? <PriceTag x={spec.tag.x} y={spec.tag.y} text={spec.tag.text} t={t} /> : null}
      {spec.banner ? <Banner text={spec.banner} t={t} /> : null}
      {spec.redLabel ? <RedLabel text={spec.redLabel} t={t} /> : null}
      {spec.title ? <TitleCard t={t} lines={spec.title} accent={spec.accent} y={spec.titleY ?? 200} size={spec.titleSize ?? 72} /> : null}
    </g>
  );
};

const SPECS: Record<string, Spec> = {
 "S1": {
  "kind": "scene",
  "set": "classroom",
  "size": "wide",
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 700,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1220,
    "y": 720,
    "scale": 0.95
   }
  ],
  "pills": [],
  "seed": 1
 },
 "S2": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 1000,
  "cy": 540,
  "chars": [
   {
    "look": "park",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$40",
    "outline": "#F6EFE3",
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 620,
    "scale": 0.85,
    "y": 780
   }
  ],
  "pills": [],
  "seed": 2
 },
 "S3": {
  "kind": "macro",
  "set": "classroom",
  "size": "macro insert",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 3,
  "macro": {
   "n": "$40",
   "outline": "#F6EFE3",
   "s": 2.4
  }
 },
 "S15": {
  "kind": "title",
  "set": "void",
  "size": "title",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 15,
  "title": [
   "WHAT IF YOU COULD SEE",
   "HOW MUCH MONEY EVERYONE HAS?"
  ],
  "accent": "MONEY",
  "titleSize": 72
 },
 "S24": {
  "kind": "scene",
  "set": "bathroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 640,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 640,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 24,
  "redLabel": "NOTHING ABOVE YOUR HEAD"
 },
 "S25": {
  "kind": "scene",
  "set": "bathroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 640,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 640,
    "exprs": [
     [
      0,
      "neutral"
     ],
     [
      25,
      "worried"
     ]
    ],
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 25
 },
 "S28": {
  "kind": "scene",
  "set": "kitchen",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "mom",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$86",
    "outline": "#FF3344",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 650,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 28,
  "island": true
 },
 "S29": {
  "kind": "scene",
  "set": "kitchen",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "mom",
    "facing": 1,
    "expr": "neutral",
    "pill": "$86",
    "outline": "#FF3344",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 29,
  "phone": [
   1060,
   660
  ]
 },
 "S30": {
  "kind": "scene",
  "set": "kitchen",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "mom",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 350,
    "n": "-$112",
    "outline": "#FF3344",
    "s": 1.6,
    "pulse": true
   }
  ],
  "seed": 30
 }
};

// ---------- S1: wide · classroom — 
export const S1: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S1} />;
// ---------- S2: close-up · classroom — 
export const S2: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S2} />;
// ---------- S3: macro insert · classroom — 
export const S3: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S3} />;
// ---------- S15: title · void — 
export const S15: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S15} />;
// ---------- S24: close-up · bathroom — 
export const S24: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S24} />;
// ---------- S25: close-up · bathroom — 
export const S25: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S25} />;
// ---------- S28: medium · kitchen — 
export const S28: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S28} />;
// ---------- S29: close-up · kitchen — 
export const S29: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S29} />;
// ---------- S30: extreme close-up · kitchen — 
export const S30: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S30} />;
