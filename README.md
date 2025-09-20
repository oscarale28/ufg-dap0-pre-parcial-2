# 🎮 Catálogo de Videojuegos

Una aplicación para gestionar tu colección de videojuegos con versión web y desktop, compartiendo el mismo código base.

## ✨ Características

- **Doble plataforma**: Funciona tanto en navegador web como aplicación de escritorio
- **CRUD completo**: Crear, leer, actualizar y eliminar videojuegos
- **Interfaz moderna**: Diseño responsive con gradientes y animaciones
- **Base de datos externa**: Preparado para conectar con tu base de datos
- **API REST**: Endpoints bien estructurados para integración

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd catalogo-juegos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar base de datos**
   - Edita `src/server.js` y reemplaza `DATABASE_URL` con tu conexión
   - O modifica las funciones de la API para usar tu base de datos

## 🎯 Uso

### Modo Web
```bash
npm start
```
Abre tu navegador en `http://localhost:3000`

### Modo Desktop
```bash
npm run electron
```
Se abre la aplicación como escritorio

### Modo Desarrollo
```bash
npm run dev
```
Servidor con auto-reload para desarrollo

## 📊 Estructura de Datos

### Tabla `videojuegos`
- `id` (INTEGER, PK, autoincrement)
- `titulo` (TEXT, NOT NULL)
- `plataforma` (TEXT: PS5, Xbox, Switch, PC)
- `genero` (TEXT)
- `anio_lanzamiento` (INTEGER)
- `desarrollador` (TEXT)
- `estado` (TEXT: Nuevo, En progreso, Terminado)

## 🔌 API Endpoints

- `GET /api/juegos` - Listar todos los videojuegos
- `POST /api/juegos` - Crear nuevo videojuego
- `PUT /api/juegos/:id` - Actualizar videojuego
- `DELETE /api/juegos/:id` - Eliminar videojuego

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Desktop**: Electron
- **Base de datos**: Preparado para conexión externa
- **Estilos**: CSS moderno con gradientes y animaciones

## 📁 Estructura del Proyecto

```
catalogo-juegos/
├── src/
│   ├── server.js          # Servidor Express
│   └── public/            # Frontend estático
│       ├── index.html     # Página principal
│       ├── styles.css     # Estilos
│       └── app.js         # Lógica del frontend
├── electron/
│   └── main.js            # Configuración de Electron
├── package.json           # Dependencias y scripts
└── README.md             # Este archivo
```

## 🔧 Configuración de Base de Datos

Para conectar con tu base de datos externa, modifica las funciones en `src/server.js`:

```javascript
// Reemplaza las funciones mock con llamadas reales a tu DB
async function loadGames() {
    // Tu lógica de base de datos aquí
}

async function createGame(gameData) {
    // Tu lógica de base de datos aquí
}
```

## 🎨 Personalización

- **Colores**: Modifica las variables CSS en `styles.css`
- **Campos**: Agrega nuevos campos en el formulario y la API
- **Validaciones**: Extiende las validaciones en `app.js`

## 📱 Compatibilidad

- **Web**: Todos los navegadores modernos
- **Desktop**: Windows, macOS, Linux
- **Responsive**: Móviles y tablets

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles
