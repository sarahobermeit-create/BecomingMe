import React, { useState } from 'react';
import {
  Cloud,
  CloudLightning,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { SyncConfig } from '../../services/supabase';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SyncConfig;
  onSaveConfig: (newConfig: SyncConfig) => Promise<boolean>;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'error';
  lastSynced: string | null;
  onManualPush: () => Promise<void>;
  onManualPull: () => Promise<void>;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  syncStatus,
  lastSynced,
  onManualPush,
  onManualPull,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(config.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(config.supabaseAnonKey);
  const [syncKey, setSyncKey] = useState(config.syncKey);
  const [enabled, setEnabled] = useState(config.enabled);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const sqlSetupSnippet = `-- Run this in Supabase SQL Editor once:
create table if not exists life_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable access
alter table life_data enable row level security;
create policy "Allow anon access for BecomingMe" on life_data for all using (true) with check (true);

-- Enable real-time updates across devices
alter publication supabase_realtime add table life_data;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const success = await onSaveConfig({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
      syncKey: syncKey.trim() || 'my-becoming-me-sync',
      enabled,
    });

    setSaving(false);
    if (success) {
      setMessage({ text: 'Connected and synchronized successfully!', type: 'success' });
    } else {
      setMessage({
        text: 'Failed to connect. Please verify your Supabase URL, Key, and that you ran the SQL script.',
        type: 'error',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cross-Device Cloud Sync</h3>
              <p className="text-xs text-slate-400">Live 2-way sync between phone & PC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Current Status Banner */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                config.enabled && syncStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : config.enabled && syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-spin'
                  : 'bg-slate-500'
              }`}
            />
            <div>
              <p className="text-xs font-semibold text-white">
                {config.enabled && syncStatus === 'connected'
                  ? 'Cloud Sync Active (Real-time)'
                  : config.enabled && syncStatus === 'syncing'
                  ? 'Syncing changes...'
                  : 'Offline / Local Storage Only'}
              </p>
              {lastSynced && (
                <p className="text-[11px] text-slate-400 font-mono">Last synced: {lastSynced}</p>
              )}
            </div>
          </div>

          {config.enabled && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onManualPush}
                title="Force push this device's data to cloud"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5 text-violet-400" />
                <span className="hidden sm:inline">Push</span>
              </button>
              <button
                type="button"
                onClick={onManualPull}
                title="Force pull cloud data to this device"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs flex items-center gap-1"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Pull</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Instructions Step-by-Step */}
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2 text-xs">
          <p className="font-semibold text-violet-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>How to setup free sync in 2 minutes:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
            <li>
              Create a free project at{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 underline inline-flex items-center gap-0.5 font-medium"
              >
                supabase.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </li>
            <li>
              Go to **SQL Editor** on the left menu, paste the SQL snippet below, and click **Run**.
            </li>
            <li>
              Copy your **Project URL** and **anon public key** from Project Settings &gt; API and paste below.
            </li>
            <li>
              Enter the **same Sync Key** (passphrase) on both your PC and Samsung phone!
            </li>
          </ol>

          {/* Copy SQL Box */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Setup SQL Script (1-Click Copy)</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy SQL
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-slate-300 font-mono overflow-x-auto">
              {sqlSetupSnippet}
            </pre>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <label className="font-semibold text-white block">Enable Cloud Sync</label>
              <p className="text-[11px] text-slate-400">Keep data in real-time sync with Supabase</p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-violet-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Supabase Project URL</label>
            <input
              type="url"
              required={enabled}
              placeholder="https://your-project-ref.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Supabase Anon Public API Key</label>
            <input
              type="password"
              required={enabled}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Sync Passphrase / Key (Must match on Phone & PC)
            </label>
            <input
              type="text"
              required={enabled}
              placeholder="e.g. sarah-becoming-me-2026"
              value={syncKey}
              onChange={(e) => setSyncKey(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : null}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-md shadow-violet-900/30 flex items-center gap-2"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Save & Connect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
