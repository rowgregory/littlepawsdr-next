import { formatMoney } from 'app/utils/currency.utils'

export function RevenueChart({ data }: { data: { label: string; total: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
        No data yet
      </p>
    )
  }

  const W = 640
  const H = 200
  const padX = 48
  const padY = 20
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const dataMax = Math.max(...data.map((d) => d.total))
  // When there's no revenue yet, use a small nominal scale so the axis reads
  // sensibly ($0 / $1k / ...) instead of five identical $0k lines.
  const max = dataMax > 0 ? dataMax : 4000
  const step = data.length > 1 ? innerW / (data.length - 1) : 0

  const points = data.map((d, i) => ({
    x: padX + step * i,
    y: padY + innerH - (d.total / max) * innerH,
    ...d
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    y: padY + innerH - frac * innerH,
    value: Math.round((max * frac) / 1000)
  }))

  const LABEL_STYLE = {
    fontSize: '9px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    letterSpacing: '0.15em'
  } as const

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`Revenue over the last ${data.length} months, from ${formatMoney(
          data[0].total
        )} to ${formatMoney(data[data.length - 1].total)}.`}
        className="overflow-visible"
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={padX}
              y1={g.y}
              x2={W - padX}
              y2={g.y}
              className="stroke-border-light dark:stroke-border-dark"
              strokeWidth="1"
            />
            <text
              x={padX - 10}
              y={g.y + 3}
              textAnchor="end"
              className="fill-muted-light dark:fill-muted-dark"
              style={LABEL_STYLE}
            >
              ${g.value}K
            </text>
          </g>
        ))}

        <path
          d={linePath}
          fill="none"
          className="stroke-primary-light dark:stroke-primary-dark"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" className="fill-primary-light dark:fill-primary-dark" />
            <text
              x={p.x}
              y={H - 2}
              textAnchor="middle"
              className="fill-muted-light dark:fill-muted-dark"
              style={LABEL_STYLE}
            >
              {p.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
