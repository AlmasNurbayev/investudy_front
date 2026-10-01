import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART } from '../../lib/colors'
import { ChartLegend } from './ChartLegend'
import { ChartTooltip } from './ChartTooltip'
import { MARGIN, Y_AXIS_WIDTH, axisProps, barCursor, gridProps } from './theme'
import type { Series } from './TrendChart'

type Props = {
  data: Record<string, unknown>[]
  xKey: string
  series: Series[]
  valueFormat: (n: number) => string
  axisFormat?: (n: number) => string
  height?: number
  stacked?: boolean
  totalLabel?: string
  /** Нулевая линия для показателей, уходящих в минус. */
  zeroLine?: boolean
}

/**
 * Столбцы по периодам: сгруппированные или с накоплением.
 * Толщина ограничена сверху, чтобы остаток полосы оставался воздухом.
 */
export function ColumnsChart({
  data,
  xKey,
  series,
  valueFormat,
  axisFormat,
  height = 260,
  stacked = false,
  totalLabel,
  zeroLine = false,
}: Props) {
  const fmtAxis = axisFormat ?? valueFormat
  const last = series.length - 1

  return (
    <>
      <ChartLegend items={(stacked ? [...series].reverse() : series).map((s) => ({ name: s.name, color: s.color }))} />
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={MARGIN} barCategoryGap="28%" maxBarSize={24}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...axisProps} minTickGap={16} />
          <YAxis {...axisProps} width={Y_AXIS_WIDTH} tickFormatter={fmtAxis} />
          <Tooltip
            cursor={barCursor}
            content={(p) => <ChartTooltip {...p} valueFormat={valueFormat} totalLabel={totalLabel} />}
          />
          {zeroLine && <ReferenceLine y={0} stroke={CHART.baseline} />}
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              stackId={stacked ? 'a' : undefined}
              radius={stacked ? (i === last ? [4, 4, 0, 0] : 0) : [4, 4, 0, 0]}
              isAnimationActive={false}
            />
          ))}
          </BarChart>
      </ResponsiveContainer>
    </>
  )
}
