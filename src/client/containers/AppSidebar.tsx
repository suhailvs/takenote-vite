import React from 'react'
import { Plus } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

import { LabelText } from '../../resources/LabelText'
import { TestID } from '../../resources/TestID'
import { ActionButton } from '../../client/components/AppSidebar/ActionButton'
import { FolderOption } from '../../client/components/AppSidebar/FolderOption'
import { ScratchpadOption } from '../../client/components/AppSidebar/ScratchpadOption'
import { Folder, NotesSortKey } from '../../client/utils/enums'
import { CategoryList } from '../../client/containers/CategoryList'
import {
  addNote,
  swapFolder,
  updateActiveNote,
  assignFavoriteToNotes,
  assignTrashToNotes,
  updateSelectedNotes,
  unassignTrashFromNotes,
} from '../../client/slices/note'
import { togglePreviewMarkdown } from '../../client/slices/settings'
import { getSettings, getNotes } from '../../client/selectors'
import { NoteItem } from '../../client/types'
import { newNoteHandlerHelper, getActiveNote } from '../../client/utils/helpers'

export const AppSidebar: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { activeCategoryId, activeFolder, activeNoteId, notes } = useSelector(getNotes)
  const { previewMarkdown, notesSortKey } = useSelector(getSettings)

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
  const _swapFolder = (sortOrderKey: NotesSortKey) => (folder: Folder) =>
    dispatch(swapFolder({ folder, sortOrderKey }))
  const _togglePreviewMarkdown = () => dispatch(togglePreviewMarkdown())
  const _assignTrashToNotes = (noteId: string) => dispatch(assignTrashToNotes(noteId))
  const _unassignTrashFromNotes = (noteId: string) => dispatch(unassignTrashFromNotes(noteId))
  const _assignFavoriteToNotes = (noteId: string) => dispatch(assignFavoriteToNotes(noteId))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const newNoteHandler = () =>
    newNoteHandlerHelper(
      activeFolder,
      previewMarkdown,
      activeNote,
      activeCategoryId,
      swapFolderHandler,
      _togglePreviewMarkdown,
      _addNote,
      _updateActiveNote,
      _updateSelectedNotes
    )
  const swapFolderHandler = _swapFolder(notesSortKey)

  return (
    <aside className="app-sidebar">
      <ActionButton
        dataTestID={TestID.SIDEBAR_ACTION_CREATE_NEW_NOTE}
        handler={newNoteHandler}
        icon={Plus}
        label={LabelText.CREATE_NEW_NOTE}
        text={LabelText.NEW_NOTE}
      />
      <section className="app-sidebar-main">
        <ScratchpadOption
          active={activeFolder === Folder.SCRATCHPAD}
          swapFolder={swapFolderHandler}
        />
        <FolderOption
          active={activeFolder === Folder.ALL}
          swapFolder={swapFolderHandler}
          text={LabelText.NOTES}
          dataTestID={TestID.FOLDER_NOTES}
          folder={Folder.ALL}
          addNoteType={_unassignTrashFromNotes}
        />
        <FolderOption
          active={activeFolder === Folder.FAVORITES}
          text={LabelText.FAVORITES}
          dataTestID={TestID.FOLDER_FAVORITES}
          folder={Folder.FAVORITES}
          swapFolder={swapFolderHandler}
          addNoteType={_assignFavoriteToNotes}
        />
        <FolderOption
          active={activeFolder === Folder.TRASH}
          text={LabelText.TRASH}
          dataTestID={TestID.FOLDER_TRASH}
          folder={Folder.TRASH}
          swapFolder={swapFolderHandler}
          addNoteType={_assignTrashToNotes}
        />
        <CategoryList />
      </section>
    </aside>
  )
}
