import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

/** Fetch a page document from Payload by URL slug. Returns null on error, timeout, or not found. */
export async function getPageBySlug<T = Record<string, unknown>>(slug: string): Promise<T | null> {
  noStore()
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await Promise.race([
      payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
    ])
    return (result.docs[0] as T) ?? null
  } catch {
    return null
  }
}
