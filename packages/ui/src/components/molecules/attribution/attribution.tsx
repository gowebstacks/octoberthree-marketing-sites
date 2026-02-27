'use client'

import type { FC } from 'react'
import { Avatar, Badge } from '../../atoms'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'

export interface AttributionBlok extends SbBlokData {
  name: string
  avatarSrc?: string
  role?: {
    label: string
    variant: 'navy' | 'cyan' | 'yellow' | 'teal' | 'orange'
  }
}

interface AttributionProps {
  blok?: AttributionBlok
  name?: string
  avatarSrc?: string
  role?: AttributionBlok['role']
  showAvatar?: boolean
  rounded?:boolean
}

export const Attribution: FC<AttributionProps> = ({
  blok,
  name,
  avatarSrc,
  role,
  showAvatar = true,
  rounded
}) => {
  const actualBlok = (blok as any)?.blok || blok

  const actualName = name || actualBlok?.name
  const actualAvatar = avatarSrc || actualBlok?.avatarSrc
  const actualRole = role || actualBlok?.role

  if (!actualName) return null

  return (
    <div
      {...(actualBlok ? storyblokEditable(actualBlok) : {})}
      className="inline-flex items-center gap-1.5 lg:gap-3"
    >
      {showAvatar && actualAvatar && (
        <Avatar src={actualAvatar} alt={actualName} rounded={rounded} />
      )}

      <div className="flex flex-col items-start gap-1">
        <div className="font-normal text-[16px] leading-6 lg:text-[18px] lg:leading-7 text-(--text-headings)">
          {actualName}
        </div>

        {actualRole && (
          <div className="[&_span]:text-[12px] [&_span]:leading-4.5 lg:[&_span]:text-[14px] lg:[&_span]:leading-6">
            <Badge
              label={actualRole.label}
              variant={actualRole.variant}
            />
          </div>
        )}
      </div>
    </div>
  )
}
