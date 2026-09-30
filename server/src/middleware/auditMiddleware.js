import { auditService } from '../services/auditService.js';

export function auditAction(moduleName, actionDescription) {
  return (req, res, next) => {
    // Intercept response finish to log status
    res.on('finish', () => {
      if (res.statusCode < 400) {
        const user = req.user ? req.user.name : (req.body?.name || 'Anonymous User');
        const role = req.user ? req.user.role : 'CITIZEN';
        const recordId = req.params?.id || req.body?.id || req.body?.parcelId || 'SYSTEM';

        auditService.create({
          user,
          role,
          action: typeof actionDescription === 'function' ? actionDescription(req) : actionDescription,
          module: moduleName,
          recordId,
          status: 'Success',
          ipSession: req.ip || req.connection.remoteAddress || '10.14.88.23 [API-SESSION]',
          details: `HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} OK`,
        });
      }
    });

    next();
  };
}
