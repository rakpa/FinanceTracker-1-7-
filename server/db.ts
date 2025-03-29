import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: 'postgresql://rakpa:abc123@ec2-52-72-171-61.compute-1.amazonaws.com:5432/postgres?schema=public',
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Function to run migrations
export async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/0000_initial.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}
