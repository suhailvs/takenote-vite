import React from 'react'
// import ReactMarkdown from 'react-markdown'
import Markdown from 'react-markdown'
import { NoteItem } from '../../../client/types'

import { uuidPlugin } from '../../utils/reactMarkdownPlugins'
import 'github-markdown-css'

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
      <Markdown remarkPlugins={[uuidPlugin]} className={`previewer previewer_direction-${directionText}`}>
        {noteText}
      </Markdown>
    </div>
  )
}
