import { Sparkline } from './charts/Sparkline'
import { SERIES } from '../lib/colors'
import { signedPercent } from '../lib/format'

type Props = {
  label: string
  value: string
  /** Изменение к сопоставимому прошлому периоду. null — сравнивать не с чем. */
  delta?: number | null
  /** Для расходов и CAC рост — это плохо. */
  upIsGood?: boolean
  deltaNote?: string
  trend?: number[]
  color?: string
}

/**
 * Плитка показателя: подпись, значение, динамика и спарклайн.
 * Направление дублируется стрелкой — цвет не остаётся единственным носителем смысла.
 */
export function StatTile({
  label,
  value,
  delta,
  upIsGood = true,
  deltaNote = 'к прошлому периоду',
  trend,
  color = SERIES[0],
}: Props) {
  const good = delta == null ? null : delta === 0 ? null : delta > 0 === upIsGood
  const tone = good === null ? 'flat' : good ? 'good' : 'bad'

  return (
    <article className="tile">
      <h3 className="tile__label">{label}</h3>
      <p className="tile__value">{value}</p>
      <div className="tile__foot">
        {delta != null ? (
          <span className={`delta delta--${tone}`}>
            <span className="delta__arrow" aria-hidden="true">
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'}
            </span>
            {signedPercent(delta)}
            <span className="delta__note">{deltaNote}</span>
          </span>
        ) : (
          <span className="delta delta--flat">нет базы для сравнения</span>
        )}
        {trend && <Sparkline values={trend} color={color} />}
      </div>
    </article>
  )
}
