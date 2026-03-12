import apiClient, { ApiResponse } from '@/lib/api-client';
import { User, Address } from '@/types';

class UserService {
  /**
   * Get user profile by ID
   */
  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      `/users/${userId}`
    );
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${userId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  }

  /**
   * Get user's addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    const response = await apiClient.get<ApiResponse<Address[]>>(
      `/users/${userId}/addresses`
    );
    return response.data.data;
  }

  /**
   * Add new address
   */
  async addAddress(userId: string, address: Omit<Address, 'id' | 'userId' | 'createdAt'>): Promise<Address> {
    const response = await apiClient.post<ApiResponse<Address>>(
      `/users/${userId}/addresses`,
      address
    );
    return response.data.data;
  }

  /**
   * Update address
   */
  async updateAddress(
    userId: string,
    addressId: string,
    address: Partial<Address>
  ): Promise<Address> {
    const response = await apiClient.put<ApiResponse<Address>>(
      `/users/${userId}/addresses/${addressId}`,
      address
    );
    return response.data.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/addresses/${addressId}`);
  }

  /**
   * Set default address
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    await apiClient.patch(`/users/${userId}/addresses/${addressId}/default`);
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string, params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await apiClient.get(`/users/${userId}/bookings`, {
      params,
    });
    return response.data;
  }

  /**
   * Get user's favorites
   */
  async getFavorites(userId: string): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `/users/${userId}/favorites`
    );
    return response.data.data;
  }

  /**
   * Add provider to favorites
   */
  async addFavorite(userId: string, providerId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/favorites/${providerId}`);
  }

  /**
   * Remove provider from favorites
   */
  async removeFavorite(userId: string, providerId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/favorites/${providerId}`);
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `/users/${userId}/profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  }
}

export default new UserService();
