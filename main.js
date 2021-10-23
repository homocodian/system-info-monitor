const { app, BrowserWindow } = require("electron");
const handleApp = require('./electron/handleApp');
const getContextMenu = require('./electron/contexMenu');
const windowStateKeeper = require("electron-window-state");
const sendSystemInfo = require('./electron/systemInfo');
const path = require("path");

// create window and load local html file into it
function createWindow() {
    // remenber window state
    const mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 500
    });

    // window
    const win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 600,
        minHeight: 400,
        title: "System Info",
        frame: false,
        backgroundColor:"#121212",
        icon: "assets/app.png",
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "/src/js/preload.js")
        }
    });

    // handle lifecycle of  app
    handleApp();
    
    // load file
    win.loadFile("src/index.html");

    win.once("ready-to-show", () => {
        // send cpu usage
        sendSystemInfo();
        // manange window state
        mainWindowState.manage(win);
        win.show();
        win.webContents.on("context-menu",()=>{
            let contextMenu = getContextMenu(win)
            contextMenu.popup();
        });
    });
    
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
        if (BrowserWindow.getAllWindows() === 0) {
            createWindow();
        }
    })
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
});