import { createContext, useContext } from 'react'
import type { RangeId } from '../data/metrics'

/** Один фильтр периода сверху задаёт срез всем блокам страницы — цифры всегда согласованы. */
export const PeriodContext = createContext<RangeId>('12m')

export const usePeriod = (): RangeId => useContext(PeriodContext)
