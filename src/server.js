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

// API Routes
// GET /api/juegos - Listar todos los videojuegos
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

// POST /api/juegos - Crear nuevo juego
app.post('/api/juegos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const videojuegos = await db.getAllJuegos();
    res.json({
      success: true,
      data: videojuegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los videojuegos',
      error: error.message
    });
  }
});

// POST /api/juegos - Crear nuevo videojuego
app.post('/api/juegos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const { titulo, plataforma, genero, anio_lanzamiento, desarrollador, estado } = req.body;
    
    // Validación básica
    if (!titulo || !plataforma) {
      return res.status(400).json({
        success: false,
        message: 'Título y plataforma son requeridos'
      });
    }

    const nuevoJuego = await db.createVideojuego({
      titulo,
      plataforma,
      genero: genero || '',
      anio_lanzamiento: anio_lanzamiento || null,
      desarrollador: desarrollador || '',
      estado: estado || 'disponible'
    });
    
    res.status(201).json({
      success: true,
      data: nuevoJuego,
      message: 'Videojuego creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el videojuego',
      error: error.message
    });
  }
});

// PUT /api/juegos/:id - Actualizar videojuego
app.put('/api/juegos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    const { titulo, plataforma, genero, anio_lanzamiento, desarrollador, estado } = req.body;
    
    // Verificar que el videojuego existe
    const existingGame = await db.getVideojuegoById(id);
    if (!existingGame) {
      return res.status(404).json({
        success: false,
        message: 'Videojuego no encontrado'
      });
    }

    const updatedGame = await db.updateVideojuego(id, {
      titulo: titulo || existingGame.titulo,
      plataforma: plataforma || existingGame.plataforma,
      genero: genero !== undefined ? genero : existingGame.genero,
      anio_lanzamiento: anio_lanzamiento !== undefined ? anio_lanzamiento : existingGame.anio_lanzamiento,
      desarrollador: desarrollador !== undefined ? desarrollador : existingGame.desarrollador,
      estado: estado || existingGame.estado
    });

    res.json({
      success: true,
      data: updatedGame,
      message: 'Videojuego actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el videojuego',
      error: error.message
    });
  }
});

// DELETE /api/juegos/:id - Eliminar videojuego
app.delete('/api/juegos/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const id = parseInt(req.params.id);
    
    const juegoEliminado = await db.deleteVideojuego(id);
    
    if (!juegoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Videojuego no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: juegoEliminado,
      message: 'Videojuego eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el videojuego',
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
