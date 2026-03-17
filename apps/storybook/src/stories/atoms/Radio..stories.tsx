import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio } from "@repo/ui";

const meta: Meta<typeof Radio> = {
  title: "Atoms/Radio",
  component: Radio,
  args: {
    label: "Remember me",
    disabled: false,
    size: "sm",
    type: "dot",
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controls the checked state of the radio",
    },
    disabled: {
      control: "boolean",
      description: "Disables the radio",
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md"],
      description: "Controls the size of the radio",
    },
    type: {
      control: { type: "radio" },
      options: ["dot", "check"],
      description: "Radio indicator type",
    },
    label: {
      control: "text",
      description: "Label displayed next to the radio",
    },
    labelClassName: {
      control: "text",
      description: "Additional classes for the label",
    },
    className: {
      control: "text",
      description: "Additional classes for the radio input",
    },
    id: {
      control: "text",
    },
    name: {
      control: "text",
    },
    value: {
      control: "text",
    },
    onChange: {
      description: "Callback fired when checked state changes",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const CheckType: Story = {
  args: {
    checked: true,
    type: "check",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const DisabledCheckType: Story = {
  args: {
    disabled: true,
    checked: true,
    type: "check",
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Radio {...args} size="sm" label="Small radio" />
      <Radio {...args} size="md" label="Medium radio" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <Radio label="Dot Default" type="dot" />
        <Radio label="Dot Checked" type="dot" checked />
        <Radio label="Dot Disabled" type="dot" disabled />
        <Radio label="Dot Disabled Checked" type="dot" disabled checked />
      </div>

      <div className="flex flex-col gap-4">
        <Radio label="Check Default" type="check" />
        <Radio label="Check Checked" type="check" checked />
        <Radio label="Check Disabled" type="check" disabled />
        <Radio label="Check Disabled Checked" type="check" disabled checked />
      </div>
    </div>
  ),
};