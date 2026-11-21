/**
 * hero-rig.tsx — shared Remotion component library for 2D character rig animation.
 * Doctrine: 2d-character-rig-animation (named poses, face replacements, FK/IK planning)
 * + stick-motion (FK arms/head, IK legs, foot-locked walk, pure functions of time).
 *
 * Rules enforced here (from the skills):
 * - Legs are NEVER posed with raw thigh/knee angles — always via foot targets + solveLegIK.
 * - Bone lengths never change (THIGH 72 / SHIN 68, matching rig.tsx).
 * - Everything is a pure function of frame: no Date.now, no Math.random.
 * - Face swaps are replacements: instant on the beat frame, never a morph.
 * - A walk's hip speed MUST equal stride / stepDuration, or the planted foot slides.
 *   walkCyclePose derives speed from stride + stepDuration so the two cannot disagree.
 */

import React from 'react';
import { Hero, Look, LOOKS, basePose, Pose, Expr, LEG_LEN, joints, faceAt, toWorld, limbSpread } from '../rig';

export type PoseName = 'walk' | 'point' | 'think' | 'look-up' | 'worried' | 'shocked';

// ———————————————————————————————————————————————————————————————————————
// 1. HERO_POSES — named preset poses. Flat Partial<Pose> only (no nested objects
//    inside a pose field). x/y are deliberately NOT in the presets: position
//    belongs to the shot, not the pose. Merged over basePose by HeroRig.
// ———————————————————————————————————————————————————————————————————————

