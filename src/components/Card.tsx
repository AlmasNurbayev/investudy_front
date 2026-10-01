import type { ReactNode } from 'react'

type Props = {
  title: string
  /** Подзаголовок называет, что именно отложено по осям, и за какой период. */
  subtitle?: string
  children: ReactNode
  /** Карточка на всю ширину сетки. */
  wide?: boolean
}

export function Card({ title, subtitle, children, wide = false }: Props) {
  return (
    <section className={`card${wide ? ' card--wide' : ''}`}>
      <header className="card__head">
        <h2 className="card__title">{title}</h2>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}
