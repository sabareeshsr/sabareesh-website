/**
 * Resolves a Payload media field (object or string) to a usable image URL.
 * Falls back to NEXT_PUBLIC_R2_PUBLIC_URL/filename when url is not populated.
 * Safe to use in both server and client components.
 */
export function getImageUrl(
  image: any,
  fallback: string = '',
): string {
  if (!image) return fallback

  // Already a plain string URL
  if (typeof image === 'string') return image

  // Payload media object with url populated (normal case with depth >= 1)
  if (image?.url) return image.url

  // Lexical upload node: media object is nested under .value
  if (image?.value?.url) return image.value.url
  if (image?.value?.filename && process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${image.value.filename}`
  }

  // Payload media object with only filename — construct R2 URL
  if (image?.filename && process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${image.filename}`
  }

  // Fallback to sized variant
  if (image?.sizes?.thumbnail?.url) return image.sizes.thumbnail.url

  return fallback
}
