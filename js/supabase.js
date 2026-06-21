// NairaX — Supabase Connection
const SUPABASE_URL = 'https://djgdpubmtrggzmnwdaov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_myAMTYnrjd07clVEg1E-vA_5i6HL4a5';

function loadSupabase() {
  return new Promise((resolve) => {
    if (window.supabase && window.supabase.from) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      resolve();
    };
    document.head.appendChild(script);
  });
}

loadSupabase().then(() => {
  if (typeof onSupabaseReady === 'function') onSupabaseReady();
});
