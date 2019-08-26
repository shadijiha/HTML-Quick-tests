/***
 * 
 * This JS file parses and formats code
 * 
 */

     window.onload = function()    {
          mapCode(document.getElementById("div4654"));
          formateCode(document.getElementById("div4654"));          
     }
     
     function formateCode(dom)   {

          var codeElements = dom;

          var strReg1 = /"(.*?)"/g,
               strReg2 = /'(.*?)'/g,
               specialReg = /\b(new|if|do|function|while|switch|for|foreach|in|continue|break|return|of|class(?!=))(?=[^\w])/g,
               specialJsGlobReg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g,
               specialJsReg = /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g,
               specialMethReg = /\b(indexOf|match|replace|toString|length)(?=[^\w])/g,
               specialPhpReg  = /\b(define|echo|print_r|var_dump)(?=[^\w])/g,
               specialCommentReg  = /(\/\*.*\*\/)/g,
               inlineCommentReg = /(\/\/.*)/g;

               var htmlTagReg = /(&lt;[^\&]*&gt;)/g;

               var sqlReg = /\b(CREATE|ALL|DATABASE|TABLE|GRANT|PRIVILEGES|IDENTIFIED|FLUSH|SELECT|UPDATE|DELETE|INSERT|FROM|WHERE|ORDER|BY|GROUP|LIMIT|INNER|OUTER|AS|ON|COUNT|CASE|TO|IF|WHEN|BETWEEN|AND|OR)(?=[^\w])/g;

               var string = dom.textContent,
               
               parsed = string.replace(/ /g,'&nbsp;');
               parsed = parsed.replace(/\n/g,'<br />');
               parsed = parsed.replace(/\t|	/g,'&nbsp; &nbsp; &nbsp; &nbsp;');
               parsed = parsed.replace(strReg1,'<span class="string">$&</span>');
               parsed = parsed.replace(strReg2,"<span class=\"string\">$&</span>");
               parsed = parsed.replace(specialReg,'<span class="special">$&</span>');
               parsed = parsed.replace(/\b(var|const|let)\b/g,'<span class="special-variables">$&</span>');
               parsed = parsed.replace(specialJsGlobReg,'<span class="special-js-glob">$&</span>');
               parsed = parsed.replace(specialJsReg,'<span class="special-js">$&</span>');
               parsed = parsed.replace(specialMethReg,'<span class="special-js-meth">$&</span>');
               parsed = parsed.replace(htmlTagReg,'<span class="special-html">$&</span>');
               parsed = parsed.replace(sqlReg,'<span class="special-sql">$&</span>');
               parsed = parsed.replace(specialPhpReg,'<span class="special-php">$&</span>');
               parsed = parsed.replace(specialCommentReg,'<span class="special-comment">$&</span>');
               parsed = parsed.replace(inlineCommentReg,'<span class="special-comment">$&</span>');
               parsed = parsed.replace(/\w+\./g,'<span class="spacial-class">$&</span>');
               parsed = parsed.replace(/\.\w+/g,'<span class="spacial-class-function">$&</span>');
               parsed = parsed.replace(/\w+(?=\((.*)?\))/g,'<span class="spacial-class-function">$&</span>');
               parsed = parsed.replace(/\d+/g,'<span class="special-digits">$&</span>');

               dom.innerHTML = parsed;
     }