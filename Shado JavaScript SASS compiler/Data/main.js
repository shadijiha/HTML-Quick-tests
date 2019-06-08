/*** 
 * 
 * Main JavaScript file for "compiler test" project 
 * 
 * 
 */
 
 
	let map = [];
	
	function convert()	{
		let input = document.getElementById("input").value;
		document.getElementById("result").value = process(document.getElementById("input").value);
	}
	
	function process(fileContent)	{
		map = [];
		let result = "";
		
				
		// Maping each declared variable with its proper value
		let temp = fileContent.split("\n");
		
		for (let i = 0; i < temp.length; i++)	{
			let value = temp[i].split("")[0];

			/*if (value == "\n")	{
				value = temp[i].split("")[1];
				let correction = temp[i].split("");
				correction.splice(0, 1);
				correction = correction.join("");
				temp[i] = correction;
				console.log(correction);
			}*/
			
			if ((value == "$" && contains(temp[i], "=")))	{
				let tempArray = temp[i].split(" ");
				let obj = {
					variable: tempArray[0],
					value: tempArray[tempArray.length - 1]
				};
				map.push(obj);
			}
		}
		
		console.log(map);
		
		
		fileContent = fileContent.split("\n");
		for (let j = 0; j < fileContent.length; j++)	{
			// Getting raid of the semi-colon
			if (contains(fileContent[j], ";"))	{
				fileContent[j] = fileContent[j].split("")
				fileContent[j].pop();
				fileContent[j] = fileContent[j].join("");
			}
			
			// Replacing each variable by its value
			for (let k = 0; k < map.length; k++)	{
				fileContent[j] = fileContent[j].split(" ");
				for (let l = 0; l < fileContent[j].length; l++)	{
					if (fileContent[j][l] ==  map[k].variable)	{

						fileContent[j][l] = map[k].value;
					}
				}
				fileContent[j] = fileContent[j].join(" ");
			}
		}
		
		

		
		fileContent = fileContent.join("\n");
		
		// Removing the variables from top of the document
		fileContent = fileContent.split("\n");
		
		for (let i = 0; i < fileContent.length; i++)	{
			if (contains(fileContent[i], "="))	{
				delete fileContent[i];
			} else if (!contains(fileContent[i], ";") && contains(fileContent[i], ":"))	{
				fileContent[i] += ";";
			}
		}
		fileContent = fileContent.join("\n");
		
		return fileContent;
	}
	
	
	
	function contains(string, value)	{
	
		let num = 0;
		string = string.split("");
		
		for (let i = 0; i < string.length; i++)	{
			if (string[i] == value)	{
				num++;
			}
		}
		
		if (num > 0)	{
			return true;
		} else	{
			return false;
		}
	}
	
	function saveTextAsFile(content, name) {
		  var textToWrite = content;
		  var textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' });
		  var fileNameToSaveAs = name;

		  var downloadLink = document.createElement("a");
		  downloadLink.download = fileNameToSaveAs;
		  downloadLink.innerHTML = "Download File";
		  if (window.webkitURL != null) {
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		  } else {
			// Firefox requires the link to be added to the DOM before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		  }

		  downloadLink.click();
	}
	
	function convertToMap(array)	{
		mapFile = "[\n";
		
		for (let i = 0; i < array.length; i++)	{
			mapFile += "	{\n";
			mapFile += `		"VAR"	:	"${array[i].variable}",\n`;
			mapFile += `		"VAL"	:	"${array[i].value}"\n`;
			if (i == array.length - 1)	{
				mapFile += "	}\n";
			} else	{
				mapFile += "	},\n";
			}
		}
		
		mapFile += "]";
		
		return mapFile;
	}
	
	function downloadMapFile()	{
		saveTextAsFile(convertToMap(map), "styles.shadomap");
	}