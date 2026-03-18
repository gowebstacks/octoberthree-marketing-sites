import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { Accordion } from '@repo/ui';


const mockEyebrow = [
  {
    _uid: 'eyebrow-1',
    component: 'eyebrow',
    eyebrow: 'FAQs',
    elementType: 'h6',
  },
];

const mockHeading = [
  {
    _uid: 'heading-1',
    component: 'heading',
    heading: 'Frequently asked questions',
    elementType: 'h2',
    fontFamily: 'display'
  },
];

const mockBody = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Every website should be built to evolve. From the first line of code to the final interaction, it’s a living product designed to adapt, scale, and drive growth over time. This block represents how structure, content, and design work together to deliver an experience that feels seamless today—and ready for what’s next.',
        },
      ],
    },
  ],
};

const mockItems= [
      {
        _uid: 'item-1',
        title: 'Design Sytems',
         icon: {
          id: 'icon-1',
          filename: 'https://cdn-icons-png.flaticon.com/512/3524/3524636.png',
          alt: 'Settings icon',
        },
          content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "View invoices, update payment methods, and more.",
              },
            ],
          } 
        ],
        cta: {
          label: 'Go to settings',
          href: '/settings',
        },
      },
      {
        _uid: 'item-2',
        title: 'Billing & invoices',
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "View invoices, update payment methods, and more.",
              },
            ],
          } 
        ],
         icon: {
          id: 'icon-2',
          filename: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png',
          alt: 'Billing icon',
        },
      
      } as any,
    ]



const basePlay: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByText('Frequently asked questions'),
  ).toBeInTheDocument();

  const firstQuestion = canvas.getByText(
    'What is your refund policy?',
  );
  await expect(firstQuestion).toBeInTheDocument();

  await userEvent.click(firstQuestion);

  await expect(
    canvas.getByText(/30-day money-back guarantee/i),
  ).toBeInTheDocument();
};


const meta: Meta<typeof Accordion> = {
  title: 'Sections/Accordion',
  component: Accordion,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout:'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'radio' },
      options: ['stack', 'split'],
      table: { category: 'Layout' },
    },

    heading: { control: false },
    eyebrow: { control: false },
    body: { control: false },
    items: { control: false },
    ctaBar: { control: false },

    _uid: { table: { disable: true } },
    component: { table: { disable: true } },
    editable: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;



export const StackLayout: Story = {
  args: {
    eyebrow: mockEyebrow,
    heading: mockHeading,
    body: mockBody as any,
    items: mockItems,
    layout: 'stack',
  },
  play: basePlay,
};

export const SplitLayout: Story = {
  ...StackLayout,
  args: {
    ...StackLayout.args,
    layout: 'split',
  },
};

