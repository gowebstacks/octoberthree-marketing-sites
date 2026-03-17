import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Utilities/BackgroundGradient",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{height:'2000px'}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="soft-gradient" />

      <div className="relative h-125 z-20 flex  items-center justify-center text-white text-2xl font-semibold">
        Soft Gradient Preview
      </div>
    </div>
  ),
};