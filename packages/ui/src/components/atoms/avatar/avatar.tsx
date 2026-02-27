"use client";

import Image from "next/image";
import type { FC } from "react";
import { twMerge } from "tailwind-merge";

type AvatarProps = {
  src?: string;
  alt?: string;
  rounded?:boolean
};

// Simple avatar component with image fallback
export const Avatar: FC<AvatarProps> = ({ src, alt, rounded }) => {
  // Use first letter of alt or "?" as fallback
  const fallbackText = alt ? alt.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={
        twMerge(
          " flex h-12 w-12  items-center justify-center overflow-hidden  bg-(--surface-card text-(--text-body)",
          rounded ? 'rounded-full' : 'rounded-sm'
        )
      }
      role="img"
      aria-label={alt || "Avatar"}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          width={48}
          height={48}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-sm font-medium leading-none">{fallbackText}</span>
      )}
    </div>
  );
};