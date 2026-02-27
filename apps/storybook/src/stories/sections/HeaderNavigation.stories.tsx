import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeaderNavigation } from '@repo/ui'
import type { HeaderNavigationProps } from '@repo/ui'


const headerNavigationMock: HeaderNavigationProps['headerNavigation'] = {
  component: 'globalNavigation',
  announcementIcon: 'megaphone',
  announcementTheme: 'success',
  announcementLink: [
    {
      component: 'button',
      label: 'Learn More',
      linkType: 'internal',
      internalLink: {
        id: '12345',
        url: '/summer-sale',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: 'summer-sale',
      },
      externalUrl: '',
      openInNewTab: false,
    },
  ],

  menuItems: [
    {
      _uid: 'menu-001',
      component: 'navigationMenuItem',
      label: 'Products',
      link: {
        component: 'link',
        label: 'View All Products',
        linkType: 'internal',
        internalLink: {
          id: 'prod-001',
          _uid: 'page-products',
          name: 'Products',
          slug: 'products',
          component: 'page',
        },
        externalUrl: '',
        openInNewTab: false,
      },

      menuSection: [
        {
          _uid: 'section-product',
          component: 'navigationMenuSection',
          title: 'OUR PRODUCT',
          items: [
            {
              _uid: 'product-about',
              component: 'navigationInnerItem',
              icon: 'square',
              label: 'About the Product',
              link: {
                component: 'link',
                label: 'About the Product',
                linkType: 'internal',
                internalLink: {
                  id: 'about-product',
                  _uid: 'page-about-product',
                  name: 'About the Product',
                  slug: 'about-product',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
            {
              _uid: 'product-changelog',
              component: 'navigationInnerItem',
              icon: 'refresh',
              label: 'Changelog',
              link: {
                component: 'link',
                label: 'Changelog',
                linkType: 'internal',
                internalLink: {
                  id: 'changelog',
                  _uid: 'page-changelog',
                  name: 'Changelog',
                  slug: 'changelog',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
            {
              _uid: 'product-demo',
              component: 'navigationInnerItem',
              icon: 'calendar',
              label: 'Monthly Demo',
              link: {
                component: 'link',
                label: 'Monthly Demo',
                linkType: 'internal',
                internalLink: {
                  id: 'monthly-demo',
                  _uid: 'page-monthly-demo',
                  name: 'Monthly Demo',
                  slug: 'monthly-demo',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
          ],
        },

        {
          _uid: 'section-integrations',
          component: 'navigationMenuSection',
          title: 'INTEGRATIONS',
          items: [
            {
              _uid: 'integration-kafka',
              component: 'navigationInnerItem',
              label: 'Kafka',
              link: {
                component: 'link',
                label: 'Kafka',
                linkType: 'internal',
                internalLink: {
                  id: 'kafka',
                  _uid: 'page-kafka',
                  name: 'Kafka',
                  slug: 'integrations/kafka',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
            {
              _uid: 'integration-postgres',
              component: 'navigationInnerItem',
              label: 'PostgreSQL',
              link: {
                component: 'link',
                label: 'PostgreSQL',
                linkType: 'internal',
                internalLink: {
                  id: 'postgresql',
                  _uid: 'page-postgresql',
                  name: 'PostgreSQL',
                  slug: 'integrations/postgresql',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
            {
              _uid: 'integration-dbt',
              component: 'navigationInnerItem',
              label: 'dbt',
              link: {
                component: 'link',
                label: 'dbt',
                linkType: 'internal',
                internalLink: {
                  id: 'dbt',
                  _uid: 'page-dbt',
                  name: 'dbt',
                  slug: 'integrations/dbt',
                  component: 'page',
                },
                externalUrl: '',
                openInNewTab: false,
              },
            },
          ],
         ctaLink : {
              component: 'link',
              label: 'View All Integrations',
              linkType: 'internal',
              internalLink: {
                id: 'integrations',
                _uid: 'page-integrations',
                name: 'Integrations',
                slug: 'integrations',
                component: 'page',
              },
              externalUrl: '',
              openInNewTab: false,
            },
        },
      ],

      spotlightCard: {
        _uid: 'spotlight-001',
        component: 'navigationSpotlightCard',
        heading: {
          heading: {
            _type: 'heading',
            fontFamily: 'sans-serif',
            elementType: 'h3',
            headingSize: 'medium',
          },
          body: [
            {
              _uid: 'text-001',
              component: 'text',
              text: 'Featured Course: React Masterclass',
            },
          ],
        },
      },
    },

    {
      _uid: 'menu-002',
      component: 'navigationMenuItem',
      label: 'Resources',
      link: {
        component: 'link',
        label: 'All Resources',
        linkType: 'internal',
        internalLink: {
          id: 'res-001',
          _uid: 'page-resources',
          name: 'Resources',
          slug: 'resources',
          component: 'page',
        },
        externalUrl: '',
        openInNewTab: false,
      },
    },

    {
      _uid: 'menu-003',
      component: 'navigationMenuItem',
      label: 'Company',
      link: {
        component: 'link',
        label: 'About Us',
        linkType: 'internal',
        internalLink: {
          id: 'about-001',
          _uid: 'page-about',
          name: 'About',
          slug: 'about',
          component: 'page',
        },
        externalUrl: '',
        openInNewTab: false,
      },
    },

    {
      _uid: 'menu-004',
      component: 'navigationMenuItem',
      label: 'Contact',
      link: {
        component: 'link',
        label: 'Contact Us',
        linkType: 'internal',
        internalLink: {
          id: 'contact-001',
          _uid: 'page-contact',
          name: 'Contact',
          slug: 'contact',
          component: 'page',
        },
        externalUrl: '',
        openInNewTab: false,
      },
    },
  ],

  ctaBar: [
    {
      component: 'ctaBar',
      buttons: [
        {
          component: 'button',
          label: 'Sign In',
          linkType: 'internal',
          internalLink: {
            id: 'auth-001',
            url: '/signin',
            linktype: 'story',
            fieldtype: 'multilink',
            cached_url: 'signin',
          },
          externalUrl: '',
          openInNewTab: false,
        },
      ],
    },
  ],
}

const meta: Meta<typeof HeaderNavigation> = {
  title: 'Sections/HeaderNavigation',
  component: HeaderNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div>
        <main>
          <Story />
          <section style={{ height: 400 }} />
        </main>
      </div>
    ),
  ],
  argTypes: {
    headerNavigation: {
      control: false,
      table: {
        type: {
          summary: 'StoryblokGlobalNavigation',
        },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeaderNavigation>

export const Navigation: Story = {
  args: {
    headerNavigation: { ...headerNavigationMock, announcement: undefined },
  },
}

export const WithAnnouncementBar: Story = {
  args: {
    headerNavigation: headerNavigationMock,
  },
}

export const NavigationWithoutCTA: Story = {
  args: {
    headerNavigation: {
      ...headerNavigationMock,
      ctaBar: [],
    },
  },
}

