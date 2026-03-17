import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";

const meta: Meta = {
  title: "Utilities/Focus Ring",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const PrimaryFocus: Story = {
  render: () => (
    <input
      className="focus-primary border px-4 py-2 rounded"
      placeholder="Focus primary"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Focus primary");

    input.focus();

    await expect(input).toHaveFocus();
  },
};

export const ErrorFocus: Story = {
  render: () => (
    <input
      className="focus-error border px-4 py-2 rounded"
      placeholder="Focus error"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Focus error");

    input.focus();

    await expect(input).toHaveFocus();
  },
};