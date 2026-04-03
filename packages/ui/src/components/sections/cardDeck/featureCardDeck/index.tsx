'use client'

import { storyblokEditable } from '@storyblok/react'
import type { FC } from 'react'
import type { SbBlokData } from '@storyblok/react'

import { FeatureCard, FeatureCardProps, Image } from '../../../molecules'
import CTABar, { CTABarProps } from '../../../modules/ctaBar'
import { twMerge } from 'tailwind-merge'
import type { StoryblokAsset } from '../../../../lib'

interface FeatureCardRow {
  cardsPerRow?: string
  cards?: FeatureCardProps[]
}

export interface FeatureCardDeckProps extends SbBlokData {
  rows?: FeatureCardRow[]
  htmlId?: string
  image?: StoryblokAsset
  ctaBar?: CTABarProps[]
}

export const FeatureCardDeck: FC<FeatureCardDeckProps> = (props) => {
    const blok = (props as any)?.blok || props;
      const { rows, htmlId, image, ctaBar } = blok;


  const hasImage = !!image?.filename

  return (
    <div
      {...storyblokEditable(blok)}
      id={htmlId}
      className="max-w-360 mx-auto"
    >
      <div
        className={twMerge(
          hasImage
            ? 'grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start'
            : 'flex flex-col gap-12'
        )}
      >
        {hasImage && (
          <div className="relative w-full h-full rounded-sm overflow-hidden">
            <Image
              asset={{
                url : image.filename
              }}
              alt={image.alt || 'image'}
              width={900}
              height={900}
              className='max-h-166 h-full w-300 h-auto'
              objectCover
            />
          </div>
        )}

        <div
          className={twMerge(
            'flex flex-col gap-8',
            hasImage && 'lg:max-h-166 lg:overflow-y-auto lg:pr-2'
          )}
        >
          {rows?.map((row : FeatureCardRow, rowIndex : number) => {
            const cols =
              row.cardsPerRow === '2'
                ? 'sm:grid-cols-2'
                : row.cardsPerRow === '3'
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-4'

            return (
              <div
                key={rowIndex}
                className={twMerge(
                  'grid w-full gap-(--scale-24)',
                  cols
                )}
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
                      <FeatureCard {...(item as any)} />
                    </div>
                  )
                })}
              </div>
            )
          })}

          {ctaBar?.map((cta : CTABarProps) => (
            <CTABar
              key={cta._uid}
              blok={cta}
              className="mt-(--gaps-56-48-48) w-fit m-auto"
            />
          ))}
        </div>
      </div>
    </div>
  )
}