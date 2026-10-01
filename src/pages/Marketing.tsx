import { Card } from '../components/Card'
import { DataTable } from '../components/DataTable'
import type { Column } from '../components/DataTable'
import { HeroStat } from '../components/HeroStat'
import { StatTile } from '../components/StatTile'
import { StatusBadge } from '../components/StatusBadge'
import type { Tone } from '../components/StatusBadge'
import { ColumnsChart } from '../components/charts/ColumnsChart'
import { RankedBarChart } from '../components/charts/RankedBarChart'
import { TrendChart } from '../components/charts/TrendChart'
import { SERIES } from '../lib/colors'
import { compactAxis, num, percent, ratio, tenge, tengeFull } from '../lib/format'
import { usePeriod } from '../lib/period'
import { CHANNEL_NAMES, channelStats, leadsByChannel } from '../data/breakdowns'
import type { ChannelStat } from '../data/breakdowns'
import { avg, change, previousSlice, slice, sum } from '../data/metrics'

const romiTone = (romi: number): Tone =>
  romi >= 3 ? 'good' : romi >= 1.5 ? 'warning' : romi >= 0.5 ? 'serious' : 'critical'

const romiLabel = (romi: number): string =>
  romi >= 3 ? 'Отличный' : romi >= 1.5 ? 'Приемлемый' : romi >= 0.5 ? 'Низкий' : 'Убыточный'

const channelColumns: Column<ChannelStat>[] = [
  { key: 'name', title: 'Канал', render: (r) => r.name },
  { key: 'leads', title: 'Лиды', align: 'right', render: (r) => num(r.leads) },
  { key: 'students', title: 'Оплаты', align: 'right', render: (r) => num(r.students) },
  { key: 'conv', title: 'Конверсия', align: 'right', render: (r) => percent(r.conversion) },
  { key: 'spend', title: 'Расход', align: 'right', render: (r) => tengeFull(r.spend) },
  { key: 'cac', title: 'CAC', align: 'right', render: (r) => tengeFull(Math.round(r.cac)) },
  {
    key: 'romi',
    title: 'ROMI',
    align: 'right',
    render: (r) => (
      <StatusBadge tone={romiTone(r.romi)}>
        {ratio(r.romi)} · {romiLabel(r.romi)}
      </StatusBadge>
    ),
  },
]

export function Marketing() {
  const period = usePeriod()
  const rows = slice(period)
  const prev = previousSlice(period)

  const leads = sum(rows, 'leads')
  const spend = sum(rows, 'marketing')
  const revenue = sum(rows, 'netRevenue')
  const romi = (revenue - spend) / spend
  const cac = spend / sum(rows, 'newStudents')
  const conversion = sum(rows, 'newStudents') / leads

  const channels = channelStats(rows)
  const byChannel = leadsByChannel(rows)

  const stacked = byChannel.map((m) => {
    const row: Record<string, string | number> = { label: m.label }
    CHANNEL_NAMES.forEach((_, i) => {
      row[`ch${i}`] = m.values[i]
    })
    return row
  })

  const monthly = rows.map((r) => ({ label: r.label, cac: Math.round(r.cac), romi: r.romi }))

  const prevSpend = sum(prev, 'marketing')
  const prevRomi = prevSpend ? (sum(prev, 'netRevenue') - prevSpend) / prevSpend : null

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Маркетинг</h1>
        <p className="page-lead">Лиды, стоимость привлечения и окупаемость каналов за выбранный период.</p>
      </div>

      <div className="kpi">
        <HeroStat
          label="ROMI за период"
          value={ratio(romi)}
          delta={prevRomi ? change(romi, prevRomi) : null}
          caption={`${tenge(spend)} расхода принесли ${tenge(revenue)} выручки`}
        />
        <div className="kpi__tiles">
          <StatTile
            label="Лиды"
            value={num(leads)}
            delta={change(leads, sum(prev, 'leads'))}
            trend={rows.map((r) => r.leads)}
          />
          <StatTile
            label="CAC"
            value={tenge(cac)}
            delta={change(cac, sum(prev, 'marketing') / sum(prev, 'newStudents'))}
            upIsGood={false}
            trend={rows.map((r) => r.cac)}
            color={SERIES[1]}
          />
          <StatTile
            label="Конверсия лид → оплата"
            value={percent(conversion)}
            delta={change(conversion, sum(prev, 'newStudents') / sum(prev, 'leads'))}
            trend={rows.map((r) => r.leadToSale)}
          />
          <StatTile
            label="Расход на маркетинг"
            value={tenge(spend)}
            delta={change(spend, prevSpend)}
            upIsGood={false}
            trend={rows.map((r) => r.marketing)}
            color={SERIES[1]}
          />
        </div>
      </div>

      <div className="grid">
        <Card title="Лиды по каналам" subtitle="Части целого по месяцам" wide>
          <ColumnsChart
            data={stacked}
            xKey="label"
            series={CHANNEL_NAMES.map((name, i) => ({ key: `ch${i}`, name, color: SERIES[i] }))}
            valueFormat={num}
            axisFormat={compactAxis}
            stacked
            totalLabel="Всего лидов"
            height={300}
          />
        </Card>

        <Card title="Стоимость привлечения по каналам" subtitle="CAC за период, тенге">
          <RankedBarChart
            data={[...channels]
              .sort((a, b) => a.cac - b.cac)
              .map((c) => ({ name: c.name, value: Math.round(c.cac) }))}
            valueFormat={tenge}
            labelWidth={190}
            seriesName="CAC"
          />
        </Card>

        <Card title="CAC по месяцам" subtitle="Средняя стоимость привлечения студента, тенге">
          <TrendChart
            data={monthly}
            xKey="label"
            series={[{ key: 'cac', name: 'CAC', color: SERIES[1] }]}
            valueFormat={tenge}
            axisFormat={compactAxis}
            area
          />
        </Card>

        <Card title="Эффективность каналов" subtitle={`За период · средний CAC ${tenge(avg(rows, 'cac'))}`} wide>
          <DataTable columns={channelColumns} rows={channels} rowKey={(r) => r.id} />
        </Card>
      </div>
    </>
  )
}
