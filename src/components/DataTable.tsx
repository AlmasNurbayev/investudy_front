import type { ReactNode } from 'react'

export type Column<T> = {
  key: string
  title: string
  align?: 'left' | 'right'
  render: (row: T) => ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  caption?: string
}

/** Таблица: числа в колонках выровнены по разрядам моноширинными цифрами. */
export function DataTable<T>({ columns, rows, rowKey, caption }: Props<T>) {
  return (
    <div className="table-wrap">
      <table className="table">
        {caption && <caption className="table__caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.align === 'right' ? 'is-right' : undefined}>
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key} className={c.align === 'right' ? 'is-right' : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
