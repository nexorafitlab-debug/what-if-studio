import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, clamp, FONT, Look, Expr,
  Study, Rooftop, TitleCard, camT, ShotProps,
  Kitchen, KitchenIsland, Classroom, Stairwell, Bathroom, Schematic,
  NightSky, Stars, Mug, Phone,
} from '../../engine';

/* MoneyCount — 'What If You Could See How Much Money Everyone Has?' (158 shots).
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
        <TitleCard t={t} lines={spec.title ?? ['', '']} accent={spec.accent} y={430} size={100} />
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
 "S4": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "park",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "pill": "$40",
    "outline": "#FF3344",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 4
 },
 "S5": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1350,
    "y": 280,
    "n": "$40",
    "outline": "#FF3344",
    "s": 0.9
   }
  ],
  "seed": 5
 },
 "S6": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "park",
    "facing": 1,
    "expr": "neutral",
    "x": 1150,
    "pill": "$40",
    "outline": "#FF3344",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 500,
    "scale": 0.9,
    "y": 730
   }
  ],
  "pills": [],
  "seed": 6
 },
 "S7": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "park",
    "facing": 1,
    "expr": "neutral",
    "pill": "$40",
    "outline": "#FF3344",
    "tick": {
     "values": [
      "$40",
      "$44",
      "$48"
     ],
     "step": 10,
     "flash": "#3ED598"
    },
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 7
 },
 "S8": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "park",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$48",
    "outline": "#3ED598",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 500,
    "scale": 0.9,
    "y": 730
   }
  ],
  "pills": [],
  "seed": 8
 },
 "S9": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 850,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "x": 850,
    "armR": {
     "a": 60,
     "b": -30
    },
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 1200,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1450,
    "y": 300,
    "n": "$48",
    "outline": "#3ED598",
    "s": 0.9
   }
  ],
  "seed": 9
 },
 "S10": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "worried",
    "x": 850,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 1200,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 10
 },
 "S11": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 900,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 900,
    "armR": {
     "a": -80,
     "b": 0
    },
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1500,
    "y": 300,
    "n": "$48",
    "outline": "#3ED598",
    "s": 0.9
   }
  ],
  "seed": 11
 },
 "S12": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 1200,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [
   {
    "x": 1500,
    "y": 300,
    "n": "$48",
    "outline": "#3ED598",
    "s": 0.9
   }
  ],
  "seed": 12
 },
 "S13": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "exprs": [
     [
      0,
      "neutral"
     ],
     [
      25,
      "happy"
     ]
    ],
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1350,
    "y": 280,
    "n": "$48",
    "outline": "#3ED598",
    "s": 0.9
   }
  ],
  "seed": 13
 },
 "S14": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 420,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 700,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1150,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 730
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1500,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 14
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
  "accent": "MONEY"
 },
 "S16": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 850,
    "armR": {
     "a": -60,
     "b": -20
    },
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 16,
  "banner": "THE RULES"
 },
 "S17": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [
   {
    "x": 1300,
    "y": 350,
    "n": "$12,400",
    "outline": "#3ED598",
    "s": 1.0
   }
  ],
  "seed": 17,
  "prop": "walletcard",
  "propAt": [
   1300,
   680
  ]
 },
 "S18": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 320,
    "n": "$12,400",
    "outline": "#3ED598",
    "s": 1.3
   }
  ],
  "seed": 18,
  "prop": "walletcard",
  "propAt": [
   960,
   700
  ],
  "propS": 1.3,
  "pop": {
   "x": 1180,
   "y": 460,
   "n": "+$4",
   "color": "#3ED598"
  }
 },
 "S19": {
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
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 19
 },
 "S20": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [
   {
    "x": 1300,
    "y": 350,
    "n": "$312",
    "outline": "#FF8A3D",
    "s": 1.0
   }
  ],
  "seed": 20,
  "banner": "RULE TWO: IT TICKS",
  "pop": {
   "x": 1300,
   "y": 480,
   "n": "+$2",
   "color": "#3ED598"
  }
 },
 "S21": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 320,
    "n": "$212.50",
    "outline": "#FF8A3D",
    "s": 1.3
   }
  ],
  "seed": 21,
  "prop": "coin",
  "propAt": [
   960,
   620
  ],
  "pop": {
   "x": 1180,
   "y": 460,
   "n": "+$1",
   "color": "#3ED598"
  }
 },
 "S22": {
  "kind": "scene",
  "set": "void",
  "size": "medium wide",
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 450,
    "n": "$48",
    "outline": "#3ED598",
    "s": 1.3
   }
  ],
  "seed": 22,
  "banner": "MONEY IN = GREEN",
  "pop": {
   "x": 1180,
   "y": 580,
   "n": "+$4",
   "color": "#3ED598"
  }
 },
 "S23": {
  "kind": "scene",
  "set": "void",
  "size": "medium wide",
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 450,
    "n": "$48",
    "outline": "#FF3344",
    "s": 1.3
   }
  ],
  "seed": 23,
  "banner": "MONEY OUT = RED",
  "pop": {
   "x": 1180,
   "y": 580,
   "n": "-$4",
   "color": "#FF3344"
  }
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
 "S26": {
  "kind": "scene",
  "set": "bathroom",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [],
  "seed": 26
 },
 "S27": {
  "kind": "scene",
  "set": "bathroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 27
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
    "pill": " ",
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
    "pill": " ",
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
 },
 "S31": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$212.50",
    "outline": "#FF8A3D",
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
  "seed": 31
 },
 "S32": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "pill": "$212.50",
    "outline": "#FF8A3D",
    "tick": {
     "values": [
      "$212.50",
      "$210.00"
     ],
     "step": 12,
     "flash": "#FF3344"
    },
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 32
 },
 "S33": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "x": 900,
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 1200,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 33
 },
 "S34": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 34,
  "prop": "shoefive",
  "propAt": [
   960,
   880
  ]
 },
 "S35": {
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
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 35,
  "banner": "THE EXPERIMENT"
 },
 "S36": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hale",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 600,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 36
 },
 "S37": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hale",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 800,
    "scale": 1.0,
    "pill": "$12,400",
    "outline": "#3ED598"
   }
  ],
  "pills": [],
  "seed": 37,
  "mugs": [
   [
    850,
    700
   ],
   [
    1070,
    700
   ]
  ]
 },
 "S38": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hale",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 38,
  "prop": "cart",
  "propAt": [
   1350,
   750
  ]
 },
 "S39": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 39,
  "prop": "notebook",
  "propAt": [
   1000,
   830
  ],
  "propS": 0.8
 },
 "S40": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "pill": "$312",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 40,
  "prop": "notebook",
  "propAt": [
   960,
   880
  ],
  "propS": 1.2
 },
 "S41": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "happy",
    "x": 1250,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 41,
  "prop": "fries",
  "propAt": [
   1050,
   720
  ]
 },
 "S42": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "pill": "$212.50",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 42,
  "prop": "coinstack",
  "propAt": [
   1180,
   800
  ]
 },
 "S43": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "pill": "$212.50",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 43,
  "prop": "coinstack",
  "propAt": [
   1180,
   820
  ]
 },
 "S44": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "pill": "$212.50",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 44,
  "prop": "shoefive",
  "propAt": [
   960,
   880
  ]
 },
 "S45": {
  "kind": "scene",
  "set": "study",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "grant",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$86,000",
    "outline": "#3ED598",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 45
 },
 "S46": {
  "kind": "scene",
  "set": "study",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "grant",
    "facing": 1,
    "expr": "neutral",
    "pill": "$86,000",
    "outline": "#3ED598",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 46
 },
 "S47": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
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
  "seed": 47,
  "prop": "machine",
  "propAt": [
   1300,
   620
  ],
  "propS": 0.9
 },
 "S48": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 340,
    "n": "-$2",
    "outline": "#FF3344",
    "s": 1.2,
    "pulse": true
   }
  ],
  "seed": 48
 },
 "S49": {
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
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 49,
  "pop": {
   "x": 1000,
   "y": 480,
   "n": "-$2",
   "color": "#FF3344"
  }
 },
 "S50": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1400,
    "y": 300,
    "n": "$86,000",
    "outline": "#3ED598",
    "s": 0.9
   }
  ],
  "seed": 50
 },
 "S51": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 900,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "pill": "$48",
    "outline": "#3ED598",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 51
 },
 "S52": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
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
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1500,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 52
 },
 "S53": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 53,
  "prop": "shoes",
  "propAt": [
   960,
   900
  ]
 },
 "S54": {
  "kind": "scene",
  "set": "classroom",
  "size": "wide",
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 650,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1500,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 54
 },
 "S55": {
  "kind": "scene",
  "set": "classroom",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 380,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 2.4,
    "pulse": true
   }
  ],
  "seed": 55
 },
 "S56": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 850,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 850,
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "worried",
    "x": 1250,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 56
 },
 "S57": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "worried",
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 57
 },
 "S58": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 900,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 58
 },
 "S59": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "walk": true,
    "x": 560,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 450,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 59
 },
 "S60": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": -1,
    "expr": "neutral",
    "x": 1100,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 650,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 60
 },
 "S61": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 850,
    "scale": 1.3
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 300,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 1.6,
    "glow": true
   }
  ],
  "seed": 61
 },
 "S62": {
  "kind": "macro",
  "set": "void",
  "size": "macro insert",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 62,
  "macro": {
   "n": "$8,412,009",
   "outline": "#FFC845",
   "glow": true,
   "s": 2.2
  }
 },
 "S63": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 900,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 63
 },
 "S64": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 64
 },
 "S65": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 800,
    "scale": 0.7
   }
  ],
  "pills": [],
  "seed": 65,
  "banner": "THE SCIENCE"
 },
 "S66": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 66,
  "art": "head-outline",
  "redLabel": "THAT'S THE MADE-UP PART"
 },
 "S67": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 760,
    "y": 450,
    "n": "$12,400",
    "outline": "#3ED598",
    "s": 1.0
   },
   {
    "x": 1160,
    "y": 450,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 0.9,
    "glow": true
   }
  ],
  "seed": 67,
  "banner": "MONEY AND HAPPINESS?"
 },
 "S68": {
  "kind": "textcard",
  "set": "void",
  "size": "medium wide",
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 68,
  "textLines": [
   "KAHNEMAN & DEATON",
   "2010"
  ],
  "art": "heads-tiny"
 },
 "S69": {
  "kind": "scene",
  "set": "void",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 69,
  "art": "graph-climb"
 },
 "S70": {
  "kind": "macro",
  "set": "void",
  "size": "macro insert",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 70,
  "macro": {
   "n": "$75,000",
   "outline": "#FFC845",
   "glow": true,
   "s": 2.4,
   "curve": true
  }
 },
 "S71": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 400,
    "n": "$75,000",
    "outline": "#FFC845",
    "s": 1.2,
    "glow": true
   }
  ],
  "seed": 71,
  "art": "graph-flat",
  "redLabel": "THEN IT STOPS"
 },
 "S72": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 72,
  "art": "coins-flat"
 },
 "S73": {
  "kind": "scene",
  "set": "void",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 400,
    "n": "$75,000",
    "outline": "#FFC845",
    "s": 1.3,
    "glow": true,
    "grow": {
     "base": 75000,
     "rate": 137
    }
   }
  ],
  "seed": 73,
  "art": "smiley-flat"
 },
 "S74": {
  "kind": "textcard",
  "set": "void",
  "size": "medium wide",
  "zoom": 0.9,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 74,
  "textLines": [
   "DUNN, AKNIN & NORTON",
   "2008"
  ],
  "art": "hands-two"
 },
 "S75": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 75,
  "art": "hands-split"
 },
 "S76": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 76,
  "banner": "SPEND IT ON SOMEONE ELSE",
  "art": "hands-give"
 },
 "S77": {
  "kind": "macro",
  "set": "void",
  "size": "macro insert",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 77,
  "macro": {
   "lines": [
    "SPENDING ON OTHERS",
    "= HAPPIER"
   ],
   "outline": "#FFC845"
  }
 },
 "S78": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 760,
    "y": 450,
    "n": "$75,000",
    "outline": "#FFC845",
    "s": 1.0,
    "glow": true
   },
   {
    "x": 1160,
    "y": 450,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 0.8,
    "glow": true
   }
  ],
  "seed": 78,
  "banner": "TWO THINGS"
 },
 "S79": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 350,
    "n": "$75,000",
    "outline": "#3ED598",
    "s": 1.1
   }
  ],
  "seed": 79,
  "banner": "MONEY HELPS, UP TO A POINT",
  "art": "line-75k"
 },
 "S80": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 80,
  "banner": "GIVING FEELS BETTER",
  "art": "coins-flow"
 },
 "S81": {
  "kind": "scene",
  "set": "void",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 81,
  "art": "heads-row",
  "redLabel": "THEY ONLY SHOW THE MONEY"
 },
 "S82": {
  "kind": "scene",
  "set": "void",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 380,
    "n": "$75,000",
    "outline": "#FFC845",
    "s": 1.8,
    "glow": true,
    "grow": {
     "base": 75000,
     "rate": 200
    }
   }
  ],
  "seed": 82,
  "art": "blank-head"
 },
 "S83": {
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
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 83,
  "banner": "THE COST"
 },
 "S84": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "smug",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1400,
    "y": 300,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 0.9,
    "dim": true
   }
  ],
  "seed": 84
 },
 "S85": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "exprs": [
     [
      0,
      "smug"
     ],
     [
      30,
      "worried"
     ]
    ],
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 85
 },
 "S86": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "happy",
    "x": 700,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "happy",
    "x": 1400,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.9,
    "y": 730
   }
  ],
  "pills": [],
  "seed": 86
 },
 "S87": {
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
    "x": 500,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "y": 720,
    "scale": 0.95
   }
  ],
  "pills": [],
  "seed": 87
 },
 "S88": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 88
 },
 "S89": {
  "kind": "scene",
  "set": "classroom",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 380,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 2.4,
    "pulse": true
   }
  ],
  "seed": 89
 },
 "S90": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "worried",
    "x": 1000,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "happy",
    "x": 650,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "happy",
    "x": 1350,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 400,
    "scale": 0.9,
    "y": 730
   }
  ],
  "pills": [],
  "seed": 90
 },
 "S91": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "worried",
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "walk": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 91
 },
 "S92": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 850,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "shock",
    "x": 850,
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 1200,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 92
 },
 "S93": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 1250,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 93
 },
 "S94": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "exprs": [
     [
      0,
      "smug"
     ],
     [
      25,
      "worried"
     ]
    ],
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 94
 },
 "S95": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1400,
    "y": 300,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 0.8,
    "dim": true
   }
  ],
  "seed": 95
 },
 "S96": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "scale": 0.9,
    "pill": "<$100",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 96
 },
 "S97": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 850,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1500,
    "scale": 0.9,
    "pill": "<$100",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 97
 },
 "S98": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 700,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 700,
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "oops",
    "x": 1300,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 98
 },
 "S99": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 450,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 99
 },
 "S100": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 100,
  "tag": {
   "x": 1300,
   "y": 350,
   "text": "$"
  }
 },
 "S101": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 101
 },
 "S102": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 1350,
    "y": 300,
    "n": "$312",
    "outline": "#FF8A3D",
    "s": 0.9
   }
  ],
  "seed": 102
 },
 "S103": {
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
    "expr": "happy",
    "x": 700,
    "y": 720,
    "scale": 0.95
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$0.00",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 103
 },
 "S104": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "exprs": [
     [
      0,
      "happy"
     ],
     [
      25,
      "worried"
     ]
    ],
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 104
 },
 "S105": {
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
  "seed": 105,
  "redLabel": "STILL NOTHING"
 },
 "S106": {
  "kind": "scene",
  "set": "bathroom",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [],
  "seed": 106
 },
 "S107": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 850,
    "walk": true,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "walk": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 107
 },
 "S108": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 900,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 1250,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 108
 },
 "S109": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 109
 },
 "S110": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [
   {
    "x": 450,
    "y": 300,
    "n": "$12,400",
    "outline": "#3ED598",
    "s": 0.8,
    "dim": true
   },
   {
    "x": 1500,
    "y": 320,
    "n": "$312",
    "outline": "#FF8A3D",
    "s": 0.8,
    "dim": true
   }
  ],
  "seed": 110
 },
 "S111": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 111
 },
 "S112": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "worried",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 112
 },
 "S113": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hale",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$12,400",
    "outline": "#3ED598",
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
  "seed": 113,
  "prop": "cart",
  "propAt": [
   1350,
   780
  ],
  "mugs": [
   [
    1330,
    700
   ]
  ]
 },
 "S114": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "maya",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "happy",
    "x": 1250,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 114,
  "prop": "fries",
  "propAt": [
   1050,
   720
  ]
 },
 "S115": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "tired",
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 115
 },
 "S116": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [
   {
    "x": 450,
    "y": 300,
    "n": "$12,400",
    "outline": "#3ED598",
    "s": 0.8,
    "dim": true
   },
   {
    "x": 1500,
    "y": 320,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 0.8,
    "dim": true
   }
  ],
  "seed": 116
 },
 "S117": {
  "kind": "scene",
  "set": "void",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 117,
  "banner": "YOU DECIDED THEY MEANT WORTH",
  "art": "pillheart"
 },
 "S118": {
  "kind": "scene",
  "set": "stairwell",
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
    "walk": true,
    "y": 720,
    "scale": 0.95
   }
  ],
  "pills": [],
  "seed": 118
 },
 "S119": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": -1,
    "expr": "neutral",
    "x": 1100,
    "scale": 0.9,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 600,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 119
 },
 "S120": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 120,
  "prop": "mop",
  "propAt": [
   960,
   700
  ],
  "propS": 1.2
 },
 "S121": {
  "kind": "scene",
  "set": "stairwell",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 980,
    "scale": 1.5
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 360,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 2.2,
    "glow": true
   }
  ],
  "seed": 121,
  "pushIn": true
 },
 "S122": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "shock",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 122
 },
 "S123": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 123
 },
 "S124": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 124,
  "prop": "cart",
  "propAt": [
   1300,
   780
  ],
  "mugs": [
   [
    1280,
    700
   ]
  ]
 },
 "S125": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "happy",
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 125,
  "mugs": [
   [
    1150,
    700
   ]
  ]
 },
 "S126": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 126
 },
 "S127": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "happy",
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 127
 },
 "S128": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "happy",
    "x": 900,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 128,
  "banner": "WHAT THE NUMBER DOESN'T SAY"
 },
 "S129": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 1400,
    "y": 300,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 0.8,
    "glow": true
   }
  ],
  "seed": 129,
  "prop": "photo",
  "propAt": [
   960,
   520
  ]
 },
 "S130": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 1400,
    "y": 280,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 0.8,
    "glow": true
   }
  ],
  "seed": 130,
  "prop": "photo",
  "propAt": [
   960,
   500
  ],
  "propS": 1.2
 },
 "S131": {
  "kind": "savings",
  "set": "schematic",
  "size": "macro insert",
  "zoom": 1.0,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 131
 },
 "S132": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "walk": true,
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 132
 },
 "S133": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "worried",
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 133,
  "prop": "shoes",
  "propAt": [
   1150,
   900
  ]
 },
 "S134": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 300,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 1.2,
    "pulse": true
   }
  ],
  "seed": 134,
  "prop": "wallet",
  "propAt": [
   960,
   680
  ]
 },
 "S135": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [
   {
    "x": 960,
    "y": 300,
    "n": "$0.00",
    "outline": "#FF3344",
    "s": 1.0,
    "pulse": true
   }
  ],
  "seed": 135,
  "prop": "shopshoes",
  "propAt": [
   960,
   700
  ]
 },
 "S136": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 136
 },
 "S137": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 137
 },
 "S138": {
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
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 400,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 720
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1000,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid3",
    "facing": 1,
    "expr": "neutral",
    "x": 1300,
    "scale": 0.7,
    "pill": "$86,000",
    "outline": "#FF8A3D",
    "y": 720
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 1600,
    "scale": 0.7,
    "pill": "$40",
    "outline": "#3ED598",
    "y": 720
   }
  ],
  "pills": [],
  "seed": 138
 },
 "S139": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 139
 },
 "S140": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 850,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "maya",
    "facing": 1,
    "expr": "happy",
    "x": 1200,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 140,
  "prop": "fries",
  "propAt": [
   1000,
   720
  ]
 },
 "S141": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 850,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 141
 },
 "S142": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "x": 900,
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "neutral",
    "x": 1500,
    "scale": 0.9,
    "pill": "$0.00",
    "outline": "#FF3344",
    "pulse": true,
    "y": 730
   }
  ],
  "pills": [],
  "seed": 142
 },
 "S143": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "neutral",
    "pill": "$210.00",
    "outline": "#FF8A3D",
    "tick": {
     "values": [
      "$210.00",
      "$205.00"
     ],
     "step": 12,
     "flash": "#FF3344"
    },
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 143,
  "prop": "bill",
  "propAt": [
   1120,
   700
  ]
 },
 "S144": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 900,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "x": 900,
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "shock",
    "x": 1250,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 144,
  "prop": "bill",
  "propAt": [
   1050,
   700
  ]
 },
 "S145": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 700,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "x": 700,
    "y": 780,
    "scale": 1.25
   },
   {
    "look": "derek",
    "facing": 1,
    "expr": "shock",
    "x": 1350,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 145,
  "prop": "bill",
  "propAt": [
   960,
   620
  ]
 },
 "S146": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "derek",
    "facing": 1,
    "expr": "happy",
    "x": 1000,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "x": 700,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 146
 },
 "S147": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "sam",
    "facing": 1,
    "expr": "happy",
    "pill": "$205.00",
    "outline": "#FF8A3D",
    "x": 960,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 147,
  "prop": "shoefive",
  "propAt": [
   1150,
   880
  ]
 },
 "S148": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "walk": true,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1250,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 148
 },
 "S149": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 950,
    "scale": 1.4
   }
  ],
  "pills": [
   {
    "x": 960,
    "y": 350,
    "n": "$8,412,009",
    "outline": "#FFC845",
    "s": 1.6,
    "glow": true
   }
  ],
  "seed": 149
 },
 "S150": {
  "kind": "macro",
  "set": "stairwell",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [],
  "pills": [],
  "seed": 150,
  "macro": {
   "n": "$8,412,009",
   "outline": "#FFC845",
   "glow": true,
   "s": 2.2,
   "lines": [
    "EIGHT MILLION, FOUR HUNDRED AND TWELVE THOUSAND,",
    "AND NINE DOLLARS"
   ]
  }
 },
 "S151": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 151
 },
 "S152": {
  "kind": "scene",
  "set": "stairwell",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 800,
    "armR": {
     "a": -120,
     "b": -10
    },
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "ellis",
    "facing": 1,
    "expr": "neutral",
    "x": 1200,
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "armR": {
     "a": -120,
     "b": -10
    },
    "y": 730,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 152
 },
 "S153": {
  "kind": "scene",
  "set": "stairwell",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "ellis",
    "facing": 1,
    "expr": "happy",
    "pill": "$8,412,009",
    "outline": "#FFC845",
    "glow": true,
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 153
 },
 "S154": {
  "kind": "scene",
  "set": "classroom",
  "size": "close-up",
  "zoom": 1.15,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "happy",
    "x": 960,
    "y": 780,
    "scale": 1.25
   }
  ],
  "pills": [],
  "seed": 154
 },
 "S155": {
  "kind": "scene",
  "set": "classroom",
  "size": "extreme close-up",
  "zoom": 1.5,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 950,
    "scale": 1.5
   }
  ],
  "pills": [],
  "seed": 155,
  "banner": "THE NUMBER NEVER MEASURES WHAT A PERSON IS WORTH"
 },
 "S156": {
  "kind": "scene",
  "set": "classroom",
  "size": "medium",
  "zoom": 0.95,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 730,
    "scale": 1.0
   },
   {
    "look": "kid1",
    "facing": 1,
    "expr": "neutral",
    "x": 450,
    "scale": 0.7,
    "pill": "$12,400",
    "outline": "#3ED598",
    "y": 730
   },
   {
    "look": "kid2",
    "facing": 1,
    "expr": "neutral",
    "x": 1400,
    "scale": 0.7,
    "pill": "$312",
    "outline": "#FF8A3D",
    "y": 730
   }
  ],
  "pills": [],
  "seed": 156
 },
 "S157": {
  "kind": "scene",
  "set": "rooftop",
  "size": "wide",
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 760,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 157,
  "title": [
   "IF YOU COULD SEE ONE NUMBER,",
   "WHAT WOULD YOU WANT IT TO BE?"
  ],
  "titleSize": 64,
  "titleY": 200
 },
 "S158": {
  "kind": "scene",
  "set": "rooftop",
  "size": "wide",
  "zoom": 0.85,
  "cx": 960,
  "cy": 540,
  "chars": [
   {
    "look": "hero",
    "facing": 1,
    "expr": "neutral",
    "x": 960,
    "y": 760,
    "scale": 1.0
   }
  ],
  "pills": [],
  "seed": 158,
  "title": [
   "TELL US IN THE",
   "COMMENTS"
  ],
  "titleSize": 110,
  "titleY": 220
 }
};

// ---------- S1: wide · classroom — Wide cafeteria lunch line (classroom set reused as cafeteria); hero in blue hoodie mid-line, Sam beside him; n
export const S1: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S1} />;
// ---------- S2: close-up · classroom — Close-up: Mrs. Park the cashier at the till; a soft white $40 pill appears nearly touching her head; hero star
export const S2: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S2} />;
// ---------- S3: macro insert · classroom — Macro insert: the $40 pill HUGE, soft white, floating like a price tag; blurred cafeteria behind
export const S3: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S3} />;
// ---------- S4: medium · classroom — Medium: hero glances around the lunch line; nobody else looks up; Mrs. Park's $40 pill visible only to him; cr
export const S4: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S4} />;
// ---------- S5: close-up · classroom — Close-up: hero blinks, eyes shut then open; the $40 pill is still there above Mrs. Park; his face shifts to di
export const S5: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S5} />;
// ---------- S6: medium · classroom — Medium: Mrs. Park hands hero his tray and takes his lunch money; her $40 pill above her head; Sam behind hero 
export const S6: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S6} />;
// ---------- S7: close-up · classroom — Close-up: Mrs. Park's pill ticks $40 to $44 to $48, flashing green on each +$4 step; coins and tray on the cou
export const S7: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S7} />;
// ---------- S8: medium · classroom — Medium: hero watches the till, eyes wide; the $48 pill glows green above Mrs. Park; Sam nudges him
export const S8: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S8} />;
// ---------- S9: close-up · classroom — Close-up: Sam elbows hero in the ribs, grinning; hero startled; Mrs. Park's $48 pill behind them
export const S9: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S9} />;
// ---------- S10: medium · classroom — Medium: Sam leans in, worried; hero's face pale; lunch-line crowd behind, no numbers visible to Sam
export const S10: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S10} />;
// ---------- S11: close-up · classroom — Close-up: hero points up at Mrs. Park's $48 pill; Sam follows his finger, sees nothing; hero's face urgent
export const S11: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S11} />;
// ---------- S12: medium · classroom — Medium: Sam shrugs, confused, looks at the empty air above Mrs. Park; hero realises Sam can't see it
export const S12: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S12} />;
// ---------- S13: close-up · classroom — Close-up: hero's face, realisation dawning; the $48 pill glows above Mrs. Park behind him
export const S13: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S13} />;
// ---------- S14: medium · classroom — Medium: hero looks slowly around the cafeteria; a pill above every head, each a different value; his eyes wide
export const S14: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S14} />;
// ---------- S15: title · dark void — Title card on the dark void: glowing pill, then WHAT IF YOU COULD SEE / HOW MUCH MONEY EVERYONE HAS? in yellow
export const S15: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S15} />;
// ---------- S16: medium · classroom — Medium classroom: hero at his desk, Sam beside him; yellow banner THE RULES; hero holds up three fingers
export const S16: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S16} />;
// ---------- S17: medium · classroom — Medium: hero explains rule one; a wallet and bank-card icon pop beside a sample green pill
export const S17: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S17} />;
// ---------- S18: close-up · classroom — Close-up: a wallet opens, cash inside, a bank card beside it; a sample pill ticks as coins drop in
export const S18: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S18} />;
// ---------- S19: wide · classroom — Wide classroom: a pill above every student's head, all different values; hero scans the room, counting
export const S19: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S19} />;
// ---------- S20: medium · classroom — Medium: hero taps his watch; a sample pill ticks up and down; yellow banner RULE TWO: IT TICKS
export const S20: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S20} />;
// ---------- S21: close-up · classroom — Close-up: a pill ticks the instant a coin drops into a hand; money moves, number moves
export const S21: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S21} />;
// ---------- S22: medium wide · dark void — Rules on the void: a green pill climbs and flashes green as coins drop in; yellow banner MONEY IN = GREEN
export const S22: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S22} />;
// ---------- S23: medium wide · dark void — Rules on the void: a red pill drops and flashes red as coins fly out; yellow banner MONEY OUT = RED
export const S23: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S23} />;
// ---------- S24: close-up · bathroom — Close-up: hero at the bathroom mirror; his reflection has NO pill above its head; red label NOTHING ABOVE YOUR
export const S24: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S24} />;
// ---------- S25: close-up · bathroom — Close-up: hero looks up at the mirror, then at his own head; empty space above; his face falls
export const S25: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S25} />;
// ---------- S26: extreme close-up · bathroom — Extreme close-up: hero's eyes in the mirror; the space above his head is empty dark; no pill, no number
export const S26: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S26} />;
// ---------- S27: medium · bathroom — Medium: hero nods at his reflection, filing it away; determined face; toothbrush and towel behind
export const S27: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S27} />;
// ---------- S28: medium · kitchen — Medium home kitchen at night: Mom at the table with her phone; hero watches from the doorway; her pill above h
export const S28: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S28} />;
// ---------- S29: close-up · kitchen — Close-up: Mom taps her phone to pay the electric bill; her pill flashes red
export const S29: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S29} />;
// ---------- S30: extreme close-up · kitchen — Extreme close-up: Mom's pill drops $112 in a single blink, flashing red; her face calm, unaware (her starting 
export const S30: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S30} />;
// ---------- S31: medium · classroom — Medium school corridor next morning: Sam buys a snack at the machine; hero watches; Sam's orange $212.50 pill 
export const S31: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S31} />;
// ---------- S32: close-up · classroom — Close-up: Sam's orange pill ticks down $2.50 to $210.00, flashing red, as he takes the snack
export const S32: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S32} />;
// ---------- S33: medium · classroom — Medium: Sam grins and taps his shoe; hero laughs; Sam's $210.00 pill above him; snack in hand
export const S33: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S33} />;
// ---------- S34: close-up · classroom — Close-up: Sam taps his shoe twice, dead serious then grinning; the crumpled five tucked inside; his $210.00 pi
export const S34: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S34} />;
// ---------- S35: wide · classroom — Wide classroom: hero scans the room; a pill above every head; yellow banner THE EXPERIMENT
export const S35: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S35} />;
// ---------- S36: medium · classroom — Medium: Mrs. Hale at the board; her green $12,400 pill nearly touching her head; chalk, books
export const S36: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S36} />;
// ---------- S37: close-up · classroom — Close-up: two coffees on Mrs. Hale's desk; her green $12,400 pill above; morning light
export const S37: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S37} />;
// ---------- S38: medium · classroom — Medium: Mrs. Hale sets the second coffee on the janitor's cart by the door; her $12,400 pill above her
export const S38: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S38} />;
// ---------- S39: medium · classroom — Medium: Maya the quiet girl at her desk, drawing in a notebook; her orange $312 pill nearly touching her head
export const S39: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S39} />;
// ---------- S40: close-up · classroom — Close-up: Maya's notebook, pencil sketching; her orange $312 pill above; soft light
export const S40: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S40} />;
// ---------- S41: medium · classroom — Medium cafeteria (classroom set reused as cafeteria): Maya shares her fries with a kid who sits down; her $312
export const S41: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S41} />;
// ---------- S42: medium · classroom — Medium: Sam at his desk counting lunch dollars; his orange $212.50 pill nearly touching his head
export const S42: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S42} />;
// ---------- S43: close-up · classroom — Close-up: Sam stacks coins on his desk, saving; his $212.50 pill above; determined smile
export const S43: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S43} />;
// ---------- S44: close-up · classroom — Close-up: Sam's shoe, a crumpled five-dollar bill tucked inside; his $212.50 pill above his head
export const S44: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S44} />;
// ---------- S45: medium · study — Medium principal's office (study set reused as Mr. Grant's office): Mr. Grant eats lunch alone, door closed; h
export const S45: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S45} />;
// ---------- S46: close-up · study — Close-up: Mr. Grant alone at his desk, tray untouched; his green $86,000 pill above; cold office light
export const S46: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S46} />;
// ---------- S47: medium · classroom — Medium school hallway: a kid feeds two dollars into the snack machine; hero watches from the side
export const S47: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S47} />;
// ---------- S48: close-up · classroom — Close-up: the kid's pill ticks down $2, flashing red, as the snack drops; hero's eyes track it (kid's starting
export const S48: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S48} />;
// ---------- S49: wide · classroom — Wide hallway: pills above every passing head, ticking as money moves; hero stands still, watching them all
export const S49: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S49} />;
// ---------- S50: close-up · classroom — Close-up: hero's face, thrilled; a pill ticks above a passer-by behind him; his eyes shine
export const S50: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S50} />;
// ---------- S51: medium · classroom — Medium: hero peeks around a locker at a kid counting cash; his face shifts thrilled to uneasy
export const S51: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S51} />;
// ---------- S52: medium · classroom — Medium hallway: Derek the captain strides past, new shoes gleaming; crowd parts around him; hero watches
export const S52: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S52} />;
// ---------- S53: close-up · classroom — Close-up: Derek's brand-new shoes, then his dad's car keys in his hand; students stare enviously
export const S53: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S53} />;
// ---------- S54: wide · classroom — Wide hallway: everybody turns to watch Derek pass; hero among them; Derek soaks it up
export const S54: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S54} />;
// ---------- S55: extreme close-up · classroom — Extreme close-up: Derek's pill HUGE, red and pulsing $0.00, nearly touching his head; blurred hallway behind
export const S55: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S55} />;
// ---------- S56: close-up · classroom — Close-up: hero stares at Derek's red $0.00 pill, mouth open; Derek notices and frowns
export const S56: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S56} />;
// ---------- S57: close-up · classroom — Close-up: Derek turns on hero, suspicious; his red $0.00 pill pulses above him
export const S57: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S57} />;
// ---------- S58: medium · classroom — Medium: hero looks away fast, forced casual smile; Derek's $0.00 pill still pulsing above him
export const S58: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S58} />;
// ---------- S59: medium · stairwell — Medium school hallway (stairwell set): hero walks between classes, crowd streaming past; lockers, afternoon li
export const S59: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S59} />;
// ---------- S60: medium · stairwell — Medium: a man mopping the floor ahead, back to camera; hero stops and stares
export const S60: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S60} />;
// ---------- S61: close-up · stairwell — Close-up: above the mopping man's head, a pill so big it crowds the frame; hero's eyes go wide
export const S61: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S61} />;
// ---------- S62: macro insert · dark void — Macro insert on the dark void: $8,412,009 HUGE in gold with glow, digits ticking into place; no face, just the
export const S62: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S62} />;
// ---------- S63: medium · stairwell — Medium: hero blinks hard and shakes his head; the mopping man turns the corner and is gone; empty hallway
export const S63: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S63} />;
// ---------- S64: close-up · stairwell — Close-up: hero alone in the hallway, muttering to himself; his face says he imagined it
export const S64: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S64} />;
// ---------- S65: medium · dark void — Dark void: hero silhouette small under a yellow banner THE SCIENCE; no pills, just stars
export const S65: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S65} />;
// ---------- S66: medium · dark void — Dark void: a single head outline with no pill above it; red label THAT'S THE MADE-UP PART
export const S66: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S66} />;
// ---------- S67: medium · dark void — Dark void: two pills, one green one gold, side by side; yellow banner MONEY AND HAPPINESS?
export const S67: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S67} />;
// ---------- S68: medium wide · dark void — Dark void text card: KAHNEMAN & DEATON, 2010; thousands of tiny head outlines below
export const S68: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S68} />;
// ---------- S69: close-up · dark void — Dark void: a graph line climbs steeply, then flattens; a question mark pops above it
export const S69: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S69} />;
// ---------- S70: macro insert · dark void — Macro insert on the void: $75,000 HUGE in glowing gold; a happiness curve rising beneath it
export const S70: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S70} />;
// ---------- S71: medium · dark void — Dark void: the gold $75,000 line goes flat; the curve stops climbing; red label THEN IT STOPS
export const S71: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S71} />;
// ---------- S72: medium · dark void — Dark void: coins pile higher and higher beside a flat, unmoving smiley face
export const S72: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S72} />;
// ---------- S73: close-up · dark void — Dark void: the number keeps growing, digits spinning up; the smiley face stays exactly the same
export const S73: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S73} />;
// ---------- S74: medium wide · dark void — Dark void text card: DUNN, AKNIN & NORTON, 2008; two hands holding out coins
export const S74: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S74} />;
// ---------- S75: medium · dark void — Dark void: one hand spends coins on itself; the other hand holds coins out; two faces watch
export const S75: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S75} />;
// ---------- S76: medium · dark void — Dark void: the second hand gives its coins to someone else; that face lights up; yellow banner SPEND IT ON SOM
export const S76: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S76} />;
// ---------- S77: macro insert · dark void — Macro insert on the void: SPENDING ON OTHERS = HAPPIER in glowing gold caps; the giving face lights up
export const S77: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S77} />;
// ---------- S78: medium · dark void — Dark void: yellow banner TWO THINGS; two gold pills side by side
export const S78: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S78} />;
// ---------- S79: medium · dark void — Dark void: a green pill climbs to a gold line marked $75,000 and stops; yellow banner MONEY HELPS, UP TO A POI
export const S79: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S79} />;
// ---------- S80: medium · dark void — Dark void: coins flow from one hand to another; the giver's face glows warmer; yellow banner GIVING FEELS BETT
export const S80: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S80} />;
// ---------- S81: close-up · dark void — Dark void: pills above a row of heads, all different values, none showing a face; red label THEY ONLY SHOW THE
export const S81: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S81} />;
// ---------- S82: extreme close-up · dark void — Extreme close-up on the void: a single pill, digits spinning; the face beneath it is blank
export const S82: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S82} />;
// ---------- S83: wide · classroom — Wide cafeteria (classroom set reused as cafeteria): hero at a lunch table, pills above every head; yellow bann
export const S83: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S83} />;
// ---------- S84: close-up · classroom — Close-up: hero's face, hungry for the power; a red $0.00 pill glows behind him over Derek's table
export const S84: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S84} />;
// ---------- S85: medium · classroom — Medium: hero clenches his fist around nothing, then lets go slowly; his face hardens
export const S85: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S85} />;
// ---------- S86: medium · classroom — Medium cafeteria: Derek shows off his new shoes to the whole table; everyone watches; his red $0.00 pill pulse
export const S86: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S86} />;
// ---------- S87: wide · classroom — Wide: the whole lunch table leans in, watching Derek; hero at the far end, watching the $0.00 pill
export const S87: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S87} />;
// ---------- S88: close-up · classroom — Close-up: hero stands, mouth open, about to speak; the table turns toward him
export const S88: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S88} />;
// ---------- S89: extreme close-up · classroom — Extreme close-up: Derek's red $0.00 pill HUGE and pulsing above his head as hero's words land; Derek's face fr
export const S89: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S89} />;
// ---------- S90: medium · classroom — Medium: the table goes quiet, then erupts laughing; Derek's face burns; his $0.00 pill pulses
export const S90: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S90} />;
// ---------- S91: close-up · classroom — Close-up: Derek's face goes red, he stands up and walks out; his $0.00 pill recedes down the aisle
export const S91: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S91} />;
// ---------- S92: close-up · classroom — Close-up: Sam stares at hero like he kicked a dog; hero looks down; the laughter dies behind them
export const S92: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S92} />;
// ---------- S93: medium · classroom — Medium: Sam leans in, face serious; hero can't meet his eyes; empty tray between them
export const S93: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S93} />;
// ---------- S94: close-up · classroom — Close-up: hero's face, powerful for a beat, then sick; his smile dies
export const S94: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S94} />;
// ---------- S95: close-up · classroom — Close-up: hero's eyes drop; the red $0.00 pill glows faintly in the blurred background
export const S95: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S95} />;
// ---------- S96: medium · classroom — Medium: hero at the lunch table, counting on his fingers; a new kid's orange pill visible across the room
export const S96: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S96} />;
// ---------- S97: medium · classroom — Medium: hero bets Sam five dollars, pointing at the new kid; Sam's orange pill above him; the new kid's pill s
export const S97: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S97} />;
// ---------- S98: close-up · classroom — Close-up: hero grins, clever, pocketing the win; Sam pays up, rolling his eyes
export const S98: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S98} />;
// ---------- S99: medium · classroom — Medium: hero scans the cafeteria like a shop, checking pills before choosing a table
export const S99: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S99} />;
// ---------- S100: close-up · classroom — Close-up: hero's eyes flick from pill to pill, pricing each person; a price-tag icon pops over a stranger
export const S100: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S100} />;
// ---------- S101: medium · classroom — Medium: hero hesitates by Maya's table, checking her orange $312 pill before deciding where to sit
export const S101: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S101} />;
// ---------- S102: close-up · classroom — Close-up: hero's eyes drop to the empty chair, then back to Maya's $312 pill; he still hasn't sat down
export const S102: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S102} />;
// ---------- S103: wide · classroom — Wide cafeteria: hero sits with the big green pills, laughing; across the room, small red pills sit alone
export const S103: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S103} />;
// ---------- S104: close-up · classroom — Close-up: hero catches himself mid-laugh, face falling; he looks at his own hands; he doesn't stop
export const S104: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S104} />;
// ---------- S105: close-up · bathroom — Close-up: hero at the bathroom mirror at night; his reflection has NO pill above its head; red label STILL NOT
export const S105: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S105} />;
// ---------- S106: extreme close-up · bathroom — Extreme close-up: hero's eyes in the mirror; empty dark above his head; no pill, no number
export const S106: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S106} />;
// ---------- S107: medium · classroom — Medium school corridor next day: hero walks with Sam; hero looks sideways at Sam, about to ask
export const S107: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S107} />;
// ---------- S108: close-up · classroom — Close-up: Sam shrugs, unbothered; his orange $210.00 pill above him; hero glances up at his own empty head
export const S108: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S108} />;
// ---------- S109: close-up · classroom — Close-up: hero's face as it hits him; eyes widen, mouth stills; blurred corridor behind
export const S109: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S109} />;
// ---------- S110: medium · classroom — Medium: hero looks back down the week, quick flash of the cafeteria tables, pills above heads; his face grim
export const S110: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S110} />;
// ---------- S111: close-up · classroom — Close-up: hero's face, realising he ranked everyone without knowing his own rank; his eyes widen
export const S111: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S111} />;
// ---------- S112: close-up · classroom — Close-up: hero's face, the worse part dawning; his eyes drop
export const S112: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S112} />;
// ---------- S113: medium · classroom — Medium: Mrs. Hale sets a coffee on the janitor's cart, smiling; her green $12,400 pill above her; hero watches
export const S113: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S113} />;
// ---------- S114: medium · classroom — Medium cafeteria: Maya shares her fries with a new kid; her orange $312 pill above her; hero watches
export const S114: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S114} />;
// ---------- S115: close-up · classroom — Close-up: Derek alone at a table, head down; his red $0.00 pill pulses softly above him
export const S115: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S115} />;
// ---------- S116: close-up · classroom — Close-up: hero's face, quiet; the pills blur behind him as he looks at faces instead
export const S116: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S116} />;
// ---------- S117: medium · dark void — Dark void beat-closing card: a pill and a heart, side by side; the pill fades, the heart stays; yellow banner 
export const S117: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S117} />;
// ---------- S118: wide · stairwell — Wide school hallway after school, emptying out; hero walks back in alone; lockers, late light
export const S118: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S118} />;
// ---------- S119: medium · stairwell — Medium: Mr. Ellis the janitor mopping the same floor, back to camera; his mop and bucket; hero stops at the fa
export const S119: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S119} />;
// ---------- S120: close-up · stairwell — Close-up: the mop moving across the floor, forty years of the same motion; Ellis's worn shoes
export const S120: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S120} />;
// ---------- S121: extreme close-up · stairwell — Extreme close-up: the gold $8,412,009 pill HUGE above Mr. Ellis's head, glowing; the episode's ONE slow push-i
export const S121: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S121} />;
// ---------- S122: medium · stairwell — Medium: hero stands frozen in the hallway, staring up at the gold pill; Ellis mops on, unaware
export const S122: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S122} />;
// ---------- S123: close-up · stairwell — Close-up: hero's face, vindicated, he didn't imagine it; a slow nod
export const S123: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S123} />;
// ---------- S124: medium · stairwell — Medium: Ellis finishes mopping, leans on his mop, picks up the coffee Mrs. Hale left on his cart
export const S124: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S124} />;
// ---------- S125: close-up · stairwell — Close-up: Ellis smiles at the coffee like it's a gift; his gold $8,412,009 pill glows softly above him
export const S125: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S125} />;
// ---------- S126: medium · stairwell — Medium: hero walks up to Ellis; Ellis leans on his mop, listening; the gold pill above him
export const S126: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S126} />;
// ---------- S127: close-up · stairwell — Close-up: Ellis leans on his mop, easy smile; hero listens; the cart and coffee beside them
export const S127: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S127} />;
// ---------- S128: medium · stairwell — Medium: Ellis shakes his head gently, smiling; hero listens; yellow banner WHAT THE NUMBER DOESN'T SAY
export const S128: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S128} />;
// ---------- S129: close-up · stairwell — Close-up: Ellis's hands, worn from forty years of mopping; a small old photograph tucked on his cart
export const S129: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S129} />;
// ---------- S130: close-up · stairwell — Close-up: the photograph, Ellis's mother, young, smiling; his gold pill glows above the cart
export const S130: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S130} />;
// ---------- S131: macro insert · schematic — Macro insert on the schematic set: a savings line growing year after year, small and steady, climbing to $8,41
export const S131: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S131} />;
// ---------- S132: medium · stairwell — Medium: Ellis mops on, content; his gold pill above him; the hallway gleams behind him
export const S132: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S132} />;
// ---------- S133: medium · classroom — Medium cafeteria: Derek alone, counting empty pockets, new shoes scuffed; his red $0.00 pill above him
export const S133: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S133} />;
// ---------- S134: close-up · classroom — Close-up: Derek's hand, empty wallet, receipts spilling; his $0.00 pill pulses red above him
export const S134: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S134} />;
// ---------- S135: close-up · classroom — Close-up: Derek's new shoes, already scuffed, as he hurries past a shop window; his $0.00 pill above him
export const S135: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S135} />;
// ---------- S136: close-up · stairwell — Close-up: hero's face, the numbers finally making sense; his eyes clear
export const S136: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S136} />;
// ---------- S137: medium · stairwell — Medium: hero and Ellis in the hallway; hero nods slowly; the gold pill glows above Ellis
export const S137: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S137} />;
// ---------- S138: wide · classroom — Wide cafeteria next morning (classroom set reused as cafeteria): hero walks in; pills above every head, small 
export const S138: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S138} />;
// ---------- S139: close-up · classroom — Close-up: hero's eyes move from face to face, not pill to pill; a smile starts
export const S139: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S139} />;
// ---------- S140: medium · classroom — Medium: hero sits with Maya; she slides her fries over; her orange $312 pill small above her; both smile
export const S140: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S140} />;
// ---------- S141: medium · classroom — Medium: hero turns to Derek's table and apologises; Derek nods, that's enough; his red $0.00 pill above him
export const S141: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S141} />;
// ---------- S142: medium · classroom — Medium lunch table: Sam sits up, suddenly decided; hero and Derek watch him; Sam's $210.00 pill above him
export const S142: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S142} />;
// ---------- S143: close-up · classroom — Close-up: Sam pulls the crumpled emergency five from his shoe and holds it out; his pill ticks down $5.00, fla
export const S143: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S143} />;
// ---------- S144: close-up · classroom — Close-up: Sam hands the five over for Derek's lunch, the five he swore he'd never spend; Derek stares; hero la
export const S144: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S144} />;
// ---------- S145: close-up · classroom — Close-up: Sam grins, holding up the five; Derek stares; hero laughs
export const S145: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S145} />;
// ---------- S146: medium · classroom — Medium: Derek eats, nobody laughs; Sam watches, satisfied; the table is quiet and warm
export const S146: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S146} />;
// ---------- S147: medium · classroom — Medium: Sam pats his shoe, already planning the next emergency five; his $205.00 pill above him; he doesn't ca
export const S147: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S147} />;
// ---------- S148: medium · stairwell — Medium hallway: hero walks out, passes Mr. Ellis still mopping; the gold pill glows above Ellis
export const S148: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S148} />;
// ---------- S149: close-up · stairwell — Close-up: Ellis's gold $8,412,009 pill, still there, glowing softly; hero glances at it and looks away
export const S149: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S149} />;
// ---------- S150: extreme close-up · stairwell — Extreme close-up: Ellis's gold $8,412,009 pill HUGE, the words EIGHT MILLION, FOUR HUNDRED AND TWELVE THOUSAND
export const S150: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S150} />;
// ---------- S151: close-up · stairwell — Close-up: hero's face, at peace; he doesn't read the number anymore; he just smiles
export const S151: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S151} />;
// ---------- S152: medium · stairwell — Medium: hero waves, Morning, Mr. Ellis; Ellis waves back with his mop; the gold pill above him
export const S152: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S152} />;
// ---------- S153: close-up · stairwell — Close-up: Ellis smiles, Morning, kid; his mop rests on the clean floor; warm light
export const S153: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S153} />;
// ---------- S154: close-up · classroom — Close-up: hero's face, finally getting it; soft light; blurred cafeteria behind
export const S154: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S154} />;
// ---------- S155: extreme close-up · classroom — Extreme close-up: hero's eyes; yellow banner THE NUMBER NEVER MEASURES WHAT A PERSON IS WORTH
export const S155: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S155} />;
// ---------- S156: medium · classroom — Medium: hero looks out at the cafeteria, faces first, pills small above heads; calm
export const S156: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S156} />;
// ---------- S157: wide · rooftop — Wide rooftop at dusk: hero looks over the city; end-card question on screen: IF YOU COULD SEE ONE NUMBER, WHAT
export const S157: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S157} />;
// ---------- S158: wide · rooftop — Wide rooftop at dusk, low angle: hero turns to camera; title card TELL US IN THE COMMENTS; city lights behind
export const S158: React.FC<ShotProps> = (p) => <GenericShot {...p} spec={SPECS.S158} />;
