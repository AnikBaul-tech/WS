import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import pg from 'pg';

if (!process.env.DATBASE_URL){
    throw new Error('Database-URL is not defined');
}
export const pool = new pg.Pool({
    connectionString: process.env.DATBASE_URL,
})

export const db = drizzle(pool);