"use client";

import type { FC } from "react";
import { twMerge } from "tailwind-merge";
import { storyblokEditable } from "@storyblok/react";
import { RichText } from "../../richText/richText";
import type { RichTextContent } from "../../../../types/storyblok";
import type { StoryblokAsset } from "../../../../lib";
import Image from "next/image";
import { storyblokLoader } from "../../../../utils/storyblokImageLoader";
import { Icon } from "../../../atoms";

export interface FeatureCardProps {
  _uid: string;
  icon?: string;
  heading?: string;
  body?: RichTextContent;
  theme?: "light" | "dark";
}

export const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  heading,
  body,
  theme = "light",
  ...blok
}) => {
  const isBodyEmpty =
    !body?.content ||
    body.content.every((node) => !node.content || node.content.length === 0);

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        "px-6 py-8",
        "group flex h-full flex-col rounded-sm ",
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="relative w-11 h-11 flex items-center justify-center rounded-sm bg-(--surface-accent-background)">
          <Icon color="white" icon={icon} size={20} />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4  h-full">
        {heading && (
          <h3 className="text-display-xl text-(--text-headings) pt-8 pb-4 border-b border-(--color-neutral-800)">
            {heading}
          </h3>
        )}


        {!isBodyEmpty && (
          <div className="text-(--text-body-dark)">
            <RichText
              doc={body}
              className="
                [&_p]:mb-0
                [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2
                [&_a]:text-(--text-accent) [&_a]:font-medium
                [&_a]:mt-4
                [&_strong]:font-semibold
                [&_em]:italic
                [&_u]:underline
              "
            />
          </div>
        )}
      </div>
    </div>
  );
};
