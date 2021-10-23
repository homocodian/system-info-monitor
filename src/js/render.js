// disable right click on app controls buttons
const app_control_div = document.getElementById("right");
app_control_div.addEventListener("contextmenu",e=>e.preventDefault());