import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, expect } from "@storybook/test";
import { Video } from "@repo/ui";

const meta: Meta<typeof Video> = {
  title: "Modules/Video",
  component: Video,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Video>;

const baseBlok = {
  component: "video",
  autoPlay: false,
};

const youtubeVideo = {
  videoType: "youtube",
  youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
  title: "Neural Networks Explained",
  thumbnail: {
    filename:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Educational video thumbnail",
  },
};

const wistiaVideo = {
  videoType: "wistia",
  wistiaUrl: "https://fast.wistia.net/embed/iframe/kdhsjzoap5",
  title: "Wistia Video",
  thumbnail: {
    filename:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    alt: "Video thumbnail",
  },
};

const selfHostedVideo = {
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
};

export const YouTube: Story = {
  args: {
    blok: {
      _uid: "video-youtube",
      ...baseBlok,
      ...youtubeVideo,
      thumbnail:{}
    }as any,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playArea = canvas.getByLabelText("Play video");
    await userEvent.click(playArea);

    const iframe = canvasElement.querySelector("iframe");
    await expect(iframe).toBeInTheDocument();
  } ,
};

export const Wistia: Story = {
  args: {
    blok: {
      _uid: "video-wistia",
      ...baseBlok,
      ...wistiaVideo,
    }as any,
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
      _uid: "video-self-hosted",
      ...baseBlok,
      ...selfHostedVideo,
    } as any,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playArea = canvas.getByLabelText("Play video");
    await userEvent.click(playArea);

    const video = canvasElement.querySelector("video");
    await expect(video).toBeInTheDocument();
  },
};

export const AutoPlayYouTube: Story = {
  args: {
    blok: {
      _uid: "video-autoplay",
      component: "video",
      autoPlay: true,
      ...youtubeVideo,
    } as any,
  },
};