'use client'

import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { TestimonialItem, TestimonialBlok } from '../../modules'
import { CTABar } from '../../molecules'
import * as styles from './styles'

interface TestimonialWallBlok extends SbBlokData {
  testimonials: TestimonialBlok[]
  ctaBar?: SbBlokData[]
  rows?: number
}

interface TestimonialWallProps {
  blok: TestimonialWallBlok
}

export function TestimonialWall({ blok }: TestimonialWallProps) {
  const rows = blok.rows ?? 3
  const ctaBar = blok.ctaBar?.[0]

  const rowsData = Array.from({ length: rows }).map((_, rowIndex) =>
    blok.testimonials.filter((_, i) => i % rows === rowIndex)
  )

  return (
    <section
      {...storyblokEditable(blok)}
      className={styles.wallRoot}
    >
      <style jsx>{styles.animationStyles}</style>

      <div className={styles.rowsWrapper}>
        {rowsData.map((rowTestimonials, rowIndex) => (
          <div
            key={rowIndex}
            className={styles.rowClass(rowIndex % 2 === 1)}
            style={{
              animationDuration: `${20 + rowIndex * 10}s`,
            }}
          >
            {rowTestimonials.map(testimonial => (
              <div
                key={testimonial._uid}
                className={styles.cardWrapper}
              >
                <TestimonialItem
                  blok={testimonial}
                  variant="card"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {ctaBar && (
        <div className={styles.ctaWrapper}>
          <CTABar blok={ctaBar} />
        </div>
      )}
    </section>
  )
}