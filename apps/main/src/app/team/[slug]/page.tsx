import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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
    slug: string; // This will be 'mallory-casper' for /team/mallory-casper
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Allow dynamic params for team pages not pre-rendered at build time
export const dynamicParams = true;

// Revalidate team pages every 3600 seconds (1 hour) for ISR fallback
export const revalidate = 3600;



// Generate static paths for all team members at build time
export async function generateStaticParams() {
  console.log('[generateStaticParams] Starting...');
  
  if (!isStoryblokConfigured()) {
    return [];
  }

  try {
    const teamMembers = await getAllTeamMembers(false, "octoberthree-main");
    console.log(`[generateStaticParams] Found ${teamMembers.length} team members`);
    
    const params = teamMembers.map((member: any) => {
      // Extract slug from full path: "octoberthree-main/team/mallory-casper" -> "mallory-casper"
      const slugParts = member.slug.split('/');
      const slug = slugParts[slugParts.length - 1];
      console.log(`[generateStaticParams] Member: ${member.content?.name}, Slug: ${slug}`);
      return { slug };
    });
    
    return params;
  } catch (error) {
    console.error('[generateStaticParams] Error:', error);
    return [];
  }
}

// Generate metadata for the team member page
export const generateMetadata = async (props: { 
  params: Promise<PageProps['params']>;
}): Promise<Metadata> => {
  const params = await props.params;
  const { slug } = params;
  
  console.log('[generateMetadata] Fetching team member:', slug);
  
  try {
    const teamMember = await getTeamMemberBySlug(slug, false, "octoberthree-main");
    
    if (!teamMember) {
      return {
        title: 'Team Member Not Found',
        description: 'The requested team member could not be found',
      };
    }

    const title = `${teamMember.content.name} | ${teamMember.content.title} | October Three`;
    const description = teamMember.content.bio || `Meet ${teamMember.content.name}, ${teamMember.content.title} at October Three`;
    
    console.log('[generateMetadata] Metadata:', { title, description });
    
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

// Main team page component using ComponentGenerator
const TeamMemberPageContainer = async (props: { 
  params: Promise<PageProps['params']>;
  searchParams?: Promise<PageProps['searchParams']>;
}) => {
  console.log('[TeamMemberPageContainer] Starting...');
  
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const { slug } = params;
  const inEditor = isStoryblokEditor(searchParams);
  const preview = inEditor;

  console.log('[TeamMemberPageContainer] Slug:', slug, 'Preview:', preview);

  try {
    // Fetch the individual team member story from Storyblok
    console.log(`[TeamMemberPageContainer] Fetching team member: ${slug}`);
    const teamMember = await getTeamMemberBySlug(slug, preview, "octoberthree-main");
    
    if (!teamMember) {
      console.log(`[TeamMemberPageContainer] Team member not found: ${slug}`);
      return notFound();
    }

    console.log('[TeamMemberPageContainer] Team member found:', {
    teamMember: {
      id: teamMember.id,
      name: teamMember.content.name,
      title: teamMember.content.title,
    },
    });

    // Extract content and sections from the team member story
    const { content } = teamMember;
    const rels = (teamMember as any).rels || [];
    const sections = content.sections || [];
    
    console.log(`[TeamMemberPageContainer] Found ${sections.length} sections`);

    // Build absolute URL for canonical
    const siteBase = SITE_CONFIG.urls.domain;
    const absoluteUrl = `${siteBase}/team/${slug}`;

    // Prepare JSON-LD structured data for the team member
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

    console.log(sections, "test sections")
    return (
      <>
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {preview ? (
          <StoryblokBridge
            story={{
              ...teamMember,
              content: {
                ...teamMember.content,
                sections,
              },
            }}
          />
        ) : (
          <ComponentGenerator
            sections={sections}
            documentId={teamMember.id.toString()}
            documentType={teamMember.content.component}
            rels={rels}
          />
        )}
      </>
    );
  } catch (error) {
    console.error('[TeamMemberPageContainer] Error:', error);
    return notFound();
  }
};

export default TeamMemberPageContainer;