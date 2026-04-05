function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function sendValidationError(res, message) {
  return res.status(400).json({ message });
}

function validateRegisterInput(req, res, next) {
  const { fullName, email, password } = req.body;

  if (!String(fullName || '').trim()) {
    return sendValidationError(res, 'Full name is required.');
  }

  if (!isEmail(email)) {
    return sendValidationError(res, 'A valid email is required.');
  }

  if (String(password || '').length < 6) {
    return sendValidationError(res, 'Password must be at least 6 characters.');
  }

  next();
}

function validateLoginInput(req, res, next) {
  const { email, password } = req.body;

  if (!isEmail(email)) {
    return sendValidationError(res, 'A valid email is required.');
  }

  if (!String(password || '').trim()) {
    return sendValidationError(res, 'Password is required.');
  }

  next();
}

function validateForgotPasswordInput(req, res, next) {
  const { email } = req.body;

  if (!isEmail(email)) {
    return sendValidationError(res, 'A valid email is required.');
  }

  next();
}

function validateResetPasswordInput(req, res, next) {
  const { token, newPassword } = req.body;

  if (!String(token || '').trim()) {
    return sendValidationError(res, 'Reset token is required.');
  }

  if (String(newPassword || '').length < 6) {
    return sendValidationError(res, 'New password must be at least 6 characters.');
  }

  next();
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
};
