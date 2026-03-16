"use client";

import { twMerge } from "tailwind-merge";
import { Checkbox } from "../../atoms";

type DropdownSelectItemProps = {
  label: string;
  description?: string;
  selected?: boolean;
  multiple?: boolean;
  onSelect: () => void;
};

export function DropdownSelectItem({
  label,
  description,
  selected = false,
  multiple = false,
  onSelect,
}: DropdownSelectItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={twMerge(
        `
        flex cursor-pointer items-start gap-3 p-2 outline-none
        transition-colors
        hover:bg-(--surface-dropdown-hover)
        focus:bg-(--surface-secondary-background)
        `,
        selected && "bg-(--surface-dropdown-selected)"
      )}
    >
      {multiple && (
        <div className="mt-1 shrink-0">
          <Checkbox checked={selected} aria-hidden />
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-xs text-(--text-heading)">
          {label}
        </span>

        {description && (
          <span className="truncate text-2xs text-(--text-body)">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}