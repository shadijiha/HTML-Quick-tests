/*
To use animationHandler.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 28/11/2018 6:42:55 PM all rights reserved
*/


// Mouse data
let mouse = {
	x: undefined,
	y: undefined
}

let lastClick = {
	x: undefined,
	y: undefined
}

let lastRightClick = {
	x: undefined,
	y: undefined
}

let clicked = undefined;
let mouseMoved = undefined;
let rightClicked = undefined;
let resized = undefined;


window.addEventListener("mousemove", (event) =>	{
	mouse.x = event.x;
	mouse.y = event.y;

	if (mouseMoved != undefined)	{
		mouseMoved();
	}

});

window.addEventListener("click", (event) =>	{
	lastClick.x = event.x;
	lastClick.y = event.y;

	if (clicked != undefined)	{
		clicked();
	}
});

window.addEventListener("contextmenu", (event) =>	{
	lastRightClick.x = event.x;
	lastRightClick.y = event.y;

	if (rightClicked != undefined)	{
		rightClicked();
	}
});

window.addEventListener("resize", () =>	{
	/*windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;*/

	if (resized != undefined)	{
		resized();
	}
});
