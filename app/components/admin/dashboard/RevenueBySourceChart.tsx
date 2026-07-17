import { formatMoney } from 'app/utils/_currency.utils'

const COLORS = [
  'fill-primary-light dark:fill-primary-dark',
  'fill-emerald-500 dark:fill-emerald-400',
  'fill-amber-500 dark:fill-amber-400',
  'fill-purple-500 dark:fill-purple-400',
  'fill-pink-500 dark:fill-pink-400'
]

export function RevenueBySourceChart({
  sources,
  fmtType
}: {
  sources: { type: string; total: number }[]
  fmtType: (type: string) => string
}) {
  const total = sources.reduce((sum, s) => sum + s.total, 0)
  if (total === 0) return null

  const size = 160
  const radius = 60
  const strokeWidth = 22
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  const segments = sources.map((s, i) => {
    let offset = 0
    const fraction = s.total / total
    const dash = fraction * circumference
    const seg = {
      ...s,
      dash,
      gap: circumference - dash,
      rotation: (offset / circumference) * 360,
      colorClass: COLORS[i % COLORS.length],
      pct: Math.round(fraction * 100)
    }
    offset += dash
    return seg
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
        role="img"
        aria-label="Revenue by source breakdown"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-border-light dark:stroke-border-dark"
        />
        {segments.map((seg) => (
          <circle
            key={seg.type}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            transform={`rotate(${seg.rotation - 90} ${center} ${center})`}
            className={seg.colorClass}
            strokeLinecap="butt"
          />
        ))}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="fill-text-light dark:fill-text-dark font-quicksand font-black"
          style={{ fontSize: '15px' }}
        >
          {formatMoney(total)}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-muted-light dark:fill-muted-dark"
          style={{ fontSize: '8px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}
        >
          TOTAL
        </text>
      </svg>

      <ul className="w-full space-y-2" role="list">
        {segments.map((seg) => (
          <li key={seg.type} className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 shrink-0 ${seg.colorClass}`} aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-light dark:text-muted-dark flex-1 truncate">
              {fmtType(seg.type)}
            </span>
            <span className="font-mono text-[10px] text-muted-light/70 dark:text-muted-dark/70 tabular-nums">
              {seg.pct}%
            </span>
            <span className="font-quicksand font-black text-xs text-text-light dark:text-text-dark tabular-nums w-16 text-right">
              {formatMoney(seg.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
