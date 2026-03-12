import apiClient, { ApiResponse } from '@/lib/api-client';
import { SearchFilters, ProviderSearchResult, Service, PaginatedResponse } from '@/types';

class SearchService {
  /**
   * Search for providers
   */
  async searchProviders(filters: SearchFilters): Promise<PaginatedResponse<ProviderSearchResult>> {
    const response = await apiClient.get<ApiResponse<ProviderSearchResult[]>>(
      '/search/providers',
      { params: filters }
    );
    return {
      data: response.data.data,
      metadata: response.data.metadata!,
    };
  }

  /**
   * Search for services
   */
  async searchServices(query?: string): Promise<Service[]> {
    const response = await apiClient.get<ApiResponse<Service[]>>(
      '/search/services',
      { params: { q: query } }
    );
    return response.data.data;
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocomplete(query: string, type?: 'services' | 'providers' | 'locations'): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      '/search/autocomplete',
      { params: { q: query, type } }
    );
    return response.data.data;
  }

  /**
   * Search nearby providers
   */
  async searchNearby(
    latitude: number,
    longitude: number,
    radius: number = 10,
    service?: string
  ): Promise<ProviderSearchResult[]> {
    const response = await apiClient.get<ApiResponse<ProviderSearchResult[]>>(
      '/search/nearby',
      {
        params: {
          latitude,
          longitude,
          radius,
          service,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Advanced search with multiple filters
   */
  async advancedSearch(filters: any): Promise<PaginatedResponse<ProviderSearchResult>> {
    const response = await apiClient.post<ApiResponse<ProviderSearchResult[]>>(
      '/search/advanced',
      filters
    );
    return {
      data: response.data.data,
      metadata: response.data.metadata!,
    };
  }

  /**
   * Get popular services
   */
  async getPopularServices(limit: number = 10): Promise<Service[]> {
    const response = await apiClient.get<ApiResponse<Service[]>>(
      '/search/popular-services',
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Get featured providers
   */
  async getFeaturedProviders(limit: number = 10): Promise<ProviderSearchResult[]> {
    const response = await apiClient.get<ApiResponse<ProviderSearchResult[]>>(
      '/search/featured-providers',
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Get service categories
   */
  async getCategories(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      '/search/categories'
    );
    return response.data.data;
  }
}

export default new SearchService();
