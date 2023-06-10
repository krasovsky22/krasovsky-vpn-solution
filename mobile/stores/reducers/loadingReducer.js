import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    loadingAction: '',
  },
  reducers: {
    startLoading(state, action) {
      return {
        isLoading: true,
        loadingAction: action?.payload || '',
      };
    },

    completeLoading() {
      return {
        isLoading: false,
        loadingAction: '',
      };
    },
  },
});

export const { startLoading, completeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
