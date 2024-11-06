import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { Draggable } from 'react-beautiful-dnd'
import { Folder as FolderIcon } from 'react-feather'

import { TestID } from '../../resources/TestID'
import { CategoryItem, ReactMouseEvent, ReactSubmitEvent } from '../../client/types'
import { determineCategoryClass } from '../../client/utils/helpers'
import { getNotes, getCategories, getSettings } from '../../client/selectors'
import {
  updateActiveCategoryId,
  updateActiveNote,
  updateSelectedNotes,
} from '../../client/slices/note'
import { setCategoryEdit } from '../../client/slices/category'
import { iconColor } from '../../client/utils/constants'
import { ContextMenuEnum } from '../../client/utils/enums'
import { getNotesSorter } from '../../client/utils/notesSortStrategies'
import { ContextMenu } from '../../client/containers/ContextMenu'

interface CategoryOptionProps {
  category: CategoryItem
  index: number
  contextMenuRef: React.RefObject<HTMLDivElement>
  handleCategoryMenuClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId?: string
  ) => void
  handleCategoryRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | ReactMouseEvent,
    categoryId?: string
  ) => void
  onSubmitUpdateCategory: (event: ReactSubmitEvent) => void
  optionsPosition: { x: number; y: number }
  optionsId: string
  setOptionsId: React.Dispatch<React.SetStateAction<string>>
}

export const CategoryOption: React.FC<CategoryOptionProps> = ({
  category,
  index,
  contextMenuRef,  
  onSubmitUpdateCategory,
  optionsPosition,
  optionsId,
  setOptionsId,
}) => {
  // ===========================================================================
  // Selectors
  // ===========================================================================
  console.log(index);
  const { activeCategoryId, notes } = useSelector(getNotes)
  const {
    editingCategory: { id: editingCategoryId, tempName: tempCategoryName },
  } = useSelector(getCategories)
  const { notesSortKey } = useSelector(getSettings)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateActiveCategoryId = (categoryId: string) =>
    dispatch(updateActiveCategoryId(categoryId))
  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    dispatch(updateActiveNote({ noteId, multiSelect }))
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    dispatch(updateSelectedNotes({ noteId, multiSelect }))
  const _setCategoryEdit = (categoryId: string, tempName: string) =>
    dispatch(setCategoryEdit({ id: categoryId, tempName }))
  return (
    // <Draggable draggableId={category.id} index={index}>
    //   {(draggableProvided, snapshot) => (
        <div
          
          data-testid={TestID.CATEGORY_LIST_DIV}
          className={determineCategoryClass(category, true, activeCategoryId)}
          onClick={() => {
            const notesForNewCategory = notes
              .filter((note) => !note.trash && note.category === category.id)
              .sort(getNotesSorter(notesSortKey))

            const defaultActiveNoteId =
              notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

            if (category.id !== activeCategoryId) {
              _updateActiveCategoryId(category.id)
              _updateActiveNote(defaultActiveNoteId, false)
              _updateSelectedNotes(defaultActiveNoteId, false)
            }
          }}

        >
          <form
            className="category-list-name"
            onSubmit={(event) => {
              event.preventDefault()
              _setCategoryEdit('', '')
              onSubmitUpdateCategory(event)

              if (optionsId) setOptionsId('')
            }}
          >
            <FolderIcon size={15} className="app-sidebar-icon" color={iconColor} />
            {editingCategoryId === category.id ? (
              <input
                data-testid={TestID.CATEGORY_EDIT}
                className="category-edit"
                type="text"
                autoFocus
                maxLength={20}
                value={tempCategoryName}
                onChange={(event) => {
                  _setCategoryEdit(editingCategoryId, event.target.value)
                }}
                onBlur={(event) => onSubmitUpdateCategory(event)}
              />
            ) : (
              category.name
            )}
          </form>
          <div
            data-testid={TestID.MOVE_CATEGORY}
            className='category-options active'            
          >
            {notes.filter((note) => !note.trash && note.category === category.id).length}
          </div>
          {optionsId === category.id && (
            <ContextMenu
              contextMenuRef={contextMenuRef}
              item={category}
              optionsPosition={optionsPosition}
              setOptionsId={setOptionsId}
              type={ContextMenuEnum.CATEGORY}
            />
          )}
        </div>
    //   )}
    // </Draggable>
  )
}
