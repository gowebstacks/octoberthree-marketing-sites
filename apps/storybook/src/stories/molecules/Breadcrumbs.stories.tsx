import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import {Breadcrumbs} from "@repo/ui";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Molecules/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
 argTypes: {
  breadcrumbTitle: {
    control: "text",
    table: {
      type: { summary: "string" },
    },
  },
  breadcrumbItems: {
    control: false,
    table: {
      type: {
        summary: "Array of items with a label and a link (string | obj)",
      },
    },
  },
  variant: {
    control: "select",
    options: ["default", "back"],
    table: {
      type: { summary: "'default' | 'back'" },
      defaultValue: { summary: "default" },
    },
  },
},

};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;



export const GeneratedBreadcrumbs: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/docs/components/buttons",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Docs")).toBeInTheDocument();
    await expect(canvas.getByText("Components")).toBeInTheDocument();
    await expect(canvas.getByText("Buttons")).toBeInTheDocument();
  },
};



export const CustomBreadcrumbItems: Story = {
  args: {
    breadcrumbItems: [
      { label: "Library", link: "/library" },
      { label: "Data", link: "/library/data" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Library")).toBeInTheDocument();
    await expect(canvas.getByText("Data")).toBeInTheDocument();
  },
};


export const HomeBreadcrumb: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/products",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const home = canvas.getByLabelText("Home");

    await expect(home).toBeInTheDocument();
    await expect(home).toHaveAttribute("href", "/");
  },
};


export const LastBreadcrumbAsText: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/account/settings",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const last = canvas.getByText("Settings");

    await expect(last.tagName.toLowerCase()).toBe("span");
  },
};


export const BreadcrumbTitleOverride: Story = {
  args: {
    breadcrumbTitle: "Profile",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/account/user",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Profile")).toBeInTheDocument();
    await expect(canvas.queryByText("User")).not.toBeInTheDocument();
  },
};

export const BackVariant: Story = {
  args: {
    variant: "back",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/settings/security",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector("span");

    await expect(text).toBeInTheDocument();
    await expect(text).toHaveTextContent("Settings");
  },
};
