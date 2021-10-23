const si = require('systeminformation');
const {ipcMain} = require('electron');

function sendSytemInfo(){
    ipcMain.handle("getCpuUsage", async ()=>{
        const cpuLoad = await si.currentLoad();
        return cpuLoad;
    })
}

module.exports = sendSytemInfo;