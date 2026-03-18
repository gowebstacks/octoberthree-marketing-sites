import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Utilities/BackgroundGradient",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "40px", background: "#d1d5db", minHeight: "200vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

const variants = [
  { label: "Right Orange", className: "right-orange" },
  { label: "Right Yellow", className: "right-yellow" },
  { label: "Right Cyan", className: "right-cyan" },
  { label: "Right Teal", className: "right-teal" },
  { label: "Left Orange", className: "left-orange" },
  { label: "Left Yellow", className: "left-yellow" },
  { label: "Left Cyan", className: "left-cyan" },
  { label: "Left Teal", className: "left-teal" },
];

export const Default: Story = {
  render: () => (
    <>
      {variants.map((variant) => (
        <div
          key={variant.label}
          className="relative w-full h-[800px] overflow-hidden rounded-xl border border-gray-300 bg-white mb-6"
        >
          <div className={`soft-gradient ${variant.className}`} />
          <div className="relative z-20 flex h-full items-end justify-center pb-4 text-sm font-medium text-gray-700">
            {variant.label}
          </div>
        </div>
      ))}
    </>
  ),
};