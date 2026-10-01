import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartLegend } from './ChartLegend'
import { ChartTooltip } from './ChartTooltip'
import { MARGIN, Y_AXIS_WIDTH, axisProps, gridProps } from './theme'

export type Series = { key: string; name: string; color: string }

type Props = {
  data: Record<string, unknown>[]
  xKey: string
  series: Series[]
  valueFormat: (n: number) => string
  axisFormat?: (n: number) => string
  height?: number
  /** Заливка под единственным рядом — лёгкая подложка, а не плотный блок. */
  area?: boolean
}

/** Динамика во времени. Для одного ряда легенда не нужна — его называет заголовок карточки. */
export function TrendChart({ data, xKey, series, valueFormat, axisFormat, height = 260, area = false }: Props) {
  const Chart = area && series.length === 1 ? AreaChart : LineChart
  const fmtAxis = axisFormat ?? valueFormat

  return (
    <>
      <ChartLegend items={series.map((s) => ({ name: s.name, color: s.color }))} shape="line" />
      <ResponsiveContainer width="100%" height={height}>
        <Chart data={data} margin={MARGIN}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...axisProps} minTickGap={16} />
          <YAxis {...axisProps} width={Y_AXIS_WIDTH} tickFormatter={fmtAxis} />
          <Tooltip content={(p) => <ChartTooltip {...p} valueFormat={valueFormat} />} />
          {series.map((s) =>
            area && series.length === 1 ? (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={s.color}
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                isAnimationActive={false}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                isAnimationActive={false}
              />
            ),
          )}
          </Chart>
      </ResponsiveContainer>
    </>
  )
}
