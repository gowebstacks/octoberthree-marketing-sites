'use client';
import { Link as ScrollLink } from 'react-scroll';
import { twMerge } from 'tailwind-merge';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import useTocStore, { setActiveItem } from './store';

import { FC, useEffect, useRef, useState } from 'react';
import { generateSlug as baseGenerateSlug } from '../../../utils/slugs';
import { Icon } from '../../atoms';

// Helper function to generate TOC-specific slugs that match heading IDs
const generateSlug = (text: string): string => {
  const base = baseGenerateSlug(text);
  return `toc-${base}`;
};

interface TOCItem {
  key: string;
  title: string;
  originalTitle: string;
  level: number;
  sectionId: string;
  hidden: boolean;
  order: number;
}

interface TableOfContentsProps {
  label?: string;
  article: {
    body: any;
    tableOfContents?: TOCItem[];
  };
}

const ScrollItems: FC<{ items: TOCItem[] }> = ({ items }) => {
  const activeItem = useTocStore(state => state.activeItem);
  const visibleItems = items.filter(item => !item.hidden);

  const handleActiveItem = (index: number) => {
    requestAnimationFrame(() => {
      setActiveItem(index);
    });
    const tocEl = document.getElementById('table-of-contents');
    if (tocEl) {
      tocEl.classList.add('scrolling');
      setTimeout(() => {
        tocEl.classList.remove('scrolling');
      }, 1200);
    }
  };

  return (
    <ul className="flex flex-col">
      {items.map((item, index) => {
        const originAnchorLink = generateSlug(item?.originalTitle || item?.title || '');

        return item.hidden ? (
          <></>
        ) : (
          <li
            key={item.key}
            className={`text-base transition-all duration-200 cursor-pointer`}
            role="menuitem"
          >
            <ScrollLink
              to={originAnchorLink || item.sectionId}
              data-url={originAnchorLink || item.sectionId}
              aria-current={index === activeItem ? 'location' : undefined}
              smooth={true}
              duration={300}
              offset={-180}
              className={twMerge(
                'cursor-pointer block px-4 py-2.5 transition-colors text-(--text-link-disabled) text-sm ',
                index === activeItem && 'text-(--text-body-dark) border-l-3 border-(--stroke-table-of-contents)'
              )}
              onClick={() => handleActiveItem(index)}
            >
              {item.title !== item.originalTitle ? item.title : item.originalTitle}
            </ScrollLink>
          </li>
        );
      })}
    </ul>
  );
};

