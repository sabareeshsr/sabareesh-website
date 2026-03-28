import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

/** Fetch a single page document from Payload by pageType. Returns null on error or timeout. */
export async function getPage<T = Record<string, unknown>>(pageType: string): Promise<T | null> {
  noStore() // opt out of Next.js static caching — always read live data
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await Promise.race([
      payload.find({
        collection: 'pages',
        where: { pageType: { equals: pageType } },
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
