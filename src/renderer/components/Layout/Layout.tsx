import React, { useState } from 'react'
import Editor from "../Editor/Editor";
import FolderTree from './FolderTree'

interface Props {
  vaultPath: string
}

export default function Layout({ vaultPath }: Props): React.ReactElement {
  const [panelOpen, setPanelOpen] = useState(true)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        {panelOpen && (
          <div className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {vaultPath.split('/').pop()}
              </span>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xs"
              >
                ←
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
            <FolderTree
                vaultPath={vaultPath}
                onNoteSelect={setSelectedNote}
            />
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-2 text-sm text-neutral-400">
              Tags
            </div>
          </div>
        )}

        {/* Panel collapsed toggle */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="w-6 shrink-0 border-r border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            →
          </button>
        )}

        {/* Editor */}
        <Editor notePath={selectedNote} />

      </div>

      {/* Status bar */}
      <div className="h-6 shrink-0 border-t border-neutral-200 dark:border-neutral-700 flex items-center px-3 gap-3 text-xs text-neutral-400">
        <span>{vaultPath.split('/').pop()}</span>
        <span className="ml-auto">Saved</span>
      </div>
    </div>
  )
}