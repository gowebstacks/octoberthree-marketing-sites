import { StoryblokSiteSettings } from "@repo/ui";
import { getPageData, getWebsitePageBySlug } from "../api";

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
  const url = `${site}/${pathPart}`;
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


export async function generateMetaDataByslug(siteSlug:string,slugParam:string){
  try {
    const story = await getPageData(
      `${siteSlug}/${slugParam}${slugParam === "articles" ? "/" : ""}`,
      false 
    );

    if (!story) {
      return { title: "Page Not Found" };
    }

    const seo = story.content?.seo?.[0];

    return renderMetadataFromStoryblok(
      slugParam === "home" ? "" : slugParam,
      process.env.NEXT_PUBLIC_SITE_URL ||
        "https://october3-main-webstacks.vercel.app/",
      seo,
      null
    );
  } catch {
    return {
      title: "Website",
      description: "Website description",
    };
  }
}