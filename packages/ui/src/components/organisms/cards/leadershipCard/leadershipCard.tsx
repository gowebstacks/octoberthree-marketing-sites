'use client'

import type { FC } from 'react'
import { storyblokEditable, SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'
import { Image } from '../../../molecules'
import { Badge, Heading } from '../../../atoms'

export interface LeadershipCardBlok extends SbBlokData {
  name: string
 role: string
 location:string
  image?: {
    filename: string
    alt?: string
  }
}

interface LeadershipCardProps {
  blok: LeadershipCardBlok
  className?: string
}

export const LeadershipCard: FC<LeadershipCardProps> = ({
  blok,
  className,
}) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        'flex h-full flex-col overflow-hidden bg-white border border-(--color-cream-200) rounded-sm hover:shadow-md transi',
        className
      )}
    >
      {blok.image?.filename && (
        <Image
          asset={{
            url: blok.image.filename,
          }}
          alt={blok.image.alt || blok.name}
          aspectRatio="3/4"
          objectCover
          unsetMaxWidth
          className="w-full bg-gray-100 h-77 rounded-none!"
          sizes="(max-width: 768px) 100vw, 300px"
          patternVariant='sm'
          showPatternOnHover
        />
      )}

      <div className="w-full bg-(--surface-secondary-background) p-(--padding-20-18-18)  border-t border-(--color-cream-200) flex flex-col gap-2">
       
        <Heading size={'2xl'} as='h3'>
          {blok.name}

        </Heading>
        <p className="text-sm text-(--text-body-dark)">
          {blok.role}
        </p>
       {
        blok.location &&  <Badge  label={blok.location}>
        </Badge>
       }
      </div>
    </div>
  )
}