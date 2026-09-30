import { authService } from '../services/authService.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        success: true,
        message: 'Authentication successful.',
        data: result,
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        error: 'AuthenticationFailed',
        message: err.message,
      });
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};
