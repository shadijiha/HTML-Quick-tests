/**
 * 
 * @param {string} code Inserts Shado script code to be converted to JavaScript
 */


function compile(code)  {

    code = code.split(" ");

    let data = {};
    let cmd;

    for (let i = 0; i < code.length; i++)   {
        if (code[i].toLowerCase == "circle")    {
            let radius = code[code.length - 1];
            let x = code[4].split("")[1];
            let y = code[4].split("")[3];
            data.shape = "Circle";
            data.x = x;
            data.y = y;
            data.radius = radius;
            cmd = `new ${data.shape}(${data.x}, ${data.y}, ${data.radius}).draw()`;
        } else  if (code[i].toLowerCase == "rectangle")    {
            let height = code[code.length - 1];
            let width = code[code.length - 5];
            let x = code[4].split("")[1];
            let y = code[4].split("")[3];
            data.shape = "Circle";
            data.x = x;
            data.y = y;
            data.width = width
            data.height = height;
            cmd = `new ${data.shape}(${data.x}, ${data.y}, ${data.width}, ${data.height}).draw()`;
        }  
    }

        console.log(cmd);
    eval(cmd);
}