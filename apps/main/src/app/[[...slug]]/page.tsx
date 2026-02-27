import { notFound } from 'next/navigation';
import { Metadata } from 'next';


import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { ComponentGenerator, getAllWebsitePageSlugs, getWebsitePageBySlug, isStoryblokConfigured, StoryblokBridge, StoryblokSiteSettings } from '@repo/storyblok';
import { renderMetadata, SITE_CONFIG } from '@repo/ui';

interface PageParams {
  slug?: string[];
}

type SearchParams = { [key: string]: string | string[] | undefined };

function isStoryblokEditor(searchParams?: SearchParams) {
  const qp = searchParams || {};
  const getParam = (k: string): string | undefined => {
    const v = qp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const version = (getParam('version') || '').toLowerCase();
  const hasSbKey = Object.keys(qp).some(k => k.toLowerCase().includes('storyblok'));
  const hasPreviewKey = ['_storyblok', 'storyblok', 'sb', 'preview'].some(k => !!getParam(k));

  return hasSbKey || hasPreviewKey || version === 'draft';
}

export default async function SlugPage(props: { params: Promise<PageParams>; searchParams?: Promise<SearchParams> }) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const slugParam = params.slug && params.slug.length > 0 ? params.slug.join('/') : 'home';
  const inEditor = isStoryblokEditor(searchParams);
  const preview = inEditor;
  
  const page = await getWebsitePageBySlug(`octoberthree-main/${slugParam}`, preview);

    console.log('*********************************************************', page)

  if (!page) {
    notFound();
  }
  // Extract content and settings from Storyblok page
  const { content } = page;
  const rels = (page as any).rels?.content || {}; // Storyblok resolved relations are in rels.content
  const sections = content.sections || [];
  const pageSettings = content.pageSettings || {};

  // Build absolute URL matching the public canonical path
  const siteBase = SITE_CONFIG.urls.domain;
  const pathPart = slugParam === 'homepage' ? '' : `/${slugParam}`;
  const absoluteUrl = `${siteBase}${pathPart}`;

  return (
    <>
  
      {preview ? (
        <StoryblokBridge story={page} />
      ) : (
        <ComponentGenerator
          sections={sections} 
          documentId={page.id.toString()} 
          documentType={page.content.component}
          rels={rels}
        />
      )}
  
    </>
  );
}
