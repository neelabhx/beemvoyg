import React, { useState } from 'react';
import { X, Check, Save } from 'lucide-react';
import { UserProfile, BudgetTier, TravelPacing } from '../types/trip';

interface InlineProfileEditModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const InlineProfileEditModal: React.FC<InlineProfileEditModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(profile.budget_tier);
  const [pacing, setPacing] = useState<TravelPacing>(profile.pacing);
  const [interests, setInterests] = useState<string[]>(profile.interests);

  const availableInterests = [
    'Mountain Treks',
    'Tea Plantations',
    'Heritage',
    'Beaches',
    'Wildlife & Safari',
    'Food & Spice'
  ];

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || profile.name,
      phone: phone.trim() || profile.phone,
      budget_tier: budgetTier,
      pacing,
      interests: interests.length > 0 ? interests : profile.interests,
      updated_at: new Date().toISOString()
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end justify-center animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up Bottom Sheet */}
      <div className="relative w-full max-w-[390px] max-h-[85vh] bg-slate-900 border-t border-purple-500/40 rounded-t-[32px] p-5 text-white overflow-y-auto scrollbar-thin shadow-2xl z-10 animate-slideUp">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Edit Profile & Travel Preferences</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Budget Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['economy', 'comfort', 'luxury'] as BudgetTier[]).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudgetTier(tier)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border capitalize transition-all active:scale-95 ${
                    budgetTier === tier
                      ? 'bg-purple-900/60 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Pace */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Travel Pacing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['relaxed', 'balanced', 'fast-paced'] as TravelPacing[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPacing(p)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border capitalize transition-all active:scale-95 ${
                    pacing === p
                      ? 'bg-purple-900/60 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Interests Multi-Select
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableInterests.map((interest) => {
                const isSel = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 flex items-center gap-1 ${
                      isSel
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {interest}
                    {isSel && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-purple-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
