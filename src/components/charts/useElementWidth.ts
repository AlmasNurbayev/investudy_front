import { useEffect, useRef, useState } from 'react'

/**
 * Ширина контейнера. Нужна там, где размер в пикселях приходится считать
 * самим, — например, полоса подписей у горизонтальных столбцов: на узком
 * экране фиксированные 170 px не оставили бы места самим столбцам.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width
      if (w) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, width }
}
