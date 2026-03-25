import Link from 'next/link'
import { getSiteSettings } from '@/lib/getSiteSettings'
import MobileMenu from './MobileMenu'

const DEFAULT_NAV = [
  { href: '/writer',      label: 'Writer' },
  { href: '/growth',      label: 'Growth Marketer' },
  { href: '/sap',         label: 'SAP' },
  { href: '/agentic-ai',  label: 'Agentic AI' },
  { href: '/blog',        label: 'Blogs' },
  { href: '/contact',     label: 'Contact' },
]

export default async function Header() {
  const settings   = await getSiteSettings()
  const siteName   = settings?.siteName  || 'Sabareesh'
  const navLinks   = settings?.navLinks?.length ? settings.navLinks : DEFAULT_NAV

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[65px] backdrop-blur-[10px] bg-[rgba(2,6,23,0.6)] border-b border-[rgba(255,255,255,0.1)] shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)]">
        <div className="max-w-[1280px] mx-auto w-full h-full px-8 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="font-extrabold text-[24px] tracking-[-0.6px] uppercase bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text text-transparent font-plus-jakarta"
          >
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold text-[16px] text-[#cbd5e1] tracking-[-0.4px] hover:text-white transition-colors duration-150 font-plus-jakarta"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger — client component handles toggle state */}
          <MobileMenu links={navLinks} />

        </div>
      </header>
    </>
  )
}
