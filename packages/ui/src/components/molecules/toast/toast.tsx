'use client'

import { useEffect, useState } from 'react'

type ToastPosition =
  | 'top-middle'
  | 'top-right'
  | 'bottom-right'

type ToastVariant =
  | 'default'

type ToastProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
  position?: ToastPosition
  variant?: ToastVariant
}

const positionClasses: Record<ToastPosition, string> = {
  'top-middle': 'top-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-6',
  'bottom-right': 'bottom-6 right-6',
}

const variantClasses: Record<ToastVariant, string> = {
  default: 'border-(--stroke-secondary)',
}

export function Toast({
  title,
  description,
  actionLabel = 'Undo',
  onAction,
  duration = 3000,
  position = 'bottom-right',
  variant = 'default',
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className={`fixed z-100 ${positionClasses[position]}`}>
      <div
        className={`flex items-start justify-between gap-2 rounded-xs border bg-(--surface-card) p-(--padding-18-16-16) shadow-md ${variantClasses[variant]}`}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-(--text-headings-dark)">
            {title}
          </p>

          {description && (
            <p className="text-xs text-(--text-headings-dark)">
              {description}
            </p>
          )}
        </div>

         {
          actionLabel &&
           <button
            onClick={onAction}
            className="rounded-md bg-(--surface-search-button) px-1 py-0.5 text-mono-xs font-(--font-medium) text-(--text-button)"
          >
            {actionLabel}
          </button>
        
         }
      </div>
    </div>
  )
}