const TableOfContents: FC<TableOfContentsProps> = ({ label, article }) => {
  const body = article?.body?.content || []; 
  const tableOfContents = Array.isArray(article) ? [] : article?.tableOfContents;
  const [expanded, setExpended] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  
  if (!article) {
    return null;
  }

  // const generateTocItems = (blocks: any[]) => {
  //   const items =
  //     blocks
  //       ?.filter(block => {
  //         const isHeading = block.style === 'h2';
  //         const hasText = block.children?.[0]?.text;
  //         return isHeading && hasText;
  //       })
  //       ?.map((block, index) => {
  //         const text = block.children[0].text;
  //         const item = {
  //           key: block._key,
  //           title: text,
  //           originalTitle: text,
  //           level: block.style === 'h2' ? 2 : 3,
  //           sectionId: generateSlug(text),
  //           hidden: false,
  //           order: index,
  //         };
  //         return item;
  //       }) || [];
  //   return items;
  // };
const generateTocItems = (blocks: any[]) => {
  if (!blocks) return [];

  return blocks
    .filter(
      (block) =>
        block.type === "heading" &&
        block.attrs?.level === 2 &&
        block.content?.length
    )
    .map((block, index) => {
      const text =
        block.content.map((node: any) => node.text || "").join("").trim();

      return {
        key: `toc-${index}`,
        title: text,
        originalTitle: text,
        level: 2,
        sectionId: generateSlug(text),
        hidden: false,
        order: index,
      };
    });
};
  const tocItems = tableOfContents?.length ? tableOfContents : generateTocItems(body || []);

  useEffect(() => {
    if (!tocItems?.length) return;

    const headings = tocItems
      .filter(item => !item.hidden)
      .map(item => {
        const originAnchorLink = generateSlug(item?.originalTitle || item?.title || '');
        return document.getElementById(originAnchorLink || item.sectionId);
      })
      .filter((el): el is HTMLElement => el !== null);

    const handleScroll = () => {
      const tocEl = document.getElementById('table-of-contents');
      if (tocEl && tocEl.classList.contains('scrolling')) {
        return;
      }
      const scrollPosition = 200;

      const currentHeading = headings.reduce((acc, heading) => {
        if (heading.getBoundingClientRect().top <= scrollPosition) {
          return heading;
        }
        return acc;
      }, headings[0]);

      if (currentHeading) {
        const index = tocItems.findIndex(
          item =>
            !item.hidden &&
            (item.sectionId === currentHeading.id ||
              item?.originalTitle === currentHeading.innerText ||
              item?.title === currentHeading.innerText),
        );
        if (index !== -1) {
          setActiveItem(index);
          const anchorEl = document.querySelector(`[data-url=${currentHeading.id}]`)?.parentElement;
          const scrollOffset = (anchorEl?.offsetTop || 0) - 45;
          if (tocRef.current) {
            tocRef.current.scrollTo({
              top: scrollOffset,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  useEffect(() => {
    setTimeout(() => {
      const anchorEl = document.querySelector('[aria-current=location]')?.parentElement;
      const scrollOffset = (anchorEl?.offsetTop || 0) - 45;
      if (tocRef.current) {
        tocRef.current.scrollTo({
          top: scrollOffset,
          behavior: 'smooth',
        });
      }
    }, 300);
  }, [expanded]);

  if (!tocItems?.length || (!tocItems.length && (!article.body || !article.body.length))) {
    return null;
  }

  const dropdownItems = tocItems
    .filter(item => !item.hidden)
    .map(item => ({
      label: item.title !== item.originalTitle ? item.title : item.originalTitle,
      value: item.sectionId,
    }));

  const handleChange = (value: string) => {
    const index = tocItems.findIndex(item => item.sectionId === value);
    if (index !== -1) {
      setActiveItem(index);
      const element = document.getElementById(value);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 220;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <nav aria-label="Table of contents" className="w-full">
      {/* Mobile/Tablet Dropdown - Styled to match desktop */}
      <div className="block lg:hidden">
        {dropdownItems.length > 0 && (
          <div className="pt-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="w-full bg-(--surface-secondary-background) border border-(--stroke-primary)  p-4 text-lg outline-none flex items-center justify-between text-(--text-body-dark)">
                <span className="truncate text-left flex-1 font-medium">{label || 'Table of contents'}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-(--icon-primary)" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-[calc(100vw-32px)] min-w-[200px] overflow-auto  bg-(--surface-secondary-background) border border-(--stroke-primary) p-2 shadow-lg max-h-[--radix-popper-available-height]"
                  align="start"
                  sideOffset={4}
                >
                  {dropdownItems.map((item, index) => {
                    const isActive = index === useTocStore(state => state.activeItem);
                    return (
                      <DropdownMenu.Item
                        key={item.value}
                        className={twMerge(
                          'relative flex cursor-pointer select-none items-center px-4 py-3 text-sm outline-none transition-all',
                          'text-(--text-body-dark)',
                          isActive && 'bg-(--surface-selected) text-(--text-body-dark) border-l-3 border-(--stroke-table-of-contents) pl-3.5'
                        )}
                        onClick={() => handleChange(item.value)}
                      >
                        {item.label}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        )}
      </div>

      {/* Desktop Expanded/Collapsible Panel */}
      <div className="hidden lg:block bg-(--surface-secondary-background) border border-(--stroke-primary) overflow-hidden px-6 py-8">
        <p className="text-(--text-headings) border-b border-(--stroke-primary) pb-4 text-lg font-medium">
          {label || 'Table of contents'}
        </p>
        {dropdownItems.length > 0 && (
          <div
            ref={tocRef}
            id="table-of-contents"
            className={twMerge(
              'relative scrollbar-hidden overflow-auto transition-all duration-300 mt-6',
              expanded ? 'max-h-[calc(100vh-300px)]' : 'max-h-56',
            )}
          >
            <ScrollItems items={tocItems} />
            <button
              className="sticky bottom-0 flex w-full p-2 items-center justify-center bg-(--surface-secondary-background) transition-colors"
              onClick={() => setExpended(!expanded)}
            >
              <Icon color='var(--icon-primary)' icon="chevron-up" className={expanded ? 'rotate-0' : 'rotate-180'} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TableOfContents;