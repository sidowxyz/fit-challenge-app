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
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-150 select-none min-h-[50px] border ${
                  isActive
                    ? 'bg-surface-900 border-volt-500/50 text-volt-400 shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                    : 'bg-surface-950 border-surface-800 text-surface-400 hover:text-surface-200 hover:border-surface-700'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-volt-400' : 'text-surface-400'} />
                <span className={`text-[11px] mt-1 font-athletic uppercase tracking-wider font-extrabold truncate max-w-full px-0.5 ${
                  isActive ? 'text-volt-400' : 'text-surface-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active tab label */}
        <div className="flex items-center space-x-2 mt-3 px-1">
          <ActiveIcon size={16} className="text-volt-400" />
          <span className="text-xs font-athletic font-black uppercase tracking-wider text-white">
            {MORE_TABS.find(t => t.id === activeTab)?.label}
          </span>
          <span className="text-[10px] font-mono text-surface-500 uppercase">
            // {MORE_TABS.find(t => t.id === activeTab)?.desc}
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
