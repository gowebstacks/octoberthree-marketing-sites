import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { within, expect } from '@storybook/test'
import { IconCardDeck } from '@repo/ui'
import type { ContentBlockBlok } from '@repo/ui'

const contentBlockBlok: ContentBlockBlok = {
  _uid: 'content-block-1',
  component: 'content_block',
  layout: 'leading',
  eyebrow: [
    {
      _uid: 'eyebrow-1',
      component: 'eyebrow',
      eyebrow: 'Platform features',
      elementType: 'h6',
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
            text: 'Powerful building blocks designed for modern product teams.',
          },
        ],
      },
    ],
  } as any,
}

const richBody = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'A design system creates order out of complexity. It ensures every component—from buttons to banners—works together seamlessly and reflects a unified brand language.',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'Includes:',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'ordered_list',
      attrs: { order: 1 },
      content: [
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' }],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' }],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' }],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur' }],
            },
          ],
        },
      ],
    },
  ],
}

const card = () => ({
  _uid: crypto.randomUUID(),
  component: 'iconTextCard',
  heading: 'Building Consistency Into Every Website Experience',
   icon: {
      filename : 'https://a.storyblok.com/f/288727743104072/180x225/09bc726e77/icon_rocket.png'
    },
  body: richBody,
  button: [
    {
      label: 'Get Started',
      trailingIcon: 'arrow-right',
    },
    {
      label: 'Learn more',
      trailingIcon: 'arrow-right',
    },
  ],
})

const rows = [
  {
    cardsPerRow: '4',
    cards: [card(), card(), card(), card()],
  },
]

const meta: Meta<typeof IconCardDeck> = {
  title: 'Sections/IconCardDeck',
  component: IconCardDeck,
  tags: ['autodocs'],
  argTypes: {
    content: { control: false },
    rows: { control: false },
  },
  parameters:{
    layout:'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof IconCardDeck>
const basePlay: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getAllByText("Building Consistency Into Every Website Experience")
  ).toHaveLength(4);

  await expect(
    canvas.getAllByText("Get Started")
  ).toHaveLength(4);

  await expect(
    canvas.getAllByText("Learn more")
  ).toHaveLength(4);
};

export const FourCard: Story = {
  args: {
    content: [contentBlockBlok],
    rows,
  } as any,
  play: basePlay,
}