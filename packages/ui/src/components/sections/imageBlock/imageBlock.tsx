import { cva } from 'class-variance-authority'
import { storyblokEditable } from '@storyblok/react'

import type { FC } from 'react'
import type { SbBlokData } from '@storyblok/react'
import { ImageWithDesc } from '../../modules'

// Storyblok-native props interface
export interface ImageBlockProps extends SbBlokData {
  component: 'imageBlock'
  image?: {
    filename: string
    alt?: string
  }
  description?: string
  size?: 'full' | 'large' | 'medium' | 'small'
  theme?: 'light' | 'dark'
  responsivePadding?: any
  htmlId?: string
  backgroundImage?: any
  minHeight?: 'none' | 'sm' | 'md' | 'lg'
}

const imageWrapperStyle = cva(['w-full', 'mx-auto'], {
  variants: {
    size: {
      full: '',
      large: 'max-w-[1008px]',
      medium: 'max-w-[768px]',
      small: 'max-w-[576px]',
    },
  },
  defaultVariants: {
    size: 'full',
  },
})

export const ImageBlock: FC<ImageBlockProps> = ({
  image,
  description,
  size,
  ...blok
}) => {
  // Helper function to render image for both Sanity and Storyblok (following switchback pattern)
  const renderImage = () => {
    if (!image?.filename) return null

    return (
      <ImageWithDesc
        blok={{
          _uid: blok._uid,
          component: 'image',
          image: {
            asset: {
              url: image.filename,
              _ref: '',
              _type: 'reference'
            },
            alt: image.alt,
          },
          description,
        }}
        className="w-full"
        patternVariant={size==='small' ? 'sm' : size==='medium' ? 'md' : 'lg'}
      />
    )
  }

  return (

      <div  {...storyblokEditable(blok)} className={imageWrapperStyle({ size })}>
        {renderImage()}
      </div>
 
  )
}