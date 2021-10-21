const {ipcRenderer} = require("electron");

window.addEventListener("DOMContentLoaded", ()=>{

    const replaceText = (selecter, text) => {
        const element = document.getElementById(selecter);
        if(element) element.innerText = text;
    }

    for(const dependency of ['chrome','node','electron']){
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }

    const quitButton = document.getElementById("new_window");
    quitButton.addEventListener("click",()=>{
        ipcRenderer.send("quit-btn",true);
    })

    ipcRenderer.on("reply",(e,args)=>{
        console.log(args);
    })

});
