// NairaX Dashboard

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function toggleNotifications() {
  document.getElementById('notifDropdown').classList.toggle('hidden');
}

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'index.html';
}

async function onSupabaseReady() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;

  // Set avatar letter
  const name = user.user_metadata?.full_name || user.email || 'U';
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();
  document.getElementById('userName').textContent = name.split(' ')[0];

  // Set notification badge
  document.getElementById('notifBadge').textContent = '2';

  // Load profile
  const { data: profile } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    document.getElementById('nrxBalance').textContent = parseFloat(profile.nrx_balance || 0).toFixed(2) + ' NRX';
  }

  // Load transactions
  const { data: txs } = await window.supabase
    .from('transactions')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (txs && txs.length > 0) {
    let total = 0;
    const txList = document.getElementById('txList');
    txList.innerHTML = '';
    txs.forEach(tx => {
      total += parseFloat(tx.amount);
      const item = document.createElement('div');
      item.className = 'tx-item';
      item.innerHTML = `
        <div class="tx-item-left">
          <div class="tx-item-email">To: ${tx.receiver_email}</div>
          <div class="tx-item-date">${new Date(tx.created_at).toLocaleDateString()} ${tx.note ? '· ' + tx.note : ''}</div>
        </div>
        <div class="tx-item-amount">-${parseFloat(tx.amount).toFixed(2)} NRX</div>
      `;
      txList.appendChild(item);
    });
    document.getElementById('totalSent').textContent = total.toFixed(2) + ' NRX';
    document.getElementById('txCount').textContent = txs.length;
  }
}
