import React from 'react'
// import ReactMarkdown from 'react-markdown'
import Markdown from 'react-markdown'
import { useDispatch } from 'react-redux'
// import remarkGfm from 'remark-gfm'; 
import { Folder } from '../../../client/utils/enums'
import { updateActiveNote, updateSelectedNotes, pruneNotes, swapFolder } from '../../../client/slices/note'
import { NoteItem } from '../../../client/types'

import { uuidPlugin } from '../../utils/reactMarkdownPlugins'
import 'github-markdown-css'
import NoteLink from './NoteLink'
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

  const dispatch = useDispatch()

  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    dispatch(updateSelectedNotes({ noteId, multiSelect }))

  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    dispatch(updateActiveNote({ noteId, multiSelect }))

  const _pruneNotes = () => dispatch(pruneNotes())

  const _swapFolder = (folder: Folder) => dispatch(swapFolder({ folder }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleNoteLinkClick = (e: React.SyntheticEvent, note: NoteItem) => {
    e.preventDefault()

    if (note) {
      _updateActiveNote(note.id, false)
      _updateSelectedNotes(note.id, false)
      _pruneNotes()

      if (note?.favorite) return _swapFolder(Folder.FAVORITES)
      if (note?.scratchpad) return _swapFolder(Folder.SCRATCHPAD)
      if (note?.trash) return _swapFolder(Folder.TRASH)

      return _swapFolder(Folder.ALL)
    }
  }

  const returnNoteLink = (value: string) => {
    return <NoteLink uuid={value} notes={notes} handleNoteLinkClick={handleNoteLinkClick} />
  }

  const components = {
    uuid: ({ node, ...props }) => {
      console.log("Custom renderer for uuid called:", props);
      return returnNoteLink(props.value);  // Check if this value is correct
    },
  };
 
  return (
    <div className='markdown-body'>
      <Markdown remarkPlugins={[uuidPlugin]} className={`previewer previewer_direction-${directionText}`}>
        {noteText}
      </Markdown>
    </div>
  )
}
