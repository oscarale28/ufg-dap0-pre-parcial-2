import { Pool } from 'pg';
import { dbConfig } from './config.js';

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Database initialization function
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Database initialized successfully');
    client.release();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Database query functions
const db = {
  // ========== PLATAFORMA QUERIES ==========
  
  // Get all plataformas
  async getAllPlataformas() {
    try {
      const result = await pool.query('SELECT * FROM plataforma ORDER BY nombre ASC');
      return result.rows;
    } catch (error) {
      console.error('Error getting plataformas:', error);
      throw error;
    }
  },

  // Get plataforma by ID
  async getPlataformaById(id) {
    try {
      const result = await pool.query('SELECT * FROM plataforma WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting plataforma by ID:', error);
      throw error;
    }
  },

  // Create new plataforma
  async createPlataforma(plataforma) {
    try {
      const { nombre } = plataforma;
      const result = await pool.query(
        'INSERT INTO plataforma (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating plataforma:', error);
      throw error;
    }
  },

  // Update plataforma
  async updatePlataforma(id, plataforma) {
    try {
      const { nombre } = plataforma;
      const result = await pool.query(
        'UPDATE plataforma SET nombre = $1 WHERE id = $2 RETURNING *',
        [nombre, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating plataforma:', error);
      throw error;
    }
  },

  // Delete plataforma
  async deletePlataforma(id) {
    try {
      const result = await pool.query('DELETE FROM plataforma WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting plataforma:', error);
      throw error;
    }
  },

  // ========== GENERO QUERIES ==========
  
  // Get all generos
  async getAllGeneros() {
    try {
      const result = await pool.query('SELECT * FROM genero ORDER BY nombre ASC');
      return result.rows;
    } catch (error) {
      console.error('Error getting generos:', error);
      throw error;
    }
  },

  // Get genero by ID
  async getGeneroById(id) {
    try {
      const result = await pool.query('SELECT * FROM genero WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting genero by ID:', error);
      throw error;
    }
  },

  // Create new genero
  async createGenero(genero) {
    try {
      const { nombre } = genero;
      const result = await pool.query(
        'INSERT INTO genero (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating genero:', error);
      throw error;
    }
  },

  // Update genero
  async updateGenero(id, genero) {
    try {
      const { nombre } = genero;
      const result = await pool.query(
        'UPDATE genero SET nombre = $1 WHERE id = $2 RETURNING *',
        [nombre, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating genero:', error);
      throw error;
    }
  },

  // Delete genero
  async deleteGenero(id) {
    try {
      const result = await pool.query('DELETE FROM genero WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting genero:', error);
      throw error;
    }
  },

  // ========== JUEGO QUERIES ==========
  
  // Get all juegos with plataforma and genero info
  async getAllJuegos() {
    try {
      const result = await pool.query(`
        SELECT 
          j.id, 
          j.titulo, 
          j.plataforma_id, 
          p.nombre as plataforma_nombre,
          j.genero_id, 
          g.nombre as genero_nombre
        FROM juego j
        JOIN plataforma p ON j.plataforma_id = p.id
        JOIN genero g ON j.genero_id = g.id
        ORDER BY j.titulo ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting juegos:', error);
      throw error;
    }
  },

  // Get juego by ID with plataforma and genero info
  async getJuegoById(id) {
    try {
      const result = await pool.query(`
        SELECT 
          j.id, 
          j.titulo, 
          j.plataforma_id, 
          p.nombre as plataforma_nombre,
          j.genero_id, 
          g.nombre as genero_nombre
        FROM juego j
        JOIN plataforma p ON j.plataforma_id = p.id
        JOIN genero g ON j.genero_id = g.id
        WHERE j.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting juego by ID:', error);
      throw error;
    }
  },

  // Create new juego
  async createJuego(juego) {
    try {
      const { titulo, plataforma_id, genero_id } = juego;
      const result = await pool.query(
        'INSERT INTO juego (titulo, plataforma_id, genero_id) VALUES ($1, $2, $3) RETURNING *',
        [titulo, plataforma_id, genero_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating juego:', error);
      throw error;
    }
  },

  // Update juego
  async updateJuego(id, juego) {
    try {
      const { titulo, plataforma_id, genero_id } = juego;
      const result = await pool.query(
        'UPDATE juego SET titulo = $1, plataforma_id = $2, genero_id = $3 WHERE id = $4 RETURNING *',
        [titulo, plataforma_id, genero_id, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating juego:', error);
      throw error;
    }
  },

  // Delete juego
  async deleteJuego(id) {
    try {
      const result = await pool.query('DELETE FROM juego WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting juego:', error);
      throw error;
    }
  },

  // Get juegos by plataforma
  async getJuegosByPlataforma(plataforma_id) {
    try {
      const result = await pool.query(`
        SELECT 
          j.id, 
          j.titulo, 
          j.plataforma_id, 
          p.nombre as plataforma_nombre,
          j.genero_id, 
          g.nombre as genero_nombre
        FROM juego j
        JOIN plataforma p ON j.plataforma_id = p.id
        JOIN genero g ON j.genero_id = g.id
        WHERE j.plataforma_id = $1
        ORDER BY j.titulo ASC
      `, [plataforma_id]);
      return result.rows;
    } catch (error) {
      console.error('Error getting juegos by plataforma:', error);
      throw error;
    }
  },

  // Get juegos by genero
  async getJuegosByGenero(genero_id) {
    try {
      const result = await pool.query(`
        SELECT 
          j.id, 
          j.titulo, 
          j.plataforma_id, 
          p.nombre as plataforma_nombre,
          j.genero_id, 
          g.nombre as genero_nombre
        FROM juego j
        JOIN plataforma p ON j.plataforma_id = p.id
        JOIN genero g ON j.genero_id = g.id
        WHERE j.genero_id = $1
        ORDER BY j.titulo ASC
      `, [genero_id]);
      return result.rows;
    } catch (error) {
      console.error('Error getting juegos by genero:', error);
      throw error;
    }
  },

  // Search juegos by title
  async searchJuegosByTitle(searchTerm) {
    try {
      const result = await pool.query(`
        SELECT 
          j.id, 
          j.titulo, 
          j.plataforma_id, 
          p.nombre as plataforma_nombre,
          j.genero_id, 
          g.nombre as genero_nombre
        FROM juego j
        JOIN plataforma p ON j.plataforma_id = p.id
        JOIN genero g ON j.genero_id = g.id
        WHERE j.titulo ILIKE $1
        ORDER BY j.titulo ASC
      `, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      console.error('Error searching juegos by title:', error);
      throw error;
    }
  },

  // Close database connection
  async close() {
    await pool.end();
  }
};

export { db, initializeDatabase };
