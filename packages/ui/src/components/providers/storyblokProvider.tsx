'use client';

import { storyblokInit, apiPlugin, StoryblokComponent, storyblokEditable } from '@storyblok/react';
// import { HeadingBlock } from '../sections/headingBlock';
import CTABar from '../modules/ctaBar';
// import { ImageCardDeck } from '../sections/cardDeck/imageCardDeck';
// import { IconCardDeck } from '../sections/cardDeck/iconCardDeck';
import { ImageBlock, StatisticsPanel } from '../sections';

// import { AwardsBlade } from '@/components/sections/awardsBlade';
// import { Accordion } from '@/components/sections/accordion';
// import { Switchback } from '@/components/sections/switchback';

// import { TestimonialSlider } from '@/components/sections/testimonialSlider/testimonialSlider';

// Create a simple SectionLayout component for Storyblok
const SectionLayout = ({ blok }: { blok: any }) => {
  return (
    <div {...storyblokEditable(blok)} className="section-layout">
      {blok.section?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

// Create a simple WebsitePage component for Storyblok
const WebsitePage = ({ blok }: { blok: any }) => (
  <div {...storyblokEditable(blok)}>
    {blok.sections?.map((child: any) => (
      <StoryblokComponent blok={child} key={child._uid} />
    ))}
  </div>
);

// Initialize Storyblok with your components
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN || process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'us',
  },
  components: {
    websitePage: WebsitePage,
    sectionLayout: SectionLayout,
    // headingBlock: HeadingBlock,
    // ctaBar: CTABar,
    // imageCardDeck: ImageCardDeck,
    // awardsBlade: AwardsBlade,
    // accordion: Accordion,
    // iconCardDeck: IconCardDeck,
    // switchback: Switchback,
    imageBlock: ImageBlock,
    statisticsPanel: StatisticsPanel,
    // testimonialSlider: TestimonialSlider,
    // Add more components as you create them
  },
});

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
