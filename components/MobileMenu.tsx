'use client'
import { useState } from 'react'
import Link from 'next/link'

interface NavLink { label: string; href: string }

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden text-[#cbd5e1] hover:text-white transition-colors"
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="md:hidden fixed top-[65px] left-0 right-0 z-40 backdrop-blur-[10px] bg-[rgba(2,6,23,0.95)] border-b border-[rgba(255,255,255,0.1)] py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-8 py-3 font-bold text-[16px] text-[#cbd5e1] tracking-[-0.4px] hover:text-white transition-colors duration-150 font-plus-jakarta"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
