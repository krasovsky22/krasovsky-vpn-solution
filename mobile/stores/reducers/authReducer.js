import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    errorMessage: '',
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
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    clearErrorMessage(state) {
      state.errorMessage = '';
    },
  },
});

export const {
  setCurrentUser,
  setErrorMessage,
  clearErrorMessage,
  completeInitialization,
} = authSlice.actions;
export default authSlice.reducer;
