import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, expect } from "@storybook/test";
import { Video } from "@repo/ui";

const meta: Meta<typeof Video> = {
  title: "Modules/Video",
  component: Video,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Video>;

const baseBlok = {
  _uid: "video-base",
  component: "video",
  autoPlay: false,
};

export const YouTube: Story = {
  args: {
    blok: {
      ...baseBlok,
      _uid: "video-youtube",
      videoType: "youtube",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "YouTube Video",
      thumbnail: {
        filename:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        alt: "Video thumbnail",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playArea = canvas.getByLabelText("Play video");
    await userEvent.click(playArea);

    const iframe = canvasElement.querySelector("iframe");

    await expect(iframe).toBeInTheDocument();
  },
};

export const Wistia: Story = {
  args: {
    blok: {
      ...baseBlok,
      _uid: "video-wistia",
      videoType: "wistia",
      wistiaUrl: "https://fast.wistia.net/embed/iframe/kdhsjzoap5",
      title: "Wistia Video",
      thumbnail: {
        filename:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        alt: "Video thumbnail",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playArea = canvas.getByLabelText("Play video");
    await userEvent.click(playArea);

    const iframe = canvasElement.querySelector("iframe");

    await expect(iframe).toBeInTheDocument();
  },
};

export const SelfHosted: Story = {
  args: {
    blok: {
      ...baseBlok,
      _uid: "video-self-hosted",
      videoType: "selfHosted",
      title: "Self Hosted Video",
      videoFile: {
        filename: "https://www.w3schools.com/html/mov_bbb.mp4",
        alt: "Sample video",
      },
      thumbnail: {
        filename:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "Video thumbnail",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playArea = canvas.getByLabelText("Play video");
    await userEvent.click(playArea);

    const video = canvasElement.querySelector("video");

    await expect(video).toBeInTheDocument();
  },
};