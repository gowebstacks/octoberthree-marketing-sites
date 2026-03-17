import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Utilities/Shadows",
};

export default meta;
type Story = StoryObj;

const shadows = [
  { label: "xs", className: "shadow-xs" },
  { label: "sm", className: "shadow-sm" },
  { label: "md", className: "shadow-md" },
  { label: "lg", className: "shadow-lg" },
  { label: "xl", className: "shadow-xl" },
  { label: "2xl", className: "shadow-2xl" },
  { label: "3xl", className: "shadow-3xl" },
];

export const AllShadows: Story = {
  render: () => (
    <div className="bg-[#fdfdfb] p-10">
      <div className="flex gap-10">
        {shadows.map(({ label, className }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <span className="text-xs text-neutral-500">{label}</span>
            <div
              style={{
                height: 100,
                width: 100,
              }}
              className={`rounded-md bg-white ${className}`}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
