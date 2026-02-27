import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TabbedSwitcher } from '@repo/ui'

const meta: Meta<typeof TabbedSwitcher> = {
  title: 'Sections/TabbedSwitcher',
  component: TabbedSwitcher,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TabbedSwitcher>

const imageMock = {
  alt: 'Design system illustration',
  asset: {
    url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d',
    metadata: {
      dimensions: {
        width: 1200,
        height: 1200,
        aspectRatio: 1,
      },
    },
  },
}

const contentMock = {
  _uid: 'content-block-uid',
  component: 'content_block',
  eyebrow: [
    {
      _uid: 'eyebrow-1',
      component: 'eyebrow',
      elementType: 'h6',
      eyebrow: 'Eyebrow example',
    },
  ],
  heading: 'Where performance meets possibility',
  subheading:
    'Every website should be built to evolve. From the first line of code to the final interaction, it’s a living product designed to adapt, scale, and drive growth over time.',
  layout: 'leading',
  content: {
    type: 'doc',
    content: [
      {
        type: 'bullet_list',
        content: [
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' },
                ],
              },
            ],
          },
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' },
                ],
              },
            ],
          },
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  ctaBar: [
    {
      _uid: 'cta-bar-1',
      buttons: [
        {
          _uid: 'btn-1',
          href: '#',
          label: 'Get Started',
        },
        {
          _uid: 'btn-2',
          href: '#',
          label: 'Learn More',
        },
      ],
      placeholder: 'companyemail@company.com',
      type: 'button',
    },
  ],
}

export const Default: Story = {
  args: {
    blok: {
      _uid: 'tabbed-switcher-1',
      component: 'tabbed_switcher',
      defaultActiveIndex: 0,
      tabs: [
        {
          _uid: 'tab-1',
          title: 'Design',
          content: contentMock,
          image: imageMock,
        },
        {
          _uid: 'tab-2',
          title: 'Build',
          content: {
            ...contentMock,
            heading: 'Built for modern engineering teams',
          },
          image: imageMock,
        },
      ],
    } as any,
  },
}

export const WithTopContent: Story = {
  args: {
    blok: {
      _uid: 'tabbed-switcher-with-content',
      component: 'tabbed_switcher',
      content: {
        ...contentMock,
        heading:'Top content heading',
        ctaBar:[]
      },
      tabs: [
        {
          _uid: 'tab-1',
          title: 'Design',
          content: contentMock,
          image: imageMock,
        },
        {
          _uid: 'tab-2',
          title: 'Build',
          content: {
            ...contentMock,
            heading: 'Ship faster with confidence',
          },
          image: imageMock,
        },
      ],
    } as any,
  },
}

export const ThreeTabs: Story = {
  args: {
    blok: {
      _uid: 'tabbed-switcher-2',
      component: 'tabbed_switcher',
      tabs: [
        {
          _uid: 'tab-1',
          title: 'Design',
          content: contentMock,
          image: imageMock,
        },
        {
          _uid: 'tab-2',
          title: 'Build',
          content: {
            ...contentMock,
            heading: 'Ship faster with confidence',
          },
          image: imageMock,
        },
        {
          _uid: 'tab-3',
          title: 'Scale',
          content: {
            ...contentMock,
            heading: 'Scale without losing consistency',
          },
          image: imageMock,
        },
      ],
    } as any,
  },
}

