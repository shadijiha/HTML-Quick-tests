/***
 * 
 *   JavaScript file that handles the Sign in/up actions
 * 
 */
     
     const socket = io();

	// Sign in
	var signDiv = document.getElementById("signDiv");
	var signDivUsername = document.getElementById("signDiv-username");
	var signDivSignIn = document.getElementById("signDiv-signIn");
	var signDivSignUp = document.getElementById("signDiv-signUp");
	var signDivSignPassword = document.getElementById("signDiv-password");
	var gameDiv = document.getElementById("engin");
	var errorDiv = document.getElementById("errorDiv");
	var shadoName = "Guest";

	const signIn = () =>	{
		socket.emit('signIn', {			
			username: document.getElementById("signDiv-username").value,
			password: document.getElementById("signDiv-password").value
		});
		shadoName = document.getElementById("signDiv-username").value;
	}

	function autoSignIn()	{
		document.getElementById("signDiv-username").value = "admin";
		document.getElementById("signDiv-password").value = "admin";
		signIn();
	}
	autoSignIn();

	/*signDivSignUp.onclick = () =>	{
		socket.emit('signUp', {
			username: signDivUsername.value,
			password: signDivSignPassword.value
		});
	}*/
	
	socket.on('signInResponse', data =>	{
		if (data.success)	{
			document.getElementById("engin").style.filter = "blur(0px)";
			document.getElementById("signDiv").style.display = 'none';
			pauseGame();
		} else	{
			document.getElementById("errorDiv").style.display = 'block';
			document.getElementById("errorDiv").textContent = `Error! Operation was not successful because ${data.message}`;
		}
	});

	/*socket.on('signUpResponse', data =>	{
		if (data.success)	{
			signDiv.style.display = 'none';
			gameDiv.style.display = 'block';
		} else	{
			errorDiv.style.display = 'block';
			errorDiv.textContent = `Error! Operation was not successful because ${data.message}`;;
		}
	});*/