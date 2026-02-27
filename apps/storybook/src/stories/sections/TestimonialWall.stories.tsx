import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TestimonialWall } from '@repo/ui'

const meta: Meta<typeof TestimonialWall> = {
  title: 'Organisms/TestimonialWall',
  component: TestimonialWall,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TestimonialWall>

const testimonial = (id: number) => ({
  _uid: `testimonial-${id}`,
  component: 'testimonial',
  quote:
    'Working with Webstacks completely changed how we approach our website. They helped us move faster, experiment more, and treat our site like a product that can grow with our business. It never feels transactional—the collaboration is seamless, and the results speak for themselves.',
  author: {
    name: 'Savannah Leonardo',
    avatarSrc: 'https://i.pravatar.cc/80?img=32',
    role: {
      label: 'Co-founder, CTO',
      variant: 'orange',
    },
  },
  brandLogo: {
    filename:
      'https://i.pinimg.com/originals/ea/47/61/ea4761a0acdd855885130e6b129d90a4.png',
    alt: 'Upwork',
  },
})

const ctaBarMock = [
  {
    _uid: 'cta-bar-1',
    component: 'cta_bar',
    type: 'button',
    buttons: [
      {
        _uid: 'btn-1',
        label: 'View more customer stories',
        href: '#',
        target: '_self',
      },
    ],
  },
]

export const Default: Story = {
  args: {
    blok: {
      _uid: 'testimonial-wall',
      component: 'testimonial_wall',
      rows: 3,
      testimonials: [
        testimonial(1),
        testimonial(2),
        testimonial(3),
        testimonial(4),
        testimonial(5),
        testimonial(6),
        testimonial(7),
        testimonial(8),
        testimonial(9),
      ],
      ctaBar: ctaBarMock,
    } as any,
  },
}

export const TwoRows: Story = {
  args: {
    blok: {
      _uid: 'testimonial-wall-two-rows',
      component: 'testimonial_wall',
      rows: 2,
      testimonials: [
        testimonial(1),
        testimonial(2),
        testimonial(3),
        testimonial(4),
        testimonial(5),
      ],
      ctaBar: ctaBarMock,
    } as any,
  },
}

