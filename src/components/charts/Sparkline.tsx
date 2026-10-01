import { Line, LineChart, ResponsiveContainer } from 'recharts'

type Props = { values: number[]; color: string; height?: number }

/** Тренд плитки: 12 последних точек, без осей и подсказок — значение рядом в самой плитке. */
export function Sparkline({ values, color, height = 28 }: Props) {
  const data = values.slice(-12).map((v, i) => ({ i, v }))
  if (data.length < 2) return null

  return (
    <div className="sparkline" aria-hidden="true">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
