export type LegendItem = { name: string; color: string }

/**
 * Собственная легенда вместо встроенной: Recharts 3 не принимает порядок
 * элементов, а он важен — для стопки легенда должна читаться сверху вниз
 * так же, как уложены сегменты.
 * Форма ключа повторяет форму метки: штрих для линий, плашка для заливок.
 */
export function ChartLegend({ items, shape = 'rect' }: { items: LegendItem[]; shape?: 'rect' | 'line' }) {
  if (items.length < 2) return null
  return (
    <ul className="legend">
      {items.map((it) => (
        <li key={it.name}>
          <span
            className={shape === 'line' ? 'legend__line' : 'legend__rect'}
            style={{ background: it.color }}
            aria-hidden="true"
          />
          {it.name}
        </li>
      ))}
    </ul>
  )
}
