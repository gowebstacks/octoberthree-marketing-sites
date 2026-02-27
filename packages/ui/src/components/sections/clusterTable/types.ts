import type { SbBlokData } from '@storyblok/react'

export type ClusterValueType = 'check' | 'cross' | 'dash' | 'text'

export interface ClusterValueBlok extends SbBlokData {
  type: ClusterValueType
  text?: string
}

export interface ClusterRowBlok extends SbBlokData {
  label: string
  description?: string
  values: ClusterValueBlok[]
}

export interface ClusterSectionBlok extends SbBlokData {
  title: string
  rows: ClusterRowBlok[]
}

export interface ClusterColumnBlok extends SbBlokData {
  label: string
}

export interface ClusterTableBlok extends SbBlokData {
  columns: ClusterColumnBlok[]
  sections: ClusterSectionBlok[]
}