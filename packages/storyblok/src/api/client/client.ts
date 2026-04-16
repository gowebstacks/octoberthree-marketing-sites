import type { ISbStoryParams, ISbStoryData } from "@storyblok/react";
type StoryblokResponse<T> = {
  story: ISbStoryData<T>;
  rels?: ISbStoryData<any>[];
};
// Storyblok API base URL
const STORYBLOK_API_URL = "https://api.storyblok.com/v2/cdn";

// Helper function to get the appropriate token based on version
const getAccessToken = (version: string = "published") => {
  // For draft/preview content, only use the preview token
  if (version === "draft") {
    return (
      process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN || "d0o0iv3cDTMUXB1yItM2FQtt"
    );
  }
  // For published content, use the public token
  return "zMsuCF4nOyTCVrNGr1kg0wtt";
};

// Build URLSearchParams safely from mixed-type params
function buildSearchParams(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else if (typeof value === "object") {
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
): Promise<StoryblokResponse<T> | null> {
  try {
    const defaultParams: ISbStoryParams = {
      version: "published", // Default to published to allow static generation
      ...params,
    };

    const accessToken = getAccessToken(defaultParams.version);
    if (!accessToken) {
      console.warn(
        "Storyblok token not configured for version:",
        defaultParams.version
      );
      return null;
    }

    // Build query string
    const queryParams = buildSearchParams({
      token: accessToken,
      ...defaultParams,
    });

    const isDraft = (defaultParams.version || "draft") === "draft";
    const response = await fetch(
      `${STORYBLOK_API_URL}/stories/${slug}?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data as StoryblokResponse<T>;
  } catch (error) {
    console.error(`Failed to fetch Storyblok story: ${slug}`, error);
    return null;
  }
}

// Get all website pages
export async function getAllWebsitePages(isDraft: boolean = true) {
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn(
        `Storyblok token not configured ${isDraft ? "draft" : "published"}`
      );
      return [];
    }

    // Build query string
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: "websitePage",
      per_page: "100",
      version: isDraft ? "draft" : "published",
      excluding_slugs: "*/team/*",
    });

    const response = await fetch(
      `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error("Failed to fetch all website pages", error);
    return [];
  }
}

// Get website page by slug
export async function getWebsitePageBySlug(
  slug: string,
  isDraft: boolean = false
) {
  // Skip invalid slugs (like Chrome DevTools requests)
  if (
    !slug ||
    slug.startsWith(".") ||
    (slug.includes("/") && slug.split("/").some((part) => part.startsWith(".")))
  ) {
    return null;
  }
  try {
    // First, get all website pages and find the one with matching SEO slug
    // const stories = await getAllWebsitePages(isDraft);
    // const matchingStory = stories.find(
    //   (story: ISbStoryData<any>) =>
    //     story.content.seo && story.content.seo[0] && story.full_slug === slug
    // );
    // if (!matchingStory) {
    //   return null;
    // }

    // Now fetch the full story data with resolved relations
    const data = await storyblokFetch(slug, {
      version: isDraft ? "draft" : "published",
      resolve_relations:
        "testimonial.person,resourceCard.tags,testimonialSlide.testimonial", // Resolve testimonial, person, and company relations
      resolve_level: 2,
    });
    if (!data) {
      return null;
    }

    return {
      ...data.story,
      rels: data.rels || [],
    };
  } catch (error) {
    console.error(
      `[getWebsitePageBySlug] Error fetching story for SEO slug: ${slug}`,
      error
    );
    return null;
  }
}

// Get all website page slugs for static generation
export async function getAllWebsitePageSlugs() {
  try {
    const stories = await getAllWebsitePages(false);
    return stories
      .filter(
        (story: ISbStoryData<any>) =>
          story.content.seo && story.content.seo[0] && story.content.seo[0].slug
      )
      .map((story: ISbStoryData<any>) => ({
        slug: story.content.seo[0].slug.split("/"),
      }));
  } catch (error) {
    console.error("Failed to fetch website page slugs", error);
    return [];
  }
}

// Get all testimonials
export async function getAllTestimonials(isDraft: boolean = false) {
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return [];
    }

    // Build query string with person relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: "testimonial",
      per_page: "100",
      version: isDraft ? "draft" : "published",
      resolve_relations: "person,company", // Resolve person and company references
    });

    const response = await fetch(
      `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error("Failed to fetch all testimonials", error);
    return [];
  }
}

// Get testimonial by ID
export async function getTestimonialById(id: string, isDraft: boolean = false) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? "draft" : "published",
      resolve_relations: "person,company",
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
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return [];
    }

    // Build query string with company relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: "person",
      per_page: "100",
      version: isDraft ? "draft" : "published",
      resolve_relations: "company", // Resolve company references
    });

    const response = await fetch(
      `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error("Failed to fetch all persons", error);
    return [];
  }
}

