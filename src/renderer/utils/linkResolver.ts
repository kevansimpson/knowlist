import type { NoteIndex } from '@shared/types'

/**
 * Resolves both standard markdown links and wiki-links to absolute paths.
 * Standard markdown: [text](./relative/path.md)
 * Wiki-link: [[Note Title]]
 */

export function resolveMarkdownLink(
  rawPath: string,
  currentNotePath: string
): string {
  // Decode URL encoding and unescape backslash-escaped spaces
  const decoded = decodeURIComponent(rawPath).replace(/\\ /g, ' ')

  if (decoded.startsWith('./') || decoded.startsWith('../')) {
    // Relative path — resolve against current note's directory
    const currentDir = currentNotePath.substring(0, currentNotePath.lastIndexOf('/'))
    return resolvePath(currentDir, decoded)
  }

  // Absolute path
  return decoded
}

export function resolveWikiLink(
  raw: string,
  vaultPath: string,
  index: NoteIndex[]
): { path: string; displayTitle: string } | null {
  // raw is everything inside [[ ]]
  // Could be "Monday" or "Tasks/Monday"
  const lower = raw.toLowerCase().trim()

  // Try matching by vault-relative path first (e.g. "Tasks/Monday")
  const byPath = index.find(
    (e) => e.relativePath.replace(/\.md$/, '').toLowerCase() === lower
  )
  if (byPath) {
    const displayTitle = byPath.title
    return { path: byPath.path, displayTitle }
  }

  // Fallback: match by title (e.g. "Monday")
  const byTitle = index.find(
    (e) => e.title.toLowerCase() === lower
  )
  if (byTitle) {
    return { path: byTitle.path, displayTitle: byTitle.title }
  }

  return null
}

export function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')
}

/**
 * Resolves a relative path against a base directory.
 * Handles ../ segments.
 */
function resolvePath(baseDir: string, relativePath: string): string {
  const parts = [...baseDir.split('/'), ...relativePath.split('/')]
  const resolved: string[] = []

  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
    } else if (part !== '.') {
      resolved.push(part)
    }
  }

  return resolved.join('/')
}