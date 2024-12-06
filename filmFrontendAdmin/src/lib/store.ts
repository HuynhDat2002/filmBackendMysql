import { configureStore } from '@reduxjs/toolkit'
import movieReducer from './features/movie.slice'
import tvReducer, { tv } from './features/tv.slice'
import userReducer from './features/user.slice'
import commentReducer from './features/comment.slice'
export const makeStore = () => {
  return configureStore({
    reducer: {
      movieReducer,
      tvReducer,
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
