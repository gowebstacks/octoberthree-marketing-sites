import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FooterNavigation } from '@repo/ui';
import { within, expect } from '@storybook/test';

const footerNavigationMock = {
logo: {
  alt: 'Company logo',
  asset: {
    url: '/logo_wordmark.svg',
    metadata: {
      dimensions: {
        width: 320,
        height: 96,
        aspectRatio: 3.33
      }
    }
  }
},
  columns: [
    {
      _uid: 'column-products',
      groups: [
        {
          _uid: 'group-products',
          groupTitle: 'Products',
          links: [
            {
              _uid: 'product-platform',
              label: 'Platform',
              link: {
                linkType: 'internal',
                internalLink: {
                  cached_url: 'platform',
                },
              },
            },
            {
              _uid: 'product-pricing',
              label: 'Pricing',
              badge: 'New',
              link: {
                linkType: 'internal',
                internalLink: {
                  cached_url: 'pricing',
                },
              },
            },
          ],
        },
      ],
    },
    {
      _uid: 'column-company',
      groups: [
        {
          _uid: 'group-company',
          groupTitle: 'Company',
          links: [
            {
              _uid: 'company-about',
              label: 'About us',
              link: {
                linkType: 'internal',
                internalLink: {
                  cached_url: 'about',
                },
              },
            },
            {
              _uid: 'company-careers',
              label: 'Careers',
              link: {
                linkType: 'internal',
                internalLink: {
                  cached_url: 'careers',
                },
              },
            },
          ],
        },
      ],
    },
    {
      _uid: 'column-resources',
      groups: [
        {
          _uid: 'group-resources',
          groupTitle: 'Resources',
          links: [
            {
              _uid: 'resource-blog',
              label: 'Blog',
              link: {
                linkType: 'external',
                externalUrl: 'https://blog.example.com',
              },
            },
            {
              _uid: 'resource-docs',
              label: 'Documentation',
              link: {
                linkType: 'external',
                externalUrl: 'https://docs.example.com',
              },
            },
          ],
        },
      ],
    },
  ],

  bottomSection: [
    {
      copyrightText: [
        {
          content: [
            { text: '©  WEBSTACKS 2025' },
          ],
        },
      ],
      legalLinks: [
        {
          _uid: 'legal-privacy',
          label: 'Privacy Policy',
          link: {
            linkType: 'internal',
            internalLink: {
              cached_url: 'privacy',
            },
          },
        },
        {
          _uid: 'legal-terms',
          label: 'Terms of Service',
          link: {
            linkType: 'internal',
            internalLink: {
              cached_url: 'terms',
            },
          },
        },
      ],
      socialLinks: [
        {
          _uid: 'social-twitter',
          platform: 'twitter-x',
          url: 'https://twitter.com/example',
        },
        {
          _uid: 'social-linkedin',
          platform: 'linkedin',
          url: 'https://linkedin.com/company/example',
        },
      ],
    },
  ],
};

const meta: Meta<typeof FooterNavigation> = {
  title: 'Sections/FooterNavigation',
  component: FooterNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    footerNavigation: {
      control: false,
      
      description:
        'Optional fallback footer data. When omitted, Storyblok hooks are used.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FooterNavigation>;


export const Default: Story = {
  args: {
    footerNavigation: {
      ...footerNavigationMock,
      columns:[]
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const productsHeading = canvas.getByRole('heading', { name: 'Products' });
    expect(productsHeading).toBeInTheDocument();

    const platformLink = canvas.getByRole('link', { name: 'Platform' });
    expect(platformLink).toHaveAttribute('href', '/platform');

   const pricingLink = canvas.getByRole('link', {
  name: /Pricing/,
});

expect(pricingLink).toHaveAttribute('href', '/pricing');


    const badge = canvas.getByText('New');
    expect(badge).toBeInTheDocument();

    const privacyLink = canvas.getByRole('link', { name: 'Privacy Policy' });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
const twitter = canvas
  .getAllByRole('link')
  .find(link =>
    link.getAttribute('href')?.includes('twitter.com')
  );

expect(twitter).toBeDefined();

  },
};


export const WithLinks: Story = {
  args: {
    footerNavigation:  footerNavigationMock,
    
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.queryByRole('heading', { name: 'Products' })
    ).not.toBeInTheDocument();

    const privacyLink = canvas.getByRole('link', { name: 'Privacy Policy' });
    expect(privacyLink).toBeInTheDocument();
  },
};




