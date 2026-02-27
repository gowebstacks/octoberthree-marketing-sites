'use client'

import { useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { ClusterTableBlok } from './types'
import { ClusterTableHeader } from './components/clusterTableHeader'
import { ClusterTableSection } from './components/clusterTableSection'


interface ClusterTableProps {
  blok: ClusterTableBlok
}

export function ClusterTable({ blok }: ClusterTableProps) {
  const [openSectionIndex, setOpenSectionIndex] = useState(0)

  const valueColumnCount = Math.max(blok.columns.length - 1, 0)

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full section-padding-xl bg-(--surface-background)"
    >
      <div className="overflow-x-auto max-w-(--widths-1280-704-343) w-full mx-auto">
        <div
          className="min-w-max grid border-t border-b border-(--stroke-secondary)"
          style={{
        gridTemplateColumns: `minmax(280px, 300px) repeat(${valueColumnCount}, minmax(120px,1fr))`,
          }}
        >
          <ClusterTableHeader columns={blok.columns} />

          {blok.sections.map((section, index) => (
            <ClusterTableSection
              key={section._uid}
              section={section}
              isOpen={openSectionIndex === index}
              valueColumnCount={valueColumnCount}
              onToggle={() =>
                setOpenSectionIndex(
                  openSectionIndex === index ? -1 : index
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}