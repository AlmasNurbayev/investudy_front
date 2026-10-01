import { STATUS } from '../lib/colors'

export type Tone = 'good' | 'warning' | 'serious' | 'critical'

const ICON: Record<Tone, string> = { good: '●', warning: '▲', serious: '▲', critical: '■' }

/** Статус всегда идёт значком и подписью: цвет не остаётся единственным носителем смысла. */
export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className="badge">
      <span className="badge__icon" style={{ color: STATUS[tone] }} aria-hidden="true">
        {ICON[tone]}
      </span>
      {children}
    </span>
  )
}
