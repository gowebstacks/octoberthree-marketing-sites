import { ClusterColumnBlok } from "../types"

interface ClusterTableHeaderProps {
  columns: ClusterColumnBlok[]
}

export function ClusterTableHeader({ columns }: ClusterTableHeaderProps) {
  return (
    <>
      <div className="p-(--padding-24-18-18,24px) text-lg font-medium border-l border-r border-(--stroke-secondary)">
        {columns[0]?.label}
      </div>

      {columns.slice(1).map(column => (
        <div
          key={column._uid}
          className="p-(--padding-24-18-18,24px) text-center max-w-75 text-lg font-medium border-l border-r border-(--stroke-secondary) text-(--text-headings)"
        >
          {column.label}
        </div>
      ))}
    </>
  )
}