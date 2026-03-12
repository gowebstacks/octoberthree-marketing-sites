import { storyblokEditable } from '@storyblok/react'

import type { FC } from 'react'
import type { SbBlokData } from '@storyblok/react'
import Stat from './components/stat';

// Storyblok-native props interface
export interface StatisticsPanelProps extends SbBlokData {
  component: 'statisticsPanel';
  statistics?: any[]; // Support both Sanity and Storyblok statistics data
  theme?: 'light' | 'dark';
  responsivePadding?: any;
  htmlId?: string;
  backgroundImage?: any;
  minHeight?: 'none' | 'sm' | 'md' | 'lg';
}

export const StatisticsPanel: FC<StatisticsPanelProps> = ({ statistics, ...blok }) => {
  if (!statistics || statistics.length === 0) {
    return null
  }

  // Helper function to render statistics for both Sanity and Storyblok
  const renderStatistics = () => {
    // Check if it's Storyblok data (array of bloks) or Sanity data
    if (Array.isArray(statistics) && statistics.length > 0 && statistics[0] && typeof statistics[0] === 'object' && 'component' in statistics[0]) {
      // Storyblok statistics data
      return statistics.map((stat: any, index: number) => (
        <div key={stat._uid || index} {...storyblokEditable(stat)} className="flex flex-col items-center justify-center text-center px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 gap-3 sm:gap-4">
          <div className="flex font-heading-accent font-medium text-link text-display-2xl sm:text-display-3xl md:text-display-4xl lg:text-display-5xl xl:text-display-7xl">
            {stat.prefix && stat.prefix !== '' && <span>{stat.prefix}</span>}
            {stat.value.split('').map((letter: string, letterIndex: number) => (
              <Stat key={`${index}-${letterIndex}-${letter}`} value={letter} />
            ))}
            {stat.suffix && stat.suffix !== '' && <span>{stat.suffix}</span>}
          </div>
          <div className="text-sm sm:text-base lg:text-lg text-heading font-normal">
            {stat.description}
          </div>
        </div>
      ));
    } else {
      // Sanity statistics data (existing logic)
      return statistics.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center text-center px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 gap-3 sm:gap-4">
          <div className="flex font-heading-accent font-medium text-link text-display-2xl sm:text-display-3xl md:text-display-4xl lg:text-display-5xl xl:text-display-7xl">
            {stat.prefix && stat.prefix !=='' && <span>{stat.prefix}</span>}
            {stat.value.split('').map((letter: string, letterIndex: number) => (
              <Stat key={`${index}-${letterIndex}-${letter}`} value={letter} />
            ))}
            {stat.suffix && stat.suffix !=='' && <span>{stat.suffix}</span>}
          </div>
          <div className="text-sm sm:text-base lg:text-lg text-heading font-normal">
            {stat.description}
          </div>
        </div>
      ));
    }
  };

  // Dynamic grid columns based on number of statistics
  const gridColsClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[statistics.length] || 'md:grid-cols-4'

  return (
    <div {...storyblokEditable(blok)} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div data-blok-field="statistics" className={`grid gap-0 grid-cols-1 ${gridColsClass} divide-y md:divide-y-0 md:divide-x divide-teal-200 dark:divide-teal-300`}>
        {renderStatistics()}
      </div>
    </div>
  )
}
