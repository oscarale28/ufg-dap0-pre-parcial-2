import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { serverConfig, authConfig } from './config.js';
import { db, initializeDatabase } from './database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// ========== AUTH ========== 
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
}

// POST /api/login - Autenticación simple
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });
  }
  try {
    const configuredUser = authConfig.username;
    const configuredPassword = authConfig.password;

    const usernameValid = username === configuredUser;
    let passwordValid = false;
    // Si AUTH_PASSWORD parece un hash bcrypt (comienza con $2a|$2b|$2y$), usamos compare
    if (/^\$2[aby]\$/.test(configuredPassword)) {
      passwordValid = await bcrypt.compare(password, configuredPassword);
    } else {
      passwordValid = password === configuredPassword;
    }

    if (!usernameValid || !passwordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: configuredUser }, authConfig.jwtSecret, { expiresIn: authConfig.tokenExpiresIn });
    return res.json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error en autenticación' });
  }
});

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
app.post('/api/juegos', authenticate, async (req, res) => {
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
app.put('/api/juegos/:id', authenticate, async (req, res) => {
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
app.delete('/api/juegos/:id', authenticate, async (req, res) => {
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

// ========== EXPORT API ROUTES ==========
// GET /api/export/juegos - JSON
app.get('/api/export/juegos', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ success: false, message: 'Database not initialized' });
    }
    const juegos = await db.getAllJuegos();
    res.setHeader('Content-Disposition', 'attachment; filename="juegos.json"');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify(juegos, null, 2));
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al exportar juegos (JSON)' });
  }
});

// GET /api/export/juegos.csv - CSV
app.get('/api/export/juegos.csv', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ success: false, message: 'Database not initialized' });
    }
    const juegos = await db.getAllJuegos();
    const header = ['id', 'titulo', 'plataforma_id', 'plataforma_nombre', 'genero_id', 'genero_nombre'];
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    const lines = [header.join(',')].concat(
      juegos.map(j => header.map(k => escapeCsv(j[k])).join(','))
    );
    const csv = lines.join('\n');
    res.setHeader('Content-Disposition', 'attachment; filename="juegos.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al exportar juegos (CSV)' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function start() {
  await startServer();
  
  // Escucha a todas las interfaces de red en el server
  app.listen(PORT, '0.0.0.0', () => {
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
