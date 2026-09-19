import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { ConnectModal } from '../components/ConnectModal';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  MessageSquare,
  UserPlus,
  Check,
  Clock,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Sparkles,
  Edit3,
  Save,
  X,
  Users,
  Tag,
  ArrowLeft,
} from 'lucide-react';

interface UserProfilePageProps {
  userId: string;
  onBack: () => void;
  onOpenMessage: (userId: string) => void;
  onNavigateToCommunityName?: (communityName: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userId,
  onBack,
  onOpenMessage,
}) => {
  const { user: currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'received' | 'connected'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Edit form state
  const [editHeadline, setEditHeadline] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvailability, setEditAvailability] = useState<
    'Open to Connect' | 'Mentoring' | 'Hiring' | 'Collaborating' | 'Busy'
  >('Open to Connect');
  const [editSkills, setEditSkills] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isMe = currentUser?.id === userId;

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.getUserById(userId);
      setProfile(res.user);
      setConnectionStatus(res.connectionStatus);

      // Pre-fill edit form
      setEditHeadline(res.user.headline || '');
      setEditBio(res.user.bio || '');
      setEditLocation(res.user.location || '');
      setEditAvailability(res.user.availability || 'Open to Connect');
      setEditSkills(res.user.skills?.join(', ') || '');
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      const skillsArray = editSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await updateProfile({
        headline: editHeadline,
        bio: editBio,
        location: editLocation,
        availability: editAvailability,
        skills: skillsArray,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#fafbfd] flex items-center justify-center p-8">
        <div className="text-center text-slate-400 text-xs">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Top Banner Navigation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 mb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mb-6">
          {/* Cover gradient */}
          <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {profile.role}
              </span>
            </div>
          </div>

          {/* Profile details */}
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                />
                <span
                  title={profile.availability}
                  className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                {isMe ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                  </button>
                ) : (
                  <>
                    {connectionStatus === 'connected' ? (
                      <button
                        type="button"
                        onClick={() => onOpenMessage(profile.id)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    ) : connectionStatus === 'pending' ? (
                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold cursor-default"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Request Pending</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConnectModalOpen(true)}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenMessage(profile.id)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      title="Direct Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Identity */}
            {!isEditing ? (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {profile.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed">
                  {profile.headline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span>{profile.industry}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    {profile.availability}
                  </span>
                </div>

                {/* Social Links */}
                {profile.socialLinks && (
                  <div className="flex items-center gap-2 mt-4 text-slate-400">
                    {profile.socialLinks.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Inline Edit Form */
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Availability Status
                    </label>
                    <select
                      value={editAvailability}
                      onChange={(e) =>
                        setEditAvailability(
                          e.target.value as
                            | 'Open to Connect'
                            | 'Mentoring'
                            | 'Hiring'
                            | 'Collaborating'
                            | 'Busy'
                        )
                      }
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Open to Connect">Open to Connect</option>
                      <option value="Mentoring">Mentoring</option>
                      <option value="Collaborating">Collaborating</option>
                      <option value="Hiring">Hiring</option>
                      <option value="Busy">Busy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bio / About
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Profile Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                About & Background
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {profile.bio || 'No bio provided yet.'}
              </p>
            </div>

            {/* Experience Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Experience & Roles</span>
              </h3>
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {profile.experience?.map((exp, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-xs -translate-x-1/2" />
                    <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {exp.company} • {exp.period}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Education</span>
                </h3>
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">{edu.school}</h4>
                      <div className="text-[11px] text-slate-600">{edu.degree}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Skills & Technologies */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Skills & Expertise</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Communities Joined */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Communities</span>
              </h3>
              <div className="space-y-2">
                {profile.communities?.map((comm) => (
                  <div
                    key={comm}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{comm}</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                      Member
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reciprocal Synergy Recommendation Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Why Connect?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with {profile.name.split(' ')[0]} for{' '}
                <span className="font-semibold text-slate-800">
                  {profile.role === 'Student'
                    ? 'mentorship and junior project collaboration'
                    : profile.role === 'Founder'
                    ? 'startup feedback and early product testing'
                    : profile.role === 'Creator'
                    ? 'developer sponsorship opportunities'
                    : 'technical architecture discussions'}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      <ConnectModal
        targetUser={profile}
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onSuccess={() => {
          loadProfile();
        }}
      />
    </div>
  );
};
