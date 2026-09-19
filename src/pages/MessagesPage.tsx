import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { Message, UserProfile, Conversation } from '../types';
import {
  Send,
  MessageSquare,
  Search,
  Sparkles,
  ArrowLeft,
  CheckCheck,
  User,
} from 'lucide-react';

interface MessagesPageProps {
  initialTargetUserId?: string;
  onViewProfile: (userId: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  initialTargetUserId,
  onViewProfile,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(
    initialTargetUserId || null
  );
  const [activePartner, setActivePartner] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user) return;
    try {
      const res = await api.getConversations();
      setConversations(res.conversations);

      // If initialTargetUserId is passed and not in conversations, fetch that user
      if (initialTargetUserId && !activePartner) {
        try {
          const uRes = await api.getUserById(initialTargetUserId);
          setActivePartner(uRes.user);
          setActivePartnerId(initialTargetUserId);
        } catch {
          // ignore
        }
      } else if (!activePartnerId && res.conversations.length > 0 && res.conversations[0].otherUser) {
        setActivePartnerId(res.conversations[0].otherUser.id);
        setActivePartner(res.conversations[0].otherUser);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessagesWithPartner = async (partnerId: string) => {
    try {
      const res = await api.getMessagesWithUser(partnerId);
      setMessages(res.messages);
      setTimeout(scrollToBottom, 50);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (activePartnerId) {
      loadMessagesWithPartner(activePartnerId);
      // Also update activePartner if present in conversations
      const match = conversations.find((c) => c.otherUser?.id === activePartnerId);
      if (match?.otherUser) {
        setActivePartner(match.otherUser);
      } else if (!activePartner || activePartner.id !== activePartnerId) {
        api.getUserById(activePartnerId).then((res) => setActivePartner(res.user));
      }
    }
  }, [activePartnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time socket listener
  useEffect(() => {
    const socket = getSocket();

    const handleReceiveMessage = (data: { message: Message }) => {
      const msg = data.message;
      if (
        (msg.senderId === activePartnerId && msg.recipientId === user?.id) ||
        (msg.senderId === user?.id && msg.recipientId === activePartnerId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      // Refresh conversations list to update previews
      loadConversations();
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [activePartnerId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId || !user) return;

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const res = await api.sendMessage(activePartnerId, text);
      setMessages((prev) => [...prev, res.message]);
      loadConversations();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(
    (c) => c.otherUser && c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex gap-6 overflow-hidden">
        {/* Left Side: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden shrink-0 ${
            activePartnerId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Direct Messages</span>
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversations scroll area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active message threads yet. Connect with members and start a conversation!
              </div>
            ) : (
              filteredConversations.map((c) => {
                if (!c.otherUser) return null;
                const isSelected = activePartnerId === c.otherUser.id;
                return (
                  <div
                    key={c.id || c.otherUser.id}
                    onClick={() => {
                      if (!c.otherUser) return;
                      setActivePartnerId(c.otherUser.id);
                      setActivePartner(c.otherUser);
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.otherUser.avatar}
                        alt={c.otherUser.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      {c.otherUser.availability === 'Open to Connect' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {c.otherUser.name}
                        </span>
                        {c.lastMessage?.timestamp && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(c.lastMessage.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {c.lastMessage?.senderId === user?.id ? 'You: ' : ''}
                        {c.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Box */}
        <div
          className={`flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden ${
            !activePartnerId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePartnerId(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={activePartner.avatar}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{activePartner.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {activePartner.role}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm">
                      {activePartner.headline}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewProfile(activePartner.id)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  View Profile
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/40">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Sparkles className="w-8 h-8 text-indigo-400 mb-2 opacity-70" />
                    <p className="text-xs font-semibold text-slate-700">
                      Start your conversation with {activePartner.name}
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                      Discuss mentorship goals, product feedback, or partnership opportunities.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-slate-900 text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(m.timestamp || (m as any).createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message to ${activePartner.name}...`}
                  className="flex-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  className="p-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No conversation selected</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Choose a conversation from the left to start real-time messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
