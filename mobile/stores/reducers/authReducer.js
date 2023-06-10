import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    isInitialized: false,
  },
  reducers: {
    completeInitialization(state) {
      state.isInitialized = true;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser, completeInitialization } = authSlice.actions;
export default authSlice.reducer;
