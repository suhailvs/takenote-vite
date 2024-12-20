import dayjs from 'dayjs'
import React from 'react'
// import { Controlled as CodeMirror } from 'react-codemirror2'
import { useDispatch, useSelector } from 'react-redux'
// import { Editor } from 'codemirror'

import { getActiveNote } from '../../client/utils/helpers'
import { updateNote } from '../../client/slices/note'
import { NoteItem } from '../../client/types'
import { NoteMenuBar } from '../../client/containers/NoteMenuBar'
import { EmptyEditor } from '../../client/components/Editor/EmptyEditor'
import { PreviewEditor } from '../../client/components/Editor/PreviewEditor'
import { getNotes, getSettings, getSync } from '../../client/selectors'
import { setPendingSync } from '../../client/slices/sync'

// import 'codemirror/lib/codemirror.css'
// // import 'codemirror/theme/base16-light.css'
// import 'codemirror/mode/gfm/gfm'
// import 'codemirror/addon/selection/active-line'
// import 'codemirror/addon/scroll/scrollpastend'

export const NoteEditor: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { pendingSync } = useSelector(getSync)
  const { activeNoteId, loading, notes } = useSelector(getNotes)
  const { codeMirrorOptions, previewMarkdown } = useSelector(getSettings)

  const activeNote = getActiveNote(notes, activeNoteId)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateNote = (note: NoteItem) => {
    !pendingSync && dispatch(setPendingSync())
    dispatch(updateNote(note))
  }

  // const setEditorOverlay = (editor: Editor) => {
  //   const query = /\{\{[^}]*}}/g
  //   editor.addOverlay({
  //     token: function (stream: any) {
  //       query.lastIndex = stream.pos
  //       var match = query.exec(stream.string)
  //       if (match && match.index == stream.pos) {
  //         stream.pos += match[0].length || 1

  //         return 'notelink'
  //       } else if (match) {
  //         stream.pos = match.index
  //       } else {
  //         stream.skipToEnd()
  //       }
  //     },
  //   })
  // }

  const renderEditor = () => {
    if (loading) {
      return <div className="empty-editor v-center">Loading...</div>
    } else if (!activeNote) {
      return <EmptyEditor />
    } else if (previewMarkdown) {
      return (
        <PreviewEditor
          directionText={codeMirrorOptions.direction}
          noteText={activeNote.text}
          notes={notes}
        />
      )
    }
    const handleChange = (event:any) => {
      _updateNote({
        id: activeNote.id,
        text: event.target.value,
        created: activeNote.created,
        lastUpdated: dayjs().format(),
      })
    }
    return (
      <textarea className="editor mousetrap" spellCheck="false" value={activeNote.text} onChange={handleChange} />
      // <CodeMirror
      //   data-testid="codemirror-editor"
      //   className="editor mousetrap"
      //   value={activeNote.text}
      //   options={codeMirrorOptions}
      //   editorDidMount={(editor) => {
      //     setTimeout(() => {
      //       editor.focus()
      //     }, 0)
      //     editor.setCursor(0)
      //     setEditorOverlay(editor)
      //   }}
      //   onBeforeChange={(editor, data, value) => {
      //     console.log(editor)
      //     console.log(data)
          
          
      //     _updateNote({
      //       id: activeNote.id,
      //       text: value,
      //       created: activeNote.created,
      //       lastUpdated: dayjs().format(),
      //     })
      //   }}
      //   onChange={(editor, data, value) => {
      //     console.log(data)
      //     console.log('onchange')
      //     console.log("Active note text:", activeNote.text);
      //     if (!value) {
      //       editor.focus()
      //     }
      //   }}
      //   onPaste={(editor, event: any) => {
      //     // Get around pasting issue
      //     // https://github.com/scniro/react-codemirror2/issues/77
      //     if (!event.clipboardData || !event.clipboardData.items || !event.clipboardData.items[0])
      //       return
      //     event.clipboardData.items[0].getAsString((pasted: any) => {
      //       if (editor.getSelection() !== pasted) return
      //       const { anchor, head } = editor.listSelections()[0]
      //       editor.setCursor({
      //         line: Math.max(anchor.line, head.line),
      //         ch: Math.max(anchor.ch, head.ch),
      //       })
      //     })
      //   }}
      // />
    )
  }

  return (
    <main className="note-editor">
      <NoteMenuBar />
      {renderEditor()}
    </main>
  )
}
