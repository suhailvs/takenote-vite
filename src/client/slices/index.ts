import { combineReducers, Reducer } from 'redux'

import authReducer from '../../client/slices/auth'
import categoryReducer from '../../client/slices/category'
import noteReducer from '../../client/slices/note'
import settingsReducer from '../../client/slices/settings'
import syncReducer from '../../client/slices/sync'
import { RootState } from '../../client/types'

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  authState: authReducer,
  categoryState: categoryReducer,
  noteState: noteReducer,
  settingsState: settingsReducer,
  syncState: syncReducer,
})

export default rootReducer
