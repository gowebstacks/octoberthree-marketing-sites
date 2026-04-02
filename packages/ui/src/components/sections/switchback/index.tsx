'use client'

import type { FC } from 'react'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'

import { ContentBlock, type ContentBlockBlok } from '../../organisms'
import { Video, type VideoBlok } from '../../modules'
import { storyblokLoader } from '../../../utils/storyblokImageLoader'
import { Image } from '../../molecules'

export interface SwitchbackBlok extends SbBlokData {
  content?: ContentBlockBlok[]
  mediaType?: 'image' | 'video'
  image?: {
    filename?: string
    alt?: string
  }
  video?: VideoBlok[]
  reverse?: boolean
  accentColor?: 'primary' | 'secondary' | 'tertiary'
}

export const Switchback: FC<{ blok: SwitchbackBlok }> = ({ blok }) => {
  const {
    content,
    mediaType = 'image',
    image,
    video,
    reverse = 'right',
    accentColor = 'secondary',
  } = blok
  const isReversed = reverse 


  const renderMedia = () => {
    if (mediaType === 'image' && image?.filename) {
      const match = image.filename.match(/\/(\d+)x(\d+)\//)
      const width = match ? Number(match[1]) : 592
      const height = match ? Number(match[2]) : 475

      return (
        <Image
          asset={{
            url:image.filename
          }}
          alt={image.alt ?? ''}
          width={width}
          height={height}
          className="w-full h-auto object-cover sm:m-h-[467px]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          patternColor={accentColor}
        />
        
      )
    }

    if (mediaType === 'video' && video) {
      return <Video blok={video[0]} />
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
            <ContentBlock key={nestedBlok._uid} blok={{ ...nestedBlok, iconColor: accentColor }} />
          ))}
        </div>

        <div className="relative w-full overflow-hidden">
          {renderMedia()}
        </div>
      </div>
 
  )
}