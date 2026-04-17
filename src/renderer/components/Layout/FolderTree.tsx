import React, { useEffect, useState } from 'react'
import type { FolderNode, NoteSummary } from '@shared/types'

interface Props {
  vaultPath: string
  onNoteSelect: (path: string) => void
  onFolderSelect: (path: string) => void
  searchQuery?: string
}

function noteMatchesQuery(note: NoteSummary, query: string): boolean {
  return note.title.toLowerCase().includes(query.toLowerCase())
}

function NoteItem({
  note,
  onSelect,
  active,
}: {
  note: NoteSummary
  onSelect: (path: string) => void
  active: boolean
}) {
  return (
    <button
      onClick={() => onSelect(note.path)}
      className={`w-full text-left px-2 py-1 rounded text-sm truncate transition-colors ${
        active
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
    >
      {note.title}
    </button>
  )
}

function FolderItem({
  node,
  onNoteSelect,
  onFolderSelect,
  depth,
  activeNote,
  searchQuery,
}: {
  node: FolderNode
  onNoteSelect: (path: string) => void
  onFolderSelect: (path: string) => void
  depth: number
  activeNote: string | null
  searchQuery?: string
}) {
  const [expanded, setExpanded] = useState(depth === 0)

  const filteredNotes = searchQuery
    ? node.notes.filter((n) => noteMatchesQuery(n, searchQuery))
    : node.notes

  const hasVisibleContent =
    filteredNotes.length > 0 ||
    node.children.some((c) => c.notes.length > 0 || c.children.length > 0)

  if (searchQuery && !hasVisibleContent) return null

  return (
    <div>
      {depth > 0 && (
        <button
          onClick={() => {
            setExpanded((e) => !e)
            onFolderSelect(node.path)
          }}
          className="w-full text-left py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1"
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          <span className="text-xs">{expanded ? '▾' : '▸'}</span>
          <span>{node.name}</span>
        </button>
      )}

      {(expanded || depth === 0) && (
        <div>
          {filteredNotes.map((note) => (
            <div key={note.path} style={{ paddingLeft: `${(depth + 1) * 12}px` }}>
              <NoteItem
                note={note}
                onSelect={onNoteSelect}
                active={activeNote === note.path}
              />
            </div>
          ))}
          {node.children.map((child) => (
            <FolderItem
              key={child.path}
              node={child}
              onNoteSelect={onNoteSelect}
              onFolderSelect={onFolderSelect}
              depth={depth + 1}
              activeNote={activeNote}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FolderTree({
  vaultPath,
  onNoteSelect,
  onFolderSelect,
  searchQuery,
}: Props): React.ReactElement {
  const [tree, setTree] = useState<FolderNode | null>(null)
  const [activeNote, setActiveNote] = useState<string | null>(null)

  useEffect(() => {
    if (!window.api) return
    window.api.getVaultTree(vaultPath).then(setTree)
  }, [vaultPath])

  function handleNoteSelect(path: string) {
    setActiveNote(path)
    onNoteSelect(path)
  }

  if (!tree) return <div className="p-2 text-xs text-neutral-400">Loading...</div>

  return (
    <div className="flex flex-col gap-0.5 p-1">
      <button
        onClick={() => onFolderSelect(vaultPath)}
        title={vaultPath}
        className="w-full text-left px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 truncate"
      >
        {vaultPath}
      </button>
      <FolderItem
        node={tree}
        onNoteSelect={handleNoteSelect}
        onFolderSelect={onFolderSelect}
        depth={0}
        activeNote={activeNote}
        searchQuery={searchQuery}
      />
    </div>
  )
}
