import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import BookTemplate, { type BookEntry } from '@/components/templates/BookTemplate'

interface WriterPage {
  heroTitle?: string
  heroSubtitle?: string
  /* legacy single-book fields */
  bookTitle?: string
  bookDescription?: object
  bookCover?: { url?: string; filename?: string; alt?: string } | null
  amazonLink?: string
  flipkartLink?: string
  otherStoreLink?: string
  writerSections?: Array<{ title?: string; content?: object }>
  /* new multi-book fields */
  books?: Array<{
    bookTitle?: string
    bookDescription?: object
    bookCover?: { url?: string; filename?: string } | null
    amazonLink?: string
    flipkartLink?: string
    otherStoreLink?: string
    aboutTheBook?: object
  }>
  additionalSections?: Array<{ sectionTitle?: string; sectionContent?: object }>
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

const FB = {
  heroTitle:   'Writer',
  heroSubtitle: 'Stories that move people. Books that shape minds.',
  bookTitle:   'Five Days Forever',
  bookDesc:    'A coming-of-age story set against the backdrop of modern India — five days that rewrite a lifetime. Part love story, part identity quest, this debut novel explores what happens when ambition and emotion collide.',
  amazonLink:  '#',
  flipkartLink: '#',
}

function mediaUrl(img: { url?: string; filename?: string } | null | undefined): string | null {
  if (!img) return null
  if (img.url) return img.url
  if (img.filename) return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/media/file/${img.filename}`
  return null
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<WriterPage>('writer')
  const title = page?.seo?.seoTitle || 'Writer | Sabareesh'
  const description = page?.seo?.seoDescription || FB.heroSubtitle
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.seo?.ogImage?.url ? [{ url: page.seo.ogImage.url }] : [],
    },
  }
}

export default async function WriterPage() {
  const page = await getPage<WriterPage>('writer')

  const heroTitle = page?.heroTitle    || FB.heroTitle
  const heroSub   = page?.heroSubtitle || FB.heroSubtitle

  const books: BookEntry[] = page?.books?.length
    ? page.books.map((b) => ({
        bookTitle:       b.bookTitle,
        bookDescription: b.bookDescription,
        coverUrl:        mediaUrl(b.bookCover),
        amazonLink:      b.amazonLink,
        flipkartLink:    b.flipkartLink,
        otherStoreLink:  b.otherStoreLink,
        aboutTheBook:    b.aboutTheBook,
      }))
    : [
        {
          bookTitle:       page?.bookTitle    || FB.bookTitle,
          bookDescription: page?.bookDescription,
          coverUrl:        mediaUrl(page?.bookCover ?? null),
          amazonLink:      page?.amazonLink   || FB.amazonLink,
          flipkartLink:    page?.flipkartLink || FB.flipkartLink,
          otherStoreLink:  page?.otherStoreLink,
          fallbackDesc:    FB.bookDesc,
        },
      ]

  const sections = page?.additionalSections?.length
    ? page.additionalSections.map((s) => ({ title: s.sectionTitle, content: s.sectionContent }))
    : page?.writerSections?.length
    ? page.writerSections.map((s) => ({ title: s.title, content: s.content }))
    : null

  return (
    <BookTemplate
      heroTitle={heroTitle}
      heroSubtitle={heroSub}
      books={books}
      sections={sections}
      badge="Creative Writing"
    />
  )
}
