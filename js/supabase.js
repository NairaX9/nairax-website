// NairaX — Supabase Connection
const SUPABASE_URL = 'https://djgdpubmtrggzmnwdaov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_myAMTYnrjd07clVEg1E-vA_5i6HL4a5';

// Load Supabase from CDN
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
  window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  if (typeof onSupabaseReady === 'function') onSupabaseReady();
};
document.head.appendChild(supabaseScript);
