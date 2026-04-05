const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  findPasswordResetByToken,
  markPasswordResetUsed,
  savePasswordReset,
  updateUserPasswordByEmail,
} = require('../db');
const { findByEmail } = require('../models/user');
const {
  validateForgotPasswordInput,
  validateResetPasswordInput,
} = require('../middleware/validation');

const router = express.Router();
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY_MINUTES = 30;

// POST /api/password/forgot
router.post('/forgot', validateForgotPasswordInput, (req, res) => {
  try {
    const { email } = req.body;

    const user = findByEmail(email);
    // Always respond with success to avoid revealing whether email exists
    if (!user) {
      return res.status(200).json({
        message: 'If that email is registered, a reset token has been sent. Check your console (dev mode).',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();

    savePasswordReset(email, token, expiresAt);

    // In production, send this via email (nodemailer). For dev, log to console.
    console.log(`\n[DEV] Password reset token for ${email}: ${token}\n`);

    return res.status(200).json({
      message: 'Reset token generated. Check the server console for your token (dev mode).',
      // Only expose in dev; remove in production.
      devToken: process.env.NODE_ENV === 'production' ? undefined : token,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/password/reset
router.post('/reset', validateResetPasswordInput, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const record = findPasswordResetByToken(token);

    if (!record) {
      return res.status(400).json({ message: 'Invalid or already used reset token.' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    updateUserPasswordByEmail(record.email, hashedPassword);
    markPasswordResetUsed(token);

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
