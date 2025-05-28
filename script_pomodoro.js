const div = document.getElementById('timer_container');

function updateSize() {
    const width = div.offsetWidth;
    document.getElementById('timer').style.fontSize = `${Math.ceil(150 * width / 880)}px`;
}

window.addEventListener('resize', updateSize);
window.addEventListener('load', updateSize);

/// side menu
function whattodo() {
    if (document.querySelector("#dd i").classList.contains("fa-bars"))
        open_menu();
    else
        close_menu();
}

function open_menu() {
    document.getElementById("menu").style.width = "250px";
    document.querySelector("#dd i").classList.replace("fa-bars", "fa-xmark");
}

function close_menu() {
    document.getElementById("menu").style.width = "0";
    document.querySelector("#dd i").classList.replace("fa-xmark", "fa-bars");
}


/// timer
let time, tleft, tdefault;
let ok = 0;
let mode = "study";

function getInputTime(minId, secId) {
    let minutes = parseInt(document.getElementById(minId).value) || 0;
    let seconds = parseInt(document.getElementById(secId).value) || 0;
    return [Math.min(minutes, 59), Math.min(seconds, 59)];
}

function setTimer() {
    const [minutes, seconds] = getInputTime("minutes_input", "seconds_input");
    tleft = minutes * 60 + seconds;
    tdefault = tleft;
    displayy();
}

function displayy() {
    let minutes = Math.floor(tleft / 60);
    let seconds = tleft % 60;
    document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (ok === 1) return;
    ok = 1;
    time = setInterval(() => {
        if (tleft > 0) {
            tleft--;
            displayy();
        } else {
            clearInterval(time);
            ok = 0;
            const alertText = mode === "study"
                ? "Time's up! Take a short break!"
                : "Break over! Go back to studying!";
            document.querySelector("#costum_alert p").textContent = alertText;

            mode = (mode === "study") ? "break" : "study";

            const [minutes, seconds] = mode === "study"
                ? getInputTime("minutes_input", "seconds_input")
                : getInputTime("minutes_break", "seconds_break");

            tleft = minutes * 60 + seconds;
            document.getElementById("costum_alert").style.display = "flex";
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(time);
    ok = 0;
}

function resetTimer() {
    pauseTimer();
    mode = "study";
    setTimer();
}


document.getElementById("start").addEventListener("click", function () {
    if (this.textContent === "start" || this.textContent === "resume") {
        this.textContent = "pause";
        startTimer();
    } else {
        this.textContent = "resume";
        pauseTimer();
    }
});

document.getElementById("reset").addEventListener("click", function () {
    document.getElementById("start").textContent = "start";
    resetTimer();
});

// Customization
function open_cm() {
    document.getElementById("costumize_menu").style.display = "flex";
}

function bgcolor() {
    document.body.style.backgroundColor = document.getElementById("bg_color").value;
}

function btncolor() {
    let buttons = document.querySelectorAll("#timer_container .buttons button");
    buttons.forEach(btn => btn.style.backgroundColor = document.getElementById("btn_color").value);
}

function fontcolor() {
    const color = document.getElementById("font_color").value;
    document.getElementById("timer").style.color = color;
    document.querySelectorAll("#timer_container .buttons button").forEach(btn => btn.style.color = color);
}

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0'));
    return `#${result.join('')}`;
}

document.getElementById("cancel_button").addEventListener("click", function () {
    document.getElementById("minutes_input").value = "30";
    document.getElementById("seconds_input").value = "0";
    document.getElementById("minutes_break").value = "5";
    document.getElementById("seconds_break").value = "0";

    document.getElementById("bg_color").value = rgbToHex(getComputedStyle(document.body).backgroundColor);
    document.getElementById("font_color").value = rgbToHex(getComputedStyle(document.getElementById("timer")).color);
    document.getElementById("btn_color").value = rgbToHex(getComputedStyle(document.querySelector("#timer_container .buttons button")).backgroundColor);

    document.getElementById("costumize_menu").style.display = "none";
});
function resetfnc() {
    document.getElementById("minutes_input").value = "30";
    document.getElementById("seconds_input").value = "0";
    document.getElementById("minutes_break").value = "5";
    document.getElementById("seconds_break").value = "0";
    document.getElementById("font_color").value = "#39397c";
    document.getElementById("bg_color").value = "#a9b7da";
    document.getElementById("btn_color").value = "#a9b7da";

    document.getElementById("timer").style.color = "#39397c";
    document.body.style.backgroundColor = "#a9b7da";

    document.querySelectorAll("#timer_container .buttons button").forEach(btn => {
        btn.style.backgroundColor = "#a9b7da";
        btn.style.color = "#39397c";
    });

    document.getElementById("costumize_menu").style.display = "none";

    document.getElementById("start").textContent = "start"; 
    resetTimer();
}

function savefnc() {
    setTimer();
    bgcolor();
    btncolor();
    fontcolor();
    document.getElementById("costumize_menu").style.display = "none";
}

function close_alert() {
    document.getElementById("costum_alert").style.display = "none";
    startTimer(); 
}

setTimer(); 
