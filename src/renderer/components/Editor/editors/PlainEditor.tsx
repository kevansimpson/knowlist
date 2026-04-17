import React from 'react'
import { EditorProps } from './types'

export default function PlainEditor({ body, onChange }: EditorProps): React.ReactElement {
  return (
    <textarea
      className="selectable w-full h-full text-sm text-neutral-700 dark:text-neutral-300 bg-transparent outline-none resize-none leading-relaxed font-mono"
      value={body}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}