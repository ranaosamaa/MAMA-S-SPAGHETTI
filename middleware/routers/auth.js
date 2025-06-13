
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send('User already exists.');

  const user = await User.create({ email, password });
  req.session.user = { id: user._id, email: user.email };
  res.redirect('/dashboard');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.send('Invalid login');
  }
  req.session.user = { id: user._id, email: user.email };
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
