"use client";

import * as Popover from "@radix-ui/react-popover";
import { useMemo, useState } from "react";
import { InputField } from "../inputField";
import { DropdownSelect } from "./dropdownSelect";
import { DropdownSelectItem } from "./dropdownSelectItem";

type DropdownOption = {
  value: string;
  label: string;
  description?: string;
};

type DropdownProps = {
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  value?: string | string[];
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
};

export function Dropdown({
  label,
  hint,
  error,
  disabled,
  multiple,
  value,
  options,
  placeholder = "Select option",
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isSelected = (val: string) =>
    multiple ? Array.isArray(value) && value.includes(val) : value === val;

  const handleSelect = (val: string) => {
    if (!multiple) {
      onChange(val);

      const selected = options.find((o) => o.value === val);
      setSearch(selected?.label ?? "");
      setOpen(false);
      setIsFocused(false);
      return;
    }

    const current = Array.isArray(value) ? value : [];

    onChange(
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );

    setSearch("");
  };

  const filteredOptions = useMemo(() => {
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedLabels = Array.isArray(value)
    ? options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label)
        .join(", ")
    : "";

  const selectedSingleLabel =
    typeof value === "string"
      ? options.find((o) => o.value === value)?.label ?? ""
      : "";

  const displayValue = multiple
    ? isFocused
      ? search
      : selectedLabels
    : isFocused
      ? search
      : selectedSingleLabel;

  return (
    <div className="relative">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div onClick={() => setOpen(true)}>
            <InputField
              label={label}
              hint={hint}
              error={error}
              disabled={disabled}
              variant="select"
              value={displayValue}
              placeholder={placeholder}
              aria-haspopup="listbox"
              onFocus={() => {
                setOpen(true);
                setIsFocused(true);

                if (multiple) {
                  setSearch("");
                }
              }}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setOpen(false);
                  setIsFocused(false);
                  setSearch("");
                }, 150);
              }}
            />
          </div>
        </Popover.Anchor>

        <DropdownSelect>
          {filteredOptions.map((option) => (
            <DropdownSelectItem
              key={option.value}
              label={option.label}
              description={option.description}
              multiple={multiple}
              selected={isSelected(option.value)}
              onSelect={() => handleSelect(option.value)}
            />
          ))}

          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-(--text-body)">
              No results found
            </div>
          )}
        </DropdownSelect>
      </Popover.Root>
    </div>
  );
}