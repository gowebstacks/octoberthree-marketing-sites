'use client'

import { storyblokEditable } from '@storyblok/react'
import type { FC } from 'react'
import type { SbBlokData } from '@storyblok/react'

import { IconTextCard, IconTextCardProps } from '../../../molecules'
import { ContentBlock, ContentBlockBlok } from '../../../organisms'
import CTABar, { CTABarProps } from '../../../modules/ctaBar'
import { twMerge } from 'tailwind-merge'

interface IconCardRow {
  cardsPerRow?: string
  cards?: IconTextCardProps[]
}

export interface IconCardDeckProps extends SbBlokData {
  body?: ContentBlockBlok[]
  rows?: IconCardRow[]
  htmlId?: string
  minHeight?: 'none' | 'sm' | 'md' | 'lg',
  ctaBar?: CTABarProps[]
}

export const IconCardDeck: FC<IconCardDeckProps> = ({
  body,
  rows,
  htmlId,
  ctaBar,
  ...blok
}) => {
  return (
   
      <div className="max-w-360 mx-auto"  {...storyblokEditable(blok)}
      id={htmlId}>
        <div className="flex flex-col gap-12 sm:gap-16">

          {body?.length ? (
            <div className="flex flex-col gap-8">
              {body.map((nestedBlok) => (
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
                  className={`grid w-full grid-cols-1 gap-(--scale-24) justify-items-center ${
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

           {ctaBar && ctaBar?.map((cta) => (
            <CTABar
              key={cta._uid}
              blok={cta}
              className={twMerge(
               
                "mt-(--gaps-56-48-48) w-fit m-auto"
              )}
            />
          ))}

        </div>
      </div>
  )
}