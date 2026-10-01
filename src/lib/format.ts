const nf = new Intl.NumberFormat('ru-RU')
const nf1 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Целое число с разрядами: 7 147 */
export const num = (n: number): string => nf.format(Math.round(n))

/** Компактная сумма для плиток и осей: 134,4 млн ₸ */
export function tenge(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${nf1.format(n / 1e9)} млрд ₸`
  if (abs >= 1e6) return `${nf1.format(n / 1e6)} млн ₸`
  if (abs >= 1e3) return `${num(Math.round(n / 1e3))} тыс ₸`
  return `${num(n)} ₸`
}

/** Полная сумма для таблиц: 134 352 000 ₸ */
export const tengeFull = (n: number): string => `${num(n)} ₸`

/** Компактное число для подписей оси: 7,1 тыс */
export function compact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${nf1.format(n / 1e9)} млрд`
  if (abs >= 1e6) return `${nf1.format(n / 1e6)} млн`
  if (abs >= 1e3) return `${nf1.format(n / 1e3)} тыс`
  return num(n)
}

/** Засечка оси: без десятых, чтобы подпись не переносилась на две строки */
export function compactAxis(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${nf1.format(n / 1e9)} млрд`
  if (abs >= 1e6) return `${num(n / 1e6)} млн`
  if (abs >= 1e3) return `${num(n / 1e3)} тыс`
  return num(n)
}

/** Доля в процентах: 8,3 % */
export const percent = (x: number, digits = 1): string =>
  `${new Intl.NumberFormat('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(x * 100)} %`

/** Изменение со знаком: +12,4 % */
export const signedPercent = (x: number, digits = 1): string => (x > 0 ? '+' : '') + percent(x, digits)

/** Коэффициент: ×2,4 */
export const ratio = (x: number): string => `×${nf1.format(x)}`
