import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TableOfContents } from '@repo/ui';
import { within, userEvent, expect, waitFor } from '@storybook/test';

const mockBody = Array.from({ length: 10 }).map((_, index) => ({
  _key: `section-${index}`,
  _type: 'block',
  style: 'h2',
  children: [{ _type: 'span', text: `Section ${index + 1}` }],
}));

const mockTOC = [
  {
    key: 'intro',
    title: 'Intro',
    originalTitle: 'Section 1',
    level: 2,
    sectionId: 'toc-section-1',
    hidden: false,
    order: 0,
  },
  {
    key: 'advanced',
    title: 'Advanced',
    originalTitle: 'Section 2',
    level: 2,
    sectionId: 'toc-section-2',
    hidden: false,
    order: 1,
  },
];

const MockBody =  {
            "type": "doc",
            "content": [
              {
                "type": "heading",
                "attrs": {
                  "level": 2,
                  "textAlign": null
                },
                "content": [
                  {
                    "text": "this is h2",
                    "type": "text"
                  }
                ]
              },
              {
                "type": "paragraph",
                "attrs": {
                  "textAlign": null
                },
                "content": [
                  {
                    "text": "this is just section",
                    "type": "text"
                  }
                ]
              },
              {
                "type": "heading",
                "attrs": {
                  "level": 2,
                  "textAlign": null
                },
                "content": [
                  {
                    "text": "this is h2 again ",
                    "type": "text"
                  }
                ]
              },
              {
                "type": "paragraph",
                "attrs": {
                  "textAlign": null
                },
                "content": [
                  {
                    "text": "this is its section",
                    "type": "text"
                  }
                ]
              }]}

const meta: Meta<typeof TableOfContents> = {
  title: 'Organisms/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    article: {
      control: false,
      table: {
        type: {
          summary: `{ body: Block[]; tableOfContents?: TOCItem[] }`,
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

export const BuildsFromBodyContent: Story = {
  args: {
    label: 'Table of contents',
    article: {
      body: MockBody,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Section 1')).toBeInTheDocument();
    expect(canvas.getByText('Section 5')).toBeInTheDocument();
    expect(canvas.getByText('Section 10')).toBeInTheDocument();
  },
};

export const UsesProvidedTableOfContents: Story = {
  args: {
    article: {
      body: mockBody,
      tableOfContents: mockTOC,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Intro')).toBeInTheDocument();
    expect(canvas.getByText('Advanced')).toBeInTheDocument();
    expect(canvas.queryByText('Section 3')).not.toBeInTheDocument();
  },
};

export const ExcludesHiddenItems: Story = {
  args: {
    article: {
      body: mockBody,
      tableOfContents: [
        { ...mockTOC[0], hidden: true },
        mockTOC[1],
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Intro')).not.toBeInTheDocument();
    expect(canvas.getByText('Advanced')).toBeInTheDocument();
  },
};

export const UpdatesActiveItemOnClick: Story = {
  args: {
    article: {
      body: mockBody,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByText('Section 3');
    await userEvent.click(item);
    await waitFor(() => {
      expect(item).toHaveAttribute('aria-current', 'location');
    });
  },
};




