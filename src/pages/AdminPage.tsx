import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Shield,
  Users,
  UserCheck,
  Globe2,
  Zap,
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    communities: number;
    activeConnections: number;
    totalMessages: number;
    userTypes: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminStats();
      setStats(res);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>PLATFORM OBSERVABILITY & HEALTH</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Networkth Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Live telemetry on user distribution, active reciprocal connections, and community engagement.
            </p>
          </div>

          <button
            type="button"
            onClick={loadStats}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors self-start cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total Members</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalUsers ?? '—'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              +12 new today
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Connections</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.activeConnections ?? '—'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              88% acceptance rate
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Communities</span>
              <Globe2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.communities ?? '—'}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              9 active hubs
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Active Members</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.activeUsers ?? '—'}
            </div>
            <span className="text-[10px] text-amber-600 font-semibold">
              Active sessions
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Live Messages</span>
              <MessageSquare className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalMessages ?? '—'}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold">
              Socket.io synced
            </span>
          </div>
        </div>

        {/* Role Distribution Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Participant Distribution by Role</span>
            </h3>
            <span className="text-xs text-slate-400">Calculated in real-time</span>
          </div>

          {stats?.userTypes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.userTypes).map(([role, count]) => {
                const percentage = Math.round(
                  (count / (stats.totalUsers || 1)) * 100
                );
                return (
                  <div
                    key={role}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">{role}</span>
                      <span className="text-xs font-extrabold text-indigo-600">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2">
                      {percentage}% of platform network
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">Loading breakdown...</div>
          )}
        </div>

        {/* System Activity Stream */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Platform Activity Feed</span>
          </h3>

          <div className="space-y-3">
            {[
              { text: 'Elena Rostova (Founder) connected with Maya Chen (Student)', time: '2 mins ago', type: 'connection' },
              { text: 'Lumina Cloud sponsored Creator Partnership Call with Alex Rivera', time: '14 mins ago', type: 'opportunity' },
              { text: 'David Vance hosted an architectural review in Distributed Systems Guild', time: '45 mins ago', type: 'community' },
              { text: 'New community registered: Stanford AI & Systems Collective', time: '2 hours ago', type: 'community' },
            ].map((ev, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="text-slate-800 font-medium">{ev.text}</span>
                <span className="text-[11px] text-slate-400 shrink-0 ml-4">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
