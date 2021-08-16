import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './provider/UserReducer'

export default configureStore({
  reducer: {user:UserReducer},
})