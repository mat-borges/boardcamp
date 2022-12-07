import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;

dotenv.config();

// export const connection = new Pool({
// 	host: 'localhost',
// 	port: 5432,
// 	user: 'postgres',
// 	password: 'naolembro123',
// 	database: 'boardcamp',
// });

export const connection = new Pool({ connectionString: process.env.DATABASE_URL });
