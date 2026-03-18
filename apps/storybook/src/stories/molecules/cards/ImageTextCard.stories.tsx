import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { ImageTextCard } from "@repo/ui";
import type { LinkFragment } from "@repo/ui";

const meta: Meta<typeof ImageTextCard> = {
  title: "Molecules/Cards/ImageCard",
  component: ImageTextCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },

  argTypes: {
    heading: {
      control: "text",
    },

    image: {
      control: false,
    },

    body: {
      control: false,
    },

    link: {
      control: false,
    },

    isActive: {
      control: "boolean",
    },

    theme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageTextCard>;

const mockBody = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
      content: [
        {
          text: "October Three partners with HR and finance leaders to bring clarity, precision, and confidence to retirement planning.",
          type: "text",
        },
      ],
    },
  ],
};

export const WithoutLink: Story = {
  args: {
    _key: "image-text-card-default",

    image: {
      id: "1",
      filename: "https://picsum.photos/600/400",
      alt: "Card image",
    },

    heading: "Retirement",

    body: mockBody as any,

    isActive: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Retirement")).toBeInTheDocument();

    const link = canvasElement.querySelector("a");
    await expect(link).toBeNull();
  },
};

export const WithLink: Story = {
  args: {
    _key: "image-text-card-link",

    image: {
      id: "2",
      filename: "https://picsum.photos/600/400",
      alt: "Card image",
    },

    heading: "Retirement",

    body: mockBody as any,

    isActive: true,

    link: {
      label: "Learn more",
      linkType: "external",
      externalUrl: "https://example.com",
    } as LinkFragment,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Retirement")).toBeInTheDocument();

    const wrapperLink = canvasElement.querySelector("a");
    await expect(wrapperLink).toBeInTheDocument();
  },
};

export const Collapsed: Story = {
  args: {
    _key: "image-text-card-collapsed",

    image: {
      id: "3",
      filename: "https://picsum.photos/600/400",
      alt: "Card image",
    },

    heading: "Retirement",

    body: mockBody as any,

    isActive: false,
  },
};