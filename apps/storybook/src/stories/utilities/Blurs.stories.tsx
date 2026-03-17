import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Utilities/Blurs",
  decorators: [
    (Story) => (
      <div
        className="p-10"
        style={{
          backgroundImage: "url(https://picsum.photos/1200/600)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 700,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const blurs = [
  { label: "sm", className: "blur-sm" },
  { label: "md", className: "blur-md" },
  { label: "lg", className: "blur-lg" },
  { label: "xl", className: "blur-xl" },
];

export const AllBlurs: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 justify-center">
      {blurs.map(({ label, className }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <span className="text-xs text-neutral-700">{label}</span>
          <div
            style={{ height: 100, width: 200 }}
            className={`rounded-md bg-white/60 ${className} overflow-hidden`}
          ></div>
        </div>
      ))}
    </div>
  ),
};
