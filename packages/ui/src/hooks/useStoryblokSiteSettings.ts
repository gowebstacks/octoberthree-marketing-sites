import { useEffect, useState } from 'react';
import { getStoryblokApi } from '@storyblok/react';
import { StoryblokSiteSettings } from '../types/storyblok-site-settings';
import { storyblokFetch } from '../lib/storyblok/client';


export function useStoryblokSiteSettings(slug:string) {
  console.log('useStoryblokSiteSettings hook called');
  const [siteSettings, setSiteSettings] = useState<StoryblokSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useStoryblokSiteSettings useEffect running');
    async function fetchSiteSettings() {
      try {
        console.log('Fetching site settings from Storyblok...');
        let content: StoryblokSiteSettings | null = null;

        // Try SDK first (works when storyblokInit has run on client)
        try {
          const storyblokApi = getStoryblokApi();
          console.log('Got Storyblok API:', !!storyblokApi);
          if (storyblokApi && typeof storyblokApi.get === 'function') {
            const response = await storyblokApi.get(`cdn/stories/${slug}`, {
              version: 'published'
            });
            console.log('Storyblok site settings response:', response.data);
            content = response.data?.story?.content as StoryblokSiteSettings;
          }
        } catch (sdkErr) {
          console.warn('Storyblok SDK not available, falling back to storyblokFetch:', sdkErr);
        }

        // Fallback to direct fetch using public token
        if (!content) {
          console.log('Falling back to storyblokFetch(public, published) for site-settings');
          const story = await storyblokFetch<any>(slug, { version: 'published' });
          content = (story?.content as StoryblokSiteSettings) || null;
        }

        if (!content) {
          throw new Error('Site settings not found');
        }
        console.log('Storyblok site settings content:', content);
        setSiteSettings(content);
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSiteSettings();
  }, []);

  console.log('useStoryblokSiteSettings returning:', { siteSettings, loading, error });
  return { siteSettings, loading, error };
}
