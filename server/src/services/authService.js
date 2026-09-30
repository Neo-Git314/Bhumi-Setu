import { db } from '../models/db.js';
import { signToken } from '../utils/jwt.js';

export const authService = {
  login: async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required credentials.');
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found. Please check registered email address.');
    }

    // Prototype allows 'password123' or matching password
    if (password !== 'password123' && password !== user.passwordHash) {
      throw new Error('Invalid credentials provided.');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      district: user.district,
      department: user.department,
    };

    const token = signToken(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        district: user.district,
        phone: user.phone,
      },
    };
  },

  getCurrentUser: async (userId) => {
    const user = db.findUserById(userId);
    if (!user) throw new Error('User session not found.');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      department: user.department,
      district: user.district,
      phone: user.phone,
    };
  },
};
