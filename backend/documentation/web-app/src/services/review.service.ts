import apiClient, { ApiResponse } from '@/lib/api-client';
import { Review, CreateReviewData, PaginatedResponse } from '@/types';

class ReviewService {
  /**
   * Create a review
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      '/reviews',
      data
    );
    return response.data.data;
  }

  /**
   * Get review by ID
   */
  async getReview(reviewId: string): Promise<Review> {
    const response = await apiClient.get<ApiResponse<Review>>(
      `/reviews/${reviewId}`
    );
    return response.data.data;
  }

  /**
   * Update review
   */
  async updateReview(reviewId: string, data: Partial<Review>): Promise<Review> {
    const response = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${reviewId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`/reviews/${reviewId}`);
  }

  /**
   * Get provider reviews
   */
  async getProviderReviews(
    providerId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      sortBy?: 'date' | 'rating' | 'helpful';
    }
  ): Promise<{
    provider: any;
    reviews: Review[];
    ratingDistribution: Record<string, number>;
    metadata: any;
  }> {
    const response = await apiClient.get(
      `/reviews/provider/${providerId}`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get review for booking
   */
  async getBookingReview(bookingId: string): Promise<Review | null> {
    try {
      const response = await apiClient.get<ApiResponse<Review>>(
        `/reviews/booking/${bookingId}`
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Add provider response to review
   */
  async addProviderResponse(reviewId: string, response: string): Promise<Review> {
    const res = await apiClient.post<ApiResponse<Review>>(
      `/reviews/${reviewId}/response`,
      { response }
    );
    return res.data.data;
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<{ helpfulCount: number }> {
    const response = await apiClient.post<ApiResponse<{ helpfulCount: number }>>(
      `/reviews/${reviewId}/helpful`
    );
    return response.data.data;
  }

  /**
   * Get provider rating statistics
   */
  async getProviderStats(providerId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
    categoryAverages: {
      professionalism: number;
      quality: number;
      value: number;
      communication: number;
    };
  }> {
    const response = await apiClient.get(
      `/reviews/provider/${providerId}/stats`
    );
    return response.data.data;
  }

  /**
   * Report a review
   */
  async reportReview(reviewId: string, reason: string, details?: string): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/report`, {
      reason,
      details,
    });
  }
}

export default new ReviewService();
