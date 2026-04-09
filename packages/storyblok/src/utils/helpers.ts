import { StoryblokSiteSettings } from "@repo/ui";

export interface StoryblokSeo {
  _uid: string;
  component: 'seo';
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  opengraphImage?: {
    filename: string;
    alt?: string;
  };
}
export function renderMetadataFromStoryblok(
  slug: string,
  site:string,
  seo: StoryblokSeo | undefined,
  siteSettings: StoryblokSiteSettings | null
){
   
  const title = seo?.metaTitle || '';
  const description = seo?.metaDescription || '';
  const images = seo?.opengraphImage?.filename || siteSettings?.openGraphImage?.filename || '';

  const isHomepage = slug === '/' || slug === 'homepage' || !slug;
  const pathPart = isHomepage ? '' : `${slug}`;
  const url = `${site}${pathPart}`;
  const index = seo ? !seo.noIndex : true;
  const follow = seo ? !seo.noFollow : true;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images ? [{ url: images }] : [],
      url,
    },
    robots: {
      index,
      follow,
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(site),
  };
}