'use client'

import type { FC } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { ContentBlock, ContentBlockBlok } from '../../organisms'
import { StatItem } from '../../modules'


interface StatItemBlok extends SbBlokData {
  value: string
  description: string
}

export interface MetricsBlockBlok extends SbBlokData {
  content?: ContentBlockBlok[]
  stat?: StatItemBlok[]
  htmlId?: string
}

export const MetricsBlock: FC<MetricsBlockBlok> = ({
  content,
  stat,
  htmlId,
  ...blok
}) => {
  return (
    
      <div
       {...storyblokEditable(blok)}
      id={htmlId}
        className="
           grid max-w-(--widths-1440-834-375)  mx-auto grid-cols-1
          gap-(--gaps-56-48-48)
          lg:grid-cols-2
        "
      >
        {content?.length ? (
          <div className="flex flex-col gap-8">
            {content.map((nestedBlok) => (
              <ContentBlock
                key={nestedBlok._uid}
                blok={nestedBlok}
              />
            ))}
          </div>
        ) : null}

        {stat?.length ? (
          <div
            className="
              grid 
              gap-y-(--gaps-56-48-48)
            "
          >
            {stat.slice(0, 3).map((stat) => (
              <div
                key={stat._uid}
                {...storyblokEditable(stat)}
              >
                <StatItem
                  blok={{
                    _uid: stat._uid,
                    value: stat.value,
                    description: stat.description,
                  }}
                  variant="nested"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
  )
}