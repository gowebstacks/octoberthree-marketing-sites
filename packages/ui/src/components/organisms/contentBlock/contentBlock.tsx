'use client'

import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { RichText } from '../../molecules/richText/richText'
import { twMerge } from 'tailwind-merge'
import { Eyebrow, Heading, type EyebrowBlockProps } from '../../atoms'
import type { RichTextContent } from '../../../types/storyblok'
import CTABar, { CTABarProps } from '../../modules/ctaBar'

export interface ContentBlockBlok extends SbBlokData {
  eyebrow?: EyebrowBlockProps[]
  heading?: string
  content?: RichTextContent
  subheading?: string
  ctaBar?: CTABarProps[]   
  layout?: 'stacked' | 'leading' | 'split'
}

interface ContentBlockProps {
  blok: ContentBlockBlok, 
  headingSize?:string
}

export function ContentBlock({ blok, headingSize }: ContentBlockProps) {
  const {
    eyebrow,
    heading,
    content,
    subheading,
    ctaBar,
    layout = 'stacked',
  } = blok

  const layoutClasses = {
    stacked: 'mx-auto text-center',
    leading: '',
    split: 'grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center',
  }
  return (
    <div {...storyblokEditable(blok)}>
      <div
        className={twMerge(
          layoutClasses[layout],
          'max-w-(--widths-1280-704-343) '
        )}
      >
        <div>
          {eyebrow?.length ? <Eyebrow {...eyebrow[0]} /> : null}

          {heading && (
            <Heading
              as="h1"
              heading={heading}
              className={
                twMerge(
                  "mb-4 lg:max-w-200",
                  headingSize || 'text-display-5xl'
                )
              }
            />
          )}

          {layout !== 'split' && subheading && (
            <p className="text-sm mb-4 text-(--text-body-dark)">
              {subheading}
            </p>
          )}
        </div>

        <div>
          {layout === 'split' && subheading && (
            <p className="text-sm mb-4 text-(--text-body-dark)">
              {subheading}
            </p>
          )}

          {content && (
            <RichText
              doc={content}
              className={twMerge(
                layout === 'stacked' &&
                  '[&_ul]:w-fit [&_ul]:mx-auto [&_ul]:pl-0'
              )}
            />
          )}

          {ctaBar?.map((cta) => (
            <CTABar key={cta._uid} blok={cta} className={`${layout === 'stacked' && 'w-fit m-auto'} mt-8`}/>
          ))}
        </div>
      </div>
    </div>
  )
}