import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user_data',
  initialState: {
    user: null,
  },
  reducers: {
    store_user_data : (state, action) => {
      state.user = action.payload
    },
    remove_user_data: (state, _) =>{
      state.user = null
    },
  },
})

export default UserSlice.reducer