const crypto = require('crypto');
const mongooes = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongooes.Schema({
  name: {
    type: String,
    require: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    require: [true, 'Email is required!'],
    unique: true,
    validate: [validator.isEmail],
    lowercase: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return this.password === this.passwordConfirm;
      },
      message: 'Password not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongooes.model('User', UserSchema);

module.exports = User;
