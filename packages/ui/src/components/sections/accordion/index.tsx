'use client'

import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import type { FC } from 'react'

import { ContentBlock, type ContentBlockBlok } from '../../organisms'
import { AccordionItem } from '../../organisms'
import type { AccordionItem as AccordionItemProps } from '../../organisms/accordion/accordion'
import { getFaqSchema } from './utils/getFaqSchema'
import { containerStyle } from './styles'
import { twMerge } from 'tailwind-merge'

export interface AccordionProps extends SbBlokData {
  component: 'accordion'
  body?: ContentBlockBlok[]
  items?: AccordionItemProps[]
  layout?: 'stack' | 'split'
}

export const Accordion: FC<AccordionProps> = ({
  body,
  items = [],
  layout,
  ...blok
}) => {

  const faqSchema =
    items.length > 0 &&
    getFaqSchema(
      items.map((item: any) => ({
        _uid: item._uid,
        label: item.label,
        body: item.body,
      }))
    )


  return (
  
      <div
      className='max-w-360 mx-auto '
      >
        {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      <div  {...storyblokEditable(blok)} className={twMerge(containerStyle({ layout }), ' max-w-360 mx-auto')}>
        {body?.length ? (
          <div>
            {body.map((nestedBlok) => (
              <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
            ))}
          </div>
        ) : null}

        {items.length > 0 && (
          <div className="w-full lg:flex-1">
            <AccordionItem items={items} />
          </div>
        )}
      </div>
      </div>
 
  )
}