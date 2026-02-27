import { Icon } from '../../../atoms'
import type { ClusterSectionBlok } from '../types'
import { ClusterTableRow } from './clusterTableRow'

interface ClusterTableSectionProps {
  section: ClusterSectionBlok
  isOpen: boolean
  valueColumnCount: number
  onToggle: () => void
}

export function ClusterTableSection({
  section,
  isOpen,
  valueColumnCount,
  onToggle,
}: ClusterTableSectionProps) {
  return (
    <div className="col-span-full">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full text-md text-(--text-headings) items-center gap-2 px-4 py-3 border-t border-l border-r border-(--stroke-secondary)"
      >
        <Icon
          icon="chevron-up"
          
          className={`transition-transform text-(--icon-primary) ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
        />
        {section.title}
      </button>

      {isOpen &&
        section.rows.map(row => (
          <ClusterTableRow
            key={row._uid}
            row={row}
            valueColumnCount={valueColumnCount}
          />
        ))}
    </div>
  )
}