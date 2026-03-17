import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  [
    "flex  items-center justify-center whitespace-nowrap transition-colors cursor-pointer outline-none",
  ],
  {
    // Note: Border radius is set via custom property in compound variants
    variants: {
      mode: {
        filled: [], // Base styles for filled mode, tone will determine specific styles
        stroke: [], // Base styles for stroke mode, tone will determine specific styles
        nav: [
          // default - minimal styling, no border, minimal padding for better UX
          "bg-transparent border-0 font-medium text-sm md:text-md cursor-pointer h-auto",
          // hover - very light background
          "hover:bg-emphasis",
          // disabled
          "disabled:cursor-not-allowed",
        ],
        link: [
          // default
          "font-medium text-sm md:text-md h-auto",
          // disabled
          "disabled:cursor-not-allowed",
        ],
      },
      tone: {
        primary: [], // Base styles for primary tone, mode will determine specific styles
        secondary: [], // Base styles for secondary tone, mode will determine specific styles
      },
      // For backward compatibility
      variant: {
        primary: [],
        secondary: [],
        link: [],
        nav: [],
      },
      fullWidth: {
        true: "w-full",
        false: "sm:w-fit",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
      background : {
        dark :'',
        light: '',

      }
    },
    defaultVariants: {
      mode: "filled",
      tone: "primary",
      size: "md",
    },
    compoundVariants: [
      // Filled + Primary
      {
        mode: "filled",
        tone: "primary",
        className: [
          "bg-[var(--surface-button)] font-medium text-[var(--text-button)]",
          "rounded-[4px]",
          "disabled:bg-[var(--surface-button)] disabled:opacity-70 disabled:text-white dark:disabled:bg-neutral-600 dark:disabled:text-neutral-400 disabled:cursor-not-allowed",
          "hover:bg-[var(--surface-button-hover)]",
          "px-4 py-2 lg:px-6 lg:py-[14px]",
          "focus:border-[var(--surface-button-hover)] focus:bg-[var(--surface-button-hover)] focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none",
        ],
      },
      // Filled + Secondary
      {
        mode: "filled",
        tone: "secondary",
        className: [
          "bg-[var(--surface-secondary-button)] font-medium text-[var(--text-secondary-button)]",
          "rounded-[4px]",
          "border-[1.5px] border-[var(--stroke-secondary-button)]",
          "disabled:bg-[var(--surface-secondary-button)] disabled:opacity-70 disabled:cursor-not-allowed",
          "px-4 py-2 lg:px-6 lg:py-[14px]",
          "focus:border-[var(--stroke-secondary-button-hover)] focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none",
          "hover:bg-[var(--surface-secondary-button-hover)] hover:text-(--text-secondary-button-hover) hover:border-[var(--stroke-secondary-button-hover)]",
          "disabled:border-[1.5px]",
          "disabled:border-[var(--stroke-disabled)]",
          "disabled:bg-[var(--surface-secondary-button)]",
          "disabled:text-[var(--text-disabled)]",
          "disabled:cursor-not-allowed",
        ],
      },

      // nav + Primary
      {
        mode: "nav",
        tone: "primary",
        className:
          ["rounded-[4px] py-1 px-2 lg:py-2.5 lg:px-3 text-(--text-heading) !font-normal disabled:text-disabled",
            "hover:text-headline-hover  hover:bg-(--surface-navlink-active-dark)",
          "focus:border-[var(--stroke-primary)] focus:shadow-[0_0_0_4px_var(--stroke-primary)] focus:outline-none",
          "disabled:text-[var(--color-neutral-500)]",
          "disabled:cursor-not-allowed",
          "disabled:bg-transparent"

          ]
      },
      // Nav + dark bg
      {
  mode: "nav",
  tone: "primary",
  background: "dark",
  className: [
    "rounded-[4px] py-1 px-2 lg:py-2.5 lg:px-3",
    "text-(--text-secondary-link)",
    "!font-normal",
    "hover:text-(--text-secondary-link)",
    "hover:bg-(--surface-navlink-active-dark)",
    "focus:bg-(--surface-navlink-active-dark)",
    "focus:border-[var(--surface-navlink-active-light)] focus:border-3",
    "focus:shadow-none",
    "focus:outline-none",
    "disabled:text-(--text-link-disabled)",
    "disabled:bg-transparent",
    "disabled:cursor-not-allowed",
  ],
},
      // Link + Primary
      {
        mode: "link",
        tone: "primary",
        className: [
          "h-fit! text-(--text-link) hover:text-(--text-link-hover) disabled:text-(--text-link-disabled)",
          "focus:rounded-[4px] focus:text-(--text-link-active) focus:border-[var(--stroke-secondary-button-hover)] focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none",
        ],
      },

      // Link + bg dark
      {
        mode: "link",
        tone: "primary",
        background: "dark",
        className: [
          "text-(--text-secondary-link) hover:text-(--text-secondary-link) disabled:text-neutral-600",
          "focus:border-[var(--stroke-secondary-button-hover)] focus:text-(--text-link) focus:shadow-[0_0_0_4px_var(--color-navy-primary-900---p)] focus:outline-none",
        ],
      },

      // Backward compatibility for variant='primary'
      {
        variant: "primary",
        className: [
          "bg-button-primary font-medium text-button border-button-primary px-6 md:px-8",
          "[border-radius:var(--Border-Radius-round,96px)]",
          "disabled:bg-neutral-300 disabled:text-white dark:disabled:bg-neutral-600 dark:disabled:text-neutral-400 disabled:cursor-not-allowed",
        ],
      },
      // Backward compatibility for variant='secondary'
      {
        variant: "secondary",
        className: [
          "bg-button-secondary font-medium button-text-secondary border-button-secondary px-6 md:px-8",
          "[border-radius:var(--Border-Radius-round,96px)]",
          "disabled:bg-white disabled:text-neutral-400 dark:disabled:bg-button-secondary dark:disabled:text-neutral-500 disabled:cursor-not-allowed",
        ],
      },
      // Backward compatibility for variant='link'
      {
        variant: "link",
        className: "text-link hover:text-link-hover disabled:text-neutral-600",
      },
      // Backward compatibility for variant='nav'
      {
        variant: "nav",
        className: "text-link hover:text-link-hover disabled:text-neutral-600",
      },
    ],
  }
);
