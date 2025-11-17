import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return pool;
}

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function checkDbConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const dbPool = getDbPool();
    await dbPool.query('SELECT 1');
    return { connected: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    return { connected: false, error: errorMessage };
  }
}
