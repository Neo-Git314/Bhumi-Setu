import { verifyToken } from '../utils/jwt.js';

export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'AuthenticationRequired',
      message: 'Access denied. Valid Bearer token required in Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Authentication token is invalid or expired.',
    });
  }

  req.user = decoded;
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AuthenticationRequired',
        message: 'User authentication required prior to role verification.',
      });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole) && !normalizedAllowed.includes('ADMIN')) {
      return res.status(403).json({
        success: false,
        error: 'ForbiddenRole',
        message: `Action not permitted for role "${req.user.role}". Allowed roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
