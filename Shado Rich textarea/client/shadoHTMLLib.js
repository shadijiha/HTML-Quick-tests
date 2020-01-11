function $(args) {
    return document.querySelector(args);
}
function getElement(args) {
    return $(args);
}
function createElement(type, parent) {
    var BODY = $("body");
    var ele = document.createElement(type);
    if (parent) {
        parent.appendChild(ele);
    }
    else {
        BODY.appendChild(ele);
    }
    return ele;
}
function deleteElement(element) {
    try {
        var PARENT = element.parentElement;
        PARENT.removeChild(element);
    }
    catch (e) {
        console.error(e.message);
    }
}
