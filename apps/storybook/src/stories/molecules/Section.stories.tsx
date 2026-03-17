import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Section } from '@repo/ui'

const meta: Meta<typeof Section> = {
  title: 'Molecules/Section',
  component: Section,
  tags: ['autodocs'],
  args: {
    children: 'Section content goes here',
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'HTML element used to render the section',
      table: {
        type: { summary: 'ElementType' },
        defaultValue: { summary: 'section' },
      },
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the section',
    },
    className: {
      control: 'text',
      description: 'Additional class names to override or extend styles',
    },
    children: {
      control: 'text',
      description: 'Content inside the section',
    },
  },
 
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Section>
export const Default: Story = {}
