import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import {
  ComponentGenerator,
  getAllStoriesByFolder,
  getStoryBySlug,
  isStoryblokConfigured,
  StoryblokBridge,
} from '@repo/storyblok';
import { renderMetadata } from '@repo/ui';
import { isStoryblokEditor } from '../../../lib/helper';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

// Folder where insight stories live (e.g., 'edge/insights')
const INSIGHTS_FOLDER = 'edge/insights';

const InsightContent = async ({ slug, preview }: { slug: string; preview: boolean }) => {
  const fullSlug = `${INSIGHTS_FOLDER}/${slug}`;
  const result = await getStoryBySlug(fullSlug, preview);
  if (!result) return notFound();

  const { story, rels } = result;
  const { content } = story;
  const sections = content.sections || [];

  // Optional: extract author data if your insight schema includes it
  const authorData = sections[1]?.section?.[0]?.body?.content?.[0]?.attrs?.body?.[0] || null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title || content.name || 'Insight',
    author: {
      '@type': 'Person',
      name: authorData?.name || 'October Three',
    },
    publisher: {
      '@type': 'Organization',
      name: 'October Three',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.octoberthree.com/logo.png',
      },
    },
    ...(content.slug && { url: `https://www.octoberthree.com/insights/${content.slug}` }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {preview ? (
        <StoryblokBridge story={{ ...story, content: { ...story.content, sections } }} />
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={story.id.toString()}
          documentType={story.content.component}
          rels={rels || []}
        />
      )}
    </>
  );
};

export async function generateStaticParams() {
  if (!isStoryblokConfigured()) return [];
  try {
    const stories = await getAllStoriesByFolder(INSIGHTS_FOLDER, false);
    return stories.map((story: any) => ({
      slug: story.slug.split('/').pop(), // extract last part as slug
    }));
  } catch {
    return [];
  }
}

export const generateMetadata = async (props: { params: Promise<PageProps['params']> }): Promise<Metadata> => {
  const { slug } = await props.params;
  const fullSlug = `${INSIGHTS_FOLDER}/${slug}`;
  try {
    const result = await getStoryBySlug(fullSlug, false);
    if (!result) {
      return {
        title: 'Insight Not Found',
        description: 'The requested insight could not be found',
      };
    }
    const { content } = result.story;
    const title = content.title || content.name || 'Insight';
    const description = content.excerpt || content.description || `Read our latest insight: ${title}`;
    return renderMetadata(`insights/${slug}`, {
      title: `${title} | October Three Insights`,
      description,
    });
  } catch {
    return { title: 'Insight', description: 'Explore our insights' };
  }
};

const InsightPageContainer = async (props: {
  params: Promise<PageProps['params']>;
  searchParams?: Promise<PageProps['searchParams']>;
}) => {
  const { slug } = await props.params;
  const preview = isStoryblokEditor(props.searchParams ? await props.searchParams : undefined);
  try {
    return (
      <Suspense fallback={<div>Loading insight...</div>}>
        <InsightContent slug={slug} preview={preview} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
};

export default InsightPageContainer;