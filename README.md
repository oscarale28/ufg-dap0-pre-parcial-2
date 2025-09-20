# 🎮 ESTIM - Catálogo de Videojuegos

Una aplicación sencilla para gestionar tu colección de videojuegos, disponible tanto como aplicación web como aplicación de escritorio.

## 🚀 Características

- **Gestión completa de videojuegos**: Crear, editar, eliminar y visualizar juegos
- **Notificaciones toast**: Feedback visual elegante para todas las acciones
- **Doble modalidad**: Web y aplicación de escritorio con Electron

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL desplegada en Dokploy
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Desktop**: Electron
- **Estilos**: CSS moderno con glassmorphism

## 📋 Requisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## ⚙️ Instalación local

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd preparcial-dap0-19-09
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

## 🗄️ Base de Datos
El proyecto se conecta a una base de datos PostgreSQL desplegada en Dokploy. Para un correcto funcionamiento en **ambiente local**, copia .env.example a .env y configura las variables:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_juegos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
PORT=3001
 
## 🚀 Uso

### Modo Web
```bash
npm start
```
Abre tu navegador en `http://localhost:3000`

### Modo Desktop (Electron)
```bash
npm run electron
```
Esto iniciará automáticamente el servidor Express y la aplicación Electron.

### Modo Desarrollo
```bash
npm run dev
```
Inicia el servidor con nodemon para desarrollo con recarga automática.

## 📁 Estructura del Proyecto

```
preparcial-dap0-19-09/
├── electron/
│   └── main.js              # Configuración de Electron
├── src/
│   ├── config.js            # Configuración de la aplicación
│   ├── database.js          # Funciones de base de datos
│   ├── server.js            # Servidor Express
│   └── public/
│       ├── index.html       # Interfaz principal
│       ├── app.js           # Lógica del frontend
│       └── styles.css       # Estilos CSS
├── bootstrap.cjs            # Bootstrap para Electron
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Plataformas
- `GET /api/plataformas` - Listar todas las plataformas

### Géneros
- `GET /api/generos` - Listar todos los géneros

### Juegos
- `GET /api/juegos` - Listar todos los juegos
- `GET /api/juegos/:id` - Obtener juego por ID
- `POST /api/juegos` - Crear nuevo juego
- `PUT /api/juegos/:id` - Actualizar juego
- `DELETE /api/juegos/:id` - Eliminar juego

## 🚧 Retos y Dificultades

Durante el desarrollo de este proyecto se enfrentaron varios desafíos técnicos y de implementación:

- Configuración de empaquetado óptimo para ejecutar la aplicación a través de la web y escritorio.
- Asegurar compatibilidad de Electron con ESModules. Se solventó creando el archivo `bootstrap.cjs` que importa dinámicamente el entrypoint `/electron/main.js`.
- Conexión a base de datos, solucionado mediante la apertura de puertos en el firewall de la VPS utilizada para alojamiento de despliegues.
