import Link from 'next/link';


import type { FC } from 'react';
import { SanityPressRelease } from '../../../types/sanity';
import { Pagination, Section } from '../../molecules';
import { Heading } from '../../atoms';
import { ResourceCard } from '../../organisms';
import { PAGE_SIZE } from '../../../lib';

interface PressReleaseListingProps {
  presses: SanityPressRelease[];
  totalPages?: number;
}

const PressReleaseListing:FC<PressReleaseListingProps> = ({ presses, totalPages }) => (
  <article className="bg-white pb-24">
    <Section>
      <div className="container mx-auto flex flex-col gap-6 pb-24">
        <Heading 
          as="h1"
          headingSize="2xl"
          className="text-center"
        >
          Press releases
        </Heading>
        <p className="text-(--base-color-neutral-2) text-center underline">Questions? Contact <Link href="/contact">press@webstacks.com</Link></p>
      </div>
    </Section>
    <div className="relative -mt-20 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 pb-10">
      {/* {presses?.map(press => <ResourceCard key={press._id} {...press} />)} */}
    </div>
    {(totalPages || 0) > PAGE_SIZE && 
      <Pagination totalPages={Math.ceil((totalPages || 0) / PAGE_SIZE)} baseUrl="/press-releases" />
    }
  </article>
);

export default PressReleaseListing;