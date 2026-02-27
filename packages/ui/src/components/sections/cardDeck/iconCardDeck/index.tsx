'use client'

import { storyblokEditable } from '@storyblok/react'
import type { FC } from 'react'
import type { SbBlokData } from '@storyblok/react'

import { IconTextCard, IconTextCardProps } from '../../../molecules'
import { ContentBlock, ContentBlockBlok } from '../../../organisms'

interface IconCardRow {
  cardsPerRow?: string
  cards?: IconTextCardProps[]
}

export interface IconCardDeckProps extends SbBlokData {
  content?: ContentBlockBlok[]
  rows?: IconCardRow[]
  htmlId?: string
  minHeight?: 'none' | 'sm' | 'md' | 'lg'
}

export const IconCardDeck: FC<IconCardDeckProps> = ({
  content,
  rows,
  htmlId,
  ...blok
}) => {
  return (
    <section
      {...storyblokEditable(blok)}
      id={htmlId}
      className="section-padding-xl bg-(--surface-background)"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12 sm:gap-16">

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

          {rows && (
            <div
              {...storyblokEditable(blok)}
              data-blok-field="rows"
              className="flex flex-col gap-8)"
            >
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`grid w-full grid-cols-1 gap-(--scale-32) justify-items-center ${
                    row.cardsPerRow === '2'
                      ? 'sm:grid-cols-2'
                      : row.cardsPerRow === '3'
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : 'sm:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {row.cards?.map((item, i) => {
                    const key =
                      (item as any)?._uid ||
                      (item as any)?._key ||
                      i

                    return (
                      <div
                        key={key}
                        {...((item as any)?.component
                          ? storyblokEditable(item as any)
                          : {})}
                        className="w-full h-full"
                      >
                        <IconTextCard {...(item as any)} />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}