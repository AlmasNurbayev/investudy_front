/**
 * Hero-иллюстрация для главной. Собственная графика в фирменных цветах:
 * восходящий график и мотив шевронов из знака Investudy.
 * Декоративная — скрыта от скринридеров, смысл несёт текст поверх неё.
 */
export function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 1200 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#046974" />
          <stop offset="55%" stopColor="#06707a" />
          <stop offset="100%" stopColor="#09909c" />
        </linearGradient>
        <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>
        {/* затемнение слева: текст поверх иллюстрации не должен терять контраст,
            когда градиент на широком экране уходит в светлый тон */}
        <linearGradient id="heroScrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#02474f" stopOpacity="0.86" />
          <stop offset="42%" stopColor="#02474f" stopOpacity="0.62" />
          <stop offset="78%" stopColor="#02474f" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#02474f" stopOpacity="0" />
        </linearGradient>
        <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>

      <rect width="1200" height="340" fill="url(#heroBg)" />

      {/* мягкие световые пятна — дают глубину вместо плоской заливки */}
      <g filter="url(#heroGlow)" opacity="0.5">
        <ellipse cx="1010" cy="40" rx="210" ry="130" fill="#2fc3cf" opacity="0.55" />
        <ellipse cx="180" cy="320" rx="240" ry="140" fill="#025059" opacity="0.7" />
      </g>

      {/* сетка как на биржевом графике */}
      <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1">
        {[68, 136, 204, 272].map((y) => (
          <line key={y} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>

      {/* столбцы объёма у основания */}
      <g fill="#ffffff" fillOpacity="0.1">
        {[
          [60, 28], [120, 44], [180, 36], [240, 58], [300, 48], [360, 70],
          [420, 62], [480, 86], [540, 74], [600, 96], [660, 88], [720, 112],
          [780, 102], [840, 128], [900, 118], [960, 146], [1020, 138], [1080, 166],
        ].map(([x, h]) => (
          <rect key={x} x={x} y={340 - h} width="22" height={h} rx="4" />
        ))}
      </g>

      {/* восходящая линия с заливкой */}
      <path
        d="M0,252 L100,238 L200,246 L300,212 L400,220 L500,192 L600,200 L700,166 L800,176 L900,142 L1000,132 L1100,104 L1200,86 L1200,340 L0,340 Z"
        fill="url(#heroArea)"
      />
      <path
        d="M0,252 L100,238 L200,246 L300,212 L400,220 L500,192 L600,200 L700,166 L800,176 L900,142 L1000,132 L1100,104 L1200,86"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g fill="#ffffff">
        {[[300, 212], [700, 166], [1100, 104]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fillOpacity="0.95" />
        ))}
      </g>

      {/* мотив знака: три шеврона */}
      <g
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="9"
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d="M940,150 L1010,80 L1080,150" />
        <path d="M940,190 L1010,120 L1080,190" />
        <path d="M940,230 L1010,160 L1080,230" />
      </g>

      <rect width="1200" height="340" fill="url(#heroScrim)" />
    </svg>
  )
}
