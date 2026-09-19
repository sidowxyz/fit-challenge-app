import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';

export const ChallengeView: React.FC = () => {
  const { 
    currentDayNumber, 
    stats, 
    challenge, 
    partner, 
    joinChallenge
  } = useFitness();
  const { profile } = useAuth();

  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [joinStatus, setJoinStatus] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(challenge.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsJoining(true);
    setJoinStatus(null);

    const result = await joinChallenge(inputCode);
    setIsJoining(false);

    if (result.success) {
      setJoinStatus('Joined challenge partner successfully!');
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinStatus(null);
        setInputCode('');
      }, 1200);
    } else {
      setJoinStatus(result.error || 'Failed to join challenge.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* 1. CHALLENGE HERO BANNER */}
      <div className="card-duo p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-brand-400 font-black mb-1">
              <span>Private 2-Person Co-Op</span>
              <span>·</span>
              <span>Code: {challenge.invite_code}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-surface-100 font-mono">
              100-Day Fitness Challenge
            </h1>
            <p className="text-xs font-mono text-surface-400 font-semibold mt-1">
              September 19, 2026 → December 27, 2026
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="btn-duo-secondary px-4 py-2 text-xs font-mono flex items-center space-x-1.5"
            >
              {copied ? <Icons.Check size={16} className="text-emerald-400" /> : <Icons.Copy size={16} className="text-surface-400" />}
              <span>{copied ? 'COPIED' : 'COPY CODE'}</span>
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn-duo-primary px-4 py-2 text-xs font-mono font-black flex items-center space-x-1.5"
            >
              <Icons.Key size={14} />
              <span>JOIN CODE</span>
            </button>
          </div>
        </div>

        {/* Challenge Day Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between items-baseline text-xs font-mono mb-2 font-bold">
            <span className="text-surface-100 font-black">DAY {currentDayNumber} / 100</span>
            <span className="text-brand-400 font-black">{currentDayNumber}% COMPLETE</span>
          </div>
          <div className="w-full h-3 bg-surface-950 rounded-full overflow-hidden border-2 border-surface-800 p-0.5">
            <div 
              className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{ width: `${currentDayNumber}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE PARTNER COMPARISON */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-surface-400 font-black px-1">
          Co-Op Partners
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* USER CARD (YOU) */}
          <div className="card-duo p-5 sm:p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-brand-500/20 border-b-2 border-l-2 border-brand-500/40 text-[10px] font-mono text-brand-300 font-black uppercase rounded-bl-xl">
              You
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border-2 border-brand-500/40 border-b-4 border-b-brand-600 flex items-center justify-center font-black text-base text-brand-300">
                {profile?.name?.charAt(0).toUpperCase() || 'Y'}
              </div>
              <div>
                <h3 className="text-base font-black text-surface-100 uppercase font-mono">
                  {profile?.name || 'You'}
                </h3>
                <div className="text-xs font-mono text-brand-400 font-black">
                  Day {currentDayNumber} of 100
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Gym Workouts</span>
                <div className="text-xl font-black font-mono text-surface-100">{stats.workoutsCompleted}</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Football Sessions</span>
                <div className="text-xl font-black font-mono text-surface-100">{stats.footballSessions}</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Active Streak</span>
                <div className="text-xl font-black font-mono text-amber-400">{stats.currentStreak} days</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Consistency</span>
                <div className="text-xl font-black font-mono text-emerald-400">{stats.consistencyPercentage}%</div>
              </div>
            </div>
          </div>

          {/* PARTNER CARD (FRIEND) */}
          <div className="card-duo p-5 sm:p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-800 border-b-2 border-l-2 border-surface-700 text-[10px] font-mono text-surface-300 font-black uppercase rounded-bl-xl">
              Friend
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-surface-950 border-2 border-surface-700 border-b-4 border-b-surface-950 flex items-center justify-center font-black text-base text-surface-200">
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-black text-surface-100 uppercase font-mono">
                  {partner.name}
                </h3>
                <div className="text-xs font-mono text-surface-400 font-bold">
                  Day {partner.currentDay} of 100
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Gym Workouts</span>
                <div className="text-xl font-black font-mono text-surface-100">{partner.workoutsCompleted}</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Football Sessions</span>
                <div className="text-xl font-black font-mono text-surface-100">{partner.footballSessions}</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Active Streak</span>
                <div className="text-xl font-black font-mono text-amber-400">{partner.currentStreak} days</div>
              </div>
              <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800">
                <span className="text-[11px] font-mono text-surface-400 font-bold">Consistency</span>
                <div className="text-xl font-black font-mono text-emerald-400">{partner.consistencyPercentage}%</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PHILOSOPHY & NON-BODYWEIGHT TRACKING NOTICE */}
      <div className="card-duo p-4 text-xs font-mono text-surface-400 flex items-start space-x-3">
        <Icons.ShieldCheck size={22} className="text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black text-surface-200 uppercase">Product Philosophy:</span>
          <p className="leading-relaxed font-medium">
            This challenge is focused on execution, consistency, progressive strength overload, and completing 100 days together. We do not rank users on body weight or size.
          </p>
        </div>
      </div>

      {/* JOIN CODE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm">
          <form onSubmit={handleJoin} className="w-full max-w-md bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight font-mono">
              Join Friend's Challenge
            </h3>
            
            <p className="text-xs font-mono text-surface-400 font-semibold">
              Enter the invite code shared by your training partner (e.g. FIT-100-2026).
            </p>

            <div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="ENTER INVITE CODE"
                className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-3 text-sm font-mono font-black text-surface-100 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 uppercase tracking-wider"
                required
              />
            </div>

            {joinStatus && (
              <div className={`text-xs font-mono font-bold p-3 rounded-xl ${
                joinStatus.includes('successfully') ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-2 border-rose-500/40'
              }`}>
                {joinStatus}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="btn-duo-secondary px-4 py-2.5 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isJoining || !inputCode.trim()}
                className="btn-duo-primary px-6 py-2.5 text-xs font-black uppercase"
              >
                {isJoining ? 'Connecting...' : 'Connect Partner'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
