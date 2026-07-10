const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name:       { type: String, required: [true, 'Name is required'], trim: true },
    email:      {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      match:    [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password:   { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    phone:      { type: String, default: '' },
    rollNo:     { type: String, default: '' },
    department: { type: String, default: '' },
    year:       { type: String, default: '' },
    avatar:     { type: String, default: '' },
    role:       { type: String, enum: ['student', 'faculty', 'admin', 'security'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    stats: {
      lostReported: { type: Number, default: 0 },
      foundReported: { type: Number, default: 0 },
      recovered:     { type: Number, default: 0 },
      helped:        { type: Number, default: 0 },
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  { timestamps: true },
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
