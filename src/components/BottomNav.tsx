import React from 'react';
import { Home, Briefcase, Compass, CalendarRange, User } from 'lucide-react';

export type NavTab = 'home' | 'bookings' | 'explore' | 'trip' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activitiesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activitiesCount
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'bookings' as NavTab, label: 'Bookings', icon: Briefcase },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass, badge: activitiesCount > 0 ? activitiesCount : undefined },
    { id: 'trip' as NavTab, label: 'My Trip', icon: CalendarRange },
    { id: 'profile' as NavTab, label: 'Profile', icon: User }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-3 py-2 z-40 flex items-center justify-between">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'text-purple-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110 text-purple-400' : ''}`} />
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-purple-600 text-[9px] font-bold text-white w-3.5 h-3.5 rounded-full flex items-center justify-center border border-slate-900">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[54px]">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1 bg-purple-400 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
