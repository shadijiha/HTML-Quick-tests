/*
	• The loading function animates a given string.
	• The loading function does not return a value.
	• The loading function requires at least 2 arguments:
			@para#1	MANDATORY	=> string		: expects a string (without the 3 dots at the end).
			@para#2 MANDATORY	=> id			: expects an HTML element id where this function will animate.
			@para#3	OPTIONAL	=> refreshRate	: expects a number that will determine the animation speed of the given string.

	EXAMPLE:
		HTML:
			<div id="body"></div>
		JS:
			loading("Loading", "body", 1)

	RESULT:
		At 1 second	:	Loading...
		At 2 second	:	Loading..
		At 3 second	:	Loading.
		At 4 second	:	Loading...
		At 5 second	:	Loading..
		At 6 second	:	Loading.

		[...]
*/

function loading(string, id, refreshRate)	{

	if (refreshRate == undefined)	{
		refreshRate = 1;
	}

	let str = `${string}...`;
	let len = str.length;
	str = str.split("");

	setInterval(() =>	{
		str.pop();

		if (str.length < len - 3)	{
			str = `${string}...`;
			len = str.length;
			str = str.split("");
		}

		document.getElementById(id).innerHTML = str.join("");

	}, refreshRate * 1000);
}
