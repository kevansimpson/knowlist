import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { EditorProps } from './types'

export default function WysiwygEditor({ body }: EditorProps): React.ReactElement {
  return (
    <div className="selectable prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}