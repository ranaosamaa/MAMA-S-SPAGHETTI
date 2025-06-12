const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Read all
exports.getAllUser = async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
};


//Read by id
exports.getUserByID = async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
};

//Read one
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) return res.status(404).send('User not found');
    res.send(user);
};

//update
exports.updateUser = async (req, res) => {
    const userExist = await User.findById(req.params.id);
    const newPassword = req.body.password
        ? bcrypt.hashSync(req.body.password, 8)
        : userExist.passwordHash;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            profilepic: req.body.profilepic,
            isAdmin: req.body.isAdmin,
            favorites: req.body.favorites,
            posted: req.body.posted,
        },
        { new: true }
    );

    if (!user) return res.status(400).send('User update failed!');
    res.send(user);
};


//login exit user
exports.loginUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) return res.status(400).send('User not found');

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            secret,
            { expiresIn: '1d' }
        );
        res.status(200).send({ user: user.email, token });
    } else {
        res.status(400).send('Wrong password');
    }
};

//create new user
exports.registerUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 8),
        profilepic: req.body.profilepic,
        isAdmin: req.body.isAdmin || false,
        favorites: [],
        posted: [],
    });
    user = await user.save();
    if (!user) return res.status(400).send('User registration failed!');
    res.send(user);
};

//Delete user
exports.deleteUser = async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) return res.status(200).json({ success: true, message: 'User deleted!' });
        return res.status(404).json({ success: false, message: 'User not found!' });
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
};


//Count
exports.getUserCount = async (req, res) => {
    const userCount = await User.countDocuments();
    if (!userCount) return res.status(500).json({ success: false });
    res.send({ userCount });
};

//admin delete one user
exports.adminDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
        res.status(200).json({ success: true, message: 'The user is deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};
