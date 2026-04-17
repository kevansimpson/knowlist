import { join, relative, basename } from 'path'
import { mkdir, readFile, readdir, stat, writeFile } from 'fs/promises'
import type { FolderNode, NoteFile, NoteSummary } from '@shared/types'

const IGNORED = new Set(['.git', '_attachments', 'node_modules'])
const NOTE_EXT = '.md'

export async function createDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true })
}

export async function createNote(folderPath: string, title: string): Promise<string> {
  const filename = `${title}.md`
  const notePath = join(folderPath, filename)
  const now = new Date().toISOString()
  const content = `---\ntitle: ${title}\ncreated: ${now}\nmodified: ${now}\n---\n\n`
  await writeFile(notePath, content, 'utf-8')
  return notePath
}

export async function deleteDir(dirPath: string): Promise<void> {
  const { rm } = await import('fs/promises')
  await rm(dirPath, { recursive: true, force: true })
}

export async function deleteNote(notePath: string): Promise<void> {
  const { unlink } = await import('fs/promises')
  await unlink(notePath)
}

export async function getVaultTree(vaultPath: string): Promise<FolderNode> {
  async function walk(dirPath: string): Promise<FolderNode> {
    const entries = await readdir(dirPath, { withFileTypes: true })
    const children: FolderNode[] = []
    const notes: NoteSummary[] = []

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      if (IGNORED.has(entry.name)) continue

      const fullPath = join(dirPath, entry.name)

      if (entry.isDirectory()) {
        children.push(await walk(fullPath))
      } else if (entry.isFile() && entry.name.endsWith(NOTE_EXT)) {
        const stats = await stat(fullPath)
        notes.push({
          path: fullPath,
          title: basename(entry.name, NOTE_EXT),
          modified: stats.mtime.toISOString(),
        })
      }
    }

    return {
      name: basename(dirPath),
      path: dirPath,
      relativePath: relative(vaultPath, dirPath),
      children,
      notes,
    }
  }

  return walk(vaultPath)
}

export async function readNote(notePath: string): Promise<NoteFile> {
  const raw = await readFile(notePath, 'utf-8')

  // Strip YAML frontmatter if present
  let body = raw
  let title = basename(notePath, NOTE_EXT)

  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3)
    if (end !== -1) {
      const frontmatter = raw.slice(3, end)
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)
      if (titleMatch) title = titleMatch[1].trim()
      body = raw.slice(end + 3).trimStart()
    }
  }

  return { path: notePath, title, body }
}

export async function renameNote(oldPath: string, newTitle: string): Promise<string> {
  const dir = oldPath.substring(0, oldPath.lastIndexOf('/'))
  const newPath = `${dir}/${newTitle}.md`
  const { rename } = await import('fs/promises')
  await rename(oldPath, newPath)
  return newPath
}

export async function writeNote(notePath: string, title: string, body: string): Promise<void> {
  const existing = await readFile(notePath, 'utf-8')

  // Preserve existing frontmatter fields, just update title
  let frontmatter = `title: ${title}`
  if (existing.startsWith('---')) {
    const end = existing.indexOf('---', 3)
    if (end !== -1) {
      const block = existing.slice(3, end)
      // Replace title line if present, otherwise prepend it
      if (/^title:/m.test(block)) {
        frontmatter = block.replace(/^title:.+$/m, `title: ${title}`).trim()
      } else {
        frontmatter = `title: ${title}\n${block.trim()}`
      }
    }
  }

  const content = `---\n${frontmatter}\n---\n\n${body}`
  const { writeFile } = await import('fs/promises')
  await writeFile(notePath, content, 'utf-8')
}
