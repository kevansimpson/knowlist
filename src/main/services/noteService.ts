import { join, relative, basename } from 'path'
import { readdir, stat } from 'fs/promises'
import type { FolderNode, NoteSummary } from '@shared/types'

const IGNORED = new Set(['.git', '_attachments', 'node_modules'])
const NOTE_EXT = '.md'

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
