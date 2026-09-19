export type UserRole =
  | 'Student'
  | 'Working Professional'
  | 'Founder'
  | 'Startup'
  | 'Creator'
  | 'Brand'
  | 'Developer'
  | 'Community'
  | 'Mentor / Industry Expert';

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  bio: string;
  avatar: string;
  location: string;
  industry: string;
  skills: string[];
  interests: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  communities: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  connectionCount: number;
  status: 'active' | 'deactivated';
  isAdmin?: boolean;
  availability: 'Open to Connect' | 'Mentoring' | 'Hiring' | 'Collaborating' | 'Busy';
  outreachMeta?: {
    companyOrInstitution?: string;
    approachMethod?: string;
    dateApproached?: string;
    followUp1?: string;
    followUp2?: string;
    followUp3?: string;
    response?: string;
    contactNo?: string;
  };
  createdAt: string;
}

export type ConnectionStatus = 'none' | 'pending' | 'received' | 'connected';

export interface ConnectionRecord {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  tags: string[];
  topics: string[];
  audience: string;
  website: string;
  ownerId: string;
  ownerName: string;
  avatar: string;
  bannerGradient: string;
  isJoined?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  otherUser?: UserProfile;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'message'
  | 'community_invite'
  | 'collaboration_request';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Mentorship' | 'Brand Partnership' | 'Early Access' | 'DevRel' | 'Co-Founder' | 'Campus Activation' | 'Collaboration';
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  companyOrOrg: string;
  description: string;
  tags: string[];
  targetAudiences: string[];
  location: string;
  linkText: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  profileType: string;
  industry: string;
  skills: string[];
  location: string;
  availability: string;
  category?: string;
}
