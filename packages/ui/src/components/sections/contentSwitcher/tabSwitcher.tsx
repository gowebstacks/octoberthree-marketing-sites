'use client'

import { useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'

import { ImageProps, Tab } from '../../molecules'
import { ContentBlock, ContentBlockBlok } from '../../organisms'
import { Image } from '../../molecules'

interface TabbedSwitcherTabBlok extends SbBlokData {
  title: string
  content: ContentBlockBlok
  image: ImageProps
}

interface TabbedSwitcherBlok extends SbBlokData {
  tabs: TabbedSwitcherTabBlok[]
  defaultActiveIndex?: number,
  content? : ContentBlockBlok
}

interface TabbedSwitcherProps {
  blok: TabbedSwitcherBlok
}

export const TabbedSwitcher = ({ blok }: TabbedSwitcherProps) => {
  const [activeIndex, setActiveIndex] = useState(
    blok.defaultActiveIndex ?? 0
  )

  const activeTab = blok.tabs[activeIndex]

  if (!activeTab) return null

  return (
    <section {...storyblokEditable(blok)} className="w-full section-padding-xl bg-(--surface-background)">
       {blok.content && (
        <div className="mb-(--gaps-48-32-32)">
          <ContentBlock blok={blok.content} />
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {blok.tabs.map((tab, index) => (
          <Tab
            key={tab._uid}
            blok={tab}
            title={tab.title}
            size="l"
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <div className="grid w-full grid-cols-1 gap-16">
              <ContentBlock blok={tab.content} headingSize="3xl" />

              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  {...tab.image}
                  unsetRatio
                  unsetMaxWidth
                  objectCover
                  className="absolute inset-0"
                />
              </div>
            </div>
          </Tab>
        ))}
      </div>

      <div className="hidden md:block mt-(--gaps-32-24-24)">
        <div className="mx-auto grid w-full grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <ContentBlock blok={activeTab.content} headingSize="3xl" />

          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              {...activeTab.image}
              unsetRatio
              unsetMaxWidth
              objectCover
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}