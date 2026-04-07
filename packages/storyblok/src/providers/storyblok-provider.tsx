

import { Accordion, AuthorCard, ContentBlock, ConversionPanel, CTABar, FeatureCardDeck, FormBlock, ImageBlock, ImageWithDesc, RTCTable, Statistic, Subscribe, VideoBlock } from '@repo/ui';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';


console.log({
  imageBlock: ImageWithDesc,
  featureCardDeck: FeatureCardDeck,
  rtcTable: RTCTable,
});
export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN || 'd0o0iv3cDTMUXB1yItM2FQtt',
  use: [apiPlugin],
  apiOptions: {
    region: 'us',
  },
  components: {
     
    ctaBar: CTABar,
    contentBlock:ContentBlock,
    videoBlock:VideoBlock,
    conversionPanel : ConversionPanel,
    authorCard :AuthorCard,
    formBlock : FormBlock,
    statistic : Statistic,
    imageBlock :  ImageBlock,
    featureCardDeck : FeatureCardDeck,
    table : RTCTable,
    accordion : Accordion,
    subscribe : Subscribe
   
    

  },

} as any);




export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}