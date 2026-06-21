// NairaX Auth — Login, Signup, Reset

function showMessage(msg, type) {
  const el = document.getElementById('authMessage');
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-message ' + type;
}

function setLoading(btnId, loading, text) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait...' : text;
}

function onSupabaseReady() {
  // Check if already logged in — redirect to dashboard
  window.supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const page = window.location.pathname;
      if (page.includes('login') || page.includes('signup') || page.includes('reset')) {
        window.location.href = 'dashboard.html';
      }
    }
  });

  // LOGIN FORM
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      setLoading('loginBtn', true, 'Log In');

      const { error } = await window.supabase.auth.signInWithPassword({ email, password });

      if (error) {
        showMessage(error.message, 'error');
        setLoading('loginBtn', false, 'Log In');
      } else {
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      }
    });
  }

  // SIGNUP FORM
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (password !== confirm) {
        showMessage('Passwords do not match.', 'error');
        return;
      }

      setLoading('signupBtn', true, 'Create Account');

      const { error } = await window.supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      if (error) {
        showMessage(error.message, 'error');
        setLoading('signupBtn', false, 'Create Account');
      } else {
        showMessage('Account created! Please check your email to confirm your account, then log in.', 'success');
        setLoading('signupBtn', false, 'Create Account');
        setTimeout(() => window.location.href = 'login.html', 3000);
      }
    });
  }

  // RESET FORM
  const resetForm = document.getElementById('resetForm');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value.trim();
      setLoading('resetBtn', true, 'Send Reset Link');

      const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/settings.html'
      });

      if (error) {
        showMessage(error.message, 'error');
        setLoading('resetBtn', false, 'Send Reset Link');
      } else {
        showMessage('Reset link sent! Check your email inbox.', 'success');
        setLoading('resetBtn', false, 'Send Reset Link');
      }
    });
  }
}
