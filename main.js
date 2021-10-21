const { app, BrowserWindow, Tray, nativeImage, Menu, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");

// getting actions from window
ipcMain.on("quit-btn",(e, args)=>{
    console.log(args);
    if (args === true && process.platform !== "darwin") {
        app.quit()
    }
})



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
        backgroundColor:"#121212",
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "/src/js/preload.js")
        }
    });

    // menu
    let menu = [{label:"File",submenu:[{role:"quit"}]},{label:"View",
    submenu:[{label:"Copy"},{label:"Paste"}]},
    {label:"Blog"},{label:"Open DevTools", click: async()=>{
        win.webContents.openDevTools();
    }}];
    menu = Menu.buildFromTemplate(menu);
    
    // load file
    win.loadFile("src/index.html");
    win.once("ready-to-show", () => {
        // manange window state
        mainWindowState.manage(win);
        // win.setMenu(menu)
        win.show();
        win.webContents.on("context-menu",()=>{
            menu.popup();
        })

        const image = nativeImage.createFromPath("images/myapp.png");
        const tray = new Tray(image);
        tray.setToolTip("Click to open");
        tray.on("click",()=>{
            win.isVisible() ? win.hide() : win.show();
        })
        tray.on("balloon-closed",(e)=>{
            console.log(e);
            console.log("Tray closed");
        })
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
        if (BrowserWindow.getAllWindows() === 0) {
            createWindow();
        }
    })
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
});