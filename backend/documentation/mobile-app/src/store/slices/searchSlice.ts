import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchService from '@/services/search.service';

const initialState = {
  providers: [],
  services: [],
  isLoading: false,
  error: null,
  pagination: null,
};

export const searchProviders = createAsyncThunk(
  'search/providers',
  async (filters: any) => await searchService.searchProviders(filters)
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.providers = [];
      state.services = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProviders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload.data;
        state.pagination = action.payload.metadata;
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
