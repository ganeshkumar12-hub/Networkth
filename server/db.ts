import { initialUsers, initialCommunities, initialOpportunities } from './seedData';
import { UserProfile, ConnectionRecord, Community, Message, Conversation, AppNotification, Opportunity } from '../src/types';

export interface UserDoc extends UserProfile {
  passwordHash: string;
}

// In-memory persistent collections with Mongoose-like data modeling
class NetworkthDatabase {
  public users: Map<string, UserDoc> = new Map();
  public connections: Map<string, ConnectionRecord> = new Map();
  public communities: Map<string, Community> = new Map();
  public messages: Map<string, Message> = new Map();
  public conversations: Map<string, Conversation> = new Map();
  public notifications: Map<string, AppNotification> = new Map();
  public opportunities: Map<string, Opportunity> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Populate Users
    initialUsers.forEach((u) => {
      this.users.set(u.id, { ...u });
    });

    // Populate Communities
    initialCommunities.forEach((c) => {
      this.communities.set(c.id, { ...c });
    });

    // Populate Opportunities
    initialOpportunities.forEach((o) => {
      this.opportunities.set(o.id, { ...o });
    });

    // Seed realistic connections:
    // Connection between David Vance (user_2) and Maya Chen (user_3) - Connected
    this.connections.set('conn_1', {
      id: 'conn_1',
      requesterId: 'user_3',
      recipientId: 'user_2',
      status: 'accepted',
      createdAt: '2025-02-02T10:00:00.000Z',
      updatedAt: '2025-02-02T14:00:00.000Z'
    });

    // Connection request from Alex Rivera (user_4) to Lumina Cloud (user_5) - Connected
    this.connections.set('conn_2', {
      id: 'conn_2',
      requesterId: 'user_4',
      recipientId: 'user_5',
      status: 'accepted',
      createdAt: '2025-02-05T09:00:00.000Z',
      updatedAt: '2025-02-05T12:00:00.000Z'
    });

    // Pending connection request from Elena Rostova (user_1) to David Vance (user_2)
    this.connections.set('conn_3', {
      id: 'conn_3',
      requesterId: 'user_1',
      recipientId: 'user_2',
      status: 'pending',
      createdAt: '2025-02-18T10:00:00.000Z',
      updatedAt: '2025-02-18T10:00:00.000Z'
    });

    // Pending connection request from Marcus Thorne (user_6) to Elena Rostova (user_1)
    this.connections.set('conn_4', {
      id: 'conn_4',
      requesterId: 'user_6',
      recipientId: 'user_1',
      status: 'pending',
      createdAt: '2025-02-19T08:30:00.000Z',
      updatedAt: '2025-02-19T08:30:00.000Z'
    });

    // Seed conversation between David Vance and Maya Chen
    const conv1Id = 'conv_user_2_user_3';
    this.conversations.set(conv1Id, {
      id: conv1Id,
      participants: ['user_2', 'user_3'],
      lastMessage: {
        text: 'Happy to look over your research proposal on mechanistic interpretability!',
        senderId: 'user_2',
        timestamp: '2025-02-15T16:20:00.000Z'
      },
      unreadCount: 0,
      updatedAt: '2025-02-15T16:20:00.000Z'
    });

    const msg1: Message = {
      id: 'msg_1',
      conversationId: conv1Id,
      senderId: 'user_3',
      recipientId: 'user_2',
      text: 'Hi David! Thank you so much for connecting. I am a CS senior at Stanford focusing on distributed inference for LLMs.',
      timestamp: '2025-02-15T15:00:00.000Z',
      read: true
    };
    const msg2: Message = {
      id: 'msg_2',
      conversationId: conv1Id,
      senderId: 'user_2',
      recipientId: 'user_3',
      text: 'Great to meet you Maya! That is a very high-impact area right now. How is your project structured?',
      timestamp: '2025-02-15T15:45:00.000Z',
      read: true
    };
    const msg3: Message = {
      id: 'msg_3',
      conversationId: conv1Id,
      senderId: 'user_3',
      recipientId: 'user_2',
      text: 'We are evaluating how attention heads handle cross-layer state cache. Would love your thoughts on whether this scales in high-concurrency production.',
      timestamp: '2025-02-15T16:10:00.000Z',
      read: true
    };
    const msg4: Message = {
      id: 'msg_4',
      conversationId: conv1Id,
      senderId: 'user_2',
      recipientId: 'user_3',
      text: 'Happy to look over your research proposal on mechanistic interpretability!',
      timestamp: '2025-02-15T16:20:00.000Z',
      read: true
    };
    this.messages.set(msg1.id, msg1);
    this.messages.set(msg2.id, msg2);
    this.messages.set(msg3.id, msg3);
    this.messages.set(msg4.id, msg4);

    // Seed conversation between Alex Rivera and Lumina Cloud
    const conv2Id = 'conv_user_4_user_5';
    this.conversations.set(conv2Id, {
      id: conv2Id,
      participants: ['user_4', 'user_5'],
      lastMessage: {
        text: 'We would love to sponsor your upcoming video essay on next-gen edge architectures.',
        senderId: 'user_5',
        timestamp: '2025-02-17T11:00:00.000Z'
      },
      unreadCount: 1,
      updatedAt: '2025-02-17T11:00:00.000Z'
    });
    const msg5: Message = {
      id: 'msg_5',
      conversationId: conv2Id,
      senderId: 'user_4',
      recipientId: 'user_5',
      text: 'Hey Lumina team, loved your latest serverless GPU cluster announcement. I am planning a deep dive next week.',
      timestamp: '2025-02-17T10:15:00.000Z',
      read: true
    };
    const msg6: Message = {
      id: 'msg_6',
      conversationId: conv2Id,
      senderId: 'user_5',
      recipientId: 'user_4',
      text: 'We would love to sponsor your upcoming video essay on next-gen edge architectures.',
      timestamp: '2025-02-17T11:00:00.000Z',
      read: false
    };
    this.messages.set(msg5.id, msg5);
    this.messages.set(msg6.id, msg6);

    // Seed notifications for Elena Rostova (user_1)
    this.notifications.set('notif_1', {
      id: 'notif_1',
      userId: 'user_1',
      type: 'connection_request',
      title: 'New Connection Request',
      message: 'Marcus Thorne wants to connect with you.',
      senderId: 'user_6',
      senderName: 'Marcus Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      relatedId: 'conn_4',
      read: false,
      createdAt: '2025-02-19T08:30:00.000Z'
    });

    this.notifications.set('notif_2', {
      id: 'notif_2',
      userId: 'user_2',
      type: 'connection_request',
      title: 'New Connection Request',
      message: 'Elena Rostova sent you a connection request.',
      senderId: 'user_1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      relatedId: 'conn_3',
      read: false,
      createdAt: '2025-02-18T10:00:00.000Z'
    });
  }
}

export const db = new NetworkthDatabase();
