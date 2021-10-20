const { app, BrowserWindow } = require("electron");
const path = require("path");

// create window and load local html file into it
function createWindow() {
    // window
    const win = new BrowserWindow({
        width: 800,
        height: 400,
        center: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    // load file
    win.loadFile("index.html");
    // win.toggleDevTools();
    win.setMenuBarVisibility(false);
    win.once("ready-to-show", () => {
        win.show();
    })
}

// In Electron, browser windows can only be created 
// after the app module's ready event is fired.

app.whenReady().then(() => {
    // create window
    createWindow();

    // for macOs
    // creating new window in mac if all windows are closed
    // because mac doesn't close appliction if all widnwods are closed
    app.on("activate", () => {
        if (process.platform === "darwin" && BrowserWindow.getAllWindows() === 0) {
            createWindow();
        }
    })
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
});