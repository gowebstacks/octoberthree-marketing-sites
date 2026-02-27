'use client';


import type { FC } from 'react';
import { StoryblokNavigationInnerItem } from '../../../../../types/storyblok';
import Link from 'next/link';
import { toggleMobileMenu } from '../../store';
import { Icon } from '../../../../atoms';

const NavItem: FC<StoryblokNavigationInnerItem & { isMobile?: boolean; selected?: boolean; fullWidth?: boolean }> = ({ icon, link, description, label, isMobile, selected, fullWidth }) => (
  <Link
    href={link as any}
    className={`group flex items-center min-w-32.5 w-fit gap-2  hover:bg-navlink-active transition-colors ${selected ? 'bg-navlink-active' : ''}`}
    onClick={() => isMobile && toggleMobileMenu()}
  >
    {icon && (
      <span className="flex h-6 w-6 basis-6 grow-0 shrink-0 items-center justify-center rounded-sm bg-(--color-alphas-dark-navy)/60">
        <Icon 
          icon={icon} 
          size={16} 
          strokeWidth={0} 
        />
      </span>
    )}
    <div className="flex flex-col pt-0.5">
      {(label || link?.label) && <span className="text-xs  text-(--text-nav-item) group-hover:text-link-hover">{label || link?.label}</span>}
      {description && <span className="text-sm leading-normal text-body">{description}</span>}
    </div>
  </Link>
);

export default NavItem;
