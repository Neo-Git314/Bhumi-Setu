export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'bhumi-setu-360-sih2024-secure-token-key-nic-gov',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
};
