import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* Helper: only show a field when pageType matches */
const when =
  (...types: string[]) =>
  (data: Record<string, unknown>) =>
    types.includes(data?.pageType as string)

export default buildConfig({
  admin: { user: 'users' },

  collections: [
    /* ─── Users ─── */
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },

    /* ─── Media ─── */
    {
      slug: 'media',
      upload: { staticDir: path.resolve(dirname, 'public/media') },
      fields: [{ name: 'alt', type: 'text', label: 'Alt text' }],
    },

    /* ─── Blog Posts ─── */
    {
      slug: 'blog-posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'publishedDate'],
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
            description: 'Auto-generated from title if left blank.',
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
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
          admin: { position: 'sidebar' },
        },
        {
          name: 'publishedDate',
          type: 'date',
          admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
        },
        { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
        { name: 'featuredImage', type: 'upload', relationTo: 'media' },
        { name: 'excerpt', type: 'textarea' },
        { name: 'content', type: 'richText', editor: lexicalEditor({}) },
      ],
    },

    /* ─── Pages ─── */
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'pageType',
        defaultColumns: ['pageType', 'heroTitle'],
        description: 'One document per page. Use Page Type to select which page you are editing.',
      },
      fields: [
        /* ── Selector (always visible, sidebar) ── */
        {
          name: 'pageType',
          type: 'select',
          required: true,
          unique: true,
          admin: { position: 'sidebar' },
          options: [
            { label: '🏠 Home',        value: 'home' },
            { label: '✍️ Writer',      value: 'writer' },
            { label: '🔷 SAP',         value: 'sap' },
            { label: '📈 Growth',      value: 'growth' },
            { label: '🤖 Agentic AI',  value: 'agentic-ai' },
            { label: '📝 Blog',        value: 'blog' },
            { label: '📬 Contact',     value: 'contact' },
          ],
        },

        /* ═══════════════════════════════════════════
           SHARED — visible for most page types
        ═══════════════════════════════════════════ */
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Hero Title',
          admin: { condition: when('writer', 'sap', 'growth', 'agentic-ai', 'blog', 'contact') },
        },
        {
          name: 'heroSubtitle',
          type: 'text',
          label: 'Hero Subtitle',
          admin: { condition: when('writer', 'sap', 'growth', 'agentic-ai', 'blog', 'contact') },
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
          admin: { condition: when('home') },
        },
        {
          name: 'skillTiles',
          type: 'array',
          label: 'Skill Tiles (floating cards)',
          admin: { condition: when('home') },
          fields: [
            { name: 'label', type: 'text', label: 'Label (e.g. "Writer")' },
            { name: 'icon',  type: 'text', label: 'Icon (emoji or SVG name)' },
            { name: 'link',  type: 'text', label: 'Link URL (e.g. /writer)' },
          ],
        },
        {
          name: 'aboutTitle',
          type: 'text',
          label: 'About Section Heading',
          admin: { condition: when('home') },
        },
        {
          name: 'aboutBio',
          type: 'richText',
          label: 'About Section Body',
          editor: lexicalEditor({}),
          admin: { condition: when('home') },
        },
        {
          name: 'achievements',
          type: 'array',
          label: 'Achievement Badges',
          admin: { condition: when('home') },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'icon',  type: 'text', label: 'Icon (emoji)' },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stat Cards',
          admin: { condition: when('home') },
          fields: [
            { name: 'value', type: 'text', label: 'Value (e.g. "50+")' },
            { name: 'label', type: 'text', label: 'Label (e.g. "Blogs Written")' },
          ],
        },

        /* ═══════════════════════════════════════════
           WRITER PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'bookTitle',
          type: 'text',
          label: 'Book Title',
          admin: { condition: when('writer') },
        },
        {
          name: 'bookDescription',
          type: 'richText',
          label: 'Book Description',
          editor: lexicalEditor({}),
          admin: { condition: when('writer') },
        },
        {
          name: 'bookCover',
          type: 'upload',
          relationTo: 'media',
          label: 'Book Cover Image',
          admin: { condition: when('writer') },
        },
        {
          name: 'amazonLink',
          type: 'text',
          label: 'Amazon Buy Link',
          admin: { condition: when('writer') },
        },
        {
          name: 'flipkartLink',
          type: 'text',
          label: 'Flipkart Buy Link',
          admin: { condition: when('writer') },
        },
        {
          name: 'otherStoreLink',
          type: 'text',
          label: 'Other Store Link',
          admin: { condition: when('writer') },
        },
        {
          name: 'writerSections',
          type: 'array',
          label: 'Content Sections (About the Book, etc.)',
          admin: { condition: when('writer') },
          fields: [
            { name: 'title',   type: 'text' },
            { name: 'content', type: 'richText', editor: lexicalEditor({}) },
          ],
        },

        /* ═══════════════════════════════════════════
           SAP PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'certifications',
          type: 'array',
          label: 'Certifications',
          admin: { condition: when('sap') },
          fields: [
            { name: 'title',      type: 'text' },
            { name: 'issuer',     type: 'text' },
            { name: 'date',       type: 'text', label: 'Date (e.g. "2024")' },
            { name: 'badgeImage', type: 'upload', relationTo: 'media' },
            { name: 'link',       type: 'text', label: 'Certificate URL' },
          ],
        },
        {
          name: 'communityBlogs',
          type: 'array',
          label: 'SAP Community Blog Posts',
          admin: { condition: when('sap') },
          fields: [
            { name: 'title',    type: 'text' },
            { name: 'url',      type: 'text', label: 'Blog URL' },
            { name: 'platform', type: 'text', label: 'Platform (e.g. "SAP Community")' },
            { name: 'date',     type: 'text', label: 'Date (e.g. "Jan 2024")' },
            { name: 'tags',     type: 'array', fields: [{ name: 'tag', type: 'text' }] },
            { name: 'excerpt',  type: 'textarea' },
          ],
        },
        {
          name: 'approachTitle',
          type: 'text',
          label: 'Approach Section Title',
          admin: { condition: when('sap') },
        },
        {
          name: 'approachContent',
          type: 'richText',
          label: 'Approach Content',
          editor: lexicalEditor({}),
          admin: { condition: when('sap') },
        },
        {
          name: 'sapSections',
          type: 'array',
          label: 'Approach Cards',
          admin: { condition: when('sap') },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text' },
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
          admin: { condition: when('growth') },
          fields: [
            { name: 'company',     type: 'text' },
            { name: 'role',        type: 'text' },
            { name: 'duration',    type: 'text', label: 'Duration (e.g. "2022 – Present")' },
            { name: 'description', type: 'textarea' },
            {
              name: 'highlights',
              type: 'array',
              label: 'Key Highlights',
              fields: [{ name: 'item', type: 'text' }],
            },
          ],
        },
        {
          name: 'skills',
          type: 'array',
          label: 'Skill Cards',
          admin: { condition: when('growth') },
          fields: [
            { name: 'category',    type: 'text', label: 'Skill Name' },
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'growthStats',
          type: 'array',
          label: 'Stats / Highlights',
          admin: { condition: when('growth') },
          fields: [
            { name: 'metric', type: 'text', label: 'Metric Value (e.g. "50+")' },
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
          admin: { condition: when('agentic-ai') },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'aiProjects',
          type: 'array',
          label: 'AI Projects',
          admin: { condition: when('agentic-ai') },
          fields: [
            { name: 'icon',        type: 'text', label: 'Icon (emoji)' },
            { name: 'title',       type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'status',      type: 'select', options: [
              { label: 'Live', value: 'Live' },
              { label: 'Beta', value: 'Beta' },
              { label: 'WIP',  value: 'WIP'  },
            ]},
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
            { name: 'link', type: 'text', label: 'Project URL (optional)' },
          ],
        },
        {
          name: 'services',
          type: 'array',
          label: 'Services Offered',
          admin: { condition: when('agentic-ai') },
          fields: [
            { name: 'title',       type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'toolStack',
          type: 'array',
          label: 'Tool Stack (chips)',
          admin: { condition: when('agentic-ai') },
          fields: [{ name: 'tool', type: 'text' }],
        },

        /* ═══════════════════════════════════════════
           BLOG PAGE
        ═══════════════════════════════════════════ */
        {
          name: 'featuredPost',
          type: 'relationship',
          relationTo: 'blog-posts',
          label: 'Featured / Pinned Post',
          admin: { condition: when('blog') },
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
          admin: { condition: when('contact') },
          fields: [{ name: 'subject', type: 'text' }],
        },

        /* ═══════════════════════════════════════════
           LEGACY — kept for backward compat
        ═══════════════════════════════════════════ */
        {
          name: 'sections',
          type: 'array',
          label: 'Generic Sections (legacy)',
          admin: { condition: () => false }, // hidden — use page-specific fields
          fields: [
            { name: 'title',       type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'icon',        type: 'text' },
            { name: 'link',        type: 'text' },
          ],
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'CTA Buttons (legacy)',
          admin: { condition: () => false },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'url',   type: 'text' },
            { name: 'style', type: 'select', options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Ghost',   value: 'ghost' },
            ]},
          ],
        },
      ],
    },
  ],

  /* ─── Globals ─── */
  globals: [
    {
      slug: 'site-settings',
      label: 'Site Settings',
      admin: {
        description: 'Global settings — header, footer, SEO, social links.',
      },
      fields: [
        /* ── Identity ── */
        { name: 'siteName',       type: 'text',     label: 'Site / Brand Name (e.g. "Sabareesh")' },
        { name: 'seoDescription', type: 'textarea', label: 'Default SEO Description' },
        { name: 'profileImage',   type: 'upload',   relationTo: 'media', label: 'Profile Image' },

        /* ── Social links ── */
        {
          name: 'socialLinks',
          type: 'group',
          label: 'Social Links',
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
          admin: { description: 'Leave empty to use the default nav.' },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href',  type: 'text', label: 'URL (e.g. /writer)' },
          ],
        },

        /* ── Footer ── */
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          fields: [
            { name: 'label',    type: 'text' },
            { name: 'url',      type: 'text' },
            { name: 'external', type: 'checkbox', defaultValue: false },
          ],
        },

        /* ── Legacy fields kept for compatibility ── */
        { name: 'name',     type: 'text',     label: 'Name (legacy — use Site Name above)', admin: { condition: () => false } },
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
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
})
