import type { FC } from "react";

import { getLinkData, Link, LinkFragment } from "../../../atoms/link";
import { RichTextContent } from "../../../../types/storyblok";
import { twMerge } from "tailwind-merge";
import { RichText } from "../../richText/richText";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
import Button from "../../../atoms/button";

interface StoryblokImage {
  id: string;
  filename: string;
  alt?: string;
}

export interface ImageTextCardProps extends SbBlokData {
  _key: string;
  image?: StoryblokImage;
  heading?: string;
  body?: RichTextContent;
  link?: LinkFragment;
  button?: any[];
  theme?: "light" | "dark";
  isActive?: boolean;
}

export const ImageTextCard: FC<ImageTextCardProps> = ({
  image,
  heading,
  body,
  link,
  button,
  isActive = false,
  ...blok
}) => {
  const url = getLinkData(link);
  const linkData = link as any;
  const hasLink = (link && linkData.label && url !== "") || button?.length;

  const CardContent = (
    <div className="relative h-107.5 w-full overflow-hidden">
      {image && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-500"
          style={{ backgroundImage: `url(${image.filename})` }}
        />
      )}

      <div className="absolute bottom-0 flex w-full flex-col justify-end bg-(--color-navy-primary-900---p) p-(--padding-24-18-18)">
        {heading && (
          <span
            className={twMerge(
              "text-display-2xl text-(--color-base-white)! transition-colors duration-300 block"
            )}
          >
            {heading}
          </span>
        )}

        <div
          className={twMerge(
            "grid transition-[grid-template-rows] duration-500 ease-in-out",
            isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div
            className={twMerge(
              "overflow-hidden ",
              isActive ? "opacity-100" : "opacity-0 "
            )}
          >
            <div className="overflow-hidden min-w-0">
              {body && (
                <div className="pt-4">
                  <RichText
                    doc={body}
                    className="text-lg text-(--color-base-white)!"
                  />
                </div>
              )}
            </div>
          </div>
         {button?.[0] && (
          <div className="mt-8">
            <Button {...button[0]} mode="link" background="dark"/>
          </div>
        )}
        </div>
      </div>
    </div>
  );

  const wrapperClasses =
    "group block w-full transition-all duration-1000 ease-in-out rounded-sm overflow-hidden";

  if (hasLink) {
    return (
      <Link href={link} className={wrapperClasses} {...storyblokEditable(blok)}>
        <div className="flex h-full cursor-pointer flex-col transition-shadow duration-1000 hover:shadow-lg">
          {CardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className={wrapperClasses} {...storyblokEditable(blok)}>
      <div className="flex h-full flex-col">{CardContent}</div>
    </div>
  );
};
