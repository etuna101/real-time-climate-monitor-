const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersById = new Map();
const usersByEmail = new Map();

const DEFAULT_ALERTS = [
  {
    _id: 'alert-kenya-rains',
    type: 'heavy_rain',
    severity: 'moderate',
    location: 'Kenyan Highlands',
    description: 'Short rains intensifying in Central Highlands. Localized flooding possible in low-lying areas.',
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'alert-tanzania-drought',
    type: 'drought',
    severity: 'high',
    location: 'Southern Tanzania',
    description: 'Developing drought conditions; hydropower generation affected by low inflows.',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

function createUserRecord({ email, name, passwordHash, role = 'free' }) {
  const id = crypto.randomUUID();
  const user = {
    id,
    _id: id,
    email,
    name: name || email.split('@')[0],
    passwordHash,
    role,
    subscription: { tier: 'free', status: 'active' },
    preferences: { favoriteCountry: 'kenya', defaultMetric: 'temperature', theme: 'light' },
    profile: { organization: '', country: 'Kenya', useCase: 'farming' },
    notifications: [
      {
        title: 'Welcome to East Africa Climate Monitor',
        body: 'Live weather, soil moisture, and regional alerts are ready on your dashboard.',
        createdAt: new Date(),
        read: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  usersById.set(id, user);
  usersByEmail.set(email, user);
  return user;
}

async function seedDemoUser() {
  const email = 'farmer@example.com';
  if (usersByEmail.has(email)) return;
  const passwordHash = await bcrypt.hash('password', 10);
  createUserRecord({ email, name: 'Demo Farmer', passwordHash });
}

function findUserByEmail(email) {
  return usersByEmail.get(String(email || '').toLowerCase()) || null;
}

function findUserById(id) {
  return usersById.get(id) || null;
}

function updateUser(id, patch) {
  const user = usersById.get(id);
  if (!user) return null;
  const next = { ...user, ...patch, updatedAt: new Date() };
  if (patch.profile) next.profile = { ...user.profile, ...patch.profile };
  if (patch.preferences) next.preferences = { ...user.preferences, ...patch.preferences };
  if (patch.subscription) next.subscription = { ...user.subscription, ...patch.subscription };
  usersById.set(id, next);
  usersByEmail.set(next.email, next);
  return next;
}

function getAlerts() {
  const now = Date.now();
  return DEFAULT_ALERTS.filter((a) => new Date(a.endTime).getTime() >= now);
}

module.exports = {
  seedDemoUser,
  createUserRecord,
  findUserByEmail,
  findUserById,
  updateUser,
  publicUser,
  getAlerts,
};
