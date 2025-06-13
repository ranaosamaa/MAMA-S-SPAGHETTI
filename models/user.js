const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    favs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    }],
    adds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    }],
    lastViewed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    },
    darkMood: {
        type: Boolean,
        default: false,
    },
});
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.checkPassword = function(inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.set('toJSON', {
    virtuals: true,
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();

    module.exports = mongoose.model('User', userSchema);
});
exports.user= mongoose.model('user', userSchema);
exports.userSchema = userSchema;
