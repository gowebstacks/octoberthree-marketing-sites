import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccordionItem } from "@repo/ui";

const meta: Meta<typeof AccordionItem> = {
  title: "Organisms/AccordionItem",
  component: AccordionItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "AccordionItem is a collapsible content component.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "#f8f8f8",
          padding: "24px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: false,
      description: "Accordion items (Storyblok mapped data)",
    },
    colorMode: {
      control: "select",
      options: ["light", "dark"],
      description: "light | dark",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionItem>;

export const Default: Story = {
  args: {
    items: [
      {
        _uid: "item-1",
        label: "Design Systems",
        icon: {
          id: "icon-1",
          filename: "https://cdn-icons-png.flaticon.com/512/3524/3524636.png",
          alt: "Settings icon",
        },
        body: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A design system creates order out of complexity. It ensures every component—from buttons to banners—works together seamlessly and reflects a unified brand language.",
                },
              ],
            },
          ],
        },
        cta: {
          label: "Go to settings",
          href: "/settings",
        },
      },
      {
        _uid: "item-2",
        label: "Billing & invoices",
        icon: {
          id: "icon-2",
          filename: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png",
          alt: "Billing icon",
        },
        body: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "View invoices, update payment methods, and more.",
                },
              ],
            },
          ],
        },
      },
    ],
    colorMode: "light",
  } as any,
};