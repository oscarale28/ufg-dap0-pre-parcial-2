// Estado global de la aplicación
let games = [];
let currentGameId = null;
let isEditing = false;

// Elementos del DOM
const gamesGrid = document.getElementById('gamesGrid');
const gameModal = document.getElementById('gameModal');
const deleteModal = document.getElementById('deleteModal');
const gameForm = document.getElementById('gameForm');
const modalTitle = document.getElementById('modalTitle');
const gameToDelete = document.getElementById('gameToDelete');

// Botones
const addGameBtn = document.getElementById('addGameBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupEventListeners();
});

function setupEventListeners() {
    // Botón agregar juego
    addGameBtn.addEventListener('click', () => {
        openModal();
    });

    // Botones del modal
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', handleSave);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', handleDelete);

    // Cerrar modales con X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            if (e.target.closest('#gameModal')) {
                closeModal();
            } else if (e.target.closest('#deleteModal')) {
                closeDeleteModal();
            }
        });
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeModal();
        } else if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Envío del formulario
    gameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSave();
    });
}

// Funciones de la API
async function loadGames() {
    try {
        showLoading();
        const response = await fetch('/api/juegos');
        const data = await response.json();
        
        if (data.success) {
            games = data.data;
            renderGames();
        } else {
            showMessage('Error al cargar los videojuegos: ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexión: ' + error.message, 'error');
    }
}

async function createGame(gameData) {
    try {
        const response = await fetch('/api/juegos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            games.push(data.data);
            renderGames();
            showMessage('Videojuego creado exitosamente', 'success');
            closeModal();
        } else {
            showMessage('Error al crear el videojuego: ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexión: ' + error.message, 'error');
    }
}

async function updateGame(id, gameData) {
    try {
        const response = await fetch(`/api/juegos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            const index = games.findIndex(game => game.id === id);
            if (index !== -1) {
                games[index] = data.data;
                renderGames();
            }
            showMessage('Videojuego actualizado exitosamente', 'success');
            closeModal();
        } else {
            showMessage('Error al actualizar el videojuego: ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexión: ' + error.message, 'error');
    }
}

async function deleteGame(id) {
    try {
        const response = await fetch(`/api/juegos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            games = games.filter(game => game.id !== id);
            renderGames();
            showMessage('Videojuego eliminado exitosamente', 'success');
            closeDeleteModal();
        } else {
            showMessage('Error al eliminar el videojuego: ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexión: ' + error.message, 'error');
    }
}

// Funciones de renderizado
function renderGames() {
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <h3>No hay videojuegos en tu catálogo</h3>
                <p>¡Agrega tu primer videojuego haciendo clic en el botón de arriba!</p>
            </div>
        `;
        return;
    }

    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card">
            <h3 class="game-title">${escapeHtml(game.titulo)}</h3>
            <div class="game-info">
                <p><strong>Plataforma:</strong> ${escapeHtml(game.plataforma)}</p>
                ${game.genero ? `<p><strong>Género:</strong> ${escapeHtml(game.genero)}</p>` : ''}
                ${game.anio_lanzamiento ? `<p><strong>Año:</strong> ${game.anio_lanzamiento}</p>` : ''}
                ${game.desarrollador ? `<p><strong>Desarrollador:</strong> ${escapeHtml(game.desarrollador)}</p>` : ''}
            </div>
            <div class="game-actions">
                <button class="btn btn-edit" onclick="editGame(${game.id})">Editar</button>
                <button class="btn btn-delete" onclick="confirmDelete(${game.id}, '${escapeHtml(game.titulo)}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Funciones del modal
function openModal(game = null) {
    isEditing = !!game;
    currentGameId = game ? game.id : null;
    
    if (isEditing) {
        modalTitle.textContent = 'Editar Videojuego';
        fillForm(game);
    } else {
        modalTitle.textContent = 'Agregar Videojuego';
        gameForm.reset();
    }
    
    gameModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    gameModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    gameForm.reset();
    isEditing = false;
    currentGameId = null;
}

function fillForm(game) {
    document.getElementById('titulo').value = game.titulo || '';
    document.getElementById('plataforma').value = game.plataforma || '';
    document.getElementById('genero').value = game.genero || '';
    document.getElementById('anio_lanzamiento').value = game.anio_lanzamiento || '';
    document.getElementById('desarrollador').value = game.desarrollador || '';
    document.getElementById('estado').value = game.estado || '';
}

function handleSave() {
    const formData = new FormData(gameForm);
    const gameData = {
        titulo: formData.get('titulo').trim(),
        plataforma: formData.get('plataforma'),
        genero: formData.get('genero').trim(),
        anio_lanzamiento: formData.get('anio_lanzamiento') ? parseInt(formData.get('anio_lanzamiento')) : null,
        desarrollador: formData.get('desarrollador').trim(),
        estado: formData.get('estado')
    };

    // Validación básica
    if (!gameData.titulo || !gameData.plataforma || !gameData.estado) {
        showMessage('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    if (isEditing) {
        updateGame(currentGameId, gameData);
    } else {
        createGame(gameData);
    }
}

// Funciones de eliminación
function confirmDelete(id, title) {
    currentGameId = id;
    gameToDelete.textContent = title;
    deleteModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentGameId = null;
}

function handleDelete() {
    if (currentGameId) {
        deleteGame(currentGameId);
    }
}

// Funciones de edición
function editGame(id) {
    const game = games.find(g => g.id === id);
    if (game) {
        openModal(game);
    }
}

// Funciones de utilidad
function showLoading() {
    gamesGrid.innerHTML = '<div class="loading">Cargando videojuegos...</div>';
}

function showMessage(message, type) {
    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insertar después del header
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', messageDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funciones globales para los botones inline
window.editGame = editGame;
window.confirmDelete = confirmDelete;
