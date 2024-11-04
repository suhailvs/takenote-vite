import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { TakeNoteApp } from './client/containers/TakeNoteApp'
import createSagaMiddleware from 'redux-saga';
import './client/styles/index.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './client/slices'
import rootSaga from './client/sagas'

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: true, // process.env.NODE_ENV !== 'production',
});
sagaMiddleware.run(rootSaga)
const router = createBrowserRouter([
  {
    path: "/",
    element: <TakeNoteApp />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <StrictMode>
    
    <RouterProvider router={router} history={history}/>
    
  </StrictMode>
  </Provider>,
)

