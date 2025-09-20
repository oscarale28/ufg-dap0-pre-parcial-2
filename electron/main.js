const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'assets', 'icon.png'), // Optional: add an icon
        titleBarStyle: 'default',
        show: false // Don't show until ready
    });

    // Load the app
    const startUrl = isDev 
        ? 'http://localhost:3000' 
        : `file://${path.join(__dirname, '../src/public/index.html')}`;
    
    mainWindow.loadURL(startUrl);

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focus on the window
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // Set up the application menu
    createMenu();

    app.on('activate', () => {
        // On macOS, re-create a window when the dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On macOS, keep the app running even when all windows are closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        require('electron').shell.openExternal(navigationUrl);
    });
});

// Create application menu
function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Nuevo Juego',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                document.getElementById('addGameBtn').click();
                            `);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Recargar',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.reload();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { label: 'Deshacer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Rehacer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                { type: 'separator' },
                { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Pegar', accelerator: 'CmdOrCtrl+V', role: 'paste' }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
                { label: 'Forzar Recarga', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
                { label: 'Herramientas de Desarrollador', accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I', role: 'toggleDevTools' },
                { type: 'separator' },
                { label: 'Pantalla Completa', accelerator: 'F11', role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                { label: 'Cerrar', accelerator: 'CmdOrCtrl+W', role: 'close' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de Catálogo de Videojuegos',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Acerca de',
                            message: 'Catálogo de Videojuegos',
                            detail: 'Una aplicación para gestionar tu colección de videojuegos.\n\nVersión 1.0.0\nDesarrollado con Electron y Express.'
                        });
                    }
                }
            ]
        }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { label: 'Acerca de ' + app.getName(), role: 'about' },
                { type: 'separator' },
                { label: 'Servicios', role: 'services' },
                { type: 'separator' },
                { label: 'Ocultar ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
                { label: 'Ocultar Otros', accelerator: 'Command+Shift+H', role: 'hideothers' },
                { label: 'Mostrar Todo', role: 'unhide' },
                { type: 'separator' },
                { label: 'Salir', accelerator: 'Command+Q', click: () => app.quit() }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Handle certificate errors (for development)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    if (isDev) {
        // In development, ignore certificate errors
        event.preventDefault();
        callback(true);
    } else {
        // In production, use default behavior
        callback(false);
    }
});

// Export for potential use in other files
module.exports = { createWindow };
