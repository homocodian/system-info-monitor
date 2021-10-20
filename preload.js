window.addEventListener("DOMContentLoaded", ()=>{
    const replaceText = (selecter, text) => {
        const element = document.getElementById(selecter);
        if(element) element.innerText = text;
    }

    for(const dependency of ['chrome','node','electron']){
        replaceText(`${dependency}-version`, process.version);
    }
});