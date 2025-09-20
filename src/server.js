import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { serverConfig } from './config.js';
import { db, initializeDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database connection
let dbInitialized = false;

// Initialize database on startup
async function startServer() {
  try {
    await initializeDatabase();
    dbInitialized = true;
    console.log('🚀 Database connection established');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

// ========== PLATAFORMA API ROUTES ==========

// GET /api/plataformas - Listar todas las plataformas
app.get('/api/plataformas', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const plataformas = await db.getAllPlataformas();
    res.json({
      success: true,
      data: plataformas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las plataformas',
      error: error.message
    });
  }
});

// GET /api/plataformas/:id - Obtener plataforma por ID
app.get('/api/plataformas/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const plataforma = await db.getPlataformaById(id);
    
    if (!plataforma) {
      return res.status(404).json({
        success: false,
        message: 'Plataforma no encontrada'
      });
    }

    res.json({
      success: true,
      data: plataforma
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la plataforma',
      error: error.message
    });
  }
});

// POST /api/plataformas - Crear nueva plataforma
app.post('/api/plataformas', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const nuevaPlataforma = await db.createPlataforma({ nombre });
    
    res.status(201).json({
      success: true,
      data: nuevaPlataforma,
      message: 'Plataforma creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la plataforma',
      error: error.message
    });
  }
});

// PUT /api/plataformas/:id - Actualizar plataforma
app.put('/api/plataformas/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const plataformaActualizada = await db.updatePlataforma(id, { nombre });
    
    if (!plataformaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Plataforma no encontrada'
      });
    }

    res.json({
      success: true,
      data: plataformaActualizada,
      message: 'Plataforma actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la plataforma',
      error: error.message
    });
  }
});

// DELETE /api/plataformas/:id - Eliminar plataforma
app.delete('/api/plataformas/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const plataformaEliminada = await db.deletePlataforma(id);
    
    if (!plataformaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Plataforma no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: plataformaEliminada,
      message: 'Plataforma eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la plataforma',
      error: error.message
    });
  }
});

// ========== GENERO API ROUTES ==========

// GET /api/generos - Listar todos los géneros
app.get('/api/generos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const generos = await db.getAllGeneros();
    res.json({
      success: true,
      data: generos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los géneros',
      error: error.message
    });
  }
});

// GET /api/generos/:id - Obtener género por ID
app.get('/api/generos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const genero = await db.getGeneroById(id);
    
    if (!genero) {
      return res.status(404).json({
        success: false,
        message: 'Género no encontrado'
      });
    }

    res.json({
      success: true,
      data: genero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el género',
      error: error.message
    });
  }
});

// POST /api/generos - Crear nuevo género
app.post('/api/generos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const nuevoGenero = await db.createGenero({ nombre });
    
    res.status(201).json({
      success: true,
      data: nuevoGenero,
      message: 'Género creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el género',
      error: error.message
    });
  }
});

// PUT /api/generos/:id - Actualizar género
app.put('/api/generos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const generoActualizado = await db.updateGenero(id, { nombre });
    
    if (!generoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Género no encontrado'
      });
    }

    res.json({
      success: true,
      data: generoActualizado,
      message: 'Género actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el género',
      error: error.message
    });
  }
});

// DELETE /api/generos/:id - Eliminar género
app.delete('/api/generos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const generoEliminado = await db.deleteGenero(id);
    
    if (!generoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Género no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: generoEliminado,
      message: 'Género eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el género',
      error: error.message
    });
  }
});

// ========== JUEGO API ROUTES ==========

// GET /api/juegos - Listar todos los juegos
app.get('/api/juegos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const juegos = await db.getAllJuegos();
    res.json({
      success: true,
      data: juegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los juegos',
      error: error.message
    });
  }
});

// GET /api/juegos/:id - Obtener juego por ID
app.get('/api/juegos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const juego = await db.getJuegoById(id);
    
    if (!juego) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      data: juego
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el juego',
      error: error.message
    });
  }
});

// POST /api/juegos - Crear nuevo juego
app.post('/api/juegos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const { titulo, plataforma_id, genero_id } = req.body;
    
    if (!titulo || !plataforma_id || !genero_id) {
      return res.status(400).json({
        success: false,
        message: 'Título, plataforma_id y genero_id son requeridos'
      });
    }

    const nuevoJuego = await db.createJuego({
      titulo,
      plataforma_id: parseInt(plataforma_id),
      genero_id: parseInt(genero_id)
    });
    
    res.status(201).json({
      success: true,
      data: nuevoJuego,
      message: 'Juego creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el juego',
      error: error.message
    });
  }
});

// PUT /api/juegos/:id - Actualizar juego
app.put('/api/juegos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const { titulo, plataforma_id, genero_id } = req.body;
    
    if (!titulo || !plataforma_id || !genero_id) {
      return res.status(400).json({
        success: false,
        message: 'Título, plataforma_id y genero_id son requeridos'
      });
    }

    const juegoActualizado = await db.updateJuego(id, {
      titulo,
      plataforma_id: parseInt(plataforma_id),
      genero_id: parseInt(genero_id)
    });
    
    if (!juegoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      data: juegoActualizado,
      message: 'Juego actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el juego',
      error: error.message
    });
  }
});

// DELETE /api/juegos/:id - Eliminar juego
app.delete('/api/juegos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const juegoEliminado = await db.deleteJuego(id);
    
    if (!juegoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: juegoEliminado,
      message: 'Juego eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el juego',
      error: error.message
    });
  }
});

// GET /api/juegos/plataforma/:plataforma_id - Obtener juegos por plataforma
app.get('/api/juegos/plataforma/:plataforma_id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const plataforma_id = parseInt(req.params.plataforma_id);
    const juegos = await db.getJuegosByPlataforma(plataforma_id);
    
    res.json({
      success: true,
      data: juegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener juegos por plataforma',
      error: error.message
    });
  }
});

// GET /api/juegos/genero/:genero_id - Obtener juegos por género
app.get('/api/juegos/genero/:genero_id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const genero_id = parseInt(req.params.genero_id);
    const juegos = await db.getJuegosByGenero(genero_id);
    
    res.json({
      success: true,
      data: juegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener juegos por género',
      error: error.message
    });
  }
});

// GET /api/juegos/search/:searchTerm - Buscar juegos por título
app.get('/api/juegos/search/:searchTerm', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const searchTerm = req.params.searchTerm;
    const juegos = await db.searchJuegosByTitle(searchTerm);
    
    res.json({
      success: true,
      data: juegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar juegos',
      error: error.message
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function start() {
  await startServer();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📱 Modo web: http://localhost:${PORT}`);
    console.log(`🖥️  Modo desktop: npm run electron`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.close();
  process.exit(0);
});

// Start the application
start().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;
