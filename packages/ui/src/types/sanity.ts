import type { PortableTextBlock } from '@portabletext/types';
/**
 * TypeScript definitions for Sanity schema types
 * These correspond to the schema definitions in the Sanity Studio
 */

// Base types
export interface SanityDocument {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _id?: string;
    _ref: string;
    _type: 'reference';
    url?: string;
    metadata?: {
      dimensions?: {
        aspectRatio?: number;
        height?: number;
        width?: number;
      };
      lqip?: string;
      blurHash?: string;
    }
  };
  crop?: {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
  };
  alt?: string;
}

// New rich image type used in hero and other sections
export interface SanityRichImage {
  _type: 'richImage';
  _key?: string;
  alt: string; // required in schema
  image: SanityImage; // nested Sanity image object
}

export interface SanityVideo {
  _type: 'video';
  title?: string;
  videoType?: string; 
  youtubeUrl?: string;
  wistiaUrl?: string;
  videoFile?: {
    asset?: {url?: string};
  };
  thumbnail?: SanityImage;
}

export interface SanityAnchorLink {
  linkType: 'anchor';
  anchorLinkId: string;
  externalUrl: never;
  internalLink?: never;
  label?: string;
  openInNewTab?: boolean;
}

export interface SanityInternalLink {
  linkType: 'internal';
  internalLink: {
    _type: string;
    seo: {
      slug: {
        current: string;
      };
    };
  };
  label?: string;
  openInNewTab?: boolean;
  externalUrl?: never;
}

export interface SanityExternalLink {
  linkType: 'external';
  externalUrl: string;
  internalLink?: never;
  label?: string;
  openInNewTab?: boolean;
}

export interface SanityPopupLink {
  linkType: 'popup';
  popupform?: {
    _id?: string;
    name?: string;
    formId?: string;
  } | null;
  label?: string;
  openInNewTab?: boolean; // ignored for popup
  internalLink?: never;
  externalUrl?: never;
}

export type SanityLink = SanityAnchorLink | SanityInternalLink | SanityExternalLink | SanityPopupLink;

// Navigation types
export interface HeaderMenuItem {
  _key: string;
  title: string;
  link?: SanityLink;
  submenu?: {
    _key: string;
    title: string;
    link?: SanityLink;
  }[];
}

export interface HeaderNavigation extends SanityDocument {
  _type: 'headerNavigation';
  title: string;
  menuItems?: HeaderMenuItem[];
}

export interface FooterColumn {
  _key: string;
  title: string;
  links?: {
    _key: string;
    title: string;
    link?: SanityLink;
  }[];
}

export interface FooterBottomSection {
  copyright?: string;
  socialLinks?: {
    _key: string;
    platform: string;
    url: string;
  }[];
  legalLinks?: {
    _key: string;
    title: string;
    link?: SanityLink;
  }[];
}

export interface FooterNavigation extends SanityDocument {
  _type: 'footerNavigation';
  title: string;
  columns?: FooterColumn[];
  bottomSection?: FooterBottomSection;
}

// SEO types
export interface SanityMetadata {
  // Standard fields from Sanity schema
  slug?: SanitySlug;
  pageTitle?: string;
  pageDescription?: string;
  openGraphImage?: SanityImage;
  
  // Legacy fields - keeping for compatibility
  title?: string;
  description?: string;
  canonicalUrl?: string;
  
  // Meta settings
  noIndex?: boolean;
  noFollow?: boolean;
}

// pageSettings
export interface SanityPageSettings {
  hideAnnouncementBar?: boolean;
  hideNavigation?: boolean;
  hideFooterLinks?: boolean;
}

// Content block types (based on the schema definition)
export interface SanityPageContent {
  _key?: string;
  _type: string;
  [key: string]: any; // Additional properties based on block type
  theme?: 'light' | 'dark';
  responsivePadding?: any; // Responsive padding configuration
  htmlId?: string;
  backgroundImage?: SanityImage;
  minHeight?: 'none' | 'sm' | 'md' | 'lg';
}

// Generic Page interface for use by different page types
export interface Page extends SanityDocument {
  title: string;
  slug: SanitySlug;
  seo?: SanityMetadata;
  pageSettings?: SanityPageSettings;
}

// Website Page type matching websitePage schema
export interface SanityWebsitePage extends Page {
  _type: 'websitePage';
  sections?: SanityPageContent[];
}

// Legacy Page type - keeping for backward compatibility
export interface SanityPage extends Page {
  _type: 'page';
  content?: SanityPageContent[];
}

// Blog post type
export interface SanityBlogPost extends SanityDocument {
  _type: 'blogPost';
  _id: string;
  _key?: string;
  title: string;
  seo: SanityMetadata;
  publishedDate: string;
  excerpt?: string;
  body?: any[]; // This would be the portable text content
  featuredImage?: SanityImage;
  author?: SanityBlogAuthor;
  topics?: SanityBlogTopic[];
  tags?: SanityBlogTag[];
  readTime?: number;
}

// Integration type
export interface SanityIntegration extends SanityDocument {
  _type: 'integration';
  _id: string;
  _key?: string;
  title: string;
  seo: SanityMetadata;
  excerpt?: string;
  body?: PortableTextBlock[]; // This would be the portable text content
  company?: SanityCompany;
}

