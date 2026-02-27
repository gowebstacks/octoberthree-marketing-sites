'use client';

import { cva } from 'class-variance-authority';
import useHeaderStore, { toggleMobileMenu } from '../../store';

export const hamburgerLineStyle = cva(
  [
    'absolute left-0 block w-full bg-current',
    'transition-all duration-300 ease-in-out',
  ],
  {
    variants: {
      line: {
        0: [
          'top-0 h-[2.5px]',
          'group-aria-[expanded=true]:top-2',
          'group-aria-[expanded=true]:rotate-45',
        ],
        1: [
          'top-2 h-[2.5px]',
          'group-aria-[expanded=true]:opacity-0',
        ],
        2: [
          'top-4 h-[2.5px]',
          'group-aria-[expanded=true]:top-2',
          'group-aria-[expanded=true]:-rotate-45',
        ],
      },
    },
  },
);

const Hamburger = () => {
  const open = useHeaderStore(state => state.mobileMenuOpen);

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={toggleMobileMenu}
      aria-expanded={open}
      className="
        group relative flex
        h-5 w-5
        shrink-0 basis-5
        cursor-pointer items-center justify-center
        xl:hidden
      "
    >
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <span
            key={`line-${index + 1}`}
            className={hamburgerLineStyle({ line: index as 0 | 1 | 2 })}
          />
        ))}
    </button>
  );
};

export default Hamburger;