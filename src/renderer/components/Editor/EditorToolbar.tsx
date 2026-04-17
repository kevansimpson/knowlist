import React, { useState } from 'react'
import { Trash2, Tag, Paperclip, Pin } from 'lucide-react'

interface Props {
  notePath: string | null
  selectedFolder: string | null
  vaultPath: string
  onDelete: () => void
}

const toolbarBtn = 'p-1.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
const confirmBtn = 'p-1.5 rounded border border-red-300 text-red-500 bg-white dark:bg-neutral-900 hover:bg-red-50 transition-colors'

export default function EditorToolbar({
  notePath,
  selectedFolder,
  vaultPath,
  onDelete,
}: Props): React.ReactElement {
  const [confirming, setConfirming] = useState(false)

  const isFolder = selectedFolder !== null && selectedFolder !== vaultPath
  const target = notePath ?? (isFolder ? selectedFolder : null)
  const targetName = target ? target.split('/').pop() : null
  const hasTarget = target !== null

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    if (!target || !window.api) return

    if (notePath) {
      await window.api.deleteNote(notePath)
    } else if (isFolder && selectedFolder) {
      await window.api.deleteDir(selectedFolder)
    }

    setConfirming(false)
    onDelete()
  }

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
      <button disabled title="Tag" className={toolbarBtn}>
        <Tag size={14} />
      </button>
      <button disabled title="Attachment" className={toolbarBtn}>
        <Paperclip size={14} />
      </button>
      <button disabled title="Pin" className={toolbarBtn}>
        <Pin size={14} />
      </button>

      <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      {confirming && (
        <span className="text-xs text-red-500 mr-1">
          Delete &quot;{targetName}&quot;? This cannot be undone.
        </span>
      )}
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className={toolbarBtn}
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={!hasTarget}
        title={isFolder ? 'Delete folder' : 'Delete note'}
        className={confirming ? confirmBtn : toolbarBtn}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}