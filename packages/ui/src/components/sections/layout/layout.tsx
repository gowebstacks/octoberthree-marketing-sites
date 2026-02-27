import React from 'react';
import { HeaderNavigation } from '../../sections/headerNavigation';
import { StoryblokGlobalNavigation } from '../../../types/storyblok';
import { getLatestGlobalNavigation } from '../../../lib/storyblok/client';
import { FooterNavigation } from '../footerNavigation';


// Types for the layout data
export interface Logo {
  asset: {
    url: string;
    _id: string;
  };
  alt?: string;
}

export interface NavigationItem {
  _key: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface Header {
  logo?: Logo;
  title: string;
  navigation: NavigationItem[];
}
export interface LayoutData {
  header: Header;
}

export interface LayoutProps {
  children: React.ReactNode;
  layoutData?: LayoutData;
}

/**
 * Layout component that wraps all pages
 * Renders header and footer
 * Uses Storyblok for both header navigation and footer
 */
export async function Layout({ children }: LayoutProps) {

  // Fetch header navigation data from Storyblok only
  let headerNavigation: StoryblokGlobalNavigation | null = null;
  try {
    const storyblokNav = await getLatestGlobalNavigation(false);
    if (storyblokNav) {
      headerNavigation = storyblokNav.content as StoryblokGlobalNavigation;
    }
  } catch (error) {
    console.error('Error fetching headerNavigation from Storyblok:', error);
  }

  return (
    <>
      <HeaderNavigation headerNavigation={headerNavigation} />
      <main className="grow">
        {children}
      </main>
      <FooterNavigation/>
      </>
  );
};
