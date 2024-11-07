import React from 'react'
// import ReactMarkdown from 'react-markdown'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { NoteItem } from '../../../client/types'

import { uuidPlugin } from '../../utils/reactMarkdownPlugins'
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css';

// https://github.com/remarkjs/react-markdown/issues/339#issuecomment-653396337
// window.process = { cwd: () => '' };
(window as any).process = { cwd: () => '' };
export interface PreviewEditorProps {
  noteText: string
  directionText: string
  notes: NoteItem[]
}

export const PreviewEditor: React.FC<PreviewEditorProps> = ({ noteText, directionText, notes }) => {
  // ===========================================================================
  // Dispatch
  // ===========================================================================

  console.log(notes)
  return (
    <div className='markdown-body'>
      <Markdown remarkPlugins={[uuidPlugin, remarkGfm]} rehypePlugins={[rehypeHighlight]} className={`previewer previewer_direction-${directionText}`}>
        {noteText}
      </Markdown>
    </div>
  )
}
