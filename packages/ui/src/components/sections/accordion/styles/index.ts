import { cva } from 'class-variance-authority';

export const containerStyle = cva('flex gap-(--gaps-56-48-48)', {
  variants: {
    layout: {
      stack: 'flex-col',
      split: 'flex-col lg:flex-row lg:items-start xl:gap-[135px]',
    },
  },
  defaultVariants: {
    layout: 'split',
  },
});

export const headingContainerStyle = cva('w-full flex flex-col gap-4', {
  variants: {
    layout: {
      stack: 'items-center mx-auto lg:max-w-[1008px] text-center',
      split: 'lg:max-w-[472px] lg:flex-none',
    },
  },
  defaultVariants: {
    layout: 'split',
  },
});
