import type { MonthMetrics } from './metrics'
import { sum } from './metrics'

/* ---------------------------------------------------------------- каналы */

/**
 * Каналы привлечения. Доли и конверсии зафиксированы, поэтому разрез
 * по каналам всегда сходится с итогами по месяцам.
 */
const CHANNELS = [
  { id: 'instagram', name: 'Instagram', leadShare: 0.34, spendShare: 0.33, convIndex: 0.92, drift: -0.004 },
  { id: 'youtube', name: 'YouTube', leadShare: 0.21, spendShare: 0.21, convIndex: 1.28, drift: 0.005 },
  { id: 'google', name: 'Google Ads', leadShare: 0.18, spendShare: 0.25, convIndex: 0.84, drift: -0.002 },
  { id: 'email', name: 'Email-рассылки', leadShare: 0.12, spendShare: 0.09, convIndex: 1.45, drift: 0.001 },
  { id: 'organic', name: 'Органика и рекомендации', leadShare: 0.15, spendShare: 0.12, convIndex: 1.1, drift: 0.0 },
] as const

export type ChannelId = (typeof CHANNELS)[number]['id']
export const CHANNEL_NAMES = CHANNELS.map((c) => c.name)

export type ChannelMonth = { label: string; longLabel: string; values: number[] }

/** Лиды по каналам по месяцам — для стопки. */
export function leadsByChannel(rows: MonthMetrics[]): ChannelMonth[] {
  return rows.map((r, i) => {
    const shares = CHANNELS.map((c) => Math.max(0.02, c.leadShare + c.drift * i))
    const total = shares.reduce((a, b) => a + b, 0)
    return {
      label: r.label,
      longLabel: r.longLabel,
      values: shares.map((s) => Math.round((r.leads * s) / total)),
    }
  })
}

export type ChannelStat = {
  id: ChannelId
  name: string
  leads: number
  students: number
  spend: number
  revenue: number
  cac: number
  romi: number
  conversion: number
}

/** Сводка по каналам за период: расход, выручка, CAC и ROMI. */
export function channelStats(rows: MonthMetrics[]): ChannelStat[] {
  const leads = sum(rows, 'leads')
  const spend = sum(rows, 'marketing')
  const students = sum(rows, 'newStudents')
  const revenue = sum(rows, 'netRevenue')

  const weights = CHANNELS.map((c) => c.leadShare * c.convIndex)
  const weightTotal = weights.reduce((a, b) => a + b, 0)

  return CHANNELS.map((c, i) => {
    const chLeads = Math.round(leads * c.leadShare)
    const chStudents = Math.round((students * weights[i]) / weightTotal)
    const chSpend = Math.round(spend * c.spendShare)
    const chRevenue = Math.round((revenue * weights[i]) / weightTotal)
    return {
      id: c.id,
      name: c.name,
      leads: chLeads,
      students: chStudents,
      spend: chSpend,
      revenue: chRevenue,
      cac: chStudents ? chSpend / chStudents : 0,
      romi: chSpend ? (chRevenue - chSpend) / chSpend : 0,
      conversion: chLeads ? chStudents / chLeads : 0,
    }
  })
}

/* ---------------------------------------------------------------- курсы */

const COURSES = [
  { name: 'Инвестор PRO', share: 0.31 },
  { name: 'Базовый курс', share: 0.26 },
  { name: 'Личные финансы', share: 0.18 },
  { name: 'Менторская группа', share: 0.15 },
  { name: 'Клуб выпускников', share: 0.1 },
]

export type CourseStat = { name: string; revenue: number; students: number }

/** Выручка по продуктам за период. Категории номинальные — порядок ничего не кодирует. */
export function courseStats(rows: MonthMetrics[]): CourseStat[] {
  const revenue = sum(rows, 'netRevenue')
  const students = sum(rows, 'students')
  return COURSES.map((c) => ({
    name: c.name,
    revenue: Math.round(revenue * c.share),
    students: Math.round(students * c.share),
  })).sort((a, b) => b.revenue - a.revenue)
}

/* ---------------------------------------------------------------- воронка */

export type FunnelStage = { name: string; value: number }

/**
 * Стадии упорядочены — на графике они получают порядковую шкалу одного тона,
 * чтобы порядок читался в самом цвете.
 */
export function funnel(rows: MonthMetrics[]): FunnelStage[] {
  const leads = sum(rows, 'leads')
  const paid = sum(rows, 'newStudents')
  const repeat = sum(rows, 'renewals')
  return [
    { name: 'Лиды', value: leads },
    { name: 'Квалифицированы', value: Math.round(leads * 0.58) },
    { name: 'Консультация', value: Math.round(leads * 0.33) },
    { name: 'Оплата', value: paid },
    { name: 'Повторная покупка', value: repeat },
  ]
}

/* ---------------------------------------------------------------- менеджеры */

const MANAGERS = [
  { name: 'Айгерим Сапарова', share: 0.22, conv: 0.094 },
  { name: 'Данияр Ермеков', share: 0.2, conv: 0.088 },
  { name: 'Мадина Оспанова', share: 0.18, conv: 0.085 },
  { name: 'Арман Тулегенов', share: 0.16, conv: 0.079 },
  { name: 'Жанна Бекова', share: 0.13, conv: 0.072 },
  { name: 'Нурлан Абишев', share: 0.11, conv: 0.065 },
]

export type ManagerStat = {
  name: string
  revenue: number
  deals: number
  conversion: number
  plan: number
}

/** Результаты отдела продаж за период. */
export function managerStats(rows: MonthMetrics[]): ManagerStat[] {
  const revenue = sum(rows, 'netRevenue')
  const deals = sum(rows, 'newStudents')
  // План распределён равномерно — отсюда разное исполнение у менеджеров
  const planPerPerson = revenue / MANAGERS.length
  return MANAGERS.map((m) => {
    const rev = Math.round(revenue * m.share)
    return {
      name: m.name,
      revenue: rev,
      deals: Math.round(deals * m.share),
      conversion: m.conv,
      plan: rev / planPerPerson,
    }
  })
}

/* ---------------------------------------------------------------- расходы */

export type ExpenseKey = 'payroll' | 'marketing' | 'content' | 'platform' | 'admin'

export const EXPENSE_ITEMS: { key: ExpenseKey; name: string }[] = [
  { key: 'payroll', name: 'ФОТ' },
  { key: 'marketing', name: 'Маркетинг' },
  { key: 'content', name: 'Контент' },
  { key: 'platform', name: 'Платформа' },
  { key: 'admin', name: 'Административные' },
]
