import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  const result = dotenv.config({ path: '.env' });
  if (result.error) {
    console.warn('⚠️ Error cargando .env:', result.error);
  } else {
    console.log('✅ Variables de entorno cargadas desde .env');
  }
}

export const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PORT, AUTH_USER, AUTH_PASSWORD, JWT_SECRET} = process.env;

if(!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD || !PORT) {
  console.error('❌ Variables de entorno requeridas faltantes. Verifica tu archivo .env');
  process.exit(1);
}

// Database configuration
export const dbConfig = {
  host: DB_HOST || 'localhost', 
  port: DB_PORT || 5432,
  database: DB_NAME || 'catalogo_juegos',
  user: DB_USER || 'postgres',
  password: DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Server configuration
export const serverConfig = {
  port: PORT || 3000,
};

// Auth configuration (simple)
export const authConfig = {
  username: AUTH_USER || 'admin',
  // Puede ser un texto plano o un hash bcrypt
  password: AUTH_PASSWORD || 'admin123',
  jwtSecret: JWT_SECRET || 'change-this-secret-in-env',
  tokenExpiresIn: '8h'
};