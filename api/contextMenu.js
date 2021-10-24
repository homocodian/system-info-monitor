const {Menu,app} = require('electron');

function getMenu(window) {
    let menu = [{label:"Open",click:()=>{
        // window isVisible() is returning its previous state
        // i don't know why
        // if you know why then please tell me 
        if (window.isVisible()) window.show();
    }},{label:"Quit",click:()=>{
        !process.platform !== "darwin" ? app.quit() : null;
    }}]

    menu = Menu.buildFromTemplate(menu);
    
    return menu;
}

module.exports = getMenu;