import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Phone, Compass, LogOut, Edit3, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/trip';
import { InlineProfileEditModal } from './InlineProfileEditModal';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onSignOut
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Account & Preferences
          </h1>
          <span className="text-[11px] text-purple-400">
            Multi-User Isolated Profile
          </span>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-xs font-semibold text-purple-400 bg-purple-950/70 border border-purple-800/60 px-2.5 py-1 rounded-xl flex items-center gap-1 active:scale-95 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* 1. Identity Card */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/30 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-purple-500/20">
            {userProfile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white tracking-tight">
              {userProfile.name}
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-purple-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userProfile.membership_tier}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{userProfile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>{userProfile.phone}</span>
          </div>
        </div>
      </div>

      {/* 2. Travel Preferences Card */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
          Travel Blueprint
        </span>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Budget Tier</span>
            <span className="text-xs font-bold text-purple-300 capitalize">
              {userProfile.budget_tier}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Pacing</span>
            <span className="text-xs font-bold text-purple-300 capitalize">
              {userProfile.pacing.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block mb-1.5">
            Preferred Experiences:
          </span>
          <div className="flex flex-wrap gap-1">
            {userProfile.interests.map((interest) => (
              <span
                key={interest}
                className="text-[10px] px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Security & Storage Isolation Card */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Data Isolation Active
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
            Encrypted
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Your travel history and itineraries are isolated strictly to your account via Supabase Row-Level Security (RLS) and user-scoped storage tokens.
        </p>
      </div>

      {/* 4. Sign Out Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={onSignOut}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out & Purge Session</span>
        </button>
      </div>

      {/* Slide-over Sheet */}
      <InlineProfileEditModal
        profile={userProfile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateProfile}
      />
    </div>
  );
};
