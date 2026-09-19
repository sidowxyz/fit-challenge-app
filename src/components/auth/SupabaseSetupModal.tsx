import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { saveSupabaseConfig } from '../../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_anon_key') || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && key.trim()) {
      saveSupabaseConfig(url, key);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-surface-800 pb-3">
          <div className="flex items-center space-x-2">
            <Icons.Database size={22} className="text-brand-400" />
            <h2 className="text-base font-black font-mono text-surface-100 uppercase tracking-tight">
              Supabase Connection Setup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-100 bg-surface-950 rounded-xl border border-surface-800"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        <div className="text-xs font-mono text-surface-300 space-y-3 leading-relaxed">
          <p className="font-semibold">
            The application is architected with PostgreSQL Row Level Security (RLS) for privacy.
          </p>

          <div className="p-4 bg-surface-950 rounded-2xl border-2 border-surface-800 space-y-2">
            <div className="font-black text-surface-100 uppercase">Setup Steps:</div>
            <ol className="list-decimal list-inside space-y-1 text-surface-400 font-bold">
              <li>Create a Supabase project at <span className="text-brand-400">supabase.com</span>.</li>
              <li>Execute <code>supabase/schema.sql</code> in SQL Editor.</li>
              <li>Paste your Project URL & Anon Key below:</li>
            </ol>
          </div>

          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] uppercase text-surface-400 font-bold mb-1">
                Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-surface-400 font-bold mb-1">
                Public Anon Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-duo-secondary px-4 py-2.5 text-xs font-mono"
              >
                Keep Local Mode
              </button>
              <button
                type="submit"
                className="btn-duo-primary px-6 py-2.5 text-xs font-black uppercase"
              >
                SAVE & SYNC
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
