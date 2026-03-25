'use client'

/**
 * Generic reusable RowLabel component for Payload CMS array fields.
 * Payload passes `data` and `index` automatically; we pass
 * `field`, `field2`, `separator`, and `fallback` via clientProps in payload.config.ts.
 */
type Props = {
  data?: Record<string, unknown>
  index?: number
  /* clientProps ↓ */
  field?: string        // primary field to display
  field2?: string       // optional secondary field
  separator?: string    // separator between field and field2 (default " — ")
  fallback?: string     // fallback prefix when fields are empty (default "Item")
}

export function RowLabel({
  data,
  index,
  field = 'title',
  field2,
  separator = ' — ',
  fallback = 'Item',
}: Props) {
  const primary   = data?.[field]  as string | undefined
  const secondary = field2 ? (data?.[field2] as string | undefined) : undefined

  if (primary && secondary) return `${primary}${separator}${secondary}`
  if (primary) return primary
  return `${fallback} ${(index ?? 0) + 1}`
}
