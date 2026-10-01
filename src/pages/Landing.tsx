import { Link } from 'react-router-dom'
import { HeroArt } from '../components/HeroArt'
import { num, percent, ratio, tenge } from '../lib/format'
import { slice, sum } from '../data/metrics'

const SECTIONS = [
  {
    to: '/sales',
    title: 'Продажи',
    text: 'Выручка, новые студенты, средний чек, воронка сделок и результаты менеджеров.',
  },
  {
    to: '/finance',
    title: 'Финансы',
    text: 'Доходы и расходы, структура затрат, денежный поток, исполнение плана и P&L.',
  },
  {
    to: '/marketing',
    title: 'Маркетинг',
    text: 'Лиды по каналам, стоимость привлечения, окупаемость и эффективность каналов.',
  },
]

export function Landing() {
  const year = slice('12m')
  const revenue = sum(year, 'netRevenue')
  const students = sum(year, 'newStudents')
  const ebitda = sum(year, 'ebitda')
  const spend = sum(year, 'marketing')

  const figures = [
    { label: 'Выручка', value: tenge(revenue) },
    { label: 'Новых студентов', value: num(students) },
    { label: 'Рентабельность EBITDA', value: percent(ebitda / revenue) },
    { label: 'ROMI', value: ratio((revenue - spend) / spend) },
  ]

  return (
    <div className="landing">
      <section className="landing__hero">
        <HeroArt />
        <div className="landing__hero-body">
          <h1 className="landing__title">Корпоративный портал</h1>
          <p className="landing__tagline">Инвестиции и финансовое здоровье граждан Казахстана</p>
          <p className="landing__lead">
            Единая витрина показателей компании. Продажи, финансы и маркетинг считаются из одного
            набора данных, поэтому цифры в разных разделах всегда сходятся между собой.
          </p>
        </div>
      </section>

      <section className="landing__figures" aria-label="Итоги за 12 месяцев">
        <h2 className="landing__section-title">Итоги за 12 месяцев</h2>
        <dl className="landing__figure-row">
          {figures.map((f) => (
            <div key={f.label} className="landing__figure">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="landing__sections" aria-label="Разделы портала">
        <h2 className="landing__section-title">Разделы</h2>
        <div className="landing__cards">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className="landing-card">
              <h3 className="landing-card__title">{s.title}</h3>
              <p className="landing-card__text">{s.text}</p>
              <span className="landing-card__cta" aria-hidden="true">
                Открыть →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
