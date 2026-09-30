import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import landRecordRoutes from './routes/landRecordRoutes.js';
import gisRoutes from './routes/gisRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file storage for prototype uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Health & Metadata Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'BHUMI SETU 360° Land Governance Engine',
    version: '1.0.0-SIH2024',
    environment: process.env.NODE_ENV || 'development',
    spatialEngine: 'PostGIS / Pure Spatial Geometric Core',
    timestamp: new Date().toISOString(),
  });
});

// Mount Module APIs
app.use('/api/auth', authRoutes);
app.use('/api/land-records', landRecordRoutes);
app.use('/api/gis', gisRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`BHUMI SETU 360° Backend Server is active on port ${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================================================');
});

export default app;
