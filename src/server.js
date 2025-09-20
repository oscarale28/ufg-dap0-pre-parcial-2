const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration - you'll need to replace this with your actual database connection
const DATABASE_URL = process.env.DATABASE_URL || 'your-database-connection-string';

// Mock data for testing - replace with actual database calls
let videojuegos = [
  {
    id: 1,
    titulo: "The Legend of Zelda: Breath of the Wild",
    plataforma: "Switch",
    genero: "Aventura",
    anio_lanzamiento: 2017,
    desarrollador: "Nintendo",
  },
  {
    id: 2,
    titulo: "God of War",
    plataforma: "PS5",
    genero: "Acción",
    anio_lanzamiento: 2018,
    desarrollador: "Santa Monica Studio",
  }
];

// API Routes
// GET /api/juegos - Listar todos los videojuegos
app.get('/api/juegos', (req, res) => {
  try {
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
app.post('/api/juegos', (req, res) => {
  try {
    const { titulo, plataforma, genero, anio_lanzamiento, desarrollador, estado } = req.body;
    
    // Validación básica
    if (!titulo || !plataforma || !estado) {
      return res.status(400).json({
        success: false,
        message: 'Título, plataforma y estado son requeridos'
      });
    }

    const nuevoJuego = {
      id: videojuegos.length > 0 ? Math.max(...videojuegos.map(j => j.id)) + 1 : 1,
      titulo,
      plataforma,
      genero: genero || '',
      anio_lanzamiento: anio_lanzamiento || null,
      desarrollador: desarrollador || '',
    };

    videojuegos.push(nuevoJuego);
    
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
app.put('/api/juegos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, plataforma, genero, anio_lanzamiento, desarrollador, estado } = req.body;
    
    const index = videojuegos.findIndex(j => j.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Videojuego no encontrado'
      });
    }

    // Actualizar solo los campos proporcionados
    if (titulo !== undefined) videojuegos[index].titulo = titulo;
    if (plataforma !== undefined) videojuegos[index].plataforma = plataforma;
    if (genero !== undefined) videojuegos[index].genero = genero;
    if (anio_lanzamiento !== undefined) videojuegos[index].anio_lanzamiento = anio_lanzamiento;
    if (desarrollador !== undefined) videojuegos[index].desarrollador = desarrollador;

    res.json({
      success: true,
      data: videojuegos[index],
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
app.delete('/api/juegos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = videojuegos.findIndex(j => j.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Videojuego no encontrado'
      });
    }

    const juegoEliminado = videojuegos.splice(index, 1)[0];
    
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Modo web: http://localhost:${PORT}`);
  console.log(`🖥️  Modo desktop: npm run electron`);
});

module.exports = app;
