import React, { useState } from 'react'
import { FilePlus, FolderPlus } from 'lucide-react'

interface Props {
  vaultPath: string
  selectedFolder: string | null
  onSearch: (query: string) => void
  onNoteCreated: (notePath: string) => void
  onDirCreated: () => void
}

export default function PanelToolbar({
  vaultPath,
  selectedFolder,
  onSearch,
  onNoteCreated,
  onDirCreated,
}: Props): React.ReactElement {
  const [search, setSearch] = useState('')
  const [namingDir, setNamingDir] = useState(false)
  const [dirName, setDirName] = useState('')

  const targetFolder = selectedFolder ?? vaultPath

  async function handleNewNote() {
    const notePath = await window.api.createNote(targetFolder, 'Untitled')
    onNoteCreated(notePath)
  }

  async function handleDirConfirm() {
    if (!dirName.trim()) {
      setNamingDir(false)
      return
    }
    const fullPath = `${targetFolder}/${dirName.trim()}`
    console.log('creating dir:', fullPath)
    alert(`creating: ${fullPath}`)
    const result = await window.api.createDir(fullPath)
    console.log('result:', result)
    alert(`result: ${result}`)
    setDirName('')
    setNamingDir(false)
    onDirCreated()
  }

  return (
    <div className="flex flex-col border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-1 px-2 py-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); onSearch(e.target.value) }}
          className="selectable flex-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1 outline-none placeholder-neutral-400"
        />
        <button
          onClick={handleNewNote}
          title="New note"
          className="text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200 p-1 rounded"
        >
          <FilePlus size={15} />
        </button>
        <button
          onClick={() => { setNamingDir(true); setDirName('') }}
          title="New folder"
          disabled={!selectedFolder}
          className="text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FolderPlus size={15} />
        </button>
      </div>

      {namingDir && (
        <div className="flex items-center gap-1 px-2 pb-2">
          <input
            autoFocus
            type="text"
            placeholder="Folder name..."
            value={dirName}
            onChange={(e) => setDirName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDirConfirm()
              if (e.key === 'Escape') { setNamingDir(false); setDirName('') }
            }}
            className="selectable flex-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1 outline-none placeholder-neutral-400"
          />
          <button
            onClick={handleDirConfirm}
            className="text-xs text-neutral-600 hover:text-neutral-900 px-2 py-1"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}