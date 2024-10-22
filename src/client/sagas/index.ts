import { all, put, takeLatest, select } from 'redux-saga/effects'
import dayjs from 'dayjs'
import axios from 'axios'

import { requestCategories, requestNotes, requestSettings, saveState, saveSettings } from '../../client/api'
import { loadCategories, loadCategoriesError, loadCategoriesSuccess } from '../../client/slices/category'
import { loadNotes, loadNotesError, loadNotesSuccess } from '../../client/slices/note'
import { sync, syncError, syncSuccess } from '../../client/slices/sync'
import { login, loginSuccess, loginError, logout, logoutSuccess } from '../../client/slices/auth'
import {
  updateCodeMirrorOption,
  loadSettingsSuccess,
  loadSettingsError,
  loadSettings,
  toggleDarkTheme,
  togglePreviewMarkdown,
  toggleSettingsModal,
  updateNotesSortStrategy,
} from '../../client/slices/settings'
import { SyncAction } from '../../client/types'
import { getSettings } from '../../client/selectors'

const isDemo = true //process.env.DEMO

// Hit the Express endpoint to get the current GitHub user from the cookie
function* loginUser() {
  try {
    if (isDemo) {
      yield put(loginSuccess({ name: 'Demo User' }))
    } else {
      const { data } = yield axios('/api/auth/login')

      yield put(loginSuccess(data))
    }
  } catch (error:any) {
    yield put(loginError(error.message))
  }
}

// Remove the access token cookie from Express
function* logoutUser() {
  try {
    if (isDemo) {
      yield put(logoutSuccess())
    } else {
      yield axios('/api/auth/logout')
    }

    yield put(logoutSuccess())
  } catch (error) {
    yield put(logoutSuccess())
  }
}

// Get notes from API
function* fetchNotes(): Generator<any, any, any> {
  let data
  try {
    if (isDemo) {
      data = yield requestNotes()
    } else {
      data = (yield axios('/api/sync/notes')).data
    }
    const { notesSortKey } = yield select(getSettings)

    yield put(loadNotesSuccess({ notes: data, sortOrderKey: notesSortKey }))
  } catch (error:any) {
    yield put(loadNotesError(error.message))
  }
}

// Get categories from API
function* fetchCategories(): Generator<any, any, any> {
  let data
  try {
    if (isDemo) {
      data = yield requestCategories()
    } else {
      data = (yield axios('/api/sync/categories')).data
    }

    yield put(loadCategoriesSuccess(data))
  } catch (error:any) {
    yield put(loadCategoriesError(error.message))
  }
}

// Get settings from API
function* fetchSettings(): Generator<any, any, any> {
  let data
  try {
    data = yield requestSettings()

    yield put(loadSettingsSuccess(data))
  } catch (error) {
    yield put(loadSettingsError())
  }
}

function* syncData({ payload }: SyncAction) {
  try {
    if (isDemo) {
      yield saveState(payload)
    } else {
      yield axios.post('/api/sync', payload)
    }
    yield put(syncSuccess(dayjs().format()))
  } catch (error:any) {
    yield put(syncError(error.message))
  }
}

function* syncSettings(): Generator<any, any, any> {
  try {
    const settings = yield select(getSettings)

    yield saveSettings(settings)
  } catch (error) {}
}

// If any of these functions are dispatched, invoke the appropriate saga
function* rootSaga() {
  yield all([
    takeLatest(login.type, loginUser),
    takeLatest(logout.type, logoutUser),
    takeLatest(loadNotes.type, fetchNotes),
    takeLatest(loadCategories.type, fetchCategories),
    takeLatest(loadSettings.type, fetchSettings),
    takeLatest(sync.type, syncData),
    takeLatest(
      [
        toggleDarkTheme.type,
        togglePreviewMarkdown.type,
        updateCodeMirrorOption.type,
        toggleSettingsModal.type,
        updateNotesSortStrategy.type,
      ],
      syncSettings
    ),
  ])
}

export default rootSaga
