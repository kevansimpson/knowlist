import React, { useEffect, useState } from 'react'
import type { FolderNode, NoteSummary } from '@shared/types'

interface Props {
  vaultPath: string
  onNoteSelect: (path: string) => void
}

function NoteItem({ note, onSelect }: { note: NoteSummary; onSelect: (path: string) => void }) {
  return (
    <button
      onClick={() => onSelect(note.path)}
      className="w-full text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 truncate"
    >
      {note.title}
    </button>
  )
}

function FolderItem({
  node,
  onNoteSelect,
  depth,
}: {
  node: FolderNode
  onNoteSelect: (path: string) => void
  depth: number
}) {
  const [expanded, setExpanded] = useState(depth === 0)

  return (
    <div>
      {depth > 0 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1"
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          <span>{expanded ? '▾' : '▸'}</span>
          <span>{node.name}</span>
        </button>
      )}

      {(expanded || depth === 0) && (
        <div>
          {node.notes.map((note) => (
            <div key={note.path} style={{ paddingLeft: `${(depth + 1) * 12}px` }}>
              <NoteItem note={note} onSelect={onNoteSelect} />
            </div>
          ))}
          {node.children.map((child) => (
            <FolderItem
              key={child.path}
              node={child}
              onNoteSelect={onNoteSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FolderTree({ vaultPath, onNoteSelect }: Props): React.ReactElement {
  const [tree, setTree] = useState<FolderNode | null>(null)

  useEffect(() => {
    if (!window.api) return
    window.api.getVaultTree(vaultPath).then(setTree)
  }, [vaultPath])

  if (!tree) return <div className="p-2 text-xs text-neutral-400">Loading...</div>

  return (
    <div className="flex flex-col gap-0.5 p-1">
      <FolderItem node={tree} onNoteSelect={onNoteSelect} depth={0} />
    </div>
  )
}
