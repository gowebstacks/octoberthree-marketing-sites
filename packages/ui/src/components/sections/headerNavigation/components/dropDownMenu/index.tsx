'use client'

import type { FC } from 'react'
import Link from 'next/link'

import {
  StoryblokNavigationMenuItem,
  StoryblokMenuSection,
  StoryblokNavigationInnerItem,
} from '../../../../../types/storyblok'
import { Icon } from '../../../../atoms'
import { getLinkHref } from '../../../../../utils/getLinkHref'

const DropDownMenu: FC<StoryblokNavigationMenuItem> = ({ menuSection }) => {
  if (!menuSection || menuSection.length === 0) return null

  return (
    <div
      className="w-fit bg-(--surface-background) min-w-[260px]"
      
    >
      <div className="flex flex-col gap-6 p-(--scale-24)">
        {menuSection.map((section: StoryblokMenuSection, sectionIndex) => (
          <div key={section._uid} className="flex flex-col gap-4">
            <p className="text-mono-sm   uppercase tracking-wide text-(--text-nav-item)">
              {section.title}
            </p>

            <div className="flex flex-col gap-4">
              {section.items.map((item: StoryblokNavigationInnerItem) => {
               

                return (
                  <Link
                    key={item._uid}
                    href={getLinkHref(item.link)}
                    target={item.link.openInNewTab ? '_blank' : '_self'}
                    rel={
                      item.link.openInNewTab
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="flex cursor-pointer items-center gap-4"
                  >
                    {item.icon && (
                      <div className="flex h-6 w-6 rounded-sm items-center justify-center  bg-(--color-alphas-dark-navy)/60">
                        <Icon icon={item.icon} size={16} />
                      </div>
                    )}
                    <span className="text-xs text-(--text-nav-item) whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            {section.footer && (
              <Link
                href={
                 getLinkHref(section.footer.link)
                }
                className="cursor-pointer text-sm font-medium text-(--text-link-active)"
              >
                {section.footer.label}
              </Link>
            )}

            {sectionIndex < menuSection.length - 1 && (
              <div className="h-px w-full bg-(--color-navy-primary-300)" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DropDownMenu