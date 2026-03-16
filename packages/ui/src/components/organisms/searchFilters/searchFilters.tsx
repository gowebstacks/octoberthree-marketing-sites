"use client";

import { ReactNode } from "react";
import { Icon, Button } from "../../atoms";
import { Dropdown } from "../../molecules";

export type SearchSelect = {
  id: string;
  name?: string;
  placeholder?: string;
  value?: string | string[];
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
};

type SearchFiltersBarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  selects?: SearchSelect[];
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
};

export function SearchFilters({
  searchValue,
  searchPlaceholder = "Search…",
  onSearchChange,
  selects = [],
  actionLabel = "Search",
  onAction,
  onClose,
}: SearchFiltersBarProps) {
  return (
    <div className="border border-(--stroke-secondary) shadow-md bg-(--surface-background) p-4">
      <div className="flex flex-col gap-3 sm:gap-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Icon icon="search" className="h-4 w-4 text-(--icon-secondary)" />
            <input
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent outline-none text-lg text-(--text-body) placeholder:text-(--text-placeholder)"
            />
          </div>

          {onClose && (
            <button type="button" onClick={onClose} className="p-1">
              <Icon icon="x" strokeWidth={2.5} className="h-6 w-6 cursor-pointer" />
            </button>
          )}
        </div>

        <div className="sm:hidden">
          <Button size="sm" label={actionLabel} onClick={onAction} fullWidth />
        </div>

        <div className="hidden sm:flex justify-end">
          <Button size="sm" label={actionLabel} onClick={onAction} />
        </div>
      </div>

      {selects.length > 0 && (
        <div className="mt-4 grid grid-cols-1  lg:grid-cols-4 gap-4">
          {selects.map((select) => (
            <Dropdown
              key={select.id}
              label={select.name}
              value={select.value}
              options={select.options}
              multiple={select.multiple}
              placeholder={select.placeholder}
              onChange={(val) => select.onChange?.(val)}
            
            />
          ))}
        </div>
      )}
    </div>
  );
}

