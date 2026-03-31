import { twMerge } from 'tailwind-merge';

import type { ComponentPropsWithoutRef, FC } from 'react';
import parseUrl from '../../../utils/parseUrl';
import { getLinkHref } from '../../../utils/getLinkHref';

// Storyblok link data structure
export type StoryblokLink = {
  id?: number;
  uuid?: string;
  url?: string;
  linktype?: 'url' | 'story' | 'asset' | 'email';
  fieldtype?: 'multilink';
  cached_url?: string;
  target?: '_blank' | '_self';
  email?: string;
  subject?: string;
  body?: string;
  anchor?: string;
  story?: {
    id: number;
    name: string;
    uuid: string;
    slug: string;
    full_slug: string;
    is_folder: boolean;
    parent_id: number;
    published: boolean;
    default_full_slug: string;
  };
};

// Extended link fragment for component use (includes anchor links, popups, etc.)
export type LinkFragment = {
  _key?: string;
  _uid?: string;
  component?: string;
  anchorLinkId?: string;
  externalUrl?: string;
  internalLink?: StoryblokLink;
  linkType?: 'external' | 'internal' | 'popup' | 'anchor' | null;
  label?: string | null;
  openInNewTab?: boolean;
  popupform?: {
    _id?: string;
    formId?: string;
    name?: string;
  } | null;
} | StoryblokLink;

export type LinkProps = Omit<ComponentPropsWithoutRef<'a'> & ComponentPropsWithoutRef<'div'>, 'href'> & {
  /**
   * The optional link data for the link component.
   * This can be a string representing a URL or a Storyblok link object.
   */
  href?: LinkFragment | string | null;
  /**
   * Indicates whether the link should be disabled and not interactive.
   */
  disableFocus?: boolean;
};

export const getLinkData = (link?: LinkFragment | string | null) => {
  if (!link) return null;

  if (typeof link === 'string') return link || null;

  // Handle native Storyblok links
  if ('cached_url' in link) {
    if (link.linktype === 'email' && link.email) {
      return `mailto:${link.email}${link.subject ? `?subject=${encodeURIComponent(link.subject)}` : ''}${link.body ? `&body=${encodeURIComponent(link.body)}` : ''}`;
    }
    return link.cached_url || link.url || null;
  }

  // Handle extended link fragments (for backward compatibility)
  const extendedLink = link as any; // Type assertion for extended properties
  if (!extendedLink.linkType) return null;

  switch (extendedLink.linkType) {
    case 'internal':
      const slugPath = extendedLink.internalLink?.cached_url || '';
      return slugPath ? `/${slugPath.replace(/^\//, '')}` : null;
    case 'external':
      return extendedLink.externalUrl || null;
    case 'anchor':
      const anchorId = extendedLink.anchorLinkId;
      return anchorId ? `#${anchorId}` : null;
    default:
      return null;
  }
};

export const shouldOpenInNewTab = (link?: LinkFragment | string | null): boolean => {
  if (!link || typeof link === 'string') return false;
  
  // Handle native Storyblok links
  if ('target' in link) {
    return link.target === '_blank';
  }
  
  // Handle extended link fragments
  const extendedLink = link as any; // Type assertion for extended properties
  return !!extendedLink.openInNewTab;
};

export const Link: FC<LinkProps> = ({ children, href, className, disableFocus, ...props }) => {
  const linkData = getLinkHref(href);
  
  // Don't render if there's no valid link
  if (!linkData) {
    return <span className={className}>{children}</span>;
  }
  
  const openInNewTab = shouldOpenInNewTab(href); 
  const { as: Component, ...rest } = parseUrl(linkData, openInNewTab);
  return (
    <Component
      {...rest}
      {...props}
      className={twMerge(
        disableFocus ? 'outline-none' : 'dark:focus-outline-marine focus-outline-primary',
        className,
      )}
    >
      {children}
    </Component>
  );
};
