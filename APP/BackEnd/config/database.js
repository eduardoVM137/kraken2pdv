// APP/BackEnd/config/database.js

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/schema.js"; // asegúrate de que apunte al nuevo schema
import dotenv from "dotenv";

dotenv.config();

// Crear el pool de conexiones con PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Instancia de Drizzle con el pool y el schema
const db = drizzle(pool, { schema });

export { pool, db };





// import mysql from 'mysql2/promise';
// import { drizzle } from 'drizzle-orm/mysql2';
// import dotenv from 'dotenv';

// dotenv.config();

// // Crear el pool de conexiones
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'admin',
//   password: '12345',
//   database: 'pdvkraken2',
// });

// // Crear la instancia de Drizzle
// const db = drizzle(pool);

// export { pool, db };
