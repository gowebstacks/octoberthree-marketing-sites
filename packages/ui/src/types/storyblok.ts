// Basic Storyblok types for the frontend

import { StoryblokRichTextNode } from "@storyblok/react";
import { CTABarProps } from "../components/modules/ctaBar";

export interface StoryblokStory<T = any> {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  created_at: string;
  published_at: string;
  first_published_at: string;
  content: T;
  is_startpage: boolean;
  parent_id: number;
  group_id: string;
  alternates: any[];
  default_full_slug: string;
  translated_slugs: any[];
  tag_list: string[];
  language: string;
  meta_data: any;
  content_type: string;
  uuid_field: string;
}

export interface StoryblokAsset {
  id: string;
  filename: string;
  name: string;
  title?: string;
  alt?: string;
  focus?: string;
  copyright?: string;
  credits?: string;
  is_external_url?: boolean;
  meta_data?: any;
}

export interface StoryblokRelation {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  created_at: string;
  published_at: string;
  first_published_at: string;
  content: any;
  is_startpage: boolean;
  parent_id: number;
  group_id: string;
  alternates: any[];
  default_full_slug: string;
  translated_slugs: any[];
  tag_list: string[];
  language: string;
  meta_data: any;
  content_type: string;
  uuid_field: string;
}

// Storyblok Global Navigation types
export interface StoryblokGlobalNavigation {
  component: 'globalNavigation';
  announcement?: RichTextContent;
  announcementIcon?: string;
  logo? : StoryblokAsset;
  announcementLink?: {
    component: 'button';
    label: string;
    linkType: 'internal' | 'external';
    internalLink?: {
      id: string;
      url: string;
      linktype: 'story';
      fieldtype: 'multilink';
      cached_url: string;
    };
    externalUrl: string;
    openInNewTab: boolean;
  }[];
  announcementTheme?: string;
  menuItems?: StoryblokNavigationMenuItem[];
  ctaBar?: CTABarProps[];
}

export interface StoryblokNavigationMenuItem {
  _uid: string;
  component: 'navigationMenuItem';
  label: string;
  link: {
    component: 'link';
    label: string;
    linkType: 'internal' | 'external';
    internalLink?: {
      id: string;
      _uid: string;
      name: string;
      slug: string;
      component: 'page';
    };
    externalUrl: string;
    openInNewTab: boolean;
  };
  menuSection?: StoryblokMenuSection[];

}

export interface StoryblokNavigationInnerItem {
  _uid: string;
  component: 'navigationInnerItem';
  icon?: string;
  label: string;
  description?: string;
  link: {
    component: 'link';
    label: string;
    linkType: 'internal' | 'external';
    internalLink?: {
      id: string;
      _uid: string;
      name: string;
      slug: string;
      component: 'page';
    };
    externalUrl: string;
    openInNewTab: boolean;
  };
}
export interface StoryblokMenuSection {
  _uid: string;
  component: 'navigationMenuSection';
  title: string;
  items: StoryblokNavigationInnerItem[];
  ctaLink?: StoryblokNavigationInnerItem['link'];
  bottomLinks?: StoryblokNavigationInnerItem[];
}

export type Person = {
  firstName?: string;
  lastName?: string;
  role?: string;
   variant?: "navy" | "cyan" | "yellow" | "teal" | "orange";
  name?: string;
  title?: string;
};
export type RichTextContent = StoryblokRichTextNode<any>;
