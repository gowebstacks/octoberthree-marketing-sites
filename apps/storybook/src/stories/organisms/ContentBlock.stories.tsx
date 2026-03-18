import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContentBlock } from "@repo/ui";
import { within, expect } from "@storybook/test";

const meta: Meta<typeof ContentBlock> = {
  title: "Organisms/ContentBlock",
  component: ContentBlock,
  tags: ["autodocs"],
  argTypes: {
    blok: {
      control: false,
      description: "Storyblok block data",
    },

   
  },
};

export default meta;
type Story = StoryObj<typeof ContentBlock>;

const baseBlok = {
  _uid: "content-block-uid",
  component: "content_block",

  eyebrow: [
    {
      _uid: "eyebrow-1",
      component: "eyebrow",
      eyebrow: "Eyebrow example",
      elementType: "h6",
    },
  ],

  heading: [
    {
      _uid: "heading-1",
      component: "heading",
      heading: "Where performance meets possibility",
    },
  ],

  body: {
    type: "doc",
    content: [
      {
        type: "bullet_list",
        content: [
          {
            type: "list_item",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Lorem ipsum dolor sit amet, consectetur",
                  },
                ],
              },
            ],
          },
          {
            type: "list_item",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Lorem ipsum dolor sit amet, consectetur",
                  },
                ],
              },
            ],
          },
          {
            type: "list_item",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Lorem ipsum dolor sit amet, consectetur",
                  },
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
      _uid: "cta-bar-1",
      placeholder: "companyemail@company.com",
      type: "button",
      buttons: [
        {
          _uid: "btn-1",
          label: "Get Started",
          href: "#",
        },
        {
          _uid: "btn-2",
          label: "Learn More",
          href: "#",
        },
      ],
    },
  ],
};

const basePlay: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      name: /where performance meets possibility/i,
    })
  ).toBeInTheDocument();

  await expect(canvas.getByText(/eyebrow example/i)).toBeInTheDocument();
};

export const Stacked: Story = {
  args: {
    blok: {
      ...baseBlok,
      layout: "stacked",
      mode: "light",
    } as any,
  },
  play: basePlay,
};

export const Leading: Story = {
  args: {
    blok: {
      ...baseBlok,
      layout: "leading",
      mode: "light",
    } as any,
  },
  play: basePlay,
};

export const Split: Story = {
  args: {
    blok: {
      ...baseBlok,
      layout: "split",
      mode: "light",
    } as any,
  },
  play: basePlay,
};

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div className="bg-black px-6 py-20">
        <Story />
      </div>
    ),
  ],

  args: {
    blok: {
      ...baseBlok,
      layout: "stacked",
      mode: "dark",
    } as any,
  },

  play: basePlay,
};

export const Subscribe: Story = {
  args: {
    blok: {
      ...baseBlok,
      layout: "stacked",
      mode: "light",

      ctaBar: [
        {
          _uid: "cta-subscribe",
          type: "subscribe",
          placeholder: "Enter your email",

          buttons: [
            {
              _uid: "btn-subscribe",
              label: "Subscribe",
              mode: "filled",
              tone: "primary",
            },
          ],
        },
      ],
    } as any,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();

    await expect(
      canvas.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
  },
};