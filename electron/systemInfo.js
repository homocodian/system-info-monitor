const si = require('systeminformation');
const {ipcMain} = require('electron');

function sendSystemInfo(){

    ipcMain.handle("getCpuUsage", async ()=>{
        const cpuLoad = await si.currentLoad();
        return cpuLoad;
    });

    ipcMain.handleOnce("getCpuInfo",async () =>{
        return si.cpu();
    });

    ipcMain.handle("getMemoryInfo", async () => {
        return si.mem();
    });
}

async function getCpuLoad(){
    let currentLoad = await si.currentLoad();
    return currentLoad.currentLoad
}

module.exports = {
    sendSystemInfo:sendSystemInfo,
    getCpuLoad:getCpuLoad
};