// Get person by ID
export async function getPersonById(id: string, isDraft: boolean = false) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? "draft" : "published",
      resolve_relations: "company",
    });

    return story;
  } catch (error) {
    console.error(`Failed to fetch person: ${id}`, error);
    return null;
  }
}

// Get all global navigation items
export async function getAllGlobalNavigations(
  isDraft: boolean = false,
  filterBy: string
) {
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return [];
    }

    // Build query string with all necessary relations resolved
    const queryParams = new URLSearchParams({
      token: accessToken,
      content_type: "globalNavigation",
      starts_with: filterBy,
      per_page: "100",
      version: isDraft ? "draft" : "published",
      resolve_relations: "button,ctaBar,headingBlock", // Resolve button, ctaBar, and headingBlock references
    });

    const response = await fetch(
      `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error("Failed to fetch all global navigations", error);
    return [];
  }
}

// Get global navigation by ID
export async function getGlobalNavigationById(
  id: string,
  isDraft: boolean = false
) {
  try {
    const story = await storyblokFetch(id, {
      version: isDraft ? "draft" : "published",
      resolve_relations: "button,ctaBar,headingBlock", // Resolve button, ctaBar, and headingBlock references
    });

    return story;
  } catch (error) {
    console.error(`Failed to fetch global navigation: ${id}`, error);
    return null;
  }
}

// Get the latest global navigation (most recent one)
export async function getLatestGlobalNavigation(
  isDraft: boolean = false,
  filterBy: string
) {
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
    console.error("Failed to fetch latest global navigation", error);
    return null;
  }
}

// Check if Storyblok is configured
export function isStoryblokConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_ACCESS_TOKEN ||
    process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN
  );
}

// Mock storyblokApi for compatibility
export const storyblokApi = {
  getStory: async (slug: string, params: any = {}) => {
    const data = await storyblokFetch(slug, params);

    if (!data) {
      return { data: { story: null, rels: [] } };
    }

    return {
      data: {
        story: data.story,
        rels: data.rels || [],
      },
    };
  },
  getStories: async (params: any = {}) => {
    const accessToken = getAccessToken(params.version || "draft");

    if (!accessToken) {
      throw new Error("Storyblok token not configured");
    }

    const queryParams = buildSearchParams({
      token: accessToken,
      ...params,
    });

    const isDraft = (params.version || "draft") === "draft";
    const response = await fetch(
      `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
      {
        cache: isDraft ? "no-store" : undefined,
      } as any
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
};

