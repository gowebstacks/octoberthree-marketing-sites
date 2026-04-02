"use client";

import { FC } from "react";
import { SbBlokData, storyblokEditable } from "@storyblok/react";

export interface StattisticBlok extends SbBlokData {
  prefix?: string;
  value: string;
  suffix?: string;
  description?: string;
}

interface StatisticProps {
  blok: StattisticBlok;
}

export const Statistic: FC<StatisticProps> = ({ blok }) => {
  const { prefix, value, suffix, description } = blok;

  return (
    <div
      {...storyblokEditable(blok)}
      className="flex flex-col items-start gap-2 w-full"
    >
      <div className="flex items-baseline gap-1 text-accent">
        {prefix && (
          <span className="text-display-xl text-(--text-nested-stat)">
            {prefix}
          </span>
        )}

        <span className="text-display-xl text-(--text-nested-stat)">
          {value}
        </span>

        {suffix && (
          <span className="text-display-xl text-(--text-nested-stat)">
            {suffix}
          </span>
        )}
      </div>

      {description && (
        <p className="text-mono-sm uppercase font-medium tracking-wide text-(--text-headings)">
          {description}
        </p>
      )}
    </div>
  );
};