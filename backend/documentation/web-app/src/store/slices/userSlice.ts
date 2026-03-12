import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '@/services/user.service';
import { User, Address } from '@/types';

interface UserState {
  profile: User | null;
  addresses: Address[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  favorites: [],
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<User, string>(
  'user/fetchProfile',
  async (userId) => await userService.getUser(userId)
);

export const updateUserProfile = createAsyncThunk<User, { userId: string; data: Partial<User> }>(
  'user/updateProfile',
  async ({ userId, data }) => await userService.updateUser(userId, data)
);

export const fetchAddresses = createAsyncThunk<Address[], string>(
  'user/fetchAddresses',
  async (userId) => await userService.getAddresses(userId)
);

export const addAddress = createAsyncThunk<Address, { userId: string; address: any }>(
  'user/addAddress',
  async ({ userId, address }) => await userService.addAddress(userId, address)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
