import apiClient, { ApiResponse } from '@/lib/api-client';
import { Conversation, Message } from '@/types';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3009';

class ChatService {
  private socket: Socket | null = null;

  /**
   * Connect to chat WebSocket
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');

    this.socket = io(WS_URL, {
      query: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Chat socket error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from chat
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Join a conversation
   */
  joinConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket?.emit('join_conversation', {
      conversationId,
    });
  }

  /**
   * Leave a conversation
   */
  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', {
      conversationId,
    });
  }

  /**
   * Send a message
   */
  sendMessage(conversationId: string, message: string, type: 'text' | 'image' | 'file' = 'text'): void {
    this.socket?.emit('send_message', {
      conversationId,
      message,
      type,
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', {
      conversationId,
      isTyping,
    });
  }

  /**
   * Listen for new messages
   */
  onMessage(callback: (message: Message) => void): void {
    this.socket?.on('message_received', callback);
  }

  /**
   * Listen for typing indicators
   */
  onTyping(callback: (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => void): void {
    this.socket?.on('user_typing', callback);
  }

  /**
   * Remove message listener
   */
  offMessage(): void {
    this.socket?.off('message_received');
  }

  /**
   * Remove typing listener
   */
  offTyping(): void {
    this.socket?.off('user_typing');
  }

  /**
   * Get user conversations (REST API)
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<ApiResponse<Conversation[]>>(
      '/chat/conversations'
    );
    return response.data.data;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await apiClient.get<ApiResponse<Conversation>>(
      `/chat/conversations/${conversationId}`
    );
    return response.data.data;
  }

  /**
   * Create a new conversation
   */
  async createConversation(participants: string[], bookingId?: string): Promise<Conversation> {
    const response = await apiClient.post<ApiResponse<Conversation>>(
      '/chat/conversations',
      { participants, bookingId }
    );
    return response.data.data;
  }

  /**
   * Get conversation messages
   */
  async getMessages(
    conversationId: string,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
    }
  ): Promise<Message[]> {
    const response = await apiClient.get<ApiResponse<Message[]>>(
      `/chat/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    await apiClient.post(`/chat/conversations/${conversationId}/read`, {
      messageIds,
    });
  }

  /**
   * Upload file/image for chat
   */
  async uploadFile(conversationId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `/chat/conversations/${conversationId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  }

  /**
   * Delete a message
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    await apiClient.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      '/chat/unread-count'
    );
    return response.data.data.count;
  }
}

export default new ChatService();
