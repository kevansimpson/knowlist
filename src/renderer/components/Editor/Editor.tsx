import React, { useEffect, useState, useCallback } from 'react'
import type { NoteFile } from '@shared/types'

interface Props {
  notePath: string | null
}

export default function Editor({ notePath }: Props): React.ReactElement {
  const [note, setNote] = useState<NoteFile | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [dirty, setDirty] = useState(false)

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
      <div className="px-8 pt-8 pb-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        <input
          className="selectable text-2xl font-semibold text-neutral-900 dark:text-neutral-100 bg-transparent outline-none w-full"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
        />
        <span className="text-xs text-neutral-400 ml-4 shrink-0">
          {dirty ? 'Unsaved changes' : 'Saved'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <textarea
          className="selectable w-full h-full text-sm text-neutral-700 dark:text-neutral-300 bg-transparent outline-none resize-none leading-relaxed font-mono"
          value={body}
          onChange={(e) => { setBody(e.target.value); setDirty(true) }}
        />
      </div>
    </div>
  )
}
