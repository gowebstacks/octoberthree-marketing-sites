'use client'

import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { storyblokEditable } from '@storyblok/react'
import { Button } from '../../../atoms'
import { RichText } from '../../richText/richText'
import { RichTextContent } from '../../../../types/storyblok'
import { StoryblokAsset } from '../../../../lib'
import Image from 'next/image'
import { storyblokLoader } from '../../../../utils/storyblokImageLoader'

export interface IconTextCardProps {
  _key: string
  icon?: StoryblokAsset
  heading?: string
  body?: RichTextContent
  button?: any[]
  theme?: 'light' | 'dark'
}

export const IconTextCard: FC<IconTextCardProps> = ({
  icon,
  heading,
  body,
  button = [],
  theme = 'light',
  ...blok
}) => {
  const hasButtons = button.length > 0

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        'flex h-full flex-col  border border-(--stroke-card)  transition-all duration-200',
        'bg-(--surface-card) h-fit',
        hasButtons &&
          'group cursor-pointer  hover:shadow-lg overflow-hidden rounded-sm'
      )}
    >
      {icon && (
        <div className="relative h-72 w-full p-8 grid  place-items-center bg-(--surface-icon-card)">
          <div className="square-pattern-white"></div>
          <Image
            loader={storyblokLoader}
            src={icon.filename}
            alt="icon"
            width={200}
            height={225}
  className="h-56.25 w-50 object-contain z-12"
          />
        </div>
      )}

      <div className="flex w-full flex-col gap-4 p-(--padding-24-18-18)">
        {heading && (
          <span className="text-display-2xl text-(--text-headings-dark)">
            {heading}
          </span>
        )}

        {body && (
          <div className="mt-4 text-(--text-body-dark)">
            <RichText
              doc={body}
              className="
                [&_p]:mb-0
                [&_strong]:font-semibold
                [&_em]:italic
                [&_u]:underline
              "
            />
          </div>
        )}
           {hasButtons && (
        <div className="mt-auto flex flex-col gap-3">
          {button.slice(0, 2).map((btn, index) => (
            <Button
              key={btn._uid || index}
              {...btn}
              tone={index === 0 ? 'primary' : 'secondary'}
              mode="filled"
              size="sm"
            />
          ))}
        </div>
      )}
      </div>

   
    </div>
  )
}