export const HERO_POSES: Record<PoseName, Partial<Pose>> = {
  // Mid-stride key pose only — the moving cycle is walkCyclePose below.
  walk: {
    scale: 1,
    facing: 1,
    tilt: 5,
    yaw: 1,
    headTilt: 0,
    armL: { a: 20, b: 20 },
    armR: { a: -20, b: 20 },
    legL: { a: 28, b: -8 },
    legR: { a: -28, b: -8 },
    expr: 'neutral',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 10,
    handL: 'open',
    handR: 'open',
  },
  // Right arm out straight, index finger extended; left arm relaxed at the side.
  point: {
    scale: 1,
    facing: 1,
    tilt: 0,
    yaw: 0,
    headTilt: 0,
    armL: { a: 10, b: -8 },
    armR: { a: 78, b: 4 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'neutral',
    blink: 0,
    look: 0.3,
    glasses: 0,
    squash: 0,
    sway: 0,
    handL: 'open',
    handR: 'point',
  },
  // Right hand up toward the chin, head tipped, worried brow.
  think: {
    scale: 1,
    facing: 1,
    tilt: -5,
    yaw: 0,
    headTilt: -6,
    armL: { a: 10, b: -8 },
    armR: { a: 18, b: -95 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'worried',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 0,
    handL: 'open',
    handR: 'open',
  },
  // Leaning back slightly, face tipped up.
  'look-up': {
    scale: 1,
    facing: 1,
    tilt: -6,
    yaw: 0,
    headTilt: -8,
    armL: { a: 10, b: -8 },
    armR: { a: 10, b: -8 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'neutral',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 0,
    handL: 'open',
    handR: 'open',
  },
  worried: {
    scale: 1,
    facing: 1,
    tilt: -5,
    yaw: 0,
    headTilt: 4,
    armL: { a: 20, b: -15 },
    armR: { a: 20, b: -15 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'worried',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 0,
    handL: 'open',
    handR: 'open',
  },
  // Big disc eyes + open "o" mouth (the rig's 'shock' face). blink MUST be 0 here:
  // blink >= 0.95 draws shut lids and would hide the shock eyes.
  shocked: {
    scale: 1,
    facing: 1,
    tilt: 0,
    yaw: 0,
    headTilt: 0,
    armL: { a: 40, b: -12 },
    armR: { a: 40, b: -12 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'shock',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 0,
    handL: 'open',
    handR: 'open',
  },
};

// ———————————————————————————————————————————————————————————————————————
// 2. solveLegIK — two-bone IK for the rig's leg.
//
// rig.tsx joints() FK for a leg (dir = facing, angles in degrees, 0 = straight down):
//   end = root + THIGH * (dir*sin(a), cos(a)) + SHIN * (dir*sin(a+b), cos(a+b))
// In facing coordinates (ex = facing * dx, so +x is always forward):
//   phi = atan2(ex, ey) is the target's angle from straight down.
//   gamma = acos((THIGH^2 + d^2 - SHIN^2) / (2*THIGH*d)) is the thigh's angle off that line.
//   a = phi + gamma puts the knee FORWARD of the hip->ankle line, which is the
//   anatomical branch: the shin then angles back toward the ankle, so b <= 0,
//   exactly as walkPose in rig.tsx does (b = -max(0, ...)).
// Unreachable targets clamp to max reach 139 (THIGH + SHIN - 1).
// ———————————————————————————————————————————————————————————————————————

const THIGH = 72;
const SHIN = 68;
const MAX_REACH = THIGH + SHIN - 1; // 139

export function solveLegIK(
  target: { x: number; y: number },
  root: { x: number; y: number },
  facing: 1 | -1,
): { a: number; b: number } {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  let ex = facing * dx; // facing coords: +x = forward
  let ey = dy;
  let d = Math.hypot(ex, ey);
  if (d > MAX_REACH) {
    const s = MAX_REACH / d;
    ex *= s;
    ey *= s;
    d = MAX_REACH;
  }
  if (d < 1e-6) return { a: 0, b: 0 };
  const phi = Math.atan2(ex, ey);
  const cosGamma = (THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d);
  const gamma = Math.acos(Math.min(1, Math.max(-1, cosGamma)));
  const a = phi + gamma;
  const midX = THIGH * Math.sin(a);
  const midY = THIGH * Math.cos(a);
  const a2 = Math.atan2(ex - midX, ey - midY);
  const b = a2 - a;
  const deg = 180 / Math.PI;
  return { a: a * deg, b: b * deg };
}

// ———————————————————————————————————————————————————————————————————————
// 3. gaitFoot — closed-form foot target, stick-motion doctrine.
//
// phase is in STEPS (0..2 = one full cycle = two steps). One leg's phase is
// offset by exactly 1 step from the other, so one foot is always planted.
//   stance (p in [0,1)): foot planted — its target RELATIVE to the hip runs
//     from +stride/2 (ahead) to -stride/2 (behind) while the hip translates
//     over it at stride/stepDuration px per frame, so the foot's WORLD x
//     never moves. That is the foot-lock; it only holds because
//     walkCyclePose derives hip speed from the same stride + stepDuration.
//   swing (p in [1,2)): foot arcs forward -stride/2 -> +stride/2 on a
//     smoothstep, lifting by stepHeight on a sine arc (dy <= 0, y is down).
// Returns dx/dy relative to the hip's ground point, in facing coords.
// ———————————————————————————————————————————————————————————————————————

export function gaitFoot(
  phase: number,
  stride: number,
  stepHeight: number,
): { dx: number; dy: number; planted: boolean } {
  const p = ((phase % 2) + 2) % 2; // 0..2
  if (p < 1) {
    return { dx: stride / 2 - stride * p, dy: 0, planted: true };
  }
  const q = p - 1; // swing progress 0..1
  const e = q * q * (3 - 2 * q); // smoothstep
  return { dx: -stride / 2 + stride * e, dy: -stepHeight * Math.sin(Math.PI * q), planted: false };
}

// ———————————————————————————————————————————————————————————————————————
// 4. walkCyclePose — foot-locked walk.
//
// Hip x advances at speed = stride / stepDuration px/frame (derived, never
// picked independently). Hip height: at full spread a foot sits stride/2
// ahead of the hip, so the hip must sit below full leg length or the IK
// clamps — hipH = 132 keeps max reach sqrt(132^2 + 32^2) = 135.8 < 139 for
// the default stride 64. Hip bobs: lowest at double support (phase 0),
// highest mid-step (phase 0.5). Legs are posed ONLY via gaitFoot +
// solveLegIK, from each leg's own hip root (joints() puts the leg roots at
// +/-17 * limbSpread(yaw) in local space). Arms counter-swing, head steady.
// ———————————————————————————————————————————————————————————————————————

export type WalkOpts = {
  x0: number;
  groundY: number;
  scale?: number;
  facing?: 1 | -1;
  stride?: number;
  stepDuration?: number;
  stepHeight?: number;
};

export function walkCyclePose(frame: number, opts: WalkOpts): Pose {
  const scale = opts.scale ?? 1;
  const facing = opts.facing ?? 1;
  const stride = opts.stride ?? 64;
  const stepDuration = opts.stepDuration ?? 15;
  const stepHeight = opts.stepHeight ?? 26;
  const speed = stride / stepDuration; // px/frame — derived, see header
  const hipX = opts.x0 + speed * frame * facing;
  const phase = frame / stepDuration; // steps
  const hipH = 132 * scale;
  const hipY = opts.groundY - hipH + 3 * Math.cos(2 * Math.PI * phase);
  const sp = limbSpread(facing); // yaw = facing while walking in profile
  const rootL = { x: hipX - 17 * sp * scale, y: hipY };
  const rootR = { x: hipX + 17 * sp * scale, y: hipY };
  const gL = gaitFoot(phase, stride, stepHeight);
  const gR = gaitFoot(phase + 1, stride, stepHeight);
  const targetL = { x: hipX + gL.dx * facing, y: opts.groundY + gL.dy };
  const targetR = { x: hipX + gR.dx * facing, y: opts.groundY + gR.dy };
  const legL = solveLegIK(targetL, rootL, facing);
  const legR = solveLegIK(targetR, rootR, facing);
  const swing = 16 * Math.sin(Math.PI * phase);
  return {
    ...basePose,
    x: hipX,
    y: hipY,
    scale,
    facing,
    yaw: facing,
    tilt: 5 * facing,
    headTilt: 2 * Math.sin(phase * 2),
    armL: { a: swing, b: 14 },
    armR: { a: -swing, b: 14 },
    legL,
    legR,
    expr: 'neutral',
    blink: 0,
    look: 0,
    glasses: 0,
    squash: 0,
    sway: 8 * Math.sin(2 * Math.PI * phase + 0.8),
    handL: 'open',
    handR: 'open',
  };
}

// ———————————————————————————————————————————————————————————————————————
// 5. footWorldX — world x of a foot, computed for real through joints() +
//    toWorld() (not a stub): a test asserts it is constant while that foot
//    is planted. side: -1 = left leg, 1 = right leg.
// ———————————————————————————————————————————————————————————————————————

export function footWorldX(frame: number, opts: WalkOpts, side: -1 | 1): number {
  const pose = walkCyclePose(frame, opts);
  const j = joints(pose);
  const leg = side === 1 ? j.legR : j.legL;
  return toWorld(pose, leg.end).x;
}

// ———————————————————————————————————————————————————————————————————————
// 6. faceSwap — thin wrapper over faceAt: the face swaps INSTANTLY on the
//    beat frame (a replacement, never a morph), with the 2-frame blink
//    either side that faceAt already provides.
// ———————————————————————————————————————————————————————————————————————

export function faceSwap(frame: number, keys: [number, Expr][]): { expr: Expr; blink: number } {
  return faceAt(frame, keys);
}

// ———————————————————————————————————————————————————————————————————————
// 7. HeroRig — shots call poses by name instead of hand-coding angles.
//    pose: a PoseName preset merged over basePose, or a raw Partial<Pose>.
//    face: optional [frame, Expr] keys — faceSwap applies on the beat.
//    look: a Look costume (default pipHood). x/y/scale/facing override the
//    pose only when given, so a preset's values survive when they are not.
// ———————————————————————————————————————————————————————————————————————

export const HeroRig: React.FC<{
  frame: number;
  pose: PoseName | Partial<Pose>;
  face?: [number, Expr][];
  look?: Look;
  x?: number;
  y?: number;
  scale?: number;
  facing?: 1 | -1;
}> = ({ frame, pose: poseProp, face, look = LOOKS.pipHood, x, y, scale, facing }) => {
  const preset = typeof poseProp === 'string' ? HERO_POSES[poseProp] : poseProp;
  const resolved: Pose = { ...basePose, ...preset };
  if (x !== undefined) resolved.x = x;
  if (y !== undefined) resolved.y = y;
  if (scale !== undefined) resolved.scale = scale;
  if (facing !== undefined) resolved.facing = facing;
  if (face && face.length > 0) {
    const swapped = faceSwap(frame, face);
    resolved.expr = swapped.expr;
    resolved.blink = swapped.blink;
  }
  return <Hero pose={resolved} look={look} />;
};
