import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

import {
  ComponentGenerator,
  getAllTeamMembers,
  getTeamMemberBySlug,
  isStoryblokConfigured,
  StoryblokBridge,
} from '@repo/storyblok';

import { renderMetadata, SITE_CONFIG } from '@repo/ui';
import { isStoryblokEditor } from '../../../lib/helper';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

// ================= STATIC PARAMS =================
export async function generateStaticParams() {
  if (!isStoryblokConfigured()) return [];

  try {
    const teamMembers = await getAllTeamMembers(false, "octoberthree-main");

    return teamMembers.map((member: any) => {
      const slugParts = member.slug.split('/');
      return { slug: slugParts[slugParts.length - 1] };
    });
  } catch (error) {
    console.error('[generateStaticParams] Error:', error);
    return [];
  }
}

// ================= METADATA =================
export const generateMetadata = async (props: { 
  params: Promise<PageProps['params']>;
}): Promise<Metadata> => {
  const params = await props.params;
  const { slug } = params;

  try {
    const teamMember = await getTeamMemberBySlug(slug, false, "octoberthree-main");

    if (!teamMember) {
      return {
        title: 'Team Member Not Found',
        description: 'The requested team member could not be found',
      };
    }

    const title = `${teamMember.content.name} | ${teamMember.content.title} | October Three`;
    const description =
      teamMember.content.bio ||
      `Meet ${teamMember.content.name}, ${teamMember.content.title} at October Three`;

    return renderMetadata(`team/${slug}`, {
      title,
      description,
    });
  } catch (error) {
    console.error('[generateMetadata] Error:', error);
    return {
      title: 'Team Member',
      description: 'Meet our team member',
    };
  }
};

// ================= PAGE =================
const TeamMemberPageContainer = async (props: { 
  params: Promise<PageProps['params']>;
  searchParams?: Promise<PageProps['searchParams']>;
}) => {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  const { slug } = params;
  const preview = isStoryblokEditor(searchParams);

  try {
    const teamMember = await getTeamMemberBySlug(slug, preview, "octoberthree-main");

    if (!teamMember) return notFound();

    const { content } = teamMember;
    const rels = (teamMember as any).rels || [];

    // ✅ NEW FLEXIBLE STRUCTURE
    const heroSection = content.heroSection;
    const sectionsAbove = content.sectionsAbove || [];
    const sections = content.sections || [];
    const sectionsBelow = content.sectionsBelow || [];

    // JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: content.name,
      jobTitle: content.title,
      worksFor: {
        '@type': 'Organization',
        name: 'October Three',
      },
      ...(content.location && {
        homeLocation: {
          '@type': 'Place',
          name: content.location,
        },
      }),
      ...(content.linkedin && {
        sameAs: [content.linkedin],
      }),
      ...(content.headshotImage && {
        image: content.headshotImage.filename,
      }),
    };

    return (
      <>
        {/* SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preview */}
        {preview && (
          <StoryblokBridge
            story={{
              ...teamMember,
              content: {
                ...teamMember.content,
              },
            }}
          />
        )}

        <main className="size-full flex flex-col">

          {/* HERO */}
          {heroSection && (
            <ComponentGenerator
              sections={[heroSection]}
              documentId={teamMember.id.toString()}
              documentType={content.component}
              rels={rels}
            />
          )}

          {/* ABOVE */}
          {sectionsAbove.length > 0 && (
            <ComponentGenerator
              sections={sectionsAbove}
              documentId={teamMember.id.toString()}
              documentType={content.component}
              rels={rels}
            />
          )}

          {/* MAIN (WITH SUSPENSE like blog) */}
          <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
            {sections.length > 0 && (
              <ComponentGenerator
                sections={sections}
                documentId={teamMember.id.toString()}
                documentType={content.component}
                rels={rels}
              />
            )}
          </Suspense>

          {/* BELOW */}
          {sectionsBelow.length > 0 && (
            <ComponentGenerator
              sections={sectionsBelow}
              documentId={teamMember.id.toString()}
              documentType={content.component}
              rels={rels}
            />
          )}

        </main>
      </>
    );
  } catch (error) {
    console.error('[TeamMemberPageContainer] Error:', error);
    return notFound();
  }
};

export default TeamMemberPageContainer;