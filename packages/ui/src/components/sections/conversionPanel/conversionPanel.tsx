import type { FC } from 'react';
import { storyblokEditable, SbBlokData } from '@storyblok/react';
import { ContentBlock, type ContentBlockBlok } from '../../organisms/contentBlock';
import { twMerge } from 'tailwind-merge';

export interface ConversionPanelProps extends SbBlokData {
  body?: ContentBlockBlok[];
  variant :  'light'| 'dark'
}

export const ConversionPanel: FC<ConversionPanelProps> = ({
  body,
variant,
  ...blok
}) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className={
        twMerge(
          "w-full mx-auto max-w-(--widths-1440-834-375) rounded-md flex  flex-col md:items-center text-center section-padding-xl-top-bottom md:px-12 px-4",
          variant === 'dark' ? 'bg-(--surface-accent-background-2) text-white! **:text-white!' : 'bg-(--surface-background)'
        )
      }
    >
      {body?.[0] && <ContentBlock blok={body[0]} />}
    </div>
  );
};