import apiClient, { ApiResponse } from '@/lib/api-client';
import { Notification, NotificationPreferences } from '@/types';

class NotificationService {
  /**
   * Get user notifications
   */
  async getNotifications(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    }
  ): Promise<{
    data: Notification[];
    metadata: {
      unreadCount: number;
      total: number;
    };
  }> {
    const response = await apiClient.get(`/notifications/${userId}`, { params });
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await apiClient.put(`/notifications/${userId}/read-all`);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  /**
   * Get notification preferences
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const response = await apiClient.get<ApiResponse<NotificationPreferences>>(
      `/notifications/preferences/${userId}`
    );
    return response.data.data;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const response = await apiClient.put<ApiResponse<NotificationPreferences>>(
      `/notifications/preferences/${userId}`,
      preferences
    );
    return response.data.data;
  }

  /**
   * Register device for push notifications
   */
  async registerDevice(userId: string, deviceToken: string, platform: 'ios' | 'android' | 'web'): Promise<void> {
    await apiClient.post('/notifications/register-device', {
      userId,
      deviceToken,
      platform,
    });
  }

  /**
   * Unregister device
   */
  async unregisterDevice(deviceToken: string): Promise<void> {
    await apiClient.post('/notifications/unregister-device', {
      deviceToken,
    });
  }

  /**
   * Test notification
   */
  async sendTestNotification(userId: string): Promise<void> {
    await apiClient.post('/notifications/test', { userId });
  }
}

export default new NotificationService();
