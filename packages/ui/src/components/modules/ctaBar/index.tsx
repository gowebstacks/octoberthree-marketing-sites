'use client'

import type { FC } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { Button } from '../../atoms'
import { twMerge } from 'tailwind-merge'
import type { ButtonProps } from '../../atoms/button'
import { InputField } from '../../molecules'

export interface CTABarProps extends SbBlokData {
  buttons?: ButtonProps[]
  className?: string
  type?: 'button' | 'subscribe'
  placeholder?: string
}

const CTABar: FC<CTABarProps> = ({
  buttons,
  className = '',
  ...blok
}) => {
  const actualBlok = (blok as any)?.blok || blok
  const items = buttons || actualBlok?.buttons
  const type = actualBlok?.type ?? 'button'
  const placeholder = actualBlok?.placeholder ?? 'companyemail@company.com'

  return (
    <div
      {...storyblokEditable(actualBlok)}
      className={twMerge(
        'flex flex-col gap-4 md:flex-row!',
        className
      )}
    >
      {type === 'subscribe' && (
        <InputField
        type="email"
          placeholder={placeholder}
          className='rounded h-10 lg:h-12.5'
      />

      )}
     

      {items?.map((item: ButtonProps) => {
        const { _uid, ...buttonProps } = item as any
        return <Button key={_uid || JSON.stringify(buttonProps)} {...buttonProps}  />
      })}
    </div>
  )
}

export default CTABar
