/*
	• The getFrameRate function calculates a canvas avrage framerate.
	• The getFrameRate function returns an double.
	• The getFrameRate function requires 2 global variables:
		1. time1 = performance.now();
		2. fpsArray = [];
	These variables should not be changed.
*/

let time1 = performance.now();
let fpsArray = [];

function getFrameRate()	{

	// Avrage function for calculating avrage framerate
	const avrage = (array) =>	{
		return array.reduce((a, b) => a + b) / array.length;
	}

	 let fps = Math.floor(1 / ((performance.now() - time1) / 1000));
	 fpsArray.push(fps);

	 time1 = performance.now();

	 if (fpsArray.length > 500)	{
		fpsArray.splice(0, fpsArray.length / 2);
	 }

	 return avrage(fpsArray);
}

/*let frameCount = 0;
let time = 0;
let framerate = 0;
let fps = 0;

setInterval(function()	{
	time++;
	framerate = frameCount / time;
	fps = framerate;
}, 1000);*/
