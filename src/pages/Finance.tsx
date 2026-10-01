import { Card } from '../components/Card'
import { DataTable } from '../components/DataTable'
import type { Column } from '../components/DataTable'
import { HeroStat } from '../components/HeroStat'
import { StatTile } from '../components/StatTile'
import { StatusBadge } from '../components/StatusBadge'
import type { Tone } from '../components/StatusBadge'
import { ColumnsChart } from '../components/charts/ColumnsChart'
import { Meter } from '../components/charts/Meter'
import { DIVERGING, SERIES, STATUS } from '../lib/colors'
import { compactAxis, percent, tenge, tengeFull } from '../lib/format'
import { usePeriod } from '../lib/period'
import { EXPENSE_ITEMS } from '../data/breakdowns'
import { avg, change, previousSlice, slice, sum } from '../data/metrics'
import type { MonthMetrics } from '../data/metrics'

const plColumns: Column<MonthMetrics>[] = [
  { key: 'month', title: 'Месяц', render: (r) => r.longLabel },
  { key: 'revenue', title: 'Чистая выручка', align: 'right', render: (r) => tengeFull(r.netRevenue) },
  { key: 'gross', title: 'Валовая прибыль', align: 'right', render: (r) => tengeFull(r.grossProfit) },
  { key: 'opex', title: 'Расходы', align: 'right', render: (r) => tengeFull(r.opex) },
  { key: 'ebitda', title: 'EBITDA', align: 'right', render: (r) => tengeFull(r.ebitda) },
  { key: 'margin', title: 'Рентабельность', align: 'right', render: (r) => percent(r.margin) },
]

export function Finance() {
  const period = usePeriod()
  const rows = slice(period)
  const prev = previousSlice(period)

  const revenue = sum(rows, 'netRevenue')
  const ebitda = sum(rows, 'ebitda')
  const gross = sum(rows, 'grossProfit')
  const opex = sum(rows, 'opex')
  const margin = ebitda / revenue

  // План на период — прошлый период плюс 15 %
  const plan = sum(prev, 'netRevenue') * 1.15
  const execution = plan ? revenue / plan : 0
  const tone: Tone = execution >= 1 ? 'good' : execution >= 0.9 ? 'warning' : 'critical'
  const toneLabel =
    execution >= 1 ? 'План выполнен' : execution >= 0.9 ? 'Близко к плану' : 'План не выполнен'

  const monthly = rows.map((r) => ({
    label: r.label,
    revenue: r.netRevenue,
    opex: r.opex,
    payroll: r.payroll,
    marketing: r.marketing,
    content: r.content,
    platform: r.platform,
    admin: r.admin,
  }))

  // Отдельный массив: поле fill перекрывает цвет ряда, поэтому его нельзя
  // держать в данных, которые делят между собой несколько графиков
  const cashflow = rows.map((r) => ({
    label: r.label,
    cash: r.cashFlow,
    fill: r.cashFlow >= 0 ? DIVERGING.positive : DIVERGING.negative,
  }))

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Финансы</h1>
        <p className="page-lead">Доходы, расходы, прибыль и денежный поток за выбранный период.</p>
      </div>

      <div className="kpi">
        <HeroStat
          label="EBITDA за период"
          value={tenge(ebitda)}
          delta={change(ebitda, sum(prev, 'ebitda'))}
          caption={`Рентабельность ${percent(margin)} · выручка ${tenge(revenue)}`}
        />
        <div className="kpi__tiles">
          <StatTile
            label="Чистая выручка"
            value={tenge(revenue)}
            delta={change(revenue, sum(prev, 'netRevenue'))}
            trend={rows.map((r) => r.netRevenue)}
          />
          <StatTile
            label="Валовая прибыль"
            value={tenge(gross)}
            delta={change(gross, sum(prev, 'grossProfit'))}
            trend={rows.map((r) => r.grossProfit)}
          />
          <StatTile
            label="Операционные расходы"
            value={tenge(opex)}
            delta={change(opex, sum(prev, 'opex'))}
            upIsGood={false}
            trend={rows.map((r) => r.opex)}
            color={SERIES[1]}
          />
          <StatTile
            label="Рентабельность EBITDA"
            value={percent(margin)}
            delta={change(margin, sum(prev, 'ebitda') / sum(prev, 'netRevenue'))}
            trend={rows.map((r) => r.margin)}
          />
        </div>
      </div>

      <div className="grid">
        <Card title="Доходы и расходы" subtitle="По месяцам, тенге" wide>
          <ColumnsChart
            data={monthly}
            xKey="label"
            series={[
              { key: 'revenue', name: 'Чистая выручка', color: SERIES[0] },
              { key: 'opex', name: 'Расходы', color: SERIES[1] },
            ]}
            valueFormat={tenge}
            axisFormat={compactAxis}
            height={280}
          />
        </Card>

        <Card title="Структура расходов" subtitle="Части целого по месяцам, тенге">
          <ColumnsChart
            data={monthly}
            xKey="label"
            series={EXPENSE_ITEMS.map((item, i) => ({
              key: item.key,
              name: item.name,
              color: SERIES[i],
            }))}
            valueFormat={tenge}
            axisFormat={compactAxis}
            stacked
            totalLabel="Всего расходов"
          />
        </Card>

        <Card title="Денежный поток" subtitle="Поступления минус расходы, тенге">
          <ColumnsChart
            data={cashflow}
            xKey="label"
            series={[{ key: 'cash', name: 'Денежный поток', color: DIVERGING.positive }]}
            valueFormat={tenge}
            axisFormat={compactAxis}
            zeroLine
          />
        </Card>

        <Card title="Исполнение плана по выручке" subtitle="План — прошлый период плюс 15 %" wide>
          <div className="plan">
            <div className="plan__row">
              <span className="plan__value">{percent(execution, 0)}</span>
              <StatusBadge tone={tone}>{toneLabel}</StatusBadge>
            </div>
            <Meter value={execution} color={tone === 'good' ? 'var(--brand)' : STATUS[tone]} track="#dceef1" />
            <p className="plan__note">
              Факт {tenge(revenue)} из {tenge(plan)} · средняя выручка {tenge(avg(rows, 'netRevenue'))} в месяц
            </p>
          </div>
        </Card>

        <Card title="Отчёт о прибыли и убытках" subtitle="По месяцам за выбранный период" wide>
          <DataTable columns={plColumns} rows={[...rows].reverse()} rowKey={(r) => r.ym} />
        </Card>
      </div>
    </>
  )
}
