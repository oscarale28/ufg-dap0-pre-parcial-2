const { spawn } = require('child_process');
const path = require('path');
const { app } = require('electron');

let serverProcess = null;

// Start the Express server
function startServer() {
    const serverPath = path.join(__dirname, 'src', 'server.js');
    
    serverProcess = spawn('node', [serverPath], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
    });

    serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err);
    });

    serverProcess.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
    });
}

// Stop the Express server
function stopServer() {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
}

// Start server when Electron is ready
app.whenReady().then(() => {
    startServer();
    
    // Wait a moment for server to start, then start Electron
    setTimeout(async () => {
        try {
            await import('./electron/main.js');
        } catch (err) {
            console.error("Error starting Electron app", err);
            process.exit(1);
        }
    }, 2000);
});

// Stop server when Electron quits
app.on('before-quit', () => {
    stopServer();
});

// Handle app termination
process.on('exit', () => {
    stopServer();
});

process.on('SIGINT', () => {
    stopServer();
    process.exit();
});

process.on('SIGTERM', () => {
    stopServer();
    process.exit();
});
