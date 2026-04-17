import React, { useState } from 'react'
import { FilePlus, FolderPlus } from 'lucide-react'

interface Props {
  vaultPath: string
  selectedFolder: string | null
  notePath: string | null
  onSearch: (query: string) => void
  onNoteCreated: (notePath: string) => void
  onDirCreated: () => void
}

export default function PanelToolbar({
  vaultPath,
  selectedFolder,
  notePath,
  onSearch,
  onNoteCreated,
  onDirCreated,
}: Props): React.ReactElement {
  const [search, setSearch] = useState('')
  const [namingDir, setNamingDir] = useState(false)
  const [dirName, setDirName] = useState('')

  const targetFolder = selectedFolder ?? vaultPath
  const toolbarBtn = 'p-1.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'

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
    await window.api.createDir(fullPath)
    setDirName('')
    setNamingDir(false)
    onDirCreated()
  }

  return (
    <div className="flex flex-col border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
      <div className="flex items-center gap-1 px-2 py-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); onSearch(e.target.value) }}
          className="selectable flex-1 text-xs bg-white dark:bg-neutral-800 rounded px-2 py-1 outline-none placeholder-neutral-400"
        />
        <button
          onClick={handleNewNote}
          title="New note"
          className={toolbarBtn}
        >
          <FilePlus size={15} />
        </button>
        <button
          onClick={() => { setNamingDir(true); setDirName('') }}
          title="New folder"
          disabled={notePath !== null}
          className={toolbarBtn}
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
            className="selectable flex-1 text-xs bg-white dark:bg-neutral-800 rounded px-2 py-1 outline-none placeholder-neutral-400"
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