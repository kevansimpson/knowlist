import React, { useEffect, useState, useCallback } from 'react'
import type { NoteFile } from '@shared/types'
import PlainEditor from './editors/PlainEditor'
import WysiwygEditor from './editors/WysiwygEditor'

type EditorMode = 'wysiwyg' | 'plain'

interface Props {
  notePath: string | null
}

export default function Editor({ notePath }: Props): React.ReactElement {
  const [note, setNote] = useState<NoteFile | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [dirty, setDirty] = useState(false)
  const [mode, setMode] = useState<EditorMode>(
    () => (localStorage.getItem('editorMode') as EditorMode) ?? 'plain'
  )

  useEffect(() => {
    if (!notePath || !window.api) {
      setNote(null)
      return
    }
    window.api.readNote(notePath).then((n) => {
      setNote(n)
      setTitle(n.title)
      setBody(n.body)
      setDirty(false)
    })
  }, [notePath])

  const save = useCallback(async () => {
    if (!notePath || !window.api || !dirty) return
    await window.api.writeNote(notePath, title, body)
    setDirty(false)
  }, [notePath, title, body, dirty])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  function handleModeChange(newMode: EditorMode) {
    setMode(newMode)
    localStorage.setItem('editorMode', newMode)
  }

  if (!notePath) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Select a note
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-8 pb-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
        <input
          className="selectable text-2xl font-semibold text-neutral-900 dark:text-neutral-100 bg-transparent outline-none flex-1"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
        />
        <span className="text-xs text-neutral-400 shrink-0">
          {dirty ? 'Unsaved changes' : 'Saved'}
        </span>
        <div className="flex text-xs border border-neutral-200 dark:border-neutral-700 rounded overflow-hidden shrink-0">
          {(['plain', 'wysiwyg'] as EditorMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-2 py-1 capitalize transition-colors ${
                mode === m
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {mode === 'plain' && (
          <PlainEditor body={body} onChange={(b) => { setBody(b); setDirty(true) }} />
        )}
        {mode === 'wysiwyg' && (
          <WysiwygEditor body={body} onChange={(b) => { setBody(b); setDirty(true) }} />
        )}
      </div>
    </div>
  )
}