const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/profile', authMiddleware, userController.getUserProfile);

router.put('/:id', userController.updateUser);

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

router.delete('/:id', userController.deleteUser);

router.get('/get/count', userController.getUserCount);

router.delete('/:id', adminOnly, userController.adminDeleteUser);

module.exports = router;
