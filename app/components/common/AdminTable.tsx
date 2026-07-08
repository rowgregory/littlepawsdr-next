'use client'

import { ReactNode } from 'react'

export type Column<T> = {
  /** Header label. Empty string renders a blank header (e.g. for a chevron column). */
  header: string
  /** Cell renderer for this column. */
  cell: (row: T) => ReactNode
  /** Optional extra classes on the <td> (e.g. 'text-right', 'whitespace-nowrap'). */
  className?: string
  /** Optional extra classes on the <th>. */
  headerClassName?: string
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  /** Stable key per row. */
  rowKey: (row: T) => string
  /** Screen-reader caption for the table. */
  caption?: string
  /** Shown when rows is empty. */
  emptyMessage?: ReactNode
  /** Optional per-row classes (e.g. for hover/group). Defaults to the standard hover row. */
  rowClassName?: (row: T) => string
}

const defaultRowClass = 'group hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors'

export default function AdminTable<T>({ columns, rows, rowKey, caption, emptyMessage = 'No results', rowClassName }: Props<T>) {
  return (
    <div className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-x-auto">
      <table className="w-full text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark">
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-2.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark font-normal whitespace-nowrap ${
                  col.headerClassName ?? ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {rows.map((row) => (
            <tr key={rowKey(row)} className={rowClassName?.(row) ?? defaultRowClass}>
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
