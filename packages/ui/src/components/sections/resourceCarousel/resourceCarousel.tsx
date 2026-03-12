'use client'

import { useRef, useState, useEffect, type FC } from 'react'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import {
  ContentBlock,
  ContentBlockBlok,
  ResourceCard,
  ResourceCardProps,
} from '../../organisms'
import { CarouselButton } from '../../atoms'

export interface ResourceCarouselBlok extends SbBlokData {
  content?: ContentBlockBlok[]
  resources?: ResourceCardProps[]
  htmlId?: string
}

export const ResourceCarousel: FC<ResourceCarouselBlok> = ({
  content,
  resources = [],
  htmlId,
  ...blok
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    if (!trackRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current

    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }

  const scrollByCard = (direction: 'left' | 'right') => {
    if (!trackRef.current) return

    const cardWidth =
      trackRef.current.querySelector<HTMLElement>('[data-card]')?.offsetWidth ||
      0

    trackRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    updateScrollState()

    const el = trackRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  return (
  
      <div
       {...storyblokEditable(blok)}
      id={htmlId}
        className="
          mx-auto grid  max-w-(--widths-1440-834-375) grid-cols-1
          gap-y-(--gaps-56-48-48)
          gap-x-(--gaps-56-48-48)
          lg:grid-cols-2
        "
      >
        {content?.length ? (
          <div className="flex flex-col gap-8">
            {content.map((nestedBlok) => (
              <ContentBlock
                key={nestedBlok._uid}
                blok={nestedBlok}
              />
            ))}
          </div>
        ) : null}

        <div className="relative flex flex-col">
          <div
            ref={trackRef}
            className="
              flex gap-x-(--gaps-16-12-12)
              overflow-x-auto scroll-smooth
              snap-x snap-mandatory
              pb-4
            "
          >
            {resources.map((resource) => (
              <div
                key={resource._id}
                data-card
                className="snap-start shrink-0"
              >
                <ResourceCard {...resource}  carousel={true}/>
              </div>
            ))}
          </div>

        {
          !!resources.length &&
            <div className="mt-6 flex justify-end gap-3">
            <CarouselButton
              direction="left"
              disabled={!canScrollLeft}
              onClick={() => scrollByCard('left')}
            />
            <CarouselButton
              direction="right"
              disabled={!canScrollRight}
              onClick={() => scrollByCard('right')}
            />
          </div>
        }
        </div>
      </div>
  )
}