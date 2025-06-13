const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usercon = require('../controller/usercon');
const { authMiddleware, adminOnly } = require('../middleware/auth');


router.get('/', usercon.getAllUser);
router.get('/:id', authMiddleware, usercon.getUserByID);
router.get('/profile',authMiddleware, usercon.getUserProfile);

router.put('/:id', authMiddleware, usercon.updateUser);

router.post('/login', usercon.loginUser);
router.post('/register', usercon.registerUser);

router.delete('/:id', authMiddleware, usercon.deleteUser);

router.get('/get/count', adminOnly, usercon.getUserCount);

router.delete('/:id', adminOnly, usercon.adminDeleteUser);

router.patch('/last-viewed',  authMiddleware, usercon.updateLastViewed);
router.patch('/dark-mode', authMiddleware, usercon.toggleDarkMode);

module.exports = router;
