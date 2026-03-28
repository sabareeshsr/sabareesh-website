import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

export interface NavLink {
  label: string
  url: string
  openInNewTab?: boolean
  subLinks?: Array<{ label: string; url: string }>
}

export interface HeaderSettings {
  logoText?: string
  logoLink?: string
  navLinks?: NavLink[]
}

/** Fetch the header global. Returns null on error or timeout. */
export async function getHeader(): Promise<HeaderSettings | null> {
  noStore()
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await Promise.race([
      payload.findGlobal({ slug: 'header', depth: 0 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
    ])
    return data as HeaderSettings
  } catch {
    return null
  }
}
