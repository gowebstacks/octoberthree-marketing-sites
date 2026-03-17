import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import {Icon} from "@repo/ui";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    icon: {
      control: "text",
    },
    size: {
      control: "number",
    },
    strokeWidth: {
      control: "number",
    },
    spriteType: {
      control: "select",
      options: ["ui", "brand"],
    },
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: "arrow-right",
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("width", "24");
    await expect(svg).toHaveAttribute("height", "24");
  },
};

export const MissingIconName: Story = {
  args: {
    icon: "",
  },
  play: async ({ canvasElement }) => {
     const svg = canvasElement.querySelector("svg");
    await expect(svg).toBeNull();
  },
};

export const UiSprite: Story = {
  args: {
    icon: "arrow-left",
  },
  play: async ({ canvasElement }) => {
   
    const use = canvasElement.querySelector("use");

    await expect(use).toBeInTheDocument();
    await expect(use?.getAttribute("href")).toContain("/ui-icon-sprite.svg");
  },
};

export const BrandSprite: Story = {
  args: {
    icon: "brand-agent",
    spriteType: "brand",
    size:48,
    color: 'var(--illustration-primary)'
  },
  play: async ({ canvasElement }) => {
    const use = canvasElement.querySelector("use");

    await expect(use).toBeInTheDocument();
    await expect(use?.getAttribute("href")).toContain("/brand-icon-sprite.svg");
    await expect(use?.getAttribute("href")).toContain("#brand-agent");
  },
};

export const CustomSize: Story = {
  args: {
    icon: "arrow-right",
    size: 32,
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toHaveAttribute("width", "32");
    await expect(svg).toHaveAttribute("height", "32");
  },
};

export const WithClassName: Story = {
  args: {
    icon: "arrow-right",
    className: "p-1",
  },
  play: async ({ canvasElement }) => {
     const svg = canvasElement.querySelector("svg");
    await expect(svg).toHaveClass("p-1");
  },
};

export const PassThroughProps: Story = {
  args: {
    icon: "arrow-right",
    "aria-label": "Arrow Right",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByLabelText("Arrow Right");

    await expect(svg).toBeInTheDocument();
  },
};

