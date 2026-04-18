import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {
  isExternalLink,
  resolveMarkdownLink,
  resolveWikiLink } from '../../../utils/linkResolver'
import type { EditorProps } from './types'

interface WysiwygProps extends EditorProps {
  notePath: string
  vaultPath: string
  onNoteOpen: (path: string) => void
}

export default function WysiwygEditor({ body, notePath, vaultPath, onNoteOpen }: WysiwygProps): React.ReactElement {
  async function handleLinkClick(href: string) {
    if (href.startsWith('about:blank#wiki:')) {
      const raw = decodeURIComponent(href.replace('about:blank#wiki:', ''))
      const index = await window.api.searchNotes(vaultPath, '')
      const resolved = resolveWikiLink(raw, vaultPath, index)
      if (resolved) {
        onNoteOpen(resolved.path)
      } else {
        alert('Wiki-link target not found: ' + raw)
      }
      return
    }

    if (isExternalLink(href)) {
      await window.api.openExternal(href)
      return
    }

    const resolved = resolveMarkdownLink(href, notePath)
    const exists = await window.api.noteExists(resolved)
    if (exists) {
      onNoteOpen(resolved)
    } else {
      console.warn('Link target not found:', resolved)
    }
  }

  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target.classList.contains('wiki-link')) {
      const raw = decodeURIComponent(target.dataset.target ?? '')
      if (raw) handleWikiClick(raw)
    }
  }

  async function handleWikiClick(raw: string) {
    const index = await window.api.searchNotes(vaultPath, '')
    const resolved = resolveWikiLink(raw, vaultPath, index)
    if (resolved) {
      onNoteOpen(resolved.path)
    } else {
      alert('Wiki-link target not found: ' + raw)
    }
  }

  function preprocessWikiLinks(content: string): string {
    return content.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
      const parts = inner.trim().split('/')
      const displayTitle = parts[parts.length - 1].replace(/\.md$/, '')
      return `<span class="wiki-link" data-target="${encodeURIComponent(inner.trim())}">${displayTitle}</span>`
    })
  }

  function LinkRenderer(props: React.ComponentPropsWithoutRef<'a'>) {
    const { href: hrefProp, children } = props
    return (
      <a
        href={hrefProp}
        onClick={(e) => {
          e.preventDefault()
          if (hrefProp) handleLinkClick(hrefProp)
        }}
        className="cursor-pointer"
      >
        {children}
      </a>
    )
  }

  return (
    <div
      className="selectable prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed"
      onClick={handleContainerClick}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ a: LinkRenderer }}
      >
        {preprocessWikiLinks(body)}
      </ReactMarkdown>
    </div>
  )
}