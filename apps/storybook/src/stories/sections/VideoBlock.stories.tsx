import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoBlock } from "@repo/ui";
import { within, expect, userEvent } from "@storybook/test";

const meta: Meta<typeof VideoBlock> = {
  title: "Sections/VideoBlock",
  component: VideoBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof VideoBlock>;

const baseBlok = {
  _uid: "video-block-1",
  component: "video_block",
  size: "full",
  autoPlay: false,
} as any;

export const YouTube: Story = {
  args: {
    blok: {
      ...baseBlok,
      size: "large",
      video: [
        {
          _uid: "youtube-video",
          component: "video",
          videoType: "youtube",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "YouTube video",
        },
      ],
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
      size: "medium",
      video: [
        {
          _uid: "wistia-video",
          component: "video",
          videoType: "wistia",
          wistiaUrl: "https://fast.wistia.net/embed/iframe/kdhsjzoap5",
          title: "Wistia video",
        },
      ],
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
      size: "small",
      video: [
        {
          _uid: "self-hosted-video",
          component: "video",
          videoType: "selfHosted",
          title: "Self hosted video",
          videoFile: {
            filename: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        },
      ],
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