const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {

    // application cycle
    ApplicationLifeCycle();

    // get cpu info 
    getCpuInfo();

    // get Memory info
    getMemoryInfo();

});

function ApplicationLifeCycle() {
    // close app
    const closeApp = document.getElementById("close");
    closeApp.addEventListener("click", () => {
        ipcRenderer.send("closeApp");
    });

    // maximize or restore application
    const maximizeOrRestore = document.getElementById("maximizeOrRestore");
    maximizeOrRestore.addEventListener("click", () => {
        ipcRenderer.send("maximizeOrRestore");
    });

    // is maximized
    ipcRenderer.on("isMaximized", (e, args) => {
        if (args) {
            maximizeOrRestore.classList.remove("maximuze_button");
            maximizeOrRestore.classList.add("restore_button");
            maximizeOrRestore.title = "restore"
        } else {
            maximizeOrRestore.classList.remove("restore_button");
            maximizeOrRestore.classList.add("maximize_button");
            maximizeOrRestore.title = "maximize"
        }
    })

    // minimise app
    const minimizeApp = document.getElementById("minimize");
    minimizeApp.addEventListener("click", () => {
        ipcRenderer.send("minimizeApp");
    });
}

function getCpuInfo() {

    // cpu 
    const cpuUsage = document.getElementById("cpuUsage");
    const cpuUsagesBar = document.getElementById("cpuUsageBar");
    // more cpu info
    const manufacturer = document.getElementById("manufacturer");
    const brand = document.getElementById("brand");
    const cores = document.getElementById("cores");
    const physicalCores = document.getElementById("physicalCores");
    const vendor = document.getElementById("vendor");
    const speed = document.getElementById("speed");
    const speedMin = document.getElementById("speedMin");
    const speedMax = document.getElementById("speedMax");
    const virtualization = document.getElementById("virtualization");

    // cpu usage
    async function getCpuUsage() {
        try {
            const data = await ipcRenderer.invoke("getCpuUsage");
            const cpuLoad = data.currentLoad.toFixed(2);
            cpuUsage.innerText = cpuLoad + "%"
            cpuUsagesBar.style.width = cpuLoad + "%";
        } catch (error) {
            console.warn(error);
        }
    }

    async function invokeGetCpuInfo() {
        try {
            // invoke async event in main process for data
            const data = await ipcRenderer.invoke("getCpuInfo");

            manufacturer.innerText = data.manufacturer ? data.manufacturer : "No data!";
            brand.innerText = data.brand ? data.brand : "No data!";
            cores.innerText = data.cores ? data.cores : "No data!";
            physicalCores.innerText = data.physicalCores ? data.physicalCores : "No data!";
            vendor.innerText = data.vendor ? data.vendor : "No data!";
            speed.innerText = data.speed ? data.speed + "GHz" : "No data!";
            speedMin.innerText = data.speedMin ? data.speedMin + "GHz" : "No data!";
            speedMax.innerText = data.speedMax ? data.speedMax + "GHz" : "No data!";
            virtualization.innerText = data.virtualization ? "Enabled" : "disabled";
        } catch (error) {
            console.warn(error);
        }
    }

    invokeGetCpuInfo();

    getCpuUsage();

    // get cpu info in every 2 sec
    setInterval(() => {
        getCpuUsage()
    }, 2000);
}

function getMemoryInfo() {

    // memory
    const totalMem = document.getElementById("totalMem");
    const freeMem = document.getElementById("freeMem");
    const usedMem = document.getElementById("usedMem");
    const activeMem = document.getElementById("activeMem");
    const availableMem = document.getElementById("availableMem");

    // get memory info
    async function getMemoryInformation() {
        // invoke async event in main process for data
        const data = await ipcRenderer.invoke("getMemoryInfo");

        totalMem.innerText = data.total ? formatBytes(data.total) : "No data!";
        freeMem.innerText = data.free ? formatBytes(data.free) : "No data!";
        usedMem.innerText = data.used ? formatBytes(data.used) : "No data!";
        activeMem.innerText = data.active ? formatBytes(data.active) : "No data!";
        availableMem.innerText = data.available ? formatBytes(data.available) : "No data!";
    }

    getMemoryInformation();

    setInterval(() => {
        getMemoryInformation();
    }, 3000);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
