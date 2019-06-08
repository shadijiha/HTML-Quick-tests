/*** 
 * 	JavaScript main file for "Shado Paint" project 
 * 
 * 
 */ 
 
 
     /* Creating canvas */
     let canvas = document.querySelector("canvas");
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
     let c = canvas.getContext("2d");


     /*//////////////////////////////////////
     ////////////////// UI //////////////////
     //////////////////////////////////////*/

     let currentWidth = 1;
     let currentColor = "#000000";

     function changeLineWidth(value)	{
     	currentWidth = Math.abs(Number(value));
     }

     function changeColor(color)	{
     	let str = color.split("");

     	let transparency = document.getElementById("transparency").checked;
     	if (transparency)	{
     		transparency = 0.5;
     	} else	{
     		transparency = 1;
     	}

     	if (str[0] == "#")	{
     		str.splice(0, 1);

     		let r = parseInt(str[0] + str[1], 16);
     		let g = parseInt(str[2] + str[3], 16);
     		let b = parseInt(str[4] + str[5], 16);
     		let rgba = `rgba(${r}, ${g}, ${b}, ${transparency})`;

     		console.log(rgba);

     		currentColor = rgba;
     	}
     }

     function clearCanvas()   {
          // Clearing canvas
          undonePoints = points;
          undonePointsColor = pointsColor;
          undonePointsWidth = pointsWidth;

          points = [];
          pointsColor = [];
          pointsWidth = [];

          // Rest background
          canvas.style.backgroundColor = "transparent";
          canvas.style.backgroundImage = "";

          // Rest settings
          changeColor("#000000");
          changeLineWidth(1);
     }

     /*//////////////////////////////////////
     ////////////////// CORE ////////////////
     //////////////////////////////////////*/

     /* Data*/
     let points = [];		// This array is the principal points array that is drawing @ animate()
     let pointsColor = [];
     let pointsWidth = [];
     let dragged = false;	// This variable registers if the mouse is clicked and dragged
     let current = [];		// This array contains all x, y points of the mouse while being dragged BEFORE mouse up
     let undonePoints = [];	// This array contains arrays of points of all strokes that has been undone @ undo()
     let undonePointsColor = [];
     let undonePointsWidth = [];

     canvas.onmousedown = () =>	{
     	dragged = true;
     }

     canvas.onmouseup = () =>	{
     	dragged = false;
     	points = [...points, current];
     	pointsColor = [...pointsColor, currentColor];
     	pointsWidth = [...pointsWidth, currentWidth];
     	current = [];
     }

     canvas.onmousemove = (event) =>	{
     	if (dragged)	{
     		current = [...current, event.x, event.y];
     	}
     }

     window.onresize = () =>   {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
     }

     // calls undo and redo using Ctrl-Z and Ctrl-Y
     let map = {};
     onkeydown = onkeyup = function(e){
         e = e || event; // to deal with IE
         map[e.keyCode] = e.type == 'keydown';

     	if (map[17] == true && map[90] == true)	{
     		undo();
     	}

     	if (map[17] == true && map[89] == true)	{
     		redo();
     	}
     }

     // The function undo() removes the last Array from $points and push it in $undonePoints
     function undo()	{
     	if (points.length > 0)	{
     		undonePoints.push(points.pop());
     		undonePointsColor.push(pointsColor.pop());
     		undonePointsWidth.push(pointsWidth.pop());
     	}
     }

     // The function redo() removes the last Array from $undonePoints and push it in $points
     function redo()	{
     	if	(undonePoints.length > 0)	{
     		points = [...points, undonePoints[undonePoints.length - 1]];
     		undonePoints.pop();

     		pointsColor = [...pointsColor, undonePointsColor[undonePointsColor.length - 1]];
     		undonePointsColor.pop();

     		pointsWidth = [...pointsWidth, undonePointsWidth[undonePointsWidth.length - 1]];
     		undonePointsWidth.pop();
     	}
     }

     // The function tempDraw() draws all points in $current while the mouse is held down (while $dragged = true)
     function tempDraw()	{
     		c.beginPath();
     		c.moveTo(current[0], current[1]);
     		c.strokeStyle = currentColor;
     		c.lineWidth = currentWidth;
     		for (let j = 2; j < current.length - 1;  j += 2)	{
     			c.lineTo(current[j], current[j + 1]);
     		}
     		c.stroke();
     }



     /*//////////////////////////////////////
     ////////////// DAWINTNG ////////////////
     //////////////////////////////////////*/

     function animate()	{
     	requestAnimationFrame(animate);
     	c.clearRect(0, 0, canvas.width, canvas.height);

     	if (dragged)	{
     		tempDraw();
     	}

     	// This loop draws all points inside arrays in $points
     	for (let i = 0; i < points.length; i++)	{
     		c.beginPath();
     		c.moveTo(points[i][0], points[i][1]);
     		c.strokeStyle = pointsColor[i];
     		c.lineWidth = pointsWidth[i];
     		for (let j = 2; j < points[i].length - 1;  j += 2)	{
     			c.lineTo(points[i][j], points[i][j + 1]);
     		}
     		c.stroke();
     	}

     }
     animate();
