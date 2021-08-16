import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user_data',
  initialState: {
    user_data: null,
  },
  reducers: {
    store_user_data : (state, action) => {
      state.user_data = action.payload
    },
    remove_user_data: (state, _) =>{
      state.user_data = null
    },
  },
})

export const { store_user_data, remove_user_data } = UserSlice.actions

export default UserSlice.reducer