import type { FC } from "react";

import { getLinkData, Link, LinkFragment } from "../../../atoms/link";
import { RichTextContent } from "../../../../types/storyblok";
import { twMerge } from "tailwind-merge";
import { RichText } from "../../richText/richText";

interface StoryblokImage {
  id: string;
  filename: string;
  alt?: string;
}

export interface ImageTextCardProps {
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
  isActive = false,
}) => {
  const url = getLinkData(link);
  const linkData = link as any;
  const hasLink = link && linkData.label && url !== "";

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
              "overflow-hidden transition-opacity",
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
        </div>
      </div>
    </div>
  );

  const wrapperClasses =
    "group block w-full transition-all duration-1000 ease-in-out rounded-sm overflow-hidden";

  if (hasLink) {
    return (
      <Link href={link} className={wrapperClasses}>
        <div className="flex h-full cursor-pointer flex-col transition-shadow duration-1000 hover:shadow-lg">
          {CardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div className="flex h-full flex-col">{CardContent}</div>
    </div>
  );
};
