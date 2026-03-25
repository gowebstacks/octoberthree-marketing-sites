import type { FC } from 'react'
import { storyblokEditable, SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'

import Image, { ImageFragment } from '../../molecules/image'

export interface ImageBlok extends SbBlokData {
  image: ImageFragment
  description?: string
}

interface ImageProps {
  blok: ImageBlok
  className?: string
  patternVariant?: 'sm' | 'md' | 'lg'
}

export const ImageWithDesc: FC<ImageProps> = ({ blok, className, patternVariant }) => {
  if (!blok?.image?.asset?.url) return null

  return (
    <div
  
      className={twMerge(
        'w-full overflow-hidden max-w-(--widths-1440-834-375) mx-auto',
        className
      )}
    >
      <div className="relative w-full">
        <Image
          {...blok.image}
          aspectRatio="16/9"
          objectCover
          unsetMaxWidth
          className="w-full"
          patternVariant={patternVariant}
        />
      </div>

      {blok.description && (
          <p className="text-rich-image-caption text-(--text-body) mt-(--gaps-16-12-12)">
            {blok.description}
          </p>
      )}
    </div>
  )
}
