import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {RTCTable} from '@repo/ui'

const meta: Meta<typeof RTCTable> = {
  title: 'Modules/RTCTable',
  component: RTCTable,
  tags: ['autodocs'],
  args: {
    headers: [
      { _key: 'h1', text: 'Features', alignment: 'left' },
      { _key: 'h2', text: 'Basic' },
      { _key: 'h3', text: 'Pro' },
      { _key: 'h4', text: 'Enterprise' },
    ],

    rows: [
      {
        _key: 'r1',
        cells: [
          { _key: 'c1', content: 'Authentication' },
          { _key: 'c2', content: 'check' },
          { _key: 'c3', content: 'check' },
          { _key: 'c4', content: 'check' },
        ],
      },
      {
        _key: 'r2',
        cells: [
          { _key: 'c1', content: 'Single Sign-On' },
          { _key: 'c2', content: '' },
          { _key: 'c3', content: 'check' },
          { _key: 'c4', content: 'check' },
        ],
      },
      {
        _key: 'r3',
        cells: [
          { _key: 'c1', content: 'Audit Logs' },
          { _key: 'c2', content: '' },
          { _key: 'c3', content: '' },
          { _key: 'c4', content: 'check' },
        ],
      },
      {
        _key: 'r4',
        cells: [
          { _key: 'c1', content: 'Custom Roles' },
          { _key: 'c2', content: '' },
          { _key: 'c3', content: 'check' },
          { _key: 'c4', content: 'check' },
        ],
      },
      {
        _key: 'r5',
        cells: [
          { _key: 'c1', content: 'Priority Support' },
          { _key: 'c2', content: '' },
          { _key: 'c3', content: 'check' },
          { _key: 'c4', content: 'check' },
        ],
      },
      {
        _key: 'r6',
        cells: [
          { _key: 'c1', content: 'Compliance (SOC2)' },
          { _key: 'c2', content: '' },
          { _key: 'c3', content: '' },
          { _key: 'c4', content: 'check' },
        ],
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof RTCTable>

export const Default: Story = {}