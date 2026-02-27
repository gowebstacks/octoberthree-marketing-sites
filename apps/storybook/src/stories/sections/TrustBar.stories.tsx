import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { TrustBar } from '@repo/ui';

const LOGO_URL =
  'https://a.storyblok.com/f/288727743104072/444x114/1af357c499/rlc_direct_logo_name.png?cv=1768323044252';

const mockCompany = (id: string) => ({
  _uid: `company-${id}`,
  component: 'company',
  name: 'RLC Direct',
  website: 'https://example.com',
  logoOnLight: {
    filename: LOGO_URL,
    alt: 'RLC Direct logo',
  },
});

const mockRows = [
  {
    _uid: 'row-1',
    component: 'trustBarRow',
    companies: [
      mockCompany('1'),
      mockCompany('2'),
      mockCompany('3'),
      mockCompany('4'),
      mockCompany('5'),
      mockCompany('6'),
      mockCompany('7'),
    ],
  },
  {
    _uid: 'row-2',
    component: 'trustBarRow',
    companies: [
      mockCompany('8'),
      mockCompany('9'),
      mockCompany('10'),
      mockCompany('11'),
      mockCompany('12'),
      mockCompany('13'),
      mockCompany('14'),
    ],
  },
];

const mocktitle ='Trusted by the best on the web'

const meta: Meta<typeof TrustBar> = {
  title: 'Sections/TrustBar',
  component: TrustBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    blok: {
      control: false,
      table: { category: 'Storyblok' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrustBar>;

const basePlay: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const images = canvas.getAllByRole('img');
  await expect(images.length).toBeGreaterThan(0);
};

export const Static: Story = {
  args: {
    blok: {
      _uid: 'trustbar-static',
      component: 'trustBar',
      variant: 'static',
      title: mocktitle,
      rows: mockRows,
    },
  },
  play: basePlay,
};

export const Scroll: Story = {
  args: {
    blok: {
      _uid: 'trustbar-scroll',
      component: 'trustBar',
      variant: 'scroll',
      title: mocktitle,
      rows: mockRows,
    },
  },
};