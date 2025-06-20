import { configureStore } from '@reduxjs/toolkit'
import filmReducer from './features/film.slice'
import userReducer from './features/user.slice'
import commentReducer from './features/comment.slice'
export const makeStore = () => {
  return configureStore({
    reducer: {
      filmReducer,
      userReducer,
      commentReducer
    },
    

  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
