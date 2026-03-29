import React from 'react'
import { getImageUrl } from '@/lib/getImageUrl'

/* ─────────────────────────────────────────────
   Minimal Lexical JSON → React renderer.
   Handles the node types Payload's Lexical editor produces.
───────────────────────────────────────────── */

type TextFormat = number // bitmask: 1=bold 2=italic 4=code 8=underline 16=strikethrough

interface LexicalNode {
  type: string
  version?: number
  children?: LexicalNode[]
  // text nodes
  text?: string
  format?: TextFormat
  // heading
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  // list
  listType?: 'bullet' | 'number' | 'check'
  value?: number
  checked?: boolean
  // link
  url?: string
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  // horizontal rule, etc.
  direction?: string
}

interface LexicalRoot {
  root?: { children?: LexicalNode[] }
}

/* ── Text node with format bitmask ── */
function StyledText({ text, format }: { text: string; format?: TextFormat }) {
  if (!format) return <>{text}</>
  let node: React.ReactNode = text
  if (format & 1)  node = <strong>{node}</strong>
  if (format & 2)  node = <em>{node}</em>
  if (format & 4)  node = <code className="bg-[rgba(148,204,255,0.1)] px-1.5 py-0.5 rounded text-[#94ccff] text-[0.88em] font-mono">{node}</code>
  if (format & 8)  node = <u>{node}</u>
  if (format & 16) node = <s>{node}</s>
  return <>{node}</>
}

const HEADING_CLASSES: Record<string, string> = {
  h1: 'font-plus-jakarta font-extrabold text-[40px] text-white mt-10 mb-5 leading-tight',
  h2: 'font-plus-jakarta font-bold text-[32px] text-white mt-10 mb-4 leading-tight',
  h3: 'font-plus-jakarta font-bold text-[24px] text-white mt-8 mb-3',
  h4: 'font-plus-jakarta font-semibold text-[20px] text-white mt-6 mb-3',
  h5: 'font-plus-jakarta font-semibold text-[18px] text-white mt-5 mb-2',
  h6: 'font-plus-jakarta font-semibold text-[16px] text-[#94a3b8] mt-5 mb-2 uppercase tracking-wide',
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return (
        <React.Fragment key={key}>
          <StyledText text={node.text ?? ''} format={node.format} />
        </React.Fragment>
      )

    case 'linebreak':
      return <br key={key} />

    case 'paragraph': {
      const children = node.children?.map(renderNode) ?? []
      const isEmpty = children.every((c) => c === null || c === undefined || c === '')
      if (isEmpty) return <div key={key} className="h-4" />
      return (
        <p key={key} className="font-inter text-[17px] text-[#94a3b8] leading-[1.8] mb-5">
          {children}
        </p>
      )
    }

    case 'heading': {
      const tag = node.tag ?? 'h2'
      return React.createElement(
        tag,
        { key, className: HEADING_CLASSES[tag] ?? HEADING_CLASSES.h2 },
        node.children?.map(renderNode),
      )
    }

    case 'list':
      return node.listType === 'number'
        ? <ol key={key} className="list-decimal pl-6 mb-5 space-y-2">{node.children?.map(renderNode)}</ol>
        : <ul key={key} className="list-disc pl-6 mb-5 space-y-2">{node.children?.map(renderNode)}</ul>

    case 'listitem':
      return (
        <li key={key} className="font-inter text-[17px] text-[#94a3b8] leading-[1.75]">
          {node.children?.map(renderNode)}
        </li>
      )

    case 'link':
    case 'autolink': {
      const href = node.fields?.url ?? node.url ?? '#'
      const external = node.fields?.newTab
      return (
        <a
          key={key}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-[#60a5fa] hover:text-[#94ccff] underline underline-offset-2 transition-colors duration-150"
        >
          {node.children?.map(renderNode)}
        </a>
      )
    }

    case 'quote':
    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-[#2563eb] pl-6 my-6 italic text-[#64748b]"
        >
          {node.children?.map(renderNode)}
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={key} className="border-[rgba(255,255,255,0.1)] my-8" />

    case 'upload': {
      // node.value is the populated Payload media document
      const media = (node as any).value
      const url = getImageUrl(media)
      if (!url) return null
      const caption = media?.caption
      return (
        <figure key={key} className="my-8">
          <img
            src={url}
            alt={media?.alt || media?.filename || 'image'}
            className="w-full max-w-full h-auto rounded-2xl border border-white/10 object-cover"
          />
          {caption && (
            <figcaption className="text-center text-white/40 text-sm mt-2 font-inter">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      // unknown node — recurse into children if present
      if (node.children?.length) {
        return (
          <React.Fragment key={key}>
            {node.children.map(renderNode)}
          </React.Fragment>
        )
      }
      return null
  }
}

export default function RichText({
  content,
  className = '',
}: {
  content: LexicalRoot | null | undefined
  className?: string
}) {
  if (!content?.root?.children?.length) return null
  return (
    <div className={className}>
      {content.root.children.map(renderNode)}
    </div>
  )
}
