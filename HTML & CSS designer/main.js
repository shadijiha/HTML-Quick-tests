/***
 * 
 * 
 */
const mouse = {
    x: undefined,
    y: undefined,
    isDown: false,
}
const random = (min, max) =>    Math.floor(Math.random() * (max - min) + min);

let selected = null;
let oldSelect = null;

function getElement(id) {
    return document.getElementById(id);
}

function addElement(tag)    {
    tag = tag || "div";
    tag = tag.toLowerCase();

    const DIV = getElement("output");
    const tempID = random(0, 999999) + "_element";


    DIV.innerHTML += `<${tag} id="${tempID}" onclick="changeSelect(this)" onblur="changeSelect(null)" style="resize: both; overflow: auto;"></${tag}>`;

    const DOM = document.getElementById(tempID);
    DOM.innerHTML += tag + " Sample text";
    DOM.style.width = "20%";
    //DOM.styte.height = "5%";

    changeSelect(DOM);

    // Init movable objects
    movableObjects();

    return DOM;
}

function movableObjects()   {

    const DOM = document.getElementsByClassName("movable");

    for (let element of DOM)    {
        if (element.mousemove == null)  {
            element.addEventListener("mousemove", function(event)   {
                if (mouse.isDown)   {
                    element.style.position = "absolute";
                    element.style.top = mouse.y - element.offsetHeight / 2;
                    element.style.left = mouse.x - element.offsetWidth / 2;
                    element.style.cursor = "move";
                }
            });
        }
    }

}

movableObjects();

function changeSelect(element)  {
    oldSelect = selected;
    selected = element;
    renderSelected();
}

function renderSelected()   {

    if (oldSelect != null && oldSelect != undefined)    {
        oldSelect.classList.remove("selected");
        oldSelect.classList.remove("movable");
    }

    if (selected != null && selected != undefined)  {
        selected.classList.add("selected");
        selected.classList.add("movable");
    }
}

window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("mousedown", function() {
    mouse.isDown = true;
});

window.addEventListener("mouseup", function() {
    mouse.isDown = false;
});

