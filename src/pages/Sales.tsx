import { Card } from '../components/Card'
import { DataTable } from '../components/DataTable'
import type { Column } from '../components/DataTable'
import { HeroStat } from '../components/HeroStat'
import { StatTile } from '../components/StatTile'
import { ColumnsChart } from '../components/charts/ColumnsChart'
import { RankedBarChart } from '../components/charts/RankedBarChart'
import { TrendChart } from '../components/charts/TrendChart'
import { ORDINAL, SERIES } from '../lib/colors'
import { compactAxis, num, percent, tenge, tengeFull } from '../lib/format'
import { usePeriod } from '../lib/period'
import { courseStats, funnel, managerStats } from '../data/breakdowns'
import type { ManagerStat } from '../data/breakdowns'
import { avg, change, previousSlice, slice, sum } from '../data/metrics'

const managerColumns: Column<ManagerStat>[] = [
  { key: 'name', title: 'Менеджер', render: (r) => r.name },
  { key: 'deals', title: 'Сделок', align: 'right', render: (r) => num(r.deals) },
  { key: 'revenue', title: 'Выручка', align: 'right', render: (r) => tengeFull(r.revenue) },
  { key: 'conv', title: 'Конверсия', align: 'right', render: (r) => percent(r.conversion) },
  { key: 'plan', title: 'Исполнение плана', align: 'right', render: (r) => percent(r.plan, 0) },
]

export function Sales() {
  const period = usePeriod()
  const rows = slice(period)
  const prev = previousSlice(period)

  const revenue = sum(rows, 'netRevenue')
  const students = sum(rows, 'newStudents')
  const check = avg(rows, 'avgCheck')
  const conversion = sum(rows, 'newStudents') / sum(rows, 'leads')
  const refunds = sum(rows, 'refundAmount')

  const stages = funnel(rows)
  const courses = courseStats(rows)

  const monthly = rows.map((r) => ({
    label: r.label,
    revenue: r.netRevenue,
    new: r.newStudents,
    renewals: r.renewals,
  }))

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Продажи</h1>
        <p className="page-lead">Выручка, студенты и воронка сделок за выбранный период.</p>
      </div>

      <div className="kpi">
        <HeroStat
          label="Выручка за период"
          value={tenge(revenue)}
          delta={change(revenue, sum(prev, 'netRevenue'))}
          caption={`${num(students)} новых студентов · средний чек ${tenge(check)}`}
        />
        <div className="kpi__tiles">
          <StatTile
            label="Новые студенты"
            value={num(students)}
            delta={change(students, sum(prev, 'newStudents'))}
            trend={rows.map((r) => r.newStudents)}
          />
          <StatTile
            label="Средний чек"
            value={tenge(check)}
            delta={change(check, avg(prev, 'avgCheck'))}
            trend={rows.map((r) => r.avgCheck)}
          />
          <StatTile
            label="Конверсия лид → оплата"
            value={percent(conversion)}
            delta={change(conversion, sum(prev, 'newStudents') / sum(prev, 'leads'))}
            trend={rows.map((r) => r.leadToSale)}
          />
          <StatTile
            label="Возвраты"
            value={tenge(refunds)}
            delta={change(refunds, sum(prev, 'refundAmount'))}
            upIsGood={false}
            trend={rows.map((r) => r.refundAmount)}
          />
        </div>
      </div>

      <div className="grid">
        <Card title="Выручка по месяцам" subtitle="Чистая выручка после возвратов, тенге" wide>
          <TrendChart
            data={monthly}
            xKey="label"
            series={[{ key: 'revenue', name: 'Чистая выручка', color: SERIES[0] }]}
            valueFormat={tenge}
            axisFormat={compactAxis}
            area
            height={280}
          />
        </Card>

        <Card title="Новые студенты и продления" subtitle="Количество оплат по месяцам">
          <ColumnsChart
            data={monthly}
            xKey="label"
            series={[
              { key: 'new', name: 'Новые', color: SERIES[0] },
              { key: 'renewals', name: 'Продления', color: SERIES[1] },
            ]}
            valueFormat={num}
            axisFormat={compactAxis}
            stacked
            totalLabel="Всего оплат"
          />
        </Card>

        <Card title="Выручка по продуктам" subtitle="Чистая выручка за период, тенге">
          <RankedBarChart data={courses.map((c) => ({ name: c.name, value: c.revenue }))} valueFormat={tenge} seriesName="Выручка" />
        </Card>

        <Card title="Воронка продаж" subtitle="Стадии упорядочены — порядок виден в насыщенности цвета" wide>
          <RankedBarChart
            data={stages.map((s, i) => ({
              name: s.name,
              value: s.value,
              fill: ORDINAL[Math.min(i, ORDINAL.length - 1)],
            }))}
            valueFormat={num}
            rowHeight={44}
            seriesName="На шаге"
          />
        </Card>

        <Card title="Результаты отдела продаж" subtitle="За выбранный период" wide>
          <DataTable columns={managerColumns} rows={managerStats(rows)} rowKey={(r) => r.name} />
        </Card>
      </div>
    </>
  )
}
