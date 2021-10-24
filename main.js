require('update-electron-app')();
const { app, BrowserWindow, Tray } = require("electron");
const { sendSystemInfo, getCpuLoad } = require('./api/systemInfo');
const getContextMenu = require('./api/getContextMenu');
const windowStateKeeper = require("electron-window-state");
const handleApp = require('./api/handleAppLifecycle');
const path = require("path");

// create window and load local html file into it
function createWindow() {
    // remenber window state
    const mainWindowState = windowStateKeeper({
        defaultWidth: 940,
        defaultHeight: 630
    });

    // window
    const win = new BrowserWindow({
        x: mainWindowState.x,y: mainWindowState.y,
        width: mainWindowState.width,height: mainWindowState.height,
        minWidth: 940,minHeight: 630,
        frame: false,
        title: "System Info",
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

        // show window
        win.show();
    });

    return win;

}

// In Electron, browser windows can only be created 
// after the app module's ready event is fired.

app.whenReady().then(() => {
     // send cpu usage
     sendSystemInfo();

    // create window
    const window = createWindow();

    const tray = new Tray("app.ico");

    tray.setContextMenu(getContextMenu(window));

    getCpuLoad().then(data =>{
        data ? tray.setToolTip("CPU " + data.toFixed(0) + "%") : "";
    })

    tray.on("mouse-move",()=>{
        getCpuLoad().then(data =>{
            data ? tray.setToolTip("CPU " + data.toFixed(0) + "%") : "";
        })
    });

    tray.on("click",()=>{
        if(window.isVisible()){
            window.hide();
        }else{
            window.show();
        }
    });

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