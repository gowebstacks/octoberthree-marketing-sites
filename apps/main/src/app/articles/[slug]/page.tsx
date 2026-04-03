import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

import {
  ComponentGenerator,
  getArticleBySlug,
  StoryblokBridge,
} from '@repo/storyblok';

import { renderMetadata, SITE_CONFIG } from '@repo/ui';
import { isStoryblokEditor } from '../../../lib/helper';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

const ArticleContent = async ({ 
  slug, 
  preview 
}: { 
  slug: string; 
  preview: boolean;
}) => {
  const article = await getArticleBySlug(slug, preview, "octoberthree-main");
  console.log(article, "here is the article****************")
  
  if (!article) return notFound();

  const { content } = article;
  const rels = (article as any).rels || [];
  const sections = content.sections || [];

  let authorData = null;
  if (sections[1]?.section?.[0]?.body?.content?.[0]?.attrs?.body?.[0]) {
    authorData = sections[1].section[0].body.content[0].attrs.body[0];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorData?.name || content.name || 'Team Member',
    jobTitle: authorData?.company || content.title || '',
    worksFor: {
      '@type': 'Organization',
      name: 'October Three',
    },
    ...(authorData?.location && {
      homeLocation: {
        '@type': 'Place',
        name: authorData.location,
      },
    }),
    ...(content.slug && {
      url: `https://www.octoberthree.com/team/${content.slug}`,
    }),
    ...(authorData?.headshotImage?.filename && {
      image: authorData.headshotImage.filename,
    }),
  };
console.log(article, "team member data");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {preview ? (
        <StoryblokBridge
          story={{
            ...article,
            content: {
              ...article.content,
              sections,
            },
          }}
        />
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={article.id.toString()}
          documentType={article.content.component}
          rels={rels}
        />
      )}
    </>
  );
};



export const generateMetadata = async (props: { 
  params: Promise<PageProps['params']>;
}): Promise<Metadata> => {
  const params = await props.params;
  const { slug } = params;
  
  try {
    const article = await getArticleBySlug(slug, false, "octoberthree-main");
    
    if (!article) {
      return {
        title: 'Team Member Not Found',
        description: 'The requested team member could not be found',
      };
    }

    const { content } = article;
    const name = content.name || 'Team Member';
    const title = content.title || '';
    
    return renderMetadata(`team/${slug}`, {
      title: `${name}${title ? ` | ${title}` : ''} | October Three`,
      description: `Meet ${name}, ${title} at October Three`,
    });
  } catch {
    return {
      title: 'Team Member',
      description: 'Meet our team member',
    };
  }
};

const ArticlePageContainer = async (props: { 
  params: Promise<PageProps['params']>;
  searchParams?: Promise<PageProps['searchParams']>;
}) => {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const { slug } = params;
  const preview = isStoryblokEditor(searchParams);

  try {
    return (
      <Suspense fallback={<div>Loading team member...</div>}>
        <ArticleContent slug={slug} preview={preview} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
};

export default ArticlePageContainer;