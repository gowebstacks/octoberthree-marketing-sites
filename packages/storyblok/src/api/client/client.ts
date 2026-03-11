import type { ISbStoryParams, ISbStoryData } from '@storyblok/react';

// Storyblok API base URL
const STORYBLOK_API_URL = 'https://api.storyblok.com/v2/cdn';

// Helper function to get the appropriate token based on version
const getAccessToken = (version: string = 'published') => {
  // For draft/preview content, only use the preview token
  if (version === 'draft') {
    return process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN;
  }
  // For published content, use the public token
  return 'd0o0iv3cDTMUXB1yItM2FQtt';
};

// Build URLSearchParams safely from mixed-type params
function buildSearchParams(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else if (typeof value === 'object') {
      // Best-effort stringify for objects (e.g., nested parameters)
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  }
  return params;
}

// Enhanced fetch function with proper typing
export async function storyblokFetch<T = any>(
  slug: string,
  params: ISbStoryParams = {}
): Promise<ISbStoryData<T> | null> {
  try {
    const defaultParams: ISbStoryParams = {
      version: 'published', // Default to published to allow static generation
      resolve_relations: [],
      ...params,
    };

    const accessToken = getAccessToken(defaultParams.version);
    if (!accessToken) {
      console.warn('Storyblok token not configured for version:', defaultParams.version);
      return null;
    }

    // Build query string
    const queryParams = buildSearchParams({
      token: accessToken,
      ...defaultParams,
    });

    const isDraft = (defaultParams.version || 'draft') === 'draft';
    const response = await fetch(`${STORYBLOK_API_URL}/stories/${slug}?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.story as ISbStoryData<T>;
  } catch (error) {
    console.error(`Failed to fetch Storyblok story: ${slug}`, error);
    return null;
  }
}

// Get all website pages
export async function getAllWebsitePages(isDraft: boolean = true) {
  try {
    const accessToken = getAccessToken(isDraft ? 'draft' : 'published');
    
    if (!accessToken) {
      console.warn(`Storyblok token not configured ${isDraft ? 'draft' : 'published'}`);
      return [];
    }

    // Build query string
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: 'websitePage',
      per_page: '100',
      version: isDraft ? 'draft' : 'published',
    });

    const response = await fetch(`${STORYBLOK_API_URL}/stories?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Failed to fetch all website pages', error);
    return [];
  }
}

// Get website page by slug
export async function getWebsitePageBySlug(slug: string, isDraft: boolean = false) {
  // Skip invalid slugs (like Chrome DevTools requests)
  if (!slug || slug.startsWith('.') || slug.includes('/') && slug.split('/').some(part => part.startsWith('.'))) {
    return null;
  }
  try {
    // First, get all website pages and find the one with matching SEO slug
    const stories = await getAllWebsitePages(isDraft);
    const matchingStory = stories.find((story: ISbStoryData<any>) => 
      story.content.seo && 
      story.content.seo[0] && 
      story.full_slug === slug
    );
    if (!matchingStory) {
      return null;
    }
    
    // Now fetch the full story data with resolved relations
    const story = await storyblokFetch(matchingStory.id, {
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'testimonial,person,company', // Resolve testimonial, person, and company relations
    });
    if (!story) {
      return null;
    }

    return story;
  } catch (error) {
    console.error(`[getWebsitePageBySlug] Error fetching story for SEO slug: ${slug}`, error);
    return null;
  }
}

// Get all website page slugs for static generation
export async function getAllWebsitePageSlugs() {
  try {
    const stories = await getAllWebsitePages(false);
    return stories
      .filter((story: ISbStoryData<any>) => story.content.seo && story.content.seo[0] && story.content.seo[0].slug)
      .map((story: ISbStoryData<any>) => ({
        slug: story.content.seo[0].slug.split('/'),
      }));
  } catch (error) {
    console.error('Failed to fetch website page slugs', error);
    return [];
  }
}

// Get all testimonials
export async function getAllTestimonials(isDraft: boolean = false) {
  try {
    const accessToken = getAccessToken(isDraft ? 'draft' : 'published');
    
    if (!accessToken) {
      console.warn('Storyblok token not configured');
      return [];
    }

    // Build query string with person relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: 'testimonial',
      per_page: '100',
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'person,company', // Resolve person and company references
    });

    const response = await fetch(`${STORYBLOK_API_URL}/stories?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Failed to fetch all testimonials', error);
    return [];
  }
}

// Get testimonial by ID
export async function getTestimonialById(id: string, isDraft: boolean = false) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'person,company',
    });
    
    return story;
  } catch (error) {
    console.error(`Failed to fetch testimonial: ${id}`, error);
    return null;
  }
}

// Get all persons
export async function getAllPersons(isDraft: boolean = false) {
  try {
    const accessToken = getAccessToken(isDraft ? 'draft' : 'published');
    
    if (!accessToken) {
      console.warn('Storyblok token not configured');
      return [];
    }

    // Build query string with company relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: 'person',
      per_page: '100',
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'company', // Resolve company references
    });

    const response = await fetch(`${STORYBLOK_API_URL}/stories?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Failed to fetch all persons', error);
    return [];
  }
}

