import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* Helper: show a field when pageTemplate matches any of the provided template values */
const when =
  (...types: string[]) =>
  (data: Record<string, unknown>) =>
    types.includes(data?.pageTemplate as string)

/**
 * Shorthand to build a Payload RowLabel reference.
 * `field`  = primary field value to show (e.g. 'bookTitle')
 * `field2` = optional secondary field (e.g. 'role' for experiences)
 * `fallback` = prefix when fields are empty (e.g. 'Book')
 * `separator` = separator between field and field2 (default ' — ')
 */
function rl(
  field: string,
  fallback: string,
  field2?: string,
  separator?: string,
) {
  return {
    path: '@/components/RowLabel',
    exportName: 'RowLabel',
    clientProps: { field, fallback, ...(field2 ? { field2 } : {}), ...(separator ? { separator } : {}) },
  }
}

/* ─── Reusable block: Feature Tiles Section ─── */
const FeatureTilesBlock = {
  slug: 'feature-tiles',
  labels: { singular: 'Feature Tiles Section', plural: 'Feature Tiles Sections' },
  admin: { description: 'A section with a heading and glassmorphism feature cards. Drag to reorder.' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
      admin: { description: 'Small caps tag above the heading. e.g. "ABOUT THE BOOK" or "WHAT I OFFER"' },
    },
    {
      name: 'sectionHeading',
      type: 'text',
      label: 'Section Heading',
      admin: { description: 'Main heading. e.g. "What makes it special"' },
    },
    {
      name: 'tiles',
      type: 'array',
      label: 'Feature Tiles',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Add up to 6 tiles. Drag to reorder.',
        components: { RowLabel: rl('title', 'Tile') },
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image',
          admin: { description: 'Recommended: 64×64px PNG, SVG, or WebP icon.' },
        },
        {
          name: 'iconEmoji',
          type: 'text',
          label: 'Emoji Icon (if no image)',
          admin: { description: 'Alternative to image. Type an emoji e.g. 🎭 🌍 💡' },
        },
        { name: 'title',       type: 'text',     required: true, label: 'Tile Title',       admin: { description: 'e.g. "Authentic Voice"' } },
        { name: 'description', type: 'textarea', label: 'Tile Description', admin: { description: 'Short description shown below the title.' } },
      ],
    },
  ],
} as const

