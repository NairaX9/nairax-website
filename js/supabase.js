const SUPABASE_URL = 'https://djgdpubmtrggzmnwdaov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_myAMTYnrjd07clVEg1E-vA_5i6HL4a5';

document.addEventListener('DOMContentLoaded', function() {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.onload = function() {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    if (typeof onSupabaseReady === 'function') {
      onSupabaseReady();
    }
  };
  document.head.appendChild(s);
});
