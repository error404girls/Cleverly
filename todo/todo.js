let tasks = [];

document.querySelector(".tasknou button").addEventListener("click", function () {

    const task = document.querySelector(".tasknou input").value.trim();
    if (!task)
        return;
    document.querySelector(".tasknou input").value = "";
    const id = +new Date(); ///id unic pt fiecare task
    addNewTask({
        task,
        id,
        done: false
    });
    tasks.push({
        task,
        id,
        done: false
    });
    salvare();
});

function addNewTask({ task, id, done }) {
    const defacut = document.querySelector(".taskuri");
    const adaug = document.createElement("div");
    adaug.classList.add("task");
    adaug.innerHTML = `
    <div class="input">
        <input type="checkbox" id="defacut-${id}">
            <label for="defacut-${id}">
                <i class="fa fa-check"></i>
            </label>
    </div>
    <div class="nume"> </div>
    <div class="delete">
        <button><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    adaug.querySelector(".nume").innerText = task;

    adaug.querySelector("input").addEventListener("click", function (e) {
        adaug.classList.toggle("done");
        const index = tasks.findIndex(t => t.id === id);
        if (index > -1) {
            tasks[index].done = adaug.classList.contains("done");
        }
        count();
        salvare();
    });


    adaug.querySelector("button").addEventListener("click", function (e) {
        adaug.remove();
        tasks = tasks.filter(t => t.id !== id);
        count();
        salvare();
    });


    defacut.appendChild(adaug);
    if (done) {
        adaug.classList.add("done");
        adaug.querySelector("input").checked = true;
    }
    count();
}

function count() {
    const total = document.querySelectorAll(".taskuri .task").length;
    const facute = document.querySelectorAll(".taskuri .task.done").length;
    const numar = document.querySelectorAll(".counter span");
    numar[0].innerText = facute;
    numar[2].innerText = total;
}

function init() {
    try {
        const salvate = JSON.parse(
            localStorage.getItem("task-salvare")
        );
        if (Array.isArray(salvate)) {
            tasks = salvate;
            tasks.forEach(task => {
                addNewTask(task);
            });
        }
    } catch (error) { }
    count();
}

function salvare() {
    localStorage.setItem("task-salvare", JSON.stringify(tasks));
}

init();

  
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
  
