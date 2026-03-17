"use client";

import { useId, useState } from "react";
import { twMerge } from "tailwind-merge";

type RadioProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  labelClassName?: string;
  size?: "sm" | "md";
  type?: "dot" | "check";
};

const sizeClasses = {
  sm: {
    radio: "h-4 w-4",
    dot: "h-1 w-1",
    label: "text-[length:var(--text-jumper-text-class-mono-xs)]",
  },
  md: {
    radio: "h-5 w-5",
    dot: "h-2 w-2",
    label: "text-[length:var(--text-jumper-text-class-mono-sm)]",
  },
};

const baseClasses = {
  radio: "appearance-none rounded-full border relative aspect-square shrink-0",
  dot: "absolute rounded-full pointer-events-none",
  label: "transition-colors duration-150",
  container: "flex items-center gap-2",
  radioContainer: "relative flex items-center justify-center",
};

export const Radio = ({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  className = "",
  id,
  name,
  value,
  label,
  labelClassName = "",
  size = "sm",
  type = "dot",
}: RadioProps) => {
  const generatedId = useId();
  const radioId = id ?? `radio-${generatedId}`;

  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const getRadioClasses = () => {
    let classes = `${baseClasses.radio} ${sizeClasses[size].radio} peer`;

    if (disabled) {
      classes +=
        " border-(--stroke-card) bg-(--surface-disabled) cursor-not-allowed";
    } else {
      classes +=
        " border-(--stroke-primary) focus:border-(--stroke-primary) focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none cursor-pointer";
    }

    if (!disabled && !isChecked) {
      classes +=
        " hover:bg-(--surface-checkmark-hover) hover:border-(--stroke-primary)";
    }

    if (isChecked) {
      if (disabled) {
        classes += " bg-(--surface-disabled)";
      } else {
        classes +=
          type === "check"
            ? " bg-(--surface-button) border-(--stroke-primary)"
            : " bg-(--surface-card)";
      }
    }

    return classes;
  };

  const getDotClasses = () =>
    `${baseClasses.dot} ${sizeClasses[size].dot} bg-(--stroke-primary) inset-0 m-auto`;

  const getLabelClasses = () => {
    let classes = `${baseClasses.label} ${sizeClasses[size].label}`;

    if (disabled) {
      classes += " text-(--text-link-disabled) cursor-not-allowed";
    } else {
      classes +=
        " text-(--text-link) cursor-pointer hover:text-(--text-link-hover)";
    }

    return classes;
  };

  const renderIndicator = () => {
    if (!isChecked) return null;

    if (type === "dot") {
      return <div className={getDotClasses()} />;
    }

    return (
      <div className={twMerge(
        "absolute inset-0 flex items-center justify-center pointer-events-none",
        disabled ? 'text-(--icon-disabled)' : 'text-white'
      )}>
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7" fill="currentColor">
  <path d="M7.84961 0.176758C7.97887 0.176758 8.1029 0.227988 8.19434 0.319336C8.28575 0.410752 8.33784 0.534786 8.33789 0.664062C8.33789 0.793402 8.28579 0.917333 8.19434 1.00879L3.19434 6.00879C3.14907 6.05408 3.09528 6.09071 3.03613 6.11523C2.97707 6.13965 2.91352 6.15234 2.84961 6.15234C2.78565 6.15232 2.72218 6.13971 2.66309 6.11523C2.63352 6.10298 2.60558 6.08704 2.5791 6.06934L2.50488 6.00879L0.317383 3.82129C0.226035 3.72985 0.174805 3.60582 0.174805 3.47656C0.174851 3.34729 0.225967 3.22325 0.317383 3.13184C0.408798 3.04042 0.532833 2.9893 0.662109 2.98926C0.791367 2.98926 0.915396 3.04049 1.00684 3.13184L2.84961 4.97461L7.50488 0.319336C7.5963 0.22792 7.72033 0.176804 7.84961 0.176758Z"  strokeWidth="0.35"/>
</svg>
      </div>
    );
  };

  return (
    <div className={baseClasses.container}>
      <div className={baseClasses.radioContainer}>
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          onChange={handleChange}
          className={`${getRadioClasses()} ${className}`}
        />

        {renderIndicator()}
      </div>

      {label && (
        <label
          htmlFor={radioId}
          className={`${getLabelClasses()} ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};