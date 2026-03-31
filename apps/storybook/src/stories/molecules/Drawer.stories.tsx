import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import {Drawer} from '@repo/ui'

const meta: Meta<typeof Drawer> = {
  title: "Molecules/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          height: "70vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the drawer is visible",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: 'false'},
      },
    },
    accordions: {
      control: "object",
      description: "List of accordion sections rendered inside the drawer",
      table: {
        type: {
          summary: "DrawerAccordion[]",
        },
      },
    },
    onClose: {
      action: "close",
      description: "Called when the drawer close button is clicked",
      table: {
        type: { summary: "() => void" },
      },
    },
    onApply: {
      action: "apply",
      description: "Called when the user clicks the Done button",
      table: {
        type: { summary: "(selected: Record<string, string[]>) => void" },
      },
    },
    onReset: {
      action: "reset",
      description: "Called when the Reset button is clicked",
      table: {
        type: { summary: "() => void" },
      },
    },
    className: {
      control: "text",
      description: "Custom class applied to the drawer container",
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Drawer>

const accordionsMock = [
  {
    id: 'category',
    title: 'Category',
    options: ['Shoes', 'Clothing', 'Accessories',],
  },
  {
    id: 'brand',
    title: 'Brand',
    options: ['Nike', 'Adidas', 'Puma'],
  },
  {
    id: 'price',
    title: 'Price Range',
    options: ['Under ₹1000', '$1000–$3000', 'Above $3000'],
  },
]
const DrawerWrapper = (args: any) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="h-screen bg-gray-100">
      <Drawer
        {...args}
        isOpen={open}
        onClose={() => setOpen(false)}
        onApply={(data) => {
          setOpen(false)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    accordions: accordionsMock,
  },
}


export const EmptyState: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    accordions: [],
  },
}
