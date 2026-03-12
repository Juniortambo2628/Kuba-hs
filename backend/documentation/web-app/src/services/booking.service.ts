import apiClient, { ApiResponse } from '@/lib/api-client';
import { Booking, CreateBookingData, PaginatedResponse } from '@/types';

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      '/bookings',
      data
    );
    return response.data.data;
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(
      `/bookings/${bookingId}`
    );
    return response.data.data;
  }

  /**
   * Get bookings with filters
   */
  async getBookings(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Booking>> {
    const response = await apiClient.get<ApiResponse<Booking[]>>(
      '/bookings',
      { params }
    );
    return {
      data: response.data.data,
      metadata: response.data.metadata!,
    };
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId: string, data: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`,
      { reason, cancelledBy: 'customer' }
    );
    return response.data.data;
  }

  /**
   * Reschedule booking
   */
  async rescheduleBooking(
    bookingId: string,
    scheduledDate: string,
    scheduledEndDate?: string
  ): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      `/bookings/${bookingId}/reschedule`,
      { scheduledDate, scheduledEndDate }
    );
    return response.data.data;
  }

  /**
   * Mark booking as started (Provider)
   */
  async startBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      `/bookings/${bookingId}/start`
    );
    return response.data.data;
  }

  /**
   * Mark booking as completed
   */
  async completeBooking(bookingId: string, finalPrice?: number, notes?: string): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      `/bookings/${bookingId}/complete`,
      { finalPrice, notes }
    );
    return response.data.data;
  }

  /**
   * Get booking status
   */
  async getBookingStatus(bookingId: string): Promise<any> {
    const response = await apiClient.get(
      `/bookings/${bookingId}/status`
    );
    return response.data.data;
  }

  /**
   * Upload booking images
   */
  async uploadImages(bookingId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post<ApiResponse<{ urls: string[] }>>(
      `/bookings/${bookingId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.urls;
  }

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(limit: number = 5): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>(
      '/bookings',
      {
        params: {
          status: 'confirmed',
          sortBy: 'scheduledDate',
          sortOrder: 'asc',
          limit,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get past bookings
   */
  async getPastBookings(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Booking>> {
    const response = await apiClient.get<ApiResponse<Booking[]>>(
      '/bookings',
      {
        params: {
          status: 'completed',
          page,
          limit,
          sortBy: 'scheduledDate',
          sortOrder: 'desc',
        },
      }
    );
    return {
      data: response.data.data,
      metadata: response.data.metadata!,
    };
  }
}

export default new BookingService();
