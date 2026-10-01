type Props = {
  /** Доля исполнения: 0…1+ */
  value: number
  color: string
  /** Незаполненная часть — более светлый шаг того же тона, чтобы состояние читалось по всей полосе. */
  track: string
}

export function Meter({ value, color, track }: Props) {
  const pct = Math.max(0, Math.min(1, value))
  return (
    <div className="meter" style={{ background: track }}>
      <div className="meter__fill" style={{ width: `${pct * 100}%`, background: color }} />
    </div>
  )
}
