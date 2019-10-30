// Shado javascript framework v2.0.0
let version = " v2.0.0";
let releaseDate = "06/11/2018 4:30:55 PM";
let Pi = Math.PI;
//let π = Math.PI;
let angles;
let e = Math.E;
let copyRight = `&copy; Shado JS framework ${version} | All rights reserved 28/01/2018 5:20 PM 10002801201817247_745`;
let path = window.location.pathname;
let filename = path.split("/").pop();

const randomBetweenRange = (min, max, floor)	=>	{
	if (floor)	{
		return Math.floor(Math.random() * (max - min) + min);
	} else	{
		return Math.random() * (max - min) + min;
	}
}

const root = (num, power) =>	{
     if ( (power == null) || (power == " ") || (power == "") ) {
          power = 2;
     }
     if ( (num < 0) && (power % 2 == 0) )    {
          return Math.pow(Math.abs(num), 1 / power) + "i";
     } else {
          return Math.pow(num, 1 / power);
     }
}

const radianToDegrees = (rad)	=> (rad * 180) / Math.PI;

const degreesToRadians = (deg) =>	(deg * Math.PI) / 180;

const write = (elementId, argument)	=>	document.getElementById(elementId).innerHTML = argument;

const exp = (base, exposant) => Math.pow(base, exposant);

const square = (base) => Math.pow(base, 2);

const sin = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.sin(ang);
}

const cos = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.cos(ang);
}

const tan = (ang) =>	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}
	return Math.tan(ang);
}

const sec = (ang) => (1 / cos(ang));
const csc = (ang) => (1 / sin(ang));
const cot = (ang) => (1 / tan(ang));

const arcsin = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.asin(arg));
     } else {
          return Math.asin(arg);
     }
}

const arccos = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.acos(arg));
     } else {
          return Math.acos(arg);
     }
}

const arctan = (arg) =>	{
     if (angles == "degrees") {
          return radianToDegrees(Math.atan(arg));
     } else {
          return Math.atan(arg);
     }
}

const log = (base, number) =>	{
	if ( (base == null) || (base == "") )	{
		base = 10;
	}
	return Math.log(number) / Math.log(base);
}

const ln = (number)	=>	log(Math.E, number);

const getElement = (id) =>	document.getElementById(id);

const zeros = (a, b, c, i) =>	{
	var zerosArray = [
		(-b + (Math.sqrt(Math.pow(b, 2) - (4 * a * c)))) / (2 * a),
		(-b - (Math.sqrt(Math.pow(b, 2) - (4 * a * c)))) / (2 * a)
	];
	if (i == null)	{
		return zerosArray;
	} else	{
		return zerosArray[i];
	}
}

const round = (argument, digits) =>	argument.toFixed(digits);

const randomColor = (alpha)	=> {
	if (alpha == undefined || alpha == "")	{
		alpha = 1;
	}
	let color = {
		r: round(randomBetweenRange(0, 255)),
		g: round(randomBetweenRange(0, 255)),
		b: round(randomBetweenRange(0, 255))
	};
	var rgb = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
	return rgb;
}

const primeNumber = (number) =>	{
	let cond;
	let conditionNumber = 0;

	for (let i = 0; i <= 9; i++)	{
		if (number % i != 0)	{
			conditionNumber = conditionNumber;
		} else	if (number % i == 0)	{
			conditionNumber += 1;
		}
	}

	if (conditionNumber > 2)	{
		cond = false;
	} else	{
		cond = true;
	}
	return cond;
}

const detect = (string, character)  =>	{
  let stringArray = string.split("");
  numberOfCharacters = 0;

  for (let i = 0; i < stringArray.length; i++)  {
    if (stringArray[i] == character)  {
      numberOfCharacters += 1;
    }
  }
  return numberOfCharacters;
}

const sum = (array) =>	{
	let addtion = 0;
	for (let i = 0; i < array.length; i++)	{
		addtion += array[i];
	}
	return addtion;
}

const floor = (value) => Math.floor(value);

const removeElement = (arrayname, elem) =>	{
	for (let i = arrayname.length - 1; i < 0; i--)	{
		if (arrayname[i] == elem)	{
			arrayname.splice(1, i);
		}
	}
}

const copy = (argument) => {
	let copyText = document.getElementById(argument);
	copyText.select();
	return document.execCommand("Copy");
}

const compare = (array) =>	{
     var number = 0;

     for (let i = 0; i < array.length; i++)    {
          if (array[i] > number) {
               number = array[i];
          }
     }
     return number;
}

const generatePassword = (digits) =>	{
	if (digits == undefined)	{
		digits = 16;
	}

	let password = "";
	let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890[],.;/!?%$#@*&()";
	char = char.split("");

	for (let i = 0; i < digits; i++)	{
		password += char[randomBetweenRange(0, char.length, true)];
	}

	return password;
}

const errorCatcher = (callback) =>	{
	try	{
		callback();
	} catch(error)	{
		console.log(error);
	}
}
console.log(copyRight);
