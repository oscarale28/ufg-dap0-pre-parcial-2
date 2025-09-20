// Estado global de la aplicación
let games = [];
let plataformas = [];
let generos = [];
let currentGameId = null;
let isEditing = false;

// Elementos del DOM
const gamesGrid = document.getElementById('gamesGrid');
const gameModal = document.getElementById('gameModal');
const deleteModal = document.getElementById('deleteModal');
const gameForm = document.getElementById('gameForm');
const modalTitle = document.getElementById('modalTitle');
const deleteModalBody = document.getElementById('deleteModalBody');

// Botones
const addGameBtn = document.getElementById('addGameBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadPlataformas();
    await loadGeneros();
    await loadGames();
    setupEventListeners();
});

function setupEventListeners() {
    // Botón agregar juego
    addGameBtn.addEventListener('click', () => {
        openModal();
    });

    // Botones del modal
    cancelBtn.addEventListener('click', closeModal);
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
            renderGames();
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

async function loadPlataformas() {
    try {
        const response = await fetch('/api/plataformas');
        const data = await response.json();
        
        if (data.success) {
            plataformas = data.data;
            populatePlataformasSelect();
        } else {
            showMessage('Error al cargar las plataformas: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error al cargar las plataformas:', error);
        showMessage('Error de conexión al cargar las plataformas', 'error');
    }
}

async function loadGeneros() {
    try {
        const response = await fetch('/api/generos');
        const data = await response.json();
        
        if (data.success) {
            generos = data.data;
            populateGenerosSelect();
        } else {
            showMessage('Error al cargar los géneros: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error al cargar los géneros:', error);
        showMessage('Error de conexión al cargar los géneros', 'error');
    }
}

function populatePlataformasSelect() {
    const select = document.getElementById('plataforma_id');
    select.innerHTML = '<option value="">Seleccionar plataforma</option>';
    
    plataformas.forEach(plataforma => {
        const option = document.createElement('option');
        option.value = plataforma.id;
        option.textContent = plataforma.nombre;
        select.appendChild(option);
    });
}

function populateGenerosSelect() {
    const select = document.getElementById('genero_id');
    select.innerHTML = '<option value="">Seleccionar género</option>';
    
    generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.nombre;
        select.appendChild(option);
    });
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

    gamesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card">
            <h3 class="game-title">${escapeHtml(game.titulo)}</h3>
            <div class="game-info">
                <p><strong>Plataforma:</strong> ${escapeHtml(game.plataforma_nombre)}</p>
                <p><strong>Género:</strong> ${escapeHtml(game.genero_nombre)}</p>
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
    document.getElementById('plataforma_id').value = game.plataforma_id || '';
    document.getElementById('genero_id').value = game.genero_id || '';
}

function handleSave() {
    const formData = new FormData(gameForm);
    const gameData = {
        titulo: formData.get('titulo').trim(),
        plataforma_id: parseInt(formData.get('plataforma_id')),
        genero_id: parseInt(formData.get('genero_id'))
    };

    // Validación básica
    if (!gameData.titulo || !gameData.plataforma_id || !gameData.genero_id) {
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
    deleteModalBody.innerHTML = `
        <p>¿Estás seguro de querer eliminar el videojuego <strong>${title}</strong>?</p>
    `;
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
    // Crear contenedor de toast si no existe
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Crear nuevo toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Crear contenido del toast
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;
    
    // Agregar al contenedor
    toastContainer.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 100);
    
    // Event listener para cerrar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            removeToast(toast);
        }
    }, 4000);
}

function removeToast(toast) {
    toast.classList.add('toast-hide');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funciones globales para los botones inline
window.editGame = editGame;
window.confirmDelete = confirmDelete;
