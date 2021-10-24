require('update-electron-app')();
const { app, BrowserWindow } = require("electron");
const handleApp = require('./electron/handleApp');
const windowStateKeeper = require("electron-window-state");
const {sendSystemInfo} = require('./electron/systemInfo');
const makeTray = require('./electron/Tray');
const path = require("path");

// create window and load local html file into it
function createWindow() {
    // remenber window state
    const mainWindowState = windowStateKeeper({
        defaultWidth: 940,
        defaultHeight: 600
    });

    // window
    const win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 940,
        minHeight: 600,
        title: "System Info",
        frame: false,
        backgroundColor: "#121212",
        icon: "app.ico",
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "/src/js/preload.js")
        }
    });

    // load file
    win.loadFile("src/index.html");

    win.once("ready-to-show", () => {
        // manange window state
        mainWindowState.manage(win);

        // handle lifecycle of  app
        handleApp();

        // send cpu usage
        sendSystemInfo();

        // show window
        win.show();

        // tray
        makeTray(win);
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