import apiClient, { ApiResponse } from '@/lib/api-client';
import { Provider, ProviderService, Availability } from '@/types';

class ProviderServiceAPI {
  /**
   * Register as a provider
   */
  async registerProvider(data: any): Promise<Provider> {
    const response = await apiClient.post<ApiResponse<Provider>>(
      '/providers',
      data
    );
    return response.data.data;
  }

  /**
   * Get provider profile
   */
  async getProvider(providerId: string): Promise<Provider> {
    const response = await apiClient.get<ApiResponse<Provider>>(
      `/providers/${providerId}`
    );
    return response.data.data;
  }

  /**
   * Update provider profile
   */
  async updateProvider(providerId: string, data: Partial<Provider>): Promise<Provider> {
    const response = await apiClient.put<ApiResponse<Provider>>(
      `/providers/${providerId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Get provider's services
   */
  async getProviderServices(providerId: string): Promise<ProviderService[]> {
    const response = await apiClient.get<ApiResponse<ProviderService[]>>(
      `/providers/${providerId}/services`
    );
    return response.data.data;
  }

  /**
   * Add service to provider
   */
  async addService(providerId: string, service: Partial<ProviderService>): Promise<ProviderService> {
    const response = await apiClient.post<ApiResponse<ProviderService>>(
      `/providers/${providerId}/services`,
      service
    );
    return response.data.data;
  }

  /**
   * Update provider service
   */
  async updateService(
    providerId: string,
    serviceId: string,
    data: Partial<ProviderService>
  ): Promise<ProviderService> {
    const response = await apiClient.put<ApiResponse<ProviderService>>(
      `/providers/${providerId}/services/${serviceId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete provider service
   */
  async deleteService(providerId: string, serviceId: string): Promise<void> {
    await apiClient.delete(`/providers/${providerId}/services/${serviceId}`);
  }

  /**
   * Get provider availability
   */
  async getAvailability(providerId: string): Promise<Availability> {
    const response = await apiClient.get<ApiResponse<Availability>>(
      `/providers/${providerId}/availability`
    );
    return response.data.data;
  }

  /**
   * Update provider availability
   */
  async updateAvailability(providerId: string, availability: Availability): Promise<Availability> {
    const response = await apiClient.put<ApiResponse<Availability>>(
      `/providers/${providerId}/availability`,
      availability
    );
    return response.data.data;
  }

  /**
   * Upload provider documents
   */
  async uploadDocument(providerId: string, file: File, documentType: string): Promise<any> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    const response = await apiClient.post(
      `/providers/${providerId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  /**
   * Get provider verification status
   */
  async getVerificationStatus(providerId: string): Promise<any> {
    const response = await apiClient.get(
      `/providers/${providerId}/verification-status`
    );
    return response.data.data;
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string): Promise<any> {
    const response = await apiClient.get(
      `/providers/${providerId}/stats`
    );
    return response.data.data;
  }

  /**
   * Get provider earnings
   */
  async getEarnings(providerId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await apiClient.get(
      `/providers/${providerId}/earnings`,
      { params }
    );
    return response.data;
  }
}

export default new ProviderServiceAPI();
