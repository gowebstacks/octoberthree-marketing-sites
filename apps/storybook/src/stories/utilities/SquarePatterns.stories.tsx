import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Utilities/Patterns",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "1000px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const WhitePattern: Story = {
  render: () => <div style={{background:'#000',height: "1000px", }}>
    <div className="pattern-grid pattern-white" />
  </div>,
};

export const YellowPattern: Story = {
  render: () => <div className="pattern-grid pattern-yellow" />,
};

export const CyanPattern: Story = {
  render: () => <div className="pattern-grid pattern-cyan" />,
};

export const OrangePattern: Story = {
  render: () => <div className="pattern-grid pattern-orange" />,
};

export const BluePattern: Story = {
  render: () => <div className="pattern-grid pattern-blue" />,
};
export const TriangleWhitePattern: Story = {
  render: () => <div style={{background:'#000',height: "1000px", }}>
    <div className="pattern-triangle pattern-white" />
  </div>,
};

export const TriangleYellowPattern: Story = {
  render: () => <div className="pattern-triangle pattern-yellow" />,
};

export const TriangleCyanPattern: Story = {
  render: () => <div className="pattern-triangle pattern-cyan" />,
};

export const TriangleOrangePattern: Story = {
  render: () => <div className="pattern-triangle pattern-orange" />,
};

export const TriangleBluePattern: Story = {
  render: () => <div className="pattern-triangle pattern-blue" />,
};