/***
 * 
 * This JS file maps all functions and variables in code
 * 
 */
     
     function mapCode(dom)   {

          var code = dom.textContent;

          //code = code.replace(/(?=const|var|let)\b\w+/g, "$'");

          // map function
          var methodes = code.match(/(?<=function\s)\w+/g);
          var variables = code.match(/(?<=(const|var|let)\s\w+(\s\=)|\=).+(?=;)/g);

          console.log(variables);

          dom.textContent = code;


     }