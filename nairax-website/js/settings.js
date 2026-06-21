// NairaX — Settings

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'index.html';
}

function showMessage(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'auth-message ' + type;
}

function saveNotifications() {
  showMessage('pwMessage', 'Notification preferences saved!', 'success');
}

function confirmDeleteAccount() {
  const confirmed = confirm('Are you sure you want to delete your account? This action CANNOT be undone.');
  if (confirmed) deleteAccount();
}

async function deleteAccount() {
  const { error } = await window.supabase.rpc('delete_user');
  if (error) {
    alert('Could not delete account: ' + error.message);
  } else {
    await window.supabase.auth.signOut();
    window.location.href = 'index.html';
  }
}

async function onSupabaseReady() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;
  const name = user.user_metadata?.full_name || user.email || 'U';
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();

  // Change password form
  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPw = document.getElementById('newPassword').value;
    const confirmPw = document.getElementById('confirmPassword').value;
    const btn = document.getElementById('pwBtn');

    if (newPw !== confirmPw) {
      showMessage('pwMessage', 'Passwords do not match.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Updating...';

    const { error } = await window.supabase.auth.updateUser({ password: newPw });

    if (error) {
      showMessage('pwMessage', 'Error: ' + error.message, 'error');
    } else {
      showMessage('pwMessage', 'Password updated successfully!', 'success');
      document.getElementById('passwordForm').reset();
    }

    btn.disabled = false;
    btn.textContent = 'Update Password';
  });
}
