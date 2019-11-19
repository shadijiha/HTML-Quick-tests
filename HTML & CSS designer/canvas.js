/***
 * 
 * for Canvas drawing (e.g. lines & stuff)
 */

const canvas = document.getElementById("editor_canvas");
const c = canvas.getContext("2d");
const debug = new Logger(2);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "transparent";

// Render
setInterval(function()  {
    c.clearRect(0, 0, canvas.width, canvas.height);
    render();
});

let x = 200;
let y = 200;
let Xincrement = 1;
let Yincrement = 1;

function render()   {

    c.beginPath();
    c.arc(x, y, 50, 0, Math.PI * 2, false);
    c.stroke();

    x += Xincrement;
    y += Yincrement;

    if (x + 50 > canvas.width || x - 50 < 0)    {
        Xincrement = -Xincrement;
    }

    if (y + 50 > canvas.height || y - 50 < 0)    {
        Yincrement = -Yincrement;
    }

}