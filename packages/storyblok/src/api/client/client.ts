import type { ISbStoryParams, ISbStoryData } from "@storyblok/react";
type StoryblokResponse<T> = {
  story: ISbStoryData<T>;
  rels?: ISbStoryData<any>[];
};
// Storyblok API base URL
const STORYBLOK_API_URL = "https://api.storyblok.com/v2/cdn";
import { cache } from "react";

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
  params: ISbStoryParams = {},
  options: { revalidate?: number } = { revalidate: 86400 }
): Promise<StoryblokResponse<T> | null> {
  const revalidateTime = options?.revalidate ?? 86400;

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
        cache: isDraft ? "no-store" : "force-cache",
        next: isDraft ? undefined : { revalidate: revalidateTime },
      } as RequestInit & { next?: any }
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
  if (slug.includes("/globals/404")) {
    return null;
  }
  try {
    // fetch the full story data with resolved relations
    const data = await storyblokFetch(slug, {
      version: isDraft ? "draft" : "published",
      resolve_relations:
        "testimonial.person,resourceCard.tags,testimonialSlide.testimonial,relatedBios.relatedBio,tags,topics", // Resolve testimonial, person, and company relations
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

// Check if Storyblok is configured
export function isStoryblokConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_ACCESS_TOKEN ||
    process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN
  );
}

// Mock storyblokApi for compatibility
export const storyblokApi = {
  getStory: async (
    slug: string,
    params: any = {},
    revalidateParams?: { revalidate?: number }
  ) => {
    const data = await storyblokFetch(slug, params, revalidateParams);

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
        cache: isDraft ? "no-store" : "force-cache",
        next: isDraft ? undefined : { revalidate: 86400 },
      } as RequestInit & { next?: any }
    );

    if (!response.ok) {
      throw new Error(
        `Storyblok API error: ${response.status} ${response.statusText}`
      );
    }

    // return response.json();
    const data = await response.json();

    return Object.assign(data, {
      _headers: {
        total: response.headers.get("total"),
        perPage: response.headers.get("per-page"),
      },
    });
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
          cache: isDraft ? "no-store" : "force-cache",
          next: isDraft ? undefined : { revalidate: 86400 },
        } as RequestInit & { next?: any }
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

// Get layout data
export const getGlobalLayoutData = async (
  headerSlug: string,
  footerSlug: string
) => {
  try {
    const [headerRes, footerRes] = await Promise.allSettled([
      storyblokApi.getStory(
        headerSlug,
        { version: "published" },
        { revalidate: 60 }
      ),
      storyblokApi.getStory(
        footerSlug,
        { version: "published" },
        { revalidate: 60 }
      ),
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

export async function getAllStoriesByFolder(
  folderPath: string,
  isDraft: boolean = false,
  options?: {
    perPage?: number;
    page?: number;
    filterQuery?: any;
  },
  rootFolder?: string
): Promise<ISbStoryData<any>[]> {
  const version = isDraft ? "draft" : "published";
  const { search, category, ...restFilter } = options?.filterQuery || {};
  const usePagination =
    options?.perPage || options?.page || options?.filterQuery;

  let tagUuid: string | undefined;

  if (category) {
    const tagRes = await storyblokApi.getStories({
      version,
      starts_with: `${rootFolder}/tags/${category}`,
    });
    tagUuid = tagRes.stories?.[0]?.uuid;
    if (!tagUuid) return [];
  }
  if (usePagination) {
    const data = await storyblokApi.getStories({
      version,
      starts_with: `${folderPath}/`,
      per_page: options?.perPage || 10,
      page: options?.page || 1,
      resolve_relations: ["tags, topics"],
      is_startpage: false,
      ...(search && {
        search_term: search,
      }),

      "filter_query[tags][any_in_array]": tagUuid,
    });

    const stories = data.stories || [];
    const rels = data.rels || [];

    const total = Number(data._headers?.total || 0);

    (stories as any).rels = rels;
    (stories as any).total = total;

    return stories as ISbStoryData<any>[] & {
      rels: any[];
      total: number;
    };
  }
  let allStories: ISbStoryData<any>[] = [];

  const data = await storyblokApi.getStories({
    version,
    starts_with: folderPath,
    per_page: 100,
  });
  const stories = data.stories || [];
  allStories.push(...stories);

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
    if (!result?.data?.story) return null;
    return {
      story: result.data.story,
      rels: result.data.rels || [],
    };
  } catch {
    return null;
  }
}

export const getPageData = cache(async (slug: string, preview: boolean) => {
  return await getWebsitePageBySlug(slug, preview);
});



export async function getAllStories(isDraft = false) {
  const version = isDraft ? "draft" : "published";
  const SITE = process.env.NEXT_PUBLIC_SITE!;

  let allStories: any[] = [];
  let page = 1;
  let total = 0;

  do {
    const data = await storyblokApi.getStories({
      version,
      per_page: 100,
      page,
      starts_with: `${SITE}/`,
      excluding_fields: "sections,body",
    });

    total = Number(data._headers?.total || 0);
    allStories.push(...(data.stories || []));

    page++;
    await new Promise((r) => setTimeout(r, 150)); // prevent 429
  } while (allStories.length < total && page < 200);

  return allStories;
}