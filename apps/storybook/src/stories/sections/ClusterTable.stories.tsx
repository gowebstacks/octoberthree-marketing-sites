import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ClusterTable } from '@repo/ui'

const meta: Meta<typeof ClusterTable> = {
  title: 'Organisms/ClusterTable',
  component: ClusterTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClusterTable>

const columnsMock = [
  { _uid: 'col-0', label: 'Description' },
  { _uid: 'col-1', label: 'Placeholder' },
  { _uid: 'col-2', label: 'Placeholder' },
  { _uid: 'col-3', label: 'Placeholder' },
  { _uid: 'col-4', label: 'Placeholder' },
  { _uid: 'col-5', label: 'Placeholder' },
]

const sectionsMock = [
  {
    _uid: 'section-1',
    title: 'Section Heading 1',
    rows: [
      {
        _uid: 'row-1-1',
        label: 'Feature one',
        description: 'This is a Feature Description',
        values: [
          { _uid: 'val-1-1-1', type: 'check' },
          { _uid: 'val-1-1-2', type: 'check' },
          { _uid: 'val-1-1-3', type: 'check' },
          { _uid: 'val-1-1-4', type: 'check' },
          { _uid: 'val-1-1-5', type: 'check' },
        ],
      },
      {
        _uid: 'row-1-2',
        label: 'Feature two',
        description: 'This is a Feature Description',
        values: [
          { _uid: 'val-1-2-1', type: 'check' },
          { _uid: 'val-1-2-2', type: 'check' },
          { _uid: 'val-1-2-3', type: 'check' },
          { _uid: 'val-1-2-4', type: 'check' },
          { _uid: 'val-1-2-5', type: 'check' },
        ],
      },
    ],
  },
  {
    _uid: 'section-2',
    title: 'Section Heading 2',
    rows: [
      {
        _uid: 'row-2-1',
        label: 'Feature three',
        description: 'This is a Feature Description',
        values: [
          { _uid: 'val-2-1-1', type: 'check' },
          { _uid: 'val-2-1-2', type: 'check' },
          { _uid: 'val-2-1-3', type: 'check' },
          { _uid: 'val-2-1-4', type: 'check' },
          { _uid: 'val-2-1-5', type: 'check' },
        ],
      },
    ],
  },
  {
    _uid: 'section-3',
    title: 'Section Heading 3',
    rows: [
      {
        _uid: 'row-3-1',
        label: 'Feature four',
        description: 'This is a Feature Description',
        values: [
          { _uid: 'val-3-1-1', type: 'check' },
          { _uid: 'val-3-1-2', type: 'check' },
          { _uid: 'val-3-1-3', type: 'check' },
          { _uid: 'val-3-1-4', type: 'check' },
          { _uid: 'val-3-1-5', type: 'check' },
        ],
      },
    ],
  },
]

export const Default: Story = {
  args: {
    blok: {
      _uid: 'cluster-table',
      component: 'cluster_table',
      columns: columnsMock,
      sections: sectionsMock,
    } as any,
  },
}