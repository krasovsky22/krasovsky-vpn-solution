import { createSlice } from '@reduxjs/toolkit';

const photoSlice = createSlice({
  name: 'photos',
  initialState: [],
  reducers: {
    setPhotos(state, action) {
      const photos = action.payload;
      return [...photos];
    },
    addPhoto(state, action) {
      const photo = action.payload;

      return [...state, photo];
    },
  },
});

export const { setPhotos, addPhoto } = photoSlice.actions;
export default photoSlice.reducer;
