import React from 'react';
import { FONT } from '../fonts';

// Calendar macro insert — ported from the death-count-v2 episode (S10): a full-screen wall calendar "THIS WEEK"
// with red X marks, "LILY'S B-DAY!" circled in red on SATURDAY, 2:40 PM. Ifinite scenes 029, 053, 058: the
// calendar is a shot in its own right, not an overlay. The red circle draws on the beat (t >= 18).
const RED = '#FF3344';

export const Calendar: React.FC<{ t: number }> = ({ t }) => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const circ = Math.min(1, Math.max(0, (t - 18) / 10));
  return (
    <g>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#0E0C1E" />
      <rect x={420} y={170} width={1080} height={740} rx={28} fill="#F4F1EA" />
      <text x={960} y={260} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill="#14101E" textAnchor="middle" letterSpacing={4}>
        THIS WEEK
      </text>
      {days.map((d, i) => {
        const cx = 510 + i * 140;
        const isSat = d === 'SAT';
        return (
          <g key={d}>
            <text x={cx + 60} y={330} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill={isSat ? RED : '#14101E'} textAnchor="middle">
              {d}
            </text>
            <rect x={cx} y={350} width={120} height={120} rx={10} fill={isSat ? '#FFE9E9' : '#FFFFFF'} stroke="#C9C2B2" strokeWidth={3} />
            {!isSat && i < 5 && (
              <g stroke={RED} strokeWidth={7} strokeLinecap="round">
                <line x1={cx + 25} y1={375} x2={cx + 95} y2={445} />
                <line x1={cx + 95} y1={375} x2={cx + 25} y2={445} />
              </g>
            )}
          </g>
        );
      })}
      {/* red circle around SAT, drawn on the beat */}
      <g opacity={circ} transform={`translate(1230 410) scale(${0.7 + 0.3 * circ})`}>
        <ellipse cx={0} cy={0} rx={86} ry={76} fill="none" stroke={RED} strokeWidth={7} />
      </g>
      <text x={960} y={560} fontFamily={FONT.title} fontWeight={700} fontSize={58} fill={RED} textAnchor="middle">
        LILY'S B-DAY!
      </text>
      <text x={960} y={640} fontFamily={FONT.title} fontWeight={700} fontSize={44} fill={RED} textAnchor="middle">
        2:40 PM
      </text>
      <text x={960} y={760} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill="#5A4A3A" textAnchor="middle">
        blue car · windows down
      </text>
    </g>
  );
};
