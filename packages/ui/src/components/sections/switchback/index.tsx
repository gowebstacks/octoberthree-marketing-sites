'use client'

import type { FC } from 'react'
import Image from 'next/image'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'

import { ContentBlock, type ContentBlockBlok } from '../../organisms'
import { Video, type VideoBlok } from '../../modules'
import { storyblokLoader } from '../../../utils/storyblokImageLoader'

export interface SwitchbackBlok extends SbBlokData {
  content?: ContentBlockBlok[]
  mediaType?: 'image' | 'video'
  image?: {
    filename?: string
    alt?: string
  }
  video?: VideoBlok
  reverse?: boolean
}

export const Switchback: FC<{ blok: SwitchbackBlok }> = ({ blok }) => {
  const {
    content,
    mediaType = 'image',
    image,
    video,
    reverse = 'right',
  } = blok

  const isReversed = reverse 


  const renderMedia = () => {
    if (mediaType === 'image' && image?.filename) {
      const match = image.filename.match(/\/(\d+)x(\d+)\//)
      const width = match ? Number(match[1]) : 592
      const height = match ? Number(match[2]) : 475

      return (
        <Image
        loader={storyblokLoader}
          src={image.filename}
          alt={image.alt ?? ''}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />
      )
    }

    if (mediaType === 'video' && video) {
      return <Video blok={video} />
    }

    return null
  }

  return (
 
      <div
       {...storyblokEditable(blok)}
        className={twMerge(
          `
          mx-auto
          grid
          max-w-360
          grid-cols-1
          gap-16
          items-center
          lg:grid-cols-2
          `,
          isReversed && 'lg:[&>*:first-child]:order-2'
        )}
      >
        <div>
          {content?.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>

        <div className="relative w-full overflow-hidden">
          {renderMedia()}
        </div>
      </div>
 
  )
}