import React, { useState, useRef } from 'react'
import FolderTree from './FolderTree'
import PanelToolbar from './PanelToolbar'
import Editor from '../Editor/Editor'

interface Props {
  vaultPath: string
}

export default function Layout({ vaultPath }: Props): React.ReactElement {
  const [panelOpen, setPanelOpen] = useState(true)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [treeKey, setTreeKey] = useState(0)
  const [panelWidth, setPanelWidth] = useState(256)
  const isResizing = useRef(false)

  function startResize(e: React.MouseEvent) {
    isResizing.current = true
    const startX = e.clientX
    const startWidth = panelWidth

    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return
      const newWidth = Math.max(150, Math.min(500, startWidth + e.clientX - startX))
      setPanelWidth(newWidth)
    }

    function onMouseUp() {
      isResizing.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        {panelOpen && (
          <div
            style={{ width: panelWidth }}
            className="shrink-0 border-r border-neutral-200 dark:border-neutral-700 flex flex-col relative"
          >
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
            <PanelToolbar
              vaultPath={vaultPath}
              selectedFolder={selectedFolder}
              notePath={selectedNote}
              onSearch={setSearchQuery}
              onNoteCreated={(notePath) => {
                setTreeKey((k) => k + 1)
                setSelectedNote(notePath)
              }}
              onDirCreated={() => setTreeKey((k) => k + 1)}
            />
            <div className="flex-1 overflow-y-auto">
              <FolderTree
                key={treeKey}
                vaultPath={vaultPath}
                selectedFolder={selectedFolder}
                onNoteSelect={(path) => {
                  setSelectedNote(path)
                  setSelectedFolder(null)
                }}
                searchQuery={searchQuery}
                onFolderSelect={(path) => {
                  setSelectedFolder(path)
                  setSelectedNote(null)
                }}
              />
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-2 text-sm text-neutral-400">
              Tags
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={startResize}
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 opacity-0 hover:opacity-100 transition-opacity"
            />
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
        <Editor
          notePath={selectedNote}
          selectedFolder={selectedFolder}
          vaultPath={vaultPath}
          onPathChange={(newPath) => {
            setSelectedNote(newPath)
            setTreeKey((k) => k + 1)
          }}
          onDelete={() => {
            setSelectedNote(null)
            setTreeKey((k) => k + 1)
          }}
        />

      </div>

      {/* Status bar */}
      <div className="h-6 shrink-0 border-t border-neutral-200 dark:border-neutral-700 flex items-center px-3 gap-3 text-xs text-neutral-400">
        <span>{vaultPath.split('/').pop()}</span>
        <span className="ml-auto">Saved</span>
      </div>
    </div>
  )
}