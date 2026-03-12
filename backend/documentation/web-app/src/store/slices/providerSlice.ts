import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProvider: null,
  services: [],
  isLoading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setCurrentProvider: (state, action) => {
      state.currentProvider = action.payload;
    },
  },
});

export const { setCurrentProvider } = providerSlice.actions;
export default providerSlice.reducer;
