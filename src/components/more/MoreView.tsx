import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { HistoryView } from '../history/HistoryView';
import { ProgressView } from '../progress/ProgressView';
import { ChallengeView } from '../challenge/ChallengeView';
import { SettingsView } from '../settings/SettingsView';

type MoreTab = 'history' | 'progress' | 'challenge' | 'settings';

interface MoreViewProps {
  onOpenAuthModal: () => void;
  onNavigateToWorkout: () => void;
}

const MORE_TABS: { id: MoreTab; label: string; icon: React.FC<any>; desc: string }[] = [
  { id: 'history',   label: 'History',   icon: Icons.History,    desc: 'Past sessions' },
  { id: 'progress',  label: 'Stats',     icon: Icons.TrendingUp, desc: 'Progression' },
  { id: 'challenge', label: '2P Co-Op',  icon: Icons.Users,      desc: 'Partner' },
  { id: 'settings',  label: 'Settings',  icon: Icons.Settings,   desc: 'Preferences' },
];

export const MoreView: React.FC<MoreViewProps> = ({ onOpenAuthModal, onNavigateToWorkout }) => {
  const [activeTab, setActiveTab] = useState<MoreTab>('history');

  const ActiveIcon = MORE_TABS.find(t => t.id === activeTab)?.icon ?? Icons.History;

  return (
    <div className="max-w-4xl mx-auto pb-4">
      {/* ── Tab Selector ── */}
      <div className="sticky top-[64px] z-30 bg-surface-950/95 backdrop-blur-md pb-3 pt-1">
        <div className="grid grid-cols-4 gap-2">
          {MORE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-100 select-none border-2 border-b-4 min-h-[56px] ${
                  isActive
                    ? 'bg-brand-500/15 border-brand-500 border-b-brand-600 text-brand-300'
                    : 'bg-surface-900 border-surface-800 border-b-surface-950 text-surface-400 hover:text-surface-200 hover:border-surface-700 active:translate-y-0.5 active:border-b-2'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-400' : 'text-surface-400'} />
                <span className={`text-[10px] mt-1 font-mono uppercase tracking-tight font-black truncate max-w-full px-0.5 ${
                  isActive ? 'text-brand-300' : 'text-surface-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active tab label */}
        <div className="flex items-center space-x-2 mt-3 px-1">
          <ActiveIcon size={16} className="text-brand-400" />
          <span className="text-xs font-mono font-black uppercase tracking-wider text-surface-300">
            {MORE_TABS.find(t => t.id === activeTab)?.label}
          </span>
          <span className="text-[10px] font-mono text-surface-500 font-bold">
            — {MORE_TABS.find(t => t.id === activeTab)?.desc}
          </span>
        </div>
        <div className="h-px bg-surface-800 mt-2" />
      </div>

      {/* ── Tab Content ── */}
      <div className="pt-4">
        {activeTab === 'history' && (
          <HistoryView onNavigate={(tab) => { if (tab === 'workout') onNavigateToWorkout(); }} />
        )}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'challenge' && <ChallengeView />}
        {activeTab === 'settings' && <SettingsView onOpenAuthModal={onOpenAuthModal} />}
      </div>
    </div>
  );
};
