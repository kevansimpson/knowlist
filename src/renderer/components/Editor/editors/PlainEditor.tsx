import React, { useState, useRef, useEffect } from 'react'
import type { EditorProps } from './types'
import type { NoteIndex } from '@shared/types'

interface PlainEditorProps extends EditorProps {
  vaultPath: string
}

export default function PlainEditor({ body, onChange, vaultPath }: PlainEditorProps): React.ReactElement {
  const [dropdown, setDropdown] = useState<NoteIndex[]>([])
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const [wikiQuery, setWikiQuery] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wikiQuery === null) {
      setDropdown([])
      return
    }
    window.api.searchNotes(vaultPath, wikiQuery).then((results) => {
      setDropdown(results.slice(0, 8))
      setSelectedIndex(0)
    })
  }, [wikiQuery, vaultPath])

  function getWikiQueryAtCursor(text: string, cursor: number): string | null {
    const before = text.slice(0, cursor)
    const match = before.match(/\[\[([^\]]*)$/)
    return match ? match[1] : null
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    onChange?.(val)
    const cursor = e.target.selectionStart ?? 0
    const query = getWikiQueryAtCursor(val, cursor)
    setWikiQuery(query)
    if (query !== null) updateDropdownPosition()
  }

  function updateDropdownPosition() {
    const textarea = textareaRef.current
    const container = containerRef.current
    if (!textarea || !container) return
    const containerRect = container.getBoundingClientRect()
    const textareaRect = textarea.getBoundingClientRect()
    setDropdownPos({
      top: textareaRect.top - containerRect.top + 24,
      left: textareaRect.left - containerRect.left,
    })
  }

  function insertWikiLink(note: NoteIndex) {
    const textarea = textareaRef.current
    if (!textarea) return
    const cursor = textarea.selectionStart ?? 0
    const before = body.slice(0, cursor)
    const after = body.slice(cursor)
    const match = before.match(/\[\[([^\]]*)$/)
    if (!match) return
    const start = before.lastIndexOf('[[')
    const insert = `[[${note.relativePath.replace(/\.md$/, '')}]]`
    const newBody = body.slice(0, start) + insert + after
    onChange?.(newBody)
    setWikiQuery(null)
    setDropdown([])
    setTimeout(() => {
      textarea.focus()
      const pos = start + insert.length
      textarea.setSelectionRange(pos, pos)
    }, 0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (dropdown.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, dropdown.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && dropdown.length > 0) {
      e.preventDefault()
      insertWikiLink(dropdown[selectedIndex])
    } else if (e.key === 'Escape') {
      setWikiQuery(null)
      setDropdown([])
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <textarea
        ref={textareaRef}
        className="selectable w-full h-full text-sm text-neutral-700 dark:text-neutral-300 bg-transparent outline-none resize-none leading-relaxed font-mono"
        value={body}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {dropdown.length > 0 && dropdownPos && (
        <div
          className="absolute z-50 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-lg w-72 max-h-48 overflow-y-auto"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {dropdown.map((note, i) => (
            <button
              key={note.path}
              onClick={() => insertWikiLink(note)}
              className={`w-full text-left px-3 py-1.5 text-sm flex flex-col ${
                i === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{note.title}</span>
              {note.folderPath && (
                <span className="text-xs text-neutral-400">{note.folderPath}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}