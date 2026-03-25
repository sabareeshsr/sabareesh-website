import { getPayload } from 'payload'
import configPromise from '@payload-config'

/** Fetch a single page document from Payload by pageType. Returns null on error or if not found. */
export async function getPage<T = Record<string, unknown>>(pageType: string): Promise<T | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { pageType: { equals: pageType } },
      limit: 1,
      depth: 2,
    })
    return (docs[0] as T) ?? null
  } catch {
    return null
  }
}
