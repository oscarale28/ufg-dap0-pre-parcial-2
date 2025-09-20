# 🎮 ESTIM - Catálogo de Videojuegos

Una aplicación moderna para gestionar tu colección de videojuegos, disponible tanto como aplicación web como aplicación de escritorio.

## 🚀 Características

- **Gestión completa de videojuegos**: Crear, editar, eliminar y visualizar juegos
- **Sistema de plataformas**: Gestiona diferentes plataformas (PS5, Xbox, Switch, PC, Mobile)
- **Sistema de géneros**: Organiza juegos por géneros (RPG, Shooter, Aventura, etc.)
- **Interfaz moderna**: Diseño glassmorphism con tema oscuro
- **Notificaciones toast**: Feedback visual elegante para todas las acciones
- **Doble modalidad**: Web y aplicación de escritorio con Electron

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Desktop**: Electron
- **Estilos**: CSS moderno con glassmorphism

## 📋 Requisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## ⚙️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd preparcial-dap0-19-09
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura la base de datos**
   - Crea una base de datos PostgreSQL llamada `catalogo-juegos`
   - Copia `.env.example` a `.env` y configura las variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=catalogo_juegos
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   PORT=3001
   ```

4. **Ejecuta las migraciones**
   ```sql
   -- Ejecuta estos comandos en tu base de datos PostgreSQL
   CREATE TABLE IF NOT EXISTS PLATAFORMA(
       id serial primary key,
       nombre varchar(50) unique not null
   );

   CREATE TABLE GENERO(
       id serial primary key,
       nombre varchar(100) unique not null
   );

   CREATE TABLE JUEGO(
       id serial primary key,
       titulo varchar(255) not null,
       plataforma_id int not null references PLATAFORMA(id) on delete restrict,
       genero_id int not null references GENERO(id) on delete restrict
   );

   INSERT INTO plataforma (nombre) VALUES ('PS5'), ('Xbox'), ('Switch'), ('PC'), ('Mobile');
   INSERT INTO genero (nombre) VALUES ('RPG'), ('Shooter'), ('Aventura'), ('Plataforma'), ('Estrategia');
   ```

## 🚀 Uso

### Modo Web
```bash
npm start
```
Abre tu navegador en `http://localhost:3001`

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
- `GET /api/plataformas/:id` - Obtener plataforma por ID
- `POST /api/plataformas` - Crear nueva plataforma
- `PUT /api/plataformas/:id` - Actualizar plataforma
- `DELETE /api/plataformas/:id` - Eliminar plataforma

### Géneros
- `GET /api/generos` - Listar todos los géneros
- `GET /api/generos/:id` - Obtener género por ID
- `POST /api/generos` - Crear nuevo género
- `PUT /api/generos/:id` - Actualizar género
- `DELETE /api/generos/:id` - Eliminar género

### Juegos
- `GET /api/juegos` - Listar todos los juegos
- `GET /api/juegos/:id` - Obtener juego por ID
- `POST /api/juegos` - Crear nuevo juego
- `PUT /api/juegos/:id` - Actualizar juego
- `DELETE /api/juegos/:id` - Eliminar juego
- `GET /api/juegos/plataforma/:plataforma_id` - Filtrar por plataforma
- `GET /api/juegos/genero/:genero_id` - Filtrar por género
- `GET /api/juegos/search/:searchTerm` - Buscar por título
