const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema(
  {
    favoriteCountry: { type: String, default: 'kenya' },
    defaultMetric: { type: String, default: 'temperature' },
    theme: { type: String, default: 'light' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    passwordHash: { type: String },
    role: { type: String, enum: ['admin', 'free', 'premium', 'enterprise'], default: 'free', index: true },
    subscription: {
      tier: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
      status: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'active' },
      expiresAt: { type: Date },
      stripeCustomerId: { type: String },
    },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    profile: {
      organization: { type: String },
      country: { type: String, enum: ['Kenya', 'Tanzania', 'Uganda', 'Other'], default: 'Kenya' },
      useCase: { type: String, enum: ['farming', 'research', 'tourism', 'government', 'personal'], default: 'farming' },
    },
    notifications: {
      type: [
        new mongoose.Schema(
          {
            title: { type: String },
            body: { type: String },
            createdAt: { type: Date, default: Date.now },
            read: { type: Boolean, default: false },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);


