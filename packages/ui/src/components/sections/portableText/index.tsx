import type { FC } from 'react';
import { SbBlokData } from '@storyblok/react';
import { RichText } from '../../molecules/richText/richText';

export interface PortableTextSectionProps extends SbBlokData {
  content?: any;
}

export const PortableText: FC<PortableTextSectionProps> = ({ content }) => {
 if (!content?.content?.length) return 
  return (
    <div className="px-4 sm:px-6 lg:px-16 bg-(--surface-background)">
      <div className="max-w-7xl px-4 lg:px-8 py-(--scale-96) mx-auto prose prose-lg dark:prose-invert">
        <RichText doc={content} />
      </div>
    </div>
  );
};
