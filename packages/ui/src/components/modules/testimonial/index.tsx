'use client'

import type { FC } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'
import { Attribution, AttributionBlok } from '../../molecules'

export interface TestimonialBlok extends SbBlokData {
  quote: string
  author: AttributionBlok
}

interface TestimonialItemProps {
  blok: TestimonialBlok
  variant?: 'default' | 'card'
}

export const TestimonialItem: FC<TestimonialItemProps> = ({
  blok,
  variant = 'default',
}) => {
  const { quote, author } = blok

  const baseClasses = 'flex flex-col gap-6 relative '

  const variantClasses = {
    default:
      'lg:border-l-4 lg:pl-[34px] border-l-none pl-0 pt-[34px] border-t-4 border-(--stroke-primary) lg:border-t-0',
    card:
      'bg-[var(--surface-accent-card,#EFE9E3)] md:p-8 p-4 border border-(--stroke-secondary)',
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(baseClasses, variantClasses[variant])}
    >
      <div className='pattern-grid pattern-white opacity-30'></div>

      <blockquote className="text-(--text-headings) text-lg">
        “{quote}”
      </blockquote>

      <div className={twMerge(
        'flex items-start md:items-center justify-between flex-col md:flex-row! gap-4 ',
      )}>
        <Attribution
          blok={author}
          showAvatar={variant !== 'card'}
        />
      </div>
    </div>
  )
}