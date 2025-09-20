import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config({path: '.env'});

if(result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

export const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PORT} = process.env;

if(!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD || !PORT) {
  console.error('❌ Error loading .env file:', result.error);
  console.log(process.env);
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
  port: PORT || 3001,
};