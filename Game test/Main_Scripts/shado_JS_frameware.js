// Shado javascript frameware v1.0.5
var version = " v1.0.5";
var PI = Math.PI;
var Pi = Math.PI;
var angles;
var e = Math.E;
var copyRight = "&copy; Shado JS frameware" + version + " | All rights reserved 28/01/2018 5:20 PM 10002801201817247_745";
var path = window.location.pathname;
var filename = path.split("/").pop();

function randomBetweenRange(max, min)	{
	return Math.random() * (max - min) + min;
}

function log(txt)	{
	console.log(txt);
}

function root(num, power)	{
	return Math.pow(num, 1 / power);
}

function radianToDegrees(rad)	{
	return (rad * 180) / Math.PI;
}

function write(elementId, argument)	{
	document.getElementById(elementId).innerHTML = argument;
}

function exp(base, exposant)	{
	return Math.pow(base, exposant);
}

function square(base)	{
	return Math.pow(base, 2);
}

function sin(ang)	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	};

	return Math.sin(ang);
}

function cos(ang)	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}

	return Math.cos(ang);
}

function tan(ang)	{
	if (angles == "degrees")	{
		ang = (ang * Math.PI) / 180;
	} else	{
		angles = "radians";
	}

	return Math.tan(ang);
}

function logarithm(number, base)	{
	if (base == null)	{
		base = 10;
	}
	return Math.log(number) / Math.log(base);
}

function getElement(id)	{
	var re = "document.getElementById('" + id + "')";
	return eval(re);
}

function zeros(a, b, c, i)	{
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

function round(argument, digits)	{
	return argument.toFixed(digits);
}

function randomColor()	{
	var color = {
		r: round(randomBetweenRange(0, 255)),
		g: round(randomBetweenRange(0, 255)),
		b: round(randomBetweenRange(0, 255))
	};
	var rgb = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	return rgb;
}

function getElementsClass(theClass, action)	{
	var re = "document.getElementsByClassName('" + theClass + "')";

	for (let i = 0; i < re.length; i++)	{
		eval(re + "[" + i + "]" + "." + action);
	}

}

function primeNumbers(number)	{
	var cond;
	var conditionNumber = 0;

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

function detect(string, character)  {
  var stringArray = string.split("");
  numberOfCharacters = 0;

  for (let i = 0; i < stringArray.length; i++)  {
    if (stringArray[i] == character)  {
      numberOfCharacters += 1;
    }
  }
  return numberOfCharacters;
}

function sum(argument)  {
  var argumentsArray = argument.split(",");
  var sumresult = 0;

  for (let i = 0; i < argumentsArray.length; i++) {
    sumresult = sumresult + Number(argumentsArray[i]);
  }

  return sumresult;
}

function floor(number)	{
	return Math.floor(number);
}

function clear(arrayname, numberOfElements)	{
	if ((numberOfElements == null) || (numberOfElements == ""))	{
		numberOfElements = arrayname.length;
	}
	for (let i = 0; i < numberOfElements; i++)	{
		arrayname.pop();
	}
}

function copy(argument)	{
	var copyText = document.getElementById(argument);
	copyText.select();
	return document.execCommand("Copy");
}
log(copyRight);
