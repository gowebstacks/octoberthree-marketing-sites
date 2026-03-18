import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TestimonialItem } from "@repo/ui";

const baseBlok = {
  _uid: "testimonial-1",
  quote:
    "Working with Webstacks completely changed how we approach our website. They helped us move faster, experiment more, and treat our site like a product that can grow with our business. It never feels transactional—the collaboration is seamless, and the results speak for themselves.",
  author: {
    _uid: "author-1",
    name: "Savannah Leonardo",
    avatarSrc: "https://i.pravatar.cc/80?img=32",
    role: {
      label: "Co-founder, CTO",
      variant: "cyan",
    },
  },
};

const meta: Meta<typeof TestimonialItem> = {
  title: "Modules/Testimonial",
  component: TestimonialItem,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "card"],
    },
  },
  args: {
    variant: "default",
    blok: baseBlok,
  } as any,
};

export default meta;
type Story = StoryObj<typeof TestimonialItem>;

export const Default: Story = {};

export const Card: Story = {
  args: {
    variant: "card",
    blok:baseBlok as any
  },
};