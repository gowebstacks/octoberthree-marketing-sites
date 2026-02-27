import { twMerge } from 'tailwind-merge'

export const wallRoot =
  'w-full overflow-hidden section-padding-xl-top-bottom bg-(--surface-background)'

export const rowsWrapper =
  'flex flex-col gap-8'

export const rowBase =
  'flex gap-6 w-max testimonialRow'

export const rowReverse =
  'testimonialRowReverse'

export const cardWrapper =
  'w-[592px] shrink-0'

export const ctaWrapper =
  'mt-16 flex justify-center'

export const rowClass = (reverse?: boolean) =>
  twMerge(rowBase, reverse && rowReverse)

export const animationStyles = `
  @keyframes testimonialRow {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-30%);
    }
  }

  @keyframes testimonialRowReverse {
    from {
      transform: translateX(-30%);
    }
    to {
      transform: translateX(0);
    }
  }

  .testimonialRow {
    animation-name: testimonialRow;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .testimonialRowReverse {
    animation-name: testimonialRowReverse;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .testimonialRow:hover,
  .testimonialRowReverse:hover {
    animation-play-state: paused;
  }
`