const {ipcRenderer} = require("electron");

window.addEventListener("DOMContentLoaded", ()=>{

    // cpu usage
    const cpuUsage = document.getElementById("cpuUsage"); 
    // progress bar
    const cpuUsagesBar = document.getElementById("cpuUsageBar");

    // close app
    const closeApp = document.getElementById("close");
    closeApp.addEventListener("click",()=>{
        ipcRenderer.send("closeApp");
    });

    // maximize or restore application
    const maximizeOrRestore = document.getElementById("maximizeOrRestore");
    maximizeOrRestore.addEventListener("click",()=>{
        ipcRenderer.send("maximizeOrRestore");
    });

    ipcRenderer.on("isMaximized",(e,args)=>{
        if(args){
            maximizeOrRestore.classList.remove("maximuze_button");
            maximizeOrRestore.classList.add("restore_button");
            maximizeOrRestore.title = "restore"
        }else{
            maximizeOrRestore.classList.remove("restore_button");
            maximizeOrRestore.classList.add("maximize_button");
            maximizeOrRestore.title = "maximize"
        }
    })

    // minimise app
    const minimizeApp = document.getElementById("minimize");
    minimizeApp.addEventListener("click",()=>{
        ipcRenderer.send("minimizeApp");
    });

    // populate dom
    const replaceText = (selecter, text) => {
        const element = document.getElementById(selecter);
        if(element) element.innerText = text;
    }

    for(const dependency of ['chrome','node','electron']){
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }

    // get cpu info
    setInterval(() => {
        getCpuUsage()
    }, 2000);

    // cpu usage
    function getCpuUsage() {
        ipcRenderer.invoke("getCpuUsage").then(data => {
            const cpuLoad = data.currentLoad.toFixed(2);
            cpuUsage.innerText = cpuLoad + "%"
            cpuUsagesBar.style.width = cpuLoad + "px";
        }).catch(error => {
            console.log(error);
        });
    }

});
