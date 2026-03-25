"use client";

import type { FC } from "react";
import { Avatar, Badge } from "../../atoms";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { StoryblokAsset } from "../../../lib";

export interface AttributionBlok extends SbBlokData {
  name: string;
  avatar?: StoryblokAsset;
  role?: string;
  variant?: "navy" | "cyan" | "yellow" | "teal" | "orange";
}

interface AttributionProps {
  blok?: AttributionBlok;
  name?: string;
  avatar?: string;
  role?: string;
  showAvatar?: boolean;
  rounded?: boolean;
  variant?: AttributionBlok["variant"];
}

export const Attribution: FC<AttributionProps> = ({
  blok,
  name,
  avatar,
  role,
  variant ='navy',
  showAvatar = true,
  rounded,
}) => {
  const actualName = name || blok?.name;

  const actualAvatar =
    avatar ||
    blok?.avatar?.filename ||
    undefined;

  const actualRole = role || blok?.role;
  const actualVariant = variant || blok?.variant;

  if (!actualName) return null;

  return (
    <div
      {...(blok ? storyblokEditable(blok) : {})}
      className="inline-flex items-center gap-1.5 lg:gap-3"
    >
      {showAvatar && actualAvatar && (
        <Avatar src={actualAvatar} alt={actualName} rounded={rounded} />
      )}

      <div className="flex flex-col items-start gap-1">
        <div className="font-normal text-[16px] leading-6 lg:text-[18px] lg:leading-7 text-(--text-headings)">
          {actualName}
        </div>

        {actualRole && actualVariant && (
          <div className="[&_span]:text-[12px] [&_span]:leading-4.5 lg:[&_span]:text-[14px] lg:[&_span]:leading-6">
            <Badge label={actualRole} variant={actualVariant} />
          </div>
        )}
      </div>
    </div>
  );
};