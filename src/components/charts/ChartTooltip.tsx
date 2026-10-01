import type { ReactNode } from 'react'

/** Recharts отдаёт значение нетипизированным — приводим его на границе. */
type TooltipPayload = {
  name?: ReactNode
  value?: number | string | ReadonlyArray<number | string>
  color?: string
}

const toNumber = (v: TooltipPayload['value']): number => {
  const raw = Array.isArray(v) ? v[v.length - 1] : v
  const n = typeof raw === 'string' ? Number(raw) : raw
  return Number.isFinite(n) ? (n as number) : 0
}

type Props = {
  active?: boolean
  payload?: readonly TooltipPayload[]
  label?: ReactNode
  valueFormat: (n: number) => string
  /** Подпись итога под списком рядов — например, сумма стопки. */
  totalLabel?: string
}

/**
 * Подсказка: значение набрано контрастнее названия ряда — ряд читатель
 * уже знает, ему нужно число.
 */
export function ChartTooltip({ active, payload, label, valueFormat, totalLabel }: Props) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((acc, p) => acc + toNumber(p.value), 0)

  return (
    <div className="tooltip" role="status">
      <div className="tooltip__title">{label}</div>
      {payload.map((p, i) => (
        <div className="tooltip__row" key={i}>
          <span className="tooltip__key" style={{ background: p.color }} aria-hidden="true" />
          <span className="tooltip__name">{p.name}</span>
          <span className="tooltip__value">{valueFormat(toNumber(p.value))}</span>
        </div>
      ))}
      {totalLabel && payload.length > 1 && (
        <div className="tooltip__row tooltip__row--total">
          <span className="tooltip__name">{totalLabel}</span>
          <span className="tooltip__value">{valueFormat(total)}</span>
        </div>
      )}
    </div>
  )
}
