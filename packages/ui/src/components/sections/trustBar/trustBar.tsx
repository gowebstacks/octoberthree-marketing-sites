"use client";

import type { FC } from "react";
import Marquee from "react-fast-marquee";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

import { CompanyLogo } from "./companyLogo";
import { TrustBarBlok } from "./types";

export const TrustBar: FC<{ blok: TrustBarBlok }> = ({ blok }) => {
  const { rows, variant = "static", title } = blok;

  if (!rows?.length) return null;

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-(--surface-background) section-padding-xl overflow-hidden"
    >
      {title && (
        <p
          className={"text-mono-lg font-medium text-(--text-headings) uppercase text-center mb-(--gaps-32-24-24)"}
        >
          {title}
        </p>
      )}

      {variant === "scroll" ? (
        <div className="flex flex-col gap-8">
          {rows.map((row, rowIndex) => (
            <Marquee
              key={row._uid}
              autoFill
              speed={20}
              direction={rowIndex % 2 === 1 ? "right" : "left"}
              gradient
              gradientWidth={120}
            >
              {row.companies?.map((company) => (
                <CompanyLogo key={company._uid} company={company} />
              ))}
            </Marquee>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {rows.map((row) => (
            <div
              key={row._uid}
              className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
            >
              {row.companies?.map((company) => (
                <CompanyLogo key={company._uid} company={company} />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
