'use client'

import { twMerge } from 'tailwind-merge'
import { Icon } from '../../atoms'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { storyblokEditable, SbBlokData } from '@storyblok/react'

type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string
  active?: boolean
  size?: 's' | 'l'
  showIcon?: boolean
  blok?: SbBlokData
  children?: ReactNode
}

export function Tab({
  title,
  active = false,
  size = 'l',
  showIcon = false,
  className,
  blok,
  children,
  ...props
}: TabProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        {...(blok ? storyblokEditable(blok) : {})}
        className={twMerge(
          'w-full flex items-center cursor-pointer',
          'border-b',
          'transition-colors',
          active
            ? 'text-(--text-headings) border-(--stroke-primary)'
            : 'text-(--text-disabled) border-(--stroke-card)',
          size === 'l' ? 'py-3 px-4' : '',
        'justify-between' ,'md:justify-center',
          className,
        )}
        {...props}
      >
        <span className="text-center">{title}</span>

        <span className="md:hidden">
          <Icon
            icon={active ? 'chevron-up' : 'chevron-down'}
            className="shrink-0 text-(--icon-primary)"
          />
        </span>
      </button>

      {active && (
        <div className="md:hidden w-full py-8">
          {children}
        </div>
      )}
    </div>
  )
}