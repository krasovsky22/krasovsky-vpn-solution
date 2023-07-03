import { createSlice } from '@reduxjs/toolkit';

const photoSlice = createSlice({
  name: 'photos',
  initialState: [],
  reducers: {
    addPhoto(state, action) {
      const photo = action.payload;

      return [...state, photo];
    },
  },
});

export const { addPhoto } = photoSlice.actions;
export default photoSlice.reducer;
