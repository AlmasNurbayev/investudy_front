/**
 * Знак Investudy: три восходящих шеврона со стеблем — стрелка вверх.
 * Пропорции сняты с оригинального логотипа investudy.kz: шаг между
 * шевронами 9 единиц, плечи от вершины расходятся на 16 по горизонтали
 * и 10 по вертикали, толщина штриха совпадает с шириной стебля.
 */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const chevron = (apexY: number) => `M2,${apexY + 10} L18,${apexY} L34,${apexY + 10}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="4.3" strokeLinecap="butt" strokeLinejoin="miter">
        <path d={chevron(3.5)} />
        <path d={chevron(12.5)} />
        <path d={chevron(21.5)} />
        <path d="M18,21.5 L18,34" />
      </g>
    </svg>
  )
}

/** Логотип целиком: знак + строчное начертание названия. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} className="logo__mark" />
      <span className="logo__word">investudy</span>
    </span>
  )
}
