/***
 * 
 *   JavaScript file that handles the Chat
 * 
 */

	var chatText = document.getElementById("chat-text");
	var chatInput = document.getElementById("chat-input");
	var chatForm = document.getElementById("chat-form");
	
	socket.on('addToChat', data =>	{
		chatText.innerHTML += '<div> ' + data + ' </div>';	
          chatText.scrollTop = chatText.scrollHeight;
          parseChat();	
	});
	
	socket.on('debugResponse', data =>	{
		chatText.innerHTML += '<div>' + syntaxHighlight(JSON.stringify(data)) + '</div>';
		console.log(data);
	});
	
	chatForm.onsubmit = function(e)	{
		e.preventDefault();
		
		if (chatInput.value[0] == '/')	{
			socket.emit('debugRequest', chatInput.value.slice(1));	// Debugg chat
		} else	{
			socket.emit('sendMsgToServer', chatInput.value);		// Normal chat
		}
		
		chatInput.value = '';
		
     }
     
     function parseChat()     {

          var allEmotes = ["Kappa", "cmonBruh", "FeelsBadMan", "LULW", "PogU", "forsenCD", "Clap", "Pepega", "POGGERS", "EZ", "TriHard", ":p", ":)", "OMEGALUL", "4Head", "PepeHands", "tyler1Hey"];
          var text = chatText.innerHTML;
          text = text.split(" ");

          for (let i = 0; i < text.length; i++)   {               
               for (let j = 0; j < allEmotes.length; j++)   {
                    if (text[i].toLowerCase() == allEmotes[j].toLowerCase() && text[i] != "Clap")  {
                         text[i] = `<img src="./client/img/emotes/${allEmotes[j]}.png" width="25" height="25">`;
                    } else if (text[i].toLowerCase() == "clap")   {
                         text[i] = `<img src="./client/img/emotes/Clap.gif" width="25" height="25">`;
                    }
               }
          }

          text = text.join(" ");
          chatText.innerHTML = text;

     }