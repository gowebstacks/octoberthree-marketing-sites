"use client";

import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { Badge, Heading, Icon, Link } from "../../../atoms";
import Image from "next/image";
import { StoryblokAsset } from "../../../../lib";
import { storyblokLoader } from "../../../../utils/storyblokImageLoader";

export interface AuthorSocial extends SbBlokData {
  component?: "authorSocial";
  type: "twitter" | "linkedin" | "discord";
  href: string;
}

export interface AuthorCardProps extends SbBlokData {
  component?: "authorCard";
  name: string;
  company?: string;
  bio: string;
  location: string;
  headshotImage: StoryblokAsset;
  socials?: AuthorSocial[];
  variant : 'bioInside' | 'bioOutside'

}

export const AuthorCard: FC<{ blok: AuthorCardProps }> = ({ blok }) => {
  const { name, company, bio, location, socials = [],headshotImage,variant = 'bioInside'} = blok;
console.log(blok, "test")
  return (
    <div>
      <div
      {...storyblokEditable(blok)}
      className="
        w-full border border-(--stroke-secondary)
        bg-(--color-neutral-50----p-background)
        p-(--gaps-24-18-18)
        rounded-sm
      "
    >
      <div className="flex gap-(--gaps-32-24-24) items-center">
        {headshotImage.filename && (
          <div>
            <Image loader={storyblokLoader} src={headshotImage.filename} height={240} width={240} alt={name + " headshot"}/>
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col">
            <Heading
              heading={name}
              headingSize="2xl"
              className="text-display-2xl text-(--text-headings)"
            />

            <div className="flex gap-4 items-center">
              {company && (
                <span className="text-lg tracking-wide text-(--text-body-dark)">
                  {company}
                </span>
              )}
              {location && <Badge variant="cyan" label={location} />}
            </div>
          </div>

        {
          variant !== 'bioOutside' &&
            <p className="mt-4  text-rich-body  text-(--text-body-dark)">
            {bio}
            bcsdbcdhjwbdjdhszbjkweb
          </p>
        }

          {socials.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social._uid}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                p-2.5
                flex items-center justify-center rounded-sm
                border border-(--icon-contained-icon)
                bg-(--surface-background)
                text-(--icon-contained-icon)
                transition-colors
                cursor-pointer
              "
                  aria-label={social.type}
                >
                  <Icon strokeWidth={0.1} icon={social.type} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {
      variant === 'bioOutside' && 
        <p className="mt-8  text-rich-body  text-(--text-body-dark)">
            {bio}
          </p>
      
    }
    </div>
  );
};
