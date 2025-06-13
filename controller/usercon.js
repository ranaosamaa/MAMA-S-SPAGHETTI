const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Read all
exports.getAllUser = async (req, res) => {
    try {
        const userList = await User.find().select('-password');
        res.send(userList);
    } catch {
        res.status(500).json({ success: false });
    }
};

// Read by ID
exports.getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).send(user);
    } catch {
        res.status(500).json({ message: 'Error fetching user.' });
    }
};

// Read profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch {
        res.status(500).send('Failed to get user profile');
    }
};

// Update 
exports.updateUser = async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) return res.status(404).send('User not found');

        const newPassword = req.body.password
            ? bcrypt.hashSync(req.body.password, 8)
            : userExist.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: newPassword,
                img: req.body.img,
                favs: req.body.favs,
                adds: req.body.adds,
                lastViewed: req.body.lastViewed,
                darkMood: req.body.darkMood,
            },
            { new: true }
        );

        if (!user) return res.status(400).send('User update failed!');
        res.send(user);
    } catch (err) {
        res.status(500).send('Error updating user');
    }
};

// Login
exports.loginUser = async (req, res) => {
    const { loginUsername, loginPassword } = req.body;
    if (!loginUsername || !loginPassword) {
        return res.status(400).send('Missing login credentials.');
    }

    const user = await User.findOne({ email: loginUsername });
    if (!user) return res.status(400).send('User not found');

    const isMatch = bcrypt.compareSync(loginPassword, user.password);
    if (!isMatch) return res.status(400).send('Wrong password');

    const token = jwt.sign(
        { userId: user.id, admin: user.admin },
        process.env.secret,
        { expiresIn: '1d' }
    );

    res.status(200).send({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
            admin: user.admin,
            darkMood: user.darkMood,
        },
        token,
    });
};

// Create
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Missing required fields.');
    }

    let user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 8),
        img: "/images/default-profile.png",
        admin: false,
        favs: [],
        adds: [],
        lastViewed: null,
        darkMood: false
    });

    try {
        user = await user.save();
        res.status(201).send({
            id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('User with that email or name already exists.');
        } else {
            res.status(400).send('User registration failed.');
        }
    }
};

// Delete 
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found!' });
        res.status(200).json({ success: true, message: 'User deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

// Get user count
exports.getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.send({ userCount });
    } catch {
        res.status(500).json({ success: false });
    }
};

// admin Delete
exports.adminDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found!' });
        res.status(200).json({ success: true, message: 'The user is deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

// last viewed 
exports.updateLastViewed = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { lastViewed: req.body.recipeId },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).send('User not found');
        res.send({ message: 'Last viewed recipe updated', lastViewed: user.lastViewed });
    } catch (err) {
        res.status(500).send('Failed to update last viewed');
    }
};

// dark mode
exports.toggleDarkMode = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).send('User not found');

        user.darkMood = !user.darkMood;
        await user.save();

        res.send({ message: 'Dark mode toggled', darkMood: user.darkMood });
    } catch (err) {
        res.status(500).send('Failed to toggle dark mode');
    }
};
