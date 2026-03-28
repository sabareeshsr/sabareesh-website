import Link from 'next/link'
import { getFooter } from '@/lib/getFooter'

const DEFAULT_FOOTER_LINKS = [
  { label: 'Privacy Policy', url: '/privacy',                            openInNewTab: false },
  { label: 'LinkedIn',       url: 'https://linkedin.com/in/sabareesh',  openInNewTab: true  },
  { label: 'GitHub',         url: 'https://github.com/sabareesh',       openInNewTab: true  },
]

const DEFAULT_COPYRIGHT = `© ${new Date().getFullYear()} SABAREESH. ALL RIGHTS RESERVED.`

export default async function Footer() {
  const footerData   = await getFooter()
  const copyright    = footerData?.copyrightText || DEFAULT_COPYRIGHT
  const footerLinks  = footerData?.footerLinks?.length ? footerData.footerLinks : DEFAULT_FOOTER_LINKS

  // Extract wordmark from copyright (everything before the dot or pipe, fallback to 'SABAREESH')
  const wordmark = copyright.match(/©\s*\d{4}\s+([^.–—|]+)/)?.[1]?.trim() || 'SABAREESH'

  return (
    <footer className="bg-[#0e1322] border-t border-[rgba(255,255,255,0.05)] min-h-[125px]">
      <div className="max-w-[1280px] mx-auto w-full px-8 py-[49px] flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-0">

        {/* Left — wordmark */}
        <span className="font-semibold text-[18px] text-white tracking-[0.45px] uppercase font-inter">
          {wordmark}
        </span>

        {/* Centre — copyright */}
        <span className="font-medium text-[14px] text-[#64748b] tracking-[0.35px] uppercase font-inter">
          {copyright}
        </span>

        {/* Right — links */}
        <div className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="font-medium text-[14px] text-[#64748b] tracking-[0.35px] uppercase hover:text-white transition-colors duration-150 font-inter"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  )
}
