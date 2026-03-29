'use client'
import { getImageUrl } from '@/lib/getImageUrl'

interface CMSImageProps {
  image: any
  alt: string
  className?: string
  fallback?: string
  width?: number
  height?: number
}

export default function CMSImage({
  image,
  alt,
  className = '',
  fallback,
  width,
  height,
}: CMSImageProps) {
  const url = getImageUrl(image, fallback)

  if (!url) {
    return (
      <div className={`bg-white/5 flex items-center justify-center ${className}`}>
        <span className="text-white/20 text-xs">No image</span>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
