"use client";

import type { FC } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "../../atoms";

export type BadgeProps = {
  label: string;
  variant?: "navy" | "cyan" | "yellow" | "teal" | "orange";
  onRemove?: () => void;
};

const variantStyles: Record<
  NonNullable<BadgeProps["variant"]>,
  string
> = {
  orange: `
    bg-[var(--color-orange-50)]
    text-[var(--color-orange-700---p-dark)]
  `,
  cyan: `
    bg-[var(--color-cyan-50)]
    text-[var(--color-cyan-800)]
  `,
  navy: `
    bg-[var(--color-navy-primary-50)]
    text-[var(--color-navy-primary-900---p)]
  `,
  yellow: `
    bg-[var(--color-yellow-50)]
    text-[var(--color-yellow-900)]
  `,
  teal: `
    bg-[var(--color-teal-50)]
    text-[var(--color-teal-800---p)]
  `,
};

export const Badge: FC<BadgeProps> = ({
  label,
  variant = "navy",
  onRemove,
}) => {
  return (
    <span
      className={twMerge(
        `
          inline-flex items-center gap-1
          rounded-sm
          px-2 py-0.5
          text-sm font-medium leading-6
          w-fit
        `,
        variantStyles[variant]
      )}
    >
      {label}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center"
        >
          <Icon icon="x" strokeWidth={2} className="h-5 w-5" />
        </button>
      )}
    </span>
  );
};