// Get All team members
export async function getAllTeamMembers(
  isDraft: boolean = false,
  sitename: string
) {
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return [];
    }

    let allStories: any[] = [];
    let page = 1;
    let total = 0;

    do {
      const queryParams = new URLSearchParams({
        token: accessToken,
        starts_with: `${sitename}/team/`,
        per_page: "100",
        page: String(page),
        version: isDraft ? "draft" : "published",
      });

      const response = await fetch(
        `${STORYBLOK_API_URL}/stories?${queryParams}` as any,
        {
          cache: isDraft ? "no-store" : undefined,
        } as any
      );

      if (!response.ok) {
        throw new Error(
          `Storyblok API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      total = Number(response.headers.get("total")) || data.total || 0;

      allStories.push(...(data.stories || []));

      page++;
    } while (allStories.length < total);

    return allStories;
  } catch (error) {
    console.error("Failed to fetch all team members", error);
    return [];
  }
}

// Get a single team member by slug
export async function getTeamMemberBySlug(
  slug: string,
  isDraft: boolean = false,
  sitename: string
) {
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return null;
    }

    const fullSlug = `${sitename}/team/${slug}`;

    const params = new URLSearchParams({
      token: accessToken,
      version: isDraft ? "draft" : "published",
      resolve_relations: "relatedBios.relatedBio",
    });

    const url = `${STORYBLOK_API_URL}/stories/${fullSlug}?${params.toString()}`;

    const response = await fetch(url, {
      cache: isDraft ? "no-store" : undefined,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      ...data.story,
      rels: data.rels || [],
    };
  } catch (error) {
    console.error(
      `[getTeamMemberBySlug] Failed to fetch team member with slug ${slug}:`,
      error
    );
    return null;
  }
}

// Optional: Get all team member slugs for static generation
export async function getAllTeamMemberSlugs(
  sitename: string,
  isDraft: boolean = false
) {
  try {
    const teamMembers = await getAllTeamMembers(isDraft, sitename);
    return teamMembers.map((member: any) => ({
      slug: member.slug.split("/").pop(), // Extract the last part of the slug
    }));
  } catch (error) {
    console.error("Failed to fetch team member slugs", error);
    return [];
  }
}

// Get a single team member by slug
export async function getArticleBySlug(
  slug: string,
  isDraft: boolean = false,
  sitename: string
) {
  console.log("article slug ******************", slug);
  try {
    const accessToken = getAccessToken(isDraft ? "draft" : "published");

    if (!accessToken) {
      console.warn("Storyblok token not configured");
      return null;
    }

    const fullSlug = `${sitename}/articles/${slug}`;
    console.log(fullSlug, "test full slug");
    const params = new URLSearchParams({
      token: accessToken,
      version: isDraft ? "draft" : "published",
      resolve_relations: "relatedBios.relatedBio",
    });

    const url = `${STORYBLOK_API_URL}/stories/${fullSlug}?${params.toString()}`;

    const response = await fetch(url, {
      cache: isDraft ? "no-store" : undefined,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      ...data.story,
      rels: data.rels || [],
    };
  } catch (error) {
    console.error(
      `[getArticleBySlug] Failed to fetch article with slug ${slug}:`,
      error
    );
    return null;
  }
}

// Get layout data
export const getGlobalLayoutData = async (
  headerSlug: string,
  footerSlug: string
) => {
  try {
    const [headerRes, footerRes] = await Promise.allSettled([
      storyblokApi.getStory(headerSlug, { version: "published" }),
      storyblokApi.getStory(footerSlug, { version: "published" }),
    ]);

    const header =
      headerRes.status === "fulfilled"
        ? (headerRes.value?.data.story?.content ?? null)
        : null;

    const footer =
      footerRes.status === "fulfilled"
        ? (footerRes.value?.data?.story?.content ?? null)
        : null;

    if (headerRes.status === "rejected") {
      console.error("Header fetch failed:", headerRes.reason);
    }

    if (footerRes.status === "rejected") {
      console.error("Footer fetch failed:", footerRes.reason);
    }

    return { header, footer };
  } catch (error) {
    console.error("Unexpected error in getGlobalLayoutData:", error);

    return {
      header: null,
      footer: null,
    };
  }
};

// Get All blogs
export async function getAllBlogs(sitename: string, isDraft: boolean = false) {
  try {
    const res = await storyblokApi.getStories({
      version: isDraft ? "draft" : "published",
      starts_with: `${sitename}`,
      per_page: 100,
    });

    return res.stories || [];
  } catch (error) {
    console.error("Failed to fetch blogs", error);
    return [];
  }
}

export async function getAllStoriesByFolder(
  folderPath: string,
  isDraft: boolean = false
): Promise<ISbStoryData<any>[]> {
  const version = isDraft ? "draft" : "published";
  let allStories: ISbStoryData<any>[] = [];
  let page = 1;
  let allRels: any[] = []; 


  while (true) {
    const data = await storyblokApi.getStories({
      version,
      starts_with: folderPath,
      per_page: 100,
      page,
      resolve_relations: ["tags, topics"],
    });
    const stories = data.stories || [];

    const rels = data.rels || [];

    allStories.push(...stories);
     allRels.push(...rels);

    if (stories.length < 100) break;

    page++;
  }
(allStories as any).rels = allRels;

return allStories as ISbStoryData<any>[] & { rels: any[] };
}
export async function getStoryBySlug(
  slug: string,
  isDraft: boolean = false
): Promise<{ story: ISbStoryData<any>; rels?: ISbStoryData<any>[] } | null> {
  const version = isDraft ? "draft" : "published";
  try {
    const result = await storyblokApi.getStory(slug, {
      version,
      resolve_relations: ["resourceCard.tags"],
    });
    console.log(result, "test the api data");
    if (!result?.data?.story) return null;
    return {
      story: result.data.story,
      rels: result.data.rels || [],
    };
  } catch {
    return null;
  }
}
