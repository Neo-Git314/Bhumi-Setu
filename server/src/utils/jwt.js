import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';

export function signToken(payload) {
  return jwt.sign(payload, JWT_CONFIG.SECRET, { expiresIn: JWT_CONFIG.EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET);
  } catch (err) {
    return null;
  }
}
