// NairaX — Transactions

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'index.html';
}

let allTransactions = [];

function filterTransactions() {
  const query = document.getElementById('txSearch').value.toLowerCase();
  const filtered = allTransactions.filter(tx =>
    tx.receiver_email.toLowerCase().includes(query) ||
    (tx.note && tx.note.toLowerCase().includes(query)) ||
    tx.status.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

function renderTable(txs) {
  const tbody = document.getElementById('txTableBody');
  if (!txs || txs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="tx-empty">No transactions found.</td></tr>';
    return;
  }
  tbody.innerHTML = txs.map(tx => `
    <tr>
      <td>${new Date(tx.created_at).toLocaleDateString()}</td>
      <td>${tx.receiver_email}</td>
      <td style="color:var(--green);font-weight:700">${parseFloat(tx.amount).toFixed(2)} NRX</td>
      <td>${tx.note || '—'}</td>
      <td><span class="status-badge ${tx.status}">${tx.status}</span></td>
    </tr>
  `).join('');
}

async function onSupabaseReady() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;
  const name = user.user_metadata?.full_name || user.email || 'U';
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();

  const { data: txs } = await window.supabase
    .from('transactions')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false });

  allTransactions = txs || [];
  renderTable(allTransactions);
}
