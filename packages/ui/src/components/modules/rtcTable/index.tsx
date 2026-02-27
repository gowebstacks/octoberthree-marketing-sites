'use client'

import { FC, useMemo, useState } from 'react'
import { Icon } from '../../atoms'
import { BlogPagination } from '../../molecules'

type RTTextNode = { type: 'text'; text?: string }
type RTParagraphNode = { type: 'paragraph'; content?: RTTextNode[] }
type RTTableCellNode = {
  type: 'tableCell' | 'tableHeader'
  attrs?: { colspan?: number; rowspan?: number; colwidth?: number[] | null; backgroundColor?: string | null }
  content?: RTParagraphNode[]
}
type RTTableRowNode = { type: 'tableRow'; content?: RTTableCellNode[] }
export type RTTableNode = { type: 'table'; content?: RTTableRowNode[] }

interface RTCTableProps {
  node: RTTableNode
  pageSize?: number
}

const getCellText = (cell?: RTTableCellNode): string =>
  cell?.content?.[0]?.content?.map(n => n.text || '').join('') || ''

const parseTableNode = (node: RTTableNode) => {
  const headers: string[] = []
  const rows: string[][] = []

  node.content?.forEach((row, i) => {
    const cells: string[] = []
    row.content?.forEach(cell => {
      const value = getCellText(cell)
      if (cell.type === 'tableHeader' && i === 0) headers.push(value)
      if (cell.type === 'tableCell') cells.push(value)
    })
    if (cells.length) rows.push(cells)
  })

  return { headers, rows }
}

const renderCell = (value: string) => {
  const v = value.trim().toLowerCase()
  if (!v || v === '-' || v === '—') return <div className="h-0.5 w-4 bg-(--text-headings) mx-auto" />
  if (['yes', 'true', 'check'].includes(v)) return <Icon icon="check-circle-filled" size={18} className="mx-auto text-(--text-headings)" />
  return value
}

export const RTCTable: FC<RTCTableProps> = ({ node, pageSize = 6 }) => {
  const { headers, rows } = useMemo(() => parseTableNode(node), [node])
  const [page, setPage] = useState(1)

  if (!headers.length || !rows.length) return null

  const start = (page - 1) * pageSize
  const paginatedRows = rows.slice(start, start + pageSize)

  return (
    <div className="my-12 space-y-10">
      <div className="overflow-x-auto bg-(--surface-background) md:p-(--padding-40-32-32) py-(--padding-top-bottom-sectional-full) section-padding-xl-left-right">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-(--scale-24) py-(--gaps-24-18-18) text-md font-medium text-(--text-headings) text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, i) => (
              <tr key={`${page}-${i}`} className={i % 2 === 0 ? 'bg-(--surface-table-cell)/60 border-t border-b border-(--stroke-primary)' : ''}>
                {row.map((cell, j) => (
                  <td key={j} className="px-(--scale-24) py-(--gaps-24-18-18) text-md text-(--text-headings) text-center">
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > pageSize && (
        <BlogPagination currentPage={page} totalItems={rows.length} itemsPerPage={pageSize} onPageChange={setPage} />
      )}
    </div>
  )
}