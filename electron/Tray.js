const {Tray,nativeImage} = require("electron");
const {getCpuLoad} = require('./systemInfo');
const getMenu = require('./contextMenu');
const path = require('path');

function makeTray(window){
    const trayImage = nativeImage.createFromPath(path.resolve() + "/app.ico");
    const tray = new Tray(trayImage);

    tray.setContextMenu(getMenu(window));

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
}

module.exports = makeTray;