// Get person by ID
export async function getPersonById(id: string, isDraft: boolean = false) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'company',
    });
    
    return story;
  } catch (error) {
    console.error(`Failed to fetch person: ${id}`, error);
    return null;
  }
}

// Get all global navigation items
export async function getAllGlobalNavigations(isDraft: boolean = false, filterBy:string) {
  try {
    const accessToken = getAccessToken(isDraft ? 'draft' : 'published');
    
    if (!accessToken) {
      console.warn('Storyblok token not configured');
      return [];
    }

    // Build query string with all necessary relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: 'globalNavigation',
      starts_with: filterBy,
      per_page: '100',
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'button,ctaBar,headingBlock', // Resolve button, ctaBar, and headingBlock references
    });

    const response = await fetch(`${STORYBLOK_API_URL}/stories?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Failed to fetch all global navigations', error);
    return [];
  }
}

// Get global navigation by ID
export async function getGlobalNavigationById(id: string, isDraft: boolean = false) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? 'draft' : 'published',
      resolve_relations: 'button,ctaBar,headingBlock', // Resolve button, ctaBar, and headingBlock references
    });
    
    return story;
  } catch (error) {
    console.error(`Failed to fetch global navigation: ${id}`, error);
    return null;
  }
}

// Get the latest global navigation (most recent one)
export async function getLatestGlobalNavigation(isDraft: boolean = false, filterBy :string) {
  try {
    const stories = await getAllGlobalNavigations(isDraft, filterBy);
    if (stories.length === 0) {
      return null;
    }
    
    // Get the most recent one (first in the list, as Storyblok returns them sorted by creation date)
    const latestStory = stories[0];
    
    // Fetch the full story data with resolved relations
    const fullStory = await getGlobalNavigationById(latestStory.id, isDraft);
    
    return fullStory;
  } catch (error) {
    console.error('Failed to fetch latest global navigation', error);
    return null;
  }
}

// Check if Storyblok is configured
export function isStoryblokConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_ACCESS_TOKEN || process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN);
}

// Mock storyblokApi for compatibility
export const storyblokApi = {
  getStory: async (slug: string, params: any = {}) => {
    const story = await storyblokFetch(slug, params);
    return { data: { story } };
  },
  getStories: async (params: any = {}) => {
    const accessToken = getAccessToken(params.version || 'draft');
    
    if (!accessToken) {
      throw new Error('Storyblok token not configured');
    }

    const queryParams = buildSearchParams({
      token: accessToken,
      ...params,
    });

    const isDraft = (params.version || 'draft') === 'draft';
    const response = await fetch(`${STORYBLOK_API_URL}/stories?${queryParams}` as any, {
      cache: isDraft ? 'no-store' : undefined,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
