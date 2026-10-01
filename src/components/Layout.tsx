import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { RANGES } from '../data/metrics'
import type { RangeId } from '../data/metrics'
import { PeriodContext } from '../lib/period'
import { Logo } from './Logo'

const NAV = [
  { to: '/sales', label: 'Продажи' },
  { to: '/finance', label: 'Финансы' },
  { to: '/marketing', label: 'Маркетинг' },
]

type Props = { period: RangeId; onPeriodChange: (id: RangeId) => void }

export function Layout({ period, onPeriodChange }: Props) {
  const { pathname } = useLocation()
  // На главной фильтровать нечего — она не показывает срез за период
  const showPeriod = pathname !== '/'

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <Link to="/" className="sidebar__home" aria-label="На главную">
            <Logo />
          </Link>
        </div>
        <nav className="sidebar__nav" aria-label="Разделы портала">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar__foot">
          Корпоративный портал
          <span>демо-данные</span>
        </p>
      </aside>

      <div className="main">
        {/* Фильтр стоит одной строкой над содержимым и распространяется на всё, что ниже */}
        <header className="topbar">
          {showPeriod ? (
            <div className="topbar__filters">
              <span className="topbar__label" id="period-label">
                Период
              </span>
              <div className="segmented" role="group" aria-labelledby="period-label">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`segmented__item${period === r.id ? ' is-active' : ''}`}
                    aria-pressed={period === r.id}
                    onClick={() => onPeriodChange(r.id)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <span />
          )}
          <p className="topbar__updated">Данные на 1 октября 2026</p>
        </header>

        <main className="content">
          <PeriodContext value={period}>
            <Outlet />
          </PeriodContext>
        </main>
      </div>
    </div>
  )
}
