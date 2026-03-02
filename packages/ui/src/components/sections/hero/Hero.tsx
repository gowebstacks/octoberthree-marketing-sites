'use client'

import type { FC } from 'react'
import Image from 'next/image'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { ContentBlock, type ContentBlockBlok } from '../../organisms'
import { storyblokLoader } from '../../../utils/storyblokImageLoader'

export interface HeroBlok extends SbBlokData {
  content?: ContentBlockBlok[]
  image?: {
    filename: string
    alt?: string
  }
}

export const Hero: FC<{ blok: HeroBlok }> = ({ blok }) => {
  return (
    <section {...storyblokEditable(blok)} className="section-padding-xl bg-(--surface-background)">
      <div className="mx-auto grid max-w-7xl  grid-cols-1 gap-16 lg:grid-cols-2 items-center">

        <div >
          {blok.content?.map((nestedBlok) => (
            <ContentBlock
              key={nestedBlok._uid}
              blok={nestedBlok}
            />
          ))}
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden">
          {blok.image?.filename && (
            <Image
            loader={storyblokLoader}
              src={blok.image.filename}
              alt={blok.image.alt ?? ''}
              fill
              className="object-cover"
              priority

            />
          )}
        </div>

      </div>
    </section>
  )
}