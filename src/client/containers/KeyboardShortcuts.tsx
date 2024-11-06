import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import prettier from 'prettier/standalone'
// import parserMarkdown from 'prettier/parser-markdown'

import { useTempState } from '../../client/contexts/TempStateContext'
import { Folder, Shortcuts } from '../../client/utils/enums'
import { downloadNotes, getActiveNote, newNoteHandlerHelper } from '../../client/utils/helpers'
import { useKey } from '../../client/utils/hooks'
import {
  addNote,
  swapFolder,
  toggleTrashNotes,
  updateActiveNote,
  updateSelectedNotes,
  // updateNote,
} from '../../client/slices/note'
import { sync } from '../../client/slices/sync'
import { getCategories, getNotes, getSettings } from '../../client/selectors'
import { CategoryItem, NoteItem } from '../../client/types'
import { toggleDarkTheme, togglePreviewMarkdown, updateCodeMirrorOption } from '../../client/slices/settings'

export const KeyboardShortcuts: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { categories } = useSelector(getCategories)
  const { activeCategoryId, activeFolder, activeNoteId, notes, selectedNotesIds } = useSelector(
    getNotes
  )
  const { darkTheme, previewMarkdown } = useSelector(getSettings)

  const activeNote = getActiveNote(notes, activeNoteId)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _addNote = (note: NoteItem) => dispatch(addNote(note))
  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    dispatch(updateActiveNote({ noteId, multiSelect }))
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    dispatch(updateSelectedNotes({ noteId, multiSelect }))
  const _swapFolder = (folder: Folder) => dispatch(swapFolder({ folder }))
  const _toggleTrashNotes = (noteId: string) => dispatch(toggleTrashNotes(noteId))
  const _sync = (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(sync({ notes, categories }))
  const _togglePreviewMarkdown = () => dispatch(togglePreviewMarkdown())
  const _toggleDarkTheme = () => dispatch(toggleDarkTheme())
  const _updateCodeMirrorOption = (key: string, value: string) =>
    dispatch(updateCodeMirrorOption({ key, value }))

  // ===========================================================================
  // State
  // ===========================================================================

  const { addingTempCategory, setAddingTempCategory } = useTempState()

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const newNoteHandler = () =>
    newNoteHandlerHelper(
      activeFolder,
      previewMarkdown,
      activeNote,
      activeCategoryId,
      _swapFolder,
      _togglePreviewMarkdown,
      _addNote,
      _updateActiveNote,
      _updateSelectedNotes
    )
  const newTempCategoryHandler = () => !addingTempCategory && setAddingTempCategory(true)
  const trashNoteHandler = () => _toggleTrashNotes(activeNote!.id)
  const syncNotesHandler = () => _sync(notes, categories)
  const downloadNotesHandler = () => {
    if (!activeNote || selectedNotesIds.length === 0) return
    downloadNotes(
      selectedNotesIds.includes(activeNote.id)
        ? notes.filter((note) => selectedNotesIds.includes(note.id))
        : [activeNote],
      categories
    )
  }
  const togglePreviewMarkdownHandler = () => _togglePreviewMarkdown()
  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme()
    _updateCodeMirrorOption('theme', darkTheme ? 'base16-light' : 'new-moon')
  }
  // const prettifyNoteHandler = () => {
  //   // format current note with prettier
  //   if (activeNote && activeNote.text) {
  //     const formattedText = prettier.format(activeNote.text, {
  //       parser: 'markdown',
  //       plugins: [parserMarkdown],
  //     })

  //     const updatedNote = {
  //       ...activeNote,
  //       text: formattedText,
  //     }
  //     console.log(updateNote);

  //     dispatch(updateNote(activeNote))
  //   }
  // }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useKey(Shortcuts.NEW_NOTE, () => newNoteHandler())
  useKey(Shortcuts.NEW_CATEGORY, () => newTempCategoryHandler())
  useKey(Shortcuts.DELETE_NOTE, () => trashNoteHandler())
  useKey(Shortcuts.SYNC_NOTES, () => syncNotesHandler())
  useKey(Shortcuts.DOWNLOAD_NOTES, () => downloadNotesHandler())
  useKey(Shortcuts.PREVIEW, () => togglePreviewMarkdownHandler())
  useKey(Shortcuts.TOGGLE_THEME, () => toggleDarkThemeHandler())
  // useKey(Shortcuts.PRETTIFY, () => prettifyNoteHandler())

  return null
}
