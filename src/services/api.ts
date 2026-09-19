import {
  UserProfile,
  Community,
  Opportunity,
  ConnectionRecord,
  AppNotification,
  Conversation,
  Message,
} from '../types';

const TOKEN_KEY = 'networkth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string; role: string; headline?: string; industry?: string }) =>
    apiFetch<{ token: string; user: UserProfile; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ token: string; user: UserProfile; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => apiFetch<{ user: UserProfile }>('/api/auth/me'),

  // Users & Profiles
  getUsers: (params?: {
    query?: string;
    role?: string;
    industry?: string;
    skill?: string;
    location?: string;
    availability?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'All') searchParams.append(k, v);
      });
    }
    const queryStr = searchParams.toString();
    return apiFetch<{ users: (UserProfile & { connectionStatus: 'none' | 'pending' | 'received' | 'connected' })[]; total: number }>(
      `/api/users${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getUserById: (id: string) =>
    apiFetch<{
      user: UserProfile;
      connectionStatus: 'none' | 'pending' | 'received' | 'connected';
      connectionId?: string;
    }>(`/api/users/${id}`),

  updateUser: (id: string, updates: Partial<UserProfile>) =>
    apiFetch<{ user: UserProfile; message: string }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Connections
  requestConnection: (recipientId: string, message?: string) =>
    apiFetch<{ connection: ConnectionRecord; message: string }>('/api/connections/request', {
      method: 'POST',
      body: JSON.stringify({ recipientId, message }),
    }),

  getConnections: () =>
    apiFetch<{
      connected: (ConnectionRecord & { user: UserProfile })[];
      pendingReceived: (ConnectionRecord & { user: UserProfile })[];
      pendingSent: (ConnectionRecord & { user: UserProfile })[];
      totalConnected: number;
    }>('/api/connections'),

  respondToConnection: (connectionId: string, action: 'accept' | 'reject') =>
    apiFetch<{ connection: ConnectionRecord; message: string }>(`/api/connections/${connectionId}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),

  removeConnection: (connectionId: string) =>
    apiFetch<{ message: string }>(`/api/connections/${connectionId}`, {
      method: 'DELETE',
    }),

  // Communities
  getCommunities: (params?: { category?: string; query?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.category && params.category !== 'All') searchParams.append('category', params.category);
      if (params.query) searchParams.append('query', params.query);
    }
    const queryStr = searchParams.toString();
    return apiFetch<{ communities: Community[]; total: number }>(
      `/api/communities${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getCommunityById: (id: string) =>
    apiFetch<{ community: Community & { isJoined: boolean } }>(`/api/communities/${id}`),

  createCommunity: (body: Partial<Community>) =>
    apiFetch<{ community: Community; message: string }>('/api/communities', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  toggleJoinCommunity: (id: string) =>
    apiFetch<{ joined: boolean; memberCount: number; message: string }>(`/api/communities/${id}/join`, {
      method: 'POST',
    }),

  // Messages
  getConversations: () =>
    apiFetch<{ conversations: Conversation[] }>('/api/messages/conversations'),

  getConversationMessages: (id: string) =>
    apiFetch<{ conversation: Conversation; messages: Message[] }>(`/api/messages/conversation/${id}`),

  getMessagesWithUser: (userId: string) =>
    apiFetch<{ conversation: Conversation | null; messages: Message[] }>(`/api/messages/user/${userId}`),

  sendMessage: (
    arg1: { recipientId?: string; conversationId?: string; text: string } | string,
    arg2?: string
  ) => {
    const body = typeof arg1 === 'string' ? { recipientId: arg1, text: arg2 || '' } : arg1;
    return apiFetch<{ message: Message; conversation: Conversation }>('/api/messages/send', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Notifications
  getNotifications: () =>
    apiFetch<{ notifications: AppNotification[]; unreadCount: number }>('/api/notifications'),

  markNotificationRead: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    }),

  markAllNotificationsRead: () =>
    apiFetch<{ success: boolean }>('/api/notifications/read-all', {
      method: 'PUT',
    }),

  // Opportunities
  getOpportunities: (params?: { type?: string; targetAudience?: string; query?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.type && params.type !== 'All') searchParams.append('type', params.type);
      if (params.targetAudience && params.targetAudience !== 'All') searchParams.append('targetAudience', params.targetAudience);
      if (params.query) searchParams.append('query', params.query);
    }
    const queryStr = searchParams.toString();
    return apiFetch<{ opportunities: Opportunity[]; total: number }>(
      `/api/opportunities${queryStr ? `?${queryStr}` : ''}`
    );
  },

  // Search
  searchGlobal: (q: string) =>
    apiFetch<{
      people: UserProfile[];
      startups: UserProfile[];
      creators: UserProfile[];
      communities: Community[];
    }>(`/api/search?q=${encodeURIComponent(q)}`),

  // Admin
  getAdminStats: () =>
    apiFetch<{
      totalUsers: number;
      activeUsers: number;
      communities: number;
      activeConnections: number;
      totalMessages: number;
      userTypes: Record<string, number>;
    }>('/api/admin/stats'),

  getAdminUsers: () => apiFetch<{ users: UserProfile[] }>('/api/admin/users'),

  setAdminUserStatus: (id: string, status: 'active' | 'deactivated') =>
    apiFetch<{ success: boolean; user: UserProfile }>(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getAdminReports: () =>
    apiFetch<{
      reports: {
        id: string;
        reportedName: string;
        reporterName: string;
        reason: string;
        timestamp: string;
        status: string;
      }[];
    }>('/api/admin/reports'),
};
