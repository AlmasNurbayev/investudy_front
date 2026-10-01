import { RAW } from './source'
import type { RawMonth } from './source'

const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export type MonthMetrics = {
  ym: string
  /** «сен 26» — подпись для оси X */
  label: string
  /** «сентябрь 2026» — подпись для таблиц и подсказок */
  longLabel: string
  newStudents: number
  renewals: number
  refunds: number
  students: number
  avgCheck: number
  leads: number
  revenue: number
  refundAmount: number
  netRevenue: number
  marketing: number
  payroll: number
  platform: number
  content: number
  admin: number
  opex: number
  grossProfit: number
  ebitda: number
  margin: number
  cac: number
  romi: number
  leadToSale: number
  cashFlow: number
}

function derive(r: RawMonth): MonthMetrics {
  const [y, m] = r.ym.split('-').map(Number)
  const students = r.newStudents + r.renewals
  const revenue = r.newStudents * r.avgCheck + r.renewals * Math.round(r.avgCheck * 0.55)
  const refundAmount = r.refunds * r.avgCheck
  const netRevenue = revenue - refundAmount
  const opex = r.payroll + r.platform + r.content + r.admin + r.marketing
  // Себестоимость услуги: контент + платформа + половина ФОТ (преподаватели и кураторы)
  const cogs = r.content + r.platform + Math.round(r.payroll * 0.5)
  const grossProfit = netRevenue - cogs
  const ebitda = netRevenue - opex
  return {
    ym: r.ym,
    label: `${MONTHS_RU[m - 1]} ${String(y).slice(2)}`,
    longLabel: `${MONTHS_RU[m - 1]} ${y}`,
    newStudents: r.newStudents,
    renewals: r.renewals,
    refunds: r.refunds,
    students,
    avgCheck: r.avgCheck,
    leads: r.leads,
    revenue,
    refundAmount,
    netRevenue,
    marketing: r.marketing,
    payroll: r.payroll,
    platform: r.platform,
    content: r.content,
    admin: r.admin,
    opex,
    grossProfit,
    ebitda,
    margin: ebitda / netRevenue,
    cac: r.marketing / r.newStudents,
    romi: (netRevenue - r.marketing) / r.marketing,
    leadToSale: r.newStudents / r.leads,
    // Деньги приходят с лагом: часть оплат рассрочкой падает в следующем месяце
    cashFlow: Math.round(netRevenue * 0.88) - opex,
  }
}

export const ALL: MonthMetrics[] = RAW.map(derive)

/* ------------------------------------------------------------------ период */

export type RangeId = '3m' | '6m' | '12m' | '24m'

export const RANGES: { id: RangeId; label: string; months: number }[] = [
  { id: '3m', label: '3 месяца', months: 3 },
  { id: '6m', label: '6 месяцев', months: 6 },
  { id: '12m', label: '12 месяцев', months: 12 },
  { id: '24m', label: '24 месяца', months: 24 },
]

/** Срез за выбранный период. Один фильтр сверху задаёт его всем блокам страницы. */
export function slice(range: RangeId): MonthMetrics[] {
  const n = RANGES.find((r) => r.id === range)?.months ?? 12
  return ALL.slice(-n)
}

/** Предыдущий период такой же длины — база для расчёта динамики. */
export function previousSlice(range: RangeId): MonthMetrics[] {
  const n = RANGES.find((r) => r.id === range)?.months ?? 12
  return ALL.slice(Math.max(0, ALL.length - n * 2), ALL.length - n)
}

export const sum = (rows: MonthMetrics[], key: keyof MonthMetrics): number =>
  rows.reduce((acc, r) => acc + (r[key] as number), 0)

export const avg = (rows: MonthMetrics[], key: keyof MonthMetrics): number =>
  rows.length ? sum(rows, key) / rows.length : 0

/** Относительное изменение показателя к предыдущему периоду. */
export function change(current: number, previous: number): number | null {
  if (!previous) return null
  return (current - previous) / previous
}
