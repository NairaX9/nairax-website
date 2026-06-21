// NairaX — Profile

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'index.html';
}

function showMessage(msg, type) {
  const el = document.getElementById('profileMessage');
  el.textContent = msg;
  el.className = 'auth-message ' + type;
}

async function onSupabaseReady() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;

  // Load profile
  const { data: profile } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    const name = profile.full_name || user.email;
    document.getElementById('profileName').value = profile.full_name || '';
    document.getElementById('profileEmail').value = profile.email || user.email;
    document.getElementById('profileWallet').value = profile.wallet_address || '';
    document.getElementById('profileNameDisplay').textContent = name;
    document.getElementById('profileEmailDisplay').textContent = profile.email || user.email;
    document.getElementById('profileAvatarDisplay').textContent = name[0].toUpperCase();
    document.getElementById('userAvatar').textContent = name[0].toUpperCase();
  }

  // Save profile
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('profileBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const fullName = document.getElementById('profileName').value.trim();
    const wallet = document.getElementById('profileWallet').value.trim();

    const { error } = await window.supabase
      .from('profiles')
      .update({ full_name: fullName, wallet_address: wallet })
      .eq('id', user.id);

    if (error) {
      showMessage('Error saving profile: ' + error.message, 'error');
    } else {
      showMessage('Profile updated successfully!', 'success');
      document.getElementById('profileNameDisplay').textContent = fullName;
      document.getElementById('profileAvatarDisplay').textContent = fullName[0].toUpperCase();
      document.getElementById('userAvatar').textContent = fullName[0].toUpperCase();
    }

    btn.disabled = false;
    btn.textContent = 'Save Changes';
  });
}
