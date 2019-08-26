var keyArray = ["\!","\@","\#","\$","\%","\^","\&"];
var key = "";
var ran2 = round(randomBetweenRange(3, 10), 0);

for (let i = 0; i < ran2; i++)	{
	var ran = Math.floor(randomBetweenRange(0, keyArray.length));
	var addKey = keyArray[ran];
	key = key + addKey;
};

