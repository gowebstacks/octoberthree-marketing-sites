import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "@storybook/test"
import { IconTextCard } from "@repo/ui"

const meta: Meta<typeof IconTextCard> = {
  title: "Molecules/Cards/IconTextCard",
  component: IconTextCard,
  tags: ["autodocs"],

  argTypes: {
    icon: {
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    heading: {
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    body: {
      control: false,
      table: {
        type: { summary: "Storyblok RichText" },
      },
    },
    button: {
      control: false,
      table: {
        type: { summary: "Storyblok button block[]" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      table: {
        type: { summary: "'light' | 'dark'" },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof IconTextCard>

const mockBody = {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "A design system creates order out of complexity. It ensures every component—from buttons to banners—works together seamlessly and reflects a unified brand language.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Includes:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "ordered_list",
            "attrs": {
              "order": 1
            },
            "content": [
              {
                "type": "list_item",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Lorem ipsum dolor sit amet, consectetur",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "list_item",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Lorem ipsum dolor sit amet, consectetur",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "list_item",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Lorem ipsum dolor sit amet, consectetur",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "list_item",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Lorem ipsum dolor sit amet, consectetur",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]}



export const WithIconOnly: Story = {
  args: {
    _key: "icon-text-card-icon",
    icon: {
      filename : 'https://a.storyblok.com/f/288727743104072/180x225/09bc726e77/icon_rocket.png'
    },
    heading: "Building Consistency Into Every Website Experience",
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText("Building Consistency Into Every Website Experience")).toBeInTheDocument()

    const img = canvasElement.querySelector("img")
    await expect(img).toBeInTheDocument()

    await expect(canvasElement.querySelector("button")).toBeNull()
  },
}
export const WithBody: Story = {
  args: {
    _key: "icon-text-card-body",
    icon: {
      filename : 'https://a.storyblok.com/f/288727743104072/180x225/09bc726e77/icon_rocket.png'
    },
    heading: "Building Consistency Into Every Website Experience",
    body: mockBody as any,
  }as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
canvas.getByText(/A design system creates order out of complexity/i)    ).toBeInTheDocument()
  
  },
}

export const WithButton: Story = {
  args: {
    _key: "icon-text-card-button",
    icon: {
      filename : 'https://a.storyblok.com/f/288727743104072/180x225/09bc726e77/icon_rocket.png'
    },
    heading: "Building Consistency Into Every Website Experience",
    body: mockBody as any,
    button: [
      {
        label: "Get Started",
        trailingIcon: "arrow-right",
      },
     
    ],
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText("Get Started")
    ).toBeInTheDocument()

    const button = canvas.getByRole("button", {
      name: "Get Started",
    })
    await expect(button).toBeInTheDocument()

    const card = canvasElement.firstElementChild as HTMLElement
    await expect(card.className).toContain("group")
  },
}

