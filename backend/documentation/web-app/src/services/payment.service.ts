import apiClient, { ApiResponse } from '@/lib/api-client';
import { Payment, PaginatedResponse } from '@/types';

class PaymentService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(bookingId: string, amount: number): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const response = await apiClient.post<ApiResponse<{
      clientSecret: string;
      paymentIntentId: string;
    }>>(
      '/payments/intent',
      {
        bookingId,
        amount,
        currency: 'usd',
      }
    );
    return response.data.data;
  }

  /**
   * Process payment
   */
  async processPayment(
    bookingId: string,
    paymentMethodId: string,
    amount: number
  ): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>(
      '/payments/process',
      {
        bookingId,
        paymentMethodId,
        amount,
      }
    );
    return response.data.data;
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<ApiResponse<Payment>>(
      `/payments/${paymentId}`
    );
    return response.data.data;
  }

  /**
   * Request refund
   */
  async requestRefund(paymentId: string, amount: number, reason: string): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>(
      `/payments/${paymentId}/refund`,
      {
        amount,
        reason,
      }
    );
    return response.data.data;
  }

  /**
   * Get payment transactions
   */
  async getTransactions(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Payment>> {
    const response = await apiClient.get<ApiResponse<Payment[]>>(
      '/payments/transactions',
      { params }
    );
    return {
      data: response.data.data,
      metadata: response.data.metadata!,
    };
  }

  /**
   * Get payment invoice
   */
  async getInvoice(bookingId: string): Promise<Blob> {
    const response = await apiClient.get(
      `/payments/invoices/${bookingId}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoice(bookingId: string, bookingNumber: string): Promise<void> {
    const blob = await this.getInvoice(bookingId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${bookingNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const response = await apiClient.get('/payments/stats', { params });
    return response.data.data;
  }

  /**
   * Save payment method
   */
  async savePaymentMethod(paymentMethodId: string): Promise<any> {
    const response = await apiClient.post('/payments/payment-methods', {
      paymentMethodId,
    });
    return response.data.data;
  }

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      '/payments/payment-methods'
    );
    return response.data.data;
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await apiClient.delete(`/payments/payment-methods/${paymentMethodId}`);
  }
}

export default new PaymentService();
