import { CHART } from '../../lib/colors'

/** Общие настройки осей и сетки. Меняются в одном месте — применяются ко всем графикам. */
export const axisProps = {
  stroke: CHART.baseline,
  tickLine: false,
  axisLine: false,
  tick: { fill: CHART.muted, fontSize: 12 },
} as const

export const gridProps = {
  stroke: CHART.grid,
  vertical: false,
} as const

export const MARGIN = { top: 16, right: 16, left: 8, bottom: 0 }

/** Ширина полосы подписей оси Y: «1,1 млрд» должно помещаться в одну строку. */
export const Y_AXIS_WIDTH = 84

/** Курсор под столбцами — лёгкая подложка вместо серого блока по умолчанию. */
export const barCursor = { fill: CHART.grid, fillOpacity: 0.55 }
