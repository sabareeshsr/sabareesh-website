import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

export interface FooterLink {
  label: string
  url: string
  openInNewTab?: boolean
}

export interface FooterSettings {
  copyrightText?: string
  footerLinks?: FooterLink[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    email?: string
  }
}

/** Fetch the footer global. Returns null on error or timeout. */
export async function getFooter(): Promise<FooterSettings | null> {
  noStore()
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await Promise.race([
      payload.findGlobal({ slug: 'footer', depth: 0 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
    ])
    return data as FooterSettings
  } catch {
    return null
  }
}
