'use client'

import type { FC } from 'react'
import { cva } from 'class-variance-authority'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { Video, VideoBlok } from '../../modules'

export interface VideoBlockBlok extends SbBlokData {
  autoPlay?: boolean
  size?: 'full' | 'large' | 'medium' | 'small'
  video?: VideoBlok[]
}

// same width system as ImageBlock
const videoWrapperStyle = cva(['w-full', 'mx-auto'], {
  variants: {
    size: {
      full: 'max-w-360',
      large: 'max-w-[1008px]',
      medium: 'max-w-[768px]',
      small: 'max-w-[576px]',
    },
  },
  defaultVariants: {
    size: 'full',
  },
})

export const VideoBlock: FC<{ blok: VideoBlockBlok }> = ({ blok }) => {
  if (!blok) return null

  const {
    size = 'full',
    video,
    autoPlay = false,
  } = blok

  const videoItem = video?.[0]

  if (!videoItem) return null

  return (
    <div
      {...storyblokEditable(blok)}
      className={videoWrapperStyle({ size })}
    >
      <Video
        blok={{
          _uid: `${blok._uid}-video`,
          component: 'video',
          autoPlay,
          ...videoItem,
        }}
      />
    </div>
  )
}