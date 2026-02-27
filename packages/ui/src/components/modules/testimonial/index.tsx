'use client'

import type { FC } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { twMerge } from 'tailwind-merge'
import { Attribution } from '../../molecules'

export interface TestimonialBlok extends SbBlokData {
  quote: string
  author: {
    name: string
    avatarSrc?: string
    role?: {
      label: string
      variant: 'navy' | 'cyan' | 'yellow' | 'teal' | 'orange'
    }
  }
  brandLogo?: {
    filename: string
    alt?: string
  }
}

interface TestimonialItemProps {
  blok: TestimonialBlok
  variant?: 'default' | 'card'
}

export const TestimonialItem: FC<TestimonialItemProps> = ({
  blok,
  variant = 'default',
}) => {
  const { quote, author, brandLogo } = blok

  const baseClasses = 'flex flex-col gap-6 '

  const variantClasses = {
    default:
      'lg:border-l-4 lg:pl-[34px] border-l-none pl-0 pt-[34px] border-t-4 border-(--stroke-primary) lg:border-t-0',
    card:
      'bg-(--surface-background) md:p-8 px-4 py-8 border border-(--stroke-secondary)',
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(baseClasses, variantClasses[variant])}
    >
      <blockquote className="text-(--text-headings) text-lg">
        “{quote}”
      </blockquote>

      <div className={twMerge(
        'flex items-start md:items-center justify-between flex-col md:flex-row gap-4 ',
        variant === 'card' && 'border-t border-(--stroke-primary) pt-6'
      )}>
        <Attribution
          blok={author}
          showAvatar={variant !== 'card'}
        />

        {brandLogo?.filename && (
          <div className="bg-(--surface-accent-background) px-2 py-3">
            <img
              src={brandLogo.filename}
              alt={brandLogo.alt || 'Brand logo'}
              className="h-6 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}