export interface SanityWebinar extends SanityDocument {
  _type: 'webinar';
  _id: string;
  _key?: string;
  title: string;
  seo: SanityMetadata;
  publishedAt: string;
  description?: string;
  body?: PortableTextBlock[]; // This would be the portable text content
  featuredImage?: SanityImage;
  speakers?: SanityBlogAuthor;
  scheduledDate?: string;
  timezone?: string;
  duration?: number;
  status?: string;
  rescheduleNote?: string;
  industries?: SanityIndustry[];
  readTime?: number;
}

// Case study type
export interface SanityCaseStudy extends SanityDocument {
  _type: 'caseStudy';
  title: string;
  excerpt?: string;
  seo: SanityMetadata;
  publishedAt: string;
  body?: any[]; // This would be the portable text content
  featuredImage?: SanityImage;
  company?: SanityCompany;
  testimonial?: SanityTestimonial;
  industries?: SanityIndustry[];
  workTypes?: SanityWorkType[];
}

// Press release type
export interface SanityPressRelease extends SanityDocument {
  _type: 'pressRelease';
  title: string;
  seo: SanityMetadata;
  publishedAt: string;
  location?: string;
  body?: any[]; // This would be the portable text content
  mainImage?: SanityImage;
  industries?: SanityIndustry[];
}

// The Edge post type
export interface SanityEdgePost extends SanityDocument {
  _type: 'theEdge';
  _id: string;
  _key?: string;
  title: string;
  seo: SanityMetadata;
  publishedDate: string;
  excerpt?: string;
  body?: any[]; // This would be the portable text content
  featuredImage?: SanityImage;
  author?: SanityBlogAuthor;
  topics?: SanityBlogTopic[];
  tags?: SanityBlogTag[];
  readTime?: number;
}


// Taxonomy types for press releases
export interface SanityIndustry extends SanityDocument {
  _type: 'industry';
  title: string;
  description?: string;
}

export interface SanityWorkType extends SanityDocument {
  _type: 'workType';
  title: string;
  description?: string;
}

// References types for blog
export interface SanityBlogAuthor extends SanityDocument {
  _type: 'person';
  firstName: string;
  lastName: string;
  slug: SanitySlug;
  headshot?: SanityImage;
  role?: string;
  bio?: PortableTextBlock[];
  company?: SanityCompany;
  linkedinUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
}

export interface SanityBlogTopic extends SanityDocument {
  _type: 'blogTopic';
  name: string;
  description?: string;
}

export interface SanityBlogTag extends SanityDocument {
  _type: 'blogTag';
  name: string;
  color?: 'lightBlue' | 'royalBlue' | 'navy' | 'gray';
}

export interface SanityCompany extends SanityDocument {
  _type: 'company';
  name: string;
  logo?: SanityImage;
  logoOnLight?: SanityImage;
  logoOnDark?: SanityImage;
  logomarkOnLight?: SanityImage;
  logomarkOnDark?: SanityImage;
  website?: string;
};

export interface SanityTestimonial extends SanityDocument {
  _id: string;
  title: string;
  quote: PortableTextBlock[];
  person: SanityBlogAuthor;
}

export interface SanityFormGroup extends SanityDocument {
  _type: 'formGroup';
  submitButtonText?: string;
  submitBehavior?: 'stayOnPage' | 'redirect';
  thankYouHeadline?: string;
  thankYouMessage?: string;
  formReference?: {
    formId?: string;
    name?: string;
  };
  redirectUrl?: SanityLink;
}

// Download post type
export interface SanityDownload extends SanityDocument {
  _type: 'guide' | 'report' | 'whitepaper';
  _id: string;
  _key?: string;
  title: string;
  seo: SanityMetadata;
  excerpt?: string;
  body?: any[]; // This would be the portable text content
  featuredImage?: SanityImage;
  form?: SanityFormGroup;
}

// Testimonial Slider Section types
export interface TestimonialSlide {
  testimonial?: SanityTestimonial;
  ctaBar?: {
    _type?: 'ctaBar';
    buttons?: any[]; // CTAProps from CTABar component
  } | null;
}

export interface TestimonialSliderSection extends SanityPageContent {
  _type: 'testimonialSlider';
  displayStyle?: 'card' | 'quote' | 'minimal';
  showAvatar?: boolean;
  showCompany?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number; // seconds
  showDots?: boolean;
  showArrows?: boolean;
  testimonials?: TestimonialSlide[];
}

// Spotlight Slider Section types
export interface SpotlightSlide {
  image?: SanityRichImage;
  eyebrow?: {
    eyebrow?: string;
    elementType?: string;
  };
  heading?: {
    heading?: PortableTextBlock[];
    headingSize?: string;
    fontFamily?: string;
    elementType?: string;
  };
  body?: PortableTextBlock[];
  ctaBar?: {
    _type?: 'ctaBar';
    buttons?: any[];
  } | null;
}

export interface SpotlightSliderSection extends SanityPageContent {
  _type: 'spotlightSlider';
  displayStyle?: 'card' | 'quote' | 'minimal';
  autoplay?: boolean;
  autoplaySpeed?: number; // seconds
  showDots?: boolean;
  showArrows?: boolean;
  spotlights?: SpotlightSlide[];
}

// Greenhouse Job Board types
export interface GreenhouseJob {
  id: number;
  title: string;
  updated_at: string;
  location: {
    name: string;
  };
  absolute_url: string;
  metadata?: {
    name: string;
    value: string;
  }[];
  departments: {
    id: number;
    name: string;
  }[];
}

export interface GreenhouseDepartment {
  id: number;
  name: string;
  jobs: GreenhouseJob[];
}

export interface GreenhouseJobsResponse {
  jobs: GreenhouseJob[];
  departments?: GreenhouseDepartment[];
}
