const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertEl = document.getElementById('alert');
const sessionBox = document.getElementById('sessionBox');
const demoButtons = document.querySelectorAll('.demo-account');

function showAlert(message, type) {
  alertEl.textContent = message;
  alertEl.className = `alert ${type} visible`;
}

function switchTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === tabName);
  });

  loginForm.classList.toggle('hidden', tabName !== 'login');
  registerForm.classList.toggle('hidden', tabName !== 'register');
  alertEl.className = 'alert';
  alertEl.textContent = '';
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

demoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    switchTab('login');
    document.getElementById('loginEmail').value = button.dataset.email;
    document.getElementById('loginPassword').value = button.dataset.password;
    showAlert('Demo account loaded. Click Login to continue.', 'success');
  });
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    fullName: document.getElementById('registerName').value.trim(),
    email: document.getElementById('registerEmail').value.trim(),
    password: document.getElementById('registerPassword').value,
  };

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showAlert(data.message || 'Registration failed.', 'error');
      return;
    }

    showAlert('Registration completed. You can now login.', 'success');
    registerForm.reset();
    switchTab('login');
    document.getElementById('loginEmail').value = payload.email;
  } catch (error) {
    showAlert('Network error while registering.', 'error');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    email: document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value,
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showAlert(data.message || 'Login failed.', 'error');
      sessionBox.classList.add('hidden');
      return;
    }

    localStorage.setItem('madinaga_token', data.token);
    localStorage.setItem('madinaga_user', JSON.stringify(data.user));

    showAlert('Login successful.', 'success');
    sessionBox.innerHTML = `
      <strong>Signed in as:</strong> ${data.user.fullName}<br />
      <strong>Email:</strong> ${data.user.email}<br />
      <strong>Token:</strong> ${data.token.slice(0, 32)}...
    `;
    sessionBox.classList.remove('hidden');
  } catch (error) {
    showAlert('Network error while logging in.', 'error');
  }
});
