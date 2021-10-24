const { BrowserWindow, ipcMain,app } = require('electron');

function handleApp() {

    // close application
    ipcMain.on("closeApp", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    })

    // maximize or restore application
    ipcMain.on("maximizeOrRestore", (e) => {
        if (BrowserWindow.getFocusedWindow().isMaximized()) {
            BrowserWindow.getFocusedWindow().restore();
        } else {
            BrowserWindow.getFocusedWindow().maximize();
        }
        e.reply("isMaximized", BrowserWindow.getFocusedWindow().isMaximized());
    });


    // minimize application
    ipcMain.on("minimizeApp", () => {
        BrowserWindow.getFocusedWindow().minimize();
    })
}

module.exports = handleApp;