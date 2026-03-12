import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import bookingService from '@/services/booking.service';
import { Booking, CreateBookingData, PaginatedResponse } from '@/types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  upcomingBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  isLoading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const createBooking = createAsyncThunk<Booking, CreateBookingData>(
  'booking/create',
  async (data, { rejectWithValue }) => {
    try {
      return await bookingService.createBooking(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const fetchBookings = createAsyncThunk<
  PaginatedResponse<Booking>,
  { status?: string; page?: number; limit?: number }
>('booking/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await bookingService.getBookings(params);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const fetchBooking = createAsyncThunk<Booking, string>(
  'booking/fetchOne',
  async (bookingId, { rejectWithValue }) => {
    try {
      return await bookingService.getBooking(bookingId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const fetchUpcomingBookings = createAsyncThunk(
  'booking/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getUpcomingBookings();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const cancelBooking = createAsyncThunk<Booking, { bookingId: string; reason: string }>(
  'booking/cancel',
  async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
      return await bookingService.cancelBooking(bookingId, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

export const completeBooking = createAsyncThunk<
  Booking,
  { bookingId: string; finalPrice?: number; notes?: string }
>('booking/complete', async ({ bookingId, finalPrice, notes }, { rejectWithValue }) => {
  try {
    return await bookingService.completeBooking(bookingId, finalPrice, notes);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to complete booking');
  }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.metadata;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single booking
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch upcoming bookings
    builder
      .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
        state.upcomingBookings = action.payload;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      });

    // Complete booking
    builder
      .addCase(completeBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
