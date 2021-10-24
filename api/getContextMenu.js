const { app, Menu } = require('electron');

function getContextMenu(window) {

    const menuTemplate = [
        {
            label: "Open",
            click: () => {
                if (window.isMinimized() || window.is) {
                    window.show();
                }else if(!window.isVisible()){
                    window.show();
                }
            }
        },
        {
            label: "Quit",
            click: ()=>{
                if (process.platform !== 'darwin') {
                    app.quit();
                }
            }
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    
    return menu;
}

module.exports = getContextMenu;