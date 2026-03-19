import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Hero, type HeroBlok } from '@repo/ui'
import type { ContentBlockBlok } from '@repo/ui'

const meta: Meta<typeof Hero> = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Hero>

const contentBlockBlok: ContentBlockBlok = {
  _uid: 'content-block-1',
  component: 'content_block',
  eyebrow: [
    {
      _uid: 'eyebrow-1',
      component: 'eyebrow',
      eyebrow: 'New',
      elementType: 'h6',
    },
  ],
   heading: [
    {
      _uid: 'heading-1',
      component: 'heading',
      heading: 'Where performance meets possibility',
    },
  ],
  subheading: 'Everything you need to ship modern interfaces',
  body: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text:
              'Every website should be built to evolve. From the first line of code to the final interaction, it’s a living product designed to adapt, scale, and drive growth over time.',
          },
        ],
      },
    ],
  } as any,
  ctaBar: [
    {
      _uid: 'cta-bar-1',
      component: 'cta_bar',
      type: 'button',
      buttons: [
        {
          _uid: 'btn-1',
          label: 'Get started',
          href: '#',
          target: '_self',
        },
        {
          _uid: 'btn-2',
          label: 'Learn more',
          href: '#',
          target: '_self',
          tone: 'secondary',
        },
      ],
    },
  ],
  layout: 'leading',
}

const heroBlok: HeroBlok = {
  _uid: 'hero-1',
  component: 'hero',
  body: [contentBlockBlok],
  heroImage: {
    filename:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    alt: 'Team collaborating',
  },
}

export const Default: Story = {
  args: {
    blok: heroBlok,
  },
}

export const SubscribeCTA: Story = {
  args: {
    blok: {
      ...heroBlok,
      body: [
        {
          ...contentBlockBlok,
          _uid: 'content-block-2',
          ctaBar: [
            {
              _uid: 'cta-bar-subscribe',
              component: 'cta_bar',
              type: 'subscribe',
              placeholder: 'Enter your email',
              buttons: [
                {
                  _uid: 'btn-subscribe',
                  label: 'Subscribe',
                  href: '#',
                },
              ],
            },
          ],
        },
      ],
    },
  },
}