const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// madina qildi


const { createUser, findByEmail } = require('../models/user');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../middleware/validation');

const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'madinaga-dev-secret';

router.post('/register', validateRegisterInput, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (findByEmail(email)) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = createUser(fullName.trim(), email, hashedPassword);

    return res.status(201).json({
      message: 'User registered successfully.',
      user,
    });
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
