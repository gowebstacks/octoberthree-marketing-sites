import { Icon } from '../../../atoms'
import type { ClusterRowBlok } from '../types'

interface ClusterTableRowProps {
  row: ClusterRowBlok
  valueColumnCount: number
}

export function ClusterTableRow({
  row,
  valueColumnCount,
}: ClusterTableRowProps) {
  return (
    <div
      className="grid border-t border-(--stroke-secondary)"
      style={{
        gridTemplateColumns: `minmax(280px, 300px) repeat(${valueColumnCount}, minmax(120px,1fr))`,
      }}
    >
      <div className="p-(--padding-24-18-18) border-l border-r border-(--stroke-secondary)">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className='text-md text-(--text-headings)'>{row.label}</span>
            {row.description && <Icon icon="info-circle" />}
          </div>

          {row.description && (
            <span className="text-(--text-body-dark) text-sm">
              {row.description}
            </span>
          )}
        </div>
      </div>

      {row.values.map(value => (
        <div
          key={value._uid}
          className="flex items-center justify-center border-l border-r border-(--stroke-secondary) p-(--padding-24-18-18)"
        >
          {value.type === 'check' && <Icon icon="check-circle-filled" />}
          {value.type === 'cross' && <Icon icon="x-circle" />}
          {value.type === 'dash' && <span className='w-6 h-0.5 bg-(--icon-primary)' ></span>}
          {value.type === 'text' && <span>{value.text}</span>}
        </div>
      ))}
    </div>
  )
}