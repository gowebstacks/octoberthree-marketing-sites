import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResourceBentoCard } from "@repo/ui";

const meta: Meta<typeof ResourceBentoCard> = {
  title: "Organisms/ResourceBentoCard",
  component: ResourceBentoCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className=" p-6 ">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description:
        "Controls visual size and layout. sm = split, md/lg = stacked.",
    },
    _type: { control: false },
    featuredImage: { control: false },
    seo: { control: false },
    slug: { control: false },
    body: { control: false },
    publishDate: {
      control: "text",
      description: "Date when the resource was published.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResourceBentoCard>;

const baseArgs = {
  _id: "resource-1",
  _uid: "resource-1",
  _type: "blogPost" as const,

  title: "Design Systems at Scale",

  featuredImage: {
    filename:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    alt: "Design system illustration",
  },

  seo: {
    slug: {
      current: "design-systems-at-scale",
    },
  },

  publishDate: "2025-12-12",

  body: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Learn how modern teams build and scale design systems that stay consistent across products.",
          },
        ],
      },
    ],
  },
};

export const Small: Story = {
  args: {
    ...baseArgs,
    size: "sm",
   } as any,
};

export const Medium: Story = {
  args: {
    ...baseArgs,
    size: "md",
   } as any,
};

export const Large: Story = {
  args: {
    ...baseArgs,
    size: "lg",
   } as any,
};

export const WithoutImage: Story = {
  args: {
    ...baseArgs,
    size: "md",
    featuredImage: undefined,
   } as any,
};