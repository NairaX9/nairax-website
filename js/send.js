// NairaX — Send NRX

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'index.html';
}

function showMessage(msg, type) {
  const el = document.getElementById('sendMessage');
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-message ' + type;
}

function setLoading(loading) {
  const btn = document.getElementById('sendBtn');
  btn.disabled = loading;
  btn.textContent = loading ? 'Sending...' : 'Send NRX';
}

async function onSupabaseReady() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;
  const name = user.user_metadata?.full_name || user.email || 'U';
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();

  // Load balance
  const { data: profile } = await window.supabase
    .from('profiles')
    .select('nrx_balance')
    .eq('id', user.id)
    .single();

  const balance = parseFloat(profile?.nrx_balance || 0);
  document.getElementById('currentBalance').textContent = balance.toFixed(2) + ' NRX';

  // Show summary preview as user types
  document.getElementById('sendAmount').addEventListener('input', updateSummary);
  document.getElementById('recipientEmail').addEventListener('input', updateSummary);

  function updateSummary() {
    const amount = document.getElementById('sendAmount').value;
    const email = document.getElementById('recipientEmail').value;
    const summary = document.getElementById('txSummary');
    if (amount && email) {
      summary.classList.remove('hidden');
      document.getElementById('summaryAmount').textContent = parseFloat(amount).toFixed(2) + ' NRX';
      document.getElementById('summaryEmail').textContent = email;
    } else {
      summary.classList.add('hidden');
    }
  }

  // Handle send form
  document.getElementById('sendForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const recipientEmail = document.getElementById('recipientEmail').value.trim();
    const amount = parseFloat(document.getElementById('sendAmount').value);
    const note = document.getElementById('sendNote').value.trim();

    if (recipientEmail === user.email) {
      showMessage('You cannot send NRX to yourself.', 'error');
      return;
    }

    if (amount <= 0) {
      showMessage('Amount must be greater than 0.', 'error');
      return;
    }

    if (amount > balance) {
      showMessage('Insufficient NRX balance.', 'error');
      return;
    }

    setLoading(true);

    // Record the transaction
    const { error } = await window.supabase
      .from('transactions')
      .insert({
        sender_id: user.id,
        receiver_email: recipientEmail,
        amount: amount,
        note: note || null,
        status: 'completed'
      });

    if (error) {
      showMessage('Transaction failed: ' + error.message, 'error');
      setLoading(false);
      return;
    }

    // Deduct from sender balance
    await window.supabase
      .from('profiles')
      .update({ nrx_balance: balance - amount })
      .eq('id', user.id);

    showMessage(`Successfully sent ${amount.toFixed(2)} NRX to ${recipientEmail}!`, 'success');
    document.getElementById('sendForm').reset();
    document.getElementById('txSummary').classList.add('hidden');
    document.getElementById('currentBalance').textContent = (balance - amount).toFixed(2) + ' NRX';
    setLoading(false);
  });
}
