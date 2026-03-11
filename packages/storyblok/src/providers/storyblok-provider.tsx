

import { CTABar } from '@repo/ui';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN || 'd0o0iv3cDTMUXB1yItM2FQtt',
  use: [apiPlugin],
  apiOptions: {
    region: 'us',
  },
  components: {
    ctaBar: CTABar,
    
  },

} as any);




export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}