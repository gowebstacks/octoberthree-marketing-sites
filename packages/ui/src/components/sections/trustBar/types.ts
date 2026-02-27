import { SbBlokData } from '@storyblok/react';
import { EyebrowBlockProps } from '../../atoms';

export interface CompanyBlok extends SbBlokData {
  name?: string;
  website?: string;

  logoOnLight?: {
    filename: string;
    alt?: string;
  };

  logoOnDark?: {
    filename: string;
    alt?: string;
  };

  logomarkOnLight?: {
    filename: string;
    alt?: string;
  };

  logomarkOnDark?: {
    filename: string;
    alt?: string;
  };
}

export interface TrustBarRowBlok extends SbBlokData {
  companies?: CompanyBlok[];
}

export interface TrustBarBlok extends SbBlokData {
title: string;
  variant?: 'static' | 'scroll';
  rows?: TrustBarRowBlok[];
}