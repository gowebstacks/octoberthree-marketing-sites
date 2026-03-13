'use client'

import type { FC } from 'react'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { Heading, Icon, Link } from '../../../atoms'

export interface AuthorSocial extends SbBlokData {
  component?: 'authorSocial'
  type: 'twitter' | 'linkedin' | 'discord'
  href: string
}

export interface AuthorCardProps extends SbBlokData {
  component?: 'authorCard'
  name: string
  company?: string
  bio: string
  socials?: AuthorSocial[]
}

export const AuthorCard: FC<{ blok: AuthorCardProps }> = ({ blok }) => {
  const {
    name,
    company,
    bio,
    socials = [],
  } = blok

  return (
    <div
      {...storyblokEditable(blok)}
      className="
        w-full border border-(--stroke-primary)
        bg-(--surface-card)
        p-(--gaps-24-18-18)
      "
    >
      <div className="flex flex-col">
        <Heading
          heading={name}
          headingSize="2xl"
          className="text-display-2xl text-(--text-headings-dark)"
        />

        {company && (
          <span className="text-mono-sm uppercase tracking-wide text-(--text-eyebrow-date)">
            {company}
          </span>
        )}
      </div>

      <p className="mt-4 max-w-3xl text-sm text-(--text-body-dark)">
        {bio}
      </p>

      {socials.length > 0 && (
        <div className="mt-8 flex items-center gap-3">
          {socials.map((social) => (
            <Link
              key={social._uid}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-2.5
                flex items-center justify-center rounded-sm
                border border-(--icon-contained-icon)
                bg-(--surface-background)
                text-(--icon-contained-icon)
                transition-colors
                cursor-pointer
              "
              aria-label={social.type}
            >
              <Icon strokeWidth={0.1} icon={social.type} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}