"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../icon";

type CheckboxProps = {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  labelClassName?: string;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: {
    checkbox: "h-4 w-4",
    icon: "h-2.25 w-[10px]",
        indeterminate: "h-[1.05px] w-2.5",
    iconPosition: "left-0.75",
    label: "text-[length:var(--text-jumper-text-class-mono-xs)]",
  },
  md: {
    checkbox: "h-5 w-5",
    icon: "h-3 w-3",
    indeterminate: "h-[1.35px] w-[13px]",
    iconPosition: "left-1",
    label: "text-[length:var(--text-jumper-text-class-mono-sm)]",
  }
};

const baseClasses = {
  checkbox: "appearance-none border accent-(--surface-card)",
  icon: "absolute top-1/2 -translate-y-1/2 pointer-events-none",
  indeterminate: "absolute top-1/2 -translate-y-1/2 pointer-events-none rounded-full",
  label: "transition-colors duration-150",
  container: "relative flex items-center gap-2",
};

export const Checkbox = ({
  checked: controlledChecked,
  disabled = false,
  error = false,
  indeterminate = false,
  onChange,
  className = "",
  id,
  name,
  value,
  label,
  labelClassName = "",
  size = "sm",
}: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = () => {
    if (disabled) return;
    const newChecked = !checked;
    if (!isControlled) setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const state = {
    disabled,
    error,
    checked,
    indeterminate
  };

  const getCheckboxClasses = () => {
    const { disabled, error, checked, indeterminate } = state;
    let classes = `${baseClasses.checkbox} ${sizeClasses[size].checkbox} peer`;

    if (disabled) {
      classes += " border-(--stroke-card) disabled:border-(--stroke-card) disabled:border disabled:checked:bg-(--surface-disabled) disabled:bg-(--surface-disabled) disabled:cursor-not-allowed";
    } else {
      if (error) {
        classes += " border-(--color-error-500) hover:bg-(--surface-error) hover:border-(--color-error-500) focus:border-(--color-error-500) focus:shadow-[0_0_0_4px_var(--surface-error)] focus:outline-none";
      } else {
        classes += " border-(--stroke-primary) hover:bg-(--surface-checkmark-hover) hover:border-(--stroke-primary) focus:border-(--stroke-primary) focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none";
      }
    }

    if (checked || indeterminate) {
      if (disabled) classes += " bg-(--surface-disabled)";
      else if (error) classes += " bg-(--surface-error)";
      else classes += " bg-(--surface-card)";
    }

    return classes;
  };

  const getIconColor = () => {
    if (disabled) return "var(--icon-disabled)";
    if (error) return "var(--color-error-500)";
    return "var(--stroke-primary)";
  };

  const getIconClasses = () => {
    return `${baseClasses.icon} ${sizeClasses[size].icon} ${sizeClasses[size].iconPosition} ${indeterminate ? "hidden" : "hidden peer-checked:block"}`;
  };

  const getIndeterminateClasses = () => {
    let classes = `${baseClasses.indeterminate} ${sizeClasses[size].indeterminate} ${sizeClasses[size].iconPosition}`;
    if (disabled) classes += " bg-(--icon-disabled)";
    else if (error) classes += " bg-(--color-error-500)";
    else classes += " bg-(--stroke-primary)";
    return classes;
  };

  const getLabelClasses = () => {
    let classes = `${baseClasses.label} ${sizeClasses[size].label}`;
    
    if (disabled) {
      classes += " text-(--text-link-disabled) cursor-not-allowed";
    } else {
      classes += " text-(--text-link) cursor-pointer";
      
      if (error) {
        classes += " !text-(--color-error-700)";
      }
      
      classes += " peer-hover:text-(--text-link-hover)";
      classes += " hover:text-(--text-link-hover)";
      classes += " peer-focus:text-(--text-link)";
    }
    
    return classes;
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={baseClasses.container}>
      <div className="relative gap-2 flex items-center justify-center">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          id={checkboxId}
          name={name}
          value={value}
          className={`${getCheckboxClasses()} ${className}`}
        />

        <Icon
          icon="checkmark-small"
          color={getIconColor()}
          className={getIconClasses()}
        />

        {indeterminate && <div className={getIndeterminateClasses()} />}

      {label && (
        <label
          htmlFor={checkboxId}
          className={`${getLabelClasses()} ${labelClassName}`}
        >
          {label}
        </label>
      )}
      </div>

    </div>
  );
};