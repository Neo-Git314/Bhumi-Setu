import pg from 'pg';
const { Pool } = pg;

export const DB_CONFIG = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'bhumi_setu',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  connectionString: process.env.DATABASE_URL,
};

let pool = null;

export const getDbPool = () => {
  if (!pool && (process.env.DATABASE_URL || process.env.ENABLE_POSTGRES === 'true')) {
    try {
      pool = new Pool(
        process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : DB_CONFIG
      );
      pool.on('error', (err) => {
        console.warn('PostgreSQL pool error (falling back to memory store):', err.message);
      });
    } catch (e) {
      console.warn('Could not initialize PostgreSQL pool:', e.message);
      pool = null;
    }
  }
  return pool;
};
