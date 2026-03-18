import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ResourceBentoCardDeck,
  ResourceBentoCardDeckBlok,
} from "@repo/ui";

const meta: Meta<typeof ResourceBentoCardDeck> = {
  title: "Sections/ResourceBentoCardDeck",
  component: ResourceBentoCardDeck,
  parameters: {
    layout: "padded",
  },

  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ResourceBentoCardDeck>;

const mockData: ResourceBentoCardDeckBlok = {
  _uid: "1f9bfd19-72a5-4738-85ba-38c0e21626ce",
  component: "resourceBentoCardDeck",

  content: [
    {
      _uid: "64e3ad35-2947-4e88-b444-f959dcf6faa2",
      component: "contentBlock",

      layout: "",

      ctaBar: [],

      eyebrow: [
        {
          _uid: "c800330f-fbe2-4b50-8fc5-6c969eae0dcc",
          eyebrow: "Eyebrow example",
          component: "eyebrow",
          elementType: "",
        },
      ],

      heading: [
        {
          _uid: "dc40d00c-f364-41db-ace7-bf49b245bcab",
          heading: "Where performance meets possibility",
          component: "heading",
          fontFamily: "display",
          elementType: "h2",
          headingSize: "4xl",
        },
      ],

      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: {
              textAlign: null,
            },
            content: [
              {
                text: "Every website should be built to evolve. From the first line of code to the final interaction, it’s a living product designed to adapt, scale, and drive growth over time.",
                type: "text",
              },
            ],
          },
        ],
      },
    },
  ] as any,

  resources: [
    {
      _uid: "594e39ea-f2a9-4ff3-87e6-b7196f8dffae",
      component: "resourceBentoCard",

      title: "Blog/Resource Title",
      slug: "",
      publishDate: "2026-03-23 00:00",
      resourceType: "pressRelease",

      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: {
              textAlign: null,
            },
            content: [
              {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur eleifend tortor.",
                type: "text",
              },
            ],
          },
        ],
      },

      featuredImage: {
        id: 151681123464615,
        alt: "",
        title: "shared image",
        filename:
          "https://a.storyblok.com/f/288727743104072/713x800/e274e2d7f0/shared-image.jpg",
        fieldtype: "asset",
      },
    },

    {
      _uid: "5c26fe4e-603c-44f8-9678-50c2513f7516",
      component: "resourceBentoCard",
      title: "Blog/Resource Title",
      slug: "",
      publishDate: "2026-03-23 00:00",
      resourceType: "pressRelease",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                type: "text",
              },
            ],
          },
        ],
      },
      featuredImage: {
        id: 151681123464615,
        alt: "",
        filename:
          "https://a.storyblok.com/f/288727743104072/713x800/e274e2d7f0/shared-image.jpg",
      },
    },

    {
      _uid: "28c1645b-2269-4255-a7e1-b4dddfbbd50a",
      component: "resourceBentoCard",
      title: "Blog/Resource Title",
      slug: "",
      publishDate: "2026-03-23 00:00",
      resourceType: "pressRelease",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                type: "text",
              },
            ],
          },
        ],
      },
      featuredImage: {
        id: 151681123464615,
        alt: "",
        filename:
          "https://a.storyblok.com/f/288727743104072/713x800/e274e2d7f0/shared-image.jpg",
      },
    },

    {
      _uid: "6801d995-6dd9-4517-9f2d-06e6474e802f",
      component: "resourceBentoCard",
      title: "Blog/Resource Title",
      slug: "",
      publishDate: "2026-03-23 00:00",
      resourceType: "pressRelease",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                type: "text",
              },
            ],
          },
        ],
      },
      featuredImage: {
        id: 151681123464615,
        alt: "",
        filename:
          "https://a.storyblok.com/f/288727743104072/713x800/e274e2d7f0/shared-image.jpg",
      },
    },
  ],
};

export const Default: Story = {
  args: mockData,
};

export const WithoutContentBlock: Story = {
  args: {
    ...mockData,
    content: [],
  },
};