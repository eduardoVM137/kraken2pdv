import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: '12345',
  database: 'pdvkraken2',
});

// Crear la instancia de Drizzle
const db = drizzle(pool);

export { pool, db };
