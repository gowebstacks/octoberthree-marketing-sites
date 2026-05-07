// import { Heading } from '@/components/atoms/heading';
// import Button from '@/components/atoms/button';
// import Badge from '@/components/molecules/badge';
// import Image from '@/components/molecules/image';
// import { CompanyBrand } from '@/components/atoms/companyBrand/companyBrand';

// import type { SanityBlogPost } from '@/types/sanity';
import type { FC } from 'react';
import { SanityBlogPost } from '../../../../types/sanity';
import Badge from '../../../molecules/badge';
import { Button, Heading } from '../../../atoms';
import Image from '../../../molecules/image';
import { CompanyBrand } from '../../../atoms/companyBrand';

export interface SliderItemProps  {
  item?: SanityBlogPost | any;
  priority?: boolean;
  theme?: 'light' | 'dark';
};

const SliderItem: FC<SliderItemProps> = ({ item, priority, theme = 'dark' }) => {
  const featuredImage = (item?._type === 'blogPost' && item?.featuredImage) || 
                       item?.featuredImage
  

  const getCardContent = () => {
    switch (item?._type) {
      case 'blogPost':
        return (
          <div className="flex flex-col gap-4 h-full">
            {Array.isArray(item?.tags) && item.tags[0]?.name && (
              <div className="dark flex items-center gap-2">
                <Badge label={item.tags[0].name} tone="secondary" />
              </div>
            )}
            <Heading size="2xl" as="h2" weight="bold" className="text-heading">{item.title}</Heading>
            {item.excerpt && (
              <p className="text-md text-body line-clamp-3">{item.excerpt}</p>
            )}
            <Button
              link={`/blog/${item?.seo?.slug?.current}`} 
              label="Read more" 
              mode="link" 
              trailingIcon={{icon : "arrow-right" }}
              className="w-fit mt-auto" 
            />
          </div>
        )
      default:
        return (
          <div className="flex flex-col gap-4 h-full">
            {item?.company && (
              <div className="w-fit max-w-[150px]">
                <CompanyBrand
                  company={item.company} 
                  variant={theme === 'dark' ? 'onDark' : 'onLight'}
                  size="sm"
                  logoType="logotype"
                />
              </div>
            )}
            <Heading size="2xl" as="h2" className="text-heading">{item.title}</Heading>
            {item.excerpt && (
              <p className="text-md text-body line-clamp-3">{item.excerpt}</p>
            )}
            <Button 
              link={`/work/${item?.seo?.slug?.current}`} 
              label="Read more" 
              mode="link" 
               trailingIcon={{icon : "arrow-right" }}
              className="w-fit mt-auto" 
            />
          </div>
        )
    }
  }

  return (
    <div className="px-2" style={{ width: '1232px' }}>
      <div className="relative flex flex-col md:flex-row md:items-stretch overflow-hidden rounded-2xl border border-primary bg-secondary-background w-[1216px] h-[451px] transition-opacity duration-300">
        {featuredImage ? (
          <div className="w-full md:w-[800px] md:basis-[800px] md:shrink-0 md:grow-0 h-full">
            <Image
              {...featuredImage}
              className="h-full w-full object-cover"
              priority={priority}
              objectCover
              aspectRatio="800/451"
              alt={item?.title || 'Featured item'}
            />
          </div>
        ) : (
          <div className="w-full md:w-[800px] md:basis-[800px] md:shrink-0 md:grow-0 h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="dark w-full grow shrink-0 basis-0 p-8 flex items-center">
          {getCardContent()}
        </div>
      </div>
    </div>
  )
};

export default SliderItem;
