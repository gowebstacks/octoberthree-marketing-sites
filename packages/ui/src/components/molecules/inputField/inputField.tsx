import { twMerge } from "tailwind-merge";
import { Icon } from "../../atoms";
import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: string;
  variant?: "text" | "select" | "textarea";
  rows?: number;
};

type InputFieldProps = BaseProps &
  (
    | (InputHTMLAttributes<HTMLInputElement> & { variant?: "text" | "select" })
    | (TextareaHTMLAttributes<HTMLTextAreaElement> & { variant: "textarea" })
  );

export function InputField({
  label,
  hint,
  error,
  disabled,
  className,
  id,
  variant = "text",
  rows = 4,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const isSelect = variant === "select";
  const isTextarea = variant === "textarea";

  const commonClasses = twMerge(
    "flex rounded-sm shadow-xs w-full items-center justify-between  border py-(--padding-8-6-6) px-(--padding-12-8-8) text-sm outline-none transition",
    "bg-(--surface-input) text-(--text-body)! placeholder:text-(--text-placeholder)",
    error
      ? "border-(--stroke-error) bg-(--surface-error)"
      : "border-(--stroke-secondary) focus-primary",
    !disabled && !error && "focus-primary",
    !disabled && error && "focus-error",
    disabled && "input-disabled",
    isTextarea ? "min-h-[80px] resize-y" : "pr-10",
    className
  );

  const renderInput = () => {
    if (isTextarea) {
      return (
        <textarea
          id={inputId}
          disabled={disabled}
          rows={rows}
          className={twMerge(
            commonClasses,
            "rounded",
            "py-3",
            "px-3.5",
            "resize-none"
          )}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <div className="relative">
        <input
          id={inputId}
          disabled={disabled}
          className={commonClasses}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {isSelect && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Icon
              icon="chevron-down"
              className="h-5 w-5 text-(--icon-primary)"
            />
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-mono-sm font-medium tracking-wide ${
            error ? "text-(--text-error)" : "text-(--text-headings)"
          }`}
        >
          {label}
        </label>
      )}

      {renderInput()}

      {(hint || error) && (
        <p
          id={error ? errorId : hintId}
          className={twMerge(
            "text-xs",
            error ? "text-(--text-error)" : "text-(--text-body)"
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
