import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LifeState } from '../types';

export interface SyncConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  syncKey: string; // Passphrase to share between PC & phone
  enabled: boolean;
}

const CONFIG_STORAGE_KEY = 'becoming_me_sync_config_v1';

export const getSavedSyncConfig = (): SyncConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read sync config:', e);
  }

  // Fallback to environment variables if provided
  return {
    supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
    syncKey: (import.meta as any).env?.VITE_SUPABASE_SYNC_KEY || 'my-becoming-me-sync',
    enabled: Boolean((import.meta as any).env?.VITE_SUPABASE_URL),
  };
};

export const saveSyncConfig = (config: SyncConfig) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (config: SyncConfig): SupabaseClient | null => {
  if (!config.enabled || !config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === config.supabaseUrl && lastUsedKey === config.supabaseAnonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
    lastUsedUrl = config.supabaseUrl;
    lastUsedKey = config.supabaseAnonKey;
    return cachedClient;
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    return null;
  }
};

// Push local state to Supabase
export const pushStateToCloud = async (
  client: SupabaseClient,
  syncKey: string,
  state: LifeState
): Promise<boolean> => {
  try {
    const { error } = await client
      .from('life_data')
      .upsert(
        {
          id: syncKey,
          data: state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase push error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to push state to Supabase:', err);
    return false;
  }
};

// Pull remote state from Supabase
export const pullStateFromCloud = async (
  client: SupabaseClient,
  syncKey: string
): Promise<LifeState | null> => {
  try {
    const { data, error } = await client
      .from('life_data')
      .select('data, updated_at')
      .eq('id', syncKey)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is single row not found
        console.error('Supabase pull error:', error);
      }
      return null;
    }

    if (data && data.data) {
      return data.data as LifeState;
    }
    return null;
  } catch (err) {
    console.error('Failed to pull state from Supabase:', err);
    return null;
  }
};
