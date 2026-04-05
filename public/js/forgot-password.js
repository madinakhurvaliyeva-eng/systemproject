const alertEl = document.getElementById('alert');
const requestForm = document.getElementById('requestForm');
const resetForm = document.getElementById('resetForm');
const requestBtn = document.getElementById('requestBtn');
const resetBtn = document.getElementById('resetBtn');

function showAlert(message, type) {
  alertEl.textContent = message;
  alertEl.className = `alert ${type} visible`;
}

requestForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  requestBtn.disabled = true;

  try {
    const response = await fetch('/api/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      showAlert(data.message || 'Could not generate reset token.', 'error');
      return;
    }

    const tokenMessage = data.devToken
      ? `${data.message} Dev token: ${data.devToken}`
      : data.message;

    showAlert(tokenMessage, 'success');
    requestForm.classList.add('hidden');
    resetForm.classList.remove('hidden');
  } catch (error) {
    showAlert('Network error while requesting reset token.', 'error');
  } finally {
    requestBtn.disabled = false;
  }
});

resetForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    token: document.getElementById('token').value.trim(),
    newPassword: document.getElementById('newPassword').value,
  };

  resetBtn.disabled = true;

  try {
    const response = await fetch('/api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showAlert(data.message || 'Password update failed.', 'error');
      return;
    }

    showAlert('Password updated. Return to login page.', 'success');
    resetForm.reset();
  } catch (error) {
    showAlert('Network error while resetting password.', 'error');
  } finally {
    resetBtn.disabled = false;
  }
});