export default buildConfig({
  admin: { user: 'users' },

  collections: [
    /* ─── Users ─── */
    {
      slug: 'users',
      auth: true,
      admin: { group: 'Admin', useAsTitle: 'email' },
      fields: [],
    },

    /* ─── Media ─── */
    {
      slug: 'media',
      admin: {
        group: 'Content',
        defaultColumns: ['filename', 'mimeType', 'filesize'],
        description: 'Images and files uploaded for use across the site.',
      },
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
        imageSizes: [
          { name: 'thumbnail',    width: 400,  height: 400, position: 'centre' },
          { name: 'hero',         width: 400,  height: 400, position: 'centre' },
          { name: 'blogFeatured', width: 1200, height: 630, position: 'centre' },
          { name: 'bookCover',    width: 400,  height: 600, position: 'centre' },
          { name: 'tileIcon',     width: 64,   height: 64,  position: 'centre' },
        ],
      },
      fields: [{ name: 'alt', type: 'text', label: 'Alt text' }],
    },

    /* ─── Blog Posts ─── */
    {
      slug: 'blog-posts',
      admin: {
        group: 'Content',
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'publishedDate', 'tags'],
        description: 'Blog posts shown on /blog. Set status to Published to make them live.',
        preview: (doc: Record<string, unknown>) => {
          const slug = doc?.slug as string
          if (!slug) return null
          return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/blog/${slug}`
        },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          admin: {
            position: 'sidebar',
            description: 'Auto-generated from title if left blank. Edit to customise the URL.',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }) => {
                if (!value && data?.title) {
                  return (data.title as string)
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                }
                return value
              },
            ],
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: '📝 Draft', value: 'draft' },
            { label: '✅ Published', value: 'published' },
          ],
          defaultValue: 'draft',
          required: true,
          admin: { position: 'sidebar', description: 'Switch to Published to make this post visible.' },
        },
        {
          name: 'publishedDate',
          type: 'date',
          admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'readTime',
          type: 'number',
          label: 'Read Time (min)',
          admin: {
            position: 'sidebar',
            description: 'Estimated read time. Leave blank to auto-estimate from excerpt.',
          },
        },
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Tags used for filtering on the blog page.',
            initCollapsed: true,
            components: { RowLabel: rl('tag', 'Tag') },
          },
          fields: [{ name: 'tag', type: 'text', required: false }],
        },
        { name: 'featuredImage', type: 'upload', relationTo: 'media', admin: { description: 'Recommended: 1200×630px landscape. Shown at the top of the post and in social media previews.' } },
        { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary shown on the blog listing card.' } },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description (SEO)', admin: { description: 'Used for search engine results. Falls back to Excerpt if blank.' } },
        { name: 'content', type: 'richText', editor: lexicalEditor({}) },
      ],
      hooks: {
        afterChange: [
          async ({ doc }: { doc: Record<string, unknown> }) => {
            if (doc.status === 'published') {
              const secret = process.env.REVALIDATION_SECRET
              const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
              if (secret) {
                try {
                  await fetch(`${serverUrl}/api/revalidate?secret=${encodeURIComponent(secret)}&path=/blog`)
                } catch { /* silent — revalidation is best-effort */ }
              }
            }
          },
        ],
      },
    },

    /* ─── Pages ─── */
    {
      slug: 'pages',
      admin: {
        group: 'Content',
        useAsTitle: 'pageName',
        defaultColumns: ['pageName', 'pageTemplate', 'slug', 'updatedAt'],
        description: 'One document per page. Choose a template, set the URL slug, then fill in the fields for that template.',
      },
      fields: [
        /* ── Identity ── */
        {
          name: 'pageName',
          type: 'text',
          required: true,
          label: 'Page Name',
          admin: {
            description: 'Internal name — e.g. "Five Days Forever" or "SAP Page". Shown in the admin list.',
          },
        },

        /* ── Template selector (sidebar) ── */
        {
          name: 'pageTemplate',
          type: 'select',
          required: false,
          admin: {
            position: 'sidebar',
            description: 'Choose the layout template for this page.',
          },
          options: [
            { label: '🏠 Home',                        value: 'home' },
            { label: '📚 Book / Publication',           value: 'book' },
            { label: '🏆 Expertise / Skills',           value: 'expertise' },
            { label: '📄 Standard / General',           value: 'standard' },
            { label: '📬 Contact',                     value: 'contact' },
            { label: '📝 Blog Index',                  value: 'blog-index' },
          ],
        },

        /* ── URL slug (sidebar) ── */
        {
          name: 'slug',
          type: 'text',
          label: 'Page URL',
          required: false,
          unique: true,
          admin: {
            description: 'The URL slug for this page. e.g. "writer" → /writer. Lowercase, hyphens only. Auto-generated from Page Name if left blank.',
            position: 'sidebar',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }: { value?: string; data?: Record<string, unknown> }) => {
                if (!value && data?.pageName && typeof data.pageName === 'string') {
                  return (data.pageName as string)
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                }
                return value
              },
            ],
          },
        },

        /* ═══════════════════════════════════════════
           SHARED — visible for all page types
        ═══════════════════════════════════════════ */
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Page Heading',
          admin: { description: 'Main heading shown on the page.' },
        },
        {
          name: 'heroSubtitle',
          type: 'text',
          label: 'Page Subheading',
        },

        /* ── Page Sections (blocks) — always visible, applies to all templates ── */
        {
          name: 'pageSections',
          type: 'blocks',
          label: 'Page Sections',
          blocks: [FeatureTilesBlock],
          admin: {
            description: 'Add and reorder content sections for this page. Drag to reorder.',
            initCollapsed: true,
          },
        },

        /* ═══════════════════════════════════════════
           HOME PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'heroGreeting',
          type: 'text',
          label: 'Hero Greeting (e.g. "Hi, It\'s Me")',
          admin: { condition: when('home') },
        },
        {
          name: 'heroName',
          type: 'text',
          label: 'Hero Name (e.g. "Sabareesh")',
          admin: { condition: when('home') },
        },
        {
          name: 'heroBio',
          type: 'textarea',
          label: 'Hero Bio (short tagline)',
          admin: { condition: when('home') },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Profile / Hero Image',
          admin: { condition: when('home'), description: 'Recommended: 400×400px square. Displays as a circular cropped image in the hero section.' },
        },
        {
          name: 'typewriterWords',
          type: 'array',
          label: 'Typewriter Words (rotating roles)',
          admin: {
            condition: when('home'),
            description: 'Each entry cycles through the typewriter animation in the hero.',
            initCollapsed: true,
            components: { RowLabel: rl('word', 'Role') },
          },
          fields: [{ name: 'word', type: 'text', label: 'Word / Role (e.g. "Writer")', required: true }],
        },
        {
          name: 'skillTiles',
          type: 'array',
          label: 'Skill Tiles (floating cards)',
          admin: {
            condition: when('home'),
            description: 'Four cards that float around the profile photo. Max 4 items.',
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Tile') },
          },
          fields: [
            { name: 'label',     type: 'text',   label: 'Label (e.g. "Writer")', required: true },
            { name: 'icon',      type: 'text',   label: 'Icon key or emoji (e.g. book | circuit | chart | robot | ✍️)', admin: { description: 'Used if no icon image is uploaded below.' } },
            { name: 'iconImage', type: 'upload', relationTo: 'media', label: 'Tile Icon Image (optional)', admin: { description: 'Recommended: 64×64px PNG or SVG. Shown instead of the icon key/emoji above when uploaded.' } },
            { name: 'link',      type: 'text',   label: 'Link URL (e.g. /writer)' },
          ],
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'Hero CTA Buttons',
          admin: {
            condition: when('home'),
            description: 'Buttons shown in the hero section. Primary = solid blue, Ghost = outlined.',
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Button') },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url',   type: 'text', label: 'URL (e.g. /contact or #about)' },
            { name: 'style', type: 'select', options: [
              { label: 'Primary (solid blue)', value: 'primary' },
              { label: 'Ghost (outlined)', value: 'ghost' },
            ]},
          ],
        },
        {
          name: 'homeSocialLinks',
          type: 'group',
          label: 'Hero Social Links',
          admin: {
            condition: when('home'),
            description: 'Overrides Site Settings social links on the home hero. Leave blank to use Site Settings.',
          },
          fields: [
            { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
            { name: 'twitter',  type: 'text', label: 'Twitter / X URL' },
            { name: 'github',   type: 'text', label: 'GitHub URL' },
            { name: 'email',    type: 'text', label: 'Email Address' },
          ],
        },
        {
          name: 'aboutTitle',
          type: 'text',
          label: 'About Section Heading',
          admin: { condition: when('home', 'standard') },
        },
        {
          name: 'aboutBio',
          type: 'richText',
          label: 'About Section Body',
          editor: lexicalEditor({}),
          admin: { condition: when('home', 'standard') },
        },
        {
          name: 'achievements',
          type: 'array',
          label: 'Achievement Badges',
          admin: {
            condition: when('home'),
            description: 'Short achievement labels displayed as pill badges in the About section.',
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Achievement') },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'icon',  type: 'text', label: 'Icon (emoji, optional)' },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stat Cards',
          admin: {
            condition: when('home'),
            description: 'Numbers shown below the About bio (e.g. "50+ Blogs Written").',
            initCollapsed: true,
            components: { RowLabel: rl('value', 'Stat', 'label', ' ') },
          },
          fields: [
            { name: 'value', type: 'text', label: 'Value (e.g. "50+")', required: true },
            { name: 'label', type: 'text', label: 'Label (e.g. "Blogs Written")' },
          ],
        },

        /* ═══════════════════════════════════════════
           WRITER PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'bookTitle',
          type: 'text',
          label: 'Book Title (legacy — use Books array below)',
          admin: { condition: () => false },
        },
        {
          name: 'bookDescription',
          type: 'richText',
          label: 'Book Description (legacy)',
          editor: lexicalEditor({}),
          admin: { condition: () => false },
        },
        {
          name: 'bookCover',
          type: 'upload',
          relationTo: 'media',
          label: 'Book Cover Image (legacy)',
          admin: { condition: when('writer'), description: 'Recommended: 400×600px portrait (2:3 ratio). Use the Books array below for new books.' },
        },
        {
          name: 'amazonLink',
          type: 'text',
          label: 'Amazon Buy Link (legacy)',
          admin: { condition: () => false },
        },
        {
          name: 'flipkartLink',
          type: 'text',
          label: 'Flipkart Buy Link (legacy)',
          admin: { condition: () => false },
        },
        {
          name: 'otherStoreLink',
          type: 'text',
          label: 'Other Store Link (legacy)',
          admin: { condition: () => false },
        },
        {
          name: 'writerSections',
          type: 'array',
          label: 'Content Sections (legacy — use Additional Sections below)',
          admin: {
            condition: when('writer'),
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Section') },
          },
          fields: [
            { name: 'title',   type: 'text' },
            { name: 'content', type: 'richText', editor: lexicalEditor({}) },
          ],
        },
        {
          name: 'books',
          type: 'array',
          label: 'Books',
          admin: {
            condition: when('book'),
            description: 'Add one entry per book. Each renders as its own showcase section on the page.',
            initCollapsed: false,
            components: { RowLabel: rl('bookTitle', 'Book') },
          },
          fields: [
            { name: 'bookTitle',       type: 'text',     label: 'Book Title', required: true },
            { name: 'bookCategory',    type: 'text',     label: 'Book Category Label', admin: { description: 'Shown above the title in caps. e.g. "DEBUT NOVEL · FICTION"' } },
            { name: 'bookDescription', type: 'richText', label: 'Book Description', editor: lexicalEditor({}) },
            { name: 'bookCover',       type: 'upload',   relationTo: 'media', label: 'Book Cover Image', admin: { description: 'Recommended: 400×600px portrait (2:3 ratio).' } },
            { name: 'amazonLink',      type: 'text',     label: 'Amazon Buy Link' },
            { name: 'flipkartLink',    type: 'text',     label: 'Flipkart Buy Link' },
            { name: 'otherStoreLink',  type: 'text',     label: 'Other Store Link' },
            {
              name: 'genres',
              type: 'array',
              label: 'Genre Tags',
              admin: {
                description: 'Tags shown below the book title. e.g. Literary Fiction, Coming of Age, Indian Author',
                components: { RowLabel: rl('genre', 'Tag') },
              },
              fields: [
                { name: 'genre', type: 'text', required: true, admin: { description: 'e.g. Literary Fiction' } },
              ],
            },
            { name: 'aboutTheBook',    type: 'richText', label: 'About the Book', editor: lexicalEditor({}) },
          ],
        },
        {
          name: 'additionalSections',
          type: 'array',
          label: 'Additional Sections',
          admin: {
            condition: when('book', 'standard'),
            description: 'Extra content sections rendered below the main content.',
            initCollapsed: true,
            components: { RowLabel: rl('sectionTitle', 'Section') },
          },
          fields: [
            { name: 'sectionTitle',   type: 'text',     label: 'Section Title' },
            { name: 'sectionContent', type: 'richText', label: 'Section Content', editor: lexicalEditor({}) },
          ],
        },

        /* ═══════════════════════════════════════════
           SAP PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'certifications',
          type: 'array',
          label: 'Certifications',
          admin: {
            condition: when('expertise'),
            description: 'SAP certifications displayed as badge cards.',
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Certification') },
          },
          fields: [
            { name: 'title',      type: 'text', required: true },
            { name: 'issuer',     type: 'text' },
            { name: 'date',       type: 'text', label: 'Date (e.g. "2024")' },
            { name: 'badgeImage', type: 'upload', relationTo: 'media', admin: { description: 'Recommended: 200×200px square PNG or SVG.' } },
            { name: 'link',       type: 'text', label: 'Certificate URL' },
          ],
        },
        {
          name: 'communityBlogs',
          type: 'array',
          label: 'SAP Community Blog Posts',
          admin: {
            condition: when('expertise'),
            description: 'Blog posts published on SAP Community or other platforms.',
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Blog Post') },
          },
          fields: [
            { name: 'title',    type: 'text', required: true },
            { name: 'url',      type: 'text', label: 'Blog URL' },
            { name: 'platform', type: 'text', label: 'Platform (e.g. "SAP Community")' },
            { name: 'date',     type: 'text', label: 'Date (e.g. "Jan 2024")' },
            {
              name: 'tags',
              type: 'array',
              admin: {
                initCollapsed: true,
                components: { RowLabel: rl('tag', 'Tag') },
              },
              fields: [{ name: 'tag', type: 'text' }],
            },
            { name: 'excerpt', type: 'textarea' },
          ],
        },
        {
          name: 'approachTitle',
          type: 'text',
          label: 'Approach Section Title',
          admin: { condition: when('expertise') },
        },
        {
          name: 'approachContent',
          type: 'richText',
          label: 'Approach Content',
          editor: lexicalEditor({}),
          admin: { condition: when('expertise') },
        },
        {
          name: 'sapSections',
          type: 'array',
          label: 'Approach Cards',
          admin: {
            condition: when('expertise'),
            description: 'Cards describing the SAP methodology.',
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Card') },
          },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },

        /* ═══════════════════════════════════════════
           GROWTH PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'experiences',
          type: 'array',
          label: 'Work Experiences',
          admin: {
            condition: when('expertise'),
            description: 'Each experience renders as a card with role, duration, and highlights.',
            initCollapsed: true,
            components: { RowLabel: rl('company', 'Experience', 'role') },
          },
          fields: [
            { name: 'company',     type: 'text', required: true },
            { name: 'role',        type: 'text' },
            { name: 'duration',    type: 'text', label: 'Duration (e.g. "2022 – Present")' },
            { name: 'description', type: 'textarea' },
            {
              name: 'highlights',
              type: 'array',
              label: 'Key Highlights',
              admin: {
                initCollapsed: true,
                components: { RowLabel: rl('item', 'Highlight') },
              },
              fields: [{ name: 'item', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'skills',
          type: 'array',
          label: 'Skill Cards',
          admin: {
            condition: when('expertise'),
            description: 'Marketing skill areas shown as cards on the Growth page.',
            initCollapsed: true,
            components: { RowLabel: rl('category', 'Skill') },
          },
          fields: [
            { name: 'category',    type: 'text', label: 'Skill Name', required: true },
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'growthStats',
          type: 'array',
          label: 'Stats / Highlights',
          admin: {
            condition: when('expertise'),
            description: 'Key metrics displayed as a stat row.',
            initCollapsed: true,
            components: { RowLabel: rl('metric', 'Stat', 'label', ' ') },
          },
          fields: [
            { name: 'metric', type: 'text', label: 'Metric Value (e.g. "50+")', required: true },
            { name: 'label',  type: 'text', label: 'Metric Label (e.g. "Blogs Published")' },
          ],
        },

        /* ═══════════════════════════════════════════
           AGENTIC AI PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'expertise',
          type: 'array',
          label: 'Expertise Cards',
          admin: {
            condition: when('expertise'),
            description: 'Core capability cards (RAG Systems, Vibe Coding, etc.).',
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Expertise') },
          },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'aiProjects',
          type: 'array',
          label: 'AI Projects',
          admin: {
            condition: when('expertise'),
            description: 'Showcase projects with title, status (Live/Beta/WIP), and optional link.',
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Project', 'status') },
          },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'status',      type: 'select', options: [
              { label: 'Live', value: 'Live' },
              { label: 'Beta', value: 'Beta' },
              { label: 'WIP',  value: 'WIP'  },
            ]},
            {
              name: 'tags',
              type: 'array',
              admin: {
                initCollapsed: true,
                components: { RowLabel: rl('tag', 'Tag') },
              },
              fields: [{ name: 'tag', type: 'text' }],
            },
            { name: 'link', type: 'text', label: 'Project URL (optional)' },
          ],
        },
        {
          name: 'services',
          type: 'array',
          label: 'Services Offered',
          admin: {
            condition: when('expertise'),
            initCollapsed: true,
            components: { RowLabel: rl('title', 'Service') },
          },
          fields: [
            { name: 'title',       type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'toolStack',
          type: 'array',
          label: 'Tool Stack (chips)',
          admin: {
            condition: when('expertise'),
            description: 'Tools and technologies displayed as chips below the projects.',
            initCollapsed: true,
            components: { RowLabel: rl('tool', 'Tool') },
          },
          fields: [{ name: 'tool', type: 'text', required: true }],
        },

        /* ═══════════════════════════════════════════
           BLOG PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'featuredPost',
          type: 'relationship',
          relationTo: 'blog-posts',
          label: 'Featured / Pinned Post',
          admin: { condition: when('blog-index') },
        },

        /* ═══════════════════════════════════════════
           CONTACT PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'contactEmail',
          type: 'text',
          label: 'Email Address',
          admin: { condition: when('contact') },
        },
        {
          name: 'contactLinkedin',
          type: 'text',
          label: 'LinkedIn URL',
          admin: { condition: when('contact') },
        },
        {
          name: 'contactTwitter',
          type: 'text',
          label: 'Twitter / X URL',
          admin: { condition: when('contact') },
        },
        {
          name: 'contactGithub',
          type: 'text',
          label: 'GitHub URL',
          admin: { condition: when('contact') },
        },
        {
          name: 'availability',
          type: 'text',
          label: 'Availability Note (e.g. "Open to freelance & consulting")',
          admin: { condition: when('contact') },
        },
        {
          name: 'formTitle',
          type: 'text',
          label: 'Contact Form Title',
          admin: { condition: when('contact') },
        },
        {
          name: 'subjectOptions',
          type: 'array',
          label: 'Contact Form Subject Options',
          admin: {
            condition: when('contact'),
            description: 'Options in the Subject dropdown of the contact form.',
            initCollapsed: true,
            components: { RowLabel: rl('subject', 'Subject') },
          },
          fields: [{ name: 'subject', type: 'text', required: true }],
        },

        /* ═══════════════════════════════════════════
           SEO — all page types
        ═══════════════════════════════════════════ */
        {
          name: 'seo',
          type: 'group',
          label: 'SEO',
          admin: {
            description: 'Controls what search engines and social platforms display for this page.',
          },
          fields: [
            { name: 'seoTitle',       type: 'text',     label: 'SEO Title', admin: { description: 'Shown in browser tab and Google results. Defaults to page title if blank.' } },
            { name: 'seoDescription', type: 'textarea', label: 'SEO Description', admin: { description: 'Shown in Google results. 150–160 characters recommended.' } },
            { name: 'ogImage',        type: 'upload',   relationTo: 'media', label: 'Open Graph Image', admin: { description: 'Image shown when this page is shared on social media (1200×630px recommended).' } },
          ],
        },

        /* ═══════════════════════════════════════════
           LEGACY — hidden fields kept for compat
        ═══════════════════════════════════════════ */
        {
          name: 'sections',
          type: 'array',
          label: 'Generic Sections (legacy)',
          admin: { condition: () => false },
          fields: [
            { name: 'title',       type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'icon',        type: 'text' },
            { name: 'link',        type: 'text' },
          ],
        },
      ],
    },
  ],

  /* ─── Globals ─── */
  globals: [
    /* ─── Header ─── */
    {
      slug: 'header',
      label: 'Header',
      admin: {
        group: 'Site Global',
        description: 'Site header — logo text and navigation links.',
      },
      fields: [
        {
          name: 'logoText',
          type: 'text',
          label: 'Logo Text',
          defaultValue: 'SABAREESH',
          admin: { description: 'Text shown as the site logo in the top-left corner.' },
        },
        {
          name: 'logoLink',
          type: 'text',
          label: 'Logo Link',
          defaultValue: '/',
          admin: { description: 'Where clicking the logo navigates to.' },
        },
        {
          name: 'navLinks',
          type: 'array',
          label: 'Navigation Links',
          admin: {
            description: 'Main nav links shown in the header. Add sub-links to create a dropdown.',
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Link') },
          },
          fields: [
            { name: 'label',       type: 'text',     required: true, admin: { description: 'Text shown in the nav — e.g. "Writer"' } },
            { name: 'url',         type: 'text',     required: true, admin: { description: 'URL path — e.g. "/writer" or full URL for external links' } },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
            {
              name: 'subLinks',
              type: 'array',
              label: 'Sub-menu Links (optional)',
              admin: {
                description: 'Creates a dropdown under this nav item.',
                components: { RowLabel: rl('label', 'Sub-link') },
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url',   type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },

    /* ─── Footer ─── */
    {
      slug: 'footer',
      label: 'Footer',
      admin: {
        group: 'Site Global',
        description: 'Site footer — copyright text, links, and social URLs.',
      },
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: `© ${new Date().getFullYear()} SABAREESH. ALL RIGHTS RESERVED.`,
          admin: { description: 'Shown in the footer centre. Year is set here — update annually.' },
        },
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          admin: {
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Link') },
          },
          fields: [
            { name: 'label',        type: 'text',     required: true },
            { name: 'url',          type: 'text',     required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'socialLinks',
          type: 'group',
          label: 'Social Links',
          admin: { description: 'Used in the footer wordmark area.' },
          fields: [
            { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
            { name: 'twitter',  type: 'text', label: 'Twitter / X URL' },
            { name: 'github',   type: 'text', label: 'GitHub URL' },
            { name: 'email',    type: 'text', label: 'Email Address' },
          ],
        },
      ],
    },

    /* ─── Site Settings ─── */
    {
      slug: 'site-settings',
      label: 'Site Details',
      admin: {
        description: 'Global site configuration, SEO defaults, branding, and social links.',
      },
      fields: [
        /* ── Identity ── */
        { name: 'siteName',        type: 'text',     label: 'Site / Brand Name (e.g. "Sabareesh")' },
        { name: 'siteTitle',       type: 'text',     label: 'Site Title', admin: { description: 'Appears in the browser tab and search results. e.g. "Sabareesh | Writer & AI Developer"' } },
        { name: 'siteDescription', type: 'textarea', label: 'Site Description', admin: { description: 'Default meta description for SEO. 150–160 characters recommended.' } },
        { name: 'seoDescription',  type: 'textarea', label: 'Default SEO Description (legacy fallback)' },
        { name: 'favicon',         type: 'upload',   relationTo: 'media', label: 'Favicon', admin: { description: 'Recommended: 32×32px or 64×64px. Accepts .ico, .png, or .svg.' } },
        { name: 'ogImage',         type: 'upload',   relationTo: 'media', label: 'Default OG Image', admin: { description: 'Recommended: 1200×630px. Shown when sharing site links on social media.' } },
        { name: 'profileImage',    type: 'upload',   relationTo: 'media', label: 'Profile Image (used on home hero)', admin: { description: 'Recommended: 400×400px square. Displays as a circular cropped image.' } },

        /* ── Social links ── */
        {
          name: 'socialLinks',
          type: 'group',
          label: 'Social Links',
          admin: { description: 'Used in the site footer and home hero (unless overridden by Hero Social Links).' },
          fields: [
            { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
            { name: 'twitter',  type: 'text', label: 'Twitter / X URL' },
            { name: 'github',   type: 'text', label: 'GitHub URL' },
            { name: 'email',    type: 'text', label: 'Email Address' },
          ],
        },

        /* ── Navigation ── */
        {
          name: 'navLinks',
          type: 'array',
          label: 'Navigation Links',
          admin: {
            description: 'Leave empty to use the default nav. Order determines display order.',
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Link') },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href',  type: 'text', label: 'URL (e.g. /writer)' },
          ],
        },

        /* ── Footer ── */
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          admin: {
            initCollapsed: true,
            components: { RowLabel: rl('label', 'Link') },
          },
          fields: [
            { name: 'label',    type: 'text', required: true },
            { name: 'url',      type: 'text' },
            { name: 'external', type: 'checkbox', defaultValue: false, label: 'Open in new tab' },
          ],
        },

        /* ── Legacy fields kept for compatibility ── */
        { name: 'name',     type: 'text',     label: 'Name (legacy)', admin: { condition: () => false } },
        { name: 'bio',      type: 'textarea', admin: { condition: () => false } },
        { name: 'aboutText', type: 'richText', editor: lexicalEditor({}), admin: { condition: () => false } },
        { name: 'achievements', type: 'array', admin: { condition: () => false }, fields: [
          { name: 'label', type: 'text' },
          { name: 'icon',  type: 'text' },
        ]},
      ],
    },
  ],

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 3,
    },
    migrationDir: './migrations',
    prodMigrations: true,
  }),
  sharp,
})
