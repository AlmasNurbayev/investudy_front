import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART, SERIES } from '../../lib/colors'
import { ChartTooltip } from './ChartTooltip'
import { useElementWidth } from './useElementWidth'
import { axisProps, barCursor } from './theme'

export type RankedRow = {
  name: string
  value: number
  /** Цвет строки. Задаётся только там, где он что-то кодирует (порядок стадий воронки). */
  fill?: string
}

type Props = {
  data: RankedRow[]
  valueFormat: (n: number) => string
  /** Один цвет на все столбцы: у номинальных категорий порядок ничего не кодирует. */
  color?: string
  labelWidth?: number
  rowHeight?: number
  seriesName?: string
}

/** Горизонтальные столбцы — форма для категорий с длинными названиями. */
export function RankedBarChart({
  data,
  valueFormat,
  color = SERIES[0],
  labelWidth = 170,
  rowHeight = 38,
  seriesName = 'Значение',
}: Props) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  // На узком экране подписи забирают не больше 46 % ширины: больше — и столбцам
  // не остаётся места, меньше — длинные названия обрезаются слева
  const narrow = width < 520
  const labels = Math.min(labelWidth, Math.round(width * 0.46))
  const valueRoom = narrow ? 96 : 124
  const tickSize = narrow ? 12 : 13

  return (
    <div ref={ref}>
      <ResponsiveContainer width="100%" height={data.length * rowHeight + 16}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: valueRoom, left: 0, bottom: 4 }}
          maxBarSize={22}
        >
          <XAxis type="number" hide />
          <YAxis
          type="category"
          dataKey="name"
          {...axisProps}
          width={labels}
          tick={{ fill: CHART.textSecondary, fontSize: tickSize }}
          />
          <Tooltip cursor={barCursor} content={(p) => <ChartTooltip {...p} valueFormat={valueFormat} />} />
          <Bar dataKey="value" name={seriesName} fill={color} radius={[0, 4, 4, 0]} isAnimationActive={false}>
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => (typeof v === 'number' ? valueFormat(v) : '')}
            style={{ fill: CHART.textPrimary, fontSize: tickSize, fontWeight: 600 }}
          />
          </Bar>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
