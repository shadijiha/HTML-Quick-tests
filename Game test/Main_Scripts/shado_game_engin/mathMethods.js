/*
To use animationHandler.js use "c" as you canvas context variable

copyright Shado Entertainment Co. 28/11/2018 6:43:43 PM all rights reserved
*/

//const floor = (value) => Math.floor(value);

const random = (min, max, floor) => {
	if (max == undefined)	{
		return Math.random() * min;
	}
	if (floor)	{
		return Math.floor(Math.random() * (max - min) + min);
	} else	{
		return Math.random() * (max - min) + min;
	}
}

const distance = (x1, y1, x2, y2) =>	{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const distance3D = (x1, y1, z1, x2, y2, z2) =>	{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

const factorial = (number) =>	{
	let sum = 1;
	if (number != 0 )	{
		do {
			sum = sum * number;
			number -= 1;
		} while (number > 0);
	}
	return sum;
}

const contains = (string, val, returnCount) =>	{
	
	string = string.split("");
	let count = 0;
	
	for (let i = 0; i < string.length; i++)	{
		if (string[i] == val)	{
			count++;
		}
	}
	
	if (returnCount)	{
		return count;
	} else	{
		if (count > 0)	{
			return true;
		} else	{
			return false;
		}
	}
	
}

const collision = (objA, objB) =>	{

	let condition = false;

	if ( objA.constructor == Circle && objB.constructor == Circle )	{

		if ( ( ((objB.x - objA.x) * (objB.x - objA.x)) + ((objB.y - objA.y) * (objB.y - objA.y)) ) <= ((objA.r + objB.r) * (objA.r + objB.r)) )	{
			condition = true;
		}

	} else if (objA.constructor == Circle || objB.constructor == Circle)	{

		let desiredObj;
		let staticObj;

		if (objA.constructor == Circle)	{
			desiredObj = objA;
			staticObj = objB;
		} else	{
			desiredObj = objB;
			staticObj = objA;
		}

		const TEMP = new Rectangle(desiredObj.x - desiredObj.r, desiredObj.y - desiredObj.r, desiredObj.r * 2, desiredObj.r * 2);

		if ( (TEMP.x + TEMP.w > staticObj.x) && (TEMP.x < staticObj.x + staticObj.w) && (TEMP.y + TEMP.h > staticObj.y) && (TEMP.y < staticObj.y + staticObj.h) )	{
			condition = true;
		}

	} else	{

		if ( (objA.x + objA.w > objB.x) && (objA.x < objB.x + objB.w) && (objA.y + objA.h > objB.y) && (objA.y < objB.y + objB.h) )	{
			condition = true;
		}

	}

	return condition;
}

/*const randomColor = (alpha) =>	{
	if (alpha == undefined || alpha == "")	{
		alpha = 1;
	}
	let color = `rgba(${random(0, 256, true)}, ${random(0, 256, true)}, ${random(0, 256, true)}, ${alpha})`;
	return color;
}*/


// Vector methods
const sumVector = (vectorA, vectorB, color) => {
	let result =  new Vector(vectorA.startX, vectorA.startY, vectorA.endX + (vectorB.endX - vectorB.startX), vectorA.endY + (vectorB.endY - vectorB.startY), color);
	return result;
}

const dotProduct = (vectorA, vectorB) =>	{
	let result = (vectorA.endX - vectorA.startX) * (vectorB.endX - vectorB.startX) + (vectorA.endY - vectorA.startY) * (vectorB.endY - vectorB.endY);
	return result;
}

const multiplyVector = (vector, k, color) => {
	return new Vector(vector.startX, vector.startY, vector.endX * k, vector.endY * k, color);
}
