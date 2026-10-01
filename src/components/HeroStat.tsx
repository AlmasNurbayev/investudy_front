import { signedPercent } from '../lib/format'

type Props = {
  label: string
  value: string
  delta?: number | null
  deltaNote?: string
  caption?: string
}

/** Главное число страницы. Ровно одно на экран, тем же шрифтом, что и всё остальное. */
export function HeroStat({ label, value, delta, deltaNote = 'к прошлому периоду', caption }: Props) {
  const tone = delta == null || delta === 0 ? 'flat' : delta > 0 ? 'good' : 'bad'
  return (
    <div className="hero">
      <h2 className="hero__label">{label}</h2>
      <p className="hero__value">{value}</p>
      <div className="hero__foot">
        {delta != null && (
          <span className={`delta delta--${tone}`}>
            <span className="delta__arrow" aria-hidden="true">{delta > 0 ? '↑' : delta < 0 ? '↓' : '→'}</span>
            {signedPercent(delta)}
            <span className="delta__note">{deltaNote}</span>
          </span>
        )}
        {caption && <p className="hero__caption">{caption}</p>}
      </div>
    </div>
  )
}
