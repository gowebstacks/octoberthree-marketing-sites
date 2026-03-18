import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NestedCards } from "@repo/ui";
import type { NestedCardsBlok } from "@repo/ui";

const meta: Meta<typeof NestedCards> = {
  title: "Molecules/NestedCards",
  component: NestedCards,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof NestedCards>;

const mockBlok: NestedCardsBlok = {
  _uid: "nested-cards-1",
  items: [
    {
      _uid: "card-1",
      icon: {
        filename:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lightning.svg",
        alt: "Fast integration",
      },
      title: "Fast integration",
      description:
        "Plug into your existing stack with minimal setup and no friction.",
      linkLabel: "Learn more",
      link: {
        linkType: "external",
        externalUrl: "https://example.com",
      },
    },
    {
      _uid: "card-2",
      icon: {
        filename:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/scaleway.svg",
        alt: "Security",
      },
      title: "Enterprise-grade security",
      description:
        "Built with security-first principles and industry best practices.",
      linkLabel: "Security overview",
      link: {
        linkType: "external",
        externalUrl: "https://example.com",
      },
    },
    {
      _uid: "card-3",
      icon: {
        filename:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/scaleway.svg",
        alt: "Scale",
      },
      title: "Designed to scale",
      description:
        "Flexible architecture that grows with your product and team.",
      linkLabel: "See how",
      link: {
        linkType: "external",
        externalUrl: "https://example.com",
      },
    },
    {
      _uid: "card-4",
      icon: {
        filename:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/rocket.svg",
        alt: "Performance",
      },
      title: "High performance",
      description:
        "Optimized for speed and reliability, even at large scale.",
      linkLabel: "Performance details",
      link: {
        linkType: "external",
        externalUrl: "https://example.com",
      },
    } as any,
  ],
};

export const Default: Story = {
  args: {
    blok: mockBlok,
  },
};