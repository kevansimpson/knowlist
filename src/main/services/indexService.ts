import type { NoteIndex, FolderNode } from '@shared/types'
import { getVaultTree } from './noteService'

function flattenTree(node: FolderNode, vaultPath: string): NoteIndex[] {
  const results: NoteIndex[] = []

  for (const note of node.notes) {
    const relativePath = note.path.replace(vaultPath + '/', '')
    const folderPath = node.relativePath
    results.push({
      title: note.title,
      path: note.path,
      relativePath,
      folderPath,
    })
  }

  for (const child of node.children) {
    results.push(...flattenTree(child, vaultPath))
  }

  return results
}

export async function searchIndex(
  vaultPath: string,
  query: string
): Promise<NoteIndex[]> {
  const tree = await getVaultTree(vaultPath)
  const all = flattenTree(tree, vaultPath)

  if (!query.trim()) return all

  const lower = query.toLowerCase()
  return all.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lower) ||
      entry.relativePath.toLowerCase().includes(lower)
  )
}