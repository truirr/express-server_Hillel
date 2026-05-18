import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordSalt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 10000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validatePassword = function validatePassword(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 10000, 64, 'sha512')
    .toString('hex');

  return this.passwordHash === hash;
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
