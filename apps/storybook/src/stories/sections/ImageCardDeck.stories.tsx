import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { within, expect } from '@storybook/test'
import { ImageCardDeck } from '@repo/ui'
import type { ContentBlockBlok } from '@repo/ui'

const contentBlockBlok: ContentBlockBlok = {
  _uid: 'content-block-1',
  component: 'content_block',
  eyebrow: [
    {
      _uid: 'eyebrow-1',
      component: 'eyebrow',
      eyebrow: 'Use cases',
      elementType: 'h6',
    },
  ],
  layout:'leading',
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
          tone:'secondary'
        },
      ],
    },
  ],
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text:
              'We believe retirement strategy demands care and consistency. October Three focuses on getting the details right—delivering guidance you can trust over the long term.',
          },
        ],
      },
    ],
  } as any,
}

const image = (src: string, alt: string) => ({
  image: {
    id: crypto.randomUUID(),
    filename: src,
    alt,
  },
})

const card = (title: string, description: string, img: string) => ({
  _uid: crypto.randomUUID(),
  component: 'imageTextCard',
  heading: title,
  body: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: description }],
      },
    ],
  },
  ...image(img, title),
})

const rows = [
  {
    cardsPerRow: '3',
    cards: [
      card(
        'Engineering teams',
        'Ship features faster with confidence.',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop'
      ),
      card(
        'Product teams',
        'Align strategy with execution.',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop'
      ),
      card(
        'Design teams',
        'Create consistent, scalable experiences.',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop'
      ),
    ],
  },
]

const meta: Meta<typeof ImageCardDeck> = {
  title: 'Sections/ImageCardDeck',
  component: ImageCardDeck,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    content: { control: false },
    rows: { control: false },
 
  },
}

export default meta
type Story = StoryObj<typeof ImageCardDeck>

const basePlay: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByText("Engineering teams")
  ).toBeInTheDocument();

  await expect(
    canvas.getByText("Product teams")
  ).toBeInTheDocument();

  await expect(
    canvas.getByText("Design teams")
  ).toBeInTheDocument();




};
export const Default: Story = {
  args: {
    content: [contentBlockBlok],
    rows,
  } as any,
  play: basePlay,
}