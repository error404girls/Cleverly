function whattodo(){
    if(document.querySelector("#dd i").classList.contains("fa-bars"))
        open_menu();
    else
        close_menu();
  }
  
  function open_menu() {
    document.getElementById("menu").style.width = "250px";
    document.querySelector("#dd i").classList.remove("fa-bars");
    document.querySelector("#dd i").classList.add("fa-xmark");
  }
  
  function close_menu() {
    document.getElementById("menu").style.width = "0";
    document.querySelector("#dd i").classList.remove("fa-xmark");
    document.querySelector("#dd i").classList.add("fa-bars");
  }