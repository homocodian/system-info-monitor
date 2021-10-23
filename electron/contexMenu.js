const {Menu} = require('electron');
// menu
function getContextMenu(BrowserWindow){
    
    let contextMenu = [{label:"Open DevTools", click: async()=>{
        BrowserWindow.webContents.openDevTools();
    }}];
    
    contextMenu = Menu.buildFromTemplate(contextMenu);

    return contextMenu;
}

module.exports = getContextMenu;