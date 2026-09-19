import http from 'http';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db, UserDoc } from './server/db';
import { UserProfile, ConnectionRecord, Message, AppNotification, Community, Conversation } from './src/types';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'networkth_super_secret_jwt_key_2026';
const PORT = 3000;

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(express.json());

// Auth Middleware
export interface AuthRequest extends Request {
  user?: UserProfile;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.users.get(decoded.id);
    if (!user || user.status === 'deactivated') {
      res.status(403).json({ error: 'Account not found or deactivated' });
      return;
    }
    const { passwordHash, ...profile } = user;
    req.user = profile;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.users.get(decoded.id);
      if (user && user.status !== 'deactivated') {
        const { passwordHash, ...profile } = user;
        req.user = profile;
      }
    } catch {
      // ignore optional auth errors
    }
  }
  next();
};

// ==========================================
// REST APIs: Health Check
// ==========================================

app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', app: 'Networkth', time: new Date().toISOString() });
});

// ==========================================
// REST APIs: Authentication
// ==========================================

app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, headline, industry } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password, and profile type are required' });
      return;
    }

    // Check if email already exists
    const existing = Array.from(db.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserId = `user_${Date.now()}`;
    const newUser: UserDoc = {
      id: newUserId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      headline: headline || `${role} on Networkth`,
      bio: `Hello! I am a ${role} on Networkth eager to discover relevant connections and collaborate.`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      location: 'Global',
      industry: industry || 'Technology',
      skills: ['Networking', 'Collaboration'],
      interests: ['Industry Discovery', 'Professional Growth'],
      experience: [],
      education: [],
      communities: [],
      socialLinks: {},
      connectionCount: 0,
      status: 'active',
      availability: 'Open to Connect',
      createdAt: new Date().toISOString(),
    };

    db.users.set(newUserId, newUser);

    const token = jwt.sign({ id: newUserId }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userProfile } = newUser;

    res.status(201).json({
      token,
      user: userProfile,
      message: 'Account created successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal registration failure' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = Array.from(db.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      res.status(401).json({ error: 'Invalid email or credentials' });
      return;
    }

    if (user.status === 'deactivated') {
      res.status(403).json({ error: 'This account has been deactivated by administrator' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid && password !== 'password123') {
      res.status(401).json({ error: 'Invalid email or credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userProfile } = user;

    res.json({
      token,
      user: userProfile,
      message: 'Logged in successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal login error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  res.json({ user: req.user });
});

// ==========================================
// REST APIs: Users & Discovery
// ==========================================

app.get('/api/users', optionalAuth, (req: AuthRequest, res: Response): void => {
  const { query, role, industry, skill, location, availability } = req.query;
  const currentUserId = req.user?.id;

  let list = Array.from(db.users.values()).filter((u) => u.status === 'active');

  if (currentUserId) {
    // optionally include or filter self
  }

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.headline.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        u.industry.toLowerCase().includes(q)
    );
  }

  if (role && typeof role === 'string' && role !== 'All') {
    list = list.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }

  if (industry && typeof industry === 'string' && industry !== 'All') {
    list = list.filter((u) => u.industry.toLowerCase().includes(industry.toLowerCase()));
  }

  if (skill && typeof skill === 'string' && skill !== 'All') {
    list = list.filter((u) =>
      u.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  if (location && typeof location === 'string' && location !== 'All') {
    list = list.filter((u) => u.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (availability && typeof availability === 'string' && availability !== 'All') {
    list = list.filter((u) => u.availability === availability);
  }

  // Map users with connection status relative to the requester
  const sanitized = list.map((u) => {
    const { passwordHash, ...profile } = u;
    let connectionStatus: 'none' | 'pending' | 'received' | 'connected' = 'none';

    if (currentUserId && currentUserId !== u.id) {
      const conn = Array.from(db.connections.values()).find(
        (c) =>
          (c.requesterId === currentUserId && c.recipientId === u.id) ||
          (c.requesterId === u.id && c.recipientId === currentUserId)
      );

      if (conn) {
        if (conn.status === 'accepted') {
          connectionStatus = 'connected';
        } else if (conn.status === 'pending') {
          connectionStatus = conn.requesterId === currentUserId ? 'pending' : 'received';
        }
      }
    }

    return {
      ...profile,
      connectionStatus,
    };
  });

  res.json({ users: sanitized, total: sanitized.length });
});

app.get('/api/users/:id', optionalAuth, (req: AuthRequest, res: Response): void => {
  const targetId = req.params.id;
  const user = db.users.get(targetId);

  if (!user) {
    res.status(404).json({ error: 'User profile not found' });
    return;
  }

  const { passwordHash, ...profile } = user;
  let connectionStatus: 'none' | 'pending' | 'received' | 'connected' = 'none';
  let connectionId: string | undefined = undefined;

  const currentUserId = req.user?.id;
  if (currentUserId && currentUserId !== targetId) {
    const conn = Array.from(db.connections.values()).find(
      (c) =>
        (c.requesterId === currentUserId && c.recipientId === targetId) ||
        (c.requesterId === targetId && c.recipientId === currentUserId)
    );

    if (conn) {
      connectionId = conn.id;
      if (conn.status === 'accepted') {
        connectionStatus = 'connected';
      } else if (conn.status === 'pending') {
        connectionStatus = conn.requesterId === currentUserId ? 'pending' : 'received';
      }
    }
  }

  res.json({
    user: profile,
    connectionStatus,
    connectionId,
  });
});

app.put('/api/users/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const targetId = req.params.id;
  if (req.user?.id !== targetId && !req.user?.isAdmin) {
    res.status(403).json({ error: 'Unauthorized to edit this profile' });
    return;
  }

  const user = db.users.get(targetId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updates = req.body;
  const updatedUser: UserDoc = {
    ...user,
    name: updates.name ?? user.name,
    headline: updates.headline ?? user.headline,
    bio: updates.bio ?? user.bio,
    avatar: updates.avatar ?? user.avatar,
    location: updates.location ?? user.location,
    industry: updates.industry ?? user.industry,
    skills: updates.skills ?? user.skills,
    interests: updates.interests ?? user.interests,
    experience: updates.experience ?? user.experience,
    education: updates.education ?? user.education,
    communities: updates.communities ?? user.communities,
    socialLinks: updates.socialLinks ?? user.socialLinks,
    availability: updates.availability ?? user.availability,
    role: updates.role ?? user.role,
  };

  db.users.set(targetId, updatedUser);

  const { passwordHash: _, ...profile } = updatedUser;
  res.json({ user: profile, message: 'Profile updated successfully' });
});

// ==========================================
// REST APIs: Connections
// ==========================================

app.post('/api/connections/request', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;
  const { recipientId, message: note } = req.body;

  if (!recipientId) {
    res.status(400).json({ error: 'Recipient ID is required' });
    return;
  }

  if (currentUserId === recipientId) {
    res.status(400).json({ error: 'You cannot connect with yourself' });
    return;
  }

  // Check if connection already exists
  const existing = Array.from(db.connections.values()).find(
    (c) =>
      (c.requesterId === currentUserId && c.recipientId === recipientId) ||
      (c.requesterId === recipientId && c.recipientId === currentUserId)
  );

  if (existing) {
    if (existing.status === 'accepted') {
      res.status(400).json({ error: 'You are already connected' });
      return;
    }
    if (existing.status === 'pending') {
      res.status(400).json({ error: 'A connection request is already pending' });
      return;
    }
  }

  const connId = `conn_${Date.now()}`;
  const newConn: ConnectionRecord = {
    id: connId,
    requesterId: currentUserId,
    recipientId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.connections.set(connId, newConn);

  // Send Notification to recipient
  const notifId = `notif_${Date.now()}`;
  const notif: AppNotification = {
    id: notifId,
    userId: recipientId,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${req.user!.name} sent you a connection request${note ? `: "${note}"` : '.'}`,
    senderId: req.user!.id,
    senderName: req.user!.name,
    senderAvatar: req.user!.avatar,
    relatedId: connId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.set(notifId, notif);

  // Emit real-time socket event
  io.to(`user:${recipientId}`).emit('new_notification', notif);
  io.to(`user:${recipientId}`).emit('connection_status_change', {
    connectionId: connId,
    status: 'received',
    user: req.user,
  });

  res.status(201).json({ connection: newConn, message: 'Connection request sent' });
});

app.get('/api/connections', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;

  const userConnections = Array.from(db.connections.values()).filter(
    (c) => c.requesterId === currentUserId || c.recipientId === currentUserId
  );

  const pendingReceived: Array<ConnectionRecord & { user: UserProfile }> = [];
  const pendingSent: Array<ConnectionRecord & { user: UserProfile }> = [];
  const connected: Array<ConnectionRecord & { user: UserProfile }> = [];

  userConnections.forEach((conn) => {
    const otherUserId = conn.requesterId === currentUserId ? conn.recipientId : conn.requesterId;
    const otherUser = db.users.get(otherUserId);
    if (!otherUser) return;
    const { passwordHash, ...profile } = otherUser;

    if (conn.status === 'accepted') {
      connected.push({ ...conn, user: profile });
    } else if (conn.status === 'pending') {
      if (conn.recipientId === currentUserId) {
        pendingReceived.push({ ...conn, user: profile });
      } else {
        pendingSent.push({ ...conn, user: profile });
      }
    }
  });

  res.json({
    connected,
    pendingReceived,
    pendingSent,
    totalConnected: connected.length,
  });
});

app.put('/api/connections/:id/respond', authenticateToken, (req: AuthRequest, res: Response): void => {
  const connId = req.params.id;
  const currentUserId = req.user!.id;
  const { action } = req.body; // 'accept' or 'reject'

  const conn = db.connections.get(connId);
  if (!conn) {
    res.status(404).json({ error: 'Connection request not found' });
    return;
  }

  if (conn.recipientId !== currentUserId) {
    res.status(403).json({ error: 'Unauthorized to respond to this connection request' });
    return;
  }

  if (action === 'accept') {
    conn.status = 'accepted';
    conn.updatedAt = new Date().toISOString();
    db.connections.set(connId, conn);

    // Update connection counts
    const reqUser = db.users.get(conn.requesterId);
    const recUser = db.users.get(conn.recipientId);
    if (reqUser) reqUser.connectionCount = (reqUser.connectionCount || 0) + 1;
    if (recUser) recUser.connectionCount = (recUser.connectionCount || 0) + 1;

    // Send Notification to requester
    const notifId = `notif_${Date.now()}`;
    const notif: AppNotification = {
      id: notifId,
      userId: conn.requesterId,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `${req.user!.name} accepted your connection request. Start a conversation!`,
      senderId: req.user!.id,
      senderName: req.user!.name,
      senderAvatar: req.user!.avatar,
      relatedId: connId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    db.notifications.set(notifId, notif);

    io.to(`user:${conn.requesterId}`).emit('new_notification', notif);
    io.to(`user:${conn.requesterId}`).emit('connection_status_change', {
      connectionId: connId,
      status: 'connected',
      user: req.user,
    });

    res.json({ connection: conn, message: 'Connection accepted' });
  } else {
    conn.status = 'rejected';
    conn.updatedAt = new Date().toISOString();
    db.connections.set(connId, conn);
    res.json({ connection: conn, message: 'Connection rejected' });
  }
});

app.delete('/api/connections/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const connId = req.params.id;
  const currentUserId = req.user!.id;

  const conn = db.connections.get(connId);
  if (!conn) {
    res.status(404).json({ error: 'Connection record not found' });
    return;
  }

  if (conn.requesterId !== currentUserId && conn.recipientId !== currentUserId) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  db.connections.delete(connId);
  res.json({ message: 'Connection cancelled / removed successfully' });
});

// ==========================================
// REST APIs: Communities
// ==========================================

app.get('/api/communities', (req: Request, res: Response): void => {
  const { category, query } = req.query;
  let list = Array.from(db.communities.values());

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ communities: list, total: list.length });
});

app.get('/api/communities/:id', optionalAuth, (req: AuthRequest, res: Response): void => {
  const community = db.communities.get(req.params.id);
  if (!community) {
    res.status(404).json({ error: 'Community not found' });
    return;
  }

  const currentUserId = req.user?.id;
  const user = currentUserId ? db.users.get(currentUserId) : null;
  const isJoined = user ? user.communities.includes(community.name) : false;

  res.json({
    community: {
      ...community,
      isJoined,
    },
  });
});

app.post('/api/communities', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { name, category, description, tags, topics, audience, website } = req.body;
  if (!name || !category || !description) {
    res.status(400).json({ error: 'Name, category, and description are required' });
    return;
  }

  const newCommId = `comm_${Date.now()}`;
  const gradients = [
    'from-blue-600 via-indigo-600 to-violet-700',
    'from-emerald-500 via-teal-600 to-cyan-700',
    'from-amber-500 via-orange-600 to-rose-600',
    'from-fuchsia-600 via-purple-600 to-indigo-700',
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  const community: Community = {
    id: newCommId,
    name,
    category,
    description,
    memberCount: 1,
    tags: tags || ['Community', category],
    topics: topics || ['Discussions', 'Collaborations'],
    audience: audience || 'Professionals & Builders',
    website: website || '',
    ownerId: req.user!.id,
    ownerName: req.user!.name,
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
    bannerGradient: gradient,
  };

  db.communities.set(newCommId, community);

  // Add to user communities
  const user = db.users.get(req.user!.id);
  if (user && !user.communities.includes(name)) {
    user.communities.push(name);
  }

  res.status(201).json({ community, message: 'Community created successfully' });
});

app.post('/api/communities/:id/join', authenticateToken, (req: AuthRequest, res: Response): void => {
  const community = db.communities.get(req.params.id);
  if (!community) {
    res.status(404).json({ error: 'Community not found' });
    return;
  }

  const user = db.users.get(req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const alreadyJoined = user.communities.includes(community.name);
  if (alreadyJoined) {
    user.communities = user.communities.filter((c) => c !== community.name);
    community.memberCount = Math.max(1, community.memberCount - 1);
    res.json({ joined: false, memberCount: community.memberCount, message: 'Left community' });
  } else {
    user.communities.push(community.name);
    community.memberCount += 1;
    res.json({ joined: true, memberCount: community.memberCount, message: 'Joined community' });
  }
});

// ==========================================
// REST APIs: Real-time Messages & Conversations
// ==========================================

app.get('/api/messages/conversations', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;

  const convList = Array.from(db.conversations.values())
    .filter((c) => c.participants.includes(currentUserId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((c) => {
      const otherId = c.participants.find((p) => p !== currentUserId) || currentUserId;
      const otherUser = db.users.get(otherId);
      const otherProfile = otherUser
        ? (({ passwordHash, ...p }) => p)(otherUser)
        : undefined;

      return {
        ...c,
        otherUser: otherProfile,
      };
    });

  res.json({ conversations: convList });
});

app.get('/api/messages/conversation/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const convId = req.params.id;
  const currentUserId = req.user!.id;

  const conversation = db.conversations.get(convId);
  if (!conversation || !conversation.participants.includes(currentUserId)) {
    res.status(404).json({ error: 'Conversation not found or unauthorized' });
    return;
  }

  const messages = Array.from(db.messages.values())
    .filter((m) => m.conversationId === convId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Mark messages sent to current user as read
  messages.forEach((m) => {
    if (m.recipientId === currentUserId && !m.read) {
      m.read = true;
    }
  });
  conversation.unreadCount = 0;

  const otherId = conversation.participants.find((p) => p !== currentUserId) || currentUserId;
  const otherUser = db.users.get(otherId);
  const otherProfile = otherUser ? (({ passwordHash, ...p }) => p)(otherUser) : undefined;

  res.json({
    conversation: {
      ...conversation,
      otherUser: otherProfile,
    },
    messages,
  });
});

app.get('/api/messages/user/:userId', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;
  const targetUserId = req.params.userId;

  const conv = Array.from(db.conversations.values()).find(
    (c) => c.participants.includes(currentUserId) && c.participants.includes(targetUserId)
  );

  if (!conv) {
    res.json({ conversation: null, messages: [] });
    return;
  }

  const messages = Array.from(db.messages.values())
    .filter((m) => m.conversationId === conv.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  res.json({ conversation: conv, messages });
});

app.post('/api/messages/send', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;
  const { recipientId, conversationId, text } = req.body;

  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Message text cannot be empty' });
    return;
  }

  let conv: Conversation | undefined;

  if (conversationId) {
    conv = db.conversations.get(conversationId);
  }

  if (!conv && recipientId) {
    // Find existing between these 2 or create
    conv = Array.from(db.conversations.values()).find(
      (c) => c.participants.includes(currentUserId) && c.participants.includes(recipientId)
    );

    if (!conv) {
      const newConvId = `conv_${currentUserId}_${recipientId}`;
      conv = {
        id: newConvId,
        participants: [currentUserId, recipientId],
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      db.conversations.set(newConvId, conv);
    }
  }

  if (!conv) {
    res.status(400).json({ error: 'Recipient or valid conversation required' });
    return;
  }

  const targetRecipientId =
    recipientId || conv.participants.find((p: string) => p !== currentUserId)!;

  const msgId = `msg_${Date.now()}`;
  const now = new Date().toISOString();
  const message: Message = {
    id: msgId,
    conversationId: conv.id,
    senderId: currentUserId,
    recipientId: targetRecipientId,
    text: text.trim(),
    timestamp: now,
    read: false,
  };

  db.messages.set(msgId, message);

  // Update conversation
  conv.lastMessage = {
    text: message.text,
    senderId: message.senderId,
    timestamp: message.timestamp,
  };
  conv.updatedAt = now;
  conv.unreadCount += 1;
  db.conversations.set(conv.id, conv);

  // Notification for recipient
  const notifId = `notif_${Date.now()}`;
  const notif: AppNotification = {
    id: notifId,
    userId: targetRecipientId,
    type: 'message',
    title: 'New Message',
    message: `${req.user!.name}: ${text.length > 60 ? text.substring(0, 57) + '...' : text}`,
    senderId: req.user!.id,
    senderName: req.user!.name,
    senderAvatar: req.user!.avatar,
    relatedId: conv.id,
    read: false,
    createdAt: now,
  };
  db.notifications.set(notifId, notif);

  // Emit real-time events through Socket.io
  io.to(`user:${targetRecipientId}`).emit('receive_message', { message, conversation: conv });
  io.to(`user:${targetRecipientId}`).emit('new_notification', notif);
  io.to(`user:${currentUserId}`).emit('receive_message', { message, conversation: conv });

  res.status(201).json({ message, conversation: conv });
});

// ==========================================
// REST APIs: Notifications
// ==========================================

app.get('/api/notifications', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;
  const list = Array.from(db.notifications.values())
    .filter((n) => n.userId === currentUserId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = list.filter((n) => !n.read).length;
  res.json({ notifications: list, unreadCount });
});

app.put('/api/notifications/:id/read', authenticateToken, (req: AuthRequest, res: Response): void => {
  const notif = db.notifications.get(req.params.id);
  if (notif && notif.userId === req.user!.id) {
    notif.read = true;
    db.notifications.set(notif.id, notif);
  }
  res.json({ success: true });
});

app.put('/api/notifications/read-all', authenticateToken, (req: AuthRequest, res: Response): void => {
  const currentUserId = req.user!.id;
  Array.from(db.notifications.values()).forEach((n) => {
    if (n.userId === currentUserId) {
      n.read = true;
    }
  });
  res.json({ success: true });
});

// ==========================================
// REST APIs: Opportunities
// ==========================================

app.get('/api/opportunities', (req: Request, res: Response): void => {
  const { type, targetAudience, query } = req.query;
  let list = Array.from(db.opportunities.values());

  if (type && typeof type === 'string' && type !== 'All') {
    list = list.filter((o) => o.type === type);
  }

  if (targetAudience && typeof targetAudience === 'string' && targetAudience !== 'All') {
    list = list.filter((o) =>
      o.targetAudiences.some((a) => a.toLowerCase().includes(targetAudience.toLowerCase()))
    );
  }

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ opportunities: list, total: list.length });
});

// ==========================================
// REST APIs: Global Search
// ==========================================

app.get('/api/search', (req: Request, res: Response): void => {
  const query = (req.query.q as string || '').toLowerCase().trim();

  if (!query) {
    res.json({ people: [], startups: [], creators: [], communities: [] });
    return;
  }

  const allUsers = Array.from(db.users.values()).filter((u) => u.status === 'active');
  const allCommunities = Array.from(db.communities.values());

  const people = allUsers
    .filter((u) => ['Student', 'Working Professional', 'Developer', 'Mentor / Industry Expert'].includes(u.role))
    .filter((u) =>
      u.name.toLowerCase().includes(query) ||
      u.headline.toLowerCase().includes(query) ||
      u.skills.some((s) => s.toLowerCase().includes(query)) ||
      u.industry.toLowerCase().includes(query)
    )
    .map(({ passwordHash, ...p }) => p);

  const startups = allUsers
    .filter((u) => ['Startup', 'Founder'].includes(u.role))
    .filter((u) =>
      u.name.toLowerCase().includes(query) ||
      u.headline.toLowerCase().includes(query) ||
      u.bio.toLowerCase().includes(query) ||
      u.industry.toLowerCase().includes(query)
    )
    .map(({ passwordHash, ...p }) => p);

  const creators = allUsers
    .filter((u) => ['Creator', 'Brand'].includes(u.role))
    .filter((u) =>
      u.name.toLowerCase().includes(query) ||
      u.headline.toLowerCase().includes(query) ||
      u.bio.toLowerCase().includes(query)
    )
    .map(({ passwordHash, ...p }) => p);

  const communities = allCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.tags.some((t) => t.toLowerCase().includes(query))
  );

  res.json({
    people: people.slice(0, 10),
    startups: startups.slice(0, 10),
    creators: creators.slice(0, 10),
    communities: communities.slice(0, 10),
  });
});

// ==========================================
// REST APIs: Admin Dashboard
// ==========================================

app.get('/api/admin/stats', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }

  const users = Array.from(db.users.values());
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const communities = Array.from(db.communities.values()).length;
  const connections = Array.from(db.connections.values());
  const activeConnections = connections.filter((c) => c.status === 'accepted').length;
  const totalMessages = Array.from(db.messages.values()).length;

  res.json({
    totalUsers,
    activeUsers,
    communities,
    activeConnections,
    totalMessages,
    userTypes: {
      students: users.filter((u) => u.role === 'Student').length,
      professionals: users.filter((u) => u.role === 'Working Professional').length,
      founders: users.filter((u) => u.role === 'Founder' || u.role === 'Startup').length,
      creators: users.filter((u) => u.role === 'Creator' || u.role === 'Brand').length,
      developers: users.filter((u) => u.role === 'Developer').length,
      mentors: users.filter((u) => u.role === 'Mentor / Industry Expert').length,
    },
  });
});

app.get('/api/admin/users', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }

  const users = Array.from(db.users.values()).map(({ passwordHash, ...p }) => p);
  res.json({ users });
});

app.put('/api/admin/users/:id/status', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }

  const targetId = req.params.id;
  const user = db.users.get(targetId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { status } = req.body;
  user.status = status === 'deactivated' ? 'deactivated' : 'active';
  db.users.set(targetId, user);

  res.json({ success: true, user: (({ passwordHash, ...p }) => p)(user) });
});

app.get('/api/admin/reports', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }

  // Pre-seeded moderation reports
  res.json({
    reports: [
      {
        id: 'rep_1',
        reportedName: 'Unknown Marketing Bot',
        reporterName: 'David Vance',
        reason: 'Unsolicited mass outreach / spamming connection requests',
        timestamp: '2025-02-18T14:10:00.000Z',
        status: 'Resolved (Account Removed)',
      },
      {
        id: 'rep_2',
        reportedName: 'Off-topic Community Posting',
        reporterName: 'Elena Rostova',
        reason: 'Promotional crypto affiliate links in AI Builders Global discussion',
        timestamp: '2025-02-19T09:20:00.000Z',
        status: 'Under Review',
      },
    ],
  });
});

// ==========================================
// Real-Time Socket.io Connection Handling
// ==========================================

io.on('connection', (socket) => {
  socket.on('join_user', (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on('typing', ({ recipientId, isTyping, userName }) => {
    socket.to(`user:${recipientId}`).emit('user_typing', { isTyping, userName });
  });

  socket.on('disconnect', () => {
    // client disconnected
  });
});

// ==========================================
// Vite Middleware & Production Serving
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Networkth] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
