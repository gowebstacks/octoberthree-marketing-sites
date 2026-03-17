import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eyebrow } from "@repo/ui";
import type { EyebrowBlockProps } from "@repo/ui";
import { expect, within } from "@storybook/test";

const meta: Meta<EyebrowBlockProps> = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
 parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Eyebrow text component used for section labels or overlines. Supports semantic element rendering and custom styling.",
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
    },
    as: {
      control: "select",
      options: ["h6", "span", "div"],
    },
        className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<EyebrowBlockProps>;

export const Default: Story = {
  args: {
    eyebrow: "Section label",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Section label")).toBeInTheDocument();
  },
};

export const AsHeading: Story = {
  name: "Rendered as h6",
  args: {
    eyebrow: "Overview",
    as: "h6",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 6 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent("Overview");
  },
};

export const AsSpan: Story = {
  name: "Rendered as span",
  args: {
    eyebrow: "Metadata",
    as: "span",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Metadata");

    await expect(text.tagName.toLowerCase()).toBe("span");
  },
};

export const AsDiv: Story = {
  name: "Rendered as div",
  args: {
    eyebrow: "Category",
    as: "div",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Category");

    await expect(text.tagName.toLowerCase()).toBe("div");
  },
};

export const WithClassName: Story = {
  args: {
    eyebrow: "Styled Eyebrow",
    className: "text-xl",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByText("Styled Eyebrow").parentElement;

    await expect(wrapper).toHaveClass("text-xl");
  },
};
