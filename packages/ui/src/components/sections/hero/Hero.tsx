'use client'

import type { FC } from 'react'
import Image from 'next/image'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { ContentBlock, type ContentBlockBlok } from '../../organisms'
import { storyblokLoader } from '../../../utils/storyblokImageLoader'

export interface HeroBlok extends SbBlokData {
  body?: ContentBlockBlok[]
  heroImage?: {
    filename: string
    alt?: string
  }
}

export const Hero: FC<{ blok: HeroBlok }> = ({ blok }) => {
  return (
   
       <div
      className="mx-auto  grid max-w-(--widths-1440-834-375)  grid-cols-1 gap-16 lg:grid-cols-2 items-center"
      {...storyblokEditable(blok)}
    >

        <div >
          {blok.body?.map((nestedBlok) => (
            <ContentBlock
              key={nestedBlok._uid}
              blok={nestedBlok}
            />
          ))}
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden">
          {blok.heroImage?.filename && (
            <Image
            loader={storyblokLoader}
              src={blok.heroImage.filename}
              alt={blok.heroImage.alt ?? ''}
              fill
              className="object-cover"
              priority

            />
          )}
        </div>

      </div>

  )
}