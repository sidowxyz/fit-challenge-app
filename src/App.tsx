import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';
import { Navbar, TabType } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TodayWorkoutView } from './components/workout/TodayWorkoutView';
import { CalendarView } from './components/calendar/CalendarView';
import { MoreView } from './components/more/MoreView';
import { AuthModal } from './components/auth/AuthModal';
import { SupabaseSetupModal } from './components/auth/SupabaseSetupModal';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <main className="min-w-0 overflow-x-hidden pb-28 sm:pb-32">

          {currentTab === 'dashboard' && (
            <DashboardView onNavigate={(tab) => {
              // Map legacy tabs to new structure
              if (tab === 'history' || tab === 'progress' || tab === 'challenge' || tab === 'settings') {
                setCurrentTab('more');
              } else {
                setCurrentTab(tab as TabType);
              }
            }} />
          )}

          {currentTab === 'workout' && (
            <TodayWorkoutView onNavigateToCalendar={() => setCurrentTab('calendar')} />
          )}

          {currentTab === 'calendar' && (
            <CalendarView onNavigate={(tab) => {
              if (tab === 'history' || tab === 'progress' || tab === 'challenge' || tab === 'settings') {
                setCurrentTab('more');
              } else {
                setCurrentTab(tab as TabType);
              }
            }} />
          )}

          {currentTab === 'more' && (
            <MoreView 
              onOpenAuthModal={() => setAuthModalOpen(true)}
              onNavigateToWorkout={() => setCurrentTab('workout')}
            />
          )}

        </main>
      </div>

      {/* Unified Bottom Navbar */}
      <BottomNav 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FitnessProvider>
        <AppContent />
      </FitnessProvider>
    </AuthProvider>
  );
}
