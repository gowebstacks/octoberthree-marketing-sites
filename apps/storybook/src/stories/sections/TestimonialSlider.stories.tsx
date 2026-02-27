import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TestimonialSlider } from '@repo/ui'

const meta: Meta<typeof TestimonialSlider> = {
  title: 'Sections/TestimonialSlider',
  component: TestimonialSlider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TestimonialSlider>



const eyebrow = (text: string) => [
  {
    _uid: 'eyebrow-1',
    component: 'eyebrow',
    eyebrow: text,
    elementType: 'p',
  },
]

const testimonial = ({
  id,
  quote,
  name,
  role,
  logo,
  alt,
}: {
  id: number
  quote: string
  name: string
  role: string
  logo: string
  alt: string
}) => ({
  _uid: `testimonial-${id}`,
  quote,
  author: {
    name,
    role,
  },
  brandLogo: {
    filename: logo,
    alt,
  },
})


export const Default: Story = {
  args: {
    blok: {
      _uid: 'testimonial-slider',
      component: 'testimonial_slider',
      eyebrow: eyebrow('Client testimonials'),
      heading: 'Trusted by leading advisors, RIAs, and companies nationwide.',
      testimonials: [
        testimonial({
          id: 1,
          quote:
            'October Three felt like an extension of our internal team. The clarity, speed, and craftsmanship were outstanding.',
          name: 'Alex Morgan',
          role: 'VP of Digital Strategy · Shopify',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
          alt: 'Shopify',
        }),
        testimonial({
          id: 2,
          quote:
            'From kickoff to launch, everything was structured, transparent, and thoughtfully executed.',
          name: 'Priya Nair',
          role: 'Head of Product · Atlassian',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/8/8a/Atlassian_logo.svg',
          alt: 'Atlassian',
        }),
        testimonial({
          id: 3,
          quote:
            'The final result didn’t just look good — it performed. We saw immediate improvements across engagement metrics.',
          name: 'Daniel Ruiz',
          role: 'Director of Growth · Stripe',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/4/4c/Stripe_Logo%2C_revised_2016.svg',
          alt: 'Stripe',
        }),
        testimonial({
          id: 4,
          quote:
            'Their attention to detail and ability to simplify complex problems made a huge difference.',
          name: 'Emily Chen',
          role: 'Product Design Lead · Notion',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
          alt: 'Notion',
        }),
      ],
    } as any,
  },
}

export const TwoSlides: Story = {
  args: {
    blok: {
      _uid: 'testimonial-slider-2',
      component: 'testimonial_slider',
      eyebrow: eyebrow('What partners say'),
      heading: 'A few words from teams we’ve worked with',
      testimonials: [
        testimonial({
          id: 1,
          quote:
            'Clear communication, sharp execution, and a genuinely collaborative process.',
          name: 'Marcus Lee',
          role: 'Engineering Manager · GitHub',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          alt: 'GitHub',
        }),
        testimonial({
          id: 2,
          quote:
            'One of the smoothest vendor partnerships we’ve had in years.',
          name: 'Sofia Alvarez',
          role: 'Operations Lead · Airbnb',
          logo:
            'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
          alt: 'Airbnb',
        }),
      ],
    } as any,
  },
}

