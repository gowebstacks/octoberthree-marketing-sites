"use client";

import type { FC } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import Button from "../../../atoms/button";
import { StoryblokAsset } from "../../../../types/storyblok";

export interface CardItemBlok extends SbBlokData {
  icon?: StoryblokAsset;
  title: string;
  description?: string;
  linkLabel?: string;
  link?: any;
}

interface CardItemProps {
  blok: CardItemBlok;
}

export const CardItem: FC<CardItemProps> = ({ blok }) => {
  const { icon, title, description, linkLabel, link } = blok;

  return (
    <div {...storyblokEditable(blok)} className="flex flex-col gap-4">
      {icon?.filename && (
        <div className="h-11 w-11 rounded-sm bg-(--surface-accent-background) grid place-items-center">
          <img
            src={icon.filename}
            alt={icon.alt || title}
            className="h-6 w-6 object-contain brightness-0 invert"
          />
        </div>
      )}

      <h3 className="text-(--text-headings) text-lg font-medium">{title}</h3>

      {description && (
        <div className="text-(--text-body-dark)">{description}</div>
      )}

      {linkLabel && link && (
        <Button label={linkLabel} link={link} mode="link" className="w-fit" />
      )}
    </div>
  );
};
