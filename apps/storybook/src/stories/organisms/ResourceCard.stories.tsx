import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ResourceCardProps } from "@repo/ui";
import { ResourceCard } from "@repo/ui";
import { within, expect } from "@storybook/test";

const meta: Meta<ResourceCardProps> = {
  title: "Organisms/ResourceCard",
  component: ResourceCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    _id: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    _type: {
      control: "select",
      options: ["blogPost", "caseStudy", "webinar", "pressRelease"],
      table: {
        type: {
          summary: "'blogPost' | 'caseStudy' | 'webinar' | 'pressRelease'",
        },
      },
    },
    title: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    excerpt: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    body: {
      control: false,
      table: { type: { summary: "any" } },
    },
    featuredImage: {
      control: false,
      table: { type: { summary: "any" } },
    },
    seo: {
      control: false,
      table: { type: { summary: "{ slug?: { current?: string } }" } },
    },
    slug: {
      control: false,
      table: { type: { summary: "{ current?: string }" } },
    },
    publishedDate: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    publishedAt: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    topics: {
      control: false,
      table: { type: { summary: "{ name: string }[]" } },
    },
    companyName: {
      control: "text",
      table: { type: { summary: "string" } },
    },
    showBadge: {
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ResourceCardProps>;

const baseArgs: ResourceCardProps = {
  _id: "1",
  _type: "blogPost",
  title: "How Teams Build Faster with Design Systems",
  seo: {
    slug: { current: "design-systems-at-scale" },
  },
  featuredImage: {
    filename:
      "https://a.storyblok.com/f/288727743104072/343x121/2c5381a96b/forbes-thumbnail.png",
    alt: "Cover image",
  },
  topics: [{ name: "Design Systems" }],
};

export const BlogPost: Story = {
  args: {
    ...baseArgs,
    excerpt:
      "Learn how modern teams accelerate development using design systems.Learn how modern teams accelerate development using design systems.Learn how modern teams accelerate development using design systems.Learn how modern teams accelerate development using design systems.Learn how modern teams accelerate development using design systems.",
    showBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link");

    expect(link.getAttribute("href")).toContain("/blog/");
    expect(canvas.getByText("Learn More")).toBeInTheDocument();
  },
};

export const WithoutImage: Story = {
  args: {
    ...baseArgs,
    featuredImage: undefined,
    excerpt: "This card renders correctly without an image.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Learn More")).toBeInTheDocument();
  },
};
