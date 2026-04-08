
import type {  Viewport } from 'next';
import { SanityMetadata } from '../types/sanity';
import { SITE_CONFIG, StoryblokSiteSettings } from '../lib';

export const renderMetadata = (
  slug?: string,
  seo?: SanityMetadata,
  siteSettings?: StoryblokSiteSettings | null,
): SanityMetadata => {
  const title = seo?.pageTitle || '';
  const description = seo?.pageDescription || '';
  
  // Use Storyblok site settings structure
  const images = seo?.openGraphImage?.asset?.url || 
    siteSettings?.openGraphImage?.filename || 
    SITE_CONFIG.seo.defaultImage;
  const site = SITE_CONFIG.urls.domain;
  
  const isHomepage = slug === '/' || slug === 'homepage' || !slug;
  const pathPart = isHomepage ? '' : `/${slug || ''}`;
  const url = `${site}${pathPart}`;
  const index = !seo?.noIndex;
  const follow = !seo?.noFollow;
  const canonical = url;

  const metadata = {
    title,
    description,
    openGraph: {
      images: [images],
      description,
      title,
    },
    robots: {
      index,
      follow,
    },
    metadataBase: new URL(site),
    alternates: {
      canonical,
    },
  };

  return metadata;
};

export const renderViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1.0,
  };
};


