import type { FC } from 'react';
import { CompanyBlok } from './types';
import { Image } from '../../molecules';


interface Props {
  company: CompanyBlok;
}

export const CompanyLogo: FC<Props> = ({ company }) => {
  const logo =
    company.logoOnLight ||
    company.logomarkOnLight;

  if (!logo?.filename) return null;

  const content = (
    <div className="h-8 sm:h-12 flex items-center">
      <Image
        asset={{
            url : logo.filename
        }}
        alt={logo.alt || company.name || 'Company logo'}
        width={160}
        height={48}
        className="h-full w-auto object-contain"
      />
    </div>
  );

  if (company.website) {
    return (
      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 flex items-center"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="px-6 flex items-center">
      {content}
    </div>
  );
};