'use client'

import { useState } from 'react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc(FALLBACK_IMAGE)
      setHasError(true)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}
