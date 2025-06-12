const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profilepic: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
     }],
    posted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
     }],
});

userSchema.set('toJSON', {
    virtuals: true,
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.user= mongoose.model('user', userSchema);
exports.userSchema = userSchema;